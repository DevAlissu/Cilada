import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { GetParams } from '@/data/common/getParams';
import { serializeBigInt } from '@/utils/serializeBigInt';

interface CountResult {
  total: bigint;
}

interface Funcao {
  id_functions: bigint;
  descricao: string;
  sigla: string | null;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  console.time('Tempo Total do Endpoint - /api/funcoes/get');

  const { page = 1, perPage = 10, search = '' }: GetParams = req.query;

  try {
    const skip = (Number(page) - 1) * Number(perPage);
    const take = Number(perPage);

    let queryData: string;
    let queryCount: string;
    let queryParams: any[];

    console.time('SQL - Montagem da Query');

    if (search.trim() === '') {
      // Caso de primeira carga ou sem busca - Nenhum filtro aplicado
      queryData = `
        SELECT id_functions, descricao, sigla 
        FROM tb_login_functions 
        LIMIT $1 OFFSET $2
      `;
      queryCount = `
        SELECT COUNT(*) as total
        FROM tb_login_functions
      `;
      queryParams = [take, skip];
    } else {
      // Caso de busca - Aplicar filtro
      const searchTerm = `%${search.toLowerCase()}%`;
      queryData = `
        SELECT id_functions, descricao, sigla 
        FROM tb_login_functions 
        WHERE descricao ILIKE $1 
        LIMIT $2 OFFSET $3
      `;
      queryCount = `
        SELECT COUNT(*) as total
        FROM tb_login_functions
        WHERE descricao ILIKE $1
      `;
      queryParams = [searchTerm, take, skip];
    }

    console.timeEnd('SQL - Montagem da Query');

    console.time('SQL - Execução das Queries');

    const [funcoes, countResult] = await Promise.all([
      prisma.$queryRawUnsafe<Funcao[]>(queryData, ...queryParams),
      prisma.$queryRawUnsafe<CountResult[]>(queryCount, queryParams[0]),
    ]);

    console.timeEnd('SQL - Execução das Queries');

    console.time('Processamento dos Resultados');

    const total = countResult[0]?.total || BigInt(0);

    const responseData = {
      data: serializeBigInt(funcoes),
      meta: {
        total: Number(total),
        lastPage: total > 0 ? Math.ceil(Number(total) / take) : 1,
        currentPage: total > 0 ? Number(page) : 1,
        perPage: take,
      },
    };

    console.timeEnd('Processamento dos Resultados');

    console.timeEnd('Tempo Total do Endpoint - /api/funcoes/get');

    res.status(200).json(responseData);
  } catch (error) {
    console.timeEnd('SQL - Execução das Queries');
    console.timeEnd('Processamento dos Resultados');
    console.timeEnd('Tempo Total do Endpoint - /api/funcoes/get');

    console.error('Erro no endpoint /api/funcoes/get:', error);
    res
      .status(500)
      .json({ error: 'Erro ao buscar funções. Tente novamente mais tarde.' });
  } finally {
    await prisma.$disconnect();
  }
}
