"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link2, ShieldCheck, ShieldX } from "lucide-react";
import type { SuspiciousLink } from "@/lib/constants";

interface LinkAnalysisProps {
  links: SuspiciousLink[];
}

export function LinkAnalysis({ links }: LinkAnalysisProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <Card shadow="blue">
      <CardHeader>
        <CardTitle>Detected Links ({links.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {links.map((link, i) => (
            <div
              key={i}
              className={`p-3 rounded-[4px] border-[2px] ${
                link.is_suspicious
                  ? "border-cyber-red/50 bg-cyber-red/5"
                  : "border-cyber-green/50 bg-cyber-green/5"
              }`}
            >
              <div className="flex items-start gap-3">
                {link.is_suspicious ? (
                  <ShieldX className="w-5 h-5 text-cyber-red shrink-0" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-cyber-green shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link2 className="w-3 h-3 text-muted-foreground" />
                    <span
                      className={`font-mono text-xs font-bold uppercase ${
                        link.is_suspicious ? "text-cyber-red" : "text-cyber-green"
                      }`}
                    >
                      {link.is_suspicious ? "Suspicious" : "Likely Safe"}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-foreground break-all">
                    {link.url}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    {link.reason}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
