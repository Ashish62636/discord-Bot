"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  color: string;
  sub?: string;
  sparkData?: Array<{ v: number }>;
}

const DEFAULT_SPARK_DATA = [
  { v: 42 }, { v: 58 }, { v: 51 }, { v: 67 }, { v: 73 }, { v: 65 }, { v: 80 }
];

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  delta,
  positive,
  color,
  sub,
  sparkData = DEFAULT_SPARK_DATA,
}) => {
  const gradientId = `sparkline-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="rounded-xl p-4 bg-card border border-surface-border flex flex-col gap-3 hover:border-surface-border/60 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider font-sans text-content-secondary font-medium">
          {label}
        </span>
        <div className="w-16 h-7">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={1.5}
                fill={`url(#${gradientId})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="text-2xl font-semibold font-mono text-content-primary tracking-tight">
          {value}
        </div>
        {sub && (
          <div className="text-[11px] font-mono text-content-secondary mt-0.5">
            {sub}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 pt-1 border-t border-surface-subtleBorder">
        {positive ? (
          <TrendingUp size={13} className="text-brand-teal" />
        ) : (
          <TrendingDown size={13} className="text-brand-red" />
        )}
        <span
          className={cn(
            "text-[11px] font-mono font-medium",
            positive ? "text-brand-teal" : "text-brand-red"
          )}
        >
          {delta}
        </span>
        <span className="text-[11px] text-content-tertiary font-sans">
          vs last 7d
        </span>
      </div>
    </div>
  );
};
