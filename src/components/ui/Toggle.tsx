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
      className={cn("relative flex items-center gap-2 group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-amber/60 rounded-full p-0.5", className)}
    >
      <StatusDot on={on} />
      <span
        className={cn(
          "relative inline-flex h-5 w-9 rounded-full transition-colors duration-300 items-center px-0.5",
          on ? "bg-brand-amber border border-[#8df1df] shadow-[inset_0_1px_rgba(255,255,255,.18)]" : "bg-[#0a1122] border border-black/30 shadow-[inset_0_1px_rgba(0,0,0,.35)]"
        )}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full transition-all duration-300 shadow-sm transform",
            on ? "translate-x-3.5 bg-[#edfff9] shadow-[0_1px_3px_rgba(0,0,0,.35)]" : "translate-x-0 bg-[#a9b8d1] shadow-[0_1px_3px_rgba(0,0,0,.35)]"
          )}
        />
      </span>
    </button>
  );
};
