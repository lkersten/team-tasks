ALTER TABLE "tasks" DROP CONSTRAINT "tasks_column_id_columns_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'todo';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "column_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "priority";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "due_date";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "order";