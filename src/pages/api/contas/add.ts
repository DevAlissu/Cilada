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
    id: data.id,
    banco: data.banco,
    tipo: data.tipo,
    nroconta: data.nroconta,
    convenio: data.convenio,
    variacao: data.variacao,
    carteira: data.carteira,
    melo: data.melo,
    agencia: data.agencia,
  };

  try {
    const conta = await prisma.dbdados_banco.create({
      data: saveData,
    });

    res.status(201).json({ data: conta });
  } catch (error) {
    console.error('Erro ao criar conta bancária:', error);
    res.status(500).json({ error: 'Erro ao criar conta bancária' });
  }
}
