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
      className="hidden md:flex flex-col items-center py-4 gap-1.5 z-20 w-[68px] min-w-[68px] bg-sidebar border-r border-black/40 shadow-[8px_0_28px_rgba(0,0,0,.16)]"
    >
      {/* Server avatar */}
      <div className="mb-3 flex flex-col items-center gap-1.5">
        <Link
          href="/"
          title="BotHQ - GuildCraft.gg"
          className="w-10 h-10 rounded-[14px] flex items-center justify-center text-sm font-bold bg-gradient-to-br from-brand-amber to-[#1a9fca] text-[#07131b] font-heading transition-all duration-200 hover:rounded-[11px] hover:-translate-y-0.5 shadow-glow"
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
                "relative w-10 h-10 rounded-[13px] flex items-center justify-center transition-all duration-150 group hover:rounded-[11px]",
                isActive
                  ? "bg-brand-amber text-white shadow-glow"
                  : "text-content-secondary hover:text-content-primary hover:bg-surface"
              )}
            >
              {isActive && (
                <span className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r" />
              )}
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              
              {/* Tooltip */}
              <span className="absolute left-[52px] bg-[#0d1426] border border-surface-border text-content-primary text-xs px-2.5 py-1.5 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 font-sans shadow-lg">
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
