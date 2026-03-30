"use client";

import { useState, useCallback, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  CheckCheck,
  XOctagon,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DatasetImage } from "@/components/ui/dataset-image";
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
import { Input } from "@/components/ui/input";
import { useIsClient } from "@/lib/use-is-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AnnotationData {
  primaryLesions: string[];
  secondaryChanges: string[];
  colors: string[];
  arrangement: string[];
  distribution: string[];
  surfaceTexture: string[];
  borderCharacteristics: string[];
  estimatedBodySite: string;
  morphologyDescription: string;
  differentialDiagnoses: string[];
  uncertainFeatures: string[];
  confidence: string;
}

interface Proposal {
  id: string;
  imageAssetId: string;
  provenance: string;
  modelProvider: string;
  reviewStatus: string;
  conditionLabel: string;
  annotation: AnnotationData;
  createdAt: string;
}

type ReviewDecision = "accepted" | "rejected" | "needs_revision";

interface ReviewDecisions {
  [proposalId: string]: {
    status: ReviewDecision;
    decidedAt: string;
    perField?: Record<string, ReviewDecision>;
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "dermtool-reviews";

const ANNOTATION_GROUPS: Array<{
  key: keyof AnnotationData;
  label: string;
  groupLabel: string;
}> = [
  {
    key: "primaryLesions",
    label: "Primary Lesions",
    groupLabel: "Primary lesion",
  },
  {
    key: "secondaryChanges",
    label: "Secondary Changes",
    groupLabel: "Secondary",
  },
  { key: "colors", label: "Colors", groupLabel: "Color" },
  { key: "surfaceTexture", label: "Surface Texture", groupLabel: "Texture" },
  {
    key: "borderCharacteristics",
    label: "Border",
    groupLabel: "Border",
  },
  { key: "arrangement", label: "Arrangement", groupLabel: "Arrangement" },
  { key: "distribution", label: "Distribution", groupLabel: "Distribution" },
];

type FilterTab = "all" | "pending" | "accepted" | "rejected";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadReviewDecisions(): ReviewDecisions {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ReviewDecisions;
  } catch {
    return {};
  }
}

function saveReviewDecisions(decisions: ReviewDecisions) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  } catch {
    // storage unavailable
  }
}

function confidencePercent(confidence: string): number {
  switch (confidence) {
    case "high":
      return 85;
    case "medium":
      return 60;
    case "low":
      return 30;
    default: {
      const n = parseInt(confidence, 10);
      return isNaN(n) ? 50 : n;
    }
  }
}

function confidenceBarColor(pct: number): string {
  if (pct >= 75) return "bg-emerald-500 dark:bg-emerald-400";
  if (pct >= 50) return "bg-amber-500 dark:bg-amber-400";
  return "bg-red-500 dark:bg-red-400";
}

/** Status badge: pending=amber, accepted=emerald, rejected=red */
function statusBadgeClasses(status: string): string {
  switch (status) {
    case "accepted":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "needs_revision":
      return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
    default:
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    case "needs_revision":
      return "Needs Revision";
    default:
      return "Pending";
  }
}

function statusBorderColor(status: string): string {
  switch (status) {
    case "accepted":
      return "ring-emerald-300 dark:ring-emerald-800";
    case "rejected":
      return "ring-red-300 dark:ring-red-800";
    case "needs_revision":
      return "ring-teal-300 dark:ring-teal-800";
    default:
      return "ring-amber-300 dark:ring-amber-800";
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ReviewQueueClient({
  proposals,
  imageUrlMap,
}: {
  proposals: Proposal[];
  imageUrlMap: Record<string, string | null>;
}) {
  const isClient = useIsClient();
  const [persistedDecisions, setPersistedDecisions] =
    useState<ReviewDecisions | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bulkAcceptConfirm, setBulkAcceptConfirm] = useState("");
  const [bulkRejectConfirm, setBulkRejectConfirm] = useState("");
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const hydratedDecisions = useMemo(
    () => (isClient ? loadReviewDecisions() : {}),
    [isClient]
  );
  const decisions = persistedDecisions ?? hydratedDecisions;

  const persist = useCallback((next: ReviewDecisions) => {
    setPersistedDecisions(next);
    saveReviewDecisions(next);
  }, []);

  // ----- actions -----

  const decide = useCallback(
    (proposalId: string, status: ReviewDecision) => {
      const next: ReviewDecisions = {
        ...decisions,
        [proposalId]: {
          status,
          decidedAt: new Date().toISOString(),
        },
      };
      persist(next);
    },
    [decisions, persist],
  );

  const acceptAll = useCallback(() => {
    const now = new Date().toISOString();
    const next: ReviewDecisions = { ...decisions };
    for (const p of proposals) {
      const decided = next[p.id]?.status;
      if (!decided && p.reviewStatus === "pending") {
        next[p.id] = { status: "accepted", decidedAt: now };
      }
    }
    persist(next);
    setAcceptDialogOpen(false);
    setBulkAcceptConfirm("");
  }, [decisions, proposals, persist]);

  const rejectAll = useCallback(() => {
    const now = new Date().toISOString();
    const next: ReviewDecisions = { ...decisions };
    for (const p of proposals) {
      const decided = next[p.id]?.status;
      if (!decided && p.reviewStatus === "pending") {
        next[p.id] = { status: "rejected", decidedAt: now };
      }
    }
    persist(next);
    setRejectDialogOpen(false);
    setBulkRejectConfirm("");
  }, [decisions, proposals, persist]);

  // ----- derived -----

  const effectiveStatus = useCallback(
    (p: Proposal): string => {
      return decisions[p.id]?.status ?? p.reviewStatus;
    },
    [decisions],
  );

  const counts = useMemo(
    () => ({
      all: proposals.length,
      pending: proposals.filter((p) => effectiveStatus(p) === "pending").length,
      accepted: proposals.filter((p) => effectiveStatus(p) === "accepted")
        .length,
      rejected: proposals.filter((p) => effectiveStatus(p) === "rejected")
        .length,
    }),
    [proposals, effectiveStatus],
  );

  const filtered = useMemo(
    () =>
      proposals.filter((p) => {
        if (filter === "all") return true;
        return effectiveStatus(p) === filter;
      }),
    [proposals, filter, effectiveStatus],
  );

  // ----- render helpers -----

  function renderAnnotationChips(
    proposalId: string,
    groupLabel: string,
    items: string[],
  ) {
    if (!items || items.length === 0) return null;
    return (
      <div key={groupLabel}>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {groupLabel}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {items.map((v, i) => {
            const fieldKey = `${groupLabel}-${v}`;
            const fieldDecision =
              decisions[proposalId]?.perField?.[fieldKey];
            return (
              <span
                key={`${v}-${i}`}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  fieldDecision === "accepted"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : fieldDecision === "rejected"
                      ? "bg-red-100 text-red-800 line-through dark:bg-red-900/30 dark:text-red-300"
                      : "bg-secondary text-secondary-foreground"
                }`}
              >
                {v}
                {/* Accept/reject button per annotation chip */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentDecision =
                      decisions[proposalId]?.perField?.[fieldKey];
                    const newStatus: ReviewDecision =
                      currentDecision === "accepted" ? "rejected" : "accepted";
                    const updated: ReviewDecisions = {
                      ...decisions,
                      [proposalId]: {
                        ...decisions[proposalId],
                        status:
                          decisions[proposalId]?.status ??
                          ("pending" as ReviewDecision),
                        decidedAt:
                          decisions[proposalId]?.decidedAt ??
                          new Date().toISOString(),
                        perField: {
                          ...(decisions[proposalId]?.perField ?? {}),
                          [fieldKey]: newStatus,
                        },
                      },
                    };
                    persist(updated);
                  }}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                  aria-label={
                    fieldDecision === "accepted"
                      ? `Reject ${v}`
                      : `Accept ${v}`
                  }
                >
                  {fieldDecision === "accepted" ? (
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  ) : fieldDecision === "rejected" ? (
                    <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3 opacity-30" />
                  )}
                </button>
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  // ----- render -----

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-primary">
          <ClipboardList className="h-5 w-5" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Annotation Review Queue
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review and accept/reject model-proposed image annotations.{" "}
          {counts.pending > 0 && (
            <span className="font-medium text-amber-600 dark:text-amber-400">
              {counts.pending} pending review.
            </span>
          )}
        </p>
      </div>

      {/* Filter tabs with count badges + bulk actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { key: "all", label: "All" },
              { key: "pending", label: "Pending" },
              { key: "accepted", label: "Accepted" },
              { key: "rejected", label: "Rejected" },
            ] as const
          ).map(({ key, label }) => {
            const active = filter === key;
            const tabColor =
              key === "pending"
                ? active
                  ? "bg-amber-500 text-white"
                  : ""
                : key === "accepted"
                  ? active
                    ? "bg-emerald-500 text-white"
                    : ""
                  : key === "rejected"
                    ? active
                      ? "bg-red-500 text-white"
                      : ""
                    : "";
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                  active && !tabColor
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? tabColor
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {label}
                {/* Count badge */}
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                    active
                      ? "bg-white/20 text-inherit"
                      : "bg-muted-foreground/10 text-muted-foreground"
                  }`}
                >
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bulk actions */}
        <div className="flex gap-2">
          <Dialog
            open={acceptDialogOpen}
            onOpenChange={(open) => {
              setAcceptDialogOpen(open);
              if (!open) setBulkAcceptConfirm("");
            }}
          >
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  disabled={counts.pending === 0}
                />
              }
            >
              <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
              Accept All Pending
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Accept all pending proposals?</DialogTitle>
                <DialogDescription>
                  This will mark {counts.pending} pending proposal
                  {counts.pending !== 1 ? "s" : ""} as accepted. Type{" "}
                  <strong>confirm</strong> to proceed.
                </DialogDescription>
              </DialogHeader>
              <Input
                value={bulkAcceptConfirm}
                onChange={(e) => setBulkAcceptConfirm(e.target.value)}
                placeholder='Type "confirm"'
              />
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Cancel
                </DialogClose>
                <Button
                  disabled={bulkAcceptConfirm !== "confirm"}
                  onClick={acceptAll}
                >
                  <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
                  Accept All
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={rejectDialogOpen}
            onOpenChange={(open) => {
              setRejectDialogOpen(open);
              if (!open) setBulkRejectConfirm("");
            }}
          >
            <DialogTrigger
              render={
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={counts.pending === 0}
                />
              }
            >
              <XOctagon className="mr-1.5 h-3.5 w-3.5" />
              Reject All Pending
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject all pending proposals?</DialogTitle>
                <DialogDescription>
                  This will mark {counts.pending} pending proposal
                  {counts.pending !== 1 ? "s" : ""} as rejected. Type{" "}
                  <strong>confirm</strong> to proceed.
                </DialogDescription>
              </DialogHeader>
              <Input
                value={bulkRejectConfirm}
                onChange={(e) => setBulkRejectConfirm(e.target.value)}
                placeholder='Type "confirm"'
              />
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Cancel
                </DialogClose>
                <Button
                  variant="destructive"
                  disabled={bulkRejectConfirm !== "confirm"}
                  onClick={rejectAll}
                >
                  <XOctagon className="mr-1.5 h-3.5 w-3.5" />
                  Reject All
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-900/20">
            <ClipboardList className="h-7 w-7 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            {filter === "all"
              ? "No proposals available. Run the annotation generation script to create proposals."
              : `No ${filter} proposals found.`}
          </p>
        </div>
      )}

      {/* Review cards: two-column (image + annotations) */}
      <div className="grid gap-5">
        {filtered.map((proposal) => {
          const status = effectiveStatus(proposal);
          const isExpanded = expandedId === proposal.id;
          const ann = proposal.annotation;
          const confPct = confidencePercent(ann.confidence);
          const imgUrl = imageUrlMap[proposal.imageAssetId] ?? null;

          return (
            <Card
              key={proposal.id}
              className={`overflow-hidden shadow-card rounded-xl ring-1 transition-all ${statusBorderColor(status)}`}
            >
              <div className="flex flex-col lg:flex-row">
                {/* LEFT: Image thumbnail */}
                <div className="flex shrink-0 items-center justify-center bg-muted/30 p-4 lg:w-64">
                  <DatasetImage
                    src={imgUrl}
                    alt={`${proposal.conditionLabel} - ${proposal.imageAssetId.slice(0, 8)}`}
                    size="md"
                    aspectRatio="square"
                    enableLightbox
                    enableZoom
                  />
                </div>

                {/* RIGHT: Annotation details */}
                <div className="flex flex-1 flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg">
                          {proposal.conditionLabel}
                        </CardTitle>
                        <CardDescription className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            <Sparkles className="h-3 w-3" />
                            {proposal.provenance}
                          </span>
                          <span className="text-xs">
                            {proposal.modelProvider}
                          </span>
                        </CardDescription>
                      </div>
                      {/* Status badge: pending=amber, accepted=emerald, rejected=red */}
                      <span
                        className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClasses(status)}`}
                      >
                        {statusLabel(status)}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    {/* Confidence bar */}
                    <div className="mb-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          Confidence
                        </span>
                        <span className="text-xs font-bold tabular-nums">
                          {confPct}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${confidenceBarColor(confPct)}`}
                          style={{ width: `${confPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Morphology description */}
                    <p className="mb-4 text-sm leading-relaxed text-foreground/80">
                      {ann.morphologyDescription}
                    </p>

                    {/* Body site */}
                    {ann.estimatedBodySite && (
                      <p className="mb-3 text-sm">
                        <span className="font-medium">Body site:</span>{" "}
                        {ann.estimatedBodySite}
                      </p>
                    )}

                    {/* Annotation groups with chips */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {ANNOTATION_GROUPS.map(({ key, groupLabel }) => {
                        const items = ann[key];
                        if (!Array.isArray(items)) return null;
                        return renderAnnotationChips(
                          proposal.id,
                          groupLabel,
                          items as string[],
                        );
                      })}
                    </div>

                    {/* Expandable details */}
                    {isExpanded && (
                      <div className="mt-4 animate-fade-in">
                        <Separator className="mb-4" />
                        <div className="grid gap-3 sm:grid-cols-2">
                          {ann.differentialDiagnoses.length > 0 && (
                            <div>
                              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Differential Diagnoses
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {ann.differentialDiagnoses.map((d, i) => (
                                  <Badge key={`${d}-${i}`} variant="outline">
                                    {d}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {ann.uncertainFeatures.length > 0 && (
                            <div>
                              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Uncertain Features
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {ann.uncertainFeatures.map((u, i) => (
                                  <Badge
                                    key={`${u}-${i}`}
                                    variant="secondary"
                                    className="border border-amber-300 dark:border-amber-700"
                                  >
                                    <AlertTriangle className="mr-1 h-3 w-3" />
                                    {u}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                          Created:{" "}
                          {new Date(proposal.createdAt).toLocaleString()} | ID:{" "}
                          {proposal.id.slice(0, 12)}...
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : proposal.id)
                      }
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      {isExpanded ? (
                        <>
                          <EyeOff className="h-3 w-3" /> Show less
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" /> Show details
                        </>
                      )}
                    </button>
                  </CardContent>

                  {/* Accept/reject buttons per proposal */}
                  <CardFooter className="gap-2">
                    <Button
                      size="sm"
                      variant={status === "accepted" ? "default" : "outline"}
                      onClick={() => decide(proposal.id, "accepted")}
                    >
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        status === "rejected" ? "destructive" : "outline"
                      }
                      onClick={() => decide(proposal.id, "rejected")}
                    >
                      <XCircle className="mr-1 h-3.5 w-3.5" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        status === "needs_revision" ? "secondary" : "outline"
                      }
                      onClick={() => decide(proposal.id, "needs_revision")}
                    >
                      <AlertCircle className="mr-1 h-3.5 w-3.5" />
                      Needs Revision
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Footer disclaimer */}
      {filtered.length > 0 && (
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-card dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
          <Shield className="h-5 w-5 shrink-0" />
          <p>
            <span className="font-semibold">Review decisions</span> are stored
            locally in your browser. Export reviewed annotations before clearing
            browser data.
          </p>
        </div>
      )}
    </div>
  );
}
