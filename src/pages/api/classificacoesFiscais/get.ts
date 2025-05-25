import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import { getPrisma } from '@/lib/prismaClient';

import { GetParams } from '@/data/common/getParams';
import { Prisma } from '@prisma/client';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const cookies = parseCookies({ req });
  const filial = cookies.filial_melo;

  if (!filial) {
    return res.status(400).json({ error: 'Filial não informada no cookie' });
  }

  const prisma = getPrisma(filial);

  const { page = 1, perPage = 10, search = '' }: GetParams = req.query;

  try {
    const query: Prisma.dbclassificacao_fiscalFindManyArgs = {
      skip: (Number(page) - 1) * Number(perPage),
      take: Number(perPage),
      where: {
        ncm: search
          ? {
              contains: search,
              mode: 'insensitive',
            }
          : undefined,
      },
    };

    const [classificacoesFiscais, count] = await prisma.$transaction([
      prisma.dbclassificacao_fiscal.findMany(query),
      prisma.dbclassificacao_fiscal.count({ where: query.where }),
    ]);

    res.status(200).json({
      data: classificacoesFiscais,
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
