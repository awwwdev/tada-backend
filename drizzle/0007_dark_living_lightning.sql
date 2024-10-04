DO $$ BEGIN
 CREATE TYPE "public"."task_status" AS ENUM('to-do', 'done');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "task_status" "task_status";