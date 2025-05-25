import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; // Importe a instância global do Prisma
import { serializeBigInt } from '@/utils/serializeBigInt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const telas = await prisma.tb_telas.findMany({
      orderBy: {
        NOME_TELA: 'asc',
      },
    });
    return res.status(200).json(serializeBigInt(telas));
  } catch (error) {
    console.error('Erro ao buscar telas:', error);
    return res.status(500).json({ error: 'Erro ao buscar telas.' });
  } finally {
    await prisma.$disconnect();
  }
}
