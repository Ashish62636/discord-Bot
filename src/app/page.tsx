"use client";

import React, { useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { MOCK_MODULES, MOCK_ACTIVITIES } from "@/lib/mock-data";

export default function OverviewPage() {
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>(
    Object.fromEntries(MOCK_MODULES.map((m) => [m.id, m.defaultOn]))
  );

  const toggleModule = (id: string) => {
    setModuleStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeCount = Object.values(moduleStates).filter(Boolean).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Overview Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-content-primary">
            Overview Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1 font-sans">
            Real-time guild telemetry and active module status for <span className="text-brand-amber font-mono">guildcraft.gg</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs px-3 py-1.5 rounded-lg bg-surface border border-surface-border font-mono text-content-secondary">
            Active Modules: <span className="text-brand-amber font-bold">{activeCount} / {MOCK_MODULES.length}</span>
          </div>
        </div>
      </div>

      {/* Top Telemetry Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Members"
          value="4,218"
          delta="+83 (+2.0%)"
          positive={true}
          color="#4FC9AE"
          sub="184 currently online"
        />
        <StatCard
          label="Messages / day"
          value="2,941"
          delta="+12.4%"
          positive={true}
          color="#F2A93B"
          sub="Peak: 420 msgs/hr"
        />
        <StatCard
          label="Mod Actions"
          value="47"
          delta="-18.3%"
          positive={false}
          color="#E03E3E"
          sub="Past 24 hours"
        />
        <StatCard
          label="Open Tickets"
          value="9"
          delta="+3 pending"
          positive={false}
          color="#7B6CF6"
          sub="Avg resolution: 14m"
        />
      </div>

      {/* Module Grid & Activity Feed Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Management Grid (2 cols on large screens) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest font-heading font-semibold text-content-secondary">
              Core Bot Modules
            </h2>
            <span className="text-[11px] font-mono text-content-tertiary">
              Click toggles to update in real-time
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {MOCK_MODULES.map((mod) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                isOn={moduleStates[mod.id] ?? false}
                onToggle={() => toggleModule(mod.id)}
              />
            ))}
          </div>
        </div>

        {/* Activity Feed Column (1 col) */}
        <div className="space-y-4">
          <ActivityFeed activities={MOCK_ACTIVITIES} />
        </div>
      </div>
    </div>
  );
}
