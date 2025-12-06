import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions,
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  if (!user && process.env.DEV_MOCK_AUTH === "true") {
    user = {
      id: -1,
      openId: "mock-user",
      name: "Mock User",
      email: "mock@example.com",
      loginMethod: "mock",
      role: "user",
      credits: 9999,
      lifetimeCreditsUsed: 0,
      lastTopupAt: null,
      referralCode: null,
      referredBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
