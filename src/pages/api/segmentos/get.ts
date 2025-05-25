import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { GetParams } from '@/data/common/getParams';
import { Prisma } from '@prisma/client';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { page = 1, perPage = 10, search = '' }: GetParams = req.query;

  try {
    const query: Prisma.dbsegmentoFindManyArgs = {
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

    const [segmentos, count] = await prisma.$transaction([
      prisma.dbsegmento.findMany(query),
      prisma.dbsegmento.count({ where: query.where }),
    ]);

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({
        data: segmentos,
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
