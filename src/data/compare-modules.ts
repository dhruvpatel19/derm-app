import type { CompareModule } from "@/lib/domain/schemas";

// Condition IDs (must match conditions.ts)
const COND_PSORIASIS = "c0000001-0001-4000-8000-000000000001";
const COND_ECZEMA = "c0000001-0002-4000-8000-000000000001";
const COND_BCC = "c0000001-0003-4000-8000-000000000001";
const COND_TINEA = "c0000001-0005-4000-8000-000000000001";
const COND_SCC = "c0000001-0008-4000-8000-000000000001";
const COND_SK = "c0000001-0009-4000-8000-000000000001";

export const compareModules: CompareModule[] = [
  // ─── Psoriasis vs Eczema ──────────────────────────────────────────────────
  {
    id: "compare-psoriasis-vs-eczema",
    title: "Psoriasis vs. Eczema (Atopic Dermatitis)",
    conditionIds: [COND_PSORIASIS, COND_ECZEMA],
    commonFeatures: [
      "Both are chronic, relapsing inflammatory skin conditions",
      "Both can present with erythematous, scaly plaques",
      "Both cause significant pruritus (eczema is typically more pruritic)",
      "Both may be triggered or exacerbated by stress",
      "Both can affect the scalp, face, and hands",
      "Both are T-cell mediated (Th1/Th17 in psoriasis, Th2 in eczema)",
      "Both may improve with topical corticosteroids",
    ],
    distinguishingFeatures: [
      {
        feature: "Border definition",
        values: {
          [COND_PSORIASIS]:
            "Well-demarcated, sharply defined borders with abrupt transition to normal skin",
          [COND_ECZEMA]:
            "Poorly demarcated, ill-defined borders that gradually blend into surrounding skin",
        },
      },
      {
        feature: "Scale quality",
        values: {
          [COND_PSORIASIS]:
            "Thick, silvery-white (micaceous) scale; Auspitz sign positive on removal",
          [COND_ECZEMA]:
            "Fine, thin, white scale or absent in acute lesions; serous crusting in flares",
        },
      },
      {
        feature: "Typical distribution",
        values: {
          [COND_PSORIASIS]:
            "Extensor surfaces (elbows, knees), scalp, lumbosacral area",
          [COND_ECZEMA]:
            "Flexural surfaces (antecubital/popliteal fossae), face, neck; extensors in infants",
        },
      },
      {
        feature: "Lichenification",
        values: {
          [COND_PSORIASIS]:
            "Not a typical feature; plaques are uniformly thickened",
          [COND_ECZEMA]:
            "Common in chronic disease from itch-scratch cycle; accentuated skin markings",
        },
      },
      {
        feature: "Nail findings",
        values: {
          [COND_PSORIASIS]:
            "Pitting, oil-drop sign, onycholysis, subungual hyperkeratosis",
          [COND_ECZEMA]:
            "Uncommon; may see shiny nails from chronic rubbing",
        },
      },
      {
        feature: "Age of onset",
        values: {
          [COND_PSORIASIS]:
            "Bimodal: early (16-22 years) and late (57-60 years)",
          [COND_ECZEMA]:
            "Usually infancy/childhood (60% by age 1, 90% by age 5); often improves with age",
        },
      },
      {
        feature: "Koebner phenomenon",
        values: {
          [COND_PSORIASIS]:
            "Present - new psoriatic lesions at sites of trauma",
          [COND_ECZEMA]:
            "Not typical (scratching worsens existing lesions but does not produce new ones)",
        },
      },
      {
        feature: "Associated conditions",
        values: {
          [COND_PSORIASIS]:
            "Psoriatic arthritis (30%), cardiovascular disease, metabolic syndrome",
          [COND_ECZEMA]:
            "Atopic triad (asthma, allergic rhinitis), food allergy, eczema herpeticum risk",
        },
      },
      {
        feature: "Histopathology",
        values: {
          [COND_PSORIASIS]:
            "Regular acanthosis, parakeratosis, Munro microabscesses, dilated capillaries",
          [COND_ECZEMA]:
            "Spongiosis, irregular acanthosis, perivascular lymphocytic infiltrate",
        },
      },
    ],
    dangerousPitfall:
      "Inverse psoriasis (affecting flexural/intertriginous areas) can closely mimic atopic dermatitis. However, inverse psoriasis has well-demarcated, glazed erythematous plaques with minimal scale, whereas flexural eczema has poorly defined borders with lichenification. Additionally, mycosis fungoides (CTCL) can mimic both conditions and should be considered in adults with refractory eczematous or psoriasiform patches, especially in sun-protected areas.",
    pearl:
      "The single most reliable bedside feature is BORDER DEFINITION. Psoriasis = sharp borders, eczema = blurry borders. When in doubt, look at the lesion edge: if you can draw a precise line where it ends, think psoriasis. If it gradually fades into normal skin, think eczema.",
    tags: [
      "papulosquamous",
      "eczematous",
      "high-yield",
      "differential-diagnosis",
    ],
  },

  // ─── BCC vs SCC vs SK ────────────────────────────────────────────────────
  {
    id: "compare-bcc-scc-sk",
    title: "BCC vs. SCC vs. Seborrheic Keratosis",
    conditionIds: [COND_BCC, COND_SCC, COND_SK],
    commonFeatures: [
      "All three can present as papules, plaques, or nodules on the head, neck, and trunk",
      "All three increase in frequency with age",
      "All three can be pigmented, creating overlap with melanoma on the differential",
      "All three commonly occur in older adults",
      "Dermoscopy improves diagnostic accuracy for all three conditions",
    ],
    distinguishingFeatures: [
      {
        feature: "Surface quality",
        values: {
          [COND_BCC]:
            "Pearly (translucent), smooth, shiny with arborizing telangiectasia",
          [COND_SCC]:
            "Keratotic (rough, scaly), firm, with adherent scale or cutaneous horn",
          [COND_SK]:
            "Waxy, 'stuck-on,' verrucous (cerebriform) surface with horn cysts and fissures",
        },
      },
      {
        feature: "Border",
        values: {
          [COND_BCC]: "Rolled, raised, pearly borders; well-defined",
          [COND_SCC]:
            "Indurated, firm borders; may be ill-defined (infiltrative subtypes)",
          [COND_SK]:
            "Well-defined, sharp borders; sits ON the skin surface",
        },
      },
      {
        feature: "Ulceration",
        values: {
          [COND_BCC]:
            "Central ulceration common (rodent ulcer); recurrent bleeding and crusting",
          [COND_SCC]:
            "Indicates more advanced disease; may be tender",
          [COND_SK]:
            "Does NOT ulcerate; may become irritated from friction",
        },
      },
      {
        feature: "Growth rate",
        values: {
          [COND_BCC]: "Slow (months to years)",
          [COND_SCC]:
            "Variable; can grow rapidly (weeks to months)",
          [COND_SK]:
            "Slow; stable once established; sudden eruption of many = Leser-Trelat sign",
        },
      },
      {
        feature: "Dermoscopic clues",
        values: {
          [COND_BCC]:
            "Arborizing vessels, leaf-like structures, blue-gray ovoid nests",
          [COND_SCC]:
            "Glomerular (coiled) vessels, white structureless areas, keratin clods",
          [COND_SK]:
            "Comedo-like openings, milia-like cysts, brain-like pattern",
        },
      },
      {
        feature: "Metastatic potential",
        values: {
          [COND_BCC]:
            "Extremely rare (<0.1%); locally destructive",
          [COND_SCC]:
            "Low but real (2-5%; higher in immunosuppressed)",
          [COND_SK]:
            "NONE - completely benign",
        },
      },
      {
        feature: "Palpation",
        values: {
          [COND_BCC]:
            "Firm; pearly sheen when skin stretched",
          [COND_SCC]:
            "Hard, indurated, woody; may be fixed to deeper structures",
          [COND_SK]:
            "Soft, friable; can be crumbled off; not indurated",
        },
      },
    ],
    dangerousPitfall:
      "Amelanotic melanoma can mimic all three lesions. Any new, growing, or changing papule/nodule - whether it looks like BCC, SCC, or irritated SK - should have a low threshold for biopsy. Pigmented BCC can mimic melanoma. When in doubt, BIOPSY.",
    pearl:
      "Three-texture test: (1) PEARLY/smooth = BCC, (2) ROUGH/keratotic = SCC, (3) WAXY/stuck-on = SK. Confirm with dermoscopy: arborizing vessels (BCC), glomerular vessels + keratin (SCC), comedo-like openings + milia-like cysts (SK).",
    tags: ["skin-cancer", "benign-lesion", "dermoscopy"],
  },

  // ─── Tinea Corporis vs Nummular Eczema ────────────────────────────────────
  {
    id: "compare-tinea-vs-nummular-eczema",
    title: "Tinea Corporis vs. Nummular Eczema",
    conditionIds: [COND_TINEA, COND_ECZEMA],
    commonFeatures: [
      "Both can present as round or oval, erythematous, scaly plaques",
      "Both cause pruritus",
      "Both can occur on the trunk and extremities",
      "Both may respond partially to topical corticosteroids (misleadingly so for tinea)",
      "Both can have fine scale at the borders",
    ],
    distinguishingFeatures: [
      {
        feature: "Central clearing",
        values: {
          [COND_TINEA]:
            "Classic central clearing with active, raised advancing border (annular pattern)",
          [COND_ECZEMA]:
            "No true central clearing; entire lesion uniformly involved (coin-shaped)",
        },
      },
      {
        feature: "Scale location",
        values: {
          [COND_TINEA]:
            "Trailing scale: scale on the INNER edge of the advancing border (points toward center)",
          [COND_ECZEMA]:
            "Scale distributed throughout the entire plaque, not concentrated at the border",
        },
      },
      {
        feature: "Border character",
        values: {
          [COND_TINEA]:
            "Raised, sharply defined advancing border with fine vesiculation; more active than center",
          [COND_ECZEMA]:
            "Borders may be defined but entire plaque is uniformly elevated; no advancing front",
        },
      },
      {
        feature: "Number and distribution",
        values: {
          [COND_TINEA]:
            "Often single or few; may be asymmetric; expands into polycyclic shapes",
          [COND_ECZEMA]:
            "Usually multiple (5-50+) coin-shaped lesions; bilateral and symmetric; legs most common",
        },
      },
      {
        feature: "KOH preparation",
        values: {
          [COND_TINEA]:
            "POSITIVE: septate, branching hyphae on KOH of leading-edge scale",
          [COND_ECZEMA]:
            "NEGATIVE: no fungal elements",
        },
      },
      {
        feature: "Response to antifungals",
        values: {
          [COND_TINEA]:
            "Clears with 2-4 weeks of topical terbinafine or clotrimazole",
          [COND_ECZEMA]:
            "No response to antifungals; responds to topical corticosteroids",
        },
      },
      {
        feature: "Response to topical steroids",
        values: {
          [COND_TINEA]:
            "Partial improvement but does NOT cure; creates tinea incognito if used alone",
          [COND_ECZEMA]:
            "Good response; flares improve within 1-2 weeks",
        },
      },
    ],
    dangerousPitfall:
      "TINEA INCOGNITO: When tinea is mistakenly treated with topical corticosteroids, the classic annular morphology becomes obscured. The rash may look less red and less scaly but continues expanding. Always perform KOH BEFORE prescribing topical steroids for a round scaly plaque. Combination products (clotrimazole-betamethasone / Lotrisone) are a frequent cause and should generally be avoided.",
    pearl:
      "KOH preparation is the single most important diagnostic step. Scrape scale from the ACTIVE BORDER (not the center). KOH positive = tinea. KOH negative = nummular eczema. Rule: 'If it's round and scaly, do a KOH.'",
    tags: ["infection", "eczematous", "koh-prep", "tinea-incognito"],
  },
];
