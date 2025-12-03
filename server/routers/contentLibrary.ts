import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { verifyWorkspaceOwnership } from "../_core/ownership";

export const contentLibraryRouter = router({
  list: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      await verifyWorkspaceOwnership(input.workspaceId, ctx.user.id);
      return await db.getContentLibraryByWorkspaceId(input.workspaceId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        title: z.string().min(1).max(255),
        content: z.string().min(1),
        category: z
          .enum(["hook", "post", "email", "ad", "other"])
          .default("other"),
        tags: z.array(z.string()).optional(),
        sourceChatId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await verifyWorkspaceOwnership(input.workspaceId, ctx.user.id);
      const id = await db.createContentLibraryItem({
        workspaceId: input.workspaceId,
        title: input.title,
        content: input.content,
        category: input.category,
        tags: input.tags ? JSON.stringify(input.tags) : null,
        sourceChatId: input.sourceChatId || null,
      });
      return { id };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteContentLibraryItem(input.id);
      return { success: true };
    }),
});
