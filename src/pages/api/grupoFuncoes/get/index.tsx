import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { login_user_login, grupoId } = req.query;

  if (!login_user_login || typeof login_user_login !== 'string') {
    return res.status(400).json({
      error: 'Parâmetro login_user_login é obrigatório e deve ser uma string',
    });
  }

  try {
    // Funções específicas do usuário
    const funcoesUser = await prisma.tb_login_access_user.findMany({
      where: { login_user_login },
      select: {
        id_functions: true,
      },
    });

    // Funções específicas do perfil (grupoId)
    const funcoesPerfil = grupoId
      ? await prisma.tb_login_access_perfil.findMany({
          where: { login_perfil_name: grupoId as string },
          select: {
            id_functions: true,
          },
        })
      : [];

    // Unificar as funções, removendo duplicatas
    const funcoesUnificadas = [
      ...new Set([
        ...funcoesUser.map((f) => f.id_functions.toString()),
        ...funcoesPerfil.map((f) => f.id_functions.toString()),
      ]),
    ];

    res.status(200).json({ funcoes: funcoesUnificadas });
  } catch (error) {
    console.error('Erro ao buscar funções:', error);
    res.status(500).json({ error: 'Erro ao buscar funções' });
  } finally {
    await prisma.$disconnect();
  }
}
