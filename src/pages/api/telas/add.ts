import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/utils/serializeBigInt';
import { Tela } from '@/data/telas/telas';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const data: Omit<Tela, 'CODIGO_TELA'> = req.body;

  try {
    // 1. Obter o último CODIGO_TELA existente
    const ultimoCodigo = await prisma.tb_telas.aggregate({
      _max: {
        CODIGO_TELA: true,
      },
    });

    const novoCodigo = (ultimoCodigo._max.CODIGO_TELA || 0) + 1;

    // 2. Preparar os dados para inserção
    const saveData = {
      CODIGO_TELA: novoCodigo,
      NOME_TELA: data.NOME_TELA,
      PATH_TELA: data.PATH_TELA,
    };

    // 3. Inserir a nova tela
    const tela = await prisma.tb_telas.create({
      data: saveData,
    });

    return res.status(201).json({
      data: serializeBigInt(tela),
    });
  } catch (error) {
    console.error('Erro ao criar tela:', error);

    return res.status(500).json({
      message: 'Erro interno ao criar tela.',
      error: (error as Error).message,
    });
  } finally {
    await prisma.$disconnect();
  }
}
