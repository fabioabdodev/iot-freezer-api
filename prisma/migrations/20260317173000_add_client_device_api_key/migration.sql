ALTER TABLE "Client"
ADD COLUMN "deviceApiKey" TEXT;

CREATE UNIQUE INDEX "Client_deviceApiKey_key" ON "Client"("deviceApiKey");
