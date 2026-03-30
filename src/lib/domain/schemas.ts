import { z } from "zod";

// ============================================================================
// ENUMS
// ============================================================================

export const SkinToneLabelSchema = z.enum([
  "fitzpatrick_1",
  "fitzpatrick_2",
  "fitzpatrick_3",
  "fitzpatrick_4",
  "fitzpatrick_5",
  "fitzpatrick_6",
  "monk_1",
  "monk_2",
  "monk_3",
  "monk_4",
  "monk_5",
  "monk_6",
  "monk_7",
  "monk_8",
  "monk_9",
  "monk_10",
  "unknown",
]);

export type SkinToneLabel = z.infer<typeof SkinToneLabelSchema>;

export const ImageModalitySchema = z.enum([
  "clinical_photo",
  "dermoscopy",
  "histopathology",
  "diagram",
  "illustration",
  "body_map",
]);

export type ImageModality = z.infer<typeof ImageModalitySchema>;

export const StorageModeSchema = z.enum([
  "local",
  "remote_url",
  "dataset_ref",
]);

export type StorageMode = z.infer<typeof StorageModeSchema>;

export const ConditionCategorySchema = z.enum([
  "morphology",
  "benign_lesion",
  "skin_cancer",
  "infection",
  "drug_eruption",
  "acne_rosacea",
  "eczematous",
  "papulosquamous",
  "autoimmune",
  "ulcer_wound",
  "burn",
  "genodermatosis",
  "pediatric",
  "hair_nails",
  "premalignant",
]);

export type ConditionCategory = z.infer<typeof ConditionCategorySchema>;

export const AnnotationProvenanceSchema = z.enum([
  "dataset_native",
  "human_curated",
  "model_proposed",
  "model_verified",
  "condition_prior_only",
]);

export type AnnotationProvenance = z.infer<typeof AnnotationProvenanceSchema>;

export const ReviewStatusSchema = z.enum([
  "pending",
  "accepted",
  "rejected",
  "needs_revision",
]);

export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;

export const QuestionTypeSchema = z.enum([
  "single_select",
  "multi_select",
  "chip_select",
  "differential_rank",
  "image_description",
  "hotspot_select",
  "ordered_steps",
  "free_text",
]);

export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export const DifficultyLevelSchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

export type DifficultyLevel = z.infer<typeof DifficultyLevelSchema>;

export const BiopsyTypeSchema = z.enum([
  "punch",
  "shave",
  "excisional",
  "incisional",
  "none",
]);

export type BiopsyType = z.infer<typeof BiopsyTypeSchema>;

export const SimulationModuleTypeSchema = z.enum([
  "biopsy_choice",
  "target_selector",
  "procedure_sequence",
  "interactive_procedure",
]);

export type SimulationModuleType = z.infer<typeof SimulationModuleTypeSchema>;

export const MorphologyTermCategorySchema = z.enum([
  "primary_lesion",
  "secondary_lesion",
  "surface_change",
  "distribution",
  "configuration",
  "color",
]);

export type MorphologyTermCategory = z.infer<
  typeof MorphologyTermCategorySchema
>;

export const PathologyProofLevelSchema = z.enum([
  "biopsy_proven",
  "clinically_diagnosed",
  "expert_consensus",
  "dataset_label",
  "unknown",
]);

export type PathologyProofLevel = z.infer<typeof PathologyProofLevelSchema>;

// ============================================================================
// DATASET SOURCE
// ============================================================================

export const DatasetSourceSchema = z.object({
  id: z.string().min(1),
  /** Human-readable dataset name. */
  name: z.string().min(1),
  /** URL-safe slug for the dataset. */
  slug: z.string().min(1),
  /** Brief description of the dataset and its contents. */
  description: z.string().min(1),
  /** License type (e.g. "CC-BY-NC-SA-4.0"). */
  licenseType: z.string().min(1),
  /** SPDX license identifier. */
  licenseSpdx: z.string().min(1),
  /** URL to the full license text. */
  licenseUrl: z.string().min(1),
  /** Template string for required attribution (may contain placeholders). */
  attributionTemplate: z.string().min(1),
  /** Whether redistribution of images is allowed. */
  redistributionAllowed: z.boolean(),
  /** Whether derivative works are allowed. */
  derivativeAllowed: z.boolean(),
  /** Whether commercial use is allowed. */
  commercialAllowed: z.boolean(),
  /** Download URL for the dataset. */
  downloadUrl: z.string().optional(),
  /** Format of the dataset (e.g. "DICOM", "JPEG", "CSV+JPEG"). */
  dataFormat: z.string().optional(),
  /** Additional notes about usage or provenance. */
  notes: z.string().optional(),
  /** Whether this dataset source is currently active. */
  isActive: z.boolean(),
});

export type DatasetSource = z.infer<typeof DatasetSourceSchema>;

// ============================================================================
// ASSET LICENSE RECORD
// ============================================================================

export const AssetLicenseRecordSchema = z.object({
  id: z.string().min(1),
  /** FK to the DatasetSource this license derives from. */
  datasetSourceId: z.string().min(1),
  /** FK to the specific image asset, if applicable. */
  imageAssetId: z.string().optional(),
  /** License type (e.g. "CC-BY-NC-SA-4.0"). */
  licenseType: z.string().min(1),
  /** SPDX license identifier. */
  spdxId: z.string().min(1),
  /** Attribution text. */
  attribution: z.string().min(1),
  /** URL to the original source. */
  sourceUrl: z.string().optional(),
  /** Specific restrictions that apply. */
  restrictions: z.array(z.string()),
  /** Additional notes on the license. */
  notes: z.string().optional(),
});

export type AssetLicenseRecord = z.infer<typeof AssetLicenseRecordSchema>;

// ---------------------------------------------------------------------------
// Legacy aliases for downstream compatibility
// ---------------------------------------------------------------------------

/** @deprecated Use AssetLicenseRecordSchema instead. */
export const LicenseRecordSchema = AssetLicenseRecordSchema;
/** @deprecated Use AssetLicenseRecord instead. */
export type LicenseRecord = AssetLicenseRecord;

// ============================================================================
// IMAGE ASSET (redesigned for real datasets)
// ============================================================================

export const ImageAssetSchema = z.object({
  id: z.string().min(1),
  /** FK to the DatasetSource this image originates from. */
  datasetSourceId: z.string().min(1),
  /** Original case identifier from the source dataset. */
  externalCaseId: z.string().optional(),
  /** Original image identifier from the source dataset. */
  externalImageId: z.string().optional(),
  /** Filename of the image. */
  filename: z.string().min(1),
  /** Alt text for accessibility. */
  altText: z.string().min(1),

  // --- Diagnosis fields ---
  /** Raw diagnosis label as it appears in the source dataset. */
  diagnosisOriginal: z.string().min(1),
  /** Our canonical normalized label for this diagnosis. */
  diagnosisNormalized: z.string().min(1),
  /** FK to a Condition entry, if one has been mapped. */
  conditionId: z.string().optional(),

  // --- Classification ---
  /** Primary condition category. */
  category: ConditionCategorySchema,
  /** More specific sub-classification within the category. */
  subcategory: z.string().optional(),

  // --- Image metadata ---
  /** Imaging modality. */
  modality: ImageModalitySchema,
  /** Normalized body site. */
  bodySite: z.string().optional(),
  /** Body site as originally recorded in the dataset. */
  bodySiteOriginal: z.string().optional(),

  // --- Skin tone ---
  /** Skin tone classification label. */
  skinToneLabel: SkinToneLabelSchema.optional(),
  /** How the skin tone was determined. */
  skinToneSource: z
    .enum(["self_reported", "estimated", "fitzpatrick_scale"])
    .optional(),

  // --- Evidence level ---
  /** Level of diagnostic proof for this image. */
  pathologyProofLevel: PathologyProofLevelSchema,

  // --- Storage ---
  /** How the image is stored / resolved. */
  storageMode: StorageModeSchema,
  /** Path or key depending on storageMode. */
  storagePath: z.string().min(1),
  /** Fully-resolved URL for remote assets. */
  externalUrl: z.string().optional(),

  // --- Dimensions ---
  /** Intrinsic width in pixels. */
  width: z.number().int().positive().optional(),
  /** Intrinsic height in pixels. */
  height: z.number().int().positive().optional(),

  // --- Demographics ---
  /** Age group of the patient (e.g. "adult", "pediatric", "elderly"). */
  ageGroup: z.string().optional(),
  /** Biological sex (e.g. "male", "female", "unknown"). */
  sex: z.string().optional(),

  // --- Extensible metadata ---
  /** Preserve arbitrary original dataset metadata as key-value pairs. */
  metadataJson: z.record(z.string(), z.unknown()).optional(),

  // --- Flags ---
  /** Whether this image is suitable for quiz / grading use. */
  isGradable: z.boolean(),
  /** Soft-delete / active flag. */
  isActive: z.boolean(),

  // --- License ---
  /** FK to AssetLicenseRecord for this image. */
  licenseRecordId: z.string().optional(),

  // --- Timestamps ---
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ImageAsset = z.infer<typeof ImageAssetSchema>;

// ============================================================================
// IMAGE ANNOTATION
// ============================================================================

export const ImageAnnotationConceptTypeSchema = z.enum([
  "primary_lesion",
  "secondary_lesion",
  "texture",
  "color",
  "border",
  "shape",
  "arrangement",
  "distribution",
  "body_site",
  "lesion_count",
  "diagnosis",
  "differential",
  "management",
  "biopsy_relevance",
]);

export type ImageAnnotationConceptType = z.infer<
  typeof ImageAnnotationConceptTypeSchema
>;

export const ImageAnnotationSchema = z.object({
  id: z.string().min(1),
  /** FK to the ImageAsset this annotation belongs to. */
  imageAssetId: z.string().min(1),
  /** The type of concept being annotated. */
  conceptType: ImageAnnotationConceptTypeSchema,
  /** The value of the annotated concept (e.g. "papule", "erythematous"). */
  conceptValue: z.string().min(1),
  /** Confidence score from 0 to 1. */
  confidence: z.number().min(0).max(1),
  /** How this annotation was produced. */
  provenance: AnnotationProvenanceSchema,
  /** Free-text note supporting the annotation. */
  evidenceNote: z.string().optional(),
  /** Identifier of the person or system that created the annotation. */
  createdBy: z.string().optional(),
  /** Identifier of the person who reviewed the annotation. */
  reviewedBy: z.string().optional(),
  /** Current review status. */
  reviewStatus: ReviewStatusSchema,
  /** Name of the source dataset field this was derived from, if any. */
  sourceDatasetField: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ImageAnnotation = z.infer<typeof ImageAnnotationSchema>;

// ============================================================================
// CONDITION
// ============================================================================

export const ConditionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** URL-friendly slug for the condition. */
  slug: z.string().min(1),
  category: ConditionCategorySchema,
  /** ICD-11 code(s) when applicable. */
  icdCodes: z.array(z.string()).optional(),
  /** Comprehensive clinical description. */
  description: z.string().min(1),
  /** Key clinical features used for differential diagnosis. */
  clinicalFeatures: z.array(z.string()).optional(),
  /** Ids of conditions in the differential diagnosis. */
  differentialIds: z.array(z.string()).optional(),
  /** Free-form notes (red flags, management pearls, follow-up guidance). */
  notes: z.string().optional(),

  // --- New fields ---
  /** Alternative names / synonyms for this condition. */
  aliases: z.array(z.string()),
  /** Section identifier in the syllabus or curriculum map. */
  syllabusSection: z.string().optional(),
  /** Short one-liner summary of the condition. */
  summary: z.string().optional(),
  /** Hallmark morphological features. */
  hallmarkMorphology: z.array(z.string()).optional(),
  /** Common body sites where this condition presents. */
  commonBodySites: z.array(z.string()).optional(),
  /** Typical symptoms. */
  symptoms: z.array(z.string()).optional(),
  /** Basic management / treatment information. */
  managementBasics: z.array(z.string()).optional(),
  /** Critical warning signs not to miss. */
  redFlags: z.array(z.string()).optional(),
  /** Follow-up clinical pearls. */
  followUpPearls: z.array(z.string()).optional(),
  /** Ids of CompareModule entries relevant to this condition. */
  compareModuleIds: z.array(z.string()).optional(),
  /** Ids of ImageAsset entries associated with this condition. */
  imageAssetIds: z.array(z.string()).optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Condition = z.infer<typeof ConditionSchema>;

// ============================================================================
// CONDITION TAXONOMY MAPPING
// ============================================================================

export const ConditionTaxonomyMappingSchema = z.object({
  id: z.string().min(1),
  /** FK to the DatasetSource where this label originates. */
  datasetSourceId: z.string().min(1),
  /** The original label string from the dataset. */
  originalLabel: z.string().min(1),
  /** Our canonical normalized label. */
  normalizedLabel: z.string().min(1),
  /** FK to the Condition entry, if mapped. */
  conditionId: z.string().optional(),
  /** Condition category for grouping. */
  category: ConditionCategorySchema,
  /** More specific sub-classification. */
  subcategory: z.string().optional(),
  /** Additional notes about the mapping decision. */
  notes: z.string().optional(),
});

export type ConditionTaxonomyMapping = z.infer<
  typeof ConditionTaxonomyMappingSchema
>;

// ============================================================================
// QUIZ ITEM (redesigned for image-specific truth)
// ============================================================================

export const RequiredConceptSchema = z.object({
  conceptType: z.string().min(1),
  conceptValue: z.string().min(1),
  weight: z.number(),
  acceptableSynonyms: z.array(z.string()),
});

export type RequiredConcept = z.infer<typeof RequiredConceptSchema>;

export const OptionalConceptSchema = z.object({
  conceptType: z.string().min(1),
  conceptValue: z.string().min(1),
  bonusWeight: z.number(),
});

export type OptionalConcept = z.infer<typeof OptionalConceptSchema>;

export const ForbiddenAssumptionSchema = z.object({
  conceptValue: z.string().min(1),
  reason: z.string().min(1),
});

export type ForbiddenAssumption = z.infer<typeof ForbiddenAssumptionSchema>;

export const DistractorSchema = z.object({
  conceptValue: z.string().min(1),
  reason: z.string().min(1),
});

export type Distractor = z.infer<typeof DistractorSchema>;

export const ScoringWeightsSchema = z.object({
  coreMorphology: z.number(),
  secondaryFeatures: z.number(),
  bodySiteDistribution: z.number(),
  differentialQuality: z.number(),
  managementPearl: z.number(),
});

export type ScoringWeights = z.infer<typeof ScoringWeightsSchema>;

export const QuizItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** FK to the specific image this quiz is about. */
  imageAssetId: z.string().min(1),
  /** FK to the condition being tested. */
  conditionId: z.string().min(1),
  difficulty: DifficultyLevelSchema,
  /** FK to the dataset this quiz was derived from. */
  datasetSourceId: z.string().optional(),
  questionType: QuestionTypeSchema,
  /** The question prompt shown to the learner. */
  prompt: z.string().min(1),
  /** Concepts the learner must identify (weighted). */
  requiredConcepts: z.array(RequiredConceptSchema),
  /** Bonus concepts the learner may identify. */
  optionalConcepts: z.array(OptionalConceptSchema),
  /** Concepts the learner should NOT assume from this image. */
  forbiddenAssumptions: z.array(ForbiddenAssumptionSchema),
  /** Plausible wrong answers with reasoning. */
  distractors: z.array(DistractorSchema),
  /** Top differential diagnoses to consider. */
  topDifferentials: z.array(z.string()),
  /** A mimic diagnosis that would be dangerous to confuse with. */
  dangerousMimic: z.string().optional(),
  /** Explanation shown after the learner answers. */
  explanation: z.string().min(1),
  /** Key management takeaway. */
  managementPearl: z.string().optional(),
  /** Gold-standard description of what the image shows. */
  goldStandardDescription: z.string().optional(),
  /** How scoring weight is distributed across rubric areas. */
  scoringWeights: ScoringWeightsSchema,
  /** Whether this quiz item is active. */
  isActive: z.boolean(),
  /** Whether this quiz item has been reviewed by a human. */
  isReviewed: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type QuizItem = z.infer<typeof QuizItemSchema>;

// ============================================================================
// QUIZ ATTEMPT
// ============================================================================

export const FieldScoreSchema = z.object({
  earned: z.number(),
  max: z.number(),
  matched: z.array(z.string()),
  missed: z.array(z.string()),
});

export type FieldScore = z.infer<typeof FieldScoreSchema>;

export const QuizAttemptSchema = z.object({
  id: z.string().min(1),
  /** Learner identifier (may be anonymous). */
  learnerId: z.string().optional(),
  /** Session identifier. */
  sessionId: z.string().min(1),
  /** FK to the QuizItem attempted. */
  quizItemId: z.string().min(1),
  /** Learner's selected answers keyed by field name. */
  selectedAnswers: z.record(
    z.string(),
    z.union([z.string(), z.array(z.string())])
  ),
  /** Points earned. */
  score: z.number(),
  /** Maximum possible score. */
  maxScore: z.number(),
  /** Score as a percentage (0-100). */
  percentage: z.number(),
  /** Per-field scoring breakdown. */
  fieldScores: z.record(z.string(), FieldScoreSchema).optional(),
  /** Whether the learner made a dangerous misidentification. */
  isDangerous: z.boolean(),
  /** Time spent on this attempt in seconds. */
  timeSpentSeconds: z.number().optional(),
  /** Whether the learner reviewed the explanation afterwards. */
  reviewedExplanation: z.boolean(),
  createdAt: z.string(),
});

export type QuizAttempt = z.infer<typeof QuizAttemptSchema>;

// ============================================================================
// CASE-BASED LEARNING: QUESTIONS & MODULES
// ============================================================================

export const AnswerOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  isCorrect: z.boolean(),
  explanation: z.string().optional(),
});

export type AnswerOption = z.infer<typeof AnswerOptionSchema>;

export const CaseQuestionSchema = z.object({
  id: z.string().min(1),
  type: QuestionTypeSchema,
  /** The question stem presented to the learner. */
  stem: z.string().min(1),
  /** Additional clinical context for the question. */
  context: z.string().optional(),
  /** Answer options. */
  answers: z.array(AnswerOptionSchema).min(1),
  /** For ranking/ordering questions, the correct sequence of answer ids. */
  correctOrder: z.array(z.string().min(1)).optional(),
  /** Answer ids that represent dangerous or high-stakes mistakes. */
  dangerousAnswers: z.array(z.string().min(1)).optional(),
});

export type CaseQuestion = z.infer<typeof CaseQuestionSchema>;

export const CaseModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** The primary condition this case addresses. */
  conditionId: z.string().min(1),
  /** Brief demographic and chief-complaint summary. */
  patientSummary: z.string().min(1),
  /** Detailed history of present illness. */
  clinicalHistory: z.string().min(1),
  /** Physical examination findings. */
  examFindings: z.string().min(1),
  /** Ids of ImageAsset entries presented with the case. */
  imageAssetIds: z.array(z.string().min(1)).optional(),
  /** Ordered sequence of questions. */
  questions: z.array(CaseQuestionSchema).min(1),
  /** Estimated time in minutes to complete the module. */
  estimatedMinutes: z.number().int().positive().optional(),
  /** Tags for filtering / search. */
  tags: z.array(z.string()).optional(),
  /** Difficulty level of this case module. */
  difficulty: DifficultyLevelSchema,
  /** FK to the dataset this case was derived from. */
  datasetSourceId: z.string().optional(),
});

export type CaseModule = z.infer<typeof CaseModuleSchema>;

// ============================================================================
// COMPARE MODULE
// ============================================================================

export const DistinguishingFeatureSchema = z.object({
  /** Name of the clinical feature being compared. */
  feature: z.string().min(1),
  /** Maps condition id to that feature's description. */
  values: z.record(z.string(), z.string()),
});

export type DistinguishingFeature = z.infer<typeof DistinguishingFeatureSchema>;

export const CompareModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** The two (or more) conditions being compared. */
  conditionIds: z.array(z.string().min(1)).min(2),
  /** Shared features common to all compared conditions. */
  commonFeatures: z.array(z.string()),
  /** Feature-by-feature comparison across the conditions. */
  distinguishingFeatures: z.array(DistinguishingFeatureSchema),
  /** A diagnostic pitfall that is dangerous to overlook. */
  dangerousPitfall: z.string().optional(),
  /** High-yield clinical pearl for rapid differentiation. */
  pearl: z.string().optional(),
  /** Side-by-side image asset ids grouped by condition id. */
  imageGroups: z.record(z.string(), z.array(z.string())).optional(),
  tags: z.array(z.string()).optional(),
});

export type CompareModule = z.infer<typeof CompareModuleSchema>;

// ============================================================================
// SIMULATION MODULE
// ============================================================================

export const SimulationTargetZoneSchema = z.object({
  id: z.string().min(1),
  /** Label for this target zone. */
  label: z.string().min(1),
  /** Geometric region definition. */
  region: z.object({
    type: z.enum(["circle", "rect", "polygon"]),
    coordinates: z.array(z.number()),
    radiusPx: z.number().optional(),
  }),
  /** Quality of selecting this zone as a target. */
  quality: z.enum(["ideal", "acceptable", "poor", "dangerous"]),
  /** Explanation of why this zone has the given quality rating. */
  explanation: z.string().min(1),
});

export type SimulationTargetZone = z.infer<typeof SimulationTargetZoneSchema>;

export const SimulationChoiceOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  explanation: z.string().min(1),
  isCorrect: z.boolean(),
  isDangerous: z.boolean().optional(),
});

export type SimulationChoiceOption = z.infer<
  typeof SimulationChoiceOptionSchema
>;

export const SimulationProcedureStepSchema = z.object({
  order: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  tips: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
});

export type SimulationProcedureStep = z.infer<
  typeof SimulationProcedureStepSchema
>;

export const SimulationProcedureTargetZoneSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  /** Relative coordinates from 0 to 1 in image space. */
  shape: z.enum(["circle", "rect"]),
  coordinates: z.array(z.number()),
  quality: z.enum(["ideal", "acceptable", "poor", "dangerous"]),
  explanation: z.string().min(1),
});

export type SimulationProcedureTargetZone = z.infer<
  typeof SimulationProcedureTargetZoneSchema
>;

export const SimulationPathologyReportSchema = z.object({
  title: z.string().min(1),
  specimen: z.string().optional(),
  diagnosis: z.string().min(1),
  findings: z.array(z.string().min(1)).min(1),
  limitations: z.string().optional(),
});

export type SimulationPathologyReport = z.infer<
  typeof SimulationPathologyReportSchema
>;

export const SimulationModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** The type of simulation. */
  type: SimulationModuleTypeSchema,
  /** FK to the related condition, if applicable. */
  conditionId: z.string().optional(),
  /** Description of the simulation scenario. */
  description: z.string().min(1),
  /** Learning objectives. */
  objectives: z.array(z.string()),
  /** FK to the image used in this simulation. */
  imageAssetId: z.string().optional(),
  difficulty: DifficultyLevelSchema,
  /** Brief clinical context / case stem. */
  caseStem: z.string().optional(),
  /** The correct choice for biopsy_choice type. */
  correctChoice: z.string().optional(),
  /** Choice options for biopsy_choice type. */
  choiceOptions: z.array(SimulationChoiceOptionSchema).optional(),
  /** Target zones for target_selector type. */
  targetZones: z.array(SimulationTargetZoneSchema).optional(),
  /** Procedure steps for procedure_sequence type. */
  procedureSteps: z.array(SimulationProcedureStepSchema).optional(),
  /** Prompt for equipment selection in an interactive procedure sim. */
  equipmentPrompt: z.string().optional(),
  /** Equipment choices for interactive procedure sims. */
  equipmentChoices: z.array(SimulationChoiceOptionSchema).optional(),
  /** Prompt for anesthesia selection in an interactive procedure sim. */
  anesthesiaPrompt: z.string().optional(),
  /** Anesthesia choices for interactive procedure sims. */
  anesthesiaChoices: z.array(SimulationChoiceOptionSchema).optional(),
  /** Prompt for lesion targeting in an interactive procedure sim. */
  procedureTargetPrompt: z.string().optional(),
  /** Relative lesion target zones for interactive procedure sims. */
  procedureTargetZones: z
    .array(SimulationProcedureTargetZoneSchema)
    .optional(),
  /** Educational pathology summary revealed after the biopsy step. */
  pathologyReport: SimulationPathologyReportSchema.optional(),
  /** Prompt for next-step / follow-up planning. */
  followUpPrompt: z.string().optional(),
  /** Follow-up planning choices. */
  followUpChoices: z.array(SimulationChoiceOptionSchema).optional(),
  /** Optional label for the procedure checklist panel. */
  procedureChecklistTitle: z.string().optional(),
  /** Post-activity explanation. */
  explanation: z.string().min(1),
  tags: z.array(z.string()).optional(),
  /** Whether this simulation module is active. */
  isActive: z.boolean(),
  createdAt: z.string(),
});

export type SimulationModule = z.infer<typeof SimulationModuleSchema>;

// ============================================================================
// REVIEW QUEUE ITEM
// ============================================================================

export const ReviewQueueItemSchema = z.object({
  id: z.string().min(1),
  /** FK to the image being reviewed. */
  imageAssetId: z.string().min(1),
  /** FK to a specific annotation under review, if applicable. */
  imageAnnotationId: z.string().optional(),
  /** The set of proposed annotations for review. */
  proposedAnnotations: z.array(ImageAnnotationSchema),
  /** Current review status. */
  status: ReviewStatusSchema,
  /** Notes from the reviewer. */
  reviewerNotes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ReviewQueueItem = z.infer<typeof ReviewQueueItemSchema>;

// ============================================================================
// LEARNER PROGRESS
// ============================================================================

export const ModuleTypeSchema = z.enum([
  "case",
  "procedure",
  "compare",
  "morphology_quiz",
  "quiz_item",
  "simulation",
]);

export type ModuleType = z.infer<typeof ModuleTypeSchema>;

export const QuestionResultSchema = z.object({
  questionId: z.string().min(1),
  correct: z.boolean(),
  /** Submitted answer (serialized). */
  givenAnswer: z.string().optional(),
  /** Time spent on this question in seconds. */
  timeSpentSeconds: z.number().nonnegative().optional(),
});

export type QuestionResult = z.infer<typeof QuestionResultSchema>;

export const LearnerProgressSchema = z.object({
  id: z.string().min(1),
  /** Learner identifier (user id or anonymous session id). */
  learnerId: z.string().min(1),
  moduleType: ModuleTypeSchema,
  moduleId: z.string().min(1),
  /** Whether the module has been completed at least once. */
  completed: z.boolean(),
  /** Number of times the module has been attempted. */
  attempts: z.number().int().nonnegative(),
  /** Best score achieved (0-100 percentage). */
  bestScore: z.number().min(0).max(100).optional(),
  /** Most recent score (0-100 percentage). */
  lastScore: z.number().min(0).max(100).optional(),
  /** Per-question results from the most recent attempt. */
  questionResults: z.array(QuestionResultSchema).optional(),
  /** Total time spent across all attempts in seconds. */
  totalTimeSeconds: z.number().nonnegative().optional(),
  /** Bookmarked for later review. */
  bookmarked: z.boolean().optional(),
  /** Personal notes on the module. */
  personalNotes: z.string().optional(),
  /** Concept areas where the learner is weakest. */
  weakConcepts: z.array(z.string()).optional(),
  /** ISO-8601 timestamp of the first interaction. */
  startedAt: z.string().optional(),
  /** ISO-8601 timestamp of the latest interaction. */
  lastInteractionAt: z.string().optional(),
  /** ISO-8601 timestamp of first completion, if completed. */
  completedAt: z.string().optional(),
});

export type LearnerProgress = z.infer<typeof LearnerProgressSchema>;

// ============================================================================
// MORPHOLOGY TERM (GLOSSARY)
// ============================================================================

export const ConfusionPointSchema = z.object({
  /** The term this is commonly confused with. */
  confusedWith: z.string().min(1),
  /** How to distinguish the two. */
  distinction: z.string().min(1),
});

export type ConfusionPoint = z.infer<typeof ConfusionPointSchema>;

export const MorphologyTermSchema = z.object({
  id: z.string().min(1),
  /** The morphology term (e.g. "macule", "papule", "plaque"). */
  term: z.string().min(1),
  /** Clear definition suitable for learners. */
  definition: z.string().min(1),
  /** Terms commonly confused with this one and how to differentiate. */
  confusionPoints: z.array(ConfusionPointSchema).optional(),
  /** Ids of related MorphologyTerm entries. */
  relatedTerms: z.array(z.string()).optional(),
  category: MorphologyTermCategorySchema,
  /** Example image asset ids illustrating the term. */
  imageAssetIds: z.array(z.string()).optional(),
  /** Mnemonic or memory aid. */
  mnemonic: z.string().optional(),
});

export type MorphologyTerm = z.infer<typeof MorphologyTermSchema>;

// ============================================================================
// PROCEDURE MODULE
// ============================================================================

export const ProcedureStepSchema = z.object({
  order: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  /** Clinical pearls relevant to this step. */
  tips: z.array(z.string()).optional(),
  /** Important warnings or safety notes. */
  warnings: z.array(z.string()).optional(),
  /** Illustrative image or diagram for the step. */
  imageAssetId: z.string().min(1).optional(),
});

export type ProcedureStep = z.infer<typeof ProcedureStepSchema>;

export const ProcedureModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** Learning objectives for the procedure. */
  objectives: z.array(z.string().min(1)),
  /** Clinical indications for performing the procedure. */
  indications: z.array(z.string().min(1)),
  /** Contraindications (absolute and relative). */
  contraindications: z.array(z.string().min(1)).optional(),
  /** Equipment and materials required. */
  equipment: z.array(z.string().min(1)).optional(),
  /** Ordered procedural steps. */
  steps: z.array(ProcedureStepSchema).min(1),
  /** Frequently observed mistakes to avoid. */
  commonErrors: z.array(z.string()).optional(),
  /** Related condition ids. */
  conditionIds: z.array(z.string().min(1)).optional(),
  /** Video URL for procedure demonstration. */
  videoUrl: z.string().url().optional(),
  /** Estimated time in minutes. */
  estimatedMinutes: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
});

export type ProcedureModule = z.infer<typeof ProcedureModuleSchema>;

// ============================================================================
// VLM ANNOTATION REQUEST
// ============================================================================

export const VLMAnnotationRequestSchema = z.object({
  id: z.string().min(1),
  /** FK to the image being annotated. */
  imageAssetId: z.string().min(1),
  /** Provider of the vision-language model (e.g. "anthropic", "openai"). */
  modelProvider: z.string().min(1),
  /** Specific model identifier (e.g. "claude-opus-4-20250514"). */
  modelId: z.string().min(1),
  /** The prompt template used for annotation. */
  promptTemplate: z.string().min(1),
  /** Raw text response from the model. */
  rawResponse: z.string().optional(),
  /** Annotations parsed from the model response. */
  parsedAnnotations: z
    .array(ImageAnnotationSchema.partial().required({ conceptType: true, conceptValue: true }))
    .optional(),
  /** Overall confidence score from 0 to 1. */
  confidence: z.number().min(0).max(1).optional(),
  /** Time taken for the model to respond in milliseconds. */
  processingTimeMs: z.number().optional(),
  createdAt: z.string(),
});

export type VLMAnnotationRequest = z.infer<typeof VLMAnnotationRequestSchema>;

// ============================================================================
// LEGACY COMPATIBILITY ALIASES
// ============================================================================

/**
 * MorphologyRubric and MorphologyQuizItem are retained as type aliases
 * so that downstream code referencing them continues to compile.
 * New code should use QuizItem instead of MorphologyQuizItem.
 */

export const MorphologyRubricSchema = z.object({
  id: z.string().min(1),
  featureKey: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  levels: z
    .array(
      z.object({
        score: z.number().int().nonnegative(),
        label: z.string().min(1),
        criteria: z.string().min(1),
      })
    )
    .min(2),
});

export type MorphologyRubric = z.infer<typeof MorphologyRubricSchema>;

export const MorphologyQuizItemSchema = z.object({
  id: z.string().min(1),
  rubricId: z.string().min(1),
  prompt: z.string().min(1),
  image: ImageAssetSchema,
  correctScore: z.number().int().nonnegative(),
  explanation: z.string().min(1),
  tolerance: z.number().int().nonnegative().optional(),
});

export type MorphologyQuizItem = z.infer<typeof MorphologyQuizItemSchema>;

// ---------------------------------------------------------------------------
// Inline License (legacy - previously embedded in ImageAsset)
// ---------------------------------------------------------------------------

export const InlineLicenseSchema = z.object({
  spdxId: z.string().min(1),
  attribution: z.string().min(1),
  sourceUrl: z.string().url().optional(),
  restrictions: z.array(z.string()).readonly().optional(),
});

export type InlineLicense = z.infer<typeof InlineLicenseSchema>;
