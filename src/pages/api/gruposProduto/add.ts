import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

//import { Marca } from '@/data/marcas/marcas';
import { GrupoProduto } from '@/data/gruposProduto/gruposProduto';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const data: GrupoProduto = req.body;
  const saveData = {
    codgpp: '0',
    descr: data.descr,
    bloquear_preco: data.bloquear_preco,
    codcomprador: data.codcomprador,
    codgpc: data.codgpc,
    codseg: data.codseg,
    ramonegocio: data.ramonegocio,
    p_comercial: data.p_comercial,
    v_marketing: data.v_marketing,
    diasreposicao: data.diasreposicao,
  };

  try {
    const nextCod = await prisma.dbgpprod.findFirst({
      select: {
        codgpp: true,
      },
      orderBy: {
        codgpp: 'desc',
      },
    });
    if (nextCod) {
      saveData.codgpp =
        'Z' +
        (parseInt(nextCod.codgpp.slice(1)) + 1).toString().padStart(4, '0');

      saveData.bloquear_preco = saveData.bloquear_preco ? 'S' : 'N';
      saveData.ramonegocio = saveData.ramonegocio ? 'S' : 'N';

      const gpProduto = await prisma.dbgpprod
        .create({
          data: saveData,
        })
        .finally(async () => {
          await prisma.$disconnect();
        });

      res.status(201).setHeader('Content-Type', 'application/json').json({
        data: gpProduto,
      });
    }
  } catch (errors) {
    console.log(errors);
    res.json('erro');
  }
}
