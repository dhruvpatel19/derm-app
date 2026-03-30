#!/usr/bin/env tsx
/**
 * PAD-UFES-20 Dataset Import Script
 *
 * Usage: npx tsx scripts/import-pad-ufes-20.ts [--data-dir path] [--dry-run] [--generate-sample]
 *
 * Reads PAD-UFES-20 dataset files and generates normalized image asset records
 * and initial annotations for the DermEd platform.
 *
 * Expected PAD-UFES-20 directory structure:
 *   <data-dir>/
 *     metadata.csv          (patient/image metadata with columns: img_id, diagnostic,
 *                            patient_id, age, sex, region, diameter_1, diameter_2,
 *                            itch, grew, hurt, changed, bleed, elevation, biopsed, etc.)
 *     images/               (image files)
 *
 * NOTE: No external CSV parsing dependency required. Inline parser included.
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
          i++;
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
    dataDir: path.resolve("data/datasets/pad-ufes-20"),
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
// PAD-UFES-20 diagnostic label -> condition taxonomy mapping
//
// PAD-UFES-20 canonical diagnostic labels:
//   ACK (Actinic Keratosis), BCC (Basal Cell Carcinoma),
//   MEL (Melanoma), NEV (Nevus), SCC (Squamous Cell Carcinoma),
//   SEK (Seborrheic Keratosis)
// ---------------------------------------------------------------------------

const PAD_LABEL_MAP: Record<string, { conditionId: string; category: string; fullName: string }> = {
  ack: {
    conditionId: "c0000001-0008-4000-8000-000000000001", // SCC precursor
    category: "skin_cancer",
    fullName: "Actinic Keratosis",
  },
  "actinic keratosis": {
    conditionId: "c0000001-0008-4000-8000-000000000001",
    category: "skin_cancer",
    fullName: "Actinic Keratosis",
  },
  bcc: {
    conditionId: "c0000001-0003-4000-8000-000000000001",
    category: "skin_cancer",
    fullName: "Basal Cell Carcinoma",
  },
  "basal cell carcinoma": {
    conditionId: "c0000001-0003-4000-8000-000000000001",
    category: "skin_cancer",
    fullName: "Basal Cell Carcinoma",
  },
  mel: {
    conditionId: "c0000001-0004-4000-8000-000000000001",
    category: "skin_cancer",
    fullName: "Melanoma",
  },
  melanoma: {
    conditionId: "c0000001-0004-4000-8000-000000000001",
    category: "skin_cancer",
    fullName: "Melanoma",
  },
  nev: {
    conditionId: "", // Nevus not yet in taxonomy; track as unmapped for now
    category: "benign_lesion",
    fullName: "Melanocytic Nevus",
  },
  nevus: {
    conditionId: "",
    category: "benign_lesion",
    fullName: "Melanocytic Nevus",
  },
  scc: {
    conditionId: "c0000001-0008-4000-8000-000000000001",
    category: "skin_cancer",
    fullName: "Squamous Cell Carcinoma",
  },
  "squamous cell carcinoma": {
    conditionId: "c0000001-0008-4000-8000-000000000001",
    category: "skin_cancer",
    fullName: "Squamous Cell Carcinoma",
  },
  sek: {
    conditionId: "c0000001-0009-4000-8000-000000000001",
    category: "benign_lesion",
    fullName: "Seborrheic Keratosis",
  },
  "seborrheic keratosis": {
    conditionId: "c0000001-0009-4000-8000-000000000001",
    category: "benign_lesion",
    fullName: "Seborrheic Keratosis",
  },
};

// ---------------------------------------------------------------------------
// PAD-UFES-20 body region normalization
// ---------------------------------------------------------------------------

function normalizeBodySite(raw: string): string {
  const lower = raw.toLowerCase().trim();
  const siteMap: Record<string, string> = {
    face: "face",
    nose: "face",
    ear: "face",
    lip: "face",
    scalp: "scalp",
    neck: "neck",
    chest: "trunk",
    trunk: "trunk",
    back: "trunk",
    abdomen: "trunk",
    arm: "upper_extremity",
    forearm: "upper_extremity",
    hand: "hand",
    finger: "hand",
    leg: "lower_extremity",
    thigh: "lower_extremity",
    foot: "foot",
    toe: "foot",
  };
  return siteMap[lower] ?? lower;
}

// ---------------------------------------------------------------------------
// Skin tone: PAD-UFES-20 does not provide Fitzpatrick; leave undefined
// We note this explicitly as a gap.
// ---------------------------------------------------------------------------

type SkinToneLabel =
  | "fitzpatrick_1"
  | "fitzpatrick_2"
  | "fitzpatrick_3"
  | "fitzpatrick_4"
  | "fitzpatrick_5"
  | "fitzpatrick_6";

function normalizeSkinTone(raw: string): SkinToneLabel | undefined {
  if (!raw) return undefined;
  const lower = raw.toLowerCase().trim();
  const fitzMatch = lower.match(/fitzpatrick[_\s-]*(\d)/);
  if (fitzMatch) {
    const n = parseInt(fitzMatch[1], 10);
    if (n >= 1 && n <= 6) return `fitzpatrick_${n}` as SkinToneLabel;
  }
  const numMatch = lower.match(/^(\d)$/);
  if (numMatch) {
    const n = parseInt(numMatch[1], 10);
    if (n >= 1 && n <= 6) return `fitzpatrick_${n}` as SkinToneLabel;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// UUID generation (deterministic from external id)
// ---------------------------------------------------------------------------

function deterministicUuid(prefix: string, externalId: string): string {
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
// Output types
// ---------------------------------------------------------------------------

interface GeneratedImageAsset {
  id: string;
  externalImageId: string;
  datasetSource: "pad-ufes-20";
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
    patientId?: string;
    diagnostic?: string;
    diagnosticFullName?: string;
    region?: string;
    age?: string;
    sex?: string;
    diameter1?: string;
    diameter2?: string;
    itch?: string;
    grew?: string;
    hurt?: string;
    changed?: string;
    bleed?: string;
    elevation?: string;
    biopsied?: string;
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
  clinicalFeatures: string[];
  notes: string;
  reviewStatus: "accepted";
  createdAt: string;
}

interface ConditionTaxonomyMapping {
  datasetLabel: string;
  normalizedLabel: string;
  conditionId: string;
  category: string;
  fullName: string;
}

// ---------------------------------------------------------------------------
// Clinical feature extraction from PAD metadata
// ---------------------------------------------------------------------------

function extractClinicalFeatures(row: Record<string, string>): string[] {
  const features: string[] = [];
  if (row.itch === "1" || row.itch?.toLowerCase() === "true") features.push("pruritic");
  if (row.grew === "1" || row.grew?.toLowerCase() === "true") features.push("growing");
  if (row.hurt === "1" || row.hurt?.toLowerCase() === "true") features.push("painful");
  if (row.changed === "1" || row.changed?.toLowerCase() === "true") features.push("changing");
  if (row.bleed === "1" || row.bleed?.toLowerCase() === "true") features.push("bleeding");
  if (row.elevation === "1" || row.elevation?.toLowerCase() === "true") features.push("elevated");
  if (row.diameter_1 && row.diameter_2) {
    features.push(`diameter ${row.diameter_1}x${row.diameter_2}mm`);
  }
  return features;
}

// ---------------------------------------------------------------------------
// Morphology inference from PAD diagnostic + clinical features
// ---------------------------------------------------------------------------

function inferMorphologyTags(diagnostic: string, features: string[]): string[] {
  const tags: string[] = [];
  const diag = diagnostic.toLowerCase();

  if (diag === "bcc" || diag === "basal cell carcinoma") {
    if (features.includes("elevated")) tags.push("papule", "nodule");
    tags.push("telangiectasia");
  } else if (diag === "scc" || diag === "squamous cell carcinoma" || diag === "ack" || diag === "actinic keratosis") {
    tags.push("scale", "keratotic");
    if (features.includes("elevated")) tags.push("papule", "plaque");
  } else if (diag === "mel" || diag === "melanoma") {
    tags.push("pigmented");
    if (features.includes("elevated")) tags.push("papule", "nodule");
  } else if (diag === "nev" || diag === "nevus") {
    tags.push("pigmented", "macule");
  } else if (diag === "sek" || diag === "seborrheic keratosis") {
    tags.push("papule", "verrucous", "pigmented");
  }

  return tags;
}

// ---------------------------------------------------------------------------
// Sample data generation
// ---------------------------------------------------------------------------

function generateSampleData(dataDir: string): void {
  log("Generating sample PAD-UFES-20 dataset structure...");

  const imagesDir = path.join(dataDir, "images");
  fs.mkdirSync(imagesDir, { recursive: true });

  const sampleRows = [
    {
      img_id: "PAD_001",
      patient_id: "PAT_0001",
      diagnostic: "BCC",
      age: "72",
      sex: "M",
      region: "face",
      diameter_1: "8",
      diameter_2: "6",
      itch: "0",
      grew: "1",
      hurt: "0",
      changed: "1",
      bleed: "1",
      elevation: "1",
      biopsed: "1",
    },
    {
      img_id: "PAD_002",
      patient_id: "PAT_0002",
      diagnostic: "MEL",
      age: "65",
      sex: "F",
      region: "back",
      diameter_1: "14",
      diameter_2: "10",
      itch: "0",
      grew: "1",
      hurt: "0",
      changed: "1",
      bleed: "0",
      elevation: "0",
      biopsed: "1",
    },
    {
      img_id: "PAD_003",
      patient_id: "PAT_0003",
      diagnostic: "SCC",
      age: "78",
      sex: "M",
      region: "ear",
      diameter_1: "12",
      diameter_2: "10",
      itch: "0",
      grew: "1",
      hurt: "1",
      changed: "1",
      bleed: "1",
      elevation: "1",
      biopsed: "1",
    },
    {
      img_id: "PAD_004",
      patient_id: "PAT_0004",
      diagnostic: "ACK",
      age: "68",
      sex: "M",
      region: "scalp",
      diameter_1: "6",
      diameter_2: "5",
      itch: "1",
      grew: "0",
      hurt: "0",
      changed: "0",
      bleed: "0",
      elevation: "0",
      biopsed: "0",
    },
    {
      img_id: "PAD_005",
      patient_id: "PAT_0005",
      diagnostic: "SEK",
      age: "55",
      sex: "F",
      region: "trunk",
      diameter_1: "15",
      diameter_2: "12",
      itch: "0",
      grew: "1",
      hurt: "0",
      changed: "0",
      bleed: "0",
      elevation: "1",
      biopsed: "0",
    },
    {
      img_id: "PAD_006",
      patient_id: "PAT_0006",
      diagnostic: "NEV",
      age: "32",
      sex: "F",
      region: "arm",
      diameter_1: "5",
      diameter_2: "5",
      itch: "0",
      grew: "0",
      hurt: "0",
      changed: "0",
      bleed: "0",
      elevation: "0",
      biopsed: "0",
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
    const imgFilename = `${row.img_id}.jpg`;
    const imgPath = path.join(imagesDir, imgFilename);
    if (!fs.existsSync(imgPath)) {
      fs.writeFileSync(imgPath, `[placeholder image for ${row.img_id}]`, "utf-8");
    }
  }

  log(`Sample data written to ${dataDir}`);
  log(`  - metadata.csv (${sampleRows.length} rows)`);
  log(`  - images/ (${sampleRows.length} placeholder files)`);
}

// ---------------------------------------------------------------------------
// Main import
// ---------------------------------------------------------------------------

function importPad(opts: CliArgs): void {
  log("=== PAD-UFES-20 Dataset Import ===");
  log(`Data directory: ${opts.dataDir}`);
  log(`Dry run: ${opts.dryRun}`);

  if (opts.generateSample) {
    generateSampleData(opts.dataDir);
    return;
  }

  // Validate directory
  if (!fs.existsSync(opts.dataDir)) {
    logError(`Data directory does not exist: ${opts.dataDir}`);
    logError("Expected structure:");
    logError("  <data-dir>/metadata.csv");
    logError("  <data-dir>/images/");
    logError("");
    logError("Run with --generate-sample to create sample data:");
    logError("  npx tsx scripts/import-pad-ufes-20.ts --generate-sample");
    process.exit(1);
  }

  const metadataPath = path.join(opts.dataDir, "metadata.csv");
  const imagesDir = path.join(opts.dataDir, "images");

  if (!fs.existsSync(metadataPath)) {
    logError(`Metadata file not found: ${metadataPath}`);
    logError("Expected a CSV with columns:");
    logError("  img_id, patient_id, diagnostic, age, sex, region,");
    logError("  diameter_1, diameter_2, itch, grew, hurt, changed, bleed, elevation, biopsed");
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

  // Validate columns
  const expectedCols = ["img_id", "diagnostic"];
  const actualCols = Object.keys(rows[0]);
  const missingCols = expectedCols.filter((c) => !actualCols.includes(c));
  if (missingCols.length > 0) {
    logError(`Missing required columns: ${missingCols.join(", ")}`);
    logError(`Found columns: ${actualCols.join(", ")}`);
    process.exit(1);
  }

  // Existing records for idempotency
  const outputDir = path.resolve("src/data/generated");
  fs.mkdirSync(outputDir, { recursive: true });

  const imagesOutputPath = path.join(outputDir, "pad-images.json");
  const annotationsOutputPath = path.join(outputDir, "pad-annotations.json");

  let existingImages: GeneratedImageAsset[] = [];
  let existingAnnotations: GeneratedImageAnnotation[] = [];
  const existingExternalIds = new Set<string>();

  if (fs.existsSync(imagesOutputPath)) {
    try {
      existingImages = JSON.parse(fs.readFileSync(imagesOutputPath, "utf-8"));
      for (const img of existingImages) {
        existingExternalIds.add(img.externalImageId);
      }
      log(`Found ${existingImages.length} existing image records`);
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
    biopsied: 0,
  };

  const conditionDist = new Map<string, number>();
  const skinToneDist = new Map<string, number>();
  const bodySiteDist = new Map<string, number>();
  const ageDist = new Map<string, number>();

  for (const row of rows) {
    stats.total++;

    const imgId = row.img_id ?? row.image_id ?? "";
    const diagnostic = (row.diagnostic ?? "").trim();
    const patientId = (row.patient_id ?? "").trim();

    // PAD image filenames: usually img_id.png or img_id.jpg
    // Try common extensions
    let imageFilename = "";
    const extensions = [".png", ".jpg", ".jpeg"];
    for (const ext of extensions) {
      const candidate = `${imgId}${ext}`;
      if (fs.existsSync(path.join(imagesDir, candidate))) {
        imageFilename = candidate;
        break;
      }
    }
    // Also check if img_id already has extension
    if (!imageFilename && fs.existsSync(path.join(imagesDir, imgId))) {
      imageFilename = imgId;
    }

    const externalId = `pad-ufes-20:${imgId}`;

    // Idempotency
    if (existingExternalIds.has(externalId)) {
      stats.skippedExisting++;
      continue;
    }

    // Check image exists
    if (!imageFilename) {
      stats.skippedMissingImage++;
      if (!opts.dryRun) {
        log(`Warning: Image not found for ${imgId} in ${imagesDir}`);
      }
      continue;
    }

    // Normalize fields
    const regionRaw = (row.region ?? row.body_site ?? "").trim();
    const bodySite = regionRaw ? normalizeBodySite(regionRaw) : undefined;
    const age = (row.age ?? "").trim();
    const sex = (row.sex ?? "").trim();
    const skinToneRaw = (row.skin_tone ?? row.fitzpatrick ?? "").trim();
    const skinTone = normalizeSkinTone(skinToneRaw);
    const biopsied = row.biopsed === "1" || row.biopsed?.toLowerCase() === "true";
    if (biopsied) stats.biopsied++;

    // Map condition
    const diagLower = diagnostic.toLowerCase();
    const conditionMapping = PAD_LABEL_MAP[diagLower];
    if (conditionMapping && conditionMapping.conditionId) {
      taxonomyMappings.push({
        datasetLabel: diagnostic,
        normalizedLabel: diagLower,
        conditionId: conditionMapping.conditionId,
        category: conditionMapping.category,
        fullName: conditionMapping.fullName,
      });
    } else if (diagnostic) {
      // Even mapped labels without conditionId (e.g. NEV) count as partially unmapped
      const hasPartialMapping = (conditionMapping != null) && !conditionMapping.conditionId;
      if (!hasPartialMapping) {
        const prev = unmappedLabels.get(diagnostic) ?? 0;
        unmappedLabels.set(diagnostic, prev + 1);
      }
      stats.unmappedConditions++;
    }

    // Track distributions
    const condKey = (conditionMapping?.fullName ?? diagnostic) || "(unlabeled)";
    conditionDist.set(condKey, (conditionDist.get(condKey) ?? 0) + 1);
    if (skinTone) {
      skinToneDist.set(skinTone, (skinToneDist.get(skinTone) ?? 0) + 1);
    }
    if (bodySite) {
      bodySiteDist.set(bodySite, (bodySiteDist.get(bodySite) ?? 0) + 1);
    }
    if (age) {
      const ageGroup = ageToGroup(age);
      ageDist.set(ageGroup, (ageDist.get(ageGroup) ?? 0) + 1);
    }

    // Extract clinical features from metadata
    const clinicalFeatures = extractClinicalFeatures(row);
    const morphologyTags = inferMorphologyTags(diagnostic, clinicalFeatures);

    // Build alt text
    const fullName = conditionMapping?.fullName ?? diagnostic;
    const altText = [
      "Clinical photograph",
      regionRaw ? `of ${regionRaw}` : "",
      fullName ? `showing ${fullName}` : "",
      clinicalFeatures.length > 0 ? `(${clinicalFeatures.join(", ")})` : "",
    ]
      .filter(Boolean)
      .join(" ");

    // Build image asset
    const assetId = deterministicUuid("pad-img", externalId);
    const imageAsset: GeneratedImageAsset = {
      id: assetId,
      externalImageId: externalId,
      datasetSource: "pad-ufes-20",
      filename: imageFilename,
      altText,
      modality: "clinical_photo",
      skinTone,
      storageMode: "local",
      storagePath: `data/datasets/pad-ufes-20/images/${imageFilename}`,
      license: {
        spdxId: "CC-BY-4.0",
        attribution: "PAD-UFES-20 Dataset (Pacheco et al., Universidade Federal do Espirito Santo)",
        sourceUrl: "https://data.mendeley.com/datasets/zr7vgbcyr2/1",
        restrictions: [
          "Research and educational use",
          "Attribution required",
          "No re-identification of participants",
        ],
      },
      createdAt: now,
      metadata: {
        patientId: patientId || undefined,
        diagnostic: diagnostic || undefined,
        diagnosticFullName: fullName || undefined,
        region: bodySite || undefined,
        age: age || undefined,
        sex: sex || undefined,
        diameter1: row.diameter_1 || undefined,
        diameter2: row.diameter_2 || undefined,
        itch: row.itch || undefined,
        grew: row.grew || undefined,
        hurt: row.hurt || undefined,
        changed: row.changed || undefined,
        bleed: row.bleed || undefined,
        elevation: row.elevation || undefined,
        biopsied: biopsied ? "true" : "false",
      },
    };

    newImages.push(imageAsset);

    // Build annotation
    const annotationId = deterministicUuid("pad-ann", externalId);
    const annotation: GeneratedImageAnnotation = {
      id: annotationId,
      imageAssetId: assetId,
      provenance: "dataset_native",
      conditionId: conditionMapping?.conditionId || undefined,
      conditionLabel: fullName || diagnostic,
      bodySite,
      skinTone,
      morphologyTags,
      clinicalFeatures,
      notes: [
        `Diagnostic: ${diagnostic} (${fullName})`,
        biopsied ? "Biopsy confirmed" : "Not biopsied",
        clinicalFeatures.length > 0 ? `Clinical: ${clinicalFeatures.join(", ")}` : "",
        `Source: PAD-UFES-20 dataset`,
      ]
        .filter(Boolean)
        .join(". "),
      reviewStatus: "accepted",
      createdAt: now,
    };
    newAnnotations.push(annotation);

    stats.imported++;
  }

  // Dry-run report
  if (opts.dryRun) {
    log("");
    log("=== DRY RUN REPORT ===");
    log(`Total rows in metadata: ${stats.total}`);
    log(`Would import: ${stats.imported} new image assets`);
    log(`Would generate: ${newAnnotations.length} annotations`);
    log(`Skipped (already exist): ${stats.skippedExisting}`);
    log(`Skipped (missing image): ${stats.skippedMissingImage}`);
    log(`Unmapped condition labels: ${stats.unmappedConditions}`);
    log(`Biopsy-confirmed cases: ${stats.biopsied}`);

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
    printDistribution("Age Group", ageDist);
    return;
  }

  // Write output
  const allImages = [...existingImages, ...newImages];
  const allAnnotations = [...existingAnnotations, ...newAnnotations];

  fs.writeFileSync(imagesOutputPath, JSON.stringify(allImages, null, 2), "utf-8");
  fs.writeFileSync(annotationsOutputPath, JSON.stringify(allAnnotations, null, 2), "utf-8");

  // Taxonomy mappings
  const uniqueMappings = Array.from(
    new Map(taxonomyMappings.map((m) => [m.datasetLabel, m])).values()
  );
  const mappingsPath = path.join(outputDir, "pad-taxonomy-mappings.json");
  fs.writeFileSync(mappingsPath, JSON.stringify(uniqueMappings, null, 2), "utf-8");

  // Summary
  log("");
  log("=== IMPORT COMPLETE ===");
  log(`Total rows processed: ${stats.total}`);
  log(`New image assets: ${newImages.length}`);
  log(`New annotations: ${newAnnotations.length}`);
  log(`Skipped (already exist): ${stats.skippedExisting}`);
  log(`Skipped (missing image): ${stats.skippedMissingImage}`);
  log(`Unmapped conditions: ${stats.unmappedConditions}`);
  log(`Biopsy-confirmed cases: ${stats.biopsied}`);
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
    log("WARNING: Unmapped condition labels (add to PAD_LABEL_MAP):");
    for (const [label, count] of Array.from(unmappedLabels.entries())) {
      log(`  - "${label}" (${count} occurrences)`);
    }
  }

  printDistribution("Condition", conditionDist);
  printDistribution("Skin Tone", skinToneDist);
  printDistribution("Body Site", bodySiteDist);
  printDistribution("Age Group", ageDist);
}

function ageToGroup(age: string): string {
  const n = parseInt(age, 10);
  if (isNaN(n)) return "unknown";
  if (n < 18) return "0-17";
  if (n < 30) return "18-29";
  if (n < 45) return "30-44";
  if (n < 60) return "45-59";
  if (n < 75) return "60-74";
  return "75+";
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
importPad(opts);
