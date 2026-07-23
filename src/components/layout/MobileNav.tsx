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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Overview" },
  { href: "/automod", icon: Shield, label: "Auto-Mod" },
  { href: "/embed", icon: Code2, label: "Embed Builder" },
  { href: "/tickets", icon: Ticket, label: "Tickets" },
  { href: "/logs", icon: ScrollText, label: "Logs" },
  { href: "/music", icon: Music2, label: "Music Player" },
  { href: "/giveaways", icon: Gift, label: "Giveaways" },
];

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Drawer */}
      <div className="relative w-64 max-w-[80vw] bg-sidebar border-r border-surface-border p-4 flex flex-col gap-4 z-10 animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-amber to-amber-600 text-background font-heading font-bold flex items-center justify-center text-xs">
              B
            </div>
            <span className="font-heading font-semibold text-content-primary">
              BotHQ Navigation
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-colors",
                  isActive
                    ? "bg-brand-amber/15 text-brand-amber font-medium border border-brand-amber/20"
                    : "text-content-secondary hover:text-content-primary hover:bg-surface"
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
