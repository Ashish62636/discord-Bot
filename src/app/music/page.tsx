"use client";

import React, { useState } from "react";
import {
  Music2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  ListMusic,
  Radio,
  CheckCircle2,
  Repeat,
} from "lucide-react";
import { MOCK_PLAYLIST } from "@/lib/mock-data";
import { MusicTrack } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export default function MusicPlayerPage() {
  const [playlist, setPlaylist] = useState<MusicTrack[]>(MOCK_PLAYLIST);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(45); // percentage
  const [newTrackInput, setNewTrackInput] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentTrack = playlist[currentIndex] || playlist[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipNext = () => {
    if (playlist.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
    setProgress(0);
    showToast("Skipped to next track");
  };

  const handleSkipPrev = () => {
    if (playlist.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setProgress(0);
  };

  const handleRemoveTrack = (id: string) => {
    setPlaylist((pl) => pl.filter((t) => t.id !== id));
    showToast("Track removed from queue");
  };

  const handleAddTrack = () => {
    if (!newTrackInput.trim()) return;
    const newTrack: MusicTrack = {
      id: `m-${Date.now()}`,
      title: newTrackInput.trim(),
      artist: "YouTube / SoundCloud Stream",
      duration: "3:30",
      requestedBy: "radiantpeak",
    };
    setPlaylist([...playlist, newTrack]);
    setNewTrackInput("");
    showToast("Added track to queue!");
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-content-primary flex items-center gap-2">
            <Music2 className="text-brand-amber" size={24} />
            Lavalink Voice Audio Player
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1 font-sans">
            High-performance voice channel playback powered by Lavalink v4 engine.
          </p>
        </div>

        {/* Node Health Badge */}
        <div className="flex items-center gap-2 bg-card p-2 rounded-xl border border-surface-border">
          <Radio size={16} className="text-brand-teal animate-pulse" />
          <div className="text-xs font-mono">
            <span className="text-content-secondary">Lavalink Node #1: </span>
            <span className="text-brand-teal font-bold">12ms · 44.1kHz</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Player Controller + Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Now Playing Audio Controller (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-surface-border rounded-xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs font-mono text-content-tertiary">
            <span className="uppercase tracking-widest font-heading font-semibold text-content-secondary">
              Now Playing in #general-voice
            </span>
            <span className="text-brand-amber font-semibold">
              {isPlaying ? "PLAYING" : "PAUSED"}
            </span>
          </div>

          {/* Album Artwork & Track Info */}
          <div className="text-center space-y-4">
            <div className="w-36 h-36 mx-auto rounded-2xl bg-gradient-to-br from-brand-amber/30 via-brand-purple/20 to-brand-teal/20 border border-brand-amber/30 flex items-center justify-center shadow-glow">
              <Music2 size={48} className="text-brand-amber animate-pulse" />
            </div>

            <div>
              <h2 className="text-lg font-bold font-heading text-content-primary line-clamp-1">
                {currentTrack?.title || "No track playing"}
              </h2>
              <p className="text-xs text-content-secondary font-sans mt-0.5">
                {currentTrack?.artist}
              </p>
              <div className="mt-1 text-[11px] font-mono text-brand-teal">
                Requested by @{currentTrack?.requestedBy}
              </div>
            </div>
          </div>

          {/* Seek Bar Progress Slider */}
          <div className="space-y-1.5">
            <div className="relative w-full h-2 rounded-full bg-surface overflow-hidden cursor-pointer">
              <div
                className="h-full bg-gradient-to-r from-brand-amber to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-content-tertiary">
              <span>1:42</span>
              <span>{currentTrack?.duration || "0:00"}</span>
            </div>
          </div>

          {/* Player Buttons Control Bar */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleSkipPrev}
              className="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface transition-colors"
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={handlePlayPause}
              className="w-12 h-12 rounded-full bg-brand-amber text-background flex items-center justify-center shadow-glow transition-all hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
            </button>

            <button
              onClick={handleSkipNext}
              className="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface transition-colors"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Volume Control Slider */}
          <div className="flex items-center gap-3 pt-2 border-t border-surface-subtleBorder">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-content-secondary hover:text-content-primary transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                setIsMuted(false);
              }}
              className="flex-1 accent-brand-amber h-1.5 rounded-lg bg-surface cursor-pointer"
            />
            <span className="text-xs font-mono text-content-secondary w-8 text-right">
              {isMuted ? 0 : volume}%
            </span>
          </div>
        </div>

        {/* Right Column: Queue Manager (7 cols) */}
        <div className="lg:col-span-7 bg-card border border-surface-border rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h2 className="text-sm font-semibold font-heading text-content-primary flex items-center gap-2">
              <ListMusic size={18} className="text-brand-amber" />
              Playback Queue ({playlist.length} tracks)
            </h2>
            <span className="text-[11px] font-mono text-content-tertiary">
              Drag or Remove Tracks
            </span>
          </div>

          {/* Add Song Form */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Paste YouTube / Spotify URL or search keywords..."
              value={newTrackInput}
              onChange={(e) => setNewTrackInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTrack()}
              className="flex-1 px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-content-primary outline-none focus:border-brand-amber font-sans"
            />
            <button
              onClick={handleAddTrack}
              className="px-4 py-2 rounded-lg bg-brand-amber text-background font-heading font-semibold text-xs flex items-center gap-1 hover:brightness-110"
            >
              <Plus size={14} />
              Add
            </button>
          </div>

          {/* Queue List */}
          <div className="divide-y divide-surface-subtleBorder max-h-[360px] overflow-y-auto pr-1">
            {playlist.map((track, i) => {
              const isCurrent = i === currentIndex;
              return (
                <div
                  key={track.id}
                  className={cn(
                    "p-3 rounded-lg flex items-center justify-between gap-3 transition-colors",
                    isCurrent ? "bg-brand-amber/15 border border-brand-amber/20" : "hover:bg-surface"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-content-tertiary w-5 text-center font-bold">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div
                        className={cn(
                          "text-xs font-heading font-semibold truncate",
                          isCurrent ? "text-brand-amber" : "text-content-primary"
                        )}
                      >
                        {track.title}
                      </div>
                      <div className="text-[10px] text-content-secondary font-sans truncate">
                        {track.artist} · Requested by @{track.requestedBy}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-mono text-xs text-content-secondary">
                      {track.duration}
                    </span>
                    {!isCurrent && (
                      <button
                        onClick={() => handleRemoveTrack(track.id)}
                        className="p-1 rounded text-content-tertiary hover:text-brand-red transition-colors"
                        title="Remove track"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
