CREATE TABLE `onboardingData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` varchar(255),
	`industry` varchar(100),
	`companySize` enum('1-10','11-50','51-200','201-1000','1000+'),
	`website` varchar(500),
	`primaryGoal` enum('brand_awareness','lead_generation','sales_conversion','customer_retention','market_expansion'),
	`secondaryGoals` text,
	`monthlyBudget` enum('<1000','1000-5000','5000-10000','10000-50000','50000+'),
	`targetAudience` text,
	`currentChallenges` text,
	`completed` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `onboardingData_id` PRIMARY KEY(`id`),
	CONSTRAINT `onboardingData_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `onboardingData` ADD CONSTRAINT `onboardingData_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;