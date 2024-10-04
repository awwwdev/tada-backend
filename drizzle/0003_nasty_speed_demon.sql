ALTER TABLE "folder" ALTER COLUMN "show" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "folder" ALTER COLUMN "show" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "list" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "list" ALTER COLUMN "show" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "task_list" ALTER COLUMN "show" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "task_list" ALTER COLUMN "show" DROP NOT NULL;