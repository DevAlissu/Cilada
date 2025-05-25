import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import { getPrisma } from '@/lib/prismaClient';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const cookies = parseCookies({ req });
  const filial = cookies.filial_melo;

  if (!filial) {
    return res.status(400).json({ error: 'Filial não informada no cookie' });
  }

  const prisma = getPrisma(filial);
  const data = req.body;

  try {
    const novoFornecedor = await prisma.dbcredor.create({
      data,
    });

    res.status(201).json(novoFornecedor);
  } catch (error) {
    console.error('Erro ao cadastrar fornecedor:', error);
    res.status(500).json({ error: 'Erro ao cadastrar fornecedor' });
  }
}
