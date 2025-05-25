import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  const defaultProfileId = 'ID_DO_PERFIL_PADRAO';
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método não permitido. Use DELETE.' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID do perfil é obrigatório.' });
  }

  try {
    // Desconectar usuários associados ao perfil
    await prisma.tb_login_user.updateMany({
      where: {
        login_perfil_name: id,
      },
      data: {
        login_perfil_name: defaultProfileId,
      },
    });

    // Remover registros da tabela de acesso ao perfil
    await prisma.tb_login_access_perfil.deleteMany({
      where: {
        login_perfil_name: id,
      },
    });

    // Remover permissões de grupo associadas ao perfil
    await prisma.tb_grupo_Permissao.deleteMany({
      where: {
        grupoId: id, // Assumindo que 'grupoId' armazena o nome do perfil
      },
    });

    // Finalmente, deletar o perfil
    const perfilDeletado = await prisma.tb_login_perfil.delete({
      where: {
        login_perfil_name: id,
      },
    });

    if (perfilDeletado) {
      return res
        .status(200)
        .json({ message: `Perfil "${id}" deletado com sucesso.` });
    } else {
      return res.status(404).json({ error: `Perfil "${id}" não encontrado.` });
    }
  } catch (error) {
    console.error('Erro ao deletar perfil:', error);
    return res.status(500).json({ error: 'Erro ao deletar perfil.' });
  } finally {
    await prisma.$disconnect();
  }
}
