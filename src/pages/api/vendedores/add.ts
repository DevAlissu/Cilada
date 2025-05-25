import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { incrementStringNumber } from '@/utils/strings';
import { VendedorGruposProduto } from '@/data/vendedores/vendedores';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { detalhado_vendedor, grupos_produto, pst, ...data } = req.body;

  const latestVendedor = await prisma.dbvend.findFirst({
    orderBy: {
      codvend: 'desc',
    },
    take: 1,
  });

  if (!latestVendedor) {
    return;
  }

  try {
    const vendedor = await prisma.dbvend.create({
      data: {
        ...data,
        codvend: incrementStringNumber(latestVendedor.codvend),
      },
    });

    if (pst) {
      await prisma.dbvend_pst.create({
        data: {
          ...pst,
          codvend: vendedor.codvend,
          local: 'MAO', // TODO: Verificar onde conseguir esta informação dinamicamente
        },
      });
    }

    if (detalhado_vendedor) {
      await prisma.dbdados_vend.create({
        data: {
          ...detalhado_vendedor,
          codvend: vendedor.codvend,
        },
      });
    }

    if (grupos_produto) {
      await prisma
        .$transaction([
          prisma.dbvendgpp.createMany({
            data: grupos_produto.map((grupo: VendedorGruposProduto) => ({
              codvend: vendedor.codvend,
              codgpp: grupo.codgpp,
              exclusivo: grupo.exclusivo,
              comdireta: 0.0,
              comindireta: 0.0,
            })),
          }),
        ])
        .finally(async () => {
          await prisma.$disconnect();
        });
    }

    res.status(201).setHeader('Content-Type', 'application/json').json({
      data: vendedor,
    });
  } catch (errors) {
    console.log(errors);
    res.json('erro');
  }
}
