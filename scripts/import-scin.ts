#!/usr/bin/env tsx
/**
 * SCIN Dataset Import Script
 *
 * Usage: npx tsx scripts/import-scin.ts [--data-dir path] [--dry-run] [--generate-sample]
 *
 * Reads SCIN dataset files and generates normalized image asset records
 * and initial annotations for the DermEd platform.
 *
 * Expected SCIN directory structure:
 *   <data-dir>/
 *     metadata.csv          (case-level metadata)
 *     images/               (image files referenced by metadata)
 *
 * NOTE: csv-parse is NOT required. This script includes an inline CSV parser
 * that handles quoted fields, commas inside quotes, and escaped quotes.
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Inline CSV parser (no external deps)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

interface CliArgs {
  dataDir: string;
  dryRun: boolean;
  generateSample: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const opts: CliArgs = {
    dataDir: path.resolve("data/datasets/scin"),
    dryRun: false,
    generateSample: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--data-dir":
        opts.dataDir = path.resolve(args[++i]);
        break;
      case "--dry-run":
        opts.dryRun = true;
        break;
      case "--generate-sample":
        opts.generateSample = true;
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
// SCIN label -> condition taxonomy mapping
// ---------------------------------------------------------------------------

const SCIN_LABEL_MAP: Record<string, { conditionId: string; category: string }> = {
  psoriasis: {
    conditionId: "c0000001-0001-4000-8000-000000000001",
    category: "papulosquamous",
  },
  "atopic dermatitis": {
    conditionId: "c0000001-0002-4000-8000-000000000001",
    category: "eczematous",
  },
  eczema: {
    conditionId: "c0000001-0002-4000-8000-000000000001",
    category: "eczematous",
  },
  "basal cell carcinoma": {
    conditionId: "c0000001-0003-4000-8000-000000000001",
    category: "skin_cancer",
  },
  melanoma: {
    conditionId: "c0000001-0004-4000-8000-000000000001",
    category: "skin_cancer",
  },
  "tinea corporis": {
    conditionId: "c0000001-0005-4000-8000-000000000001",
    category: "infection",
  },
  ringworm: {
    conditionId: "c0000001-0005-4000-8000-000000000001",
    category: "infection",
  },
  "contact dermatitis": {
    conditionId: "c0000001-0006-4000-8000-000000000001",
    category: "eczematous",
  },
  acne: {
    conditionId: "c0000001-0007-4000-8000-000000000001",
    category: "acne_rosacea",
  },
  "acne vulgaris": {
    conditionId: "c0000001-0007-4000-8000-000000000001",
    category: "acne_rosacea",
  },
  "squamous cell carcinoma": {
    conditionId: "c0000001-0008-4000-8000-000000000001",
    category: "skin_cancer",
  },
  "seborrheic keratosis": {
    conditionId: "c0000001-0009-4000-8000-000000000001",
    category: "benign_lesion",
  },
  "herpes zoster": {
    conditionId: "c0000001-0010-4000-8000-000000000001",
    category: "infection",
  },
  shingles: {
    conditionId: "c0000001-0010-4000-8000-000000000001",
    category: "infection",
  },
};

// ---------------------------------------------------------------------------
// Skin tone mapping (SCIN uses Monk Skin Tone scale or Fitzpatrick)
// ---------------------------------------------------------------------------

type SkinToneLabel =
  | "fitzpatrick_1"
  | "fitzpatrick_2"
  | "fitzpatrick_3"
  | "fitzpatrick_4"
  | "fitzpatrick_5"
  | "fitzpatrick_6";

function normalizeSkinTone(raw: string): SkinToneLabel | undefined {
  const lower = raw.toLowerCase().trim();
  // Fitzpatrick direct
  const fitzMatch = lower.match(/fitzpatrick[_\s-]*(\d)/);
  if (fitzMatch) {
    const n = parseInt(fitzMatch[1], 10);
    if (n >= 1 && n <= 6) return `fitzpatrick_${n}` as SkinToneLabel;
  }
  // Monk Skin Tone (MST) 1-10 approximate mapping to Fitzpatrick
  const mstMatch = lower.match(/(?:mst|monk)[_\s-]*(\d+)/);
  if (mstMatch) {
    const m = parseInt(mstMatch[1], 10);
    if (m <= 2) return "fitzpatrick_1";
    if (m <= 3) return "fitzpatrick_2";
    if (m <= 5) return "fitzpatrick_3";
    if (m <= 7) return "fitzpatrick_4";
    if (m <= 8) return "fitzpatrick_5";
    return "fitzpatrick_6";
  }
  // Numeric only
  const numMatch = lower.match(/^(\d)$/);
  if (numMatch) {
    const n = parseInt(numMatch[1], 10);
    if (n >= 1 && n <= 6) return `fitzpatrick_${n}` as SkinToneLabel;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Body site normalization
// ---------------------------------------------------------------------------

function normalizeBodySite(raw: string): string {
  const lower = raw.toLowerCase().trim();
  const siteMap: Record<string, string> = {
    face: "face",
    forehead: "face",
    cheek: "face",
    nose: "face",
    chin: "face",
    scalp: "scalp",
    neck: "neck",
    chest: "trunk",
    trunk: "trunk",
    back: "trunk",
    abdomen: "trunk",
    arm: "upper_extremity",
    "upper arm": "upper_extremity",
    forearm: "upper_extremity",
    elbow: "upper_extremity",
    hand: "hand",
    palm: "hand",
    finger: "hand",
    leg: "lower_extremity",
    thigh: "lower_extremity",
    shin: "lower_extremity",
    knee: "lower_extremity",
    foot: "foot",
    sole: "foot",
    toe: "foot",
  };
  return siteMap[lower] ?? lower;
}

// ---------------------------------------------------------------------------
// UUID generation (deterministic from external id)
// ---------------------------------------------------------------------------

function deterministicUuid(prefix: string, externalId: string): string {
  // Simple hash-based deterministic UUID for idempotency
  let hash = 0;
  const str = `${prefix}:${externalId}`;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `${prefix}-${hex}-4000-8000-${externalId
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 12)
    .padEnd(12, "0")}`;
}

// ---------------------------------------------------------------------------
// Types for generated output
// ---------------------------------------------------------------------------

interface GeneratedImageAsset {
  id: string;
  externalImageId: string;
  datasetSource: "scin";
  filename: string;
  altText: string;
  modality: "clinical_photo";
  skinTone?: SkinToneLabel;
  storageMode: "local";
  storagePath: string;
  license: {
    spdxId: string;
    attribution: string;
    sourceUrl?: string;
    restrictions: string[];
  };
  createdAt: string;
  width?: number;
  height?: number;
  metadata: {
    caseId?: string;
    bodySite?: string;
    selfReportedCondition?: string;
    dermatologistLabel?: string;
    skinToneRaw?: string;
    age?: string;
  };
}

interface GeneratedImageAnnotation {
  id: string;
  imageAssetId: string;
  provenance: "dataset_native";
  conditionId?: string;
  conditionLabel: string;
  bodySite?: string;
  skinTone?: SkinToneLabel;
  morphologyTags: string[];
  notes: string;
  reviewStatus: "accepted";
  createdAt: string;
}

interface ConditionTaxonomyMapping {
  datasetLabel: string;
  normalizedLabel: string;
  conditionId: string;
  category: string;
}

// ---------------------------------------------------------------------------
// Sample data generation (--generate-sample)
// ---------------------------------------------------------------------------

function generateSampleData(dataDir: string): void {
  log("Generating sample SCIN dataset structure...");

  const imagesDir = path.join(dataDir, "images");
  fs.mkdirSync(imagesDir, { recursive: true });

  const sampleRows = [
    {
      case_id: "SCIN-0001",
      image_filename: "SCIN-0001_01.jpg",
      self_reported_condition: "Psoriasis",
      dermatologist_label: "Psoriasis",
      skin_tone: "Fitzpatrick_3",
      body_site: "Elbow",
      age: "42",
      sex: "M",
    },
    {
      case_id: "SCIN-0002",
      image_filename: "SCIN-0002_01.jpg",
      self_reported_condition: "Eczema",
      dermatologist_label: "Atopic dermatitis",
      skin_tone: "Fitzpatrick_5",
      body_site: "Arm",
      age: "28",
      sex: "F",
    },
    {
      case_id: "SCIN-0003",
      image_filename: "SCIN-0003_01.jpg",
      self_reported_condition: "Mole",
      dermatologist_label: "Melanoma",
      skin_tone: "Fitzpatrick_2",
      body_site: "Back",
      age: "65",
      sex: "M",
    },
    {
      case_id: "SCIN-0004",
      image_filename: "SCIN-0004_01.jpg",
      self_reported_condition: "Ringworm",
      dermatologist_label: "Tinea corporis",
      skin_tone: "Fitzpatrick_4",
      body_site: "Trunk",
      age: "19",
      sex: "F",
    },
    {
      case_id: "SCIN-0005",
      image_filename: "SCIN-0005_01.jpg",
      self_reported_condition: "Acne",
      dermatologist_label: "Acne vulgaris",
      skin_tone: "Fitzpatrick_6",
      body_site: "Face",
      age: "17",
      sex: "M",
    },
    {
      case_id: "SCIN-0006",
      image_filename: "SCIN-0006_01.jpg",
      self_reported_condition: "Skin growth",
      dermatologist_label: "Seborrheic keratosis",
      skin_tone: "Fitzpatrick_1",
      body_site: "Chest",
      age: "71",
      sex: "F",
    },
    {
      case_id: "SCIN-0007",
      image_filename: "SCIN-0007_01.jpg",
      self_reported_condition: "Rash",
      dermatologist_label: "Contact dermatitis",
      skin_tone: "Fitzpatrick_3",
      body_site: "Hand",
      age: "34",
      sex: "F",
    },
    {
      case_id: "SCIN-0008",
      image_filename: "SCIN-0008_01.jpg",
      self_reported_condition: "Painful blisters",
      dermatologist_label: "Herpes zoster",
      skin_tone: "Fitzpatrick_2",
      body_site: "Trunk",
      age: "68",
      sex: "M",
    },
  ];

  // Write CSV
  const headers = Object.keys(sampleRows[0]);
  const csvLines = [headers.join(",")];
  for (const row of sampleRows) {
    csvLines.push(headers.map((h) => (row as Record<string, string>)[h]).join(","));
  }
  fs.writeFileSync(path.join(dataDir, "metadata.csv"), csvLines.join("\n"), "utf-8");

  // Write placeholder image files
  for (const row of sampleRows) {
    const imgPath = path.join(imagesDir, row.image_filename);
    if (!fs.existsSync(imgPath)) {
      fs.writeFileSync(imgPath, `[placeholder image for ${row.case_id}]`, "utf-8");
    }
  }

  log(`Sample data written to ${dataDir}`);
  log(`  - metadata.csv (${sampleRows.length} rows)`);
  log(`  - images/ (${sampleRows.length} placeholder files)`);
}

// ---------------------------------------------------------------------------
// Main import logic
// ---------------------------------------------------------------------------

function importScin(opts: CliArgs): void {
  log("=== SCIN Dataset Import ===");
  log(`Data directory: ${opts.dataDir}`);
  log(`Dry run: ${opts.dryRun}`);

  // Handle --generate-sample
  if (opts.generateSample) {
    generateSampleData(opts.dataDir);
    return;
  }

  // Validate directory structure
  if (!fs.existsSync(opts.dataDir)) {
    logError(`Data directory does not exist: ${opts.dataDir}`);
    logError("Expected structure:");
    logError("  <data-dir>/metadata.csv");
    logError("  <data-dir>/images/");
    logError("");
    logError("Run with --generate-sample to create sample data:");
    logError("  npx tsx scripts/import-scin.ts --generate-sample");
    process.exit(1);
  }

  const metadataPath = path.join(opts.dataDir, "metadata.csv");
  const imagesDir = path.join(opts.dataDir, "images");

  if (!fs.existsSync(metadataPath)) {
    logError(`Metadata file not found: ${metadataPath}`);
    logError("Expected a CSV file with columns:");
    logError("  case_id, image_filename, self_reported_condition, dermatologist_label,");
    logError("  skin_tone, body_site, age, sex");
    process.exit(1);
  }

  if (!fs.existsSync(imagesDir)) {
    logError(`Images directory not found: ${imagesDir}`);
    process.exit(1);
  }

  // Parse metadata
  const csvText = fs.readFileSync(metadataPath, "utf-8");
  const rows = parseCsv(csvText);
  log(`Parsed ${rows.length} rows from metadata.csv`);

  if (rows.length === 0) {
    logError("No data rows found in metadata.csv");
    process.exit(1);
  }

  // Validate expected columns
  const expectedCols = ["case_id", "image_filename", "dermatologist_label"];
  const actualCols = Object.keys(rows[0]);
  const missingCols = expectedCols.filter((c) => !actualCols.includes(c));
  if (missingCols.length > 0) {
    logError(`Missing required columns: ${missingCols.join(", ")}`);
    logError(`Found columns: ${actualCols.join(", ")}`);
    process.exit(1);
  }

  // Load existing records for idempotency
  const outputDir = path.resolve("src/data/generated");
  fs.mkdirSync(outputDir, { recursive: true });

  const imagesOutputPath = path.join(outputDir, "scin-images.json");
  const annotationsOutputPath = path.join(outputDir, "scin-annotations.json");

  let existingImages: GeneratedImageAsset[] = [];
  let existingAnnotations: GeneratedImageAnnotation[] = [];
  const existingExternalIds = new Set<string>();

  if (fs.existsSync(imagesOutputPath)) {
    try {
      existingImages = JSON.parse(fs.readFileSync(imagesOutputPath, "utf-8"));
      for (const img of existingImages) {
        existingExternalIds.add(img.externalImageId);
      }
      log(`Found ${existingImages.length} existing image records (idempotency check)`);
    } catch {
      log("Warning: Could not parse existing images file, starting fresh");
    }
  }

  if (fs.existsSync(annotationsOutputPath)) {
    try {
      existingAnnotations = JSON.parse(fs.readFileSync(annotationsOutputPath, "utf-8"));
    } catch {
      log("Warning: Could not parse existing annotations file, starting fresh");
    }
  }

  // Process rows
  const now = new Date().toISOString();
  const newImages: GeneratedImageAsset[] = [];
  const newAnnotations: GeneratedImageAnnotation[] = [];
  const taxonomyMappings: ConditionTaxonomyMapping[] = [];
  const unmappedLabels = new Map<string, number>();
  const stats = {
    total: 0,
    skippedExisting: 0,
    skippedMissingImage: 0,
    imported: 0,
    unmappedConditions: 0,
  };

  // Distribution tracking
  const conditionDist = new Map<string, number>();
  const skinToneDist = new Map<string, number>();
  const bodySiteDist = new Map<string, number>();

  for (const row of rows) {
    stats.total++;

    const caseId = row.case_id ?? row.id ?? "";
    const imageFilename = row.image_filename ?? row.filename ?? "";
    const externalId = `scin:${caseId}:${imageFilename}`;

    // Idempotency: skip if already processed
    if (existingExternalIds.has(externalId)) {
      stats.skippedExisting++;
      continue;
    }

    // Check image file exists
    const imagePath = path.join(imagesDir, imageFilename);
    if (!fs.existsSync(imagePath)) {
      stats.skippedMissingImage++;
      if (!opts.dryRun) {
        log(`Warning: Image not found: ${imagePath}`);
      }
      continue;
    }

    // Normalize fields
    const dermLabel = (row.dermatologist_label ?? row.label ?? "").trim();
    const selfReport = (row.self_reported_condition ?? "").trim();
    const skinToneRaw = (row.skin_tone ?? row.fitzpatrick ?? "").trim();
    const bodySiteRaw = (row.body_site ?? row.location ?? "").trim();
    const age = (row.age ?? "").trim();

    const skinTone = normalizeSkinTone(skinToneRaw);
    const bodySite = bodySiteRaw ? normalizeBodySite(bodySiteRaw) : undefined;

    // Map condition
    const labelLower = dermLabel.toLowerCase();
    const conditionMapping = SCIN_LABEL_MAP[labelLower];
    if (conditionMapping) {
      taxonomyMappings.push({
        datasetLabel: dermLabel,
        normalizedLabel: labelLower,
        conditionId: conditionMapping.conditionId,
        category: conditionMapping.category,
      });
    } else if (dermLabel) {
      const prev = unmappedLabels.get(dermLabel) ?? 0;
      unmappedLabels.set(dermLabel, prev + 1);
      stats.unmappedConditions++;
    }

    // Track distributions
    const condKey = dermLabel || "(unlabeled)";
    conditionDist.set(condKey, (conditionDist.get(condKey) ?? 0) + 1);
    if (skinTone) {
      skinToneDist.set(skinTone, (skinToneDist.get(skinTone) ?? 0) + 1);
    }
    if (bodySite) {
      bodySiteDist.set(bodySite, (bodySiteDist.get(bodySite) ?? 0) + 1);
    }

    // Build image asset record
    const assetId = deterministicUuid("scin-img", externalId);
    const altText = [
      "Clinical photograph",
      bodySiteRaw ? `of ${bodySiteRaw}` : "",
      dermLabel ? `showing ${dermLabel}` : "",
      skinTone ? `(${skinTone.replace("_", " ")})` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const imageAsset: GeneratedImageAsset = {
      id: assetId,
      externalImageId: externalId,
      datasetSource: "scin",
      filename: imageFilename,
      altText,
      modality: "clinical_photo",
      skinTone,
      storageMode: "local",
      storagePath: `data/datasets/scin/images/${imageFilename}`,
      license: {
        spdxId: "CC-BY-4.0",
        attribution: "SCIN Dataset (Google Research)",
        sourceUrl: "https://github.com/google-research-datasets/scin",
        restrictions: [
          "Research and educational use",
          "Attribution required",
          "No re-identification of participants",
        ],
      },
      createdAt: now,
      metadata: {
        caseId,
        bodySite,
        selfReportedCondition: selfReport || undefined,
        dermatologistLabel: dermLabel || undefined,
        skinToneRaw: skinToneRaw || undefined,
        age: age || undefined,
      },
    };

    newImages.push(imageAsset);

    // Build annotation record (from dataset metadata)
    if (dermLabel || selfReport) {
      const annotationId = deterministicUuid("scin-ann", externalId);
      const annotation: GeneratedImageAnnotation = {
        id: annotationId,
        imageAssetId: assetId,
        provenance: "dataset_native",
        conditionId: conditionMapping?.conditionId,
        conditionLabel: dermLabel || selfReport,
        bodySite,
        skinTone,
        morphologyTags: [], // Dataset-native annotations lack detailed morphology
        notes: [
          dermLabel ? `Dermatologist label: ${dermLabel}` : "",
          selfReport ? `Self-reported: ${selfReport}` : "",
          `Source: SCIN dataset`,
        ]
          .filter(Boolean)
          .join(". "),
        reviewStatus: "accepted",
        createdAt: now,
      };
      newAnnotations.push(annotation);
    }

    stats.imported++;
  }

  // Dry-run: report only
  if (opts.dryRun) {
    log("");
    log("=== DRY RUN REPORT ===");
    log(`Total rows in metadata: ${stats.total}`);
    log(`Would import: ${stats.imported} new image assets`);
    log(`Would generate: ${newAnnotations.length} annotations`);
    log(`Skipped (already exist): ${stats.skippedExisting}`);
    log(`Skipped (missing image): ${stats.skippedMissingImage}`);
    log(`Unmapped condition labels: ${stats.unmappedConditions}`);

    if (unmappedLabels.size > 0) {
      log("");
      log("Unmapped labels (need taxonomy mapping):");
      for (const [label, count] of Array.from(unmappedLabels.entries())) {
        log(`  - "${label}" (${count} occurrences)`);
      }
    }

    printDistribution("Condition", conditionDist);
    printDistribution("Skin Tone", skinToneDist);
    printDistribution("Body Site", bodySiteDist);
    return;
  }

  // Write output
  const allImages = [...existingImages, ...newImages];
  const allAnnotations = [...existingAnnotations, ...newAnnotations];

  fs.writeFileSync(imagesOutputPath, JSON.stringify(allImages, null, 2), "utf-8");
  fs.writeFileSync(annotationsOutputPath, JSON.stringify(allAnnotations, null, 2), "utf-8");

  // Write taxonomy mappings
  const uniqueMappings = Array.from(
    new Map(taxonomyMappings.map((m) => [m.datasetLabel, m])).values()
  );
  const mappingsPath = path.join(outputDir, "scin-taxonomy-mappings.json");
  fs.writeFileSync(mappingsPath, JSON.stringify(uniqueMappings, null, 2), "utf-8");

  // Summary report
  log("");
  log("=== IMPORT COMPLETE ===");
  log(`Total rows processed: ${stats.total}`);
  log(`New image assets: ${newImages.length}`);
  log(`New annotations: ${newAnnotations.length}`);
  log(`Skipped (already exist): ${stats.skippedExisting}`);
  log(`Skipped (missing image): ${stats.skippedMissingImage}`);
  log(`Unmapped conditions: ${stats.unmappedConditions}`);
  log("");
  log(`Total image assets (cumulative): ${allImages.length}`);
  log(`Total annotations (cumulative): ${allAnnotations.length}`);
  log(`Taxonomy mappings: ${uniqueMappings.length}`);
  log("");
  log("Output files:");
  log(`  ${imagesOutputPath}`);
  log(`  ${annotationsOutputPath}`);
  log(`  ${mappingsPath}`);

  if (unmappedLabels.size > 0) {
    log("");
    log("WARNING: Unmapped condition labels (add to SCIN_LABEL_MAP):");
    for (const [label, count] of Array.from(unmappedLabels.entries())) {
      log(`  - "${label}" (${count} occurrences)`);
    }
  }

  printDistribution("Condition", conditionDist);
  printDistribution("Skin Tone", skinToneDist);
  printDistribution("Body Site", bodySiteDist);
}

function printDistribution(name: string, dist: Map<string, number>): void {
  if (dist.size === 0) return;
  log("");
  log(`Distribution by ${name}:`);
  const sorted = Array.from(dist.entries()).sort((a, b) => b[1] - a[1]);
  const total = Array.from(dist.values()).reduce((a, b) => a + b, 0);
  for (const [key, count] of sorted) {
    const pct = ((count / total) * 100).toFixed(1);
    log(`  ${key}: ${count} (${pct}%)`);
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const opts = parseArgs();
importScin(opts);
