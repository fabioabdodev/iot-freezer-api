ALTER TABLE "jade_contacts"
ADD COLUMN IF NOT EXISTS "interest_topics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE INDEX IF NOT EXISTS "idx_jade_contacts_interest_topics"
ON "jade_contacts" USING GIN ("interest_topics");
