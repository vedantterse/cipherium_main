"use client";

import { useEffect, useState } from "react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RiskChart } from "@/components/dashboard/risk-chart";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { RecentAnalyses } from "@/components/dashboard/recent-analyses";
import type { DashboardStats } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ScanSearch, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";

export default function DashboardPage() {
  const { user } = useAuth();
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

  const threatRate = stats && stats.totalScans > 0
    ? Math.round((stats.threatsDetected / stats.totalScans) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyber-green" />
            Dashboard
          </h1>
          <p className="font-mono text-sm text-muted-foreground mt-1">
            {user ? `Welcome back, ${user.name}` : "Monitor your phishing analysis activity"}
          </p>
        </div>
        <Link href="/dashboard/analyze">
          <Button variant="primary">
            <ScanSearch className="w-4 h-4" />
            New Analysis
          </Button>
        </Link>
      </div>

      {/* Alert banner if high threat rate */}
      {!loading && stats && threatRate > 50 && (
        <div className="flex items-center gap-3 p-4 bg-cyber-red/10 border-[2px] border-cyber-red/40 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-cyber-red flex-shrink-0" />
          <p className="font-mono text-sm text-cyber-red">
            High threat rate detected ({threatRate}% of your scans show threats). Stay vigilant.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskChart stats={stats} />
        <ActivityChart stats={stats} />
      </div>

      {/* Recent Analyses + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentAnalyses analyses={analyses} loading={loading} />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-card border-[3px] border-card-border rounded-[4px] p-5">
            <h3 className="font-mono text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link href="/dashboard/analyze" className="block">
                <div className="p-3 bg-muted border border-card-border rounded hover:border-cyber-green/50 hover:bg-cyber-green/5 transition-all group">
                  <p className="font-mono text-sm font-bold text-foreground group-hover:text-cyber-green">Analyze Text</p>
                  <p className="font-mono text-xs text-muted-foreground">Paste a suspicious message</p>
                </div>
              </Link>
              <Link href="/dashboard/analyze" className="block">
                <div className="p-3 bg-muted border border-card-border rounded hover:border-cyber-blue/50 hover:bg-cyber-blue/5 transition-all group">
                  <p className="font-mono text-sm font-bold text-foreground group-hover:text-cyber-blue">Analyze Screenshot</p>
                  <p className="font-mono text-xs text-muted-foreground">Upload a chat screenshot</p>
                </div>
              </Link>
              <Link href="/dashboard/analyze" className="block">
                <div className="p-3 bg-muted border border-card-border rounded hover:border-cyber-purple/50 hover:bg-cyber-purple/5 transition-all group">
                  <p className="font-mono text-sm font-bold text-foreground group-hover:text-cyber-purple">Analyze Audio</p>
                  <p className="font-mono text-xs text-muted-foreground">Upload a voice recording</p>
                </div>
              </Link>
              <Link href="/dashboard/history" className="block">
                <div className="p-3 bg-muted border border-card-border rounded hover:border-cyber-yellow/50 hover:bg-cyber-yellow/5 transition-all group">
                  <p className="font-mono text-sm font-bold text-foreground group-hover:text-cyber-yellow">View History</p>
                  <p className="font-mono text-xs text-muted-foreground">Browse past analyses</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
