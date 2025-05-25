import React, { useEffect, useRef, useState } from 'react';
import {
  Fornecedores,
  buscaFornecedores,
  getFornecedores,
} from '@/data/fornecedores/fornecedores';
import { useDebouncedCallback } from 'use-debounce';
import DataTable from '@/components/common/DataTableFiltro';
import { DefaultButton } from '@/components/common/Buttons';
import { useToast } from '@/hooks/use-toast';
import ModalCadastrarFornecedor from './modalCadastrar';
import ModalEditarFornecedor from './modalEditar';
import { GoPencil } from 'react-icons/go';
import { PlusIcon } from 'lucide-react';

const FornecedoresPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [fornecedores, setFornecedores] = useState<Fornecedores>(
    {} as Fornecedores,
  );
  const [loading, setLoading] = useState(true);
  const [cadastrarOpen, setCadastrarOpen] = useState(false);
  const [editarOpen, setEditarOpen] = useState(false);
  const [idFornecedor, setIdFornecedor] = useState<string>('');
  const [filtros, setFiltros] = useState<
    { campo: string; tipo: string; valor: string }[]
  >([]);

  const [colunasDb, setColunasDb] = useState<string[]>([]);
  const [limiteColunas, setLimiteColunas] = useState<number>(() => {
    const salvo = localStorage.getItem('limiteColunasFornecedores');
    return salvo ? parseInt(salvo, 10) : 5;
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

  const fetchFornecedores = async ({
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
      const data = await buscaFornecedores({ page, perPage, filtros });

      if (data.data?.length > 0) {
        const colunasDinamicas = Object.keys(data.data[0]).filter(
          (coluna) => coluna !== 'editar',
        );
        const colunasLimitadas = colunasDinamicas.slice(0, limiteColunas);
        setColunasDb(colunasDinamicas);
        if (!colunasLimitadas.includes('editar')) {
          colunasLimitadas.push('editar');
        }
        setHeaders(colunasLimitadas);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Erro ao carregar fornecedores',
        description: 'Verifique sua conexão e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFornecedoresUnico = async ({
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
      const data = await getFornecedores({ page, perPage, search });
      setFornecedores(data);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearchUnico = useDebouncedCallback((value: string) => {
    setPage(1);
    fetchFornecedoresUnico({ page: 1, perPage, search: value });
  }, 500);

  const rows = fornecedores.data?.map((fornecedor) => {
    const linha: Record<string, any> = {};

    headers?.forEach((coluna) => {
      linha[coluna] = fornecedor[coluna as keyof typeof fornecedor] ?? '';
    });

    linha.editar = (
      <div className="relative group flex justify-center">
        <button
          onClick={() => {
            setIdFornecedor(fornecedor.cod_credor ?? '');
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

  useEffect(() => {
    fetchFornecedores({ page: 1, perPage, filtros });
    dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limiteColunas]);

  useEffect(() => {
    if (headers.length)
      localStorage.setItem(
        'headersSelecionadosFornecedores',
        JSON.stringify(headers),
      );
  }, [headers]);

  return (
    <div className="h-full flex flex-col flex-grow border border-gray-300 bg-white dark:bg-slate-900">
      <main className="p-4 w-full">
        <header className="mb-2">
          <div className="flex justify-between mb-4 mr-6 ml-6">
            <div className="text-lg font-bold text-[#347AB6] dark:text-gray-200">
              Fornecedores
            </div>
            <DefaultButton
              onClick={() => {
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
          meta={fornecedores.meta}
          onPageChange={(newPage) => {
            if (newPage !== page) setPage(newPage);
            fetchFornecedores({ page: newPage, perPage, filtros });
          }}
          onPerPageChange={(newPerPage) => {
            if (newPerPage !== perPage) setPerPage(newPerPage);
            fetchFornecedores({ page, perPage: newPerPage, filtros });
          }}
          onSearch={(e) => setSearch(e.target.value)}
          onSearchBlur={() => debouncedSearchUnico(search)}
          onSearchKeyDown={(e) => {
            if (e.key === 'Enter') debouncedSearchUnico(search);
          }}
          searchInputPlaceholder="Pesquisar por código, nome ou fantasia"
          colunasFiltro={colunasDb}
          onFiltroChange={(novosFiltros) => {
            setFiltros(novosFiltros);
            fetchFornecedores({ page: 1, perPage, filtros: novosFiltros });
          }}
          limiteColunas={limiteColunas}
          onLimiteColunasChange={(novoLimite) => {
            setLimiteColunas(novoLimite);
            localStorage.setItem(
              'limiteColunasFornecedores',
              novoLimite.toString(),
            );
          }}
        />
      </main>

      <ModalCadastrarFornecedor
        isOpen={cadastrarOpen}
        onClose={() => setCadastrarOpen(false)}
        onSuccess={() => fetchFornecedores({ page, perPage, filtros })}
      />

      <ModalEditarFornecedor
        isOpen={editarOpen}
        onClose={() => setEditarOpen(false)}
        fornecedorId={idFornecedor}
        onSuccess={() => fetchFornecedores({ page, perPage, filtros })}
      />
    </div>
  );
};

export default FornecedoresPage;
