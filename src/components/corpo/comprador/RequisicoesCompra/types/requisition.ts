// src/data/requisicoesCompra/types/requisition.ts

export interface RequisitionDTO {
  id: number;
  ordemCompra?: string;
  dataOrdem?: string; // Date no banco, mas string para frontend
  statusOrdem?: string;
  requisicao?: string;
  versao?: number;
  tipo?: string;
  dataRequisicao?: string; // Date no banco, mas string para frontend
  statusRequisicao?: string;
  fornecedorCodigo?: string;
  fornecedorNome?: string;
  fornecedorCpfCnpj?: string;
  compradorNome?: string;
  localEntrega?: string;
  destino?: string;
}
