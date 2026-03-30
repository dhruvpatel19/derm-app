"use client";

import type { SimulationModule } from "@/data/simulation-modules";
import { BiopsyChoice } from "./biopsy-choice";
import { InteractiveProcedureSimulation } from "./interactive-procedure-simulation";
import { TargetSelector } from "./target-selector";
import { ProcedureSequence } from "./procedure-sequence";
import { Card, CardContent } from "@/components/ui/card";

interface SimulationClientProps {
  module: SimulationModule;
  imageUrl?: string | null;
}

export function SimulationClient({ module, imageUrl }: SimulationClientProps) {
  switch (module.type) {
    case "biopsy_choice":
      return (
        <div className="animate-in fade-in duration-500">
          <BiopsyChoice module={module} imageUrl={imageUrl ?? null} />
        </div>
      );
    case "target_selector":
      return (
        <div className="animate-in fade-in duration-500">
          <TargetSelector module={module} />
        </div>
      );
    case "procedure_sequence":
      return (
        <div className="animate-in fade-in duration-500">
          <ProcedureSequence module={module} />
        </div>
      );
    case "interactive_procedure":
      return (
        <div className="animate-in fade-in duration-500">
          <InteractiveProcedureSimulation module={module} imageUrl={imageUrl ?? null} />
        </div>
      );
    default:
      return (
        <Card className="shadow-card rounded-xl">
          <CardContent className="py-8 text-center text-muted-foreground">
            Unknown simulation type.
          </CardContent>
        </Card>
      );
  }
}
