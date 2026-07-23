"use client";

import React from "react";
import { StatusDot } from "./StatusDot";
import { cn } from "@/lib/utils";

export interface ToggleProps {
  on: boolean;
  onToggle: () => void;
  ariaLabel?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  on,
  onToggle,
  ariaLabel = "Toggle state",
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      className={cn("relative flex items-center gap-2 group cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-brand-amber rounded-full p-0.5", className)}
    >
      <StatusDot on={on} />
      <span
        className={cn(
          "relative inline-flex h-5 w-9 rounded-full transition-colors duration-300 items-center px-0.5",
          on ? "bg-brand-amber/20 border border-brand-amber/30" : "bg-surface border border-surface-border"
        )}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full transition-all duration-300 shadow-sm transform",
            on ? "translate-x-3.5 bg-brand-amber shadow-[0_0_6px_rgba(242,169,59,0.8)]" : "translate-x-0 bg-surface-muted"
          )}
        />
      </span>
    </button>
  );
};
