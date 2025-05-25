import React, { useEffect, useRef, useState } from 'react';
import { Clientes, buscaClientes, getClientes } from '@/data/clientes/clientes';
import { useDebouncedCallback } from 'use-debounce';
import DataTable from '@/components/common/DataTableFiltro';
import { DefaultButton } from '@/components/common/Buttons';
import { useToast } from '@/hooks/use-toast';
import Cadastrar from './modalCadastrar';
import Editar from './modalEditar';
import { GoPencil } from 'react-icons/go';
import { PlusIcon } from 'lucide-react';

const ClientesPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [clientes, setClientes] = useState<Clientes>({} as Clientes);
  const [loading, setLoading] = useState(true);
  const [cadastrarOpen, setCadastrarOpen] = useState(false);
  const [editarOpen, setEditarOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [idCliente, setIdCliente] = useState<string>('');
  const [filtros, setFiltros] = useState<
    { campo: string; tipo: string; valor: string }[]
  >([]);

  const [colunasDbClien, setColunasDbClien] = useState<string[]>([]);
  const [limiteColunas, setLimiteColunas] = useState<number>(() => {
    const salvo = localStorage.getItem('limiteColunasClientes');
    return salvo ? parseInt(salvo, 10) : 5; // valor padrão: 5
  });

  const { dismiss, toast } = useToast();

  const ultimaChamada = useRef({
    page: 0,
    perPage: 0,
    filtros: [] as { campo: string; tipo: string; valor: string }[],
    limiteColunas,
  });

  const ultimaChamadaUnico = useRef({
    page: 0,
    perPage: 0,
    search: '',
  });
  const [headers, setHeaders] = useState<string[]>([]);

  const fetchClientes = async ({
    page,
    perPage,
    filtros,
  }: {
    page: number;
    perPage: number;
    filtros: { campo: string; tipo: string; valor: string }[];
  }) => {
    const ultima = ultimaChamada.current;
    const filtrosString = JSON.stringify(filtros);
    const ultimaFiltrosString = JSON.stringify(ultima.filtros);

    if (
      ultima.page === page &&
      ultima.perPage === perPage &&
      filtrosString === ultimaFiltrosString &&
      limiteColunas === ultima.limiteColunas
    ) {
      return;
    }

    ultimaChamada.current = { page, perPage, filtros, limiteColunas };

    setLoading(true);

    try {
      const data = await buscaClientes({ page, perPage, filtros });
      setClientes(data);

      if (data.data?.length > 0) {
        const colunasDinamicas = Object.keys(data.data[0]).filter(
          (coluna) => coluna !== 'editar',
        );
        const filtrasColunasDinamicas = colunasDinamicas.slice(
          0,
          limiteColunas,
        );
        setColunasDbClien(colunasDinamicas);
        if (!filtrasColunasDinamicas.includes('editar')) {
          filtrasColunasDinamicas.push('editar');
        }
        setHeaders(filtrasColunasDinamicas);
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        title: 'Erro ao carregar clientes',
        description: 'Não foi possível obter os dados. Verifique sua conexão.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes({ page: 1, perPage, filtros });
    dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limiteColunas]);
  useEffect(() => {
    if (headers.length)
      localStorage.setItem(
        'headersSelecionadosClientes',
        JSON.stringify(headers),
      );
  }, [headers]);
  const fetchClientesUnico = async ({
    page,
    perPage,
    search,
  }: {
    page: number;
    perPage: number;
    search: string;
  }) => {
    const ultima = ultimaChamadaUnico.current;
    if (
      ultima.page === page &&
      ultima.perPage === perPage &&
      ultima.search === search
    ) {
      return;
    }

    ultimaChamadaUnico.current = { page, perPage, search };

    setLoading(true);
    try {
      const data = await getClientes({ page, perPage, search });
      setClientes(data);
    } finally {
      setLoading(false);
    }
  };
  const debouncedSearchUnico = useDebouncedCallback((value: string) => {
    setPage(1);
    fetchClientesUnico({ page: 1, perPage, search: value });
  }, 500);

  //const headers = ['Código', 'Nome', 'Nome Fantasia', 'Documento', 'Editar'];

  const rows = clientes.data?.map((cliente) => {
    const linha: Record<string, any> = {};

    headers?.forEach((coluna) => {
      linha[coluna] = cliente[coluna as keyof typeof cliente] ?? '';
    });

    // Se quiser manter a coluna "editar" no final:
    linha.editar = (
      <div className="relative group flex justify-center">
        <button
          onClick={() => {
            setSelectedRow(cliente);
            setIdCliente(cliente.codcli);
            setEditarOpen(true);
          }}
          className="text-gray-700 dark:text-gray-100 group-hover:text-blue-600 transition-colors duration-200 p-0"
        >
          <GoPencil size={16} />
        </button>
      </div>
    );

    return linha;
  });
  const handleColunaSubstituida = (
    colA: string,
    colB: string,
    tipo: 'swap' | 'replace' = 'replace',
  ) => {
    setHeaders((prev) => {
      const novaOrdem = [...prev];
      const indexA = novaOrdem.indexOf(colA);
      const indexB = novaOrdem.indexOf(colB);

      if (tipo === 'swap' && indexA !== -1 && indexB !== -1) {
        [novaOrdem[indexA], novaOrdem[indexB]] = [
          novaOrdem[indexB],
          novaOrdem[indexA],
        ];
      } else if (tipo === 'replace' && indexA !== -1) {
        novaOrdem[indexA] = colB;
      }

      return novaOrdem;
    });
  };

  return (
    <div className=" h-full flex flex-col flex-grow border border-gray-300  bg-white dark:bg-slate-900">
      <main className="p-4  w-full">
        <header className="mb-2">
          <div className="flex justify-between mb-4 mr-6 ml-6">
            <div className="text-lg font-bold text-[#347AB6] dark:text-gray-200">
              Clientes
            </div>
            <DefaultButton
              onClick={() => {
                setSelectedRow('');
                setCadastrarOpen(true);
              }}
              className="flex items-center gap-0 px-3 py-2 text-sm h-8"
              text="Novo"
              icon={<PlusIcon size={18} />}
            />
          </div>
        </header>

        <DataTable
          carregando={loading}
          headers={headers}
          rows={rows || []}
          onColunaSubstituida={handleColunaSubstituida}
          meta={clientes.meta}
          onPageChange={(newPage) => {
            if (newPage !== page) setPage(newPage);
            fetchClientes({ page: newPage, perPage, filtros });
          }}
          onPerPageChange={(newPerPage) => {
            if (newPerPage !== perPage) setPerPage(newPerPage);
            fetchClientes({ page, perPage: newPerPage, filtros });
          }}
          onSearch={(e) => setSearch(e.target.value)}
          onSearchBlur={() => debouncedSearchUnico(search)}
          onSearchKeyDown={(e) => {
            if (e.key === 'Enter') debouncedSearchUnico(search);
          }}
          searchInputPlaceholder="Pesquisar por código, nome, fantasia ou CPF/CNPJ..."
          colunasFiltro={colunasDbClien}
          onFiltroChange={(novosFiltros) => {
            setFiltros(novosFiltros);
            fetchClientes({ page: 1, perPage, filtros: novosFiltros });
          }}
          limiteColunas={limiteColunas}
          onLimiteColunasChange={(novoLimite) => {
            setLimiteColunas(novoLimite);
            localStorage.setItem(
              'limiteColunasClientes',
              novoLimite.toString(),
            );
          }}
        />
      </main>

      <Cadastrar
        isOpen={cadastrarOpen}
        onClose={() => setCadastrarOpen(false)}
        title="Cadastrar Registro"
        onSuccess={() => fetchClientes({ page, perPage, filtros })}
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

      <Editar
        isOpen={editarOpen}
        onClose={() => setEditarOpen(false)}
        title="Editar Registro"
        clienteId={idCliente}
        onSuccess={() => fetchClientes({ page, perPage, filtros })}
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

export default ClientesPage;
