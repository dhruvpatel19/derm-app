import Link from "next/link";
import { notFound } from "next/navigation";
import { cases } from "@/data/cases";
import { conditions } from "@/data/conditions";
import { CaseClient } from "@/components/cases/case-client";
import { getImageById } from "@/lib/data-loader";
import { resolveImageUrl } from "@/lib/image-url";
import { Home, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Case Study - DermEd",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map((caseItem) => ({ id: caseItem.id }));
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const caseData = cases.find((c) => c.id === id);
  if (!caseData) notFound();

  const condition = conditions.find((c) => c.id === caseData.conditionId);
  const conditionName = condition?.name ?? "Unknown Condition";
  const caseImages = (caseData.imageAssetIds ?? []).flatMap((imageId) => {
    const asset = getImageById(imageId);
    if (!asset) return [];

    const src = resolveImageUrl(asset);
    if (!src) return [];

    return [
      {
        id: asset.id,
        src,
        alt: asset.altText,
        source:
          asset.datasetSourceId === "scin-google-research"
            ? "SCIN"
            : asset.datasetSourceId === "ds-pad-ufes-20"
              ? "PAD-UFES-20"
              : "Seed",
        bodySite: asset.bodySite ?? undefined,
        skinTone: asset.skinToneLabel ?? undefined,
        diagnosis: asset.diagnosisNormalized ?? undefined,
      },
    ];
  });

  return (
    <div className="page-shell max-w-5xl pb-24 pt-8 sm:pt-10">
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
              href="/cases"
              className="transition-colors hover:text-foreground"
            >
              Clinical Cases
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <span className="font-medium text-foreground">
              {caseData.title}
            </span>
          </li>
        </ol>
      </nav>

      <CaseClient
        caseData={caseData}
        conditionName={conditionName}
        caseImages={caseImages}
      />
    </div>
  );
}
