import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { codcc, descr }: { codcc: string; descr: string } = req.body;

  if (!codcc || !descr) {
    res.status(400).json({ error: 'Código e descrição são obrigatórios.' });
    return;
  }

  try {
    const update = await prisma.dbcclien.update({
      where: { codcc },
      data: { descr },
    });

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({ data: update });
  } catch (errors) {
    console.log((errors as Error).message);
    res.status(500).json((errors as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}
