"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  Target,
  BookOpen,
  Clock,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Brain,
  FileText,
  Crosshair,
  GitCompare,
  Microscope,
  TrendingUp,
  Flame,
  GraduationCap,
  Star,
} from "lucide-react";
import { useProgress } from "@/lib/use-progress";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cases } from "@/data/cases";
import { simulationModules } from "@/data/simulation-modules";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatRelativeTime(iso: string): string {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainMins = minutes % 60;
  if (remainMins === 0) return `${hours}h`;
  return `${hours}h ${remainMins}m`;
}

function accuracyColor(pct: number): string {
  if (pct >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function accuracyRingColor(pct: number): string {
  if (pct >= 80) return "stroke-emerald-500 dark:stroke-emerald-400";
  if (pct >= 50) return "stroke-amber-500 dark:stroke-amber-400";
  return "stroke-red-500 dark:stroke-red-400";
}

// ---------------------------------------------------------------------------
// SVG Ring Gauge (mini ring chart)
// ---------------------------------------------------------------------------

function RingGauge({
  value,
  size = 56,
  strokeWidth = 5,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="shrink-0 -rotate-90"
      aria-hidden="true"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className="stroke-muted"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className={accuracyRingColor(value)}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Quick-start modules (6 cards, 2x3 grid)
// ---------------------------------------------------------------------------

const quickLinks = [
  {
    href: "/trainer",
    icon: Brain,
    title: "Morphology Trainer",
    description: "Rapid-fire observation quizzes",
    color:
      "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  },
  {
    href: "/cases",
    icon: FileText,
    title: "Clinical Cases",
    description: "Step-by-step case reasoning",
    color:
      "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  },
  {
    href: "/simulation",
    icon: Crosshair,
    title: "Simulation Lab",
    description: "Procedural reasoning practice",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    href: "/compare",
    icon: GitCompare,
    title: "Compare Mode",
    description: "Side-by-side look-alikes",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    href: "/explorer",
    icon: BookOpen,
    title: "Condition Explorer",
    description: "Browse conditions and images",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    href: "/glossary",
    icon: Microscope,
    title: "Morphology Glossary",
    description: "Review terminology",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DashboardClient() {
  const {
    progress,
    loaded,
    resetProgress,
    getWeakConcepts,
    getRecommendedItems,
  } = useProgress();

  const quizAccuracy =
    progress.quizAttempts > 0
      ? Math.round((progress.quizCorrect / progress.quizAttempts) * 100)
      : 0;

  const hasActivity =
    progress.quizAttempts > 0 || progress.casesCompleted.length > 0;

  const totalCases = cases.length;
  const casesCompletedCount = progress.casesCompleted.length;
  const totalSimulations = simulationModules.filter((s) => s.isActive).length;

  const weakAreas = useMemo(() => getWeakConcepts(5), [getWeakConcepts]);
  const recommendedConcepts = useMemo(
    () => getRecommendedItems(),
    [getRecommendedItems],
  );

  const streakDays = useMemo(() => {
    if (!progress.lastActivity) return 0;
    const last = new Date(progress.lastActivity);
    const now = new Date();
    const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
    if (diffHours > 48) return 0;
    return Math.min(progress.sessionCount, 30);
  }, [progress.lastActivity, progress.sessionCount]);

  // Recommendations
  const recommendations: Array<{
    href: string;
    label: string;
    reason: string;
    icon: typeof Brain;
  }> = [];

  if (!hasActivity) {
    recommendations.push({
      href: "/glossary",
      label: "Start with the Morphology Glossary",
      reason: "Build your dermatology vocabulary foundation.",
      icon: Microscope,
    });
    recommendations.push({
      href: "/explorer",
      label: "Browse the Condition Explorer",
      reason: "Familiarize yourself with key conditions and images.",
      icon: BookOpen,
    });
    recommendations.push({
      href: "/trainer",
      label: "Try the Morphology Trainer",
      reason: "Test your observation skills with image-based quizzes.",
      icon: Brain,
    });
  } else {
    if (
      quizAccuracy < 70 &&
      progress.quizAttempts >= 5 &&
      recommendedConcepts.length > 0
    ) {
      recommendations.push({
        href: "/glossary",
        label: `Review these concepts: ${recommendedConcepts.slice(0, 3).join(", ")}`,
        reason: `Your accuracy is ${quizAccuracy}%. Targeted review will help.`,
        icon: Microscope,
      });
    }
    if (casesCompletedCount < totalCases) {
      const nextCase = cases.find(
        (c) => !progress.casesCompleted.includes(c.id),
      );
      recommendations.push({
        href: nextCase ? `/cases/${nextCase.id}` : "/cases",
        label: nextCase
          ? `Continue: ${nextCase.title}`
          : "Try a Clinical Case",
        reason: `${casesCompletedCount} of ${totalCases} cases completed.`,
        icon: FileText,
      });
    }
    if (progress.quizAttempts < 10) {
      recommendations.push({
        href: "/trainer",
        label: "Continue Morphology Trainer",
        reason: `${progress.quizAttempts} questions attempted. Reach 10 for better analytics.`,
        icon: Brain,
      });
    }
    if (quizAccuracy >= 80 && progress.quizAttempts >= 10) {
      recommendations.push({
        href: "/simulation",
        label: "Challenge yourself with Simulation Lab",
        reason: "Practice procedural reasoning with biopsy simulations.",
        icon: Crosshair,
      });
    }
    if (recommendations.length === 0) {
      recommendations.push({
        href: "/trainer",
        label: "Keep practicing with the Trainer",
        reason: "Consistency is key to mastery.",
        icon: TrendingUp,
      });
    }
  }

  // ---------- Empty state (no activity) ----------
  if (loaded && !hasActivity) {
    return (
      <div className="page-shell pb-24 pt-8 sm:pt-10">
        {/* Welcome hero */}
        <div className="animate-fade-in mb-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-teal-500/10">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight">
            Welcome to DermEd
          </h1>
          <p className="mx-auto max-w-lg text-lg text-muted-foreground">
            A comprehensive dermatology learning platform. Master morphology,
            clinical reasoning, and procedural skills through interactive
            modules.
          </p>
        </div>

        {/* Getting started cards */}
        <div className="animate-fade-in mb-10">
          <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Get Started
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                href: "/glossary",
                icon: Microscope,
                title: "Learn Terminology",
                desc: "Start with the Morphology Glossary to build your vocabulary.",
                color:
                  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
              },
              {
                href: "/trainer",
                icon: Brain,
                title: "Practice Quizzes",
                desc: "Test your observation skills with image-based morphology quizzes.",
                color:
                  "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
              },
              {
                href: "/cases",
                icon: FileText,
                title: "Solve Cases",
                desc: "Walk through realistic clinical cases with step-by-step reasoning.",
                color:
                  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
              },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group block">
                <Card className="h-full shadow-card rounded-xl transition-all hover:shadow-card-hover hover:-translate-y-0.5">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${item.color}`}
                    >
                      <item.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-2 text-base font-semibold">
                      {item.title}
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                    <span className="inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Get started
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* All modules */}
        <Separator className="mb-8" />
        <div className="animate-fade-in">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">
            All Modules
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map(
              ({ href, icon: Icon, title, description, color }) => (
                <Link key={href} href={href} className="group/link block">
                  <Card className="h-full shadow-card rounded-xl transition-all hover:shadow-card-hover hover:-translate-y-0.5">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-sm">{title}</CardTitle>
                          <CardDescription className="text-xs">
                            {description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <span className="inline-flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover/link:opacity-100">
                        Open
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ),
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-card dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p>
            <span className="font-semibold">Educational tool only.</span> This
            platform is designed for learning and is not intended for clinical
            diagnosis or patient care.
          </p>
        </div>
      </div>
    );
  }

  // ---------- Active dashboard ----------
  return (
    <div className="page-shell pb-24 pt-8 sm:pt-10">
      {/* Welcome: "Good morning/afternoon/evening" with study summary */}
      <section className="animate-fade-in mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getGreeting()}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {loaded
                ? progress.lastActivity
                  ? `Last active ${formatRelativeTime(progress.lastActivity)}`
                  : "Welcome back to DermEd"
                : "Loading your progress..."}
              {loaded && progress.sessionCount > 0 && (
                <>
                  {" "}
                  &middot; Session #{progress.sessionCount}
                </>
              )}
            </p>
            {loaded && streakDays > 0 && (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                <Flame className="h-3.5 w-3.5" />
                {streakDays} session{streakDays !== 1 ? "s" : ""} streak
              </div>
            )}
          </div>
          {hasActivity && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetProgress}
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="mr-1 h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      </section>

      {/* 4 stat cards in a row */}
      <section className="animate-fade-in mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Quiz Accuracy (with mini ring chart) */}
        <Card className="bg-card rounded-xl shadow-card p-4">
          <CardContent className="flex items-center gap-4 p-0">
            {loaded && progress.quizAttempts > 0 ? (
              <div className="relative flex items-center justify-center">
                <RingGauge value={quizAccuracy} />
                <span
                  className={`absolute text-sm font-bold ${accuracyColor(quizAccuracy)}`}
                >
                  {quizAccuracy}
                </span>
              </div>
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                <Target className="h-6 w-6 text-primary" />
              </div>
            )}
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {loaded
                  ? progress.quizAttempts > 0
                    ? `${quizAccuracy}%`
                    : "---"
                  : "--"}
              </p>
              <p className="text-xs text-muted-foreground">Quiz Accuracy</p>
              {loaded && progress.quizAttempts > 0 && (
                <p className="text-xs text-muted-foreground">
                  {progress.quizCorrect}/{progress.quizAttempts} correct
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quizzes Done */}
        <Card className="bg-card rounded-xl shadow-card p-4">
          <CardContent className="flex items-center gap-4 p-0">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {loaded ? progress.quizAttempts : "--"}
              </p>
              <p className="text-xs text-muted-foreground">Quizzes Done</p>
              <p className="text-xs text-muted-foreground">
                {loaded && progress.quizHistory.length > 0
                  ? `${progress.quizHistory.length} unique`
                  : ""}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cases Done */}
        <Card className="bg-card rounded-xl shadow-card p-4">
          <CardContent className="flex items-center gap-4 p-0">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {loaded ? (
                  <>
                    {casesCompletedCount}
                    <span className="text-base font-normal text-muted-foreground">
                      /{totalCases}
                    </span>
                  </>
                ) : (
                  "--"
                )}
              </p>
              <p className="text-xs text-muted-foreground">Cases Done</p>
              {loaded && totalCases > 0 && (
                <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-500"
                    style={{
                      width: `${(casesCompletedCount / totalCases) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Study Time */}
        <Card className="bg-card rounded-xl shadow-card p-4">
          <CardContent className="flex items-center gap-4 p-0">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {loaded
                  ? progress.totalTimeSeconds > 0
                    ? formatDuration(progress.totalTimeSeconds)
                    : "0m"
                  : "--"}
              </p>
              <p className="text-xs text-muted-foreground">Study Time</p>
              {loaded && totalSimulations > 0 && (
                <p className="text-xs text-muted-foreground">
                  {progress.simulationsCompleted.length}/{totalSimulations} sims
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="mb-8" />

      {/* Two-column: Weak Areas + Recommendations */}
      <section className="animate-fade-in mb-8 grid gap-6 lg:grid-cols-2">
        {/* Weak areas: horizontal bars */}
        <Card className="shadow-card rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Areas for Improvement</CardTitle>
            </div>
            <CardDescription>
              Top missed concepts based on your quiz performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {weakAreas.length > 0 ? (
              <div className="space-y-3">
                {weakAreas.map((item) => {
                  const maxCount = weakAreas[0].missCount;
                  const pct =
                    maxCount > 0 ? (item.missCount / maxCount) * 100 : 0;
                  return (
                    <div key={item.concept}>
                      <div className="mb-1 flex items-center justify-between">
                        <Link
                          href="/glossary"
                          className="text-sm font-medium hover:text-primary hover:underline"
                        >
                          {item.concept}
                        </Link>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {item.missCount} missed
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-red-400 transition-all duration-500 dark:bg-red-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                <BarChart3 className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  {progress.quizAttempts >= 5
                    ? "Great job! No persistent weak areas detected."
                    : "Complete at least 5 quiz questions to unlock weakness analysis."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Next Steps */}
        <Card className="shadow-card rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base">
                Recommended Next Steps
              </CardTitle>
            </div>
            <CardDescription>
              Personalized suggestions based on your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations.map((rec, i) => (
                <Link
                  key={i}
                  href={rec.href}
                  className="group flex items-start gap-3 rounded-xl border border-transparent bg-muted/50 p-3 transition-colors hover:border-primary/10 hover:bg-muted"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <rec.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium group-hover:underline">
                      {rec.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {rec.reason}
                    </p>
                  </div>
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="mb-8" />

      {/* Quick Start: 6 module cards (2x3) */}
      <section className="animate-fade-in mb-8">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">
          Quick Start
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map(
            ({ href, icon: Icon, title, description, color }) => (
              <Link key={href} href={href} className="group/link block">
                <Card className="h-full shadow-card rounded-xl transition-all hover:shadow-card-hover hover:-translate-y-0.5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-sm">{title}</CardTitle>
                        <CardDescription className="text-xs">
                          {description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <span className="inline-flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover/link:opacity-100">
                      Open
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ),
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-card dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <p>
          <span className="font-semibold">Educational tool only.</span> This
          platform is designed for learning and is not intended for clinical
          diagnosis or patient care.
        </p>
      </div>
    </div>
  );
}
