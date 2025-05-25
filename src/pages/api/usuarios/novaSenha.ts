import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido. Use POST.' });
    return;
  }

  const { codusr, newPassword } = req.body;
  console.log('oi newPassWord', newPassword);
  if (!codusr || typeof codusr !== 'string') {
    res
      .status(400)
      .json({ error: 'O código do usuário (codusr) é obrigatório.' });
    return;
  }
  console.log('oi newPassWord DEPOIS', newPassword);

  if (!newPassword || typeof newPassword !== 'string') {
    res.status(400).json({ error: 'A nova senha é obrigatória.' });
    return;
  }

  try {
    const usuarioExistente = await prisma.tb_login_user.findUnique({
      where: { login_user_login: codusr },
    });

    if (!usuarioExistente) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    // Criptografar a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    console.log('oi codusr', codusr);
    // Atualizar a senha do usuário
    await prisma.tb_login_user.update({
      where: { login_user_login: codusr },
      data: {
        login_user_password: hashedPassword,
      },
    });

    res.status(200).json({ message: 'Senha atualizada com sucesso.' });
  } catch (error: any) {
    console.error('Erro ao atualizar senha:', error);
    res
      .status(500)
      .json({ error: `Erro ao atualizar senha: ${error.message}` });
  }
}
