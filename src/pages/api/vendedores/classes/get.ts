import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { Prisma } from '@prisma/client';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { page = 1, perPage = 10, search = '' } = req.query;

  try {
    const query: Prisma.dbclassevendedorFindManyArgs = {
      skip: (Number(page) - 1) * Number(perPage),
      take: Number(perPage),
      where: {
        OR: search
          ? [
              {
                codcv: {
                  contains: String(search),
                  mode: 'insensitive',
                },
              },
              {
                descr: {
                  contains: String(search),
                  mode: 'insensitive',
                },
              },
            ]
          : undefined,
      },
    };

    const [classesVendedor, count] = await prisma.$transaction([
      prisma.dbclassevendedor.findMany(query),
      prisma.dbclassevendedor.count({ where: query.where }),
    ]);

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({
        data: classesVendedor,
        meta: {
          total: count,
          lastPage: count > 0 ? Math.ceil(count / Number(perPage)) : 1,
          currentPage: count > 0 ? Number(page) : 1,
          perPage: Number(perPage),
        },
      });
  } catch (errors) {
    console.log((errors as Error).message);
    res.json((errors as Error).message);
  }
}
