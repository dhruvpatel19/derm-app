"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { SimulationModule } from "@/data/simulation-modules";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Crosshair,
  Trophy,
  User,
  ArrowLeft,
  Circle,
  Minus,
  Square,
  Ban,
} from "lucide-react";
import { DatasetImage } from "@/components/ui/dataset-image";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BiopsyChoiceProps {
  module: SimulationModule;
  imageUrl: string | null;
}

// ---------------------------------------------------------------------------
// Icon map for biopsy types
// ---------------------------------------------------------------------------

function BiopsyIcon({ label }: { label: string }) {
  const lower = label.toLowerCase();
  if (lower.includes("punch")) return <Circle className="h-4 w-4" />;
  if (lower.includes("shave")) return <Minus className="h-4 w-4" />;
  if (lower.includes("excision")) return <Square className="h-4 w-4" />;
  if (lower.includes("none") || lower.includes("no biopsy"))
    return <Ban className="h-4 w-4" />;
  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BiopsyChoice({ module, imageUrl }: BiopsyChoiceProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const options = module.choiceOptions ?? [];
  const selectedOption = options.find((o) => o.id === selectedId);
  const isCorrect = submitted && selectedOption?.isCorrect === true;
  const isDangerous = submitted && selectedOption?.isDangerous === true;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleSubmit = useCallback(() => {
    if (selectedId === null) return;
    setSubmitted(true);
  }, [selectedId]);

  const handleReset = useCallback(() => {
    setSelectedId(null);
    setSubmitted(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-primary">
            <Crosshair className="h-4 w-4" />
          </div>
          <Badge variant="outline" className="rounded-full">
            Biopsy Choice
          </Badge>
          <DifficultyBadge difficulty={module.difficulty} />
        </div>
        <h1 className="text-2xl font-bold">{module.title}</h1>
      </div>

      {/* Case Stem Card */}
      <Card className="shadow-card rounded-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Clinical Scenario</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-[1.7]">{module.caseStem}</p>
        </CardContent>
      </Card>

      {/* Clinical image (large) */}
      <Card className="overflow-hidden shadow-card rounded-xl">
        <DatasetImage
          src={imageUrl}
          alt={module.caseStem ?? "Clinical image for simulation"}
          className="min-h-[160px] max-h-[440px]"
          size="full"
          enableZoom
          enableLightbox
        />
      </Card>

      {/* Biopsy choice cards */}
      <div>
        <h2 className="mb-3 text-base font-semibold">
          Which biopsy technique is most appropriate?
        </h2>
        <div className="grid gap-3">
          {options.map((option) => {
            const isSelected = selectedId === option.id;

            // Post-submit styling
            let cardClass = "border-border bg-card";
            let shakeClass = "";
            if (submitted) {
              if (option.isCorrect) {
                cardClass =
                  "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/20";
              } else if (isSelected && option.isDangerous) {
                cardClass =
                  "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/20";
                shakeClass = "animate-shake";
              } else if (isSelected) {
                cardClass =
                  "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/20";
              }
            } else if (isSelected) {
              cardClass =
                "border-primary bg-primary/10 dark:border-primary dark:bg-primary/10";
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  if (!submitted) setSelectedId(option.id);
                }}
                disabled={submitted}
                aria-pressed={isSelected}
                className={`flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left shadow-card transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  !submitted
                    ? "hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer"
                    : "cursor-default"
                } ${cardClass} ${shakeClass}`}
              >
                {/* Biopsy type icon */}
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                    isSelected && !submitted
                      ? "bg-primary/20 text-primary"
                      : submitted && option.isCorrect
                        ? "bg-emerald-200 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200"
                        : submitted && isSelected && option.isDangerous
                          ? "bg-red-200 text-red-700 dark:bg-red-800 dark:text-red-200"
                          : "bg-muted text-muted-foreground"
                  }`}
                >
                  <BiopsyIcon label={option.label} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold">{option.label}</p>
                  {option.explanation && !submitted && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      {option.explanation.slice(0, 60)}...
                    </p>
                  )}
                  {submitted && (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {option.explanation}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {submitted && option.isCorrect && (
                    <Check className="h-5 w-5 text-emerald-600" />
                  )}
                  {submitted && isSelected && !option.isCorrect && (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                  {submitted && isSelected && option.isDangerous && (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      {!submitted && (
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={selectedId === null}
            className={`transition-all duration-150 ${selectedId !== null ? "animate-glow-pulse" : ""}`}
          >
            Submit Answer
          </Button>
        </div>
      )}

      {/* Post-submit feedback */}
      {submitted && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          {/* Dangerous banner */}
          {isDangerous && (
            <div className="flex items-start gap-3 rounded-xl border border-red-400 bg-red-50 p-4 shadow-card dark:border-red-700 dark:bg-red-950/20">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <p className="font-semibold text-red-800 dark:text-red-300">
                  Dangerous Choice
                </p>
                <p className="text-sm text-red-700 dark:text-red-200">
                  The option you selected is considered a critical error in
                  clinical practice. This choice could lead to patient harm,
                  misdiagnosis, or inappropriate staging.
                </p>
              </div>
            </div>
          )}

          {/* Correct / Incorrect banner */}
          {!isDangerous && (
            <div
              className={`flex items-start gap-3 rounded-xl border p-4 shadow-card ${
                isCorrect
                  ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/20"
                  : "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/20"
              }`}
            >
              {isCorrect ? (
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              ) : (
                <X className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              )}
              <div>
                <p
                  className={`font-semibold ${
                    isCorrect
                      ? "text-emerald-800 dark:text-emerald-300"
                      : "text-amber-800 dark:text-amber-300"
                  }`}
                >
                  {isCorrect ? "Correct!" : "Not the best choice"}
                </p>
                <p
                  className={`text-sm ${
                    isCorrect
                      ? "text-emerald-700 dark:text-emerald-200"
                      : "text-amber-700 dark:text-amber-200"
                  }`}
                >
                  {isCorrect
                    ? "Well done. You selected the gold standard approach."
                    : "While not dangerous, there is a more appropriate technique for this scenario."}
                </p>
              </div>
            </div>
          )}

          {/* Explanation card */}
          <Separator />
          <Card className="shadow-card rounded-xl">
            <CardContent className="pt-4">
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm dark:border-teal-800 dark:bg-teal-950/20">
                <p className="mb-1 font-semibold text-teal-800 dark:text-teal-300">
                  Explanation
                </p>
                <p className="leading-[1.7] text-teal-700 dark:text-teal-200">
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
                  <div className="text-2xl font-bold">
                    {isCorrect ? "100%" : isDangerous ? "0%" : "50%"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isCorrect
                      ? "Perfect"
                      : isDangerous
                        ? "Critical error"
                        : "Partial credit"}
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
