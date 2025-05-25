import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import { getPrisma } from '@/lib/prismaClient';
import { GetParams } from '@/data/common/getParams';
import { Prisma } from '@prisma/client';

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

  const { page = 1, perPage = 10, search = '' }: GetParams = req.query;

  const pageNumber = Math.max(1, Number(page));
  const perPageNumber = Math.max(1, Number(perPage));

  try {
    const query: Prisma.dbdados_bancoFindManyArgs = {
      skip: (pageNumber - 1) * perPageNumber,
      take: perPageNumber,
      where: {
        nroconta: search
          ? {
              contains: search,
              mode: 'insensitive',
            }
          : undefined,
      },
      orderBy: {
        id: 'asc',
      },
    };

    const [contas, count] = await prisma.$transaction([
      prisma.dbdados_banco.findMany(query),
      prisma.dbdados_banco.count({ where: query.where }),
    ]);

    const bancos = await prisma.dbbanco_cobranca.findMany({
      where: {
        banco: {
          in: contas.map((conta) => conta.banco || ''),
        },
      },
    });

    const bancoMap = new Map(bancos.map((banco) => [banco.banco, banco.nome]));

    const parsedContas = contas.map((conta) => ({
      ...conta,
      nomeBanco: bancoMap.get(conta.banco || '') || '',
    }));

    res.status(200).json({
      data: parsedContas,
      meta: {
        total: count,
        lastPage: Math.ceil(count / perPageNumber),
        currentPage: pageNumber,
        perPage: perPageNumber,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
    res.status(500).json({ error: 'Erro interno ao buscar contas bancárias' });
  }
}
