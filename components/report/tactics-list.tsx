"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Brain, Zap, Shield, Gift, Clock, Users, Heart } from "lucide-react";
import type { ManipulationTactic } from "@/lib/constants";
import { MANIPULATION_TACTICS } from "@/lib/constants";

interface TacticsListProps {
  tactics: ManipulationTactic[];
}

const tacticIcons: Record<string, React.ElementType> = {
  urgency: Clock,
  fear: Shield,
  authority: Brain,
  greed: Gift,
  scarcity: Zap,
  social_proof: Users,
  reciprocity: Heart,
};

export function TacticsList({ tactics }: TacticsListProps) {
  if (tactics.length === 0) {
    return (
      <Card shadow="purple">
        <CardHeader>
          <CardTitle>Manipulation Tactics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-sm text-muted-foreground">
            No manipulation tactics detected.
          </p>
        </CardContent>
      </Card>
    );
  }

  const severityColors = {
    high: "border-cyber-red/50 bg-cyber-red/5",
    medium: "border-cyber-yellow/50 bg-cyber-yellow/5",
    low: "border-cyber-blue/50 bg-cyber-blue/5",
  };

  return (
    <Card shadow="purple">
      <CardHeader>
        <CardTitle>Manipulation Tactics ({tactics.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {tactics.map((tactic, i) => {
            const Icon = tacticIcons[tactic.tactic] || Brain;
            const label = MANIPULATION_TACTICS[tactic.tactic as keyof typeof MANIPULATION_TACTICS] || tactic.tactic;
            const colorClass = severityColors[tactic.severity];

            return (
              <div
                key={i}
                className={`p-3 rounded-[4px] border-[2px] ${colorClass}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-[4px]">
                    <Icon className="w-4 h-4 text-cyber-purple" />
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-sm font-bold text-cyber-purple uppercase">
                      {label}
                    </p>
                    <p className="font-mono text-xs text-foreground mt-1">
                      {tactic.description}
                    </p>
                    {tactic.evidence && (
                      <p className="font-mono text-xs text-muted-foreground mt-1 italic">
                        Evidence: "{tactic.evidence}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
