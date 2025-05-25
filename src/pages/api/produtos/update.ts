import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { Produto } from '@/data/produtos/produtos';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const produto: Produto = req.body;

  if (!produto) {
    res.status(400).json({ error: 'Produto é  Obrigatório.' });
    return;
  }

  try {
    const updatedProduto = await prisma.dbprod.update({
      where: { codprod: produto.codprod },
      data: produto,
    });

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({ data: updatedProduto });
  } catch (errors) {
    console.log((errors as Error).message);
    res.status(500).json((errors as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}
