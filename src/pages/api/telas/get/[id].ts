import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/utils/serializeBigInt';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'O ID da tela é obrigatório.' });
  }

  try {
    const tela = await prisma.tb_telas.findUnique({
      where: { CODIGO_TELA: Number(id) },
    });

    if (!tela) {
      return res.status(404).json({ error: 'Tela não encontrada.' });
    }

    return res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json(serializeBigInt(tela));
  } catch (error) {
    console.error('Erro ao buscar tela:', error);
    return res.status(500).json({ error: 'Erro ao buscar tela.' });
  }
}
