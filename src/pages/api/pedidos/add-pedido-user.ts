import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { Pedido } from '@/data/pedidos/pedidos';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { data, login_user_login }: { data: Pedido; login_user_login: string } =
    req.body;

  const saveData = {
    id_pedido: data.codvenda,
    login_user_login: login_user_login,
    created_at: new Date(),
  };

  try {
    const pedidoUser = await prisma.tb_pedido_user.create({
      data: saveData,
    });

    await prisma.dbvenda.update({
      where: {
        codvenda: data.codvenda,
      },
      data: {
        status: data.status === 'N' ? 'S' : 'C',
      },
    });

    res.status(201).setHeader('Content-Type', 'application/json').json({
      data: pedidoUser,
    });
  } catch (errors) {
    console.log(errors);
    res.json('erro');
  }
}
