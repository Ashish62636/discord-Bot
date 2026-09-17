"use client";

import React from "react";
import { Toggle } from "@/components/ui/Toggle";
import { Badge } from "@/components/ui/Badge";
import { GuildModule } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export interface ModuleCardProps {
  module: GuildModule;
  isOn: boolean;
  onToggle: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isOn,
  onToggle,
}) => {
  return (
    <div
      className={cn(
        "rounded-xl p-3.5 flex flex-col justify-between gap-3 transition-all duration-200 border hover:-translate-y-0.5",
        isOn
          ? "obsidian-panel border-brand-amber/35 shadow-[0_12px_28px_rgba(0,0,0,.14)]"
          : "bg-card-subtle border-surface-subtleBorder opacity-80 hover:opacity-100"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3
            className={cn(
              "text-sm font-semibold font-heading leading-tight transition-colors",
              isOn ? "text-content-primary" : "text-content-tertiary"
            )}
          >
            {module.name}
          </h3>
          <p className="text-[11px] text-content-secondary mt-1 font-sans leading-tight">
            {module.desc}
          </p>
        </div>
        <Toggle on={isOn} onToggle={onToggle} ariaLabel={`Toggle ${module.name}`} />
      </div>

      <div className="flex items-center justify-between">
        <Badge
          label={module.category}
          variant={isOn ? "amber" : "muted"}
        />
        <span
          className={cn(
            "text-[10px] font-mono uppercase tracking-wider",
            isOn ? "text-brand-amber" : "text-content-tertiary"
          )}
        >
          {isOn ? "Active" : "Disabled"}
        </span>
      </div>
    </div>
  );
};
