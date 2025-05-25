import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; // Importe a instância global do Prisma
import { serializeBigInt } from '@/utils/serializeBigInt';
import { GetParams } from '@/data/common/getParams';
import { Prisma } from '@prisma/client';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { page = 1, perPage = 10, search = '' }: GetParams = req.query;

  try {
    const query: Prisma.tb_telasFindManyArgs = {
      skip: (Number(page) - 1) * Number(perPage),
      take: Number(perPage),
      where: {
        OR: [
          {
            NOME_TELA: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            PATH_TELA: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        NOME_TELA: 'asc', // Mantendo a ordenação por nome
      },
    };

    const telas = await prisma.tb_telas.findMany(query);

    const count = await prisma.tb_telas.count({ where: query.where });

    return res.status(200).json(
      serializeBigInt({
        data: telas,
        meta: {
          total: count,
          lastPage: count > 0 ? Math.ceil(count / Number(perPage)) : 1,
          currentPage: count > 0 ? Number(page) : 1,
          perPage: Number(perPage),
        },
      }),
    );
  } catch (error) {
    console.error('Erro ao buscar telas:', error);
    return res.status(500).json({ error: 'Erro ao buscar telas.' });
  } finally {
    await prisma.$disconnect();
  }
}
