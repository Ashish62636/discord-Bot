"use client";

import React, { useState } from "react";
import { Bell, RefreshCw, Menu, ChevronDown, Check } from "lucide-react";
import { StatusDot } from "@/components/ui/StatusDot";
import { cn } from "@/lib/utils";

interface TopHeaderProps {
  onOpenMobileNav: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileNav }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [guildDropdownOpen, setGuildDropdownOpen] = useState(false);
  const [activeGuild, setActiveGuild] = useState("guildcraft.gg");
  const [notificationCount, setNotificationCount] = useState(2);

  const guilds = [
    { name: "guildcraft.gg", members: "4,218 members", active: true },
    { name: "Dev Lounge", members: "1,850 members", active: false },
    { name: "Cyberpunk Gaming", members: "9,420 members", active: false },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <header className="h-14 border-b border-surface-border bg-background/80 backdrop-blur px-4 md:px-6 flex items-center justify-between z-10 sticky top-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          aria-label="Open mobile menu"
          className="md:hidden p-1.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Guild Selector */}
        <div className="relative">
          <button
            onClick={() => setGuildDropdownOpen(!guildDropdownOpen)}
            className="flex items-center gap-2 text-left group"
          >
            <div>
              <h1 className="text-base font-semibold font-heading text-content-primary leading-tight group-hover:text-brand-amber transition-colors flex items-center gap-1.5">
                BotHQ
                <ChevronDown size={14} className="text-content-secondary group-hover:text-brand-amber transition-transform duration-200" />
              </h1>
              <p className="text-[11px] text-content-secondary font-sans leading-tight">
                {activeGuild} · 4,218 members
              </p>
            </div>
          </button>

          {/* Guild Dropdown */}
          {guildDropdownOpen && (
            <div className="absolute top-12 left-0 w-56 rounded-xl bg-card border border-surface-border p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] uppercase font-mono text-content-tertiary px-2 py-1 tracking-wider">
                Select Server
              </div>
              {guilds.map((g) => (
                <button
                  key={g.name}
                  onClick={() => {
                    setActiveGuild(g.name);
                    setGuildDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans transition-colors",
                    g.name === activeGuild
                      ? "bg-brand-amber/15 text-brand-amber font-medium"
                      : "text-content-secondary hover:text-content-primary hover:bg-surface"
                  )}
                >
                  <div>
                    <div className="font-medium text-left">{g.name}</div>
                    <div className="text-[10px] text-content-tertiary">{g.members}</div>
                  </div>
                  {g.name === activeGuild && <Check size={14} className="text-brand-amber" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setNotificationCount(0)}
          className="relative w-8 h-8 rounded-lg flex items-center justify-center text-content-secondary hover:text-content-primary hover:bg-surface transition-colors"
        >
          <Bell size={16} />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-amber ring-2 ring-background animate-pulse" />
          )}
        </button>

        <button
          type="button"
          aria-label="Refresh status"
          onClick={handleRefresh}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-content-secondary hover:text-content-primary hover:bg-surface transition-colors"
        >
          <RefreshCw size={16} className={cn("transition-transform duration-700", isRefreshing && "animate-spin")} />
        </button>

        {/* Status Pill */}
        <div className="text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 bg-brand-amber/10 border border-brand-amber/20 text-brand-amber font-mono">
          <StatusDot on={true} />
          <span>online</span>
        </div>
      </div>
    </header>
  );
};
