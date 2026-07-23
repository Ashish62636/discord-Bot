import {
  GuildModule,
  ActivityLogItem,
  AutoModRule,
  TicketItem,
  ModLogEntry,
  ActivityLogEntry,
  ConfessionEntry,
  MusicTrack,
  GiveawayItem,
} from "@/types/dashboard";

export const MOCK_MODULES: GuildModule[] = [
  { id: "automod", name: "Auto-Mod", desc: "Spam, caps, link filters", category: "Moderation", defaultOn: true },
  { id: "logging", name: "Audit Log", desc: "Full event logging", category: "Moderation", defaultOn: true },
  { id: "tickets", name: "Tickets", desc: "Support ticket system", category: "Support", defaultOn: true },
  { id: "giveaways", name: "Giveaways", desc: "Reaction-based giveaways", category: "Engagement", defaultOn: true },
  { id: "music", name: "Music", desc: "Voice channel playback", category: "Entertainment", defaultOn: true },
  { id: "welcomer", name: "Welcomer", desc: "Join / leave messages", category: "Utility", defaultOn: true },
  { id: "levels", name: "Levels", desc: "XP & role rewards", category: "Engagement", defaultOn: true },
  { id: "reminders", name: "Reminders", desc: "Scheduled DM reminders", category: "Utility", defaultOn: false },
  { id: "starboard", name: "Starboard", desc: "Pin starred messages", category: "Fun", defaultOn: false },
  { id: "polls", name: "Polls", desc: "Reaction polls + analytics", category: "Utility", defaultOn: true },
  { id: "reactionroles", name: "Reaction Roles", desc: "Self-assignable roles", category: "Moderation", defaultOn: true },
  { id: "confession", name: "Confessions", desc: "Anonymous confession box", category: "Fun", defaultOn: false },
];

export const MOCK_ACTIVITIES: ActivityLogItem[] = [
  { id: "act-1", time: "14:32:08", user: "quietmapper", action: "joined the server", type: "join" },
  { id: "act-2", time: "14:28:51", user: "automod", action: "deleted message · caps violation", type: "mod" },
  { id: "act-3", time: "14:22:17", user: "vectorfish", action: "opened ticket #0194", type: "ticket" },
  { id: "act-4", time: "14:19:03", user: "zephyrine", action: "reacted ⭐ to pin in #general", type: "star" },
  { id: "act-5", time: "14:11:44", user: "automod", action: "warned @grumpytroll · spam (×4)", type: "mod" },
  { id: "act-6", time: "14:07:22", user: "radiantpeak", action: "claimed ticket #0193", type: "ticket" },
  { id: "act-7", time: "13:59:10", user: "quietmapper", action: "reached level 12", type: "level" },
  { id: "act-8", time: "13:47:55", user: "automod", action: "muted @linkspammer · link filter", type: "mod" },
];

export const MOCK_AUTOMOD_RULES: AutoModRule[] = [
  { id: 1, trigger: "Spam", threshold: "5 msgs / 5s", action: "Mute (1h)", enabled: true },
  { id: 2, trigger: "Caps", threshold: "> 70% uppercase", action: "Delete", enabled: true },
  { id: 3, trigger: "Links", threshold: "Unverified domains", action: "Delete", enabled: true },
  { id: 4, trigger: "Mentions", threshold: "> 5 mentions", action: "Warn", enabled: true },
  { id: 5, trigger: "Profanity", threshold: "Strict wordlist match", action: "Warn", enabled: false },
  { id: 6, trigger: "Repeated Chars", threshold: "> 10 duplicate chars", action: "Delete", enabled: true },
];

export const MOCK_TICKETS: TicketItem[] = [
  { id: "0194", user: "vectorfish", subject: "Can't access #premium-chat", status: "open", created: "14:22", priority: "high", messagesCount: 3 },
  { id: "0193", user: "morningglory", subject: "Bot gave wrong role after purchase", status: "claimed", created: "13:55", claimer: "radiantpeak", priority: "medium", messagesCount: 8 },
  { id: "0192", user: "blinkraker", subject: "Muted by mistake, appeal request", status: "claimed", created: "11:30", claimer: "zephyrine", priority: "medium", messagesCount: 12 },
  { id: "0191", user: "dusthaven", subject: "Custom role color not applying", status: "closed", created: "09:14", claimer: "radiantpeak", priority: "low", messagesCount: 5 },
  { id: "0190", user: "pixelwarden", subject: "Missing booster perks", status: "closed", created: "Yesterday", claimer: "zephyrine", priority: "low", messagesCount: 6 },
  { id: "0189", user: "greymount", subject: "Bot offline report in Voice VC", status: "closed", created: "Yesterday", claimer: "radiantpeak", priority: "low", messagesCount: 4 },
];

export const MOCK_MOD_LOGS: ModLogEntry[] = [
  { time: "14:28:51", mod: "automod", target: "grumpytroll", action: "Message deleted", reason: "Caps filter (92%)", severity: "low" },
  { time: "14:11:44", mod: "automod", target: "grumpytroll", action: "Warned", reason: "Spam × 4 in 8s", severity: "medium" },
  { time: "13:47:55", mod: "automod", target: "linkspammer", action: "Muted 1h", reason: "Link filter match (discord-gift-scam.xyz)", severity: "medium" },
  { time: "11:02:19", mod: "zephyrine", target: "raidbot44", action: "Banned", reason: "Raid attempt & bot token spam", severity: "high" },
  { time: "10:33:07", mod: "radiantpeak", target: "scammer_2", action: "Kicked", reason: "Unsolicited DM advertising", severity: "medium" },
  { time: "09:18:44", mod: "automod", target: "capslock_user", action: "Message deleted", reason: "Caps filter (88%)", severity: "low" },
];

export const MOCK_ACTIVITY_LOGS: ActivityLogEntry[] = [
  { time: "14:32:08", user: "quietmapper", event: "Member joined", channel: "—" },
  { time: "14:22:17", user: "vectorfish", event: "Ticket opened #0194", channel: "#support" },
  { time: "13:59:10", user: "quietmapper", event: "Level up → 12", channel: "#general" },
  { time: "13:41:02", user: "sunshinepal", event: "Role assigned: Server Booster", channel: "—" },
  { time: "12:55:30", user: "morningglory", event: "Reaction role claimed: @Artist", channel: "#roles" },
  { time: "11:15:00", user: "blinkraker", event: "Member left", channel: "—" },
];

export const MOCK_CONFESSION_LOGS: ConfessionEntry[] = [
  { id: "CF-8041", time: "14:05:12", content: "I secretly love playing 8-bit chiptune games during staff meetings...", status: "approved", hash: "a9f8...33b1" },
  { id: "CF-8040", time: "12:30:45", content: "Honestly the new auto-mod filters saved this server from chaos yesterday.", status: "approved", hash: "b2e4...90c2" },
  { id: "CF-8039", time: "09:15:20", content: "[Flagged content removed by safety filter]", status: "flagged", hash: "ff77...11a0" },
];

export const MOCK_PLAYLIST: MusicTrack[] = [
  { id: "m1", title: "Cyberpunk Synthwave Odyssey", artist: "Lazerhawk", duration: "3:45", requestedBy: "vectorfish" },
  { id: "m2", title: "Midnight Lo-Fi Beats", artist: "ChilledCow", duration: "2:50", requestedBy: "quietmapper" },
  { id: "m3", title: "Neon City Drive", artist: "Kavinsky", duration: "4:12", requestedBy: "radiantpeak" },
  { id: "m4", title: "Starfield Horizon", artist: "Solar Fields", duration: "5:04", requestedBy: "zephyrine" },
];

export const MOCK_GIVEAWAYS: GiveawayItem[] = [
  { id: "gw-101", prize: "Discord Nitro (1 Year) + Custom Role", channel: "#giveaways", winnerCount: 1, endsAt: "2h 45m remaining", entriesCount: 142, status: "active" },
  { id: "gw-102", prize: "Steam Gift Card $50", channel: "#giveaways", winnerCount: 2, endsAt: "1d 12h remaining", entriesCount: 289, status: "active" },
  { id: "gw-100", prize: "Cyberpunk 2077 Game Code", channel: "#giveaways", winnerCount: 1, endsAt: "Ended 2 days ago", entriesCount: 412, status: "ended", winners: ["@vectorfish"] },
  { id: "gw-099", prize: "VIP Booster Perks (1 Month)", channel: "#giveaways", winnerCount: 5, endsAt: "Ended 5 days ago", entriesCount: 198, status: "ended", winners: ["@sunshinepal", "@morningglory", "@dusthaven", "@pixelwarden", "@quietmapper"] },
];
