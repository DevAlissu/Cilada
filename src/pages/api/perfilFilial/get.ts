import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { user_login_id, nome_filial } = req.query;

  if (!user_login_id || !nome_filial) {
    return res
      .status(400)
      .json({ error: 'Parâmetros incompletos ou inválidos.' });
  }

  try {
    const perfil = await prisma.tb_user_perfil.findFirst({
      where: {
        user_login_id: user_login_id as string,
        nome_filial: nome_filial as string,
      },
      select: {
        perfil_name: true,
      },
    });

    if (!perfil) {
      return res.status(404).json({ error: 'Perfil não encontrado.' });
    }

    return res.status(200).json(perfil);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error, {
      user_login_id,
      nome_filial,
    });
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
