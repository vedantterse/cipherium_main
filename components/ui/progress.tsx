import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  color?: "green" | "red" | "yellow" | "blue";
}

export function Progress({ value, className, color = "green" }: ProgressProps) {
  const colors = {
    green: "bg-cyber-green",
    red: "bg-cyber-red",
    yellow: "bg-cyber-yellow",
    blue: "bg-cyber-blue",
  };

  return (
    <div
      className={cn(
        "h-3 bg-muted border-[2px] border-card-border rounded-[4px] overflow-hidden",
        className
      )}
    >
      <div
        className={cn("h-full transition-all duration-500 ease-out", colors[color])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
