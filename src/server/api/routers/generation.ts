import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  startGeneration,
  getPrediction,
  getDefaultProvider,
  nanoBananaPro,
  imagenFast,
  type ImageProvider,
} from "@/server/ai";

/**
 * Detect the provider from a prediction ID
 * fal.ai IDs contain "::" (e.g., "model-id::request-id")
 * Replicate IDs are plain UUIDs
 */
function detectProviderFromPredictionId(predictionId: string): ImageProvider {
  return predictionId.includes("::") ? "fal" : "replicate";
}
import { downloadAndUploadImage } from "@/server/utils/upload";
import {
  ASPECT_RATIOS,
  getGenerationDimensions,
  DEFAULT_RESOLUTION,
  type AspectRatio,
  type Resolution,
} from "@/lib/utils/image";
import { isArray } from "lodash";
import { refreshCreditsIfNeeded, deductCredit, refundCredit } from "./billing";
import type { db } from "@/server/db";

/**
 * Get the platform API key for a provider
 */
function getPlatformApiKey(provider: ImageProvider): string | undefined {
  switch (provider) {
    case "fal":
      return process.env.FAL_API_KEY;
    case "replicate":
      return process.env.REPLICATE_API_TOKEN;
    default:
      return undefined;
  }
}

/**
 * Get an API key for polling a specific provider
 * Uses platform key if available, falls back to user's key for Replicate
 */
function getApiKeyForPolling(
  provider: ImageProvider,
  userReplicateKey: string | null,
): string {
  // Try platform key first
  const platformKey = getPlatformApiKey(provider);
  if (platformKey) {
    return platformKey;
  }

  // Fall back to user's Replicate key if polling Replicate
  if (provider === "replicate" && userReplicateKey) {
    return userReplicateKey;
  }

  throw new TRPCError({
    code: "PRECONDITION_FAILED",
    message: "API_KEY_REQUIRED",
  });
}

/**
 * Helper to check if user can generate (has credits OR own API key)
 * Returns the API key to use, provider, and whether credits should be deducted
 */
async function checkGenerationAccess(
  database: typeof db,
  user: { id: string; replicateApiKey: string | null; plan: string },
): Promise<{ apiKey: string; provider: ImageProvider; useCredits: boolean }> {
  const provider = getDefaultProvider();

  // Check if user has credits (works for both FREE and SUBSCRIBED users)
  const result = await refreshCreditsIfNeeded(database, user.id);
  if (result.hasCredits) {
    // Use platform API key for users with credits
    const platformKey = getPlatformApiKey(provider);
    if (platformKey) {
      return { apiKey: platformKey, provider, useCredits: true };
    }
  }

  // Fall back to user's own API key (currently only supports Replicate keys)
  // TODO: Add support for user-provided fal.ai keys
  if (user.replicateApiKey) {
    return { apiKey: user.replicateApiKey, provider: "replicate", useCredits: false };
  }

  // No credits and no API key
  throw new TRPCError({
    code: "PRECONDITION_FAILED",
    message: "API_KEY_REQUIRED",
  });
}

/**
 * Check if an error is an insufficient credit/balance error from the provider
 */
function isInsufficientCreditError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    // Replicate: 402 Insufficient credit
    // fal.ai: 402 or "insufficient balance"
    return (
      (message.includes("402") && message.includes("insufficient")) ||
      message.includes("insufficient balance") ||
      message.includes("insufficient credit")
    );
  }
  return false;
}

// The model to use for frame generation - easy to swap out
const frameModel = nanoBananaPro;
// The model to use for asset generation (FLUX Schnell - fast)
const assetModel = imagenFast;

// Build schema from shared ASPECT_RATIOS constant
const aspectRatioValues = ASPECT_RATIOS.map((r) => r.value) as [
  AspectRatio,
  ...AspectRatio[],
];
const aspectRatioSchema = z.enum(aspectRatioValues);
const resolutionSchema = z.union([z.literal(1), z.literal(2)]) as z.ZodType<Resolution>;

export const generationRouter = createTRPCRouter({
  /**
   * Get the user's credits status for UI display
   */
  getCreditsStatus: protectedProcedure.query(async ({ ctx }) => {
    const { hasCredits, credits, plan } = await refreshCreditsIfNeeded(
      ctx.db,
      ctx.user.id,
    );

    // Refetch user to get updated creditsPeriodEnd
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.user.id },
      select: { creditsPeriodEnd: true, replicateApiKey: true },
    });

    return {
      plan,
      credits,
      hasCredits,
      creditsPeriodEnd: user?.creditsPeriodEnd ?? null,
      hasOwnApiKey: !!user?.replicateApiKey,
    };
  }),

  /**
   * Start a new frame generation
   * Accepts a frame export as a reference
   */
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        prompt: z.string().min(1).max(2000),
        aspectRatio: aspectRatioSchema,
        resolution: resolutionSchema.optional().default(DEFAULT_RESOLUTION),
        referenceImage: z.string().optional(), // Base64 data URL from frame export
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check generation access (subscription credits or own API key)
      const { apiKey, provider, useCredits } = await checkGenerationAccess(
        ctx.db,
        ctx.user,
      );

      // Verify project ownership
      const project = await ctx.db.project.findUnique({
        where: { id: input.projectId },
        select: { userId: true },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (project.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this project",
        });
      }

      const dimensions = getGenerationDimensions(input.aspectRatio, input.resolution);

      // Create generation record
      const generation = await ctx.db.generation.create({
        data: {
          projectId: input.projectId,
          prompt: input.prompt,
          aspectRatio: input.aspectRatio,
          width: dimensions.width,
          height: dimensions.height,
          status: "PENDING",
          type: "FRAME",
        },
      });

      try {
        // Start image generation
        const prediction = await startGeneration(
          frameModel,
          {
            prompt: input.prompt,
            referenceImage: input.referenceImage,
            width: dimensions.width,
            height: dimensions.height,
          },
          apiKey,
          provider,
        );

        // Deduct credit if using subscription
        if (useCredits) {
          await deductCredit(ctx.db, ctx.user.id);
        }

        // Update with provider prediction ID and track credit usage
        await ctx.db.generation.update({
          where: { id: generation.id },
          data: {
            replicateId: prediction.id, // Stores provider's prediction ID (works for both fal and replicate)
            status: "PROCESSING",
            usedCredits: useCredits,
          },
        });

        return { generationId: generation.id, replicateId: prediction.id };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to start generation";
        console.error(`[Generation ${generation.id}] Failed to start`, {
          error,
        });
        // Mark as failed if we couldn't start
        await ctx.db.generation.update({
          where: { id: generation.id },
          data: { status: "FAILED", errorMessage },
        });

        // Check for insufficient credit error
        if (isInsufficientCreditError(error)) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "PROVIDER_INSUFFICIENT_CREDIT",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to start generation",
        });
      }
    }),

  /**
   * Start a new asset generation
   * Assets are standalone images (e.g., characters, objects) without reference images
   */
  createAsset: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        prompt: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check generation access (subscription credits or own API key)
      const { apiKey, provider, useCredits } = await checkGenerationAccess(
        ctx.db,
        ctx.user,
      );

      // Verify project ownership
      const project = await ctx.db.project.findUnique({
        where: { id: input.projectId },
        select: { userId: true },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (project.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this project",
        });
      }

      // Assets are always 1:1 square at default resolution
      const dimensions = getGenerationDimensions("1:1", DEFAULT_RESOLUTION);

      // Create generation record
      const generation = await ctx.db.generation.create({
        data: {
          projectId: input.projectId,
          prompt: input.prompt,
          aspectRatio: "1:1",
          width: dimensions.width,
          height: dimensions.height,
          status: "PENDING",
          type: "ASSET",
        },
      });

      try {
        // Start image generation with Imagen 4 Fast
        const prediction = await startGeneration(
          assetModel,
          {
            prompt: input.prompt,
            width: dimensions.width,
            height: dimensions.height,
          },
          apiKey,
          provider,
        );

        // Deduct credit if using subscription
        if (useCredits) {
          await deductCredit(ctx.db, ctx.user.id);
        }

        // Update with provider prediction ID and track credit usage
        await ctx.db.generation.update({
          where: { id: generation.id },
          data: {
            replicateId: prediction.id, // Stores provider's prediction ID (works for both fal and replicate)
            status: "PROCESSING",
            usedCredits: useCredits,
          },
        });

        return { generationId: generation.id, replicateId: prediction.id };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to start asset generation";
        console.error(`[Generation ${generation.id}] Failed to start asset`, {
          error,
        });
        // Mark as failed if we couldn't start
        await ctx.db.generation.update({
          where: { id: generation.id },
          data: { status: "FAILED", errorMessage },
        });

        // Check for insufficient credit error
        if (isInsufficientCreditError(error)) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "PROVIDER_INSUFFICIENT_CREDIT",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to start asset generation",
        });
      }
    }),

  /**
   * Poll for generation status and complete if ready
   */
  getStatus: protectedProcedure
    .input(z.object({ generationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const generation = await ctx.db.generation.findUnique({
        where: { id: input.generationId },
        include: {
          project: {
            select: { userId: true },
          },
        },
      });

      if (!generation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Generation not found",
        });
      }

      if (generation.project.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this generation",
        });
      }

      // If already completed or failed, just return
      if (generation.status === "COMPLETED" || generation.status === "FAILED") {
        return generation;
      }

      // Poll provider if we have an ID
      if (generation.replicateId) {
        // Detect which provider was used from the prediction ID format
        const provider = detectProviderFromPredictionId(generation.replicateId);
        
        // Get API key for the detected provider
        const apiKey = getApiKeyForPolling(provider, ctx.user.replicateApiKey);

        try {
          const prediction = await getPrediction(generation.replicateId, apiKey, provider);

          const output = isArray(prediction.output)
            ? prediction.output[0]
            : prediction.output;

          if (prediction.status === "succeeded" && output) {
            // Download and upload to our storage
            const imageUrl = await downloadAndUploadImage(output);

            if (imageUrl) {
              const updated = await ctx.db.generation.update({
                where: { id: generation.id },
                data: {
                  status: "COMPLETED",
                  imageUrl,
                },
              });
              return updated;
            } else {
              const errorMessage = "Failed to download and upload generated image";
              console.error(
                `[Generation ${generation.id}] ${errorMessage}`,
                { replicateId: generation.replicateId, output },
              );
              // Refund credit if this generation used credits
              if (generation.usedCredits) {
                await refundCredit(ctx.db, ctx.user.id);
              }
              const updated = await ctx.db.generation.update({
                where: { id: generation.id },
                data: {
                  status: "FAILED",
                  errorMessage,
                  usedCredits: false, // Mark as refunded
                },
              });
              return updated;
            }
          } else if (
            prediction.status === "failed" ||
            prediction.status === "canceled"
          ) {
            const errorMessage =
              prediction.error ??
              `Generation ${prediction.status === "canceled" ? "was canceled" : "failed"}`;
            console.error(
              `[Generation ${generation.id}] Provider prediction ${prediction.status}`,
              { predictionId: generation.replicateId, provider, error: prediction.error },
            );
            // Refund credit if this generation used credits
            if (generation.usedCredits) {
              await refundCredit(ctx.db, ctx.user.id);
            }
            const updated = await ctx.db.generation.update({
              where: { id: generation.id },
              data: {
                status: "FAILED",
                errorMessage,
                usedCredits: false, // Mark as refunded
              },
            });
            return updated;
          }
        } catch (pollError) {
          const errorMessage =
            pollError instanceof Error
              ? pollError.message
              : "Unknown error while polling generation status";
          console.error(
            `[Generation ${generation.id}] Error polling provider`,
            { predictionId: generation.replicateId, provider, error: pollError },
          );
          // Refund credit if this generation used credits
          if (generation.usedCredits) {
            await refundCredit(ctx.db, ctx.user.id);
          }
          const updated = await ctx.db.generation.update({
            where: { id: generation.id },
            data: {
              status: "FAILED",
              errorMessage,
              usedCredits: false, // Mark as refunded
            },
          });
          return updated;
        }
      }

      return generation;
    }),

  /**
   * List generations for a project
   */
  list: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify project ownership
      const project = await ctx.db.project.findUnique({
        where: { id: input.projectId },
        select: { userId: true },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (project.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this project",
        });
      }

      const generations = await ctx.db.generation.findMany({
        where: { projectId: input.projectId },
        orderBy: { createdAt: "desc" },
      });

      return generations;
    }),

  /**
   * Generate synchronously (start + poll until complete)
   * Useful for simpler UX but blocks longer
   */
  /**
   * Delete a generation
   */
  delete: protectedProcedure
    .input(z.object({ generationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const generation = await ctx.db.generation.findUnique({
        where: { id: input.generationId },
        include: {
          project: {
            select: { userId: true },
          },
        },
      });

      if (!generation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Generation not found",
        });
      }

      if (generation.project.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this generation",
        });
      }

      await ctx.db.generation.delete({
        where: { id: input.generationId },
      });

      return { success: true };
    }),
});
