// lib/prismaClient.ts
import { PrismaClient } from '@prisma/client';

type PrismaMap = Record<string, PrismaClient>;

// Garante que a propriedade exista no globalThis
declare global {
  // @ts-expect-error: propriedade prismaConnections está definida via extensão de tipo global
  let prismaConnections: PrismaMap;
}

// Evita redefinição em dev (HMR)
// @ts-expect-error: propriedade prismaConnections está definida via extensão de tipo global
globalThis.prismaConnections = globalThis.prismaConnections || {};

export function getPrisma(filial: string): PrismaClient {
  const key = filial.toLowerCase();
  const dbUrl = process.env[`DATABASE_URL_${key.toUpperCase()}`];

  if (!dbUrl) {
    throw new Error(`DATABASE_URL_${key.toUpperCase()} não definida no .env`);
  }
  // @ts-expect-error: propriedade prismaConnections está definida via extensão de tipo global
  if (!globalThis.prismaConnections[key]) {
    // @ts-expect-error: propriedade prismaConnections está definida via extensão de tipo global
    globalThis.prismaConnections[key] = new PrismaClient({
      datasources: {
        db: {
          url: dbUrl.includes('connect_timeout')
            ? dbUrl
            : `${dbUrl}&connect_timeout=15`,
        },
      },
      log: ['error', 'warn'],
    });
  }
  // @ts-expect-error: propriedade prismaConnections está definida via extensão de tipo global
  return globalThis.prismaConnections[key];
}
