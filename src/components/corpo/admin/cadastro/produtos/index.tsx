import React, { useEffect, useState } from 'react';
import { Produtos, getProdutos } from '@/data/produtos/produtos';
import { useDebouncedCallback } from 'use-debounce';

import DataTable from '@/components/common/DataTable';
import { DefaultButton } from '@/components/common/Buttons';
import { useToast } from '@/hooks/use-toast';
import Carregamento from '@/utils/carregamento';
import CadastrarProduto from './modalCadastrar';
import EditarProduto from './modalEditar';
import { Pencil } from 'lucide-react';

const ProdutosPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [produtos, setProdutos] = useState<Produtos>({} as Produtos);
  const [loading, setLoading] = useState(true);
  const [cadastrarOpen, setCadastrarOpen] = useState(false);
  const [editarOpen, setEditarOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [idProduto, setIdProduto] = useState<any>(null);

  const { dismiss } = useToast();

  const fetchProdutos = async ({
    page,
    perPage,
    search,
  }: {
    page: number;
    perPage: number;
    search: string;
  }) => {
    setLoading(true);
    try {
      const data = await getProdutos({ page, perPage, search });
      setProdutos(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos({ page, perPage, search });
    dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage]);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value);
    fetchProdutos({ page: 1, perPage, search: value });
  }, 500);

  const headers = ['Código', 'Referencia', 'Descrição', 'Ações'];

  const rows = produtos.data?.map((produto) => ({
    CODPROD: produto.codprod,
    REF: produto.ref,
    DESCR: produto.descr,
    action: (
      <div className="relative group flex justify-center">
        <button
          onClick={() => {
            setEditarOpen(true);
            setIdProduto(produto.codprod);
          }}
          className="text-gray-700 dark:text-gray-100 group-hover:text-blue-600 transition-colors duration-200 p-0"
        >
          <Pencil size={18} />
        </button>
      </div>
    ),
  }));

  return (
    <div className="h-full w-full bg-gray-100 dark:bg-slate-500">
      <main className="p-4">
        <header className="mb-2">
          <div className="flex justify-between mb-4 mr-6 ml-6">
            <div className="text-lg font-bold text-[#347AB6] dark:text-gray-200">
              Produtos
            </div>
            <DefaultButton
              onClick={() => {
                setSelectedRow('');
                setCadastrarOpen(true);
              }}
              className="px-2 py-1 text-sm h-8"
              text="Novo"
            />
          </div>
        </header>

        {loading ? (
          <div className="w-full h-screen flex justify-center items-center">
            <Carregamento texto="BUSCANDO DADOS" />
          </div>
        ) : (
          <DataTable
            headers={headers}
            rows={rows || []}
            meta={produtos.meta}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
            onSearch={(e) => {
              const value = e.target.value;
              setSearch(value);
              debouncedSearch(value);
            }}
            searchInputPlaceholder="Pesquisar por código ou descrição..."
          />
        )}
      </main>

      {/* Modal cadastrar */}
      <CadastrarProduto
        isOpen={cadastrarOpen}
        onClose={() => setCadastrarOpen(false)}
        title="Cadastrar Produto"
      >
        <div className="space-y-2">
          {selectedRow &&
            Object.entries(selectedRow).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value?.toString()}
              </div>
            ))}
        </div>
      </CadastrarProduto>

      {/* Modal editar */}
      <EditarProduto
        isOpen={editarOpen}
        onClose={() => setEditarOpen(false)}
        title="Editar Produto"
        produtoId={idProduto}
      >
        <div className="space-y-2">
          {selectedRow &&
            Object.entries(selectedRow).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value?.toString()}
              </div>
            ))}
        </div>
      </EditarProduto>
    </div>
  );
};

export default ProdutosPage;
