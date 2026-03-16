"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Mic, Image as ImageIcon, ChevronLeft, ChevronRight, ArrowRight, Shield } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { RiskLevel } from "@/lib/constants";

interface Analysis {
  id: number;
  type: "text" | "audio" | "image";
  inputText: string | null;
  imageData: string | null;
  originalFileName: string | null;
  detectedLanguage: string | null;
  riskLevel: RiskLevel;
  riskScore: number;
  aiSummary: string | null;
  createdAt: string;
}

const typeConfig = {
  text: { icon: FileText, label: "Text", color: "bg-cyber-blue/10 text-cyber-blue border-cyber-blue/30" },
  audio: { icon: Mic, label: "Audio", color: "bg-cyber-purple/10 text-cyber-purple border-cyber-purple/30" },
  image: { icon: ImageIcon, label: "Image", color: "bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/30" },
};

const PREVIEW_LENGTH = 120;

function getPreviewText(analysis: Analysis): string {
  if (analysis.aiSummary) return analysis.aiSummary;
  if (analysis.type === "audio") {
    return analysis.inputText
      ? `Transcript: ${analysis.inputText.slice(0, PREVIEW_LENGTH)}${analysis.inputText.length > PREVIEW_LENGTH ? "…" : ""}`
      : analysis.originalFileName || "Audio analysis";
  }
  if (analysis.type === "text" && analysis.inputText) {
    return analysis.inputText.slice(0, PREVIEW_LENGTH) + (analysis.inputText.length > PREVIEW_LENGTH ? "…" : "");
  }
  return "Analysis complete";
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analyses?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((data) => {
        setAnalyses(data.analyses || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyber-green" />
            Analysis History
          </h1>
          <p className="font-mono text-sm text-muted-foreground mt-1">
            {loading ? "Loading…" : `${total} total analysis${total !== 1 ? "es" : ""}`}
          </p>
        </div>
        <Link href="/dashboard/analyze">
          <Button variant="primary" className="gap-2">
            New Analysis
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : analyses.length === 0 ? (
        <Card shadow="green" className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-muted">
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-mono text-lg text-foreground mb-1">No analyses yet</p>
              <p className="font-mono text-sm text-muted-foreground">
                Start by analyzing some suspicious content
              </p>
            </div>
            <Link href="/dashboard/analyze">
              <Button variant="primary" className="mt-2">
                New Analysis
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3">
          {analyses.map((analysis) => {
            const config = typeConfig[analysis.type];
            const Icon = config.icon;
            const isHighRisk = analysis.riskLevel === "high_risk";
            const previewText = getPreviewText(analysis);

            return (
              <Link key={analysis.id} href={`/dashboard/report/${analysis.id}`}>
                <Card
                  shadow={isHighRisk ? "red" : "none"}
                  className={`p-4 hover:border-cyber-green/60 transition-all cursor-pointer group ${
                    isHighRisk ? "border-cyber-red/50" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail/Icon */}
                    <div className="flex-shrink-0">
                      {analysis.type === "image" && analysis.imageData ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-card-border">
                          <img
                            src={analysis.imageData}
                            alt="Screenshot"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center border ${config.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${config.color}`}>
                          {config.label.toUpperCase()}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {formatDate(analysis.createdAt)}
                        </span>
                        {analysis.detectedLanguage && (
                          <span className="font-mono text-xs text-muted-foreground capitalize">
                            • {analysis.detectedLanguage}
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-sm text-foreground line-clamp-2 leading-relaxed">
                        {previewText}
                      </p>
                      {analysis.originalFileName && analysis.type !== "text" && (
                        <p className="font-mono text-xs text-muted-foreground mt-1 truncate">
                          {analysis.originalFileName}
                        </p>
                      )}
                    </div>

                    {/* Risk Badge & Score */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <div className="text-right">
                        <div className={`font-mono text-2xl font-black ${
                          analysis.riskLevel === "high_risk" ? "text-cyber-red" :
                          analysis.riskLevel === "suspicious" ? "text-cyber-yellow" :
                          "text-cyber-green"
                        }`}>
                          {analysis.riskScore}%
                        </div>
                        <Badge level={analysis.riskLevel} size="sm" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-cyber-green transition-colors" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="font-mono text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
