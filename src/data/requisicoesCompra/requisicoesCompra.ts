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
 * Cria uma requisição de compra.
 */
export async function saveRequisition(
  requisition: RequisitionDTO,
): Promise<void> {
  await api.post(`/api/requisicoesCompra/post`, requisition);
}

export async function updateRequisition(
  requisition: RequisitionDTO,
): Promise<void> {
  await api.put(`/api/requisicoesCompra/update`, requisition);
}
