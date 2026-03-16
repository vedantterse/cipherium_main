import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-mono font-bold text-muted-foreground mb-2 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-muted border-[3px] border-card-border rounded-[4px] px-4 py-3",
            "font-mono text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:border-cyber-green focus:shadow-[0_0_10px_rgba(0,255,65,0.2)]",
            "transition-all duration-200",
            error && "border-cyber-red focus:border-cyber-red focus:shadow-[0_0_10px_rgba(255,0,110,0.2)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs font-mono text-cyber-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
