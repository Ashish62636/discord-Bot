import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";
import { updateGuildConfigSchema } from "@/lib/validations";

/**
 * GET /api/guilds/[guildId]
 * Fetch guild details with config and module toggles.
 */
export const GET = withErrorHandler(
  async (_req: Request, { params }: { params: Record<string, string> }) => {
    const { guildId } = params;

    const guild = await prisma.guild.findUnique({
      where: { id: guildId },
      include: {
        config: true,
        _count: {
          select: {
            members: true,
            tickets: true,
            giveaways: true,
            moderationLogs: true,
            autoModRules: true,
          },
        },
      },
    });

    if (!guild) {
      return apiError("Guild not found", 404);
    }

    return apiSuccess(guild);
  }
);

/**
 * PATCH /api/guilds/[guildId]
 * Update guild config (channel IDs, prefix, module settings).
 * Increments config version for cache invalidation.
 */
export const PATCH = withErrorHandler(
  async (req: Request, { params }: { params: Record<string, string> }) => {
    const { guildId } = params;
    const body = await req.json();
    const validated = updateGuildConfigSchema.parse(body);

    // Separate settings from flat config fields
    const { settings, ...configFields } = validated;

    const existing = await prisma.guildConfig.findUnique({
      where: { guildId },
    });

    if (!existing) {
      return apiError("Guild config not found. Ensure the guild is registered.", 404);
    }

    // Merge settings JSONB if provided
    let mergedSettings = existing.settings;
    if (settings) {
      mergedSettings = {
        ...(typeof existing.settings === "object" && existing.settings !== null
          ? existing.settings
          : {}),
        ...settings,
      };
    }

    const updated = await prisma.guildConfig.update({
      where: { guildId },
      data: {
        ...configFields,
        settings: mergedSettings as object,
        version: { increment: 1 }, // Cache invalidation version bump
      },
    });

    // TODO: Publish invalidation event to Redis Stream
    // await redis.xadd(`guild:${guildId}:invalidation`, '*', 'version', updated.version.toString())

    return apiSuccess(updated);
  }
);
