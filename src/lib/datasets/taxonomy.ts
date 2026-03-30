// ---------------------------------------------------------------------------
// Internal educational taxonomy and dataset-to-taxonomy mapping
// ---------------------------------------------------------------------------
//
// Each external dataset uses its own label vocabulary. This module maps every
// known label to a canonical internal taxonomy so that the rest of the
// application can work with a single, consistent set of condition slugs,
// categories, and metadata.
// ---------------------------------------------------------------------------

import type { CurriculumRelevance } from "./types";

// ---------------------------------------------------------------------------
// Educational condition categories (mirrors ConditionCategorySchema values)
// ---------------------------------------------------------------------------

export const CONDITION_CATEGORIES = {
  MORPHOLOGY: "morphology",
  BENIGN_LESION: "benign_lesion",
  SKIN_CANCER: "skin_cancer",
  INFECTION: "infection",
  DRUG_ERUPTION: "drug_eruption",
  ACNE_ROSACEA: "acne_rosacea",
  ECZEMATOUS: "eczematous",
  PAPULOSQUAMOUS: "papulosquamous",
  AUTOIMMUNE: "autoimmune",
  ULCER_WOUND: "ulcer_wound",
  BURN: "burn",
  GENODERMATOSIS: "genodermatosis",
  PEDIATRIC: "pediatric",
  HAIR_NAILS: "hair_nails",
} as const;

export type ConditionCategoryKey = keyof typeof CONDITION_CATEGORIES;
export type ConditionCategoryValue =
  (typeof CONDITION_CATEGORIES)[ConditionCategoryKey];

// ---------------------------------------------------------------------------
// TaxonomyMapping — the shape of every entry in the maps below
// ---------------------------------------------------------------------------

export interface TaxonomyMapping {
  /** Verbatim label as it appears in the source dataset. */
  originalLabel: string;
  /** Human-readable, title-cased version of the label. */
  normalizedLabel: string;
  /** Slug that links to our internal Condition record. */
  conditionSlug: string;
  /** ConditionCategory value. */
  category: ConditionCategoryValue;
  /** Optional subcategory for more granular grouping. */
  subcategory?: string;
  /** Whether biopsy is a typical part of the diagnostic workup. */
  isBiopsyRelevant: boolean;
  /** Body sites where this condition most commonly presents. */
  typicalBodySites: string[];
  /** How central this condition is to a dermatology curriculum. */
  curriculumRelevance: CurriculumRelevance;
}

// ---------------------------------------------------------------------------
// SCIN label -> internal taxonomy
// ---------------------------------------------------------------------------
// SCIN (Skin Condition Image Network) contains a broad range of clinical
// photographs with crowd-sourced and dermatologist-confirmed labels.
// The labels below cover the known SCIN vocabulary.
// ---------------------------------------------------------------------------

export const SCIN_TAXONOMY_MAP: Record<string, TaxonomyMapping> = {
  // -- Acne & rosacea -------------------------------------------------------
  acne: {
    originalLabel: "acne",
    normalizedLabel: "Acne Vulgaris",
    conditionSlug: "acne-vulgaris",
    category: CONDITION_CATEGORIES.ACNE_ROSACEA,
    subcategory: "acne",
    isBiopsyRelevant: false,
    typicalBodySites: ["face", "chest", "back", "shoulders"],
    curriculumRelevance: "core",
  },
  rosacea: {
    originalLabel: "rosacea",
    normalizedLabel: "Rosacea",
    conditionSlug: "rosacea",
    category: CONDITION_CATEGORIES.ACNE_ROSACEA,
    subcategory: "rosacea",
    isBiopsyRelevant: false,
    typicalBodySites: ["face", "nose", "cheeks", "forehead"],
    curriculumRelevance: "core",
  },
  perioral_dermatitis: {
    originalLabel: "perioral_dermatitis",
    normalizedLabel: "Perioral Dermatitis",
    conditionSlug: "perioral-dermatitis",
    category: CONDITION_CATEGORIES.ACNE_ROSACEA,
    subcategory: "perioral",
    isBiopsyRelevant: false,
    typicalBodySites: ["face", "perioral"],
    curriculumRelevance: "supplementary",
  },

  // -- Eczematous / dermatitis ----------------------------------------------
  eczema: {
    originalLabel: "eczema",
    normalizedLabel: "Atopic Dermatitis",
    conditionSlug: "atopic-dermatitis",
    category: CONDITION_CATEGORIES.ECZEMATOUS,
    subcategory: "atopic",
    isBiopsyRelevant: false,
    typicalBodySites: [
      "antecubital_fossa",
      "popliteal_fossa",
      "face",
      "neck",
      "hands",
    ],
    curriculumRelevance: "core",
  },
  contact_dermatitis: {
    originalLabel: "contact_dermatitis",
    normalizedLabel: "Contact Dermatitis",
    conditionSlug: "contact-dermatitis",
    category: CONDITION_CATEGORIES.ECZEMATOUS,
    subcategory: "contact",
    isBiopsyRelevant: false,
    typicalBodySites: ["hands", "face", "arms", "legs"],
    curriculumRelevance: "core",
  },
  seborrheic_dermatitis: {
    originalLabel: "seborrheic_dermatitis",
    normalizedLabel: "Seborrheic Dermatitis",
    conditionSlug: "seborrheic-dermatitis",
    category: CONDITION_CATEGORIES.ECZEMATOUS,
    subcategory: "seborrheic",
    isBiopsyRelevant: false,
    typicalBodySites: [
      "scalp",
      "face",
      "nasolabial_folds",
      "eyebrows",
      "chest",
    ],
    curriculumRelevance: "core",
  },
  nummular_dermatitis: {
    originalLabel: "nummular_dermatitis",
    normalizedLabel: "Nummular Dermatitis",
    conditionSlug: "nummular-dermatitis",
    category: CONDITION_CATEGORIES.ECZEMATOUS,
    subcategory: "nummular",
    isBiopsyRelevant: false,
    typicalBodySites: ["legs", "arms", "trunk"],
    curriculumRelevance: "supplementary",
  },
  dyshidrotic_eczema: {
    originalLabel: "dyshidrotic_eczema",
    normalizedLabel: "Dyshidrotic Eczema",
    conditionSlug: "dyshidrotic-eczema",
    category: CONDITION_CATEGORIES.ECZEMATOUS,
    subcategory: "dyshidrotic",
    isBiopsyRelevant: false,
    typicalBodySites: ["hands", "fingers", "feet"],
    curriculumRelevance: "supplementary",
  },
  stasis_dermatitis: {
    originalLabel: "stasis_dermatitis",
    normalizedLabel: "Stasis Dermatitis",
    conditionSlug: "stasis-dermatitis",
    category: CONDITION_CATEGORIES.ECZEMATOUS,
    subcategory: "stasis",
    isBiopsyRelevant: false,
    typicalBodySites: ["lower_legs", "ankles"],
    curriculumRelevance: "supplementary",
  },

  // -- Papulosquamous -------------------------------------------------------
  psoriasis: {
    originalLabel: "psoriasis",
    normalizedLabel: "Psoriasis",
    conditionSlug: "psoriasis",
    category: CONDITION_CATEGORIES.PAPULOSQUAMOUS,
    subcategory: "plaque_psoriasis",
    isBiopsyRelevant: false,
    typicalBodySites: [
      "elbows",
      "knees",
      "scalp",
      "lower_back",
      "nails",
    ],
    curriculumRelevance: "core",
  },
  pityriasis_rosea: {
    originalLabel: "pityriasis_rosea",
    normalizedLabel: "Pityriasis Rosea",
    conditionSlug: "pityriasis-rosea",
    category: CONDITION_CATEGORIES.PAPULOSQUAMOUS,
    isBiopsyRelevant: false,
    typicalBodySites: ["trunk", "upper_arms", "thighs"],
    curriculumRelevance: "core",
  },
  lichen_planus: {
    originalLabel: "lichen_planus",
    normalizedLabel: "Lichen Planus",
    conditionSlug: "lichen-planus",
    category: CONDITION_CATEGORIES.PAPULOSQUAMOUS,
    isBiopsyRelevant: true,
    typicalBodySites: [
      "wrists",
      "ankles",
      "oral_mucosa",
      "lower_back",
      "shins",
    ],
    curriculumRelevance: "core",
  },
  tinea_versicolor: {
    originalLabel: "tinea_versicolor",
    normalizedLabel: "Tinea Versicolor (Pityriasis Versicolor)",
    conditionSlug: "tinea-versicolor",
    category: CONDITION_CATEGORIES.INFECTION,
    subcategory: "fungal_superficial",
    isBiopsyRelevant: false,
    typicalBodySites: ["trunk", "chest", "back", "shoulders", "upper_arms"],
    curriculumRelevance: "core",
  },

  // -- Infections -----------------------------------------------------------
  fungal_infection: {
    originalLabel: "fungal_infection",
    normalizedLabel: "Dermatophyte Infection (Tinea)",
    conditionSlug: "tinea",
    category: CONDITION_CATEGORIES.INFECTION,
    subcategory: "fungal_dermatophyte",
    isBiopsyRelevant: false,
    typicalBodySites: [
      "feet",
      "groin",
      "trunk",
      "scalp",
      "nails",
    ],
    curriculumRelevance: "core",
  },
  warts: {
    originalLabel: "warts",
    normalizedLabel: "Verruca (Warts)",
    conditionSlug: "verruca",
    category: CONDITION_CATEGORIES.INFECTION,
    subcategory: "viral_hpv",
    isBiopsyRelevant: false,
    typicalBodySites: ["hands", "fingers", "feet", "periungual"],
    curriculumRelevance: "core",
  },
  herpes: {
    originalLabel: "herpes",
    normalizedLabel: "Herpes Simplex",
    conditionSlug: "herpes-simplex",
    category: CONDITION_CATEGORIES.INFECTION,
    subcategory: "viral_herpes",
    isBiopsyRelevant: false,
    typicalBodySites: ["lips", "perioral", "genitalia", "buttocks"],
    curriculumRelevance: "core",
  },
  herpes_zoster: {
    originalLabel: "herpes_zoster",
    normalizedLabel: "Herpes Zoster (Shingles)",
    conditionSlug: "herpes-zoster",
    category: CONDITION_CATEGORIES.INFECTION,
    subcategory: "viral_vzv",
    isBiopsyRelevant: false,
    typicalBodySites: ["trunk", "face", "dermatome_distribution"],
    curriculumRelevance: "core",
  },
  molluscum_contagiosum: {
    originalLabel: "molluscum_contagiosum",
    normalizedLabel: "Molluscum Contagiosum",
    conditionSlug: "molluscum-contagiosum",
    category: CONDITION_CATEGORIES.INFECTION,
    subcategory: "viral_poxvirus",
    isBiopsyRelevant: false,
    typicalBodySites: ["trunk", "axillae", "arms", "face"],
    curriculumRelevance: "supplementary",
  },
  impetigo: {
    originalLabel: "impetigo",
    normalizedLabel: "Impetigo",
    conditionSlug: "impetigo",
    category: CONDITION_CATEGORIES.INFECTION,
    subcategory: "bacterial",
    isBiopsyRelevant: false,
    typicalBodySites: ["face", "perioral", "nose", "arms"],
    curriculumRelevance: "core",
  },
  cellulitis: {
    originalLabel: "cellulitis",
    normalizedLabel: "Cellulitis",
    conditionSlug: "cellulitis",
    category: CONDITION_CATEGORIES.INFECTION,
    subcategory: "bacterial_deep",
    isBiopsyRelevant: false,
    typicalBodySites: ["lower_legs", "face", "arms"],
    curriculumRelevance: "core",
  },
  folliculitis: {
    originalLabel: "folliculitis",
    normalizedLabel: "Folliculitis",
    conditionSlug: "folliculitis",
    category: CONDITION_CATEGORIES.INFECTION,
    subcategory: "bacterial_follicular",
    isBiopsyRelevant: false,
    typicalBodySites: [
      "scalp",
      "thighs",
      "buttocks",
      "beard_area",
      "trunk",
    ],
    curriculumRelevance: "core",
  },
  scabies: {
    originalLabel: "scabies",
    normalizedLabel: "Scabies",
    conditionSlug: "scabies",
    category: CONDITION_CATEGORIES.INFECTION,
    subcategory: "parasitic",
    isBiopsyRelevant: false,
    typicalBodySites: [
      "web_spaces",
      "wrists",
      "axillae",
      "waistline",
      "genitalia",
    ],
    curriculumRelevance: "core",
  },
  onychomycosis: {
    originalLabel: "onychomycosis",
    normalizedLabel: "Onychomycosis",
    conditionSlug: "onychomycosis",
    category: CONDITION_CATEGORIES.INFECTION,
    subcategory: "fungal_nail",
    isBiopsyRelevant: false,
    typicalBodySites: ["toenails", "fingernails"],
    curriculumRelevance: "supplementary",
  },

  // -- Urticaria / immune-mediated ------------------------------------------
  urticaria: {
    originalLabel: "urticaria",
    normalizedLabel: "Urticaria (Hives)",
    conditionSlug: "urticaria",
    category: CONDITION_CATEGORIES.AUTOIMMUNE,
    subcategory: "urticarial",
    isBiopsyRelevant: false,
    typicalBodySites: ["trunk", "extremities", "face", "any"],
    curriculumRelevance: "core",
  },
  dermatitis_herpetiformis: {
    originalLabel: "dermatitis_herpetiformis",
    normalizedLabel: "Dermatitis Herpetiformis",
    conditionSlug: "dermatitis-herpetiformis",
    category: CONDITION_CATEGORIES.AUTOIMMUNE,
    subcategory: "blistering",
    isBiopsyRelevant: true,
    typicalBodySites: [
      "elbows",
      "knees",
      "buttocks",
      "scalp",
      "upper_back",
    ],
    curriculumRelevance: "supplementary",
  },

  // -- Autoimmune / pigmentary ----------------------------------------------
  vitiligo: {
    originalLabel: "vitiligo",
    normalizedLabel: "Vitiligo",
    conditionSlug: "vitiligo",
    category: CONDITION_CATEGORIES.AUTOIMMUNE,
    subcategory: "depigmentation",
    isBiopsyRelevant: false,
    typicalBodySites: [
      "face",
      "hands",
      "wrists",
      "perioral",
      "periocular",
      "genitalia",
    ],
    curriculumRelevance: "core",
  },
  alopecia_areata: {
    originalLabel: "alopecia_areata",
    normalizedLabel: "Alopecia Areata",
    conditionSlug: "alopecia-areata",
    category: CONDITION_CATEGORIES.HAIR_NAILS,
    subcategory: "alopecia_nonscarring",
    isBiopsyRelevant: false,
    typicalBodySites: ["scalp", "beard_area", "eyebrows"],
    curriculumRelevance: "core",
  },
  androgenetic_alopecia: {
    originalLabel: "androgenetic_alopecia",
    normalizedLabel: "Androgenetic Alopecia",
    conditionSlug: "androgenetic-alopecia",
    category: CONDITION_CATEGORIES.HAIR_NAILS,
    subcategory: "alopecia_nonscarring",
    isBiopsyRelevant: false,
    typicalBodySites: ["scalp"],
    curriculumRelevance: "supplementary",
  },

  // -- Benign lesions -------------------------------------------------------
  melanocytic_nevus: {
    originalLabel: "melanocytic_nevus",
    normalizedLabel: "Melanocytic Nevus (Mole)",
    conditionSlug: "melanocytic-nevus",
    category: CONDITION_CATEGORIES.BENIGN_LESION,
    subcategory: "melanocytic",
    isBiopsyRelevant: true,
    typicalBodySites: ["trunk", "face", "arms", "legs", "any"],
    curriculumRelevance: "core",
  },
  seborrheic_keratosis: {
    originalLabel: "seborrheic_keratosis",
    normalizedLabel: "Seborrheic Keratosis",
    conditionSlug: "seborrheic-keratosis",
    category: CONDITION_CATEGORIES.BENIGN_LESION,
    subcategory: "keratinocytic",
    isBiopsyRelevant: false,
    typicalBodySites: ["trunk", "face", "back", "chest"],
    curriculumRelevance: "core",
  },
  dermatofibroma: {
    originalLabel: "dermatofibroma",
    normalizedLabel: "Dermatofibroma",
    conditionSlug: "dermatofibroma",
    category: CONDITION_CATEGORIES.BENIGN_LESION,
    subcategory: "fibrous",
    isBiopsyRelevant: false,
    typicalBodySites: ["lower_legs", "arms"],
    curriculumRelevance: "supplementary",
  },
  cherry_angioma: {
    originalLabel: "cherry_angioma",
    normalizedLabel: "Cherry Angioma",
    conditionSlug: "cherry-angioma",
    category: CONDITION_CATEGORIES.BENIGN_LESION,
    subcategory: "vascular",
    isBiopsyRelevant: false,
    typicalBodySites: ["trunk", "arms", "legs"],
    curriculumRelevance: "supplementary",
  },
  skin_tag: {
    originalLabel: "skin_tag",
    normalizedLabel: "Acrochordon (Skin Tag)",
    conditionSlug: "acrochordon",
    category: CONDITION_CATEGORIES.BENIGN_LESION,
    subcategory: "soft_tissue",
    isBiopsyRelevant: false,
    typicalBodySites: ["neck", "axillae", "groin", "eyelids"],
    curriculumRelevance: "supplementary",
  },
  lipoma: {
    originalLabel: "lipoma",
    normalizedLabel: "Lipoma",
    conditionSlug: "lipoma",
    category: CONDITION_CATEGORIES.BENIGN_LESION,
    subcategory: "adipose",
    isBiopsyRelevant: false,
    typicalBodySites: ["trunk", "arms", "thighs", "neck"],
    curriculumRelevance: "supplementary",
  },
  epidermal_cyst: {
    originalLabel: "epidermal_cyst",
    normalizedLabel: "Epidermal Inclusion Cyst",
    conditionSlug: "epidermal-cyst",
    category: CONDITION_CATEGORIES.BENIGN_LESION,
    subcategory: "cystic",
    isBiopsyRelevant: false,
    typicalBodySites: ["face", "trunk", "back", "neck"],
    curriculumRelevance: "supplementary",
  },
  milia: {
    originalLabel: "milia",
    normalizedLabel: "Milia",
    conditionSlug: "milia",
    category: CONDITION_CATEGORIES.BENIGN_LESION,
    subcategory: "keratin_cyst",
    isBiopsyRelevant: false,
    typicalBodySites: ["face", "eyelids", "cheeks"],
    curriculumRelevance: "supplementary",
  },

  // -- Pre-malignant / malignant --------------------------------------------
  actinic_keratosis: {
    originalLabel: "actinic_keratosis",
    normalizedLabel: "Actinic Keratosis",
    conditionSlug: "actinic-keratosis",
    category: CONDITION_CATEGORIES.SKIN_CANCER,
    subcategory: "premalignant",
    isBiopsyRelevant: true,
    typicalBodySites: [
      "face",
      "scalp",
      "ears",
      "dorsal_hands",
      "forearms",
    ],
    curriculumRelevance: "core",
  },
  basal_cell_carcinoma: {
    originalLabel: "basal_cell_carcinoma",
    normalizedLabel: "Basal Cell Carcinoma",
    conditionSlug: "basal-cell-carcinoma",
    category: CONDITION_CATEGORIES.SKIN_CANCER,
    subcategory: "keratinocyte_carcinoma",
    isBiopsyRelevant: true,
    typicalBodySites: ["face", "nose", "ears", "scalp", "trunk"],
    curriculumRelevance: "core",
  },
  squamous_cell_carcinoma: {
    originalLabel: "squamous_cell_carcinoma",
    normalizedLabel: "Squamous Cell Carcinoma",
    conditionSlug: "squamous-cell-carcinoma",
    category: CONDITION_CATEGORIES.SKIN_CANCER,
    subcategory: "keratinocyte_carcinoma",
    isBiopsyRelevant: true,
    typicalBodySites: [
      "face",
      "ears",
      "lower_lip",
      "dorsal_hands",
      "scalp",
    ],
    curriculumRelevance: "core",
  },
  melanoma: {
    originalLabel: "melanoma",
    normalizedLabel: "Melanoma",
    conditionSlug: "melanoma",
    category: CONDITION_CATEGORIES.SKIN_CANCER,
    subcategory: "melanocytic_malignant",
    isBiopsyRelevant: true,
    typicalBodySites: ["trunk", "legs", "back", "arms", "face"],
    curriculumRelevance: "core",
  },

  // -- Drug eruption --------------------------------------------------------
  drug_eruption: {
    originalLabel: "drug_eruption",
    normalizedLabel: "Drug Eruption",
    conditionSlug: "drug-eruption",
    category: CONDITION_CATEGORIES.DRUG_ERUPTION,
    isBiopsyRelevant: true,
    typicalBodySites: ["trunk", "extremities", "any"],
    curriculumRelevance: "core",
  },
  fixed_drug_eruption: {
    originalLabel: "fixed_drug_eruption",
    normalizedLabel: "Fixed Drug Eruption",
    conditionSlug: "fixed-drug-eruption",
    category: CONDITION_CATEGORIES.DRUG_ERUPTION,
    subcategory: "fixed",
    isBiopsyRelevant: false,
    typicalBodySites: ["lips", "genitalia", "hands", "trunk"],
    curriculumRelevance: "supplementary",
  },

  // -- Granulomatous / miscellaneous ----------------------------------------
  granuloma_annulare: {
    originalLabel: "granuloma_annulare",
    normalizedLabel: "Granuloma Annulare",
    conditionSlug: "granuloma-annulare",
    category: CONDITION_CATEGORIES.AUTOIMMUNE,
    subcategory: "granulomatous",
    isBiopsyRelevant: true,
    typicalBodySites: ["hands", "feet", "elbows", "knees"],
    curriculumRelevance: "supplementary",
  },
  morphea: {
    originalLabel: "morphea",
    normalizedLabel: "Morphea (Localized Scleroderma)",
    conditionSlug: "morphea",
    category: CONDITION_CATEGORIES.AUTOIMMUNE,
    subcategory: "sclerosing",
    isBiopsyRelevant: true,
    typicalBodySites: ["trunk", "extremities"],
    curriculumRelevance: "advanced",
  },

  // -- Pigmentary -----------------------------------------------------------
  melasma: {
    originalLabel: "melasma",
    normalizedLabel: "Melasma",
    conditionSlug: "melasma",
    category: CONDITION_CATEGORIES.BENIGN_LESION,
    subcategory: "hyperpigmentation",
    isBiopsyRelevant: false,
    typicalBodySites: ["cheeks", "forehead", "upper_lip", "chin"],
    curriculumRelevance: "supplementary",
  },
  post_inflammatory_hyperpigmentation: {
    originalLabel: "post_inflammatory_hyperpigmentation",
    normalizedLabel: "Post-Inflammatory Hyperpigmentation",
    conditionSlug: "post-inflammatory-hyperpigmentation",
    category: CONDITION_CATEGORIES.BENIGN_LESION,
    subcategory: "hyperpigmentation",
    isBiopsyRelevant: false,
    typicalBodySites: ["face", "trunk", "extremities", "any"],
    curriculumRelevance: "supplementary",
  },

  // -- Burns ----------------------------------------------------------------
  sunburn: {
    originalLabel: "sunburn",
    normalizedLabel: "Sunburn",
    conditionSlug: "sunburn",
    category: CONDITION_CATEGORIES.BURN,
    subcategory: "solar",
    isBiopsyRelevant: false,
    typicalBodySites: [
      "shoulders",
      "face",
      "back",
      "chest",
      "arms",
    ],
    curriculumRelevance: "supplementary",
  },
};

// ---------------------------------------------------------------------------
// PAD-UFES-20 label -> internal taxonomy
// ---------------------------------------------------------------------------
// PAD-UFES-20 contains biopsy-proven skin lesion images from the Hospital
// Universitario Cassiano Antonio Moraes (HUCAM). All six diagnostic
// categories are mapped below.
// ---------------------------------------------------------------------------

export const PAD_TAXONOMY_MAP: Record<string, TaxonomyMapping> = {
  ACK: {
    originalLabel: "ACK",
    normalizedLabel: "Actinic Keratosis",
    conditionSlug: "actinic-keratosis",
    category: CONDITION_CATEGORIES.SKIN_CANCER,
    subcategory: "premalignant",
    isBiopsyRelevant: true,
    typicalBodySites: [
      "face",
      "scalp",
      "ears",
      "dorsal_hands",
      "forearms",
    ],
    curriculumRelevance: "core",
  },
  BCC: {
    originalLabel: "BCC",
    normalizedLabel: "Basal Cell Carcinoma",
    conditionSlug: "basal-cell-carcinoma",
    category: CONDITION_CATEGORIES.SKIN_CANCER,
    subcategory: "keratinocyte_carcinoma",
    isBiopsyRelevant: true,
    typicalBodySites: ["face", "nose", "ears", "scalp", "trunk"],
    curriculumRelevance: "core",
  },
  MEL: {
    originalLabel: "MEL",
    normalizedLabel: "Melanoma",
    conditionSlug: "melanoma",
    category: CONDITION_CATEGORIES.SKIN_CANCER,
    subcategory: "melanocytic_malignant",
    isBiopsyRelevant: true,
    typicalBodySites: ["trunk", "legs", "back", "arms", "face"],
    curriculumRelevance: "core",
  },
  NEV: {
    originalLabel: "NEV",
    normalizedLabel: "Melanocytic Nevus",
    conditionSlug: "melanocytic-nevus",
    category: CONDITION_CATEGORIES.BENIGN_LESION,
    subcategory: "melanocytic",
    isBiopsyRelevant: true,
    typicalBodySites: ["trunk", "face", "arms", "legs", "any"],
    curriculumRelevance: "core",
  },
  SCC: {
    originalLabel: "SCC",
    normalizedLabel: "Squamous Cell Carcinoma",
    conditionSlug: "squamous-cell-carcinoma",
    category: CONDITION_CATEGORIES.SKIN_CANCER,
    subcategory: "keratinocyte_carcinoma",
    isBiopsyRelevant: true,
    typicalBodySites: [
      "face",
      "ears",
      "lower_lip",
      "dorsal_hands",
      "scalp",
    ],
    curriculumRelevance: "core",
  },
  SEK: {
    originalLabel: "SEK",
    normalizedLabel: "Seborrheic Keratosis",
    conditionSlug: "seborrheic-keratosis",
    category: CONDITION_CATEGORIES.BENIGN_LESION,
    subcategory: "keratinocytic",
    isBiopsyRelevant: false,
    typicalBodySites: ["trunk", "face", "back", "chest"],
    curriculumRelevance: "core",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Look up a SCIN label in the taxonomy map, returning undefined when the
 * label is not recognised.
 */
export function lookupSCINTaxonomy(
  label: string,
): TaxonomyMapping | undefined {
  const key = label.toLowerCase().trim().replace(/[\s-]+/g, "_");
  return SCIN_TAXONOMY_MAP[key];
}

/**
 * Look up a PAD diagnostic code in the taxonomy map.
 */
export function lookupPADTaxonomy(
  code: string,
): TaxonomyMapping | undefined {
  return PAD_TAXONOMY_MAP[code.toUpperCase().trim()];
}

/**
 * Return all taxonomy entries for a given category.
 */
export function entriesByCategory(
  category: ConditionCategoryValue,
): TaxonomyMapping[] {
  const results: TaxonomyMapping[] = [];
  for (const entry of Object.values(SCIN_TAXONOMY_MAP)) {
    if (entry.category === category) results.push(entry);
  }
  for (const entry of Object.values(PAD_TAXONOMY_MAP)) {
    if (
      entry.category === category &&
      !results.some((r) => r.conditionSlug === entry.conditionSlug)
    ) {
      results.push(entry);
    }
  }
  return results;
}
