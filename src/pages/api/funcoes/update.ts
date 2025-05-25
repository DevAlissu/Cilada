import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { Funcao } from '@/data/funcoes/funcoes';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { id_functions, descricao }: Funcao = req.body;

  if (!id_functions || !descricao) {
    res.status(400).json({ error: 'ID e Descrição são Obrigatórios.' });
    return;
  }

  try {
    const updatedFuncao = await prisma.tb_login_functions.update({
      where: { id_functions: Number(id_functions) },
      data: { descricao },
    });

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({ data: updatedFuncao });
  } catch (errors) {
    console.log((errors as Error).message);
    res.status(500).json((errors as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}
