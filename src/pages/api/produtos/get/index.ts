import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { Prisma } from '@prisma/client';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { page = 1, perPage = 10, search = '' } = req.query;

  try {
    const currentPage = Number(page);
    const itemsPerPage = Number(perPage);

    const whereClause: Prisma.dbprodWhereInput | undefined = search
      ? {
          OR: [
            {
              codprod: {
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
          ],
        }
      : undefined;

    const [produtos, count] = await prisma.$transaction([
      prisma.dbprod.findMany({
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
        where: whereClause,
      }),
      prisma.dbprod.count({ where: whereClause }),
    ]);

    res.status(200).json({
      data: produtos,
      meta: {
        total: count,
        lastPage: Math.max(1, Math.ceil(count / itemsPerPage)),
        currentPage: Math.max(1, currentPage),
        perPage: itemsPerPage,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  } finally {
    await prisma.$disconnect();
  }
}
