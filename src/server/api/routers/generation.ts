import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  startGeneration,
  getPrediction,
  nanoBananaPro,
  imagenFast,
} from "@/server/ai/replicate";
import { downloadAndUploadImage } from "@/server/utils/upload";
import { ASPECT_RATIOS, type AspectRatio } from "@/lib/utils/image";
import { isArray } from "lodash";

/**
 * Helper to get the user's Replicate API key
 * Throws an error if no key is configured
 */
function requireReplicateApiKey(
  replicateApiKey: string | null,
): asserts replicateApiKey is string {
  if (!replicateApiKey) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "REPLICATE_KEY_REQUIRED",
    });
  }
}

// The model to use for frame generation - easy to swap out
const frameModel = nanoBananaPro;
// The model to use for asset generation (FLUX Schnell - fast)
const assetModel = imagenFast;

// Build schema and dimensions map from shared ASPECT_RATIOS constant
const aspectRatioValues = ASPECT_RATIOS.map((r) => r.value) as [
  AspectRatio,
  ...AspectRatio[],
];
const aspectRatioSchema = z.enum(aspectRatioValues);

const ASPECT_RATIO_DIMENSIONS: Record<
  AspectRatio,
  { width: number; height: number }
> = Object.fromEntries(
  ASPECT_RATIOS.map((r) => [r.value, { width: r.width, height: r.height }]),
) as Record<AspectRatio, { width: number; height: number }>;

export const generationRouter = createTRPCRouter({
  /**
   * Start a new frame generation
   * Accepts a frame export as a r
   */
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        prompt: z.string().min(1).max(2000),
        aspectRatio: aspectRatioSchema,
        referenceImage: z.string().optional(), // Base64 data URL from frame export
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check for Replicate API key
      requireReplicateApiKey(ctx.user.replicateApiKey);

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

      const dimensions = ASPECT_RATIO_DIMENSIONS[input.aspectRatio];

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
        // Start image generation with user's API key
        const prediction = await startGeneration(
          frameModel,
          {
            prompt: input.prompt,
            referenceImage: input.referenceImage,
            width: dimensions.width,
            height: dimensions.height,
          },
          ctx.user.replicateApiKey,
        );

        // Update with replicate ID
        await ctx.db.generation.update({
          where: { id: generation.id },
          data: {
            replicateId: prediction.id,
            status: "PROCESSING",
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
      // Check for Replicate API key
      requireReplicateApiKey(ctx.user.replicateApiKey);

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

      // Assets are always 1:1 square
      const dimensions = ASPECT_RATIO_DIMENSIONS["1:1"];

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
        // Start image generation with Imagen 4 Fast using user's API key
        const prediction = await startGeneration(
          assetModel,
          {
            prompt: input.prompt,
            width: dimensions.width,
            height: dimensions.height,
          },
          ctx.user.replicateApiKey,
        );

        // Update with replicate ID
        await ctx.db.generation.update({
          where: { id: generation.id },
          data: {
            replicateId: prediction.id,
            status: "PROCESSING",
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
      // Check for Replicate API key (needed for polling)
      requireReplicateApiKey(ctx.user.replicateApiKey);

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

      // Poll Replicate if we have an ID
      if (generation.replicateId) {
        try {
          const prediction = await getPrediction(
            generation.replicateId,
            ctx.user.replicateApiKey,
          );

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
              const updated = await ctx.db.generation.update({
                where: { id: generation.id },
                data: {
                  status: "FAILED",
                  errorMessage,
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
              `[Generation ${generation.id}] Replicate prediction ${prediction.status}`,
              { replicateId: generation.replicateId, error: prediction.error },
            );
            const updated = await ctx.db.generation.update({
              where: { id: generation.id },
              data: {
                status: "FAILED",
                errorMessage,
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
            `[Generation ${generation.id}] Error polling Replicate`,
            { replicateId: generation.replicateId, error: pollError },
          );
          const updated = await ctx.db.generation.update({
            where: { id: generation.id },
            data: {
              status: "FAILED",
              errorMessage,
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
