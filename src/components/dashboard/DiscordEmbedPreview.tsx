"use client";

import React from "react";
import { EmbedFormState } from "@/types/dashboard";

export interface DiscordEmbedPreviewProps {
  embed: EmbedFormState;
}

export const DiscordEmbedPreview: React.FC<DiscordEmbedPreviewProps> = ({ embed }) => {
  return (
    <div className="w-full max-w-md rounded-xl overflow-hidden bg-[#313338] border border-black/40 text-white shadow-[0_18px_45px_rgba(0,0,0,.3)] font-sans">
      {/* Discord Header Chrome */}
      <div className="px-4 py-2.5 bg-[#1e1f22] border-b border-black/30 flex items-center justify-between text-xs text-[#b5bac1] font-mono">
        <span># {embed.channel || "announcements"}</span>
        <span className="text-[10px] bg-[#202225] px-1.5 py-0.5 rounded">Preview</span>
      </div>

      {/* Message Content */}
      <div className="p-4 space-y-3">
        {/* Author / Bot Profile Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7983f5] to-brand-amber font-heading font-bold text-white flex items-center justify-center text-sm shadow-sm flex-shrink-0">
            B
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white leading-none">
              {embed.author || "BotHQ"}
            </span>
            <span className="text-[10px] bg-[#5865F2] text-white px-1 rounded font-mono font-medium leading-normal">
              BOT
            </span>
            <span className="text-[11px] text-[#72767D] font-mono">
              Today at 2:34 PM
            </span>
          </div>
        </div>

        {/* The Embed Body */}
        <div
          className="rounded bg-[#2b2d31] p-3 text-sm space-y-2 border-l-4 transition-all duration-300"
          style={{ borderColor: embed.color || "#F2A93B" }}
        >
          {embed.author && (
            <div className="text-xs text-[#B9BBBE] font-medium">
              {embed.author}
            </div>
          )}

          {embed.title && (
            <h4 className="text-base font-semibold text-white leading-snug">
              {embed.title}
            </h4>
          )}

          {embed.description && (
            <p className="text-sm text-[#DCDDDE] leading-relaxed whitespace-pre-wrap">
              {embed.description}
            </p>
          )}

          {/* Embed Footer */}
          {(embed.footer || embed.timestamp) && (
            <div className="pt-2 border-t border-[#40444B] flex items-center gap-1.5 text-[11px] text-[#72767D]">
              {embed.footer && <span>{embed.footer}</span>}
              {embed.footer && embed.timestamp && <span>·</span>}
              {embed.timestamp && <span>Today at 2:34 PM</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
