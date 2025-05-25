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
    return res.status(400).json({ error: 'Filial não informada no cookie' });
  }

  const prisma = getPrisma(filial);

  const {
    cliente,
    observacao,
    codusr,
  }: {
    cliente: Cliente;
    observacao: string;
    codusr: string;
  } = req.body;

  try {
    const latestLimite = await prisma.dbcliente_limite.findFirst({
      orderBy: { codclilim: 'desc' },
    });

    // Se não houver registros ainda, começa do 1
    const newCodCliLim = latestLimite ? latestLimite.codclilim + 1 : 1;

    const limiteCliente = await prisma.dbcliente_limite.create({
      data: {
        codcli: cliente.codcli,
        ultimo_limite: Number(cliente.limite),
        data: new Date(),
        observacao: observacao,
        codusr: codusr,
        codclilim: newCodCliLim,
      },
    });

    res.status(201).setHeader('Content-Type', 'application/json').json({
      data: limiteCliente,
    });
  } catch (errors) {
    console.log(errors);
    res.status(500).json('erro');
  }
}
