"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { DashboardStats } from "@/lib/constants";

interface ActivityChartProps {
  stats: DashboardStats | null;
}

export function ActivityChart({ stats }: ActivityChartProps) {
  const data = stats?.dailyActivity || [];

  // Fill in missing dates
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const existing = data.find((d) => d.date === dateStr);
    last7Days.push({
      date: dateStr,
      count: existing?.count || 0,
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }

  return (
    <Card shadow="blue" className="h-full">
      <CardHeader>
        <CardTitle>Activity (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={last7Days}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00ff41" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#888898", fontSize: 10, fontFamily: "monospace" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#888898", fontSize: 10, fontFamily: "monospace" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#111118",
                border: "2px solid #2a2a3a",
                borderRadius: "4px",
                fontFamily: "monospace",
              }}
              labelStyle={{ color: "#e0e0e0" }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#00ff41"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
