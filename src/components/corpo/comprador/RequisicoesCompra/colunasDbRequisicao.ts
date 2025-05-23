// src/components/corpo/comprador/RequisicoesCompra/colunasDbRequisicao.ts

export const colunasDbRequisicao = [
  // Dados principais da requisição
  { campo: 'requisicao', label: 'Cód. Requisição' },
  { campo: 'dataRequisicao', label: 'Data da Requisição' },
  { campo: 'versao', label: 'Versão' },
  { campo: 'tipo', label: 'Tipo' },
  { campo: 'statusRequisicao', label: 'Status da Requisição' },

  // Dados principais da ordem (se existir)
  { campo: 'ordemCompra', label: 'Nº Ordem de Compra' },
  { campo: 'dataOrdem', label: 'Data da Ordem' },
  { campo: 'statusOrdem', label: 'Status da Ordem' },

  // Fornecedor
  { campo: 'fornecedorCodigo', label: 'Código do Fornecedor' },
  { campo: 'fornecedorNome', label: 'Nome do Fornecedor' },
  { campo: 'fornecedorCpfCnpj', label: 'CPF/CNPJ Fornecedor' },

  // Outros campos relevantes
  { campo: 'compradorNome', label: 'Nome do Comprador' },
  { campo: 'localEntrega', label: 'Local de Entrega' },
  { campo: 'destino', label: 'Destino' },
];
