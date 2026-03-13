CREATE TABLE "ClientModule" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "moduleKey" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientModule_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClientModule_clientId_moduleKey_key" ON "ClientModule"("clientId", "moduleKey");
CREATE INDEX "ClientModule_clientId_idx" ON "ClientModule"("clientId");

ALTER TABLE "ClientModule"
ADD CONSTRAINT "ClientModule_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Client"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
