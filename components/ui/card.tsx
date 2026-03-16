import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  shadow?: "green" | "red" | "blue" | "yellow" | "purple" | "none";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, shadow = "green", ...props }, ref) => {
    const shadowColors = {
      green: "shadow-[4px_4px_0_theme(colors.cyber-green)]",
      red: "shadow-[4px_4px_0_theme(colors.cyber-red)]",
      blue: "shadow-[4px_4px_0_theme(colors.cyber-blue)]",
      yellow: "shadow-[4px_4px_0_theme(colors.cyber-yellow)]",
      purple: "shadow-[4px_4px_0_theme(colors.cyber-purple)]",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-card border-[3px] border-card-border rounded-[4px] p-6",
          shadowColors[shadow],
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-mono font-bold text-lg text-foreground", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
