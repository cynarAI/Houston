import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { workspacesRouter } from "./routers/workspaces";
import { goalsRouter } from "./routers/goals";
import { todosRouter } from "./routers/todos";
import { strategyRouter } from "./routers/strategy";
import { chatRouter } from "./routers/chat";
import { onboardingRouter } from "./routers/onboarding";
import { stripeRouter } from "./routers/stripe";
import { exportRouter } from "./routers/export";
import { insightsRouter } from "./routers/insights";
import { creditsRouter } from "./routers/credits";
import { analyticsRouter } from "./routers/analytics";
import { referralsRouter } from "./routers/referrals";
import { notificationsRouter } from "./routers/notifications";
import { accountRouter } from "./routers/account";
import { playbooksRouter } from "./routers/playbooks";

// Mock user for DEV_MOCK_AUTH mode
const DEV_MOCK_USER = process.env.DEV_MOCK_AUTH === 'true' ? {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  openId: "dev-mock-user",
  role: "user" as const,
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
} : null;

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => {
      // DEV MODE: Return mock user for visual QA testing
      if (process.env.NODE_ENV === 'development' && DEV_MOCK_USER && !opts.ctx.user) {
        return DEV_MOCK_USER;
      }
      return opts.ctx.user;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  workspaces: workspacesRouter,
  goals: goalsRouter,
  todos: todosRouter,
  strategy: strategyRouter,
  chat: chatRouter,
  onboarding: onboardingRouter,
  stripe: stripeRouter,
  export: exportRouter,
  insights: insightsRouter,
  credits: creditsRouter,
  analytics: analyticsRouter,
  referrals: referralsRouter,
  notifications: notificationsRouter,
  account: accountRouter,
  playbooks: playbooksRouter,
});

export type AppRouter = typeof appRouter;
