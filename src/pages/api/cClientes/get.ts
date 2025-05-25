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
    const query: Prisma.dbcclienFindManyArgs = {
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

    const [classes, count] = await prisma.$transaction([
      prisma.dbcclien.findMany(query),
      prisma.dbcclien.count({ where: query.where }),
    ]);

    // Ordenação opcional por código (numérico)
    classes.sort((a, b) => Number(a.codcc) - Number(b.codcc));

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({
        data: classes,
        meta: {
          total: count,
          lastPage: count > 0 ? Math.ceil(count / Number(perPage)) : 1,
          currentPage: count > 0 ? Number(page) : 1,
          perPage: Number(perPage),
        },
      });
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
}
