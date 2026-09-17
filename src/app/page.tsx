"use client";

import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { StatCardSkeleton, ModuleCardSkeleton } from "@/components/ui/Skeletons";
import { Skeleton } from "@/components/ui/Skeleton";
import { useStats } from "@/hooks/use-stats";
import { useGuildConfig } from "@/hooks/use-guild-config";
import { MOCK_MODULES, MOCK_ACTIVITIES } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export default function OverviewPage() {
  const stats = useStats();
  const config = useGuildConfig();

  // Derive module on/off states from the API config, falling back to mock defaults
  const moduleStates: Record<string, boolean> = (() => {
    const apiModules = config.data?.config?.settings?.modules;
    if (apiModules) return apiModules;
    return Object.fromEntries(MOCK_MODULES.map((m) => [m.id, m.defaultOn]));
  })();

  const activeCount = Object.values(moduleStates).filter(Boolean).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Fallback banner when running without a database */}
      {(stats.isFallback || config.isFallback) && (
        <ErrorBanner
          message="API unreachable — showing demo data. Start Postgres and seed the database for live data."
          isFallback
          onRetry={() => { stats.refetch(); config.refetch(); }}
        />
      )}

      {/* Overview Title Banner */}
      <div className="relative overflow-hidden rounded-2xl obsidian-panel px-5 py-5 sm:px-6 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-brand-purple/25 blur-3xl pointer-events-none" />
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[.18em] font-mono text-brand-amber">Guild operations</p>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-content-primary tracking-tight">
            Signal, without the noise.
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1 font-sans">
            Live telemetry and controls for <span className="text-brand-amber font-mono">guildcraft.gg</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative text-xs px-3 py-2 rounded-lg bg-[#0a1122]/70 border border-surface-border font-mono text-content-secondary shadow-[inset_0_1px_rgba(0,0,0,.3)]">
            Active Modules: <span className="text-brand-amber font-bold">{activeCount} / {MOCK_MODULES.length}</span>
          </div>
        </div>
      </div>

      {/* Top Telemetry Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            <StatCard
              label="Members"
              value={formatNumber(stats.data?.members.total ?? 0)}
              delta="+83 (+2.0%)"
              positive={true}
              color="#4FC9AE"
              sub="Total tracked members"
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
              value={formatNumber(stats.data?.moderation.last24h ?? 0)}
              delta={`${formatNumber(stats.data?.moderation.last7d ?? 0)} past 7d`}
              positive={false}
              color="#E03E3E"
              sub="Past 24 hours"
            />
            <StatCard
              label="Open Tickets"
              value={String(stats.data?.tickets.open ?? 0)}
              delta={`${stats.data?.giveaways.active ?? 0} active giveaways`}
              positive={false}
              color="#7B6CF6"
              sub={`${stats.data?.automod.enabledRules ?? 0} auto-mod rules enabled`}
            />
          </>
        )}
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
              {config.isMutating ? "Saving…" : "Click toggles to update in real-time"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {config.isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ModuleCardSkeleton key={i} />
              ))
            ) : (
              MOCK_MODULES.map((mod) => (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  isOn={moduleStates[mod.id] ?? false}
                  onToggle={() => config.toggleModule(mod.id)}
                />
              ))
            )}
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
