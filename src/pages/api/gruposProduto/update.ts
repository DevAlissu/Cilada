import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { GrupoProduto } from '@/data/gruposProduto/gruposProduto';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const {
    codgpp,
    bloquear_preco,
    descr,
    codcomprador,
    codseg,
    p_comercial,
    v_marketing,
    codgpc,
    ramonegocio,
  }: GrupoProduto = req.body;

  if (!codgpp || !descr) {
    res
      .status(400)
      .json({ error: 'Código de produto e descrição são obrigatórios.' });
    return;
  }

  try {
    const updateGpProduto = await prisma.dbgpprod.update({
      where: { codgpp: codgpp.toString() },
      data: {
        descr: descr,
        bloquear_preco: bloquear_preco ? 'S' : 'N',
        codcomprador: codcomprador,
        codseg: codseg,
        p_comercial: p_comercial,
        v_marketing: v_marketing,
        codgpc: codgpc,
        ramonegocio: ramonegocio,
      },
    });

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json({ data: updateGpProduto });
  } catch (errors) {
    console.log((errors as Error).message);
    res.status(500).json((errors as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}
