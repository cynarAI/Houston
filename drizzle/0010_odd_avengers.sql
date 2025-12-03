ALTER TABLE `creditTransactions` ADD `promptTokens` int;--> statement-breakpoint
ALTER TABLE `creditTransactions` ADD `completionTokens` int;--> statement-breakpoint
ALTER TABLE `creditTransactions` ADD `model` varchar(100);