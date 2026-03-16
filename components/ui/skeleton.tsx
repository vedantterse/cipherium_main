import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-muted border-[2px] border-card-border rounded-[4px] animate-pulse",
        className
      )}
    />
  );
}
