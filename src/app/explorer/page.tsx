import {
  getAllConditions,
  getImageCountsByConditionId,
  getBodySitesByConditionId,
} from "@/lib/data-loader";
import { cases } from "@/data/cases";
import { compareModules } from "@/data/compare-modules";
import { ConditionFilter } from "@/components/explorer/condition-filter";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = {
  title: "Condition Explorer - DermEd",
  description:
    "Browse and search dermatology conditions by category, name, and clinical features.",
};

function buildConditionMeta() {
  const imageCounts = getImageCountsByConditionId();
  const bodySites = getBodySitesByConditionId();

  const caseCounts: Record<string, number> = {};
  for (const c of cases) {
    caseCounts[c.conditionId] = (caseCounts[c.conditionId] ?? 0) + 1;
  }

  const compareCounts: Record<string, number> = {};
  for (const m of compareModules) {
    for (const cid of m.conditionIds) {
      compareCounts[cid] = (compareCounts[cid] ?? 0) + 1;
    }
  }

  return { imageCounts, caseCounts, compareCounts, bodySites };
}

export default function ExplorerPage() {
  const conditions = getAllConditions();
  const meta = buildConditionMeta();

  return (
    <div className="page-shell pb-24 pt-8 sm:pt-10">
      <PageHeader
        title="Condition Explorer"
        description="Browse dermatology conditions by category or search by name. Each condition includes clinical images, key features, and differential diagnoses."
        breadcrumbs={[{ label: "Conditions" }]}
      >
        <div className="flex flex-wrap gap-3">
          <div className="metric-chip">
            <strong>{conditions.length}</strong>
            mapped conditions
          </div>
          <div className="metric-chip">
            <strong>{Object.keys(meta.imageCounts).length}</strong>
            image-backed entries
          </div>
          <div className="metric-chip">
            <strong>{cases.length}</strong>
            linked cases
          </div>
        </div>
      </PageHeader>
      <ConditionFilter
        conditions={conditions}
        imageCounts={meta.imageCounts}
        caseCounts={meta.caseCounts}
        compareCounts={meta.compareCounts}
        bodySites={meta.bodySites}
      />
    </div>
  );
}
