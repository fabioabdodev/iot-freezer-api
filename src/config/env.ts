import { envSchema } from './env.schema';

export function validateEnv(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.error('Erro nas variáveis de ambiente:', errors);
    throw new Error('Configuração de ambiente inválida');
  }

  return result.data;
}