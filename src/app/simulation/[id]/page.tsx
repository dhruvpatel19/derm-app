import Link from "next/link";
import { notFound } from "next/navigation";
import { simulationModules } from "@/data/simulation-modules";
import { getImageById } from "@/lib/data-loader";
import { resolveImageUrl } from "@/lib/image-url";
import { SimulationClient } from "@/components/simulation/simulation-client";
import { Home, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Simulation - DermEd",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return simulationModules.map((simulationModule) => ({
    id: simulationModule.id,
  }));
}

export default async function SimulationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const simulationModule = simulationModules.find((m) => m.id === id);
  if (!simulationModule) notFound();

  // Resolve image URL if the module references an image asset
  let imageUrl: string | null = null;
  if (simulationModule.imageAssetId) {
    const asset = getImageById(simulationModule.imageAssetId);
    if (asset) {
      imageUrl = resolveImageUrl(asset);
    }
  }

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
              href="/simulation"
              className="transition-colors hover:text-foreground"
            >
              Simulation Lab
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <span className="font-medium text-foreground">{simulationModule.title}</span>
          </li>
        </ol>
      </nav>

      <SimulationClient module={simulationModule} imageUrl={imageUrl} />
    </div>
  );
}
