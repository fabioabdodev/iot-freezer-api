CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS "jade_knowledge_registry" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "google_doc_id" TEXT NOT NULL,
  "doc_topic" TEXT NOT NULL,
  "doc_title" TEXT NOT NULL,
  "source_updated_at" TIMESTAMPTZ,
  "content_hash" TEXT NOT NULL,
  "chunk_count" INTEGER NOT NULL DEFAULT 0,
  "vector_document_count" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "last_ingested_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "jade_knowledge_registry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "jade_knowledge_registry_google_doc_id_key"
  ON "jade_knowledge_registry"("google_doc_id");

CREATE INDEX IF NOT EXISTS "jade_knowledge_registry_doc_topic_idx"
  ON "jade_knowledge_registry"("doc_topic");

CREATE INDEX IF NOT EXISTS "jade_knowledge_registry_active_idx"
  ON "jade_knowledge_registry"("active");
