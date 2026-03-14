CREATE TABLE "ActuationSchedule" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "actuatorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weekdays" TEXT[] NOT NULL,
    "startMinutes" INTEGER NOT NULL,
    "endMinutes" INTEGER NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActuationSchedule_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ActuationSchedule_clientId_idx" ON "ActuationSchedule"("clientId");
CREATE INDEX "ActuationSchedule_actuatorId_idx" ON "ActuationSchedule"("actuatorId");
CREATE INDEX "ActuationSchedule_enabled_idx" ON "ActuationSchedule"("enabled");

ALTER TABLE "ActuationSchedule"
ADD CONSTRAINT "ActuationSchedule_actuatorId_fkey"
FOREIGN KEY ("actuatorId") REFERENCES "Actuator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ActuationSchedule"
ADD CONSTRAINT "ActuationSchedule_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
