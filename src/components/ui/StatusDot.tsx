import React from "react";
import { cn } from "@/lib/utils";

interface StatusDotProps {
  on: boolean;
  className?: string;
  glow?: boolean;
}

export const StatusDot: React.FC<StatusDotProps> = ({ on, className, glow = true }) => {
  return (
    <span
      className={cn(
        "inline-block w-2 h-2 rounded-full transition-all duration-300 flex-shrink-0",
        on ? "bg-brand-amber" : "bg-surface-muted",
        on && glow && "shadow-[0_0_8px_rgba(242,169,59,0.7)]",
        className
      )}
    />
  );
};
