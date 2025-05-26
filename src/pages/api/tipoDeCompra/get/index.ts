// src/pages/api/tipoDeCompra/get/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

interface TipoDeCompraDTO {
  codigo: string;
  descricao: string | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: TipoDeCompraDTO[] } | { error: string }>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Como o model dbtipopagto está @@ignore, usamos raw SQL
    const raw: Array<{ codtipo: any; descricao: string | null }> =
      await prisma.$queryRaw`SELECT codtipo, descricao FROM dbtipopagto`;

    const data: TipoDeCompraDTO[] = raw.map(
      (t: { codtipo: any; descricao: string | null }) => ({
        codigo: t.codtipo.toString(),
        descricao: t.descricao,
      }),
    );

    return res.status(200).json({ data });
  } catch (error) {
    console.error('Erro ao buscar tipos de compra:', (error as Error).message);
    return res
      .status(500)
      .json({ error: 'Erro ao buscar tipos de compra. Tente novamente.' });
  }
}
