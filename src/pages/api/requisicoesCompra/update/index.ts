// src/pages/api/requisicoesCompra/update/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface UpdateCompraBody {
  id: number;
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
  localEntrega?: string;
  destino?: string;
}

export default async function handleUpdateCompra(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const {
    id,
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
  } = req.body as UpdateCompraBody;

  try {
    const dataForUpdate: Prisma.DbcomprasUpdateInput = {
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

    const updatedCompra = await prisma.dbcompras.update({
      where: { id },
      data: dataForUpdate,
    });
    res.status(200).json(updatedCompra);
  } catch (error) {
    console.error('Erro ao atualizar compra:', (error as Error).message);
    res.status(500).json({
      error: 'Falha ao atualizar compra.',
      details: (error as Error).message,
    });
  }
}
