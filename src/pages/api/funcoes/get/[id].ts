import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

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
    const funcao = await prisma.tb_login_functions.findUnique({
      where: { id_functions: Number(id) },
    });

    if (!funcao) {
      res.status(404).json({ error: 'Função não encontrada' });
      return;
    }

    res.status(200).setHeader('Content-Type', 'application/json').json(funcao);
  } catch (errors) {
    console.log((errors as Error).message);
    res.status(500).json((errors as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}
