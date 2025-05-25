import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

import { GetParams } from '@/data/common/getParams';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { page = 1, perPage = 10, search = '' }: GetParams = req.query;

  try {
    const query: Prisma.tb_login_perfilFindManyArgs = {
      skip: (Number(page) - 1) * Number(perPage),
      take: Number(perPage),
      where: {
        login_perfil_name: search
          ? {
              contains: search,
              mode: 'insensitive',
            }
          : undefined,
      },
    };

    const [perfis, count] = await prisma.$transaction([
      prisma.tb_login_perfil.findMany(query),
      prisma.tb_login_perfil.count({ where: query.where }),
    ]);

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({
        data: perfis,
        meta: {
          total: count,
          lastPage: count > 0 ? Math.ceil(count / Number(perPage)) : 1,
          currentPage: count > 0 ? Number(page) : 1,
          perPage: Number(perPage),
        },
      });
  } catch (errors) {
    console.error('Erro ao buscar perfis:', errors);
    res.status(500).json({ error: 'Erro ao buscar perfis' });
  } finally {
    await prisma.$disconnect();
  }
}
