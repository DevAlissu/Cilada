import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'PUT') {
    res.status(405).json({ error: 'Método não permitido. Use PUT.' });
    return;
  }
  const { id } = req.query;
  const login_user_login = id;

  if (!login_user_login || typeof login_user_login !== 'string') {
    res.status(400).json({ error: 'login_user_login é obrigatório.' });
    return;
  }

  try {
    const usuarioExistente = await prisma.tb_login_user.findUnique({
      where: { login_user_login },
    });

    if (!usuarioExistente) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    // Criptografar a senha usando o próprio `login_user_login`
    const hashedPassword = await bcrypt.hash(login_user_login, SALT_ROUNDS);

    // Atualizar a senha
    await prisma.tb_login_user.update({
      where: { login_user_login },
      data: {
        login_user_password: hashedPassword,
      },
    });

    res.status(200).json({ message: 'Senha resetada com sucesso.' });
  } catch (error: any) {
    console.error('Erro ao resetar senha:', error);
    res.status(500).json({ error: `Erro ao resetar senha: ${error.message}` });
  }
}
