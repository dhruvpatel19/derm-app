"use client";

import { useCallback, useMemo, useState } from "react";
import type { ImageAsset, QuizItem } from "@/lib/domain/schemas";
import { DatasetImage } from "@/components/ui/dataset-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Send,
  SkipForward,
  X,
} from "lucide-react";

const CHIP_CATEGORIES: { label: string; chips: string[] }[] = [
  {
    label: "Primary Lesion",
    chips: [
      "macule",
      "patch",
      "papule",
      "plaque",
      "nodule",
      "vesicle",
      "bulla",
      "pustule",
      "wheal",
    ],
  },
  {
    label: "Secondary Features",
    chips: [
      "scale",
      "crust",
      "erosion",
      "ulcer",
      "excoriation",
      "lichenification",
      "atrophy",
      "telangiectasia",
    ],
  },
  {
    label: "Texture",
    chips: ["smooth", "rough", "flaky", "crusted", "eroded", "verrucous", "waxy"],
  },
  {
    label: "Color",
    chips: [
      "erythematous",
      "hyperpigmented",
      "hypopigmented",
      "violaceous",
      "pearly",
      "brown",
      "black",
      "tan",
    ],
  },
  {
    label: "Border",
    chips: ["well-demarcated", "ill-defined", "rolled", "irregular", "scalloped"],
  },
  {
    label: "Shape / Arrangement",
    chips: ["annular", "linear", "grouped", "dermatomal", "symmetric", "asymmetric", "polycyclic"],
  },
  {
    label: "Distribution",
    chips: ["localized", "generalized", "flexural", "extensor", "sun-exposed", "dermatomal"],
  },
  {
    label: "Body Site",
    chips: [
      "face",
      "scalp",
      "trunk",
      "extremity",
      "hand",
      "foot",
      "elbow",
      "knee",
      "forearm",
      "back",
      "ear",
      "nose",
      "antecubital fossa",
      "thorax",
      "lower leg",
      "forehead",
      "flank",
    ],
  },
];

interface QuizQuestionProps {
  item: QuizItem;
  imageUrl: string | null;
  imageAsset?: ImageAsset;
  currentIndex: number;
  totalCount: number;
  correctCount: number;
  streak: number;
  selectedChips: Set<string>;
  selectedDiagnosis: string | null;
  differentialRanking: string[];
  onToggleChip: (chip: string) => void;
  onSelectDiagnosis: (diagnosis: string) => void;
  onToggleDifferential: (diagnosis: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  learnMode: boolean;
  onToggleLearnMode: () => void;
}

function canSubmit(
  item: QuizItem,
  selectedChips: Set<string>,
  selectedDiagnosis: string | null,
  differentialRanking: string[]
): boolean {
  const questionType = item.questionType;
  if (questionType === "image_description" || questionType === "chip_select") {
    return selectedChips.size >= 3;
  }
  if (questionType === "single_select") return selectedDiagnosis !== null;
  if (questionType === "differential_rank") return differentialRanking.length >= 3;
  return false;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function QuestionShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-panel rounded-[30px] p-5 sm:p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </div>
      {subtitle && (
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{subtitle}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function QuizQuestion({
  item,
  imageUrl,
  imageAsset,
  currentIndex,
  totalCount,
  correctCount,
  streak,
  selectedChips,
  selectedDiagnosis,
  differentialRanking,
  onToggleChip,
  onSelectDiagnosis,
  onToggleDifferential,
  onSubmit,
  onSkip,
  learnMode,
  onToggleLearnMode,
}: QuizQuestionProps) {
  const progressPct = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;
  const ready = canSubmit(item, selectedChips, selectedDiagnosis, differentialRanking);
  const questionType = item.questionType;

  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [lastToggledChip, setLastToggledChip] = useState<string | null>(null);

  const toggleCategory = useCallback((label: string) => {
    setCollapsedCategories((previous) => {
      const next = new Set(previous);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const handleChipToggle = useCallback(
    (chip: string) => {
      setLastToggledChip(chip);
      onToggleChip(chip);
      setTimeout(() => setLastToggledChip(null), 260);
    },
    [onToggleChip]
  );

  const singleSelectOptions = useMemo(() => {
    if (questionType !== "single_select") return [];
    const correctDiagnosis = item.requiredConcepts.find(
      (concept) => concept.conceptType === "diagnosis"
    );
    const options = [
      correctDiagnosis?.conceptValue ?? "",
      ...item.distractors.map((distractor) => distractor.conceptValue),
    ].filter(Boolean);
    return [...options].sort((left, right) => {
      const leftHash =
        left.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) +
        item.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);
      const rightHash =
        right.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) +
        item.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);
      return leftHash - rightHash;
    });
  }, [questionType, item]);

  const differentialOptions = useMemo(() => {
    if (questionType !== "differential_rank") return [];
    return [
      ...item.topDifferentials,
      ...item.distractors
        .map((distractor) => distractor.conceptValue)
        .filter((value) => !item.topDifferentials.includes(value)),
    ];
  }, [questionType, item]);

  const availableDifferentials = differentialOptions.filter(
    (option) => !differentialRanking.includes(option)
  );

  return (
    <div className="mt-6 flex flex-col gap-6">
      <section className="surface-panel rounded-[30px] p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{item.difficulty}</Badge>
            <Badge variant="outline">{item.questionType.replace(/_/g, " ")}</Badge>
            {streak > 1 && (
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                {streak} correct streak
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" onClick={onToggleLearnMode}>
              {learnMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {learnMode ? "Hide explanations" : "Show explanations"}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>
              Question {currentIndex + 1} of {totalCount}
            </span>
            <span>{correctCount} answered strongly so far</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#1d7e78_0%,#205f7d_100%)] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.96fr)_minmax(360px,0.78fr)]">
        <section className="surface-panel-strong rounded-[34px] p-5 sm:p-6">
          <div className="rounded-[28px] overflow-hidden bg-muted shadow-card">
            <DatasetImage
              src={imageUrl}
              alt={imageAsset?.altText ?? "Clinical image"}
              enableZoom
              enableLightbox
              size="full"
              className="min-h-[300px] h-[320px] sm:min-h-[420px] sm:h-[480px]"
              bodySite={imageAsset?.bodySite}
            />
          </div>

          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Prompt
            </div>
            <p className="mt-3 text-base font-semibold leading-8 text-foreground sm:text-lg">
              {item.prompt}
            </p>
            {learnMode && (
              <div className="mt-5 rounded-[24px] border border-primary/20 bg-primary/8 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Learning notes
                </div>
                <p className="mt-2 text-sm leading-7 text-foreground/85">
                  {item.explanation}
                </p>
                {item.goldStandardDescription && (
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    <strong>Gold standard:</strong> {item.goldStandardDescription}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="flex flex-col gap-5">
          {(questionType === "image_description" || questionType === "chip_select") && (
            <QuestionShell
              title="Choose descriptors"
              subtitle="Pick at least 3 descriptors that best capture morphology, color, pattern, and site."
            >
              <div className="space-y-4">
                {CHIP_CATEGORIES.map((category) => {
                  const isCollapsed = collapsedCategories.has(category.label);
                  return (
                    <div key={category.label} className="rounded-[24px] border border-white/55 bg-white/46 p-4 dark:border-white/7 dark:bg-white/4">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.label)}
                        className="flex w-full items-center justify-between text-left"
                      >
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          {category.label}
                        </span>
                        {isCollapsed ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>

                      {!isCollapsed && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {category.chips.map((chip) => {
                            const selected = selectedChips.has(chip);
                            const justToggled = lastToggledChip === chip && selected;
                            return (
                              <button
                                key={chip}
                                type="button"
                                onClick={() => handleChipToggle(chip)}
                                className={cn(
                                  "rounded-full border px-3 py-1.5 text-xs font-semibold",
                                  selected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-white/70 bg-background/85 text-muted-foreground hover:text-foreground dark:border-white/8 dark:bg-white/5",
                                  justToggled && "animate-chip-bounce"
                                )}
                              >
                                {chip}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 rounded-[20px] border border-primary/15 bg-primary/8 px-4 py-3 text-sm text-foreground">
                Select at least 3 descriptors.{" "}
                <strong>{selectedChips.size}</strong> selected.
              </div>
            </QuestionShell>
          )}

          {questionType === "single_select" && (
            <QuestionShell
              title="Choose the best diagnosis"
              subtitle="Pick the single answer that most strongly fits the image and prompt."
            >
              <div className="grid gap-3">
                {singleSelectOptions.map((option, index) => {
                  const selected = selectedDiagnosis === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onSelectDiagnosis(option)}
                      className={cn(
                        "flex items-center gap-3 rounded-[22px] border p-4 text-left",
                        selected
                          ? "border-primary bg-primary/10 text-foreground shadow-[0_18px_34px_rgba(29,126,120,0.14)]"
                          : "border-white/65 bg-white/48 hover:border-primary/18 dark:border-white/7 dark:bg-white/4"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {LETTERS[index] ?? index + 1}
                      </span>
                      <span className="text-sm font-semibold">{option}</span>
                    </button>
                  );
                })}
              </div>
            </QuestionShell>
          )}

          {questionType === "differential_rank" && (
            <QuestionShell
              title="Rank your differentials"
              subtitle="Build a top-three list in order from most likely to least likely."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[24px] border border-white/55 bg-white/46 p-4 dark:border-white/7 dark:bg-white/4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Your ranking
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    {differentialRanking.length === 0 ? (
                      <p className="text-sm leading-7 text-muted-foreground">
                        Click options from the available list to build your
                        ranking.
                      </p>
                    ) : (
                      differentialRanking.map((diagnosis, index) => (
                        <div
                          key={diagnosis}
                          className="flex items-center gap-3 rounded-[18px] border border-primary/15 bg-primary/8 px-3 py-3"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            {index + 1}
                          </span>
                          <span className="flex-1 text-sm font-semibold text-foreground">
                            {diagnosis}
                          </span>
                          <button
                            type="button"
                            onClick={() => onToggleDifferential(diagnosis)}
                            className="rounded-full p-1 text-muted-foreground hover:text-foreground"
                            aria-label={`Remove ${diagnosis}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/55 bg-white/46 p-4 dark:border-white/7 dark:bg-white/4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Available diagnoses
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    {availableDifferentials.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => onToggleDifferential(option)}
                        className="rounded-[18px] border border-white/70 bg-background/85 px-3 py-3 text-left text-sm font-semibold text-foreground hover:border-primary/18 dark:border-white/8 dark:bg-white/5"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm leading-7 text-muted-foreground">
                {differentialRanking.length} diagnosis
                {differentialRanking.length === 1 ? "" : "es"} ranked so far.
              </div>
            </QuestionShell>
          )}

          <section className="surface-panel rounded-[30px] p-5 sm:p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Actions
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="outline" onClick={onSkip}>
                <SkipForward className="h-4 w-4" />
                Skip for now
              </Button>
              <Button
                onClick={onSubmit}
                disabled={!ready}
                className={ready ? "animate-glow-pulse" : ""}
              >
                <Send className="h-4 w-4" />
                Submit answer
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
