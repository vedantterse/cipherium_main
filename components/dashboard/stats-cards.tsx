"use client";

import { Card } from "@/components/ui/card";
import { ScanSearch, ShieldAlert, ShieldCheck, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@/lib/constants";

interface StatsCardsProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Scans",
      value: stats?.totalScans || 0,
      icon: ScanSearch,
      shadow: "green" as const,
      color: "text-cyber-green",
    },
    {
      label: "Threats Detected",
      value: stats?.threatsDetected || 0,
      icon: ShieldAlert,
      shadow: "red" as const,
      color: "text-cyber-red",
    },
    {
      label: "Safe Messages",
      value: stats?.safeCount || 0,
      icon: ShieldCheck,
      shadow: "blue" as const,
      color: "text-cyber-blue",
    },
    {
      label: "Avg Risk Score",
      value: stats?.avgRiskScore || 0,
      icon: TrendingUp,
      shadow: "yellow" as const,
      color: "text-cyber-yellow",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} shadow="none" className="animate-pulse h-28" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label} shadow={card.shadow} className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                {card.label}
              </p>
              <p className={`font-mono text-3xl font-bold mt-1 ${card.color}`}>
                {card.value}
              </p>
            </div>
            <div className={`p-2 rounded-[4px] bg-muted ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
