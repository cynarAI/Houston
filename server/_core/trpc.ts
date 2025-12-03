import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { AppError, AppErrorCode } from "@shared/_core/errors";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  /**
   * Custom error formatter to ensure consistent error responses
   * and prevent leaking sensitive information to clients
   */
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // Include app error code if available
        appCode: error.cause instanceof AppError ? error.cause.code : undefined,
        // Include app error details if available (sanitized)
        details: error.cause instanceof AppError ? error.cause.details : undefined,
        // Never include stack traces in production
        stack: process.env.NODE_ENV === "development" ? shape.data.stack : undefined,
      },
    };
  },
});

export const router = t.router;

/**
 * Error handling middleware that:
 * - Converts AppError to TRPCError with appropriate codes
 * - Logs errors server-side for debugging
 * - Ensures no sensitive data leaks to clients
 */
const errorHandler = t.middleware(async ({ ctx, next, path }) => {
  try {
    return await next();
  } catch (error) {
    // Log the error server-side with context
    const userId = ctx.user?.id;
    console.error(`[tRPC Error] Path: ${path}, User: ${userId || 'anonymous'}`, error);

    // If it's already a TRPCError, just re-throw it
    if (error instanceof TRPCError) {
      throw error;
    }

    // Convert AppError to TRPCError with appropriate code
    if (error instanceof AppError) {
      const code = mapAppErrorToTRPCCode(error.code);
      throw new TRPCError({
        code,
        message: error.message,
        cause: error,
      });
    }

    // For unknown errors, log details but send generic message to client
    console.error("[tRPC Error] Unexpected error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});

/**
 * Map application error codes to tRPC error codes
 */
function mapAppErrorToTRPCCode(appCode: AppErrorCode): TRPCError["code"] {
  switch (appCode) {
    case AppErrorCode.INSUFFICIENT_CREDITS:
    case AppErrorCode.INVALID_CREDIT_AMOUNT:
    case AppErrorCode.VALIDATION_ERROR:
    case AppErrorCode.INVALID_INPUT:
      return "BAD_REQUEST";
    
    case AppErrorCode.RESOURCE_NOT_FOUND:
    case AppErrorCode.WORKSPACE_NOT_FOUND:
    case AppErrorCode.GOAL_NOT_FOUND:
    case AppErrorCode.TODO_NOT_FOUND:
    case AppErrorCode.SESSION_NOT_FOUND:
      return "NOT_FOUND";
    
    case AppErrorCode.ACCESS_DENIED:
    case AppErrorCode.OWNERSHIP_REQUIRED:
      return "FORBIDDEN";
    
    case AppErrorCode.WORKSPACE_LIMIT_REACHED:
    case AppErrorCode.CHAT_LIMIT_REACHED:
    case AppErrorCode.GOAL_LIMIT_REACHED:
      return "PRECONDITION_FAILED";
    
    case AppErrorCode.LLM_ERROR:
    case AppErrorCode.STRIPE_ERROR:
    case AppErrorCode.DATABASE_ERROR:
    case AppErrorCode.INTERNAL_ERROR:
    case AppErrorCode.UNKNOWN_ERROR:
    default:
      return "INTERNAL_SERVER_ERROR";
  }
}

// Base procedure with error handling
const baseProcedure = t.procedure.use(errorHandler);
export const publicProcedure = baseProcedure;

// Mock user for development testing (only active if DEV_MOCK_AUTH=true)
const DEV_MOCK_USER = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  openId: "dev-mock-user",
  role: "user" as const,
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  // DEV MODE: Inject mock user for visual QA testing
  // Enable with DEV_MOCK_AUTH=true in .env
  if (process.env.NODE_ENV === 'development' && 
      process.env.DEV_MOCK_AUTH === 'true' && 
      !ctx.user) {
    console.log('[DEV] Using mock user for testing');
    return next({
      ctx: {
        ...ctx,
        user: DEV_MOCK_USER,
      },
    });
  }

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = baseProcedure.use(requireUser);

export const adminProcedure = baseProcedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);
