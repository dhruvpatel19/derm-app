import { ReviewQueueClient } from "@/components/review/review-queue-client";
import { getImageById } from "@/lib/data-loader";
import { resolveImageUrl } from "@/lib/image-url";
import fs from "fs/promises";
import path from "path";

export const metadata = {
  title: "Annotation Review Queue - DermEd",
  description:
    "Review and accept or reject model-proposed image annotations.",
};

interface AnnotationProposal {
  id: string;
  imageAssetId: string;
  provenance: string;
  modelProvider: string;
  reviewStatus: string;
  conditionLabel: string;
  annotation: {
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
  };
  createdAt: string;
}

export default async function ReviewPage() {
  let proposals: AnnotationProposal[] | null = null;

  try {
    const filePath = path.join(
      process.cwd(),
      "src/data/generated/annotation-proposals.json",
    );
    const raw = await fs.readFile(filePath, "utf-8");
    proposals = JSON.parse(raw) as AnnotationProposal[];
  } catch {
    // File does not exist or is invalid
  }

  // Resolve image URLs for proposals
  const imageUrlMap: Record<string, string | null> = {};
  if (proposals) {
    for (const p of proposals) {
      if (!imageUrlMap[p.imageAssetId]) {
        const asset = getImageById(p.imageAssetId);
        imageUrlMap[p.imageAssetId] = asset
          ? resolveImageUrl(asset)
          : null;
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {proposals ? (
        <ReviewQueueClient proposals={proposals} imageUrlMap={imageUrlMap} />
      ) : (
        <div className="animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Annotation Review Queue
            </h1>
            <p className="mt-2 text-muted-foreground">
              Review and accept/reject model-proposed image annotations
            </p>
          </div>
          <div className="rounded-xl border border-dashed p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold">
              No proposals to review
            </h2>
            <p className="mx-auto mb-4 max-w-md text-sm text-muted-foreground">
              Generate annotation proposals by running the annotation generation
              script. Proposals will appear here for review.
            </p>
            <code className="rounded-lg bg-muted px-4 py-2 font-mono text-sm">
              npx tsx scripts/generate-annotation-proposals.ts
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
