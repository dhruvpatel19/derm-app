"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { Condition, ConditionCategory } from "@/lib/domain/schemas";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Camera,
  FileText,
  GitCompare,
  Layers3,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const INITIAL_VISIBLE_COUNT = 12;
const VISIBLE_COUNT_STEP = 12;

type SortOption = "alphabetical" | "images" | "cases";

const categoryLabels: Record<ConditionCategory, string> = {
  morphology: "Morphology",
  benign_lesion: "Benign lesion",
  skin_cancer: "Skin cancer",
  infection: "Infection",
  drug_eruption: "Drug eruption",
  acne_rosacea: "Acne & rosacea",
  eczematous: "Eczematous",
  papulosquamous: "Papulosquamous",
  autoimmune: "Autoimmune",
  ulcer_wound: "Ulcer & wound",
  burn: "Burn",
  genodermatosis: "Genodermatosis",
  pediatric: "Pediatric",
  hair_nails: "Hair & nails",
  premalignant: "Premalignant",
};

const categoryThemes: Partial<
  Record<
    ConditionCategory,
    {
      tint: string;
      chip: string;
      dot: string;
    }
  >
> = {
  skin_cancer: {
    tint: "from-red-500/22 to-rose-500/6",
    chip: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200",
    dot: "bg-red-500",
  },
  premalignant: {
    tint: "from-orange-500/22 to-amber-500/8",
    chip: "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-200",
    dot: "bg-orange-500",
  },
  infection: {
    tint: "from-amber-500/22 to-yellow-500/8",
    chip: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200",
    dot: "bg-amber-500",
  },
  eczematous: {
    tint: "from-blue-500/22 to-sky-500/8",
    chip: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200",
    dot: "bg-blue-500",
  },
  papulosquamous: {
    tint: "from-violet-500/22 to-fuchsia-500/8",
    chip: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-200",
    dot: "bg-violet-500",
  },
  benign_lesion: {
    tint: "from-emerald-500/22 to-teal-500/8",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200",
    dot: "bg-emerald-500",
  },
  acne_rosacea: {
    tint: "from-pink-500/22 to-rose-500/8",
    chip: "border-pink-200 bg-pink-50 text-pink-800 dark:border-pink-900 dark:bg-pink-950/30 dark:text-pink-200",
    dot: "bg-pink-500",
  },
  autoimmune: {
    tint: "from-indigo-500/22 to-blue-500/8",
    chip: "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200",
    dot: "bg-indigo-500",
  },
  ulcer_wound: {
    tint: "from-stone-500/18 to-amber-500/6",
    chip: "border-stone-200 bg-stone-50 text-stone-800 dark:border-stone-700 dark:bg-stone-950/30 dark:text-stone-200",
    dot: "bg-stone-500",
  },
  burn: {
    tint: "from-orange-500/18 to-red-500/6",
    chip: "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-200",
    dot: "bg-orange-600",
  },
  genodermatosis: {
    tint: "from-cyan-500/18 to-sky-500/6",
    chip: "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-200",
    dot: "bg-cyan-500",
  },
  pediatric: {
    tint: "from-teal-500/18 to-emerald-500/6",
    chip: "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-200",
    dot: "bg-teal-500",
  },
  hair_nails: {
    tint: "from-fuchsia-500/18 to-pink-500/6",
    chip: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800 dark:border-fuchsia-900 dark:bg-fuchsia-950/30 dark:text-fuchsia-200",
    dot: "bg-fuchsia-500",
  },
};

const cardExcerptStyle: CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3,
  overflow: "hidden",
};

function formatCategory(category: ConditionCategory): string {
  return categoryLabels[category] ?? category;
}

interface ConditionFilterProps {
  conditions: Condition[];
  imageCounts: Record<string, number>;
  caseCounts: Record<string, number>;
  compareCounts: Record<string, number>;
  bodySites: Record<string, string[]>;
}

function SummaryMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Layers3;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/55 bg-white/55 px-3 py-3 dark:border-white/8 dark:bg-white/5">
      <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </div>
      <div className="mt-1.5 text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}

function CardStat({
  icon: Icon,
  value,
}: {
  icon: typeof Camera;
  value: string;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/55 bg-white/62 px-2.5 py-1.5 text-[0.72rem] font-semibold text-muted-foreground dark:border-white/8 dark:bg-white/5">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span>{value}</span>
    </div>
  );
}

function SortChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
        active
          ? "bg-foreground text-background shadow-[0_16px_30px_rgba(18,36,60,0.14)]"
          : "border border-white/55 bg-white/55 text-muted-foreground hover:text-foreground dark:border-white/8 dark:bg-white/5"
      )}
    >
      {children}
    </button>
  );
}

function ConditionCard({
  condition,
  imageCount,
  caseCount,
  compareCount,
  bodySites,
  index,
}: {
  condition: Condition;
  imageCount: number;
  caseCount: number;
  compareCount: number;
  bodySites: string[];
  index: number;
}) {
  const theme = categoryThemes[condition.category] ?? {
    tint: "from-slate-500/16 to-slate-400/6",
    chip: "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-200",
    dot: "bg-slate-500",
  };

  const visibleBodySites = bodySites.slice(0, 3);

  return (
    <Link href={`/explorer/${condition.slug}`} className="group block">
      <article
        className="surface-panel card-hover relative h-full overflow-hidden rounded-[28px] p-5 animate-card-enter"
        style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
      >
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-20 bg-gradient-to-br opacity-90",
            theme.tint
          )}
        />
        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em]",
                  theme.chip
                )}
              >
                <span className={cn("h-2.5 w-2.5 rounded-full", theme.dot)} />
                {formatCategory(condition.category)}
              </span>
              <h3 className="mt-3 text-lg text-foreground">{condition.name}</h3>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-foreground text-background shadow-[0_12px_24px_rgba(18,36,60,0.12)] transition-transform group-hover:-translate-y-0.5 dark:bg-white dark:text-[#10233f]">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <p
            className="mt-3 text-sm leading-6 text-muted-foreground"
            style={cardExcerptStyle}
          >
            {condition.summary ?? condition.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <CardStat
              icon={Camera}
              value={imageCount > 0 ? `${imageCount} images` : "No images"}
            />
            <CardStat
              icon={FileText}
              value={caseCount > 0 ? `${caseCount} cases` : "No cases"}
            />
            <CardStat
              icon={GitCompare}
              value={compareCount > 0 ? `${compareCount} compare` : "No compare"}
            />
          </div>

          {visibleBodySites.length > 0 && (
            <div className="mt-4 border-t border-white/55 pt-3 dark:border-white/8">
              <div className="mb-2 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Typical sites
              </div>
              <div className="flex flex-wrap gap-2">
                {visibleBodySites.map((site) => (
                  <Badge key={site} variant="outline">
                    {site.replace(/_/g, " ")}
                  </Badge>
                ))}
                {bodySites.length > visibleBodySites.length && (
                  <Badge variant="outline">
                    +{bodySites.length - visibleBodySites.length} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export function ConditionFilter({
  conditions,
  imageCounts,
  caseCounts,
  compareCounts,
  bodySites,
}: ConditionFilterProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const categories = useMemo(() => {
    const cats = new Set(conditions.map((condition) => condition.category));
    return Array.from(cats).sort((left, right) =>
      formatCategory(left as ConditionCategory).localeCompare(
        formatCategory(right as ConditionCategory)
      )
    );
  }, [conditions]);

  const searchFiltered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query.length === 0) {
      return conditions;
    }

    return conditions.filter((condition) => {
      const haystack = [
        condition.name,
        condition.description,
        condition.summary,
        ...(condition.aliases ?? []),
        ...(condition.clinicalFeatures ?? []),
        formatCategory(condition.category),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [conditions, search]);

  const categorySummaries = useMemo(() => {
    return categories
      .map((category) => {
        const items = searchFiltered.filter(
          (condition) => condition.category === category
        );

        return {
          category,
          count: items.length,
          imageBackedCount: items.filter(
            (condition) => (imageCounts[condition.id] ?? 0) > 0
          ).length,
        };
      })
      .filter((entry) => entry.count > 0)
      .sort(
        (left, right) =>
          right.count - left.count ||
          formatCategory(left.category as ConditionCategory).localeCompare(
            formatCategory(right.category as ConditionCategory)
          )
      );
  }, [categories, imageCounts, searchFiltered]);

  const filtered = useMemo(() => {
    const narrowed =
      selectedCategory === "all"
        ? searchFiltered
        : searchFiltered.filter(
            (condition) => condition.category === selectedCategory
          );

    return [...narrowed].sort((left, right) => {
      if (sortBy === "images") {
        return (
          (imageCounts[right.id] ?? 0) - (imageCounts[left.id] ?? 0) ||
          left.name.localeCompare(right.name)
        );
      }

      if (sortBy === "cases") {
        return (
          (caseCounts[right.id] ?? 0) - (caseCounts[left.id] ?? 0) ||
          left.name.localeCompare(right.name)
        );
      }

      return left.name.localeCompare(right.name);
    });
  }, [caseCounts, imageCounts, searchFiltered, selectedCategory, sortBy]);

  const visibleResults = filtered.slice(0, visibleCount);
  const hasMoreResults = visibleCount < filtered.length;
  const activeLabel =
    selectedCategory === "all"
      ? "All categories"
      : formatCategory(selectedCategory as ConditionCategory);
  const hasActiveFilters =
    search.trim().length > 0 ||
    selectedCategory !== "all" ||
    sortBy !== "alphabetical";

  return (
    <div className="mt-6 space-y-5">
      <section className="surface-panel sticky top-20 z-20 rounded-[30px] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)] xl:items-start">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Search and navigate
            </div>
            <div className="relative mt-3">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by condition name, alias, clue, or description"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setVisibleCount(INITIAL_VISIBLE_COUNT);
                }}
                className="pl-11"
              />
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Browse by category, sort by the richest teaching content, and
              reveal more cards only when you need them.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            <SummaryMetric
              icon={Layers3}
              label="Showing"
              value={`${visibleResults.length} of ${filtered.length}`}
            />
            <SummaryMetric icon={Search} label="Scope" value={activeLabel} />
            <SummaryMetric
              icon={Camera}
              label="State"
              value={search ? "Filtered search" : "Browse atlas"}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setVisibleCount(INITIAL_VISIBLE_COUNT);
            }}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              selectedCategory === "all"
                ? "bg-foreground text-background shadow-[0_16px_30px_rgba(18,36,60,0.14)]"
                : "border border-white/55 bg-white/55 text-muted-foreground hover:text-foreground dark:border-white/8 dark:bg-white/5"
            )}
          >
            <span>All categories</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                selectedCategory === "all"
                  ? "bg-white/20 text-background"
                  : "bg-foreground/8 text-muted-foreground dark:bg-white/10"
              )}
            >
              {searchFiltered.length}
            </span>
          </button>

          {categorySummaries.map(({ category, count, imageBackedCount }) => {
            const isActive = selectedCategory === category;
            const theme = categoryThemes[category as ConditionCategory];

            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                  setVisibleCount(INITIAL_VISIBLE_COUNT);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_16px_30px_rgba(29,126,120,0.22)]"
                    : "border border-white/55 bg-white/55 text-muted-foreground hover:text-foreground dark:border-white/8 dark:bg-white/5"
                )}
              >
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    theme?.dot ?? "bg-slate-500"
                  )}
                />
                <span>{formatCategory(category as ConditionCategory)}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    isActive
                      ? "bg-white/18 text-primary-foreground"
                      : "bg-foreground/8 text-muted-foreground dark:bg-white/10"
                  )}
                >
                  {count}
                </span>
                {imageBackedCount > 0 && (
                  <span
                    className={cn(
                      "hidden rounded-full px-2 py-0.5 text-[0.68rem] sm:inline-flex",
                      isActive
                        ? "bg-white/12 text-primary-foreground/90"
                        : "bg-primary/8 text-primary"
                    )}
                  >
                    {imageBackedCount} with images
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/55 pt-4 dark:border-white/8">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/55 px-3 py-1.5 text-sm font-semibold text-muted-foreground dark:border-white/8 dark:bg-white/5">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Sort by
            </div>
            <SortChip
              active={sortBy === "alphabetical"}
              onClick={() => {
                setSortBy("alphabetical");
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
            >
              A-Z
            </SortChip>
            <SortChip
              active={sortBy === "images"}
              onClick={() => {
                setSortBy("images");
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
            >
              Most images
            </SortChip>
            <SortChip
              active={sortBy === "cases"}
              onClick={() => {
                setSortBy("cases");
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
            >
              Most cases
            </SortChip>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setSortBy("alphabetical");
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
              className="rounded-full border border-white/55 bg-white/55 px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground dark:border-white/8 dark:bg-white/5"
            >
              Reset explorer
            </button>
          )}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="surface-panel rounded-[30px] px-6 py-14 text-center">
          <p className="font-heading text-2xl text-foreground">
            No conditions match that combination.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Try broadening the search terms or switching back to all
            categories.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {activeLabel}
              </p>
              <p className="text-sm text-muted-foreground">
                {hasMoreResults
                  ? `Previewing ${visibleResults.length} of ${filtered.length} conditions`
                  : `Showing all ${filtered.length} conditions`}
              </p>
            </div>
            {hasMoreResults && (
              <div className="rounded-full border border-white/55 bg-white/55 px-3 py-1.5 text-sm font-semibold text-muted-foreground dark:border-white/8 dark:bg-white/5">
                Load more to keep scrolling manageable
              </div>
            )}
          </div>

          <div
            className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
            key={`${selectedCategory}-${search}-${sortBy}`}
          >
            {visibleResults.map((condition, index) => (
              <ConditionCard
                key={condition.id}
                condition={condition}
                imageCount={imageCounts[condition.id] ?? 0}
                caseCount={caseCounts[condition.id] ?? 0}
                compareCount={compareCounts[condition.id] ?? 0}
                bodySites={bodySites[condition.id] ?? []}
                index={index}
              />
            ))}
          </div>

          {hasMoreResults && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((current) => current + VISIBLE_COUNT_STEP)
                }
                className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-[0_16px_30px_rgba(18,36,60,0.14)] transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-[#10233f]"
              >
                Show {Math.min(VISIBLE_COUNT_STEP, filtered.length - visibleCount)}{" "}
                more
              </button>
              <button
                type="button"
                onClick={() => setVisibleCount(filtered.length)}
                className="rounded-full border border-white/55 bg-white/55 px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground dark:border-white/8 dark:bg-white/5"
              >
                Show all {filtered.length}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
