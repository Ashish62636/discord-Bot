import { prisma } from "@/lib/prisma";
import { apiSuccess, withErrorHandler } from "@/lib/api-helpers";

/**
 * GET /api/guilds/[guildId]/stats
 * Aggregated guild statistics for the Overview dashboard.
 * Returns member count, message count, mod actions, open ticket count.
 */
export const GET = withErrorHandler(
  async (_req: Request, { params }: { params: Record<string, string> }) => {
    const { guildId } = params;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      memberCount,
      openTicketCount,
      modActionsLast24h,
      modActionsLast7d,
      activeGiveawayCount,
      enabledAutoModRuleCount,
    ] = await Promise.all([
      prisma.guildMember.count({ where: { guildId } }),
      prisma.ticket.count({ where: { guildId, status: "open" } }),
      prisma.moderationLog.count({
        where: { guildId, createdAt: { gte: twentyFourHoursAgo } },
      }),
      prisma.moderationLog.count({
        where: { guildId, createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.giveaway.count({
        where: { guildId, ended: false },
      }),
      prisma.autoModRule.count({
        where: { guildId, enabled: true },
      }),
    ]);

    return apiSuccess({
      members: { total: memberCount },
      tickets: { open: openTicketCount },
      moderation: {
        last24h: modActionsLast24h,
        last7d: modActionsLast7d,
      },
      giveaways: { active: activeGiveawayCount },
      automod: { enabledRules: enabledAutoModRuleCount },
    });
  }
);
