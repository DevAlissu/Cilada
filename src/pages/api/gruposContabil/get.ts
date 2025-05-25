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
    // dbmarcasFindManyArgs
    const query: Prisma.dbgpprod_contabilFindManyArgs = {
      skip: (Number(page) - 1) * Number(perPage),
      take: Number(perPage),
      where: {
        descr: search
          ? {
              contains: search,
              mode: 'insensitive',
            }
          : undefined,
      },
    };

    const [gruposContabeis, count] = await prisma.$transaction([
      prisma.dbgpprod_contabil.findMany(query),
      prisma.dbgpprod_contabil.count({ where: query.where }),
    ]);

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({
        data: gruposContabeis,
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
