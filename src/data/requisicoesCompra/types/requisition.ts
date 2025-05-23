/**
 * Status possíveis de uma ordem de compra
 */
export type OrderStatus = 'Aprovada' | 'Pendente' | 'Recusada' | string;

/**
 * Status possíveis de uma requisição
 */
export type RequisitionStatus =
  | 'Finalizada'
  | 'Em Andamento'
  | 'Cancelada'
  | string;

/**
 * DTO alinhado com a tabela dbcompras/prisma
 */
export interface RequisitionDTO {
  id: number;
  ordemCompra?: string;
  dataOrdem?: string; // Date do banco, string no front
  statusOrdem?: OrderStatus;
  requisicao?: string;
  versao?: number;
  tipo?: string;
  dataRequisicao?: string; // Date do banco, string no front
  statusRequisicao?: RequisitionStatus;
  fornecedorCodigo?: string;
  fornecedorNome?: string;
  fornecedorCpfCnpj?: string;
  compradorNome?: string;
  localEntrega?: string;
  destino?: string;
}
