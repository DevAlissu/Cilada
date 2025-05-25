import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
  }

  try {
    // Deletar funções associadas ao usuário na tabela tb_login_access_user
    await prisma.tb_login_access_user.deleteMany({
      where: {
        login_user_login: id,
      },
    });

    // Deletar associações de filiais do usuário na tabela tb_login_filiais
    await prisma.tb_login_filiais.deleteMany({
      where: {
        login_user_login: id,
      },
    });

    // Deletar o usuário da tabela tb_login_user
    await prisma.tb_login_user.delete({
      where: {
        login_user_login: id,
      },
    });

    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  } finally {
    await prisma.$disconnect();
  }
}
