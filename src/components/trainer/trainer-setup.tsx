"use client";

import { useMemo } from "react";
import type { DifficultyLevel, QuizItem } from "@/lib/domain/schemas";
import { Play, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DifficultyToggle = DifficultyLevel;
export type QuestionTypeToggle =
  | "image_description"
  | "single_select"
  | "chip_select"
  | "differential_rank";

const DIFFICULTY_OPTIONS: { value: DifficultyToggle; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const QUESTION_TYPE_OPTIONS: { value: QuestionTypeToggle; label: string }[] = [
  { value: "image_description", label: "Description" },
  { value: "single_select", label: "Diagnosis" },
  { value: "chip_select", label: "Feature selection" },
  { value: "differential_rank", label: "Differential rank" },
];

interface TrainerSetupProps {
  quizItems: QuizItem[];
  selectedDifficulties: Set<DifficultyToggle>;
  selectedTypes: Set<QuestionTypeToggle>;
  onToggleDifficulty: (difficulty: DifficultyToggle) => void;
  onToggleType: (type: QuestionTypeToggle) => void;
  onStart: () => void;
  onStartAll: () => void;
}

function FilterPill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold",
        active
          ? "bg-foreground text-background shadow-[0_18px_30px_rgba(18,36,60,0.16)]"
          : "border border-white/60 bg-white/52 text-muted-foreground hover:text-foreground dark:border-white/7 dark:bg-white/5"
      )}
    >
      {children}
    </button>
  );
}

export function TrainerSetup({
  quizItems,
  selectedDifficulties,
  selectedTypes,
  onToggleDifficulty,
  onToggleType,
  onStart,
  onStartAll,
}: TrainerSetupProps) {
  const totalActive = useMemo(
    () => quizItems.filter((item) => item.isActive).length,
    [quizItems]
  );

  const matchCount = useMemo(() => {
    return quizItems.filter((item) => {
      if (!item.isActive) return false;
      const difficultyMatch =
        selectedDifficulties.size === 0 ||
        selectedDifficulties.has(item.difficulty);
      const typeMatch =
        selectedTypes.size === 0 ||
        selectedTypes.has(item.questionType as QuestionTypeToggle);
      return difficultyMatch && typeMatch;
    }).length;
  }, [quizItems, selectedDifficulties, selectedTypes]);

  const hasFilters =
    selectedDifficulties.size > 0 || selectedTypes.size > 0;

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="ink-panel rounded-[34px] px-6 py-7 sm:px-7">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
          Practice workspace
        </div>
        <h2 className="mt-4 text-[2rem] text-white sm:text-[2.4rem]">
          Configure a focused drill session
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/72 sm:text-base">
          Tune the trainer by difficulty and task type, then run a fast session
          that feels more like a deliberate practice block than a static quiz.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              Available pool
            </div>
            <div className="mt-2 text-3xl font-extrabold text-white">
              {totalActive}
            </div>
            <p className="mt-1 text-sm text-white/65">Active prompts</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              Current match
            </div>
            <div className="mt-2 text-3xl font-extrabold text-white">
              {matchCount}
            </div>
            <p className="mt-1 text-sm text-white/65">Items fit the filters</p>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-white/10 bg-white/8 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
            What this trains
          </div>
          <div className="mt-3 grid gap-2">
            {[
              "Lesion morphology and descriptive precision",
              "Diagnosis selection under visual uncertainty",
              "Differential ranking and feature prioritization",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/72">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-panel-strong rounded-[34px] p-5 sm:p-6">
        <div className="grid gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Difficulty
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map((option) => (
                <FilterPill
                  key={option.value}
                  active={selectedDifficulties.has(option.value)}
                  onClick={() => onToggleDifficulty(option.value)}
                >
                  {option.label}
                </FilterPill>
              ))}
            </div>
          </div>

          <div className="border-t border-white/55 pt-6 dark:border-white/7">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Question types
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUESTION_TYPE_OPTIONS.map((option) => (
                <FilterPill
                  key={option.value}
                  active={selectedTypes.has(option.value)}
                  onClick={() => onToggleType(option.value)}
                >
                  {option.label}
                </FilterPill>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[20px] border border-white/55 bg-white/48 px-4 py-3 dark:border-white/7 dark:bg-white/4">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Filters
              </div>
              <div className="mt-2 text-sm font-bold text-foreground">
                {hasFilters ? "Custom" : "All active"}
              </div>
            </div>
            <div className="rounded-[20px] border border-white/55 bg-white/48 px-4 py-3 dark:border-white/7 dark:bg-white/4">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Ready to start
              </div>
              <div className="mt-2 text-sm font-bold text-foreground">
                {hasFilters ? `${matchCount} items` : `${totalActive} items`}
              </div>
            </div>
            <div className="rounded-[20px] border border-white/55 bg-white/48 px-4 py-3 dark:border-white/7 dark:bg-white/4">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Session mode
              </div>
              <div className="mt-2 text-sm font-bold text-foreground">
                Rapid practice
              </div>
            </div>
          </div>

          <div className="border-t border-white/55 pt-6 dark:border-white/7">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={hasFilters ? onStart : onStartAll}
                disabled={hasFilters ? matchCount === 0 : totalActive === 0}
                className={cn(
                  "sm:min-w-[220px]",
                  (hasFilters ? matchCount > 0 : totalActive > 0) &&
                    "animate-glow-pulse"
                )}
              >
                <Play className="h-4 w-4" />
                {hasFilters ? `Start filtered session (${matchCount})` : `Start all active (${totalActive})`}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onStartAll}
                disabled={totalActive === 0}
              >
                <Zap className="h-4 w-4" />
                Quick start with everything
              </Button>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Leave the filters blank for a broad review block, or narrow the
              set when you want to target a specific skill.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
