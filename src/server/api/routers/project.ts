import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          userId: ctx.user.id,
        },
      });
      return project;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input.id },
        include: {
          generations: {
            orderBy: { createdAt: "desc" },
          },
        },
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

      return project;
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: { userId: ctx.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { generations: true },
        },
      },
    });
    return projects;
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        snapshot: z.unknown().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First verify ownership
      const existing = await ctx.db.project.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (existing.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this project",
        });
      }

      const project = await ctx.db.project.update({
        where: { id: input.id },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.snapshot !== undefined && { snapshot: input.snapshot }),
        },
      });

      return project;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First verify ownership
      const existing = await ctx.db.project.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (existing.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this project",
        });
      }

      await ctx.db.project.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

