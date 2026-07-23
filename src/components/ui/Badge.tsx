import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  label: string;
  variant?: "default" | "amber" | "teal" | "red" | "purple" | "muted";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "default",
  className,
}) => {
  const variantStyles: Record<string, string> = {
    default: "bg-surface text-content-primary border border-surface-border",
    amber: "bg-brand-amber/15 text-brand-amber border border-brand-amber/20",
    teal: "bg-brand-teal/15 text-brand-teal border border-brand-teal/20",
    red: "bg-brand-red/15 text-brand-red border border-brand-red/20",
    purple: "bg-brand-purple/15 text-brand-purple border border-brand-purple/20",
    muted: "bg-card-subtle text-content-secondary border border-surface-subtleBorder",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase font-mono transition-colors",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
};
