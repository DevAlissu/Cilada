import React, {
  ChangeEvent,
  KeyboardEvent,
  useState,
  useRef,
  useEffect,
} from 'react';
import { Meta } from '@/data/common/meta';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  FilterX,
  ChevronUp,
  ChevronDown,
  Check,
} from 'lucide-react';
import { RiFileExcel2Line } from 'react-icons/ri';
import ModalExportarExcel from '@/components/common/modalExportarExcel';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Carregamento from '@/utils/carregamento';
import SelectInput from './SelectInput2';
import SearchInput from './SearchInput2';
import FiltroDinamicoDeClientes from '@/components/common/FiltroDinamico';
const tiposDeFiltro = [
  { label: 'Começa com', value: 'começa' },
  { label: 'Contém', value: 'contém' },
  { label: 'Diferente', value: 'diferente' },
  { label: 'É nulo', value: 'nulo' },
  { label: 'Igual', value: 'igual' },
  { label: 'Maior ou igual', value: 'maior_igual' },
  { label: 'Maior que', value: 'maior' },
  { label: 'Menor ou igual', value: 'menor_igual' },
  { label: 'Menor que', value: 'menor' },
  { label: 'Não é nulo', value: 'nao_nulo' },
  { label: 'Termina com', value: 'termina' },
];

interface DataTableProps {
  headers: string[];
  rows: any[];
  meta: Meta;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearchKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSearchBlur?: () => void;
  searchInputPlaceholder?: string;
  onFiltroChange?: (
    filtros: { campo: string; tipo: string; valor: string }[],
  ) => void;

  colunasFiltro?: string[];
  carregando: boolean;
  onColunaSubstituida?: (
    colunaA: string,
    colunaB: string,
    tipo?: 'swap' | 'replace',
  ) => void;
  limiteColunas: number;
  onLimiteColunasChange: (novoLimite: number) => void;
}

export default function DataTable({
  carregando,
  headers: originalHeaders,
  rows,
  meta,
  limiteColunas,
  onLimiteColunasChange,
  onPageChange,
  onPerPageChange,
  onSearch,
  onSearchKeyDown,
  onSearchBlur,
  searchInputPlaceholder,
  onFiltroChange,
  colunasFiltro = [],
  onColunaSubstituida,
}: DataTableProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtrosColuna, setFiltrosColuna] = useState<
    Record<string, { tipo: string; valor: string }>
  >({});
  const [colunaEmEdicao, setColunaEmEdicao] = useState<string | null>(null);
  const [termoBuscaGlobal, setTermoBuscaGlobal] = useState('');
  const [termoBuscaDropdown, setTermoBuscaDropdown] = useState('');
  const [mostrarModalExportar, setMostrarModalExportar] = useState(false);
  const [mostrarModalFiltro, setMostrarModalFiltro] = useState(false);
  const [posicaoCliqueX, setPosicaoCliqueX] = useState<number | null>(null);
  const [exportando, setExportando] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [larguraTabela, setLarguraTabela] = useState(0);
  const [filtrosAvancados, setFiltrosAvancados] = useState<
    { campo: string; tipo: string; valor: string }[]
  >([]);
  const headers = ['editar', ...originalHeaders.filter((h) => h !== 'editar')];
  const editarColumnWidth = 80;

  const colunasDisponiveis = colunasFiltro
    .filter((col) => col !== 'editar' && col !== colunaEmEdicao)
    .sort();

  const perPageOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
  ];

  useEffect(() => {
    const calcularLargura = () => {
      const larguraContainer =
        containerRef.current?.offsetWidth ?? window.innerWidth;
      const larguraDisponivel = larguraContainer - 250;
      setLarguraTabela(larguraDisponivel);
    };
    calcularLargura();
    window.addEventListener('resize', calcularLargura);
    return () => window.removeEventListener('resize', calcularLargura);
  }, []);

  const handlePreviousPage = () => {
    if (meta.currentPage > 1) onPageChange(meta.currentPage - 1);
  };

  const handleNextPage = () => {
    if (meta.currentPage < meta.lastPage) onPageChange(meta.currentPage + 1);
  };

  const handlePerPageChange = (value: string) => {
    if (onPerPageChange) onPerPageChange(Number(value));
  };

  const handleInputChange = (key: string, value: string) => {
    setFiltrosColuna((prev) => ({
      ...prev,
      [key]: { tipo: prev[key]?.tipo || 'contém', valor: value },
    }));
    if (termoBuscaGlobal !== '') setTermoBuscaGlobal('');
  };

  const handleFiltroChange = (
    filtros: { campo: string; tipo: string; valor: string }[],
  ) => {
    setFiltrosAvancados(filtros);
    onFiltroChange?.(filtros);
    setMostrarModalFiltro(false);
  };

  const aplicarFiltro = () => {
    const filtrosAtualizados: { campo: string; tipo: string; valor: string }[] =
      [];

    for (const campo of Object.keys(filtrosColuna)) {
      const filtro = filtrosColuna[campo];
      if (
        filtro &&
        typeof filtro === 'object' &&
        'valor' in filtro &&
        'tipo' in filtro
      ) {
        filtrosAtualizados.push({
          campo,
          tipo: filtro.tipo ?? 'contém',
          valor: filtro.valor ?? '',
        });
      }
    }

    onFiltroChange?.(filtrosAtualizados);
  };

  return (
    <div className="border border-gray-300 dark:border-gray-300 bg-white dark:bg-zinc-900 rounded-lg flex flex-col h-[calc(100vh-10rem)] w-full overflow-hidden">
      {/* Cabeçalho de busca e filtros */}
      <div className="border-b border-gray-200 dark:border-zinc-700 p-2">
        <div className="flex justify-between items-center gap-2">
          <SearchInput
            placeholder={searchInputPlaceholder ?? 'Pesquisar...'}
            value={termoBuscaGlobal}
            onChange={(e) => {
              setTermoBuscaGlobal(e.target.value);
              setFiltrosColuna({}); // limpando filtros avançados
              onSearch?.(e); // mantém a lógica externa
            }}
            onKeyDown={onSearchKeyDown}
            onBlur={onSearchBlur}
          />

          <div className="flex items-center gap-2">
            <Dialog
              open={mostrarModalFiltro}
              onOpenChange={setMostrarModalFiltro}
            >
              <DialogContent className="max-w-[90vw] w-[90vw] max-h-full p-6 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
                <DialogHeader className="p-4 border-b border-zinc-300 dark:border-zinc-700">
                  <DialogTitle className="text-lg text-gray-800 dark:text-white uppercase">
                    Filtros avançados por coluna
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                    Selecione os campos e aplique os filtros desejados.
                  </DialogDescription>
                </DialogHeader>
                <FiltroDinamicoDeClientes
                  colunas={colunasFiltro}
                  onChange={handleFiltroChange}
                />
              </DialogContent>
            </Dialog>

            {/* Botão Exportar */}
            <Dialog
              open={mostrarModalExportar}
              onOpenChange={setMostrarModalExportar}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-1 px-2 py-1 border rounded-md bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-sm text-gray-700 dark:text-white">
                    <span className="text-base">⚙️</span> <span>Opções</span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 bg-white dark:bg-zinc-900 shadow-md border border-gray-300 dark:border-zinc-600 text-sm text-gray-700 dark:text-white">
                  {/* Toggle Filtros rápidos */}
                  <DropdownMenuItem
                    onClick={() => {
                      setMostrarFiltros((prev) => {
                        const novoEstado = !prev;
                        if (!novoEstado) {
                          setFiltrosColuna({});
                          setFiltrosColuna({});
                          onFiltroChange?.([]);
                        }
                        return novoEstado;
                      });
                    }}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    {mostrarFiltros ? (
                      <FilterX
                        size={16}
                        className="mr-2 size-4 text-amber-500 dark:text-amber-300"
                      />
                    ) : (
                      <Filter className="mr-2 size-4 text-amber-500 dark:text-amber-300" />
                    )}
                    {mostrarFiltros
                      ? 'Ocultar filtros rápidos'
                      : 'Mostrar filtros rápidos'}
                  </DropdownMenuItem>

                  {/* Modal de Filtros avançados */}
                  <DropdownMenuItem
                    onClick={() => setMostrarModalFiltro(true)}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    <Filter className="mr-2 size-4 text-blue-500 dark:text-blue-300" />
                    Filtros avançados
                  </DropdownMenuItem>

                  {/* Exportar */}
                  <DropdownMenuItem
                    onClick={() => setMostrarModalExportar(true)}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    <div className="flex">
                      <div className="flex items-center">
                        <RiFileExcel2Line className="size-4 text-green-500 dark:text-green-300" />
                      </div>{' '}
                      <div className="px-2 "> Exportar</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DialogContent className="max-w-[90vw] w-[90vw] max-h-full p-6 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
                <DialogHeader className="p-4 border-b border-zinc-300 dark:border-zinc-700">
                  <DialogTitle className="text-lg text-gray-800 dark:text-white uppercase">
                    Escolha as colunas a serem exportadas
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                    Selecione os campos a serem incluídos na exportação.
                  </DialogDescription>
                </DialogHeader>

                <ModalExportarExcel
                  exportando={exportando}
                  colunas={colunasFiltro ?? []}
                  colunasVisiveis={headers.filter((h) => h !== 'editar')}
                  onExportar={async (selecionadas) => {
                    setExportando(true);
                    try {
                      const res = await fetch(
                        '/api/clientes/exportarClientes',
                        {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            colunas: selecionadas,
                            filtros: filtrosAvancados,
                            busca: termoBuscaGlobal,
                          }),
                        },
                      );

                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'clientes.xlsx';
                      a.click();
                      window.URL.revokeObjectURL(url);

                      setMostrarModalExportar(false);
                    } catch (error) {
                      console.error('Erro na exportação:', error);
                    } finally {
                      setExportando(false);
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="flex-1 overflow-hidden">
        <div className="w-full h-full overflow-x-auto overflow-y-auto">
          <div
            className="min-w-full max-w-max mx-auto"
            style={{ width: larguraTabela }}
          >
            <table className="table-auto w-full border-collapse text-sm text-center">
              <thead className="sticky top-0 z-10  dark:bg-gray-100 border-b border-gray-300 dark:border-zinc-700">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className={`relative px-2 py-2  bg-gray-200 dark:bg-zinc-800 whitespace-nowrap text-center ${
                        header === 'editar' ? 'w-[80px]' : 'min-w-[140px]'
                      }`}
                      style={
                        header === 'editar'
                          ? { width: `${editarColumnWidth}px` }
                          : { minWidth: 140 }
                      }
                    >
                      {header !== 'editar' ? (
                        <div
                          onClick={(e) => {
                            const cliqueX = e.clientX;
                            setPosicaoCliqueX(cliqueX);
                            setColunaEmEdicao(
                              colunaEmEdicao === header ? null : header,
                            );
                          }}
                          className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                          {header.toUpperCase()}
                          {colunaEmEdicao === header ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          {header.toUpperCase()}
                        </div>
                      )}

                      {/* Dropdown de troca de coluna */}
                      {colunaEmEdicao === header && header !== 'editar' && (
                        <div
                          ref={dropdownRef}
                          className={`font-normal absolute z-20 mt-1 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded shadow max-h-48 overflow-y-auto w-auto text-center ${
                            posicaoCliqueX !== null &&
                            posicaoCliqueX > window.innerWidth - 250
                              ? 'right-0'
                              : 'left-0'
                          } max-w-[calc(100vw-2rem)]`}
                        >
                          <input
                            ref={inputRef}
                            type="text"
                            value={termoBuscaDropdown}
                            onChange={(e) =>
                              setTermoBuscaDropdown(e.target.value)
                            }
                            placeholder="Buscar coluna..."
                            className="w-full px-2 py-1 border-b border-gray-300 dark:border-zinc-600 text-sm "
                          />
                          {colunasDisponiveis
                            .filter((col) =>
                              col
                                .toLowerCase()
                                .includes(termoBuscaDropdown.toLowerCase()),
                            )
                            .map((col) => (
                              <div
                                key={col}
                                onClick={() => {
                                  const colJaVisivel = headers.includes(col);

                                  if (colJaVisivel) {
                                    // Solicita troca de lugar
                                    onColunaSubstituida?.(header, col, 'swap');
                                  } else {
                                    // Substitui diretamente
                                    onColunaSubstituida?.(
                                      header,
                                      col,
                                      'replace',
                                    );
                                  }

                                  setColunaEmEdicao(null);
                                  setTermoBuscaDropdown('');
                                }}
                                className="px-2 py-1 uppercase hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer text-sm"
                              >
                                {col}
                              </div>
                            ))}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
                {mostrarFiltros && (
                  <tr className="  bg-gray-200 dark:dark:bg-zinc-800">
                    {headers.map((header, index) =>
                      header !== 'editar' ? (
                        <th key={index} className="px-2 py-1 font-normal">
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              placeholder={`FILTRAR POR ${header.toUpperCase()}`}
                              value={filtrosColuna[header]?.valor || ''}
                              onChange={(e) =>
                                handleInputChange(header, e.target.value)
                              }
                              onKeyDown={(e) =>
                                e.key === 'Enter' && aplicarFiltro()
                              }
                              onBlur={(e) => {
                                // Só dispara aplicarFiltro se o novo foco NÃO for no botão!
                                if (
                                  !e.relatedTarget ||
                                  !dropdownRef.current?.contains(
                                    e.relatedTarget as Node,
                                  )
                                ) {
                                  aplicarFiltro();
                                }
                              }}
                              className="w-full font-normal px-2 py-1 border rounded-md text-[12px] pr-8"
                            />

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  tabIndex={-1}
                                  className="absolute right-1 p-1 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                                >
                                  <Filter size={16} />
                                </button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent
                                className="bg-white dark:bg-zinc-800 text-gray-700 dark:text-white rounded-md shadow-lg w-40 max-h-48 overflow-y-auto"
                                ref={dropdownRef}
                              >
                                {tiposDeFiltro.map((tipo) => (
                                  <DropdownMenuItem
                                    key={tipo.value}
                                    onClick={() => {
                                      const novosFiltros = {
                                        ...filtrosColuna,
                                        [header]: {
                                          tipo: tipo.value,
                                          valor:
                                            filtrosColuna[header]?.valor ?? '',
                                        },
                                      };
                                      const filtrosArray = Object.entries(
                                        novosFiltros,
                                      ).map(([campo, { tipo, valor }]) => ({
                                        campo,
                                        tipo,
                                        valor,
                                      }));
                                      setFiltrosColuna(novosFiltros);
                                      onFiltroChange?.(filtrosArray);
                                    }}
                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm p-2 flex justify-between items-center"
                                  >
                                    <span>{tipo.label}</span>
                                    {(filtrosColuna[header]?.tipo ??
                                      'igual') === tipo.value && (
                                      <Check
                                        size={16}
                                        className="text-green-600 dark:text-green-400"
                                      />
                                    )}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </th>
                      ) : (
                        <th key={index} />
                      ),
                    )}
                  </tr>
                )}
              </thead>

              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan={headers.length}>
                      <div className="flex justify-center items-center hitems-center h-[calc(100vh-22rem)]">
                        <Carregamento texto="BUSCANDO DADOS" />
                      </div>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={headers.length} className="py-4 text-center">
                      <div className="flex justify-center items-center h-[calc(100vh-22rem)]">
                        Sem dados até o momento.
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200"
                    >
                      {headers.map((key, i) => (
                        <td
                          key={i}
                          className={`border-t px-4 py-2 whitespace-nowrap ${
                            key === 'editar'
                              ? 'w-[80px] text-center'
                              : 'min-w-[140px]'
                          }`}
                          style={
                            key === 'editar'
                              ? {
                                  width: `${editarColumnWidth}px`,
                                  textAlign: 'center',
                                }
                              : { minWidth: 140 }
                          }
                        >
                          <div className="truncate">{row[key]}</div>
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="border border-gray-300 dark:border-zinc-500 bg-gray-200 dark:bg-zinc-800 px-2 py-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
            {/* Select de Qtd. Itens */}
            <div className="flex items-center gap-1">
              <span className="text-sm">Qtd. Itens:</span>
              <SelectInput
                name="itemsPagina"
                label=""
                value={meta?.perPage?.toString() ?? ''}
                options={perPageOptions}
                onValueChange={handlePerPageChange}
              />
            </div>

            {/* Select de Qtd. Colunas */}
            <div className="flex items-center  gap-1">
              <span className="text-sm">Qtd. Colunas:</span>
              <SelectInput
                name="colunasPagina"
                label=""
                value={limiteColunas?.toString()}
                options={colunasFiltro.map((_, i) => ({
                  label: `${i + 1}`,
                  value: `${i + 1}`,
                }))}
                onValueChange={(val) => onLimiteColunasChange(parseInt(val))}
              />
            </div>
          </div>

          <div className="flex gap-2 items-center text-sm">
            <button
              onClick={handlePreviousPage}
              disabled={meta?.currentPage === 1}
              className="p-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="whitespace-nowrap">
              Página {meta?.currentPage} de {meta?.lastPage}
            </span>
            <button
              onClick={handleNextPage}
              disabled={meta?.currentPage === meta?.lastPage}
              className="p-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
