import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { Pedido } from '@/data/pedidos/pedidos';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { data }: { data: Pedido } = req.body;

  try {
    const pedido = await prisma.dbvenda.update({
      where: {
        codvenda: data.codvenda,
      },
      data: {
        status: 'M',
      },
    });

    const pedidoUser = await prisma.tb_pedido_user.findFirst({
      where: {
        id_pedido: data.codvenda,
      },
    });

    if (!pedidoUser) return;

    await prisma.tb_pedido_user.delete({
      where: {
        id: pedidoUser.id,
      },
    });

    res.status(201).setHeader('Content-Type', 'application/json').json({
      data: pedido,
    });
  } catch (errors) {
    console.log(errors);
    res.json('erro');
  }
}
