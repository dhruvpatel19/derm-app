"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { CompareModule, Condition } from "@/lib/domain/schemas";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface CompareDetailProps {
  module: CompareModule;
  conditionMap: Record<string, Condition>;
}

function conditionName(
  id: string,
  conditionMap: Record<string, Condition>,
): string {
  return conditionMap[id]?.name ?? "Unknown";
}

/** Subtle alternating column colors (teal-themed) */
const columnColors = [
  "bg-teal-50/60 dark:bg-teal-950/15",
  "bg-amber-50/60 dark:bg-amber-950/15",
  "bg-emerald-50/60 dark:bg-emerald-950/15",
  "bg-purple-50/60 dark:bg-purple-950/15",
];

export function CompareDetail({ module, conditionMap }: CompareDetailProps) {
  const conditionIds = module.conditionIds;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{module.title}</h1>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {conditionIds.map((id) => (
            <Badge key={id} variant="secondary">
              {conditionName(id, conditionMap)}
            </Badge>
          ))}
        </div>
        {module.tags && module.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {module.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Common Features -- check icons */}
      <Card className="shadow-card rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Common Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {module.commonFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Separator />

      {/* Distinguishing Features */}
      <section>
        <h2 className="mb-4 text-xl font-semibold tracking-tight">
          Distinguishing Features
        </h2>

        {/* Desktop: responsive table with columns per condition */}
        <div className="hidden md:block">
          <div className="overflow-x-auto rounded-xl border border-border shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">
                    Feature
                  </th>
                  {conditionIds.map((id, i) => (
                    <th
                      key={id}
                      className={`px-4 py-3 text-left font-semibold ${columnColors[i % columnColors.length]}`}
                    >
                      {conditionName(id, conditionMap)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {module.distinguishingFeatures.map((df, i) => (
                  <tr
                    key={df.feature}
                    className={i % 2 === 0 ? "" : "bg-muted/20"}
                  >
                    <td className="border-r px-4 py-3 font-medium align-top">
                      {df.feature}
                    </td>
                    {conditionIds.map((id, j) => (
                      <td
                        key={id}
                        className={`px-4 py-3 align-top ${columnColors[j % columnColors.length]}`}
                      >
                        {df.values[id] ?? "---"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile: stacked cards per feature */}
        <div className="space-y-3 md:hidden">
          {module.distinguishingFeatures.map((df) => (
            <MobileFeatureAccordion
              key={df.feature}
              feature={df.feature}
              conditionIds={conditionIds}
              values={df.values}
              conditionMap={conditionMap}
            />
          ))}
        </div>
      </section>

      <Separator />

      {/* Clinical Pearl -- amber bg with lightbulb icon */}
      {module.pearl && (
        <Card className="shadow-card rounded-xl border-amber-300 dark:border-amber-700">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 dark:bg-amber-950/20">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="mb-1 font-semibold text-amber-900 dark:text-amber-200">
                  Clinical Pearl
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  {module.pearl}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dangerous Pitfall -- red bg with alert icon */}
      {module.dangerousPitfall && (
        <Card className="shadow-card rounded-xl border-red-300 dark:border-red-700">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 dark:bg-red-950/20">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="mb-1 font-semibold text-red-900 dark:text-red-200">
                  Dangerous Pitfall
                </h3>
                <p className="text-sm text-red-800 dark:text-red-300">
                  {module.dangerousPitfall}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Back navigation */}
      <div className="pt-2">
        <Link href="/compare">
          <Button variant="outline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Compare Mode
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile Feature Accordion
// ---------------------------------------------------------------------------

function MobileFeatureAccordion({
  feature,
  conditionIds,
  values,
  conditionMap,
}: {
  feature: string;
  conditionIds: string[];
  values: Record<string, string>;
  conditionMap: Record<string, Condition>;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="shadow-card rounded-xl">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className="text-sm font-semibold">{feature}</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {expanded && (
        <CardContent className="space-y-3 border-t pt-3 animate-in slide-in-from-top-1 duration-200">
          {conditionIds.map((id, i) => (
            <div
              key={id}
              className={`rounded-xl p-3 ${columnColors[i % columnColors.length]}`}
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {conditionName(id, conditionMap)}
              </p>
              <p className="text-sm">{values[id] ?? "---"}</p>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
