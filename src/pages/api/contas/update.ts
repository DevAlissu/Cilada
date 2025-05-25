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
    return res.status(400).json({ error: 'Filial não informada no cookie.' });
  }

  const prisma = getPrisma(filial);
  const conta = req.body;

  // Validação dos campos obrigatórios
  if (!conta.id || !conta.nroconta) {
    res.status(400).json({ error: 'Número da conta e ID são obrigatórios.' });
    return;
  }

  try {
    const { id, ...data } = conta;

    const update = await prisma.dbdados_banco.update({
      where: { id: id },
      data,
    });

    res.status(200).json({ data: update });
  } catch (errors) {
    console.error('Erro ao atualizar conta:', (errors as Error).message);
    res.status(500).json({ error: 'Erro interno ao atualizar a conta.' });
  }
}
