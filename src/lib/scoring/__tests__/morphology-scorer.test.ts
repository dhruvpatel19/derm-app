import { describe, it } from "node:test";
import assert from "node:assert";

import {
  scoreMorphologyAnswer,
  scoreDifferentialRanking,
  scoreCaseQuestion,
  type MorphologyRubric,
  type CaseQuestion,
} from "../morphology-scorer";

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const psoriasisRubric: MorphologyRubric = {
  primaryLesion: ["plaque"],
  secondaryFeatures: ["silvery scale", "Auspitz sign"],
  color: ["erythematous", "salmon pink"],
  border: ["well-defined"],
  arrangement: ["scattered"],
  distribution: ["symmetric", "extensor surfaces"],
  bodySite: ["elbows", "knees", "scalp"],
  weightedPoints: {
    primaryLesion: 10,
    secondaryFeatures: 15,
    color: 10,
    border: 5,
    arrangement: 5,
    distribution: 10,
    bodySite: 10,
  },
  acceptableSynonyms: {
    plaque: ["plaque lesion", "raised plaque"],
    "silvery scale": ["silver scale", "micaceous scale"],
    erythematous: ["red", "erythematous base"],
    "well-defined": ["sharply demarcated", "well demarcated"],
    "salmon pink": ["pink-salmon"],
    scattered: ["disseminated"],
    "auspitz sign": ["pinpoint bleeding"],
  },
};

// ---------------------------------------------------------------------------
// scoreMorphologyAnswer
// ---------------------------------------------------------------------------

describe("scoreMorphologyAnswer", () => {
  it("perfect morphology answer scores 100%", () => {
    const userAnswer = {
      primaryLesion: ["plaque"],
      secondaryFeatures: ["silvery scale", "Auspitz sign"],
      color: ["erythematous", "salmon pink"],
      border: ["well-defined"],
      arrangement: ["scattered"],
      distribution: ["symmetric", "extensor surfaces"],
      bodySite: ["elbows", "knees", "scalp"],
    };

    const result = scoreMorphologyAnswer(userAnswer, psoriasisRubric);

    assert.strictEqual(result.percentage, 100);
    assert.strictEqual(result.totalScore, result.maxScore);
    assert.strictEqual(result.maxScore, 65); // sum of all weights

    // Every field should be perfect
    for (const field of Object.keys(result.fieldScores)) {
      const fs = result.fieldScores[field];
      assert.strictEqual(fs.earned, fs.max, `${field} should be full credit`);
      assert.strictEqual(fs.missed.length, 0, `${field} should have no misses`);
    }
  });

  it("partial answer gets partial credit", () => {
    const userAnswer = {
      primaryLesion: ["plaque"],
      secondaryFeatures: ["silvery scale"], // missing Auspitz sign
      color: ["erythematous"], // missing salmon pink
      border: ["well-defined"],
      arrangement: ["scattered"],
      distribution: ["symmetric"], // missing extensor surfaces
      bodySite: ["elbows", "knees"], // missing scalp
    };

    const result = scoreMorphologyAnswer(userAnswer, psoriasisRubric);

    assert.ok(result.percentage > 0, "should earn some credit");
    assert.ok(result.percentage < 100, "should not be full credit");

    // primaryLesion should be perfect
    assert.strictEqual(result.fieldScores.primaryLesion.earned, 10);

    // secondaryFeatures: got 1 of 2 terms => 15 * 0.5 = 7.5
    assert.strictEqual(result.fieldScores.secondaryFeatures.earned, 7.5);
    assert.deepStrictEqual(result.fieldScores.secondaryFeatures.missed, [
      "Auspitz sign",
    ]);

    // color: got 1 of 2 terms => 10 * 0.5 = 5
    assert.strictEqual(result.fieldScores.color.earned, 5);

    // distribution: got 1 of 2 => 10 * 0.5 = 5
    assert.strictEqual(result.fieldScores.distribution.earned, 5);

    // bodySite: got 2 of 3 => 10 * (2/3) ≈ 6.67
    assert.ok(
      Math.abs(result.fieldScores.bodySite.earned - 6.67) < 0.01,
      `bodySite earned ${result.fieldScores.bodySite.earned}, expected ~6.67`,
    );
  });

  it("synonym matching works", () => {
    const userAnswer = {
      primaryLesion: ["raised plaque"], // synonym for "plaque"
      secondaryFeatures: ["micaceous scale", "pinpoint bleeding"], // synonyms
      color: ["red", "pink-salmon"], // synonyms
      border: ["sharply demarcated"], // synonym
      arrangement: ["disseminated"], // synonym for "scattered"
      distribution: ["symmetric", "extensor surfaces"],
      bodySite: ["elbows", "knees", "scalp"],
    };

    const result = scoreMorphologyAnswer(userAnswer, psoriasisRubric);

    assert.strictEqual(result.percentage, 100);
    assert.strictEqual(result.totalScore, result.maxScore);

    // Verify primary lesion matched via synonym
    assert.deepStrictEqual(result.fieldScores.primaryLesion.matched, ["plaque"]);
    assert.strictEqual(result.fieldScores.primaryLesion.missed.length, 0);

    // Verify secondary features matched via synonyms
    assert.deepStrictEqual(
      result.fieldScores.secondaryFeatures.matched.sort(),
      ["Auspitz sign", "silvery scale"].sort(),
    );
  });

  it("empty answer scores 0", () => {
    const result = scoreMorphologyAnswer({}, psoriasisRubric);

    assert.strictEqual(result.totalScore, 0);
    assert.strictEqual(result.percentage, 0);
    assert.strictEqual(result.maxScore, 65);

    // All fields missed everything
    for (const field of Object.keys(result.fieldScores)) {
      assert.strictEqual(
        result.fieldScores[field].earned,
        0,
        `${field} should be zero`,
      );
      assert.strictEqual(
        result.fieldScores[field].matched.length,
        0,
        `${field} should have no matches`,
      );
    }
  });
});

// ---------------------------------------------------------------------------
// scoreDifferentialRanking
// ---------------------------------------------------------------------------

describe("scoreDifferentialRanking", () => {
  const correctRanking = [
    "Psoriasis",
    "Nummular dermatitis",
    "Tinea corporis",
    "Pityriasis rosea",
    "Secondary syphilis",
  ];

  it("exact match gets full score", () => {
    const result = scoreDifferentialRanking(
      [...correctRanking],
      correctRanking,
    );

    // 5 items * 2 pts + 1 bonus = 11
    assert.strictEqual(result.maxScore, 11);
    assert.strictEqual(result.score, 11);
    assert.strictEqual(result.percentage, 100);
    assert.ok(
      result.feedback.some((f) => f.includes("Bonus")),
      "should have bonus feedback",
    );
  });

  it("partial match gets partial credit", () => {
    const userRanking = [
      "Tinea corporis", // wrong position (correct = #3)
      "Psoriasis", // wrong position (correct = #1)
      "Pityriasis rosea", // wrong position (correct = #4)
      "Nummular dermatitis", // wrong position (correct = #2)
      // missing Secondary syphilis
    ];

    const result = scoreDifferentialRanking(userRanking, correctRanking);

    // No exact-position matches => 0 exact-position points
    // 4 items present but wrong position => 4 * 1 = 4 points
    // #1 is not correct => no bonus
    assert.strictEqual(result.score, 4);
    assert.strictEqual(result.maxScore, 11);
    assert.ok(result.percentage > 0 && result.percentage < 100);
    assert.ok(
      result.feedback.some((f) => f.includes('Missed "Secondary syphilis"')),
      "should report missing item",
    );
  });

  it("synonym matching works in rankings", () => {
    const synonyms: Record<string, string[]> = {
      psoriasis: ["plaque psoriasis", "psoriasis vulgaris"],
    };

    const userRanking = [
      "Psoriasis vulgaris", // synonym for Psoriasis, position #1
      "Nummular dermatitis",
      "Tinea corporis",
    ];

    const correctShort = [
      "Psoriasis",
      "Nummular dermatitis",
      "Tinea corporis",
    ];

    const result = scoreDifferentialRanking(
      userRanking,
      correctShort,
      synonyms,
    );

    // All 3 exact position (3*2 = 6) + bonus (1) = 7
    assert.strictEqual(result.maxScore, 7);
    assert.strictEqual(result.score, 7);
    assert.strictEqual(result.percentage, 100);
  });

  it("empty user ranking scores 0", () => {
    const result = scoreDifferentialRanking([], correctRanking);

    assert.strictEqual(result.score, 0);
    assert.strictEqual(result.maxScore, 11);
    assert.strictEqual(result.percentage, 0);
    assert.strictEqual(result.feedback.filter((f) => f.startsWith("Missed")).length, 5);
  });
});

// ---------------------------------------------------------------------------
// scoreCaseQuestion
// ---------------------------------------------------------------------------

describe("scoreCaseQuestion", () => {
  // -- single_select --------------------------------------------------------

  it("single select - correct answer", () => {
    const question: CaseQuestion = {
      id: "q1",
      prompt:
        "A 35-year-old presents with well-defined erythematous plaques with silvery scale on elbows. What is the most likely diagnosis?",
      type: "single_select",
      options: [
        "Psoriasis",
        "Eczema",
        "Tinea corporis",
        "Contact dermatitis",
      ],
      correctAnswer: "Psoriasis",
      explanationCorrect:
        "Correct! Well-defined erythematous plaques with silvery scale on extensor surfaces are classic for psoriasis.",
      explanationIncorrect: {
        Eczema:
          "Eczema typically has ill-defined borders and is more common on flexural surfaces.",
        "Tinea corporis":
          "Tinea corporis usually has an annular morphology with central clearing.",
        "Contact dermatitis":
          "Contact dermatitis follows the pattern of exposure to the allergen.",
      },
    };

    const result = scoreCaseQuestion("Psoriasis", question);

    assert.strictEqual(result.score, 1);
    assert.strictEqual(result.maxScore, 1);
    assert.strictEqual(result.correct, true);
    assert.strictEqual(result.isDangerous, false);
    assert.ok(result.feedback.includes("Correct!"));
  });

  it("single select - incorrect answer shows specific feedback", () => {
    const question: CaseQuestion = {
      id: "q2",
      prompt: "What is the most likely diagnosis?",
      type: "single_select",
      options: ["Melanoma", "Seborrheic keratosis", "Basal cell carcinoma"],
      correctAnswer: "Melanoma",
      explanationCorrect: "Correct! The ABCDE criteria point to melanoma.",
      explanationIncorrect: {
        "Seborrheic keratosis":
          "Seborrheic keratoses have a stuck-on appearance and are benign.",
        "Basal cell carcinoma":
          "BCC typically presents as a pearly papule with telangiectasia.",
      },
    };

    const result = scoreCaseQuestion("Seborrheic keratosis", question);

    assert.strictEqual(result.score, 0);
    assert.strictEqual(result.correct, false);
    assert.ok(result.feedback.includes("stuck-on"));
  });

  // -- dangerous answer detection -------------------------------------------

  it("detects dangerous answers", () => {
    const question: CaseQuestion = {
      id: "q3",
      prompt:
        "A patient presents with a rapidly growing pigmented lesion with irregular borders. What is the next step?",
      type: "single_select",
      options: [
        "Excisional biopsy",
        "Reassurance and observation",
        "Topical corticosteroid",
        "Cryotherapy",
      ],
      correctAnswer: "Excisional biopsy",
      explanationCorrect:
        "Correct! A rapidly growing pigmented lesion with irregular borders warrants excisional biopsy to rule out melanoma.",
      explanationIncorrect: {
        "Reassurance and observation":
          "Dangerous! A rapidly changing pigmented lesion must be biopsied to rule out melanoma.",
        "Topical corticosteroid":
          "Incorrect. Steroids are not appropriate for suspected malignancy.",
        Cryotherapy:
          "Dangerous! Cryotherapy could destroy tissue needed for histological diagnosis.",
      },
      dangerousAnswers: ["Reassurance and observation", "Cryotherapy"],
    };

    const resultDangerous = scoreCaseQuestion(
      "Reassurance and observation",
      question,
    );
    assert.strictEqual(resultDangerous.isDangerous, true);
    assert.ok(resultDangerous.feedback.includes("WARNING"));

    const resultSafe = scoreCaseQuestion("Excisional biopsy", question);
    assert.strictEqual(resultSafe.isDangerous, false);
    assert.ok(!resultSafe.feedback.includes("WARNING"));
  });

  // -- multi_select ---------------------------------------------------------

  it("multi select - full credit for all correct", () => {
    const question: CaseQuestion = {
      id: "q4",
      prompt:
        "Select all features of dermoscopy that suggest melanoma (select all that apply).",
      type: "multi_select",
      options: [
        "Asymmetric pigment pattern",
        "Blue-white veil",
        "Regular pigment network",
        "Atypical dots and globules",
        "Comedo-like openings",
      ],
      correctAnswer: [
        "Asymmetric pigment pattern",
        "Blue-white veil",
        "Atypical dots and globules",
      ],
      explanationCorrect:
        "Correct! Asymmetric pigment, blue-white veil, and atypical dots/globules are melanoma-associated dermoscopic features.",
      explanationIncorrect: {
        "Regular pigment network": "Regular pigment network suggests a benign lesion.",
        "Comedo-like openings":
          "Comedo-like openings are characteristic of seborrheic keratosis.",
      },
    };

    const result = scoreCaseQuestion(
      ["Asymmetric pigment pattern", "Blue-white veil", "Atypical dots and globules"],
      question,
    );

    assert.strictEqual(result.score, 3);
    assert.strictEqual(result.maxScore, 3);
    assert.strictEqual(result.correct, true);
  });

  it("multi select - partial credit with penalties for wrong choices", () => {
    const question: CaseQuestion = {
      id: "q5",
      prompt: "Select features of atopic dermatitis.",
      type: "multi_select",
      options: [
        "Flexural involvement",
        "Pruritus",
        "Nikolsky sign",
        "Lichenification",
      ],
      correctAnswer: ["Flexural involvement", "Pruritus", "Lichenification"],
      explanationCorrect: "Correct!",
      explanationIncorrect: {
        "Nikolsky sign":
          "Nikolsky sign is associated with pemphigus, not atopic dermatitis.",
      },
    };

    // 2 correct + 1 wrong: 2 - 0.5 = 1.5
    const result = scoreCaseQuestion(
      ["Flexural involvement", "Pruritus", "Nikolsky sign"],
      question,
    );

    assert.strictEqual(result.score, 1.5);
    assert.strictEqual(result.maxScore, 3);
    assert.strictEqual(result.correct, false);
    assert.ok(result.feedback.includes("Partial credit"));
  });

  // -- ordered_steps --------------------------------------------------------

  it("ordered steps - full credit for correct order", () => {
    const question: CaseQuestion = {
      id: "q6",
      prompt: "Order the steps for a punch biopsy.",
      type: "ordered_steps",
      options: [
        "Clean the site",
        "Inject local anaesthetic",
        "Perform punch biopsy",
        "Apply haemostasis",
        "Dress the wound",
      ],
      correctAnswer: [
        "Clean the site",
        "Inject local anaesthetic",
        "Perform punch biopsy",
        "Apply haemostasis",
        "Dress the wound",
      ],
      explanationCorrect: "Correct sequence!",
      explanationIncorrect: {},
    };

    const result = scoreCaseQuestion(
      [
        "Clean the site",
        "Inject local anaesthetic",
        "Perform punch biopsy",
        "Apply haemostasis",
        "Dress the wound",
      ],
      question,
    );

    assert.strictEqual(result.score, 10); // 5 * 2
    assert.strictEqual(result.maxScore, 10);
    assert.strictEqual(result.correct, true);
  });

  // -- short_answer ---------------------------------------------------------

  it("short answer - accepts exact match", () => {
    const question: CaseQuestion = {
      id: "q7",
      prompt:
        "Name the sign where removal of scale causes pinpoint bleeding in psoriasis.",
      type: "short_answer",
      correctAnswer: ["Auspitz sign"],
      explanationCorrect: "Correct! The Auspitz sign is pathognomonic for psoriasis.",
      explanationIncorrect: {},
    };

    const correct = scoreCaseQuestion("Auspitz sign", question);
    assert.strictEqual(correct.correct, true);

    // case-insensitive
    const correctLower = scoreCaseQuestion("auspitz sign", question);
    assert.strictEqual(correctLower.correct, true);

    const wrong = scoreCaseQuestion("Koebner phenomenon", question);
    assert.strictEqual(wrong.correct, false);
  });

  // -- differential_rank via scoreCaseQuestion ------------------------------

  it("differential rank via scoreCaseQuestion", () => {
    const question: CaseQuestion = {
      id: "q8",
      prompt: "Rank the differential diagnoses from most to least likely.",
      type: "differential_rank",
      correctAnswer: [
        "Psoriasis",
        "Lichen planus",
        "Pityriasis rosea",
      ],
      explanationCorrect: "Correct ranking.",
      explanationIncorrect: {},
    };

    const perfect = scoreCaseQuestion(
      ["Psoriasis", "Lichen planus", "Pityriasis rosea"],
      question,
    );
    assert.strictEqual(perfect.correct, true);
    assert.strictEqual(perfect.score, perfect.maxScore);

    const partial = scoreCaseQuestion(
      ["Lichen planus", "Psoriasis", "Pityriasis rosea"],
      question,
    );
    assert.strictEqual(partial.correct, false);
    assert.ok(partial.score > 0);
    assert.ok(partial.score < partial.maxScore);
  });
});
