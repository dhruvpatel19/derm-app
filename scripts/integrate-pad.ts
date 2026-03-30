#!/usr/bin/env tsx
/**
 * PAD-UFES-20 Real Data Integration Script
 *
 * Usage: npx tsx scripts/integrate-pad.ts
 *
 * Reads the actual PAD-UFES-20 metadata.csv and image files across all 3
 * image subfolders, maps them to our domain schema types (ImageAsset and
 * ImageAnnotation), and writes the results as JSON to src/data/generated/.
 *
 * Outputs:
 *   src/data/generated/pad-images.json       - ImageAsset[]
 *   src/data/generated/pad-annotations.json   - ImageAnnotation[]
 *   src/data/generated/pad-stats.json         - summary statistics
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Project root
// ---------------------------------------------------------------------------
const PROJECT_ROOT = path.resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Inline CSV parser (no external deps)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Diagnostic code -> our taxonomy
// ---------------------------------------------------------------------------

interface DiagnosisMapping {
  normalized: string;
  category: string; // matches ConditionCategory enum values
  conditionId: string;
}

const DIAGNOSIS_MAP: Record<string, DiagnosisMapping> = {
  ACK: {
    normalized: "Actinic Keratosis",
    category: "premalignant",
    conditionId: "cond-pad-ack",
  },
  BCC: {
    normalized: "Basal Cell Carcinoma",
    category: "skin_cancer",
    conditionId: "c0000001-0003-4000-8000-000000000001",
  },
  MEL: {
    normalized: "Melanoma",
    category: "skin_cancer",
    conditionId: "c0000001-0004-4000-8000-000000000001",
  },
  NEV: {
    normalized: "Melanocytic Nevus",
    category: "benign_lesion",
    conditionId: "cond-pad-nev",
  },
  SCC: {
    normalized: "Squamous Cell Carcinoma",
    category: "skin_cancer",
    conditionId: "c0000001-0008-4000-8000-000000000001",
  },
  SEK: {
    normalized: "Seborrheic Keratosis",
    category: "benign_lesion",
    conditionId: "c0000001-0009-4000-8000-000000000001",
  },
};

// ---------------------------------------------------------------------------
// Region -> canonical body site
// ---------------------------------------------------------------------------

const BODY_SITE_MAP: Record<string, string> = {
  FACE: "face",
  NOSE: "nose",
  EAR: "ear",
  LIP: "lip",
  SCALP: "scalp",
  NECK: "neck",
  CHEST: "chest",
  BACK: "back",
  ABDOMEN: "abdomen",
  ARM: "upper arm",
  FOREARM: "forearm",
  HAND: "hand",
  THIGH: "thigh",
  FOOT: "foot",
};

function normalizeBodySite(raw: string): string {
  return BODY_SITE_MAP[raw.toUpperCase()] ?? raw.toLowerCase();
}

// ---------------------------------------------------------------------------
// Fitzpatrick normalization (values are like "2.0", "3.0", or empty)
// ---------------------------------------------------------------------------

type FitzpatrickLabel =
  | "fitzpatrick_1"
  | "fitzpatrick_2"
  | "fitzpatrick_3"
  | "fitzpatrick_4"
  | "fitzpatrick_5"
  | "fitzpatrick_6";

function normalizeFitzpatrick(raw: string): FitzpatrickLabel | undefined {
  if (!raw) return undefined;
  const n = Math.round(parseFloat(raw));
  if (n >= 1 && n <= 6) return `fitzpatrick_${n}` as FitzpatrickLabel;
  return undefined;
}

// ---------------------------------------------------------------------------
// Symptom extraction from boolean columns
// ---------------------------------------------------------------------------

function isTruthy(val: string): boolean {
  const v = val.toLowerCase().trim();
  return v === "true" || v === "1" || v === "yes";
}

function extractSymptoms(row: Record<string, string>): string[] {
  const symptoms: string[] = [];
  if (isTruthy(row.itch ?? "")) symptoms.push("itch");
  if (isTruthy(row.grew ?? "")) symptoms.push("grew");
  if (isTruthy(row.hurt ?? "")) symptoms.push("hurt");
  if (isTruthy(row.changed ?? "")) symptoms.push("changed");
  if (isTruthy(row.bleed ?? "")) symptoms.push("bleed");
  if (isTruthy(row.elevation ?? "")) symptoms.push("elevation");
  return symptoms;
}

// ---------------------------------------------------------------------------
// Deterministic UUID v4-like from seed string
// ---------------------------------------------------------------------------

function deterministicId(namespace: string, seed: string): string {
  // Simple FNV-1a 32-bit hash producing a deterministic UUID-shaped string
  let h = 0x811c9dc5;
  const s = `${namespace}:${seed}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const h1 = (h >>> 0).toString(16).padStart(8, "0");

  // Second round for more entropy
  let h2val = 0x811c9dc5;
  const s2 = `${seed}:${namespace}:v2`;
  for (let i = 0; i < s2.length; i++) {
    h2val ^= s2.charCodeAt(i);
    h2val = Math.imul(h2val, 0x01000193);
  }
  const h2 = (h2val >>> 0).toString(16).padStart(8, "0");

  return `${h1.slice(0, 8)}-${h1.slice(0, 4)}-4${h1.slice(5, 8)}-8${h2.slice(0, 3)}-${h2}${h1.slice(0, 4)}`;
}

// ---------------------------------------------------------------------------
// Build an index of all image files across the 3 subfolders
// ---------------------------------------------------------------------------

function buildImageIndex(padDir: string): Map<string, string> {
  const index = new Map<string, string>();
  const imagesRoot = path.join(padDir, "images");

  const subdirs = [
    "imgs_part_1/imgs_part_1",
    "imgs_part_2/imgs_part_2",
    "imgs_part_3/imgs_part_3",
  ];

  for (const subdir of subdirs) {
    const dirPath = path.join(imagesRoot, subdir);
    if (!fs.existsSync(dirPath)) {
      console.warn(`  WARNING: Image subfolder not found: ${dirPath}`);
      continue;
    }
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if (file.toLowerCase().endsWith(".png")) {
        // storagePath relative from project root
        const relativePath = path
          .join("data/datasets/pad-ufes-20/images", subdir, file)
          .replace(/\\/g, "/");
        index.set(file, relativePath);
      }
    }
  }

  return index;
}

// ---------------------------------------------------------------------------
// Output types matching our domain schemas
// ---------------------------------------------------------------------------

interface ImageAssetOutput {
  id: string;
  datasetSourceId: string;
  externalCaseId: string;
  externalImageId: string;
  filename: string;
  altText: string;
  diagnosisOriginal: string;
  diagnosisNormalized: string;
  conditionId: string;
  category: string;
  modality: "clinical_photo";
  bodySite?: string;
  bodySiteOriginal?: string;
  skinToneLabel?: string;
  skinToneSource?: "fitzpatrick_scale";
  pathologyProofLevel: string;
  storageMode: "local";
  storagePath: string;
  sex?: string;
  ageGroup?: string;
  metadataJson: Record<string, unknown>;
  isGradable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ImageAnnotationOutput {
  id: string;
  imageAssetId: string;
  conceptType: string;
  conceptValue: string;
  confidence: number;
  provenance: "dataset_native";
  evidenceNote?: string;
  reviewStatus: "accepted";
  sourceDatasetField?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Age -> age group
// ---------------------------------------------------------------------------

function ageToGroup(age: string): string | undefined {
  const n = parseInt(age, 10);
  if (isNaN(n)) return undefined;
  if (n < 18) return "pediatric";
  if (n < 40) return "young_adult";
  if (n < 65) return "adult";
  return "elderly";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const now = new Date().toISOString();
  const padDir = path.join(PROJECT_ROOT, "data/datasets/pad-ufes-20");
  const metadataPath = path.join(padDir, "metadata.csv");

  console.log("=== PAD-UFES-20 Integration ===\n");

  // 1. Validate inputs exist
  if (!fs.existsSync(metadataPath)) {
    console.error(`ERROR: metadata.csv not found at ${metadataPath}`);
    process.exit(1);
  }

  // 2. Build image file index across all 3 subfolders
  console.log("Building image file index...");
  const imageIndex = buildImageIndex(padDir);
  console.log(`  Found ${imageIndex.size} image files across subfolders\n`);

  // 3. Parse CSV
  console.log("Parsing metadata.csv...");
  const csvText = fs.readFileSync(metadataPath, "utf-8");
  const rows = parseCsv(csvText);
  console.log(`  Parsed ${rows.length} metadata rows\n`);

  if (rows.length === 0) {
    console.error("ERROR: No data rows in metadata.csv");
    process.exit(1);
  }

  // Print CSV columns for verification
  const columns = Object.keys(rows[0]);
  console.log(`  Columns: ${columns.join(", ")}\n`);

  // 4. Process each row
  const imageAssets: ImageAssetOutput[] = [];
  const annotations: ImageAnnotationOutput[] = [];

  // Statistics
  const diagnosisCounts: Record<string, number> = {};
  const bodySiteCounts: Record<string, number> = {};
  const skinToneCounts: Record<string, number> = {};
  const missingFiles: string[] = [];
  let unmappedDiagnosis = 0;

  const datasetSourceId = "ds-pad-ufes-20";

  for (const row of rows) {
    const imgId = row.img_id ?? "";
    const diagnostic = (row.diagnostic ?? "").trim();
    const patientId = (row.patient_id ?? "").trim();
    const lesionId = (row.lesion_id ?? "").trim();
    const region = (row.region ?? "").trim();
    const fitz = (row.fitspatrick ?? "").trim();
    const age = (row.age ?? "").trim();
    const gender = (row.gender ?? "").trim();
    const biopsed = isTruthy(row.biopsed ?? "");
    const diameter1 = (row.diameter_1 ?? "").trim();
    const diameter2 = (row.diameter_2 ?? "").trim();

    // Check if image file exists in our index
    const storagePath = imageIndex.get(imgId);
    if (!storagePath) {
      missingFiles.push(imgId);
      continue;
    }

    // Map diagnosis
    const diagMapping = DIAGNOSIS_MAP[diagnostic];
    if (!diagMapping) {
      unmappedDiagnosis++;
      continue;
    }

    // Normalize fields
    const bodySite = region ? normalizeBodySite(region) : undefined;
    const skinTone = normalizeFitzpatrick(fitz);
    const symptoms = extractSymptoms(row);
    const ageGroup = ageToGroup(age);
    const sex = gender
      ? gender.toLowerCase() === "female"
        ? "female"
        : gender.toLowerCase() === "male"
          ? "male"
          : undefined
      : undefined;

    // Pathology proof: biopsied images have stronger proof
    const proofLevel = biopsed ? "biopsy_proven" : "dataset_label";

    // Build alt text
    const altParts = [`Clinical photograph of ${diagMapping.normalized}`];
    if (bodySite) altParts.push(`on the ${bodySite}`);
    if (skinTone) altParts.push(`(${skinTone.replace("_", " ")})`);
    const altText = altParts.join(" ");

    // Generate deterministic IDs
    const assetId = deterministicId("pad-asset", imgId);
    const externalId = `pad-ufes-20:${imgId}`;

    // Build ImageAsset
    const asset: ImageAssetOutput = {
      id: assetId,
      datasetSourceId,
      externalCaseId: `${patientId}_${lesionId}`,
      externalImageId: externalId,
      filename: imgId,
      altText,
      diagnosisOriginal: diagnostic,
      diagnosisNormalized: diagMapping.normalized,
      conditionId: diagMapping.conditionId,
      category: diagMapping.category,
      modality: "clinical_photo",
      bodySite,
      bodySiteOriginal: region || undefined,
      skinToneLabel: skinTone,
      skinToneSource: skinTone ? "fitzpatrick_scale" : undefined,
      pathologyProofLevel: proofLevel,
      storageMode: "local",
      storagePath,
      sex,
      ageGroup,
      metadataJson: {
        patientId,
        lesionId,
        age: age || undefined,
        gender: gender || undefined,
        smoke: row.smoke || undefined,
        drink: row.drink || undefined,
        pesticide: row.pesticide || undefined,
        skinCancerHistory: row.skin_cancer_history || undefined,
        cancerHistory: row.cancer_history || undefined,
        diameter1: diameter1 || undefined,
        diameter2: diameter2 || undefined,
        biopsed,
        symptoms,
      },
      isGradable: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    imageAssets.push(asset);

    // Build annotations - one per concept type
    // 1. Diagnosis annotation
    const diagAnnotId = deterministicId("pad-ann-diag", imgId);
    annotations.push({
      id: diagAnnotId,
      imageAssetId: assetId,
      conceptType: "diagnosis",
      conceptValue: diagMapping.normalized,
      confidence: biopsed ? 1.0 : 0.9,
      provenance: "dataset_native",
      evidenceNote: biopsed
        ? `Biopsy-confirmed ${diagMapping.normalized} (PAD-UFES-20 dataset label: ${diagnostic})`
        : `Dataset label: ${diagnostic} mapped to ${diagMapping.normalized}`,
      reviewStatus: "accepted",
      sourceDatasetField: "diagnostic",
      createdAt: now,
      updatedAt: now,
    });

    // 2. Body site annotation (if present)
    if (bodySite) {
      const siteAnnotId = deterministicId("pad-ann-site", imgId);
      annotations.push({
        id: siteAnnotId,
        imageAssetId: assetId,
        conceptType: "body_site",
        conceptValue: bodySite,
        confidence: 1.0,
        provenance: "dataset_native",
        evidenceNote: `Original region: ${region}`,
        reviewStatus: "accepted",
        sourceDatasetField: "region",
        createdAt: now,
        updatedAt: now,
      });
    }

    // 3. Symptom annotations
    for (const symptom of symptoms) {
      const symAnnotId = deterministicId(`pad-ann-${symptom}`, imgId);
      const conceptType =
        symptom === "elevation"
          ? "primary_lesion"
          : symptom === "bleed"
            ? "secondary_lesion"
            : symptom === "itch" || symptom === "hurt"
              ? "diagnosis"
              : "diagnosis";
      annotations.push({
        id: symAnnotId,
        imageAssetId: assetId,
        conceptType,
        conceptValue: symptom,
        confidence: 0.9,
        provenance: "dataset_native",
        evidenceNote: `Patient-reported symptom: ${symptom}`,
        reviewStatus: "accepted",
        sourceDatasetField: symptom,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Track stats
    diagnosisCounts[diagMapping.normalized] =
      (diagnosisCounts[diagMapping.normalized] ?? 0) + 1;
    if (bodySite) {
      bodySiteCounts[bodySite] = (bodySiteCounts[bodySite] ?? 0) + 1;
    }
    if (skinTone) {
      skinToneCounts[skinTone] = (skinToneCounts[skinTone] ?? 0) + 1;
    }
  }

  // 5. Build stats object
  const stats = {
    generatedAt: now,
    datasetSource: "PAD-UFES-20",
    totalMetadataRows: rows.length,
    totalImagesIncluded: imageAssets.length,
    totalAnnotations: annotations.length,
    missingImageFiles: missingFiles.length,
    unmappedDiagnoses: unmappedDiagnosis,
    byDiagnosis: Object.entries(diagnosisCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ label, count })),
    byBodySite: Object.entries(bodySiteCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([site, count]) => ({ site, count })),
    bySkinTone: Object.entries(skinToneCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tone, count]) => ({ tone, count })),
    missingFilesList: missingFiles.slice(0, 20), // first 20 for inspection
  };

  // 6. Ensure output directory
  const outputDir = path.join(PROJECT_ROOT, "src/data/generated");
  fs.mkdirSync(outputDir, { recursive: true });

  // Create .gitkeep
  const gitkeepPath = path.join(outputDir, ".gitkeep");
  if (!fs.existsSync(gitkeepPath)) {
    fs.writeFileSync(gitkeepPath, "", "utf-8");
  }

  // 7. Write output files
  const imagesOutPath = path.join(outputDir, "pad-images.json");
  const annotationsOutPath = path.join(outputDir, "pad-annotations.json");
  const statsOutPath = path.join(outputDir, "pad-stats.json");

  fs.writeFileSync(imagesOutPath, JSON.stringify(imageAssets, null, 2), "utf-8");
  fs.writeFileSync(
    annotationsOutPath,
    JSON.stringify(annotations, null, 2),
    "utf-8"
  );
  fs.writeFileSync(statsOutPath, JSON.stringify(stats, null, 2), "utf-8");

  // 8. Print summary
  console.log("=== Results ===\n");
  console.log(`Total metadata rows:      ${rows.length}`);
  console.log(`Images included:          ${imageAssets.length}`);
  console.log(`Annotations generated:    ${annotations.length}`);
  console.log(`Missing image files:      ${missingFiles.length}`);
  console.log(`Unmapped diagnoses:       ${unmappedDiagnosis}`);

  console.log("\n--- By Diagnosis ---");
  for (const { label, count } of stats.byDiagnosis) {
    const pct = ((count / imageAssets.length) * 100).toFixed(1);
    console.log(`  ${label.padEnd(28)} ${String(count).padStart(5)}  (${pct}%)`);
  }

  console.log("\n--- By Body Site ---");
  for (const { site, count } of stats.byBodySite) {
    const pct = ((count / imageAssets.length) * 100).toFixed(1);
    console.log(`  ${site.padEnd(28)} ${String(count).padStart(5)}  (${pct}%)`);
  }

  console.log("\n--- By Skin Tone ---");
  for (const { tone, count } of stats.bySkinTone) {
    const pct = ((count / imageAssets.length) * 100).toFixed(1);
    console.log(`  ${tone.padEnd(28)} ${String(count).padStart(5)}  (${pct}%)`);
  }

  if (missingFiles.length > 0) {
    console.log(`\n--- Missing Files (first 20 of ${missingFiles.length}) ---`);
    for (const f of missingFiles.slice(0, 20)) {
      console.log(`  ${f}`);
    }
  }

  console.log("\n--- Output Files ---");
  console.log(`  ${imagesOutPath}`);
  console.log(`  ${annotationsOutPath}`);
  console.log(`  ${statsOutPath}`);
  console.log("\nDone.");
}

main();
