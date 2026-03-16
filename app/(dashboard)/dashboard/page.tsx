"use client";

import { useEffect, useState } from "react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RiskChart } from "@/components/dashboard/risk-chart";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { RecentAnalyses } from "@/components/dashboard/recent-analyses";
import type { DashboardStats } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ScanSearch } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then((r) => r.json()),
      fetch("/api/analyses?limit=5").then((r) => r.json()),
    ])
      .then(([statsData, analysesData]) => {
        setStats(statsData);
        setAnalyses(analysesData.analyses || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="font-mono text-sm text-muted-foreground mt-1">
            Monitor your phishing analysis activity
          </p>
        </div>
        <Link href="/dashboard/analyze">
          <Button variant="primary">
            <ScanSearch className="w-4 h-4" />
            New Analysis
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskChart stats={stats} />
        <ActivityChart stats={stats} />
      </div>

      {/* Recent Analyses */}
      <RecentAnalyses analyses={analyses} loading={loading} />
    </div>
  );
}
