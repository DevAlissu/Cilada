import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método não permitido. Use DELETE.' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID da tela é obrigatório.' });
  }

  try {
    const telaId = parseInt(id, 10);
    if (isNaN(telaId)) {
      return res
        .status(400)
        .json({ error: 'ID da tela deve ser um número válido.' });
    }

    // 1. Delete associated permissions in tb_grupo_Permissao
    await prisma.tb_grupo_Permissao.deleteMany({
      where: {
        tela: telaId, // Use the field name from your schema
      },
    });

    // 2. Delete the tela from tb_telas
    const telaDeletada = await prisma.tb_telas.delete({
      where: {
        CODIGO_TELA: telaId, // Use the field name from your schema
      },
    });

    if (telaDeletada) {
      return res
        .status(200)
        .json({ message: `Tela com ID "${id}" deletada com sucesso.` });
    } else {
      return res
        .status(404)
        .json({ error: `Tela com ID "${id}" não encontrada.` });
    }
  } catch (error: any) {
    console.error('Erro ao deletar tela:', error);
    return res
      .status(500)
      .json({ error: 'Erro ao deletar tela: ' + error.message });
  } finally {
    await prisma.$disconnect();
  }
}
