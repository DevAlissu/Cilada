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
    banco: '0',
    nome: data.nome,
  };

  try {
    const lastBank = await prisma.dbbanco_cobranca.findFirst({
      select: {
        banco: true,
      },
      orderBy: {
        banco: 'desc',
      },
    });

    saveData.banco = lastBank ? (Number(lastBank.banco) + 1).toString() : '0';

    const banco = await prisma.dbbanco_cobranca.create({
      data: saveData,
    });

    res.status(201).json({ data: banco });
  } catch (errors) {
    console.error('Erro ao criar banco de cobrança:', errors);
    res.status(500).json({ error: 'Erro ao criar banco de cobrança' });
  }
}
