#!/usr/bin/env tsx
/**
 * Quiz Seed Generator
 *
 * Usage: npx tsx scripts/build-quiz-seeds.ts [--dry-run]
 *
 * Reads generated image/annotation JSONs and creates QuizItem records for
 * images with sufficient annotation data.
 *
 * Question types generated:
 *   1. image_description  - "Describe the visible morphology" (concept selection)
 *   2. single_select      - "What is the most likely diagnosis?"
 *   3. differential_rank  - "Rank your top 3 differentials"
 *   4. biopsy_decision    - For skin cancer cases
 *
 * Philosophy: observation first, diagnosis second. Each quiz item uses
 * image-specific annotations as the answer key, NOT disease-level assumptions.
 * Features that are disease-typical but NOT confirmed in the image annotation
 * are listed in forbiddenAssumptions.
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

interface CliArgs {
  dryRun: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const opts: CliArgs = { dryRun: false };
  for (const arg of args) {
    if (arg === "--dry-run") opts.dryRun = true;
  }
  return opts;
}

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

function log(msg: string): void {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${msg}`);
}

function logError(msg: string): void {
  const ts = new Date().toISOString();
  console.error(`[${ts}] ERROR: ${msg}`);
}

// ---------------------------------------------------------------------------
// Types for input data
// ---------------------------------------------------------------------------

interface ImageAssetRecord {
  id: string;
  externalImageId: string;
  datasetSource: string;
  filename: string;
  altText: string;
  modality: string;
  skinTone?: string;
  storagePath: string;
  metadata: Record<string, string | undefined>;
}

interface AnnotationRecord {
  id: string;
  imageAssetId: string;
  provenance: string;
  conditionId?: string;
  conditionLabel: string;
  bodySite?: string;
  skinTone?: string;
  morphologyTags: string[];
  clinicalFeatures?: string[];
  notes: string;
  reviewStatus: string;
}

// ---------------------------------------------------------------------------
// Quiz item output types
// ---------------------------------------------------------------------------

type QuizQuestionType =
  | "image_description"
  | "single_select"
  | "differential_rank"
  | "biopsy_decision";

type DifficultyLevel = "beginner" | "intermediate" | "advanced";

interface QuizAnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface QuizItem {
  id: string;
  imageAssetId: string;
  datasetSource: string;
  conditionId?: string;
  conditionLabel: string;
  questionType: QuizQuestionType;
  difficulty: DifficultyLevel;
  stem: string;
  context?: string;
  answers: QuizAnswerOption[];
  correctOrder?: string[];
  /** Morphology tags confirmed visible in the image annotation. */
  confirmedMorphology: string[];
  /**
   * Disease-typical features NOT confirmed in the specific image.
   * These must NOT be assumed by the learner from diagnosis alone.
   */
  forbiddenAssumptions: string[];
  /** Tags for filtering. */
  tags: string[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Condition knowledge base (for generating distractors + forbidden assumptions)
// ---------------------------------------------------------------------------

interface ConditionKnowledge {
  name: string;
  category: string;
  typicalFeatures: string[];
  differentials: string[];
  isCancer: boolean;
  biopsyRelevant: boolean;
}

const CONDITION_KB: Record<string, ConditionKnowledge> = {
  "c0000001-0001-4000-8000-000000000001": {
    name: "Plaque Psoriasis",
    category: "papulosquamous",
    typicalFeatures: [
      "well-demarcated borders",
      "silvery-white scale",
      "erythematous plaque",
      "Auspitz sign",
      "nail pitting",
      "extensor distribution",
    ],
    differentials: ["Atopic Dermatitis", "Tinea Corporis", "Seborrheic Dermatitis", "Mycosis Fungoides"],
    isCancer: false,
    biopsyRelevant: false,
  },
  "c0000001-0002-4000-8000-000000000001": {
    name: "Atopic Dermatitis",
    category: "eczematous",
    typicalFeatures: [
      "poorly demarcated borders",
      "fine scale",
      "lichenification",
      "excoriations",
      "flexural distribution",
      "xerosis",
    ],
    differentials: ["Plaque Psoriasis", "Contact Dermatitis", "Tinea Corporis", "Seborrheic Dermatitis"],
    isCancer: false,
    biopsyRelevant: false,
  },
  "c0000001-0003-4000-8000-000000000001": {
    name: "Basal Cell Carcinoma",
    category: "skin_cancer",
    typicalFeatures: [
      "pearly papule",
      "arborizing telangiectasia",
      "rolled borders",
      "central ulceration",
      "translucent surface",
    ],
    differentials: ["Squamous Cell Carcinoma", "Melanoma", "Seborrheic Keratosis", "Dermal Nevus"],
    isCancer: true,
    biopsyRelevant: true,
  },
  "c0000001-0004-4000-8000-000000000001": {
    name: "Melanoma",
    category: "skin_cancer",
    typicalFeatures: [
      "asymmetry",
      "border irregularity",
      "color variegation",
      "diameter >6mm",
      "evolution",
      "ulceration",
    ],
    differentials: ["Seborrheic Keratosis", "Dysplastic Nevus", "Basal Cell Carcinoma", "Pyogenic Granuloma"],
    isCancer: true,
    biopsyRelevant: true,
  },
  "c0000001-0005-4000-8000-000000000001": {
    name: "Tinea Corporis",
    category: "infection",
    typicalFeatures: [
      "annular plaque",
      "central clearing",
      "raised scaly border",
      "trailing scale",
      "pruritic",
    ],
    differentials: ["Plaque Psoriasis", "Granuloma Annulare", "Nummular Eczema", "Pityriasis Rosea"],
    isCancer: false,
    biopsyRelevant: false,
  },
  "c0000001-0006-4000-8000-000000000001": {
    name: "Contact Dermatitis",
    category: "eczematous",
    typicalFeatures: [
      "geometric distribution",
      "vesicles",
      "weeping",
      "crusting",
      "sharp cutoff at contactant edge",
      "pruritic",
    ],
    differentials: ["Atopic Dermatitis", "Tinea Corporis", "Irritant Dermatitis", "Dyshidrotic Eczema"],
    isCancer: false,
    biopsyRelevant: false,
  },
  "c0000001-0007-4000-8000-000000000001": {
    name: "Acne Vulgaris",
    category: "acne_rosacea",
    typicalFeatures: [
      "comedones",
      "papules",
      "pustules",
      "nodules",
      "T-zone distribution",
    ],
    differentials: ["Rosacea", "Folliculitis", "Perioral Dermatitis", "Milia"],
    isCancer: false,
    biopsyRelevant: false,
  },
  "c0000001-0008-4000-8000-000000000001": {
    name: "Squamous Cell Carcinoma",
    category: "skin_cancer",
    typicalFeatures: [
      "firm keratotic nodule",
      "adherent thick scale",
      "cutaneous horn",
      "indurated base",
      "ulceration",
    ],
    differentials: ["Basal Cell Carcinoma", "Actinic Keratosis", "Keratoacanthoma", "Seborrheic Keratosis"],
    isCancer: true,
    biopsyRelevant: true,
  },
  "c0000001-0009-4000-8000-000000000001": {
    name: "Seborrheic Keratosis",
    category: "benign_lesion",
    typicalFeatures: [
      "stuck-on appearance",
      "waxy surface",
      "verrucous surface",
      "horn cysts",
      "well-demarcated",
    ],
    differentials: ["Melanoma", "Basal Cell Carcinoma", "Squamous Cell Carcinoma", "Pigmented Actinic Keratosis"],
    isCancer: false,
    biopsyRelevant: false,
  },
  "c0000001-0010-4000-8000-000000000001": {
    name: "Herpes Zoster",
    category: "infection",
    typicalFeatures: [
      "grouped vesicles",
      "dermatomal distribution",
      "unilateral",
      "erythematous base",
      "prodromal pain",
    ],
    differentials: ["Herpes Simplex", "Contact Dermatitis", "Bullous Impetigo", "Dermatitis Herpetiformis"],
    isCancer: false,
    biopsyRelevant: false,
  },
};

// ---------------------------------------------------------------------------
// UUID generation
// ---------------------------------------------------------------------------

function deterministicUuid(prefix: string, seed: string): string {
  let hash = 0;
  const str = `${prefix}:${seed}`;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `${prefix}-${hex}-4000-8000-${seed
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 12)
    .padEnd(12, "0")}`;
}

// ---------------------------------------------------------------------------
// Quiz item generators
// ---------------------------------------------------------------------------

function generateImageDescriptionQuiz(
  asset: ImageAssetRecord,
  annotation: AnnotationRecord,
  kb: ConditionKnowledge
): QuizItem {
  const confirmedTags = annotation.morphologyTags ?? [];
  const clinicalFeatures = annotation.clinicalFeatures ?? [];
  const allConfirmed = Array.from(new Set([...confirmedTags, ...clinicalFeatures]));

  // Forbidden assumptions: disease features NOT in this image's annotation
  const forbiddenAssumptions = kb.typicalFeatures.filter(
    (f) =>
      !allConfirmed.some(
        (c) => c.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(c.toLowerCase())
      )
  );

  // Build concept answers from confirmed morphology
  const correctConcepts = allConfirmed.slice(0, 5);
  const distractorConcepts = forbiddenAssumptions.slice(0, 3);

  const answers: QuizAnswerOption[] = [
    ...correctConcepts.map((concept, i) => ({
      id: `correct-${i}`,
      text: concept,
      isCorrect: true,
      explanation: `This feature is directly visible in this specific image.`,
    })),
    ...distractorConcepts.map((concept, i) => ({
      id: `distractor-${i}`,
      text: concept,
      isCorrect: false,
      explanation: `This is a typical feature of ${kb.name} but is NOT visually confirmed in this specific image. Observation first, diagnosis second.`,
    })),
  ];

  return {
    id: deterministicUuid("quiz-desc", `${asset.id}:description`),
    imageAssetId: asset.id,
    datasetSource: asset.datasetSource,
    conditionId: annotation.conditionId,
    conditionLabel: annotation.conditionLabel,
    questionType: "image_description",
    difficulty: "beginner",
    stem: "Examine this clinical image carefully. Select ONLY the morphological features that are directly visible in this image. Do not select features based on diagnosis alone.",
    context: annotation.bodySite
      ? `Body site: ${annotation.bodySite}`
      : undefined,
    answers,
    confirmedMorphology: allConfirmed,
    forbiddenAssumptions,
    tags: [kb.category, "morphology", "observation-first"],
    createdAt: new Date().toISOString(),
  };
}

function generateSingleSelectQuiz(
  asset: ImageAssetRecord,
  annotation: AnnotationRecord,
  kb: ConditionKnowledge
): QuizItem {
  const correctAnswer: QuizAnswerOption = {
    id: "correct",
    text: kb.name,
    isCorrect: true,
    explanation: `Correct. The visible morphology supports ${kb.name}. Key features: ${(annotation.morphologyTags ?? []).join(", ") || "see annotation"}.`,
  };

  const distractorAnswers: QuizAnswerOption[] = kb.differentials
    .slice(0, 3)
    .map((d, i) => ({
      id: `distractor-${i}`,
      text: d,
      isCorrect: false,
      explanation: `Incorrect. While ${d} may share some features, the specific morphology visible in this image is more consistent with ${kb.name}.`,
    }));

  const answers = shuffleDeterministic(
    [correctAnswer, ...distractorAnswers],
    asset.id
  );

  return {
    id: deterministicUuid("quiz-dx", `${asset.id}:single_select`),
    imageAssetId: asset.id,
    datasetSource: asset.datasetSource,
    conditionId: annotation.conditionId,
    conditionLabel: annotation.conditionLabel,
    questionType: "single_select",
    difficulty: "intermediate",
    stem: "Based on the visible morphology in this clinical image, what is the most likely diagnosis?",
    context: annotation.bodySite
      ? `Body site: ${annotation.bodySite}`
      : undefined,
    answers,
    confirmedMorphology: annotation.morphologyTags ?? [],
    forbiddenAssumptions: kb.typicalFeatures.filter(
      (f) =>
        !(annotation.morphologyTags ?? []).some(
          (c) => c.toLowerCase().includes(f.toLowerCase())
        )
    ),
    tags: [kb.category, "diagnosis"],
    createdAt: new Date().toISOString(),
  };
}

function generateDifferentialRankQuiz(
  asset: ImageAssetRecord,
  annotation: AnnotationRecord,
  kb: ConditionKnowledge
): QuizItem {
  const allOptions = [kb.name, ...kb.differentials.slice(0, 3)];
  const answers: QuizAnswerOption[] = allOptions.map((name, i) => ({
    id: `option-${i}`,
    text: name,
    isCorrect: i === 0, // first is the correct diagnosis
    explanation:
      i === 0
        ? `Most likely. The visible morphology best fits ${name}.`
        : `Less likely. Consider this in the differential but the specific features visible here favor ${kb.name}.`,
  }));

  return {
    id: deterministicUuid("quiz-ddx", `${asset.id}:differential_rank`),
    imageAssetId: asset.id,
    datasetSource: asset.datasetSource,
    conditionId: annotation.conditionId,
    conditionLabel: annotation.conditionLabel,
    questionType: "differential_rank",
    difficulty: "advanced",
    stem: "Rank the following diagnoses from most likely to least likely based on the visible morphology.",
    context: annotation.bodySite
      ? `Body site: ${annotation.bodySite}`
      : undefined,
    answers,
    correctOrder: answers.map((a) => a.id),
    confirmedMorphology: annotation.morphologyTags ?? [],
    forbiddenAssumptions: [],
    tags: [kb.category, "differential-diagnosis"],
    createdAt: new Date().toISOString(),
  };
}

function generateBiopsyDecisionQuiz(
  asset: ImageAssetRecord,
  annotation: AnnotationRecord,
  kb: ConditionKnowledge
): QuizItem | null {
  if (!kb.biopsyRelevant) return null;

  const isMelanoma = kb.name === "Melanoma";

  const answers: QuizAnswerOption[] = isMelanoma
    ? [
        {
          id: "excisional",
          text: "Excisional biopsy with 1-3mm margins",
          isCorrect: true,
          explanation:
            "Correct. Excisional biopsy is the gold standard for suspected melanoma, preserving Breslow depth measurement.",
        },
        {
          id: "shave",
          text: "Shave biopsy",
          isCorrect: false,
          explanation:
            "Incorrect. Shave biopsy may transect the deepest portion, making accurate Breslow depth measurement impossible. This is a dangerous approach for suspected melanoma.",
        },
        {
          id: "observe",
          text: "Dermoscopic monitoring in 3 months",
          isCorrect: false,
          explanation:
            "Incorrect. With features suspicious for melanoma, observation alone is inappropriate. Biopsy is indicated.",
        },
        {
          id: "wide-excision",
          text: "Wide local excision with 2cm margins",
          isCorrect: false,
          explanation:
            "Incorrect. Diagnostic biopsy must precede definitive excision. Margins are determined by Breslow depth.",
        },
      ]
    : [
        {
          id: "biopsy-yes",
          text: "Biopsy is indicated for histopathologic confirmation",
          isCorrect: true,
          explanation: `Correct. Biopsy confirms the diagnosis and guides treatment planning for ${kb.name}.`,
        },
        {
          id: "treat-empiric",
          text: "Treat empirically without biopsy",
          isCorrect: false,
          explanation:
            "Incorrect. For suspected skin malignancy, histopathologic confirmation should precede definitive treatment.",
        },
        {
          id: "observe-only",
          text: "No biopsy needed, clinical diagnosis is sufficient",
          isCorrect: false,
          explanation:
            "Incorrect. Skin cancers require histopathologic confirmation for accurate subtyping and treatment planning.",
        },
        {
          id: "topical-trial",
          text: "Trial of topical treatment first",
          isCorrect: false,
          explanation:
            "Incorrect. Delaying biopsy of a suspected malignancy for a topical treatment trial is inappropriate.",
        },
      ];

  return {
    id: deterministicUuid("quiz-bx", `${asset.id}:biopsy_decision`),
    imageAssetId: asset.id,
    datasetSource: asset.datasetSource,
    conditionId: annotation.conditionId,
    conditionLabel: annotation.conditionLabel,
    questionType: "biopsy_decision",
    difficulty: "advanced",
    stem: isMelanoma
      ? "This lesion is suspicious for melanoma. What is the most appropriate biopsy technique?"
      : `Given the clinical suspicion for ${kb.name}, what is the appropriate next step regarding tissue diagnosis?`,
    context: annotation.bodySite
      ? `Body site: ${annotation.bodySite}`
      : undefined,
    answers,
    confirmedMorphology: annotation.morphologyTags ?? [],
    forbiddenAssumptions: [],
    tags: [kb.category, "biopsy", "skin-cancer", "management"],
    createdAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Deterministic shuffle (for consistent answer order per image)
// ---------------------------------------------------------------------------

function shuffleDeterministic<T>(arr: T[], seed: string): T[] {
  const result = [...arr];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  for (let i = result.length - 1; i > 0; i--) {
    hash = ((hash << 5) - hash + i) | 0;
    const j = Math.abs(hash) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function buildQuizSeeds(opts: CliArgs): void {
  log("=== Quiz Seed Generator ===");

  const generatedDir = path.resolve("src/data/generated");

  // Discover all image/annotation JSON files
  const imageFiles: string[] = [];
  const annotationFiles: string[] = [];

  if (fs.existsSync(generatedDir)) {
    const files = fs.readdirSync(generatedDir);
    for (const f of files) {
      if (f.endsWith("-images.json")) imageFiles.push(path.join(generatedDir, f));
      if (f.endsWith("-annotations.json")) annotationFiles.push(path.join(generatedDir, f));
    }
  }

  if (imageFiles.length === 0) {
    logError("No generated image JSON files found in src/data/generated/");
    logError("Run import scripts first:");
    logError("  npx tsx scripts/import-scin.ts");
    logError("  npx tsx scripts/import-pad-ufes-20.ts");
    process.exit(1);
  }

  log(`Found ${imageFiles.length} image file(s) and ${annotationFiles.length} annotation file(s)`);

  // Load all records
  const allImages: ImageAssetRecord[] = [];
  const allAnnotations: AnnotationRecord[] = [];

  for (const f of imageFiles) {
    try {
      const data = JSON.parse(fs.readFileSync(f, "utf-8"));
      allImages.push(...data);
      log(`  Loaded ${data.length} images from ${path.basename(f)}`);
    } catch (e) {
      logError(`Failed to parse ${f}: ${e}`);
    }
  }

  for (const f of annotationFiles) {
    try {
      const data = JSON.parse(fs.readFileSync(f, "utf-8"));
      allAnnotations.push(...data);
      log(`  Loaded ${data.length} annotations from ${path.basename(f)}`);
    } catch (e) {
      logError(`Failed to parse ${f}: ${e}`);
    }
  }

  // Index annotations by imageAssetId
  const annotationsByImage = new Map<string, AnnotationRecord[]>();
  for (const ann of allAnnotations) {
    const list = annotationsByImage.get(ann.imageAssetId) ?? [];
    list.push(ann);
    annotationsByImage.set(ann.imageAssetId, list);
  }

  // Generate quiz items
  const quizItems: QuizItem[] = [];
  const stats = {
    totalImages: allImages.length,
    imagesWithAnnotations: 0,
    imagesSkippedNoAnnotation: 0,
    imagesSkippedNoCondition: 0,
    quizItemsByType: new Map<string, number>(),
    quizItemsByCondition: new Map<string, number>(),
    quizItemsByDifficulty: new Map<string, number>(),
  };

  for (const asset of allImages) {
    const annotations = annotationsByImage.get(asset.id) ?? [];

    // Need at least one dataset_native annotation
    const nativeAnnotation = annotations.find((a) => a.provenance === "dataset_native");
    if (!nativeAnnotation) {
      stats.imagesSkippedNoAnnotation++;
      continue;
    }

    // Need a mapped condition for quiz generation
    if (!nativeAnnotation.conditionId) {
      stats.imagesSkippedNoCondition++;
      continue;
    }

    const kb = CONDITION_KB[nativeAnnotation.conditionId];
    if (!kb) {
      stats.imagesSkippedNoCondition++;
      continue;
    }

    stats.imagesWithAnnotations++;

    // Generate each question type
    const generators = [
      () => generateImageDescriptionQuiz(asset, nativeAnnotation, kb),
      () => generateSingleSelectQuiz(asset, nativeAnnotation, kb),
      () => generateDifferentialRankQuiz(asset, nativeAnnotation, kb),
      () => generateBiopsyDecisionQuiz(asset, nativeAnnotation, kb),
    ];

    for (const gen of generators) {
      const item = gen();
      if (item) {
        quizItems.push(item);

        // Track stats
        const typeCount = stats.quizItemsByType.get(item.questionType) ?? 0;
        stats.quizItemsByType.set(item.questionType, typeCount + 1);

        const condCount = stats.quizItemsByCondition.get(item.conditionLabel) ?? 0;
        stats.quizItemsByCondition.set(item.conditionLabel, condCount + 1);

        const diffCount = stats.quizItemsByDifficulty.get(item.difficulty) ?? 0;
        stats.quizItemsByDifficulty.set(item.difficulty, diffCount + 1);
      }
    }
  }

  // Report
  log("");
  log("=== QUIZ SEED GENERATION REPORT ===");
  log(`Total images: ${stats.totalImages}`);
  log(`Images with annotations: ${stats.imagesWithAnnotations}`);
  log(`Skipped (no annotation): ${stats.imagesSkippedNoAnnotation}`);
  log(`Skipped (no mapped condition): ${stats.imagesSkippedNoCondition}`);
  log(`Total quiz items generated: ${quizItems.length}`);

  log("");
  log("By question type:");
  for (const [type, count] of Array.from(stats.quizItemsByType.entries())) {
    log(`  ${type}: ${count}`);
  }

  log("");
  log("By condition:");
  for (const [cond, count] of Array.from(stats.quizItemsByCondition.entries()).sort((a, b) => b[1] - a[1])) {
    log(`  ${cond}: ${count}`);
  }

  log("");
  log("By difficulty:");
  for (const [diff, count] of Array.from(stats.quizItemsByDifficulty.entries())) {
    log(`  ${diff}: ${count}`);
  }

  if (opts.dryRun) {
    log("");
    log("DRY RUN: No files written.");
    return;
  }

  // Write output
  const outputPath = path.join(generatedDir, "quiz-items.json");
  fs.writeFileSync(outputPath, JSON.stringify(quizItems, null, 2), "utf-8");
  log("");
  log(`Output written to: ${outputPath}`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const opts = parseArgs();
buildQuizSeeds(opts);
