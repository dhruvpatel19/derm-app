// ---------------------------------------------------------------------------
// Quiz Scoring Engine (v2)
// Deterministic scorer for QuizItem-based quizzes with synonym matching,
// forbidden-assumption penalties, and per-field breakdowns.
// ---------------------------------------------------------------------------

import type { QuizItem } from "@/lib/domain/schemas";

// ---- Result types ---------------------------------------------------------

export interface FieldBreakdown {
  earned: number;
  max: number;
  matched: string[];
  missed: string[];
}

export interface QuizScoreResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  fieldBreakdown: {
    coreMorphology: FieldBreakdown;
    secondaryFeatures: FieldBreakdown;
    bodySiteDistribution: FieldBreakdown;
    differentialQuality: FieldBreakdown;
    managementPearl: FieldBreakdown;
  };
  bonusPoints: number;
  penalties: {
    forbiddenAssumptionSelected: string[];
    dangerousMimicMissed: boolean;
  };
  feedback: string[];
  isDangerous: boolean;
}

export interface UserAnswers {
  selectedConcepts?: string[];
  selectedDiagnosis?: string;
  differentialRanking?: string[];
  managementAnswer?: string;
}

// ---- Helpers --------------------------------------------------------------

/** Normalize a term for comparison: lowercase, trim, collapse whitespace. */
function normalize(term: string): string {
  return term.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Check whether `candidate` matches `expected` directly or via an array of
 * acceptable synonyms.
 */
function matchesTerm(
  candidate: string,
  expected: string,
  synonyms: string[],
): boolean {
  const norm = normalize(candidate);
  if (norm === normalize(expected)) return true;
  return synonyms.some((s) => normalize(s) === norm);
}

/** Concept-type groupings used to map concepts into scoring fields. */
const CORE_MORPHOLOGY_TYPES = new Set([
  "primary_lesion",
  "color",
  "border",
  "texture",
]);

const SECONDARY_FEATURE_TYPES = new Set([
  "secondary_lesion",
  "shape",
  "arrangement",
]);

const BODY_SITE_DIST_TYPES = new Set([
  "body_site",
  "distribution",
]);

const DIFFERENTIAL_TYPES = new Set([
  "diagnosis",
  "differential",
]);

const MANAGEMENT_TYPES = new Set([
  "management",
  "biopsy_relevance",
]);

function classifyConceptType(
  conceptType: string,
): keyof QuizScoreResult["fieldBreakdown"] {
  if (CORE_MORPHOLOGY_TYPES.has(conceptType)) return "coreMorphology";
  if (SECONDARY_FEATURE_TYPES.has(conceptType)) return "secondaryFeatures";
  if (BODY_SITE_DIST_TYPES.has(conceptType)) return "bodySiteDistribution";
  if (DIFFERENTIAL_TYPES.has(conceptType)) return "differentialQuality";
  if (MANAGEMENT_TYPES.has(conceptType)) return "managementPearl";
  // default: treat as core morphology
  return "coreMorphology";
}

// Base points scale
const BASE_POINTS = 100;
const FORBIDDEN_PENALTY_POINTS = 5;
const DANGEROUS_MIMIC_PENALTY = 10;

// ---- Main scorer ----------------------------------------------------------

export function scoreQuizItem(
  userAnswers: UserAnswers,
  quizItem: QuizItem,
): QuizScoreResult {
  const weights = quizItem.scoringWeights;
  const feedback: string[] = [];

  // Initialize field breakdowns
  const fieldBreakdown: QuizScoreResult["fieldBreakdown"] = {
    coreMorphology: { earned: 0, max: 0, matched: [], missed: [] },
    secondaryFeatures: { earned: 0, max: 0, matched: [], missed: [] },
    bodySiteDistribution: { earned: 0, max: 0, matched: [], missed: [] },
    differentialQuality: { earned: 0, max: 0, matched: [], missed: [] },
    managementPearl: { earned: 0, max: 0, matched: [], missed: [] },
  };

  // Set max points per field from weights
  fieldBreakdown.coreMorphology.max = round(BASE_POINTS * weights.coreMorphology);
  fieldBreakdown.secondaryFeatures.max = round(BASE_POINTS * weights.secondaryFeatures);
  fieldBreakdown.bodySiteDistribution.max = round(BASE_POINTS * weights.bodySiteDistribution);
  fieldBreakdown.differentialQuality.max = round(BASE_POINTS * weights.differentialQuality);
  fieldBreakdown.managementPearl.max = round(BASE_POINTS * weights.managementPearl);

  let bonusPoints = 0;
  const forbiddenAssumptionSelected: string[] = [];
  let dangerousMimicMissed = false;

  const selectedConcepts = userAnswers.selectedConcepts ?? [];

  // ---- 1. Score requiredConcepts via synonym matching ---------------------

  // Group required concepts by scoring field
  const fieldConceptGroups: Record<
    keyof QuizScoreResult["fieldBreakdown"],
    typeof quizItem.requiredConcepts
  > = {
    coreMorphology: [],
    secondaryFeatures: [],
    bodySiteDistribution: [],
    differentialQuality: [],
    managementPearl: [],
  };

  for (const rc of quizItem.requiredConcepts) {
    const field = classifyConceptType(rc.conceptType);
    fieldConceptGroups[field].push(rc);
  }

  // Score each field
  for (const [fieldKey, concepts] of Object.entries(fieldConceptGroups) as Array<
    [keyof QuizScoreResult["fieldBreakdown"], typeof quizItem.requiredConcepts]
  >) {
    if (concepts.length === 0) continue;

    const totalWeight = concepts.reduce((sum, c) => sum + c.weight, 0);
    const maxForField = fieldBreakdown[fieldKey].max;

    for (const concept of concepts) {
      const isMatched = selectedConcepts.some((sc) =>
        matchesTerm(sc, concept.conceptValue, concept.acceptableSynonyms),
      );

      if (isMatched) {
        const proportionalPoints =
          totalWeight > 0 ? (concept.weight / totalWeight) * maxForField : 0;
        fieldBreakdown[fieldKey].earned += proportionalPoints;
        fieldBreakdown[fieldKey].matched.push(concept.conceptValue);
      } else {
        fieldBreakdown[fieldKey].missed.push(concept.conceptValue);
      }
    }

    // Round earned
    fieldBreakdown[fieldKey].earned = round(fieldBreakdown[fieldKey].earned);

    if (fieldBreakdown[fieldKey].missed.length > 0) {
      feedback.push(
        `${formatFieldName(fieldKey)}: missed ${fieldBreakdown[fieldKey].missed.join(", ")}`,
      );
    }
    if (
      fieldBreakdown[fieldKey].matched.length === concepts.length &&
      concepts.length > 0
    ) {
      feedback.push(`${formatFieldName(fieldKey)}: perfect!`);
    }
  }

  // ---- 2. Score single_select diagnosis -----------------------------------

  if (
    quizItem.questionType === "single_select" &&
    userAnswers.selectedDiagnosis
  ) {
    const diagnosisConcept = quizItem.requiredConcepts.find(
      (rc) => rc.conceptType === "diagnosis",
    );
    if (diagnosisConcept) {
      const isCorrect = matchesTerm(
        userAnswers.selectedDiagnosis,
        diagnosisConcept.conceptValue,
        diagnosisConcept.acceptableSynonyms,
      );
      if (isCorrect) {
        fieldBreakdown.differentialQuality.earned =
          fieldBreakdown.differentialQuality.max;
        fieldBreakdown.differentialQuality.matched.push(
          diagnosisConcept.conceptValue,
        );
        feedback.push("Correct diagnosis!");
      } else {
        fieldBreakdown.differentialQuality.earned = 0;
        fieldBreakdown.differentialQuality.missed.push(
          diagnosisConcept.conceptValue,
        );
        feedback.push(
          `Incorrect diagnosis. The correct answer is ${diagnosisConcept.conceptValue}.`,
        );
      }
    }
  }

  // ---- 3. Score differential ranking --------------------------------------

  if (
    quizItem.questionType === "differential_rank" &&
    userAnswers.differentialRanking &&
    userAnswers.differentialRanking.length > 0
  ) {
    const userRanking = userAnswers.differentialRanking;
    const correctRanking = quizItem.requiredConcepts
      .filter((rc) => rc.conceptType === "differential")
      .sort((a, b) => b.weight - a.weight)
      .map((rc) => rc.conceptValue);

    const maxDiffPoints = fieldBreakdown.differentialQuality.max;
    const perItem = correctRanking.length > 0 ? maxDiffPoints / correctRanking.length : 0;
    let diffScore = 0;
    const claimed = new Set<number>();

    // Pass 1: exact position matches (full credit per item)
    for (let i = 0; i < correctRanking.length; i++) {
      if (i >= userRanking.length) break;
      const rc = quizItem.requiredConcepts.find(
        (c) => c.conceptType === "differential" && normalize(c.conceptValue) === normalize(correctRanking[i]),
      );
      const synonyms = rc?.acceptableSynonyms ?? [];
      if (matchesTerm(userRanking[i], correctRanking[i], synonyms)) {
        diffScore += perItem;
        claimed.add(i);
        fieldBreakdown.differentialQuality.matched.push(correctRanking[i]);
        feedback.push(`#${i + 1} "${correctRanking[i]}" correctly placed`);
      }
    }

    // Pass 2: present but wrong position (half credit)
    for (let ui = 0; ui < userRanking.length; ui++) {
      // Skip if already exact matched
      if (
        ui < correctRanking.length &&
        claimed.has(ui)
      ) {
        continue;
      }

      for (let ci = 0; ci < correctRanking.length; ci++) {
        if (claimed.has(ci)) continue;
        const rc = quizItem.requiredConcepts.find(
          (c) =>
            c.conceptType === "differential" &&
            normalize(c.conceptValue) === normalize(correctRanking[ci]),
        );
        const synonyms = rc?.acceptableSynonyms ?? [];
        if (matchesTerm(userRanking[ui], correctRanking[ci], synonyms)) {
          diffScore += perItem * 0.5;
          claimed.add(ci);
          fieldBreakdown.differentialQuality.matched.push(correctRanking[ci]);
          feedback.push(
            `"${correctRanking[ci]}" present but in wrong position (partial credit)`,
          );
          break;
        }
      }
    }

    // Report missed differentials
    for (let ci = 0; ci < correctRanking.length; ci++) {
      if (!claimed.has(ci)) {
        fieldBreakdown.differentialQuality.missed.push(correctRanking[ci]);
        feedback.push(`Missed "${correctRanking[ci]}" in differential`);
      }
    }

    fieldBreakdown.differentialQuality.earned = round(diffScore);
  }

  // ---- 4. Award bonus for optional concepts --------------------------------

  for (const oc of quizItem.optionalConcepts) {
    const isMatched = selectedConcepts.some(
      (sc) => normalize(sc) === normalize(oc.conceptValue),
    );
    if (isMatched) {
      bonusPoints += oc.bonusWeight;
      feedback.push(`Bonus: identified optional feature "${oc.conceptValue}"`);
    }
  }

  // ---- 5. Penalize forbidden assumptions -----------------------------------

  for (const fa of quizItem.forbiddenAssumptions) {
    const isSelected = selectedConcepts.some(
      (sc) => normalize(sc) === normalize(fa.conceptValue),
    );
    if (isSelected) {
      forbiddenAssumptionSelected.push(fa.conceptValue);
      feedback.push(
        `Penalty: "${fa.conceptValue}" selected. ${fa.reason}`,
      );
    }
  }

  // ---- 6. Score management pearl -------------------------------------------

  if (userAnswers.managementAnswer && quizItem.managementPearl) {
    const mgmtMax = fieldBreakdown.managementPearl.max;
    // Simple keyword matching: if the answer contains key management terms
    const mgmtNorm = normalize(quizItem.managementPearl);
    const userMgmt = normalize(userAnswers.managementAnswer);

    // Award credit if user answer is sufficiently close
    if (mgmtNorm === userMgmt || mgmtNorm.includes(userMgmt) || userMgmt.includes(mgmtNorm)) {
      fieldBreakdown.managementPearl.earned = mgmtMax;
      fieldBreakdown.managementPearl.matched.push("management pearl");
      feedback.push("Management pearl: correct!");
    } else {
      // Partial credit: check if at least some key terms match
      const mgmtWords = mgmtNorm.split(" ").filter((w) => w.length > 4);
      const matchedWords = mgmtWords.filter((w) => userMgmt.includes(w));
      const matchRatio = mgmtWords.length > 0 ? matchedWords.length / mgmtWords.length : 0;

      if (matchRatio >= 0.4) {
        fieldBreakdown.managementPearl.earned = round(mgmtMax * matchRatio);
        fieldBreakdown.managementPearl.matched.push("management pearl (partial)");
        feedback.push("Management pearl: partial credit");
      } else {
        fieldBreakdown.managementPearl.missed.push("management pearl");
        feedback.push("Management pearl: incorrect or incomplete");
      }
    }
  }

  // ---- 7. Flag dangerous mimic miss ----------------------------------------

  if (quizItem.dangerousMimic) {
    if (quizItem.questionType === "single_select" && userAnswers.selectedDiagnosis) {
      // Check if the user selected the dangerous mimic instead of the correct diagnosis
      const diagnosisConcept = quizItem.requiredConcepts.find(
        (rc) => rc.conceptType === "diagnosis",
      );
      if (diagnosisConcept) {
        const isCorrectDiagnosis = matchesTerm(
          userAnswers.selectedDiagnosis,
          diagnosisConcept.conceptValue,
          diagnosisConcept.acceptableSynonyms,
        );
        if (!isCorrectDiagnosis) {
          // Check if they picked the dangerous mimic
          const pickedMimic =
            normalize(userAnswers.selectedDiagnosis) ===
            normalize(quizItem.dangerousMimic);
          if (pickedMimic) {
            dangerousMimicMissed = true;
            feedback.push(
              `DANGEROUS: You selected "${quizItem.dangerousMimic}" which is a dangerous mimic. Missing this diagnosis could lead to harm.`,
            );
          }
        }
      }
    }

    if (
      quizItem.questionType === "differential_rank" &&
      userAnswers.differentialRanking
    ) {
      // Check if the dangerous mimic was ranked higher than the correct diagnosis
      const topCorrect = quizItem.requiredConcepts
        .filter((rc) => rc.conceptType === "differential")
        .sort((a, b) => b.weight - a.weight)[0];

      if (topCorrect) {
        const correctIdx = userAnswers.differentialRanking.findIndex((d) =>
          matchesTerm(d, topCorrect.conceptValue, topCorrect.acceptableSynonyms),
        );
        const mimicIdx = userAnswers.differentialRanking.findIndex(
          (d) => normalize(d) === normalize(quizItem.dangerousMimic!),
        );

        if (correctIdx === -1 || (mimicIdx !== -1 && mimicIdx < correctIdx)) {
          dangerousMimicMissed = true;
          feedback.push(
            `WARNING: The dangerous mimic "${quizItem.dangerousMimic}" was ranked above the correct top diagnosis. This could lead to a missed diagnosis.`,
          );
        }
      }
    }
  }

  // ---- 8. Calculate totals ------------------------------------------------

  const rawTotal =
    fieldBreakdown.coreMorphology.earned +
    fieldBreakdown.secondaryFeatures.earned +
    fieldBreakdown.bodySiteDistribution.earned +
    fieldBreakdown.differentialQuality.earned +
    fieldBreakdown.managementPearl.earned +
    bonusPoints;

  const penaltyDeduction =
    forbiddenAssumptionSelected.length * FORBIDDEN_PENALTY_POINTS +
    (dangerousMimicMissed ? DANGEROUS_MIMIC_PENALTY : 0);

  const totalScore = round(Math.max(0, rawTotal - penaltyDeduction));
  const maxScore =
    fieldBreakdown.coreMorphology.max +
    fieldBreakdown.secondaryFeatures.max +
    fieldBreakdown.bodySiteDistribution.max +
    fieldBreakdown.differentialQuality.max +
    fieldBreakdown.managementPearl.max;

  const percentage =
    maxScore > 0 ? round((totalScore / maxScore) * 100) : 0;

  return {
    totalScore,
    maxScore,
    percentage: Math.min(100, percentage),
    fieldBreakdown,
    bonusPoints,
    penalties: {
      forbiddenAssumptionSelected,
      dangerousMimicMissed,
    },
    feedback,
    isDangerous: dangerousMimicMissed,
  };
}

// ---- Utility --------------------------------------------------------------

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}
