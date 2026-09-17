import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

/** Loading placeholder for the StatCard grid (4 cards) */
export function StatCardSkeleton() {
  return (
    <div className="rounded-xl p-4 bg-card border border-surface-border flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-16" />
      </div>
      <div>
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-3 w-32 mt-1.5" />
      </div>
      <div className="pt-1 border-t border-surface-subtleBorder">
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

/** Loading placeholder for the ModuleCard grid */
export function ModuleCardSkeleton() {
  return (
    <div className="rounded-xl p-3.5 bg-card border border-surface-border flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 flex-1">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-28 mt-1" />
        </div>
      </div>
      <Skeleton className="h-5 w-9 rounded-full" />
    </div>
  );
}

/** Full overview page skeleton — stat cards + module grid */
export function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ModuleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/** Table row skeleton for list-style pages (automod, tickets, logs) */
export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 border-b border-surface-subtleBorder">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-32 flex-1" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-9 rounded-full" />
    </div>
  );
}

/** Giveaway card skeleton */
export function GiveawayCardSkeleton() {
  return (
    <div className="rounded-xl p-5 bg-card border border-surface-border space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-36" />
      <div className="flex items-center gap-4 pt-2 border-t border-surface-subtleBorder">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}
