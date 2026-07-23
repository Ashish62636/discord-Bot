import { z } from "zod";

// ─── Guild Config Settings (JSONB) ────────────────────────────────────────────
// Validated at runtime when reading/writing the GuildConfig.settings column.

export const moduleTogglesSchema = z.object({
  automod: z.boolean().default(true),
  logging: z.boolean().default(true),
  tickets: z.boolean().default(true),
  giveaways: z.boolean().default(false),
  music: z.boolean().default(false),
  welcomer: z.boolean().default(true),
  levels: z.boolean().default(true),
  reminders: z.boolean().default(false),
  starboard: z.boolean().default(false),
  polls: z.boolean().default(true),
  reactionRoles: z.boolean().default(true),
  confessions: z.boolean().default(false),
});

export const welcomeSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  message: z.string().max(2000).default("Welcome to the server, {user}!"),
  dmOnJoin: z.boolean().default(false),
  assignRoleId: z.string().optional(),
});

export const farewellSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  message: z.string().max(2000).default("Goodbye, {user}. We'll miss you!"),
});

export const levelSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  xpPerMessage: z.number().int().min(1).max(100).default(15),
  xpCooldownSeconds: z.number().int().min(0).max(300).default(60),
  announceChannel: z.string().optional(),
  roleRewards: z
    .array(
      z.object({
        level: z.number().int().min(1),
        roleId: z.string(),
      })
    )
    .default([]),
});

export const guildSettingsSchema = z.object({
  modules: moduleTogglesSchema.default(() => moduleTogglesSchema.parse({})),
  welcome: welcomeSettingsSchema.default(() => welcomeSettingsSchema.parse({})),
  farewell: farewellSettingsSchema.default(() => farewellSettingsSchema.parse({})),
  levels: levelSettingsSchema.default(() => levelSettingsSchema.parse({})),
});

export type GuildSettings = z.infer<typeof guildSettingsSchema>;
export type ModuleToggles = z.infer<typeof moduleTogglesSchema>;

// ─── Auto-Mod Rule Schemas ────────────────────────────────────────────────────

export const autoModTriggers = [
  "Spam",
  "Caps",
  "Links",
  "Mentions",
  "Profanity",
  "Repeated Chars",
] as const;

export const autoModActions = [
  "Warn",
  "Delete",
  "Mute (1h)",
  "Mute (24h)",
  "Kick",
  "Ban",
] as const;

export const createAutoModRuleSchema = z.object({
  guildId: z.string().min(1),
  trigger: z.enum(autoModTriggers),
  threshold: z.string().min(1).max(100),
  action: z.enum(autoModActions),
  enabled: z.boolean().default(true),
});

export const updateAutoModRuleSchema = z.object({
  trigger: z.enum(autoModTriggers).optional(),
  threshold: z.string().min(1).max(100).optional(),
  action: z.enum(autoModActions).optional(),
  enabled: z.boolean().optional(),
});

// ─── Ticket Schemas ───────────────────────────────────────────────────────────

export const createTicketSchema = z.object({
  guildId: z.string().min(1),
  openerId: z.string().min(1),
  subject: z.string().min(1).max(256),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const updateTicketSchema = z.object({
  status: z.enum(["open", "claimed", "closed"]).optional(),
  claimedBy: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

// ─── Giveaway Schemas ─────────────────────────────────────────────────────────

export const createGiveawaySchema = z.object({
  guildId: z.string().min(1),
  prize: z.string().min(1).max(256),
  channelId: z.string().optional(),
  winnerCount: z.number().int().min(1).max(25).default(1),
  endsAt: z.coerce.date(),
});

// ─── Embed Builder Schema ─────────────────────────────────────────────────────

export const embedPayloadSchema = z.object({
  title: z.string().max(256).optional(),
  description: z.string().max(4096).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  author: z.string().max(256).optional(),
  footer: z.string().max(2048).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  thumbnail: z.string().url().optional().or(z.literal("")),
  timestamp: z.boolean().default(false),
  channel: z.string().min(1),
});

// ─── Guild Config Update Schema ───────────────────────────────────────────────

export const updateGuildConfigSchema = z.object({
  logChannelId: z.string().optional(),
  modLogChannelId: z.string().optional(),
  welcomeChannelId: z.string().optional(),
  ticketCategoryId: z.string().optional(),
  starboardChannelId: z.string().optional(),
  confessionChannelId: z.string().optional(),
  musicChannelId: z.string().optional(),
  giveawayChannelId: z.string().optional(),
  prefix: z.string().min(1).max(5).optional(),
  settings: guildSettingsSchema.partial().optional(),
});
