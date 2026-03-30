// ---------------------------------------------------------------------------
// Common normalized types used by all dataset adapters
// ---------------------------------------------------------------------------

/**
 * Proof level indicating how the diagnosis was established.
 * Higher levels indicate stronger diagnostic certainty.
 */
export type PathologyProofLevel =
  | "histopathology_confirmed"
  | "dermatologist_clinical"
  | "clinician_labeled"
  | "crowd_consensus"
  | "self_reported"
  | "unknown";

/**
 * Normalized image-level record produced by any dataset adapter.
 * This is the canonical shape that all ingestion pipelines emit
 * before writing to the database or indexing for search.
 */
export interface NormalizedImageRecord {
  /** Case or encounter id from the source dataset. */
  externalCaseId: string;
  /** Image-level id from the source dataset. */
  externalImageId: string;
  /** Identifies the source dataset (e.g. "scin", "pad_ufes_20"). */
  datasetSource: DatasetSource;
  /** Resolved path or URI to the image file. */
  imagePath: string;

  // -- Diagnosis --
  /** Verbatim diagnosis label from the source dataset. */
  diagnosisOriginal: string;
  /** Normalised diagnosis label from our internal taxonomy. */
  diagnosisNormalized: string;
  /** ConditionCategory value (mirrors domain/schemas ConditionCategory). */
  category: string;
  /** Optional subcategory for finer grouping within a category. */
  subcategory?: string;
  /** Slug of the matching Condition record in our curriculum. */
  conditionSlug?: string;

  // -- Body site --
  /** Canonical body site after normalization. */
  bodySite?: string;
  /** Original body site string from the source dataset. */
  bodySiteOriginal?: string;

  // -- Demographics / skin tone --
  /** Normalized skin tone label (e.g. "fitzpatrick_3"). */
  skinToneLabel?: string;
  /** Which scale the skin tone was measured on (e.g. "fitzpatrick", "monk"). */
  skinToneSource?: string;

  // -- Diagnostic certainty --
  /** How the diagnosis was confirmed. */
  pathologyProofLevel: PathologyProofLevel;

  // -- Patient demographics --
  /** Age group bucket (e.g. "30-39", "60-69"). */
  ageGroup?: string;
  /** Patient sex ("male" | "female" | "other" | "unknown"). */
  sex?: string;

  // -- Clinical features --
  /** Reported symptoms. */
  symptoms?: string[];
  /** Duration of the condition as reported. */
  duration?: string;

  // -- Bag of extra metadata --
  /** Raw metadata preserved for auditability. */
  metadataJson: Record<string, unknown>;

  // -- Quality / usability --
  /** Whether the image passes basic quality checks for educational use. */
  isGradable: boolean;

  // -- Licensing --
  /** SPDX license identifier or human-readable name. */
  licenseType: string;
  /** Attribution string for display. */
  attribution: string;
}

/**
 * A normalized case groups one or more NormalizedImageRecord entries
 * that belong to the same clinical encounter / patient visit.
 */
export interface NormalizedCase {
  externalCaseId: string;
  datasetSource: DatasetSource;
  diagnosisOriginal: string;
  diagnosisNormalized: string;
  category: string;
  subcategory?: string;
  conditionSlug?: string;
  bodySite?: string;
  bodySiteOriginal?: string;
  skinToneLabel?: string;
  skinToneSource?: string;
  pathologyProofLevel: PathologyProofLevel;
  ageGroup?: string;
  sex?: string;
  symptoms?: string[];
  duration?: string;
  images: NormalizedImageRecord[];
  metadataJson: Record<string, unknown>;
  licenseType: string;
  attribution: string;
}

/**
 * Lightweight normalized record used when only a single image per row
 * exists (e.g. PAD-UFES-20).
 */
export type NormalizedRecord = NormalizedImageRecord;

// ---------------------------------------------------------------------------
// Dataset source identifiers
// ---------------------------------------------------------------------------

export type DatasetSource = "scin" | "pad_ufes_20" | "ham10000" | "isic" | "derm7pt" | "other";

// ---------------------------------------------------------------------------
// Curriculum relevance levels
// ---------------------------------------------------------------------------

export type CurriculumRelevance = "core" | "supplementary" | "advanced";
