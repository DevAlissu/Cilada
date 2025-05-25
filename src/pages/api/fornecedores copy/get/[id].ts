import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import { getPrisma } from '@/lib/prismaClient';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'ID obrigatório.' });
    return;
  }

  const cookies = parseCookies({ req });
  const filial = cookies.filial_melo;

  if (!filial) {
    return res.status(400).json({ error: 'Filial não informada no cookie' });
  }

  const prisma = getPrisma(filial);

  try {
    const fornecedor = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        c.*, 
        r.*
      FROM dbcredor c
      LEFT JOIN cad_credor_regra_faturamento r ON r.crf_id = c.cod_credor
      WHERE c.cod_credor = '${id}'
      LIMIT 1
    `);

    if (!fornecedor || fornecedor.length === 0) {
      res.status(404).json({ error: 'Fornecedor não encontrado' });
      return;
    }

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json(fornecedor[0]);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
}
