ALTER TABLE "document_resources" ALTER COLUMN "file_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."resource_type";--> statement-breakpoint
CREATE TYPE "public"."resource_type" AS ENUM('text', 'txt', 'pdf');--> statement-breakpoint
ALTER TABLE "document_resources" ALTER COLUMN "file_type" SET DATA TYPE "public"."resource_type" USING "file_type"::"public"."resource_type";