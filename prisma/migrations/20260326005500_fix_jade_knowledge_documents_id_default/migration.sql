CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

ALTER TABLE "jade_knowledge_documents"
ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
