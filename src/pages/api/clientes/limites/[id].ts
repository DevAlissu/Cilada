import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import { getPrisma } from '@/lib/prismaClient';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { id } = req.query;
  const cookies = parseCookies({ req });
  const filial = cookies.filial_melo;

  if (!filial) {
    return res.status(400).json({ error: 'Filial não informada no cookie' });
  }

  const prisma = getPrisma(filial);

  if (!id) {
    res.status(400).json({ error: 'ID Obrigatório.' });
    return;
  }

  try {
    const limiteCliente = await prisma.dbcliente_limite.findFirst({
      where: { codcli: id as string },
      orderBy: { codclilim: 'desc' },
    });

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json(limiteCliente);
  } catch (errors) {
    console.log((errors as Error).message);
    res.status(500).json({ error: (errors as Error).message });
  }
}
