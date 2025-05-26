// src/data/requisicoesCompra/types/requisition.ts

/**
 * Status possíveis de uma ordem de compra
 */
export type OrderStatus =
  | 'Aprovada'
  | 'Pendente'
  | 'Recusada'
  | 'Cancelada'
  | string;

export type RequisitionStatus =
  | 'Finalizada'
  | 'Em Andamento'
  | 'Cancelada'
  | string;

export interface RequisitionDTO {
  id: number;
  ordemCompra?: string;
  dataOrdem?: string;
  statusOrdem?: OrderStatus;
  requisicao?: string;
  versao?: number;
  tipo?: string;
  dataRequisicao?: string;
  statusRequisicao?: RequisitionStatus;
  fornecedorCodigo?: string;
  fornecedorNome?: string;
  fornecedorCpfCnpj?: string;
  compradorNome?: string;
  localEntrega?: string;
  destino?: string;
}
