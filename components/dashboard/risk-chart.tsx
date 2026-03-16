"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { DashboardStats } from "@/lib/constants";

interface RiskChartProps {
  stats: DashboardStats | null;
}

const COLORS = {
  safe: "#00ff41",
  suspicious: "#ffbe0b",
  high_risk: "#ff006e",
};

export function RiskChart({ stats }: RiskChartProps) {
  const data = [
    { name: "Safe", value: stats?.riskDistribution?.safe || 0, color: COLORS.safe },
    { name: "Suspicious", value: stats?.riskDistribution?.suspicious || 0, color: COLORS.suspicious },
    { name: "High Risk", value: stats?.riskDistribution?.high_risk || 0, color: COLORS.high_risk },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <Card shadow="purple" className="h-full">
        <CardHeader>
          <CardTitle>Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <p className="font-mono text-sm text-muted-foreground">No data yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card shadow="purple" className="h-full">
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="#1a1a25"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#111118",
                border: "2px solid #2a2a3a",
                borderRadius: "4px",
                fontFamily: "monospace",
              }}
            />
            <Legend
              formatter={(value) => (
                <span className="font-mono text-xs text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
