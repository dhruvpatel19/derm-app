// ---------------------------------------------------------------------------
// Body site normalization
// ---------------------------------------------------------------------------
//
// Different datasets use inconsistent body-site labels. This module provides
// a canonical mapping from any known raw label to a single canonical term,
// plus functional groupings used for educational filtering (sun-exposed,
// flexural, etc.).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Canonical body site map
// ---------------------------------------------------------------------------
// Keys are lowercase, underscore-separated raw labels that may appear in any
// dataset. Values are the canonical term used internally.
// ---------------------------------------------------------------------------

export const BODY_SITE_CANONICAL_MAP: Record<string, string> = {
  // -- Head & neck ---------------------------------------------------------
  head: "head",
  face: "face",
  forehead: "forehead",
  temple: "temple",
  cheek: "cheek",
  cheeks: "cheek",
  chin: "chin",
  jaw: "jaw",
  nose: "nose",
  nasal: "nose",
  perioral: "perioral",
  periorbital: "periorbital",
  periocular: "periorbital",
  lip: "lip",
  lips: "lip",
  lower_lip: "lower_lip",
  upper_lip: "upper_lip",
  ear: "ear",
  ears: "ear",
  earlobe: "ear",
  retroauricular: "retroauricular",
  scalp: "scalp",
  vertex: "scalp",
  crown: "scalp",
  neck: "neck",
  anterior_neck: "neck",
  posterior_neck: "neck",
  nape: "posterior_neck",

  // -- Trunk ---------------------------------------------------------------
  trunk: "trunk",
  torso: "trunk",
  chest: "chest",
  anterior_chest: "chest",
  breast: "chest",
  abdomen: "abdomen",
  belly: "abdomen",
  umbilicus: "abdomen",
  flank: "flank",
  flanks: "flank",
  back: "back",
  upper_back: "upper_back",
  lower_back: "lower_back",
  lumbar: "lower_back",
  sacral: "sacrum",
  sacrum: "sacrum",
  waist: "waistline",
  waistline: "waistline",

  // -- Upper extremity -----------------------------------------------------
  upper_extremity: "upper_extremity",
  upper_extremities: "upper_extremity",
  arm: "arm",
  arms: "arm",
  upper_arm: "upper_arm",
  shoulder: "shoulder",
  shoulders: "shoulder",
  forearm: "forearm",
  forearms: "forearm",
  antecubital_fossa: "antecubital_fossa",
  cubital_fossa: "antecubital_fossa",
  elbow: "elbow",
  elbows: "elbow",
  wrist: "wrist",
  wrists: "wrist",
  hand: "hand",
  hands: "hand",
  dorsal_hand: "dorsal_hand",
  dorsal_hands: "dorsal_hand",
  palm: "palm",
  palms: "palm",
  palmar: "palm",
  finger: "finger",
  fingers: "finger",
  thumb: "finger",
  periungual: "periungual",
  fingernail: "fingernail",
  fingernails: "fingernail",
  nail: "nail",
  nails: "nail",

  // -- Lower extremity -----------------------------------------------------
  lower_extremity: "lower_extremity",
  lower_extremities: "lower_extremity",
  leg: "leg",
  legs: "leg",
  thigh: "thigh",
  thighs: "thigh",
  anterior_thigh: "thigh",
  posterior_thigh: "thigh",
  knee: "knee",
  knees: "knee",
  popliteal_fossa: "popliteal_fossa",
  shin: "shin",
  shins: "shin",
  anterior_leg: "shin",
  lower_leg: "lower_leg",
  lower_legs: "lower_leg",
  calf: "calf",
  calves: "calf",
  ankle: "ankle",
  ankles: "ankle",
  foot: "foot",
  feet: "foot",
  dorsal_foot: "dorsal_foot",
  sole: "sole",
  soles: "sole",
  plantar: "sole",
  heel: "heel",
  toe: "toe",
  toes: "toe",
  toenail: "toenail",
  toenails: "toenail",

  // -- Intertriginous / genital / gluteal -----------------------------------
  axilla: "axilla",
  axillae: "axilla",
  axillary: "axilla",
  groin: "groin",
  inguinal: "groin",
  inguinal_fold: "groin",
  genital: "genitalia",
  genitals: "genitalia",
  genitalia: "genitalia",
  penis: "genitalia",
  vulva: "genitalia",
  perianal: "perianal",
  perineum: "perineum",
  buttock: "buttock",
  buttocks: "buttock",
  gluteal: "buttock",
  intergluteal: "intergluteal",

  // -- Mucosal -------------------------------------------------------------
  oral_mucosa: "oral_mucosa",
  buccal_mucosa: "oral_mucosa",
  tongue: "tongue",
  palate: "palate",
  gingiva: "gingiva",
  conjunctiva: "conjunctiva",

  // -- General / unspecified ------------------------------------------------
  any: "unspecified",
  unspecified: "unspecified",
  unknown: "unspecified",
  other: "unspecified",
  not_specified: "unspecified",
  multiple: "multiple",
  widespread: "multiple",
  diffuse: "multiple",
  generalized: "multiple",

  // -- PAD-UFES-20 specific labels -----------------------------------------
  // PAD uses Portuguese or abbreviated English region names
  "face - right": "face",
  "face - left": "face",
  "nose - center": "nose",
  "back - upper": "upper_back",
  "back - lower": "lower_back",
  "back - middle": "back",
  anterior_torso: "chest",
  posterior_torso: "back",
  right_arm: "arm",
  left_arm: "arm",
  right_leg: "leg",
  left_leg: "leg",
  right_hand: "hand",
  left_hand: "hand",
  right_foot: "foot",
  left_foot: "foot",

  // -- Web spaces / dermatome references ------------------------------------
  web_spaces: "web_spaces",
  dermatome_distribution: "dermatome_distribution",
  nasolabial_folds: "nasolabial_fold",
  nasolabial_fold: "nasolabial_fold",
  eyebrows: "eyebrow",
  eyebrow: "eyebrow",
  eyelid: "eyelid",
  eyelids: "eyelid",
  beard_area: "beard_area",
};

// ---------------------------------------------------------------------------
// Body site groups
// ---------------------------------------------------------------------------
// Functional / clinical groupings used for educational filtering (e.g.
// "show me all conditions that favour sun-exposed sites").
// ---------------------------------------------------------------------------

export const BODY_SITE_GROUPS: Record<string, string[]> = {
  /** Chronically sun-exposed sites (high cumulative UV). */
  sun_exposed: [
    "face",
    "forehead",
    "temple",
    "cheek",
    "nose",
    "lower_lip",
    "ear",
    "scalp",
    "neck",
    "dorsal_hand",
    "forearm",
    "upper_back",
    "shoulder",
    "shin",
  ],

  /** Flexural (body folds). */
  flexural: [
    "antecubital_fossa",
    "popliteal_fossa",
    "axilla",
    "groin",
    "neck",
    "periorbital",
  ],

  /** Extensor surfaces. */
  extensor: [
    "elbow",
    "knee",
    "shin",
    "dorsal_hand",
    "dorsal_foot",
    "forearm",
  ],

  /** Intertriginous (skin-on-skin friction zones). */
  intertriginous: [
    "axilla",
    "groin",
    "intergluteal",
    "inframammary",
    "waistline",
    "neck",
    "web_spaces",
  ],

  /** Acral (distal extremities). */
  acral: [
    "hand",
    "palm",
    "finger",
    "fingernail",
    "foot",
    "sole",
    "toe",
    "toenail",
    "periungual",
    "heel",
  ],

  /** Mucosal surfaces. */
  mucosal: [
    "oral_mucosa",
    "tongue",
    "palate",
    "gingiva",
    "lip",
    "conjunctiva",
    "genitalia",
  ],

  /** Head and neck region. */
  head_and_neck: [
    "head",
    "face",
    "forehead",
    "temple",
    "cheek",
    "chin",
    "jaw",
    "nose",
    "perioral",
    "periorbital",
    "lip",
    "lower_lip",
    "upper_lip",
    "ear",
    "retroauricular",
    "scalp",
    "neck",
    "eyebrow",
    "eyelid",
    "nasolabial_fold",
    "beard_area",
  ],

  /** Trunk (front and back). */
  trunk: [
    "trunk",
    "chest",
    "abdomen",
    "flank",
    "back",
    "upper_back",
    "lower_back",
    "sacrum",
    "waistline",
  ],

  /** Upper limb. */
  upper_limb: [
    "upper_extremity",
    "arm",
    "upper_arm",
    "shoulder",
    "forearm",
    "antecubital_fossa",
    "elbow",
    "wrist",
    "hand",
    "dorsal_hand",
    "palm",
    "finger",
    "periungual",
    "fingernail",
  ],

  /** Lower limb. */
  lower_limb: [
    "lower_extremity",
    "leg",
    "thigh",
    "knee",
    "popliteal_fossa",
    "shin",
    "lower_leg",
    "calf",
    "ankle",
    "foot",
    "dorsal_foot",
    "sole",
    "heel",
    "toe",
    "toenail",
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalize a raw body-site string to the canonical term.
 * Returns undefined when the input is empty or unrecognised.
 */
export function normalizeBodySite(
  raw: string | undefined | null,
): string | undefined {
  if (!raw) return undefined;
  const key = raw.toLowerCase().trim().replace(/[\s-]+/g, "_");
  return BODY_SITE_CANONICAL_MAP[key] ?? undefined;
}

/**
 * Return all group names that contain the given canonical body site.
 */
export function bodySiteGroups(canonicalSite: string): string[] {
  return Object.entries(BODY_SITE_GROUPS)
    .filter(([, sites]) => sites.includes(canonicalSite))
    .map(([group]) => group);
}

/**
 * Check whether a canonical body site belongs to the given group.
 */
export function isInBodySiteGroup(
  canonicalSite: string,
  group: string,
): boolean {
  return BODY_SITE_GROUPS[group]?.includes(canonicalSite) ?? false;
}
