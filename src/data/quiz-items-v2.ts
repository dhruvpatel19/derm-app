import type { QuizItem } from "@/lib/domain/schemas";

const now = "2026-03-29T00:00:00Z";
const demoDatasetSourceId = "ds-demo-placeholder";

/**
 * Quiz items v2 -- image-specific, dataset-backed quiz seed data.
 *
 * Each item references an ImageAsset by id and a Condition by id.
 * requiredConcepts only include features visibly supported by the
 * specific image altText. forbiddenAssumptions list disease-typical
 * features NOT visible in that particular image.
 */
export const quizItemsV2: QuizItem[] = [
  // =========================================================================
  // IMAGE_DESCRIPTION items (5)
  // =========================================================================

  // 1. Psoriasis elbow -- image_description
  {
    id: "qi-v2-0001",
    title: "Describe the Psoriatic Plaque (Elbow)",
    imageAssetId: "a0000001-0001-4000-8000-000000000001",
    conditionId: "c0000001-0001-4000-8000-000000000001",
    difficulty: "beginner",
    datasetSourceId: demoDatasetSourceId,
    questionType: "image_description",
    prompt:
      "Select all morphological features visible in this clinical image of the elbow.",
    requiredConcepts: [
      { conceptType: "primary_lesion", conceptValue: "plaque", weight: 3, acceptableSynonyms: ["elevated plaque"] },
      { conceptType: "color", conceptValue: "erythematous", weight: 2, acceptableSynonyms: ["red", "erythema"] },
      { conceptType: "secondary_lesion", conceptValue: "scale", weight: 3, acceptableSynonyms: ["silvery scale", "silvery-white scale"] },
      { conceptType: "border", conceptValue: "well-demarcated", weight: 2, acceptableSynonyms: ["sharply demarcated", "well-defined"] },
      { conceptType: "body_site", conceptValue: "elbow", weight: 1, acceptableSynonyms: ["extensor elbow"] },
    ],
    optionalConcepts: [
      { conceptType: "distribution", conceptValue: "extensor", bonusWeight: 1 },
    ],
    forbiddenAssumptions: [
      { conceptValue: "nail pitting", reason: "Nail pitting is typical of psoriasis but nails are not visible in this image." },
      { conceptValue: "Auspitz sign", reason: "Auspitz sign requires scale removal and cannot be assessed from this photo." },
    ],
    distractors: [
      { conceptValue: "vesicle", reason: "Vesicles are not a feature of plaque psoriasis." },
      { conceptValue: "lichenification", reason: "Lichenification suggests chronic eczema, not psoriasis." },
    ],
    topDifferentials: ["Plaque Psoriasis", "Nummular Eczema", "Tinea Corporis"],
    dangerousMimic: "Squamous Cell Carcinoma",
    explanation:
      "This image shows a well-demarcated erythematous plaque with silvery-white scale on the extensor elbow. The sharp borders and characteristic micaceous scale are hallmarks of plaque psoriasis. The extensor surface location is classic.",
    managementPearl:
      "Topical corticosteroids combined with vitamin D analogues (calcipotriol) are first-line for limited plaque psoriasis.",
    goldStandardDescription:
      "Well-demarcated erythematous plaque with thick silvery-white (micaceous) scale on the extensor elbow surface.",
    scoringWeights: { coreMorphology: 0.40, secondaryFeatures: 0.25, bodySiteDistribution: 0.15, differentialQuality: 0.10, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 2. Atopic dermatitis flexural -- image_description
  {
    id: "qi-v2-0002",
    title: "Describe the Eczematous Patch (Antecubital Fossa)",
    imageAssetId: "a0000001-0002-4000-8000-000000000001",
    conditionId: "c0000001-0002-4000-8000-000000000001",
    difficulty: "beginner",
    datasetSourceId: demoDatasetSourceId,
    questionType: "image_description",
    prompt:
      "Select all morphological features visible in this clinical image of the antecubital fossa.",
    requiredConcepts: [
      { conceptType: "primary_lesion", conceptValue: "patch", weight: 2, acceptableSynonyms: ["flat patch", "erythematous patch"] },
      { conceptType: "color", conceptValue: "erythematous", weight: 2, acceptableSynonyms: ["red", "erythema"] },
      { conceptType: "secondary_lesion", conceptValue: "lichenification", weight: 3, acceptableSynonyms: ["thickened skin", "lichenified"] },
      { conceptType: "border", conceptValue: "ill-defined", weight: 2, acceptableSynonyms: ["poorly demarcated", "indistinct borders"] },
      { conceptType: "body_site", conceptValue: "antecubital fossa", weight: 1, acceptableSynonyms: ["arm flexure", "elbow crease"] },
    ],
    optionalConcepts: [
      { conceptType: "distribution", conceptValue: "flexural", bonusWeight: 1 },
    ],
    forbiddenAssumptions: [
      { conceptValue: "vesicle", reason: "Vesicles are seen in acute eczema flares but are not visible in this chronic lichenified image." },
      { conceptValue: "xerosis", reason: "Generalized dry skin cannot be assessed from this localized photo." },
    ],
    distractors: [
      { conceptValue: "silvery scale", reason: "Silvery scale is characteristic of psoriasis, not eczema." },
      { conceptValue: "annular", reason: "Annular morphology suggests tinea, not atopic dermatitis." },
    ],
    topDifferentials: ["Atopic Dermatitis", "Contact Dermatitis", "Tinea Corporis"],
    explanation:
      "This image shows poorly demarcated erythematous patches with lichenification in the antecubital fossa. The ill-defined borders and flexural distribution are classic for atopic dermatitis. Lichenification indicates chronicity.",
    managementPearl:
      "Emollients are the cornerstone of atopic dermatitis management. Apply immediately after bathing to trap moisture.",
    goldStandardDescription:
      "Poorly demarcated erythematous patches with lichenification in the antecubital fossa.",
    scoringWeights: { coreMorphology: 0.40, secondaryFeatures: 0.25, bodySiteDistribution: 0.15, differentialQuality: 0.10, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 3. BCC nodular -- image_description
  {
    id: "qi-v2-0003",
    title: "Describe the Papule on the Nose",
    imageAssetId: "a0000001-0003-4000-8000-000000000001",
    conditionId: "c0000001-0003-4000-8000-000000000001",
    difficulty: "intermediate",
    datasetSourceId: demoDatasetSourceId,
    questionType: "image_description",
    prompt:
      "Select all morphological features visible in this clinical image of a lesion on the nose.",
    requiredConcepts: [
      { conceptType: "primary_lesion", conceptValue: "papule", weight: 2, acceptableSynonyms: ["nodule", "raised lesion"] },
      { conceptType: "color", conceptValue: "pearly", weight: 3, acceptableSynonyms: ["translucent", "pearly white"] },
      { conceptType: "border", conceptValue: "rolled", weight: 3, acceptableSynonyms: ["rolled borders", "raised borders"] },
      { conceptType: "secondary_lesion", conceptValue: "telangiectasia", weight: 2, acceptableSynonyms: ["arborizing telangiectasia", "visible blood vessels"] },
      { conceptType: "body_site", conceptValue: "nose", weight: 1, acceptableSynonyms: ["nasal", "face"] },
    ],
    optionalConcepts: [
      { conceptType: "texture", conceptValue: "smooth", bonusWeight: 1 },
    ],
    forbiddenAssumptions: [
      { conceptValue: "ulceration", reason: "Central ulceration is common in BCC but is not visible in this particular image." },
      { conceptValue: "morpheaform", reason: "This is a nodular BCC; morpheaform features are not visible here." },
    ],
    distractors: [
      { conceptValue: "keratotic", reason: "Keratotic surface suggests SCC, not BCC." },
      { conceptValue: "pigmented macule", reason: "This lesion is raised and pearly, not a flat pigmented macule." },
    ],
    topDifferentials: ["Basal Cell Carcinoma", "Squamous Cell Carcinoma", "Intradermal Nevus", "Seborrheic Keratosis"],
    dangerousMimic: "Melanoma",
    explanation:
      "This image shows a pearly papule with arborizing telangiectasia and rolled borders on the nose. The pearly translucent quality with visible telangiectasia is the hallmark of nodular basal cell carcinoma. The nose is the most common site.",
    managementPearl:
      "Mohs micrographic surgery is the treatment of choice for BCC on the nose and other high-risk facial sites due to tissue conservation and margin control.",
    goldStandardDescription:
      "Pearly papule with arborizing telangiectasia and rolled borders on the nose.",
    scoringWeights: { coreMorphology: 0.35, secondaryFeatures: 0.25, bodySiteDistribution: 0.15, differentialQuality: 0.15, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 4. Melanoma SSM -- image_description
  {
    id: "qi-v2-0004",
    title: "Describe the Pigmented Lesion (Back)",
    imageAssetId: "a0000001-0004-4000-8000-000000000001",
    conditionId: "c0000001-0004-4000-8000-000000000001",
    difficulty: "intermediate",
    datasetSourceId: demoDatasetSourceId,
    questionType: "image_description",
    prompt:
      "Select all morphological features visible in this pigmented lesion on the back.",
    requiredConcepts: [
      { conceptType: "primary_lesion", conceptValue: "macule", weight: 2, acceptableSynonyms: ["flat lesion", "pigmented macule"] },
      { conceptType: "color", conceptValue: "hyperpigmented", weight: 2, acceptableSynonyms: ["pigmented", "dark"] },
      { conceptType: "border", conceptValue: "irregular", weight: 3, acceptableSynonyms: ["irregular borders", "notched borders"] },
      { conceptType: "shape", conceptValue: "asymmetric", weight: 3, acceptableSynonyms: ["asymmetry"] },
      { conceptType: "body_site", conceptValue: "back", weight: 1, acceptableSynonyms: ["trunk", "upper back"] },
    ],
    optionalConcepts: [
      { conceptType: "color", conceptValue: "brown", bonusWeight: 1 },
      { conceptType: "color", conceptValue: "black", bonusWeight: 1 },
    ],
    forbiddenAssumptions: [
      { conceptValue: "ulceration", reason: "Ulceration is a prognostic feature of melanoma but is not visible in this superficial spreading lesion." },
      { conceptValue: "nodule", reason: "This is a flat superficial spreading melanoma; there is no nodular component visible." },
    ],
    distractors: [
      { conceptValue: "pearly", reason: "Pearly quality suggests BCC, not melanoma." },
      { conceptValue: "verrucous", reason: "Verrucous surface suggests seborrheic keratosis, not melanoma." },
    ],
    topDifferentials: ["Melanoma", "Dysplastic Nevus", "Seborrheic Keratosis", "Lentigo"],
    dangerousMimic: "Seborrheic Keratosis",
    explanation:
      "This image shows an asymmetric pigmented macule with irregular borders and color variegation on the back. The asymmetry, border irregularity, and color variation fulfill the ABCDE criteria for melanoma. This is a superficial spreading melanoma.",
    managementPearl:
      "Excisional biopsy (not shave) is required for suspected melanoma to accurately measure Breslow depth, which determines prognosis and surgical margins.",
    goldStandardDescription:
      "Asymmetric pigmented macule with irregular borders and color variegation on the back.",
    scoringWeights: { coreMorphology: 0.35, secondaryFeatures: 0.20, bodySiteDistribution: 0.10, differentialQuality: 0.20, managementPearl: 0.15 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 5. Herpes zoster -- image_description
  {
    id: "qi-v2-0005",
    title: "Describe the Vesicular Eruption (Thorax)",
    imageAssetId: "a0000001-0010-4000-8000-000000000001",
    conditionId: "c0000001-0010-4000-8000-000000000001",
    difficulty: "beginner",
    datasetSourceId: demoDatasetSourceId,
    questionType: "image_description",
    prompt:
      "Select all morphological features visible in this vesicular eruption on the thorax.",
    requiredConcepts: [
      { conceptType: "primary_lesion", conceptValue: "vesicle", weight: 3, acceptableSynonyms: ["vesicles", "blisters"] },
      { conceptType: "arrangement", conceptValue: "grouped", weight: 3, acceptableSynonyms: ["clustered", "herpetiform"] },
      { conceptType: "distribution", conceptValue: "dermatomal", weight: 3, acceptableSynonyms: ["dermatome", "band-like"] },
      { conceptType: "color", conceptValue: "erythematous", weight: 1, acceptableSynonyms: ["red", "erythema"] },
      { conceptType: "body_site", conceptValue: "thorax", weight: 1, acceptableSynonyms: ["chest", "trunk"] },
    ],
    optionalConcepts: [
      { conceptType: "secondary_lesion", conceptValue: "crust", bonusWeight: 1 },
    ],
    forbiddenAssumptions: [
      { conceptValue: "Hutchinson sign", reason: "Hutchinson sign involves the nose tip and is not relevant to a thoracic dermatome image." },
      { conceptValue: "postherpetic neuralgia", reason: "PHN is a clinical symptom, not a morphologic finding visible in the image." },
    ],
    distractors: [
      { conceptValue: "annular", reason: "Annular morphology suggests tinea, not herpes zoster." },
      { conceptValue: "symmetric", reason: "Herpes zoster is characteristically unilateral, not symmetric." },
    ],
    topDifferentials: ["Herpes Zoster", "Contact Dermatitis", "Herpes Simplex", "Bullous Pemphigoid"],
    explanation:
      "This image shows grouped vesicles in a dermatomal band along the left thorax. The combination of grouped vesicles in a unilateral dermatomal distribution is pathognomonic for herpes zoster (shingles).",
    managementPearl:
      "Valacyclovir 1g TID for 7 days should be started within 72 hours of rash onset to reduce severity and risk of postherpetic neuralgia.",
    goldStandardDescription:
      "Grouped vesicles on an erythematous base in a dermatomal band along the left thorax.",
    scoringWeights: { coreMorphology: 0.35, secondaryFeatures: 0.20, bodySiteDistribution: 0.25, differentialQuality: 0.10, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // =========================================================================
  // SINGLE_SELECT items (5)
  // =========================================================================

  // 6. Tinea corporis -- single_select
  {
    id: "qi-v2-0006",
    title: "Diagnose the Annular Plaque (Arm)",
    imageAssetId: "a0000001-0005-4000-8000-000000000001",
    conditionId: "c0000001-0005-4000-8000-000000000001",
    difficulty: "beginner",
    datasetSourceId: demoDatasetSourceId,
    questionType: "single_select",
    prompt:
      "What is the most likely diagnosis for this annular plaque with central clearing on the arm?",
    requiredConcepts: [
      { conceptType: "diagnosis", conceptValue: "Tinea Corporis", weight: 5, acceptableSynonyms: ["ringworm", "dermatophytosis", "tinea"] },
    ],
    optionalConcepts: [],
    forbiddenAssumptions: [],
    distractors: [
      { conceptValue: "Nummular Eczema", reason: "Nummular eczema lacks central clearing and the raised advancing border." },
      { conceptValue: "Granuloma Annulare", reason: "Granuloma annulare lacks scale; its border is composed of dermal papules." },
      { conceptValue: "Pityriasis Rosea", reason: "Pityriasis rosea has a herald patch and Christmas tree distribution, not a solitary annular plaque." },
    ],
    topDifferentials: ["Tinea Corporis", "Nummular Eczema", "Granuloma Annulare", "Pityriasis Rosea"],
    explanation:
      "The annular erythematous plaque with a raised scaly border and central clearing is the hallmark of tinea corporis. The trailing scale (inner edge of the advancing border) is a key clinical clue. KOH preparation should be performed before treatment.",
    managementPearl:
      "Topical terbinafine or clotrimazole for 2-4 weeks for localized tinea corporis. Always check for tinea pedis as a source of reinfection.",
    goldStandardDescription:
      "Annular erythematous plaque with raised scaly border and central clearing on the arm.",
    scoringWeights: { coreMorphology: 0.20, secondaryFeatures: 0.10, bodySiteDistribution: 0.10, differentialQuality: 0.50, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 7. Contact dermatitis -- single_select
  {
    id: "qi-v2-0007",
    title: "Diagnose the Vesicular Eruption (Hands)",
    imageAssetId: "a0000001-0006-4000-8000-000000000001",
    conditionId: "c0000001-0006-4000-8000-000000000001",
    difficulty: "beginner",
    datasetSourceId: demoDatasetSourceId,
    questionType: "single_select",
    prompt:
      "What is the most likely diagnosis for this vesicular eruption on the dorsal hands with sharp cutoff at the wrists?",
    requiredConcepts: [
      { conceptType: "diagnosis", conceptValue: "Contact Dermatitis", weight: 5, acceptableSynonyms: ["allergic contact dermatitis", "ACD", "irritant contact dermatitis"] },
    ],
    optionalConcepts: [],
    forbiddenAssumptions: [],
    distractors: [
      { conceptValue: "Dyshidrotic Eczema", reason: "Dyshidrotic eczema involves the palms and lateral fingers, not the dorsal hands with a sharp cutoff." },
      { conceptValue: "Scabies", reason: "Scabies involves the web spaces and has burrows, not a sharp geometric cutoff." },
      { conceptValue: "Tinea Manuum", reason: "Tinea manuum is typically unilateral with fine scale, not a vesicular eruption with sharp cutoff." },
    ],
    topDifferentials: ["Contact Dermatitis", "Dyshidrotic Eczema", "Scabies", "Tinea Manuum"],
    explanation:
      "The erythematous vesicular eruption on the dorsal hands with a sharp cutoff at the wrists is pathognomonic for contact dermatitis. The geometric distribution matching the edge of gloves strongly implicates glove-related allergens.",
    managementPearl:
      "Identifying and avoiding the causative agent is the most critical step. Patch testing referral is indicated for suspected allergic contact dermatitis.",
    goldStandardDescription:
      "Erythematous vesicular eruption on the dorsal hands with sharp cutoff at the wrists.",
    scoringWeights: { coreMorphology: 0.15, secondaryFeatures: 0.10, bodySiteDistribution: 0.15, differentialQuality: 0.50, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 8. Acne vulgaris -- single_select
  {
    id: "qi-v2-0008",
    title: "Diagnose the Facial Eruption",
    imageAssetId: "a0000001-0007-4000-8000-000000000002",
    conditionId: "c0000001-0007-4000-8000-000000000001",
    difficulty: "beginner",
    datasetSourceId: demoDatasetSourceId,
    questionType: "single_select",
    prompt:
      "What is the most likely diagnosis for this eruption of papules, pustules, and comedones on the face?",
    requiredConcepts: [
      { conceptType: "diagnosis", conceptValue: "Acne Vulgaris", weight: 5, acceptableSynonyms: ["acne", "acne vulgaris"] },
    ],
    optionalConcepts: [],
    forbiddenAssumptions: [],
    distractors: [
      { conceptValue: "Rosacea", reason: "Rosacea presents with papules and pustules but lacks comedones, which are present here." },
      { conceptValue: "Bacterial Folliculitis", reason: "Folliculitis lacks comedones and usually presents as monomorphic pustules." },
      { conceptValue: "Perioral Dermatitis", reason: "Perioral dermatitis involves the perioral area with micropapules and lacks comedones." },
    ],
    topDifferentials: ["Acne Vulgaris", "Rosacea", "Bacterial Folliculitis", "Perioral Dermatitis"],
    explanation:
      "The presence of comedones (both open and closed) alongside erythematous papules and pustules on the face is diagnostic of acne vulgaris. Comedones are the signature lesion that distinguishes acne from its mimics.",
    managementPearl:
      "Topical retinoids are the foundation of all acne therapy. Never prescribe topical antibiotics without benzoyl peroxide to prevent resistance.",
    goldStandardDescription:
      "Erythematous papules and pustules with comedones on the face.",
    scoringWeights: { coreMorphology: 0.15, secondaryFeatures: 0.10, bodySiteDistribution: 0.10, differentialQuality: 0.55, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 9. SCC -- single_select
  {
    id: "qi-v2-0009",
    title: "Diagnose the Keratotic Nodule (Ear)",
    imageAssetId: "a0000001-0008-4000-8000-000000000001",
    conditionId: "c0000001-0008-4000-8000-000000000001",
    difficulty: "intermediate",
    datasetSourceId: demoDatasetSourceId,
    questionType: "single_select",
    prompt:
      "What is the most likely diagnosis for this firm keratotic nodule with cutaneous horn on the ear?",
    requiredConcepts: [
      { conceptType: "diagnosis", conceptValue: "Squamous Cell Carcinoma", weight: 5, acceptableSynonyms: ["SCC", "squamous cell carcinoma", "cutaneous SCC"] },
    ],
    optionalConcepts: [],
    forbiddenAssumptions: [],
    distractors: [
      { conceptValue: "Basal Cell Carcinoma", reason: "BCC is typically pearly and smooth, not keratotic with a cutaneous horn." },
      { conceptValue: "Actinic Keratosis", reason: "While AK is a precursor, this is a firm nodule with a horn, indicating invasive SCC." },
      { conceptValue: "Seborrheic Keratosis", reason: "SK has a stuck-on waxy appearance, not a firm keratotic nodule with a horn." },
    ],
    topDifferentials: ["Squamous Cell Carcinoma", "Actinic Keratosis", "Basal Cell Carcinoma", "Keratoacanthoma"],
    dangerousMimic: "Basal Cell Carcinoma",
    explanation:
      "A firm keratotic nodule with a cutaneous horn on the ear is highly suspicious for squamous cell carcinoma. The ear is a high-risk site for SCC with higher metastatic potential. Cutaneous horns have a significant rate of SCC at their base.",
    managementPearl:
      "SCC on the ear is considered high-risk. Mohs surgery or excision with wide margins (4-6 mm) is recommended. The ear has higher rates of perineural invasion.",
    goldStandardDescription:
      "Firm keratotic nodule with cutaneous horn on the ear.",
    scoringWeights: { coreMorphology: 0.15, secondaryFeatures: 0.10, bodySiteDistribution: 0.10, differentialQuality: 0.50, managementPearl: 0.15 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 10. Seborrheic keratosis -- single_select
  {
    id: "qi-v2-0010",
    title: "Diagnose the Stuck-On Papule (Back)",
    imageAssetId: "a0000001-0009-4000-8000-000000000001",
    conditionId: "c0000001-0009-4000-8000-000000000001",
    difficulty: "beginner",
    datasetSourceId: demoDatasetSourceId,
    questionType: "single_select",
    prompt:
      "What is the most likely diagnosis for this brown, stuck-on appearing papule with verrucous surface on the back?",
    requiredConcepts: [
      { conceptType: "diagnosis", conceptValue: "Seborrheic Keratosis", weight: 5, acceptableSynonyms: ["SK", "seborrheic keratosis", "seb kerat"] },
    ],
    optionalConcepts: [],
    forbiddenAssumptions: [],
    distractors: [
      { conceptValue: "Melanoma", reason: "Melanoma lacks the waxy stuck-on quality and verrucous surface of SK." },
      { conceptValue: "Basal Cell Carcinoma", reason: "Pigmented BCC is pearly with arborizing vessels, not waxy and verrucous." },
      { conceptValue: "Dermatofibroma", reason: "Dermatofibroma is a firm dermal papule with a dimple sign, not a stuck-on verrucous lesion." },
    ],
    topDifferentials: ["Seborrheic Keratosis", "Melanoma", "Pigmented BCC", "Dermatofibroma"],
    dangerousMimic: "Melanoma",
    explanation:
      "The brown, stuck-on appearing papule with a verrucous (cerebriform) surface on the back is classic for seborrheic keratosis. The waxy stuck-on quality and verrucous surface texture are the key distinguishing features.",
    managementPearl:
      "No treatment is necessary for asymptomatic SK. If a darkly pigmented lesion lacks classic SK features (horn cysts, milia-like cysts on dermoscopy), biopsy to rule out melanoma.",
    goldStandardDescription:
      "Brown, stuck-on appearing papule with verrucous surface on the back.",
    scoringWeights: { coreMorphology: 0.15, secondaryFeatures: 0.10, bodySiteDistribution: 0.10, differentialQuality: 0.50, managementPearl: 0.15 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // =========================================================================
  // DIFFERENTIAL_RANK items (3)
  // =========================================================================

  // 11. Melanoma nodular -- differential_rank
  {
    id: "qi-v2-0011",
    title: "Rank Differentials for Nodular Lesion (Trunk)",
    imageAssetId: "a0000001-0004-4000-8000-000000000002",
    conditionId: "c0000001-0004-4000-8000-000000000001",
    difficulty: "advanced",
    datasetSourceId: demoDatasetSourceId,
    questionType: "differential_rank",
    prompt:
      "Rank the top 3 differential diagnoses for this dark dome-shaped nodule with ulceration on the trunk, from most to least likely.",
    requiredConcepts: [
      { conceptType: "differential", conceptValue: "Melanoma", weight: 3, acceptableSynonyms: ["nodular melanoma"] },
      { conceptType: "differential", conceptValue: "Basal Cell Carcinoma", weight: 2, acceptableSynonyms: ["BCC", "pigmented BCC"] },
      { conceptType: "differential", conceptValue: "Squamous Cell Carcinoma", weight: 1, acceptableSynonyms: ["SCC"] },
    ],
    optionalConcepts: [
      { conceptType: "differential", conceptValue: "Pyogenic Granuloma", bonusWeight: 1 },
    ],
    forbiddenAssumptions: [
      { conceptValue: "seborrheic keratosis", reason: "An ulcerated dark nodule should not be dismissed as SK without biopsy." },
    ],
    distractors: [
      { conceptValue: "Dermatofibroma", reason: "Dermatofibromas are firm but not ulcerated dark nodules." },
      { conceptValue: "Epidermal Cyst", reason: "Epidermal cysts are flesh-colored subcutaneous nodules, not darkly pigmented." },
      { conceptValue: "Lipoma", reason: "Lipomas are soft subcutaneous masses, not ulcerated pigmented nodules." },
    ],
    topDifferentials: ["Melanoma", "Basal Cell Carcinoma", "Squamous Cell Carcinoma", "Pyogenic Granuloma", "Merkel Cell Carcinoma"],
    dangerousMimic: "Basal Cell Carcinoma",
    explanation:
      "A dark dome-shaped nodule with ulceration on the trunk is melanoma until proven otherwise. Nodular melanoma accounts for 15% of melanomas but a disproportionate share of melanoma deaths because it grows vertically early. The EFG rule (Elevated, Firm, Growing) applies here rather than classic ABCDE.",
    managementPearl:
      "Urgent excisional biopsy is needed. Shave biopsy is contraindicated for suspected melanoma as it may transect the lesion and make Breslow depth measurement impossible.",
    goldStandardDescription:
      "Dark, dome-shaped nodule with ulceration on the trunk.",
    scoringWeights: { coreMorphology: 0.15, secondaryFeatures: 0.10, bodySiteDistribution: 0.05, differentialQuality: 0.55, managementPearl: 0.15 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 12. Superficial BCC -- differential_rank
  {
    id: "qi-v2-0012",
    title: "Rank Differentials for Scaly Plaque (Trunk)",
    imageAssetId: "a0000001-0003-4000-8000-000000000002",
    conditionId: "c0000001-0003-4000-8000-000000000001",
    difficulty: "advanced",
    datasetSourceId: demoDatasetSourceId,
    questionType: "differential_rank",
    prompt:
      "Rank the top 3 differential diagnoses for this thin erythematous scaly plaque with a thread-like pearly border on the trunk.",
    requiredConcepts: [
      { conceptType: "differential", conceptValue: "Basal Cell Carcinoma", weight: 3, acceptableSynonyms: ["BCC", "superficial BCC"] },
      { conceptType: "differential", conceptValue: "Bowen Disease", weight: 2, acceptableSynonyms: ["SCC in situ", "Squamous Cell Carcinoma in situ"] },
      { conceptType: "differential", conceptValue: "Psoriasis", weight: 1, acceptableSynonyms: ["plaque psoriasis"] },
    ],
    optionalConcepts: [
      { conceptType: "differential", conceptValue: "Nummular Eczema", bonusWeight: 1 },
    ],
    forbiddenAssumptions: [
      { conceptValue: "nodular BCC", reason: "This is a superficial subtype, not nodular; the lesion is flat with a thread-like border." },
    ],
    distractors: [
      { conceptValue: "Tinea Corporis", reason: "Tinea has an annular shape with central clearing, not a thread-like pearly border." },
      { conceptValue: "Seborrheic Keratosis", reason: "SK has a stuck-on waxy appearance, not a thin scaly plaque with pearly rim." },
      { conceptValue: "Melanoma", reason: "This is an erythematous, not pigmented, plaque." },
    ],
    topDifferentials: ["Basal Cell Carcinoma", "Bowen Disease", "Psoriasis", "Nummular Eczema", "Superficial SCC"],
    explanation:
      "The thread-like pearly border is the key feature that distinguishes superficial BCC from other erythematous scaly plaques. Superficial BCC presents as a thin pink scaly plaque, quite different from the nodular subtype. It must be distinguished from Bowen disease (SCC in situ) and inflammatory conditions.",
    managementPearl:
      "Superficial BCC can be treated with topical imiquimod, photodynamic therapy, or ED&C in addition to excision.",
    goldStandardDescription:
      "Thin erythematous scaly plaque with a thread-like pearly border on the trunk.",
    scoringWeights: { coreMorphology: 0.15, secondaryFeatures: 0.10, bodySiteDistribution: 0.05, differentialQuality: 0.60, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 13. Pigmented SK vs melanoma -- differential_rank
  {
    id: "qi-v2-0013",
    title: "Rank Differentials for Pigmented Lesion (Trunk)",
    imageAssetId: "a0000001-0009-4000-8000-000000000002",
    conditionId: "c0000001-0009-4000-8000-000000000001",
    difficulty: "advanced",
    datasetSourceId: demoDatasetSourceId,
    questionType: "differential_rank",
    prompt:
      "Rank the top 3 differential diagnoses for this darkly pigmented lesion on the trunk that could mimic melanoma.",
    requiredConcepts: [
      { conceptType: "differential", conceptValue: "Seborrheic Keratosis", weight: 3, acceptableSynonyms: ["SK"] },
      { conceptType: "differential", conceptValue: "Melanoma", weight: 2, acceptableSynonyms: ["malignant melanoma"] },
      { conceptType: "differential", conceptValue: "Pigmented BCC", weight: 1, acceptableSynonyms: ["pigmented basal cell carcinoma"] },
    ],
    optionalConcepts: [
      { conceptType: "differential", conceptValue: "Solar Lentigo", bonusWeight: 1 },
    ],
    forbiddenAssumptions: [
      { conceptValue: "benign nevus", reason: "A darkly pigmented lesion mimicking melanoma should not be assumed to be a benign nevus without dermoscopy." },
    ],
    distractors: [
      { conceptValue: "Hemangioma", reason: "Hemangiomas are vascular, not pigmented lesions." },
      { conceptValue: "Dermatofibroma", reason: "Dermatofibroma does not typically present as a darkly pigmented SK-like lesion." },
      { conceptValue: "Actinic Keratosis", reason: "AK is a rough scaly patch, not a darkly pigmented papule." },
    ],
    topDifferentials: ["Seborrheic Keratosis", "Melanoma", "Pigmented BCC", "Solar Lentigo", "Dysplastic Nevus"],
    dangerousMimic: "Melanoma",
    explanation:
      "Darkly pigmented seborrheic keratoses are one of the most common melanoma mimics. While the stuck-on quality and cerebriform surface favor SK, dermoscopy is essential. If horn cysts and milia-like cysts are absent, biopsy is mandatory to rule out melanoma.",
    managementPearl:
      "When in doubt between SK and melanoma, always biopsy. The sign of Leser-Trelat (sudden eruption of numerous SKs) is a rare paraneoplastic sign requiring workup for internal malignancy.",
    goldStandardDescription:
      "Darkly pigmented seborrheic keratosis that could mimic melanoma on the trunk.",
    scoringWeights: { coreMorphology: 0.10, secondaryFeatures: 0.10, bodySiteDistribution: 0.05, differentialQuality: 0.60, managementPearl: 0.15 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // =========================================================================
  // CHIP_SELECT items (2)
  // =========================================================================

  // 14. Contact dermatitis poison ivy -- chip_select
  {
    id: "qi-v2-0014",
    title: "Select Visible Features: Linear Vesicles (Forearm)",
    imageAssetId: "a0000001-0006-4000-8000-000000000002",
    conditionId: "c0000001-0006-4000-8000-000000000001",
    difficulty: "intermediate",
    datasetSourceId: demoDatasetSourceId,
    questionType: "chip_select",
    prompt:
      "Select ALL morphological features visible in this eruption on the forearm. Be specific about what you can see.",
    requiredConcepts: [
      { conceptType: "primary_lesion", conceptValue: "vesicle", weight: 2, acceptableSynonyms: ["vesicles", "blisters"] },
      { conceptType: "primary_lesion", conceptValue: "bulla", weight: 2, acceptableSynonyms: ["bullae", "large blisters"] },
      { conceptType: "color", conceptValue: "erythematous", weight: 1, acceptableSynonyms: ["red", "erythema"] },
      { conceptType: "arrangement", conceptValue: "linear", weight: 3, acceptableSynonyms: ["linear arrangement", "streak-like"] },
      { conceptType: "body_site", conceptValue: "forearm", weight: 1, acceptableSynonyms: ["arm"] },
    ],
    optionalConcepts: [
      { conceptType: "secondary_lesion", conceptValue: "crust", bonusWeight: 1 },
      { conceptType: "border", conceptValue: "well-demarcated", bonusWeight: 1 },
    ],
    forbiddenAssumptions: [
      { conceptValue: "lichenification", reason: "Lichenification indicates chronic eczema and is not present in this acute vesiculobullous eruption." },
      { conceptValue: "patch testing positive", reason: "Patch testing results cannot be inferred from the clinical photo." },
    ],
    distractors: [
      { conceptValue: "papule", reason: "The primary lesions are vesicles and bullae, not papules." },
      { conceptValue: "plaque", reason: "There are no plaques in this acute vesicular eruption." },
      { conceptValue: "annular", reason: "The arrangement is linear, not annular." },
    ],
    topDifferentials: ["Contact Dermatitis", "Herpes Zoster", "Bullous Pemphigoid", "Phytophotodermatitis"],
    explanation:
      "This image shows linear vesicles and bullae with erythema on the forearm, pathognomonic for Toxicodendron (poison ivy/oak) contact dermatitis. Linear vesicles arise from the plant resin being streaked across the skin. This is one of the few truly pathognomonic distributions in dermatology.",
    managementPearl:
      "Widespread poison ivy dermatitis requires a systemic steroid course (typically prednisone tapered over 2-3 weeks). Short courses risk rebound.",
    goldStandardDescription:
      "Linear vesicles and bullae with erythema on the forearm from poison ivy contact.",
    scoringWeights: { coreMorphology: 0.40, secondaryFeatures: 0.20, bodySiteDistribution: 0.15, differentialQuality: 0.15, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 15. Acne comedonal -- chip_select
  {
    id: "qi-v2-0015",
    title: "Select Visible Features: Comedonal Acne (Forehead)",
    imageAssetId: "a0000001-0007-4000-8000-000000000001",
    conditionId: "c0000001-0007-4000-8000-000000000001",
    difficulty: "beginner",
    datasetSourceId: demoDatasetSourceId,
    questionType: "chip_select",
    prompt:
      "Select ALL morphological features visible in this eruption on the forehead. Choose only what you can see.",
    requiredConcepts: [
      { conceptType: "primary_lesion", conceptValue: "papule", weight: 2, acceptableSynonyms: ["papules", "comedones", "comedone"] },
      { conceptType: "body_site", conceptValue: "forehead", weight: 1, acceptableSynonyms: ["face", "T-zone"] },
      { conceptType: "distribution", conceptValue: "localized", weight: 1, acceptableSynonyms: ["localized distribution"] },
    ],
    optionalConcepts: [
      { conceptType: "color", conceptValue: "hyperpigmented", bonusWeight: 1 },
      { conceptType: "texture", conceptValue: "rough", bonusWeight: 1 },
    ],
    forbiddenAssumptions: [
      { conceptValue: "pustule", reason: "This is comedonal acne; pustules are not visible in this image." },
      { conceptValue: "nodule", reason: "There are no nodules in this comedonal acne image." },
      { conceptValue: "scarring", reason: "Scarring cannot be determined from this image of comedonal acne." },
    ],
    distractors: [
      { conceptValue: "vesicle", reason: "Vesicles are not a feature of acne." },
      { conceptValue: "plaque", reason: "Comedonal acne presents as small papules, not plaques." },
      { conceptValue: "dermatomal", reason: "Acne does not follow a dermatomal distribution." },
    ],
    topDifferentials: ["Acne Vulgaris", "Flat Warts", "Milia", "Folliculitis"],
    explanation:
      "This image shows open and closed comedones scattered over the forehead. Comedones are the signature lesion of acne vulgaris. Open comedones (blackheads) have a visible dark plug of oxidized keratin. Closed comedones (whiteheads) are flesh-colored papules without a visible opening.",
    managementPearl:
      "Topical retinoids (tretinoin, adapalene) are the treatment of choice for comedonal acne as they normalize follicular keratinization.",
    goldStandardDescription:
      "Open and closed comedones scattered over the forehead.",
    scoringWeights: { coreMorphology: 0.45, secondaryFeatures: 0.15, bodySiteDistribution: 0.15, differentialQuality: 0.15, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // =========================================================================
  // EXTRA VARIETY items (to reach 15+)
  // =========================================================================

  // 16. Psoriasis scalp -- chip_select (extra)
  {
    id: "qi-v2-0016",
    title: "Select Visible Features: Scalp Psoriasis",
    imageAssetId: "a0000001-0001-4000-8000-000000000002",
    conditionId: "c0000001-0001-4000-8000-000000000001",
    difficulty: "intermediate",
    datasetSourceId: demoDatasetSourceId,
    questionType: "chip_select",
    prompt:
      "Select ALL morphological features visible in this clinical image of the scalp.",
    requiredConcepts: [
      { conceptType: "primary_lesion", conceptValue: "plaque", weight: 3, acceptableSynonyms: ["elevated plaque", "thick plaque"] },
      { conceptType: "secondary_lesion", conceptValue: "scale", weight: 3, acceptableSynonyms: ["thick scale", "scaly"] },
      { conceptType: "body_site", conceptValue: "scalp", weight: 1, acceptableSynonyms: ["head", "hairline"] },
    ],
    optionalConcepts: [
      { conceptType: "color", conceptValue: "erythematous", bonusWeight: 1 },
      { conceptType: "border", conceptValue: "well-demarcated", bonusWeight: 1 },
    ],
    forbiddenAssumptions: [
      { conceptValue: "Auspitz sign", reason: "Auspitz sign cannot be assessed from a clinical photo without scale removal." },
      { conceptValue: "nail pitting", reason: "Nails are not visible in this scalp image." },
    ],
    distractors: [
      { conceptValue: "vesicle", reason: "Vesicles are not a feature of scalp psoriasis." },
      { conceptValue: "annular", reason: "Scalp psoriasis presents as plaques, not annular lesions." },
    ],
    topDifferentials: ["Plaque Psoriasis", "Seborrheic Dermatitis", "Tinea Capitis"],
    explanation:
      "Thick scaly plaques on the scalp extending beyond the hairline are characteristic of scalp psoriasis. The extension beyond the hairline helps distinguish it from seborrheic dermatitis, which is usually confined to the scalp.",
    managementPearl:
      "Scalp psoriasis may require potent topical corticosteroid solutions/foams plus coal tar shampoo. Calcipotriol scalp solution is effective for maintenance.",
    goldStandardDescription:
      "Thick scaly plaques on the scalp extending beyond the hairline.",
    scoringWeights: { coreMorphology: 0.40, secondaryFeatures: 0.20, bodySiteDistribution: 0.20, differentialQuality: 0.10, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 17. Herpes zoster flank -- single_select (extra)
  {
    id: "qi-v2-0017",
    title: "Diagnose the Crusted Vesicles (Flank)",
    imageAssetId: "a0000001-0010-4000-8000-000000000002",
    conditionId: "c0000001-0010-4000-8000-000000000001",
    difficulty: "intermediate",
    datasetSourceId: demoDatasetSourceId,
    questionType: "single_select",
    prompt:
      "What is the most likely diagnosis for these crusted vesicles in a band-like distribution on the flank?",
    requiredConcepts: [
      { conceptType: "diagnosis", conceptValue: "Herpes Zoster", weight: 5, acceptableSynonyms: ["shingles", "zoster", "VZV reactivation"] },
    ],
    optionalConcepts: [],
    forbiddenAssumptions: [],
    distractors: [
      { conceptValue: "Herpes Simplex", reason: "HSV is typically localized to a small area (lips, genitals), not a dermatomal band." },
      { conceptValue: "Contact Dermatitis", reason: "Contact dermatitis matches a contactant shape, not a dermatomal distribution." },
      { conceptValue: "Impetigo", reason: "Impetigo presents with honey-colored crusts, not dermatomal vesicles." },
    ],
    topDifferentials: ["Herpes Zoster", "Herpes Simplex", "Contact Dermatitis", "Impetigo"],
    explanation:
      "Crusted vesicles in a band-like (dermatomal) distribution on the flank are diagnostic of herpes zoster in its crusting stage. The unilateral dermatomal pattern is the key diagnostic feature. The crusting indicates the lesions are 5-7 days old.",
    managementPearl:
      "Even after crusting, patients benefit from antiviral therapy if started within 72 hours of rash onset. Assess for postherpetic neuralgia risk (age >50).",
    goldStandardDescription:
      "Crusted vesicles in a band-like distribution on the flank.",
    scoringWeights: { coreMorphology: 0.15, secondaryFeatures: 0.10, bodySiteDistribution: 0.15, differentialQuality: 0.50, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 18. SCC Bowen -- image_description (extra)
  {
    id: "qi-v2-0018",
    title: "Describe the Scaly Patch (Lower Leg)",
    imageAssetId: "a0000001-0008-4000-8000-000000000002",
    conditionId: "c0000001-0008-4000-8000-000000000001",
    difficulty: "advanced",
    datasetSourceId: demoDatasetSourceId,
    questionType: "image_description",
    prompt:
      "Select all morphological features visible in this scaly lesion on the lower leg.",
    requiredConcepts: [
      { conceptType: "primary_lesion", conceptValue: "patch", weight: 2, acceptableSynonyms: ["macule", "flat lesion"] },
      { conceptType: "color", conceptValue: "erythematous", weight: 2, acceptableSynonyms: ["red", "pink"] },
      { conceptType: "secondary_lesion", conceptValue: "scale", weight: 2, acceptableSynonyms: ["scaly", "scaling"] },
      { conceptType: "border", conceptValue: "well-demarcated", weight: 2, acceptableSynonyms: ["sharply demarcated", "well-defined"] },
      { conceptType: "body_site", conceptValue: "lower leg", weight: 1, acceptableSynonyms: ["leg", "shin"] },
    ],
    optionalConcepts: [
      { conceptType: "distribution", conceptValue: "sun-exposed", bonusWeight: 1 },
    ],
    forbiddenAssumptions: [
      { conceptValue: "induration", reason: "Induration is a palpable finding that cannot be assessed from a photograph." },
      { conceptValue: "cutaneous horn", reason: "No cutaneous horn is present in this flat scaly patch." },
    ],
    distractors: [
      { conceptValue: "nodule", reason: "This is a flat patch, not an elevated nodule." },
      { conceptValue: "pearly", reason: "Pearly quality suggests BCC, not SCC in situ." },
    ],
    topDifferentials: ["Squamous Cell Carcinoma in situ", "Psoriasis", "Superficial BCC", "Nummular Eczema"],
    dangerousMimic: "Psoriasis",
    explanation:
      "A well-demarcated erythematous scaly patch on the lower leg in a sun-exposed area raises concern for Bowen disease (SCC in situ). It can mimic psoriasis or eczema, but the solitary nature and sun-exposed location should prompt biopsy.",
    managementPearl:
      "Bowen disease (SCC in situ) can be treated with 5-fluorouracil cream, cryotherapy, photodynamic therapy, or excision. Monitor for progression to invasive SCC.",
    goldStandardDescription:
      "Well-demarcated erythematous scaly patch on the lower leg.",
    scoringWeights: { coreMorphology: 0.35, secondaryFeatures: 0.25, bodySiteDistribution: 0.15, differentialQuality: 0.15, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 19. Eczema infant -- single_select (extra)
  {
    id: "qi-v2-0019",
    title: "Diagnose the Facial Rash (Infant)",
    imageAssetId: "a0000001-0002-4000-8000-000000000002",
    conditionId: "c0000001-0002-4000-8000-000000000001",
    difficulty: "intermediate",
    datasetSourceId: demoDatasetSourceId,
    questionType: "single_select",
    prompt:
      "What is the most likely diagnosis for these erythematous patches with fine scale on the cheeks of an infant?",
    requiredConcepts: [
      { conceptType: "diagnosis", conceptValue: "Atopic Dermatitis", weight: 5, acceptableSynonyms: ["eczema", "infantile eczema", "atopic eczema"] },
    ],
    optionalConcepts: [],
    forbiddenAssumptions: [],
    distractors: [
      { conceptValue: "Seborrheic Dermatitis", reason: "Infantile seborrheic dermatitis favors the scalp and diaper area with greasy yellowish scale." },
      { conceptValue: "Contact Dermatitis", reason: "Contact dermatitis in infants is rare and has a geometric pattern from the contactant." },
      { conceptValue: "Psoriasis", reason: "Infantile psoriasis is rare and presents with sharply demarcated plaques, often in the diaper area." },
    ],
    topDifferentials: ["Atopic Dermatitis", "Seborrheic Dermatitis", "Contact Dermatitis", "Psoriasis"],
    explanation:
      "Erythematous patches with fine scale on the cheeks of an infant is the classic presentation of infantile atopic dermatitis. In infants, AD favors the face and extensor surfaces, transitioning to flexural surfaces in older children.",
    managementPearl:
      "For infantile eczema, use low-potency topical corticosteroids on the face (hydrocortisone 1%) and emollients liberally. Identify and address food allergy triggers if suspected.",
    goldStandardDescription:
      "Erythematous patches with fine scale on the cheeks of an infant.",
    scoringWeights: { coreMorphology: 0.15, secondaryFeatures: 0.10, bodySiteDistribution: 0.15, differentialQuality: 0.50, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },

  // 20. Tinea corporis polycyclic -- image_description (extra)
  {
    id: "qi-v2-0020",
    title: "Describe the Polycyclic Plaques (Trunk)",
    imageAssetId: "a0000001-0005-4000-8000-000000000002",
    conditionId: "c0000001-0005-4000-8000-000000000001",
    difficulty: "intermediate",
    datasetSourceId: demoDatasetSourceId,
    questionType: "image_description",
    prompt:
      "Select all morphological features visible in these plaques on the trunk.",
    requiredConcepts: [
      { conceptType: "primary_lesion", conceptValue: "plaque", weight: 2, acceptableSynonyms: ["plaques"] },
      { conceptType: "shape", conceptValue: "annular", weight: 3, acceptableSynonyms: ["ring-shaped", "annular plaques"] },
      { conceptType: "arrangement", conceptValue: "grouped", weight: 2, acceptableSynonyms: ["multiple", "polycyclic"] },
      { conceptType: "body_site", conceptValue: "trunk", weight: 1, acceptableSynonyms: ["torso", "body"] },
    ],
    optionalConcepts: [
      { conceptType: "secondary_lesion", conceptValue: "scale", bonusWeight: 1 },
      { conceptType: "color", conceptValue: "erythematous", bonusWeight: 1 },
    ],
    forbiddenAssumptions: [
      { conceptValue: "KOH positive", reason: "KOH results cannot be inferred from a clinical photo." },
      { conceptValue: "central clearing", reason: "While typical of tinea, the polycyclic coalescent pattern may obscure central clearing in this image." },
    ],
    distractors: [
      { conceptValue: "vesicle", reason: "No vesicles are visible in this image of polycyclic plaques." },
      { conceptValue: "dermatomal", reason: "These plaques are not in a dermatomal distribution." },
    ],
    topDifferentials: ["Tinea Corporis", "Subacute Cutaneous Lupus", "Erythema Annulare Centrifugum", "Granuloma Annulare"],
    explanation:
      "Multiple polycyclic annular plaques on the trunk are characteristic of extensive tinea corporis. The polycyclic pattern occurs when individual annular lesions coalesce. Oral antifungals are typically needed for this extent of disease.",
    managementPearl:
      "Extensive tinea corporis (multiple or large lesions) requires oral antifungals: terbinafine 250mg daily for 2-4 weeks or itraconazole.",
    goldStandardDescription:
      "Multiple polycyclic annular plaques on the trunk.",
    scoringWeights: { coreMorphology: 0.40, secondaryFeatures: 0.20, bodySiteDistribution: 0.15, differentialQuality: 0.15, managementPearl: 0.10 },
    isActive: true,
    isReviewed: true,
    createdAt: now,
    updatedAt: now,
  },
];
