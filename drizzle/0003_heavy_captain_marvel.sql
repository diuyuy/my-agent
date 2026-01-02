ALTER TABLE "message_attachments" DROP CONSTRAINT IF EXISTS "message_attachments_message_id_messages_id_fk";
ALTER TABLE "tool_invocations" DROP CONSTRAINT IF EXISTS "tool_invocations_message_id_messages_id_fk"; 

ALTER TABLE "messages" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;
ALTER TABLE "messages" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "message_attachments" ALTER COLUMN "message_id" SET DATA TYPE uuid USING "message_id"::uuid;
ALTER TABLE "tool_invocations" ALTER COLUMN "message_id" SET DATA TYPE uuid USING "message_id"::uuid;

ALTER TABLE "message_attachments" 
ADD CONSTRAINT "message_attachments_message_id_messages_id_fk" 
FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "tool_invocations" 
ADD CONSTRAINT "tool_invocations_message_id_messages_id_fk" 
FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;