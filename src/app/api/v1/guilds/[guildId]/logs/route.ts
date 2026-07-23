import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";

/**
 * GET /api/guilds/[guildId]/logs
 * Fetch moderation logs with pagination and filtering.
 * Query params: ?type=moderation|activity  &search=  &limit=  &cursor=
 */
export const GET = withErrorHandler(
  async (req: Request, { params }: { params: Record<string, string> }) => {
    const { guildId } = params;
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type") ?? "moderation";
    const search = searchParams.get("search") ?? "";
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
    const cursor = searchParams.get("cursor");

    if (type === "moderation") {
      const where: Record<string, unknown> = { guildId };

      if (search) {
        where.OR = [
          { targetId: { contains: search, mode: "insensitive" } },
          { actorId: { contains: search, mode: "insensitive" } },
          { action: { contains: search, mode: "insensitive" } },
          { reason: { contains: search, mode: "insensitive" } },
        ];
      }

      const logs = await prisma.moderationLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });

      const hasMore = logs.length > limit;
      const data = hasMore ? logs.slice(0, limit) : logs;
      const nextCursor = hasMore ? data[data.length - 1]?.id : null;

      return apiSuccess({
        logs: data,
        pagination: { hasMore, nextCursor, limit },
      });
    }

    // Activity logs from the audit log table
    const where: Record<string, unknown> = { guildId };

    if (search) {
      where.OR = [
        { actorId: { contains: search, mode: "insensitive" } },
        { action: { contains: search, mode: "insensitive" } },
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = logs.length > limit;
    const data = hasMore ? logs.slice(0, limit) : logs;
    const nextCursor = hasMore ? data[data.length - 1]?.id : null;

    return apiSuccess({
      logs: data,
      pagination: { hasMore, nextCursor, limit },
    });
  }
);
