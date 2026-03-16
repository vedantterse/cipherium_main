"use client";

import { useEffect, useState } from "react";
import { RISK_LEVELS, type RiskLevel } from "@/lib/constants";

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
}

export function RiskGauge({ score, level }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const config = RISK_LEVELS[level];

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Circular gauge calculation
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;
  const dashOffset = circumference - progress;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1a1a2e"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={config.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 1s ease-out",
              filter: `drop-shadow(0 0 12px ${config.color})`,
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono text-5xl font-black tabular-nums"
            style={{
              color: config.color,
              textShadow: `0 0 20px ${config.color}50`,
            }}
          >
            {animatedScore}
          </span>
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mt-1">
            Risk Score
          </span>
        </div>
      </div>
      {/* Risk level badge */}
      <div
        className={`px-6 py-2 rounded-[4px] font-mono text-sm font-bold uppercase tracking-wider border-[3px] ${
          level === "high_risk" ? "pulse-danger" : ""
        }`}
        style={{
          borderColor: config.color,
          color: config.color,
          backgroundColor: `${config.color}20`,
          boxShadow: `0 0 20px ${config.color}30`,
        }}
      >
        {config.label}
      </div>
    </div>
  );
}
