// ---------------------------------------------------------------------------
// Morphology Scoring Engine
// Deterministic scorer for morphology quiz answers, differential ranking,
// and case questions.
// ---------------------------------------------------------------------------

// ---- Types ----------------------------------------------------------------

export interface MorphologyRubric {
  primaryLesion: string[];
  secondaryFeatures: string[];
  color: string[];
  border: string[];
  arrangement: string[];
  distribution: string[];
  bodySite: string[];
  weightedPoints: Record<string, number>;
  acceptableSynonyms: Record<string, string[]>;
}

export interface CaseQuestion {
  id: string;
  prompt: string;
  type:
    | "single_select"
    | "multi_select"
    | "ordered_steps"
    | "short_answer"
    | "differential_rank"
    | "hotspot_select";
  options?: string[];
  correctAnswer: string | string[];
  explanationCorrect: string;
  explanationIncorrect: Record<string, string>;
  partialCreditRules?: string[];
  dangerousAnswers?: string[];
}

export interface FieldScore {
  earned: number;
  max: number;
  matched: string[];
  missed: string[];
}

export interface MorphologyResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  fieldScores: Record<string, FieldScore>;
  feedback: string[];
}

export interface DifferentialRankingResult {
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string[];
}

export interface CaseQuestionResult {
  score: number;
  maxScore: number;
  correct: boolean;
  isDangerous: boolean;
  feedback: string;
}

// ---- Helpers --------------------------------------------------------------

const MORPHOLOGY_FIELDS = [
  "primaryLesion",
  "secondaryFeatures",
  "color",
  "border",
  "arrangement",
  "distribution",
  "bodySite",
] as const;

type MorphologyField = (typeof MORPHOLOGY_FIELDS)[number];

/**
 * Normalise a term for comparison: lowercase, trim, collapse whitespace.
 */
function normalise(term: string): string {
  return term.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Check whether `candidate` matches `expected` directly or via the synonym
 * map. Returns true when the normalised candidate equals the normalised
 * expected string OR any of its registered synonyms.
 */
function matchesTerm(
  candidate: string,
  expected: string,
  synonyms: Record<string, string[]>,
): boolean {
  const normCandidate = normalise(candidate);
  const normExpected = normalise(expected);

  if (normCandidate === normExpected) return true;

  // Check whether the candidate is a known synonym for `expected`
  const expectedSynonyms = synonyms[normExpected] ?? synonyms[expected] ?? [];
  return expectedSynonyms.some((syn) => normalise(syn) === normCandidate);
}

// ---- scoreMorphologyAnswer ------------------------------------------------

/**
 * Score a user's morphology description against a rubric.
 *
 * For each field the rubric lists one or more acceptable terms. The user's
 * answer is an object keyed by the same fields, each containing an array of
 * strings. Each rubric term that is matched (directly or via synonym) earns
 * a proportional share of that field's weighted points.
 */
export function scoreMorphologyAnswer(
  userAnswer: Partial<Record<MorphologyField, string[]>>,
  rubric: MorphologyRubric,
): MorphologyResult {
  const fieldScores: Record<string, FieldScore> = {};
  const feedback: string[] = [];
  let totalScore = 0;
  let maxScore = 0;

  for (const field of MORPHOLOGY_FIELDS) {
    const rubricTerms: string[] = rubric[field] ?? [];
    const weight = rubric.weightedPoints[field] ?? 0;
    maxScore += weight;

    const userTerms: string[] = userAnswer[field] ?? [];
    const matched: string[] = [];
    const missed: string[] = [];

    for (const rubricTerm of rubricTerms) {
      const isMatched = userTerms.some((ut) =>
        matchesTerm(ut, rubricTerm, rubric.acceptableSynonyms),
      );
      if (isMatched) {
        matched.push(rubricTerm);
      } else {
        missed.push(rubricTerm);
      }
    }

    const earned =
      rubricTerms.length > 0
        ? (matched.length / rubricTerms.length) * weight
        : 0;

    // Round to two decimal places to avoid floating-point dust
    const earnedRounded = Math.round(earned * 100) / 100;
    totalScore += earnedRounded;

    fieldScores[field] = {
      earned: earnedRounded,
      max: weight,
      matched,
      missed,
    };

    if (missed.length > 0) {
      feedback.push(
        `${field}: missed ${missed.join(", ")}`,
      );
    }
    if (matched.length === rubricTerms.length && rubricTerms.length > 0) {
      feedback.push(`${field}: perfect`);
    }
  }

  totalScore = Math.round(totalScore * 100) / 100;
  const percentage =
    maxScore > 0 ? Math.round((totalScore / maxScore) * 10000) / 100 : 0;

  return { totalScore, maxScore, percentage, fieldScores, feedback };
}

// ---- scoreDifferentialRanking ---------------------------------------------

/**
 * Score a user's differential diagnosis ranking against the correct ranking.
 *
 * Scoring rules:
 *  - maxScore = correctRanking.length * 2  (2 points per item)
 *  - 2 points for each item in the correct position
 *  - 1 point for each item present but in the wrong position
 *  - 0 points for missing items
 *  - Bonus: +1 point if the #1 item is correct
 *
 * Items are compared via normalised string matching + synonyms.
 */
export function scoreDifferentialRanking(
  userRanking: string[],
  correctRanking: string[],
  acceptableSynonyms: Record<string, string[]> = {},
): DifferentialRankingResult {
  const perItem = 2;
  const maxScore = correctRanking.length * perItem + 1; // +1 for possible bonus
  let score = 0;
  const feedback: string[] = [];

  // Track which correct items have already been claimed
  const claimed = new Set<number>();

  // Pass 1: exact-position matches
  for (let i = 0; i < correctRanking.length; i++) {
    if (
      i < userRanking.length &&
      matchesTerm(userRanking[i], correctRanking[i], acceptableSynonyms)
    ) {
      score += perItem;
      claimed.add(i);
      feedback.push(
        `#${i + 1} "${correctRanking[i]}" correctly placed`,
      );
    }
  }

  // Pass 2: present-but-wrong-position
  for (let ui = 0; ui < userRanking.length; ui++) {
    // Skip if this user slot was already an exact match
    if (
      ui < correctRanking.length &&
      matchesTerm(userRanking[ui], correctRanking[ui], acceptableSynonyms)
    ) {
      continue;
    }

    for (let ci = 0; ci < correctRanking.length; ci++) {
      if (claimed.has(ci)) continue;
      if (matchesTerm(userRanking[ui], correctRanking[ci], acceptableSynonyms)) {
        score += 1; // partial credit
        claimed.add(ci);
        feedback.push(
          `"${correctRanking[ci]}" present but in wrong position`,
        );
        break;
      }
    }
  }

  // Bonus for getting #1 correct
  if (
    userRanking.length > 0 &&
    correctRanking.length > 0 &&
    matchesTerm(userRanking[0], correctRanking[0], acceptableSynonyms)
  ) {
    score += 1;
    feedback.push("Bonus: top diagnosis correct");
  }

  // Report missed items
  for (let ci = 0; ci < correctRanking.length; ci++) {
    if (!claimed.has(ci)) {
      feedback.push(`Missed "${correctRanking[ci]}"`);
    }
  }

  const percentage =
    maxScore > 0 ? Math.round((score / maxScore) * 10000) / 100 : 0;

  return { score, maxScore, percentage, feedback };
}

// ---- scoreCaseQuestion ----------------------------------------------------

/**
 * Score a single case question.
 *
 * Handles the following question types:
 *  - single_select   : exact match (1 point)
 *  - multi_select    : 1 point per correct item, -0.5 per incorrect; min 0
 *  - ordered_steps   : 2 pts per correct-position item, 1 pt for present-but-wrong
 *  - short_answer    : check against synonym map; 1 point
 *  - differential_rank : delegates to scoreDifferentialRanking
 *  - hotspot_select  : exact match (1 point)
 *
 * Dangerous-answer detection: if the user's answer matches any entry in
 * `question.dangerousAnswers`, `isDangerous` is set to true.
 */
export function scoreCaseQuestion(
  userAnswer: string | string[],
  question: CaseQuestion,
): CaseQuestionResult {
  // --- dangerous-answer check ---
  const dangerousSet = new Set(
    (question.dangerousAnswers ?? []).map(normalise),
  );
  const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
  const isDangerous = userAnswerArray.some((a) => dangerousSet.has(normalise(a)));

  const dangerousFeedbackSuffix = isDangerous
    ? " WARNING: This answer could be dangerous in a clinical setting."
    : "";

  switch (question.type) {
    // ----- single_select / hotspot_select -----------------------------------
    case "single_select":
    case "hotspot_select": {
      const correct =
        normalise(String(userAnswer)) === normalise(String(question.correctAnswer));
      return {
        score: correct ? 1 : 0,
        maxScore: 1,
        correct,
        isDangerous,
        feedback: correct
          ? question.explanationCorrect + dangerousFeedbackSuffix
          : (question.explanationIncorrect[String(userAnswer)] ??
              "Incorrect.") + dangerousFeedbackSuffix,
      };
    }

    // ----- multi_select -----------------------------------------------------
    case "multi_select": {
      const correctSet = new Set(
        (question.correctAnswer as string[]).map(normalise),
      );
      const userItems = (Array.isArray(userAnswer) ? userAnswer : [userAnswer]).map(
        normalise,
      );
      const maxScore = correctSet.size;
      let score = 0;

      for (const item of userItems) {
        if (correctSet.has(item)) {
          score += 1;
        } else {
          score -= 0.5;
        }
      }
      score = Math.max(0, Math.round(score * 100) / 100);
      const correct = score === maxScore;

      return {
        score,
        maxScore,
        correct,
        isDangerous,
        feedback:
          (correct
            ? question.explanationCorrect
            : `Partial credit: ${score}/${maxScore}.`) + dangerousFeedbackSuffix,
      };
    }

    // ----- ordered_steps ----------------------------------------------------
    case "ordered_steps": {
      const correctSteps = question.correctAnswer as string[];
      const userSteps = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      const perStep = 2;
      const maxScore = correctSteps.length * perStep;
      let score = 0;
      const presentCorrectly = new Set<number>();

      for (let i = 0; i < correctSteps.length; i++) {
        if (
          i < userSteps.length &&
          normalise(userSteps[i]) === normalise(correctSteps[i])
        ) {
          score += perStep;
          presentCorrectly.add(i);
        }
      }

      // partial credit for present but wrong position
      for (let ui = 0; ui < userSteps.length; ui++) {
        if (presentCorrectly.has(ui)) continue;
        for (let ci = 0; ci < correctSteps.length; ci++) {
          if (presentCorrectly.has(ci)) continue;
          if (normalise(userSteps[ui]) === normalise(correctSteps[ci])) {
            score += 1;
            presentCorrectly.add(ci);
            break;
          }
        }
      }

      const correct = score === maxScore;
      return {
        score,
        maxScore,
        correct,
        isDangerous,
        feedback:
          (correct
            ? question.explanationCorrect
            : `Partial credit: ${score}/${maxScore}.`) + dangerousFeedbackSuffix,
      };
    }

    // ----- short_answer -----------------------------------------------------
    case "short_answer": {
      const correctAnswers: string[] = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : [question.correctAnswer];
      const normUser = normalise(String(userAnswer));
      const correct = correctAnswers.some((ca) => normalise(ca) === normUser);

      return {
        score: correct ? 1 : 0,
        maxScore: 1,
        correct,
        isDangerous,
        feedback: correct
          ? question.explanationCorrect + dangerousFeedbackSuffix
          : (question.explanationIncorrect[String(userAnswer)] ??
              "Incorrect.") + dangerousFeedbackSuffix,
      };
    }

    // ----- differential_rank ------------------------------------------------
    case "differential_rank": {
      const correctRanking = question.correctAnswer as string[];
      const userRank = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      const result = scoreDifferentialRanking(userRank, correctRanking);
      return {
        score: result.score,
        maxScore: result.maxScore,
        correct: result.score === result.maxScore,
        isDangerous,
        feedback: result.feedback.join("; ") + dangerousFeedbackSuffix,
      };
    }

    default: {
      return {
        score: 0,
        maxScore: 1,
        correct: false,
        isDangerous,
        feedback: `Unsupported question type: ${question.type}` + dangerousFeedbackSuffix,
      };
    }
  }
}
