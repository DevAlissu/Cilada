import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { UsuarioFilial } from '@/data/usuarios-filial/usuariosFilial';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const data: UsuarioFilial = req.body;
  const saveData = {
    login_user_login: data.login_user_login,
    codigo_filial: Number(data.codigo_filial),
    nome_filial: data.nome_filial,
  };

  try {
    const usuarioFilial = await prisma.tb_login_filiais.upsert({
      where: {
        login_user_login_codigo_filial: {
          login_user_login: data.login_user_login,
          codigo_filial: Number(data.codigo_filial),
        },
      },
      update: saveData,
      create: saveData,
    });

    res.status(200).setHeader('Content-Type', 'application/json').json({
      data: usuarioFilial,
    });
  } catch (errors) {
    console.log(errors);
    res.json('erro');
  } finally {
    await prisma.$disconnect();
  }
}
