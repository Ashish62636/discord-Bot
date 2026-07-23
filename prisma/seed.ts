import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── Create Demo Guild ────────────────────────────────────────────────
  const guild = await prisma.guild.upsert({
    where: { id: "1234567890" },
    update: {},
    create: {
      id: "1234567890",
      name: "GuildCraft",
      ownerId: "9876543210",
      premium: true,
    },
  });
  console.log(`✓ Guild: ${guild.name} (${guild.id})`);

  // ─── Guild Config ─────────────────────────────────────────────────────
  const config = await prisma.guildConfig.upsert({
    where: { guildId: guild.id },
    update: {},
    create: {
      guildId: guild.id,
      logChannelId: "1111111111",
      modLogChannelId: "2222222222",
      welcomeChannelId: "3333333333",
      ticketCategoryId: "4444444444",
      starboardChannelId: "5555555555",
      giveawayChannelId: "6666666666",
      settings: {
        modules: {
          automod: true,
          logging: true,
          tickets: true,
          giveaways: true,
          music: true,
          welcomer: true,
          levels: true,
          reminders: false,
          starboard: false,
          polls: true,
          reactionRoles: true,
          confessions: false,
        },
        welcome: {
          enabled: true,
          message: "Welcome to GuildCraft, {user}! 🎉",
          dmOnJoin: false,
        },
        levels: {
          enabled: true,
          xpPerMessage: 15,
          xpCooldownSeconds: 60,
          roleRewards: [
            { level: 5, roleId: "role_level5" },
            { level: 10, roleId: "role_level10" },
            { level: 25, roleId: "role_level25" },
          ],
        },
      },
    },
  });
  console.log(`✓ GuildConfig: version ${config.version}`);

  // ─── Guild Members ────────────────────────────────────────────────────
  const members = [
    { userId: "user_vectorfish", xp: 1200, level: 8 },
    { userId: "user_quietmapper", xp: 2800, level: 12 },
    { userId: "user_radiantpeak", xp: 950, level: 7 },
    { userId: "user_zephyrine", xp: 3400, level: 15 },
    { userId: "user_morningglory", xp: 600, level: 4 },
    { userId: "user_blinkraker", xp: 450, level: 3 },
    { userId: "user_dusthaven", xp: 1800, level: 10 },
    { userId: "user_pixelwarden", xp: 2100, level: 11 },
  ];

  for (const m of members) {
    await prisma.guildMember.upsert({
      where: { guildId_userId: { guildId: guild.id, userId: m.userId } },
      update: {},
      create: { guildId: guild.id, ...m },
    });
  }
  console.log(`✓ GuildMembers: ${members.length} seeded`);

  // ─── Auto-Mod Rules ───────────────────────────────────────────────────
  const autoModRules = [
    { trigger: "Spam", threshold: "5 msgs / 5s", action: "Mute (1h)", enabled: true },
    { trigger: "Caps", threshold: "> 70% uppercase", action: "Delete", enabled: true },
    { trigger: "Links", threshold: "Unverified domains", action: "Delete", enabled: true },
    { trigger: "Mentions", threshold: "> 5 mentions", action: "Warn", enabled: true },
    { trigger: "Profanity", threshold: "Strict wordlist match", action: "Warn", enabled: false },
    { trigger: "Repeated Chars", threshold: "> 10 duplicate chars", action: "Delete", enabled: true },
  ];

  // Clear existing rules for this guild first
  await prisma.autoModRule.deleteMany({ where: { guildId: guild.id } });
  for (const rule of autoModRules) {
    await prisma.autoModRule.create({
      data: { guildId: guild.id, ...rule },
    });
  }
  console.log(`✓ AutoModRules: ${autoModRules.length} seeded`);

  // ─── Tickets ──────────────────────────────────────────────────────────
  const tickets = [
    { openerId: "user_vectorfish", subject: "Can't access #premium-chat", status: "open", priority: "high" },
    { openerId: "user_morningglory", subject: "Bot gave wrong role after purchase", status: "claimed", claimedBy: "user_radiantpeak", priority: "medium" },
    { openerId: "user_blinkraker", subject: "Muted by mistake, appeal request", status: "claimed", claimedBy: "user_zephyrine", priority: "medium" },
    { openerId: "user_dusthaven", subject: "Custom role color not applying", status: "closed", claimedBy: "user_radiantpeak", priority: "low" },
    { openerId: "user_pixelwarden", subject: "Missing booster perks", status: "closed", claimedBy: "user_zephyrine", priority: "low" },
  ];

  await prisma.ticket.deleteMany({ where: { guildId: guild.id } });
  for (const t of tickets) {
    await prisma.ticket.create({
      data: {
        guildId: guild.id,
        ...t,
        ...(t.status === "closed" ? { closedAt: new Date() } : {}),
      },
    });
  }
  console.log(`✓ Tickets: ${tickets.length} seeded`);

  // ─── Moderation Logs ──────────────────────────────────────────────────
  const modLogs = [
    { actorId: "automod", targetId: "user_grumpytroll", action: "delete", reason: "Caps filter (92%)", severity: "low" },
    { actorId: "automod", targetId: "user_grumpytroll", action: "warn", reason: "Spam × 4 in 8s", severity: "medium" },
    { actorId: "automod", targetId: "user_linkspammer", action: "mute", reason: "Link filter match", severity: "medium" },
    { actorId: "user_zephyrine", targetId: "user_raidbot44", action: "ban", reason: "Raid attempt & token spam", severity: "high" },
    { actorId: "user_radiantpeak", targetId: "user_scammer_2", action: "kick", reason: "Unsolicited DM advertising", severity: "medium" },
    { actorId: "automod", targetId: "user_capslock", action: "delete", reason: "Caps filter (88%)", severity: "low" },
  ];

  await prisma.moderationLog.deleteMany({ where: { guildId: guild.id } });
  for (const log of modLogs) {
    await prisma.moderationLog.create({
      data: { guildId: guild.id, ...log },
    });
  }
  console.log(`✓ ModerationLogs: ${modLogs.length} seeded`);

  // ─── Giveaways ────────────────────────────────────────────────────────
  const now = new Date();
  const giveaways = [
    {
      prize: "Discord Nitro (1 Year) + Custom Role",
      winnerCount: 1,
      endsAt: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3h from now
      ended: false,
    },
    {
      prize: "Steam Gift Card $50",
      winnerCount: 2,
      endsAt: new Date(now.getTime() + 36 * 60 * 60 * 1000), // 36h from now
      ended: false,
    },
    {
      prize: "Cyberpunk 2077 Game Code",
      winnerCount: 1,
      endsAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      ended: true,
    },
  ];

  await prisma.giveaway.deleteMany({ where: { guildId: guild.id } });
  for (const gw of giveaways) {
    await prisma.giveaway.create({
      data: { guildId: guild.id, ...gw },
    });
  }
  console.log(`✓ Giveaways: ${giveaways.length} seeded`);

  // ─── Audit Logs ───────────────────────────────────────────────────────
  const auditLogs = [
    { actorId: "user_zephyrine", action: "Updated auto-mod caps threshold to 70%" },
    { actorId: "user_radiantpeak", action: "Closed ticket #0191" },
    { actorId: "user_zephyrine", action: "Created giveaway: Discord Nitro" },
    { actorId: "user_radiantpeak", action: "Enabled Starboard module" },
  ];

  await prisma.auditLog.deleteMany({ where: { guildId: guild.id } });
  for (const al of auditLogs) {
    await prisma.auditLog.create({
      data: { guildId: guild.id, ...al },
    });
  }
  console.log(`✓ AuditLogs: ${auditLogs.length} seeded`);

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
