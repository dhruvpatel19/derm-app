import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllConditions, getImagesByCondition } from "@/lib/data-loader";
import { resolveImageUrl } from "@/lib/image-url";
import { cases } from "@/data/cases";
import { compareModules } from "@/data/compare-modules";
import type { ConditionCategory } from "@/lib/domain/schemas";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Activity,
  Stethoscope,
  ShieldCheck,
  Lightbulb,
  ArrowRight,
  FileText,
  GitCompare,
  Clock,
  CheckCircle2,
  Layers3,
  MapPin,
} from "lucide-react";
import { ConditionImageGallery } from "./condition-image-gallery";

/* ── Labels & colors ──────────────────────────────────── */

const categoryLabels: Record<ConditionCategory, string> = {
  morphology: "Morphology",
  benign_lesion: "Benign Lesion",
  skin_cancer: "Skin Cancer",
  infection: "Infection",
  drug_eruption: "Drug Eruption",
  acne_rosacea: "Acne & Rosacea",
  eczematous: "Eczematous",
  papulosquamous: "Papulosquamous",
  autoimmune: "Autoimmune",
  ulcer_wound: "Ulcer & Wound",
  burn: "Burn",
  genodermatosis: "Genodermatosis",
  pediatric: "Pediatric",
  hair_nails: "Hair & Nails",
  premalignant: "Premalignant",
};

const categoryBadgeColors: Partial<Record<ConditionCategory, string>> = {
  skin_cancer: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  premalignant:
    "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  infection:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  eczematous:
    "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  papulosquamous:
    "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
  benign_lesion:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  acne_rosacea:
    "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
  autoimmune:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
};

function formatCategory(category: ConditionCategory): string {
  return categoryLabels[category] ?? category;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllConditions().map((condition) => ({ id: condition.slug }));
}

/* ── Notes parser ─────────────────────────────────────── */

function parseNotes(notes: string): {
  redFlags: string | null;
  management: string | null;
  followUp: string | null;
} {
  let redFlags: string | null = null;
  let management: string | null = null;
  let followUp: string | null = null;

  const rfMatch = notes.match(/Red flags?:\s*([\s\S]*?)(?=Management:|$)/i);
  if (rfMatch) redFlags = rfMatch[1].trim();

  const mgMatch = notes.match(
    /Management:\s*([\s\S]*?)(?=Screen |Follow[- ]?up:|$)/i
  );
  if (mgMatch) management = mgMatch[1].trim();

  const rest = notes.match(/(?:Screen |Follow[- ]?up:)\s*([\s\S]*)/i);
  if (rest) followUp = rest[1].trim();

  return { redFlags, management, followUp };
}

/* ── Metadata ─────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conditions = getAllConditions();
  const condition = conditions.find((c) => c.slug === id);
  if (!condition) return { title: "Not Found - DermEd" };
  return {
    title: `${condition.name} - DermEd`,
    description: condition.description.slice(0, 160),
  };
}

/* ── Page ─────────────────────────────────────────────── */

export default async function ConditionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conditions = getAllConditions();
  const condition = conditions.find((c) => c.slug === id);

  if (!condition) {
    notFound();
  }

  const relatedCases = cases.filter((c) => c.conditionId === condition.id);
  const relatedCompare = compareModules.filter((m) =>
    m.conditionIds.includes(condition.id)
  );

  const parsedNotes = condition.notes ? parseNotes(condition.notes) : null;

  const conditionImages = getImagesByCondition(condition.slug);
  const galleryImages = conditionImages
    .filter((img) => img.isActive)
    .slice(0, 30)
    .map((img) => ({
      id: img.id,
      url: resolveImageUrl(img),
      alt: img.altText,
      bodySite: img.bodySite ?? undefined,
      skinTone: img.skinToneLabel ?? undefined,
      source:
        img.datasetSourceId === "scin-google-research"
          ? "SCIN"
          : img.datasetSourceId === "ds-pad-ufes-20"
            ? "PAD-UFES-20"
            : "Seed",
    }));

  const differentials = (condition.differentialIds ?? [])
    .map((did) => conditions.find((c) => c.id === did))
    .filter(Boolean);

  const badgeColor =
    categoryBadgeColors[condition.category] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";

  return (
    <div className="page-shell pb-24 pt-8 sm:pt-10">
      {/* Header */}
      <PageHeader
        title={condition.name}
        breadcrumbs={[
          { label: "Conditions", href: "/explorer" },
          { label: condition.name },
        ]}
      >
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeColor}`}
          >
            {formatCategory(condition.category)}
          </span>
          {condition.icdCodes &&
            condition.icdCodes.length > 0 &&
            condition.icdCodes.map((code) => (
              <Badge key={code} variant="outline" className="text-xs">
                ICD: {code}
              </Badge>
            ))}
        </div>
      </PageHeader>

      {/* Two-column layout: content 65% + gallery 35% */}
      <div className="mt-8 flex flex-col gap-10 lg:flex-row">
        {/* LEFT: Clinical content */}
        <div className="flex-1 space-y-8 lg:max-w-[65%]">
          {condition.summary && (
            <section className="rounded-xl border border-primary/15 bg-primary/5 p-5">
              <div className="mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  Teaching Summary
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {condition.summary}
              </p>
            </section>
          )}

          {/* Overview */}
          <section>
            <h2 className="mb-3 text-xl font-semibold tracking-tight">
              Overview
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              {condition.description}
            </p>
          </section>

          {(condition.hallmarkMorphology?.length ||
            condition.symptoms?.length ||
            condition.commonBodySites?.length) && (
            <section className="grid gap-4 lg:grid-cols-3">
              {condition.hallmarkMorphology &&
                condition.hallmarkMorphology.length > 0 && (
                  <div className="rounded-xl bg-card p-5 shadow-card">
                    <div className="mb-3 flex items-center gap-2">
                      <Layers3 className="h-4 w-4 text-primary" />
                      <h2 className="text-base font-semibold tracking-tight">
                        Hallmark Morphology
                      </h2>
                    </div>
                    <ul className="space-y-2">
                      {condition.hallmarkMorphology.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm leading-relaxed text-muted-foreground">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {condition.symptoms && condition.symptoms.length > 0 && (
                <div className="rounded-xl bg-card p-5 shadow-card">
                  <div className="mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <h2 className="text-base font-semibold tracking-tight">
                      Typical Symptoms
                    </h2>
                  </div>
                  <ul className="space-y-2">
                    {condition.symptoms.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm leading-relaxed text-muted-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {condition.commonBodySites &&
                condition.commonBodySites.length > 0 && (
                  <div className="rounded-xl bg-card p-5 shadow-card">
                    <div className="mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <h2 className="text-base font-semibold tracking-tight">
                        Common Body Sites
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {condition.commonBodySites.map((site) => (
                        <Badge key={site} variant="outline">
                          {site}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </section>
          )}

          {/* Clinical Features */}
          {condition.clinicalFeatures &&
            condition.clinicalFeatures.length > 0 && (
              <section>
                <h2 className="mb-3 text-xl font-semibold tracking-tight">
                  Clinical Features
                </h2>
                <ul className="space-y-2">
                  {condition.clinicalFeatures.map((feature, i) => (
                    <li key={i} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm leading-relaxed text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

          {/* Red Flags — red left border, red background */}
          {condition.redFlags && condition.redFlags.length > 0 ? (
            <section className="rounded-xl border-l-4 border-l-red-500 bg-red-50 p-5 dark:bg-red-950/20">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h3 className="font-semibold text-red-800 dark:text-red-300">
                  Red Flags
                </h3>
              </div>
              <ul className="space-y-2">
                {condition.redFlags.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                    <span className="text-sm leading-relaxed text-red-700 dark:text-red-400">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : parsedNotes?.redFlags ? (
            <section className="rounded-xl border-l-4 border-l-red-500 bg-red-50 p-5 dark:bg-red-950/20">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h3 className="font-semibold text-red-800 dark:text-red-300">
                  Red Flags
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-red-700 dark:text-red-400">
                {parsedNotes.redFlags}
              </p>
            </section>
          ) : null}

          {/* Management — primary left border, primary/5 bg */}
          {condition.managementBasics && condition.managementBasics.length > 0 ? (
            <section className="rounded-xl border-l-4 border-l-primary bg-primary/5 p-5">
              <div className="mb-2 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Management</h3>
              </div>
              <ul className="space-y-2">
                {condition.managementBasics.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : parsedNotes?.management ? (
            <section className="rounded-xl border-l-4 border-l-primary bg-primary/5 p-5">
              <div className="mb-2 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Management</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {parsedNotes.management}
              </p>
            </section>
          ) : null}

          {/* Follow-up — emerald left border */}
          {condition.followUpPearls && condition.followUpPearls.length > 0 ? (
            <section className="rounded-xl border-l-4 border-l-emerald-500 bg-emerald-50 p-5 dark:bg-emerald-950/20">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">
                  Follow-up & Screening
                </h3>
              </div>
              <ul className="space-y-2">
                {condition.followUpPearls.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm leading-relaxed text-emerald-700 dark:text-emerald-400">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : parsedNotes?.followUp ? (
            <section className="rounded-xl border-l-4 border-l-emerald-500 bg-emerald-50 p-5 dark:bg-emerald-950/20">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">
                  Follow-up & Screening
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-emerald-700 dark:text-emerald-400">
                {parsedNotes.followUp}
              </p>
            </section>
          ) : null}

          {/* Differential Diagnosis */}
          {differentials.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-semibold tracking-tight">
                Differential Diagnosis
              </h2>
              <div className="space-y-2">
                {differentials.map((diff) => (
                  <Link
                    key={diff!.id}
                    href={`/explorer/${diff!.slug}`}
                    className="group/diff flex items-center justify-between rounded-xl bg-card p-4 shadow-card transition-all hover:shadow-card-hover"
                  >
                    <div>
                      <p className="font-medium">{diff!.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCategory(diff!.category)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover/diff:opacity-100" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT: Image gallery sidebar (35%, sticky) */}
        <div className="lg:w-[35%]">
          <div className="lg:sticky lg:top-20">
            {galleryImages.length > 0 ? (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Clinical Images
                  </h2>
                  <Badge variant="outline" className="text-xs">
                    {conditionImages.length} total
                  </Badge>
                </div>
                <ConditionImageGallery images={galleryImages} />
              </section>
            ) : (
              <div className="rounded-xl bg-card p-8 text-center shadow-card">
                <Lightbulb className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No clinical images available for this condition yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Below: Related Cases & Compare */}
      {(relatedCases.length > 0 || relatedCompare.length > 0) && (
        <div className="mt-12 space-y-10 border-t pt-10">
          {relatedCases.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight">
                Related Cases
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {relatedCases.map((caseModule) => (
                  <Link
                    key={caseModule.id}
                    href={`/cases/${caseModule.id}`}
                    className="group/case flex w-80 shrink-0 flex-col rounded-xl bg-card p-5 shadow-card transition-all card-hover hover:shadow-card-hover"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold leading-snug group-hover/case:text-primary">
                        {caseModule.title}
                      </h3>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {caseModule.patientSummary}
                    </p>
                    {caseModule.estimatedMinutes && (
                      <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />~
                        {caseModule.estimatedMinutes} min
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {relatedCompare.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight">
                Compare With
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {relatedCompare.map((mod) => (
                  <Link
                    key={mod.id}
                    href={`/compare/${mod.id}`}
                    className="group/compare flex w-80 shrink-0 flex-col rounded-xl bg-card p-5 shadow-card transition-all card-hover hover:shadow-card-hover"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <GitCompare className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold leading-snug group-hover/compare:text-primary">
                        {mod.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Compares {mod.conditionIds.length} conditions across{" "}
                      {mod.distinguishingFeatures.length} features
                    </p>
                    {mod.pearl && (
                      <p className="mt-2 text-xs italic text-muted-foreground">
                        Pearl: {mod.pearl.slice(0, 80)}
                        {mod.pearl.length > 80 ? "\u2026" : ""}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
