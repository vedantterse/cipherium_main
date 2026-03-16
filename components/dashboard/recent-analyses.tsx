"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Mic, Image, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { RiskLevel } from "@/lib/constants";

interface Analysis {
  id: number;
  type: "text" | "audio" | "image";
  detectedLanguage: string | null;
  riskLevel: RiskLevel;
  riskScore: number;
  aiSummary: string | null;
  createdAt: string;
}

interface RecentAnalysesProps {
  analyses: Analysis[];
  loading?: boolean;
}

const typeIcons = {
  text: FileText,
  audio: Mic,
  image: Image,
};

export function RecentAnalyses({ analyses, loading }: RecentAnalysesProps) {
  if (loading) {
    return (
      <Card shadow="green" className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-[4px] animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card shadow="green" className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Analyses</CardTitle>
        <Link
          href="/dashboard/history"
          className="font-mono text-xs text-cyber-green hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {analyses.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-mono text-sm text-muted-foreground">
              No analyses yet. Start by analyzing some content!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((analysis) => {
              const Icon = typeIcons[analysis.type];
              return (
                <Link
                  key={analysis.id}
                  href={`/dashboard/report/${analysis.id}`}
                  className="block p-3 bg-muted border-[2px] border-card-border rounded-[4px] hover:border-cyber-green/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-card rounded-[4px]">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-muted-foreground">
                          {formatDate(analysis.createdAt)}
                        </p>
                        <p className="font-mono text-sm text-foreground truncate">
                          {analysis.aiSummary?.slice(0, 50) || "Analysis complete"}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge level={analysis.riskLevel} size="sm" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
