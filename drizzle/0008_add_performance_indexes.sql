-- Migration: Add Performance Indexes
-- Created: 2024-12-03
-- Purpose: Add missing indexes for commonly queried columns to improve query performance

-- Index for credit transactions: queries by userId sorted by createdAt
CREATE INDEX `idx_creditTransactions_userId_createdAt` 
ON `creditTransactions` (`userId`, `createdAt` DESC);

-- Index for chat messages: queries by sessionId
CREATE INDEX `idx_chatMessages_sessionId` 
ON `chatMessages` (`sessionId`);

-- Index for todos: queries by workspaceId with status filter
CREATE INDEX `idx_todos_workspaceId_status` 
ON `todos` (`workspaceId`, `status`);

-- Index for goals: queries by workspaceId with status filter
CREATE INDEX `idx_goals_workspaceId_status` 
ON `goals` (`workspaceId`, `status`);

-- Index for workspaces: queries by userId
CREATE INDEX `idx_workspaces_userId` 
ON `workspaces` (`userId`);

-- Index for notifications: queries by userId with unread filter
CREATE INDEX `idx_notifications_userId_isRead` 
ON `notifications` (`userId`, `isRead`);

-- Index for chat sessions: queries by workspaceId
CREATE INDEX `idx_chatSessions_workspaceId` 
ON `chatSessions` (`workspaceId`);

-- Index for user subscriptions: queries by userId with status
CREATE INDEX `idx_userSubscriptions_userId_status` 
ON `userSubscriptions` (`userId`, `status`);

-- Index for stripe payments: queries by userId sorted by createdAt
CREATE INDEX `idx_stripePayments_userId_createdAt` 
ON `stripePayments` (`userId`, `createdAt` DESC);

-- Index for referrals: queries by referrerId with status
CREATE INDEX `idx_referrals_referrerId_status` 
ON `referrals` (`referrerId`, `status`);

-- Index for plan limits: queries by userId
CREATE INDEX `idx_planLimits_userId` 
ON `planLimits` (`userId`);
