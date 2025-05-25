import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import { getPrisma } from '@/lib/prismaClient';

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
  const data = req.body;

  const saveData = {
    codcc: '0',
    desc: data.nome,
  };

  try {
    const lastBank = await prisma.dbcclien.findFirst({
      select: {
        codcc: true,
      },
      orderBy: {
        descr: 'desc',
      },
    });

    saveData.codcc = lastBank ? (Number(lastBank.codcc) + 1).toString() : '0';

    const cCliente = await prisma.dbcclien.create({
      data: saveData,
    });

    res.status(201).json({ data: cCliente });
  } catch (errors) {
    console.error('Erro ao criar a classe cliente:', errors);
    res.status(500).json({ error: 'Erro ao criar classCliente' });
  }
}
