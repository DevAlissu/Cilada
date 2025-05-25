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
    return res.status(400).json({ error: 'ID da filial é obrigatório.' });
  }

  try {
    const filialId = parseInt(id, 10);
    if (isNaN(filialId)) {
      return res
        .status(400)
        .json({ error: 'ID da filial deve ser um número válido.' });
    }

    // 1. Desconectar usuários da filial na tabela de junção tb_login_filiais
    await prisma.tb_login_filiais.deleteMany({
      where: {
        codigo_filial: filialId,
      },
    });

    // 2. Desconectar funções da filial na tabela tb_login_functions
    // Determinar se a coluna codigo_filial é anulável
    //não foi necessario por enquanto

    // 3. Deletar a filial
    const filialDeletada = await prisma.tb_filial.delete({
      where: {
        codigo_filial: filialId,
      },
    });

    if (filialDeletada) {
      return res
        .status(200)
        .json({ message: `Filial com ID "${id}" deletada com sucesso.` });
    } else {
      return res
        .status(404)
        .json({ error: `Filial com ID "${id}" não encontrada.` });
    }
  } catch (error: any) {
    console.error('Erro ao deletar filial:', error);
    return res
      .status(500)
      .json({ error: 'Erro ao deletar filial: ' + error.message }); // Incluir a mensagem de erro
  } finally {
    await prisma.$disconnect();
  }
}
