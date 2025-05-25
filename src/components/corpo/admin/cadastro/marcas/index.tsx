import React, { useEffect, useState } from 'react';
import { Marcas, getMarcas } from '@/data/marcas/marcas';
import { useDebouncedCallback } from 'use-debounce';
import DataTable from '@/components/common/DataTable';
import { DefaultButton } from '@/components/common/Buttons';
import { useToast } from '@/hooks/use-toast';
import Carregamento from '@/utils/carregamento';
import Cadastrar from './modalCadastrar';
import Editar from './modalEditar';
import { Pencil } from 'lucide-react';

const MarcasPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [marcas, setMarcas] = useState<Marcas>({} as Marcas);
  const [loading, setLoading] = useState(true);
  const [cadastrarOpen, setCadastrarOpen] = useState(false);
  const [editarOpen, setEditarOpen] = useState(false);
  const [, setSelectedRow] = useState<any>(null);
  const [idMarca, setIdMarca] = useState<any>(null);
  const { dismiss } = useToast();

  const fetchMarcas = async ({
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
      const data = await getMarcas({ page, perPage, search });
      setMarcas(data);
    } finally {
      setLoading(false);
    }
  };

  // Carrega dados quando muda paginação (não dispara ao digitar)
  useEffect(() => {
    fetchMarcas({ page, perPage, search });
    dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage]);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setPage(1);
    fetchMarcas({ page: 1, perPage, search: value });
  }, 500);

  const headers = ['Código', 'Descrição', 'Bloquear Preço', 'Editar'];

  const rows = marcas.data?.map((marca) => ({
    codmarca: marca.codmarca,
    descr: marca.descr,
    bloquear_preco: marca.bloquear_preco ?? 'S',
    action: (
      <div className="relative group flex justify-center">
        <button
          onClick={() => {
            setEditarOpen(true);
            setIdMarca(marca.codmarca);
          }}
          className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200 p-0"
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
              Marcas
            </div>
            <DefaultButton
              onClick={() => {
                setSelectedRow('');
                setCadastrarOpen(true);
              }}
              className="px-2 py-1 text-sm h-8"
              text="Nova Marca"
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
            meta={marcas.meta}
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

      <Cadastrar
        isOpen={cadastrarOpen}
        onClose={() => setCadastrarOpen(false)}
        title="Cadastrar Marca"
        onSuccess={() => {
          setCadastrarOpen(false);
          fetchMarcas({ page, perPage, search });
        }}
      />

      <Editar
        isOpen={editarOpen}
        onClose={() => setEditarOpen(false)}
        title="Editar Marca"
        marcaId={idMarca}
        onSuccess={() => {
          setEditarOpen(false);
          fetchMarcas({ page, perPage, search });
        }}
      />
    </div>
  );
};

export default MarcasPage;
