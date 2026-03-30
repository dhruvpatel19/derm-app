import type { Condition } from "@/lib/domain/schemas";
import { lfSupplementalConditions } from "@/data/lf-supplemental-conditions";

const now = "2026-03-29T00:00:00Z";

const baseConditions: Condition[] = [
  {
    id: "c0000001-0001-4000-8000-000000000001",
    name: "Plaque Psoriasis",
    slug: "plaque-psoriasis",
    category: "papulosquamous",
    icdCodes: ["EA90.0"],
    description:
      "Plaque psoriasis is the most common form of psoriasis, a chronic immune-mediated inflammatory disease affecting approximately 2-3% of the population. It is characterized by well-demarcated, erythematous plaques with silvery-white scale, most commonly found on extensor surfaces, scalp, and lumbosacral area. The disease follows a relapsing-remitting course and is associated with psoriatic arthritis, cardiovascular disease, and metabolic syndrome. Hallmark morphology includes well-demarcated, symmetrically distributed erythematous plaques with adherent silvery-white (micaceous) scale. Auspitz sign (pinpoint bleeding when scale is removed) is characteristic. Koebner phenomenon (lesions arising at sites of trauma) may be observed.",
    clinicalFeatures: [
      "Well-demarcated erythematous plaques with thick silvery-white (micaceous) scale",
      "Symmetric distribution on extensor surfaces: elbows, knees, lumbosacral area",
      "Positive Auspitz sign (pinpoint bleeding on scale removal)",
      "Koebner phenomenon (isomorphic response at sites of trauma)",
      "Nail pitting, oil-drop sign, onycholysis, subungual hyperkeratosis",
      "Scalp involvement extending beyond the hairline",
      "Pruritus (variable, mild to severe)",
      "Joint pain or stiffness suggesting psoriatic arthritis (~30%)",
    ],
    differentialIds: [
      "c0000001-0002-4000-8000-000000000001",
      "c0000001-0005-4000-8000-000000000001",
    ],
    notes:
      "Red flags: Rapid generalized erythema with pustules (pustular psoriasis); Erythroderma (>90% BSA) is a medical emergency; New joint pain/swelling suggesting psoriatic arthritis. Management: Topical corticosteroids + calcipotriol for limited disease; Phototherapy (NB-UVB) for moderate disease; Biologics (TNF-alpha, IL-17, IL-23 inhibitors) for moderate-to-severe. Screen for psoriatic arthritis, cardiovascular risk factors, metabolic syndrome, and depression at every visit.",
    aliases: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "c0000001-0002-4000-8000-000000000001",
    name: "Atopic Dermatitis",
    slug: "atopic-dermatitis",
    category: "eczematous",
    icdCodes: ["EA80"],
    description:
      "Atopic dermatitis is the most common chronic inflammatory skin disease, affecting up to 20% of children and 3% of adults. It is a key component of the atopic triad (along with asthma and allergic rhinitis) and is driven by skin barrier dysfunction (often filaggrin gene mutations) and Th2-skewed immune dysregulation. The disease typically presents in infancy or childhood and may persist or relapse into adulthood. Hallmark morphology includes poorly defined erythematous patches and plaques with fine scale, excoriations, and lichenification in chronic lesions. Acute flares show vesicles, weeping, and crusting. Distribution is age-dependent: face and extensors in infants, flexural surfaces in children and adults.",
    clinicalFeatures: [
      "Poorly demarcated erythematous patches with fine scale",
      "Intense pruritus (hallmark symptom, often worse at night)",
      "Flexural distribution in children/adults: antecubital/popliteal fossae",
      "Face and extensor distribution in infants",
      "Lichenification and excoriations in chronic disease",
      "Xerosis (generalized dry skin)",
      "Dennie-Morgan infraorbital folds",
      "Palmar hyperlinearity",
      "Associated atopic triad: asthma, allergic rhinitis, food allergy",
    ],
    differentialIds: [
      "c0000001-0006-4000-8000-000000000001",
      "c0000001-0001-4000-8000-000000000001",
      "c0000001-0005-4000-8000-000000000001",
    ],
    notes:
      "Red flags: Eczema herpeticum (widespread punched-out erosions with fever - emergency); Erythroderma; Secondary bacterial infection (honey-colored crusting); New-onset adult eczema unresponsive to treatment (consider CTCL). Management: Emollients are the cornerstone; Topical corticosteroids for flares; Calcineurin inhibitors for sensitive areas and maintenance; Dupilumab for moderate-to-severe disease. Proactive maintenance therapy reduces flare frequency.",
    aliases: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "c0000001-0003-4000-8000-000000000001",
    name: "Basal Cell Carcinoma",
    slug: "basal-cell-carcinoma",
    category: "skin_cancer",
    icdCodes: ["2C32.0"],
    description:
      "Basal cell carcinoma is the most common human malignancy, arising from basal keratinocytes of the epidermis. It is strongly associated with cumulative and intermittent UV exposure, fair skin, and immunosuppression. BCC is locally invasive but rarely metastasizes (<0.1%). The nodular subtype is most common, followed by superficial, morpheaform/infiltrative, and basosquamous variants. Hallmark morphology: Pearly or translucent papule or nodule with rolled borders and arborizing (tree-like) telangiectasia. Central ulceration or crusting may be present (rodent ulcer). Superficial BCC appears as a thin, erythematous, scaly plaque with a thread-like pearly border.",
    clinicalFeatures: [
      "Pearly (translucent) papule or nodule with arborizing telangiectasia",
      "Rolled (raised) borders",
      "Central ulceration or crusting ('rodent ulcer')",
      "Slowly growing, painless lesion on sun-exposed skin",
      "Non-healing wound that bleeds and crusts recurrently",
      "Most common on face (especially nose, periorbital, ears)",
      "Background of chronic sun damage",
      "Dermoscopy: arborizing vessels, leaf-like structures, blue-gray ovoid nests",
    ],
    differentialIds: [
      "c0000001-0008-4000-8000-000000000001",
      "c0000001-0009-4000-8000-000000000001",
      "c0000001-0004-4000-8000-000000000001",
    ],
    notes:
      "Red flags: Morpheaform/infiltrative subtype (higher recurrence); Perineural invasion; Large size (>2 cm) or H-zone location; Recurrent BCC; Multiple BCCs in young patient (Gorlin syndrome). Management: Mohs surgery for high-risk facial BCC; Excision with 3-5 mm margins for standard; ED&C for low-risk trunk/extremity lesions. 50% of patients develop another BCC within 5 years - annual full-body skin exams recommended lifelong.",
    aliases: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "c0000001-0004-4000-8000-000000000001",
    name: "Melanoma",
    slug: "melanoma",
    category: "skin_cancer",
    icdCodes: ["2C30"],
    description:
      "Melanoma is an aggressive malignancy of melanocytes and the leading cause of skin cancer mortality. It accounts for only ~5% of skin cancers but >75% of skin cancer deaths. Risk factors include UV exposure (especially intermittent intense exposure and sunburns), fair skin, numerous or atypical nevi, family history, and immunosuppression. Early detection is critical, as prognosis is excellent for thin melanomas (Breslow depth <1 mm) but poor for thick or metastatic disease. The ABCDEs of melanoma (Asymmetry, Border irregularity, Color variation, Diameter >6 mm, Evolution) guide clinical screening. Hallmark morphology: asymmetric, irregularly bordered macule/papule/nodule with variegated color (brown, black, blue, red, white).",
    clinicalFeatures: [
      "Asymmetry (two halves do not match)",
      "Border irregularity (notched, scalloped, or ragged edges)",
      "Color variation (brown, black, blue-black, red, white, pink within one lesion)",
      "Diameter >6 mm (though melanomas can be smaller)",
      "Evolution (change in size, shape, color, or elevation over time)",
      "Ugly duckling sign (lesion that looks different from surrounding nevi)",
      "Ulceration (worse prognosis)",
      "Nodular melanoma: rapidly growing dome-shaped nodule, often symmetric (EFG rule: Elevated, Firm, Growing)",
    ],
    differentialIds: [
      "c0000001-0009-4000-8000-000000000001",
      "c0000001-0003-4000-8000-000000000001",
    ],
    notes:
      "Red flags: Breslow depth >1 mm; Ulceration (upstages prognosis); Nodular melanoma (lacks classic ABCDE features); Amelanotic melanoma (mimics BCC/SCC/pyogenic granuloma); Satellite or in-transit metastases. Management: Excisional biopsy (NOT shave) for diagnosis; Wide local excision with margins based on Breslow depth; SLNB for tumors >0.8 mm or with ulceration; Adjuvant immunotherapy for stage III-IV. Shave biopsy is NOT recommended for suspected melanoma.",
    aliases: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "c0000001-0005-4000-8000-000000000001",
    name: "Tinea Corporis",
    slug: "tinea-corporis",
    category: "infection",
    icdCodes: ["1F28.1"],
    description:
      "Tinea corporis is a superficial fungal infection of the glabrous (non-hair-bearing) skin caused by dermatophytes, most commonly Trichophyton rubrum, T. tonsurans, and Microsporum canis. It is transmitted by direct contact with infected individuals, animals, or fomites. The classic presentation is an annular, erythematous, scaly plaque with central clearing and an advancing, raised border. Diagnosis can be confirmed with KOH preparation or fungal culture. Hallmark morphology: Annular or polycyclic erythematous plaque with a raised, scaly, vesicular border and central clearing. Trailing scale (scale on the inner edge of the border) is a key clinical clue.",
    clinicalFeatures: [
      "Annular (ring-shaped) plaque with central clearing",
      "Raised, scaly, advancing border with fine vesiculation",
      "Trailing scale (scale on inner edge of active border)",
      "Mild to moderate pruritus",
      "Expanding lesion over days to weeks",
      "Polycyclic shapes when rings coalesce",
      "KOH preparation shows septate branching hyphae",
      "May worsen with topical steroids (tinea incognito)",
    ],
    differentialIds: [
      "c0000001-0002-4000-8000-000000000001",
      "c0000001-0001-4000-8000-000000000001",
    ],
    notes:
      "Red flags: Extensive or recalcitrant tinea in a young adult (screen for immunosuppression); Tinea incognito from prolonged topical steroid use; Majocchi granuloma (deep follicular invasion). Management: Topical terbinafine or clotrimazole for localized disease; Oral antifungals for extensive/recalcitrant cases; Always perform KOH prep before starting treatment; Avoid topical corticosteroids alone; Treat concurrent tinea pedis to prevent reinfection.",
    aliases: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "c0000001-0006-4000-8000-000000000001",
    name: "Contact Dermatitis",
    slug: "contact-dermatitis",
    category: "eczematous",
    icdCodes: ["EK00"],
    description:
      "Contact dermatitis encompasses irritant contact dermatitis (ICD, ~80%) and allergic contact dermatitis (ACD, ~20%). ICD is caused by direct chemical or physical damage to the skin barrier. ACD is a delayed-type (Type IV) hypersensitivity reaction. Common allergens include nickel, fragrances, preservatives, neomycin, and urushiol (poison ivy/oak). Acute ACD: well-demarcated erythematous patches with vesicles, weeping, and crusting conforming to the shape of the contactant. Chronic: lichenified, scaly, fissured plaques. Identification and avoidance of the causative agent is the most important management step.",
    clinicalFeatures: [
      "Geometric or shape-conforming distribution matching the contactant",
      "Well-demarcated borders (especially in ACD)",
      "Vesicles, weeping, and crusting in acute phase",
      "Lichenification and fissuring in chronic phase",
      "Pruritus (prominent in ACD) or burning (prominent in ICD)",
      "Hands are the most commonly affected site overall",
      "Linear vesicles pathognomonic for plant (Toxicodendron) contact dermatitis",
      "Patch testing is the gold standard for diagnosing ACD",
    ],
    differentialIds: [
      "c0000001-0002-4000-8000-000000000001",
      "c0000001-0005-4000-8000-000000000001",
    ],
    notes:
      "Red flags: Widespread or generalized eruption (systemic contact dermatitis); Occupational cases requiring workplace modification; Failure to respond (re-evaluate for ongoing exposure or missed allergen); Secondary bacterial infection. Management: Identify and avoid the causative agent (critical step); Topical corticosteroids; Wet compresses for acute lesions; Patch testing referral for suspected ACD; Short systemic steroid course for severe widespread ACD (e.g., poison ivy).",
    aliases: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "c0000001-0007-4000-8000-000000000001",
    name: "Acne Vulgaris",
    slug: "acne-vulgaris",
    category: "acne_rosacea",
    icdCodes: ["ED80.0"],
    description:
      "Acne vulgaris is the most common skin condition, affecting up to 85% of adolescents and young adults. It is a chronic inflammatory disease of the pilosebaceous unit driven by four key pathogenic factors: increased sebum production, follicular hyperkeratinization, Cutibacterium acnes colonization, and inflammation. Acne is classified by predominant lesion type (comedonal, inflammatory, nodulocystic) and severity. Hallmark morphology: Comedones (open/blackheads and closed/whiteheads) are the signature lesion. Inflammatory lesions include erythematous papules, pustules, and in severe cases, nodules and cysts.",
    clinicalFeatures: [
      "Open comedones (blackheads) and closed comedones (whiteheads) - signature lesion",
      "Erythematous papules and pustules",
      "Nodules and cysts in severe acne",
      "Distribution: face (T-zone, cheeks, chin), chest, upper back, shoulders",
      "Post-inflammatory hyperpigmentation (especially in skin of color)",
      "Scarring (ice-pick, rolling, boxcar types)",
      "Absence of comedones should prompt reconsideration (rosacea, folliculitis)",
      "Comedones distinguish acne from all its mimics",
    ],
    differentialIds: [],
    notes:
      "Red flags: Sudden severe cystic acne in prepubertal child (evaluate for androgen excess); Acne fulminans; Signs of virilization in females (PCOS, adrenal tumor); Severe scarring warranting early isotretinoin. Management: Topical retinoids (foundation of all acne therapy); Benzoyl peroxide (antibacterial, reduces resistance); Never prescribe topical antibiotics without BP; Oral antibiotics limited to 3-4 months; Isotretinoin for severe/scarring/refractory acne.",
    aliases: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "c0000001-0008-4000-8000-000000000001",
    name: "Squamous Cell Carcinoma",
    slug: "squamous-cell-carcinoma",
    category: "skin_cancer",
    icdCodes: ["2C31"],
    description:
      "Cutaneous squamous cell carcinoma is the second most common skin cancer, arising from malignant keratinocytes. Strongly associated with cumulative UV exposure, immunosuppression (organ transplant recipients have 65-250x increased risk), and precursor lesions (actinic keratoses). SCC has a higher metastatic potential than BCC (~2-5% overall). Actinic keratosis is the precursor lesion with a continuum from AK to SCC in situ (Bowen disease) to invasive SCC. Hallmark morphology: Firm, erythematous, keratotic papule/plaque/nodule with adherent scale or a central cutaneous horn. Surface may be ulcerated or indurated.",
    clinicalFeatures: [
      "Firm, erythematous, keratotic papule or nodule",
      "Adherent thick scale or central cutaneous horn",
      "Indurated, fixed base (suggests invasion)",
      "Non-healing ulcer or sore that bleeds",
      "Occurs on chronically sun-exposed skin (head, neck, dorsal hands)",
      "Background of actinic damage with actinic keratoses",
      "High-risk sites: ear, lip, temple, within scars/ulcers",
      "Dermoscopy: glomerular vessels, white structureless areas, keratin clods",
    ],
    differentialIds: [
      "c0000001-0003-4000-8000-000000000001",
      "c0000001-0009-4000-8000-000000000001",
    ],
    notes:
      "Red flags: Size >2 cm, depth >6 mm; Perineural invasion (pain, numbness, facial nerve palsy); Poorly differentiated or desmoplastic histology; Immunosuppressed patient; Rapidly growing nodule. Management: Excision with 4-6 mm margins for standard; Mohs surgery for high-risk SCC; Cemiplimab (PD-1 inhibitor) for advanced SCC; Treat actinic keratoses (field therapy). Organ transplant recipients need skin checks every 3-6 months.",
    aliases: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "c0000001-0009-4000-8000-000000000001",
    name: "Seborrheic Keratosis",
    slug: "seborrheic-keratosis",
    category: "benign_lesion",
    icdCodes: ["2F21"],
    description:
      "Seborrheic keratoses are the most common benign epidermal neoplasms, increasing in prevalence with age. They are clonal proliferations of keratinocytes with no malignant potential. SKs have a characteristic 'stuck-on' appearance and can vary widely in color from tan to dark brown or black. While entirely benign, darkly pigmented or irritated SKs can closely mimic melanoma or SCC. The sign of Leser-Trelat (sudden eruption of numerous SKs) is a rare paraneoplastic sign. Hallmark morphology: Well-demarcated, waxy, 'stuck-on' papule/plaque with a verrucous cerebriform surface. Horn cysts and fissured surface on dermoscopy.",
    clinicalFeatures: [
      "Well-demarcated, round or oval papule/plaque with 'stuck-on' appearance",
      "Waxy or verrucous (cerebriform) surface texture",
      "Color ranges from tan to dark brown/black",
      "Horn cysts (keratin-filled invaginations) visible on dermoscopy",
      "Comedo-like openings and milia-like cysts on dermoscopy",
      "Usually asymptomatic; may be pruritic or irritated from friction",
      "Occurs on trunk, face, extremities (spares palms/soles/mucosa)",
      "Soft and friable on palpation; can be crumbled off",
    ],
    differentialIds: [
      "c0000001-0004-4000-8000-000000000001",
      "c0000001-0003-4000-8000-000000000001",
      "c0000001-0008-4000-8000-000000000001",
    ],
    notes:
      "Red flags: Rapid appearance of numerous SKs (sign of Leser-Trelat - evaluate for internal malignancy); Atypical dermoscopy features (biopsy to rule out melanoma); Darkly pigmented lesion lacking horn cysts/milia-like cysts. Management: No treatment necessary if asymptomatic; Cryotherapy, shave removal, or curettage for symptomatic lesions; Always biopsy if diagnostic uncertainty. SKs do NOT become malignant - if a lesion changes, reconsider the diagnosis.",
    aliases: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "c0000001-0010-4000-8000-000000000001",
    name: "Herpes Zoster",
    slug: "herpes-zoster",
    category: "infection",
    icdCodes: ["1E91"],
    description:
      "Herpes zoster (shingles) is caused by reactivation of varicella-zoster virus (VZV) latent in dorsal root ganglia from prior chickenpox infection. It affects approximately 1 in 3 people in their lifetime, with incidence and severity increasing with age and immunosuppression. The classic presentation is a unilateral, dermatomal vesicular eruption preceded by prodromal pain. Postherpetic neuralgia (PHN) is the most common complication, occurring in up to 30% of patients over age 60. Shingrix (recombinant zoster vaccine) is >90% effective. Hallmark morphology: Grouped vesicles on an erythematous base in a dermatomal distribution, unilateral, not crossing the midline.",
    clinicalFeatures: [
      "Prodromal pain, burning, or tingling (1-5 days before rash)",
      "Grouped vesicles on erythematous bases",
      "Unilateral dermatomal distribution (does not cross midline)",
      "Vesicles at various stages: clear, pustular, crusted",
      "Thoracic dermatomes most commonly affected (T3-L2)",
      "Severe dermatomal pain and allodynia",
      "Hutchinson sign (nose tip vesicles) = risk of ocular involvement",
      "Ramsay Hunt syndrome (facial palsy + ear vesicles + hearing loss)",
    ],
    differentialIds: [
      "c0000001-0006-4000-8000-000000000001",
    ],
    notes:
      "Red flags: Herpes zoster ophthalmicus (V1) - urgent ophthalmology referral; Hutchinson sign - high risk of ocular zoster; Ramsay Hunt syndrome; Disseminated zoster (>20 vesicles outside primary dermatome) - evaluate for immunodeficiency; Zoster in young patient (<50) - consider HIV testing. Management: Valacyclovir 1g TID x7 days within 72 hours of rash onset; IV acyclovir for disseminated/immunocompromised; Gabapentin/pregabalin for PHN; Shingrix vaccine for prevention in adults 50+.",
    aliases: [],
    createdAt: now,
    updatedAt: now,
  },
];

const conditionEnhancements: Record<string, Partial<Condition>> = {
  "c0000001-0001-4000-8000-000000000001": {
    syllabusSection: "Papulosquamous disorders",
    summary:
      "A chronic inflammatory, hyperproliferative skin disease that classically produces sharply demarcated salmon-red plaques with silvery scale in a bilateral, symmetric distribution.",
    hallmarkMorphology: [
      "Disc-shaped, sharply demarcated plaques",
      "Salmon-red erythema with coarse silvery-white scale",
      "Bilateral, symmetrical distribution",
      "Auspitz sign with pinpoint bleeding after scale removal",
      "Nail pitting, onycholysis, or subungual hyperkeratosis",
    ],
    commonBodySites: [
      "Scalp and hairline",
      "Extensor elbows and knees",
      "Knuckles",
      "Palms and soles",
      "Nails",
      "Buttocks and genital skin",
    ],
    symptoms: [
      "Variable pruritus",
      "Chronic relapsing plaques",
      "Scale shedding",
      "Possible joint pain or morning stiffness",
    ],
    managementBasics: [
      "Use topical corticosteroids and vitamin D analogs for limited plaque disease",
      "Escalate to phototherapy or systemic therapy for more extensive disease",
      "Review triggers such as stress, skin trauma, and culprit medications",
      "Screen for psoriatic arthritis and quality-of-life burden",
    ],
    redFlags: [
      "New joint pain, swelling, or prolonged morning stiffness",
      "Rapid generalization, pustules, or erythroderma",
      "Severe palmoplantar or genital disease with major functional impact",
    ],
    followUpPearls: [
      "Distribution is often bilateral and symmetrical",
      "Different morphologic subtypes require different treatment strategies",
      "Review cardiovascular and metabolic comorbidity risk over time",
    ],
  },
  "c0000001-0002-4000-8000-000000000001": {
    syllabusSection: "Eczema",
    summary:
      "In the LF notes, eczema and atopic dermatitis are used interchangeably: a chronic, itchy, relapsing dermatitis driven by skin-barrier and immune dysfunction.",
    hallmarkMorphology: [
      "Ill-defined erythema rather than sharply edged plaques",
      "Dryness, cracking, and scale",
      "Vesiculation and exudation in acute flares",
      "Excoriations from itch",
      "Lichenification in chronic disease",
    ],
    commonBodySites: [
      "Neck",
      "Elbows and wrists",
      "Ankles",
      "Popliteal fossae",
      "Facial convexities in children younger than 2 years",
    ],
    symptoms: [
      "Chronic pruritus",
      "Dry skin",
      "Sleep-disrupting itch",
      "Relapsing flares",
    ],
    managementBasics: [
      "Optimize emollients, tepid baths, mild soap, and cotton clothing",
      "Use topical steroids with the weakest effective potency and the right vehicle",
      "Consider tacrolimus or pimecrolimus as steroid-sparing maintenance therapy",
      "Check for infection, adherence, and vehicle mismatch during flares",
    ],
    redFlags: [
      "Punched-out erosions or fever suggesting eczema herpeticum",
      "Secondary infection with crusting or spreading erythema",
      "Persistent uncontrolled disease despite seemingly appropriate therapy",
    ],
    followUpPearls: [
      "A common cause of 'treatment failure' is non-compliance or wrong vehicle selection",
      "Children often shift from facial involvement to flexural disease over time",
      "Review ambient triggers, wool exposure, and skin-care habits at follow-up",
    ],
  },
  "c0000001-0003-4000-8000-000000000001": {
    syllabusSection: "Skin cancer",
    summary:
      "The most common skin cancer and the most common tumour worldwide; locally destructive if untreated but it almost never metastasizes.",
    hallmarkMorphology: [
      "Pearly or scar-like papule/plaque",
      "Rolled border",
      "Central ulceration or 'rat-bite' erosion",
      "Visible telangiectasia",
      "Lesion often extends beyond what is first appreciated clinically",
    ],
    commonBodySites: ["Head", "Face", "Neck", "Sun-exposed trunk"],
    symptoms: [
      "Slow growth",
      "Intermittent bleeding or crusting",
      "Usually minimal pain",
      "Occasional itch",
    ],
    managementBasics: [
      "Biopsy with a 3 mm punch or shave if melanoma is not in the differential",
      "Standard excision commonly uses about a 4 mm margin",
      "Consider Mohs surgery near the nose or ears and for tissue-sparing sites",
      "Topical therapy or cryotherapy may be reasonable for superficial variants only",
    ],
    redFlags: [
      "Ill-defined infiltrative or morpheaform change",
      "Recurrent or incompletely treated lesions",
      "Anatomically high-risk sites near the nose, ears, or eyelids",
    ],
    followUpPearls: [
      "BCC can cause major local morbidity if left untreated despite minimal metastatic risk",
      "Subtypes can coexist within the same lesion",
      "Document prior skin cancer history because repeat lesions are common",
    ],
  },
  "c0000001-0004-4000-8000-000000000001": {
    syllabusSection: "Skin cancer",
    summary:
      "A melanocytic malignancy with metastatic potential that must be recognized early; evolution and the 'ugly duckling' sign are especially high-yield clues.",
    hallmarkMorphology: [
      "Asymmetric pigmented lesion",
      "Irregular border",
      "Variegated brown, black, white, blue, red, or pink color",
      "Flat, raised, or nodular morphology",
      "Ugly duckling lesion that stands out from surrounding nevi",
    ],
    commonBodySites: ["Anywhere on the skin", "Back", "Chest", "Face", "Thigh"],
    symptoms: [
      "Change in size, shape, or color",
      "Bleeding or crusting",
      "New elevation",
      "Sensory change",
    ],
    managementBasics: [
      "Perform an excisional biopsy with about a 2 mm clinical border when feasible",
      "Do not shave a lesion when melanoma is a serious concern",
      "Refer for wide local excision and staging once melanoma is confirmed",
      "Use Breslow depth as the key prognostic indicator when pathology is available",
    ],
    redFlags: [
      "Rapid evolution or new nodularity",
      "Ulceration or bleeding",
      "A pink or red nodular lesion that lacks classic ABCDE symmetry clues",
    ],
    followUpPearls: [
      "ABCDE criteria are most helpful for superficial melanomas, not all nodular lesions",
      "The ugly duckling sign is high yield when many benign nevi are present",
      "Definitive follow-up depends on Breslow depth, ulceration, and nodal staging",
    ],
  },
  "c0000001-0005-4000-8000-000000000001": {
    syllabusSection: "Fungal infections",
    summary:
      "A dermatophyte infection of glabrous skin that produces pruritic, enlarging annular plaques with a raised scaly border and relative central clearing.",
    hallmarkMorphology: [
      "Well-defined round or annular plaque",
      "Raised scaly border",
      "Relative central clearing or depression",
      "Centrifugal spread with advancing edge",
    ],
    commonBodySites: ["Trunk", "Extremities", "Glabrous skin"],
    symptoms: ["Pruritus", "Gradual enlargement", "Scale"],
    managementBasics: [
      "Confirm with KOH microscopy when needed",
      "Use topical antifungals first line for localized disease",
      "Escalate to oral antifungals for extensive or refractory disease",
      "Avoid topical corticosteroid monotherapy",
    ],
    redFlags: [
      "Widespread or difficult-to-reach disease needing systemic therapy",
      "Persistent eruption after steroid exposure suggesting tinea incognito",
      "Scalp, nail, or hair-bearing involvement needing a different treatment plan",
    ],
    followUpPearls: [
      "Tinea corporis spreads outward with an enlarging border",
      "Never use a steroid alone on a fungal infection",
      "Reassess diagnosis if the rash lacks scale or central clearing",
    ],
  },
  "c0000001-0006-4000-8000-000000000001": {
    syllabusSection: "Eczema",
    summary:
      "A form of eczema caused by an externally applied substance, divided into irritant and allergic contact dermatitis, with the hands as a classic site.",
    hallmarkMorphology: [
      "Eczematous dermatitis in the area of exposure",
      "Sharp or geometric borders when the contactant is obvious",
      "Vesiculation, weeping, and crusting in acute disease",
      "Scale, fissuring, and lichenification in chronic disease",
    ],
    commonBodySites: ["Hands", "Wrists", "Face", "Any exposed area"],
    symptoms: [
      "Pruritus in allergic contact dermatitis",
      "Burning and irritation in irritant dermatitis",
      "Relapsing rash at exposure sites",
    ],
    managementBasics: [
      "Remove the irritant or allergen",
      "Use the same gentle-skin-care measures emphasized for atopic dermatitis",
      "Treat inflamed skin with topical steroids",
      "Patch test when allergic contact dermatitis is suspected",
    ],
    redFlags: [
      "Occupational dermatitis with ongoing exposure",
      "Recurrent hand dermatitis in patients with atopic background",
      "Persistent rash despite avoidance measures",
    ],
    followUpPearls: [
      "Irritant dermatitis needs no prior sensitization",
      "Allergic contact dermatitis is a delayed type IV hypersensitivity reaction",
      "Occupational history often unlocks the diagnosis",
    ],
  },
  "c0000001-0007-4000-8000-000000000001": {
    syllabusSection: "Acne",
    summary:
      "A disease of pilosebaceous units in adolescents and young adults where comedones are the signature lesion and guide the diagnosis.",
    hallmarkMorphology: [
      "Open comedones (blackheads)",
      "Closed comedones (whiteheads)",
      "Inflammatory papules and pustules",
      "Nodules and cysts in severe disease",
      "Acne scarring in more destructive disease",
    ],
    commonBodySites: ["Face", "Neck", "Chest", "Upper back"],
    symptoms: [
      "Oiliness or seborrhea",
      "Inflammatory papules and pustules",
      "Post-inflammatory pigment change",
      "Scarring in severe disease",
    ],
    managementBasics: [
      "Build mild-acne regimens around topical retinoids and benzoyl peroxide",
      "Add topical or oral antibiotics for more inflammatory disease",
      "Use hormonal therapy when appropriate in women",
      "Refer severe, nodulocystic, scarring, or refractory acne for isotretinoin consideration",
    ],
    redFlags: [
      "Nodulocystic or scarring acne",
      "Severe inflammatory acne not responding to therapy",
      "Features suggesting androgen exposure or another diagnosis",
    ],
    followUpPearls: [
      "Comedones distinguish acne from many mimics",
      "Acne only affects pilosebaceous units, not palms or soles",
      "Never rely on topical antibiotics alone without benzoyl peroxide",
    ],
  },
  "c0000001-0008-4000-8000-000000000001": {
    syllabusSection: "Skin cancer",
    summary:
      "A keratinocyte malignancy with a real metastatic risk, typically arising on sun-damaged skin as a firm scaly or crusted lesion that grows faster than BCC.",
    hallmarkMorphology: [
      "Firm erythematous papule, plaque, or nodule",
      "Scale, crust, or central keratinous core",
      "Eroded or ulcerated surface",
      "Induration and faster outward growth than BCC",
    ],
    commonBodySites: [
      "Sun-exposed skin",
      "Head and neck",
      "Dorsal hands and forearms",
      "Chronic wounds or inflamed scars",
    ],
    symptoms: [
      "Growth over weeks to months",
      "Scale or crust",
      "Bleeding or tenderness in some lesions",
    ],
    managementBasics: [
      "Biopsy with punch or shave and no need to sample normal skin",
      "Definitive treatment is usually local excision",
      "Use topical or destructive therapy only for appropriately superficial variants",
      "Assess high-risk context such as transplant status or chronic ulcers",
    ],
    redFlags: [
      "Lesions on the ear, lip, or chronically scarred/inflamed skin",
      "Immunosuppression or transplant history",
      "Rapid growth, induration, or nodal symptoms",
    ],
    followUpPearls: [
      "LF notes emphasize an overall metastatic risk around 3-5%",
      "Keratoacanthoma is a well-differentiated SCC variant with rapid growth",
      "Document skin cancer history because recurrence and multiplicity matter",
    ],
  },
  "c0000001-0009-4000-8000-000000000001": {
    syllabusSection: "Benign lesions",
    summary:
      "A benign epidermal growth with a classic stuck-on, waxy, cerebriform appearance that can still mimic melanoma or SCC when irritated or darkly pigmented.",
    hallmarkMorphology: [
      "Stuck-on papule or plaque",
      "Waxy or verrucous surface",
      "Well-demarcated border",
      "Tan-to-dark pigmentation",
    ],
    commonBodySites: ["Chest", "Back", "Face", "Upper extremities"],
    symptoms: ["Usually asymptomatic", "Occasional itch", "Irritation from friction"],
    managementBasics: [
      "Reassure when the diagnosis is secure",
      "Treat symptomatic lesions with cryotherapy, curettage, or shave removal",
      "Biopsy if clinical uncertainty remains",
    ],
    redFlags: [
      "Atypical pigment pattern or loss of classic stuck-on appearance",
      "Rapid eruption of many lesions",
      "Persistent diagnostic uncertainty with melanoma in the differential",
    ],
    followUpPearls: [
      "Seborrheic keratoses do not transform into melanoma",
      "If a lesion is changing in a concerning way, reconsider the diagnosis instead of assuming it is an SK",
      "Darkly pigmented SKs are a classic melanoma mimic",
    ],
  },
  "c0000001-0010-4000-8000-000000000001": {
    syllabusSection: "Viral infections",
    summary:
      "Reactivation of varicella-zoster virus causing prodromal pain followed by unilateral grouped vesicles in a dermatomal distribution.",
    hallmarkMorphology: [
      "Grouped vesicles and pustules on an erythematous base",
      "Unilateral dermatomal distribution",
      "Lesions crust over with time",
      "Does not cross the midline in typical disease",
    ],
    commonBodySites: ["Thorax", "Face", "Upper extremity", "Lower extremity"],
    symptoms: [
      "Burning or stabbing prodromal pain",
      "Malaise or fever",
      "Allodynia",
      "Persistent post-herpetic neuralgia in some patients",
    ],
    managementBasics: [
      "Treat clinically with oral antivirals when indicated",
      "Urgently involve ophthalmology for nasal-tip or ocular distribution",
      "Address neuropathic pain and prevention strategies",
      "Counsel patients that lesions are contagious until crusted",
    ],
    redFlags: [
      "Hutchinson sign on the tip of the nose",
      "Eye symptoms or cranial nerve involvement",
      "Disseminated disease or marked immunocompromise",
    ],
    followUpPearls: [
      "Post-herpetic neuralgia is a key complication to screen for",
      "Diagnosis is usually clinical",
      "Vaccination reduces risk and severity in older adults",
    ],
  },
};

const actinicKeratosisCondition: Condition = {
  id: "cond-pad-ack",
  name: "Actinic Keratosis",
  slug: "actinic-keratosis",
  category: "premalignant",
  description:
    "Actinic keratosis is a premalignant keratinocytic lesion that develops on chronically sun-exposed skin, especially in older adults with cumulative UV damage. LF notes emphasize that these lesions are precancerous and may progress along the spectrum toward squamous cell carcinoma. They are often easier to feel than to see, with a rough, gritty, scaly surface. Color may be red, pink, brown, white, or yellow, and lesions may be well or poorly defined.",
  clinicalFeatures: [
    "Rough or gritty scaly patch or papule",
    "Red, pink, brown, white, or yellow coloration",
    "Occurs on chronically sun-exposed skin",
    "Usually found in older patients with photodamage",
    "May be better appreciated by palpation than by inspection alone",
    "Tenderness, scale, or mild bleeding can occur",
  ],
  differentialIds: [
    "c0000001-0008-4000-8000-000000000001",
    "c0000001-0003-4000-8000-000000000001",
    "c0000001-0009-4000-8000-000000000001",
  ],
  notes:
    "Red flags: Induration, rapid growth, ulceration, marked tenderness, or failure to respond to treatment should raise concern for progression toward SCC. Management: Classic isolated lesions are often treated with cryotherapy; topical field therapy such as 5-FU is useful when multiple lesions are present; curettage or excision may be used when diagnostic uncertainty remains. Follow-up: Reinforce sun protection and continue surveillance for new AKs, SCC, and other UV-related skin cancers.",
  aliases: ["Solar keratosis"],
  syllabusSection: "Skin cancer",
  summary:
    "A precancerous UV-driven lesion on sun-exposed skin that presents as a rough, scaly patch and serves as a clinical warning sign for field cancerization and SCC risk.",
  hallmarkMorphology: [
    "Rough, gritty surface",
    "Scaly erythematous or tan patch/papule",
    "Well- or poorly defined border",
    "More palpable than dramatic in early disease",
  ],
  commonBodySites: ["Face", "Nose", "Scalp", "Ears", "Forearms", "Dorsal hands"],
  symptoms: ["Scale", "Roughness", "Mild itch or tenderness", "Occasional bleeding"],
  managementBasics: [
    "Use cryotherapy for classic isolated lesions",
    "Use topical field therapy such as 5-FU when multiple lesions are present",
    "Biopsy atypical lesions or those concerning for SCC",
    "Address cumulative sun exposure and photoprotection",
  ],
  redFlags: [
    "Induration or a firm invasive feel",
    "Rapid enlargement, ulceration, or disproportionate tenderness",
    "Failure to improve after appropriately selected treatment",
  ],
  followUpPearls: [
    "Actinic keratosis sits on the spectrum toward squamous cell carcinoma",
    "Field cancerization matters as much as the single visible lesion",
    "Patients with one AK often have enough UV injury to merit ongoing surveillance",
  ],
  createdAt: now,
  updatedAt: now,
};

export const conditions: Condition[] = [
  ...baseConditions.map((condition) => ({
    ...condition,
    ...(conditionEnhancements[condition.id] ?? {}),
  })),
  ...lfSupplementalConditions,
  actinicKeratosisCondition,
].sort((a, b) => a.name.localeCompare(b.name));
