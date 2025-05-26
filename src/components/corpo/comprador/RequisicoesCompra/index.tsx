// src/components/corpo/comprador/RequisicoesCompra/index.tsx

import React, { useState, useEffect } from 'react';
import type { RequisitionDTO } from '@/data/requisicoesCompra/types/requisition';
import { useRequisitions } from './hooks/useRequisitions';
import { colunasDbRequisicao } from './colunasDbRequisicao';
import DataTableFiltro from '@/components/common/DataTableFiltro';
import { DefaultButton } from '@/components/common/Buttons';
import { PlusIcon } from 'lucide-react';
import { GoPencil } from 'react-icons/go';
import ActionsMenu from './List/ActionsMenu';
import RequisitionModal from './Form/RequisitionModal';
import EditRequisitionModal from './Form/EditRequisitionModal';
import { useDebouncedCallback } from 'use-debounce';
import api from '@/components/services/api';

export default function RequisicoesCompra() {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editItem, setEditItem] = useState<RequisitionDTO | null>(null);

  const [inputSearch, setInputSearch] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [headers, setHeaders] = useState<string[]>([]);
  const [limiteColunas, setLimiteColunas] = useState(5);

  useEffect(() => {
    const key = 'limiteColunasRequisicoes';
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(key);
      if (saved) setLimiteColunas(+saved);
      localStorage.setItem(key, String(limiteColunas));
    }
  }, [limiteColunas]);

  useEffect(() => {
    setHeaders([
      'editar',
      ...colunasDbRequisicao.slice(0, limiteColunas).map((c) => c.campo),
      'actions',
    ]);
  }, [limiteColunas]);

  const { data, meta, loading, error, refetch } = useRequisitions({
    page,
    perPage,
    search,
  });

  const colunasFiltro = colunasDbRequisicao.map((c) => c.campo);
  const filtered = search
    ? data.filter((item) =>
        colunasFiltro.some((key) =>
          String(item[key as keyof RequisitionDTO] ?? '')
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
      )
    : data;

  const debounced = useDebouncedCallback((v: string) => {
    setPage(1);
    setSearch(v);
  }, 500);

  const rows = filtered.map((item) => {
    const row: Record<string, any> = {};

    headers.forEach((col) => {
      if (col === 'editar' || col === 'actions') return;
      let v = item[col as keyof RequisitionDTO];
      if (col.toLowerCase().includes('data') && v) {
        v = new Date(v as string).toLocaleDateString();
      }
      row[col] = v ?? '';
    });

    row.editar = (
      <button
        onClick={() => setEditItem(item)}
        className="text-gray-700 hover:text-blue-600 p-0"
        title="Editar"
      >
        <GoPencil size={16} />
      </button>
    );

    row.actions = (
      <ActionsMenu
        requisition={item}
        onSubmit={() => alert(`Submeter requisição ${item.id}`)}
        onApprove={async () => {
          alert(`Aprovando ${item.id}`);
          try {
            await api.put('/api/requisicoesCompra/update', {
              id: item.id,
              statusOrdem: 'Aprovada',
            });
            await refetch();
          } catch {
            alert('Erro ao aprovar!');
          }
        }}
        onEdit={() => setEditItem(item)}
      />
    );

    return row;
  });

  return (
    <div className="h-full flex flex-col flex-grow border border-gray-300 bg-white dark:bg-slate-900">
      <main className="p-4 flex-1">
        <header className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#347AB6] dark:text-gray-200">
            Requisições de Compra
          </h2>
          <DefaultButton
            onClick={() => setIsNewOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm h-8"
            text="Nova Requisição"
            icon={<PlusIcon size={18} />}
          />
        </header>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <DataTableFiltro
          carregando={loading}
          headers={headers}
          rows={rows}
          meta={meta}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
          onColunaSubstituida={(a, b, t) =>
            setHeaders((prev) => {
              const arr = [...prev];
              const iA = arr.indexOf(a),
                iB = arr.indexOf(b);
              if (t === 'swap' && iA > -1 && iB > -1) {
                [arr[iA], arr[iB]] = [arr[iB], arr[iA]];
              } else if (iA > -1) {
                arr[iA] = b;
              }
              return arr;
            })
          }
          onSearch={(e) => setInputSearch(e.target.value)}
          onSearchBlur={() => debounced(inputSearch)}
          onSearchKeyDown={(e) => {
            if (e.key === 'Enter') debounced(inputSearch);
          }}
          searchInputPlaceholder="Pesquisar por código, fornecedor, status..."
          colunasFiltro={colunasFiltro}
          limiteColunas={limiteColunas}
          onLimiteColunasChange={setLimiteColunas}
        />

        <RequisitionModal
          isOpen={isNewOpen}
          onClose={() => setIsNewOpen(false)}
          onSuccess={() => {
            setIsNewOpen(false);
            refetch();
          }}
        />

        {editItem && (
          <EditRequisitionModal
            isOpen
            requisition={editItem}
            onClose={() => setEditItem(null)}
            onSuccess={() => {
              setEditItem(null);
              refetch();
            }}
          />
        )}
      </main>
    </div>
  );
}
