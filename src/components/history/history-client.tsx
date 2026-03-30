"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  History,
  Trash2,
  Download,
  Brain,
  FileText,
  Crosshair,
  ArrowRight,
  Clock,
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";
import { useProgress } from "@/lib/use-progress";
import { useIsClient } from "@/lib/use-is-client";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// ---------------------------------------------------------------------------
// History storage
// ---------------------------------------------------------------------------

const HISTORY_KEY = "dermtool-history";

interface HistoryEntry {
  id: string;
  type: "quiz" | "case" | "simulation";
  title: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  matched?: string[];
  missed?: string[];
  caseId?: string;
  timestamp: string;
}

interface HistoryData {
  entries: HistoryEntry[];
}

function loadHistory(): HistoryData {
  if (typeof window === "undefined") return { entries: [] };
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return { entries: [] };
    const parsed = JSON.parse(raw) as Partial<HistoryData>;
    return { entries: parsed.entries ?? [] };
  } catch {
    return { entries: [] };
  }
}

function saveHistory(data: HistoryData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  if (!iso) return "Unknown";
  try {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Unknown";
  }
}

function relativeTime(iso: string): string {
  if (!iso) return "";
  try {
    const now = Date.now();
    const then = new Date(iso).getTime();
    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / 60_000);

    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 30) return `${diffDay}d ago`;
    return formatDate(iso);
  } catch {
    return "";
  }
}

function typeIcon(type: HistoryEntry["type"]) {
  switch (type) {
    case "quiz":
      return <Brain className="h-4 w-4" />;
    case "case":
      return <FileText className="h-4 w-4" />;
    case "simulation":
      return <Crosshair className="h-4 w-4" />;
  }
}

function typeIconColor(type: HistoryEntry["type"]): string {
  switch (type) {
    case "quiz":
      return "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400";
    case "case":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "simulation":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  }
}

function typeLabel(type: HistoryEntry["type"]) {
  switch (type) {
    case "quiz":
      return "Quiz";
    case "case":
      return "Case";
    case "simulation":
      return "Simulation";
  }
}

/** Score badge pill color: green >= 70, amber >= 40, red < 40 */
function scorePillClasses(percentage: number | undefined): string {
  if (percentage === undefined) return "bg-muted text-muted-foreground";
  if (percentage >= 70)
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (percentage >= 40)
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FilterType = "all" | "quiz" | "case" | "simulation";
type SortOrder = "newest" | "oldest";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HistoryClient() {
  const isClient = useIsClient();
  const { progress, loaded } = useProgress();
  const [persistedHistory, setPersistedHistory] = useState<HistoryData | null>(
    null
  );
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const hydratedHistory = useMemo(
    () => (isClient ? loadHistory() : { entries: [] }),
    [isClient]
  );
  const history = persistedHistory ?? hydratedHistory;
  const historyLoaded = isClient;

  // ----- actions -----

  const deleteEntry = useCallback(
    (id: string) => {
      const next: HistoryData = {
        entries: history.entries.filter((e) => e.id !== id),
      };
      setPersistedHistory(next);
      saveHistory(next);
    },
    [history],
  );

  const clearAll = useCallback(() => {
    const next: HistoryData = { entries: [] };
    setPersistedHistory(next);
    saveHistory(next);
    setClearDialogOpen(false);
  }, []);

  const exportJson = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      progress,
      history: history.entries,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dermtool-history-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [history, progress]);

  // ----- derived -----

  const hasHistory = history.entries.length > 0;
  const hasAnyActivity =
    hasHistory ||
    progress.quizAttempts > 0 ||
    progress.casesCompleted.length > 0;

  const quizAccuracy =
    progress.quizAttempts > 0
      ? Math.round((progress.quizCorrect / progress.quizAttempts) * 100)
      : 0;

  const counts = useMemo(
    () => ({
      all: history.entries.length,
      quiz: history.entries.filter((e) => e.type === "quiz").length,
      case: history.entries.filter((e) => e.type === "case").length,
      simulation: history.entries.filter((e) => e.type === "simulation").length,
    }),
    [history.entries],
  );

  const filteredAndSorted = useMemo(() => {
    let entries =
      filterType === "all"
        ? history.entries
        : history.entries.filter((e) => e.type === filterType);

    entries = [...entries].sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });

    return entries;
  }, [history.entries, filterType, sortOrder]);

  // ----- render -----

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="animate-fade-in mb-8">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-primary">
          <History className="h-5 w-5" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Learning History</h1>
        <p className="mt-2 text-muted-foreground">
          Review your past quiz attempts, case completions, and simulation
          history.
        </p>
      </section>

      {/* Summary stats bar */}
      {loaded && (
        <section className="animate-fade-in mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card rounded-xl shadow-card p-4">
            <CardContent className="flex items-center gap-3 p-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums">
                  {progress.quizAttempts}
                </p>
                <p className="text-xs text-muted-foreground">Quiz Attempts</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card rounded-xl shadow-card p-4">
            <CardContent className="flex items-center gap-3 p-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Brain className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums">
                  {progress.quizAttempts > 0 ? `${quizAccuracy}%` : "---"}
                </p>
                <p className="text-xs text-muted-foreground">Quiz Accuracy</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card rounded-xl shadow-card p-4">
            <CardContent className="flex items-center gap-3 p-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums">
                  {progress.casesCompleted.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Cases Completed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card rounded-xl shadow-card p-4">
            <CardContent className="flex items-center gap-3 p-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {progress.lastActivity
                    ? formatDate(progress.lastActivity)
                    : "No activity yet"}
                </p>
                <p className="text-xs text-muted-foreground">Last Activity</p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Export + Clear actions */}
      {hasAnyActivity && (
        <section className="animate-fade-in mb-6 flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportJson}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export JSON
          </Button>
          <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={!hasHistory}
                />
              }
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Clear All
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear all history?</DialogTitle>
                <DialogDescription>
                  This will permanently delete all {counts.all} history entries.
                  Your progress stats will not be affected. This action cannot be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Cancel
                </DialogClose>
                <Button variant="destructive" onClick={clearAll}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete All
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      )}

      <Separator className="mb-6" />

      {/* Empty state -- warm and inviting */}
      {!hasAnyActivity && historyLoaded && (
        <section className="animate-fade-in rounded-xl border border-dashed p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-900/20">
            <History className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">No history yet</h2>
          <p className="mx-auto mb-8 max-w-md text-sm text-muted-foreground">
            Complete quizzes, clinical cases, or simulations to start building
            your learning history. Your progress will be tracked here
            automatically.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/trainer">
              <Button variant="outline">
                <Brain className="mr-1.5 h-4 w-4" />
                Start Trainer
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/cases">
              <Button variant="outline">
                <FileText className="mr-1.5 h-4 w-4" />
                Start a Case
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/simulation">
              <Button variant="outline">
                <Crosshair className="mr-1.5 h-4 w-4" />
                Try Simulation
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Completed cases from progress (shown when no detailed history) */}
      {loaded && progress.casesCompleted.length > 0 && !hasHistory && (
        <section className="animate-fade-in mb-8">
          <h2 className="mb-4 text-lg font-semibold">Completed Cases</h2>
          <div className="grid gap-3">
            {progress.casesCompleted.map((caseId) => (
              <Card key={caseId} size="sm" className="shadow-card rounded-xl">
                <CardContent className="flex items-center gap-3 pt-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{caseId}</p>
                    {progress.casesScores[caseId] !== undefined && (
                      <p className="text-xs text-muted-foreground">
                        Score: {progress.casesScores[caseId]}%
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Activity Timeline */}
      {hasHistory && (
        <section className="animate-fade-in">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-tight">
              Activity Timeline
            </h2>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSortOrder((o) => (o === "newest" ? "oldest" : "newest"))
                }
                className="text-xs"
              >
                <ArrowUpDown className="mr-1 h-3 w-3" />
                {sortOrder === "newest" ? "Newest" : "Oldest"}
              </Button>
            </div>
          </div>

          {/* Filter tabs (All / Quizzes / Cases / Sims) */}
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            <SlidersHorizontal className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
            {(
              [
                { key: "all", label: "All" },
                { key: "quiz", label: "Quizzes" },
                { key: "case", label: "Cases" },
                { key: "simulation", label: "Sims" },
              ] as const
            ).map(({ key, label }) => {
              const active = filterType === key;
              const count = counts[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilterType(key)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {label}
                  <span
                    className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                      active
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted-foreground/10 text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Timeline entries */}
          {filteredAndSorted.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No entries match the current filter.
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredAndSorted.map((entry) => {
                const isExpanded = expandedId === entry.id;
                const hasDetails =
                  (entry.matched && entry.matched.length > 0) ||
                  (entry.missed && entry.missed.length > 0);

                return (
                  <Card
                    key={entry.id}
                    size="sm"
                    className="shadow-card rounded-xl transition-all"
                  >
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-start gap-3">
                        {/* Type icon */}
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${typeIconColor(entry.type)}`}
                        >
                          {typeIcon(entry.type)}
                        </div>

                        {/* Center: details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium">
                              {entry.title}
                            </p>
                            <Badge
                              variant="outline"
                              className="shrink-0 text-[10px]"
                            >
                              {typeLabel(entry.type)}
                            </Badge>
                          </div>

                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {relativeTime(entry.timestamp)}
                            </span>
                            {/* Score badge pill (green/amber/red) */}
                            {entry.percentage !== undefined && (
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${scorePillClasses(entry.percentage)}`}
                              >
                                {entry.percentage}%
                              </span>
                            )}
                            {entry.score !== undefined &&
                              entry.maxScore !== undefined && (
                                <span className="text-xs text-muted-foreground">
                                  {entry.score}/{entry.maxScore}
                                </span>
                              )}
                          </div>

                          {/* Expandable details */}
                          {isExpanded && (
                            <div className="mt-3 space-y-2 border-t pt-3">
                              {entry.matched && entry.matched.length > 0 && (
                                <div>
                                  <p className="mb-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                    Matched Concepts
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {entry.matched.map((c) => (
                                      <span
                                        key={c}
                                        className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                                      >
                                        <CheckCircle2 className="h-2.5 w-2.5" />
                                        {c}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {entry.missed && entry.missed.length > 0 && (
                                <div>
                                  <p className="mb-1 text-xs font-medium text-red-700 dark:text-red-400">
                                    Missed Concepts
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {entry.missed.map((c) => (
                                      <span
                                        key={c}
                                        className="inline-flex items-center gap-0.5 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                      >
                                        <XCircle className="h-2.5 w-2.5" />
                                        {c}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {formatDate(entry.timestamp)}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Right: expand + delete */}
                        <div className="flex shrink-0 items-center gap-1">
                          {hasDetails && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedId(isExpanded ? null : entry.id)
                              }
                              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              aria-label={
                                isExpanded
                                  ? "Collapse details"
                                  : "Expand details"
                              }
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteEntry(entry.id)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            aria-label="Delete entry"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Disclaimer */}
      <div className="mt-10 flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-card dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <p>
          <span className="font-semibold">Educational tool only.</span> This
          history is stored locally in your browser and is not backed up.
        </p>
      </div>
    </div>
  );
}
