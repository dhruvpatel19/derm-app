/**
 * Unified data loading layer.
 *
 * This is a SERVER-SIDE module that reads generated JSON files from disk at
 * build time and merges them with the hand-authored seed data. All exported
 * functions are safe to call from Next.js server components and route handlers.
 *
 * Data is loaded once at module level and cached for the lifetime of the
 * process.
 */

import * as fs from "fs";
import * as path from "path";

import type {
  ImageAsset,
  ImageAnnotation,
  Condition,
  QuizItem,
} from "@/lib/domain/schemas";

// ---------------------------------------------------------------------------
// Seed data imports
// ---------------------------------------------------------------------------

import { conditions as seedConditions } from "@/data/conditions";
import { imageAssets as seedImageAssets } from "@/data/image-assets";
import { quizItemsV2 as seedQuizItems } from "@/data/quiz-items-v2";

// ---------------------------------------------------------------------------
// JSON loader helper
// ---------------------------------------------------------------------------

const GENERATED_DATA_ROOT = path.resolve(
  path.join(/* turbopackIgnore: true */ process.cwd(), "src", "data", "generated")
);

function loadJSON<T>(filename: string): T[] {
  try {
    const fullPath = path.join(GENERATED_DATA_ROOT, filename);
    const data = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(data) as T[];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Module-level caches (loaded once per process)
// ---------------------------------------------------------------------------

let _allImages: ImageAsset[] | null = null;
let _allAnnotations: ImageAnnotation[] | null = null;
let _annotationsByImage: Map<string, ImageAnnotation[]> | null = null;
let _imagesByConditionSlug: Map<string, ImageAsset[]> | null = null;
let _imageById: Map<string, ImageAsset> | null = null;
let _generatedQuizItems: QuizItem[] | null = null;

// ---------------------------------------------------------------------------
// Internal loaders
// ---------------------------------------------------------------------------

function ensureImages(): ImageAsset[] {
  if (_allImages) return _allImages;

  const scinImages = loadJSON<ImageAsset>("scin-images.json");
  const padImages = loadJSON<ImageAsset>("pad-images.json");

  // Seed images first, then dataset images. Use a Set to dedupe by id.
  const seen = new Set<string>();
  const merged: ImageAsset[] = [];

  for (const img of seedImageAssets) {
    if (!seen.has(img.id)) {
      seen.add(img.id);
      merged.push(img);
    }
  }
  for (const img of scinImages) {
    if (!seen.has(img.id)) {
      seen.add(img.id);
      merged.push(img);
    }
  }
  for (const img of padImages) {
    if (!seen.has(img.id)) {
      seen.add(img.id);
      merged.push(img);
    }
  }

  _allImages = merged;
  return merged;
}

function ensureAnnotations(): ImageAnnotation[] {
  if (_allAnnotations) return _allAnnotations;

  const scinAnns = loadJSON<ImageAnnotation>("scin-annotations.json");
  const padAnns = loadJSON<ImageAnnotation>("pad-annotations.json");

  _allAnnotations = [...scinAnns, ...padAnns];
  return _allAnnotations;
}

function ensureAnnotationsByImage(): Map<string, ImageAnnotation[]> {
  if (_annotationsByImage) return _annotationsByImage;

  const anns = ensureAnnotations();
  const map = new Map<string, ImageAnnotation[]>();
  for (const ann of anns) {
    const existing = map.get(ann.imageAssetId);
    if (existing) {
      existing.push(ann);
    } else {
      map.set(ann.imageAssetId, [ann]);
    }
  }
  _annotationsByImage = map;
  return map;
}

function ensureImageById(): Map<string, ImageAsset> {
  if (_imageById) return _imageById;
  const images = ensureImages();
  _imageById = new Map(images.map((img) => [img.id, img]));
  return _imageById;
}

function ensureImagesByConditionSlug(): Map<string, ImageAsset[]> {
  if (_imagesByConditionSlug) return _imagesByConditionSlug;

  const images = ensureImages();
  const condMap = new Map<string, Condition>();
  for (const c of seedConditions) {
    condMap.set(c.id, c);
  }

  // Build a mapping from normalized diagnosis name (lowercase) to condition slug
  const diagnosisToSlug = new Map<string, string>();
  for (const c of seedConditions) {
    diagnosisToSlug.set(c.name.toLowerCase(), c.slug);
  }

  const map = new Map<string, ImageAsset[]>();

  for (const img of images) {
    // Try conditionId first
    let slug: string | undefined;

    if (img.conditionId) {
      const cond = condMap.get(img.conditionId);
      if (cond) slug = cond.slug;
    }

    // Fall back to matching diagnosisNormalized to condition name
    if (!slug && img.diagnosisNormalized) {
      slug = diagnosisToSlug.get(img.diagnosisNormalized.toLowerCase());
    }

    if (slug) {
      const existing = map.get(slug);
      if (existing) {
        existing.push(img);
      } else {
        map.set(slug, [img]);
      }
    }
  }

  _imagesByConditionSlug = map;
  return map;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Return all image assets (seed + generated). */
export function getAllImageAssets(): ImageAsset[] {
  return ensureImages();
}

/** Return all conditions (seed data). */
export function getAllConditions(): Condition[] {
  return seedConditions;
}

/** Return images linked to a condition by its slug. */
export function getImagesByCondition(conditionSlug: string): ImageAsset[] {
  return ensureImagesByConditionSlug().get(conditionSlug) ?? [];
}

/** Look up a single image by id. */
export function getImageById(id: string): ImageAsset | undefined {
  return ensureImageById().get(id);
}

/** Aggregate stats about the loaded data. */
export function getDatasetStats(): {
  totalImages: number;
  totalConditions: number;
  totalAnnotations: number;
  scinImageCount: number;
  padImageCount: number;
  seedImageCount: number;
  quizItemCount: number;
} {
  const images = ensureImages();
  const anns = ensureAnnotations();

  let scinCount = 0;
  let padCount = 0;
  let seedCount = 0;
  for (const img of images) {
    if (img.datasetSourceId === "scin-google-research") scinCount++;
    else if (img.datasetSourceId === "ds-pad-ufes-20") padCount++;
    else seedCount++;
  }

  return {
    totalImages: images.length,
    totalConditions: seedConditions.length,
    totalAnnotations: anns.length,
    scinImageCount: scinCount,
    padImageCount: padCount,
    seedImageCount: seedCount,
    quizItemCount: getAllQuizItems().length,
  };
}

/** Return all quiz items: hand-authored seed items + dataset-generated items. */
export function getAllQuizItems(): QuizItem[] {
  return [...seedQuizItems, ...getQuizItemsFromDatasets()];
}

/**
 * Generate quiz items from dataset images.
 *
 * For each dataset image that has annotations and is gradable, create:
 * 1. An image_description quiz with required concepts derived from annotations
 * 2. A single_select diagnosis quiz
 *
 * Items are sampled across conditions to keep the total reasonable.
 */
export function getQuizItemsFromDatasets(): QuizItem[] {
  if (_generatedQuizItems) return _generatedQuizItems;

  const images = ensureImages();
  const annMap = ensureAnnotationsByImage();
  const now = new Date().toISOString();

  // Only use dataset images (not seed images), that are gradable and have annotations
  const candidateImages = images.filter(
    (img) =>
      img.isGradable &&
      img.isActive &&
      img.datasetSourceId !== "ds-demo-placeholder" &&
      annMap.has(img.id),
  );

  // Group candidates by diagnosisNormalized
  const byDiagnosis = new Map<string, ImageAsset[]>();
  for (const img of candidateImages) {
    const key = img.diagnosisNormalized.toLowerCase();
    const existing = byDiagnosis.get(key);
    if (existing) {
      existing.push(img);
    } else {
      byDiagnosis.set(key, [img]);
    }
  }

  // Sample up to 5 images per condition, max ~80 total items (40 conditions x 2 quiz types)
  const MAX_PER_CONDITION = 5;
  const sampled: ImageAsset[] = [];

  for (const [, imgs] of byDiagnosis) {
    const take = imgs.slice(0, MAX_PER_CONDITION);
    sampled.push(...take);
  }

  // Cap at 50 images to keep things manageable
  const capped = sampled.slice(0, 50);

  const items: QuizItem[] = [];

  for (const img of capped) {
    const anns = annMap.get(img.id) ?? [];

    // Derive required concepts from annotations
    const diagnosisAnns = anns.filter(
      (a) => a.conceptType === "diagnosis" && a.confidence >= 0.5,
    );
    const bodySiteAnns = anns.filter((a) => a.conceptType === "body_site");
    const textureAnns = anns.filter((a) => a.conceptType === "texture");

    const primaryDiagnosis =
      diagnosisAnns.length > 0 ? diagnosisAnns[0].conceptValue : img.diagnosisNormalized;

    // Build a condition id -- try img.conditionId, otherwise leave as a synthetic id
    const conditionId = img.conditionId ?? `gen-cond-${img.diagnosisNormalized.toLowerCase().replace(/\s+/g, "-")}`;

    // ------ image_description quiz ------
    const descRequiredConcepts = [];

    // Body site concept
    if (bodySiteAnns.length > 0) {
      descRequiredConcepts.push({
        conceptType: "body_site",
        conceptValue: bodySiteAnns[0].conceptValue,
        weight: 1,
        acceptableSynonyms: bodySiteAnns
          .slice(1)
          .map((a) => a.conceptValue),
      });
    } else if (img.bodySite) {
      descRequiredConcepts.push({
        conceptType: "body_site",
        conceptValue: img.bodySite,
        weight: 1,
        acceptableSynonyms: [],
      });
    }

    // Texture concepts
    for (const tex of textureAnns.slice(0, 2)) {
      descRequiredConcepts.push({
        conceptType: "texture",
        conceptValue: tex.conceptValue.replace(/_/g, " "),
        weight: 2,
        acceptableSynonyms: [],
      });
    }

    // Diagnosis concept
    descRequiredConcepts.push({
      conceptType: "diagnosis",
      conceptValue: primaryDiagnosis,
      weight: 3,
      acceptableSynonyms: diagnosisAnns
        .slice(1)
        .map((a) => a.conceptValue),
    });

    // Only create the item if we have enough concepts
    if (descRequiredConcepts.length >= 2) {
      const descItem: QuizItem = {
        id: `gen-desc-${img.id}`,
        title: `Describe: ${primaryDiagnosis}${img.bodySite ? ` (${img.bodySite})` : ""}`,
        imageAssetId: img.id,
        conditionId,
        difficulty: "intermediate",
        datasetSourceId: img.datasetSourceId,
        questionType: "image_description",
        prompt: `Select all morphological features visible in this clinical image.${img.bodySite ? ` Body site: ${img.bodySite}.` : ""}`,
        requiredConcepts: descRequiredConcepts,
        optionalConcepts: [],
        forbiddenAssumptions: [],
        distractors: [],
        topDifferentials: diagnosisAnns.map((a) => a.conceptValue).slice(0, 3),
        explanation: `This image shows ${primaryDiagnosis}${img.bodySite ? ` on the ${img.bodySite}` : ""}. Source: ${img.datasetSourceId}.`,
        scoringWeights: {
          coreMorphology: 0.4,
          secondaryFeatures: 0.25,
          bodySiteDistribution: 0.15,
          differentialQuality: 0.1,
          managementPearl: 0.1,
        },
        isActive: true,
        isReviewed: false,
        createdAt: now,
        updatedAt: now,
      };

      items.push(descItem);
    }

    // ------ single_select diagnosis quiz ------
    const differentials = anns
      .filter((a) => a.conceptType === "differential")
      .map((a) => a.conceptValue);

    // Build distractor list from differentials
    const distractorValues = differentials.slice(0, 3);

    if (distractorValues.length >= 1) {
      const dxItem: QuizItem = {
        id: `gen-dx-${img.id}`,
        title: `Diagnose: ${img.bodySite ? `${img.bodySite} lesion` : "clinical image"}`,
        imageAssetId: img.id,
        conditionId,
        difficulty: "intermediate",
        datasetSourceId: img.datasetSourceId,
        questionType: "single_select",
        prompt: `What is the most likely diagnosis for this clinical image?${img.bodySite ? ` Body site: ${img.bodySite}.` : ""}`,
        requiredConcepts: [
          {
            conceptType: "diagnosis",
            conceptValue: primaryDiagnosis,
            weight: 5,
            acceptableSynonyms: [],
          },
        ],
        optionalConcepts: [],
        forbiddenAssumptions: [],
        distractors: distractorValues.map((d) => ({
          conceptValue: d,
          reason: `Alternative diagnosis considered by dermatologists.`,
        })),
        topDifferentials: [primaryDiagnosis, ...distractorValues],
        explanation: `This image shows ${primaryDiagnosis}${img.bodySite ? ` on the ${img.bodySite}` : ""}. Source: ${img.datasetSourceId}.`,
        scoringWeights: {
          coreMorphology: 0.2,
          secondaryFeatures: 0.1,
          bodySiteDistribution: 0.1,
          differentialQuality: 0.5,
          managementPearl: 0.1,
        },
        isActive: true,
        isReviewed: false,
        createdAt: now,
        updatedAt: now,
      };

      items.push(dxItem);
    }
  }

  _generatedQuizItems = items;
  return items;
}

/** Get annotation objects for a given image id. */
export function getAnnotationsForImage(
  imageAssetId: string,
): ImageAnnotation[] {
  return ensureAnnotationsByImage().get(imageAssetId) ?? [];
}

/** Compute image counts per condition id across all datasets. */
export function getImageCountsByConditionId(): Record<string, number> {
  const images = ensureImages();
  const counts: Record<string, number> = {};
  for (const img of images) {
    if (img.conditionId) {
      counts[img.conditionId] = (counts[img.conditionId] ?? 0) + 1;
    }
  }
  return counts;
}

/** Compute body sites per condition id across all datasets. */
export function getBodySitesByConditionId(): Record<string, string[]> {
  const images = ensureImages();
  const sites: Record<string, Set<string>> = {};
  for (const img of images) {
    if (img.conditionId && img.bodySite) {
      if (!sites[img.conditionId]) {
        sites[img.conditionId] = new Set();
      }
      sites[img.conditionId].add(img.bodySite);
    }
  }
  const result: Record<string, string[]> = {};
  for (const [id, set] of Object.entries(sites)) {
    result[id] = Array.from(set);
  }
  return result;
}
