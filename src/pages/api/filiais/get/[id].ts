import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/utils/serializeBigInt';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'ID Obrigatório.' });
    return;
  }

  try {
    const filial = await prisma.tb_filial.findUnique({
      where: { codigo_filial: Number(id) },
    });

    if (!filial) {
      res.status(404).json({ error: 'Filial não encontrada' });
      return;
    }

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json(serializeBigInt(filial));
  } catch (errors) {
    console.log((errors as Error).message);
    res.status(500).json((errors as Error).message);
  }
}
