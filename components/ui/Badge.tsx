import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "medical" | "gold" | "navy" | "outline" | "slate" | "success";
  size?: "sm" | "md" | "lg";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "medical",
  size = "md",
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] font-semibold tracking-wide",
    md: "px-2.5 py-1 text-xs font-semibold tracking-wide",
    lg: "px-3 py-1.5 text-sm font-semibold tracking-wide",
  };

  const variantStyles = {
    medical:
      "bg-medical-100 text-medical-800 dark:bg-medical-950/80 dark:text-medical-300 dark:border dark:border-medical-800/60",
    gold:
      "bg-gold-100 text-gold-900 dark:bg-gold-950/80 dark:text-gold-300 dark:border dark:border-gold-800/60",
    navy:
      "bg-navy-100 text-navy-900 dark:bg-navy-900 dark:text-navy-200 dark:border dark:border-navy-700",
    outline:
      "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-transparent",
    slate:
      "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    success:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/60",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full uppercase transition-colors",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
