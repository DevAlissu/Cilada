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
    const query: Prisma.tb_login_filiaisFindManyArgs = {
      skip: (Number(page) - 1) * Number(perPage),
      take: Number(perPage),
      where: {
        login_user_login: search
          ? {
              contains: search,
              mode: 'insensitive',
            }
          : undefined,
      },
    };

    const [usuariosFilial, count] = await prisma.$transaction([
      prisma.tb_login_filiais.findMany(query),
      prisma.tb_login_filiais.count({ where: query.where }),
    ]);

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({
        data: usuariosFilial,
        meta: {
          total: count,
          lastPage: count > 0 ? Math.ceil(count / Number(perPage)) : 1,
          currentPage: count > 0 ? Number(page) : 1,
          perPage: Number(perPage),
        },
      });
  } catch (errors) {
    console.log(errors);
    res.json('erro');
  } finally {
    await prisma.$disconnect();
  }
}
