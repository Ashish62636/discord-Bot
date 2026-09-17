"use client";

import React from "react";
import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";

interface Props {
  /** Error message to display */
  message: string;
  /** Optional retry callback — shows a "Retry" button when provided */
  onRetry?: () => void;
  /** When true, uses a softer "offline / fallback" style instead of error red */
  isFallback?: boolean;
}

/**
 * Non-blocking error / fallback banner.
 *
 * Two visual modes:
 *  - **Error** (default) — red-tinted, shows AlertTriangle icon.
 *  - **Fallback** (`isFallback`) — amber-tinted, shows WifiOff icon.
 *    Used when mock data is being shown because the API is unreachable.
 */
export function ErrorBanner({ message, onRetry, isFallback = false }: Props) {
  const Icon = isFallback ? WifiOff : AlertTriangle;
  const accentColor = isFallback ? "brand-amber" : "brand-red";

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm border ${
        isFallback
          ? "bg-brand-amber/5 border-brand-amber/15"
          : "bg-brand-red/5 border-brand-red/15"
      }`}
    >
      <Icon size={16} className={`text-${accentColor} shrink-0`} />
      <span className="text-content-secondary flex-1 font-sans text-xs">
        {message}
      </span>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className={`flex items-center gap-1.5 text-xs font-heading font-medium text-${accentColor} hover:opacity-80 transition-opacity`}
        >
          <RefreshCw size={14} />
          Retry
        </button>
      )}
    </div>
  );
}
