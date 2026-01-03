DROP INDEX "idx_conversation_title";--> statement-breakpoint
CREATE INDEX "idx_conversation_title_trgm" ON "conversations" USING gin ("title" gin_trgm_ops);