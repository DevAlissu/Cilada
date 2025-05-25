import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/utils/serializeBigInt';

import { Filial } from '@/data/filiais/filiais';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { codigo_filial, nome_filial }: Filial = req.body;
  if (!codigo_filial || !nome_filial) {
    res.status(400).json({ error: 'Nome filial são Obrigatórios.' });
    return;
  }

  try {
    const updatedFilial = await prisma.tb_filial.update({
      where: { codigo_filial: codigo_filial },
      data: {
        nome_filial: nome_filial,
      },
    });

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({ data: serializeBigInt(updatedFilial) });
  } catch (errors) {
    console.log((errors as Error).message);
    res.status(500).json((errors as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}
