// src/pages/api/requisicoesCompra/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const rawFilter = req.query.filter;
  const filter =
    typeof rawFilter === 'string'
      ? rawFilter
      : Array.isArray(rawFilter)
      ? rawFilter[0]
      : '';

  const where: Prisma.DbcomprasWhereInput = filter
    ? {
        OR: [
          { ordemCompra: { contains: filter, mode: 'insensitive' } },
          { requisicao: { contains: filter, mode: 'insensitive' } },
          { fornecedorNome: { contains: filter, mode: 'insensitive' } },
          { compradorNome: { contains: filter, mode: 'insensitive' } },
        ],
      }
    : {};

  try {
    const data = await prisma.dbcompras.findMany({
      where,
      orderBy: { dataOrdem: 'desc' },
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao buscar requisições de compra:', error);
    return res.status(500).json({
      error: 'Erro ao buscar requisições de compra.',
      details: (error as Error).message,
    });
  }
}
