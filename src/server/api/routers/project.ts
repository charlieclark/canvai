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

      return {
        ...project,
        isTemplate: project.isTemplate,
        templateSlug: project.templateSlug,
      };
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
          ...(input.name ? { name: input.name } : {}),
          ...(input.snapshot ? { snapshot: input.snapshot } : {}),
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

  /**
   * Toggle template status for a project (admin only)
   */
  toggleTemplate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isTemplate: z.boolean(),
        templateSlug: z.string().min(1).max(100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is ADMIN
      if (ctx.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create templates",
        });
      }

      // Verify ownership
      const existing = await ctx.db.project.findUnique({
        where: { id: input.id },
        select: { userId: true, snapshot: true },
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

      // If enabling template, validate single frame and require slug
      if (input.isTemplate) {
        if (!input.templateSlug) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Template slug is required",
          });
        }

        // Validate slug format (lowercase, alphanumeric, hyphens only)
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(input.templateSlug)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Slug must contain only lowercase letters, numbers, and hyphens",
          });
        }

        // Check if slug is already taken
        const existingTemplate = await ctx.db.project.findUnique({
          where: { templateSlug: input.templateSlug },
        });

        if (existingTemplate && existingTemplate.id !== input.id) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This template slug is already taken",
          });
        }

        // Count frames in snapshot
        const snapshot = existing.snapshot as {
          store?: Record<string, { typeName?: string }>;
        } | null;
        let frameCount = 0;

        if (snapshot?.store) {
          for (const record of Object.values(snapshot.store)) {
            if (record.typeName === "shape") {
              const shape = record as { type?: string };
              if (shape.type === "frame") {
                frameCount++;
              }
            }
          }
        }

        if (frameCount !== 1) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Project must have exactly 1 frame to be a template",
          });
        }
      }

      const project = await ctx.db.project.update({
        where: { id: input.id },
        data: {
          isTemplate: input.isTemplate,
          templateSlug: input.isTemplate ? input.templateSlug : null,
        },
      });

      return project;
    }),
});
