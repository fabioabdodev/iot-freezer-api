-- Add a dedicated name for the WhatsApp alert recipient.
ALTER TABLE "Client"
ADD COLUMN IF NOT EXISTS "alertContactName" TEXT;

-- Backfill using existing responsible names.
UPDATE "Client"
SET "adminName" = COALESCE(NULLIF(TRIM("adminName"), ''), NULLIF(TRIM("name"), ''), 'Contato principal')
WHERE "adminName" IS NULL OR TRIM("adminName") = '';

UPDATE "Client"
SET "alertContactName" = COALESCE(NULLIF(TRIM("alertContactName"), ''), NULLIF(TRIM("adminName"), ''), NULLIF(TRIM("name"), ''), 'Contato alertas')
WHERE "alertContactName" IS NULL OR TRIM("alertContactName") = '';

UPDATE "Client"
SET "adminPhone" = COALESCE(NULLIF(TRIM("adminPhone"), ''), NULLIF(TRIM("phone"), ''))
WHERE "adminPhone" IS NULL OR TRIM("adminPhone") = '';

UPDATE "Client"
SET "alertPhone" = COALESCE(NULLIF(TRIM("alertPhone"), ''), NULLIF(TRIM("adminPhone"), ''), NULLIF(TRIM("phone"), ''))
WHERE "alertPhone" IS NULL OR TRIM("alertPhone") = '';

-- If legacy data is still incomplete, fail loudly to prevent inconsistent runtime behavior.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Client"
    WHERE "adminName" IS NULL OR TRIM("adminName") = ''
  ) THEN
    RAISE EXCEPTION 'Client.adminName possui registros vazios. Preencha os nomes antes de aplicar esta migration.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "Client"
    WHERE "alertContactName" IS NULL OR TRIM("alertContactName") = ''
  ) THEN
    RAISE EXCEPTION 'Client.alertContactName possui registros vazios. Preencha os nomes antes de aplicar esta migration.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "Client"
    WHERE "adminPhone" IS NULL OR TRIM("adminPhone") = ''
  ) THEN
    RAISE EXCEPTION 'Client.adminPhone possui registros vazios. Preencha os telefones antes de aplicar esta migration.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "Client"
    WHERE "alertPhone" IS NULL OR TRIM("alertPhone") = ''
  ) THEN
    RAISE EXCEPTION 'Client.alertPhone possui registros vazios. Preencha os telefones antes de aplicar esta migration.';
  END IF;
END
$$;

ALTER TABLE "Client"
ALTER COLUMN "adminName" SET NOT NULL,
ALTER COLUMN "alertContactName" SET NOT NULL,
ALTER COLUMN "adminPhone" SET NOT NULL,
ALTER COLUMN "alertPhone" SET NOT NULL;