import type { Condition } from "@/lib/domain/schemas";

const now = "2026-03-29T00:00:00Z";

type SupplementalConditionInput = Omit<
  Condition,
  "createdAt" | "updatedAt" | "aliases"
> & {
  aliases?: string[];
};

function createLfCondition({
  aliases = [],
  ...condition
}: SupplementalConditionInput): Condition {
  return {
    ...condition,
    aliases,
    createdAt: now,
    updatedAt: now,
  };
}

const autoimmuneConditions: Condition[] = [
  createLfCondition({
    id: "cond-lf-vitiligo",
    name: "Vitiligo",
    slug: "vitiligo",
    category: "autoimmune",
    description:
      "Vitiligo is an acquired depigmenting disorder caused by immune-mediated destruction of melanocytes. In the LF notes it is presented as a classic cause of hypopigmentation, producing sharply demarcated white patches without scale.",
    clinicalFeatures: [
      "Well-demarcated depigmented macules and patches",
      "Absence of scale or surface change",
      "Symmetric acral or facial involvement is common",
      "Associated autoimmune history may be present",
    ],
    syllabusSection: "Autoimmune diseases",
    summary:
      "An immune-mediated loss of melanocytes that produces chalk-white patches with a sharp edge and little to no surface texture change.",
    hallmarkMorphology: [
      "Chalk-white macules and patches",
      "Sharp border between involved and uninvolved skin",
      "No scale",
    ],
    commonBodySites: [
      "Face",
      "Perioral skin",
      "Periocular skin",
      "Hands",
      "Wrists",
      "Genital skin",
    ],
    symptoms: ["Usually asymptomatic", "Slow spread", "Cosmetic distress"],
    managementBasics: [
      "Confirm the lesion is truly depigmented rather than just hypopigmented",
      "Use topical anti-inflammatory therapy or phototherapy when treatment is desired",
      "Screen for associated autoimmune disease when the history suggests it",
    ],
    redFlags: [
      "Rapid generalized spread with major psychosocial impact",
      "Associated thyroid or other autoimmune symptoms",
    ],
    followUpPearls: [
      "Vitiligo is a pigment-loss disorder, not a scaly dermatitis",
      "Acral and facial disease can be especially visible and emotionally burdensome",
    ],
  }),
  createLfCondition({
    id: "cond-lf-systemic-sclerosis",
    name: "Systemic Sclerosis",
    slug: "systemic-sclerosis",
    category: "autoimmune",
    description:
      "Systemic sclerosis is an autoimmune disease defined by inflammation, vasculopathy, and fibrosis. LF notes emphasize sclerodactyly, abnormal nailfold capillaries, microstomia, and internal-organ involvement such as pulmonary fibrosis.",
    clinicalFeatures: [
      "Progressive skin thickening of the fingers and hands",
      "Abnormal nailfold capillaries",
      "Microstomia and tightening around the mouth",
      "Internal-organ fibrosis or vascular complications",
    ],
    syllabusSection: "Autoimmune diseases",
    summary:
      "A multisystem autoimmune fibrosing disorder where hand sclerosis, vascular change, and visceral involvement matter as much as the skin findings.",
    hallmarkMorphology: [
      "Sclerodactyly",
      "Tight shiny skin with reduced mobility",
      "Peri-oral tightening",
    ],
    commonBodySites: ["Fingers", "Hands", "Face"],
    symptoms: [
      "Hand stiffness",
      "Cold-sensitive color change",
      "Reduced mouth opening",
      "Dyspnea or reflux in systemic disease",
    ],
    managementBasics: [
      "Look for systemic involvement rather than treating it as an isolated skin disorder",
      "Document Raynaud symptoms, nailfold changes, and progressive hand dysfunction",
      "Coordinate rheumatology-directed evaluation for lung, GI, renal, and vascular complications",
    ],
    redFlags: [
      "Progressive dyspnea or pulmonary fibrosis symptoms",
      "Digital ischemia or acral necrosis",
      "Rapidly worsening skin thickening",
    ],
    followUpPearls: [
      "Limited and diffuse cutaneous patterns carry different risk profiles",
      "Early vascular clues can appear before dramatic fibrosis",
    ],
    aliases: ["Systemic scleroderma"],
  }),
  createLfCondition({
    id: "cond-lf-raynaud",
    name: "Raynaud Phenomenon",
    slug: "raynaud-phenomenon",
    category: "autoimmune",
    description:
      "Raynaud phenomenon is a vasospastic disorder that often accompanies systemic sclerosis. LF notes highlight cold-triggered episodic whitening, blue discoloration on rewarming, pain, numbness, and swelling.",
    clinicalFeatures: [
      "Cold-triggered episodic finger color change",
      "White to blue to red transition",
      "Pain, numbness, or throbbing during attacks",
      "May accompany connective-tissue disease",
    ],
    syllabusSection: "Autoimmune diseases",
    summary:
      "A vasospastic color-change disorder of the digits that can be a clue to systemic sclerosis or another connective-tissue disease.",
    hallmarkMorphology: [
      "White ischemic digits",
      "Blue discoloration during rewarming",
      "Reactive erythema and swelling after the episode",
    ],
    commonBodySites: ["Fingers", "Toes"],
    symptoms: ["Cold sensitivity", "Numbness", "Pain", "Transient swelling"],
    managementBasics: [
      "Ask about triggers such as cold, wind, and emotional stress",
      "Look for nailfold, sclerotic, or autoimmune clues that suggest secondary Raynaud",
      "Use cold avoidance and vasodilator therapy when clinically indicated",
    ],
    redFlags: [
      "Digital ulceration or necrosis",
      "Late-onset severe attacks suggesting secondary Raynaud",
    ],
    followUpPearls: [
      "Raynaud can be the earliest clue to systemic sclerosis",
      "The attack history is often more diagnostic than the between-episode exam",
    ],
    aliases: ["Raynaud syndrome"],
  }),
  createLfCondition({
    id: "cond-lf-morphea",
    name: "Morphea",
    slug: "morphea",
    category: "autoimmune",
    description:
      "Morphea, or localized scleroderma, causes focal skin hardening without the systemic organ disease seen in systemic sclerosis. LF notes emphasize asymmetric truncal or proximal-extremity plaques, linear forms in children, and contracture risk in deeper disease.",
    clinicalFeatures: [
      "Localized indurated plaques or linear bands",
      "Asymmetric involvement of trunk or extremities",
      "Linear craniofacial disease can occur in children",
      "Contracture may develop when deeper tissue is involved",
    ],
    syllabusSection: "Autoimmune diseases",
    summary:
      "A localized sclerosing disorder that hardens skin and subcutis without the visceral fibrosis of systemic sclerosis.",
    hallmarkMorphology: [
      "Bound-down indurated plaques",
      "Linear sclerotic bands",
      "Atrophic or depressed late-stage areas",
    ],
    commonBodySites: ["Trunk", "Proximal extremities", "Scalp", "Face"],
    symptoms: [
      "Skin tightening",
      "Reduced range of motion",
      "Usually little itch",
    ],
    managementBasics: [
      "Assess depth and whether joints or the face are functionally threatened",
      "Escalate therapy when linear, facial, generalized, or rapidly progressive disease is present",
      "Track range of motion over time in children and in limb disease",
    ],
    redFlags: [
      "Linear disease crossing joints",
      "En coup de sabre or hemifacial atrophy",
      "Rapid circumferential progression",
    ],
    followUpPearls: [
      "Morphea can be benign-appearing early and disabling later if it contracts",
      "The absence of systemic sclerosis does not mean the lesion is trivial",
    ],
    aliases: ["Localized scleroderma"],
  }),
  createLfCondition({
    id: "cond-lf-lupus",
    name: "Lupus Erythematosus",
    slug: "lupus-erythematosus",
    category: "autoimmune",
    description:
      "Lupus erythematosus is a heterogeneous autoimmune disease with frequent skin involvement. LF notes highlight malar erythema, photosensitivity, subacute polycyclic sun-exposed plaques, discoid lupus, mucosal disease, and nonscarring alopecia.",
    clinicalFeatures: [
      "Photosensitive eruption on sun-exposed sites",
      "Malar erythema or discoid lesions",
      "Mucosal erosions or ulceration can occur",
      "Hair loss may be part of the presentation",
    ],
    syllabusSection: "Autoimmune diseases",
    summary:
      "A variable autoimmune disease where photosensitive cutaneous lesions can be the first or dominant clue to broader systemic illness.",
    hallmarkMorphology: [
      "Butterfly-pattern facial erythema",
      "Discoid scarring plaques",
      "Polycyclic scaly plaques on sun-exposed skin",
    ],
    commonBodySites: ["Cheeks", "Nose", "Scalp", "Ears", "Sun-exposed trunk"],
    symptoms: ["Photosensitivity", "Fatigue", "Arthralgia", "Hair loss"],
    managementBasics: [
      "Ask about delayed sun-triggered flares and systemic symptoms",
      "Use photoprotection aggressively",
      "Escalate workup when the skin findings suggest broader systemic lupus",
    ],
    redFlags: [
      "Renal, neurologic, or major constitutional symptoms",
      "Rapidly destructive discoid change on the ears or nose",
      "Extensive mucosal involvement",
    ],
    followUpPearls: [
      "Cutaneous lupus is common and may be the presenting organ involvement",
      "The morphology can vary widely, so history and photodistribution matter",
    ],
  }),
  createLfCondition({
    id: "cond-lf-dermatomyositis",
    name: "Dermatomyositis",
    slug: "dermatomyositis",
    category: "autoimmune",
    description:
      "Dermatomyositis combines a characteristic inflammatory rash with myopathy. LF notes emphasize violaceous sun-exposed eruption, Gottron papules over knuckles, cuticular change, prominent looped capillaries, and proximal muscle weakness.",
    clinicalFeatures: [
      "Violaceous eruption on cheeks, chest, shoulders, or elbows",
      "Gottron papules on bony prominences",
      "Thickened tender cuticles and periungual vascular change",
      "Proximal muscle weakness and myalgia",
    ],
    syllabusSection: "Autoimmune diseases",
    summary:
      "An inflammatory myopathy with a high-yield skin pattern, especially violaceous photodistributed change and Gottron papules.",
    hallmarkMorphology: [
      "Violaceous photodistributed erythema",
      "Gottron papules or plaques",
      "Periungual capillary change",
    ],
    commonBodySites: ["Face", "Upper chest", "Shoulders", "Elbows", "Knuckles"],
    symptoms: [
      "Proximal muscle weakness",
      "Myalgia",
      "Fatigue",
      "Rash on sun-exposed skin",
    ],
    managementBasics: [
      "Ask about weakness, swallowing symptoms, and fatigue in every suspected case",
      "Check muscle enzymes and coordinate systemic evaluation",
      "Use sun protection and systemic therapy guided by disease severity",
    ],
    redFlags: [
      "New dysphagia or respiratory weakness",
      "Rapidly progressive weakness",
      "Marked periungual vasculopathy or ulceration",
    ],
    followUpPearls: [
      "The rash may appear before the myopathy is fully obvious",
      "Knuckle involvement is especially helpful when differentiating from lupus",
    ],
  }),
  createLfCondition({
    id: "cond-lf-pemphigus-vulgaris",
    name: "Pemphigus Vulgaris",
    slug: "pemphigus-vulgaris",
    category: "autoimmune",
    description:
      "Pemphigus vulgaris is an autoimmune blistering disease caused by antibodies against desmosomal adhesion proteins. LF notes stress oral involvement before skin disease, erosions and crusting, fragile blisters on the trunk, and a positive Nikolsky sign.",
    clinicalFeatures: [
      "Painful oral erosions often precede skin disease",
      "Fragile flaccid blisters that quickly erode",
      "Crusted erosions on trunk and skin folds",
      "Positive Nikolsky sign",
    ],
    syllabusSection: "Autoimmune diseases",
    summary:
      "A life-threatening autoimmune blistering disorder marked by mucosal erosions and fragile superficial blistering.",
    hallmarkMorphology: [
      "Flaccid easily ruptured bullae",
      "Widespread erosions and crusting",
      "Mucosal involvement",
    ],
    commonBodySites: ["Oral mucosa", "Trunk", "Scalp", "Intertriginous skin"],
    symptoms: ["Pain", "Oral soreness", "Difficulty eating", "Minimal itch"],
    managementBasics: [
      "Confirm with biopsy and immunofluorescence when possible",
      "Treat promptly with systemic immunosuppression",
      "Support nutrition and wound care in extensive disease",
    ],
    redFlags: [
      "Rapidly progressive widespread erosions",
      "Inability to maintain oral intake",
      "Secondary infection or fluid loss",
    ],
    followUpPearls: [
      "Mucosal disease before skin disease is a major clue",
      "This is a fragile intraepidermal blistering disorder, unlike tense bullae in pemphigoid",
    ],
  }),
  createLfCondition({
    id: "cond-lf-bullous-pemphigoid",
    name: "Bullous Pemphigoid",
    slug: "bullous-pemphigoid",
    category: "autoimmune",
    description:
      "Bullous pemphigoid is the more common autoimmune blistering disease of older adults. LF notes describe burning itch followed by stable thick-topped blisters and highlight medication triggers such as PD-1 inhibitors, loop diuretics, and DPP4 inhibitors.",
    clinicalFeatures: [
      "Older patient with severe itch or burning",
      "Tense thick-topped bullae",
      "Subepidermal blistering pattern",
      "Possible medication trigger",
    ],
    syllabusSection: "Autoimmune diseases",
    summary:
      "A tense-bullous autoimmune blistering disease of older adults that often begins with intense itch.",
    hallmarkMorphology: [
      "Tense bullae",
      "Erythematous or urticarial base",
      "More stable blister roof than pemphigus",
    ],
    commonBodySites: ["Trunk", "Flexural limbs", "Abdomen"],
    symptoms: ["Burning itch", "Blistering", "Sleep disruption from pruritus"],
    managementBasics: [
      "Review the medication list carefully",
      "Use high-potency topical steroids or systemic therapy depending on extent",
      "Coordinate biopsy confirmation when feasible",
    ],
    redFlags: [
      "Rapid generalization in a frail older adult",
      "Severe itch with poor sleep or functional decline",
      "Suspected drug-triggered disease requiring medication changes",
    ],
    followUpPearls: [
      "Bullous pemphigoid often starts with itch before obvious blisters",
      "Older age and tense bullae help distinguish it from pemphigus vulgaris",
    ],
  }),
  createLfCondition({
    id: "cond-lf-dermatitis-herpetiformis",
    name: "Dermatitis Herpetiformis",
    slug: "dermatitis-herpetiformis",
    category: "autoimmune",
    description:
      "Dermatitis herpetiformis is a very pruritic autoimmune blistering disease strongly associated with celiac disease. LF notes describe clustered small blisters, granular IgA deposition, and lifelong gluten avoidance plus dapsone as the classic management approach.",
    clinicalFeatures: [
      "Clusters of tiny excoriated vesicles",
      "Intense itch that may destroy intact blisters before exam",
      "Association with celiac disease",
      "Extensor-predominant distribution",
    ],
    syllabusSection: "Autoimmune diseases",
    summary:
      "An intensely pruritic gluten-associated blistering eruption where the itch is often more striking than the visible vesicles.",
    hallmarkMorphology: [
      "Grouped excoriated papules and vesicles",
      "Symmetric extensor involvement",
      "Secondary crusting from scratching",
    ],
    commonBodySites: ["Elbows", "Knees", "Buttocks", "Scalp", "Upper back"],
    symptoms: ["Severe itch", "Burning", "Relapsing clusters of lesions"],
    managementBasics: [
      "Screen for and manage the associated gluten-sensitive enteropathy",
      "Use dapsone for rapid symptom control when appropriate",
      "Counsel that a gluten-free diet is a long-term disease treatment, not just symptom support",
    ],
    redFlags: [
      "Extensive disease with weight loss or GI symptoms suggesting active celiac disease",
      "Uncontrolled itch causing sleep loss and widespread excoriation",
    ],
    followUpPearls: [
      "The lesions may be sparse because scratching destroys the vesicles",
      "Dermatitis herpetiformis is a celiac-spectrum disease until proven otherwise",
    ],
  }),
];

const ulcerAndWoundConditions: Condition[] = [
  createLfCondition({
    id: "cond-lf-stasis-dermatitis",
    name: "Stasis Dermatitis",
    slug: "stasis-dermatitis",
    category: "eczematous",
    description:
      "Stasis dermatitis is the cutaneous inflammatory manifestation of chronic venous insufficiency. LF notes link it to lower-leg edema, hyperpigmentation, eczematous change, and a high risk of contact sensitization from topical products.",
    clinicalFeatures: [
      "Erythema and scale on chronically edematous lower legs",
      "Background hemosiderin or bronzing",
      "Associated varicosities or venous insufficiency signs",
      "Pruritus or irritation around chronic wounds",
    ],
    syllabusSection: "Leg ulcers",
    summary:
      "An eczematous lower-leg dermatitis caused by venous hypertension and chronic edema.",
    hallmarkMorphology: [
      "Ill-defined erythema and scale on the lower legs",
      "Brown hemosiderin pigmentation",
      "Edema with associated venous change",
    ],
    commonBodySites: ["Lower legs", "Ankles", "Gaiter distribution"],
    symptoms: ["Pruritus", "Leg heaviness", "Swelling", "Burning irritation"],
    managementBasics: [
      "Treat the venous disease with compression only after arterial insufficiency is excluded",
      "Use bland skin care and topical steroids for inflamed dermatitis",
      "Avoid unnecessary topical antibiotics and sensitizing agents",
    ],
    redFlags: [
      "Superimposed cellulitis or rapidly worsening pain",
      "Ulceration that is not improving with appropriate compression-based care",
    ],
    followUpPearls: [
      "Stasis dermatitis is a clue to venous insufficiency, not an isolated rash diagnosis",
      "Contact allergy from wound products is common in chronic leg disease",
    ],
  }),
  createLfCondition({
    id: "cond-lf-venous-ulcer",
    name: "Venous Ulcer",
    slug: "venous-ulcer",
    category: "ulcer_wound",
    description:
      "Venous ulcers are the most common leg ulcers and reflect chronic venous hypertension. LF notes emphasize gaiter distribution, hemosiderin, varicosities, wet exudative ulcers, and the importance of compression after checking arterial perfusion.",
    clinicalFeatures: [
      "Ulcer in the gaiter region",
      "Edema, varicosities, and surrounding hemosiderin",
      "Shallow moist ulcer with irregular border",
      "History of venous insufficiency or prior DVT",
    ],
    syllabusSection: "Leg ulcers",
    summary:
      "A lower-leg ulcer caused by venous hypertension, usually wet, shallow, and surrounded by edema and bronzing.",
    hallmarkMorphology: [
      "Shallow exudative ulcer",
      "Irregular border",
      "Associated lower-leg edema and pigmentation",
    ],
    commonBodySites: ["Medial lower leg", "Ankles", "Gaiter area"],
    symptoms: ["Aching leg", "Swelling", "Drainage", "Chronic recurrence"],
    managementBasics: [
      "Measure ABI before compression therapy",
      "Address venous insufficiency with compression, elevation, and local wound care",
      "Keep the wound appropriately moist rather than overly dry or overly wet",
    ],
    redFlags: [
      "Failure to heal after appropriate therapy",
      "Mixed arterial disease making compression unsafe",
      "Features concerning for tumor or pyoderma gangrenosum",
    ],
    followUpPearls: [
      "If the ulcer is not healing, the cause has not been adequately addressed",
      "Long-term compression remains important after closure to reduce recurrence",
    ],
  }),
  createLfCondition({
    id: "cond-lf-lipodermatosclerosis",
    name: "Lipodermatosclerosis",
    slug: "lipodermatosclerosis",
    category: "ulcer_wound",
    description:
      "Lipodermatosclerosis is a fibrosing consequence of chronic venous insufficiency in which subcutaneous fat is replaced by fibrosis. LF notes emphasize acute painful inflammatory episodes and the classic inverted champagne bottle contour of the lower leg.",
    clinicalFeatures: [
      "Painful indurated lower leg",
      "Fibrotic tapering above the ankle",
      "Background venous disease and edema",
      "May coexist with venous ulceration",
    ],
    syllabusSection: "Leg ulcers",
    summary:
      "A fibrosing lower-leg change from chronic venous disease that produces painful inflammation and an inverted champagne bottle shape.",
    hallmarkMorphology: [
      "Indurated fibrotic lower leg",
      "Inverted champagne bottle contour",
      "Overlying stasis skin change",
    ],
    commonBodySites: ["Lower legs", "Ankles"],
    symptoms: ["Pain", "Tenderness", "Swelling", "Skin tightening"],
    managementBasics: [
      "Treat the underlying venous hypertension and edema",
      "Use compression when vascular status permits",
      "Differentiate inflammatory flares from cellulitis or DVT",
    ],
    redFlags: [
      "New severe unilateral pain or swelling",
      "Ulceration developing within fibrotic tissue",
    ],
    followUpPearls: [
      "It is a marker of advanced venous disease rather than a separate eczema alone",
      "Fibrosis can make wound healing slower and limb contour more fixed",
    ],
  }),
  createLfCondition({
    id: "cond-lf-arterial-ulcer",
    name: "Arterial Ulcer",
    slug: "arterial-ulcer",
    category: "ulcer_wound",
    description:
      "Arterial ulcers reflect peripheral arterial disease and tissue ischemia. LF notes emphasize dry punched-out ulcers, a pale base, minimal exudate, cool hairless skin, diminished pulses, and associated claudication or rest pain.",
    clinicalFeatures: [
      "Dry punched-out ulcer with sharply defined border",
      "Cool, pale, hairless surrounding skin",
      "Pain with claudication or rest ischemia",
      "Reduced or absent distal pulses",
    ],
    syllabusSection: "Leg ulcers",
    summary:
      "An ischemic ulcer from peripheral arterial disease, classically dry, painful, and punched out on distal pressure sites.",
    hallmarkMorphology: [
      "Punched-out ulcer",
      "Pale base with minimal exudate",
      "Shiny atrophic skin around the wound",
    ],
    commonBodySites: ["Toes", "Heels", "Pretibial skin", "Supramalleolar sites"],
    symptoms: ["Rest pain", "Claudication", "Cold limb", "Poor wound healing"],
    managementBasics: [
      "Assess perfusion urgently with vascular studies",
      "Refer for revascularization when appropriate",
      "Do not default to compression the way you would for venous ulcer disease",
    ],
    redFlags: [
      "Critical limb ischemia with rest pain",
      "Rapid tissue necrosis or gangrene",
      "Absent pulses with a nonhealing distal wound",
    ],
    followUpPearls: [
      "The wound bed is usually dry rather than weepy",
      "A nonhealing ischemic wound should prompt vascular, not just dressing-focused, management",
    ],
  }),
  createLfCondition({
    id: "cond-lf-diabetic-foot-ulcer",
    name: "Diabetic Foot Ulcer",
    slug: "diabetic-foot-ulcer",
    category: "ulcer_wound",
    description:
      "Diabetic neuropathic foot ulcers arise from repetitive pressure on an insensate foot. LF notes highlight plantar pressure points, overlying callus, deep undermined ulcers, infection risk, osteomyelitis evaluation, offloading, and multidisciplinary care.",
    clinicalFeatures: [
      "Plantar or toe ulcer at a pressure point",
      "Overlying callus or undermined edge",
      "Loss of protective sensation",
      "Warm dry skin with possible infection",
    ],
    syllabusSection: "Leg ulcers",
    summary:
      "A pressure-driven ulcer in the neuropathic diabetic foot where offloading and infection control are as important as the dressing itself.",
    hallmarkMorphology: [
      "Pressure-point ulcer under callus",
      "Deep undermined wound",
      "Associated neuropathic foot changes",
    ],
    commonBodySites: ["Plantar forefoot", "Metatarsal heads", "Toes", "Heel"],
    symptoms: [
      "Often little pain",
      "Drainage",
      "Swelling",
      "Difficulty weight bearing",
    ],
    managementBasics: [
      "Offload the ulcer and reduce repetitive pressure immediately",
      "Probe and image when osteomyelitis is a concern",
      "Manage glycemic control, tinea pedis, vascular status, and footwear together",
    ],
    redFlags: [
      "Deep infection or suspected osteomyelitis",
      "Rapid soft-tissue spread or systemic illness",
      "Progressive wound despite offloading",
    ],
    followUpPearls: [
      "Neuropathy can make a severe ulcer look deceptively painless",
      "Callus is a biomechanical clue, not just surface debris",
    ],
  }),
  createLfCondition({
    id: "cond-lf-pyoderma-gangrenosum",
    name: "Pyoderma Gangrenosum",
    slug: "pyoderma-gangrenosum",
    category: "ulcer_wound",
    description:
      "Pyoderma gangrenosum is an autoinflammatory neutrophilic ulcerative disorder. LF notes emphasize pathergy, a rapidly progressive intensely painful ulcer, undermined violaceous borders, and the major teaching point: never debride a suspected PG lesion.",
    clinicalFeatures: [
      "Rapidly enlarging painful ulcer",
      "Undermined violaceous or gunmetal border",
      "Can be triggered by trauma or surgery",
      "May be associated with IBD or arthritis",
    ],
    syllabusSection: "Leg ulcers",
    summary:
      "A painful neutrophilic ulcer that worsens with trauma and should not be mistaken for an infected wound requiring debridement.",
    hallmarkMorphology: [
      "Rapidly progressive ulcer",
      "Violaceous undermined border",
      "Purulent or necrotic surface",
    ],
    commonBodySites: ["Lower legs", "Anywhere on the skin"],
    symptoms: ["Severe pain", "Rapid enlargement", "Tenderness", "Inflammatory flare"],
    managementBasics: [
      "Treat it as a dermatologic emergency rather than a routine chronic wound",
      "Avoid debridement unless another diagnosis clearly explains the lesion",
      "Use topical or systemic immunosuppression depending on severity",
    ],
    redFlags: [
      "Any rapidly worsening painful ulcer after trauma or surgery",
      "Progression after debridement or manipulation",
      "Systemic inflammatory disease in the history",
    ],
    followUpPearls: [
      "PG is a diagnosis of exclusion, but its behavior is often the biggest clue",
      "Document size and border change carefully because progression can be fast",
    ],
  }),
  createLfCondition({
    id: "cond-lf-pressure-ulcer",
    name: "Pressure Ulcer",
    slug: "pressure-ulcer",
    category: "ulcer_wound",
    description:
      "Pressure ulcers are soft-tissue injuries caused by unrelieved pressure over vulnerable skin and deeper tissue. LF notes focus on prevention, staging by tissue depth, osteomyelitis risk, multidisciplinary care, and reserving surgery for selected advanced cases.",
    clinicalFeatures: [
      "Occurs over bony prominences in patients with reduced mobility",
      "Stage depends on tissue depth and wound bed visibility",
      "Moisture, friction, malnutrition, and immobility raise risk",
      "May progress to deep infection or osteomyelitis",
    ],
    syllabusSection: "Pressure ulcer",
    summary:
      "A preventable ischemic wound over pressure points where relief of the offending force is the central treatment.",
    hallmarkMorphology: [
      "Ulcer over a bony prominence",
      "Depth varies from superficial erosion to deep cavity",
      "Surrounding pressure and moisture damage",
    ],
    commonBodySites: [
      "Sacrum",
      "Heels",
      "Ischium",
      "Trochanter",
      "Occiput",
      "Elbows",
    ],
    symptoms: [
      "Pain or tenderness",
      "Drainage",
      "Odor when infected",
      "Reduced mobility",
    ],
    managementBasics: [
      "Relieve pressure and optimize positioning immediately",
      "Stage the wound and assess for osteomyelitis when depth or chronicity suggests it",
      "Use wound-care, nutritional, rehabilitation, and surgical input together when advanced",
    ],
    redFlags: [
      "Exposed bone or suspicion for osteomyelitis",
      "Necrotizing soft-tissue infection",
      "A recurrent stage III or IV ulcer in a patient who cannot offload",
    ],
    followUpPearls: [
      "Pressure relief is treatment, not just prevention advice",
      "Earlier-stage ulcers are often managed nonoperatively if the cause is corrected",
    ],
  }),
  createLfCondition({
    id: "cond-lf-burns",
    name: "Burns",
    slug: "burns",
    category: "burn",
    description:
      "Burn injury is categorized by total body surface area and depth. LF notes review superficial, partial-thickness, and full-thickness burns, the need to estimate TBSA, the importance of capillary refill and depth assessment, and when burn-unit referral is needed.",
    clinicalFeatures: [
      "Erythema only in superficial burns",
      "Blistering and pain in partial-thickness burns",
      "Leathery insensate tissue in full-thickness burns",
      "Severity depends on depth, TBSA, location, and comorbidity",
    ],
    syllabusSection: "Burns",
    summary:
      "A tissue injury defined by depth and extent, where early triage, fluid resuscitation, and referral decisions can change outcome.",
    hallmarkMorphology: [
      "Superficial erythema",
      "Partial-thickness blistering",
      "Full-thickness leathery or charred tissue",
    ],
    commonBodySites: ["Hands", "Face", "Feet", "Trunk", "Extremities"],
    symptoms: ["Pain", "Fluid loss", "Functional impairment", "Risk of infection"],
    managementBasics: [
      "Assess airway, breathing, circulation, burn depth, and TBSA early",
      "Use burn-center referral criteria for high-risk sites, large burns, inhalation injury, and special populations",
      "Monitor capillary refill and depth because these guide grafting decisions",
    ],
    redFlags: [
      "Face, hands, feet, genital, perineal, or major-joint burns",
      "Large TBSA involvement or inhalation injury",
      "Circumferential burns threatening perfusion",
    ],
    followUpPearls: [
      "A painful blistering burn is often more superficial than an insensate leathery burn",
      "The stasis zone is salvageable if resuscitation and wound care go well",
    ],
  }),
  createLfCondition({
    id: "cond-lf-marjolin-ulcer",
    name: "Marjolin Ulcer",
    slug: "marjolin-ulcer",
    category: "skin_cancer",
    description:
      "Marjolin ulcer is squamous cell carcinoma arising in a chronic scar or ulcer, classically an old burn scar. LF notes emphasize that any wound failing to heal despite appropriate treatment should be biopsied because this malignancy can be aggressive.",
    clinicalFeatures: [
      "Chronic scar or ulcer that stops behaving like a simple wound",
      "Flat indurated lesion with elevated margins",
      "History of longstanding burn scar or chronic inflammation",
      "Biopsy required for diagnosis",
    ],
    syllabusSection: "Leg ulcers",
    summary:
      "An aggressive SCC arising in a chronic wound or scar, especially when a burn scar changes or stops healing.",
    hallmarkMorphology: [
      "Indurated ulcer in a chronic scar",
      "Elevated rolled or thickened margins",
      "Persistent nonhealing wound",
    ],
    commonBodySites: ["Chronic burn scars", "Longstanding ulcers", "Lower legs"],
    symptoms: ["Persistent nonhealing wound", "Bleeding", "Pain", "Growth"],
    managementBasics: [
      "Biopsy chronic wounds that do not respond as expected",
      "Treat as cutaneous SCC once confirmed",
      "Do not repeatedly assume chronic inflammation explains a changing scar",
    ],
    redFlags: [
      "Any wound not healing after months of appropriate care",
      "New induration, bleeding, or rapid change within an old scar",
    ],
    followUpPearls: [
      "Chronic wound behavior can hide malignancy",
      "The biopsy threshold should be low when the course no longer fits the wound type",
    ],
  }),
];

const infectionConditions: Condition[] = [
  createLfCondition({
    id: "cond-lf-impetigo",
    name: "Impetigo",
    slug: "impetigo",
    category: "infection",
    description:
      "Impetigo is a superficial bacterial infection of the skin. LF notes emphasize the classic honey-colored crust of nonbullous impetigo, the neonatal and infant predilection of bullous disease, and escalation to oral antibiotics when topical therapy is insufficient.",
    clinicalFeatures: [
      "Honey-colored crusted erosions",
      "Superficial infection often arising on traumatized skin",
      "Bullous disease caused by Staphylococcus aureus",
      "Can complicate eczema or other barrier-disrupting dermatoses",
    ],
    syllabusSection: "Skin and soft tissue infections",
    summary:
      "A superficial bacterial infection where honey-colored crust is the high-yield visual clue.",
    hallmarkMorphology: [
      "Golden crusted erosions",
      "Superficial moist erosions",
      "Fragile bullae in bullous disease",
    ],
    commonBodySites: ["Perioral skin", "Nose", "Face", "Extremities"],
    symptoms: ["Mild itch", "Crusting", "Local tenderness"],
    managementBasics: [
      "Use topical antibiotics for limited disease",
      "Escalate to oral therapy when the eruption is extensive or refractory",
      "Address the underlying barrier problem if eczema or trauma opened the door to infection",
    ],
    redFlags: [
      "Extensive disease in an infant",
      "Failure of local therapy or signs of deeper infection",
    ],
    followUpPearls: [
      "Impetigo is more superficial than erysipelas",
      "Bullae often rupture before the patient is examined",
    ],
  }),
  createLfCondition({
    id: "cond-lf-erysipelas",
    name: "Erysipelas",
    slug: "erysipelas",
    category: "infection",
    description:
      "Erysipelas is a bacterial infection of the dermis and upper subcutaneous tissue, classically caused by group A streptococcus. LF notes highlight a sharply demarcated bright-red tender plaque with fever and systemic symptoms.",
    clinicalFeatures: [
      "Sharply demarcated warm erythematous plaque",
      "Raised advancing margin",
      "Tenderness with systemic symptoms such as fever or myalgias",
      "Deeper process than impetigo",
    ],
    syllabusSection: "Skin and soft tissue infections",
    summary:
      "A streptococcal skin infection with a vivid red, sharply marginated plaque and constitutional symptoms.",
    hallmarkMorphology: [
      "Bright red plaque",
      "Raised border",
      "Sharp demarcation from normal skin",
    ],
    commonBodySites: ["Face", "Lower legs"],
    symptoms: ["Fever", "Chills", "Tenderness", "Warmth"],
    managementBasics: [
      "Treat with systemic antibiotics rather than topical therapy",
      "Assess for portals of entry such as fissures, ulcers, or edema",
      "Monitor for progression or recurrent episodes in chronic edema",
    ],
    redFlags: [
      "Toxic appearance or rapid extension",
      "Immunocompromise or recurrent lower-limb disease",
    ],
    followUpPearls: [
      "The border is usually more sharply defined than in deeper cellulitis",
      "Systemic symptoms are part of the classic presentation",
    ],
  }),
  createLfCondition({
    id: "cond-lf-tinea-capitis",
    name: "Tinea Capitis",
    slug: "tinea-capitis",
    category: "infection",
    description:
      "Tinea capitis is a contagious dermatophyte infection of the scalp, especially in children. LF notes stress scaly alopecic patches, broken hairs with black dots, kerion as a key complication, and the need for oral rather than topical antifungal therapy.",
    clinicalFeatures: [
      "Scaly scalp patches with hair breakage and alopecia",
      "Black dots from broken hairs",
      "Pruritus and occipital lymphadenopathy may occur",
      "Inflammatory kerion can scar if not treated promptly",
    ],
    syllabusSection: "Skin and soft tissue infections",
    summary:
      "A scalp dermatophyte infection where hair-shaft invasion makes oral treatment essential.",
    hallmarkMorphology: [
      "Scaly alopecic plaque",
      "Broken hairs or black dots",
      "Boggy inflammatory kerion in severe disease",
    ],
    commonBodySites: ["Scalp"],
    symptoms: ["Pruritus", "Hair loss", "Tenderness in inflammatory disease"],
    managementBasics: [
      "Start oral antifungal therapy without waiting for culture results",
      "Evaluate close contacts and hygiene practices",
      "Watch for inflammatory disease that threatens permanent alopecia",
    ],
    redFlags: [
      "Kerion",
      "Scarring alopecia risk",
      "Extensive disease in an immunocompromised patient",
    ],
    followUpPearls: [
      "Topical therapy alone does not reach the infected hair shaft",
      "A round scaly bald patch in a child should make you think tinea until proven otherwise",
    ],
  }),
  createLfCondition({
    id: "cond-lf-tinea-pedis",
    name: "Tinea Pedis",
    slug: "tinea-pedis",
    category: "infection",
    description:
      "Tinea pedis is a dermatophyte infection of the feet. LF notes highlight interdigital and moccasin patterns, occasional bullous or ulcerative variants, and the importance of footwear hygiene and treating associated onychomycosis.",
    clinicalFeatures: [
      "Scaly erythematous sharply demarcated foot eruption",
      "Interdigital maceration or moccasin distribution",
      "Pruritus and fissuring",
      "May coexist with nail fungus as a reservoir",
    ],
    syllabusSection: "Skin and soft tissue infections",
    summary:
      "A dermatophyte infection of the feet that often recurs unless footwear habits and nail reservoirs are addressed.",
    hallmarkMorphology: [
      "Interdigital scale and maceration",
      "Moccasin-pattern hyperkeratosis",
      "Occasional vesiculobullous flare",
    ],
    commonBodySites: ["Toe webs", "Plantar feet", "Lateral foot"],
    symptoms: ["Pruritus", "Burning", "Fissuring", "Scale"],
    managementBasics: [
      "Use topical antifungals first for localized disease",
      "Escalate to oral therapy when extensive or refractory",
      "Address footwear hygiene and onychomycosis to reduce recurrence",
    ],
    redFlags: [
      "Ulcerative disease or secondary bacterial infection",
      "Severe recurrent infection in a patient with diabetes",
    ],
    followUpPearls: [
      "Tinea pedis can quietly seed reinfection elsewhere",
      "A fungal nail reservoir can make treatment seem to fail",
    ],
  }),
  createLfCondition({
    id: "cond-lf-tinea-versicolor",
    name: "Tinea Versicolor (Pityriasis Versicolor)",
    slug: "tinea-versicolor",
    category: "infection",
    description:
      "Tinea versicolor is a superficial Malassezia yeast eruption that produces fine scale and pigment change on the upper trunk. LF notes emphasize hypo- or hyperpigmented macules and the classic KOH pattern described as spaghetti and meatballs.",
    clinicalFeatures: [
      "Hypopigmented or hyperpigmented macules and patches",
      "Fine surface scale",
      "Upper trunk predominance",
      "Recurrence is common",
    ],
    syllabusSection: "Skin and soft tissue infections",
    summary:
      "A superficial yeast eruption of the trunk marked by fine scale and dyspigmentation rather than dramatic inflammation.",
    hallmarkMorphology: [
      "Patchy dyspigmentation",
      "Fine inducible scale",
      "Confluent macules on the trunk",
    ],
    commonBodySites: ["Upper chest", "Back", "Shoulders", "Upper arms"],
    symptoms: ["Usually mild or asymptomatic", "Cosmetic pigment change", "Occasional itch"],
    managementBasics: [
      "Use selenium sulfide or topical antifungal therapy for limited disease",
      "Counsel that pigment often normalizes more slowly than the scale resolves",
      "Reserve oral antifungals for more extensive or recurrent disease when appropriate",
    ],
    redFlags: [
      "Refractory widespread disease raising doubt about the diagnosis",
      "Marked dyspigmentation causing major distress",
    ],
    followUpPearls: [
      "The terminology says tinea, but the organism is Malassezia yeast rather than a dermatophyte",
      "Residual pigment change does not always mean treatment failure",
    ],
  }),
  createLfCondition({
    id: "cond-lf-herpes-simplex",
    name: "Herpes Simplex",
    slug: "herpes-simplex",
    category: "infection",
    description:
      "Herpes simplex is a lifelong recurrent infection caused by HSV-1 or HSV-2. LF notes emphasize grouped vesicles on an erythematous base, a tingling or burning prodrome, and triggers such as sunlight, fever, stress, menstruation, or trauma.",
    clinicalFeatures: [
      "Grouped vesicles on an erythematous base",
      "Prodromal tingling, burning, or itch",
      "Recurrent episodes at the same site",
      "Regional tenderness or systemic symptoms in primary infection",
    ],
    syllabusSection: "Skin and soft tissue infections",
    summary:
      "A recurrent vesicular eruption whose prodrome and grouped morphology are more distinctive than its size.",
    hallmarkMorphology: [
      "Herpetiform clusters of vesicles",
      "Erythematous base",
      "Crusting erosions after rupture",
    ],
    commonBodySites: ["Lips", "Perioral skin", "Genital skin", "Fingers"],
    symptoms: ["Burning", "Tingling", "Pain", "Tender lymph nodes"],
    managementBasics: [
      "Use topical or oral antivirals depending on severity and timing",
      "Ask about triggers and recurrence pattern",
      "Consider special-site variants such as herpetic whitlow or gladiatorum",
    ],
    redFlags: [
      "Extensive disease in an immunocompromised patient",
      "Ocular involvement or severe primary infection",
    ],
    followUpPearls: [
      "Grouped vesicles plus prodrome is the classic exam clue",
      "Recurrence pattern often matters more than a single isolated lesion appearance",
    ],
    aliases: ["Cold sores", "HSV infection"],
  }),
  createLfCondition({
    id: "cond-lf-verruca",
    name: "Verruca Vulgaris",
    slug: "verruca",
    category: "infection",
    description:
      "Verrucae are HPV-driven warts that can koebnerize with trauma. LF notes describe sharply demarcated papillomatous papules, a fimbriated surface, thrombosed capillary dots, and the fact that spontaneous resolution is common.",
    clinicalFeatures: [
      "Papillomatous hyperkeratotic papule",
      "Punctate black dots from thrombosed capillaries",
      "Trauma can spread lesions locally",
      "Hands and feet are common sites",
    ],
    syllabusSection: "Skin and soft tissue infections",
    summary:
      "An HPV wart with a rough papillomatous surface and pinpoint thrombosed capillaries.",
    hallmarkMorphology: [
      "Hyperkeratotic papule",
      "Papillomatous or fimbriated surface",
      "Black punctate dots when pared",
    ],
    commonBodySites: ["Hands", "Fingers", "Feet", "Periungual skin"],
    symptoms: ["Usually asymptomatic", "Tenderness on pressure in plantar warts"],
    managementBasics: [
      "Use keratolytics or destructive therapy based on burden and site",
      "Explain autoinoculation and the value of avoiding picking",
      "Consider watchful waiting when lesions are limited and not bothersome",
    ],
    redFlags: [
      "Atypical pigmented or rapidly changing lesion that may not be a wart",
      "Painful plantar lesion with diagnostic uncertainty",
    ],
    followUpPearls: [
      "Plantar pressure can flatten the wart and hide its exophytic look",
      "The black dots are a very helpful clinical clue",
    ],
    aliases: ["Common wart", "Verrucae"],
  }),
  createLfCondition({
    id: "cond-lf-molluscum",
    name: "Molluscum Contagiosum",
    slug: "molluscum-contagiosum",
    category: "infection",
    description:
      "Molluscum contagiosum is a poxvirus infection seen most often in children, though extensive disease can occur in immunocompromised patients. LF notes emphasize discrete flesh-colored dome-shaped umbilicated papules and spread by direct contact or autoinoculation.",
    clinicalFeatures: [
      "Discrete dome-shaped umbilicated papules",
      "Flesh-colored or pink lesions",
      "Spread by scratching or direct contact",
      "Can be numerous in immunocompromised patients",
    ],
    syllabusSection: "Skin and soft tissue infections",
    summary:
      "A poxvirus eruption of umbilicated papules that often spreads by scratching.",
    hallmarkMorphology: [
      "Umbilicated papule",
      "Smooth dome-shaped surface",
      "Clustered lesions in typical childhood sites",
    ],
    commonBodySites: ["Face", "Eyelids", "Axillae", "Antecubital fossae", "Upper thighs"],
    symptoms: ["Usually asymptomatic", "Occasional irritation", "Cosmetic concern"],
    managementBasics: [
      "Recognize the morphology clinically before defaulting to destructive treatment",
      "Discuss self-limited behavior in many children",
      "Treat or escalate when lesions are numerous, inflamed, or problematic for the patient",
    ],
    redFlags: [
      "Extensive disease suggesting immunocompromise",
      "Secondary eczema or irritation around lesions",
    ],
    followUpPearls: [
      "The central umbilication is the signature finding",
      "Autoinoculation explains the spread pattern in many children",
    ],
  }),
];

const drugEruptionConditions: Condition[] = [
  createLfCondition({
    id: "cond-lf-drug-eruption",
    name: "Drug Eruption",
    slug: "drug-eruption",
    category: "drug_eruption",
    description:
      "Morbilliform or exanthematous drug eruption is the most common delayed cutaneous drug reaction. LF notes emphasize that it is usually inflammatory, generalized, symmetric, and timed to medication exposure about 7 to 10 days after initiation.",
    clinicalFeatures: [
      "Generalized symmetric erythematous eruption",
      "Macules and papules beginning on the trunk",
      "Pruritus and mild fever may occur",
      "Medication timing is central to diagnosis",
    ],
    syllabusSection: "Drug eruptions",
    summary:
      "The most common delayed cutaneous drug reaction, usually a symmetric morbilliform exanthem tied to a recent medication start.",
    hallmarkMorphology: [
      "Diffuse erythematous macules and papules",
      "Symmetric trunk-first spread",
      "No fixed single-site recurrence pattern",
    ],
    commonBodySites: ["Trunk", "Extremities", "Generalized skin"],
    symptoms: ["Pruritus", "Mild fever", "Diffuse redness"],
    managementBasics: [
      "Take a careful medication timeline, including intermittent and OTC agents",
      "Stop the culprit when possible and document the reaction clearly",
      "Use symptomatic treatment with topical steroids and antihistamines when appropriate",
    ],
    redFlags: [
      "Mucosal involvement suggesting SJS/TEN instead",
      "Facial edema, eosinophilia, or organ symptoms suggesting DRESS",
    ],
    followUpPearls: [
      "The medication history is often the diagnostic test",
      "Many rashes that look simple at first are actually early severe drug reactions",
    ],
  }),
  createLfCondition({
    id: "cond-lf-fixed-drug-eruption",
    name: "Fixed Drug Eruption",
    slug: "fixed-drug-eruption",
    category: "drug_eruption",
    description:
      "Fixed drug eruption is a delayed drug reaction that recurs in the same site with re-exposure. LF notes highlight sharply localized erythematous patches or plaques, common genital involvement, and evolution to bulla or erosion followed by residual hyperpigmentation.",
    clinicalFeatures: [
      "Solitary or limited sharply localized lesion",
      "Recurs at the same site with the culprit drug",
      "Can blister and erode",
      "Leaves postinflammatory hyperpigmentation",
    ],
    syllabusSection: "Drug eruptions",
    summary:
      "A site-fixed drug reaction that reliably comes back in the same place after re-exposure.",
    hallmarkMorphology: [
      "Well-defined erythematous patch or plaque",
      "Possible bulla or erosion",
      "Residual dark pigmentation after healing",
    ],
    commonBodySites: ["Genital skin", "Lips", "Hands", "Trunk"],
    symptoms: ["Burning", "Tenderness", "Recurrent site-specific eruption"],
    managementBasics: [
      "Identify and stop the culprit medication",
      "Use topical anti-inflammatory care and wound care for eroded lesions",
      "Teach the patient that future exposures can trigger the same site again",
    ],
    redFlags: [
      "Generalized or multifocal disease rather than a classic fixed pattern",
      "Erosion involving a functionally sensitive mucosal site",
    ],
    followUpPearls: [
      "The fixed location is the key teaching clue",
      "Residual pigmentation is a common long-tail finding after the flare resolves",
    ],
  }),
  createLfCondition({
    id: "cond-lf-dress",
    name: "DRESS Syndrome",
    slug: "dress",
    category: "drug_eruption",
    description:
      "DRESS syndrome, also called DIHS, is a severe delayed drug hypersensitivity reaction. LF notes emphasize a morbilliform eruption plus fever, malaise, lymphadenopathy, eosinophilia, and internal-organ involvement that distinguishes it from an uncomplicated exanthematous eruption.",
    clinicalFeatures: [
      "Morbilliform eruption with facial edema or generalized inflammation",
      "Fever and malaise",
      "Eosinophilia or atypical bloodwork",
      "Liver, kidney, or other organ involvement",
    ],
    syllabusSection: "Drug eruptions",
    summary:
      "A severe drug hypersensitivity syndrome where a rash is only one part of a systemic inflammatory reaction.",
    hallmarkMorphology: [
      "Diffuse inflammatory morbilliform eruption",
      "Facial edema or widespread infiltration",
      "Generalized symmetric spread",
    ],
    commonBodySites: ["Trunk", "Extremities", "Face"],
    symptoms: ["Fever", "Malaise", "Pruritus", "Systemic symptoms"],
    managementBasics: [
      "Stop all suspected nonessential culprit medications immediately",
      "Check for organ involvement rather than treating it like a skin-only eruption",
      "Escalate dermatology and medical support early when systemic disease is present",
    ],
    redFlags: [
      "Eosinophilia with hepatitis, nephritis, or other organ dysfunction",
      "Rapid progression despite withdrawal of the culprit",
    ],
    followUpPearls: [
      "DRESS can look morbilliform at first, so systemic review is critical",
      "Documentation matters because re-exposure can be dangerous",
    ],
    aliases: [
      "Drug Reaction with Eosinophilia and Systemic Symptoms",
      "DIHS",
    ],
  }),
  createLfCondition({
    id: "cond-lf-sjs-ten",
    name: "Stevens-Johnson Syndrome / Toxic Epidermal Necrolysis",
    slug: "sjs-ten",
    category: "drug_eruption",
    description:
      "SJS and TEN are life-threatening mucocutaneous drug reactions defined by extensive epidermal necrosis and detachment. LF notes emphasize the classic early pattern of flu-like symptoms plus a small rash plus mucosal involvement, followed by dusky macules, flaccid bullae, and sheet-like skin loss.",
    clinicalFeatures: [
      "Prodromal fever and malaise before rash",
      "Painful mucosal erosions involving mouth, eyes, or genitalia",
      "Dusky erythematous macules that coalesce",
      "Detachable epidermis and flaccid bullae",
    ],
    syllabusSection: "Drug eruptions",
    summary:
      "A dermatologic emergency where mucosal disease, skin pain, and epidermal detachment after a medication exposure demand immediate escalation.",
    hallmarkMorphology: [
      "Dusky atypical targetoid macules",
      "Flaccid bullae and skin detachment",
      "Prominent mucosal erosion",
    ],
    commonBodySites: ["Face", "Upper trunk", "Proximal extremities", "Mucosa"],
    symptoms: ["Fever", "Skin pain", "Mucosal pain", "Ocular symptoms"],
    managementBasics: [
      "Stop the culprit medication immediately",
      "Escalate supportive care early, often with burn-unit-level support when extensive",
      "Involve ophthalmology promptly when ocular involvement is present",
    ],
    redFlags: [
      "Any mucocutaneous eruption with fever and skin pain after a new drug",
      "Detached or detachable epidermis",
      "Ocular, genital, or airway involvement",
    ],
    followUpPearls: [
      "Think about SJS/TEN before assuming a severe rash is just a bad drug exanthem",
      "Extent of skin loss is used to separate SJS, overlap, and TEN",
    ],
    aliases: ["SJS/TEN", "SJS", "TEN"],
  }),
];

const genodermatosisConditions: Condition[] = [
  createLfCondition({
    id: "cond-lf-tuberous-sclerosis",
    name: "Tuberous Sclerosis",
    slug: "tuberous-sclerosis",
    category: "genodermatosis",
    description:
      "Tuberous sclerosis is a multisystem genetic disease with hamartomas in the brain, skin, kidneys, heart, and other organs. LF notes emphasize ash-leaf macules, facial angiofibromas, shagreen patches, ungual fibromas, seizures, and renal angiomyolipomas.",
    clinicalFeatures: [
      "Ash-leaf hypopigmented macules",
      "Facial angiofibromas",
      "Shagreen patch or ungual fibromas",
      "Neurologic or renal comorbidity",
    ],
    syllabusSection: "Genodermatosis",
    summary:
      "A multisystem hamartoma syndrome where a handful of classic skin lesions can uncover major neurologic and renal disease.",
    hallmarkMorphology: [
      "Ash-leaf macules",
      "Facial angiofibromas",
      "Shagreen patch",
    ],
    commonBodySites: ["Face", "Trunk", "Nails"],
    symptoms: ["Seizures", "Developmental concerns", "Skin lesions"],
    managementBasics: [
      "Recognize the skin findings as a gateway to systemic screening",
      "Coordinate brain and abdominal surveillance when the syndrome is suspected",
      "Use genetics and multidisciplinary follow-up early",
    ],
    redFlags: [
      "New seizures or developmental regression",
      "Renal or intracranial mass-related symptoms",
    ],
    followUpPearls: [
      "Fibrous papules on the face are not always simple acneiform lesions",
      "Multiple skin clues often coexist and make the diagnosis more obvious over time",
    ],
  }),
  createLfCondition({
    id: "cond-lf-peutz-jeghers",
    name: "Peutz-Jeghers Syndrome",
    slug: "peutz-jeghers-syndrome",
    category: "genodermatosis",
    description:
      "Peutz-Jeghers syndrome is an inherited hamartomatous polyposis syndrome with markedly increased cancer risk. LF notes emphasize hyperpigmented macules of the lips and oral mucosa that often appear in childhood and may fade later.",
    clinicalFeatures: [
      "Dark macules on lips and oral mucosa",
      "Perioral, acral, or genital melanotic macules",
      "Hamartomatous GI polyps",
      "Strong inherited cancer risk",
    ],
    syllabusSection: "Genodermatosis",
    summary:
      "A cancer-predisposition syndrome where childhood mucocutaneous macules can be the first visible clue.",
    hallmarkMorphology: [
      "Small dark melanotic macules",
      "Lip and oral mucosal prominence",
      "Periorificial and acral pigment spotting",
    ],
    commonBodySites: ["Lips", "Oral mucosa", "Hands", "Feet", "Genital skin"],
    symptoms: ["Often asymptomatic skin lesions", "GI symptoms when polyps complicate"],
    managementBasics: [
      "Do not dismiss the pigment pattern as isolated freckles",
      "Link the skin findings to GI and cancer surveillance",
      "Recommend genetics-informed multidisciplinary follow-up",
    ],
    redFlags: [
      "GI bleeding, obstruction, or abdominal pain",
      "Strong family cancer history with characteristic pigmentary change",
    ],
    followUpPearls: [
      "The mucosal and lip distribution is especially helpful diagnostically",
      "Pigment can fade with age even though the cancer risk persists",
    ],
  }),
  createLfCondition({
    id: "cond-lf-nf1",
    name: "Neurofibromatosis Type 1",
    slug: "neurofibromatosis-type-1",
    category: "genodermatosis",
    description:
      "Neurofibromatosis type 1 is a multisystem tumor-predisposition syndrome. LF notes highlight cafe-au-lait macules, neurofibromas, plexiform lesions, optic glioma risk, Lisch nodules, scoliosis, and blood pressure screening.",
    clinicalFeatures: [
      "Multiple cafe-au-lait macules",
      "Cutaneous neurofibromas",
      "Plexiform neurofibroma risk",
      "Ophthalmic, neurologic, skeletal, or vascular complications",
    ],
    syllabusSection: "Genodermatosis",
    summary:
      "A neurocutaneous syndrome where pigmentary change and soft tumors on the skin can signal deeper neurologic and vascular disease.",
    hallmarkMorphology: [
      "Cafe-au-lait patches",
      "Soft papular neurofibromas",
      "Plexiform or nodular tumors",
    ],
    commonBodySites: ["Trunk", "Extremities", "Iris", "Peripheral nerves"],
    symptoms: ["Skin lesions", "Learning difficulties", "Vision concerns", "Painful tumors"],
    managementBasics: [
      "Screen beyond the skin, including vision and blood pressure",
      "Escalate painful, deforming, or enlarging tumors for specialist assessment",
      "Use longitudinal surveillance rather than a one-time diagnosis mindset",
    ],
    redFlags: [
      "Rapid change in a plexiform lesion",
      "Visual symptoms or neurologic decline",
      "Hypertension suggesting renal artery or pheochromocytoma involvement",
    ],
    followUpPearls: [
      "The skin findings are often the entry point to diagnosis",
      "Plexiform lesions deserve more caution than ordinary small cutaneous neurofibromas",
    ],
  }),
  createLfCondition({
    id: "cond-lf-ichthyosis-vulgaris",
    name: "Ichthyosis Vulgaris",
    slug: "ichthyosis-vulgaris",
    category: "genodermatosis",
    description:
      "Ichthyosis vulgaris is an inherited scaling disorder that causes dry scaly skin of variable severity. LF notes frame it as a hereditary disorder treated primarily with emollients and skin softening, with retinoids considered in selected cases.",
    clinicalFeatures: [
      "Generalized xerosis with scale",
      "Variable severity across patients",
      "Chronic inherited pattern",
      "Often more notable on extensor skin",
    ],
    syllabusSection: "Genodermatosis",
    summary:
      "A hereditary disorder of keratinization that presents as persistent dry scaly skin rather than episodic inflammation.",
    hallmarkMorphology: [
      "Fine to plate-like scale",
      "Diffuse xerosis",
      "Chronic rough texture",
    ],
    commonBodySites: ["Extremities", "Trunk"],
    symptoms: ["Dryness", "Rough skin", "Cosmetic scale"],
    managementBasics: [
      "Use daily emollients and skin-softening regimens",
      "Treat the barrier problem consistently rather than only during flares",
      "Escalate when severity or associated syndromic clues warrant further workup",
    ],
    redFlags: [
      "Severe disease with syndromic features or diagnostic uncertainty",
      "Complications from skin cracking or major barrier dysfunction",
    ],
    followUpPearls: [
      "This is a chronic texture disorder, not a transient eczematous flare",
      "Consistency of skin care is more important than episodic rescue therapy",
    ],
  }),
  createLfCondition({
    id: "cond-lf-eds-vascular",
    name: "Ehlers-Danlos Syndrome (Vascular Type)",
    slug: "ehlers-danlos-syndrome-vascular-type",
    category: "genodermatosis",
    description:
      "Vascular Ehlers-Danlos syndrome is a connective-tissue disorder with serious arterial and organ fragility. LF notes highlight thin translucent skin, abnormal scarring, small-joint hypermobility, and major vascular, uterine, intestinal, and pulmonary complications.",
    clinicalFeatures: [
      "Thin translucent skin",
      "Abnormal scarring",
      "Small-joint hypermobility",
      "Risk of arterial or organ rupture",
    ],
    syllabusSection: "Genodermatosis",
    summary:
      "A high-risk connective-tissue syndrome where subtle skin fragility can signal life-threatening vascular disease.",
    hallmarkMorphology: [
      "Thin translucent skin",
      "Fragile abnormal scars",
      "Prematurely aged facial or hand appearance",
    ],
    commonBodySites: ["Hands", "Face", "General skin"],
    symptoms: ["Easy bruising", "Joint laxity", "Pain from complications"],
    managementBasics: [
      "Treat the skin findings as a clue to systemic fragility",
      "Avoid unnecessary invasive vascular procedures when possible",
      "Coordinate genetics and vascular surveillance",
    ],
    redFlags: [
      "Sudden severe pain suggesting dissection or rupture",
      "Pregnancy or surgical planning in a suspected patient",
    ],
    followUpPearls: [
      "Skin signs may look mild compared with the internal risk",
      "Vascular subtype management is fundamentally different from flexible-joint EDS stereotypes",
    ],
  }),
  createLfCondition({
    id: "cond-lf-eb",
    name: "Epidermolysis Bullosa",
    slug: "epidermolysis-bullosa",
    category: "genodermatosis",
    description:
      "Epidermolysis bullosa is a group of inherited disorders causing blistering from minor trauma or friction. LF notes emphasize painful recurrent blistering, tissue fragility, nail loss, scarring, infection risk, and the central role of wound prevention and protection.",
    clinicalFeatures: [
      "Blistering with minimal trauma",
      "Painful erosions and recurrent wounds",
      "Nail loss or dystrophy",
      "Scarring and infection risk",
    ],
    syllabusSection: "Genodermatosis",
    summary:
      "A hereditary skin-fragility syndrome where routine friction can create painful blisters and chronic wounds.",
    hallmarkMorphology: [
      "Trauma-induced bullae",
      "Erosions and crusted wounds",
      "Scarring or nail loss in more severe disease",
    ],
    commonBodySites: ["Hands", "Feet", "Trauma-prone skin", "Mucosa"],
    symptoms: ["Pain", "Blistering", "Wound care burden", "Functional limitation"],
    managementBasics: [
      "Prioritize friction reduction and protective wound care",
      "Treat secondary infection promptly",
      "Coordinate multidisciplinary support for nutrition, pain, and chronic wound needs",
    ],
    redFlags: [
      "Failure to thrive or severe mucosal involvement",
      "Extensive chronic wounds with infection or tumor risk",
    ],
    followUpPearls: [
      "Severity ranges widely, so the history of trauma-induced blistering is crucial",
      "Good wound prevention often matters as much as active wound treatment",
    ],
  }),
  createLfCondition({
    id: "cond-lf-hht",
    name: "Hereditary Hemorrhagic Telangiectasia",
    slug: "hereditary-hemorrhagic-telangiectasia",
    category: "genodermatosis",
    description:
      "Hereditary hemorrhagic telangiectasia is an inherited vascular dysplasia syndrome with bleeding and AVMs. LF notes emphasize recurrent epistaxis, punctate telangiectasias, and potentially serious pulmonary, hepatic, cerebral, and GI involvement.",
    clinicalFeatures: [
      "Multiple punctate telangiectasias",
      "Recurrent nosebleeds",
      "Family history of vascular malformations or bleeding",
      "Possible visceral AVM complications",
    ],
    syllabusSection: "Genodermatosis",
    summary:
      "A telangiectasia syndrome where small visible vascular lesions can point to major internal AVMs and chronic bleeding.",
    hallmarkMorphology: [
      "Multiple punctate telangiectasias",
      "Mucocutaneous vascular spots",
      "Bleeding-prone lesions",
    ],
    commonBodySites: ["Lips", "Oral mucosa", "Hands", "Face", "Nasal mucosa"],
    symptoms: ["Epistaxis", "Bleeding", "Anemia-related fatigue"],
    managementBasics: [
      "Screen beyond the visible skin lesions for visceral AVMs",
      "Manage bleeding burden and coordinate specialty care",
      "Use the skin findings to prompt genetics-informed evaluation",
    ],
    redFlags: [
      "Neurologic symptoms suggesting cerebral AVM",
      "Dyspnea or major bleeding",
      "Progressive anemia or GI bleeding",
    ],
    followUpPearls: [
      "Recurrent epistaxis is often the earliest clinical clue",
      "Small telangiectasias can represent a much larger vascular syndrome",
    ],
  }),
  createLfCondition({
    id: "cond-lf-hypohidrotic-ectodermal-dysplasia",
    name: "Hypohidrotic Ectodermal Dysplasia",
    slug: "hypohidrotic-ectodermal-dysplasia",
    category: "genodermatosis",
    description:
      "Hypohidrotic ectodermal dysplasia is an inherited ectodermal disorder affecting sweat glands, hair, teeth, and sometimes nails. LF notes emphasize hypotrichosis, hypodontia, hypohidrosis, heat intolerance, and supportive multidisciplinary management.",
    clinicalFeatures: [
      "Sparse brittle hair",
      "Conical, missing, or reduced teeth",
      "Reduced sweating with heat intolerance",
      "Nail and facial features may contribute to the phenotype",
    ],
    syllabusSection: "Genodermatosis",
    summary:
      "An ectodermal development disorder where poor sweating, abnormal dentition, and sparse hair are the signature triad.",
    hallmarkMorphology: [
      "Sparse brittle hair",
      "Hypodontia or cone-shaped teeth",
      "Dry skin with reduced sweating",
    ],
    commonBodySites: ["Scalp", "Teeth", "Skin", "Nails"],
    symptoms: ["Heat intolerance", "Dryness", "Hair thinning"],
    managementBasics: [
      "Teach heat-avoidance and cooling strategies early",
      "Coordinate dental, dermatologic, and supportive care",
      "Recognize eczema-like skin care needs as part of the syndrome",
    ],
    redFlags: [
      "Heat exhaustion or unexplained fevers in a child",
      "Failure to recognize thermoregulatory dysfunction",
    ],
    followUpPearls: [
      "Lack of sweating is the high-yield safety issue",
      "The syndrome is easier to recognize when hair, teeth, and sweat findings are considered together",
    ],
  }),
  createLfCondition({
    id: "cond-lf-nail-patella",
    name: "Nail-Patella Syndrome",
    slug: "nail-patella-syndrome",
    category: "genodermatosis",
    description:
      "Nail-patella syndrome is a genetic disorder affecting nails, joints, and other systems. LF notes highlight absent or underdeveloped nails, ridging or pitting, knee and elbow abnormalities, and the need to monitor renal and ocular complications.",
    clinicalFeatures: [
      "Hypoplastic or absent nails",
      "Ridged, split, or pitted nail changes",
      "Associated skeletal abnormalities of knees or elbows",
      "Possible renal disease or glaucoma",
    ],
    syllabusSection: "Genodermatosis",
    summary:
      "A nail-predominant genetic syndrome that should prompt joint, renal, and ocular surveillance.",
    hallmarkMorphology: [
      "Hypoplastic nails",
      "Ridging, splitting, or pitting",
      "Characteristic chronic nail dysplasia",
    ],
    commonBodySites: ["Fingernails", "Knees", "Elbows"],
    symptoms: ["Chronic nail deformity", "Joint symptoms", "Possible renal manifestations"],
    managementBasics: [
      "Recognize the nail pattern as a syndromic clue rather than isolated dystrophy",
      "Monitor blood pressure and renal parameters longitudinally",
      "Include ophthalmic surveillance when appropriate",
    ],
    redFlags: [
      "Proteinuria, hypertension, or progressive renal dysfunction",
      "Visual symptoms suggesting glaucoma",
    ],
    followUpPearls: [
      "The nails often provide the easiest visible clue to diagnosis",
      "Systemic monitoring matters even when the skin and nails dominate the presentation",
    ],
  }),
  createLfCondition({
    id: "cond-lf-incontinentia-pigmenti",
    name: "Incontinentia Pigmenti",
    slug: "incontinentia-pigmenti",
    category: "genodermatosis",
    description:
      "Incontinentia pigmenti is an X-linked disorder affecting skin, hair, nails, teeth, eyes, and the nervous system. LF notes describe staged skin findings from blistering to wart-like eruption to swirling hyperpigmentation and later linear hypopigmentation.",
    clinicalFeatures: [
      "Blistering eruption early in life",
      "Warty or verrucous phase",
      "Swirling hyperpigmentation then later hypopigmentation",
      "Associated dental, ocular, or neurologic abnormalities",
    ],
    syllabusSection: "Genodermatosis",
    summary:
      "A multisystem ectodermal disorder with a classic staged cutaneous evolution from vesicles to whorled pigment change.",
    hallmarkMorphology: [
      "Linear vesicles or bullae early",
      "Verrucous streaks",
      "Whorled hyperpigmentation",
    ],
    commonBodySites: ["Trunk", "Extremities", "Scalp", "Teeth", "Nails"],
    symptoms: ["Skin eruptions", "Alopecia", "Dental anomalies", "Neurologic symptoms in severe cases"],
    managementBasics: [
      "Recognize the age-dependent morphologic stages",
      "Coordinate ophthalmology, genetics, pediatrics, and developmental follow-up",
      "Treat skin disease supportively while monitoring systemic complications",
    ],
    redFlags: [
      "Seizures or developmental concerns",
      "Ocular disease such as cataract or glaucoma",
    ],
    followUpPearls: [
      "The rash changes stage over time, so old photos and history help",
      "Swirling pigment in a child can be a key diagnostic clue rather than isolated dyspigmentation",
    ],
  }),
];

const pediatricConditions: Condition[] = [
  createLfCondition({
    id: "cond-lf-infantile-hemangioma",
    name: "Infantile Hemangioma",
    slug: "infantile-hemangioma",
    category: "pediatric",
    description:
      "Infantile hemangioma is the most common benign tumor of infancy. LF notes emphasize that lesions may be absent at birth, proliferate during infancy, and can be superficial bright-red, deep bluish, or mixed, with treatment reserved for high-risk location, function, ulceration, or rapid growth.",
    clinicalFeatures: [
      "Appears in infancy and grows during the proliferative phase",
      "Superficial bright-red or deep bluish lesions",
      "Head and neck are common sites",
      "Some lesions threaten airway, vision, feeding, or cosmesis",
    ],
    syllabusSection: "Pediatric rashes",
    summary:
      "A common vascular tumor of infancy that often involutes spontaneously but can threaten function depending on size and location.",
    hallmarkMorphology: [
      "Bright red lobulated superficial plaque",
      "Bluish subcutaneous nodule in deeper lesions",
      "Segmental or multifocal patterns in some infants",
    ],
    commonBodySites: ["Head", "Neck", "Face", "Trunk"],
    symptoms: ["Usually asymptomatic", "Rapid growth", "Ulceration in high-risk sites"],
    managementBasics: [
      "Decide whether the lesion can be safely observed or needs treatment",
      "Treat high-risk lesions early, especially periorbital, airway, lip, or ulcerating lesions",
      "Consider syndromic associations when lesions are large, segmental, or lumbosacral",
    ],
    redFlags: [
      "Periorbital involvement",
      "Airway, lip, or feeding-related involvement",
      "Large segmental facial or lumbosacral lesions",
    ],
    followUpPearls: [
      "Most lesions involute, but the ones that matter clinically matter early",
      "Location can be more important than size when deciding whether to treat",
    ],
  }),
  createLfCondition({
    id: "cond-lf-milia",
    name: "Milia",
    slug: "milia",
    category: "pediatric",
    description:
      "Milia are tiny keratin-filled cysts commonly seen in newborns and infants. LF notes list milia among pediatric eruptions, where the main educational point is recognition and reassurance rather than aggressive treatment.",
    clinicalFeatures: [
      "Tiny white to yellow papules",
      "Superficial keratin cysts",
      "Common in newborns",
      "Usually resolve spontaneously",
    ],
    syllabusSection: "Pediatric rashes",
    summary:
      "A benign eruption of tiny keratin cysts that is common in infants and usually requires reassurance only.",
    hallmarkMorphology: [
      "Pinpoint white papules",
      "Smooth dome-shaped surface",
      "No surrounding inflammation",
    ],
    commonBodySites: ["Face", "Nose", "Cheeks"],
    symptoms: ["Asymptomatic"],
    managementBasics: [
      "Recognize the benign appearance and avoid overtreatment",
      "Reassure families that the lesions usually resolve on their own",
    ],
    redFlags: [
      "An eruption that is inflamed, vesicular, or inconsistent with simple milia",
    ],
    followUpPearls: [
      "Milia are keratin cysts, not infection",
      "Most infant cases resolve without intervention",
    ],
  }),
  createLfCondition({
    id: "cond-lf-erythema-toxicum-neonatorum",
    name: "Erythema Toxicum Neonatorum",
    slug: "erythema-toxicum-neonatorum",
    category: "pediatric",
    description:
      "Erythema toxicum neonatorum is a common benign neonatal eruption included in the LF pediatric-rash list. The key educational goal is recognizing a self-limited newborn rash and differentiating it from infection or a vesiculobullous emergency.",
    clinicalFeatures: [
      "Transient neonatal papules or pustules on an erythematous base",
      "Well-appearing newborn",
      "Self-limited course",
    ],
    syllabusSection: "Pediatric rashes",
    summary:
      "A common self-limited neonatal eruption that is important mainly because it should not be mistaken for infection.",
    hallmarkMorphology: [
      "Erythematous base",
      "Small papules or pustules",
      "Transient scattered newborn eruption",
    ],
    commonBodySites: ["Trunk", "Face", "Proximal limbs"],
    symptoms: ["Typically asymptomatic"],
    managementBasics: [
      "Reassure when the infant is well and the eruption fits the classic benign pattern",
      "Escalate evaluation if systemic illness, grouped vesicles, or an atypical course is present",
    ],
    redFlags: [
      "Ill-appearing infant",
      "Grouped vesicles or erosions suggesting neonatal HSV instead",
    ],
    followUpPearls: [
      "The patient appearance matters as much as the morphology in newborn rash assessment",
    ],
  }),
  createLfCondition({
    id: "cond-lf-tnpm",
    name: "Transient Neonatal Pustular Melanosis",
    slug: "transient-neonatal-pustular-melanosis",
    category: "pediatric",
    description:
      "Transient neonatal pustular melanosis is another benign eruption in the LF pediatric-rash list. The practical teaching point is to recognize the transient pustular phase and the residual pigmented macules that can persist after pustules resolve.",
    clinicalFeatures: [
      "Superficial pustules in a newborn",
      "Residual hyperpigmented macules after rupture",
      "Otherwise well infant",
    ],
    syllabusSection: "Pediatric rashes",
    summary:
      "A benign neonatal pustular eruption notable for the pigmented macules it leaves behind as it resolves.",
    hallmarkMorphology: [
      "Superficial fragile pustules",
      "Residual pigmented macules",
      "Minimal surrounding inflammation",
    ],
    commonBodySites: ["Face", "Trunk", "Extremities"],
    symptoms: ["Typically asymptomatic"],
    managementBasics: [
      "Recognize the benign course and avoid unnecessary treatment",
      "Distinguish it from infectious vesiculopustular neonatal eruptions",
    ],
    redFlags: [
      "Systemic illness or grouped vesicles",
      "Atypical erosive or progressive course",
    ],
    followUpPearls: [
      "Residual pigmentation can be reassuringly normal in this condition",
    ],
  }),
  createLfCondition({
    id: "cond-lf-congenital-dermal-melanocytosis",
    name: "Congenital Dermal Melanocytosis",
    slug: "congenital-dermal-melanocytosis",
    category: "pediatric",
    description:
      "Congenital dermal melanocytosis is a benign birth-present pigmentary lesion included in the LF pediatric-rash list. The main teaching goal is recognizing a harmless dermal pigment lesion and not misclassifying it as trauma or inflammation.",
    clinicalFeatures: [
      "Blue-gray macular pigmentation",
      "Present from birth",
      "Benign and noninflammatory appearance",
    ],
    syllabusSection: "Pediatric rashes",
    summary:
      "A benign congenital dermal pigment patch that should be recognized and documented accurately.",
    hallmarkMorphology: [
      "Blue-gray patch",
      "Flat non-scaly surface",
      "Stable congenital pigment lesion",
    ],
    commonBodySites: ["Lumbosacral area", "Buttocks", "Back"],
    symptoms: ["Asymptomatic"],
    managementBasics: [
      "Recognize and document the benign diagnosis clearly",
      "Differentiate from bruising or inflammatory lesions when history is limited",
    ],
    redFlags: [
      "An atypical location, evolution, or associated systemic findings that do not fit the benign pattern",
    ],
    followUpPearls: [
      "Morphology and birth timing help distinguish it from acquired lesions",
    ],
  }),
  createLfCondition({
    id: "cond-lf-neonatal-cephalic-pustulosis",
    name: "Neonatal Cephalic Pustulosis",
    slug: "neonatal-cephalic-pustulosis",
    category: "pediatric",
    description:
      "Neonatal cephalic pustulosis, sometimes called neonatal acne, is included in the LF pediatric-rash list. The main educational point is recognizing a benign cephalic pustular eruption without overcalling it as infection or severe acne.",
    clinicalFeatures: [
      "Papules and pustules on the face or scalp of a young infant",
      "Cephalic distribution",
      "Benign self-limited course in typical cases",
    ],
    syllabusSection: "Pediatric rashes",
    summary:
      "A benign infant facial pustular eruption centered on the head and face.",
    hallmarkMorphology: [
      "Facial papules and pustules",
      "Cephalic clustering",
      "Minimal comedonal component",
    ],
    commonBodySites: ["Cheeks", "Forehead", "Scalp"],
    symptoms: ["Usually asymptomatic"],
    managementBasics: [
      "Reassure when the appearance and timing fit the typical benign pattern",
      "Escalate only if systemic illness or atypical vesicular change suggests infection",
    ],
    redFlags: ["Grouped vesicles, erosions, or an ill infant suggesting HSV"],
    followUpPearls: [
      "This is not the same disease pattern as adolescent acne vulgaris",
    ],
    aliases: ["Neonatal acne"],
  }),
  createLfCondition({
    id: "cond-lf-neonatal-hsv",
    name: "Neonatal HSV Infection",
    slug: "neonatal-hsv-infection",
    category: "pediatric",
    description:
      "Neonatal HSV infection is a serious neonatal vesicular disease resulting from vertical transmission during childbirth. LF notes emphasize grouped vesicles, common head-and-neck involvement, hospital admission, and IV acyclovir treatment.",
    clinicalFeatures: [
      "Grouped vesicles in a newborn",
      "Head and neck involvement is common",
      "Risk of systemic dissemination",
      "Requires urgent inpatient management",
    ],
    syllabusSection: "Pediatric rashes",
    summary:
      "A neonatal vesicular emergency where grouped lesions should trigger immediate hospital-level evaluation and treatment.",
    hallmarkMorphology: [
      "Grouped vesicles",
      "Erosions after rupture",
      "Head-and-neck clustering in many cases",
    ],
    commonBodySites: ["Head", "Neck", "Scalp", "Face"],
    symptoms: ["Vesicles", "Irritability", "Systemic illness in severe cases"],
    managementBasics: [
      "Treat grouped neonatal vesicles as HSV until proven otherwise",
      "Admit for IV acyclovir and full neonatal evaluation",
      "Do not confuse it with a routine benign newborn rash",
    ],
    redFlags: [
      "Any grouped vesicular eruption in a neonate",
      "Fever, lethargy, seizures, or poor feeding",
    ],
    followUpPearls: [
      "The management threshold is intentionally low because missing neonatal HSV has serious consequences",
    ],
  }),
];

const hairAndNailConditions: Condition[] = [
  createLfCondition({
    id: "cond-lf-traction-alopecia",
    name: "Traction Alopecia",
    slug: "traction-alopecia",
    category: "hair_nails",
    description:
      "Traction alopecia is hair loss caused by chronic tension from grooming practices. LF notes highlight peripheral scalp hair loss and the importance of a grooming-history review when evaluating localized alopecia.",
    clinicalFeatures: [
      "Hair loss along the scalp margin",
      "History of tight hairstyles or chronic traction",
      "Broken hairs or thinning at the periphery",
      "Potential for scarring if prolonged",
    ],
    syllabusSection: "Hair loss",
    summary:
      "A preventable alopecia caused by chronic mechanical tension from hairstyle practices.",
    hallmarkMorphology: [
      "Frontotemporal or marginal thinning",
      "Broken hairs at the hairline",
      "Tension-pattern distribution",
    ],
    commonBodySites: ["Frontal hairline", "Temporal scalp", "Peripheral scalp"],
    symptoms: ["Hair breakage", "Thinning", "Possible tenderness early"],
    managementBasics: [
      "Ask about grooming practices in every marginal alopecia history",
      "Stop the traction source early to reduce permanent loss",
      "Treat any coexisting inflammation or secondary damage",
    ],
    redFlags: [
      "Scarring change or long-standing irreversible loss",
      "Ongoing tension despite counseling",
    ],
    followUpPearls: [
      "The history often makes the diagnosis before the microscope does",
      "Early traction alopecia can be reversible if the hairstyle changes",
    ],
  }),
  createLfCondition({
    id: "cond-lf-alopecia-areata",
    name: "Alopecia Areata",
    slug: "alopecia-areata",
    category: "hair_nails",
    description:
      "Alopecia areata is a chronic autoimmune nonscarring alopecia marked by abrupt smooth hair loss. LF notes emphasize the asymptomatic round bald patch, normal underlying skin, relapse-remission behavior, and more extensive totalis or universalis variants.",
    clinicalFeatures: [
      "Abrupt smooth round bald patch",
      "Normal underlying scalp skin",
      "Relapsing and remitting course",
      "Can progress to totalis or universalis",
    ],
    syllabusSection: "Hair loss",
    summary:
      "An autoimmune nonscarring alopecia that produces suddenly smooth bald patches on otherwise normal skin.",
    hallmarkMorphology: [
      "Round smooth patch of hair loss",
      "Normal skin surface without scale",
      "Possible exclamation-point hairs at the margin",
    ],
    commonBodySites: ["Scalp", "Beard", "Eyebrows"],
    symptoms: ["Usually asymptomatic", "Sudden hair loss", "Psychological distress"],
    managementBasics: [
      "Differentiate it from fungal, traction, and scarring causes of patchy alopecia",
      "Treat as an autoimmune alopecia rather than an infection",
      "Set expectations around relapse and remission",
    ],
    redFlags: [
      "Rapid progression to extensive scalp or body hair loss",
      "Major psychosocial distress despite limited body-surface involvement",
    ],
    followUpPearls: [
      "The smooth normal scalp surface is a major exam clue",
      "Patchy alopecia is not always fungal; morphology and scale matter",
    ],
  }),
];

export const lfSupplementalConditions: Condition[] = [
  ...autoimmuneConditions,
  ...ulcerAndWoundConditions,
  ...infectionConditions,
  ...drugEruptionConditions,
  ...genodermatosisConditions,
  ...pediatricConditions,
  ...hairAndNailConditions,
];
