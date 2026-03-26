CREATE OR REPLACE FUNCTION set_jade_knowledge_documents_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS jade_knowledge_documents_set_updated_at
ON "jade_knowledge_documents";

CREATE TRIGGER jade_knowledge_documents_set_updated_at
BEFORE UPDATE ON "jade_knowledge_documents"
FOR EACH ROW
EXECUTE FUNCTION set_jade_knowledge_documents_updated_at();

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
  WHERE d.embedding IS NOT NULL
    AND d.metadata @> filter
  ORDER BY d.embedding <=> query_embedding
  LIMIT LEAST(match_count, 200);
$$;
