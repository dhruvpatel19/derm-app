"use client";

import { useState, useCallback, useMemo } from "react";
import type { QuizItem, ImageAsset, Condition } from "@/lib/domain/schemas";
import {
  scoreQuizItem,
  type QuizScoreResult,
  type UserAnswers,
} from "@/lib/scoring/quiz-scorer";
import { useProgress } from "@/lib/use-progress";

import { TrainerSetup, type DifficultyToggle, type QuestionTypeToggle } from "./trainer-setup";
import { QuizQuestion } from "./quiz-question";
import { QuizReview } from "./quiz-review";
import { TrainerSummary, type SessionResult } from "./trainer-summary";

interface TrainerClientProps {
  quizItems: QuizItem[];
  imageAssets: ImageAsset[];
  conditions: Condition[];
  imageUrlMap?: Record<string, string>;
}

type Phase = "setup" | "quiz" | "review" | "summary";

function toggleSet<T>(setter: React.Dispatch<React.SetStateAction<Set<T>>>) {
  return (val: T) =>
    setter((prev) => {
      const n = new Set(prev);
      if (n.has(val)) {
        n.delete(val);
      } else {
        n.add(val);
      }
      return n;
    });
}

export function TrainerClient({
  quizItems,
  imageAssets,
  conditions,
  imageUrlMap = {},
}: TrainerClientProps) {
  const imageMap = useMemo(() => Object.fromEntries(imageAssets.map((a) => [a.id, a])), [imageAssets]);
  const conditionMap = useMemo(() => Object.fromEntries(conditions.map((c) => [c.id, c])), [conditions]);

  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<DifficultyToggle>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<QuestionTypeToggle>>(new Set());

  const filteredItems = useMemo(
    () =>
      quizItems.filter((qi) => {
        if (!qi.isActive) return false;
        const diffOk = selectedDifficulties.size === 0 || selectedDifficulties.has(qi.difficulty);
        const typeOk = selectedTypes.size === 0 || selectedTypes.has(qi.questionType as QuestionTypeToggle);
        return diffOk && typeOk;
      }),
    [quizItems, selectedDifficulties, selectedTypes],
  );

  const [phase, setPhase] = useState<Phase>("setup");
  const [activeItems, setActiveItems] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnMode, setLearnMode] = useState(false);
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null);
  const [differentialRanking, setDifferentialRanking] = useState<string[]>([]);
  const [scoreResult, setScoreResult] = useState<QuizScoreResult | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const { recordQuizAttemptV2 } = useProgress();
  const item = activeItems[currentIndex] as QuizItem | undefined;

  const resetAnswerState = useCallback(() => {
    setSelectedChips(new Set());
    setSelectedDiagnosis(null);
    setDifferentialRanking([]);
    setScoreResult(null);
  }, []);

  const startSession = useCallback(
    (items: QuizItem[]) => {
      setActiveItems(items);
      setCurrentIndex(0);
      setCorrectCount(0);
      setStreak(0);
      setBestStreak(0);
      setSessionResults([]);
      resetAnswerState();
      setPhase("quiz");
    },
    [resetAnswerState],
  );

  const handleSubmit = useCallback(() => {
    if (!item) return;
    const userAnswers: UserAnswers = {};
    const qt = item.questionType;
    if (qt === "image_description" || qt === "chip_select") {
      userAnswers.selectedConcepts = Array.from(selectedChips);
    }
    if (qt === "single_select") {
      userAnswers.selectedDiagnosis = selectedDiagnosis ?? undefined;
      userAnswers.selectedConcepts = [];
    }
    if (qt === "differential_rank") {
      userAnswers.differentialRanking = differentialRanking;
      userAnswers.selectedConcepts = [];
    }
    const result = scoreQuizItem(userAnswers, item);
    setScoreResult(result);

    const isCorrect = result.percentage >= 70;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    setSessionResults((prev) => [...prev, { quizItem: item, scoreResult: result }]);
    const allMissed = Object.values(result.fieldBreakdown).flatMap((f) => f.missed);
    const allMatched = Object.values(result.fieldBreakdown).flatMap((f) => f.matched);
    recordQuizAttemptV2(item.id, result.totalScore, result.maxScore, result.percentage, allMatched, allMissed);
    setPhase("review");
  }, [item, selectedChips, selectedDiagnosis, differentialRanking, recordQuizAttemptV2]);

  const handleNext = useCallback(() => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= activeItems.length) {
      setPhase("summary");
    } else {
      setCurrentIndex(nextIdx);
      resetAnswerState();
      setPhase("quiz");
    }
  }, [currentIndex, activeItems.length, resetAnswerState]);

  const handleNewSession = useCallback(() => {
    setPhase("setup");
    setCurrentIndex(0);
    resetAnswerState();
    setCorrectCount(0);
    setStreak(0);
    setBestStreak(0);
    setSessionResults([]);
  }, [resetAnswerState]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleDifficulty = useCallback(toggleSet(setSelectedDifficulties), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleType = useCallback(toggleSet(setSelectedTypes), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleChip = useCallback(toggleSet(setSelectedChips), []);
  const handleDifferentialClick = useCallback(
    (d: string) => setDifferentialRanking((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d])),
    [],
  );

  if (phase === "setup") {
    return (
      <TrainerSetup
        quizItems={quizItems}
        selectedDifficulties={selectedDifficulties}
        selectedTypes={selectedTypes}
        onToggleDifficulty={toggleDifficulty}
        onToggleType={toggleType}
        onStart={() => startSession(filteredItems)}
        onStartAll={() => startSession(quizItems.filter((q) => q.isActive))}
      />
    );
  }

  if (phase === "quiz" && item) {
    return (
      <QuizQuestion
        item={item}
        imageUrl={imageUrlMap[item.imageAssetId] ?? null}
        imageAsset={imageMap[item.imageAssetId]}
        currentIndex={currentIndex}
        totalCount={activeItems.length}
        correctCount={correctCount}
        streak={streak}
        selectedChips={selectedChips}
        selectedDiagnosis={selectedDiagnosis}
        differentialRanking={differentialRanking}
        onToggleChip={toggleChip}
        onSelectDiagnosis={setSelectedDiagnosis}
        onToggleDifferential={handleDifferentialClick}
        onSubmit={handleSubmit}
        onSkip={handleNext}
        learnMode={learnMode}
        onToggleLearnMode={() => setLearnMode((v) => !v)}
      />
    );
  }

  if (phase === "review" && item && scoreResult) {
    return (
      <QuizReview
        item={item}
        scoreResult={scoreResult}
        imageUrl={imageUrlMap[item.imageAssetId] ?? null}
        imageAsset={imageMap[item.imageAssetId]}
        condition={conditionMap[item.conditionId]}
        currentIndex={currentIndex}
        totalCount={activeItems.length}
        onNext={handleNext}
      />
    );
  }

  if (phase === "summary") {
    return (
      <TrainerSummary
        sessionResults={sessionResults}
        correctCount={correctCount}
        bestStreak={bestStreak}
        imageUrlMap={imageUrlMap}
        conditionMap={conditionMap}
        onRestart={() => startSession(activeItems)}
        onNewSession={handleNewSession}
      />
    );
  }

  return null;
}
