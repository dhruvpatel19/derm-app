"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import type { SimulationModule } from "@/data/simulation-modules";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ListOrdered,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  Lightbulb,
  Trophy,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProcedureSequenceProps {
  module: SimulationModule;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProcedureSequence({ module }: ProcedureSequenceProps) {
  const correctSteps = module.procedureSteps ?? [];
  const totalSteps = correctSteps.length;

  const shuffledSteps = useMemo(
    () => shuffleArray(correctSteps),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const allSelected = selectedOrder.length === totalSteps;

  const results = useMemo(() => {
    if (!submitted) return [];

    return selectedOrder.map((shuffledIdx, userPos) => {
      const step = shuffledSteps[shuffledIdx];
      const correctPos = step.order - 1;
      const isExactPosition = userPos === correctPos;
      return {
        shuffledIdx,
        step,
        userPos,
        correctPos,
        isExactPosition,
      };
    });
  }, [submitted, selectedOrder, shuffledSteps]);

  const score = useMemo(() => {
    if (results.length === 0) return 0;
    const correctCount = results.filter((r) => r.isExactPosition).length;
    return Math.round((correctCount / totalSteps) * 100);
  }, [results, totalSteps]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleAddStep = useCallback(
    (shuffledIdx: number) => {
      if (submitted) return;
      if (selectedOrder.includes(shuffledIdx)) return;
      setSelectedOrder((prev) => [...prev, shuffledIdx]);
    },
    [submitted, selectedOrder],
  );

  const handleRemoveStep = useCallback(
    (shuffledIdx: number) => {
      if (submitted) return;
      setSelectedOrder((prev) => prev.filter((idx) => idx !== shuffledIdx));
    },
    [submitted],
  );

  const handleSubmit = useCallback(() => {
    if (!allSelected) return;
    setSubmitted(true);
  }, [allSelected]);

  const handleReset = useCallback(() => {
    setSelectedOrder([]);
    setSubmitted(false);
    setExpandedStep(null);
  }, []);

  const availableSteps = shuffledSteps
    .map((step, idx) => ({ step, idx }))
    .filter(({ idx }) => !selectedOrder.includes(idx));

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ListOrdered className="h-4 w-4" />
          </div>
          <Badge variant="outline" className="rounded-full">
            Procedure Sequencing
          </Badge>
          <DifficultyBadge difficulty={module.difficulty} />
        </div>
        <h1 className="text-2xl font-bold">{module.title}</h1>
      </div>

      {/* Case stem */}
      <Card className="shadow-card rounded-xl">
        <CardHeader>
          <CardTitle>Scenario</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{module.caseStem}</p>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="text-sm text-muted-foreground">
        {submitted
          ? "Review your sequence against the correct order below."
          : "Click steps on the left to add them to your sequence on the right. Click a step in the sequence to remove it."}
      </div>

      {/* Two-column layout (Available / Your Sequence) */}
      {!submitted && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* LEFT: Available steps */}
          <Card className="shadow-card rounded-xl">
            <CardHeader>
              <CardTitle className="text-sm">
                Available Steps ({availableSteps.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {availableSteps.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  All steps placed. Submit when ready.
                </p>
              ) : (
                availableSteps.map(({ step, idx }) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddStep(idx)}
                    className="flex w-full items-start gap-3 rounded-xl border bg-card p-3 text-left text-sm shadow-sm transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-primary/30"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Plus className="h-3 w-3" />
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold">{step.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {step.description}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          {/* RIGHT: Your sequence */}
          <Card className="shadow-card rounded-xl">
            <CardHeader>
              <CardTitle className="text-sm">
                Your Sequence ({selectedOrder.length}/{totalSteps})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {selectedOrder.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Click steps to add them here.
                </p>
              ) : (
                selectedOrder.map((shuffledIdx, orderPos) => {
                  const step = shuffledSteps[shuffledIdx];
                  return (
                    <button
                      key={shuffledIdx}
                      type="button"
                      onClick={() => handleRemoveStep(shuffledIdx)}
                      className="flex w-full items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-left text-sm shadow-sm transition-all duration-200 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/20 animate-in fade-in slide-in-from-left-2 duration-300"
                    >
                      {/* Teal circle with number */}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {orderPos + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold">{step.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                          {step.description}
                        </p>
                      </div>
                      <X className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>
                  );
                })
              )}
            </CardContent>
            <CardFooter className="justify-end gap-2">
              {selectedOrder.length > 0 && (
                <Button variant="ghost" onClick={handleReset}>
                  Clear
                </Button>
              )}
              <Button onClick={handleSubmit} disabled={!allSelected}>
                Submit Sequence
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* After submit: side-by-side comparison */}
      {submitted && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Your order */}
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="text-sm">Your Order</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {results.map((r) => (
                  <div
                    key={r.shuffledIdx}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${
                      r.isExactPosition
                        ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/20"
                        : "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/20"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                        r.isExactPosition ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    >
                      {r.userPos + 1}
                    </span>
                    <span className="flex-1 font-medium">{r.step.title}</span>
                    {r.isExactPosition ? (
                      <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-amber-600" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Correct order */}
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="text-sm">Correct Order</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {correctSteps
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((step) => (
                    <div
                      key={step.order}
                      className="flex items-center gap-3 rounded-xl border p-3 text-sm"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {step.order}
                      </span>
                      <span className="flex-1 font-medium">{step.title}</span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* Expandable step details with tips/warnings */}
          <Card className="shadow-card rounded-xl">
            <CardHeader>
              <CardTitle className="text-sm">Step Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {correctSteps
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((step) => {
                  const userResult = results.find(
                    (r) => r.step.order === step.order,
                  );
                  const isExpanded = expandedStep === step.order;

                  return (
                    <div key={step.order} className="rounded-xl border">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedStep(isExpanded ? null : step.order)
                        }
                        className="flex w-full items-center gap-3 p-3 text-left text-sm transition-colors hover:bg-muted/50"
                        aria-expanded={isExpanded}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {step.order}
                        </span>
                        <span className="flex-1 font-semibold">
                          {step.title}
                        </span>
                        {userResult && (
                          <Badge
                            variant={
                              userResult.isExactPosition
                                ? "default"
                                : "destructive"
                            }
                            className="mr-2 text-xs"
                          >
                            You: #{userResult.userPos + 1}
                          </Badge>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="border-t px-3 pb-3 pt-3 animate-in slide-in-from-top-1 duration-200">
                          <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                            {step.description}
                          </p>

                          {/* Tips */}
                          {step.tips && step.tips.length > 0 && (
                            <div className="mb-2 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-950/20">
                              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
                                <Lightbulb className="h-3.5 w-3.5" />
                                Tips
                              </div>
                              <ul className="flex flex-col gap-1">
                                {step.tips.map((tip, i) => (
                                  <li
                                    key={i}
                                    className="text-xs leading-relaxed text-amber-700 dark:text-amber-200"
                                  >
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Warnings */}
                          {step.warnings && step.warnings.length > 0 && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-700 dark:bg-red-950/20">
                              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-red-800 dark:text-red-300">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Warnings
                              </div>
                              <ul className="flex flex-col gap-1">
                                {step.warnings.map((warning, i) => (
                                  <li
                                    key={i}
                                    className="text-xs leading-relaxed text-red-700 dark:text-red-200"
                                  >
                                    {warning}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </CardContent>
          </Card>

          {/* Key teaching point */}
          <Separator />
          <Card className="shadow-card rounded-xl">
            <CardContent className="pt-6">
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm dark:border-teal-800 dark:bg-teal-950/20">
                <p className="mb-1 font-semibold text-teal-800 dark:text-teal-300">
                  Key Teaching Point
                </p>
                <p className="leading-relaxed text-teal-700 dark:text-teal-200">
                  {module.explanation}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Score */}
          <Card className="shadow-card rounded-xl">
            <CardContent className="py-6">
              <div className="flex items-center justify-center gap-4">
                <Trophy className="h-8 w-8 text-amber-500" />
                <div className="text-center">
                  <div className="text-2xl font-bold">{score}%</div>
                  <div className="text-sm text-muted-foreground">
                    {results.filter((r) => r.isExactPosition).length} of{" "}
                    {totalSteps} steps in correct position
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Link href="/simulation">
              <Button variant="secondary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Lab
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared sub-component
// ---------------------------------------------------------------------------

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const config: Record<string, { label: string; className: string }> = {
    beginner: {
      label: "Beginner",
      className:
        "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    intermediate: {
      label: "Intermediate",
      className:
        "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    },
    advanced: {
      label: "Advanced",
      className:
        "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-300",
    },
  };
  const diff = config[difficulty] ?? config.intermediate;
  return (
    <Badge
      variant="outline"
      className={`rounded-full text-xs ${diff.className}`}
    >
      {diff.label}
    </Badge>
  );
}
