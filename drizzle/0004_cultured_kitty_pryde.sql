-- 1. 외래 키 제약조건 삭제
ALTER TABLE "message_attachments" DROP CONSTRAINT "message_attachments_message_id_messages_id_fk";
ALTER TABLE "tool_invocations" DROP CONSTRAINT IF EXISTS "tool_invocations_message_id_messages_id_fk";

-- 2. 참조되는 테이블(messages)의 컬럼 타입 변경
ALTER TABLE "messages" ALTER COLUMN "id" SET DATA TYPE text;
ALTER TABLE "messages" ALTER COLUMN "id" DROP DEFAULT;

-- 3. 참조하는 테이블들의 컬럼 타입 변경
ALTER TABLE "message_attachments" ALTER COLUMN "message_id" SET DATA TYPE text;
ALTER TABLE "tool_invocations" ALTER COLUMN "message_id" SET DATA TYPE text;

-- 4. 외래 키 제약조건 다시 생성
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_message_id_messages_id_fk" 
    FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tool_invocations" ADD CONSTRAINT "tool_invocations_message_id_messages_id_fk" 
    FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;