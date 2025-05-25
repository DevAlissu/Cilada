import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { Prisma } from '@prisma/client';
import { PedidosGetParams } from '@/data/pedidos/pedidos';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const {
    page = 1,
    perPage = 10,
    search = '',
    login_user_login = '',
  }: PedidosGetParams = req.query;

  try {
    // Cria o query com Prisma.validator
    const query = Prisma.validator<Prisma.dbvendaFindManyArgs>()({
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
                dbclien: {
                  is: {
                    nome: {
                      contains: String(search),
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ]
          : undefined,
        AND: login_user_login
          ? {
              tb_pedido_user: {
                some: {
                  login_user_login: {
                    equals: String(login_user_login),
                  },
                },
              },
            }
          : undefined,
      },
      include: {
        tb_pedido_user: {
          select: {
            login_user_login: true,
          },
        },
        dbclien: {
          select: {
            nome: true,
          },
        },
        dbitvenda: true,
      },
    });

    // Tipo correto com includes
    type PedidoComRelacionamentos = Prisma.dbvendaGetPayload<typeof query>;

    const [pedidos, count] = await prisma.$transaction([
      prisma.dbvenda.findMany(query),
      prisma.dbvenda.count({ where: query.where }),
    ]);

    res.status(200).json({
      data: pedidos.map((pedido: PedidoComRelacionamentos) => ({
        ...pedido,
        operacao: Number(pedido.operacao),
        items: pedido.dbitvenda.map((item) => ({
          ...item,
          qtd: Number(item.qtd),
          prcompra: Number(item.prcompra),
          prmedio: Number(item.prmedio),
          comissaovend: Number(item.comissaovend),
          comissao_operador: Number(item.comissao_operador),
          desconto: Number(item.desconto),
          arm_id: Number(item.arm_id),
        })),
      })),
      meta: {
        total: count,
        lastPage: count > 0 ? Math.ceil(count / Number(perPage)) : 1,
        currentPage: count > 0 ? Number(page) : 1,
        perPage: Number(perPage),
      },
    });
  } catch (errors) {
    console.error((errors as Error).message);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
}
