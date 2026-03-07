-- Add optional client owner to devices to support future multi-tenant isolation.
ALTER TABLE "Device"
ADD COLUMN "clientId" TEXT;

CREATE INDEX "Device_clientId_idx" ON "Device"("clientId");

