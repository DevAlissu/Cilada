import { NextApiRequest, NextApiResponse } from 'next';
import { getPrisma } from '@/lib/prismaClient';
import { parseCookies } from 'nookies';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { page = 1, perPage = 10, search = '' } = req.query;

  const cookies = parseCookies({ req });
  const filial = cookies.filial_melo;

  if (!filial) {
    return res.status(400).json({ error: 'Filial não informada no cookie' });
  }

  const prisma = getPrisma(filial);

  const skip = (Number(page) - 1) * Number(perPage);
  const take = Number(perPage);

  try {
    // Monta a cláusula WHERE dinamicamente
    const whereClause = search ? `WHERE b.descr ILIKE '%${search}%'` : '';

    // Consulta principal com JOIN
    const bairros = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
      b.*,
      z.descr AS zona_descr,
      m.descricao AS municipio_nome,
      p.descricao AS pais_nome
      FROM dbbairro b
      LEFT JOIN dbzona z ON z.codzona = b.codzona
      LEFT JOIN dbmunicipio m ON m.codmunicipio = b.codmunicipio
      LEFT JOIN dbpais p ON p.codpais = b.codpais
      ${whereClause}
      ORDER BY b.descr
      OFFSET ${skip}
      LIMIT ${take}
    `);

    // Consulta de contagem total
    const countResult = await prisma.$queryRawUnsafe<any[]>(`
      SELECT COUNT(*) as total
      FROM dbbairro b
      ${whereClause}
    `);

    const total = Number(countResult[0]?.total ?? 0);

    res.status(200).json({
      data: bairros,
      meta: {
        total,
        lastPage: total > 0 ? Math.ceil(total / take) : 1,
        currentPage: total > 0 ? Number(page) : 1,
        perPage: take,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar bairros:', (error as Error).message);
    res.status(500).json({ error: 'Erro ao buscar bairros' });
  }
}
