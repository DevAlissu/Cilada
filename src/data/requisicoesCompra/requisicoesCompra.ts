// src/data/requisicoesCompra/requisicoesCompra.ts

import api from '@/components/services/api';
import type { RequisitionDTO } from './types/requisition';
import type { Meta } from '../common/meta';
import type { GetParams } from '../common/getParams';

export interface RequisicoesCompraResponse {
  data: RequisitionDTO[];
  meta: Meta;
}

/**
 * Busca página de requisições de compra com filtros de busca/paginação.
 */
export async function getRequisicoesCompra({
  page,
  perPage,
  search,
}: GetParams): Promise<RequisicoesCompraResponse> {
  let payload = {} as RequisicoesCompraResponse;

  await api
    .get<RequisicoesCompraResponse>(`/api/requisicoesCompra/get`, {
      params: { page, perPage, search },
    })
    .then((res) => {
      payload = res.data;
    });

  return payload;
}

/**
 * Cria ou atualiza uma requisição de compra.
 */
export async function saveRequisition(
  requisition: RequisitionDTO,
): Promise<void> {
  await api.post(`/api/requisicoesCompra/save`, requisition);
}
