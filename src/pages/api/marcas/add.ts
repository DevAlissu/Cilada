import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

//import { Marca } from '@/data/marcas/marcas';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const data = req.body;
  const saveData = {
    codmarca: '0',
    descr: data.descr,
    mar_id: 0,
    bloquear_preco: data.bloquear_preco,
  };

  try {
    const nextCodmarca = await prisma.dbmarcas.findFirst({
      select: {
        codmarca: true,
      },
      orderBy: {
        codmarca: 'desc',
      },
    });

    saveData.codmarca = nextCodmarca
      ? (Number(nextCodmarca.codmarca) + 1).toString()
      : '0';

    const nextMarId = await prisma.dbmarcas.findFirst({
      select: {
        mar_id: true,
      },
      orderBy: {
        mar_id: 'desc',
      },
    });

    saveData.mar_id =
      nextMarId && nextMarId.mar_id
        ? parseFloat(nextMarId.mar_id.toString()) + 1.0
        : 1;
    saveData.bloquear_preco = saveData.bloquear_preco ? 'S' : 'N';

    const marca = await prisma.dbmarcas.create({
      data: saveData,
    });

    res.status(201).setHeader('Content-Type', 'application/json').json({
      data: marca,
    });
  } catch (errors) {
    console.log(errors);
    res.json('erro');
  }
}
