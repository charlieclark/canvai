import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
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
});
