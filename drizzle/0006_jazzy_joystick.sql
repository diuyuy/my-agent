CREATE TABLE "document_resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"file_type" "file_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "document_chunks" ADD COLUMN "resource_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "document_resources" ADD CONSTRAINT "document_resources_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_document_resources_name" ON "document_resources" USING btree ("name");--> statement-breakpoint
ALTER TABLE "document_chunks" ADD CONSTRAINT "document_chunks_resource_id_document_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."document_resources"("id") ON DELETE cascade ON UPDATE no action;