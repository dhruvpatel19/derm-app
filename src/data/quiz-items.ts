import type { MorphologyQuizItem, ImageAsset } from "@/lib/domain/schemas";
import { imageAssets } from "./image-assets";

// Helper to look up an image asset by filename prefix
function findImage(prefix: string): ImageAsset {
  const img = imageAssets.find((a) => a.filename.startsWith(prefix));
  if (!img) throw new Error(`Image not found: ${prefix}`);
  return img;
}

/**
 * Morphology quiz items.
 *
 * Each item references a rubric (by rubricId) and asks the learner to score
 * a clinical image against that rubric's feature. The correctScore is the
 * expected rating on the rubric's ordered levels.
 *
 * Rubric IDs below are forward-references to the rubric seed data. They use
 * deterministic UUIDs so the relationship is stable.
 */

// Rubric UUIDs (defined in a separate rubric seed; referenced here)
const RUBRIC_BORDER = "b0000001-0001-4000-8000-000000000001";
const RUBRIC_SCALE = "b0000001-0002-4000-8000-000000000001";
const RUBRIC_COLOR = "b0000001-0003-4000-8000-000000000001";
const RUBRIC_ARRANGEMENT = "b0000001-0004-4000-8000-000000000001";
const RUBRIC_DISTRIBUTION = "b0000001-0005-4000-8000-000000000001";
const RUBRIC_PRIMARY_LESION = "b0000001-0006-4000-8000-000000000001";
const RUBRIC_SURFACE = "b0000001-0007-4000-8000-000000000001";
const RUBRIC_SYMMETRY = "b0000001-0008-4000-8000-000000000001";

export const quizItems: MorphologyQuizItem[] = [
  // 1. Psoriasis - Border assessment
  {
    id: "e0000001-0001-4000-8000-000000000001",
    rubricId: RUBRIC_BORDER,
    prompt:
      "Examine the borders of the plaque on this patient's elbow. Using the border regularity rubric, rate how well-demarcated the borders are (0 = poorly defined, 3 = sharply demarcated).",
    image: findImage("psoriasis-elbow"),
    correctScore: 3,
    explanation:
      "This psoriatic plaque demonstrates sharply demarcated, well-defined borders with an abrupt transition from the elevated, scaly plaque to normal surrounding skin. This is a hallmark of plaque psoriasis and one of the key features distinguishing it from eczema, which has poorly defined, blurred borders. The well-demarcated border is the single most reliable bedside feature for differentiating psoriasis from eczema.",
    tolerance: 0,
  },

  // 2. Eczema - Border assessment
  {
    id: "e0000001-0002-4000-8000-000000000001",
    rubricId: RUBRIC_BORDER,
    prompt:
      "Assess the border definition of this eczematous patch in the antecubital fossa. Rate the border demarcation (0 = poorly defined, 3 = sharply demarcated).",
    image: findImage("eczema-flexural"),
    correctScore: 0,
    explanation:
      "Atopic dermatitis characteristically has poorly demarcated, ill-defined borders that gradually blend into surrounding skin. There is no sharp transition between the involved and uninvolved skin. This is the opposite of psoriasis, which has sharp, well-demarcated borders. Border definition is the most reliable clinical feature for distinguishing eczema from psoriasis at the bedside.",
    tolerance: 1,
  },

  // 3. Psoriasis - Scale quality
  {
    id: "e0000001-0003-4000-8000-000000000001",
    rubricId: RUBRIC_SCALE,
    prompt:
      "Evaluate the scale on this elbow plaque. Rate the scale thickness and character (0 = no scale, 1 = fine scale, 2 = moderate scale, 3 = thick silvery/micaceous scale).",
    image: findImage("psoriasis-elbow"),
    correctScore: 3,
    explanation:
      "The thick, silvery-white (micaceous) scale adherent to the surface of the plaque is pathognomonic for plaque psoriasis. This scale is composed of parakeratotic keratinocytes from the greatly accelerated epidermal turnover (4 days vs. normal 28 days). Removal of the scale produces pinpoint bleeding (Auspitz sign) due to dilated capillaries in the elongated dermal papillae. This scale quality is distinctly different from the fine, thin scale of eczema or the greasy scale of seborrheic dermatitis.",
  },

  // 4. BCC - Surface texture
  {
    id: "e0000001-0004-4000-8000-000000000001",
    rubricId: RUBRIC_SURFACE,
    prompt:
      "Examine the surface texture of this papule on the nose. Rate the surface quality (0 = normal skin texture, 1 = slightly altered, 2 = notably abnormal, 3 = classic diagnostic surface).",
    image: findImage("bcc-nodular"),
    correctScore: 3,
    explanation:
      "This nodular BCC demonstrates the classic pearly (translucent), smooth surface with visible arborizing telangiectasia - this is the quintessential surface texture of BCC. The pearly quality results from tumor nests of basaloid cells close to the surface with overlying thinned epidermis. Arborizing (tree-like) telangiectasia are the most specific dermoscopic feature of BCC. This surface is fundamentally different from the keratotic/rough surface of SCC or the waxy/cerebriform surface of seborrheic keratosis.",
  },

  // 5. Melanoma - Color variegation
  {
    id: "e0000001-0005-4000-8000-000000000001",
    rubricId: RUBRIC_COLOR,
    prompt:
      "Assess the color uniformity of this pigmented lesion on the upper back. Rate the degree of color variegation (0 = uniform single color, 1 = two colors, 2 = three colors, 3 = four or more colors including blue/white).",
    image: findImage("melanoma-superficial"),
    correctScore: 3,
    explanation:
      "This superficial spreading melanoma demonstrates marked color variegation with four or more distinct colors: dark brown, light brown, blue-black, and a pinkish-white area of regression. Color variegation is one of the most important features in the ABCDE criteria (C = Color). The presence of blue-black color suggests melanin in the deeper dermis, and white/pink areas suggest regression - both are concerning dermoscopic features. Multiple colors in a single melanocytic lesion should always prompt biopsy.",
  },

  // 6. Tinea - Arrangement
  {
    id: "e0000001-0006-4000-8000-000000000001",
    rubricId: RUBRIC_ARRANGEMENT,
    prompt:
      "Evaluate the arrangement pattern of this scaly plaque on the upper arm. Rate the lesion arrangement (0 = no pattern, 1 = vaguely configured, 2 = clearly configured, 3 = classic diagnostic arrangement).",
    image: findImage("tinea-corporis-01"),
    correctScore: 3,
    explanation:
      "This lesion demonstrates a classic annular arrangement with central clearing and a raised, scaly advancing border - the hallmark of tinea corporis (ringworm). The annular pattern results from centrifugal spread of the dermatophyte with resolution in the center as the immune response catches up. The trailing scale (scale on the inner edge of the advancing border) is a key diagnostic clue. When you see an annular scaly plaque, always perform a KOH preparation before prescribing treatment.",
  },

  // 7. Contact dermatitis - Distribution
  {
    id: "e0000001-0007-4000-8000-000000000001",
    rubricId: RUBRIC_DISTRIBUTION,
    prompt:
      "Assess the distribution pattern of this vesicular eruption on the hands. Rate how diagnostic the distribution is (0 = non-specific, 1 = suggestive, 2 = highly suggestive, 3 = pathognomonic distribution).",
    image: findImage("contact-dermatitis-hands"),
    correctScore: 3,
    explanation:
      "The sharp geometric cutoff at the wrists - corresponding exactly to the edge of examination gloves - is essentially pathognomonic for contact dermatitis. This geometric or 'artificial' distribution pattern is the single most important clue for identifying contact dermatitis. The eruption conforms to the shape of the contactant rather than following anatomic distribution patterns seen in endogenous eczema. This patient's distribution strongly implicates glove-related allergens (rubber accelerators such as thiurams and carbamates).",
  },

  // 8. Acne - Primary lesion identification
  {
    id: "e0000001-0008-4000-8000-000000000001",
    rubricId: RUBRIC_PRIMARY_LESION,
    prompt:
      "Identify the primary lesion type on this patient's face. Rate the primary lesion identification (0 = incorrect, 1 = partially correct, 2 = mostly correct, 3 = precisely identified all primary lesion types).",
    image: findImage("acne-inflammatory"),
    correctScore: 3,
    explanation:
      "This image shows the three primary lesion types of acne vulgaris: comedones (both open/blackheads and closed/whiteheads), erythematous papules, and pustules. The presence of COMEDONES is the single most important morphologic feature that defines acne vulgaris and distinguishes it from its mimics. Rosacea, bacterial folliculitis, Malassezia folliculitis, and perioral dermatitis all produce papules and pustules but lack comedones. If there are no comedones, reconsider the diagnosis of acne.",
  },

  // 9. Herpes zoster - Distribution
  {
    id: "e0000001-0009-4000-8000-000000000001",
    rubricId: RUBRIC_DISTRIBUTION,
    prompt:
      "Evaluate the distribution pattern of these grouped vesicles on the thorax. Rate how diagnostic the distribution is (0 = non-specific, 1 = suggestive, 2 = highly suggestive, 3 = pathognomonic distribution).",
    image: findImage("herpes-zoster-thoracic"),
    correctScore: 3,
    explanation:
      "The combination of grouped vesicles in a unilateral, dermatomal band that does not cross the midline is pathognomonic for herpes zoster (shingles). This distribution reflects VZV reactivation from a single dorsal root ganglion, causing eruption along the corresponding dermatome. The thoracic dermatomes (T3-L2) are most commonly affected. If vesicles extend beyond the primary and adjacent dermatomes (>20 lesions = disseminated zoster), immunodeficiency must be excluded.",
  },

  // 10. Melanoma - Symmetry
  {
    id: "e0000001-0010-4000-8000-000000000001",
    rubricId: RUBRIC_SYMMETRY,
    prompt:
      "Assess the symmetry of this pigmented lesion on the back. Rate the degree of asymmetry (0 = symmetric, 1 = mildly asymmetric, 2 = moderately asymmetric, 3 = markedly asymmetric in two axes).",
    image: findImage("melanoma-superficial"),
    correctScore: 3,
    explanation:
      "This melanoma is markedly asymmetric in both axes. When an imaginary line is drawn through the center either horizontally or vertically, the two halves do not match in shape, color, or structure. Asymmetry is the 'A' in the ABCDE criteria and reflects the chaotic, uncontrolled growth pattern of malignant melanocytes. In contrast, benign nevi are generally symmetric. The ugly duckling sign - a lesion that looks clearly different from surrounding nevi - is also demonstrated here and is another powerful clinical clue for melanoma.",
  },
];
