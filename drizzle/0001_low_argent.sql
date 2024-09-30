ALTER TABLE "user" ALTER COLUMN "password_hash" SET DATA TYPE bytea USING CAST("password_hash" AS bytea);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "salt" SET DATA TYPE bytea USING CAST("salt" AS bytea);--> statement-breakpoint
ALTER TABLE "folder" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "folder" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "list" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "list" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "Settings" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "Settings" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "task_list" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "task_list" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp;