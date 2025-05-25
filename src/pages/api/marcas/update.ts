import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { Marca } from '@/data/marcas/marcas';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { codmarca, bloquear_preco, descr }: Marca = req.body;

  if (!codmarca || !descr) {
    res
      .status(400)
      .json({ error: 'Código da marca e descrição são obrigatórios.' });
    return;
  }

  try {
    const updateMarca = await prisma.dbmarcas.update({
      where: { codmarca: codmarca.toString() },
      data: {
        descr: descr,
        bloquear_preco: bloquear_preco ? 'S' : 'N',
      },
    });

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({ data: updateMarca });
  } catch (errors) {
    console.log((errors as Error).message);
    res.status(500).json((errors as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}
