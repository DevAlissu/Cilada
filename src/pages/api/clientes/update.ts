// pages/api/cliente/update.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import { getPrisma } from '@/lib/prismaClient';

import { Cliente } from '@/data/clientes/clientes';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const cookies = parseCookies({ req });
  const filial = cookies.filial_melo;

  if (!filial) {
    res.status(400).json({ error: 'Filial não informada no cookie.' });
    return;
  }

  const prisma = getPrisma(filial);
  const cliente: Cliente = req.body;

  if (!cliente) {
    res.status(400).json({ error: 'Cliente é obrigatório.' });
    return;
  }

  try {
    const updatedCliente = await prisma.dbclien.update({
      where: { codcli: cliente.codcli },
      data: cliente,
    });

    res.status(200).json({
      ...updatedCliente,
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
