import type { ProcedureModule } from "@/lib/domain/schemas";

export const procedureModules: ProcedureModule[] = [
  {
    id: "procedure-punch-biopsy",
    title: "Punch Biopsy of the Skin",
    objectives: [
      "Perform a punch biopsy safely and aseptically to obtain a full-thickness skin specimen",
      "Select the appropriate biopsy site and punch size for the clinical scenario",
      "Understand indications, contraindications, and potential complications",
      "Achieve hemostasis and proper wound closure after the procedure",
      "Correctly handle and submit the tissue specimen for pathologic analysis",
    ],
    indications: [
      "Diagnosis of inflammatory skin diseases (psoriasis, eczema, lichen planus, vasculitis)",
      "Diagnosis of blistering diseases (bullous pemphigoid, pemphigus - include perilesional skin for DIF)",
      "Evaluation of skin tumors or lesions of uncertain etiology",
      "Suspected melanoma when excisional biopsy is not feasible (punch through most concerning area)",
      "Deep dermal or subcutaneous pathology (panniculitis, morphea)",
      "Direct immunofluorescence (DIF) studies for autoimmune blistering and connective tissue diseases",
      "Evaluation of alopecia (scalp punch biopsy, typically 4 mm, including subcutaneous tissue)",
    ],
    contraindications: [
      "Active infection at the proposed biopsy site (relative - consider alternative site)",
      "Severe coagulopathy or anticoagulant therapy (relative - most can be done safely with pressure hemostasis)",
      "Known allergy to local anesthetic (use alternative agent or technique)",
      "Suspected melanoma when excisional biopsy IS feasible (excision preferred for accurate Breslow depth)",
      "Patient refusal or inability to provide informed consent",
      "Sites overlying critical structures (temporal artery, superficial nerves) require extra caution",
    ],
    equipment: [
      "Disposable punch biopsy instrument (3, 4, 5, or 6 mm; 4 mm is the standard workhorse)",
      "1% lidocaine with epinephrine 1:100,000 in 3 mL syringe with 27- or 30-gauge needle",
      "Alcohol swab or chlorhexidine for skin preparation",
      "Sterile gloves",
      "Toothed forceps (Adson) for gentle tissue handling - avoid crushing",
      "Iris scissors or small suture scissors",
      "Needle driver and suture material (4-0/5-0 nylon for trunk/extremities; 5-0/6-0 for face)",
      "20% aluminum chloride (Drysol) or silver nitrate sticks for chemical hemostasis",
      "Sterile gauze and adhesive bandage",
      "Specimen container with 10% neutral buffered formalin (or Michel medium for DIF specimens)",
      "Pathology requisition form with clinical history and differential diagnosis",
    ],
    steps: [
      {
        order: 1,
        title: "Obtain Informed Consent and Select Biopsy Site",
        description:
          "Explain the procedure, risks (bleeding, infection, scarring, pain), benefits (diagnostic information), and alternatives. Select the optimal biopsy site: for inflammatory diseases, choose the most representative, fully developed lesion. For blistering diseases, biopsy the edge of an intact bulla (H&E) and perilesional uninvolved skin (DIF). For suspected melanoma, biopsy through the most concerning area.",
        tips: [
          "For inflammatory diseases, biopsy the most representative active lesion, not excoriated or treated areas",
          "For DIF studies, a separate perilesional punch is needed in Michel medium, NOT formalin",
          "Document the exact anatomic site on the requisition form",
          "Consider cosmetic impact when choosing the biopsy site",
        ],
        warnings: [
          "For suspected melanoma, excisional biopsy is preferred over punch when feasible",
          "A punch through melanoma may not capture the deepest portion, potentially understaging",
        ],
      },
      {
        order: 2,
        title: "Prepare the Site and Administer Local Anesthesia",
        description:
          "Clean the biopsy site with alcohol or chlorhexidine. Inject 1% lidocaine with epinephrine subcutaneously beneath and around the biopsy site. Wait 5-10 minutes for epinephrine vasoconstrictive effect.",
        tips: [
          "Inject SUBCUTANEOUSLY, not intradermally (intradermal injection distorts tissue architecture)",
          "Buffering lidocaine with NaHCO3 (1 mL per 10 mL lidocaine) significantly reduces injection pain",
          "Wait at least 5 minutes for full epinephrine effect - significantly reduces bleeding",
          "For anxious patients, apply topical anesthetic (LMX/EMLA) 30-60 minutes before",
        ],
        warnings: [
          "Maximum lidocaine dose: 4.5 mg/kg without epinephrine, 7 mg/kg with epinephrine",
          "Aspirate before injecting near vascular structures",
          "Ask about local anesthetic allergy (true allergy is rare; most reactions are vasovagal)",
        ],
      },
      {
        order: 3,
        title: "Perform the Punch Biopsy",
        description:
          "Hold the punch perpendicular to the skin. Stretch the skin perpendicular to relaxed skin tension lines (RSTL) with the non-dominant hand. Apply firm, steady downward pressure while rotating the punch in ONE direction. Continue until the 'give' of penetrating into subcutaneous fat.",
        tips: [
          "Stretching perpendicular to RSTL creates an elliptical wound that closes easily",
          "Rotate in ONE direction only - alternating creates ragged edges and crush artifact",
          "4 mm is standard; 3 mm for cosmetically sensitive areas; 5-6 mm for deep/architectural assessment",
          "For scalp biopsies, angle parallel to hair follicle direction to capture intact follicles",
        ],
        warnings: [
          "Do NOT apply excessive force - let the sharp instrument cut",
          "Be aware of underlying structures (nerves, vessels) on the face and over bony prominences",
          "Lower leg biopsies heal slowly - warn patients and consider compression",
        ],
      },
      {
        order: 4,
        title: "Remove the Specimen",
        description:
          "Gently lift the tissue plug with toothed forceps, grasping at the edge. NEVER crush the center. Cut the specimen free at the base with iris scissors.",
        tips: [
          "Grasp at the very edge or by the subcutaneous fat - avoid crushing central epidermis/dermis",
          "Crush artifact from aggressive forceps is the #1 cause of non-diagnostic biopsies",
          "Never use hemostats or non-toothed forceps on tissue specimens",
          "For panniculitis, ensure adequate subcutaneous fat is included",
        ],
        warnings: [
          "Crush artifact renders specimens non-diagnostic and may require repeat biopsy",
          "If the specimen falls on the floor, it is contaminated - consider repeating",
        ],
      },
      {
        order: 5,
        title: "Achieve Hemostasis and Close the Wound",
        description:
          "Apply direct pressure for 1-2 minutes. For 3 mm punches, chemical hemostasis with aluminum chloride may suffice. For 4 mm+, close with 1-2 simple interrupted sutures. Apply petrolatum and sterile bandage.",
        tips: [
          "Properly stretched skin creates an elliptical wound that closes with 1-2 sutures",
          "Plain petrolatum is as effective as antibiotic ointment and avoids contact sensitization",
          "Suture removal timing: face 5-7d, trunk 10-14d, extremities 10-14d, lower legs 14-21d",
        ],
        warnings: [
          "Ensure hemostasis BEFORE applying the dressing",
          "On the lower leg, consider leaving sutures longer (14-21 days) due to slower healing",
        ],
      },
      {
        order: 6,
        title: "Process and Submit the Specimen",
        description:
          "Place tissue in formalin for routine H&E. For DIF, place in Michel medium (NEVER formalin). Complete pathology requisition with patient info, biopsy site, clinical description, and differential diagnosis.",
        tips: [
          "Label the container AT THE BEDSIDE before the procedure to prevent mislabeling",
          "Including a clinical differential significantly improves pathology interpretation",
          "Photograph the lesion before biopsy for clinical-pathologic correlation",
        ],
        warnings: [
          "NEVER place a DIF specimen in formalin - this is an irreversible error",
          "Mislabeled specimens are a serious patient safety issue",
          "Inadequate clinical info on the requisition is a common cause of inaccurate pathology",
        ],
      },
      {
        order: 7,
        title: "Provide Post-Procedure Instructions",
        description:
          "Keep wound clean and dry for 24 hours, then wash gently daily. Apply petrolatum and bandage until healed. Advise on signs of infection. Schedule suture removal and results follow-up.",
        tips: [
          "Written wound care instructions improve compliance",
          "Patients can shower the day after; avoid soaking until sutures removed",
          "Lower extremity sites heal slower - advise elevation and compression",
        ],
        warnings: [
          "Patients on anticoagulants: apply pressure for 20 minutes if bleeding occurs",
          "Instruct patients to seek care for increasing redness, swelling, drainage, or fever",
        ],
      },
    ],
    commonErrors: [
      "Performing a shave biopsy when a full-thickness punch is needed (panniculitis, alopecia, melanoma staging)",
      "Crushing the tissue specimen with forceps, creating non-diagnostic crush artifact",
      "Forgetting to stretch the skin perpendicular to RSTL, resulting in a circular wound that is difficult to close",
      "Placing a DIF specimen in formalin instead of Michel medium (irreversible error)",
      "Biopsying the center of an annular lesion instead of the active border",
      "Biopsying an excoriated, crusted, or infected lesion instead of an intact representative one",
      "Inadequate depth - not reaching subcutaneous fat (especially for scalp biopsies and panniculitis)",
      "Not waiting for epinephrine to take effect, resulting in excessive bleeding",
      "Failing to include a clinical differential on the pathology requisition",
      "Using a punch too small (2-3 mm) for conditions requiring architectural assessment (minimum 4 mm)",
      "Not confirming the biopsy site before the procedure (wrong-site biopsy is preventable)",
      "Rotating the punch back and forth instead of in one direction, creating shredded specimen edges",
    ],
    estimatedMinutes: 15,
    tags: ["biopsy", "procedure", "dermatology-skills", "histopathology"],
  },
];
