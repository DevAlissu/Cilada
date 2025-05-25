import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID Obrigatório.' });
  }

  try {
    const query = `
      SELECT 
        u.login_user_login,
        u.login_user_name,
        u.login_user_obs,
        u.login_user_password,
        json_agg(DISTINCT jsonb_build_object('id_functions', a.id_functions)) AS funcoes,
        json_agg(DISTINCT jsonb_build_object('login_perfil_name', p.login_perfil_name, 'id_functions', p.id_functions)) AS perfis,
        json_agg(DISTINCT jsonb_build_object('codigo_filial', f.codigo_filial, 'nome_filial', f.nome_filial)) AS filiais
      FROM tb_login_user u
      LEFT JOIN tb_login_access_user a ON a.login_user_login = u.login_user_login
      LEFT JOIN tb_login_access_perfil p ON p.login_user_login = u.login_user_login
      LEFT JOIN tb_login_filiais f ON f.login_user_login = u.login_user_login
      WHERE u.login_user_login = $1
      GROUP BY 
        u.login_user_login, 
        u.login_user_name, 
        u.login_user_obs, 
        u.login_user_password
    `;

    const usuario = await prisma.$queryRawUnsafe<any[]>(query, id);

    if (!usuario.length) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json(usuario[0]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  } finally {
    await prisma.$disconnect();
  }
}
