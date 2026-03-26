CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

CREATE TABLE "jade_knowledge_documents" (
  "id" TEXT NOT NULL,
  "doc_id" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "embedding" extensions.vector(1536),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "jade_knowledge_documents_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "jade_knowledge_documents_doc_id_idx" ON "jade_knowledge_documents"("doc_id");
CREATE INDEX "jade_knowledge_documents_topic_idx" ON "jade_knowledge_documents"("topic");
CREATE INDEX "jade_knowledge_documents_embedding_idx"
ON "jade_knowledge_documents"
USING hnsw ("embedding" extensions.vector_cosine_ops);

CREATE OR REPLACE FUNCTION match_jade_knowledge_documents(
  query_embedding extensions.vector(1536),
  match_count int DEFAULT 10,
  filter jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  id text,
  doc_id text,
  topic text,
  title text,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql
AS $$
  SELECT
    d.id,
    d.doc_id,
    d.topic,
    d.title,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM jade_knowledge_documents d
  WHERE d.metadata @> filter
  ORDER BY d.embedding <=> query_embedding
  LIMIT LEAST(match_count, 200);
$$;
