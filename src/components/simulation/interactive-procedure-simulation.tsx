"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { SimulationModule } from "@/data/simulation-modules";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  RotateCcw,
  Scissors,
  ShieldCheck,
  Syringe,
  Trophy,
} from "lucide-react";

interface InteractiveProcedureSimulationProps {
  module: SimulationModule;
  imageUrl: string | null;
}

type ProcedureZone = NonNullable<SimulationModule["procedureTargetZones"]>[number];

const STAGE_LABELS = [
  "Equipment",
  "Anesthesia",
  "Target",
  "Pathology & Follow-up",
] as const;

const STAGE_COPY = [
  {
    eyebrow: "Instrument setup",
    title: "Choose the diagnostic tool",
    helper:
      "Select the biopsy approach that answers the clinical question without sacrificing specimen quality.",
  },
  {
    eyebrow: "Comfort + specimen quality",
    title: "Plan the anesthesia field",
    helper:
      "Good anesthesia should make the procedure tolerable without distorting the lesion you need to diagnose.",
  },
  {
    eyebrow: "Precision targeting",
    title: "Mark the biopsy target",
    helper:
      "Use the image as your clinical field and aim for representative lesional tissue rather than surrounding normal skin.",
  },
  {
    eyebrow: "Interpret + act",
    title: "Read the pathology and close the loop",
    helper:
      "A biopsy is only halfway through the encounter. Turn the result into safe next-step management.",
  },
] as const;

const QUALITY_META: Record<
  "ideal" | "acceptable" | "poor" | "dangerous",
  { label: string; badgeClass: string; score: number }
> = {
  ideal: {
    label: "Ideal",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200",
    score: 25,
  },
  acceptable: {
    label: "Acceptable",
    badgeClass:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200",
    score: 18,
  },
  poor: {
    label: "Poor",
    badgeClass:
      "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-200",
    score: 6,
  },
  dangerous: {
    label: "Dangerous",
    badgeClass:
      "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200",
    score: 0,
  },
};

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
    <Badge variant="outline" className={cn("rounded-full text-xs", diff.className)}>
      {diff.label}
    </Badge>
  );
}

function ChoiceCard({
  icon: Icon,
  label,
  explanation,
  selected,
  submitted,
  isCorrect,
  isDangerous,
  onClick,
}: {
  icon: typeof Scissors;
  label: string;
  explanation: string;
  selected: boolean;
  submitted: boolean;
  isCorrect: boolean;
  isDangerous?: boolean;
  onClick: () => void;
}) {
  let cardClass = "border-border bg-card";
  if (!submitted && selected) {
    cardClass = "border-primary bg-primary/10";
  } else if (submitted && isCorrect) {
    cardClass =
      "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/20";
  } else if (submitted && selected && isDangerous) {
    cardClass =
      "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/20";
  } else if (submitted && selected) {
    cardClass =
      "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/20";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={submitted}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-4 text-left shadow-card transition-all duration-150",
        !submitted && "hover:-translate-y-0.5 hover:shadow-card-hover",
        cardClass
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          selected && !submitted
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {submitted
            ? explanation
            : selected
              ? "Choice staged. Rationale unlocks after you lock this step."
              : "Select this option to stage it for the procedure."}
        </p>
      </div>
      <div className="flex shrink-0 items-center">
        {submitted && isCorrect && <Check className="h-5 w-5 text-emerald-600" />}
        {submitted && selected && !isCorrect && (
          <AlertTriangle
            className={cn(
              "h-5 w-5",
              isDangerous ? "text-red-600" : "text-amber-600"
            )}
          />
        )}
      </div>
    </button>
  );
}

function getChoiceIcon(label: string) {
  const lower = label.toLowerCase();
  if (
    lower.includes("lidocaine") ||
    lower.includes("anesthetic") ||
    lower.includes("inject")
  ) {
    return Syringe;
  }
  if (lower.includes("observe")) return ShieldCheck;
  return Scissors;
}

function CartItem({
  label,
  value,
  complete,
}: {
  label: string;
  value: string;
  complete: boolean;
}) {
  return (
    <div className="rounded-[20px] border border-white/55 bg-white/52 px-4 py-3 dark:border-white/8 dark:bg-white/5">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            complete ? "bg-emerald-500" : "bg-muted-foreground/35"
          )}
        />
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function findMatchingZone(x: number, y: number, zones: ProcedureZone[]) {
  const priority = { ideal: 0, acceptable: 1, poor: 2, dangerous: 3 };
  const ordered = [...zones].sort(
    (a, b) => priority[a.quality] - priority[b.quality]
  );

  for (const zone of ordered) {
    if (zone.shape === "circle") {
      const [cx, cy, r] = zone.coordinates;
      const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (distance <= r) return zone;
      continue;
    }

    const [zx, zy, zw, zh] = zone.coordinates;
    if (x >= zx && x <= zx + zw && y >= zy && y <= zy + zh) return zone;
  }

  return null;
}

export function InteractiveProcedureSimulation({
  module,
  imageUrl,
}: InteractiveProcedureSimulationProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const equipmentChoices = module.equipmentChoices ?? [];
  const anesthesiaChoices = module.anesthesiaChoices ?? [];
  const targetZones = useMemo(
    () => module.procedureTargetZones ?? [],
    [module.procedureTargetZones]
  );
  const followUpChoices = module.followUpChoices ?? [];

  const [currentStep, setCurrentStep] = useState(0);

  const [equipmentId, setEquipmentId] = useState<string | null>(null);
  const [equipmentSubmitted, setEquipmentSubmitted] = useState(false);

  const [anesthesiaId, setAnesthesiaId] = useState<string | null>(null);
  const [anesthesiaSubmitted, setAnesthesiaSubmitted] = useState(false);

  const [targetPick, setTargetPick] = useState<{
    x: number;
    y: number;
    zone: ProcedureZone | null;
  } | null>(null);

  const [followUpId, setFollowUpId] = useState<string | null>(null);
  const [followUpSubmitted, setFollowUpSubmitted] = useState(false);

  const selectedEquipment = equipmentChoices.find((option) => option.id === equipmentId);
  const selectedAnesthesia = anesthesiaChoices.find(
    (option) => option.id === anesthesiaId
  );
  const selectedFollowUp = followUpChoices.find((option) => option.id === followUpId);

  const targetPassed =
    targetPick?.zone &&
    (targetPick.zone.quality === "ideal" ||
      targetPick.zone.quality === "acceptable");

  const score = useMemo(() => {
    const equipmentScore = equipmentSubmitted
      ? selectedEquipment?.isCorrect
        ? 25
        : selectedEquipment?.isDangerous
          ? 0
          : 12
      : 0;

    const anesthesiaScore = anesthesiaSubmitted
      ? selectedAnesthesia?.isCorrect
        ? 20
        : selectedAnesthesia?.isDangerous
          ? 0
          : 10
      : 0;

    const targetScore = targetPick?.zone
      ? QUALITY_META[targetPick.zone.quality].score
      : 0;

    const followUpScore = followUpSubmitted
      ? selectedFollowUp?.isCorrect
        ? 30
        : selectedFollowUp?.isDangerous
          ? 0
          : 12
      : 0;

    return equipmentScore + anesthesiaScore + targetScore + followUpScore;
  }, [
    anesthesiaSubmitted,
    equipmentSubmitted,
    followUpSubmitted,
    selectedAnesthesia,
    selectedEquipment,
    selectedFollowUp,
    targetPick,
  ]);

  const currentStageCopy = STAGE_COPY[currentStep];
  const currentStagePrompt =
    currentStep === 0
      ? module.equipmentPrompt
      : currentStep === 1
        ? module.anesthesiaPrompt
        : currentStep === 2
          ? module.procedureTargetPrompt
          : module.followUpPrompt;

  const handleTargetClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (currentStep !== 2) return;
      const viewport = viewportRef.current;
      if (!viewport) return;

      const rect = viewport.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const zone = findMatchingZone(x, y, targetZones);

      setTargetPick({ x, y, zone });
    },
    [currentStep, targetZones]
  );

  const resetAll = useCallback(() => {
    setCurrentStep(0);
    setEquipmentId(null);
    setEquipmentSubmitted(false);
    setAnesthesiaId(null);
    setAnesthesiaSubmitted(false);
    setTargetPick(null);
    setFollowUpId(null);
    setFollowUpSubmitted(false);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-primary">
            <ClipboardCheck className="h-4 w-4" />
          </div>
          <Badge variant="outline" className="rounded-full">
            Interactive Procedure
          </Badge>
          <DifficultyBadge difficulty={module.difficulty} />
          <Badge variant="secondary" className="rounded-full">
            {score}/100 live score
          </Badge>
        </div>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{module.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
              {module.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card className="rounded-xl shadow-card">
            <CardHeader>
              <CardTitle>Clinical Scenario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-[1.7]">{module.caseStem}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                {module.objectives.map((objective) => (
                  <div
                    key={objective}
                    className="rounded-xl border border-white/55 bg-white/48 px-4 py-3 text-sm text-muted-foreground dark:border-white/7 dark:bg-white/4"
                  >
                    {objective}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Procedure Workspace</CardTitle>
                <Badge variant="outline" className="rounded-full text-xs">
                  Step {currentStep + 1} of {STAGE_LABELS.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-[24px] border border-primary/12 bg-primary/6 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-full">
                    {currentStageCopy.eyebrow}
                  </Badge>
                  <Badge variant="secondary" className="rounded-full">
                    {STAGE_LABELS[currentStep]}
                  </Badge>
                </div>
                <h3 className="mt-3 text-xl font-bold text-foreground">
                  {currentStageCopy.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {currentStagePrompt}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {currentStageCopy.helper}
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
                <div className="space-y-4">
              {imageUrl ? (
                <div
                  ref={viewportRef}
                  onClick={handleTargetClick}
                  className={cn(
                    "relative overflow-hidden rounded-[24px] border bg-black/5",
                    currentStep === 2 && "cursor-crosshair"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={module.caseStem ?? module.title}
                    className="aspect-square w-full object-cover"
                    draggable={false}
                  />

                  {targetPick && (
                    <div
                      className={cn(
                        "pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2",
                        targetPick.zone
                          ? targetPassed
                            ? "border-emerald-500 bg-emerald-500/15"
                            : targetPick.zone.quality === "dangerous"
                              ? "border-red-500 bg-red-500/15"
                              : "border-amber-500 bg-amber-500/15"
                          : "border-slate-500 bg-slate-500/10"
                      )}
                      style={{
                        left: `${targetPick.x * 100}%`,
                        top: `${targetPick.y * 100}%`,
                      }}
                    >
                      <div className="absolute inset-2 rounded-full bg-current/70" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-[24px] border border-dashed py-16 text-sm text-muted-foreground">
                  Image unavailable for this procedure module.
                </div>
              )}

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[20px] border border-white/55 bg-white/55 px-4 py-3 dark:border-white/8 dark:bg-white/5">
                      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Current station
                      </div>
                      <div className="mt-2 text-sm font-semibold text-foreground">
                        {STAGE_LABELS[currentStep]}
                      </div>
                    </div>
                    <div className="rounded-[20px] border border-white/55 bg-white/55 px-4 py-3 dark:border-white/8 dark:bg-white/5">
                      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Target status
                      </div>
                      <div className="mt-2 text-sm font-semibold text-foreground">
                        {targetPick?.zone
                          ? QUALITY_META[targetPick.zone.quality].label
                          : "Awaiting action"}
                      </div>
                    </div>
                    <div className="rounded-[20px] border border-white/55 bg-white/55 px-4 py-3 dark:border-white/8 dark:bg-white/5">
                      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Feedback model
                      </div>
                      <div className="mt-2 text-sm font-semibold text-foreground">
                        Hidden until locked
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">

              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="rounded-[20px] border border-white/55 bg-white/55 p-4 dark:border-white/8 dark:bg-white/5">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Equipment choice
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Review the tool choices, stage your pick, and lock the step to reveal the rationale.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {equipmentChoices.map((option) => (
                      <ChoiceCard
                        key={option.id}
                        icon={getChoiceIcon(option.label)}
                        label={option.label}
                        explanation={option.explanation}
                        selected={equipmentId === option.id}
                        submitted={equipmentSubmitted}
                        isCorrect={option.isCorrect}
                        isDangerous={option.isDangerous}
                        onClick={() => setEquipmentId(option.id)}
                      />
                    ))}
                  </div>

                  {!equipmentSubmitted ? (
                    <div className="flex justify-end">
                      <Button
                        onClick={() => setEquipmentSubmitted(true)}
                        disabled={!equipmentId}
                      >
                        Lock equipment choice
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl border border-primary/10 bg-primary/5 p-4">
                      <p className="text-sm text-muted-foreground">
                        Review the equipment feedback, then continue to anesthesia.
                      </p>
                      <Button onClick={() => setCurrentStep(1)}>
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="rounded-[20px] border border-white/55 bg-white/55 p-4 dark:border-white/8 dark:bg-white/5">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Anesthesia
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Preserve lesion architecture while setting up a comfortable field for biopsy.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {anesthesiaChoices.map((option) => (
                      <ChoiceCard
                        key={option.id}
                        icon={getChoiceIcon(option.label)}
                        label={option.label}
                        explanation={option.explanation}
                        selected={anesthesiaId === option.id}
                        submitted={anesthesiaSubmitted}
                        isCorrect={option.isCorrect}
                        isDangerous={option.isDangerous}
                        onClick={() => setAnesthesiaId(option.id)}
                      />
                    ))}
                  </div>

                  {!anesthesiaSubmitted ? (
                    <div className="flex justify-between gap-2">
                      <Button variant="ghost" onClick={() => setCurrentStep(0)}>
                        Back
                      </Button>
                      <Button
                        onClick={() => setAnesthesiaSubmitted(true)}
                        disabled={!anesthesiaId}
                      >
                        Lock anesthesia choice
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl border border-primary/10 bg-primary/5 p-4">
                      <p className="text-sm text-muted-foreground">
                        Anesthesia plan recorded. Move into the biopsy targeting step.
                      </p>
                      <Button onClick={() => setCurrentStep(2)}>
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="rounded-[20px] border border-white/55 bg-white/55 p-4 dark:border-white/8 dark:bg-white/5">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Lesion targeting
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Use the clinical image like a procedure field. Click the tissue that best answers the biopsy question.
                    </p>
                  </div>

                  {targetPick ? (
                    <div className="rounded-xl border p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge
                          className={cn(
                            "rounded-full",
                            targetPick.zone
                              ? QUALITY_META[targetPick.zone.quality].badgeClass
                              : "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-200"
                          )}
                        >
                          {targetPick.zone
                            ? QUALITY_META[targetPick.zone.quality].label
                            : "Off target"}
                        </Badge>
                        <span className="text-sm font-semibold">
                          {targetPick.zone?.label ?? "No defined target zone hit"}
                        </span>
                      </div>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {targetPick.zone?.explanation ??
                          "That click did not land on the lesion. Try again and target the actual biopsy site."}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                      Awaiting target selection. Use the image workspace to mark the biopsy site.
                    </div>
                  )}

                  <div className="flex justify-between gap-2">
                    <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <div className="flex gap-2">
                      {targetPick && !targetPassed && (
                        <Button variant="outline" onClick={() => setTargetPick(null)}>
                          Retry target
                        </Button>
                      )}
                      {targetPassed && (
                        <Button onClick={() => setCurrentStep(3)}>
                          Reveal pathology
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="rounded-[20px] border border-white/55 bg-white/55 p-4 dark:border-white/8 dark:bg-white/5">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Follow-up planning
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Review the educational pathology summary, then choose the safest next step. Feedback stays hidden until you submit the plan.
                    </p>
                  </div>

                  {module.pathologyReport && (
                    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-900 dark:bg-teal-950/20">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline" className="rounded-full">
                          {module.pathologyReport.title}
                        </Badge>
                      </div>
                      {module.pathologyReport.specimen && (
                        <p className="text-sm font-medium text-foreground">
                          {module.pathologyReport.specimen}
                        </p>
                      )}
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        {module.pathologyReport.diagnosis}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {module.pathologyReport.findings.map((finding) => (
                          <li key={finding} className="flex gap-2">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300" />
                            <span className="text-sm leading-relaxed text-teal-800 dark:text-teal-200">
                              {finding}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {module.pathologyReport.limitations && (
                        <p className="mt-3 text-xs leading-6 text-teal-700/90 dark:text-teal-200/80">
                          {module.pathologyReport.limitations}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Decision prompt
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {module.followUpPrompt}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {followUpChoices.map((option) => (
                      <ChoiceCard
                        key={option.id}
                        icon={ShieldCheck}
                        label={option.label}
                        explanation={option.explanation}
                        selected={followUpId === option.id}
                        submitted={followUpSubmitted}
                        isCorrect={option.isCorrect}
                        isDangerous={option.isDangerous}
                        onClick={() => setFollowUpId(option.id)}
                      />
                    ))}
                  </div>

                  {!followUpSubmitted ? (
                    <div className="flex justify-between gap-2">
                      <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                        Back
                      </Button>
                      <Button
                        onClick={() => setFollowUpSubmitted(true)}
                        disabled={!followUpId}
                      >
                        Submit plan
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5">
                        <div className="flex items-center gap-3">
                          <Trophy className="h-8 w-8 text-amber-500" />
                          <div>
                            <div className="text-2xl font-bold">{score}%</div>
                            <div className="text-sm text-muted-foreground">
                              Procedure lab score
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-center gap-3">
                        <Button variant="outline" onClick={resetAll}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Run again
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
              )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-xl shadow-card">
            <CardHeader>
              <CardTitle className="text-sm">Procedure Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {STAGE_LABELS.map((label, index) => {
                const complete =
                  (index === 0 && equipmentSubmitted) ||
                  (index === 1 && anesthesiaSubmitted) ||
                  (index === 2 && Boolean(targetPassed)) ||
                  (index === 3 && followUpSubmitted);

                const active = currentStep === index;

                return (
                  <div
                    key={label}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3 py-3",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background",
                      complete && "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/20"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                        complete
                          ? "bg-emerald-500 text-white"
                          : active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {complete ? <Check className="h-4 w-4" /> : index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{label}</div>
                      <div className="text-xs text-muted-foreground">
                        {complete
                          ? "Completed"
                          : active
                            ? "Current stage"
                            : "Locked or upcoming"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-card">
            <CardHeader>
              <CardTitle className="text-sm">Instrument Cart</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CartItem
                label="Biopsy setup"
                value={selectedEquipment?.label ?? "Not locked yet"}
                complete={equipmentSubmitted}
              />
              <CartItem
                label="Anesthesia"
                value={selectedAnesthesia?.label ?? "Not locked yet"}
                complete={anesthesiaSubmitted}
              />
              <CartItem
                label="Target"
                value={
                  targetPick?.zone?.label ??
                  (targetPick ? "Off target - retry needed" : "Not chosen yet")
                }
                complete={Boolean(targetPassed)}
              />
              <CartItem
                label="Follow-up"
                value={selectedFollowUp?.label ?? "Pending pathology review"}
                complete={followUpSubmitted}
              />
            </CardContent>
          </Card>

          {module.procedureSteps && module.procedureSteps.length > 0 && (
            <Card className="rounded-xl shadow-card">
              <CardHeader>
                <CardTitle className="text-sm">
                  {module.procedureChecklistTitle ?? "Procedure Checklist"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {module.procedureSteps.map((step) => (
                  <div key={step.order} className="rounded-xl border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {step.order}
                      </div>
                      <div className="text-sm font-semibold">{step.title}</div>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {module.explanation && (
            <Card className="rounded-xl shadow-card">
              <CardHeader>
                <CardTitle className="text-sm">Teaching Point</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-muted-foreground">
                  {module.explanation}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
