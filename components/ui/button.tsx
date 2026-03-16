import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    const baseStyles =
      "font-mono font-bold uppercase tracking-wider transition-all duration-100 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-cyber-green/10 text-cyber-green border-[3px] border-cyber-green shadow-[4px_4px_0_theme(colors.cyber-green)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_theme(colors.cyber-green)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
      danger:
        "bg-cyber-red/10 text-cyber-red border-[3px] border-cyber-red shadow-[4px_4px_0_theme(colors.cyber-red)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_theme(colors.cyber-red)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
      ghost:
        "text-muted-foreground hover:text-foreground hover:bg-muted border-[3px] border-transparent",
      outline:
        "border-[3px] border-card-border text-foreground shadow-[4px_4px_0_theme(colors.card-border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_theme(colors.card-border)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-8 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
export type { ButtonProps };
