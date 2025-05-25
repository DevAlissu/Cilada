import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { VendedorGruposProduto } from '@/data/vendedores/vendedores';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { detalhado_vendedor, grupos_produto, pst, ...data } = req.body;

  try {
    const vendedor = await prisma.dbvend.update({
      where: { codvend: data.codvend },
      data: data,
    });

    if (pst) {
      await prisma.dbvend_pst
        .upsert({
          where: { codvend: vendedor.codvend },
          create: {
            ...pst,
            codvend: vendedor.codvend,
            local: 'MAO', // TODO: Verificar onde conseguir esta informação dinamicamente
          },
          update: pst,
        })
        .finally(async () => {
          await prisma.$disconnect();
        });
    }

    if (detalhado_vendedor) {
      await prisma.dbdados_vend
        .upsert({
          where: { codvend: vendedor.codvend },
          create: {
            ...detalhado_vendedor,
            codvend: vendedor.codvend,
          },
          update: { ...detalhado_vendedor },
        })
        .finally(async () => {
          await prisma.$disconnect();
        });
    }

    if (grupos_produto) {
      await prisma
        .$transaction(async (prisma) => {
          await prisma.dbvendgpp.deleteMany({
            where: {
              codvend: vendedor.codvend,
              codgpp: {
                notIn: grupos_produto.map(
                  (grupo: VendedorGruposProduto) => grupo.codgpp,
                ),
              },
            },
          });

          await Promise.all(
            grupos_produto.map((grupo: VendedorGruposProduto) =>
              prisma.dbvendgpp.upsert({
                where: {
                  codgpp_codvend: {
                    codvend: vendedor.codvend,
                    codgpp: grupo.codgpp,
                  },
                },
                create: {
                  codvend: vendedor.codvend,
                  codgpp: grupo.codgpp,
                  exclusivo: grupo.exclusivo,
                  comdireta: 0.0,
                  comindireta: 0.0,
                },
                update: {
                  exclusivo: grupo.exclusivo,
                  comdireta: 0.0,
                  comindireta: 0.0,
                },
              }),
            ),
          );
        })
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
