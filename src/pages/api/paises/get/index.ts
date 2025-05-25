import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { GetParams } from '@/data/common/getParams';
import { Prisma } from '@prisma/client';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { page = 1, perPage = 999, search = '' }: GetParams = req.query;

  try {
    const query: Prisma.dbpaisFindManyArgs = {
      skip: (Number(page) - 1) * Number(perPage),
      take: Number(perPage),
      where: {
        descricao: search
          ? {
              contains: search,
              mode: 'insensitive',
            }
          : undefined,
      },
    };

    const [paises, count] = await prisma.$transaction([
      prisma.dbpais.findMany(query),
      prisma.dbpais.count({ where: query.where }),
    ]);

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({
        data: paises,
        meta: {
          total: count,
          lastPage: count > 0 ? Math.ceil(count / Number(perPage)) : 1,
          currentPage: count > 0 ? Number(page) : 1,
          perPage: Number(perPage),
        },
      });
  } catch (error) {
    console.log((error as Error).message);

    res.status(500).json({ error: (error as Error).message });
  }
}
