// src/pages/api/requisicoesCompra/get/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { GetParams } from '@/data/common/getParams';
import { Prisma } from '@prisma/client';

export default async function handleCompras(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { page = 1, perPage = 10, search = '' }: GetParams = req.query;

  try {
    const skip = (Number(page) - 1) * Number(perPage);
    const take = Number(perPage);

    const whereClause: Prisma.DbcomprasWhereInput = search
      ? {
          OR: [
            { ordemCompra: { contains: search, mode: 'insensitive' } },
            { requisicao: { contains: search, mode: 'insensitive' } },
            { fornecedorNome: { contains: search, mode: 'insensitive' } },
            { compradorNome: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const queryArgs: Prisma.DbcomprasFindManyArgs = {
      skip,
      take,
      where: whereClause,
      orderBy: {
        dataOrdem: 'desc',
      },
    };

    const [compras, count] = await prisma.$transaction([
      prisma.dbcompras.findMany(queryArgs),
      prisma.dbcompras.count({ where: queryArgs.where }),
    ]);

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({
        data: compras,
        meta: {
          total: count,
          lastPage: count > 0 ? Math.ceil(count / Number(perPage)) : 1,
          currentPage: count > 0 ? Number(page) : 1,
          perPage: Number(perPage),
        },
      });
  } catch (error) {
    console.error('Erro ao buscar compras:', (error as Error).message);
    res.status(500).json({
      error: 'Falha ao buscar dados de compras.',
      details: (error as Error).message,
    });
  }
}
