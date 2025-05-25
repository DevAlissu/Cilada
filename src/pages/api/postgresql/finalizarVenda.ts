import { prisma } from '@/lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  //const dados = req.body;

  try {
    await prisma.dbvenda.create({
      data: {
        ...req.body,
      },
    });

    res.status(200).send('criado');
  } catch (errors) {
    console.log(errors);
    res.status(400).send('erro ao criar banco');
  }
}
