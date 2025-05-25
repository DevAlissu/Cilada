import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import { getPrisma } from '@/lib/prismaClient';
import { serializeBigInt } from '@/utils/serializeBigInt';

const mapTipoParaOperadorSQL = (tipo: string, campo: string, valor: string) => {
  switch (tipo) {
    case 'contém':
      return `${campo} ILIKE '%${valor}%'`;
    case 'começa':
      return `${campo} ILIKE '${valor}%'`;
    case 'termina':
      return `${campo} ILIKE '%${valor}'`;
    case 'igual':
      return `${campo} = '${valor}'`;
    case 'diferente':
      return `${campo} <> '${valor}'`;
    case 'maior':
      return `${campo} > '${valor}'`;
    case 'maior_igual':
      return `${campo} >= '${valor}'`;
    case 'menor':
      return `${campo} < '${valor}'`;
    case 'menor_igual':
      return `${campo} <= '${valor}'`;
    case 'nulo':
      return `${campo} IS NULL`;
    case 'nao_nulo':
      return `${campo} IS NOT NULL`;
    default:
      return '';
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { page = 1, perPage = 10, filtros = '[]', busca = '' } = req.body;

  const cookies = parseCookies({ req });
  const filial = cookies.filial_melo;

  if (!filial) {
    return res.status(400).json({ error: 'Filial não informada no cookie' });
  }

  const prisma = getPrisma(filial);
  const filtrosObj = JSON.parse(filtros) as {
    campo: string;
    tipo: string;
    valor: string;
  }[];

  const whereFiltros = filtrosObj
    .map((f) => mapTipoParaOperadorSQL(f.tipo, `c.${f.campo}`, f.valor))
    .filter(Boolean);

  const whereBuscaGlobal = busca
    ? [
        `c.cod_credor ILIKE '%${busca}%'`,
        `c.nome ILIKE '%${busca}%'`,
        `c.nome_fant ILIKE '%${busca}%'`,
      ]
    : [];

  const whereFinal = [...whereBuscaGlobal, ...whereFiltros].join(' AND ');
  const offset = (Number(page) - 1) * Number(perPage);

  try {
    const totalQuery = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
      `SELECT COUNT(*)::bigint as count FROM dbcredor c
       ${whereFinal ? `WHERE ${whereFinal}` : ''}`,
    );

    const dados = await prisma.$queryRawUnsafe<any[]>(
      `
      SELECT 
        c.*,
        p.descricao AS nome_pais,
        m.descricao AS nome_municipio,
        b.descr AS nome_bairro,
        cla.descr AS nome_classe
      FROM dbcredor c
      LEFT JOIN dbpais p ON p.codpais = c.codpais
      LEFT JOIN dbmunicipio m ON m.codmunicipio = c.codmunicipio
      LEFT JOIN dbbairro b ON b.codbairro = c.codbairro
      LEFT JOIN dbclassefornecedor cla ON cla.codcf = c.codcf
      ${whereFinal ? `WHERE ${whereFinal}` : ''}
      ORDER BY c.cod_credor
      OFFSET ${offset}
      LIMIT ${perPage}
      `,
    );

    const count = Number(totalQuery?.[0]?.count || 0);

    res.status(200).json(
      serializeBigInt({
        data: dados,
        meta: {
          total: count,
          lastPage: count > 0 ? Math.ceil(count / Number(perPage)) : 1,
          currentPage: count > 0 ? Number(page) : 1,
          perPage: Number(perPage),
        },
      }),
    );
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    res.status(500).json({ error: 'Erro ao buscar fornecedores' });
  }
}
