import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  startGeneration,
  getPrediction,
  runGeneration,
  fluxSchnell,
} from "@/server/ai/replicate";
import { downloadAndUploadImage } from "@/server/utils/upload";

// The model to use for generation - easy to swap out
const imageModel = fluxSchnell;

const aspectRatioSchema = z.enum(["1:1", "16:9", "9:16", "4:3", "3:2"]);

// Map aspect ratios to dimensions
const ASPECT_RATIO_DIMENSIONS: Record<
  string,
  { width: number; height: number }
> = {
  "1:1": { width: 1024, height: 1024 },
  "16:9": { width: 1344, height: 768 },
  "9:16": { width: 768, height: 1344 },
  "4:3": { width: 1152, height: 896 },
  "3:2": { width: 1216, height: 832 },
};

export const generationRouter = createTRPCRouter({
  /**
   * Start a new generation
   * Accepts a frame export as a reference image (base64 data URL)
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

      const dimensions = ASPECT_RATIO_DIMENSIONS[input.aspectRatio]!;

      // Create generation record
      const generation = await ctx.db.generation.create({
        data: {
          projectId: input.projectId,
          prompt: input.prompt,
          aspectRatio: input.aspectRatio,
          width: dimensions.width,
          height: dimensions.height,
          status: "PENDING",
        },
      });

      try {
        // Start image generation
        const prediction = await startGeneration(imageModel, {
          prompt: input.prompt,
          referenceImage: input.referenceImage,
          width: dimensions.width,
          height: dimensions.height,
        });

        // Update with replicate ID
        await ctx.db.generation.update({
          where: { id: generation.id },
          data: {
            replicateId: prediction.id,
            status: "PROCESSING",
          },
        });

        return { generationId: generation.id, replicateId: prediction.id };
      } catch {
        // Mark as failed if we couldn't start
        await ctx.db.generation.update({
          where: { id: generation.id },
          data: { status: "FAILED" },
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to start generation",
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

      // Poll Replicate if we have an ID
      if (generation.replicateId) {
        try {
          const prediction = await getPrediction(generation.replicateId);

          if (prediction.status === "succeeded" && prediction.output?.[0]) {
            // Download and upload to our storage
            const imageUrl = await downloadAndUploadImage(prediction.output[0]);

            if (imageUrl) {
              const updated = await ctx.db.generation.update({
                where: { id: generation.id },
                data: {
                  status: "COMPLETED",
                  imageUrl,
                },
              });
              return updated;
            }
          } else if (
            prediction.status === "failed" ||
            prediction.status === "canceled"
          ) {
            const updated = await ctx.db.generation.update({
              where: { id: generation.id },
              data: { status: "FAILED" },
            });
            return updated;
          }
        } catch (pollError) {
          console.error("Error polling generation:", pollError);
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
  generateSync: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        prompt: z.string().min(1).max(2000),
        aspectRatio: aspectRatioSchema,
        referenceImage: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

      const dimensions = ASPECT_RATIO_DIMENSIONS[input.aspectRatio]!;

      // Create generation record
      const generation = await ctx.db.generation.create({
        data: {
          projectId: input.projectId,
          prompt: input.prompt,
          aspectRatio: input.aspectRatio,
          width: dimensions.width,
          height: dimensions.height,
          status: "PROCESSING",
        },
      });

      try {
        // Run full generation (blocking)
        const prediction = await runGeneration(imageModel, {
          prompt: input.prompt,
          referenceImage: input.referenceImage,
          width: dimensions.width,
          height: dimensions.height,
        });

        if (prediction.status === "succeeded" && prediction.output?.[0]) {
          // Download and upload to our storage
          const imageUrl = await downloadAndUploadImage(prediction.output[0]);

          const updated = await ctx.db.generation.update({
            where: { id: generation.id },
            data: {
              status: "COMPLETED",
              imageUrl: imageUrl || null,
              replicateId: prediction.id,
            },
          });

          return updated;
        } else {
          throw new Error(prediction.error || "Generation failed");
        }
      } catch (error) {
        await ctx.db.generation.update({
          where: { id: generation.id },
          data: { status: "FAILED" },
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Generation failed",
        });
      }
    }),
});
