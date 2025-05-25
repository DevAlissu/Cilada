import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import DataTable from '@/components/common/DataTableFiltro';
import SearchInput from '@/components/common/SearchInput';
import { DefaultButton } from '@/components/common/Buttons';
import { PlusIcon } from 'lucide-react';
import RequisitionModal from './RequisitionModal';

interface Meta {
  currentPage: number;
  lastPage: number;
  perPage: number;
}

interface RequisitionRow {
  id: number;
  ordemCompra: string;
  dataO: string;
  statusO: string;
  requisicao: string;
  versao: string;
  tipo: string;
  dataR: string;
  statusR: string;
  acao?: any;
}

export default function PageSidebar() {
  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
  const [rows, setRows] = useState<RequisitionRow[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [meta, setMeta] = useState<Meta>({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
  });

  const headers = [
    'Ordem de Compra',
    'Data O.',
    'Status O.',
    'Requisição',
    'Versão',
    'Tipo',
    'Data R.',
    'Status R.',
    '', // Cabeçalho para ações
  ];

  const fetchData = async () => {
    console.log('Buscando dados...');
    const newRows: RequisitionRow[] = [
      {
        id: 1,
        ordemCompra: 'OC0001',
        dataO: '2025-02-01',
        statusO: 'Aprovada',
        requisicao: 'REQ10231',
        versao: 'Compra',
        tipo: 'A',
        dataR: '2025-04-01',
        statusR: 'Finalizada',
        acao: '...',
      },
      {
        id: 2,
        ordemCompra: 'OC0002',
        dataO: '2025-02-01',
        statusO: 'Aprovada',
        requisicao: 'REQ10231',
        versao: 'Compra',
        tipo: 'A',
        dataR: '2025-04-01',
        statusR: 'Finalizada',
        acao: '...',
      },
    ];
    setRows(newRows);
    console.log('Dados carregados:', newRows);
  };

  const handleOpenRequisitionModal = () => {
    setIsRequisitionModalOpen(true);
  };

  const handleSaveRequisition = async (data: any) => { // Use a interface RequisitionFormData aqui
    console.log('Salvando requisição:', data);
    // Aqui você faria a chamada à API para salvar os dados
    // Exemplo:
    // await api.post('/requisicoes', data);
    // Pode querer recarregar os dados da tabela após salvar:
    // fetchData();
    // A mensagem de sucesso e o fechamento do modal já são tratados dentro do RequisitionModal
  };

  const handleCloseRequisitionModal = () => {
    setIsRequisitionModalOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (page: number) => {
    setMeta((prevMeta) => ({
      ...prevMeta,
      currentPage: page,
    }));
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Realizar busca por:', searchQuery);
    }
  };

  const handleSearchBlur = () => {
    // console.log('Search input blurred');
  };

  return (
<div className="h-full flex w-full flex-col p-6 bg-muted/40 text-black dark:text-gray-50">
      {/* Linha do Título e Botão Novo */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Requisições de Clientes</h1>
        <DefaultButton
          onClick={handleOpenRequisitionModal} // Abre o modal
          className="flex items-center gap-1 px-3 py-2 text-sm h-8"
          text="NOVO"
          icon={<PlusIcon size={18} />}
        />
      </div>

      {/* Linha da Barra de Busca (e outros botões, se houver) */}
      <div className="flex justify-between items-center mb-4">
        {/* Campo de Busca */}

        {/* Espaço para outros botões como "Sugestões", "Filtros", "Exportar", se você os adicionar de volta */}
        <div className="flex space-x-2">
          {/* Exemplo se você quiser adicionar os outros botões de volta:
            <button className="px-4 py-2 border rounded-md text-sm">Sugestões</button>
            <button className="px-4 py-2 border rounded-md text-sm">Filtros</button>
            <button className="px-4 py-2 border rounded-md text-sm">Exportar</button>
          */}
        </div>
      </div>

      {/* DataTable */}
      {rows.length > 0 ? (
        <DataTable
          headers={headers}
          rows={rows.map(row => ({
            ordemCompra: row.ordemCompra,
            dataO: row.dataO,
            statusO: row.statusO,
            requisicao: row.requisicao,
            versao: row.versao,
            tipo: row.tipo,
            dataR: row.dataR,
            statusR: row.statusR,
            acao: (
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            ),
          }))}
          meta={meta}
          onPageChange={handlePageChange}
        />
      ) : (
        <div className="text-center text-gray-500 py-10">Nenhum dado disponível.</div>
      )}
            {/* Modal de Requisição */}
        <RequisitionModal
        isOpen={isRequisitionModalOpen}
        onClose={handleCloseRequisitionModal}
        onSave={handleSaveRequisition}
        title="Informe os dados de requisição"
      />
    </div>
  );
}