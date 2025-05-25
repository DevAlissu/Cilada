import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    const funcoes = await prisma.tb_login_functions.findMany({
      orderBy: {
        descricao: 'asc',
      },
    });

    res.status(200).json(funcoes);
  } catch (error) {
    console.error('Erro ao buscar funções:', error);
    res.status(500).json({ error: 'Erro ao buscar funções.' });
  } finally {
    await prisma.$disconnect();
  }
}
