#!/usr/bin/env tsx
/**
 * VLM Annotation Proposal Generator
 *
 * Usage: npx tsx scripts/generate-annotation-proposals.ts [--provider mock|openai|anthropic] [--dry-run] [--limit N]
 *
 * Reads images that lack annotations beyond dataset_native provenance,
 * generates structured annotation proposals using a VLM, and writes them
 * to src/data/generated/annotation-proposals.json.
 *
 * Each proposal uses provenance: model_proposed and reviewStatus: pending.
 *
 * The VLM prompt follows the observation-first philosophy:
 *   - "Describe only what is visually supported by the image"
 *   - "Do not include disease features unless they are directly visible"
 *   - "If scale is not visible, do not say scale"
 *   - "Observation first, diagnosis second"
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

interface CliArgs {
  provider: string;
  dryRun: boolean;
  limit: number;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const opts: CliArgs = {
    provider: "mock",
    dryRun: false,
    limit: Infinity,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--provider":
        opts.provider = args[++i];
        break;
      case "--dry-run":
        opts.dryRun = true;
        break;
      case "--limit":
        opts.limit = parseInt(args[++i], 10);
        break;
      default:
        log(`Unknown flag: ${args[i]}`);
        process.exit(1);
    }
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
// Types
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
  metadata?: Record<string, string | undefined>;
}

interface AnnotationRecord {
  id: string;
  imageAssetId: string;
  provenance: string;
  conditionId?: string;
  conditionLabel: string;
  bodySite?: string;
  skinTone?: string;
  morphologyTags?: string[];
  reviewStatus: string;
}

interface StructuredAnnotation {
  /** Primary lesion types observed (e.g. papule, plaque, macule). */
  primaryLesions: string[];
  /** Secondary changes observed (e.g. scale, crust, erosion). */
  secondaryChanges: string[];
  /** Colors observed in the lesion(s). */
  colors: string[];
  /** Arrangement/configuration (e.g. annular, grouped, linear). */
  arrangement: string[];
  /** Distribution pattern (e.g. dermatomal, flexural, sun-exposed). */
  distribution: string[];
  /** Surface texture observations. */
  surfaceTexture: string[];
  /** Border characteristics. */
  borderCharacteristics: string[];
  /** Estimated body site if identifiable from image. */
  estimatedBodySite?: string;
  /** Free-text morphologic description, observation-only. */
  morphologyDescription: string;
  /** Differential diagnoses in order of likelihood. */
  differentialDiagnoses: string[];
  /** Features the model is uncertain about. */
  uncertainFeatures: string[];
  /** Confidence level: low, medium, high. */
  confidence: "low" | "medium" | "high";
}

interface AnnotationContext {
  existingAnnotations: AnnotationRecord[];
  datasetSource: string;
  metadata?: Record<string, string | undefined>;
}

// ---------------------------------------------------------------------------
// VLM Provider Abstraction
// ---------------------------------------------------------------------------

interface VisionAnnotationProvider {
  name: string;
  annotateImage(imagePath: string, context: AnnotationContext): Promise<StructuredAnnotation>;
}

// ---------------------------------------------------------------------------
// Observation-first prompt template
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a dermatology image annotation assistant. Your role is to describe the visible morphology of skin lesions with precision and objectivity.

CRITICAL RULES - Observation First Philosophy:
1. Describe ONLY what is visually supported by the image.
2. Do NOT include disease features unless they are DIRECTLY visible.
3. If scale is not visible, do NOT say scale.
4. If borders are not assessable, do NOT describe border characteristics.
5. Observation first, diagnosis second.
6. Use standard dermatological morphology terminology.
7. Be specific about colors, shapes, and textures you can actually see.
8. Note when a feature is ambiguous or uncertain.
9. Do NOT assume features from a suspected diagnosis.
10. Distinguish between what you SEE and what you INFER.

Respond with a structured JSON annotation following the StructuredAnnotation schema.`;

function buildUserPrompt(context: AnnotationContext): string {
  const parts: string[] = [
    "Examine this clinical dermatology image and provide a structured morphological annotation.",
    "",
    "Describe ONLY what you can directly observe in this specific image.",
    "Do NOT assume features based on a suspected diagnosis.",
    "",
  ];

  if (context.existingAnnotations.length > 0) {
    const existing = context.existingAnnotations[0];
    parts.push("Context from dataset metadata (for reference only, do not let this bias your observations):");
    if (existing.conditionLabel) {
      parts.push(`  Dataset label: ${existing.conditionLabel}`);
    }
    if (existing.bodySite) {
      parts.push(`  Reported body site: ${existing.bodySite}`);
    }
    parts.push("");
  }

  parts.push("Provide your annotation as a JSON object with these fields:");
  parts.push("- primaryLesions: string[] (e.g. papule, plaque, macule, vesicle, nodule)");
  parts.push("- secondaryChanges: string[] (e.g. scale, crust, erosion, ulceration, lichenification)");
  parts.push("- colors: string[] (specific colors seen: brown, erythematous, hyperpigmented, etc.)");
  parts.push("- arrangement: string[] (e.g. annular, grouped, linear, scattered)");
  parts.push("- distribution: string[] (e.g. dermatomal, flexural, localized)");
  parts.push("- surfaceTexture: string[] (e.g. smooth, verrucous, waxy, pearly)");
  parts.push("- borderCharacteristics: string[] (e.g. well-demarcated, ill-defined, rolled, irregular)");
  parts.push("- estimatedBodySite: string (if identifiable from image)");
  parts.push("- morphologyDescription: string (free-text, observation-only description)");
  parts.push("- differentialDiagnoses: string[] (ranked, based on visible morphology only)");
  parts.push("- uncertainFeatures: string[] (features you cannot confidently assess)");
  parts.push('- confidence: "low" | "medium" | "high"');

  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Mock Provider (for testing without VLM access)
// ---------------------------------------------------------------------------

class MockVisionProvider implements VisionAnnotationProvider {
  name = "mock";

  async annotateImage(
    _imagePath: string,
    context: AnnotationContext
  ): Promise<StructuredAnnotation> {
    // Generate plausible annotations based on dataset metadata
    const existingLabel =
      context.existingAnnotations[0]?.conditionLabel?.toLowerCase() ?? "";
    const bodySite = context.existingAnnotations[0]?.bodySite;

    // Mock annotations keyed by condition for realistic test data
    const mockAnnotations: Record<string, Partial<StructuredAnnotation>> = {
      psoriasis: {
        primaryLesions: ["plaque"],
        secondaryChanges: ["scale"],
        colors: ["erythematous", "silvery-white"],
        arrangement: ["well-circumscribed"],
        distribution: ["localized"],
        surfaceTexture: ["scaly"],
        borderCharacteristics: ["well-demarcated"],
        morphologyDescription:
          "Well-demarcated erythematous plaque with overlying silvery-white scale. The borders are sharply defined with an abrupt transition to normal-appearing surrounding skin.",
        differentialDiagnoses: ["Plaque Psoriasis", "Nummular Eczema", "Tinea Corporis"],
        confidence: "high" as const,
      },
      "atopic dermatitis": {
        primaryLesions: ["patch", "plaque"],
        secondaryChanges: ["scale", "excoriation"],
        colors: ["erythematous", "pink"],
        arrangement: ["confluent"],
        distribution: ["flexural"],
        surfaceTexture: ["dry", "rough"],
        borderCharacteristics: ["ill-defined", "blurred"],
        morphologyDescription:
          "Poorly demarcated erythematous patches with fine scale and scattered linear excoriations. The involved skin appears dry with subtle lichenification.",
        differentialDiagnoses: ["Atopic Dermatitis", "Contact Dermatitis", "Seborrheic Dermatitis"],
        confidence: "medium" as const,
      },
      "basal cell carcinoma": {
        primaryLesions: ["papule"],
        secondaryChanges: [],
        colors: ["pink", "pearly"],
        arrangement: ["solitary"],
        distribution: ["localized"],
        surfaceTexture: ["smooth", "pearly"],
        borderCharacteristics: ["rolled"],
        morphologyDescription:
          "Pearly pink papule with a smooth, translucent surface. Telangiectatic vessels are visible across the surface. The borders appear rolled.",
        differentialDiagnoses: ["Basal Cell Carcinoma", "Dermal Nevus", "Amelanotic Melanoma"],
        confidence: "medium" as const,
      },
      melanoma: {
        primaryLesions: ["macule", "papule"],
        secondaryChanges: [],
        colors: ["dark brown", "black", "light brown", "blue-gray"],
        arrangement: ["asymmetric"],
        distribution: ["localized"],
        surfaceTexture: ["varied"],
        borderCharacteristics: ["irregular", "notched"],
        morphologyDescription:
          "Asymmetric pigmented lesion with irregular, notched borders and marked color variegation including dark brown, black, and blue-gray areas. A central region appears lighter, possibly representing regression.",
        differentialDiagnoses: ["Melanoma", "Dysplastic Nevus", "Seborrheic Keratosis"],
        confidence: "medium" as const,
      },
      "tinea corporis": {
        primaryLesions: ["plaque"],
        secondaryChanges: ["scale"],
        colors: ["erythematous"],
        arrangement: ["annular"],
        distribution: ["localized"],
        surfaceTexture: ["scaly border"],
        borderCharacteristics: ["raised border", "central clearing"],
        morphologyDescription:
          "Annular erythematous plaque with a raised, scaly advancing border and relative central clearing. Scale appears concentrated at the inner edge of the border.",
        differentialDiagnoses: ["Tinea Corporis", "Granuloma Annulare", "Nummular Eczema"],
        confidence: "high" as const,
      },
      "contact dermatitis": {
        primaryLesions: ["patch", "vesicle"],
        secondaryChanges: ["weeping", "crusting"],
        colors: ["erythematous"],
        arrangement: ["geometric"],
        distribution: ["localized"],
        surfaceTexture: ["vesicular", "weeping"],
        borderCharacteristics: ["sharp geometric cutoff"],
        morphologyDescription:
          "Erythematous patches with scattered vesicles and serous weeping. The eruption shows a sharp, geometric cutoff suggesting an external contactant. Active vesiculation is present.",
        differentialDiagnoses: ["Contact Dermatitis", "Atopic Dermatitis", "Dyshidrotic Eczema"],
        confidence: "high" as const,
      },
      "acne vulgaris": {
        primaryLesions: ["comedone", "papule", "pustule"],
        secondaryChanges: [],
        colors: ["erythematous", "skin-colored"],
        arrangement: ["scattered"],
        distribution: ["facial"],
        surfaceTexture: ["mixed"],
        borderCharacteristics: [],
        morphologyDescription:
          "Multiple open and closed comedones with erythematous papules and pustules in a facial distribution. Comedones are the predominant lesion type.",
        differentialDiagnoses: ["Acne Vulgaris", "Rosacea", "Folliculitis"],
        confidence: "high" as const,
      },
      "seborrheic keratosis": {
        primaryLesions: ["papule", "plaque"],
        secondaryChanges: [],
        colors: ["brown", "tan"],
        arrangement: ["solitary"],
        distribution: ["localized"],
        surfaceTexture: ["waxy", "verrucous", "stuck-on"],
        borderCharacteristics: ["well-demarcated"],
        morphologyDescription:
          "Well-demarcated brown papule with a waxy, stuck-on appearance and verrucous surface texture. The lesion appears superficial and easily friable.",
        differentialDiagnoses: ["Seborrheic Keratosis", "Melanoma", "Pigmented BCC"],
        confidence: "high" as const,
      },
      "herpes zoster": {
        primaryLesions: ["vesicle", "pustule"],
        secondaryChanges: ["crusting"],
        colors: ["erythematous", "cloudy"],
        arrangement: ["grouped"],
        distribution: ["dermatomal", "unilateral"],
        surfaceTexture: ["vesicular"],
        borderCharacteristics: [],
        morphologyDescription:
          "Grouped vesicles and pustules on erythematous bases in a unilateral, band-like distribution. Vesicles are at various stages including clear, cloudy, and crusted. The eruption does not cross the midline.",
        differentialDiagnoses: ["Herpes Zoster", "Herpes Simplex", "Contact Dermatitis"],
        confidence: "high" as const,
      },
    };

    // Find best match
    let matched: Partial<StructuredAnnotation> | undefined;
    for (const [key, value] of Object.entries(mockAnnotations)) {
      if (existingLabel.includes(key) || key.includes(existingLabel)) {
        matched = value;
        break;
      }
    }

    // Fallback generic annotation
    const base: StructuredAnnotation = {
      primaryLesions: matched?.primaryLesions ?? ["lesion (type uncertain)"],
      secondaryChanges: matched?.secondaryChanges ?? [],
      colors: matched?.colors ?? ["erythematous"],
      arrangement: matched?.arrangement ?? ["solitary"],
      distribution: matched?.distribution ?? ["localized"],
      surfaceTexture: matched?.surfaceTexture ?? [],
      borderCharacteristics: matched?.borderCharacteristics ?? [],
      estimatedBodySite: bodySite ?? undefined,
      morphologyDescription:
        matched?.morphologyDescription ??
        "A cutaneous lesion is present. Detailed morphological features require human expert review for accurate annotation.",
      differentialDiagnoses: matched?.differentialDiagnoses ?? ["(requires expert review)"],
      uncertainFeatures: ["detailed morphology requires direct image assessment"],
      confidence: matched?.confidence ?? "low",
    };

    return base;
  }
}

// ---------------------------------------------------------------------------
// Placeholder providers for future VLM integration
// ---------------------------------------------------------------------------

class OpenAIVisionProvider implements VisionAnnotationProvider {
  name = "openai";

  async annotateImage(
    imagePath: string,
    context: AnnotationContext
  ): Promise<StructuredAnnotation> {
    // Placeholder: In production, this would:
    // 1. Read image file and encode as base64
    // 2. Call OpenAI GPT-4V API with SYSTEM_PROMPT and user prompt
    // 3. Parse structured JSON response
    // 4. Validate against StructuredAnnotation schema
    log(`[OpenAI] Would process: ${imagePath}`);
    log("[OpenAI] Not yet implemented. Set OPENAI_API_KEY and implement API call.");
    log("[OpenAI] Falling back to mock provider.");

    const mock = new MockVisionProvider();
    return mock.annotateImage(imagePath, context);
  }
}

class AnthropicVisionProvider implements VisionAnnotationProvider {
  name = "anthropic";

  async annotateImage(
    imagePath: string,
    context: AnnotationContext
  ): Promise<StructuredAnnotation> {
    // Placeholder: In production, this would:
    // 1. Read image file and encode as base64
    // 2. Call Claude API with vision capability
    // 3. Parse structured JSON response
    // 4. Validate against StructuredAnnotation schema
    log(`[Anthropic] Would process: ${imagePath}`);
    log("[Anthropic] Not yet implemented. Set ANTHROPIC_API_KEY and implement API call.");
    log("[Anthropic] Falling back to mock provider.");

    const mock = new MockVisionProvider();
    return mock.annotateImage(imagePath, context);
  }
}

function getProvider(name: string): VisionAnnotationProvider {
  switch (name.toLowerCase()) {
    case "mock":
      return new MockVisionProvider();
    case "openai":
      return new OpenAIVisionProvider();
    case "anthropic":
      return new AnthropicVisionProvider();
    default:
      logError(`Unknown provider: ${name}. Available: mock, openai, anthropic`);
      process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Output type
// ---------------------------------------------------------------------------

interface AnnotationProposal {
  id: string;
  imageAssetId: string;
  provenance: "model_proposed";
  modelProvider: string;
  reviewStatus: "pending";
  conditionLabel?: string;
  annotation: StructuredAnnotation;
  /** The prompt that was used to generate this annotation. */
  promptUsed: {
    system: string;
    user: string;
  };
  createdAt: string;
}

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
// Main
// ---------------------------------------------------------------------------

async function generateProposals(opts: CliArgs): Promise<void> {
  log("=== VLM Annotation Proposal Generator ===");
  log(`Provider: ${opts.provider}`);
  log(`Dry run: ${opts.dryRun}`);
  log(`Limit: ${opts.limit === Infinity ? "none" : opts.limit}`);
  log("");

  const generatedDir = path.resolve("src/data/generated");

  if (!fs.existsSync(generatedDir)) {
    logError("No generated data directory found. Run import scripts first.");
    process.exit(1);
  }

  // Load images and annotations
  const files = fs.readdirSync(generatedDir);
  const allImages: ImageAssetRecord[] = [];
  const allAnnotations: AnnotationRecord[] = [];

  for (const f of files) {
    const filePath = path.join(generatedDir, f);
    if (f.endsWith("-images.json")) {
      try {
        allImages.push(...JSON.parse(fs.readFileSync(filePath, "utf-8")));
      } catch {
        logError(`Failed to parse ${filePath}`);
      }
    } else if (f.endsWith("-annotations.json")) {
      try {
        allAnnotations.push(...JSON.parse(fs.readFileSync(filePath, "utf-8")));
      } catch {
        logError(`Failed to parse ${filePath}`);
      }
    }
  }

  log(`Loaded ${allImages.length} images, ${allAnnotations.length} annotations`);

  // Index annotations by imageAssetId
  const annotationsByImage = new Map<string, AnnotationRecord[]>();
  for (const ann of allAnnotations) {
    const list = annotationsByImage.get(ann.imageAssetId) ?? [];
    list.push(ann);
    annotationsByImage.set(ann.imageAssetId, list);
  }

  // Load existing proposals for idempotency
  const proposalsPath = path.join(generatedDir, "annotation-proposals.json");
  let existingProposals: AnnotationProposal[] = [];
  const existingProposalImageIds = new Set<string>();

  if (fs.existsSync(proposalsPath)) {
    try {
      existingProposals = JSON.parse(fs.readFileSync(proposalsPath, "utf-8"));
      for (const p of existingProposals) {
        existingProposalImageIds.add(p.imageAssetId);
      }
      log(`Found ${existingProposals.length} existing proposals`);
    } catch {
      log("Warning: Could not parse existing proposals file, starting fresh");
    }
  }

  // Find images needing proposals:
  // - Has only dataset_native annotations (no model_proposed yet)
  // - Not already in existing proposals
  const needsProposal: ImageAssetRecord[] = [];

  for (const image of allImages) {
    if (existingProposalImageIds.has(image.id)) continue;

    const anns = annotationsByImage.get(image.id) ?? [];
    const hasModelAnnotation = anns.some((a) => a.provenance === "model_proposed");
    if (!hasModelAnnotation) {
      needsProposal.push(image);
    }
  }

  log(`Images needing annotation proposals: ${needsProposal.length}`);

  const toProcess = needsProposal.slice(0, opts.limit);
  log(`Will process: ${toProcess.length}`);

  if (toProcess.length === 0) {
    log("Nothing to process.");
    return;
  }

  if (opts.dryRun) {
    log("");
    log("DRY RUN: Would generate proposals for:");
    for (const img of toProcess.slice(0, 20)) {
      const anns = annotationsByImage.get(img.id) ?? [];
      const label = anns[0]?.conditionLabel ?? "(none)";
      log(`  ${img.externalImageId} - ${label}`);
    }
    if (toProcess.length > 20) {
      log(`  ... and ${toProcess.length - 20} more`);
    }

    log("");
    log("Prompt preview:");
    log("--- SYSTEM ---");
    log(SYSTEM_PROMPT);
    log("--- USER ---");
    if (toProcess.length > 0) {
      const sampleContext: AnnotationContext = {
        existingAnnotations: annotationsByImage.get(toProcess[0].id) ?? [],
        datasetSource: toProcess[0].datasetSource,
        metadata: toProcess[0].metadata,
      };
      log(buildUserPrompt(sampleContext));
    }
    return;
  }

  // Process images
  const provider = getProvider(opts.provider);
  const newProposals: AnnotationProposal[] = [];
  let processed = 0;
  let failed = 0;

  for (const image of toProcess) {
    const existingAnns = annotationsByImage.get(image.id) ?? [];
    const context: AnnotationContext = {
      existingAnnotations: existingAnns,
      datasetSource: image.datasetSource,
      metadata: image.metadata,
    };

    const userPrompt = buildUserPrompt(context);

    try {
      const annotation = await provider.annotateImage(
        path.resolve(image.storagePath),
        context
      );

      const proposal: AnnotationProposal = {
        id: deterministicUuid("proposal", `${image.id}:${provider.name}`),
        imageAssetId: image.id,
        provenance: "model_proposed",
        modelProvider: provider.name,
        reviewStatus: "pending",
        conditionLabel: existingAnns[0]?.conditionLabel,
        annotation,
        promptUsed: {
          system: SYSTEM_PROMPT,
          user: userPrompt,
        },
        createdAt: new Date().toISOString(),
      };

      newProposals.push(proposal);
      processed++;

      if (processed % 10 === 0) {
        log(`  Processed ${processed}/${toProcess.length}`);
      }
    } catch (e) {
      logError(`Failed to process ${image.externalImageId}: ${e}`);
      failed++;
    }
  }

  // Write output
  const allProposals = [...existingProposals, ...newProposals];
  fs.writeFileSync(proposalsPath, JSON.stringify(allProposals, null, 2), "utf-8");

  // Summary
  log("");
  log("=== PROPOSAL GENERATION COMPLETE ===");
  log(`Processed: ${processed}`);
  log(`Failed: ${failed}`);
  log(`New proposals: ${newProposals.length}`);
  log(`Total proposals (cumulative): ${allProposals.length}`);

  // Confidence distribution
  const byConfidence = new Map<string, number>();
  for (const p of newProposals) {
    const conf = p.annotation.confidence;
    byConfidence.set(conf, (byConfidence.get(conf) ?? 0) + 1);
  }
  if (byConfidence.size > 0) {
    log("");
    log("Confidence distribution:");
    for (const [conf, count] of Array.from(byConfidence.entries())) {
      log(`  ${conf}: ${count}`);
    }
  }

  // Review status
  const pendingCount = allProposals.filter((p) => p.reviewStatus === "pending").length;
  log("");
  log(`Proposals pending review: ${pendingCount}`);
  log(`Output: ${proposalsPath}`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const opts = parseArgs();
generateProposals(opts);
