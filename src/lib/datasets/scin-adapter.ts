// ---------------------------------------------------------------------------
// SCIN (Skin Condition Image Network) dataset adapter
// ---------------------------------------------------------------------------
//
// Normalizes raw SCIN records into the internal NormalizedCase /
// NormalizedImageRecord shapes so they can be ingested uniformly alongside
// other datasets.
// ---------------------------------------------------------------------------

import type {
  NormalizedCase,
  NormalizedImageRecord,
  PathologyProofLevel,
} from "./types";
import { lookupSCINTaxonomy } from "./taxonomy";
import { normalizeBodySite } from "./body-site-map";

// ---------------------------------------------------------------------------
// Raw SCIN types (mirrors the shape of the SCIN JSON / CSV export)
// ---------------------------------------------------------------------------

export interface SCINRawImage {
  /** Unique image identifier within the SCIN dataset. */
  image_id: string;
  /** Relative file path to the image within the SCIN data directory. */
  file_path: string;
  /** Image width in pixels, when available. */
  width?: number;
  /** Image height in pixels, when available. */
  height?: number;
  /** Camera / capture metadata, when available. */
  capture_device?: string;
  /** Whether the image passed SCIN's quality-control step. */
  is_quality_approved?: boolean;
}

export interface SCINRawCase {
  /** Unique case identifier. */
  case_id: string;
  /** One or more images associated with this case. */
  images: SCINRawImage[];
  /** Primary condition label assigned to the case. */
  condition_label: string;
  /** Confidence level of the label (e.g. "high", "medium", "low"). */
  condition_confidence?: string;
  /** Body site as reported in the dataset. */
  body_site?: string;
  /** Duration of the condition (e.g. "< 1 week", "1-3 months"). */
  duration?: string;
  /** Reported symptoms. */
  symptoms?: string[];
  /** Fitzpatrick skin type (I-VI) when documented. */
  fitzpatrick_skin_type?: string;
  /** Monk Skin Tone scale value (1-10) when documented. */
  monk_skin_tone?: string;
  /** Age range bucket (e.g. "18-29", "30-39"). */
  age_range?: string;
  /** Reported biological sex. */
  sex?: string;
  /** Whether a dermatologist reviewed the case. */
  dermatologist_reviewed?: boolean;
  /** Additional free-text notes from the contributor. */
  contributor_notes?: string;
  /** Country of origin when available. */
  country?: string;
}

// ---------------------------------------------------------------------------
// Normalization helpers
// ---------------------------------------------------------------------------

const FITZPATRICK_MAP: Record<string, string> = {
  "1": "fitzpatrick_1",
  "i": "fitzpatrick_1",
  I: "fitzpatrick_1",
  "2": "fitzpatrick_2",
  "ii": "fitzpatrick_2",
  II: "fitzpatrick_2",
  "3": "fitzpatrick_3",
  "iii": "fitzpatrick_3",
  III: "fitzpatrick_3",
  "4": "fitzpatrick_4",
  "iv": "fitzpatrick_4",
  IV: "fitzpatrick_4",
  "5": "fitzpatrick_5",
  "v": "fitzpatrick_5",
  V: "fitzpatrick_5",
  "6": "fitzpatrick_6",
  "vi": "fitzpatrick_6",
  VI: "fitzpatrick_6",
};

const MONK_TO_FITZPATRICK: Record<string, string> = {
  "1": "fitzpatrick_1",
  "2": "fitzpatrick_1",
  "3": "fitzpatrick_2",
  "4": "fitzpatrick_3",
  "5": "fitzpatrick_3",
  "6": "fitzpatrick_4",
  "7": "fitzpatrick_4",
  "8": "fitzpatrick_5",
  "9": "fitzpatrick_6",
  "10": "fitzpatrick_6",
};

/**
 * Normalize body site from SCIN's raw label to our canonical term.
 */
export function normalizeSCINBodySite(
  raw: string | undefined,
): string | undefined {
  return normalizeBodySite(raw);
}

/**
 * Derive a normalized skin-tone label from a SCIN case.
 *
 * SCIN may provide a Fitzpatrick type, a Monk scale value, or both.
 * We prefer Fitzpatrick when present; otherwise we approximate from Monk.
 */
export function normalizeSCINSkinTone(
  raw: SCINRawCase,
): { label: string; source: string } | undefined {
  if (raw.fitzpatrick_skin_type) {
    const key = raw.fitzpatrick_skin_type.trim().replace(/^type\s*/i, "");
    const label = FITZPATRICK_MAP[key];
    if (label) return { label, source: "fitzpatrick" };
  }

  if (raw.monk_skin_tone) {
    const key = raw.monk_skin_tone.trim();
    const label = MONK_TO_FITZPATRICK[key];
    if (label) return { label, source: "monk_approximated" };
  }

  return undefined;
}

/**
 * Derive the pathology proof level for a SCIN case.
 */
function deriveSCINProofLevel(raw: SCINRawCase): PathologyProofLevel {
  if (raw.dermatologist_reviewed) return "dermatologist_clinical";
  if (
    raw.condition_confidence === "high" ||
    raw.condition_confidence === "confirmed"
  ) {
    return "clinician_labeled";
  }
  if (raw.condition_confidence === "medium") return "crowd_consensus";
  return "self_reported";
}

/**
 * Normalize the sex field to a consistent lowercase value.
 */
function normalizeSex(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const lower = raw.toLowerCase().trim();
  if (lower === "male" || lower === "m") return "male";
  if (lower === "female" || lower === "f") return "female";
  if (lower === "other" || lower === "non-binary" || lower === "nonbinary") {
    return "other";
  }
  return "unknown";
}

// ---------------------------------------------------------------------------
// Primary adapter function
// ---------------------------------------------------------------------------

/**
 * Convert a raw SCIN case into a NormalizedCase.
 *
 * Returns `undefined` if the case has no images or has a completely
 * unrecognised condition label (caller decides whether to skip or log).
 */
export function normalizeSCINCase(
  raw: SCINRawCase,
): NormalizedCase | undefined {
  if (!raw.images || raw.images.length === 0) return undefined;

  const taxonomy = lookupSCINTaxonomy(raw.condition_label);
  const diagnosisNormalized = taxonomy?.normalizedLabel ?? raw.condition_label;
  const category = taxonomy?.category ?? "morphology";
  const conditionSlug = taxonomy?.conditionSlug;
  const subcategory = taxonomy?.subcategory;

  const bodySiteCanonical = normalizeSCINBodySite(raw.body_site);
  const skinTone = normalizeSCINSkinTone(raw);
  const proofLevel = deriveSCINProofLevel(raw);
  const sex = normalizeSex(raw.sex);

  const images: NormalizedImageRecord[] = raw.images.map((img) => ({
    externalCaseId: raw.case_id,
    externalImageId: img.image_id,
    datasetSource: "scin" as const,
    imagePath: img.file_path,

    diagnosisOriginal: raw.condition_label,
    diagnosisNormalized,
    category,
    subcategory,
    conditionSlug,

    bodySite: bodySiteCanonical,
    bodySiteOriginal: raw.body_site,

    skinToneLabel: skinTone?.label,
    skinToneSource: skinTone?.source,

    pathologyProofLevel: proofLevel,

    ageGroup: raw.age_range,
    sex,
    symptoms: raw.symptoms,
    duration: raw.duration,

    metadataJson: {
      condition_confidence: raw.condition_confidence,
      dermatologist_reviewed: raw.dermatologist_reviewed,
      contributor_notes: raw.contributor_notes,
      country: raw.country,
      capture_device: img.capture_device,
      image_width: img.width,
      image_height: img.height,
    },

    isGradable: img.is_quality_approved !== false,
    licenseType: "CC-BY-4.0",
    attribution: "Google SCIN Dataset (CC BY 4.0)",
  }));

  return {
    externalCaseId: raw.case_id,
    datasetSource: "scin",
    diagnosisOriginal: raw.condition_label,
    diagnosisNormalized,
    category,
    subcategory,
    conditionSlug,
    bodySite: bodySiteCanonical,
    bodySiteOriginal: raw.body_site,
    skinToneLabel: skinTone?.label,
    skinToneSource: skinTone?.source,
    pathologyProofLevel: proofLevel,
    ageGroup: raw.age_range,
    sex,
    symptoms: raw.symptoms,
    duration: raw.duration,
    images,
    metadataJson: {
      condition_confidence: raw.condition_confidence,
      dermatologist_reviewed: raw.dermatologist_reviewed,
      contributor_notes: raw.contributor_notes,
      country: raw.country,
    },
    licenseType: "CC-BY-4.0",
    attribution: "Google SCIN Dataset (CC BY 4.0)",
  };
}
