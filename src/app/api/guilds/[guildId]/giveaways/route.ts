import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";
import { createGiveawaySchema } from "@/lib/validations";

/**
 * GET /api/guilds/[guildId]/giveaways
 * List giveaways for a guild, with optional status filter.
 * Query params: ?status=active|ended
 */
export const GET = withErrorHandler(
  async (req: Request, { params }: { params: Record<string, string> }) => {
    const { guildId } = params;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = { guildId };
    if (status === "active") {
      where.ended = false;
    } else if (status === "ended") {
      where.ended = true;
    }

    const giveaways = await prisma.giveaway.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { entries: true } },
      },
    });

    return apiSuccess(giveaways);
  }
);

/**
 * POST /api/guilds/[guildId]/giveaways
 * Create a new giveaway. Creates a scheduled outbox event
 * so the worker can end it at the correct time.
 */
export const POST = withErrorHandler(
  async (req: Request, { params }: { params: Record<string, string> }) => {
    const { guildId } = params;
    const body = await req.json();
    const validated = createGiveawaySchema.parse({ ...body, guildId });

    const guild = await prisma.guild.findUnique({ where: { id: guildId } });
    if (!guild) {
      return apiError("Guild not found", 404);
    }

    // Transaction: create giveaway + schedule outbox event for ending
    const result = await prisma.$transaction(async (tx) => {
      const giveaway = await tx.giveaway.create({
        data: validated,
      });

      // Outbox event scheduled for giveaway end time
      await tx.outboxEvent.create({
        data: {
          guildId,
          aggregateType: "GIVEAWAY",
          aggregateId: giveaway.id,
          eventType: "END_GIVEAWAY",
          payload: {
            giveawayId: giveaway.id,
            prize: validated.prize,
            winnerCount: validated.winnerCount,
          },
          scheduledFor: validated.endsAt,
        },
      });

      return giveaway;
    });

    return apiSuccess(result, 201);
  }
);
