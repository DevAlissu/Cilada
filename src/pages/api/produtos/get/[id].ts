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
    const produto = await prisma.dbprod.findUnique({
      where: { codprod: id as string },
    });

    if (!produto) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }

    res.status(200).setHeader('Content-Type', 'application/json').json(produto);
  } catch (errors) {
    console.log((errors as Error).message);
    res.status(500).json((errors as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}
