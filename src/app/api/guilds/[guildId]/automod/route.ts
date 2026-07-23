import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";
import { createAutoModRuleSchema, updateAutoModRuleSchema } from "@/lib/validations";

/**
 * GET /api/guilds/[guildId]/automod
 * List all auto-mod rules for a guild.
 */
export const GET = withErrorHandler(
  async (_req: Request, { params }: { params: Record<string, string> }) => {
    const { guildId } = params;

    const rules = await prisma.autoModRule.findMany({
      where: { guildId },
      orderBy: { createdAt: "asc" },
    });

    return apiSuccess(rules);
  }
);

/**
 * POST /api/guilds/[guildId]/automod
 * Create a new auto-mod rule.
 */
export const POST = withErrorHandler(
  async (req: Request, { params }: { params: Record<string, string> }) => {
    const { guildId } = params;
    const body = await req.json();
    const validated = createAutoModRuleSchema.parse({ ...body, guildId });

    // Verify guild exists
    const guild = await prisma.guild.findUnique({ where: { id: guildId } });
    if (!guild) {
      return apiError("Guild not found", 404);
    }

    const rule = await prisma.autoModRule.create({
      data: validated,
    });

    return apiSuccess(rule, 201);
  }
);
