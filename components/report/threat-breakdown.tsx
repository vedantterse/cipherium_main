"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { ScamPhrase } from "@/lib/constants";
import { ANALYSIS_CATEGORIES } from "@/lib/constants";

interface ThreatBreakdownProps {
  scamPhrases: ScamPhrase[];
}

export function ThreatBreakdown({ scamPhrases }: ThreatBreakdownProps) {
  if (scamPhrases.length === 0) {
    return (
      <Card shadow="yellow">
        <CardHeader>
          <CardTitle>Detected Threats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-sm text-muted-foreground">
            No specific threats detected in this content.
          </p>
        </CardContent>
      </Card>
    );
  }

  const severityConfig = {
    high: { icon: AlertTriangle, color: "text-cyber-red", bg: "bg-cyber-red/10", border: "border-cyber-red/30" },
    medium: { icon: AlertCircle, color: "text-cyber-yellow", bg: "bg-cyber-yellow/10", border: "border-cyber-yellow/30" },
    low: { icon: Info, color: "text-cyber-blue", bg: "bg-cyber-blue/10", border: "border-cyber-blue/30" },
  };

  return (
    <Card shadow="yellow">
      <CardHeader>
        <CardTitle>Detected Threats ({scamPhrases.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scamPhrases.map((phrase, i) => {
            const config = severityConfig[phrase.severity];
            const Icon = config.icon;
            const categoryLabel = ANALYSIS_CATEGORIES[phrase.category as keyof typeof ANALYSIS_CATEGORIES] || phrase.category;

            return (
              <div
                key={i}
                className={`p-3 rounded-[4px] border-[2px] ${config.bg} ${config.border}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-4 h-4 mt-0.5 ${config.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-mono text-xs font-bold uppercase ${config.color}`}>
                        {categoryLabel}
                      </span>
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${config.bg} ${config.color} border ${config.border}`}>
                        {phrase.severity}
                      </span>
                    </div>
                    <p className="font-mono text-sm text-foreground break-words">
                      "{phrase.phrase}"
                    </p>
                    {phrase.translation && (
                      <p className="font-mono text-xs text-muted-foreground mt-1">
                        Translation: {phrase.translation}
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
