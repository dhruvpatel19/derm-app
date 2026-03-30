"use client";

import { useMemo, useState, useEffect } from "react";
import type { QuizItem, Condition } from "@/lib/domain/schemas";
import type { QuizScoreResult } from "@/lib/scoring/quiz-scorer";
import {
  Trophy,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Check,
  X,
  Target,
  Flame,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SessionResult {
  quizItem: QuizItem;
  scoreResult: QuizScoreResult;
}

interface TrainerSummaryProps {
  sessionResults: SessionResult[];
  correctCount: number;
  bestStreak: number;
  imageUrlMap: Record<string, string>;
  conditionMap: Record<string, Condition>;
  onRestart: () => void;
  onNewSession: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function scoreBadgeClass(pct: number): string {
  if (pct >= 80) return "bg-emerald-500 text-white";
  if (pct >= 50) return "bg-amber-500 text-white";
  return "bg-red-500 text-white";
}

function celebratoryText(pct: number): string {
  if (pct > 80) return "Excellent!";
  if (pct >= 50) return "Good work!";
  return "Keep practicing!";
}

function encouragement(pct: number): string {
  if (pct === 100) return "Perfect score! Outstanding mastery.";
  if (pct >= 80) return "Excellent work! You have strong pattern recognition.";
  if (pct >= 60) return "Good progress. Review the explanations for missed items.";
  if (pct >= 40) return "Keep practicing! Repetition builds recognition.";
  return "Every attempt builds your foundation. Review the explanations carefully.";
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
// Score ring (160px) with animated count-up
// ---------------------------------------------------------------------------

function ScoreRing({ percentage, size = 160 }: { percentage: number; size?: number }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const [displayPct, setDisplayPct] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplayPct(Math.round(eased * percentage));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [percentage]);

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
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
      </svg>
      <span className={`absolute text-4xl font-bold ${scoreTextClass(percentage)}`}>
        {displayPct}%
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Expandable result row
// ---------------------------------------------------------------------------

function ResultRow({
  result,
  index,
  imageUrl,
  condition,
}: {
  result: SessionResult;
  index: number;
  imageUrl: string | null;
  condition?: Condition;
}) {
  const [expanded, setExpanded] = useState(false);
  const pct = result.scoreResult.percentage;

  const allMatched = Object.values(result.scoreResult.fieldBreakdown).flatMap((f) => f.matched);
  const allMissed = Object.values(result.scoreResult.fieldBreakdown).flatMap((f) => f.missed);

  return (
    <div
      className="rounded-xl border border-border bg-card shadow-card card-hover animate-stagger-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        {/* Thumbnail */}
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={result.quizItem.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
              {index + 1}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {result.quizItem.title}
          </p>
          {condition && (
            <p className="truncate text-xs text-muted-foreground">{condition.name}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {result.scoreResult.isDangerous && (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreBadgeClass(pct)}`}>
            {Math.round(pct)}%
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border px-3 pb-3 pt-2 animate-fade-in">
          {/* Matched / missed chips */}
          <div className="flex flex-wrap gap-1.5">
            {allMatched.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-medium text-emerald-500"
              >
                <Check className="h-2.5 w-2.5" />
                {m}
              </span>
            ))}
            {allMissed.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-0.5 rounded-full bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-[10px] font-medium text-red-500"
              >
                <X className="h-2.5 w-2.5" />
                {m}
              </span>
            ))}
          </div>

          {result.scoreResult.isDangerous && (
            <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
              <AlertTriangle className="h-3 w-3" />
              Dangerous mimic missed
            </p>
          )}

          {/* Field bars */}
          <div className="mt-3 flex flex-col gap-1.5">
            {(
              Object.entries(result.scoreResult.fieldBreakdown) as Array<
                [string, { earned: number; max: number }]
              >
            ).map(([key, val]) => {
              if (val.max === 0) return null;
              const fieldPct = Math.round((val.earned / val.max) * 100);
              return (
                <div key={key} className="flex items-center gap-2 text-[11px]">
                  <span className="w-28 truncate font-medium text-muted-foreground">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (c) => c.toUpperCase())
                      .trim()}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full animate-bar-fill ${barColorClass(fieldPct)}`}
                      style={{ width: `${fieldPct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">{fieldPct}%</span>
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <p className="mt-3 text-xs text-muted-foreground leading-[1.7]">
            {result.quizItem.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TrainerSummary({
  sessionResults,
  correctCount,
  bestStreak,
  imageUrlMap,
  conditionMap,
  onRestart,
  onNewSession,
}: TrainerSummaryProps) {
  const total = sessionResults.length;
  const overallPct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const avgScore = useMemo(() => {
    if (total === 0) return 0;
    const sum = sessionResults.reduce((acc, r) => acc + r.scoreResult.percentage, 0);
    return Math.round(sum / total);
  }, [sessionResults, total]);

  const insights = useMemo(() => {
    const hitMap = new Map<string, number>();
    const missMap = new Map<string, number>();
    for (const r of sessionResults) {
      for (const f of Object.values(r.scoreResult.fieldBreakdown)) {
        for (const m of f.matched) hitMap.set(m, (hitMap.get(m) ?? 0) + 1);
        for (const m of f.missed) missMap.set(m, (missMap.get(m) ?? 0) + 1);
      }
    }
    const strongConcepts = [...hitMap.entries()]
      .filter(([concept]) => !missMap.has(concept))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([concept]) => concept);
    const weakConcepts = [...missMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([concept]) => concept);
    return { strongConcepts, weakConcepts };
  }, [sessionResults]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Hero */}
      <div className="text-center">
        <Trophy className="mx-auto mb-3 h-12 w-12 text-primary animate-float" />
        <h2>Session Complete</h2>
        <p className="mt-1 text-xl font-semibold text-primary">
          {celebratoryText(avgScore)}
        </p>
        <p className="mt-1 text-muted-foreground">{encouragement(overallPct)}</p>
      </div>

      {/* Large score ring, centered */}
      <div className="bg-card rounded-xl shadow-card p-8 flex flex-col items-center gap-8 animate-card-enter">
        <ScoreRing percentage={avgScore} size={160} />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {correctCount}/{total}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Correct</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-foreground">
              <Flame className="h-5 w-5 text-amber-500" />
              {bestStreak}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Best Streak</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{avgScore}%</div>
            <div className="text-xs text-muted-foreground mt-1">Avg Score</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      {(insights.strongConcepts.length > 0 || insights.weakConcepts.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {insights.strongConcepts.length > 0 && (
            <div className="bg-card rounded-xl shadow-card card-hover p-5 animate-card-enter stagger-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Target className="h-4 w-4 text-emerald-500" />
                Strengths
              </p>
              <div className="flex flex-wrap gap-1.5">
                {insights.strongConcepts.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-500"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {insights.weakConcepts.length > 0 && (
            <div className="bg-card rounded-xl shadow-card card-hover p-5 animate-card-enter stagger-2">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <BookOpen className="h-4 w-4 text-amber-500" />
                Concepts to Review
              </p>
              <div className="flex flex-wrap gap-1.5">
                {insights.weakConcepts.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-medium text-amber-500"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Per-question review */}
      <div className="bg-card rounded-xl shadow-card p-5 flex flex-col gap-3 animate-card-enter stagger-3">
        <p className="text-sm font-semibold text-foreground">Question Review</p>
        <div className="flex flex-col gap-2">
          {sessionResults.map((sr, idx) => (
            <ResultRow
              key={sr.quizItem.id}
              result={sr}
              index={idx}
              imageUrl={imageUrlMap[sr.quizItem.imageAssetId] ?? null}
              condition={conditionMap[sr.quizItem.conditionId]}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onNewSession}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-3 px-8 text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          New Session
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background text-foreground py-3 px-8 text-base font-medium transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="h-4 w-4" />
          Review Weak Areas
        </button>
      </div>
    </div>
  );
}
