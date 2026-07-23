import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";
import { updateTicketSchema } from "@/lib/validations";

/**
 * GET /api/guilds/[guildId]/tickets/[ticketId]
 * Fetch a single ticket with its message transcript.
 */
export const GET = withErrorHandler(
  async (_req: Request, { params }: { params: Record<string, string> }) => {
    const { ticketId } = params;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return apiError("Ticket not found", 404);
    }

    return apiSuccess(ticket);
  }
);

/**
 * PATCH /api/guilds/[guildId]/tickets/[ticketId]
 * Update ticket status (claim, close) or priority.
 * Creates an outbox event for the bot to act on.
 */
export const PATCH = withErrorHandler(
  async (req: Request, { params }: { params: Record<string, string> }) => {
    const { guildId, ticketId } = params;
    const body = await req.json();
    const validated = updateTicketSchema.parse(body);

    const existing = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!existing) {
      return apiError("Ticket not found", 404);
    }

    // Use a transaction to atomically update ticket + create outbox event
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.ticket.update({
        where: { id: ticketId },
        data: {
          ...validated,
          ...(validated.status === "closed" ? { closedAt: new Date() } : {}),
        },
      });

      // Transactional Outbox: notify the bot about ticket state changes
      if (validated.status) {
        await tx.outboxEvent.create({
          data: {
            guildId,
            aggregateType: "TICKET",
            aggregateId: ticketId,
            eventType:
              validated.status === "closed"
                ? "CLOSE_TICKET"
                : "UPDATE_TICKET",
            payload: {
              ticketId,
              newStatus: validated.status,
              claimedBy: validated.claimedBy,
            },
          },
        });
      }

      return updated;
    });

    return apiSuccess(result);
  }
);
