"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shield,
  Code2,
  Ticket,
  ScrollText,
  Music2,
  Gift,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Overview" },
  { href: "/automod", icon: Shield, label: "Auto-Mod" },
  { href: "/embed", icon: Code2, label: "Embed Builder" },
  { href: "/tickets", icon: Ticket, label: "Tickets" },
  { href: "/logs", icon: ScrollText, label: "Logs" },
  { href: "/music", icon: Music2, label: "Music Player" },
  { href: "/giveaways", icon: Gift, label: "Giveaways" },
];

export const NavigationRail: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col items-center py-4 gap-1.5 z-20 w-[52px] min-w-[52px] bg-sidebar border-r border-surface-border"
    >
      {/* Server avatar */}
      <div className="mb-3 flex flex-col items-center gap-1.5">
        <Link
          href="/"
          title="BotHQ - GuildCraft.gg"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold bg-gradient-to-br from-brand-amber to-amber-600 text-background font-heading transition-all duration-200 hover:rounded-lg shadow-glow"
        >
          B
        </Link>
        <div className="w-5 h-px bg-surface-border" />
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 w-full items-center">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                "relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 group",
                isActive
                  ? "bg-brand-amber/15 text-brand-amber"
                  : "text-content-secondary hover:text-content-primary hover:bg-surface"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-brand-amber rounded-r shadow-[0_0_6px_#F2A93B]" />
              )}
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              
              {/* Tooltip */}
              <span className="absolute left-12 bg-card border border-surface-border text-content-primary text-xs px-2.5 py-1 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 font-sans shadow-lg">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="mt-auto">
        <button
          type="button"
          title="Settings"
          aria-label="Bot Settings"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-content-secondary hover:text-content-primary hover:bg-surface transition-colors"
        >
          <Settings size={18} strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
};
