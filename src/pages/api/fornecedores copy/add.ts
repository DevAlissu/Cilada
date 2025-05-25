import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import { getPrisma } from '@/lib/prismaClient';

import { incrementStringNumber } from '@/utils/strings';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const cookies = parseCookies({ req });
  const filial = cookies.filial_melo;

  if (!filial) {
    return res.status(400).json({ error: 'Filial não informada no cookie' });
  }

  const prisma = getPrisma(filial);

  try {
    const latestFornecedor = await prisma.dbcredor.findFirst({
      orderBy: {
        cod_credor: 'desc',
      },
      take: 1,
    });

    if (!latestFornecedor) {
      return res
        .status(404)
        .json({ error: 'Nenhum fornecedor encontrado para gerar código.' });
    }

    const fornecedor = await prisma.dbcredor.create({
      data: {
        ...req.body,
        data_cad: new Date(),
        cod_credor: incrementStringNumber(latestFornecedor.cod_credor),
      },
    });

    res.status(201).setHeader('Content-Type', 'application/json').json({
      data: fornecedor,
    });
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    res.status(500).json({ error: (error as Error).message });
  }
}
