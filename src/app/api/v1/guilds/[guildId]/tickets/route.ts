import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";
import { createTicketSchema, updateTicketSchema } from "@/lib/validations";

/**
 * GET /api/guilds/[guildId]/tickets
 * List tickets for a guild, with optional status filter.
 * Query params: ?status=open|claimed|closed
 */
export const GET = withErrorHandler(
  async (req: Request, { params }: { params: Record<string, string> }) => {
    const { guildId } = params;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = { guildId };
    if (status && ["open", "claimed", "closed"].includes(status)) {
      where.status = status;
    }

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { messages: true } },
      },
    });

    return apiSuccess(tickets);
  }
);

/**
 * POST /api/guilds/[guildId]/tickets
 * Create a new support ticket.
 */
export const POST = withErrorHandler(
  async (req: Request, { params }: { params: Record<string, string> }) => {
    const { guildId } = params;
    const body = await req.json();
    const validated = createTicketSchema.parse({ ...body, guildId });

    const guild = await prisma.guild.findUnique({ where: { id: guildId } });
    if (!guild) {
      return apiError("Guild not found", 404);
    }

    const ticket = await prisma.ticket.create({
      data: validated,
    });

    return apiSuccess(ticket, 201);
  }
);
