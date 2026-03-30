import type { MorphologyTerm } from "@/lib/domain/schemas";

export const morphologyTerms: MorphologyTerm[] = [
  // ─── Primary Lesions ────────────────────────────────────────────────────────
  {
    id: "d0000001-0001-4000-8000-000000000001",
    term: "Macule",
    definition:
      "A flat, non-palpable area of color change in the skin that is less than 1 cm in diameter. Macules can be hyperpigmented, hypopigmented, or erythematous. They are identified by visual inspection rather than tactile examination.",
    confusionPoints: [
      {
        confusedWith: "Patch",
        distinction:
          "A macule is <1 cm; a patch is >=1 cm. Both are flat and non-palpable; size is the sole distinguishing criterion.",
      },
      {
        confusedWith: "Papule",
        distinction:
          "A macule is flat (non-palpable); a papule is raised (palpable). Careful palpation differentiates the two.",
      },
      {
        confusedWith: "Purpura",
        distinction:
          "Erythematous macules blanch with diascopy (pressure); purpura does not. Always perform the blanching test.",
      },
    ],
    relatedTerms: [
      "d0000001-0002-4000-8000-000000000001",
      "d0000001-0013-4000-8000-000000000001",
    ],
    category: "primary_lesion",
    mnemonic:
      "Macule = 'Mark' on the skin - flat and small, like a freckle you can see but not feel.",
  },
  {
    id: "d0000001-0002-4000-8000-000000000001",
    term: "Patch",
    definition:
      "A flat, non-palpable area of color change in the skin that is 1 cm or greater in diameter. Patches represent larger macules and share the same characteristic of being appreciated visually rather than by palpation.",
    confusionPoints: [
      {
        confusedWith: "Macule",
        distinction:
          "Differentiated from a macule solely by size (>=1 cm vs. <1 cm).",
      },
      {
        confusedWith: "Plaque",
        distinction:
          "A patch is flat; a plaque is palpably elevated. Careful palpation is key to distinguishing very thin plaques from patches.",
      },
    ],
    relatedTerms: [
      "d0000001-0001-4000-8000-000000000001",
      "d0000001-0004-4000-8000-000000000001",
    ],
    category: "primary_lesion",
  },
  {
    id: "d0000001-0003-4000-8000-000000000001",
    term: "Papule",
    definition:
      "A small, solid, elevated lesion less than 1 cm in diameter. Papules are palpable and may be dome-shaped, flat-topped, or pedunculated. They can arise from the epidermis, dermis, or both.",
    confusionPoints: [
      {
        confusedWith: "Nodule",
        distinction:
          "A papule is <1 cm; a nodule is >=1 cm. Both are solid and elevated.",
      },
      {
        confusedWith: "Vesicle",
        distinction:
          "A papule is solid; a vesicle is fluid-filled. Palpation or dermoscopy distinguishes the two.",
      },
      {
        confusedWith: "Plaque",
        distinction:
          "A flat-topped papule may resemble a small plaque, but plaques are broader (typically >1 cm) with a plateau-like surface.",
      },
    ],
    relatedTerms: [
      "d0000001-0008-4000-8000-000000000001",
      "d0000001-0004-4000-8000-000000000001",
      "d0000001-0005-4000-8000-000000000001",
    ],
    category: "primary_lesion",
  },
  {
    id: "d0000001-0004-4000-8000-000000000001",
    term: "Plaque",
    definition:
      "A broad, elevated, plateau-like lesion greater than 1 cm in diameter. Plaques may arise from the coalescence of papules or as a primary morphology. They are a hallmark of conditions such as psoriasis and mycosis fungoides.",
    confusionPoints: [
      {
        confusedWith: "Papule",
        distinction:
          "Distinguished from a papule by being broader and typically >1 cm with a flat-topped, plateau-like surface.",
      },
      {
        confusedWith: "Patch",
        distinction:
          "Distinguished from a patch by being palpably elevated. A plaque has thickness you can feel; a patch does not.",
      },
    ],
    relatedTerms: [
      "d0000001-0003-4000-8000-000000000001",
      "d0000001-0002-4000-8000-000000000001",
    ],
    category: "primary_lesion",
  },
  {
    id: "d0000001-0005-4000-8000-000000000001",
    term: "Vesicle",
    definition:
      "A small, fluid-filled blister less than 1 cm in diameter. Vesicles contain clear serous fluid and arise within or beneath the epidermis. They are characteristic of herpetic infections, eczematous dermatitis, and autoimmune blistering diseases.",
    confusionPoints: [
      {
        confusedWith: "Bulla",
        distinction:
          "A vesicle is <1 cm; a bulla is >=1 cm. Both are fluid-filled blisters.",
      },
      {
        confusedWith: "Pustule",
        distinction:
          "A vesicle contains clear fluid; a pustule contains purulent (white/yellow) fluid.",
      },
    ],
    relatedTerms: [
      "d0000001-0006-4000-8000-000000000001",
      "d0000001-0007-4000-8000-000000000001",
      "d0000001-0010-4000-8000-000000000001",
    ],
    category: "primary_lesion",
    mnemonic:
      "Vesicle = 'Vessel' of clear fluid. Small (< 1 cm) blister on the skin.",
  },
  {
    id: "d0000001-0006-4000-8000-000000000001",
    term: "Bulla",
    definition:
      "A large, fluid-filled blister 1 cm or greater in diameter. Bullae may contain clear, serous, or hemorrhagic fluid. They are characteristic of bullous pemphigoid, pemphigus vulgaris, bullous impetigo, and burns.",
    confusionPoints: [
      {
        confusedWith: "Vesicle",
        distinction:
          "Distinguished from a vesicle solely by size (>=1 cm). Content is similar.",
      },
      {
        confusedWith: "Erosion",
        distinction:
          "A ruptured bulla leaves an erosion (superficial skin loss), not an ulcer. Erosions heal without scarring.",
      },
    ],
    relatedTerms: [
      "d0000001-0005-4000-8000-000000000001",
      "d0000001-0010-4000-8000-000000000001",
    ],
    category: "primary_lesion",
    mnemonic:
      "Bulla = 'Big' blister. Think 'bull' = large. Tense (subepidermal, e.g. bullous pemphigoid) vs. flaccid (intraepidermal, e.g. pemphigus).",
  },
  {
    id: "d0000001-0007-4000-8000-000000000001",
    term: "Pustule",
    definition:
      "A small, elevated lesion less than 1 cm in diameter filled with purulent material (pus). Pustules may be follicular or non-follicular. They are NOT always infectious - sterile pustules occur in psoriasis, AGEP, and Behcet disease.",
    confusionPoints: [
      {
        confusedWith: "Vesicle",
        distinction:
          "A pustule contains purulent (white/yellow) fluid; a vesicle contains clear fluid.",
      },
      {
        confusedWith: "Papule",
        distinction:
          "A papule is solid; a pustule has a visible purulent fluid collection. Some inflammatory papules may develop pustular tops.",
      },
    ],
    relatedTerms: [
      "d0000001-0005-4000-8000-000000000001",
      "d0000001-0003-4000-8000-000000000001",
    ],
    category: "primary_lesion",
    mnemonic:
      "Pustule = 'Pus-filled.' Remember: pus does NOT always mean infection. Sterile pustules are common.",
  },
  {
    id: "d0000001-0008-4000-8000-000000000001",
    term: "Nodule",
    definition:
      "A solid, palpable lesion greater than 1 cm in diameter that extends into the dermis or subcutaneous tissue. Nodules may be dome-shaped, flat-topped, or irregular. They represent deeper pathology compared to papules.",
    confusionPoints: [
      {
        confusedWith: "Papule",
        distinction:
          "Distinguished from a papule by size (>=1 cm) and typically deeper location in the dermis or subcutis.",
      },
      {
        confusedWith: "Cyst",
        distinction:
          "A cyst is an enclosed sac with a lining that contains fluid or semi-solid material; a nodule is solid. Cysts are fluctuant on palpation; nodules are firm.",
      },
    ],
    relatedTerms: [
      "d0000001-0003-4000-8000-000000000001",
    ],
    category: "primary_lesion",
  },
  {
    id: "d0000001-0009-4000-8000-000000000001",
    term: "Wheal",
    definition:
      "A transient, edematous, compressible papule or plaque caused by localized dermal edema. Wheals (hives/urticaria) are characteristically pruritic, migratory, and resolve within 24 hours without leaving a mark. Individual wheals lasting >24 hours should raise suspicion for urticarial vasculitis.",
    confusionPoints: [
      {
        confusedWith: "Papule",
        distinction:
          "Wheals are transient (resolve within 24 hours) and migratory; papules are persistent. If a raised lesion is still there the next day, it is not a wheal.",
      },
      {
        confusedWith: "Plaque (fixed)",
        distinction:
          "Wheals are compressible and evanescent; fixed plaques persist. Wheals lasting >24 hours or leaving bruising suggest urticarial vasculitis.",
      },
    ],
    relatedTerms: [
      "d0000001-0003-4000-8000-000000000001",
    ],
    category: "primary_lesion",
    mnemonic:
      "Wheal = 'Wax and wane.' Comes and goes within hours. If it stays >24 hours, reconsider the diagnosis.",
  },

  // ─── Secondary Lesions ──────────────────────────────────────────────────────
  {
    id: "d0000001-0010-4000-8000-000000000001",
    term: "Erosion",
    definition:
      "A loss of part or all of the epidermis that does not extend into the dermis. Erosions are moist, well-defined, and heal without scarring. They commonly result from ruptured vesicles or bullae.",
    confusionPoints: [
      {
        confusedWith: "Ulcer",
        distinction:
          "An erosion does not extend below the basement membrane and heals without scarring. An ulcer extends into the dermis or deeper and heals with scarring.",
      },
      {
        confusedWith: "Excoriation",
        distinction:
          "An excoriation is specifically caused by scratching (self-inflicted). An erosion can result from any cause (ruptured blister, friction, etc.).",
      },
    ],
    relatedTerms: [
      "d0000001-0011-4000-8000-000000000001",
      "d0000001-0015-4000-8000-000000000001",
    ],
    category: "secondary_lesion",
  },
  {
    id: "d0000001-0011-4000-8000-000000000001",
    term: "Ulcer",
    definition:
      "A loss of the epidermis and at least part of the dermis, extending below the basement membrane. Ulcers heal with scarring. Causes include vascular insufficiency, infection, trauma, malignancy, and inflammatory conditions.",
    confusionPoints: [
      {
        confusedWith: "Erosion",
        distinction:
          "An ulcer extends through the basement membrane into the dermis or deeper; an erosion is limited to the epidermis. Ulcers scar; erosions do not.",
      },
    ],
    relatedTerms: [
      "d0000001-0010-4000-8000-000000000001",
    ],
    category: "secondary_lesion",
    mnemonic:
      "Ulcer = 'Under' the basement membrane. Deeper than erosion. Always scars.",
  },
  {
    id: "d0000001-0012-4000-8000-000000000001",
    term: "Scale",
    definition:
      "Visible accumulation of excess keratinocytes (stratum corneum) that flakes from the skin surface. Scale varies from fine and powdery (pityriasiform) to thick and adherent (micaceous/psoriasiform) to greasy (seborrheic). Scale quality is a key diagnostic clue.",
    confusionPoints: [
      {
        confusedWith: "Crust",
        distinction:
          "Scale is formed from accumulated keratin (dead skin cells); crust is formed from dried exudate (serum, blood, or pus). They are fundamentally different materials.",
      },
    ],
    relatedTerms: [
      "d0000001-0013-4000-8000-000000000001",
    ],
    category: "surface_change",
    mnemonic:
      "Scale types to remember: Silvery = psoriasis, Greasy = seborrheic dermatitis, Collarette = pityriasis rosea/syphilis, Trailing = tinea.",
  },
  {
    id: "d0000001-0013-4000-8000-000000000001",
    term: "Crust",
    definition:
      "Dried exudate (serum, blood, or pus) on the skin surface. Crusts form when fluid from vesicles, bullae, pustules, or erosions desiccates. The color of the crust provides diagnostic clues: honey-colored (impetigo), hemorrhagic (deeper injury), yellow-green (infected).",
    confusionPoints: [
      {
        confusedWith: "Scale",
        distinction:
          "Crust is dried exudate; scale is accumulated keratin. Crust implies a preceding blister, erosion, or weeping; scale implies abnormal keratinization.",
      },
    ],
    relatedTerms: [
      "d0000001-0012-4000-8000-000000000001",
      "d0000001-0010-4000-8000-000000000001",
    ],
    category: "surface_change",
  },
  {
    id: "d0000001-0014-4000-8000-000000000001",
    term: "Lichenification",
    definition:
      "Thickening of the skin with accentuation of normal skin markings, resulting from chronic rubbing or scratching. It is a hallmark of chronic eczematous dermatitis and lichen simplex chronicus. The skin appears leathery with exaggerated cross-hatched lines.",
    confusionPoints: [
      {
        confusedWith: "Plaque",
        distinction:
          "Lichenification shows accentuated skin lines (the normal skin markings become exaggerated). A plaque is a uniformly thickened, elevated surface without necessarily enhanced skin markings.",
      },
    ],
    relatedTerms: [
      "d0000001-0015-4000-8000-000000000001",
      "d0000001-0004-4000-8000-000000000001",
    ],
    category: "secondary_lesion",
    mnemonic:
      "Lichenification = 'Leather-like.' Chronic scratching makes the skin thick and leathery with exaggerated lines.",
  },
  {
    id: "d0000001-0015-4000-8000-000000000001",
    term: "Excoriation",
    definition:
      "A linear erosion or ulceration caused by scratching. Excoriations are typically shallow, angular, and may be covered by hemorrhagic crusts. Their presence indicates pruritus and self-inflicted trauma.",
    confusionPoints: [
      {
        confusedWith: "Erosion",
        distinction:
          "Excoriations are specifically caused by scratching (self-inflicted). They indicate the patient is pruritic. Erosions can result from any cause.",
      },
    ],
    relatedTerms: [
      "d0000001-0010-4000-8000-000000000001",
      "d0000001-0014-4000-8000-000000000001",
    ],
    category: "secondary_lesion",
  },
  {
    id: "d0000001-0016-4000-8000-000000000001",
    term: "Atrophy",
    definition:
      "Thinning of the skin, which may involve the epidermis, dermis, or subcutaneous tissue. Epidermal atrophy manifests as thin, translucent, wrinkled ('cigarette paper') skin. Dermal atrophy results in depression of the skin surface. Common causes include aging, chronic corticosteroid use, and inflammatory conditions.",
    confusionPoints: [
      {
        confusedWith: "Sclerosis",
        distinction:
          "Atrophy is thinning of the skin; sclerosis is thickening and hardening. Both can coexist (e.g., in morphea where the center becomes atrophic).",
      },
    ],
    relatedTerms: [],
    category: "secondary_lesion",
    mnemonic:
      "Atrophy = 'A-thin.' Skin becomes thin, translucent, and fragile. Think chronic steroid use creating 'cigarette paper' skin.",
  },
  {
    id: "d0000001-0017-4000-8000-000000000001",
    term: "Telangiectasia",
    definition:
      "Permanently dilated, small blood vessels (capillaries, arterioles, or venules) visible on the skin surface, typically 0.1-1 mm in diameter. They blanch with diascopy. Telangiectasias are seen in rosacea, chronic sun damage, basal cell carcinoma, scleroderma, and hereditary hemorrhagic telangiectasia.",
    confusionPoints: [
      {
        confusedWith: "Purpura",
        distinction:
          "Telangiectasia blanches with pressure (dilated vessels); purpura does not blanch (extravasated blood). Diascopy is the key test.",
      },
      {
        confusedWith: "Erythema",
        distinction:
          "Telangiectasia shows individual visible vessel lines; erythema is diffuse redness without individually distinguishable vessels.",
      },
    ],
    relatedTerms: [
      "d0000001-0018-4000-8000-000000000001",
    ],
    category: "secondary_lesion",
    mnemonic:
      "Arborizing telangiectasia on a pearly papule = BCC until proven otherwise.",
  },
  {
    id: "d0000001-0018-4000-8000-000000000001",
    term: "Petechiae",
    definition:
      "Pinpoint, non-blanching, red to purple macules less than 3 mm in diameter caused by extravasation of red blood cells from capillaries. Petechiae do not blanch with diascopy, which distinguishes them from erythematous macules.",
    confusionPoints: [
      {
        confusedWith: "Purpura",
        distinction:
          "Petechiae are <3 mm; purpura are 3 mm - 1 cm; ecchymoses are >1 cm. All are non-blanching. Size is the only distinction.",
      },
      {
        confusedWith: "Erythematous macules",
        distinction:
          "Petechiae are non-blanching; erythematous macules blanch with pressure. Always perform diascopy.",
      },
    ],
    relatedTerms: [
      "d0000001-0019-4000-8000-000000000001",
      "d0000001-0020-4000-8000-000000000001",
    ],
    category: "color",
    mnemonic:
      "Petechiae = 'Petite' purpura. Tiny (<3 mm), non-blanching. Palpable petechiae = vasculitis (biopsy it).",
  },
  {
    id: "d0000001-0019-4000-8000-000000000001",
    term: "Purpura",
    definition:
      "Non-blanching, red to purple discoloration of the skin caused by extravasation of blood, measuring 3 mm to 1 cm in diameter. Purpura may be palpable (vasculitis) or non-palpable (thrombocytopenia, coagulopathy). Palpable purpura is the hallmark of small-vessel vasculitis and mandates biopsy.",
    confusionPoints: [
      {
        confusedWith: "Erythema",
        distinction:
          "Purpura does not blanch with pressure; erythema does. This is the most critical distinction in dermatology.",
      },
      {
        confusedWith: "Petechiae",
        distinction:
          "Purpura (3 mm - 1 cm) is larger than petechiae (<3 mm). Both are non-blanching.",
      },
    ],
    relatedTerms: [
      "d0000001-0018-4000-8000-000000000001",
      "d0000001-0020-4000-8000-000000000001",
    ],
    category: "color",
    mnemonic:
      "Palpable purpura = vasculitis until proven otherwise. Must biopsy.",
  },
  {
    id: "d0000001-0020-4000-8000-000000000001",
    term: "Ecchymosis",
    definition:
      "A large area (>1 cm) of non-blanching discoloration caused by extravasation of blood into the skin. Ecchymoses evolve in color from red to blue/purple to green/yellow as hemoglobin degrades. They are commonly known as bruises.",
    confusionPoints: [
      {
        confusedWith: "Purpura",
        distinction:
          "Distinguished from purpura by size (>1 cm). Both are non-blanching. Color evolution indicates the age of the ecchymosis.",
      },
    ],
    relatedTerms: [
      "d0000001-0019-4000-8000-000000000001",
      "d0000001-0018-4000-8000-000000000001",
    ],
    category: "color",
  },

  // ─── Distribution Terms ─────────────────────────────────────────────────────
  {
    id: "d0000001-0021-4000-8000-000000000001",
    term: "Dermatomal",
    definition:
      "A distribution pattern that follows the cutaneous innervation of a single spinal nerve (dermatome). The classic dermatomal distribution is unilateral and does not cross the midline. Herpes zoster is the prototypical dermatomal eruption.",
    confusionPoints: [
      {
        confusedWith: "Blaschko lines",
        distinction:
          "Dermatomes follow spinal nerve innervation patterns. Blaschko lines follow embryologic cell migration patterns. They are anatomically distinct and non-overlapping.",
      },
    ],
    relatedTerms: [
      "d0000001-0025-4000-8000-000000000001",
    ],
    category: "distribution",
    mnemonic:
      "Dermatomal + unilateral + vesicles = herpes zoster until proven otherwise.",
  },
  {
    id: "d0000001-0022-4000-8000-000000000001",
    term: "Sun-exposed",
    definition:
      "A distribution pattern affecting areas receiving significant ultraviolet radiation: face, ears, dorsal hands, forearms, V of the neck/chest, and scalp. Characteristically spares sun-protected areas such as the postauricular region, upper eyelids, submental area, and clothing-covered skin.",
    confusionPoints: [
      {
        confusedWith: "Airborne contact dermatitis",
        distinction:
          "Both affect the face and exposed skin, but airborne contact dermatitis can also affect sun-protected exposed areas. Sun-distributed eruptions specifically spare shaded skin folds.",
      },
    ],
    relatedTerms: [
      "d0000001-0024-4000-8000-000000000001",
    ],
    category: "distribution",
    mnemonic:
      "Sparing of upper eyelids + submental area = photosensitive process. These areas are naturally shaded.",
  },
  {
    id: "d0000001-0023-4000-8000-000000000001",
    term: "Flexural",
    definition:
      "A distribution pattern that preferentially involves the flexural creases and folds: antecubital fossae, popliteal fossae, neck folds, and wrists. Flexural distribution is characteristic of atopic dermatitis in older children and adults, inverse psoriasis, and certain drug eruptions.",
    confusionPoints: [
      {
        confusedWith: "Intertriginous",
        distinction:
          "Flexural refers to joint creases (elbow, knee). Intertriginous refers to skin-fold apposition areas (axillae, groin, inframammary). They overlap but are not identical.",
      },
      {
        confusedWith: "Extensor",
        distinction:
          "Flexural and extensor are opposite distributions. Flexural = eczema (after infancy). Extensor = psoriasis. This is a high-yield clinical distinction.",
      },
    ],
    relatedTerms: [
      "d0000001-0024-4000-8000-000000000001",
      "d0000001-0025-4000-8000-000000000001",
    ],
    category: "distribution",
    mnemonic:
      "Flexural = Fold = eczema. Extensor = psoriasis. This rule works most of the time.",
  },
  {
    id: "d0000001-0024-4000-8000-000000000001",
    term: "Extensor",
    definition:
      "A distribution pattern that involves the extensor surfaces of the extremities, particularly the elbows, knees, and shins. Extensor distribution is characteristic of psoriasis, dermatitis herpetiformis, and keratosis pilaris.",
    confusionPoints: [
      {
        confusedWith: "Flexural",
        distinction:
          "Extensor surfaces (elbows, knees) are the opposite of flexural surfaces (antecubital/popliteal fossae). Psoriasis = extensor. Eczema = flexural. Key clinical distinction.",
      },
    ],
    relatedTerms: [
      "d0000001-0023-4000-8000-000000000001",
    ],
    category: "distribution",
  },
  {
    id: "d0000001-0025-4000-8000-000000000001",
    term: "Intertriginous",
    definition:
      "A distribution pattern involving areas where skin surfaces oppose and rub together, creating a warm, moist environment. Key sites include axillae, groin, inframammary folds, intergluteal cleft, and interdigital spaces. These areas are prone to candidiasis, intertrigo, inverse psoriasis, and erythrasma.",
    confusionPoints: [
      {
        confusedWith: "Flexural",
        distinction:
          "Intertriginous areas are skin-fold apposition zones (axillae, groin). Flexural areas are joint creases (antecubital, popliteal). Inverse psoriasis affects intertriginous areas.",
      },
    ],
    relatedTerms: [
      "d0000001-0023-4000-8000-000000000001",
    ],
    category: "distribution",
    mnemonic:
      "Intertriginous + satellite pustules = candidiasis. Intertriginous + shiny red plaque without scale = inverse psoriasis.",
  },

  // ─── Arrangement Terms ──────────────────────────────────────────────────────
  {
    id: "d0000001-0026-4000-8000-000000000001",
    term: "Grouped",
    definition:
      "An arrangement pattern in which lesions are clustered together in a localized area. Grouped vesicles on an erythematous base are the classic presentation of herpes simplex and herpes zoster.",
    confusionPoints: [
      {
        confusedWith: "Scattered",
        distinction:
          "Grouped lesions are clustered in one area; scattered lesions are distributed diffusely. Grouped vesicles strongly suggest herpetic infection.",
      },
    ],
    relatedTerms: [
      "d0000001-0021-4000-8000-000000000001",
      "d0000001-0027-4000-8000-000000000001",
    ],
    category: "configuration",
    mnemonic:
      "Grouped vesicles = herpetiform = think HSV or VZV. Cluster of blisters = herpes until proven otherwise.",
  },
  {
    id: "d0000001-0027-4000-8000-000000000001",
    term: "Linear",
    definition:
      "An arrangement in which lesions form a line or stripe. Linear lesions may result from external factors (contact dermatitis, phytophotodermatitis), Koebner phenomenon (psoriasis, lichen planus, vitiligo), or follow Blaschko lines (epidermal nevi, linear lichen planus).",
    confusionPoints: [
      {
        confusedWith: "Dermatomal",
        distinction:
          "Linear lesions follow a straight line or arbitrary path; dermatomal lesions follow a specific nerve distribution. Linear contact dermatitis (e.g., poison ivy streaks) differs from dermatomal zoster.",
      },
      {
        confusedWith: "Serpiginous",
        distinction:
          "Linear is straight; serpiginous is wavy/snake-like. Cutaneous larva migrans is serpiginous, not strictly linear.",
      },
    ],
    relatedTerms: [
      "d0000001-0030-4000-8000-000000000001",
      "d0000001-0021-4000-8000-000000000001",
    ],
    category: "configuration",
  },
  {
    id: "d0000001-0028-4000-8000-000000000001",
    term: "Annular",
    definition:
      "An arrangement in which lesions form a ring or circle with a distinct border and central clearing or different central morphology. Annular lesions have a broad differential: tinea corporis, granuloma annulare, erythema migrans, subacute cutaneous lupus, erythema annulare centrifugum, and urticaria.",
    confusionPoints: [
      {
        confusedWith: "Nummular (coin-shaped)",
        distinction:
          "Annular lesions have central clearing; nummular lesions are uniformly involved throughout (no clearing). Tinea = annular. Nummular eczema = solid coin.",
      },
    ],
    relatedTerms: [
      "d0000001-0029-4000-8000-000000000001",
    ],
    category: "configuration",
    mnemonic:
      "Annular + scale = tinea (do KOH). Annular + no scale = granuloma annulare. Annular + expanding = erythema migrans (Lyme).",
  },
  {
    id: "d0000001-0029-4000-8000-000000000001",
    term: "Reticular",
    definition:
      "An arrangement forming a net-like or lace-like pattern. Reticular patterns are characteristic of livedo reticularis, erythema ab igne (heat-induced), and retiform purpura. The pattern reflects the underlying vascular architecture.",
    confusionPoints: [
      {
        confusedWith: "Annular",
        distinction:
          "Reticular forms an interconnecting net; annular forms individual rings. Reticular is a network; annular is a single circle.",
      },
    ],
    relatedTerms: [
      "d0000001-0028-4000-8000-000000000001",
    ],
    category: "configuration",
    mnemonic:
      "Retiform purpura (branching, net-like, non-blanching) = vessel occlusion EMERGENCY. Think DIC, calciphylaxis, warfarin necrosis.",
  },
  {
    id: "d0000001-0030-4000-8000-000000000001",
    term: "Serpiginous",
    definition:
      "An arrangement in which lesions follow a wavy, snake-like, or creeping course. Serpiginous patterns are characteristic of cutaneous larva migrans (creeping eruption from hookworm larvae) and elastosis perforans serpiginosa.",
    confusionPoints: [
      {
        confusedWith: "Linear",
        distinction:
          "Serpiginous follows a wavy, undulating path; linear follows a straight line. Cutaneous larva migrans is serpiginous (wavy), not linear (straight).",
      },
    ],
    relatedTerms: [
      "d0000001-0027-4000-8000-000000000001",
    ],
    category: "configuration",
    mnemonic:
      "Serpiginous = 'Serpent-like.' Snake-like, wavy track in the skin = cutaneous larva migrans (hookworm).",
  },
];
