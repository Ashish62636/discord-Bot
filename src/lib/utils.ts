import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an ISO date string to a short dashboard-friendly time.
 * Returns "HH:MM" for today, "Yesterday" for yesterday, or "MMM DD" otherwise.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Format a number with locale-aware thousands separators */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/**
 * Format a future date as a human-readable countdown.
 * e.g. "2h 45m remaining" or "Ended 2 days ago"
 */
export function formatCountdown(dateStr: string): string {
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return dateStr;

  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    const agoMs = Math.abs(diffMs);
    const agoDays = Math.floor(agoMs / (1000 * 60 * 60 * 24));
    const agoHours = Math.floor(agoMs / (1000 * 60 * 60));
    if (agoDays > 0) return `Ended ${agoDays} day${agoDays > 1 ? "s" : ""} ago`;
    if (agoHours > 0)
      return `Ended ${agoHours} hour${agoHours > 1 ? "s" : ""} ago`;
    return "Just ended";
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainHours = hours % 24;
    return `${days}d ${remainHours}h remaining`;
  }

  return `${hours}h ${minutes}m remaining`;
}
