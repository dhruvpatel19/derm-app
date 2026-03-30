import { morphologyTerms } from "@/data/morphology-terms";
import { GlossaryContent } from "@/components/glossary/glossary-content";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = {
  title: "Morphology Glossary - DermEd",
  description:
    "A comprehensive glossary of dermatology morphology terms including primary lesions, secondary lesions, surface changes, distribution, configuration, and color.",
};

export default function GlossaryPage() {
  return (
    <div className="page-shell pb-24 pt-8 sm:pt-10">
      <PageHeader
        title="Morphology Glossary"
        description="A clinical teaching reference for dermatology morphology terminology. Terms are grouped by category with confusion points and mnemonics to aid learning."
        breadcrumbs={[{ label: "Glossary" }]}
      >
        <div className="flex flex-wrap gap-3">
          <div className="metric-chip">
            <strong>{morphologyTerms.length}</strong>
            glossary terms
          </div>
          <div className="metric-chip">
            <strong>6</strong>
            concept groups
          </div>
          <div className="metric-chip">
            <strong>Cross-linked</strong>
            for rapid review
          </div>
        </div>
      </PageHeader>
      <GlossaryContent morphologyTerms={morphologyTerms} />
    </div>
  );
}
