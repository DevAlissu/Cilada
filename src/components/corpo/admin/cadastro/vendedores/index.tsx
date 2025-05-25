import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import DataTable from '@/components/common/DataTable';
import { DefaultButton } from '@/components/common/Buttons';
import { useToast } from '@/hooks/use-toast';
import Carregamento from '@/utils/carregamento';
import Cadastrar from './modalCadastrar';
import Editar from './modalEditar';
import { Pencil } from 'lucide-react';
import { getVendedores, Vendedores } from '@/data/vendedores/vendedores';

const VendedoresPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [vendedores, setVendedores] = useState<Vendedores>({} as Vendedores);
  const [loading, setLoading] = useState(true);
  const [cadastrarOpen, setCadastrarOpen] = useState(false);
  const [editarOpen, setEditarOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [idVendedor, setIdVendedor] = useState<any>(null);
  //const router = useRouter();
  const { dismiss } = useToast();

  const fetchVendedores = async ({
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
      const data = await getVendedores({ page, perPage, search });
      setVendedores(data);
    } finally {
      setLoading(false);
    }
  };

  // Carrega dados quando muda paginação (não dispara ao digitar)
  useEffect(() => {
    fetchVendedores({ page, perPage, search });
    dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage]);

  // Debounced search (não muda page/perPage, só faz nova busca)
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setPage(1); // Resetar página ao pesquisar
    fetchVendedores({ page: 1, perPage, search: value });
  }, 500);

  const headers = ['Código', 'Nome', 'Editar'];

  const rows = vendedores.data?.map((vendedor) => ({
    codvend: vendedor.codvend,
    nome: vendedor.nome,
    action: (
      <div className="relative group flex justify-center">
        <button
          onClick={() => {
            setEditarOpen(true);
            setIdVendedor(vendedor.codvend);
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
              Vendedores
            </div>
            <DefaultButton
              onClick={
                () => {
                  setSelectedRow('');
                  setCadastrarOpen(true);
                }
              }
              className="px-2 py-1 text-sm h-8"
              text="Novo"
            />
          </div>
        </header>

        {loading ? (
          <div className="w-full h-screen  flex justify-center items-center">
            <Carregamento texto="BUSCANDO DADOS" />
          </div>
        ) : (
          <DataTable
            headers={headers}
            rows={rows || []}
            meta={vendedores.meta}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
            onSearch={(e) => {
              const value = e.target.value;
              setSearch(value); // atualiza visualmente o campo
              debouncedSearch(value); // busca com debounce
            }}
            searchInputPlaceholder="Pesquisar por código ou nome..."
          />
        )}
      </main>
      {/* Modal para cadastrar */}
      <Cadastrar
        isOpen={cadastrarOpen}
        onClose={() => setCadastrarOpen(false)}
        title="Cadastrar Registro"
      >
        <div className="space-y-2">
          {selectedRow &&
            Object.entries(selectedRow).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value?.toString()}
              </div>
            ))}
        </div>
      </Cadastrar>
      {/* Modal para cadastrar */}

      <Editar
        isOpen={editarOpen}
        onClose={() => setEditarOpen(false)}
        title="Editar Registro"
        vendedorId={idVendedor}
      >
        <div className="space-y-2">
          {selectedRow &&
            Object.entries(selectedRow).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value?.toString()}
              </div>
            ))}
        </div>
      </Editar>
    </div>
  );
};

export default VendedoresPage;
