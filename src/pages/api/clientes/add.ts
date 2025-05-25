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

  const data: Cliente = req.body;
  data.debito = 0;

  try {
    const latestCliente = await prisma.dbclien.findMany({
      where: {
        codcli: {
          not: '99999',
        },
      },
      orderBy: {
        codcli: 'desc',
      },
      take: 1,
    });

    const newCodCli = parseInt(latestCliente[0]?.codcli ?? '0', 10) + 1;

    const clienteExistente = await prisma.dbclien.findFirst({
      where: {
        cpfcgc: data.cpfcgc,
      },
    });

    const cliente = await prisma.dbclien.upsert({
      where: {
        codcli: clienteExistente
          ? clienteExistente.codcli
          : newCodCli.toString(),
      },
      update: clienteExistente ? data : {},
      create: { ...data, codcli: newCodCli.toString() },
    });

    res
      .status(201)
      .setHeader('Content-Type', 'application/json')
      .json({
        data: {
          ...cliente,
          atraso: Number(cliente.atraso),
          kickback: Number(cliente.kickback),
          sit_tributaria: Number(cliente.sit_tributaria),
          codpais: Number(cliente.codpais),
          codpaiscobr: Number(cliente.codpaiscobr),
          codigo_filial: Number(cliente.codigo_filial),
        },
      });
  } catch (errors) {
    console.log(errors);
    res.status(500).json('erro');
  }
}
