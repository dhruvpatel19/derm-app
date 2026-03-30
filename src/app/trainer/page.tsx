import { getAllQuizItems, getAllConditions, getAllImageAssets } from "@/lib/data-loader";
import { resolveImageUrl } from "@/lib/image-url";
import { TrainerClient } from "@/components/trainer/trainer-client";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = {
  title: "Morphology Trainer - DermEd",
  description:
    "Rapid-fire image-based morphology trainer with dataset-backed quiz items.",
};

export default function TrainerPage() {
  const quizItems = getAllQuizItems();
  const conditions = getAllConditions();
  const imageAssets = getAllImageAssets();

  const imageUrlMap: Record<string, string> = {};
  for (const asset of imageAssets) {
    const url = resolveImageUrl(asset);
    if (url) {
      imageUrlMap[asset.id] = url;
    }
  }

  return (
    <div className="page-shell pb-24 pt-8 sm:pt-10">
      <PageHeader
        title="Morphology Trainer"
        description="Rapid-fire practice for description, diagnosis, feature selection, and differential ranking using dataset-backed clinical images."
        breadcrumbs={[{ label: "Trainer" }]}
      >
        <div className="flex flex-wrap gap-3">
          <div className="metric-chip">
            <strong>{quizItems.filter((item) => item.isActive).length}</strong>
            active quiz items
          </div>
          <div className="metric-chip">
            <strong>{conditions.length}</strong>
            mapped conditions
          </div>
          <div className="metric-chip">
            <strong>{imageAssets.length}</strong>
            image assets
          </div>
        </div>
      </PageHeader>

      <TrainerClient
        quizItems={quizItems}
        imageAssets={imageAssets}
        conditions={conditions}
        imageUrlMap={imageUrlMap}
      />
    </div>
  );
}
