import type { CaseModule } from "@/lib/domain/schemas";

export const cases: CaseModule[] = [
  // ─── Case 1: Psoriasis ────────────────────────────────────────────────────
  {
    id: "case-psoriasis-adult",
    title: "Scaly Plaques on the Elbows and Knees",
    conditionId: "c0000001-0001-4000-8000-000000000001",
    patientSummary:
      "A 42-year-old man presents with a 6-month history of progressively enlarging, itchy, scaly patches on both elbows and knees. No significant past medical history.",
    clinicalHistory:
      "The patient first noticed small red spots on his elbows about 6 months ago. They have gradually enlarged into larger, scaly patches. He now has similar lesions on both knees and his lower back. The rash is mildly itchy, especially after showering. He recently started a new stressful job. No history of skin conditions, but his father had 'some kind of skin problem.' He denies joint pain or stiffness. OTC hydrocortisone cream has provided minimal improvement.",
    examFindings:
      "Well-demarcated, symmetrically distributed erythematous plaques with thick, adherent silvery-white (micaceous) scale on bilateral elbows, bilateral knees, and the lumbosacral area. Approximately 5% BSA involved. Auspitz sign is positive (pinpoint bleeding on scale removal). Nails show pitting (8-10 pits per thumbnail). No joint swelling or tenderness. No mucosal involvement.",
    imageAssetIds: ["a0000001-0001-4000-8000-000000000001"],
    estimatedMinutes: 12,
    tags: ["papulosquamous", "psoriasis", "topical-therapy"],
    difficulty: "intermediate",
    questions: [
      {
        id: "case-pso-q1",
        type: "single_select",
        stem: "Based on the clinical presentation, what is the most likely diagnosis?",
        context:
          "Consider the morphology, distribution, and patient demographics.",
        answers: [
          {
            id: "a",
            text: "Plaque psoriasis",
            isCorrect: true,
            explanation:
              "Correct. Well-demarcated erythematous plaques with thick silvery scale on extensor surfaces, positive Auspitz sign, and nail pitting is classic for plaque psoriasis.",
          },
          {
            id: "b",
            text: "Atopic dermatitis",
            isCorrect: false,
            explanation:
              "Incorrect. Atopic dermatitis has poorly demarcated patches in flexural areas with fine scale. Thick silvery scale and Auspitz sign are not features of eczema.",
          },
          {
            id: "c",
            text: "Tinea corporis",
            isCorrect: false,
            explanation:
              "Incorrect. Tinea corporis presents with annular lesions with central clearing and a raised scaly border. It is usually asymmetric.",
          },
          {
            id: "d",
            text: "Nummular eczema",
            isCorrect: false,
            explanation:
              "Incorrect. Nummular eczema produces coin-shaped, vesicular or crusted plaques but lacks micaceous scale and Auspitz sign.",
          },
        ],
      },
      {
        id: "case-pso-q2",
        type: "multi_select",
        stem: "Which examination findings support the diagnosis of psoriasis? (Select all that apply)",
        answers: [
          {
            id: "a",
            text: "Positive Auspitz sign",
            isCorrect: true,
            explanation:
              "Correct. Pinpoint bleeding upon scale removal from elongated dermal papillae with dilated capillaries.",
          },
          {
            id: "b",
            text: "Nail pitting",
            isCorrect: true,
            explanation:
              "Correct. Nail pitting from focal parakeratosis of the proximal nail matrix, seen in ~50% of psoriasis patients.",
          },
          {
            id: "c",
            text: "Symmetric distribution on extensor surfaces",
            isCorrect: true,
            explanation:
              "Correct. Symmetric involvement of elbows and knees is the classic distribution of plaque psoriasis.",
          },
          {
            id: "d",
            text: "Dennie-Morgan folds under the eyes",
            isCorrect: false,
            explanation:
              "Incorrect. Dennie-Morgan folds are associated with atopic dermatitis, not psoriasis.",
          },
          {
            id: "e",
            text: "Dermographism",
            isCorrect: false,
            explanation:
              "Incorrect. Dermographism is associated with physical urticaria. Psoriasis demonstrates Koebner phenomenon instead.",
          },
        ],
      },
      {
        id: "case-pso-q3",
        type: "differential_rank",
        stem: "Rank the following differential diagnoses from most likely to least likely.",
        answers: [
          {
            id: "a",
            text: "Plaque psoriasis",
            isCorrect: true,
            explanation:
              "Most likely. Classic presentation with all hallmark features.",
          },
          {
            id: "b",
            text: "Seborrheic dermatitis",
            isCorrect: true,
            explanation:
              "Possible but less likely. Favors scalp, face, and chest with greasy scale and lacks nail pitting.",
          },
          {
            id: "c",
            text: "Mycosis fungoides (CTCL)",
            isCorrect: true,
            explanation:
              "Unlikely. Typically asymmetric with variable morphology, favoring sun-protected areas.",
          },
          {
            id: "d",
            text: "Secondary syphilis",
            isCorrect: true,
            explanation:
              "Least likely. Would include palmoplantar involvement, lymphadenopathy, and systemic symptoms.",
          },
        ],
        correctOrder: ["a", "b", "c", "d"],
      },
      {
        id: "case-pso-q4",
        type: "single_select",
        stem: "With ~5% BSA involvement, what is the most appropriate initial treatment?",
        answers: [
          {
            id: "a",
            text: "Potent topical corticosteroid (betamethasone dipropionate) combined with calcipotriol",
            isCorrect: true,
            explanation:
              "Correct. For mild-to-moderate psoriasis (<10% BSA), combination topical therapy is first-line and synergistic.",
          },
          {
            id: "b",
            text: "Start a biologic agent (adalimumab)",
            isCorrect: false,
            explanation:
              "Incorrect. Biologics are for moderate-to-severe disease (>10% BSA) that has not responded to topical therapy.",
          },
          {
            id: "c",
            text: "Oral methotrexate",
            isCorrect: false,
            explanation:
              "Incorrect. Systemic agents are for moderate-to-severe disease. Topical therapy should be tried first.",
          },
          {
            id: "d",
            text: "Over-the-counter hydrocortisone 1% cream",
            isCorrect: false,
            explanation:
              "Incorrect. Low-potency hydrocortisone is insufficient for thick psoriatic plaques on elbows/knees.",
          },
        ],
      },
      {
        id: "case-pso-q5",
        type: "multi_select",
        stem: "Which comorbidities should be screened for? (Select all that apply)",
        answers: [
          {
            id: "a",
            text: "Psoriatic arthritis",
            isCorrect: true,
            explanation:
              "Correct. PsA occurs in ~30% of psoriasis patients. Nail involvement is a predictor.",
          },
          {
            id: "b",
            text: "Cardiovascular disease risk factors",
            isCorrect: true,
            explanation:
              "Correct. Psoriasis is an independent CV risk factor. Screen for metabolic syndrome.",
          },
          {
            id: "c",
            text: "Depression and anxiety",
            isCorrect: true,
            explanation:
              "Correct. Psoriasis has significant psychosocial burden with higher rates of depression.",
          },
          {
            id: "d",
            text: "Celiac disease",
            isCorrect: false,
            explanation:
              "Incorrect. Celiac disease is associated with dermatitis herpetiformis, not psoriasis.",
          },
        ],
      },
    ],
  },

  // ─── Case 2: Suspected Melanoma ───────────────────────────────────────────
  {
    id: "case-melanoma-changing-mole",
    title: "A Changing Mole on the Back",
    conditionId: "c0000001-0004-4000-8000-000000000001",
    patientSummary:
      "A 68-year-old man presents because his wife noticed a mole on his upper back that has been getting darker and bigger over several months.",
    clinicalHistory:
      "The patient's wife noticed the lesion about 4 months ago and says it has become darker and larger. He has significant recreational and occupational sun exposure with multiple blistering sunburns in his youth. Fair skin, blue eyes. No personal history of skin cancer, but his brother was treated for melanoma 5 years ago. Takes lisinopril and daily aspirin. No prior skin examinations.",
    examFindings:
      "Right upper back: asymmetric, irregularly bordered pigmented macule with focal papular component, 14 x 10 mm. Color variegation: dark brown, light brown, blue-black, and a central pinkish-white zone suggesting regression. Borders are notched and scalloped. Ugly duckling sign positive. Multiple benign nevi and solar lentigines on trunk. No palpable lymphadenopathy.",
    imageAssetIds: ["a0000001-0004-4000-8000-000000000001"],
    estimatedMinutes: 15,
    tags: ["skin-cancer", "melanoma", "biopsy", "staging"],
    difficulty: "advanced",
    questions: [
      {
        id: "case-mel-q1",
        type: "multi_select",
        stem: "Which ABCDE features are present? (Select all that apply)",
        answers: [
          {
            id: "a",
            text: "A - Asymmetry",
            isCorrect: true,
            explanation: "Correct. The lesion is asymmetric.",
          },
          {
            id: "b",
            text: "B - Border irregularity",
            isCorrect: true,
            explanation: "Correct. Notched and scalloped borders.",
          },
          {
            id: "c",
            text: "C - Color variation",
            isCorrect: true,
            explanation:
              "Correct. Multiple colors: dark brown, light brown, blue-black, pink/white.",
          },
          {
            id: "d",
            text: "D - Diameter >6 mm",
            isCorrect: true,
            explanation: "Correct. At 14 mm, exceeds the 6 mm cutoff.",
          },
          {
            id: "e",
            text: "E - Evolution",
            isCorrect: true,
            explanation:
              "Correct. Changing in size and color over months.",
          },
        ],
      },
      {
        id: "case-mel-q2",
        type: "single_select",
        stem: "What is the most appropriate next step in management?",
        answers: [
          {
            id: "a",
            text: "Excisional biopsy with 1-3 mm margins",
            isCorrect: true,
            explanation:
              "Correct. Excisional biopsy is the gold standard for suspected melanoma, allowing accurate Breslow depth measurement.",
          },
          {
            id: "b",
            text: "Shave biopsy",
            isCorrect: false,
            explanation:
              "Incorrect. Shave biopsy may transect the deepest portion, making Breslow depth measurement impossible.",
          },
          {
            id: "c",
            text: "Dermoscopic monitoring with follow-up in 3 months",
            isCorrect: false,
            explanation:
              "Incorrect. This lesion has multiple high-risk features. Observation is inappropriate.",
          },
          {
            id: "d",
            text: "Wide local excision with 2 cm margins",
            isCorrect: false,
            explanation:
              "Incorrect. Diagnostic biopsy must first determine Breslow depth, which dictates margins.",
          },
        ],
        dangerousAnswers: ["b", "c"],
      },
      {
        id: "case-mel-q3",
        type: "single_select",
        stem: "Biopsy returns: superficial spreading melanoma, Breslow depth 1.8 mm, with ulceration. What excision margin is recommended?",
        answers: [
          {
            id: "a",
            text: "0.5 cm margins",
            isCorrect: false,
            explanation: "Incorrect. 0.5 cm is for melanoma in situ only.",
          },
          {
            id: "b",
            text: "1 cm margins",
            isCorrect: false,
            explanation:
              "Incorrect. 1 cm is for melanomas <=1 mm Breslow depth.",
          },
          {
            id: "c",
            text: "2 cm margins",
            isCorrect: true,
            explanation:
              "Correct. 2 cm margins are recommended for melanomas 1.01-2.0 mm Breslow depth.",
          },
          {
            id: "d",
            text: "3 cm margins",
            isCorrect: false,
            explanation:
              "Incorrect. 3 cm margins are no longer recommended. No survival benefit beyond 2 cm.",
          },
        ],
      },
      {
        id: "case-mel-q4",
        type: "single_select",
        stem: "Should sentinel lymph node biopsy (SLNB) be performed?",
        answers: [
          {
            id: "a",
            text: "Yes - SLNB is recommended for melanomas >0.8 mm or with ulceration",
            isCorrect: true,
            explanation:
              "Correct. This patient meets both criteria (1.8 mm + ulceration). SLNB is the most important prognostic staging tool.",
          },
          {
            id: "b",
            text: "No - SLNB is only for melanomas >4 mm",
            isCorrect: false,
            explanation:
              "Incorrect. Threshold is >0.8 mm or ulceration, not >4 mm.",
          },
          {
            id: "c",
            text: "No - SLNB is only useful for SCC",
            isCorrect: false,
            explanation:
              "Incorrect. SLNB is a well-established staging procedure for melanoma.",
          },
          {
            id: "d",
            text: "Only if lymph nodes are clinically palpable",
            isCorrect: false,
            explanation:
              "Incorrect. Palpable suspicious nodes need therapeutic dissection, not SLNB.",
          },
        ],
      },
    ],
  },

  // ─── Case 3: Contact Dermatitis ───────────────────────────────────────────
  {
    id: "case-contact-derm-occupational",
    title: "Hand Rash in a Healthcare Worker",
    conditionId: "c0000001-0006-4000-8000-000000000001",
    patientSummary:
      "A 34-year-old female nurse presents with a 3-week history of an itchy, blistering rash on both hands that has been worsening despite moisturizers.",
    clinicalHistory:
      "ICU nurse who noticed redness and itching on dorsal hands 3 weeks ago. Small blisters appeared last week with weeping. Intensely pruritic, worse at work and hours after shifts. Wears powdered latex gloves 8+ hours daily, changing 20-30 times/day. No history of eczema or atopy. Transferred from another hospital 2 months ago (previously used nitrile gloves). No new soaps or personal care products.",
    examFindings:
      "Bilateral dorsal hands and fingers: erythematous patches and thin plaques with scattered vesicles, serous weeping, and crusting. Sharply demarcated cutoff at both wrists at the glove line. Palms relatively spared with mild erythema. Interdigital web spaces mildly involved. No rash elsewhere. No stigmata of atopy.",
    imageAssetIds: ["a0000001-0006-4000-8000-000000000001"],
    estimatedMinutes: 10,
    tags: ["eczematous", "contact-dermatitis", "occupational"],
    difficulty: "intermediate",
    questions: [
      {
        id: "case-cd-q1",
        type: "single_select",
        stem: "What is the single most important diagnostic clue?",
        answers: [
          {
            id: "a",
            text: "The sharp cutoff at the wrists corresponding to glove edges",
            isCorrect: true,
            explanation:
              "Correct. A geometric distribution matching a contactant is the key clue for contact dermatitis.",
          },
          {
            id: "b",
            text: "The presence of vesicles",
            isCorrect: false,
            explanation:
              "Incorrect. Vesicles are nonspecific and occur in many eczematous conditions.",
          },
          {
            id: "c",
            text: "Bilateral involvement",
            isCorrect: false,
            explanation:
              "Incorrect. Bilateral hand involvement is nonspecific.",
          },
          {
            id: "d",
            text: "The intense pruritus",
            isCorrect: false,
            explanation: "Incorrect. Pruritus is nonspecific.",
          },
        ],
      },
      {
        id: "case-cd-q2",
        type: "single_select",
        stem: "What is the most likely specific diagnosis and allergen?",
        answers: [
          {
            id: "a",
            text: "ACD to latex proteins",
            isCorrect: false,
            explanation:
              "Incorrect. Type I latex allergy causes urticaria/anaphylaxis, not delayed eczematous dermatitis.",
          },
          {
            id: "b",
            text: "ACD to rubber accelerators (thiurams, carbamates)",
            isCorrect: true,
            explanation:
              "Correct. The delayed eczematous eruption in a glove pattern points to rubber chemical accelerators (Type IV hypersensitivity).",
          },
          {
            id: "c",
            text: "Irritant contact dermatitis from handwashing",
            isCorrect: false,
            explanation:
              "Incorrect. ICD from handwashing would be diffuse (affecting palms too) without a sharp glove-line cutoff.",
          },
          {
            id: "d",
            text: "ACD to glove powder (cornstarch)",
            isCorrect: false,
            explanation:
              "Incorrect. Cornstarch powder is not a common contact allergen.",
          },
        ],
      },
      {
        id: "case-cd-q3",
        type: "ordered_steps",
        stem: "Arrange these management steps in the correct order of priority.",
        answers: [
          {
            id: "a",
            text: "Switch from latex to accelerator-free nitrile or vinyl gloves",
            isCorrect: true,
            explanation:
              "Most important: remove the causative exposure immediately.",
          },
          {
            id: "b",
            text: "Apply potent topical corticosteroid (clobetasol ointment) to affected areas",
            isCorrect: true,
            explanation:
              "Treat the active eruption with potent TCS appropriate for hands.",
          },
          {
            id: "c",
            text: "Refer for patch testing to identify the specific allergen",
            isCorrect: true,
            explanation:
              "Confirm the diagnosis and identify the specific rubber chemical.",
          },
          {
            id: "d",
            text: "File occupational health report and request workplace accommodation",
            isCorrect: true,
            explanation:
              "Document the occupational nature for accommodation and compensation.",
          },
        ],
        correctOrder: ["a", "b", "c", "d"],
      },
    ],
  },

  // ─── Case 4: Herpes Zoster ────────────────────────────────────────────────
  {
    id: "case-zoster-elderly",
    title: "Unilateral Pain and Blisters in an Elderly Patient",
    conditionId: "c0000001-0010-4000-8000-000000000001",
    patientSummary:
      "A 72-year-old woman with a 2-day history of a painful blistering rash on her left flank, preceded by 3 days of burning pain.",
    clinicalHistory:
      "Sharp burning pain on left trunk for 5 days. Initially thought she pulled a muscle. Two days ago, clusters of small blisters appeared. Pain 8/10, burning and shooting with allodynia. History of childhood chickenpox. PMH: hypertension, type 2 diabetes. Takes metformin and amlodipine. No zoster vaccine. Not immunosuppressed. Denies fever, headache, visual symptoms, or ear pain.",
    examFindings:
      "Grouped vesicles and early pustules on erythematous bases in a band along the left T8-T9 dermatome, from posterior midline around the left flank toward anterior midline. Strictly unilateral. Vesicles at various stages: clear, cloudy/pustular, early crusting. Surrounding erythema and mild edema. Exquisitely tender with allodynia. No lesions elsewhere. No facial or nasal vesicles. Cranial nerves intact.",
    imageAssetIds: ["a0000001-0010-4000-8000-000000000001"],
    estimatedMinutes: 12,
    tags: ["infection", "herpes-zoster", "antiviral"],
    difficulty: "intermediate",
    questions: [
      {
        id: "case-hz-q1",
        type: "single_select",
        stem: "What is the diagnosis and causative agent?",
        answers: [
          {
            id: "a",
            text: "Herpes zoster (shingles) caused by reactivation of varicella-zoster virus (VZV)",
            isCorrect: true,
            explanation:
              "Correct. Prodromal pain + grouped vesicles on erythematous bases + unilateral dermatomal distribution is pathognomonic.",
          },
          {
            id: "b",
            text: "Herpes simplex virus (HSV) recurrence",
            isCorrect: false,
            explanation:
              "Incorrect. HSV recurs at the same localized site, not across a full dermatome.",
          },
          {
            id: "c",
            text: "Allergic contact dermatitis",
            isCorrect: false,
            explanation:
              "Incorrect. Contact dermatitis follows contactant patterns, not dermatomes, and lacks neuropathic prodrome.",
          },
          {
            id: "d",
            text: "Bullous impetigo",
            isCorrect: false,
            explanation:
              "Incorrect. Bullous impetigo does not follow dermatomes and lacks neuropathic pain.",
          },
        ],
      },
      {
        id: "case-hz-q2",
        type: "single_select",
        stem: "The rash appeared 2 days ago. What is the most appropriate antiviral treatment?",
        answers: [
          {
            id: "a",
            text: "Valacyclovir 1000 mg three times daily for 7 days",
            isCorrect: true,
            explanation:
              "Correct. Valacyclovir preferred for zoster. We are within 72 hours of rash onset.",
          },
          {
            id: "b",
            text: "Topical acyclovir cream",
            isCorrect: false,
            explanation:
              "Incorrect. Topical acyclovir is NOT effective for herpes zoster. Systemic therapy required.",
          },
          {
            id: "c",
            text: "Too late for antivirals since pain started 5 days ago",
            isCorrect: false,
            explanation:
              "Incorrect. The 72-hour window is from RASH onset (2 days ago), not prodromal pain.",
          },
          {
            id: "d",
            text: "IV acyclovir requiring hospital admission",
            isCorrect: false,
            explanation:
              "Incorrect. IV acyclovir is for immunocompromised, disseminated, or ophthalmic zoster.",
          },
        ],
        dangerousAnswers: ["b", "c"],
      },
      {
        id: "case-hz-q3",
        type: "multi_select",
        stem: "Which findings would constitute red flags requiring urgent action? (Select all that apply)",
        answers: [
          {
            id: "a",
            text: "Vesicles on the tip of the nose (Hutchinson sign)",
            isCorrect: true,
            explanation:
              "Correct. Nasociliary branch involvement with high risk of corneal damage. Urgent ophthalmology referral.",
          },
          {
            id: "b",
            text: ">20 vesicles outside the primary dermatome",
            isCorrect: true,
            explanation:
              "Correct. Disseminated zoster suggests immunocompromise. Requires IV acyclovir.",
          },
          {
            id: "c",
            text: "Facial palsy + ear vesicles + hearing loss (Ramsay Hunt)",
            isCorrect: true,
            explanation:
              "Correct. Requires urgent antivirals +/- corticosteroids to prevent permanent deficits.",
          },
          {
            id: "d",
            text: "Mild pruritus overlying the vesicles",
            isCorrect: false,
            explanation:
              "Incorrect. Mild pruritus is common in zoster and is not a red flag.",
          },
          {
            id: "e",
            text: "Urinary retention",
            isCorrect: true,
            explanation:
              "Correct. S2-S4 zoster can cause neurogenic bladder requiring urgent evaluation.",
          },
        ],
      },
      {
        id: "case-hz-q4",
        type: "single_select",
        stem: "Six weeks after rash resolution, she has persistent severe burning pain. What is this complication and the first-line treatment?",
        answers: [
          {
            id: "a",
            text: "Postherpetic neuralgia; first-line is gabapentin or pregabalin",
            isCorrect: true,
            explanation:
              "Correct. PHN = pain persisting >90 days after rash onset. First-line: gabapentin, pregabalin, TCAs, or topical lidocaine.",
          },
          {
            id: "b",
            text: "Bacterial cellulitis; treat with antibiotics",
            isCorrect: false,
            explanation:
              "Incorrect. Cellulitis shows spreading erythema, not isolated neuropathic pain at a healed site.",
          },
          {
            id: "c",
            text: "Recurrent zoster; another course of valacyclovir",
            isCorrect: false,
            explanation:
              "Incorrect. Rash is resolved. Persistent pain without vesicles = PHN, not recurrence.",
          },
          {
            id: "d",
            text: "Complex regional pain syndrome; refer to pain clinic",
            isCorrect: false,
            explanation:
              "Incorrect. CRPS has autonomic features. PHN is the expected post-zoster complication.",
          },
        ],
      },
    ],
  },

  // ─── Case 5: Pediatric Eczema ─────────────────────────────────────────────
  {
    id: "case-pediatric-eczema",
    title: "Itchy Rash in a 4-Year-Old Child",
    conditionId: "c0000001-0002-4000-8000-000000000001",
    patientSummary:
      "A 4-year-old girl is brought in by her mother for a worsening itchy rash in the creases of her arms and behind her knees, with intermittent rashes since infancy.",
    clinicalHistory:
      "Cradle cap as an infant, cheek eczema since 3 months. Rash shifted to arm/knee creases. Current flare worsening for 2 weeks with winter onset. Scratches constantly, especially at night, disrupting sleep. Mother applies coconut oil. Egg allergy at age 1. Intermittent wheezing with albuterol. Mother has asthma, father has hay fever. Otherwise well with normal growth and development.",
    examFindings:
      "Active, poorly demarcated erythematous patches and plaques with fine scale, numerous excoriations, and early lichenification in bilateral antecubital and popliteal fossae. Scattered excoriated papules on trunk. Generalized xerosis. Dennie-Morgan folds present. Palmar hyperlinearity noted. No honey-colored crusting. No vesicles or punched-out erosions. Normal growth.",
    imageAssetIds: ["a0000001-0002-4000-8000-000000000001"],
    estimatedMinutes: 12,
    tags: ["eczematous", "atopic-dermatitis", "pediatric"],
    difficulty: "beginner",
    questions: [
      {
        id: "case-ped-q1",
        type: "single_select",
        stem: "Which feature best supports the diagnosis of atopic dermatitis?",
        answers: [
          {
            id: "a",
            text: "Atopic triad (eczema + wheezing + food allergy) plus strong family history of atopy",
            isCorrect: true,
            explanation:
              "Correct. The atopic triad with bilateral parent atopy history is the strongest diagnostic support.",
          },
          {
            id: "b",
            text: "The presence of excoriations",
            isCorrect: false,
            explanation:
              "Incorrect. Excoriations indicate pruritus but are nonspecific.",
          },
          {
            id: "c",
            text: "The winter flare",
            isCorrect: false,
            explanation:
              "Partially correct but not the best answer. Many conditions worsen in dry cold weather.",
          },
          {
            id: "d",
            text: "The anterior cervical lymphadenopathy",
            isCorrect: false,
            explanation:
              "Incorrect. Reactive lymphadenopathy is nonspecific in children.",
          },
        ],
      },
      {
        id: "case-ped-q2",
        type: "multi_select",
        stem: "Which are minor features (Hanifin-Rajka criteria) of atopic dermatitis? (Select all that apply)",
        answers: [
          {
            id: "a",
            text: "Dennie-Morgan infraorbital folds",
            isCorrect: true,
            explanation:
              "Correct. A minor Hanifin-Rajka criterion.",
          },
          {
            id: "b",
            text: "Palmar hyperlinearity",
            isCorrect: true,
            explanation:
              "Correct. Associated with filaggrin mutations. A minor criterion.",
          },
          {
            id: "c",
            text: "Generalized xerosis",
            isCorrect: true,
            explanation:
              "Correct. Reflects underlying skin barrier dysfunction.",
          },
          {
            id: "d",
            text: "Well-demarcated plaques with silvery scale",
            isCorrect: false,
            explanation:
              "Incorrect. This describes psoriasis, not eczema.",
          },
        ],
      },
      {
        id: "case-ped-q3",
        type: "ordered_steps",
        stem: "Arrange these management steps in order of priority for this flare.",
        answers: [
          {
            id: "a",
            text: "Daily lukewarm baths (10-15 min) + immediate emollient application (soak and seal)",
            isCorrect: true,
            explanation:
              "Barrier repair is the foundation of eczema management.",
          },
          {
            id: "b",
            text: "Medium-potency topical corticosteroid (triamcinolone 0.1% ointment) to active areas BID",
            isCorrect: true,
            explanation:
              "Active flare areas need anti-inflammatory treatment.",
          },
          {
            id: "c",
            text: "Sedating antihistamine (hydroxyzine) at bedtime for sleep",
            isCorrect: true,
            explanation:
              "Sleep disruption significantly impacts quality of life.",
          },
          {
            id: "d",
            text: "Plan transition to tacrolimus for proactive maintenance after flare control",
            isCorrect: true,
            explanation:
              "Steroid-sparing maintenance therapy reduces flare frequency.",
          },
        ],
        correctOrder: ["a", "b", "c", "d"],
      },
      {
        id: "case-ped-q4",
        type: "single_select",
        stem: "Two days later, multiple punched-out erosions with hemorrhagic crusting appear and the child is febrile (39.2C). What complication should you suspect?",
        answers: [
          {
            id: "a",
            text: "Eczema herpeticum - urgent evaluation needed",
            isCorrect: true,
            explanation:
              "Correct. Punched-out erosions + hemorrhagic crusting + fever on eczema = eczema herpeticum (disseminated HSV). Dermatologic emergency.",
          },
          {
            id: "b",
            text: "Secondary bacterial impetigo",
            isCorrect: false,
            explanation:
              "Incorrect. Impetigo produces honey-colored crusting, not punched-out erosions.",
          },
          {
            id: "c",
            text: "Steroid-induced skin atrophy",
            isCorrect: false,
            explanation:
              "Incorrect. Steroid atrophy takes weeks-months, not 2 days.",
          },
          {
            id: "d",
            text: "Normal eczema flare progression",
            isCorrect: false,
            explanation:
              "Incorrect. Punched-out erosions and fever are NOT normal eczema.",
          },
        ],
        dangerousAnswers: ["c", "d"],
      },
    ],
  },

  {
    id: "case-bcc-neck-pad",
    title: "A Pearly Changing Lesion on the Neck",
    conditionId: "c0000001-0003-4000-8000-000000000001",
    patientSummary:
      "A 55-year-old woman with a prior history of skin cancer presents with a 6 x 5 mm elevated neck lesion that has been itching, changing, growing, and intermittently bleeding.",
    clinicalHistory:
      "This dataset-derived case is built from PAD metadata. The patient reports that the neck lesion has become more noticeable over time and occasionally bleeds after minor friction. She has a personal history of skin cancer and fair skin with chronic sun exposure. The lesion is elevated and bothersome, but she denies significant pain.",
    examFindings:
      "On the lateral neck there is a pearly pink plaque-papule with a shiny surface, subtle telangiectatic vessels, and a small focus of crusted erosion. The lesion is elevated and clinically appears larger than the most obvious central erosion alone.",
    imageAssetIds: ["40568e5a-4056-4e5a-86f1-6f1f5ae44056"],
    estimatedMinutes: 9,
    tags: ["skin-cancer", "bcc", "pad", "biopsy"],
    difficulty: "intermediate",
    datasetSourceId: "ds-pad-ufes-20",
    questions: [
      {
        id: "case-bcc-pad-q1",
        type: "single_select",
        stem: "What is the most likely diagnosis?",
        answers: [
          {
            id: "a",
            text: "Basal cell carcinoma",
            isCorrect: true,
            explanation:
              "Correct. A pearly pink lesion with surface telangiectasia, intermittent bleeding, and focal erosion on sun-exposed skin is classic for BCC.",
          },
          {
            id: "b",
            text: "Actinic keratosis",
            isCorrect: false,
            explanation:
              "Incorrect. Actinic keratosis is usually flatter, rougher, and more gritty than this shiny pearly lesion.",
          },
          {
            id: "c",
            text: "Squamous cell carcinoma",
            isCorrect: false,
            explanation:
              "Incorrect. SCC is often firmer, more hyperkeratotic, and less pearly than this lesion.",
          },
          {
            id: "d",
            text: "Seborrheic keratosis",
            isCorrect: false,
            explanation:
              "Incorrect. SK is a stuck-on benign keratosis rather than a pearly, bleeding lesion with telangiectasia.",
          },
        ],
      },
      {
        id: "case-bcc-pad-q2",
        type: "multi_select",
        stem: "Which features make BCC the best fit here? (Select all that apply)",
        answers: [
          {
            id: "a",
            text: "Pearly or shiny appearance",
            isCorrect: true,
            explanation:
              "Correct. LF notes emphasize a pearly or scar-like look as a classic BCC clue.",
          },
          {
            id: "b",
            text: "Surface telangiectasia",
            isCorrect: true,
            explanation:
              "Correct. Dilated vessels within the lesion are a high-yield clinical clue for BCC.",
          },
          {
            id: "c",
            text: "Intermittent bleeding with minor trauma",
            isCorrect: true,
            explanation:
              "Correct. BCC often crusts or bleeds recurrently.",
          },
          {
            id: "d",
            text: "A thick cutaneous horn",
            isCorrect: false,
            explanation:
              "Incorrect. A cutaneous horn is more suggestive of SCC or a hypertrophic actinic keratosis.",
          },
        ],
      },
      {
        id: "case-bcc-pad-q3",
        type: "single_select",
        stem: "What is the most appropriate next diagnostic step?",
        answers: [
          {
            id: "a",
            text: "3 mm punch or shave biopsy of the lesion",
            isCorrect: true,
            explanation:
              "Correct. LF notes state that suspected BCC can be sampled with punch or shave biopsy and does not require normal skin.",
          },
          {
            id: "b",
            text: "Cryotherapy without tissue diagnosis",
            isCorrect: false,
            explanation:
              "Incorrect. Tissue diagnosis is still appropriate before definitive treatment of a suspicious skin cancer.",
          },
          {
            id: "c",
            text: "Excisional biopsy with 2 cm margins",
            isCorrect: false,
            explanation:
              "Incorrect. Wide melanoma-style margins are not the initial step for suspected BCC.",
          },
          {
            id: "d",
            text: "Observation because BCC rarely metastasizes",
            isCorrect: false,
            explanation:
              "Incorrect. BCC almost never metastasizes, but it can cause significant local morbidity if untreated.",
          },
        ],
        dangerousAnswers: ["d"],
      },
      {
        id: "case-bcc-pad-q4",
        type: "single_select",
        stem: "If pathology confirms nodular BCC on the neck, which management plan is most appropriate?",
        answers: [
          {
            id: "a",
            text: "Definitive surgical excision, with Mohs reserved for higher-risk anatomy or recurrent/ill-defined disease",
            isCorrect: true,
            explanation:
              "Correct. Standard excision is appropriate for many neck lesions, while Mohs is especially valuable for tissue-sparing or higher-risk scenarios.",
          },
          {
            id: "b",
            text: "No treatment is needed because BCC is non-metastatic",
            isCorrect: false,
            explanation:
              "Incorrect. BCC still requires treatment to prevent local destruction.",
          },
          {
            id: "c",
            text: "Oral antivirals and repeat review",
            isCorrect: false,
            explanation:
              "Incorrect. This is not a viral lesion.",
          },
          {
            id: "d",
            text: "Start high-potency topical steroids",
            isCorrect: false,
            explanation:
              "Incorrect. Steroids are not a treatment for BCC.",
          },
        ],
      },
    ],
  },

  {
    id: "case-scc-hand-pad",
    title: "A Crusted Growing Lesion on the Dorsal Hand",
    conditionId: "c0000001-0008-4000-8000-000000000001",
    patientSummary:
      "A 58-year-old woman presents with a 10 x 8 mm raised lesion on the dorsal hand that has been growing and itching.",
    clinicalHistory:
      "This PAD-derived case uses dataset metadata plus visible image findings. The lesion is on the hand, has enlarged over time, and remains elevated. She does not report pain or bleeding, but the site is chronically sun exposed and functionally important.",
    examFindings:
      "There is a hyperkeratotic, crusted papule-nodule on the dorsal hand with a central keratinous core and surrounding erythema. The lesion is elevated and clinically concerning for keratinocyte malignancy rather than a flat premalignant patch.",
    imageAssetIds: ["ec1b39a3-ec1b-49a3-8173-17388bb3ec1b"],
    estimatedMinutes: 9,
    tags: ["skin-cancer", "scc", "pad", "hand"],
    difficulty: "intermediate",
    datasetSourceId: "ds-pad-ufes-20",
    questions: [
      {
        id: "case-scc-pad-q1",
        type: "single_select",
        stem: "What is the most likely diagnosis?",
        answers: [
          {
            id: "a",
            text: "Squamous cell carcinoma",
            isCorrect: true,
            explanation:
              "Correct. A growing, elevated, keratotic lesion on sun-exposed skin is classic for cutaneous SCC.",
          },
          {
            id: "b",
            text: "Actinic keratosis",
            isCorrect: false,
            explanation:
              "Incorrect. Actinic keratoses are usually flatter and rougher; this lesion is more nodular and invasive-looking.",
          },
          {
            id: "c",
            text: "Basal cell carcinoma",
            isCorrect: false,
            explanation:
              "Incorrect. BCC is more often pearly and telangiectatic than hyperkeratotic and crusted.",
          },
          {
            id: "d",
            text: "Tinea corporis",
            isCorrect: false,
            explanation:
              "Incorrect. Dermatophyte infection would not create this firm keratotic nodule.",
          },
        ],
      },
      {
        id: "case-scc-pad-q2",
        type: "single_select",
        stem: "Which feature most strongly pushes you away from a routine actinic keratosis and toward SCC?",
        answers: [
          {
            id: "a",
            text: "A firm elevated hyperkeratotic lesion with continued growth",
            isCorrect: true,
            explanation:
              "Correct. LF notes emphasize that SCC is often more indurated, elevated, and faster growing than BCC or AK.",
          },
          {
            id: "b",
            text: "Location on sun-exposed skin",
            isCorrect: false,
            explanation:
              "Incorrect. Both actinic keratosis and SCC occur on sun-exposed skin.",
          },
          {
            id: "c",
            text: "Female sex",
            isCorrect: false,
            explanation:
              "Incorrect. Sex alone is not the key discriminator.",
          },
          {
            id: "d",
            text: "Age older than 50 years",
            isCorrect: false,
            explanation:
              "Incorrect. Age increases risk, but the morphology is the crucial clue.",
          },
        ],
      },
      {
        id: "case-scc-pad-q3",
        type: "single_select",
        stem: "What is the most appropriate diagnostic next step?",
        answers: [
          {
            id: "a",
            text: "Punch or shave biopsy of the lesion",
            isCorrect: true,
            explanation:
              "Correct. LF notes support punch or shave biopsy for suspected SCC without including normal skin.",
          },
          {
            id: "b",
            text: "Topical antifungal therapy",
            isCorrect: false,
            explanation:
              "Incorrect. This is not consistent with a fungal eruption.",
          },
          {
            id: "c",
            text: "Immediate reassurance without tissue",
            isCorrect: false,
            explanation:
              "Incorrect. Tissue diagnosis is needed for a suspicious keratinocyte malignancy.",
          },
          {
            id: "d",
            text: "Shave off only the surface scale and reassess later",
            isCorrect: false,
            explanation:
              "Incorrect. Superficial debridement alone does not establish the diagnosis.",
          },
        ],
      },
      {
        id: "case-scc-pad-q4",
        type: "single_select",
        stem: "Which counseling point is most accurate if the biopsy confirms cutaneous SCC?",
        answers: [
          {
            id: "a",
            text: "SCC has a real metastatic risk, so definitive treatment and follow-up matter",
            isCorrect: true,
            explanation:
              "Correct. LF notes quote an overall metastatic risk around 3-5%, which is clinically meaningful.",
          },
          {
            id: "b",
            text: "SCC almost never metastasizes and can safely be observed",
            isCorrect: false,
            explanation:
              "Incorrect. That statement better fits BCC, not SCC.",
          },
          {
            id: "c",
            text: "All SCCs are treated with oral antifungals",
            isCorrect: false,
            explanation:
              "Incorrect. SCC is a keratinocyte malignancy, not a fungal infection.",
          },
          {
            id: "d",
            text: "Topical steroids are first-line treatment",
            isCorrect: false,
            explanation:
              "Incorrect. Steroids do not treat SCC.",
          },
        ],
      },
    ],
  },

  {
    id: "case-actinic-keratosis-pad",
    title: "A Rough Sun-Damaged Spot on the Nose",
    conditionId: "cond-pad-ack",
    patientSummary:
      "A 77-year-old woman presents with a 6 x 6 mm raised rough lesion on the nose that itches, hurts, and sometimes bleeds.",
    clinicalHistory:
      "This case is derived from PAD metadata. The lesion is on a heavily sun-exposed site and has been noticeable to the patient because of roughness and irritation. She denies a known prior skin cancer history, but the chronic UV exposure pattern makes field damage likely.",
    examFindings:
      "There is a rough erythematous scaly papule on the nose with surrounding photodamage. The lesion is gritty in appearance and remains concerning because painful or bleeding lesions in this setting must still be evaluated carefully for progression toward SCC.",
    imageAssetIds: ["569fe285-569f-4285-89f6-9f670a39569f"],
    estimatedMinutes: 8,
    tags: ["premalignant", "actinic-keratosis", "pad", "sun-damage"],
    difficulty: "beginner",
    datasetSourceId: "ds-pad-ufes-20",
    questions: [
      {
        id: "case-ak-pad-q1",
        type: "single_select",
        stem: "What is the most likely diagnosis?",
        answers: [
          {
            id: "a",
            text: "Actinic keratosis",
            isCorrect: true,
            explanation:
              "Correct. A rough, gritty lesion on a sun-exposed nose in an older patient is classic for actinic keratosis.",
          },
          {
            id: "b",
            text: "Plaque psoriasis",
            isCorrect: false,
            explanation:
              "Incorrect. Psoriasis would not present as an isolated gritty papule on the nose.",
          },
          {
            id: "c",
            text: "Tinea corporis",
            isCorrect: false,
            explanation:
              "Incorrect. Tinea corporis causes annular plaques, not a focal gritty sun-damaged lesion.",
          },
          {
            id: "d",
            text: "Herpes zoster",
            isCorrect: false,
            explanation:
              "Incorrect. Zoster is vesicular and dermatomal.",
          },
        ],
      },
      {
        id: "case-ak-pad-q2",
        type: "single_select",
        stem: "Why is this lesion important even though it is small?",
        answers: [
          {
            id: "a",
            text: "Actinic keratosis is a premalignant lesion on the spectrum toward SCC",
            isCorrect: true,
            explanation:
              "Correct. LF notes explicitly frame AK as a precancerous lesion that can develop into SCC.",
          },
          {
            id: "b",
            text: "It is a fungal infection that always becomes cellulitis",
            isCorrect: false,
            explanation:
              "Incorrect. AK is not infectious.",
          },
          {
            id: "c",
            text: "It is benign and never requires treatment",
            isCorrect: false,
            explanation:
              "Incorrect. Management and surveillance are appropriate because of SCC risk.",
          },
          {
            id: "d",
            text: "It usually means melanoma is already present elsewhere",
            isCorrect: false,
            explanation:
              "Incorrect. AK signals UV damage and SCC risk, not automatic melanoma elsewhere.",
          },
        ],
      },
      {
        id: "case-ak-pad-q3",
        type: "single_select",
        stem: "For a classic isolated AK, which treatment is most appropriate?",
        answers: [
          {
            id: "a",
            text: "Cryotherapy",
            isCorrect: true,
            explanation:
              "Correct. LF notes list cryotherapy as a standard treatment for classic isolated AK.",
          },
          {
            id: "b",
            text: "High-potency topical steroids",
            isCorrect: false,
            explanation:
              "Incorrect. Steroids do not treat AK.",
          },
          {
            id: "c",
            text: "Oral antifungals",
            isCorrect: false,
            explanation:
              "Incorrect. This is not a fungal process.",
          },
          {
            id: "d",
            text: "Immediate wide local excision with melanoma margins",
            isCorrect: false,
            explanation:
              "Incorrect. That is excessive for a classic isolated AK.",
          },
        ],
      },
      {
        id: "case-ak-pad-q4",
        type: "multi_select",
        stem: "Which findings would push you toward biopsy for SCC rather than routine empirical treatment? (Select all that apply)",
        answers: [
          {
            id: "a",
            text: "Induration",
            isCorrect: true,
            explanation:
              "Correct. A firmer invasive feel is more concerning for SCC.",
          },
          {
            id: "b",
            text: "Rapid growth or ulceration",
            isCorrect: true,
            explanation:
              "Correct. These features should lower your threshold for biopsy.",
          },
          {
            id: "c",
            text: "Marked tenderness out of proportion",
            isCorrect: true,
            explanation:
              "Correct. Disproportionate tenderness can be a warning feature.",
          },
          {
            id: "d",
            text: "Sun-exposed location alone",
            isCorrect: false,
            explanation:
              "Incorrect. Sun exposure supports AK, but it does not by itself prove invasive SCC.",
          },
        ],
      },
    ],
  },

  {
    id: "case-tinea-scin",
    title: "An Expanding Ring-Shaped Rash on the Trunk",
    conditionId: "c0000001-0005-4000-8000-000000000001",
    patientSummary:
      "A 19-year-old woman presents with an itchy annular rash on the trunk that has been slowly expanding.",
    clinicalHistory:
      "This SCIN-derived case is intentionally conservative because the dataset provides limited history. The self-reported concern was 'ringworm,' and the dermatologist label was tinea corporis. The teaching emphasis is morphology, office confirmation, and appropriate antifungal management.",
    examFindings:
      "The trunk lesion is annular with a raised scaly border and relative central clearing. The border appears more active than the center, which is a high-yield clue for dermatophyte infection.",
    imageAssetIds: ["a0000001-0005-4000-8000-000000000001"],
    estimatedMinutes: 7,
    tags: ["infection", "tinea", "scin", "koh"],
    difficulty: "beginner",
    datasetSourceId: "scin-google-research",
    questions: [
      {
        id: "case-tinea-scin-q1",
        type: "single_select",
        stem: "What is the most likely diagnosis?",
        answers: [
          {
            id: "a",
            text: "Tinea corporis",
            isCorrect: true,
            explanation:
              "Correct. The annular scaly plaque with central clearing is classic for tinea corporis.",
          },
          {
            id: "b",
            text: "Atopic dermatitis",
            isCorrect: false,
            explanation:
              "Incorrect. Atopic dermatitis is usually ill-defined and eczematous rather than annular with an active edge.",
          },
          {
            id: "c",
            text: "Plaque psoriasis",
            isCorrect: false,
            explanation:
              "Incorrect. Psoriasis creates thicker sharply demarcated plaques with diffuse scale, not a ring-like advancing border.",
          },
          {
            id: "d",
            text: "Herpes zoster",
            isCorrect: false,
            explanation:
              "Incorrect. Zoster is vesicular and dermatomal.",
          },
        ],
      },
      {
        id: "case-tinea-scin-q2",
        type: "single_select",
        stem: "Which office test best supports the diagnosis?",
        answers: [
          {
            id: "a",
            text: "KOH preparation showing branching septate hyphae",
            isCorrect: true,
            explanation:
              "Correct. KOH microscopy is the classic quick office test for dermatophyte infection.",
          },
          {
            id: "b",
            text: "Patch testing",
            isCorrect: false,
            explanation:
              "Incorrect. Patch testing is used for allergic contact dermatitis.",
          },
          {
            id: "c",
            text: "Bacterial swab culture",
            isCorrect: false,
            explanation:
              "Incorrect. This is a fungal, not bacterial, process.",
          },
          {
            id: "d",
            text: "ANA testing",
            isCorrect: false,
            explanation:
              "Incorrect. ANA testing is irrelevant here.",
          },
        ],
      },
      {
        id: "case-tinea-scin-q3",
        type: "single_select",
        stem: "What is the best initial treatment plan?",
        answers: [
          {
            id: "a",
            text: "Topical terbinafine or another topical antifungal",
            isCorrect: true,
            explanation:
              "Correct. Localized tinea corporis is usually treated topically first line.",
          },
          {
            id: "b",
            text: "Topical corticosteroid alone",
            isCorrect: false,
            explanation:
              "Incorrect. LF notes explicitly warn never to use a steroid alone on a fungus.",
          },
          {
            id: "c",
            text: "Valacyclovir",
            isCorrect: false,
            explanation:
              "Incorrect. This is not herpesvirus infection.",
          },
          {
            id: "d",
            text: "Observation only",
            isCorrect: false,
            explanation:
              "Incorrect. Appropriate antifungal therapy should be started.",
          },
        ],
        dangerousAnswers: ["b"],
      },
    ],
  },

  {
    id: "case-acne-scin",
    title: "Inflammatory Acne on the Face",
    conditionId: "c0000001-0007-4000-8000-000000000001",
    patientSummary:
      "A 17-year-old boy presents with facial acne lesions centered on pilosebaceous skin.",
    clinicalHistory:
      "This SCIN-derived case uses the available age, sex, body-site, and diagnosis metadata. The teaching emphasis is on acne morphology, hallmark lesions, and practical first-line treatment principles from the LF notes.",
    examFindings:
      "The face shows a mixture of comedones and inflammatory papules/pustules on sebaceous skin. This distribution on the face is typical for acne vulgaris.",
    imageAssetIds: ["a0000001-0007-4000-8000-000000000002"],
    estimatedMinutes: 7,
    tags: ["acne", "scin", "comedones", "topical-therapy"],
    difficulty: "beginner",
    datasetSourceId: "scin-google-research",
    questions: [
      {
        id: "case-acne-scin-q1",
        type: "single_select",
        stem: "Which lesion type most strongly confirms that this is acne vulgaris rather than a mimic such as rosacea?",
        answers: [
          {
            id: "a",
            text: "Comedones",
            isCorrect: true,
            explanation:
              "Correct. LF notes emphasize that comedones are the signature lesion of acne.",
          },
          {
            id: "b",
            text: "Telangiectasia",
            isCorrect: false,
            explanation:
              "Incorrect. Telangiectasia is more typical of rosacea.",
          },
          {
            id: "c",
            text: "Dermatomal vesicles",
            isCorrect: false,
            explanation:
              "Incorrect. That would suggest herpes zoster, not acne.",
          },
          {
            id: "d",
            text: "Targetoid plaques",
            isCorrect: false,
            explanation:
              "Incorrect. Acne does not create targetoid lesions.",
          },
        ],
      },
      {
        id: "case-acne-scin-q2",
        type: "single_select",
        stem: "What is the best first-line regimen for mild-to-moderate acne?",
        answers: [
          {
            id: "a",
            text: "A topical retinoid-based regimen with benzoyl peroxide",
            isCorrect: true,
            explanation:
              "Correct. LF notes describe topical retinoids as central to treatment, with benzoyl peroxide as a core partner.",
          },
          {
            id: "b",
            text: "Topical steroid monotherapy",
            isCorrect: false,
            explanation:
              "Incorrect. Steroids are not acne therapy and can worsen acneiform eruptions.",
          },
          {
            id: "c",
            text: "Patch testing",
            isCorrect: false,
            explanation:
              "Incorrect. Patch testing is for allergic contact dermatitis.",
          },
          {
            id: "d",
            text: "Oral antifungal therapy",
            isCorrect: false,
            explanation:
              "Incorrect. Acne is not a fungal disease.",
          },
        ],
      },
      {
        id: "case-acne-scin-q3",
        type: "single_select",
        stem: "Which finding should lower your threshold to refer for dermatology input or isotretinoin consideration?",
        answers: [
          {
            id: "a",
            text: "Nodulocystic or scarring acne",
            isCorrect: true,
            explanation:
              "Correct. LF notes specifically flag scarring and nodulocystic disease as referral-level acne.",
          },
          {
            id: "b",
            text: "Lesions confined to pilosebaceous skin",
            isCorrect: false,
            explanation:
              "Incorrect. That is expected for acne.",
          },
          {
            id: "c",
            text: "Open and closed comedones",
            isCorrect: false,
            explanation:
              "Incorrect. Those support the diagnosis but do not by themselves mandate referral.",
          },
          {
            id: "d",
            text: "A teenage age group",
            isCorrect: false,
            explanation:
              "Incorrect. Acne is extremely common in adolescents.",
          },
        ],
      },
    ],
  },

  {
    id: "case-seborrheic-keratosis-scin",
    title: "A 'Stuck-On' Growth on the Chest",
    conditionId: "c0000001-0009-4000-8000-000000000001",
    patientSummary:
      "A 71-year-old woman presents with a chest growth that appears waxy and stuck on.",
    clinicalHistory:
      "This SCIN-derived case uses the available age, body-site, and dermatologist label data. The educational focus is recognizing a common benign lesion while maintaining an appropriate threshold to biopsy if diagnostic uncertainty remains.",
    examFindings:
      "The chest lesion appears well demarcated and stuck on with a waxy, keratotic surface. There is no immediate suggestion of a dermatomal, inflammatory, or annular process.",
    imageAssetIds: ["a0000001-0009-4000-8000-000000000001"],
    estimatedMinutes: 6,
    tags: ["benign-lesion", "seborrheic-keratosis", "scin"],
    difficulty: "beginner",
    datasetSourceId: "scin-google-research",
    questions: [
      {
        id: "case-sk-scin-q1",
        type: "single_select",
        stem: "What is the most likely diagnosis?",
        answers: [
          {
            id: "a",
            text: "Seborrheic keratosis",
            isCorrect: true,
            explanation:
              "Correct. The stuck-on waxy appearance strongly supports seborrheic keratosis.",
          },
          {
            id: "b",
            text: "Melanoma",
            isCorrect: false,
            explanation:
              "Incorrect. Melanoma remains in the differential for some pigmented lesions, but the classic stuck-on texture points more toward SK.",
          },
          {
            id: "c",
            text: "Contact dermatitis",
            isCorrect: false,
            explanation:
              "Incorrect. Contact dermatitis is eczematous, not a discrete waxy growth.",
          },
          {
            id: "d",
            text: "Herpes zoster",
            isCorrect: false,
            explanation:
              "Incorrect. Zoster is vesicular and dermatomal.",
          },
        ],
      },
      {
        id: "case-sk-scin-q2",
        type: "single_select",
        stem: "Which feature is most supportive of seborrheic keratosis?",
        answers: [
          {
            id: "a",
            text: "A well-demarcated waxy 'stuck-on' surface",
            isCorrect: true,
            explanation:
              "Correct. This is the classic bedside description of SK.",
          },
          {
            id: "b",
            text: "Unilateral dermatomal spread",
            isCorrect: false,
            explanation:
              "Incorrect. That pattern suggests zoster.",
          },
          {
            id: "c",
            text: "Annular scale with central clearing",
            isCorrect: false,
            explanation:
              "Incorrect. That describes tinea corporis.",
          },
          {
            id: "d",
            text: "Poorly demarcated flexural dermatitis",
            isCorrect: false,
            explanation:
              "Incorrect. That would fit eczema better than SK.",
          },
        ],
      },
      {
        id: "case-sk-scin-q3",
        type: "single_select",
        stem: "What is the best management principle?",
        answers: [
          {
            id: "a",
            text: "Reassure if the diagnosis is secure, but biopsy if the lesion is atypical or uncertain",
            isCorrect: true,
            explanation:
              "Correct. SK is benign, but biopsy is appropriate if melanoma or SCC remains in the differential.",
          },
          {
            id: "b",
            text: "Treat with systemic antivirals",
            isCorrect: false,
            explanation:
              "Incorrect. This is not a viral eruption.",
          },
          {
            id: "c",
            text: "Treat with oral terbinafine",
            isCorrect: false,
            explanation:
              "Incorrect. This is not a dermatophyte infection.",
          },
          {
            id: "d",
            text: "Start high-potency topical steroids",
            isCorrect: false,
            explanation:
              "Incorrect. Steroids do not treat seborrheic keratosis.",
          },
        ],
      },
    ],
  },
  {
    id: "case-melanoma-thigh-pad",
    title: "A Dark Nodular Lesion on the Thigh",
    conditionId: "c0000001-0004-4000-8000-000000000001",
    patientSummary:
      "A 63-year-old man presents with a dark lesion on the lateral thigh that has enlarged over several months and now occasionally bleeds after friction.",
    clinicalHistory:
      "The patient reports that the lesion began as a smaller dark spot but has become more elevated and noticeably darker over time. Over the last 6 to 8 weeks it has also become easier to traumatize and has bled on a few occasions. He does not recall a preceding injury. He has significant chronic sun exposure from outdoor work and has never had the lesion evaluated before.",
    examFindings:
      "A solitary dark brown-to-black dome-shaped nodule on the lateral thigh with asymmetric contour, focal surface ulceration, and irregular borders. The lesion appears more elevated and clinically aggressive than a flat nevus. No obvious surrounding dermatitis is present. The linked PAD image is labeled melanoma.",
    imageAssetIds: ["a0000001-0004-4000-8000-000000000002"],
    estimatedMinutes: 10,
    tags: ["melanoma", "pad", "biopsy-planning"],
    difficulty: "advanced",
    questions: [
      {
        id: "case-mel-thigh-q1",
        type: "single_select",
        stem: "What is the most likely diagnosis?",
        answers: [
          {
            id: "a",
            text: "Nodular melanoma",
            isCorrect: true,
            explanation:
              "Correct. A dark enlarging dome-shaped lesion with bleeding and ulceration is highly concerning for melanoma, particularly a nodular pattern.",
          },
          {
            id: "b",
            text: "Seborrheic keratosis",
            isCorrect: false,
            explanation:
              "Incorrect. Seborrheic keratoses are often stuck-on and waxy rather than progressive, ulcerated, and clinically aggressive.",
          },
          {
            id: "c",
            text: "Dermatofibroma",
            isCorrect: false,
            explanation:
              "Incorrect. Dermatofibromas are usually firm papules with a dimple sign, not an enlarging ulcerated pigmented nodule.",
          },
          {
            id: "d",
            text: "Blue nevus",
            isCorrect: false,
            explanation:
              "Incorrect. A stable blue nevus can be dark, but evolution, bleeding, and ulceration push strongly toward melanoma.",
          },
        ],
      },
      {
        id: "case-mel-thigh-q2",
        type: "multi_select",
        stem: "Which features make this lesion especially high-risk? (Select all that apply)",
        answers: [
          {
            id: "a",
            text: "Documented evolution in size and elevation",
            isCorrect: true,
            explanation:
              "Correct. Evolution remains one of the strongest melanoma warning signs.",
          },
          {
            id: "b",
            text: "Bleeding and focal ulceration",
            isCorrect: true,
            explanation:
              "Correct. Bleeding and ulceration raise concern for clinically significant malignancy.",
          },
          {
            id: "c",
            text: "Asymmetry and irregular borders",
            isCorrect: true,
            explanation:
              "Correct. These are classic melanoma-pattern features.",
          },
          {
            id: "d",
            text: "A history of response to topical steroids",
            isCorrect: false,
            explanation:
              "Incorrect. That would be more consistent with an inflammatory process and is not part of this case.",
          },
        ],
      },
      {
        id: "case-mel-thigh-q3",
        type: "single_select",
        stem: "What is the best diagnostic next step?",
        answers: [
          {
            id: "a",
            text: "Perform an excisional biopsy with narrow clinical margins",
            isCorrect: true,
            explanation:
              "Correct. When melanoma is a serious concern, full-thickness excisional biopsy is preferred so the lesion can be staged properly.",
          },
          {
            id: "b",
            text: "Perform a superficial shave biopsy",
            isCorrect: false,
            explanation:
              "Incorrect. Shave biopsy risks transecting melanoma and compromising depth assessment.",
          },
          {
            id: "c",
            text: "Observe with short-interval photography only",
            isCorrect: false,
            explanation:
              "Incorrect. This lesion already has multiple high-risk features that warrant immediate tissue diagnosis.",
          },
          {
            id: "d",
            text: "Treat empirically with cryotherapy",
            isCorrect: false,
            explanation:
              "Incorrect. Cryotherapy is not an appropriate first step for a melanoma-suspicious lesion.",
          },
        ],
      },
    ],
  },
  {
    id: "case-bcc-superficial-trunk",
    title: "A Persistent Scaly Plaque on the Trunk",
    conditionId: "c0000001-0003-4000-8000-000000000001",
    patientSummary:
      "A 59-year-old patient presents with a pink-red plaque on the trunk that has slowly enlarged over months and has not resolved with moisturizers.",
    clinicalHistory:
      "The lesion was first noticed as a small pink patch but has gradually widened and become more noticeable. It is only mildly symptomatic and does not itch much, but the patient reports that it never fully clears. No clear contact trigger is identified. The patient has a history of chronic sun exposure and multiple prior actinic keratoses.",
    examFindings:
      "A thin erythematous scaly plaque on the trunk with a subtle thread-like pearly border. The lesion is more persistent and structurally defined than a simple eczematous patch. The linked SCIN image is labeled basal cell carcinoma.",
    imageAssetIds: ["a0000001-0003-4000-8000-000000000002"],
    estimatedMinutes: 8,
    tags: ["bcc", "superficial-bcc", "scin"],
    difficulty: "intermediate",
    questions: [
      {
        id: "case-bcc-trunk-q1",
        type: "single_select",
        stem: "What is the most likely diagnosis?",
        answers: [
          {
            id: "a",
            text: "Superficial basal cell carcinoma",
            isCorrect: true,
            explanation:
              "Correct. A persistent scaly plaque with a fine pearly edge on the trunk fits superficial BCC better than an inflammatory plaque.",
          },
          {
            id: "b",
            text: "Nummular eczema",
            isCorrect: false,
            explanation:
              "Incorrect. Nummular eczema is typically more eczematous and often lacks a thin pearly thread-like border.",
          },
          {
            id: "c",
            text: "Plaque psoriasis",
            isCorrect: false,
            explanation:
              "Incorrect. Psoriasis is usually thicker, more symmetric, and shows broader silvery scale.",
          },
          {
            id: "d",
            text: "Tinea corporis",
            isCorrect: false,
            explanation:
              "Incorrect. Dermatophyte infection more often forms an annular lesion with central clearing and an advancing scaly edge.",
          },
        ],
      },
      {
        id: "case-bcc-trunk-q2",
        type: "single_select",
        stem: "Which clue most strongly favors superficial BCC over eczema here?",
        answers: [
          {
            id: "a",
            text: "The subtle thread-like pearly border",
            isCorrect: true,
            explanation:
              "Correct. That pearly border is a key clue that this is a keratinocyte carcinoma rather than routine dermatitis.",
          },
          {
            id: "b",
            text: "The fact that it is on the trunk",
            isCorrect: false,
            explanation:
              "Incorrect. Location helps, but the trunk alone does not distinguish BCC from eczema.",
          },
          {
            id: "c",
            text: "The presence of mild scale",
            isCorrect: false,
            explanation:
              "Incorrect. Scale is nonspecific and can be seen in inflammatory and neoplastic plaques.",
          },
          {
            id: "d",
            text: "The lesion is only mildly symptomatic",
            isCorrect: false,
            explanation:
              "Incorrect. Symptom intensity alone is not the key discriminator.",
          },
        ],
      },
      {
        id: "case-bcc-trunk-q3",
        type: "single_select",
        stem: "What is the best next step?",
        answers: [
          {
            id: "a",
            text: "Obtain tissue diagnosis with shave or punch biopsy, then plan definitive treatment",
            isCorrect: true,
            explanation:
              "Correct. A persistent suspicious plaque should be biopsied rather than treated empirically as dermatitis.",
          },
          {
            id: "b",
            text: "Start topical steroids and reassess in a few months",
            isCorrect: false,
            explanation:
              "Incorrect. That approach delays diagnosis of a likely skin cancer.",
          },
          {
            id: "c",
            text: "Reassure because trunk lesions are usually benign",
            isCorrect: false,
            explanation:
              "Incorrect. Site alone does not make a chronic pearly plaque benign.",
          },
          {
            id: "d",
            text: "Treat with oral antifungals empirically",
            isCorrect: false,
            explanation:
              "Incorrect. There is not enough here to justify assuming dermatophyte infection.",
          },
        ],
      },
    ],
  },
];
