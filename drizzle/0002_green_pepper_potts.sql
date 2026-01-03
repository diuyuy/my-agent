ALTER TABLE "message_attachments" DROP CONSTRAINT "message_attachments_message_id_messages_id_fk";--> statement-breakpoint
ALTER TABLE "tool_invocations" DROP CONSTRAINT IF EXISTS "tool_invocations_message_id_messages_id_fk";--> statement-breakpoint

ALTER TABLE "message_attachments" ALTER COLUMN "message_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tool_invocations" ALTER COLUMN "message_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "metadata" DROP NOT NULL;--> statement-breakpoint

ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tool_invocations" ADD CONSTRAINT "tool_invocations_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE;