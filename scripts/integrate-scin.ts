#!/usr/bin/env tsx
/**
 * SCIN Dataset Integration Script
 *
 * Usage: npx tsx scripts/integrate-scin.ts
 *
 * Reads the REAL SCIN CSV files (scin_cases.csv + scin_labels.csv), joins them
 * on case_id, filters to gradable cases with high-confidence labels, maps
 * condition labels to our internal taxonomy, and writes three output files:
 *
 *   src/data/generated/scin-images.json       — ImageAsset-compatible objects
 *   src/data/generated/scin-annotations.json   — ImageAnnotation objects
 *   src/data/generated/scin-stats.json         — Summary statistics
 *
 * Images are referenced as remote GCS URLs (storageMode: "remote_url").
 * No external dependencies — inline CSV parser handles quoted fields.
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GCS_BASE = "https://storage.googleapis.com/dx-scin-public-data/";
const DATASET_SOURCE_ID = "scin-google-research";
const LICENSE_RECORD_ID = "lic-scin-cc-by-4.0";

// ---------------------------------------------------------------------------
// Inline CSV parser (handles quoted fields with embedded commas)
// ---------------------------------------------------------------------------

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j].trim()] = (values[j] ?? "").trim();
    }
    rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Python-style list/dict parsers
// ---------------------------------------------------------------------------

/**
 * Parse a Python-style list string like "['Eczema', 'Psoriasis']"
 * Returns an array of strings. Returns [] for empty/invalid input.
 */
function parsePythonList(raw: string): string[] {
  if (!raw || raw === "[]") return [];
  // Extract all single-quoted strings
  const matches = raw.match(/'([^']*)'/g);
  if (!matches) return [];
  return matches.map((m) => m.slice(1, -1).trim()).filter(Boolean);
}

/**
 * Parse a Python-style int list string like "[4, 3, 2]"
 * Returns an array of numbers. Returns [] for empty/invalid input.
 */
function parsePythonIntList(raw: string): number[] {
  if (!raw || raw === "[]") return [];
  const inner = raw.replace(/^\[/, "").replace(/\]$/, "").trim();
  if (!inner) return [];
  return inner.split(",").map((s) => {
    const n = parseInt(s.trim(), 10);
    return isNaN(n) ? 0 : n;
  });
}

/**
 * Parse a Python-style dict string like "{'Eczema': 0.5, 'Psoriasis': 0.3}"
 * Returns a Record<string, number>. Returns {} for empty/invalid input.
 */
function parsePythonDict(raw: string): Record<string, number> {
  if (!raw || raw === "{}") return {};
  const result: Record<string, number> = {};
  // Match 'key': value pairs
  const regex = /'([^']+)'\s*:\s*([\d.]+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(raw)) !== null) {
    result[match[1].trim()] = parseFloat(match[2]);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Deterministic UUID generation
// ---------------------------------------------------------------------------

function deterministicUuid(prefix: string, externalId: string): string {
  let hash = 0;
  const str = `${prefix}:${externalId}`;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  const suffix = externalId
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 12)
    .padEnd(12, "0");
  return `${prefix}-${hex}-4000-8000-${suffix}`;
}

// ---------------------------------------------------------------------------
// Condition taxonomy mapping: SCIN label -> our internal category
//
// Categories (from ConditionCategorySchema):
//   morphology, benign_lesion, skin_cancer, infection, drug_eruption,
//   acne_rosacea, eczematous, papulosquamous, autoimmune, ulcer_wound,
//   burn, genodermatosis, pediatric, hair_nails, premalignant
// ---------------------------------------------------------------------------

interface TaxonomyEntry {
  category: string;
  normalizedLabel: string;
  conditionId?: string;
}

const SCIN_TAXONOMY: Record<string, TaxonomyEntry> = {
  // --- Eczematous ---
  "eczema": { category: "eczematous", normalizedLabel: "eczema" },
  "allergic contact dermatitis": { category: "eczematous", normalizedLabel: "allergic_contact_dermatitis" },
  "irritant contact dermatitis": { category: "eczematous", normalizedLabel: "irritant_contact_dermatitis" },
  "cd - contact dermatitis": { category: "eczematous", normalizedLabel: "contact_dermatitis" },
  "contact dermatitis, nos": { category: "eczematous", normalizedLabel: "contact_dermatitis" },
  "contact dermatitis caused by rhus diversiloba": { category: "eczematous", normalizedLabel: "contact_dermatitis" },
  "stasis dermatitis": { category: "eczematous", normalizedLabel: "stasis_dermatitis" },
  "acute dermatitis, nos": { category: "eczematous", normalizedLabel: "acute_dermatitis" },
  "chronic dermatitis, nos": { category: "eczematous", normalizedLabel: "chronic_dermatitis" },
  "acute and chronic dermatitis": { category: "eczematous", normalizedLabel: "acute_chronic_dermatitis" },
  "seborrheic dermatitis": { category: "eczematous", normalizedLabel: "seborrheic_dermatitis" },
  "perioral dermatitis": { category: "eczematous", normalizedLabel: "perioral_dermatitis" },
  "dermatitis herpetiformis": { category: "eczematous", normalizedLabel: "dermatitis_herpetiformis" },
  "lichen simplex chronicus": { category: "eczematous", normalizedLabel: "lichen_simplex_chronicus" },
  "xerosis": { category: "eczematous", normalizedLabel: "xerosis" },
  "infected eczema": { category: "eczematous", normalizedLabel: "infected_eczema" },
  "lichenified eczematous dermatitis": { category: "eczematous", normalizedLabel: "lichenified_eczema" },
  "photodermatitis": { category: "eczematous", normalizedLabel: "photodermatitis" },
  "prurigo nodularis": { category: "eczematous", normalizedLabel: "prurigo_nodularis" },
  "prurigo": { category: "eczematous", normalizedLabel: "prurigo" },
  "intertrigo": { category: "eczematous", normalizedLabel: "intertrigo" },
  "miliaria": { category: "eczematous", normalizedLabel: "miliaria" },
  "pityriasis alba": { category: "eczematous", normalizedLabel: "pityriasis_alba" },
  "atopic dermatitis": { category: "eczematous", normalizedLabel: "atopic_dermatitis" },

  // --- Papulosquamous ---
  "psoriasis": { category: "papulosquamous", normalizedLabel: "psoriasis" },
  "psoriasiform dermatitis": { category: "papulosquamous", normalizedLabel: "psoriasiform_dermatitis" },
  "lichen planus/lichenoid eruption": { category: "papulosquamous", normalizedLabel: "lichen_planus" },
  "lichen nitidus": { category: "papulosquamous", normalizedLabel: "lichen_nitidus" },
  "lichen spinulosus": { category: "papulosquamous", normalizedLabel: "lichen_spinulosus" },
  "lichen striatus": { category: "papulosquamous", normalizedLabel: "lichen_striatus" },
  "pityriasis rosea": { category: "papulosquamous", normalizedLabel: "pityriasis_rosea" },
  "pityriasis lichenoides": { category: "papulosquamous", normalizedLabel: "pityriasis_lichenoides" },
  "pityriasis rubra pilaris": { category: "papulosquamous", normalizedLabel: "pityriasis_rubra_pilaris" },
  "parapsoriasis": { category: "papulosquamous", normalizedLabel: "parapsoriasis" },
  "keratosis pilaris": { category: "papulosquamous", normalizedLabel: "keratosis_pilaris" },
  "granuloma annulare": { category: "papulosquamous", normalizedLabel: "granuloma_annulare" },
  "erythema multiforme": { category: "papulosquamous", normalizedLabel: "erythema_multiforme" },
  "erythema annulare centrifugum": { category: "papulosquamous", normalizedLabel: "erythema_annulare_centrifugum" },
  "erythema ab igne": { category: "papulosquamous", normalizedLabel: "erythema_ab_igne" },
  "erythema migrans": { category: "papulosquamous", normalizedLabel: "erythema_migrans" },
  "erythema nodosum": { category: "papulosquamous", normalizedLabel: "erythema_nodosum" },
  "erythema gyratum repens": { category: "papulosquamous", normalizedLabel: "erythema_gyratum_repens" },
  "annular erythema": { category: "papulosquamous", normalizedLabel: "annular_erythema" },
  "porokeratosis": { category: "papulosquamous", normalizedLabel: "porokeratosis" },
  "confluent and reticulate papillomatosis": { category: "papulosquamous", normalizedLabel: "confluent_reticulate_papillomatosis" },

  // --- Infection ---
  "tinea": { category: "infection", normalizedLabel: "tinea" },
  "tinea versicolor": { category: "infection", normalizedLabel: "tinea_versicolor" },
  "herpes zoster": { category: "infection", normalizedLabel: "herpes_zoster" },
  "herpes simplex": { category: "infection", normalizedLabel: "herpes_simplex" },
  "impetigo": { category: "infection", normalizedLabel: "impetigo" },
  "folliculitis": { category: "infection", normalizedLabel: "folliculitis" },
  "cellulitis": { category: "infection", normalizedLabel: "cellulitis" },
  "abscess": { category: "infection", normalizedLabel: "abscess" },
  "scabies": { category: "infection", normalizedLabel: "scabies" },
  "molluscum contagiosum": { category: "infection", normalizedLabel: "molluscum_contagiosum" },
  "verruca vulgaris": { category: "infection", normalizedLabel: "verruca_vulgaris" },
  "syphilis": { category: "infection", normalizedLabel: "syphilis" },
  "skin and soft tissue atypical mycobacterial infection": { category: "infection", normalizedLabel: "atypical_mycobacterial_infection" },
  "deep fungal infection": { category: "infection", normalizedLabel: "deep_fungal_infection" },
  "skin infection": { category: "infection", normalizedLabel: "skin_infection" },
  "candida intertrigo": { category: "infection", normalizedLabel: "candida_intertrigo" },
  "candidal intertrigo": { category: "infection", normalizedLabel: "candida_intertrigo" },
  "candida": { category: "infection", normalizedLabel: "candida" },
  "onychomycosis": { category: "infection", normalizedLabel: "onychomycosis" },
  "ecthyma": { category: "infection", normalizedLabel: "ecthyma" },
  "localized skin infection": { category: "infection", normalizedLabel: "localized_skin_infection" },
  "cutaneous larva migrans": { category: "infection", normalizedLabel: "cutaneous_larva_migrans" },
  "cutaneous leishmaniasis": { category: "infection", normalizedLabel: "cutaneous_leishmaniasis" },
  "cutaneous lyme disease": { category: "infection", normalizedLabel: "cutaneous_lyme_disease" },
  "rmsf - rocky mountain spotted fever": { category: "infection", normalizedLabel: "rocky_mountain_spotted_fever" },
  "hand foot and mouth disease": { category: "infection", normalizedLabel: "hand_foot_mouth_disease" },
  "condyloma acuminatum": { category: "infection", normalizedLabel: "condyloma_acuminatum" },
  "hidradenitis": { category: "infection", normalizedLabel: "hidradenitis" },
  "paronychia": { category: "infection", normalizedLabel: "paronychia" },
  "mycetoma": { category: "infection", normalizedLabel: "mycetoma" },
  "tuberculosis of skin and subcutaneous tissue": { category: "infection", normalizedLabel: "cutaneous_tuberculosis" },
  "chicken pox exanthem": { category: "infection", normalizedLabel: "varicella" },
  "fungal dermatosis": { category: "infection", normalizedLabel: "fungal_dermatosis" },
  "fungal dermatitis": { category: "infection", normalizedLabel: "fungal_dermatitis" },

  // --- Skin cancer ---
  "scc/sccis": { category: "skin_cancer", normalizedLabel: "squamous_cell_carcinoma" },
  "basal cell carcinoma": { category: "skin_cancer", normalizedLabel: "basal_cell_carcinoma" },
  "melanoma": { category: "skin_cancer", normalizedLabel: "melanoma" },
  "skin cancer": { category: "skin_cancer", normalizedLabel: "skin_cancer_nos" },
  "cutaneous t cell lymphoma": { category: "skin_cancer", normalizedLabel: "cutaneous_t_cell_lymphoma" },
  "primary cutaneous lymphoma": { category: "skin_cancer", normalizedLabel: "primary_cutaneous_lymphoma" },
  "b-cell cutaneous lymphoma": { category: "skin_cancer", normalizedLabel: "b_cell_cutaneous_lymphoma" },
  "lymphomatoid papulosis": { category: "skin_cancer", normalizedLabel: "lymphomatoid_papulosis" },
  "cutaneous metastasis": { category: "skin_cancer", normalizedLabel: "cutaneous_metastasis" },

  // --- Premalignant ---
  "actinic keratosis": { category: "premalignant", normalizedLabel: "actinic_keratosis" },
  "sk/isk": { category: "benign_lesion", normalizedLabel: "seborrheic_keratosis" },

  // --- Benign lesion ---
  "melanocytic nevus": { category: "benign_lesion", normalizedLabel: "melanocytic_nevus" },
  "atypical nevus": { category: "benign_lesion", normalizedLabel: "atypical_nevus" },
  "epidermal nevus": { category: "benign_lesion", normalizedLabel: "epidermal_nevus" },
  "seborrheic keratosis": { category: "benign_lesion", normalizedLabel: "seborrheic_keratosis" },
  "cyst": { category: "benign_lesion", normalizedLabel: "cyst" },
  "dermatofibroma": { category: "benign_lesion", normalizedLabel: "dermatofibroma" },
  "hemangioma": { category: "benign_lesion", normalizedLabel: "hemangioma" },
  "lymphangioma": { category: "benign_lesion", normalizedLabel: "lymphangioma" },
  "pyogenic granuloma": { category: "benign_lesion", normalizedLabel: "pyogenic_granuloma" },
  "milia": { category: "benign_lesion", normalizedLabel: "milia" },
  "lentigo": { category: "benign_lesion", normalizedLabel: "lentigo" },
  "angiokeratoma of skin": { category: "benign_lesion", normalizedLabel: "angiokeratoma" },
  "benign cutaneous vascular tumor": { category: "benign_lesion", normalizedLabel: "benign_vascular_tumor" },
  "adnexal neoplasm": { category: "benign_lesion", normalizedLabel: "adnexal_neoplasm" },
  "keratosis": { category: "benign_lesion", normalizedLabel: "keratosis" },
  "pseudolymphoma": { category: "benign_lesion", normalizedLabel: "pseudolymphoma" },
  "scar condition": { category: "benign_lesion", normalizedLabel: "scar" },
  "calcinosis cutis": { category: "benign_lesion", normalizedLabel: "calcinosis_cutis" },
  "comedone": { category: "benign_lesion", normalizedLabel: "comedone" },
  "clavus": { category: "benign_lesion", normalizedLabel: "clavus" },

  // --- Acne / rosacea ---
  "acne": { category: "acne_rosacea", normalizedLabel: "acne" },
  "acne vulgaris": { category: "acne_rosacea", normalizedLabel: "acne_vulgaris" },
  "rosacea": { category: "acne_rosacea", normalizedLabel: "rosacea" },
  "acne keloidalis": { category: "acne_rosacea", normalizedLabel: "acne_keloidalis" },

  // --- Drug eruption ---
  "drug rash": { category: "drug_eruption", normalizedLabel: "drug_rash" },
  "drug induced abnormal pigmentation of skin": { category: "drug_eruption", normalizedLabel: "drug_induced_pigmentation" },
  "acute generalised exanthematous pustulosis": { category: "drug_eruption", normalizedLabel: "agep" },
  "flagellate erythema": { category: "drug_eruption", normalizedLabel: "flagellate_erythema" },

  // --- Autoimmune / inflammatory ---
  "cutaneous lupus": { category: "autoimmune", normalizedLabel: "cutaneous_lupus" },
  "sle - systemic lupus erythematosus-related syndrome": { category: "autoimmune", normalizedLabel: "sle" },
  "dermatomyositis": { category: "autoimmune", normalizedLabel: "dermatomyositis" },
  "morphea/scleroderma": { category: "autoimmune", normalizedLabel: "morphea_scleroderma" },
  "cutaneous sarcoidosis": { category: "autoimmune", normalizedLabel: "cutaneous_sarcoidosis" },
  "bullous pemphigoid": { category: "autoimmune", normalizedLabel: "bullous_pemphigoid" },
  "pemphigus vulgaris": { category: "autoimmune", normalizedLabel: "pemphigus_vulgaris" },
  "pemphigus foliaceus": { category: "autoimmune", normalizedLabel: "pemphigus_foliaceus" },
  "pemphigoid gestationis": { category: "autoimmune", normalizedLabel: "pemphigoid_gestationis" },
  "linear iga disease": { category: "autoimmune", normalizedLabel: "linear_iga_disease" },
  "lichen sclerosus": { category: "autoimmune", normalizedLabel: "lichen_sclerosus" },
  "vitiligo": { category: "autoimmune", normalizedLabel: "vitiligo" },
  "sweet syndrome": { category: "autoimmune", normalizedLabel: "sweet_syndrome" },
  "pyoderma gangrenosum": { category: "autoimmune", normalizedLabel: "pyoderma_gangrenosum" },
  "necrobiosis lipoidica": { category: "autoimmune", normalizedLabel: "necrobiosis_lipoidica" },
  "granuloma faciale": { category: "autoimmune", normalizedLabel: "granuloma_faciale" },
  "amyloidosis of skin": { category: "autoimmune", normalizedLabel: "cutaneous_amyloidosis" },
  "pretibial myxedema": { category: "autoimmune", normalizedLabel: "pretibial_myxedema" },
  "lichenoid myxedema": { category: "autoimmune", normalizedLabel: "lichenoid_myxedema" },
  "livedoid vasculopathy": { category: "autoimmune", normalizedLabel: "livedoid_vasculopathy" },

  // --- Vascular ---
  "urticaria": { category: "eczematous", normalizedLabel: "urticaria" },
  "hypersensitivity": { category: "eczematous", normalizedLabel: "hypersensitivity" },
  "leukocytoclastic vasculitis": { category: "autoimmune", normalizedLabel: "leukocytoclastic_vasculitis" },
  "vasculitis of the skin": { category: "autoimmune", normalizedLabel: "cutaneous_vasculitis" },
  "localized cutaneous vasculitis": { category: "autoimmune", normalizedLabel: "localized_cutaneous_vasculitis" },
  "purpura": { category: "autoimmune", normalizedLabel: "purpura" },
  "pigmented purpuric eruption": { category: "autoimmune", normalizedLabel: "pigmented_purpuric_eruption" },
  "livedo reticularis": { category: "autoimmune", normalizedLabel: "livedo_reticularis" },
  "chilblain": { category: "autoimmune", normalizedLabel: "chilblain" },

  // --- Pigmentary ---
  "post-inflammatory hyperpigmentation": { category: "benign_lesion", normalizedLabel: "post_inflammatory_hyperpigmentation" },
  "post-inflammatory hypopigmentation": { category: "benign_lesion", normalizedLabel: "post_inflammatory_hypopigmentation" },
  "melasma": { category: "benign_lesion", normalizedLabel: "melasma" },
  "acanthosis nigricans": { category: "benign_lesion", normalizedLabel: "acanthosis_nigricans" },
  "erythema dyschromicum perstans": { category: "benign_lesion", normalizedLabel: "erythema_dyschromicum_perstans" },
  "idiopathic guttate hypomelanosis": { category: "benign_lesion", normalizedLabel: "idiopathic_guttate_hypomelanosis" },

  // --- Ulcer / wound ---
  "venous stasis ulcer": { category: "ulcer_wound", normalizedLabel: "venous_stasis_ulcer" },
  "foot ulcer": { category: "ulcer_wound", normalizedLabel: "foot_ulcer" },
  "skin ulcer": { category: "ulcer_wound", normalizedLabel: "skin_ulcer" },
  "superficial wound of body region": { category: "ulcer_wound", normalizedLabel: "superficial_wound" },
  "abrasion, scrape, or scab": { category: "ulcer_wound", normalizedLabel: "abrasion" },
  "abrasion of wrist": { category: "ulcer_wound", normalizedLabel: "abrasion" },

  // --- Burns ---
  "burn of skin": { category: "burn", normalizedLabel: "burn" },
  "sunburn": { category: "burn", normalizedLabel: "sunburn" },
  "burn erythema of back of hand": { category: "burn", normalizedLabel: "burn_erythema" },
  "burn erythema of lower leg": { category: "burn", normalizedLabel: "burn_erythema" },
  "phytophotodermatitis": { category: "burn", normalizedLabel: "phytophotodermatitis" },

  // --- Genodermatosis ---
  "ichthyosis": { category: "genodermatosis", normalizedLabel: "ichthyosis" },
  "keratoderma": { category: "genodermatosis", normalizedLabel: "keratoderma" },
  "hk - hyperkeratosis": { category: "genodermatosis", normalizedLabel: "hyperkeratosis" },
  "akv - acrokeratosis verruciformis": { category: "genodermatosis", normalizedLabel: "acrokeratosis_verruciformis" },

  // --- Hair / nails ---
  "nail dystrophy": { category: "hair_nails", normalizedLabel: "nail_dystrophy" },
  "nail dystrophy due to trauma": { category: "hair_nails", normalizedLabel: "nail_dystrophy_trauma" },
  "onychodystrophy": { category: "hair_nails", normalizedLabel: "onychodystrophy" },
  "pincer nail deformity": { category: "hair_nails", normalizedLabel: "pincer_nail" },
  "geographic tongue": { category: "benign_lesion", normalizedLabel: "geographic_tongue" },

  // --- Insect / external ---
  "insect bite": { category: "eczematous", normalizedLabel: "insect_bite" },
  "animal bite - wound": { category: "ulcer_wound", normalizedLabel: "animal_bite" },
  "foreign body reaction of the skin": { category: "eczematous", normalizedLabel: "foreign_body_reaction" },
  "dermatosis due to flea": { category: "eczematous", normalizedLabel: "flea_dermatosis" },

  // --- Viral exanthem ---
  "viral exanthem": { category: "infection", normalizedLabel: "viral_exanthem" },

  // --- Pregnancy ---
  "pruritic urticarial papules and plaques of pregnancy": { category: "eczematous", normalizedLabel: "puppp" },

  // --- Misc clinical observations (not real diagnoses) ---
  "o/e - ecchymoses present": { category: "morphology", normalizedLabel: "ecchymoses" },
  "o/e - petechiae on skin": { category: "morphology", normalizedLabel: "petechiae" },
  "o/e - petechiae present": { category: "morphology", normalizedLabel: "petechiae" },
  "o/e - pustules": { category: "morphology", normalizedLabel: "pustules" },
  "traumatic petechiae": { category: "morphology", normalizedLabel: "traumatic_petechiae" },
  "contact purpura": { category: "morphology", normalizedLabel: "contact_purpura" },
  "blister": { category: "morphology", normalizedLabel: "blister" },
  "traumatic blister": { category: "morphology", normalizedLabel: "traumatic_blister" },
  "bullous dermatitis": { category: "eczematous", normalizedLabel: "bullous_dermatitis" },
  "bullous dermatitis, nos": { category: "eczematous", normalizedLabel: "bullous_dermatitis" },
  "hematoma of skin": { category: "morphology", normalizedLabel: "hematoma" },
  "hemosiderin pigmentation of skin due to venous insufficiency": { category: "morphology", normalizedLabel: "hemosiderin_pigmentation" },
  "inflammatory dermatosis": { category: "eczematous", normalizedLabel: "inflammatory_dermatosis" },
  "koebner phenomenon": { category: "morphology", normalizedLabel: "koebner_phenomenon" },
  "inflicted skin lesions": { category: "ulcer_wound", normalizedLabel: "inflicted_skin_lesions" },
  "skin lesion in drug addict": { category: "ulcer_wound", normalizedLabel: "skin_lesion_drug_addict" },
  "actinic granuloma": { category: "benign_lesion", normalizedLabel: "actinic_granuloma" },
  "granulomatous disorder of the skin and subcutaneous tissue": { category: "autoimmune", normalizedLabel: "granulomatous_disorder" },
  "perforating dermatosis": { category: "eczematous", normalizedLabel: "perforating_dermatosis" },
  "fox-fordyce disease": { category: "eczematous", normalizedLabel: "fox_fordyce_disease" },
};

// ---------------------------------------------------------------------------
// Body site extraction from boolean columns
// ---------------------------------------------------------------------------

const BODY_PART_COLUMNS: Record<string, string> = {
  body_parts_head_or_neck: "head_neck",
  body_parts_arm: "upper_extremity",
  body_parts_palm: "hand",
  body_parts_back_of_hand: "hand",
  body_parts_torso_front: "trunk",
  body_parts_torso_back: "trunk",
  body_parts_genitalia_or_groin: "genitalia_groin",
  body_parts_buttocks: "buttocks",
  body_parts_leg: "lower_extremity",
  body_parts_foot_top_or_side: "foot",
  body_parts_foot_sole: "foot",
  body_parts_other: "other",
};

function extractBodySites(row: Record<string, string>): string[] {
  const sites = new Set<string>();
  for (const [col, normalizedSite] of Object.entries(BODY_PART_COLUMNS)) {
    if (row[col] === "YES" || row[col] === "1" || row[col] === "True") {
      sites.add(normalizedSite);
    }
  }
  return Array.from(sites);
}

// ---------------------------------------------------------------------------
// Texture extraction from boolean columns
// ---------------------------------------------------------------------------

const TEXTURE_COLUMNS: Record<string, string> = {
  textures_raised_or_bumpy: "raised_bumpy",
  textures_flat: "flat",
  textures_rough_or_flaky: "rough_flaky",
  textures_fluid_filled: "fluid_filled",
};

function extractTextures(row: Record<string, string>): string[] {
  const textures: string[] = [];
  for (const [col, label] of Object.entries(TEXTURE_COLUMNS)) {
    if (row[col] === "YES" || row[col] === "1" || row[col] === "True") {
      textures.push(label);
    }
  }
  return textures;
}

// ---------------------------------------------------------------------------
// Symptom extraction from boolean columns
// ---------------------------------------------------------------------------

const CONDITION_SYMPTOM_COLUMNS: Record<string, string> = {
  condition_symptoms_bothersome_appearance: "bothersome_appearance",
  condition_symptoms_bleeding: "bleeding",
  condition_symptoms_increasing_size: "increasing_size",
  condition_symptoms_darkening: "darkening",
  condition_symptoms_itching: "itching",
  condition_symptoms_burning: "burning",
  condition_symptoms_pain: "pain",
};

const OTHER_SYMPTOM_COLUMNS: Record<string, string> = {
  other_symptoms_fever: "fever",
  other_symptoms_chills: "chills",
  other_symptoms_fatigue: "fatigue",
  other_symptoms_joint_pain: "joint_pain",
  other_symptoms_mouth_sores: "mouth_sores",
  other_symptoms_shortness_of_breath: "shortness_of_breath",
};

function extractSymptoms(row: Record<string, string>): string[] {
  const symptoms: string[] = [];
  for (const [col, label] of Object.entries(CONDITION_SYMPTOM_COLUMNS)) {
    if (row[col] === "YES" || row[col] === "1" || row[col] === "True") {
      symptoms.push(label);
    }
  }
  for (const [col, label] of Object.entries(OTHER_SYMPTOM_COLUMNS)) {
    if (row[col] === "YES" || row[col] === "1" || row[col] === "True") {
      symptoms.push(label);
    }
  }
  return symptoms;
}

// ---------------------------------------------------------------------------
// Skin tone normalization
// ---------------------------------------------------------------------------

type SkinToneLabel =
  | "fitzpatrick_1" | "fitzpatrick_2" | "fitzpatrick_3"
  | "fitzpatrick_4" | "fitzpatrick_5" | "fitzpatrick_6"
  | "monk_1" | "monk_2" | "monk_3" | "monk_4" | "monk_5"
  | "monk_6" | "monk_7" | "monk_8" | "monk_9" | "monk_10"
  | "unknown";

function normalizeFitzpatrickFromLabel(fstLabel: string): SkinToneLabel | undefined {
  const match = fstLabel.match(/FST(\d)/);
  if (match) {
    const n = parseInt(match[1], 10);
    if (n >= 1 && n <= 6) return `fitzpatrick_${n}` as SkinToneLabel;
  }
  return undefined;
}

function normalizeFitzpatrickFromSelfReport(raw: string): SkinToneLabel | undefined {
  const match = raw.match(/FST(\d)/);
  if (match) {
    const n = parseInt(match[1], 10);
    if (n >= 1 && n <= 6) return `fitzpatrick_${n}` as SkinToneLabel;
  }
  return undefined;
}

function normalizeMonkTone(raw: string): SkinToneLabel | undefined {
  const n = parseInt(raw, 10);
  if (!isNaN(n) && n >= 1 && n <= 10) return `monk_${n}` as SkinToneLabel;
  return undefined;
}

// ---------------------------------------------------------------------------
// Age group normalization
// ---------------------------------------------------------------------------

function normalizeAgeGroup(raw: string): string | undefined {
  const map: Record<string, string> = {
    AGE_18_TO_29: "18-29",
    AGE_30_TO_39: "30-39",
    AGE_40_TO_49: "40-49",
    AGE_50_TO_59: "50-59",
    AGE_60_TO_69: "60-69",
    AGE_70_TO_79: "70-79",
    AGE_80_OR_ABOVE: "80+",
    AGE_UNKNOWN: "unknown",
  };
  return map[raw] ?? undefined;
}

// ---------------------------------------------------------------------------
// Sex normalization
// ---------------------------------------------------------------------------

function normalizeSex(raw: string): string | undefined {
  const map: Record<string, string> = {
    MALE: "male",
    FEMALE: "female",
    OTHER_OR_UNSPECIFIED: "unknown",
    INTERSEX: "intersex",
    PREFER_NOT_TO_SAY: "unknown",
  };
  return map[raw] ?? undefined;
}

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

function log(msg: string): void {
  console.log(msg);
}

// ---------------------------------------------------------------------------
// Main integration function
// ---------------------------------------------------------------------------

function main(): void {
  const projectRoot = path.resolve(__dirname, "..");
  const casesPath = path.join(projectRoot, "data/datasets/scin/scin_cases.csv");
  const labelsPath = path.join(projectRoot, "data/datasets/scin/scin_labels.csv");
  const outputDir = path.join(projectRoot, "src/data/generated");

  log("=== SCIN Dataset Integration ===");
  log("");

  // Validate inputs
  if (!fs.existsSync(casesPath)) {
    console.error(`ERROR: Cases CSV not found: ${casesPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(labelsPath)) {
    console.error(`ERROR: Labels CSV not found: ${labelsPath}`);
    process.exit(1);
  }

  // Parse CSVs
  log("Reading scin_cases.csv...");
  const casesRaw = fs.readFileSync(casesPath, "utf-8");
  const casesRows = parseCsv(casesRaw);
  log(`  Parsed ${casesRows.length} case rows`);

  log("Reading scin_labels.csv...");
  const labelsRaw = fs.readFileSync(labelsPath, "utf-8");
  const labelsRows = parseCsv(labelsRaw);
  log(`  Parsed ${labelsRows.length} label rows`);

  // Index labels by case_id
  const labelsMap = new Map<string, Record<string, string>>();
  for (const row of labelsRows) {
    labelsMap.set(row.case_id, row);
  }

  // Join cases with labels
  log("");
  log("Joining cases with labels...");
  let joinedCount = 0;
  let missingLabels = 0;

  interface JoinedCase {
    caseRow: Record<string, string>;
    labelRow: Record<string, string>;
  }

  const joined: JoinedCase[] = [];
  for (const caseRow of casesRows) {
    const labelRow = labelsMap.get(caseRow.case_id);
    if (labelRow) {
      joined.push({ caseRow, labelRow });
      joinedCount++;
    } else {
      missingLabels++;
    }
  }
  log(`  Joined: ${joinedCount} | Missing labels: ${missingLabels}`);

  // Filter to qualifying cases
  log("");
  log("Filtering to qualifying cases...");

  interface QualifiedCase {
    caseRow: Record<string, string>;
    labelRow: Record<string, string>;
    conditionNames: string[];
    confidences: number[];
    weightedLabels: Record<string, number>;
    primaryDiagnosis: string;
    primaryWeight: number;
    imagePaths: string[];
  }

  const qualified: QualifiedCase[] = [];
  let filteredNoGradable = 0;
  let filteredNoImage = 0;
  let filteredNoConfidentLabel = 0;

  for (const { caseRow, labelRow } of joined) {
    // Check gradable: at least one dermatologist said yes
    const grad1 = labelRow.dermatologist_gradable_for_skin_condition_1 ?? "";
    const grad2 = labelRow.dermatologist_gradable_for_skin_condition_2 ?? "";
    const grad3 = labelRow.dermatologist_gradable_for_skin_condition_3 ?? "";
    const isGradable =
      grad1.includes("YES") || grad2.includes("YES") || grad3.includes("YES");
    if (!isGradable) {
      filteredNoGradable++;
      continue;
    }

    // Check at least one image
    const imagePaths: string[] = [];
    for (const col of ["image_1_path", "image_2_path", "image_3_path"]) {
      const p = caseRow[col]?.trim();
      if (p) imagePaths.push(p);
    }
    if (imagePaths.length === 0) {
      filteredNoImage++;
      continue;
    }

    // Parse condition labels and confidences
    const conditionNames = parsePythonList(
      labelRow.dermatologist_skin_condition_on_label_name ?? ""
    );
    const confidences = parsePythonIntList(
      labelRow.dermatologist_skin_condition_confidence ?? ""
    );
    const weightedLabels = parsePythonDict(
      labelRow.weighted_skin_condition_label ?? ""
    );

    // Check at least one label with confidence >= 3
    const hasConfidentLabel = confidences.some((c) => c >= 3);
    if (!hasConfidentLabel) {
      filteredNoConfidentLabel++;
      continue;
    }

    // Determine primary diagnosis (highest weighted label)
    let primaryDiagnosis = "";
    let primaryWeight = 0;
    for (const [label, weight] of Object.entries(weightedLabels)) {
      if (weight > primaryWeight) {
        primaryWeight = weight;
        primaryDiagnosis = label;
      }
    }

    // Fallback: if weighted is empty but conditions exist, use first with highest confidence
    if (!primaryDiagnosis && conditionNames.length > 0) {
      let bestIdx = 0;
      let bestConf = confidences[0] ?? 0;
      for (let i = 1; i < conditionNames.length; i++) {
        if ((confidences[i] ?? 0) > bestConf) {
          bestConf = confidences[i];
          bestIdx = i;
        }
      }
      primaryDiagnosis = conditionNames[bestIdx];
      primaryWeight = bestConf / 5;
    }

    if (!primaryDiagnosis) {
      filteredNoConfidentLabel++;
      continue;
    }

    qualified.push({
      caseRow,
      labelRow,
      conditionNames,
      confidences,
      weightedLabels,
      primaryDiagnosis,
      primaryWeight,
      imagePaths,
    });
  }

  log(`  Qualified cases: ${qualified.length}`);
  log(`  Filtered out:`);
  log(`    Not gradable: ${filteredNoGradable}`);
  log(`    No images: ${filteredNoImage}`);
  log(`    No confident label: ${filteredNoConfidentLabel}`);

  // Process qualified cases into output records
  log("");
  log("Generating image assets and annotations...");

  const now = new Date().toISOString();

  interface OutputImageAsset {
    id: string;
    datasetSourceId: string;
    externalCaseId: string;
    externalImageId: string;
    filename: string;
    altText: string;
    diagnosisOriginal: string;
    diagnosisNormalized: string;
    conditionId?: string;
    category: string;
    modality: "clinical_photo";
    bodySite?: string;
    bodySiteOriginal?: string;
    skinToneLabel?: SkinToneLabel;
    skinToneSource?: string;
    pathologyProofLevel: "expert_consensus";
    storageMode: "remote_url";
    storagePath: string;
    externalUrl: string;
    ageGroup?: string;
    sex?: string;
    metadataJson: Record<string, unknown>;
    isGradable: boolean;
    isActive: boolean;
    licenseRecordId: string;
    createdAt: string;
    updatedAt: string;
  }

  interface OutputAnnotation {
    id: string;
    imageAssetId: string;
    conceptType: string;
    conceptValue: string;
    confidence: number;
    provenance: "dataset_native";
    evidenceNote?: string;
    createdBy: string;
    reviewStatus: "accepted";
    sourceDatasetField?: string;
    createdAt: string;
    updatedAt: string;
  }

  const images: OutputImageAsset[] = [];
  const annotations: OutputAnnotation[] = [];

  // Stats tracking
  const statsByCategory = new Map<string, number>();
  const statsBySkinTone = new Map<string, number>();
  const statsByBodySite = new Map<string, number>();
  const statsByMonkTone = new Map<string, number>();
  const unmappedLabels = new Map<string, number>();
  let totalImages = 0;

  for (const q of qualified) {
    const { caseRow, labelRow, primaryDiagnosis, primaryWeight, imagePaths, weightedLabels } = q;
    const caseId = caseRow.case_id;

    // Map primary diagnosis to taxonomy
    const taxEntry = SCIN_TAXONOMY[primaryDiagnosis.toLowerCase()];
    const category = taxEntry?.category ?? "eczematous"; // fallback
    const normalizedLabel = taxEntry?.normalizedLabel ?? primaryDiagnosis.toLowerCase().replace(/[\s/]+/g, "_");

    if (!taxEntry) {
      unmappedLabels.set(primaryDiagnosis, (unmappedLabels.get(primaryDiagnosis) ?? 0) + 1);
    }

    // Track category stats
    statsByCategory.set(category, (statsByCategory.get(category) ?? 0) + 1);

    // Extract structured metadata
    const bodySites = extractBodySites(caseRow);
    const textures = extractTextures(caseRow);
    const symptoms = extractSymptoms(caseRow);
    const primaryBodySite = bodySites[0];

    // Track body site stats
    for (const site of bodySites) {
      statsByBodySite.set(site, (statsByBodySite.get(site) ?? 0) + 1);
    }

    // Skin tone: prefer dermatologist FST label, then self-reported, then monk
    const dermFst1 = labelRow.dermatologist_fitzpatrick_skin_type_label_1 ?? "";
    const dermFst2 = labelRow.dermatologist_fitzpatrick_skin_type_label_2 ?? "";
    const dermFst3 = labelRow.dermatologist_fitzpatrick_skin_type_label_3 ?? "";
    const selfFst = caseRow.fitzpatrick_skin_type ?? "";
    const monkUs = labelRow.monk_skin_tone_label_us ?? "";
    const monkIndia = labelRow.monk_skin_tone_label_india ?? "";

    // Determine best skin tone
    let skinToneLabel: SkinToneLabel | undefined;
    let skinToneSource: string | undefined;

    // Priority 1: dermatologist FST (first non-empty)
    for (const fst of [dermFst1, dermFst2, dermFst3]) {
      if (fst) {
        skinToneLabel = normalizeFitzpatrickFromLabel(fst);
        if (skinToneLabel) {
          skinToneSource = "fitzpatrick_scale";
          break;
        }
      }
    }

    // Priority 2: self-reported FST
    if (!skinToneLabel && selfFst && selfFst !== "NONE_SELECTED" && selfFst !== "NONE_IDENTIFIED") {
      skinToneLabel = normalizeFitzpatrickFromSelfReport(selfFst);
      if (skinToneLabel) skinToneSource = "self_reported";
    }

    // Priority 3: Monk scale (US)
    if (!skinToneLabel && monkUs) {
      skinToneLabel = normalizeMonkTone(monkUs);
      if (skinToneLabel) skinToneSource = "estimated";
    }

    // Track skin tone stats
    if (skinToneLabel) {
      statsBySkinTone.set(skinToneLabel, (statsBySkinTone.get(skinToneLabel) ?? 0) + 1);
    }

    // Track Monk tone stats separately
    if (monkUs) {
      const monkLabel = normalizeMonkTone(monkUs);
      if (monkLabel) {
        statsByMonkTone.set(monkLabel, (statsByMonkTone.get(monkLabel) ?? 0) + 1);
      }
    }

    const ageGroup = normalizeAgeGroup(caseRow.age_group ?? "");
    const sex = normalizeSex(caseRow.sex_at_birth ?? "");

    // Generate one image asset per image path
    for (let imgIdx = 0; imgIdx < imagePaths.length; imgIdx++) {
      const imgPath = imagePaths[imgIdx];
      const filename = imgPath.split("/").pop() ?? imgPath;
      const gcsUrl = `${GCS_BASE}${imgPath}`;
      const shotTypeCol = `image_${imgIdx + 1}_shot_type`;
      const shotType = caseRow[shotTypeCol] ?? "";

      const externalImageId = `scin:${caseId}:img${imgIdx + 1}`;
      const assetId = deterministicUuid("scin-img", externalImageId);

      // Build alt text
      const altParts = ["Clinical photograph"];
      if (primaryBodySite) altParts.push(`of ${primaryBodySite.replace(/_/g, " ")}`);
      altParts.push(`showing ${primaryDiagnosis}`);
      if (skinToneLabel) altParts.push(`(${skinToneLabel.replace(/_/g, " ")})`);
      const altText = altParts.join(" ");

      const imageAsset: OutputImageAsset = {
        id: assetId,
        datasetSourceId: DATASET_SOURCE_ID,
        externalCaseId: caseId,
        externalImageId,
        filename,
        altText,
        diagnosisOriginal: primaryDiagnosis,
        diagnosisNormalized: normalizedLabel,
        category,
        modality: "clinical_photo",
        bodySite: primaryBodySite,
        bodySiteOriginal: bodySites.join(", ") || undefined,
        skinToneLabel,
        skinToneSource,
        pathologyProofLevel: "expert_consensus",
        storageMode: "remote_url",
        storagePath: imgPath,
        externalUrl: gcsUrl,
        ageGroup,
        sex,
        metadataJson: {
          caseId,
          relatedCategory: caseRow.related_category ?? undefined,
          conditionDuration: caseRow.condition_duration ?? undefined,
          shotType: shotType || undefined,
          textures,
          symptoms,
          allConditionLabels: q.conditionNames,
          weightedLabels: q.weightedLabels,
          primaryWeight,
          bodySites,
          monkSkinToneUs: monkUs || undefined,
          monkSkinToneIndia: monkIndia || undefined,
          dermFitzpatrick: [dermFst1, dermFst2, dermFst3].filter(Boolean),
          selfReportedFst: selfFst || undefined,
        },
        isGradable: true,
        isActive: true,
        licenseRecordId: LICENSE_RECORD_ID,
        createdAt: now,
        updatedAt: now,
      };

      images.push(imageAsset);
      totalImages++;

      // Generate annotations from structured metadata
      // 1. Primary diagnosis annotation
      const diagAnnId = deterministicUuid("scin-ann-dx", externalImageId);
      annotations.push({
        id: diagAnnId,
        imageAssetId: assetId,
        conceptType: "diagnosis",
        conceptValue: primaryDiagnosis,
        confidence: primaryWeight,
        provenance: "dataset_native",
        evidenceNote: `Primary weighted diagnosis (weight=${primaryWeight.toFixed(2)}). All labels: ${Object.entries(weightedLabels).map(([k, v]) => `${k} (${v})`).join(", ")}`,
        createdBy: "scin-integrate",
        reviewStatus: "accepted",
        sourceDatasetField: "weighted_skin_condition_label",
        createdAt: now,
        updatedAt: now,
      });

      // 2. Differential diagnoses (other weighted labels)
      for (const [label, weight] of Object.entries(weightedLabels)) {
        if (label === primaryDiagnosis) continue;
        const diffAnnId = deterministicUuid("scin-ann-diff", `${externalImageId}:${label}`);
        annotations.push({
          id: diffAnnId,
          imageAssetId: assetId,
          conceptType: "differential",
          conceptValue: label,
          confidence: weight,
          provenance: "dataset_native",
          evidenceNote: `Differential diagnosis (weight=${weight.toFixed(2)})`,
          createdBy: "scin-integrate",
          reviewStatus: "accepted",
          sourceDatasetField: "weighted_skin_condition_label",
          createdAt: now,
          updatedAt: now,
        });
      }

      // 3. Body site annotations
      for (const site of bodySites) {
        const siteAnnId = deterministicUuid("scin-ann-site", `${externalImageId}:${site}`);
        annotations.push({
          id: siteAnnId,
          imageAssetId: assetId,
          conceptType: "body_site",
          conceptValue: site,
          confidence: 1.0,
          provenance: "dataset_native",
          evidenceNote: "Self-reported body site from SCIN case metadata",
          createdBy: "scin-integrate",
          reviewStatus: "accepted",
          sourceDatasetField: "body_parts_*",
          createdAt: now,
          updatedAt: now,
        });
      }

      // 4. Texture annotations
      for (const texture of textures) {
        const texAnnId = deterministicUuid("scin-ann-tex", `${externalImageId}:${texture}`);
        annotations.push({
          id: texAnnId,
          imageAssetId: assetId,
          conceptType: "texture",
          conceptValue: texture,
          confidence: 1.0,
          provenance: "dataset_native",
          evidenceNote: "Self-reported texture from SCIN case metadata",
          createdBy: "scin-integrate",
          reviewStatus: "accepted",
          sourceDatasetField: "textures_*",
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  }

  log(`  Generated ${images.length} image assets`);
  log(`  Generated ${annotations.length} annotations`);

  // Write output
  fs.mkdirSync(outputDir, { recursive: true });

  const imagesPath = path.join(outputDir, "scin-images.json");
  const annotationsPath = path.join(outputDir, "scin-annotations.json");
  const statsPath = path.join(outputDir, "scin-stats.json");

  log("");
  log("Writing output files...");

  fs.writeFileSync(imagesPath, JSON.stringify(images, null, 2), "utf-8");
  log(`  ${imagesPath}`);

  fs.writeFileSync(annotationsPath, JSON.stringify(annotations, null, 2), "utf-8");
  log(`  ${annotationsPath}`);

  // Build stats
  const stats = {
    generatedAt: now,
    totalCasesInDataset: casesRows.length,
    totalCasesWithLabels: joinedCount,
    qualifiedCases: qualified.length,
    filteredOut: {
      notGradable: filteredNoGradable,
      noImages: filteredNoImage,
      noConfidentLabel: filteredNoConfidentLabel,
    },
    totalImagesGenerated: totalImages,
    totalAnnotationsGenerated: annotations.length,
    casesByCategory: Object.fromEntries(
      Array.from(statsByCategory.entries()).sort((a, b) => b[1] - a[1])
    ),
    casesByFitzpatrickSkinTone: Object.fromEntries(
      Array.from(statsBySkinTone.entries())
        .filter(([k]) => k.startsWith("fitzpatrick"))
        .sort((a, b) => a[0].localeCompare(b[0]))
    ),
    casesByMonkSkinTone: Object.fromEntries(
      Array.from(statsByMonkTone.entries()).sort((a, b) => {
        const numA = parseInt(a[0].replace("monk_", ""), 10);
        const numB = parseInt(b[0].replace("monk_", ""), 10);
        return numA - numB;
      })
    ),
    casesByBodySite: Object.fromEntries(
      Array.from(statsByBodySite.entries()).sort((a, b) => b[1] - a[1])
    ),
    unmappedConditionLabels: Object.fromEntries(
      Array.from(unmappedLabels.entries()).sort((a, b) => b[1] - a[1])
    ),
    totalUnmappedLabels: Array.from(unmappedLabels.values()).reduce((a, b) => a + b, 0),
    taxonomyCoverage: `${((1 - Array.from(unmappedLabels.values()).reduce((a, b) => a + b, 0) / qualified.length) * 100).toFixed(1)}%`,
  };

  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf-8");
  log(`  ${statsPath}`);

  // Print summary report
  log("");
  log("========================================");
  log("         INTEGRATION SUMMARY");
  log("========================================");
  log("");
  log(`Total cases in dataset:    ${casesRows.length}`);
  log(`Cases with labels:         ${joinedCount}`);
  log(`Qualified cases:           ${qualified.length}`);
  log(`Total images generated:    ${totalImages}`);
  log(`Total annotations:         ${annotations.length}`);
  log("");

  log("--- Cases by Condition Category ---");
  for (const [cat, count] of Array.from(statsByCategory.entries()).sort((a, b) => b[1] - a[1])) {
    const pct = ((count / qualified.length) * 100).toFixed(1);
    log(`  ${cat.padEnd(20)} ${String(count).padStart(5)}  (${pct}%)`);
  }

  log("");
  log("--- Cases by Fitzpatrick Skin Tone ---");
  for (const [tone, count] of Array.from(statsBySkinTone.entries())
    .filter(([k]) => k.startsWith("fitzpatrick"))
    .sort((a, b) => a[0].localeCompare(b[0]))) {
    const pct = ((count / qualified.length) * 100).toFixed(1);
    log(`  ${tone.padEnd(20)} ${String(count).padStart(5)}  (${pct}%)`);
  }

  log("");
  log("--- Cases by Monk Skin Tone (US) ---");
  for (const [tone, count] of Array.from(statsByMonkTone.entries()).sort((a, b) => {
    const numA = parseInt(a[0].replace("monk_", ""), 10);
    const numB = parseInt(b[0].replace("monk_", ""), 10);
    return numA - numB;
  })) {
    const pct = ((count / qualified.length) * 100).toFixed(1);
    log(`  ${tone.padEnd(20)} ${String(count).padStart(5)}  (${pct}%)`);
  }

  log("");
  log("--- Cases by Body Site ---");
  for (const [site, count] of Array.from(statsByBodySite.entries()).sort((a, b) => b[1] - a[1])) {
    const pct = ((count / qualified.length) * 100).toFixed(1);
    log(`  ${site.padEnd(20)} ${String(count).padStart(5)}  (${pct}%)`);
  }

  if (unmappedLabels.size > 0) {
    log("");
    log("--- Unmapped Condition Labels ---");
    log(`  (${unmappedLabels.size} unique labels, ${stats.totalUnmappedLabels} total cases)`);
    log(`  Taxonomy coverage: ${stats.taxonomyCoverage}`);
    log("");
    for (const [label, count] of Array.from(unmappedLabels.entries()).sort((a, b) => b[1] - a[1]).slice(0, 30)) {
      log(`  ${String(count).padStart(4)}x  "${label}"`);
    }
    if (unmappedLabels.size > 30) {
      log(`  ... and ${unmappedLabels.size - 30} more`);
    }
  }

  log("");
  log("Done.");
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

main();
