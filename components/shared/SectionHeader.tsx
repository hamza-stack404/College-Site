import React from "react";
import { Badge } from "../ui/Badge";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  badgeVariant?: "medical" | "gold" | "navy" | "outline";
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  badgeVariant = "medical",
  title,
  titleHighlight,
  subtitle,
  align = "center",
  className,
}) => {
  const alignStyles = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  return (
    <div className={cn("flex flex-col max-w-3xl mb-12 sm:mb-16", alignStyles[align], className)}>
      {badge && (
        <Badge variant={badgeVariant} size="md" className="mb-3.5">
          {badge}
        </Badge>
      )}
      <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-slate-900 dark:text-white tracking-tight leading-[1.15]">
        {title}{" "}
        {titleHighlight && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-600 via-medical-500 to-gold-500">
            {titleHighlight}
          </span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};
