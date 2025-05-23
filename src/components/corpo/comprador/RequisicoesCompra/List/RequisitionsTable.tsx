import React from 'react';
import type { RequisitionDTO } from '@/data/requisicoesCompra/types/requisition';
import type { Meta } from '@/data/common/meta';

interface RequisitionsTableProps {
  data: RequisitionDTO[];
  meta: Meta;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const RequisitionsTable: React.FC<RequisitionsTableProps> = ({
  data,
  meta,
  loading,
  onPageChange,
}) => {
  if (loading) {
    return <div>Carregando...</div>;
  }

  if (data.length === 0) {
    return <div>Sem dados.</div>;
  }

  return (
    <>
      <table className="min-w-full table-auto mb-4 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Cód. Req</th>
            <th className="px-4 py-2">Data Req</th>
            <th className="px-4 py-2">Fornecedor</th>
            <th className="px-4 py-2">Versão</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{item.codRequisicao}</td>
              <td className="border px-4 py-2">
                {new Date(item.dataRequisicao).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">{item.nomeFornecedor}</td>
              <td className="border px-4 py-2">{item.versaoRequisicao}</td>
              <td className="border px-4 py-2">{item.statusRequisicao}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <button
          disabled={meta.currentPage <= 1}
          onClick={() => onPageChange(meta.currentPage - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ← Anterior
        </button>
        <span>
          Página {meta.currentPage} de {meta.lastPage}
        </span>
        <button
          disabled={meta.currentPage >= meta.lastPage}
          onClick={() => onPageChange(meta.currentPage + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Próxima →
        </button>
      </div>
    </>
  );
};

export default RequisitionsTable;
