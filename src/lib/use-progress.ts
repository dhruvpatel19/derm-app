"use client";

import { useState, useMemo, useCallback } from "react";
import { useIsClient } from "./use-is-client";

const STORAGE_KEY = "dermtool-progress";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuizHistoryEntry {
  quizItemId: string;
  score: number;
  maxScore: number;
  percentage: number;
  selectedConcepts: string[];
  timestamp: string;
}

export interface ProgressData {
  // Existing fields (backward-compatible)
  quizAttempts: number;
  quizCorrect: number;
  casesCompleted: string[];
  casesScores: Record<string, number>;
  lastActivity: string;

  // New fields
  quizHistory: QuizHistoryEntry[];
  weakConcepts: Record<string, number>; // concept -> miss count
  strongConcepts: Record<string, number>; // concept -> hit count
  simulationsCompleted: string[];
  simulationsScores: Record<string, number>;
  sessionCount: number;
  totalTimeSeconds: number;
}

// ---------------------------------------------------------------------------
// Defaults / persistence
// ---------------------------------------------------------------------------

function defaultProgress(): ProgressData {
  return {
    quizAttempts: 0,
    quizCorrect: 0,
    casesCompleted: [],
    casesScores: {},
    lastActivity: "",
    quizHistory: [],
    weakConcepts: {},
    strongConcepts: {},
    simulationsCompleted: [],
    simulationsScores: {},
    sessionCount: 0,
    totalTimeSeconds: 0,
  };
}

function loadProgress(): ProgressData {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressData>;
    return {
      quizAttempts: parsed.quizAttempts ?? 0,
      quizCorrect: parsed.quizCorrect ?? 0,
      casesCompleted: parsed.casesCompleted ?? [],
      casesScores: parsed.casesScores ?? {},
      lastActivity: parsed.lastActivity ?? "",
      quizHistory: parsed.quizHistory ?? [],
      weakConcepts: parsed.weakConcepts ?? {},
      strongConcepts: parsed.strongConcepts ?? {},
      simulationsCompleted: parsed.simulationsCompleted ?? [],
      simulationsScores: parsed.simulationsScores ?? {},
      sessionCount: parsed.sessionCount ?? 0,
      totalTimeSeconds: parsed.totalTimeSeconds ?? 0,
    };
  } catch {
    return defaultProgress();
  }
}

function saveProgress(data: ProgressData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useProgress() {
  const isClient = useIsClient();
  const [persistedProgress, setPersistedProgress] = useState<ProgressData | null>(
    null
  );
  const loadedProgress = useMemo(
    () => (isClient ? loadProgress() : defaultProgress()),
    [isClient]
  );
  const progress = persistedProgress ?? loadedProgress;
  const loaded = isClient;

  const persist = useCallback((next: ProgressData) => {
    setPersistedProgress(next);
    saveProgress(next);
  }, []);

  // -- Legacy method (backward-compatible) ----------------------------------

  const recordQuizAttempt = useCallback(
    (correct: boolean) => {
      const next: ProgressData = {
        ...progress,
        quizAttempts: progress.quizAttempts + 1,
        quizCorrect: progress.quizCorrect + (correct ? 1 : 0),
        lastActivity: new Date().toISOString(),
      };
      persist(next);
    },
    [progress, persist],
  );

  // -- New method: recordQuizAttemptV2 --------------------------------------

  const recordQuizAttemptV2 = useCallback(
    (
      quizItemId: string,
      score: number,
      maxScore: number,
      percentage: number,
      selectedConcepts: string[],
      missedConcepts: string[],
    ) => {
      const entry: QuizHistoryEntry = {
        quizItemId,
        score,
        maxScore,
        percentage,
        selectedConcepts,
        timestamp: new Date().toISOString(),
      };

      const isCorrect = percentage >= 70;

      // Update weak/strong concepts
      const weakConcepts = { ...progress.weakConcepts };
      const strongConcepts = { ...progress.strongConcepts };

      for (const concept of missedConcepts) {
        weakConcepts[concept] = (weakConcepts[concept] ?? 0) + 1;
      }
      for (const concept of selectedConcepts) {
        strongConcepts[concept] = (strongConcepts[concept] ?? 0) + 1;
      }

      const next: ProgressData = {
        ...progress,
        quizAttempts: progress.quizAttempts + 1,
        quizCorrect: progress.quizCorrect + (isCorrect ? 1 : 0),
        lastActivity: new Date().toISOString(),
        quizHistory: [...progress.quizHistory, entry],
        weakConcepts,
        strongConcepts,
      };
      persist(next);
    },
    [progress, persist],
  );

  // -- Record case completion -----------------------------------------------

  const recordCaseCompletion = useCallback(
    (caseId: string, score: number) => {
      const casesCompleted = progress.casesCompleted.includes(caseId)
        ? progress.casesCompleted
        : [...progress.casesCompleted, caseId];
      const next: ProgressData = {
        ...progress,
        casesCompleted,
        casesScores: { ...progress.casesScores, [caseId]: score },
        lastActivity: new Date().toISOString(),
      };
      persist(next);
    },
    [progress, persist],
  );

  // -- Record simulation attempt --------------------------------------------

  const recordSimulationAttempt = useCallback(
    (simId: string, score: number) => {
      const simulationsCompleted = progress.simulationsCompleted.includes(simId)
        ? progress.simulationsCompleted
        : [...progress.simulationsCompleted, simId];
      const next: ProgressData = {
        ...progress,
        simulationsCompleted,
        simulationsScores: { ...progress.simulationsScores, [simId]: score },
        lastActivity: new Date().toISOString(),
      };
      persist(next);
    },
    [progress, persist],
  );

  // -- Get weak concepts sorted ---------------------------------------------

  const getWeakConcepts = useCallback(
    (limit?: number): Array<{ concept: string; missCount: number }> => {
      const entries = Object.entries(progress.weakConcepts)
        .map(([concept, missCount]) => ({ concept, missCount }))
        .sort((a, b) => b.missCount - a.missCount);
      return limit ? entries.slice(0, limit) : entries;
    },
    [progress],
  );

  // -- Get recommended items (concept areas needing practice) ----------------

  const getRecommendedItems = useCallback((): string[] => {
    const weak = getWeakConcepts(10);
    const strong = progress.strongConcepts;

    // Return concepts that are weak and not yet strong
    return weak
      .filter((w) => {
        const hits = strong[w.concept] ?? 0;
        // If they miss more than they hit, it's a weak area
        return w.missCount > hits;
      })
      .map((w) => w.concept);
  }, [progress, getWeakConcepts]);

  // -- Increment session count ----------------------------------------------

  const incrementSession = useCallback(() => {
    const next: ProgressData = {
      ...progress,
      sessionCount: progress.sessionCount + 1,
      lastActivity: new Date().toISOString(),
    };
    persist(next);
  }, [progress, persist]);

  // -- Add time -------------------------------------------------------------

  const addTime = useCallback(
    (seconds: number) => {
      const next: ProgressData = {
        ...progress,
        totalTimeSeconds: progress.totalTimeSeconds + seconds,
      };
      persist(next);
    },
    [progress, persist],
  );

  // -- Reset progress -------------------------------------------------------

  const resetProgress = useCallback(() => {
    const next = defaultProgress();
    persist(next);
  }, [persist]);

  return {
    progress,
    loaded,
    // Legacy (backward-compatible)
    recordQuizAttempt,
    recordCaseCompletion,
    resetProgress,
    // New
    recordQuizAttemptV2,
    recordSimulationAttempt,
    getWeakConcepts,
    getRecommendedItems,
    incrementSession,
    addTime,
  };
}
