"use client";

import React from "react";
import { Users, Shield, Ticket, Star, Zap, Activity } from "lucide-react";
import { ActivityLogItem } from "@/types/dashboard";

export interface ActivityFeedProps {
  activities: ActivityLogItem[];
}

function getActivityIcon(type: ActivityLogItem["type"]) {
  switch (type) {
    case "join":
      return <Users size={14} className="text-brand-teal" />;
    case "mod":
      return <Shield size={14} className="text-brand-red" />;
    case "ticket":
      return <Ticket size={14} className="text-brand-amber" />;
    case "star":
      return <Star size={14} className="text-brand-yellow" />;
    case "level":
      return <Zap size={14} className="text-brand-purple" />;
    default:
      return <Activity size={14} className="text-content-secondary" />;
  }
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="rounded-xl overflow-hidden bg-card border border-surface-border">
      <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between bg-card-subtle">
        <h2 className="text-xs uppercase tracking-widest font-heading font-semibold text-content-secondary">
          Recent Activity
        </h2>
        <span className="text-[10px] font-mono text-brand-teal flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
          Live Stream
        </span>
      </div>

      <div className="divide-y divide-surface-subtleBorder">
        {activities.map((item) => (
          <div
            key={item.id}
            className="px-4 py-3 flex items-start gap-3 transition-colors hover:bg-surface"
          >
            <div className="mt-0.5 flex-shrink-0 p-1 rounded-md bg-surface">
              {getActivityIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-content-primary font-sans leading-snug">
                <span className="text-content-secondary">@</span>
                <span className="font-semibold">{item.user}</span>{" "}
                <span className="text-content-secondary">{item.action}</span>
              </p>
              <span className="text-[10px] font-mono text-content-tertiary block mt-0.5">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
