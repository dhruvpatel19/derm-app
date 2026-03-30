// ---------------------------------------------------------------------------
// Simulation Module seed data
// ---------------------------------------------------------------------------

interface SimulationModule {
  id: string;
  title: string;
  type:
    | "biopsy_choice"
    | "target_selector"
    | "procedure_sequence"
    | "interactive_procedure";
  conditionId?: string;
  description: string;
  objectives: string[];
  imageAssetId?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  caseStem?: string;
  correctChoice?: string;
  choiceOptions?: Array<{
    id: string;
    label: string;
    explanation: string;
    isCorrect: boolean;
    isDangerous?: boolean;
  }>;
  targetZones?: Array<{
    id: string;
    label: string;
    region: {
      type: "circle" | "rect";
      coordinates: number[];
      radiusPx?: number;
    };
    quality: "ideal" | "acceptable" | "poor" | "dangerous";
    explanation: string;
  }>;
  procedureSteps?: Array<{
    order: number;
    title: string;
    description: string;
    tips?: string[];
    warnings?: string[];
  }>;
  equipmentPrompt?: string;
  equipmentChoices?: Array<{
    id: string;
    label: string;
    explanation: string;
    isCorrect: boolean;
    isDangerous?: boolean;
  }>;
  anesthesiaPrompt?: string;
  anesthesiaChoices?: Array<{
    id: string;
    label: string;
    explanation: string;
    isCorrect: boolean;
    isDangerous?: boolean;
  }>;
  procedureTargetPrompt?: string;
  procedureTargetZones?: Array<{
    id: string;
    label: string;
    shape: "circle" | "rect";
    coordinates: number[];
    quality: "ideal" | "acceptable" | "poor" | "dangerous";
    explanation: string;
  }>;
  pathologyReport?: {
    title: string;
    specimen?: string;
    diagnosis: string;
    findings: string[];
    limitations?: string;
  };
  followUpPrompt?: string;
  followUpChoices?: Array<{
    id: string;
    label: string;
    explanation: string;
    isCorrect: boolean;
    isDangerous?: boolean;
  }>;
  procedureChecklistTitle?: string;
  explanation: string;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
}

export type { SimulationModule };

export const simulationModules: SimulationModule[] = [
  // ---------------------------------------------------------------------------
  // 1. Biopsy Choice – Suspected Melanoma
  // ---------------------------------------------------------------------------
  {
    id: "sim-bc-melanoma",
    title: "Suspected Melanoma",
    type: "biopsy_choice",
    conditionId: "melanoma",
    imageAssetId: "a0000001-0004-4000-8000-000000000001",
    description:
      "A patient presents with an asymmetric, irregularly bordered pigmented lesion on the upper back. Choose the most appropriate biopsy technique.",
    objectives: [
      "Identify the correct biopsy type for a pigmented lesion suspicious for melanoma",
      "Understand why shave biopsy is contraindicated for suspected melanoma",
      "Recognize the importance of full-thickness tissue for Breslow depth measurement",
    ],
    difficulty: "intermediate",
    caseStem:
      "A 47-year-old fair-skinned male presents with a 1.2 cm asymmetric, variably pigmented macule on the upper back that his partner noticed has been changing over the past 6 months. On examination, the lesion demonstrates irregular borders, multiple shades of brown and black, and a focal area of regression (white scar-like zone). Dermoscopy reveals an atypical pigment network with irregular globules and regression structures.",
    correctChoice: "excisional",
    choiceOptions: [
      {
        id: "bc-mel-excisional",
        label: "Excisional biopsy (narrow margins)",
        explanation:
          "Correct. Excisional biopsy with 1-3 mm clinical margins is the gold standard for suspected melanoma. It provides the entire lesion for histopathological assessment, enabling accurate Breslow depth measurement, which is the single most important prognostic factor for melanoma staging and guides definitive surgical margins.",
        isCorrect: true,
      },
      {
        id: "bc-mel-punch",
        label: "Punch biopsy (of the darkest area)",
        explanation:
          "Acceptable but not ideal. A punch biopsy through the thickest or most atypical area can provide a diagnosis, but it samples only a portion of the lesion. This risks missing the deepest focus of invasion, leading to understaging. It is reasonable when excisional biopsy is impractical (e.g., very large lesion or difficult anatomic site).",
        isCorrect: false,
      },
      {
        id: "bc-mel-shave",
        label: "Shave biopsy",
        explanation:
          "Dangerous. A shave biopsy transects the lesion superficially and prevents accurate measurement of Breslow depth. If the melanoma extends deeper than the shave plane, the true thickness is unknown, potentially leading to inadequate treatment margins and incorrect staging. Shave biopsy of a suspected melanoma is considered a critical error.",
        isCorrect: false,
        isDangerous: true,
      },
      {
        id: "bc-mel-observation",
        label: "Clinical observation with 3-month follow-up",
        explanation:
          "Inappropriate. Given the ABCDE features (Asymmetry, Border irregularity, Color variation, large Diameter, Evolution), observation alone is insufficient. Delay in biopsy risks disease progression and worsened prognosis. Any pigmented lesion with multiple concerning features warrants prompt tissue diagnosis.",
        isCorrect: false,
        isDangerous: true,
      },
    ],
    explanation:
      "For suspected melanoma, excisional biopsy with narrow (1-3 mm) margins is the standard of care. The entire lesion should be removed to allow full histopathological evaluation, including accurate Breslow depth measurement. Shave biopsy is contraindicated because it may transect the tumor and make it impossible to determine true tumor thickness, which directly determines staging, prognosis, and the width of definitive surgical margins. Incisional/punch biopsy is acceptable for large lesions or those in cosmetically sensitive areas, but should target the clinically thickest or most atypical area.",
    tags: ["melanoma", "biopsy technique", "skin cancer", "excisional biopsy"],
    isActive: true,
    createdAt: "2026-03-01T00:00:00Z",
  },

  // ---------------------------------------------------------------------------
  // 2. Biopsy Choice – Nodular BCC on Nose
  // ---------------------------------------------------------------------------
  {
    id: "sim-bc-bcc-nose",
    title: "Nodular BCC on Nose",
    type: "biopsy_choice",
    conditionId: "basal-cell-carcinoma",
    imageAssetId: "a0000001-0003-4000-8000-000000000001",
    description:
      "A pearly, telangiectatic nodule on the nasal tip requires tissue diagnosis. Select the most appropriate biopsy method.",
    objectives: [
      "Choose the appropriate biopsy technique for a suspected basal cell carcinoma",
      "Understand why punch biopsy is preferred for histologic subtyping",
      "Recognize that Mohs micrographic surgery is the definitive treatment for facial BCC",
    ],
    difficulty: "beginner",
    caseStem:
      "A 68-year-old woman presents with a 6 mm pearly, dome-shaped papule on the nasal tip that has been slowly enlarging over 8 months. She reports occasional bleeding when she inadvertently bumps it. On examination, the lesion has a rolled, translucent border with arborizing telangiectasias visible on the surface. There is a small central erosion. No palpable lymphadenopathy. She is otherwise healthy.",
    correctChoice: "punch",
    choiceOptions: [
      {
        id: "bc-bcc-punch",
        label: "Punch biopsy (3-4 mm)",
        explanation:
          "Correct. A punch biopsy is the preferred diagnostic technique for suspected BCC. It provides a full-thickness specimen that allows the pathologist to determine the histologic subtype (nodular, infiltrative, morpheaform, etc.), which is critical for treatment planning. Subtype determines whether standard excision or Mohs micrographic surgery is indicated.",
        isCorrect: true,
      },
      {
        id: "bc-bcc-shave",
        label: "Shave biopsy (saucerization)",
        explanation:
          "Acceptable. A deep shave (saucerization) biopsy can confirm the diagnosis of BCC. However, if the shave is too superficial, it may not capture the deeper component needed to accurately determine the histologic subtype. For nasal lesions where Mohs surgery is likely indicated, a punch biopsy is preferred for complete subtype characterization.",
        isCorrect: false,
      },
      {
        id: "bc-bcc-excisional",
        label: "Excisional biopsy with 4 mm margins",
        explanation:
          "Reasonable but not optimal as an initial diagnostic step for a nasal lesion. On the nose, tissue conservation is critical. An excisional biopsy removes tissue unnecessarily before the definitive treatment plan is established. If the subtype warrants Mohs surgery (which provides margin control while sparing tissue), the excisional biopsy may complicate the Mohs procedure and reconstruction.",
        isCorrect: false,
      },
      {
        id: "bc-bcc-observation",
        label: "Dermoscopic monitoring with 6-month follow-up",
        explanation:
          "Inappropriate. The clinical presentation (pearly papule with arborizing telangiectasias and erosion on the nose of an elderly patient) is highly suggestive of BCC. Observation delays diagnosis and allows the tumor to enlarge, potentially increasing the complexity of surgical repair on the nose.",
        isCorrect: false,
        isDangerous: true,
      },
    ],
    explanation:
      "For a clinically suspected BCC on the nose, punch biopsy is the preferred diagnostic approach. It provides full-thickness tissue for accurate histologic subtyping, which is essential because infiltrative and morpheaform subtypes require Mohs micrographic surgery for complete clearance. Shave biopsy is acceptable but may not capture the deep component. Excisional biopsy is generally avoided on the nose as the initial step because Mohs surgery (which is likely indicated for nasal BCC) provides superior tissue conservation and margin control for reconstruction.",
    tags: [
      "basal cell carcinoma",
      "biopsy technique",
      "skin cancer",
      "punch biopsy",
      "Mohs surgery",
    ],
    isActive: true,
    createdAt: "2026-03-01T00:00:00Z",
  },

  // ---------------------------------------------------------------------------
  // 3. Biopsy Choice – Possible Actinic Keratosis
  // ---------------------------------------------------------------------------
  {
    id: "sim-bc-ak",
    title: "Possible Actinic Keratosis",
    type: "biopsy_choice",
    conditionId: "actinic-keratosis",
    imageAssetId: "569fe285-569f-4285-89f6-9f670a39569f",
    description:
      "A rough, scaly patch on sun-exposed skin in a patient with extensive photodamage. Determine whether biopsy is needed and which technique to use.",
    objectives: [
      "Recognize when shave biopsy is appropriate for flat, scaly lesions",
      "Understand that empiric treatment without biopsy is acceptable for classic actinic keratosis",
      "Know when to biopsy versus treat empirically",
    ],
    difficulty: "beginner",
    caseStem:
      "A 72-year-old retired farmer presents for a skin check. He has extensive solar damage with multiple rough, erythematous scaly patches on the dorsal forearms and scalp. One particular lesion on the left forearm is 8 mm in diameter, rough and gritty to palpation, and has a background of erythema with adherent scale. It is flat without induration or nodularity. He notes it has been present for several months and is mildly tender. There is no bleeding or ulceration.",
    correctChoice: "shave",
    choiceOptions: [
      {
        id: "bc-ak-shave",
        label: "Shave biopsy",
        explanation:
          "Correct. When biopsy is warranted, a superficial shave biopsy (tangential excision) is the ideal technique for a flat, scaly lesion suspected to be an actinic keratosis. It provides adequate tissue for diagnosis while being minimally invasive and preserving tissue for the superficial nature of the pathology. It also effectively rules out squamous cell carcinoma in situ (Bowen disease) or early invasive SCC.",
        isCorrect: true,
      },
      {
        id: "bc-ak-empiric",
        label: "No biopsy; treat empirically with cryotherapy or topical 5-FU",
        explanation:
          "Acceptable. For clinically classic actinic keratoses in a patient with extensive photodamage, empiric treatment with cryotherapy, topical 5-fluorouracil, or imiquimod is standard practice. Biopsy is reserved for atypical presentations, lesions that fail to respond to treatment, or when SCC is suspected (induration, rapid growth, tenderness).",
        isCorrect: false,
      },
      {
        id: "bc-ak-punch",
        label: "Punch biopsy",
        explanation:
          "Unnecessary for a typical flat, scaly AK. A punch biopsy obtains deeper tissue than needed for this superficial epidermal lesion and leaves a larger wound. Punch biopsy would be appropriate if there were concern for a deeper process such as invasive SCC (induration, nodularity).",
        isCorrect: false,
      },
      {
        id: "bc-ak-excisional",
        label: "Excisional biopsy",
        explanation:
          "Excessive. Excisional biopsy is disproportionate for a superficial, flat lesion suspected to be an actinic keratosis. It causes unnecessary morbidity, scarring, and is a poor use of resources when simpler techniques provide adequate diagnostic information.",
        isCorrect: false,
      },
    ],
    explanation:
      "Actinic keratoses are superficial epidermal lesions, and when biopsy is clinically indicated, a shave biopsy is the most appropriate technique. It is quick, minimally invasive, and provides sufficient tissue to distinguish AK from Bowen disease or early invasive SCC. However, for clinically classic AKs in the setting of extensive photodamage, empiric treatment without biopsy is also acceptable and is common practice. Biopsy should be performed when there is diagnostic uncertainty, features suggesting SCC (induration, rapid growth, ulceration), or failure to respond to standard treatment.",
    tags: [
      "actinic keratosis",
      "biopsy technique",
      "shave biopsy",
      "field cancerization",
    ],
    isActive: true,
    createdAt: "2026-03-01T00:00:00Z",
  },

  // ---------------------------------------------------------------------------
  // 4. Target Selector – Punch Biopsy of Plaque Psoriasis
  // ---------------------------------------------------------------------------
  {
    id: "sim-ts-psoriasis",
    title: "Punch Biopsy of Plaque Psoriasis",
    type: "target_selector",
    conditionId: "psoriasis",
    description:
      "Select the optimal biopsy site on a psoriatic plaque for histopathologic diagnosis.",
    objectives: [
      "Identify the most representative area of a psoriatic plaque for biopsy",
      "Understand that the center of a well-developed plaque yields the most diagnostic features",
      "Avoid biopsying normal perilesional skin when the goal is to confirm the primary diagnosis",
    ],
    difficulty: "beginner",
    caseStem:
      "A 35-year-old man presents with well-demarcated, erythematous plaques with thick, silvery-white scale on the extensor elbows and knees. The largest plaque on the left elbow is 5 cm in diameter. You decide to perform a punch biopsy to confirm the clinical diagnosis of plaque psoriasis. The image below represents a cross-section of the plaque and surrounding skin. Select where you would place the punch biopsy.",
    targetZones: [
      {
        id: "tz-pso-center",
        label: "Center of plaque (thickest area)",
        region: { type: "circle", coordinates: [200, 150], radiusPx: 40 },
        quality: "ideal",
        explanation:
          "Ideal target. The center of a well-developed psoriatic plaque demonstrates the most diagnostic histopathologic features: regular acanthosis with elongation and clubbing of rete ridges, suprapapillary thinning, dilated capillaries in dermal papillae, Munro microabscesses, and confluent parakeratosis. This is the most representative area for confirming the diagnosis.",
      },
      {
        id: "tz-pso-peripheral",
        label: "Peripheral edge of plaque",
        region: { type: "circle", coordinates: [310, 150], radiusPx: 35 },
        quality: "acceptable",
        explanation:
          "Acceptable but not ideal. The edge of the plaque may show diagnostic features, but they are often less well-developed than the center. The transition zone between involved and uninvolved skin can make interpretation less straightforward. If the plaque center is accessible, it is preferred.",
      },
      {
        id: "tz-pso-perilesional",
        label: "Normal skin adjacent to plaque",
        region: { type: "circle", coordinates: [80, 150], radiusPx: 35 },
        quality: "poor",
        explanation:
          "Poor choice for confirming psoriasis. Normal-appearing perilesional skin will not show the characteristic epidermal and dermal changes of psoriasis. This area would be appropriate only if you were performing direct immunofluorescence (DIF) for a vesiculobullous disease, but not for the clinical scenario described.",
      },
    ],
    explanation:
      "When biopsying a psoriatic plaque, target the center of the most well-developed plaque. This provides the most diagnostic histopathologic features, including regular acanthosis, suprapapillary thinning, Munro microabscesses, and dilated dermal papillary capillaries. The edge of the plaque is acceptable but may show less well-developed features. Perilesional normal skin is not useful for confirming psoriasis.",
    tags: [
      "psoriasis",
      "biopsy site selection",
      "punch biopsy",
      "histopathology",
    ],
    isActive: true,
    createdAt: "2026-03-01T00:00:00Z",
  },

  // ---------------------------------------------------------------------------
  // 5. Target Selector – Biopsy of Suspected Bullous Pemphigoid
  // ---------------------------------------------------------------------------
  {
    id: "sim-ts-bp",
    title: "Biopsy of Suspected Bullous Pemphigoid",
    type: "target_selector",
    conditionId: "bullous-pemphigoid",
    description:
      "Select the optimal biopsy site for direct immunofluorescence (DIF) in a patient with suspected bullous pemphigoid.",
    objectives: [
      "Know that DIF requires perilesional (not lesional) skin for autoimmune blistering diseases",
      "Understand why the center of a blister is a poor choice for DIF",
      "Identify the ideal target as normal-appearing skin adjacent to a blister",
    ],
    difficulty: "advanced",
    caseStem:
      "An 78-year-old woman presents with tense blisters on erythematous and urticarial bases on the trunk and proximal extremities. She has had progressive pruritus for several weeks before the blisters appeared. You suspect bullous pemphigoid and plan to perform two biopsies: one for H&E (from the edge of a fresh blister) and one for direct immunofluorescence (DIF). The image below shows a blister and the surrounding skin. Select where you would place the DIF biopsy punch.",
    targetZones: [
      {
        id: "tz-bp-perilesional",
        label: "Perilesional normal-appearing skin (1 cm from blister edge)",
        region: { type: "circle", coordinates: [100, 150], radiusPx: 40 },
        quality: "ideal",
        explanation:
          "Ideal target for DIF. Perilesional, clinically normal-appearing skin (within approximately 1 cm of a fresh blister) is the gold standard for DIF in autoimmune blistering diseases. In bullous pemphigoid, DIF reveals linear IgG and C3 deposits along the basement membrane zone. Lesional skin may show non-specific findings due to inflammation and tissue destruction.",
      },
      {
        id: "tz-bp-blister-edge",
        label: "Edge of the blister",
        region: { type: "circle", coordinates: [210, 150], radiusPx: 35 },
        quality: "acceptable",
        explanation:
          "Acceptable for H&E but not ideal for DIF. The edge of a fresh blister is the preferred site for routine histopathology (H&E), which shows a subepidermal blister with eosinophils. For DIF, however, the inflammatory process at the blister edge may degrade the immune deposits, reducing diagnostic sensitivity.",
      },
      {
        id: "tz-bp-blister-center",
        label: "Center of the blister",
        region: { type: "circle", coordinates: [290, 140], radiusPx: 40 },
        quality: "poor",
        explanation:
          "Poor choice for both DIF and H&E. The center of an established blister shows only separated epidermis and blister fluid. The roof is detached, the inflammatory infiltrate may be non-specific, and basement membrane zone immune deposits are often destroyed or absent. This area provides minimal diagnostic information.",
      },
      {
        id: "tz-bp-distant",
        label: "Uninvolved skin distant from any blister",
        region: { type: "circle", coordinates: [50, 60], radiusPx: 25 },
        quality: "poor",
        explanation:
          "Suboptimal for DIF. While perilesional skin is the target, skin that is very distant from any lesion may have lower concentrations of immune deposits along the basement membrane zone, reducing diagnostic yield. The optimal DIF specimen comes from clinically normal skin immediately adjacent to an active lesion.",
      },
    ],
    explanation:
      "In suspected bullous pemphigoid, two biopsies are standard: one from the edge of a fresh blister for H&E histopathology, and one from perilesional, clinically normal-appearing skin for direct immunofluorescence (DIF). The DIF biopsy should be taken from skin within approximately 1 cm of an active blister but outside the blister itself. This is because the basement membrane zone immune deposits (linear IgG and C3 in BP) are best preserved in uninflamed perilesional tissue. Biopsying the blister itself or distant uninvolved skin reduces diagnostic sensitivity.",
    tags: [
      "bullous pemphigoid",
      "DIF",
      "immunofluorescence",
      "biopsy site selection",
      "autoimmune blistering",
    ],
    isActive: true,
    createdAt: "2026-03-01T00:00:00Z",
  },

  // ---------------------------------------------------------------------------
  // 6. Procedure Sequence – Punch Biopsy Procedure
  // ---------------------------------------------------------------------------
  {
    id: "sim-ps-punch",
    title: "Punch Biopsy Procedure",
    type: "procedure_sequence",
    description:
      "Arrange the steps of a punch biopsy in the correct procedural order, from obtaining consent to specimen handling.",
    objectives: [
      "Know the correct sequence for performing a punch biopsy",
      "Understand the importance of informed consent before any procedure",
      "Recognize key safety steps including sterile technique and specimen labeling",
    ],
    difficulty: "beginner",
    caseStem:
      "You are about to perform a 4 mm punch biopsy on a patient's forearm for a suspected dermatologic condition. Arrange the following procedural steps in the correct order.",
    procedureSteps: [
      {
        order: 1,
        title: "Obtain informed consent",
        description:
          "Explain the procedure, risks (bleeding, infection, scarring, incomplete diagnosis), benefits, and alternatives. Confirm allergies (lidocaine, latex). Document consent.",
        tips: [
          "Verify the patient has no bleeding disorders or anticoagulant use that may require special planning",
          "Confirm the biopsy site with the patient to avoid wrong-site procedures",
        ],
        warnings: [
          "Never proceed without documented consent",
          "Ask about allergy to local anesthetics — use diphenhydramine as alternative if true amide allergy",
        ],
      },
      {
        order: 2,
        title: "Prepare and clean the biopsy site",
        description:
          "Mark the site if needed. Clean the skin with an antiseptic solution (chlorhexidine or povidone-iodine). Allow to dry. Drape the area with a sterile fenestrated drape if available.",
        tips: [
          "Mark the site before prepping if the lesion may be difficult to see after cleaning",
          "Use chlorhexidine for most sites; avoid on mucosal surfaces",
        ],
        warnings: [
          "Chlorhexidine can cause chemical keratitis — avoid near the eyes",
          "Do not use alcohol-based preps near cautery without allowing complete drying",
        ],
      },
      {
        order: 3,
        title: "Administer local anesthesia",
        description:
          "Inject 1% lidocaine with epinephrine subcutaneously using a 30-gauge needle. Raise a wheal beneath and around the lesion. Wait 5-10 minutes for vasoconstriction if using epinephrine.",
        tips: [
          "Use a small-gauge needle (27-30G) and inject slowly to minimize pain",
          "Buffer lidocaine with sodium bicarbonate (9:1 ratio) to reduce injection pain",
          "Inject from the periphery of the lesion, not through it, to avoid distorting the specimen",
        ],
        warnings: [
          "Maximum dose of lidocaine with epinephrine is 7 mg/kg — calculate for small patients",
          "Epinephrine is safe on digits (digital blocks) per current evidence, but use with caution",
        ],
      },
      {
        order: 4,
        title: "Perform the punch biopsy",
        description:
          "Stabilize and stretch the skin perpendicular to relaxed skin tension lines (RSTL). Apply the punch tool with firm, steady downward pressure using a rotational motion. Advance through the dermis into subcutaneous fat. Remove the punch tool.",
        tips: [
          "Stretch the skin perpendicular to RSTL so the resulting wound is elliptical and closes more easily",
          "Use steady rotation in one direction to avoid shearing the specimen",
          "A 4 mm punch is the standard diagnostic size; 3 mm for cosmetically sensitive areas",
        ],
        warnings: [
          "Ensure the punch reaches subcutaneous fat for a full-thickness specimen",
          "Do not crush the specimen with forceps — gently lift with a needle or fine skin hook",
        ],
      },
      {
        order: 5,
        title: "Achieve hemostasis",
        description:
          "Apply pressure with gauze. If bleeding persists, use aluminum chloride solution (Drysol), Monsel solution (ferric subsulfate), silver nitrate, or electrocautery. Close with a single suture or allow to heal by secondary intention depending on size and location.",
        tips: [
          "For 4 mm punch biopsies, a single suture often provides optimal cosmetic outcome",
          "Aluminum chloride is preferred over Monsel solution when possible, as Monsel can cause tattoo-like pigment deposition",
        ],
        warnings: [
          "Monsel solution can leave permanent pigmentation — avoid on the face",
          "Ensure hemostasis before dressing; patients on anticoagulants may need longer compression",
        ],
      },
      {
        order: 6,
        title: "Apply wound care and dressing",
        description:
          "Apply petrolatum (Vaseline) or antibiotic ointment to the wound. Cover with an adhesive bandage or sterile gauze secured with tape. Provide wound care instructions to the patient.",
        tips: [
          "Plain petrolatum is as effective as topical antibiotics for wound healing and avoids contact sensitization risk",
          "Instruct the patient to keep the wound moist and covered for the first 24-48 hours",
          "Provide written wound care instructions and follow-up plan",
        ],
        warnings: [
          "Neomycin-containing ointments can cause allergic contact dermatitis — plain petrolatum is preferred",
          "Advise the patient to watch for signs of infection: increasing redness, warmth, swelling, or purulent drainage",
        ],
      },
      {
        order: 7,
        title: "Submit specimen to pathology with clinical information",
        description:
          "Place the specimen in formalin (10% neutral buffered formalin for H&E; Michel medium for DIF). Label the container with patient identifiers. Complete the pathology requisition including clinical description, differential diagnosis, and pertinent history.",
        tips: [
          "Always include the clinical differential diagnosis on the requisition — it significantly aids the pathologist",
          "Specify if DIF or special stains are needed; DIF requires Michel medium, not formalin",
          "Note the anatomic site precisely (e.g., 'left lateral forearm, 5 cm distal to antecubital fossa')",
        ],
        warnings: [
          "Placing a DIF specimen in formalin will destroy immunofluorescence — use the correct transport medium",
          "Mislabeled specimens are a critical safety event — verify patient identification on the container and requisition",
        ],
      },
    ],
    explanation:
      "The correct order for a punch biopsy is: (1) informed consent, (2) site preparation, (3) local anesthesia, (4) perform the biopsy, (5) hemostasis, (6) wound care and dressing, (7) specimen submission with clinical information. Each step builds on the previous one, and skipping or reordering can compromise patient safety, specimen quality, or procedural outcome. Consent must always come first. Anesthesia must follow site prep (not precede it) to avoid distorting a cleaned field. The specimen must be properly handled and labeled before the patient leaves.",
    tags: ["punch biopsy", "procedure", "dermatologic surgery", "technique"],
    isActive: true,
    createdAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "sim-ip-bcc-neck-pad",
    title: "Procedure Lab: Punch Biopsy for BCC on the Neck",
    type: "interactive_procedure",
    conditionId: "c0000001-0003-4000-8000-000000000001",
    description:
      "A PAD-backed multi-step procedure sim for selecting equipment, anesthetizing correctly, targeting the lesion, and planning next steps for a likely basal cell carcinoma.",
    objectives: [
      "Choose an appropriately sized diagnostic biopsy tool for suspected BCC",
      "Select safe local anesthesia technique",
      "Target the clinically representative lesional skin rather than adjacent normal skin",
      "Translate a diagnosis-confirming biopsy into definitive follow-up planning",
    ],
    imageAssetId: "40568e5a-4056-4e5a-86f1-6f1f5ae44056",
    difficulty: "intermediate",
    caseStem:
      "PAD metadata: 55-year-old woman with prior skin cancer history and a 6 x 5 mm elevated neck lesion that is itchy, changing, growing, and intermittently bleeding. The lesion has a pearly pink-white appearance with focal erosion.",
    equipmentPrompt:
      "Which biopsy setup is the best diagnostic choice for this suspected basal cell carcinoma?",
    equipmentChoices: [
      {
        id: "bcc-neck-equip-3mm-punch",
        label: "3 mm punch biopsy through the representative pearly portion",
        explanation:
          "Correct. LF notes support 3 mm punch or shave biopsy for suspected BCC when melanoma is not a serious concern. A 3 mm punch samples the lesion with enough tissue for confirmation while limiting morbidity.",
        isCorrect: true,
      },
      {
        id: "bcc-neck-equip-2mm-punch",
        label: "2 mm punch aimed only at the crusted erosion",
        explanation:
          "Too limited. Sampling only the crusted spot risks a less representative specimen and may miss the broader pearly tumour architecture.",
        isCorrect: false,
      },
      {
        id: "bcc-neck-equip-superficial-scrape",
        label: "Superficial scrape of the crust without a true biopsy",
        explanation:
          "Dangerous. This does not provide an adequate diagnostic specimen for skin cancer evaluation.",
        isCorrect: false,
        isDangerous: true,
      },
      {
        id: "bcc-neck-equip-observe",
        label: "Observe only because BCC rarely metastasizes",
        explanation:
          "Dangerous. BCC rarely metastasizes, but untreated lesions can still cause important local destruction and deserve tissue diagnosis.",
        isCorrect: false,
        isDangerous: true,
      },
    ],
    anesthesiaPrompt:
      "How should you anesthetize this lesion before biopsy?",
    anesthesiaChoices: [
      {
        id: "bcc-neck-anes-field",
        label: "Inject 1% lidocaine with epinephrine into normal skin around the lesion",
        explanation:
          "Correct. Infiltrating around rather than through the lesion preserves the specimen and is standard for a small neck biopsy.",
        isCorrect: true,
      },
      {
        id: "bcc-neck-anes-topical",
        label: "Use topical anesthetic only",
        explanation:
          "Insufficient. Topical anesthetic alone is usually not enough for a proper punch biopsy.",
        isCorrect: false,
      },
      {
        id: "bcc-neck-anes-through-lesion",
        label: "Inject directly through the centre of the lesion to mark the target",
        explanation:
          "Dangerous. Injecting through the lesion can distort the biopsy target and compromise the specimen.",
        isCorrect: false,
        isDangerous: true,
      },
      {
        id: "bcc-neck-anes-none",
        label: "Skip anesthesia because the lesion is small",
        explanation:
          "Incorrect. Even small biopsies should be done with proper local anesthesia.",
        isCorrect: false,
      },
    ],
    procedureTargetPrompt:
      "Click the most representative part of the lesion to sample for diagnosis.",
    procedureTargetZones: [
      {
        id: "bcc-neck-ideal",
        label: "Representative lesional skin",
        shape: "circle",
        coordinates: [0.55, 0.57, 0.13],
        quality: "ideal",
        explanation:
          "Ideal. This captures the pearly lesional skin rather than normal surrounding neck or crust alone.",
      },
      {
        id: "bcc-neck-acceptable",
        label: "Broader lesional plaque",
        shape: "circle",
        coordinates: [0.58, 0.46, 0.18],
        quality: "acceptable",
        explanation:
          "Acceptable. This still targets lesional skin, although it is a little less focused than the most representative area.",
      },
      {
        id: "bcc-neck-poor",
        label: "Adjacent normal skin",
        shape: "circle",
        coordinates: [0.29, 0.52, 0.13],
        quality: "poor",
        explanation:
          "Poor. LF notes specifically say normal skin does not need to be included for suspected BCC biopsy.",
      },
      {
        id: "bcc-neck-danger",
        label: "Off-target normal skin",
        shape: "circle",
        coordinates: [0.83, 0.82, 0.1],
        quality: "dangerous",
        explanation:
          "Dangerous. This misses the lesion and would fail to answer the clinical question.",
      },
    ],
    pathologyReport: {
      title: "Educational Pathology Summary",
      specimen: "3 mm punch biopsy, neck lesion",
      diagnosis: "Basal cell carcinoma confirmed",
      findings: [
        "The submitted tissue is diagnostic for basal cell carcinoma.",
        "This educational summary is derived from the known PAD dataset diagnosis rather than an original signed pathology report.",
        "Definitive management still depends on routine pathology details such as subtype and margin status.",
      ],
      limitations:
        "PAD metadata confirms diagnosis but does not include subtype or margin status, so the real-world pathology workflow remains more detailed than this teaching summary.",
    },
    followUpPrompt:
      "What is the best next step after diagnostic confirmation?",
    followUpChoices: [
      {
        id: "bcc-neck-followup-excise",
        label: "Arrange definitive excision and continue skin surveillance",
        explanation:
          "Correct. BCC needs definitive treatment even though metastatic risk is low, and patients with prior skin cancer benefit from ongoing surveillance.",
        isCorrect: true,
      },
      {
        id: "bcc-neck-followup-cryo",
        label: "Treat with cryotherapy only because the lesion is small",
        explanation:
          "Suboptimal. Cryotherapy is not the preferred definitive plan for a biopsy-proven nodular BCC.",
        isCorrect: false,
      },
      {
        id: "bcc-neck-followup-observe",
        label: "Observe since the biopsy already removed enough tissue",
        explanation:
          "Dangerous. Diagnostic sampling is not the same as definitive cancer treatment.",
        isCorrect: false,
        isDangerous: true,
      },
    ],
    procedureChecklistTitle: "Procedure flow",
    procedureSteps: [
      {
        order: 1,
        title: "Mark the target and confirm the history",
        description:
          "Review the lesion features and confirm why tissue diagnosis is needed.",
      },
      {
        order: 2,
        title: "Anesthetize around the lesion",
        description:
          "Use local anesthetic in the surrounding normal skin so the biopsy target remains interpretable.",
      },
      {
        order: 3,
        title: "Take a representative punch specimen",
        description:
          "Sample pearly lesional skin rather than only crust or adjacent normal skin.",
      },
      {
        order: 4,
        title: "Control bleeding and dress the site",
        description:
          "Achieve hemostasis and apply standard wound care after the punch biopsy.",
      },
      {
        order: 5,
        title: "Send tissue with a focused clinical question",
        description:
          "The pathology requisition should clearly state concern for BCC on the neck.",
      },
    ],
    explanation:
      "This procedure lab turns a realistic PAD cancer image into a biopsy-planning workflow. The learner has to pick an appropriately sized tool, preserve specimen quality with correct anesthesia technique, target real lesional skin, and then act on the confirmed diagnosis rather than stopping at tissue sampling.",
    tags: ["procedure lab", "bcc", "pad", "punch biopsy", "skin cancer"],
    isActive: true,
    createdAt: "2026-03-29T00:00:00Z",
  },
  {
    id: "sim-ip-scc-hand-pad",
    title: "Procedure Lab: Diagnostic Biopsy for SCC on the Hand",
    type: "interactive_procedure",
    conditionId: "c0000001-0008-4000-8000-000000000001",
    description:
      "A PAD-backed procedure sim focused on a hyperkeratotic hand lesion suspicious for squamous cell carcinoma.",
    objectives: [
      "Select a practical biopsy size for a raised SCC-suspect lesion",
      "Avoid sampling errors that only remove scale or miss invasive tissue",
      "Recognize that SCC carries a meaningful metastatic risk",
      "Plan definitive treatment after biopsy confirmation",
    ],
    imageAssetId: "ec1b39a3-ec1b-49a3-8173-17388bb3ec1b",
    difficulty: "intermediate",
    caseStem:
      "PAD metadata: 58-year-old woman with a 10 x 8 mm raised dorsal-hand lesion that is itchy, growing, elevated, and biopsy-proven in the dataset as SCC.",
    equipmentPrompt:
      "Which biopsy choice is best for this raised, hyperkeratotic lesion?",
    equipmentChoices: [
      {
        id: "scc-hand-equip-4mm-punch",
        label: "4 mm punch biopsy through the keratotic core and base",
        explanation:
          "Correct. A 4 mm punch gives a practical full-thickness sample for a lesion of this size and morphology.",
        isCorrect: true,
      },
      {
        id: "scc-hand-equip-2mm-punch",
        label: "2 mm punch from the surface only",
        explanation:
          "Too limited. A very small superficial sample may miss representative invasive tissue.",
        isCorrect: false,
      },
      {
        id: "scc-hand-equip-scrape",
        label: "Scrape away the keratin and reassess later",
        explanation:
          "Dangerous. Removing scale without obtaining tissue delays diagnosis of a skin cancer.",
        isCorrect: false,
        isDangerous: true,
      },
      {
        id: "scc-hand-equip-observe",
        label: "Observe because it could still just be actinic damage",
        explanation:
          "Dangerous. This lesion is too raised and concerning to leave without tissue diagnosis.",
        isCorrect: false,
        isDangerous: true,
      },
    ],
    anesthesiaPrompt:
      "What is the safest anesthesia strategy before the biopsy?",
    anesthesiaChoices: [
      {
        id: "scc-hand-anes-field",
        label: "Inject local anesthetic into normal skin around the lesion",
        explanation:
          "Correct. Field anesthesia preserves the lesion architecture and keeps the specimen interpretable.",
        isCorrect: true,
      },
      {
        id: "scc-hand-anes-topical",
        label: "Use topical anesthetic only",
        explanation:
          "Insufficient. Topical anesthetic is not adequate for a proper punch biopsy on the hand.",
        isCorrect: false,
      },
      {
        id: "scc-hand-anes-through-lesion",
        label: "Inject directly into the centre of the lesion",
        explanation:
          "Dangerous. That distorts the tissue you are trying to diagnose.",
        isCorrect: false,
        isDangerous: true,
      },
    ],
    procedureTargetPrompt:
      "Click the part of the lesion that should be sampled for diagnosis.",
    procedureTargetZones: [
      {
        id: "scc-hand-ideal",
        label: "Keratotic lesional core",
        shape: "circle",
        coordinates: [0.5, 0.54, 0.14],
        quality: "ideal",
        explanation:
          "Ideal. This captures the hyperkeratotic lesional tissue and underlying base.",
      },
      {
        id: "scc-hand-acceptable",
        label: "Broader raised lesion",
        shape: "rect",
        coordinates: [0.34, 0.36, 0.34, 0.36],
        quality: "acceptable",
        explanation:
          "Acceptable. This still targets the lesion, even if not centered on the most representative core.",
      },
      {
        id: "scc-hand-poor",
        label: "Marker ink only",
        shape: "circle",
        coordinates: [0.55, 0.23, 0.12],
        quality: "poor",
        explanation:
          "Poor. This targets surface marker ink and surrounding skin rather than the lesion itself.",
      },
      {
        id: "scc-hand-danger",
        label: "Normal skin away from the lesion",
        shape: "circle",
        coordinates: [0.16, 0.8, 0.12],
        quality: "dangerous",
        explanation:
          "Dangerous. Missing the lesion entirely would fail to diagnose a potentially invasive SCC.",
      },
    ],
    pathologyReport: {
      title: "Educational Pathology Summary",
      specimen: "Punch biopsy, dorsal hand lesion",
      diagnosis: "Squamous cell carcinoma confirmed",
      findings: [
        "The teaching summary confirms SCC based on the linked PAD diagnosis.",
        "Clinical management should proceed as for a biopsy-proven keratinocyte malignancy rather than a premalignant AK.",
        "SCC carries a meaningful metastatic risk compared with BCC, so definitive treatment matters.",
      ],
      limitations:
        "The original PAD metadata does not provide differentiation grade, depth, or perineural status.",
    },
    followUpPrompt:
      "Once diagnostic biopsy confirms SCC, what is the best next step?",
    followUpChoices: [
      {
        id: "scc-hand-followup-excision",
        label: "Arrange definitive excision and assess for high-risk features",
        explanation:
          "Correct. SCC requires definitive treatment, and high-risk features change surveillance and referral decisions.",
        isCorrect: true,
      },
      {
        id: "scc-hand-followup-steroid",
        label: "Treat with topical steroids and recheck later",
        explanation:
          "Incorrect. Steroids do not treat SCC.",
        isCorrect: false,
      },
      {
        id: "scc-hand-followup-observe",
        label: "Observe because biopsy already debulked the lesion",
        explanation:
          "Dangerous. Partial diagnostic removal is not definitive SCC treatment.",
        isCorrect: false,
        isDangerous: true,
      },
    ],
    procedureChecklistTitle: "Procedure flow",
    procedureSteps: [
      {
        order: 1,
        title: "Confirm that the lesion is invasive-looking",
        description:
          "Raised, crusted, hyperkeratotic morphology should lower the threshold for tissue diagnosis.",
      },
      {
        order: 2,
        title: "Anesthetize around rather than through the lesion",
        description:
          "This protects specimen quality and keeps the target stable.",
      },
      {
        order: 3,
        title: "Sample the representative lesional tissue",
        description:
          "Do not remove scale only; capture tissue that answers the SCC question.",
      },
      {
        order: 4,
        title: "Control bleeding on the hand carefully",
        description:
          "Hand biopsies require deliberate hemostasis and dressing because the site is mobile and functional.",
      },
      {
        order: 5,
        title: "Send clear clinical context to pathology",
        description:
          "Include concern for SCC so the pathology team understands the level of suspicion.",
      },
    ],
    explanation:
      "The point of this sim is not just to name SCC. It trains the learner to respect invasive morphology, choose a usable biopsy size, avoid superficial sampling errors, and convert a positive biopsy into definitive next-step planning.",
    tags: ["procedure lab", "scc", "pad", "hand", "punch biopsy"],
    isActive: true,
    createdAt: "2026-03-29T00:00:00Z",
  },
  {
    id: "sim-ip-melanoma-back-pad",
    title: "Procedure Lab: Excisional Biopsy for Melanoma on the Back",
    type: "interactive_procedure",
    conditionId: "c0000001-0004-4000-8000-000000000001",
    description:
      "A PAD-backed melanoma procedure sim that teaches excisional biopsy planning, lesion targeting, and escalation after a malignancy-confirming result.",
    objectives: [
      "Choose excisional biopsy rather than shave or core techniques for suspected melanoma",
      "Use anesthesia technique that does not distort a pigmented lesion",
      "Identify the actual lesion requiring complete sampling",
      "Plan referral for definitive excision and staging when the dataset cannot provide full pathologic staging detail",
    ],
    imageAssetId: "b0d107f1-b0d1-47f1-80db-0db5c56db0d1",
    difficulty: "advanced",
    caseStem:
      "PAD metadata: 78-year-old man with a 10 x 10 mm elevated pigmented lesion on the back that has grown and changed. The dataset diagnosis is melanoma.",
    equipmentPrompt:
      "Which procedural setup is the best diagnostic choice for this pigmented lesion?",
    equipmentChoices: [
      {
        id: "mel-back-equip-excision",
        label: "Elliptical excisional biopsy with a #15 blade and narrow clinical margins",
        explanation:
          "Correct. LF notes emphasize excisional biopsy for melanocytic lesions so the full specimen can be assessed rather than partially sampled.",
        isCorrect: true,
      },
      {
        id: "mel-back-equip-punch",
        label: "4 mm punch biopsy through the darkest focus",
        explanation:
          "Not ideal. Partial sampling risks incomplete assessment of the lesion.",
        isCorrect: false,
      },
      {
        id: "mel-back-equip-shave",
        label: "Superficial shave biopsy",
        explanation:
          "Dangerous. LF notes explicitly warn not to shave a lesion when melanoma is a serious concern.",
        isCorrect: false,
        isDangerous: true,
      },
      {
        id: "mel-back-equip-core",
        label: "Core needle biopsy",
        explanation:
          "Dangerous. A core biopsy is not the correct dermatologic diagnostic approach here.",
        isCorrect: false,
        isDangerous: true,
      },
    ],
    anesthesiaPrompt:
      "How should you anesthetize the area before excisional biopsy?",
    anesthesiaChoices: [
      {
        id: "mel-back-anes-field",
        label: "Inject buffered local anesthetic around the lesion, not through it",
        explanation:
          "Correct. Surrounding the lesion with local anesthetic maintains the specimen architecture.",
        isCorrect: true,
      },
      {
        id: "mel-back-anes-center",
        label: "Inject directly through the pigmented centre to center your incision",
        explanation:
          "Dangerous. Injecting through the lesion distorts the specimen.",
        isCorrect: false,
        isDangerous: true,
      },
      {
        id: "mel-back-anes-topical",
        label: "Use topical anesthetic only",
        explanation:
          "Insufficient. Excisional biopsy requires proper local infiltration.",
        isCorrect: false,
      },
    ],
    procedureTargetPrompt:
      "Click the pigmented lesion that needs complete excisional sampling.",
    procedureTargetZones: [
      {
        id: "mel-back-ideal",
        label: "Pigmented melanoma lesion",
        shape: "rect",
        coordinates: [0.42, 0.36, 0.18, 0.18],
        quality: "ideal",
        explanation:
          "Ideal. This captures the melanoma itself, which is the lesion that must be fully sampled.",
      },
      {
        id: "mel-back-acceptable",
        label: "Broader lesion region",
        shape: "rect",
        coordinates: [0.37, 0.31, 0.28, 0.28],
        quality: "acceptable",
        explanation:
          "Acceptable. You still identified the lesion to be excised.",
      },
      {
        id: "mel-back-poor",
        label: "Nearby uninvolved skin",
        shape: "circle",
        coordinates: [0.75, 0.76, 0.08],
        quality: "poor",
        explanation:
          "Poor. This misses the lesion and would not answer the melanoma question.",
      },
      {
        id: "mel-back-danger",
        label: "Remote normal skin",
        shape: "circle",
        coordinates: [0.16, 0.16, 0.08],
        quality: "dangerous",
        explanation:
          "Dangerous. A remote-site sample would completely miss a lesion with malignant potential.",
      },
    ],
    pathologyReport: {
      title: "Educational Pathology Summary",
      specimen: "Excisional biopsy, pigmented back lesion",
      diagnosis: "Melanoma confirmed",
      findings: [
        "The teaching summary confirms melanoma using the linked PAD diagnosis.",
        "The lesion must now move into definitive melanoma management rather than office-level observation.",
        "Real-world staging still depends on pathology elements such as Breslow depth and ulceration that are not present in the PAD metadata.",
      ],
      limitations:
        "This module intentionally avoids inventing Breslow depth, ulceration status, or margin status because the PAD dataset does not supply those fields.",
    },
    followUpPrompt:
      "What is the best next step after diagnostic confirmation?",
    followUpChoices: [
      {
        id: "mel-back-followup-refer",
        label: "Refer for wide local excision and melanoma staging planning",
        explanation:
          "Correct. Confirmed melanoma should move to definitive excision and staging once the full pathology details are available.",
        isCorrect: true,
      },
      {
        id: "mel-back-followup-cryo",
        label: "Treat with cryotherapy because the lesion has already been sampled",
        explanation:
          "Dangerous. Cryotherapy is not melanoma treatment.",
        isCorrect: false,
        isDangerous: true,
      },
      {
        id: "mel-back-followup-observe",
        label: "Routine surveillance only in 12 months",
        explanation:
          "Dangerous. A confirmed melanoma needs urgent definitive management, not delayed observation.",
        isCorrect: false,
        isDangerous: true,
      },
    ],
    procedureChecklistTitle: "Procedure flow",
    procedureSteps: [
      {
        order: 1,
        title: "Identify the lesion that needs complete sampling",
        description:
          "For melanoma-suspicious lesions, the goal is complete diagnostic excision rather than partial tissue alone.",
      },
      {
        order: 2,
        title: "Anesthetize around the lesion",
        description:
          "Maintain specimen fidelity by avoiding direct injection through the pigmented lesion.",
      },
      {
        order: 3,
        title: "Perform narrow-margin excision",
        description:
          "The specimen must allow full histopathologic interpretation, not just a surface diagnosis.",
      },
      {
        order: 4,
        title: "Orient and submit the specimen carefully",
        description:
          "Clear requisition language supports accurate melanoma pathology review.",
      },
      {
        order: 5,
        title: "Escalate to melanoma management",
        description:
          "Once melanoma is confirmed, the learner should think in terms of wide excision and staging, not office observation.",
      },
    ],
    explanation:
      "This procedure lab uses a real PAD melanoma image to reinforce the single most important procedural principle in the LF notes: suspicious melanocytic lesions should be excised for diagnosis rather than shaved. The pathology stage is intentionally conservative about details the dataset cannot prove.",
    tags: ["procedure lab", "melanoma", "pad", "excisional biopsy", "skin cancer"],
    isActive: true,
    createdAt: "2026-03-29T00:00:00Z",
  },
  {
    id: "sim-bc-melanoma-thigh-pad",
    title: "Ulcerated Pigmented Nodule on the Thigh",
    type: "biopsy_choice",
    conditionId: "melanoma",
    imageAssetId: "a0000001-0004-4000-8000-000000000002",
    description:
      "A PAD-backed melanoma variant that reinforces excisional biopsy when the lesion is raised, dark, and ulcerated.",
    objectives: [
      "Recognize that nodular or ulcerated melanoma-pattern lesions still require full-thickness diagnostic excision",
      "Avoid shave biopsy when melanoma staging information matters",
      "Understand why partial sampling can understate an aggressive pigmented lesion",
    ],
    difficulty: "advanced",
    caseStem:
      "A 63-year-old man presents with a dark, dome-shaped lesion on the lateral thigh that has enlarged over several months and now bleeds after minor friction. The lesion is asymmetric, deeply pigmented, and focally ulcerated. The linked PAD image is labeled melanoma.",
    correctChoice: "excisional",
    choiceOptions: [
      {
        id: "bc-mel-thigh-excision",
        label: "Elliptical excisional biopsy with narrow clinical margins",
        explanation:
          "Correct. Even when a melanoma-pattern lesion is raised or ulcerated, the preferred diagnostic approach is complete excisional biopsy with narrow clinical margins so the full lesion can be assessed histologically.",
        isCorrect: true,
      },
      {
        id: "bc-mel-thigh-punch",
        label: "4 mm punch biopsy through the darkest or most raised focus",
        explanation:
          "Acceptable only if complete excision is impractical. Partial sampling risks missing the deepest focus of invasion and may understate the lesion's true stage.",
        isCorrect: false,
      },
      {
        id: "bc-mel-thigh-shave",
        label: "Superficial shave biopsy",
        explanation:
          "Dangerous. Shave biopsy may transect a melanoma and prevent accurate assessment of depth, which directly affects staging and definitive treatment planning.",
        isCorrect: false,
        isDangerous: true,
      },
      {
        id: "bc-mel-thigh-observe",
        label: "Clinical photography and short-interval follow-up",
        explanation:
          "Dangerous. Evolution, elevation, and ulceration are not findings to observe passively when melanoma is in the differential.",
        isCorrect: false,
        isDangerous: true,
      },
    ],
    explanation:
      "This melanoma module broadens the image exposure beyond a flat irregular macule and reinforces that nodular or ulcerated morphology does not change the core principle: if melanoma is a serious concern, obtain a full-thickness excisional specimen whenever feasible.",
    tags: ["melanoma", "pad", "biopsy technique", "nodular melanoma"],
    isActive: true,
    createdAt: "2026-03-29T00:00:00Z",
  },
  {
    id: "sim-bc-bcc-trunk-scin",
    title: "Superficial BCC Plaque on the Trunk",
    type: "biopsy_choice",
    conditionId: "basal-cell-carcinoma",
    imageAssetId: "a0000001-0003-4000-8000-000000000002",
    description:
      "A SCIN-backed superficial BCC plaque that contrasts low-risk trunk management with the more classic facial nodular BCC workflow.",
    objectives: [
      "Recognize a superficial BCC presentation rather than only pearly nodular facial BCC",
      "Choose a practical diagnostic biopsy for a thin plaque on a low-risk trunk site",
      "Avoid treating a suspicious nonhealing plaque as eczema without tissue confirmation",
    ],
    difficulty: "intermediate",
    caseStem:
      "A 59-year-old patient presents with a slowly enlarging pink-red scaly plaque on the trunk that has persisted for months despite emollients. The lesion has a thin pearly thread-like border and mild surface scale, suggesting superficial basal cell carcinoma.",
    correctChoice: "deep-shave",
    choiceOptions: [
      {
        id: "bc-bcc-trunk-shave",
        label: "Deep shave or saucerization biopsy of the plaque",
        explanation:
          "Correct. For a superficial BCC-suspect plaque on a low-risk trunk site, a deep shave or saucerization biopsy is a practical diagnostic technique that usually captures the epidermal and superficial dermal component well.",
        isCorrect: true,
      },
      {
        id: "bc-bcc-trunk-punch",
        label: "Punch biopsy from the active edge",
        explanation:
          "Reasonable but not ideal. Punch biopsy can diagnose BCC, but a narrow punch may undersample the broader superficial plaque compared with a shave specimen.",
        isCorrect: false,
      },
      {
        id: "bc-bcc-trunk-excision",
        label: "Full excisional biopsy with wide margins right away",
        explanation:
          "Usually more than is needed as an initial diagnostic step for a small superficial plaque on the trunk. Tissue diagnosis first is often sufficient before definitive treatment planning.",
        isCorrect: false,
      },
      {
        id: "bc-bcc-trunk-steroid",
        label: "Treat empirically as eczema with topical steroids first",
        explanation:
          "Dangerous. A chronic enlarging plaque with a pearly border should not be managed as inflammatory dermatitis without considering skin cancer.",
        isCorrect: false,
        isDangerous: true,
      },
    ],
    explanation:
      "This module teaches a different BCC morphology and site context from the nasal nodular case. Low-risk trunk plaques often allow pragmatic shave-based diagnosis, but they still require tissue confirmation rather than reflex treatment as dermatitis.",
    tags: ["bcc", "superficial bcc", "scin", "trunk lesion"],
    isActive: true,
    createdAt: "2026-03-29T00:00:00Z",
  },
];
