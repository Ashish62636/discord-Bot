"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Code2, Sparkles } from "lucide-react";
import { Toggle } from "@/components/ui/Toggle";
import { DiscordEmbedPreview } from "@/components/dashboard/DiscordEmbedPreview";
import { EmbedFormState } from "@/types/dashboard";

export default function EmbedBuilderPage() {
  const [form, setForm] = useState<EmbedFormState>({
    title: "Server Announcement & Update Notes",
    description:
      "Welcome to the weekly guild update! Check the pinned channels for full notes. React with ✅ to confirm you have read this announcement.",
    color: "#F2A93B",
    author: "BotHQ Administrator",
    footer: "GuildCraft · guildcraft.gg",
    imageUrl: "",
    thumbnail: "",
    timestamp: true,
    channel: "announcements",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const update = (k: keyof EmbedFormState, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleSend = () => {
    setToastMessage(`Embed successfully published to #${form.channel}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-card border border-brand-teal/30 text-brand-teal px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 font-mono text-xs animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="border-b border-surface-border pb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-content-primary flex items-center gap-2">
          <Code2 className="text-brand-amber" size={24} />
          Rich Embed Builder
        </h1>
        <p className="text-xs sm:text-sm text-content-secondary mt-1 font-sans">
          Construct custom Discord rich embeds with real-time visual rendering and publish directly to server channels.
        </p>
      </div>

      {/* Main Builder Layout: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls Column (7 cols) */}
        <div className="lg:col-span-7 bg-card border border-surface-border rounded-xl p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h2 className="text-sm font-semibold font-heading text-content-primary flex items-center gap-1.5">
              <Sparkles size={16} className="text-brand-amber" />
              Embed Parameters
            </h2>
            <span className="text-[11px] font-mono text-content-tertiary">
              WYSIWYG Mode
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            {/* Title */}
            <div>
              <label className="block text-content-secondary font-heading mb-1.5 uppercase tracking-wider">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-content-primary outline-none focus:border-brand-amber transition-colors"
              />
            </div>

            {/* Author & Target Channel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-content-secondary font-heading mb-1.5 uppercase tracking-wider">
                  Author Name
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => update("author", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-content-primary outline-none focus:border-brand-amber transition-colors"
                />
              </div>
              <div>
                <label className="block text-content-secondary font-heading mb-1.5 uppercase tracking-wider">
                  Target Channel
                </label>
                <select
                  value={form.channel}
                  onChange={(e) => update("channel", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-content-primary outline-none focus:border-brand-amber font-mono transition-colors"
                >
                  <option value="announcements"># announcements</option>
                  <option value="general"># general</option>
                  <option value="updates"># updates</option>
                  <option value="events"># events</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-content-secondary font-heading mb-1.5 uppercase tracking-wider">
                Description Body
              </label>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-content-primary outline-none focus:border-brand-amber transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Footer */}
            <div>
              <label className="block text-content-secondary font-heading mb-1.5 uppercase tracking-wider">
                Footer Text
              </label>
              <input
                type="text"
                value={form.footer}
                onChange={(e) => update("footer", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-content-primary outline-none focus:border-brand-amber transition-colors"
              />
            </div>

            {/* Accent Color & Timestamp Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2 border-t border-surface-subtleBorder">
              <div>
                <label className="block text-content-secondary font-heading mb-1.5 uppercase tracking-wider">
                  Border Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => update("color", e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => update("color", e.target.value)}
                    className="w-28 px-2.5 py-1.5 rounded-lg bg-surface border border-surface-border text-content-primary font-mono outline-none uppercase"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-0">
                <span className="text-content-secondary font-heading uppercase tracking-wider">
                  Append Timestamp
                </span>
                <Toggle
                  on={form.timestamp}
                  onToggle={() => update("timestamp", !form.timestamp)}
                  ariaLabel="Toggle embed timestamp"
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-4">
              <button
                onClick={handleSend}
                className="w-full py-3 rounded-xl bg-brand-amber text-background font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-98 shadow-glow"
              >
                <Send size={16} />
                <span>Publish Embed to #{form.channel}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center gap-3 sticky top-20">
          <div className="w-full flex items-center justify-between text-xs font-mono text-content-secondary">
            <span className="uppercase tracking-widest font-heading font-semibold">Live Discord Canvas</span>
            <span className="text-brand-amber">Rendering in real-time</span>
          </div>

          <DiscordEmbedPreview embed={form} />
        </div>
      </div>
    </div>
  );
}
