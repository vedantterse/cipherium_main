"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ScamPhrase } from "@/lib/constants";

interface HighlightedTextProps {
  text: string;
  scamPhrases: ScamPhrase[];
}

export function HighlightedText({ text, scamPhrases }: HighlightedTextProps) {
  if (!text) return null;

  // Build highlighted text
  let highlightedText = text;
  const highlights: { phrase: string; severity: string }[] = [];

  for (const sp of scamPhrases) {
    highlights.push({ phrase: sp.phrase, severity: sp.severity });
  }

  return (
    <Card shadow="red" className="h-full">
      <CardHeader>
        <CardTitle>Analyzed Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted border-[2px] border-card-border rounded-[4px] p-4 font-mono text-sm leading-relaxed max-h-64 overflow-y-auto">
          <HighlightedContent text={text} highlights={highlights} />
        </div>
        {highlights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded-sm bg-cyber-red/30 border border-cyber-red" /> High Risk
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded-sm bg-cyber-yellow/30 border border-cyber-yellow" /> Medium
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded-sm bg-cyber-blue/30 border border-cyber-blue" /> Low
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function HighlightedContent({
  text,
  highlights,
}: {
  text: string;
  highlights: { phrase: string; severity: string }[];
}) {
  if (highlights.length === 0) {
    return <span className="text-foreground">{text}</span>;
  }

  // Sort by length (longest first) to avoid partial matches
  const sortedHighlights = [...highlights].sort(
    (a, b) => b.phrase.length - a.phrase.length
  );

  // Create a copy of the text with placeholders
  let processedText = text;
  const replacements: { placeholder: string; severity: string; phrase: string }[] = [];

  for (const h of sortedHighlights) {
    const placeholder = `__HIGHLIGHT_${replacements.length}__`;
    const regex = new RegExp(escapeRegex(h.phrase), "gi");
    if (regex.test(processedText)) {
      processedText = processedText.replace(regex, placeholder);
      replacements.push({ placeholder, severity: h.severity, phrase: h.phrase });
    }
  }

  // Split and render
  const parts = processedText.split(/(__HIGHLIGHT_\d+__)/g);

  return (
    <>
      {parts.map((part, i) => {
        const replacement = replacements.find((r) => r.placeholder === part);
        if (replacement) {
          const colors = {
            high: "bg-cyber-red/20 border-cyber-red text-cyber-red",
            medium: "bg-cyber-yellow/20 border-cyber-yellow text-cyber-yellow",
            low: "bg-cyber-blue/20 border-cyber-blue text-cyber-blue",
          };
          const colorClass = colors[replacement.severity as keyof typeof colors] || colors.medium;
          return (
            <mark
              key={i}
              className={`px-1 py-0.5 rounded border ${colorClass} font-semibold`}
            >
              {replacement.phrase}
            </mark>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
