// src/pages/api/requisicoesCompra/post/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface CreateCompraBody {
  ordemCompra?: string;
  dataOrdem?: string | Date;
  statusOrdem?: string;
  requisicao?: string;
  versao?: number;
  tipo?: string;
  dataRequisicao?: string | Date;
  statusRequisicao?: string;
  fornecedorCodigo?: string;
  fornecedorNome?: string;
  fornecedorCpfCnpj?: string;
  compradorNome?: string;
  localEntrega?: string; //entrega inicial
  destino?: string; //entrega final
}

export default async function handleCreateCompra(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const {
    ordemCompra,
    dataOrdem,
    statusOrdem,
    requisicao,
    versao,
    tipo,
    dataRequisicao,
    statusRequisicao,
    fornecedorCodigo,
    fornecedorNome,
    fornecedorCpfCnpj,
    compradorNome,
    localEntrega,
    destino,
  } = req.body as CreateCompraBody;

  try {
    const dataForCreation: Prisma.DbcomprasCreateInput = {
      ordemCompra: ordemCompra || undefined,
      dataOrdem: dataOrdem ? new Date(dataOrdem) : undefined,
      statusOrdem: statusOrdem || undefined,
      requisicao: requisicao || undefined,
      versao: versao !== undefined ? Number(versao) : undefined,
      tipo: tipo || undefined,
      dataRequisicao: dataRequisicao ? new Date(dataRequisicao) : undefined,
      statusRequisicao: statusRequisicao || undefined,
      fornecedorCodigo: fornecedorCodigo || undefined,
      fornecedorNome: fornecedorNome || undefined,
      fornecedorCpfCnpj: fornecedorCpfCnpj || undefined,
      compradorNome: compradorNome || undefined,
      localEntrega: localEntrega || undefined,
      destino: destino || undefined,
    };

    const novaCompra = await prisma.dbcompras.create({
      data: dataForCreation,
    });
    res.status(201).json(novaCompra);
  } catch (error) {
    console.error('Erro ao criar compra:', (error as Error).message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          error: 'Falha ao criar compra: Violação de constraint única.',
          details: `O(s) campo(s) '${(error.meta?.target as string[])?.join(
            ', ',
          )}' deve(m) ser único(s).`,
        });
      }
    }
    res.status(500).json({
      error: 'Falha ao criar nova compra.',
      details: (error as Error).message,
    });
  }
}
