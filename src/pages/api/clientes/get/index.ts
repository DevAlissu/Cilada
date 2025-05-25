import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import { getPrisma } from '@/lib/prismaClient';
import { parseCookies } from 'nookies';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { page = 1, perPage = 10, search = '' } = req.query;

  // 1. Captura a filial do cookie
  const cookies = parseCookies({ req });
  const filial = cookies.filial_melo;

  if (!filial) {
    return res.status(400).json({ error: 'Filial não informada no cookie' });
  }

  // 2. Usa o Prisma da filial correta
  const prisma = getPrisma(filial);

  try {
    const query: Prisma.dbclienFindManyArgs = {
      skip: (Number(page) - 1) * Number(perPage),
      take: Number(perPage),
      where: {
        OR: search
          ? [
              {
                codcli: {
                  contains: String(search),
                  mode: 'insensitive',
                },
              },
              {
                nome: {
                  contains: String(search),
                  mode: 'insensitive',
                },
              },
              {
                cpfcgc: {
                  contains: String(search),
                  mode: 'insensitive',
                },
              },
            ]
          : undefined,
      },
    };

    const [clientes, count] = await prisma.$transaction([
      prisma.dbclien.findMany(query),
      prisma.dbclien.count({ where: query.where }),
    ]);

    res.status(200).json({
      data: clientes.map((cliente) => ({
        ...cliente,
        atraso: Number(cliente.atraso),
        kickback: Number(cliente.kickback),
        sit_tributaria: Number(cliente.sit_tributaria),
        codpais: Number(cliente.codpais),
        codpaiscobr: Number(cliente.codpaiscobr),
        codigo_filial: Number(cliente.codigo_filial),
      })),
      meta: {
        total: count,
        lastPage: count > 0 ? Math.ceil(count / Number(perPage)) : 1,
        currentPage: count > 0 ? Number(page) : 1,
        perPage: Number(perPage),
      },
    });
  } catch (error) {
    console.error('Erro:', (error as Error).message);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
}
