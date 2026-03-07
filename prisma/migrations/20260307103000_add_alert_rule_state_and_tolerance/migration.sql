ALTER TABLE "AlertRule"
ADD COLUMN "toleranceMinutes" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "AlertRuleState" (
  "id" TEXT NOT NULL,
  "ruleId" TEXT NOT NULL,
  "deviceId" TEXT NOT NULL,
  "breachStartedAt" TIMESTAMP(3),
  "lastTriggeredAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AlertRuleState_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AlertRuleState_ruleId_deviceId_key" ON "AlertRuleState"("ruleId", "deviceId");
CREATE INDEX "AlertRuleState_ruleId_idx" ON "AlertRuleState"("ruleId");
CREATE INDEX "AlertRuleState_deviceId_idx" ON "AlertRuleState"("deviceId");

ALTER TABLE "AlertRuleState"
ADD CONSTRAINT "AlertRuleState_ruleId_fkey"
FOREIGN KEY ("ruleId")
REFERENCES "AlertRule"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "AlertRuleState"
ADD CONSTRAINT "AlertRuleState_deviceId_fkey"
FOREIGN KEY ("deviceId")
REFERENCES "Device"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

