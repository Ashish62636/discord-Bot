import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";
import { updateAutoModRuleSchema } from "@/lib/validations";

/**
 * PATCH /api/guilds/[guildId]/automod/[ruleId]
 * Update an auto-mod rule (trigger, threshold, action, enabled).
 */
export const PATCH = withErrorHandler(
  async (req: Request, { params }: { params: Record<string, string> }) => {
    const { ruleId } = params;
    const body = await req.json();
    const validated = updateAutoModRuleSchema.parse(body);

    const existing = await prisma.autoModRule.findUnique({
      where: { id: ruleId },
    });

    if (!existing) {
      return apiError("Auto-mod rule not found", 404);
    }

    const updated = await prisma.autoModRule.update({
      where: { id: ruleId },
      data: validated,
    });

    return apiSuccess(updated);
  }
);

/**
 * DELETE /api/guilds/[guildId]/automod/[ruleId]
 * Remove an auto-mod rule.
 */
export const DELETE = withErrorHandler(
  async (_req: Request, { params }: { params: Record<string, string> }) => {
    const { ruleId } = params;

    const existing = await prisma.autoModRule.findUnique({
      where: { id: ruleId },
    });

    if (!existing) {
      return apiError("Auto-mod rule not found", 404);
    }

    await prisma.autoModRule.delete({ where: { id: ruleId } });

    return apiSuccess({ deleted: true });
  }
);
