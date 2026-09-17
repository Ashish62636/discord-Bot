import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

/**
 * Animated loading placeholder.
 * Matches the dark card palette — pulses between `bg-surface` shades.
 *
 * Usage:
 *   <Skeleton className="h-6 w-32" />           — inline text
 *   <Skeleton className="h-24 w-full" />         — card block
 *   <Skeleton className="h-9 w-9 rounded-full" /> — avatar
 */
export function Skeleton({ className }: Props) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-surface-muted/60",
        className
      )}
    />
  );
}
