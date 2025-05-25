import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { Funcao } from '@/data/funcoes/funcoes';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { descricao, sigla, usadoEm } = req.body as Funcao;

  // Verificação dos campos obrigatórios
  if (!descricao || !sigla) {
    return res
      .status(400)
      .json({ message: 'Descrição e Sigla são obrigatórios.' });
  }

  try {
    const funcao = await prisma.tb_login_functions.create({
      data: {
        descricao,
        sigla,
        usadoEm: usadoEm || null, // Caso `usadoEm` não venha, define como `null`
      },
    });

    return res.status(201).json({ data: funcao });
  } catch (error: any) {
    console.error('Erro ao criar função:', error.message || error);

    return res.status(500).json({
      message: 'Erro ao criar a função. Verifique os dados e tente novamente.',
    });
  } finally {
    await prisma.$disconnect();
  }
}
