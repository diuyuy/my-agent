import { MyUIMessage } from "@/server/features/ai/ai.schemas";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { fileTypeEnum, messageRoleEnum } from "./enums";

// Tables
export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_conversation_title_trgm").using(
      "gin",
      table.title.op("gin_trgm_ops")
    ),
    index("idx_conversation_updated_at").on(table.updatedAt),
  ]
);

export const favoriteConversations = pgTable(
  "favorite_conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    conversationId: uuid("conversation_id").references(() => conversations.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique("unique_user_conversation").on(table.userId, table.conversationId),
  ]
);

export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: messageRoleEnum("role").notNull(),
    metadata: jsonb("metadata").$type<MyUIMessage["metadata"]>(),
    parts: jsonb("parts").$type<MyUIMessage["parts"]>().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("idx_messages_created_at").on(table.createdAt)]
);

export const messageAttachments = pgTable("message_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: text("message_id")
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
  fileType: fileTypeEnum("file_type").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  fileName: text("file_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const toolInvocations = pgTable("tool_invocations", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: text("message_id")
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
  toolName: text("tool_name").notNull(),
  arguments: jsonb("arguments"),
  output: jsonb("output"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const documentResources = pgTable(
  "document_resources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    fileType: fileTypeEnum("file_type").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("idx_document_resources_name").on(table.name)]
);

export const documentChunks = pgTable(
  "document_chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    resourceId: uuid("resource_id")
      .notNull()
      .references(() => documentResources.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    tag: text("tag"), // 문서 필터링 용 태그
    embedding: vector("embedding", { dimensions: 1536 }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("ip_index").using("hnsw", table.embedding.op("vector_ip_ops")),
  ]
);
