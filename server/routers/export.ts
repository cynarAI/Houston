import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getWorkspacesByUserId, getGoalsByWorkspaceId } from "../db";
import { CreditService } from "../creditService";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink } from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

export const exportRouter = router({
  /**
   * Export Goals as PDF
   */
  exportGoalsPDF: protectedProcedure
    .input(
      z.object({
        goalIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Charge 2 credits for PDF export
      const result = await CreditService.charge(
        ctx.user.id,
        'PDF_EXPORT',
        2,
        { exportType: 'goals' }
      );
      
      if (!result.success) {
        throw new TRPCError({
          code: "PAYMENT_REQUIRED",
          message: `Not enough credits! PDF export costs 2 credits. Current balance: ${result.newBalance} credits.`,
        });
      }
      
      const workspaces = await getWorkspacesByUserId(ctx.user.id);
      const workspace = workspaces[0];
      if (!workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found",
        });
      }

      // Get goals from database
      const allGoals = await getGoalsByWorkspaceId(workspace.id);
      const goals = input.goalIds
        ? allGoals.filter((g: any) => input.goalIds!.includes(g.id))
        : allGoals;

      if (goals.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No goals found",
        });
      }

      // Generate Markdown
      let markdown = `# ${workspace.name} - Marketing Goals\n\n`;
      markdown += `Generated on ${new Date().toLocaleDateString()}\n\n`;
      markdown += `---\n\n`;

      for (const goal of goals) {
        markdown += `## ${goal.title}\n\n`;
        if (goal.description) {
          markdown += `**Description:** ${goal.description}\n\n`;
        }
        markdown += `**Status:** ${goal.status}\n\n`;
        if (goal.progress !== null) {
          markdown += `**Progress:** ${goal.progress}%\n\n`;
        }

        // SMART criteria
        if (goal.specific || goal.measurable || goal.achievable || goal.relevant || goal.timeBound) {
          markdown += `### SMART Criteria\n\n`;
          if (goal.specific) markdown += `**Specific:** ${goal.specific}\n\n`;
          if (goal.measurable) markdown += `**Measurable:** ${goal.measurable}\n\n`;
          if (goal.achievable) markdown += `**Achievable:** ${goal.achievable}\n\n`;
          if (goal.relevant) markdown += `**Relevant:** ${goal.relevant}\n\n`;
          if (goal.timeBound) markdown += `**Time-bound:** ${goal.timeBound}\n\n`;
        }

        if (goal.deadline) {
          markdown += `**Deadline:** ${new Date(goal.deadline).toLocaleDateString()}\n\n`;
        }

        markdown += `---\n\n`;
      }

      // Write to temp file
      const tempMdPath = path.join("/tmp", `goals-${Date.now()}.md`);
      const tempPdfPath = path.join("/tmp", `goals-${Date.now()}.pdf`);

      await writeFile(tempMdPath, markdown);

      // Convert to PDF using manus-md-to-pdf
      try {
        await execAsync(`manus-md-to-pdf ${tempMdPath} ${tempPdfPath}`);
      } catch (error) {
        console.error("PDF conversion error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate PDF",
        });
      }

      // Read PDF file
      const { readFile } = await import("fs/promises");
      const pdfBuffer = await readFile(tempPdfPath);

      // Cleanup temp files
      await unlink(tempMdPath);
      await unlink(tempPdfPath);

      // Return PDF as base64
      return {
        filename: `${workspace.name.replace(/\s+/g, "-")}-Goals-${Date.now()}.pdf`,
        data: pdfBuffer.toString("base64"),
      };
    }),

  /**
   * Export Chat History as PDF
   */
  exportChatPDF: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Charge 2 credits for PDF export
      const result = await CreditService.charge(
        ctx.user.id,
        'PDF_EXPORT',
        2,
        { exportType: 'chat' }
      );
      
      if (!result.success) {
        throw new TRPCError({
          code: "PAYMENT_REQUIRED",
          message: `Not enough credits! PDF export costs 2 credits. Current balance: ${result.newBalance} credits.`,
        });
      }
      
      const workspaces = await getWorkspacesByUserId(ctx.user.id);
      const workspace = workspaces[0];
      if (!workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found",
        });
      }

      // Get chat messages from database
      const { getChatSessionsByWorkspaceId, getChatMessagesBySessionId } = await import("../db");
      const sessions = await getChatSessionsByWorkspaceId(workspace.id);
      
      // Get messages from all sessions
      const allMessages = [];
      for (const session of sessions) {
        const sessionMessages = await getChatMessagesBySessionId(session.id);
        allMessages.push(...sessionMessages);
      }
      
      // Sort by date and limit
      const messages = allMessages
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, input.limit);

      if (messages.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No chat history found",
        });
      }

      // Generate Markdown
      let markdown = `# ${workspace.name} - Chat History with Houston\n\n`;
      markdown += `Generated on ${new Date().toLocaleDateString()}\n\n`;
      markdown += `---\n\n`;

      for (const msg of messages) {
        const role = msg.role === "user" ? "You" : "Houston";
        const timestamp = new Date(msg.createdAt).toLocaleString();
        
        markdown += `### ${role} (${timestamp})\n\n`;
        markdown += `${msg.content}\n\n`;
        markdown += `---\n\n`;
      }

      // Write to temp file
      const tempMdPath = path.join("/tmp", `chat-${Date.now()}.md`);
      const tempPdfPath = path.join("/tmp", `chat-${Date.now()}.pdf`);

      await writeFile(tempMdPath, markdown);

      // Convert to PDF
      try {
        await execAsync(`manus-md-to-pdf ${tempMdPath} ${tempPdfPath}`);
      } catch (error) {
        console.error("PDF conversion error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate PDF",
        });
      }

      // Read PDF file
      const { readFile } = await import("fs/promises");
      const pdfBuffer = await readFile(tempPdfPath);

      // Cleanup
      await unlink(tempMdPath);
      await unlink(tempPdfPath);

      return {
        filename: `${workspace.name.replace(/\s+/g, "-")}-Chat-History-${Date.now()}.pdf`,
        data: pdfBuffer.toString("base64"),
      };
    }),

  /**
   * Export Strategy as PDF
   */
  exportStrategyPDF: protectedProcedure.mutation(async ({ ctx }) => {
    // Charge 2 credits for PDF export
    const result = await CreditService.charge(
      ctx.user.id,
      'PDF_EXPORT',
      2,
      { exportType: 'strategy' }
    );
    
    if (!result.success) {
      throw new TRPCError({
        code: "PAYMENT_REQUIRED",
        message: `Not enough credits! PDF export costs 2 credits. Current balance: ${result.newBalance} credits.`,
      });
    }
    
    const workspaces = await getWorkspacesByUserId(ctx.user.id);
    const workspace = workspaces[0];
    if (!workspace) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Workspace not found",
      });
    }

    // Generate Markdown
    let markdown = `# ${workspace.name} - Marketing Strategy\n\n`;
    markdown += `Generated on ${new Date().toLocaleDateString()}\n\n`;
    markdown += `---\n\n`;

    // Business Info
    markdown += `## Business Information\n\n`;
    if (workspace.industry) markdown += `**Industry:** ${workspace.industry}\n\n`;
    if (workspace.companySize) markdown += `**Company Size:** ${workspace.companySize}\n\n`;
    if (workspace.description) markdown += `**Description:** ${workspace.description}\n\n`;
    markdown += `\n`;

    // Target Audience
    if (workspace.targetAudience) {
      markdown += `## Target Audience\n\n`;
      markdown += `${workspace.targetAudience}\n\n`;
    }

    // Products/Services
    if (workspace.products) {
      markdown += `## Products & Services\n\n`;
      markdown += `${workspace.products}\n\n`;
    }

    // Marketing Channels
    if (workspace.marketingChannels) {
      markdown += `## Marketing Channels\n\n`;
      markdown += `${workspace.marketingChannels}\n\n`;
    }

    // Budget & Challenges
    if (workspace.monthlyBudget || workspace.challenges) {
      markdown += `## Budget & Challenges\n\n`;
      if (workspace.monthlyBudget) markdown += `**Monthly Budget:** ${workspace.monthlyBudget}\n\n`;
      if (workspace.challenges) markdown += `**Challenges:** ${workspace.challenges}\n\n`;
    }

    // Write to temp file
    const tempMdPath = path.join("/tmp", `strategy-${Date.now()}.md`);
    const tempPdfPath = path.join("/tmp", `strategy-${Date.now()}.pdf`);

    await writeFile(tempMdPath, markdown);

    // Convert to PDF
    try {
      await execAsync(`manus-md-to-pdf ${tempMdPath} ${tempPdfPath}`);
    } catch (error) {
      console.error("PDF conversion error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate PDF",
      });
    }

    // Read PDF file
    const { readFile } = await import("fs/promises");
    const pdfBuffer = await readFile(tempPdfPath);

    // Cleanup
    await unlink(tempMdPath);
    await unlink(tempPdfPath);

    return {
      filename: `${workspace.name.replace(/\s+/g, "-")}-Strategy-${Date.now()}.pdf`,
      data: pdfBuffer.toString("base64"),
    };
  }),
});
