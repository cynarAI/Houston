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

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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
});

export type AppRouter = typeof appRouter;
