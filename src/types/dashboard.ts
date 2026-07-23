export type Screen =
  | "overview"
  | "automod"
  | "embed"
  | "tickets"
  | "logs"
  | "music"
  | "giveaways";

export interface GuildModule {
  id: string;
  name: string;
  desc: string;
  category: "Moderation" | "Support" | "Engagement" | "Entertainment" | "Utility" | "Fun";
  defaultOn: boolean;
}

export interface ActivityLogItem {
  id: string;
  time: string;
  user: string;
  action: string;
  type: "join" | "mod" | "ticket" | "star" | "level";
}

export interface AutoModRule {
  id: number;
  trigger: string;
  threshold: string;
  action: string;
  enabled: boolean;
}

export interface EmbedFormState {
  title: string;
  description: string;
  color: string;
  author: string;
  footer: string;
  imageUrl: string;
  thumbnail: string;
  timestamp: boolean;
  channel: string;
}

export interface TicketItem {
  id: string;
  user: string;
  subject: string;
  status: "open" | "claimed" | "closed";
  created: string;
  claimer?: string;
  priority?: "low" | "medium" | "high";
  messagesCount?: number;
}

export interface ModLogEntry {
  time: string;
  mod: string;
  target: string;
  action: string;
  reason: string;
  severity: "low" | "medium" | "high";
}

export interface ActivityLogEntry {
  time: string;
  user: string;
  event: string;
  channel: string;
}

export interface ConfessionEntry {
  id: string;
  time: string;
  content: string;
  status: "approved" | "pending" | "flagged";
  hash: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail?: string;
  requestedBy: string;
}

export interface GiveawayItem {
  id: string;
  prize: string;
  channel: string;
  winnerCount: number;
  endsAt: string;
  entriesCount: number;
  status: "active" | "ended";
  winners?: string[];
}
