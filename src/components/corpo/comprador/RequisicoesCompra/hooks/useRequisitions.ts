// src/components/corpo/comprador/RequisicoesCompra/hooks/useRequisitions.ts
import { useState, useEffect, useCallback } from 'react';
import type { RequisitionDTO } from '@/data/requisicoesCompra/types/requisition';
import type { Meta } from '@/data/common/meta';
import { getRequisicoesCompra } from '@/data/requisicoesCompra/requisicoesCompra';

export function useRequisitions(params: {
  page: number;
  perPage: number;
  search: string;
}) {
  const [data, setData] = useState<RequisitionDTO[]>([]);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    currentPage: params.page,
    lastPage: 1,
    perPage: params.perPage,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    getRequisicoesCompra(params)
      .then((res) => {
        setData(res.data);
        setMeta(res.meta);
      })
      .catch((err) => {
        setError(err.message || 'Falha ao carregar requisições');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.page, params.perPage, params.search]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, meta, loading, error, refetch: load };
}
