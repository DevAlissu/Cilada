import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'ID Obrigatório.' });
    return;
  }

  try {
    const vendedor = await prisma.dbvend.findUnique({
      where: { codvend: id as string },
      include: {
        dbvendgpp: {
          include: {
            dbgpprod: {
              select: {
                descr: true,
              },
            },
          },
        },
        dbdados_vend: true,
        dbvend_pst: true,
      },
    });

    if (!vendedor) {
      res.status(404).json({ error: 'Vendedor não encontrado' });
      return;
    }

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json(vendedor);
  } catch (errors) {
    console.log((errors as Error).message);
    res.status(500).json((errors as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}
