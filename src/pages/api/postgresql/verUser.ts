import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { compare } from 'bcryptjs'; // Importe a função de comparação do bcrypt

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const dados = req.body;

  try {
    // 1. Valide a entrada
    if (!dados.userLogin || !dados.userSenha) {
      res.status(400).json({ error: 'Login e senha são obrigatórios.' });
      return;
    }

    // 2. Busque o usuário pelo login
    const user = await prisma.tb_login_user.findUnique({
      where: {
        login_user_login: dados.userLogin,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'Usuário não encontrado.' }); // 401: Não autorizado
      return;
    }


    // 3. Compare a senha fornecida com o hash armazenado
  

    const senhaCorreta = await compare(
      dados.userSenha,
      user.login_user_password,
    );

    if (!senhaCorreta) {
      res.status(401).json({ error: 'Senha incorreta.' });
      return;
    }

    // 4. Se a senha estiver correta, retorne os dados do usuário (sem a senha!)
    const userData = {
      login_perfil_name: user.login_perfil_name,
      login_user_login: user.login_user_login,
      login_user_name: user.login_user_name,
      login_user_obs: user.login_user_obs,
    };
    res.status(200).json(userData);
  } catch (error: any) {
    console.error('Erro:', error);
    res
      .status(500)
      .json({ error: 'Erro interno do servidor: ' + error.message }); // Retorna o erro com a mensagem
  }
}
