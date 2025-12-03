CREATE TABLE `contentLibrary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`category` enum('hook','post','email','ad','other') NOT NULL DEFAULT 'other',
	`tags` text,
	`sourceChatId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentLibrary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `strategies` ADD `brandVoice` text;--> statement-breakpoint
ALTER TABLE `strategies` ADD `pitchDeck` text;--> statement-breakpoint
ALTER TABLE `contentLibrary` ADD CONSTRAINT `contentLibrary_workspaceId_workspaces_id_fk` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contentLibrary` ADD CONSTRAINT `contentLibrary_sourceChatId_chatMessages_id_fk` FOREIGN KEY (`sourceChatId`) REFERENCES `chatMessages`(`id`) ON DELETE set null ON UPDATE no action;