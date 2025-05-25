import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import { getPrisma } from '@/lib/prismaClient';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { id } = req.query;
  const cookies = parseCookies({ req });
  const filial = cookies.filial_melo;

  if (!filial) {
    return res.status(400).json({ error: 'Filial não informada no cookie' });
  }

  const prisma = getPrisma(filial);

  if (!id) {
    res.status(400).json({ error: 'ID Obrigatório.' });
    return;
  }

  try {
    const cliente = await prisma.dbclien.findUnique({
      where: { codcli: id as string },
    });

    if (!cliente) {
      res.status(404).json({ error: 'Cliente não encontrado' });
      return;
    }

    res.status(200).json({
      ...cliente,
      atraso: Number(cliente.atraso),
      kickback: Number(cliente.kickback),
      sit_tributaria: Number(cliente.sit_tributaria),
      codpais: Number(cliente.codpais),
      codpaiscobr: Number(cliente.codpaiscobr),
      codigo_filial: Number(cliente.codigo_filial),
    });
  } catch (errors) {
    console.log((errors as Error).message);
    res.status(500).json({ error: (errors as Error).message });
  }
}
