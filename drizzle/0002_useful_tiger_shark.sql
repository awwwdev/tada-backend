ALTER TABLE "task" ALTER COLUMN "note" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "deleted" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "starred" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "pinned" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "archived" DROP NOT NULL;