import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { Banco } from '@/data/bancos/bancos';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { banco, nome }: Banco = req.body;

  if (!banco || !nome) {
    res.status(400).json({ error: 'Código do banco e nome são obrigatórios.' });
    return;
  }

  try {
    const update = await prisma.dbbanco_cobranca.update({
      where: { banco: banco.toString() },
      data: {
        nome: nome,
      },
    });

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({ data: update });
  } catch (errors) {
    console.log((errors as Error).message);
    res.status(500).json((errors as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}
