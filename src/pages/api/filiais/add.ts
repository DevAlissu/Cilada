import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/utils/serializeBigInt';
import { Filial } from '@/data/filiais/filiais';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const data: Filial = req.body;
  const saveData = {
    nome_filial: data.nome_filial,
  };

  try {
    const filial = await prisma.tb_filial.create({
      data: saveData,
    });

    res
      .status(201)
      .setHeader('Content-Type', 'application/json')
      .json({
        data: serializeBigInt(filial),
      });
  } catch (error) {
    console.error('Erro ao criar filial:', error);

    return res.status(500).json({
      message: 'Erro interno ao criar filial.',
      error: (error as Error).message, // se quiser enviar detalhes pro front (opcional)
    });
  }
}
