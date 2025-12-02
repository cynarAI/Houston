import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Credit system fields
  credits: int("credits").default(50).notNull(), // Current credit balance
  lifetimeCreditsUsed: int("lifetimeCreditsUsed").default(0).notNull(), // Total credits consumed
  lastTopupAt: timestamp("lastTopupAt"), // Last time credits were added
  // Referral system fields
  referralCode: varchar("referralCode", { length: 20 }).unique(), // User's own referral code (e.g., "HOUSTON-ABC123")
  referredBy: int("referredBy"), // User ID of referrer (no FK to allow deletion)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Workspace table - each user can have multiple workspaces (based on plan)
 */
export const workspaces = mysqlTable("workspaces", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  industry: varchar("industry", { length: 100 }),
  companySize: varchar("companySize", { length: 50 }),
  targetAudience: text("targetAudience"),
  products: text("products"),
  marketingChannels: text("marketingChannels"),
  monthlyBudget: varchar("monthlyBudget", { length: 50 }),
  challenges: text("challenges"),
  onboardingCompleted: int("onboardingCompleted").default(0).notNull(), // 0 = false, 1 = true
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Workspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = typeof workspaces.$inferInsert;

/**
 * Goals table - SMART goals for each workspace
 */
export const goals = mysqlTable("goals", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  specific: text("specific"),
  measurable: text("measurable"),
  achievable: text("achievable"),
  relevant: text("relevant"),
  timeBound: text("timeBound"),
  progress: int("progress").default(0).notNull(), // 0-100
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  status: mysqlEnum("status", ["active", "completed", "archived"]).default("active").notNull(),
  deadline: timestamp("deadline"), // Optional deadline for goal completion
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;

/**
 * Strategy table - marketing strategy for each workspace
 */
export const strategies = mysqlTable("strategies", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  positioning: text("positioning"),
  personas: text("personas"), // JSON array
  coreMessages: text("coreMessages"), // JSON array
  channels: text("channels"), // JSON array
  contentPillars: text("contentPillars"), // JSON array
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Strategy = typeof strategies.$inferSelect;
export type InsertStrategy = typeof strategies.$inferInsert;

/**
 * Todos table - actionable tasks for each workspace
 */
export const todos = mysqlTable("todos", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  goalId: int("goalId").references(() => goals.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["todo", "in_progress", "done"]).default("todo").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Todo = typeof todos.$inferSelect;
export type InsertTodo = typeof todos.$inferInsert;

/**
 * Chat sessions table - conversation sessions with the coach
 */
export const chatSessions = mysqlTable("chatSessions", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;

/**
 * Chat messages table - individual messages in chat sessions
 */
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull().references(() => chatSessions.id, { onDelete: "cascade" }),
  role: mysqlEnum("role", ["user", "coach"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * Plan limits table - track usage limits for Satellite/Rocket plans
 */
export const planLimits = mysqlTable("planLimits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  plan: mysqlEnum("plan", ["satellite", "rocket"]).default("satellite").notNull(),
  maxWorkspaces: int("maxWorkspaces").default(1).notNull(),
  maxChatsPerMonth: int("maxChatsPerMonth").default(20).notNull(),
  chatsUsedThisMonth: int("chatsUsedThisMonth").default(0).notNull(),
  maxGoals: int("maxGoals").default(3).notNull(),
  maxTodos: int("maxTodos").default(10).notNull(),
  periodStart: timestamp("periodStart").defaultNow().notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlanLimit = typeof planLimits.$inferSelect;
export type InsertPlanLimit = typeof planLimits.$inferInsert;

/**
 * Onboarding data table - stores user's initial setup information
 */
export const onboardingData = mysqlTable("onboardingData", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  // Step 1: Company Info
  companyName: varchar("companyName", { length: 255 }),
  industry: varchar("industry", { length: 100 }),
  companySize: mysqlEnum("companySize", ["1-10", "11-50", "51-200", "201-1000", "1000+"]),
  website: varchar("website", { length: 500 }),
  // Step 2: Marketing Goals
  primaryGoal: mysqlEnum("primaryGoal", ["brand_awareness", "lead_generation", "sales_conversion", "customer_retention", "market_expansion"]),
  secondaryGoals: text("secondaryGoals"), // JSON array
  monthlyBudget: mysqlEnum("monthlyBudget", ["<1000", "1000-5000", "5000-10000", "10000-50000", "50000+"]),
  // Step 3: Target Audience
  targetAudience: text("targetAudience"), // JSON: { demographics, painPoints, channels }
  currentChallenges: text("currentChallenges"), // JSON array
  // Completion tracking
  completed: int("completed").default(0).notNull(), // 0 = false, 1 = true
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OnboardingData = typeof onboardingData.$inferSelect;
export type InsertOnboardingData = typeof onboardingData.$inferInsert;

/**
 * Credit transactions table - logs all credit changes for audit and analytics
 */
export const creditTransactions = mysqlTable("creditTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  featureKey: varchar("featureKey", { length: 100 }).notNull(), // e.g., "chat_deep_analysis", "goals_generation"
  creditsSpent: int("creditsSpent").notNull(), // Negative for deductions, positive for grants
  balanceBefore: int("balanceBefore").notNull(),
  balanceAfter: int("balanceAfter").notNull(),
  metadata: text("metadata"), // JSON: optional context (sessionId, goalId, etc.)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = typeof creditTransactions.$inferInsert;

/**
 * Credit plans table - defines available subscription plans
 */
export const creditPlans = mysqlTable("creditPlans", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 50 }).notNull().unique(), // e.g., "orbit_pack", "galaxy_pack"
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  monthlyCredits: int("monthlyCredits").notNull(),
  priceMonthly: int("priceMonthly").notNull(), // Price in cents
  isRecurring: int("isRecurring").default(1).notNull(), // 1 = true (subscription), 0 = false
  recommendedFor: text("recommendedFor"),
  features: text("features"), // JSON array of feature descriptions
  active: int("active").default(1).notNull(), // 1 = active, 0 = inactive
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CreditPlan = typeof creditPlans.$inferSelect;
export type InsertCreditPlan = typeof creditPlans.$inferInsert;

/**
 * Credit topups table - defines one-time credit purchases
 */
export const creditTopups = mysqlTable("creditTopups", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 50 }).notNull().unique(), // e.g., "mini_booster", "power_booster"
  name: varchar("name", { length: 100 }).notNull(),
  credits: int("credits").notNull(),
  price: int("price").notNull(), // Price in cents
  active: int("active").default(1).notNull(), // 1 = active, 0 = inactive
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditTopup = typeof creditTopups.$inferSelect;
export type InsertCreditTopup = typeof creditTopups.$inferInsert;

/**
 * User subscriptions table - tracks user's active subscriptions
 */
export const userSubscriptions = mysqlTable("userSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: int("planId").notNull().references(() => creditPlans.id, { onDelete: "restrict" }),
  status: mysqlEnum("status", ["active", "canceled", "expired"]).default("active").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: int("cancelAtPeriodEnd").default(0).notNull(), // 0 = false, 1 = true
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;

/**
 * Stripe payments table - tracks all payment transactions
 */
export const stripePayments = mysqlTable("stripePayments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }).notNull().unique(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  amount: int("amount").notNull(), // Amount in cents (e.g., 999 for €9.99)
  currency: varchar("currency", { length: 3 }).default("eur").notNull(),
  credits: int("credits").notNull(), // Credits purchased
  productType: mysqlEnum("productType", ["plan", "topup"]).notNull(),
  productKey: varchar("productKey", { length: 50 }).notNull(), // e.g., "orbit_pack", "mini_booster"
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type StripePayment = typeof stripePayments.$inferSelect;
export type InsertStripePayment = typeof stripePayments.$inferInsert;

/**
 * Referrals table - tracks referral relationships and rewards
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull().references(() => users.id, { onDelete: "cascade" }),
  refereeId: int("refereeId").references(() => users.id, { onDelete: "set null" }), // null if not signed up yet
  referralCode: varchar("referralCode", { length: 20 }).notNull(), // e.g., "HOUSTON-ABC123"
  status: mysqlEnum("status", ["pending", "completed", "rewarded"]).default("pending").notNull(),
  bonusCredits: int("bonusCredits").default(25).notNull(),
  rewardedAt: timestamp("rewardedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Notifications table - stores user notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", [
    "credit_warning",
    "purchase_success", 
    "referral_reward",
    "goal_reminder",
    "system_message"
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: int("isRead").default(0).notNull(), // 0 = unread, 1 = read
  metadata: text("metadata"), // JSON string for additional data (e.g., creditAmount, goalId)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
