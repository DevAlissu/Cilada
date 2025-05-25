import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { login_user_login, codigo_filial } = req.query as {
    login_user_login: string;
    codigo_filial: string;
  };

  try {
    await prisma.tb_login_filiais.delete({
      where: {
        login_user_login_codigo_filial: {
          login_user_login: login_user_login,
          codigo_filial: Number(codigo_filial),
        },
      },
    });

    res.status(204).setHeader('Content-Type', 'application/json').json({
      data: null,
    });
  } catch (errors) {
    console.log(errors);
    res.json('erro');
  } finally {
    await prisma.$disconnect();
  }
}
