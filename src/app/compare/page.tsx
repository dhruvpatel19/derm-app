import Link from "next/link";
import {
  GitCompare,
  ChevronRight,
  Lightbulb,
  Layers,
  Home,
} from "lucide-react";
import { compareModules } from "@/data/compare-modules";
import { conditions } from "@/data/conditions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Compare Mode - DermEd",
  description:
    "Side-by-side comparison of look-alike dermatology conditions to sharpen your differential diagnosis skills.",
};

function resolveConditionName(id: string): string {
  const condition = conditions.find((c) => c.id === id);
  return condition?.name ?? "Unknown Condition";
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

export default function ComparePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link
              href="/"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <span className="font-medium text-foreground">Compare Mode</span>
          </li>
        </ol>
      </nav>

      <div className="mb-8">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-primary">
          <GitCompare className="h-5 w-5" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Compare Mode</h1>
        <p className="mt-2 text-muted-foreground">
          Master the subtle differences between conditions that are commonly
          confused. Each module provides a structured side-by-side comparison
          with distinguishing features, pitfalls, and clinical pearls.
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            {compareModules.length} comparison modules
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {compareModules.map((module) => {
          const conditionNames = module.conditionIds.map(resolveConditionName);
          const featureCount = module.distinguishingFeatures.length;
          const pearlPreview = module.pearl
            ? truncate(module.pearl, 100)
            : null;

          return (
            <Link
              key={module.id}
              href={`/compare/${module.id}`}
              className="group/link block"
            >
              <Card className="h-full shadow-card rounded-xl transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base group-hover/link:underline">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {conditionNames.length} conditions &middot; {featureCount}{" "}
                    distinguishing features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Condition name badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {conditionNames.map((name) => (
                      <Badge key={name} variant="secondary" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>

                  {/* Pearl preview */}
                  {pearlPreview && (
                    <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                      <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                      <p className="leading-relaxed">{pearlPreview}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {module.tags && module.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {module.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="px-1.5 py-0 text-[10px]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Arrow */}
                  <span className="inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover/link:opacity-100">
                    View comparison
                    <ChevronRight className="ml-0.5 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
