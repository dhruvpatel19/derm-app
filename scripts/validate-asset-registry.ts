#!/usr/bin/env tsx
/**
 * Asset Registry Validation Script
 *
 * Usage: npx tsx scripts/validate-asset-registry.ts [--strict]
 *
 * Validates all generated JSON files for:
 *   1. Every ImageAsset has a valid license record
 *   2. Image file paths exist (or flags missing)
 *   3. No duplicate external IDs
 *   4. Taxonomy mapping coverage
 *   5. Distribution stats
 *   6. Gradable images have required annotations
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

interface CliArgs {
  strict: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const opts: CliArgs = { strict: false };
  for (const arg of args) {
    if (arg === "--strict") opts.strict = true;
  }
  return opts;
}

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

type Severity = "INFO" | "WARN" | "ERROR";

interface ValidationIssue {
  severity: Severity;
  category: string;
  message: string;
  detail?: string;
}

const issues: ValidationIssue[] = [];

function log(msg: string): void {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${msg}`);
}

function addIssue(severity: Severity, category: string, message: string, detail?: string): void {
  issues.push({ severity, category, message, detail });
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
  storageMode?: string;
  license?: {
    spdxId: string;
    attribution: string;
    sourceUrl?: string;
    restrictions?: string[];
  };
  metadata?: Record<string, unknown>;
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

interface TaxonomyMapping {
  datasetLabel: string;
  normalizedLabel: string;
  conditionId: string;
  category: string;
}

// ---------------------------------------------------------------------------
// Load all generated data
// ---------------------------------------------------------------------------

function loadJsonSafe<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    addIssue("ERROR", "file_parse", `Failed to parse ${filePath}`, String(e));
    return [];
  }
}

// ---------------------------------------------------------------------------
// Validation checks
// ---------------------------------------------------------------------------

function validateLicenses(images: ImageAssetRecord[]): void {
  log("Checking license records...");
  let missing = 0;
  let incomplete = 0;

  for (const img of images) {
    if (!img.license) {
      addIssue(
        "ERROR",
        "license_missing",
        `Image ${img.id} has no license record`,
        `External ID: ${img.externalImageId}`
      );
      missing++;
      continue;
    }

    if (!img.license.spdxId) {
      addIssue(
        "WARN",
        "license_incomplete",
        `Image ${img.id} license missing spdxId`,
        `External ID: ${img.externalImageId}`
      );
      incomplete++;
    }

    if (!img.license.attribution) {
      addIssue(
        "WARN",
        "license_incomplete",
        `Image ${img.id} license missing attribution`,
        `External ID: ${img.externalImageId}`
      );
      incomplete++;
    }
  }

  log(`  Licenses: ${images.length - missing} present, ${missing} missing, ${incomplete} incomplete fields`);
}

function validateImagePaths(images: ImageAssetRecord[]): void {
  log("Checking image file paths...");
  let found = 0;
  let missing = 0;

  for (const img of images) {
    const resolvedPath = path.resolve(img.storagePath);
    if (fs.existsSync(resolvedPath)) {
      found++;
    } else {
      addIssue(
        "WARN",
        "image_missing",
        `Image file not found: ${img.storagePath}`,
        `Asset ID: ${img.id}, External: ${img.externalImageId}`
      );
      missing++;
    }
  }

  log(`  Image files: ${found} found, ${missing} missing`);
}

function validateDuplicateIds(images: ImageAssetRecord[]): void {
  log("Checking for duplicate external IDs...");
  const seen = new Map<string, string[]>();

  for (const img of images) {
    const list = seen.get(img.externalImageId) ?? [];
    list.push(img.id);
    seen.set(img.externalImageId, list);
  }

  let duplicates = 0;
  for (const [extId, ids] of Array.from(seen.entries())) {
    if (ids.length > 1) {
      addIssue(
        "ERROR",
        "duplicate_external_id",
        `Duplicate external ID: ${extId}`,
        `Asset IDs: ${ids.join(", ")}`
      );
      duplicates++;
    }
  }

  // Also check internal ID uniqueness
  const internalIds = new Map<string, number>();
  for (const img of images) {
    internalIds.set(img.id, (internalIds.get(img.id) ?? 0) + 1);
  }
  let internalDups = 0;
  for (const [id, count] of Array.from(internalIds.entries())) {
    if (count > 1) {
      addIssue("ERROR", "duplicate_internal_id", `Duplicate internal ID: ${id}`, `Count: ${count}`);
      internalDups++;
    }
  }

  log(`  Duplicate external IDs: ${duplicates}`);
  log(`  Duplicate internal IDs: ${internalDups}`);
}

function validateTaxonomyCoverage(
  annotations: AnnotationRecord[],
  taxonomyMappings: TaxonomyMapping[]
): void {
  log("Checking taxonomy mapping coverage...");

  const annotationConditionIds = new Set(
    annotations.filter((a) => a.conditionId).map((a) => a.conditionId!)
  );

  const unmappedAnnotations = annotations.filter(
    (a) => a.conditionLabel && !a.conditionId
  );

  const unmappedLabels = new Set(unmappedAnnotations.map((a) => a.conditionLabel));

  log(`  Taxonomy mappings loaded: ${taxonomyMappings.length}`);
  log(`  Unique condition IDs in annotations: ${annotationConditionIds.size}`);
  log(`  Annotations without conditionId: ${unmappedAnnotations.length}`);

  if (unmappedLabels.size > 0) {
    for (const label of Array.from(unmappedLabels)) {
      addIssue(
        "WARN",
        "taxonomy_unmapped",
        `Condition label "${label}" has no taxonomy mapping`,
        `${unmappedAnnotations.filter((a) => a.conditionLabel === label).length} annotations affected`
      );
    }
  }
}

function validateAnnotationCoverage(
  images: ImageAssetRecord[],
  annotations: AnnotationRecord[]
): void {
  log("Checking annotation coverage...");

  const annotatedImageIds = new Set(annotations.map((a) => a.imageAssetId));
  const unannotated = images.filter((img) => !annotatedImageIds.has(img.id));

  log(`  Images with annotations: ${annotatedImageIds.size}/${images.length}`);

  if (unannotated.length > 0) {
    addIssue(
      "INFO",
      "annotation_gap",
      `${unannotated.length} images have no annotations`,
      `These images need annotation proposals generated`
    );
  }

  // Check annotation quality
  const byProvenance = new Map<string, number>();
  const byReviewStatus = new Map<string, number>();
  for (const ann of annotations) {
    byProvenance.set(ann.provenance, (byProvenance.get(ann.provenance) ?? 0) + 1);
    byReviewStatus.set(ann.reviewStatus, (byReviewStatus.get(ann.reviewStatus) ?? 0) + 1);
  }

  log("  By provenance:");
  for (const [prov, count] of Array.from(byProvenance.entries())) {
    log(`    ${prov}: ${count}`);
  }
  log("  By review status:");
  for (const [status, count] of Array.from(byReviewStatus.entries())) {
    log(`    ${status}: ${count}`);
  }
}

function validateGradableImages(
  images: ImageAssetRecord[],
  annotations: AnnotationRecord[]
): void {
  log("Checking gradable image requirements...");

  // Images in quiz-items.json are considered "gradable" --
  // they need at least dataset_native annotations
  const quizItemsPath = path.resolve("src/data/generated/quiz-items.json");
  if (!fs.existsSync(quizItemsPath)) {
    log("  No quiz-items.json found, skipping gradable check");
    return;
  }

  interface QuizItemRecord {
    id: string;
    imageAssetId: string;
    conditionId?: string;
    confirmedMorphology: string[];
  }

  const quizItems: QuizItemRecord[] = loadJsonSafe(quizItemsPath);
  const gradableImageIds = new Set(quizItems.map((q) => q.imageAssetId));
  const annotationsByImage = new Map<string, AnnotationRecord[]>();
  for (const ann of annotations) {
    const list = annotationsByImage.get(ann.imageAssetId) ?? [];
    list.push(ann);
    annotationsByImage.set(ann.imageAssetId, list);
  }

  let missingAnnotations = 0;
  let emptyMorphology = 0;

  for (const imgId of Array.from(gradableImageIds)) {
    const anns = annotationsByImage.get(imgId) ?? [];
    if (anns.length === 0) {
      addIssue(
        "ERROR",
        "gradable_no_annotation",
        `Gradable image ${imgId} has no annotations`,
        "Quiz items require at least dataset_native annotations"
      );
      missingAnnotations++;
    }
  }

  // Check quiz items with empty confirmed morphology
  for (const item of quizItems) {
    if (!item.confirmedMorphology || item.confirmedMorphology.length === 0) {
      emptyMorphology++;
    }
  }

  if (emptyMorphology > 0) {
    addIssue(
      "WARN",
      "gradable_empty_morphology",
      `${emptyMorphology} quiz items have empty confirmedMorphology`,
      "These items may produce poor image_description questions"
    );
  }

  log(`  Gradable images: ${gradableImageIds.size}`);
  log(`  Missing annotations: ${missingAnnotations}`);
  log(`  Empty morphology: ${emptyMorphology}`);
}

function reportDistributions(images: ImageAssetRecord[], annotations: AnnotationRecord[]): void {
  log("");
  log("=== DISTRIBUTION STATS ===");

  // By dataset source
  const bySource = new Map<string, number>();
  for (const img of images) {
    bySource.set(img.datasetSource, (bySource.get(img.datasetSource) ?? 0) + 1);
  }
  log("By dataset source:");
  for (const [source, count] of Array.from(bySource.entries())) {
    log(`  ${source}: ${count}`);
  }

  // By condition
  const byCond = new Map<string, number>();
  for (const ann of annotations) {
    const label = ann.conditionLabel || "(unlabeled)";
    byCond.set(label, (byCond.get(label) ?? 0) + 1);
  }
  log("By condition (annotations):");
  for (const [cond, count] of Array.from(byCond.entries()).sort((a, b) => b[1] - a[1])) {
    log(`  ${cond}: ${count}`);
  }

  // By skin tone
  const byTone = new Map<string, number>();
  for (const img of images) {
    const tone = img.skinTone ?? "(not specified)";
    byTone.set(tone, (byTone.get(tone) ?? 0) + 1);
  }
  log("By skin tone:");
  for (const [tone, count] of Array.from(byTone.entries()).sort((a, b) => b[1] - a[1])) {
    log(`  ${tone}: ${count}`);
  }

  // By body site
  const bySite = new Map<string, number>();
  for (const ann of annotations) {
    const site = ann.bodySite ?? "(not specified)";
    bySite.set(site, (bySite.get(site) ?? 0) + 1);
  }
  log("By body site:");
  for (const [site, count] of Array.from(bySite.entries()).sort((a, b) => b[1] - a[1])) {
    log(`  ${site}: ${count}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function validate(opts: CliArgs): void {
  log("=== Asset Registry Validation ===");
  log(`Strict mode: ${opts.strict}`);
  log("");

  const generatedDir = path.resolve("src/data/generated");

  if (!fs.existsSync(generatedDir)) {
    log("ERROR: No generated data directory found at src/data/generated/");
    log("Run import scripts first.");
    process.exit(1);
  }

  // Discover and load all files
  const files = fs.readdirSync(generatedDir);
  log(`Files in generated directory: ${files.filter((f) => f.endsWith(".json")).join(", ")}`);
  log("");

  const allImages: ImageAssetRecord[] = [];
  const allAnnotations: AnnotationRecord[] = [];
  const allTaxonomyMappings: TaxonomyMapping[] = [];

  for (const f of files) {
    const filePath = path.join(generatedDir, f);
    if (f.endsWith("-images.json")) {
      allImages.push(...loadJsonSafe<ImageAssetRecord>(filePath));
    } else if (f.endsWith("-annotations.json")) {
      allAnnotations.push(...loadJsonSafe<AnnotationRecord>(filePath));
    } else if (f.endsWith("-taxonomy-mappings.json")) {
      allTaxonomyMappings.push(...loadJsonSafe<TaxonomyMapping>(filePath));
    }
  }

  log(`Total images loaded: ${allImages.length}`);
  log(`Total annotations loaded: ${allAnnotations.length}`);
  log(`Total taxonomy mappings loaded: ${allTaxonomyMappings.length}`);
  log("");

  if (allImages.length === 0) {
    log("No image records found. Nothing to validate.");
    process.exit(0);
  }

  // Run all checks
  validateLicenses(allImages);
  validateImagePaths(allImages);
  validateDuplicateIds(allImages);
  validateTaxonomyCoverage(allAnnotations, allTaxonomyMappings);
  validateAnnotationCoverage(allImages, allAnnotations);
  validateGradableImages(allImages, allAnnotations);
  reportDistributions(allImages, allAnnotations);

  // Final report
  log("");
  log("=== VALIDATION SUMMARY ===");

  const errors = issues.filter((i) => i.severity === "ERROR");
  const warnings = issues.filter((i) => i.severity === "WARN");
  const infos = issues.filter((i) => i.severity === "INFO");

  log(`Errors: ${errors.length}`);
  log(`Warnings: ${warnings.length}`);
  log(`Info: ${infos.length}`);

  if (errors.length > 0) {
    log("");
    log("ERRORS:");
    for (const issue of errors) {
      log(`  [${issue.category}] ${issue.message}`);
      if (issue.detail) log(`    Detail: ${issue.detail}`);
    }
  }

  if (warnings.length > 0) {
    log("");
    log("WARNINGS:");
    for (const issue of warnings) {
      log(`  [${issue.category}] ${issue.message}`);
      if (issue.detail) log(`    Detail: ${issue.detail}`);
    }
  }

  if (infos.length > 0) {
    log("");
    log("INFO:");
    for (const issue of infos) {
      log(`  [${issue.category}] ${issue.message}`);
      if (issue.detail) log(`    Detail: ${issue.detail}`);
    }
  }

  // Exit code
  if (opts.strict && errors.length > 0) {
    log("");
    log("FAILED: Strict mode enabled and errors found.");
    process.exit(1);
  } else if (errors.length > 0) {
    log("");
    log("PASSED with errors. Use --strict to fail on errors.");
    process.exit(0);
  } else {
    log("");
    log("PASSED. All checks OK.");
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const opts = parseArgs();
validate(opts);
