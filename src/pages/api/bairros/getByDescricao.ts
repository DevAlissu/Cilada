import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import { getPrisma } from '@/lib/prismaClient';
import { serializeBigInt } from '@/utils/serializeBigInt';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { descricao } = req.query;

  const cookies = parseCookies({ req });
  const filial = cookies.filial_melo;

  if (!filial) {
    return res.status(400).json({ error: 'Filial não informada no cookie' });
  }

  const prisma = getPrisma(filial);

  try {
    if (!descricao || typeof descricao !== 'string') {
      return res.status(400).json({ error: 'Descrição inválida' });
    }

    const bairro = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
      b.*,
      z.descr AS zona_descr,
      m.descricao AS municipio_nome,
      p.descricao AS pais_nome
      FROM dbbairro b
      LEFT JOIN dbzona z ON z.codzona = b.codzona
      LEFT JOIN dbmunicipio m ON m.codmunicipio = b.codmunicipio
      LEFT JOIN dbpais p ON p.codpais = b.codpais
      WHERE b.descr ILIKE '%${descricao}%'
      ORDER BY b.descr
      LIMIT 1
    `);

    res.status(200).json({ data: serializeBigInt(bairro[0] ?? null) });
  } catch (error) {
    console.error('Erro ao buscar bairro:', (error as Error).message);
    res.status(500).json({ error: 'Erro ao buscar bairro' });
  }
}
