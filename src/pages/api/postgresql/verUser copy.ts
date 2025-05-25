import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { userLogin, userSenha } = req.body;

  try {
    // Buscar o usuário pelo login
    const user = await prisma.tb_login_user.findUnique({
      where: {
        login_user_login: userLogin,
      },
      select: {
        login_user_login: true, // Esse é o 'codusr' que você está considerando
        login_user_name: true,
        login_user_password: true, // Trazer a senha criptografada
        login_user_obs: true,
        login_perfil_name: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Comparar a senha usando bcrypt
    const isPasswordValid = await bcrypt.compare(
      userSenha,
      user.login_user_password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Estrutura de retorno
    const userData = {
      codusr: user.login_user_login, // Usando o 'login_user_login' como 'codusr'
      login_user_login: user.login_user_login,
      login_user_name: user.login_user_name,
      login_user_obs: user.login_user_obs,
      login_perfil_name: user.login_perfil_name,
    };

    res.status(200).json([userData]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
}
