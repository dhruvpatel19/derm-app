import Link from "next/link";
import { notFound } from "next/navigation";
import { compareModules } from "@/data/compare-modules";
import { conditions } from "@/data/conditions";
import { CompareDetail } from "@/components/compare/compare-detail";
import type { Condition } from "@/lib/domain/schemas";
import { Home, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Compare Conditions - DermEd",
  description: "Detailed side-by-side comparison of look-alike conditions.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return compareModules.map((compareModule) => ({ id: compareModule.id }));
}

export default async function CompareDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const compareModule = compareModules.find((m) => m.id === id);

  if (!compareModule) {
    notFound();
  }

  const conditionMap: Record<string, Condition> = {};
  for (const cId of compareModule.conditionIds) {
    const found = conditions.find((c) => c.id === cId);
    if (found) {
      conditionMap[cId] = found;
    }
  }

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
            <Link
              href="/compare"
              className="transition-colors hover:text-foreground"
            >
              Compare Mode
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <span className="font-medium text-foreground">{compareModule.title}</span>
          </li>
        </ol>
      </nav>

      <CompareDetail module={compareModule} conditionMap={conditionMap} />
    </div>
  );
}
