import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { id } = req.query;

  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ error: `Método ${req.method} não permitido.` });
    return;
  }

  if (!id) {
    res.status(400).json({ error: 'ID da Função é obrigatório.' });
    return;
  }

  try {
    const funcaoExistente = await prisma.tb_login_functions.findUnique({
      where: { id_functions: Number(id) },
    });

    if (!funcaoExistente) {
      res.status(404).json({ error: 'Função não encontrada.' });
      return;
    }

    await prisma.tb_login_functions.delete({
      where: { id_functions: Number(id) },
    });

    res.status(200).json({ message: 'Função deletada com sucesso.' });
  } catch (errors) {
    console.error('Erro ao deletar a função:', (errors as Error).message);
    res.status(500).json({ error: 'Erro interno ao deletar a função.' });
  } finally {
    await prisma.$disconnect();
  }
}
