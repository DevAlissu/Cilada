import { prisma } from '@/lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const dados = req.body;

  try {
    const posts = await prisma.tb_login_user.findMany({
      where: {
        login_user_login: dados.userLogin,
      },
    });

    res.status(200).setHeader('Content-Type', 'application/json').json(posts);
  } catch (errors) {
    console.log(errors);
    res.json('erro');
  }
}
