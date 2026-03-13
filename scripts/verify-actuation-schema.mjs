#!/usr/bin/env node

if (process.env.DIRECT_DATABASE_URL?.trim()) {
  process.env.DATABASE_URL = process.env.DIRECT_DATABASE_URL.trim();
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = new Set(process.argv.slice(2));
const expectedMigration = '20260313013000_create_actuation_module';

function printHelp() {
  console.log(`
Verificacao do schema do modulo de acionamento

Uso:
  npm run db:verify-actuation

O que o script verifica:
  - conectividade com o banco configurado em DIRECT_DATABASE_URL ou DATABASE_URL
  - existencia da migration ${expectedMigration}
  - existencia das tabelas Actuator e ActuationCommand

Opcoes:
  --help     Exibe esta ajuda
`.trim());
}

async function tableExists(tableName) {
  const result = await prisma.$queryRawUnsafe(
    `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = $1
      ) AS "exists"
    `,
    tableName,
  );

  return Array.isArray(result) && result[0]?.exists === true;
}

async function migrationExists(migrationName) {
  const result = await prisma.$queryRawUnsafe(
    `
      SELECT migration_name
      FROM "_prisma_migrations"
      WHERE migration_name = $1
      LIMIT 1
    `,
    migrationName,
  );

  return Array.isArray(result) && result.length > 0;
}

async function main() {
  if (args.has('--help')) {
    printHelp();
    return;
  }

  console.log(
    `[verify-actuation] verificando banco configurado em ${process.env.DIRECT_DATABASE_URL ? 'DIRECT_DATABASE_URL' : 'DATABASE_URL'}...`,
  );

  const migrationApplied = await migrationExists(expectedMigration);
  const actuatorTable = await tableExists('Actuator');
  const commandTable = await tableExists('ActuationCommand');

  console.log(
    `[verify-actuation] migration ${expectedMigration}: ${migrationApplied ? 'ok' : 'ausente'}`,
  );
  console.log(
    `[verify-actuation] tabela Actuator: ${actuatorTable ? 'ok' : 'ausente'}`,
  );
  console.log(
    `[verify-actuation] tabela ActuationCommand: ${commandTable ? 'ok' : 'ausente'}`,
  );

  if (!migrationApplied || !actuatorTable || !commandTable) {
    console.error(
      '[verify-actuation] validacao incompleta. Revise migrate deploy e o estado real do banco.',
    );
    process.exitCode = 1;
    return;
  }

  console.log('[verify-actuation] modulo de acionamento confirmado no banco.');
}

main()
  .catch((error) => {
    console.error('[verify-actuation] falha na verificacao:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
