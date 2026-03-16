import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/constants";
import { RISK_LEVELS } from "@/lib/constants";

interface BadgeProps {
  level: RiskLevel;
  className?: string;
  size?: "sm" | "md";
}

export function Badge({ level, className, size = "md" }: BadgeProps) {
  const config = RISK_LEVELS[level];
  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "font-mono font-bold uppercase tracking-wider rounded-[4px] border-[2px] inline-flex items-center gap-1.5",
        config.bg,
        config.text,
        config.border,
        level === "high_risk" && "pulse-danger",
        sizes[size],
        className
      )}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
