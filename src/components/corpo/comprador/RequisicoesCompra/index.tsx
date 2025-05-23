import { useState, useEffect } from 'react';
import { useRequisitions } from './hooks/useRequisitions';
import { colunasDbRequisicao } from './colunasDbRequisicao';
import DataTableFiltro from '@/components/common/DataTableFiltro';

export default function RequisicoesCompra() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Começa com o default, só atualiza depois
  const [headers, setHeaders] = useState<string[]>(
    colunasDbRequisicao.slice(0, 5).map((c) => c.campo),
  );
  const [limiteColunas, setLimiteColunas] = useState<number>(5);

  // Carrega localStorage só no client (sem erro SSR)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const salvoHeaders = localStorage.getItem(
        'headersSelecionadosRequisicoes',
      );
      if (salvoHeaders) {
        setHeaders(JSON.parse(salvoHeaders));
      }
      const salvoLimite = localStorage.getItem('limiteColunasRequisicoes');
      if (salvoLimite) {
        setLimiteColunas(parseInt(salvoLimite, 10));
      }
    }
  }, []);

  // Atualiza localStorage sempre que headers muda
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'headersSelecionadosRequisicoes',
        JSON.stringify(headers),
      );
    }
  }, [headers]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'limiteColunasRequisicoes',
        limiteColunas.toString(),
      );
    }
  }, [limiteColunas]);

  const { data, meta, loading, error } = useRequisitions({
    page,
    perPage,
    search,
  });

  const rows = data.map((item) => {
    const linha: Record<string, any> = {};
    headers.forEach((coluna) => {
      let valor = item[coluna as keyof typeof item];
      if (coluna.toLowerCase().includes('data') && valor) {
        valor = new Date(valor).toLocaleDateString();
      }
      linha[coluna] = valor ?? '';
    });
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
    <div className="h-full flex flex-col flex-grow border border-gray-300 bg-white dark:bg-slate-900">
      <main className="p-4 w-full">
        <header className="mb-2">
          <div className="flex justify-between mb-4 mr-6 ml-6">
            <div className="text-lg font-bold text-[#347AB6] dark:text-gray-200">
              Requisições de Compra
            </div>
          </div>
        </header>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <DataTableFiltro
          carregando={loading}
          headers={headers}
          rows={rows}
          onColunaSubstituida={handleColunaSubstituida}
          meta={meta}
          onPageChange={(newPage) => {
            if (newPage !== page) setPage(newPage);
          }}
          onPerPageChange={(newPerPage) => {
            if (newPerPage !== perPage) setPerPage(newPerPage);
          }}
          onSearch={(e) => setSearch(e.target.value)}
          searchInputPlaceholder="Pesquisar por código, fornecedor, status, etc..."
          colunasFiltro={colunasDbRequisicao.map((c) => c.campo)}
          limiteColunas={limiteColunas}
          onLimiteColunasChange={setLimiteColunas}
        />
      </main>
    </div>
  );
}
