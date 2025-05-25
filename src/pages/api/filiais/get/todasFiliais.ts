import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/utils/serializeBigInt';
import { GetParams } from '@/data/common/getParams';
import { Prisma } from '@prisma/client';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { search = '' }: GetParams = req.query;

  try {
    const query: Prisma.tb_filialFindManyArgs = {
      where: {
        nome_filial: search
          ? {
              contains: search,
              mode: 'insensitive',
            }
          : undefined,
      },
    };

    const filiais = await prisma.tb_filial.findMany(query);

    return res.status(200).json(
      serializeBigInt({
        data: filiais,
      }),
    );
  } catch (error) {
    console.error('Erro ao buscar filiais:', (error as Error).message);
    res.status(500).json({
      message: 'Erro ao buscar filiais. Tente novamente ou contate o suporte.',
      error: (error as Error).message,
    });
  }
}
