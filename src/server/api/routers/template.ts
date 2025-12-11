import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const templateRouter = createTRPCRouter({
  /**
   * Get a template by its slug (public)
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const template = await ctx.db.project.findUnique({
        where: {
          templateSlug: input.slug,
          isTemplate: true,
        },
        select: {
          id: true,
          name: true,
          snapshot: true,
          templateSlug: true,
        },
      });

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      }

      return template;
    }),

  /**
   * Clone a template into a new project for the current user
   * If a custom snapshot is provided (user modified the template), use that instead
   */
  clone: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        snapshot: z.unknown().optional(), // Custom snapshot from user's edits
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Find the template
      const template = await ctx.db.project.findUnique({
        where: {
          templateSlug: input.slug,
          isTemplate: true,
        },
        select: {
          id: true,
          name: true,
          snapshot: true,
        },
      });

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      }

      // Use custom snapshot if provided, otherwise use template's original
      const snapshotToUse = input.snapshot ?? template.snapshot;

      // Create a new project with the snapshot
      const project = await ctx.db.project.create({
        data: {
          name: template.name,
          userId: ctx.user.id,
          snapshot: snapshotToUse ?? undefined,
        },
      });

      return project;
    }),
});
