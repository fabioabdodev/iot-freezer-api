ALTER TABLE "Client"
ADD COLUMN "preferredLayout" TEXT NOT NULL DEFAULT 'client';

ALTER TABLE "User"
ADD COLUMN "preferredLayout" TEXT NOT NULL DEFAULT 'inherit';
