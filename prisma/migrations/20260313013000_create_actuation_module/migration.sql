CREATE TABLE "Actuator" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "deviceId" TEXT,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "currentState" TEXT NOT NULL DEFAULT 'off',
    "lastCommandAt" TIMESTAMP(3),
    "lastCommandBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Actuator_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ActuationCommand" (
    "id" TEXT NOT NULL,
    "actuatorId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "desiredState" TEXT NOT NULL,
    "source" TEXT,
    "note" TEXT,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActuationCommand_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Actuator_clientId_idx" ON "Actuator"("clientId");
CREATE INDEX "Actuator_deviceId_idx" ON "Actuator"("deviceId");
CREATE INDEX "ActuationCommand_actuatorId_executedAt_idx" ON "ActuationCommand"("actuatorId", "executedAt");
CREATE INDEX "ActuationCommand_clientId_executedAt_idx" ON "ActuationCommand"("clientId", "executedAt");

ALTER TABLE "Actuator"
ADD CONSTRAINT "Actuator_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Client"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Actuator"
ADD CONSTRAINT "Actuator_deviceId_fkey"
FOREIGN KEY ("deviceId") REFERENCES "Device"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ActuationCommand"
ADD CONSTRAINT "ActuationCommand_actuatorId_fkey"
FOREIGN KEY ("actuatorId") REFERENCES "Actuator"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ActuationCommand"
ADD CONSTRAINT "ActuationCommand_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Client"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
