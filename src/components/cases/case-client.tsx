"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import type {
  CaseModule,
  CaseQuestion,
  AnswerOption,
} from "@/lib/domain/schemas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageGallery, type GalleryImageItem } from "@/components/ui/image-gallery";
import {
  Check,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Skull,
  Stethoscope,
  ClipboardList,
  User,
  Trophy,
  ArrowLeft,
  SkipForward,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────── */

interface CaseClientProps {
  caseData: CaseModule;
  conditionName: string;
  caseImages: GalleryImageItem[];
}

type CasePhase = "intro" | "question" | "question-review" | "summary";

interface QuestionResult {
  questionId: string;
  correct: boolean;
  selectedSingle: string | null;
  selectedMulti: string[];
  selectedOrdered: string[];
  skipped: boolean;
}

/* ── Step Dots ─────────────────────────────────────────── */

function StepDots({
  questions,
  results,
  qIndex,
  phase,
}: {
  questions: CaseQuestion[];
  results: QuestionResult[];
  qIndex: number;
  phase: CasePhase;
}) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      role="group"
      aria-label="Question progress"
    >
      {questions.map((_, i) => {
        const isDone = i < results.length;
        const isCurrent = i === qIndex && phase !== "summary";
        return (
          <div
            key={i}
            aria-label={`Question ${i + 1}${isCurrent ? " (current)" : ""}${isDone ? " (completed)" : ""}`}
            className={`rounded-full transition-all duration-300 ${
              isCurrent
                ? "h-3 w-3 ring-4 ring-primary/20 bg-primary"
                : isDone
                  ? results[i]?.correct
                    ? "h-2.5 w-2.5 bg-emerald-500"
                    : results[i]?.skipped
                      ? "h-2.5 w-2.5 bg-muted-foreground/30"
                      : "h-2.5 w-2.5 bg-red-500"
                  : "h-2.5 w-2.5 border-2 border-muted-foreground/30 bg-transparent"
            }`}
          />
        );
      })}
    </div>
  );
}

/* ── Question Type Badge ───────────────────────────────── */

function QuestionTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    single_select: "Single Answer",
    multi_select: "Select All That Apply",
    differential_rank: "Rank in Order",
    ordered_steps: "Order the Steps",
    free_text: "Free Text",
  };
  return (
    <Badge variant="outline" className="rounded-full text-xs">
      {labels[type] ?? type}
    </Badge>
  );
}

/* ── Single Select Input ───────────────────────────────── */

function SingleSelectInput({
  answers,
  selected,
  onSelect,
}: {
  answers: AnswerOption[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  return (
    <div className="grid gap-3">
      {answers.map((a, idx) => {
        const isSelected = selected === a.id;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a.id)}
            aria-pressed={isSelected}
            className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium shadow-card transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              isSelected
                ? "border-primary bg-primary text-primary-foreground shadow-card-hover"
                : "border-border bg-card hover:shadow-card-hover"
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200 ${
                isSelected
                  ? "bg-primary-foreground text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {letters[idx] ?? idx + 1}
            </span>
            <span className="flex-1">{a.text}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Multi Select Input ────────────────────────────────── */

function MultiSelectInput({
  answers,
  selected,
  onToggle,
}: {
  answers: AnswerOption[];
  selected: Set<string>;
  onToggle: (id: string, checked: boolean | "indeterminate") => void;
}) {
  return (
    <div className="grid gap-3">
      {answers.map((a) => {
        const isChecked = selected.has(a.id);
        return (
          <label
            key={a.id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm shadow-card transition-all duration-150 hover:shadow-card-hover focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
              isChecked
                ? "border-primary bg-primary/10 shadow-card-hover"
                : "border-border bg-card"
            }`}
          >
            <Checkbox
              checked={isChecked}
              onCheckedChange={(checked) => onToggle(a.id, checked)}
            />
            <span className="flex-1">{a.text}</span>
          </label>
        );
      })}
    </div>
  );
}

/* ── Ordered Input ─────────────────────────────────────── */

function OrderedInput({
  answers,
  selected,
  onSelect,
  type,
}: {
  answers: AnswerOption[];
  selected: string[];
  onSelect: (id: string) => void;
  type: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">
        {type === "differential_rank"
          ? "Click options in order from most likely to least likely."
          : "Click options in the correct order of priority."}
      </p>
      {selected.length > 0 && (
        <div className="rounded-xl bg-muted/30 p-3 shadow-card">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Your order (click to remove):
          </p>
          <ol className="flex flex-col gap-1">
            {selected.map((aid, idx) => {
              const ans = answers.find((a) => a.id === aid);
              return (
                <li key={aid} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-sm">{ans?.text}</span>
                  <button
                    type="button"
                    onClick={() => onSelect(aid)}
                    className="rounded-full p-0.5 text-muted-foreground transition-colors hover:text-red-500 active:scale-[0.95]"
                    aria-label={`Remove ${ans?.text}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
      <div className="grid gap-3">
        {answers.map((a) => {
          const orderPosition = selected.indexOf(a.id);
          const isSelected = orderPosition >= 0;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onSelect(a.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm shadow-card transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isSelected
                  ? "border-primary/50 bg-primary/5 opacity-60"
                  : "border-border bg-card hover:shadow-card-hover"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200 ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isSelected ? orderPosition + 1 : "-"}
              </span>
              <span className="flex-1">{a.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Answer Review Row ─────────────────────────────────── */

function AnswerReviewRow({ a, wasSelected, isCorrectAnswer }: { a: AnswerOption; wasSelected: boolean; isCorrectAnswer: boolean }) {
  let bgClass = "border-border bg-background";
  if (isCorrectAnswer) bgClass = "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30";
  else if (wasSelected) bgClass = "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30";
  return (
    <div key={a.id} className={`rounded-xl border p-3 text-sm ${bgClass}`}>
      <div className="flex items-center gap-2">
        {isCorrectAnswer && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
        {wasSelected && !isCorrectAnswer && <X className="h-4 w-4 shrink-0 text-red-600" />}
        <span>{a.text}</span>
      </div>
      {a.explanation && <p className="mt-1 text-xs text-muted-foreground">{a.explanation}</p>}
    </div>
  );
}

function CaseContextCard({
  icon: Icon,
  title,
  body,
  accentClass,
}: {
  icon: typeof User;
  title: string;
  body: string;
  accentClass: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/55 bg-white/55 p-4 shadow-card dark:border-white/8 dark:bg-white/5">
      <div className="flex items-center gap-2">
        <div className={accentClass}>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
    </div>
  );
}

function CaseWorkspaceSidebar({
  caseData,
  conditionName,
  caseImages,
  questionLabel,
}: {
  caseData: CaseModule;
  conditionName: string;
  caseImages: GalleryImageItem[];
  questionLabel: string;
}) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
      <div className="rounded-[26px] border border-white/55 bg-white/60 p-5 shadow-card dark:border-white/8 dark:bg-white/5">
        <Badge variant="secondary" className="rounded-full">
          {conditionName}
        </Badge>
        <h2 className="mt-3 text-xl font-bold text-foreground">{caseData.title}</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {questionLabel}
        </p>
      </div>

      {caseImages.length > 0 && (
        <div className="rounded-[26px] border border-white/55 bg-white/60 p-4 shadow-card dark:border-white/8 dark:bg-white/5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-foreground">Clinical images</h3>
            <Badge variant="outline" className="rounded-full text-xs">
              {caseImages.length}
            </Badge>
          </div>
          <ImageGallery images={caseImages} columns={2} maxImages={3} />
        </div>
      )}

      <CaseContextCard
        icon={User}
        title="Patient summary"
        body={caseData.patientSummary}
        accentClass="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"
      />
      <CaseContextCard
        icon={ClipboardList}
        title="Clinical history"
        body={caseData.clinicalHistory}
        accentClass="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400"
      />
      <CaseContextCard
        icon={Stethoscope}
        title="Examination"
        body={caseData.examFindings}
        accentClass="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      />
    </aside>
  );
}

/* ── Main Case Client ──────────────────────────────────── */

export function CaseClient({
  caseData,
  conditionName,
  caseImages,
}: CaseClientProps) {
  const questions = caseData.questions;
  const totalQuestions = questions.length;

  const [phase, setPhase] = useState<CasePhase>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [singleAnswer, setSingleAnswer] = useState<string | null>(null);
  const [multiAnswers, setMultiAnswers] = useState<Set<string>>(new Set());
  const [orderedAnswers, setOrderedAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [expandedReview, setExpandedReview] = useState<number | null>(null);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const question: CaseQuestion | undefined = questions[qIndex];

  const resetQuestionState = useCallback(() => {
    setSingleAnswer(null);
    setMultiAnswers(new Set());
    setOrderedAnswers([]);
  }, []);

  const evaluateAnswer = useCallback(
    (q: CaseQuestion): boolean => {
      switch (q.type) {
        case "single_select":
          return singleAnswer === q.answers.find((a) => a.isCorrect)?.id;
        case "multi_select": {
          const correctIds = new Set(q.answers.filter((a) => a.isCorrect).map((a) => a.id));
          if (multiAnswers.size !== correctIds.size) return false;
          for (const id of multiAnswers) if (!correctIds.has(id)) return false;
          return true;
        }
        case "differential_rank":
        case "ordered_steps":
          if (!q.correctOrder || orderedAnswers.length !== q.correctOrder.length) return false;
          return orderedAnswers.every((id, idx) => id === q.correctOrder![idx]);
        default:
          return false;
      }
    },
    [singleAnswer, multiAnswers, orderedAnswers]
  );

  const handleStartCase = useCallback(() => {
    setPhase("question");
    setQIndex(0);
    resetQuestionState();
    setResults([]);
    setExpandedReview(null);
  }, [resetQuestionState]);

  const handleSubmitAnswer = useCallback(() => {
    if (!question) return;
    const correct = evaluateAnswer(question);
    setResults((prev) => [
      ...prev,
      { questionId: question.id, correct, selectedSingle: singleAnswer, selectedMulti: Array.from(multiAnswers), selectedOrdered: [...orderedAnswers], skipped: false },
    ]);
    setPhase("question-review");
  }, [question, evaluateAnswer, singleAnswer, multiAnswers, orderedAnswers]);

  const handleSkip = useCallback(() => {
    if (!question) return;
    setResults((prev) => [
      ...prev,
      { questionId: question.id, correct: false, selectedSingle: null, selectedMulti: [], selectedOrdered: [], skipped: true },
    ]);
    if (qIndex + 1 >= totalQuestions) setPhase("summary");
    else { setQIndex(qIndex + 1); resetQuestionState(); }
  }, [question, qIndex, totalQuestions, resetQuestionState]);

  const handleNextQuestion = useCallback(() => {
    if (qIndex + 1 >= totalQuestions) setPhase("summary");
    else { setQIndex(qIndex + 1); resetQuestionState(); setPhase("question"); }
  }, [qIndex, totalQuestions, resetQuestionState]);

  const handleRestart = useCallback(() => {
    setPhase("intro"); setQIndex(0); setResults([]); setExpandedReview(null); resetQuestionState();
  }, [resetQuestionState]);

  const handleToggleMulti = useCallback((id: string, checked: boolean | "indeterminate") => {
    setMultiAnswers((prev) => { const next = new Set(prev); if (checked === true) next.add(id); else next.delete(id); return next; });
  }, []);

  const handleOrderSelect = useCallback((id: string) => {
    setOrderedAnswers((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);

  const selectedDangerous = useMemo(() => {
    if (phase !== "question-review" || !question?.dangerousAnswers) return false;
    const result = results[results.length - 1];
    if (!result || result.skipped) return false;
    return question.dangerousAnswers.some((dId) => {
      if (question.type === "single_select") return result.selectedSingle === dId;
      if (question.type === "multi_select") return result.selectedMulti.includes(dId);
      return false;
    });
  }, [phase, question, results]);

  const canSubmit = (() => {
    if (!question) return false;
    switch (question.type) {
      case "single_select": return singleAnswer !== null;
      case "multi_select": return multiAnswers.size > 0;
      case "differential_rank":
      case "ordered_steps": return orderedAnswers.length === question.answers.length;
      default: return false;
    }
  })();

  /* ── INTRO PHASE ────────────────────────────────────── */

  if (phase === "intro") {
    const uniqueSources = Array.from(
      new Set(caseImages.map((image) => image.source).filter(Boolean))
    );

    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <Badge variant="secondary" className="mb-2 rounded-full">{conditionName}</Badge>
          <h1 className="text-2xl font-bold">{caseData.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {caseData.estimatedMinutes && (
              <Badge variant="outline" className="rounded-full text-xs">~{caseData.estimatedMinutes} min</Badge>
            )}
            <Badge variant="outline" className="rounded-full text-xs">{totalQuestions} question{totalQuestions !== 1 ? "s" : ""}</Badge>
            {uniqueSources.map((source) => (
              <Badge key={source} variant="outline" className="rounded-full text-xs">
                {source}
              </Badge>
            ))}
          </div>
        </div>

        <StepDots questions={questions} results={results} qIndex={qIndex} phase={phase} />

        {caseImages.length > 0 && (
          <div className="rounded-xl bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">Case Images</h3>
                <p className="text-sm text-muted-foreground">
                  Image-backed scenario content from linked dataset assets.
                </p>
              </div>
              <Badge variant="outline" className="rounded-full text-xs">
                {caseImages.length} image{caseImages.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <ImageGallery images={caseImages} columns={2} maxImages={4} />
          </div>
        )}

        {/* Patient card */}
        <div className="rounded-xl border-l-4 border-l-primary bg-card p-5 shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold">Patient Information</h3>
          </div>
          <p className="text-sm leading-[1.7]">{caseData.patientSummary}</p>
        </div>

        {/* History card (collapsible) */}
        <div className="rounded-xl border-l-4 border-l-amber-500 bg-card p-5 shadow-card">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left"
            onClick={() => setHistoryExpanded(!historyExpanded)}
            aria-expanded={historyExpanded}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                <ClipboardList className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold">Clinical History</h3>
            </div>
            {historyExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          {historyExpanded && (
            <p className="mt-3 animate-fade-in text-sm leading-[1.7]">{caseData.clinicalHistory}</p>
          )}
        </div>

        {/* Exam card */}
        <div className="rounded-xl border-l-4 border-l-emerald-500 bg-card p-5 shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
              <Stethoscope className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-semibold">Examination Findings</h3>
          </div>
          <p className="text-sm leading-[1.7]">{caseData.examFindings}</p>
        </div>

        <div className="flex justify-center">
          <Button size="lg" onClick={handleStartCase} className="px-8 py-3 text-lg transition-all duration-150 active:scale-[0.98]">
            Begin Case <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  /* ── SUMMARY PHASE ──────────────────────────────────── */

  if (phase === "summary") {
    const correctCount = results.filter((r) => r.correct).length;
    const pct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="text-center">
          <Trophy className="mx-auto mb-3 h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold">Case Complete</h1>
          <p className="text-muted-foreground">{caseData.title}</p>
        </div>

        {/* Score card */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="mb-4 text-center font-semibold">Results</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div><div className="text-3xl font-bold">{correctCount}/{totalQuestions}</div><div className="text-sm text-muted-foreground">Correct</div></div>
            <div><div className="text-3xl font-bold">{pct}%</div><div className="text-sm text-muted-foreground">Accuracy</div></div>
          </div>
        </div>

        {/* Per-question review */}
        <div className="rounded-xl bg-card p-5 shadow-card">
          <h3 className="mb-1 font-semibold">Question Review</h3>
          <p className="mb-4 text-sm text-muted-foreground">Click any question to see the full explanation</p>
          <div className="flex flex-col gap-2">
            {questions.map((q, idx) => {
              const res = results[idx];
              const isExpanded = expandedReview === idx;
              return (
                <div key={q.id} className="rounded-xl border shadow-card">
                  <button
                    type="button"
                    onClick={() => setExpandedReview(isExpanded ? null : idx)}
                    className="flex w-full items-center gap-3 p-3 text-left text-sm hover:bg-muted/50"
                    aria-expanded={isExpanded}
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${res?.skipped ? "bg-muted-foreground" : res?.correct ? "bg-emerald-500" : "bg-red-500"}`}>
                      {res?.skipped ? <SkipForward className="h-3 w-3" /> : res?.correct ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    </span>
                    <span className="flex-1 truncate">{q.stem}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                  </button>
                  {isExpanded && (
                    <div className="animate-fade-in border-t px-3 pb-3 pt-3">
                      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{q.stem}</p>
                      <div className="flex flex-col gap-2">
                        {q.answers.map((a) => (
                          <AnswerReviewRow
                            key={a.id}
                            a={a}
                            wasSelected={q.type === "single_select" ? res?.selectedSingle === a.id : q.type === "multi_select" ? res?.selectedMulti.includes(a.id) : false}
                            isCorrectAnswer={(q.type === "single_select" || q.type === "multi_select") ? a.isCorrect : false}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-center gap-3">
            <Button onClick={handleRestart} variant="outline"><RotateCcw className="mr-2 h-4 w-4" />Try Again</Button>
            <Link href="/cases"><Button variant="secondary"><ArrowLeft className="mr-2 h-4 w-4" />Back to Cases</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── QUESTION-REVIEW PHASE ──────────────────────────── */

  if (phase === "question-review" && question) {
    const result = results[results.length - 1];
    if (!result) return null;

    return (
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] animate-fade-in">
        <CaseWorkspaceSidebar
          caseData={caseData}
          conditionName={conditionName}
          caseImages={caseImages}
          questionLabel={`Reviewing question ${qIndex + 1} of ${totalQuestions}`}
        />

        <div className="space-y-5">
          <div className="rounded-[26px] border border-white/55 bg-white/60 p-5 shadow-card dark:border-white/8 dark:bg-white/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={result.correct ? "default" : "destructive"} className="rounded-full text-xs">
                  {result.correct ? "Correct" : "Incorrect"}
                </Badge>
                <QuestionTypeBadge type={question.type} />
              </div>
              <span className="text-sm text-muted-foreground">
                Question {qIndex + 1} of {totalQuestions}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Question focus
              </p>
              <h3 className="mt-2 text-xl font-bold leading-relaxed text-foreground">
                {question.stem}
              </h3>
              {question.context && (
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {question.context}
                </p>
              )}
            </div>
            <div className="mt-4">
              <StepDots questions={questions} results={results} qIndex={qIndex} phase={phase} />
            </div>
          </div>

          <div className="rounded-[28px] bg-card p-5 shadow-card">
            <div className="flex flex-col gap-3">
              {question.answers.map((a) => {
                const wasSelected = question.type === "single_select" ? result.selectedSingle === a.id : question.type === "multi_select" ? result.selectedMulti.includes(a.id) : false;
                const isCorrectAnswer = (question.type === "single_select" || question.type === "multi_select") ? a.isCorrect : false;
                let bgClass = "border-border bg-background";
                if (isCorrectAnswer) bgClass = "border-emerald-300 bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/40";
                else if (wasSelected) bgClass = "border-red-300 bg-red-100 dark:border-red-700 dark:bg-red-900/40";

                return (
                  <div key={a.id}>
                    <div className={`flex items-center gap-3 rounded-xl border p-4 text-sm shadow-card ${bgClass}`}>
                      {isCorrectAnswer && <Check className="h-5 w-5 shrink-0 text-emerald-600" />}
                      {wasSelected && !isCorrectAnswer && <X className="h-5 w-5 shrink-0 text-red-600" />}
                      {!isCorrectAnswer && !wasSelected && <div className="h-5 w-5 shrink-0" />}
                      <span className="flex-1">{a.text}</span>
                      {wasSelected && <Badge variant="outline" className="rounded-full text-[10px]">Your answer</Badge>}
                    </div>
                    {a.explanation && <p className="mt-1 px-3 text-xs text-muted-foreground">{a.explanation}</p>}
                  </div>
                );
              })}

              {question.correctOrder && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
                  <p className="mb-1 text-sm font-semibold text-blue-800 dark:text-blue-300">Correct Order:</p>
                  <ol className="list-inside list-decimal text-sm text-blue-700 dark:text-blue-200">
                    {question.correctOrder.map((aid) => <li key={aid}>{question.answers.find((a) => a.id === aid)?.text}</li>)}
                  </ol>
                </div>
              )}

              {selectedDangerous && (
                <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 shadow-card dark:border-red-700 dark:bg-red-950/30">
                  <Skull className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800 dark:text-red-300">Dangerous Choice</p>
                    <p className="text-sm text-red-700 dark:text-red-200">The option you selected is considered a high-stakes mistake in clinical practice.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <Button onClick={handleNextQuestion}>
                {qIndex + 1 < totalQuestions ? (<>Next Question <ChevronRight className="ml-1 h-4 w-4" /></>) : "View Results"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── QUESTION PHASE ─────────────────────────────────── */

  if (!question) return null;

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] animate-fade-in">
      <CaseWorkspaceSidebar
        caseData={caseData}
        conditionName={conditionName}
        caseImages={caseImages}
        questionLabel={`Working on question ${qIndex + 1} of ${totalQuestions}`}
      />

      <div className="space-y-5">
        <div className="rounded-[26px] border border-white/55 bg-white/60 p-5 shadow-card dark:border-white/8 dark:bg-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <QuestionTypeBadge type={question.type} />
              <Badge variant="outline" className="rounded-full text-xs">
                Prompt-first layout
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              Question {qIndex + 1} of {totalQuestions}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              What are you being asked?
            </p>
            <h3 className="mt-2 text-xl font-bold leading-relaxed text-foreground">
              {question.stem}
            </h3>
            {question.context && (
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {question.context}
              </p>
            )}
          </div>
          <div className="mt-4">
            <StepDots questions={questions} results={results} qIndex={qIndex} phase={phase} />
          </div>
        </div>

        <div className="rounded-[28px] bg-card p-5 shadow-card">
          <div className="flex flex-col gap-3">
            {question.type === "single_select" && (
              <SingleSelectInput answers={question.answers} selected={singleAnswer} onSelect={setSingleAnswer} />
            )}
            {question.type === "multi_select" && (
              <MultiSelectInput answers={question.answers} selected={multiAnswers} onToggle={handleToggleMulti} />
            )}
            {(question.type === "differential_rank" || question.type === "ordered_steps") && (
              <OrderedInput answers={question.answers} selected={orderedAnswers} onSelect={handleOrderSelect} type={question.type} />
            )}
          </div>

          <div className="mt-5 flex justify-between gap-2">
            <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
              <SkipForward className="mr-1 h-4 w-4" /> Skip
            </Button>
            <Button onClick={handleSubmitAnswer} disabled={!canSubmit} className={canSubmit ? "animate-glow-pulse" : ""}>
              Submit Answer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
