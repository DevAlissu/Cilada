import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/utils/serializeBigInt';

import { Tela } from '@/data/telas/telas';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { CODIGO_TELA, NOME_TELA, PATH_TELA }: Tela = req.body;

  if (!CODIGO_TELA || !NOME_TELA || !PATH_TELA) {
    return res
      .status(400)
      .json({ error: 'Código, nome e caminho da tela são obrigatórios.' });
  }

  try {
    const updatedTela = await prisma.tb_telas.update({
      where: { CODIGO_TELA: CODIGO_TELA },
      data: {
        NOME_TELA: NOME_TELA,
        PATH_TELA: PATH_TELA,
      },
    });

    return res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({ data: serializeBigInt(updatedTela) });
  } catch (error) {
    console.error('Erro ao atualizar tela:', error);
    return res.status(500).json({ error: 'Erro ao atualizar tela.' });
  } finally {
    await prisma.$disconnect();
  }
}
