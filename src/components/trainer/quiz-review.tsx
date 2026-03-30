"use client";

import { useMemo } from "react";
import type { QuizItem, ImageAsset, Condition } from "@/lib/domain/schemas";
import type { QuizScoreResult } from "@/lib/scoring/quiz-scorer";
import { DatasetImage } from "@/components/ui/dataset-image";
import {
  Check,
  X,
  AlertTriangle,
  ChevronRight,
  BookOpen,
  Lightbulb,
  ShieldAlert,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function scoreStroke(pct: number): string {
  if (pct >= 80) return "var(--color-success, #10b981)";
  if (pct >= 50) return "#f59e0b";
  return "#ef4444";
}

function scoreTextClass(pct: number): string {
  if (pct >= 80) return "text-emerald-500";
  if (pct >= 50) return "text-amber-500";
  return "text-red-500";
}

function barColorClass(pct: number): string {
  if (pct >= 80) return "bg-primary";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
}

// ---------------------------------------------------------------------------
// Score ring (128px)
// ---------------------------------------------------------------------------

function ScoreRing({ percentage }: { percentage: number }) {
  const size = 128;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreStroke(percentage)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <span className={`absolute text-2xl font-bold ${scoreTextClass(percentage)}`}>
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Field bar
// ---------------------------------------------------------------------------

function FieldBar({ label, earned, max }: { label: string; earned: number; max: number }) {
  if (max === 0) return null;
  const pct = Math.round((earned / max) * 100);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {Math.round(earned)}/{Math.round(max)} ({pct}%)
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full animate-bar-fill ${barColorClass(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface QuizReviewProps {
  item: QuizItem;
  scoreResult: QuizScoreResult;
  imageUrl: string | null;
  imageAsset?: ImageAsset;
  condition?: Condition;
  currentIndex: number;
  totalCount: number;
  onNext: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function QuizReview({
  item,
  scoreResult,
  imageUrl,
  imageAsset,
  condition,
  currentIndex,
  totalCount,
  onNext,
}: QuizReviewProps) {
  const pct = scoreResult.percentage;
  const isLast = currentIndex + 1 >= totalCount;

  const allMatched = Object.values(scoreResult.fieldBreakdown).flatMap((f) => f.matched);
  const allMissed = Object.values(scoreResult.fieldBreakdown).flatMap((f) => f.missed);

  const missedExplanations = useMemo(() => {
    const map = new Map<string, string>();
    for (const rc of item.requiredConcepts) {
      const lowerVal = rc.conceptValue.toLowerCase();
      for (const missed of allMissed) {
        if (missed.toLowerCase() === lowerVal) {
          map.set(missed, `Expected as ${rc.conceptType} feature`);
        }
      }
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.requiredConcepts, allMissed.length]);

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Dangerous mimic alert */}
      {scoreResult.isDangerous && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4 animate-card-enter">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="font-semibold text-red-500">Dangerous Mimic Missed</p>
            <p className="mt-1 text-sm leading-relaxed text-red-500/80">
              Missing this diagnosis in clinical practice could lead to patient
              harm. The dangerous mimic was &ldquo;{item.dangerousMimic}&rdquo;.
            </p>
          </div>
        </div>
      )}

      {/* Two-column layout: image left, review right */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Image */}
        <div className="w-full rounded-xl overflow-hidden bg-muted shadow-card">
          <DatasetImage
            src={imageUrl}
            alt={imageAsset?.altText ?? "Clinical image"}
            enableZoom
            enableLightbox
            size="full"
            className="h-[260px] sm:h-[380px]"
            bodySite={imageAsset?.bodySite}
          />
        </div>

        {/* Scoring column */}
        <div className="flex flex-col gap-4">
          {/* Score ring + summary */}
          <div className="bg-card rounded-xl shadow-card p-5 flex items-center gap-5 animate-card-enter">
            <ScoreRing percentage={pct} />
            <div>
              <p className="text-lg font-bold text-foreground">
                {scoreResult.isDangerous
                  ? "Dangerous Miss"
                  : pct >= 70
                    ? "Well Done!"
                    : "Needs Improvement"}
              </p>
              <p className="text-sm text-muted-foreground">
                {scoreResult.totalScore}/{scoreResult.maxScore} points
                {scoreResult.bonusPoints > 0 && (
                  <span className="ml-1 text-primary">
                    (+{scoreResult.bonusPoints} bonus)
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Field bars */}
          <div className="bg-card rounded-xl shadow-card p-5 flex flex-col gap-3 animate-card-enter stagger-1">
            <p className="text-sm font-semibold text-foreground">Score Breakdown</p>
            {(
              Object.entries(scoreResult.fieldBreakdown) as Array<
                [string, { earned: number; max: number }]
              >
            ).map(([key, val]) => (
              <FieldBar
                key={key}
                label={formatFieldName(key)}
                earned={val.earned}
                max={val.max}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Concept chips */}
      <div className="bg-card rounded-xl shadow-card p-5 flex flex-col gap-5 animate-card-enter stagger-2">
        {/* Matched */}
        {allMatched.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-500">
              Matched Concepts
            </p>
            <div className="flex flex-wrap gap-1.5">
              {allMatched.map((m, i) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-500 animate-stagger-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <Check className="h-3 w-3" />
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missed */}
        {allMissed.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-red-500">
              Missed Concepts
            </p>
            <div className="flex flex-col gap-2">
              {allMissed.map((m, i) => (
                <div
                  key={m}
                  className="flex items-start gap-2 rounded-xl bg-red-500/5 border border-red-500/20 px-3 py-2 animate-stagger-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                  <div>
                    <span className="text-sm font-medium text-red-500">{m}</span>
                    {missedExplanations.has(m) && (
                      <p className="mt-0.5 text-xs text-red-500/60">
                        {missedExplanations.get(m)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Forbidden assumptions */}
        {scoreResult.penalties.forbiddenAssumptionSelected.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-500">
              Forbidden Assumptions Selected
            </p>
            <div className="flex flex-wrap gap-2">
              {scoreResult.penalties.forbiddenAssumptionSelected.map((fa) => {
                const reason = item.forbiddenAssumptions.find(
                  (f) => f.conceptValue.toLowerCase() === fa.toLowerCase(),
                )?.reason;
                return (
                  <div key={fa} className="flex flex-col gap-0.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-medium text-amber-500">
                      <AlertTriangle className="h-3 w-3" />
                      {fa}
                    </span>
                    {reason && (
                      <span className="ml-1 text-[11px] italic text-muted-foreground">
                        {reason}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="bg-card rounded-xl shadow-card p-5 flex flex-col gap-5 animate-card-enter stagger-3">
        {item.goldStandardDescription && (
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              Gold Standard Description
            </p>
            <p className="text-sm leading-[1.7] text-foreground">
              {item.goldStandardDescription}
            </p>
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Explanation</p>
          <div className="rounded-xl bg-muted/50 p-4 text-sm leading-[1.75] text-muted-foreground">
            {item.explanation.split("\n").map((paragraph, i) => (
              <p key={i} className={i > 0 ? "mt-3" : ""}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {item.managementPearl && (
          <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-amber-500">
              <Lightbulb className="h-3.5 w-3.5" />
              Management Pearl
            </p>
            <p className="text-sm leading-[1.7] text-foreground/80">
              {item.managementPearl}
            </p>
          </div>
        )}

        {condition && (
          <>
            <div className="h-px bg-border" />
            <a
              href={`/explorer/${condition.slug}`}
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              Learn more about {condition.name} &rarr;
            </a>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-white py-2.5 px-6 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isLast ? "View Results" : "Next Question"}
          {!isLast && <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
