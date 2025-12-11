import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createDefaultSnapshot } from "@/lib/utils/default-snapshot";

export const userRouter = createTRPCRouter({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  /**
   * Complete onboarding by creating the user's first project with a default frame.
   * Returns the new project ID to redirect to.
   */
  completeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    // Check if onboarding is already completed
    if (ctx.user.onboardingCompletedAt) {
      // Return their first project if it exists
      const existingProject = await ctx.db.project.findFirst({
        where: { userId: ctx.user.id },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });
      return { projectId: existingProject?.id ?? null, alreadyCompleted: true };
    }

    // Create the first project with a default snapshot containing a frame
    const snapshot = createDefaultSnapshot("1:1", "1:1 - 2K");

    const project = await ctx.db.project.create({
      data: {
        name: "My First Project",
        userId: ctx.user.id,
        snapshot: snapshot,
      },
    });

    // Mark onboarding as completed
    await ctx.db.user.update({
      where: { id: ctx.user.id },
      data: { onboardingCompletedAt: new Date() },
    });

    return { projectId: project.id, alreadyCompleted: false };
  }),

  /**
   * Check if the user has a Replicate API key configured
   */
  hasReplicateKey: protectedProcedure.query(async ({ ctx }) => {
    return !!ctx.user.replicateApiKey;
  }),

  /**
   * Save or update the user's Replicate API key
   */
  saveReplicateKey: protectedProcedure
    .input(
      z.object({
        apiKey: z.string().min(1, "API key is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: { id: ctx.user.id },
        data: { replicateApiKey: input.apiKey },
      });
      return { success: true };
    }),

  /**
   * Remove the user's Replicate API key
   */
  removeReplicateKey: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.user.update({
      where: { id: ctx.user.id },
      data: { replicateApiKey: null },
    });
    return { success: true };
  }),

  /**
   * Mark the user as interested in subscribing
   */
  markSubscriptionInterest: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.user.update({
      where: { id: ctx.user.id },
      data: { subscriptionInterestAt: new Date() },
    });
    return { success: true };
  }),
});
