"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RiskGauge } from "@/components/report/risk-gauge";
import { HighlightedText } from "@/components/report/highlighted-text";
import { ThreatBreakdown } from "@/components/report/threat-breakdown";
import { TacticsList } from "@/components/report/tactics-list";
import { LinkAnalysis } from "@/components/report/link-analysis";
import { LanguageBadge } from "@/components/report/language-badge";
import { ArrowLeft, FileText, Mic, Image as ImageIcon, Calendar, AlertTriangle, Shield, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { AnalysisResult } from "@/lib/constants";

const typeConfig = {
  text: { icon: FileText, label: "Text Analysis", color: "cyber-blue" },
  audio: { icon: Mic, label: "Audio Analysis", color: "cyber-purple" },
  image: { icon: ImageIcon, label: "Image Analysis", color: "cyber-yellow" },
};

export default function ReportPage() {
  const params = useParams();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/analyses/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Analysis not found");
        return r.json();
      })
      .then(setAnalysis)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="font-mono text-lg text-cyber-red mb-4">
          {error || "Analysis not found"}
        </p>
        <Link href="/dashboard/history">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4" />
            Back to History
          </Button>
        </Link>
      </div>
    );
  }

  const typeInfo = typeConfig[analysis.type];
  const TypeIcon = typeInfo.icon;
  const isHighRisk = analysis.riskLevel === "high_risk";
  const isSafe = analysis.riskLevel === "safe";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/dashboard/history"
            className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to History
          </Link>
          <h1 className="font-mono text-2xl font-bold text-foreground flex items-center gap-3">
            Analysis Report
            {isHighRisk && <AlertTriangle className="w-6 h-6 text-cyber-red animate-pulse" />}
            {isSafe && <CheckCircle className="w-6 h-6 text-cyber-green" />}
          </h1>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-card-border">
              <TypeIcon className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-sm text-foreground">{typeInfo.label}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-card-border">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-sm text-foreground">
                {formatDate(analysis.createdAt)}
              </span>
            </div>
            <LanguageBadge language={analysis.detectedLanguage} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Score */}
        <Card shadow="none" className="flex flex-col items-center justify-center p-8 border-[3px] border-card-border bg-gradient-to-b from-card to-background">
          <RiskGauge score={analysis.riskScore} level={analysis.riskLevel} />
        </Card>

        {/* AI Summary */}
        <Card shadow="blue" className="lg:col-span-2">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-cyber-blue" />
              <h3 className="font-mono text-sm font-bold text-muted-foreground uppercase tracking-wider">
                AI Analysis Summary
              </h3>
            </div>
            <p className="font-mono text-base text-foreground leading-relaxed flex-1">
              {analysis.aiSummary || "No summary available."}
            </p>
          </div>
        </Card>
      </div>

      {/* Original Content Preview */}
      {(analysis.type === "image" && analysis.imageData) && (
        <Card shadow="purple">
          <div className="p-6">
            <h3 className="font-mono text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Original Screenshot
            </h3>
            <div className="rounded-lg overflow-hidden border-2 border-card-border">
              <img
                src={analysis.imageData}
                alt="Analyzed screenshot"
                className="w-full max-h-[400px] object-contain bg-muted"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Audio Player + Transcript */}
      {analysis.type === "audio" && (
        <Card shadow="purple">
          <div className="p-6 space-y-4">
            <h3 className="font-mono text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Audio Recording
            </h3>

            {/* Audio player if file exists */}
            {analysis.filePath && (
              <div className="bg-muted rounded-lg p-3 border border-card-border">
                <p className="font-mono text-xs text-muted-foreground mb-2">
                  {analysis.originalFileName || "Audio file"}
                </p>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <audio
                  controls
                  className="w-full h-10"
                  src={`/api/audio/${encodeURIComponent(analysis.filePath.split("/").pop() || "")}`}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Transcript */}
            {analysis.audioTranscript && (
              <>
                <h4 className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Transcript
                </h4>
                <div className="bg-muted rounded-lg p-4 border border-card-border max-h-48 overflow-y-auto">
                  <p className="font-mono text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {analysis.audioTranscript}
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Highlighted Text */}
      <HighlightedText
        text={analysis.inputText || ""}
        scamPhrases={analysis.scamPhrases}
      />

      {/* Threats and Tactics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatBreakdown scamPhrases={analysis.scamPhrases} />
        <TacticsList tactics={analysis.manipulationTactics} />
      </div>

      {/* Links */}
      <LinkAnalysis links={analysis.suspiciousLinks} />

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 pb-8">
        <Link href="/dashboard/analyze">
          <Button variant="primary" className="gap-2">
            <Shield className="w-4 h-4" />
            Analyze Another
          </Button>
        </Link>
        <Link href="/dashboard/history">
          <Button variant="outline">View History</Button>
        </Link>
      </div>
    </div>
  );
}
