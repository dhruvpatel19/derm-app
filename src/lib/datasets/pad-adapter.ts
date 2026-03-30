// ---------------------------------------------------------------------------
// PAD-UFES-20 dataset adapter
// ---------------------------------------------------------------------------
//
// PAD-UFES-20 contains smartphone-captured clinical images of skin lesions
// collected at Hospital Universitario Cassiano Antonio Moraes (HUCAM),
// Brazil. Every lesion has been biopsied and pathology-confirmed.
//
// Reference:
//   Pacheco et al., "PAD-UFES-20: A skin lesion dataset composed of
//   patient data and clinical images collected from smartphones," 2020.
// ---------------------------------------------------------------------------

import type {
  NormalizedRecord,
  PathologyProofLevel,
} from "./types";
import { lookupPADTaxonomy } from "./taxonomy";
import { normalizeBodySite } from "./body-site-map";

// ---------------------------------------------------------------------------
// Raw PAD record (mirrors the CSV columns)
// ---------------------------------------------------------------------------

export interface PADRawRecord {
  /** Image identifier (unique per row). */
  img_id: string;
  /** Diagnostic code: ACK | BCC | MEL | NEV | SCC | SEK. */
  diagnostic: string;
  /** Patient identifier (multiple rows may share a patient). */
  patient_id: number;
  /** Lesion identifier within the patient. */
  lesion_id: number;
  /** Whether the lesion was biopsied (always true in PAD-UFES-20). */
  biopsied: boolean;
  /** Patient age in years. */
  age: number;
  /** Patient sex as recorded ("MALE" / "FEMALE"). */
  sex: string;
  /** Body region label. */
  region: string;
  /** Lesion diameter axis 1 (mm), when measured. */
  diameter_1?: number;
  /** Lesion diameter axis 2 (mm), when measured. */
  diameter_2?: number;
  /** Patient-reported itch. */
  itch: boolean;
  /** Patient-reported growth. */
  grew: boolean;
  /** Patient-reported pain / hurt. */
  hurt: boolean;
  /** Patient-reported change in appearance. */
  changed: boolean;
  /** Patient-reported bleeding. */
  bleed: boolean;
  /** Clinical finding: elevation above skin surface. */
  elevation: boolean;
  /** Fitzpatrick skin type (note: dataset uses the misspelling "fitspatrick"). */
  fitspatrick: number;
  /** Relative path to the image file. */
  img_path: string;
}

// ---------------------------------------------------------------------------
// PAD body-site normalization
// ---------------------------------------------------------------------------

/**
 * Region strings observed in PAD-UFES-20 mapped to a canonical underscore key
 * before being fed into the shared normalizeBodySite() pipeline.
 */
const PAD_REGION_MAP: Record<string, string> = {
  FACE: "face",
  SCALP: "scalp",
  EAR: "ear",
  NOSE: "nose",
  NECK: "neck",
  TRUNK: "trunk",
  CHEST: "chest",
  ABDOMEN: "abdomen",
  BACK: "back",
  ARM: "arm",
  FOREARM: "forearm",
  HAND: "hand",
  FINGER: "finger",
  THIGH: "thigh",
  LEG: "leg",
  FOOT: "foot",
  TOE: "toe",
  LIP: "lip",

  // Compound / less standard labels
  "UPPER LIMB": "upper_extremity",
  "LOWER LIMB": "lower_extremity",
  "UPPER BACK": "upper_back",
  "LOWER BACK": "lower_back",
  "DORSUM OF THE HAND": "dorsal_hand",
  "PALM OF THE HAND": "palm",
  "SOLE OF THE FOOT": "sole",
  "POSTERIOR TRUNK": "back",
  "ANTERIOR TRUNK": "chest",
};

/**
 * Normalize a PAD-UFES-20 region string to a canonical body-site term.
 */
export function normalizePADBodySite(region: string): string {
  const upper = region.toUpperCase().trim();
  const mapped = PAD_REGION_MAP[upper];
  if (mapped) {
    return normalizeBodySite(mapped) ?? mapped;
  }
  // Fall back to generic normalization
  return normalizeBodySite(region) ?? "unspecified";
}

// ---------------------------------------------------------------------------
// PAD diagnosis normalization
// ---------------------------------------------------------------------------

/**
 * Expand a PAD diagnostic code into its original label, a normalised
 * human-readable name, and the condition category.
 */
export function normalizePADDiagnosis(
  diagnostic: string,
): { original: string; normalized: string; category: string } {
  const code = diagnostic.toUpperCase().trim();
  const taxonomy = lookupPADTaxonomy(code);

  if (taxonomy) {
    return {
      original: code,
      normalized: taxonomy.normalizedLabel,
      category: taxonomy.category,
    };
  }

  // Unrecognised code -- pass through with a safe default category
  return {
    original: code,
    normalized: code,
    category: "morphology",
  };
}

// ---------------------------------------------------------------------------
// Fitzpatrick normalization (their column is misspelled "fitspatrick")
// ---------------------------------------------------------------------------

function normalizeFitzpatrick(
  value: number,
): string | undefined {
  if (value >= 1 && value <= 6) {
    return `fitzpatrick_${value}`;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Age bucketing
// ---------------------------------------------------------------------------

function ageToGroup(age: number): string | undefined {
  if (age < 0 || !Number.isFinite(age)) return undefined;
  if (age < 10) return "0-9";
  if (age < 20) return "10-19";
  if (age < 30) return "20-29";
  if (age < 40) return "30-39";
  if (age < 50) return "40-49";
  if (age < 60) return "50-59";
  if (age < 70) return "60-69";
  if (age < 80) return "70-79";
  if (age < 90) return "80-89";
  return "90+";
}

// ---------------------------------------------------------------------------
// Sex normalization
// ---------------------------------------------------------------------------

function normalizeSex(raw: string): string {
  const upper = raw.toUpperCase().trim();
  if (upper === "MALE" || upper === "M") return "male";
  if (upper === "FEMALE" || upper === "F") return "female";
  return "unknown";
}

// ---------------------------------------------------------------------------
// Symptom extraction
// ---------------------------------------------------------------------------

/**
 * PAD-UFES-20 encodes symptoms as separate boolean columns.
 * This helper collects them into a string array for the normalized record.
 */
function extractSymptoms(raw: PADRawRecord): string[] {
  const symptoms: string[] = [];
  if (raw.itch) symptoms.push("itch");
  if (raw.grew) symptoms.push("growth");
  if (raw.hurt) symptoms.push("pain");
  if (raw.changed) symptoms.push("change_in_appearance");
  if (raw.bleed) symptoms.push("bleeding");
  if (raw.elevation) symptoms.push("elevation");
  return symptoms;
}

// ---------------------------------------------------------------------------
// Primary adapter function
// ---------------------------------------------------------------------------

/**
 * Convert a raw PAD-UFES-20 CSV row into a NormalizedRecord (which is an
 * alias for NormalizedImageRecord).
 */
export function normalizePADRecord(raw: PADRawRecord): NormalizedRecord {
  const diagnosis = normalizePADDiagnosis(raw.diagnostic);
  const taxonomy = lookupPADTaxonomy(raw.diagnostic.toUpperCase().trim());
  const bodySite = normalizePADBodySite(raw.region);
  const fitzLabel = normalizeFitzpatrick(raw.fitspatrick);
  const sex = normalizeSex(raw.sex);
  const ageGroup = ageToGroup(raw.age);
  const symptoms = extractSymptoms(raw);

  // PAD-UFES-20 is entirely biopsy-proven
  const proofLevel: PathologyProofLevel = raw.biopsied
    ? "histopathology_confirmed"
    : "dermatologist_clinical";

  return {
    externalCaseId: `pad_p${raw.patient_id}_l${raw.lesion_id}`,
    externalImageId: raw.img_id,
    datasetSource: "pad_ufes_20",
    imagePath: raw.img_path,

    diagnosisOriginal: raw.diagnostic,
    diagnosisNormalized: diagnosis.normalized,
    category: diagnosis.category,
    subcategory: taxonomy?.subcategory,
    conditionSlug: taxonomy?.conditionSlug,

    bodySite,
    bodySiteOriginal: raw.region,

    skinToneLabel: fitzLabel,
    skinToneSource: fitzLabel ? "fitzpatrick" : undefined,

    pathologyProofLevel: proofLevel,

    ageGroup,
    sex,
    symptoms: symptoms.length > 0 ? symptoms : undefined,
    duration: undefined,

    metadataJson: {
      patient_id: raw.patient_id,
      lesion_id: raw.lesion_id,
      biopsied: raw.biopsied,
      age: raw.age,
      diameter_1: raw.diameter_1,
      diameter_2: raw.diameter_2,
      itch: raw.itch,
      grew: raw.grew,
      hurt: raw.hurt,
      changed: raw.changed,
      bleed: raw.bleed,
      elevation: raw.elevation,
      fitspatrick: raw.fitspatrick,
    },

    isGradable: true,
    licenseType: "CC-BY-4.0",
    attribution:
      "PAD-UFES-20 - Pacheco et al., Hospital Universitario Cassiano Antonio Moraes (CC BY 4.0)",
  };
}
