// pages/api/clientes/addComLimite.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import { getPrisma } from '@/lib/prismaClient';
import { Cliente } from '@/data/clientes/clientes';
import { serializeBigInt } from '@/utils/serializeBigInt';

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
    const result = await prisma.$transaction(async (tx) => {
      // 1. Buscar último codcli se necessário
      const latestCliente = await tx.dbclien.findMany({
        where: { codcli: { not: '99999' } },
        orderBy: { codcli: 'desc' },
        take: 1,
      });

      const newCodCli = parseInt(latestCliente[0]?.codcli ?? '0', 10) + 1;

      const clienteExistente = await tx.dbclien.findFirst({
        where: {
          cpfcgc: cliente.cpfcgc,
        },
      });

      const clienteSalvo = await tx.dbclien.upsert({
        where: {
          codcli: clienteExistente
            ? clienteExistente.codcli
            : newCodCli.toString(),
        },
        update: clienteExistente ? cliente : {},
        create: { ...cliente, codcli: newCodCli.toString() },
      });

      // 2. Buscar último codclilim
      const latestLimite = await tx.dbcliente_limite.findFirst({
        orderBy: { codclilim: 'desc' },
      });

      const newCodCliLim = latestLimite ? latestLimite.codclilim + 1 : 1;

      // 3. Criar limite
      const limiteCliente = await tx.dbcliente_limite.create({
        data: {
          codcli: clienteSalvo.codcli,
          ultimo_limite: Number(cliente.limite),
          data: new Date(),
          observacao: observacao,
          codusr: codusr,
          codclilim: newCodCliLim,
        },
      });

      return {
        cliente: clienteSalvo,
        limite: limiteCliente,
      };
    });

    res.status(201).json({
      data: serializeBigInt(result),
    });
  } catch (errors) {
    console.error(errors);
    res.status(500).json({
      error: 'Erro ao cadastrar cliente e limite',
      detail: String(errors),
    });
  }
}
