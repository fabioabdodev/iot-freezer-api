CREATE TABLE "AlertRule" (
  "id" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "deviceId" TEXT,
  "sensorType" TEXT NOT NULL,
  "minValue" DOUBLE PRECISION,
  "maxValue" DOUBLE PRECISION,
  "cooldownMinutes" INTEGER NOT NULL DEFAULT 5,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AlertRule_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AlertRule_clientId_idx" ON "AlertRule"("clientId");
CREATE INDEX "AlertRule_deviceId_idx" ON "AlertRule"("deviceId");
CREATE INDEX "AlertRule_sensorType_idx" ON "AlertRule"("sensorType");

ALTER TABLE "AlertRule"
ADD CONSTRAINT "AlertRule_clientId_fkey"
FOREIGN KEY ("clientId")
REFERENCES "Client"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "AlertRule"
ADD CONSTRAINT "AlertRule_deviceId_fkey"
FOREIGN KEY ("deviceId")
REFERENCES "Device"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

