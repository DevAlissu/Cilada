import { prisma } from '@/lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const dados = req.body;

  try {
    const result = await prisma.dbclien.findMany({
      where: {
        codigo_filial: dados.codigo_filial,
      },
    });

    const newPosts = JSON.parse(
      JSON.stringify(
        result,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
      ),
    );
    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json(newPosts);
  } catch (errors) {
    console.log(errors);
    res.json('erro');
  }
}
