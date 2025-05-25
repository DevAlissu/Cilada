import React, { useEffect, useState, useCallback } from 'react';
import DadosCadastrais from './_forms/DadosCadastrais';
import DadosFinanceiros from './_forms/DadosFinanceiros';
import DadosComerciais from './_forms/DadosComerciais';
import ComprasTabs from './_forms/_components/ComprasTabs';
import { Cliente, getCliente, updateCliente } from '@/data/clientes/clientes';
import ModalForm from '@/components/common/modalform';
import InfoModal from '@/components/common/infoModal';
import { z } from 'zod';
import { cadastroClientesSchema } from '@/data/clientes/clientesSchema';
import { Bancos, getBancos } from '@/data/bancos/bancos';
import { cClientes, getcClientes } from '@/data/cClientes/cClientes';
import { useDebouncedCallback } from 'use-debounce';
import {
  getUltimoLimiteCliente,
  insertLimiteCliente,
  Limite,
} from '@/data/clientes/limites';
import FormInput from '@/components/common/FormInput';
import { AuxButton, DefaultButton } from '@/components/common/Buttons';
import { getPaises, Paises } from '@/data/paises/paises';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Carregamento from '@/utils/carregamento';
import { CircleCheck } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  clienteId: string;
  onSuccess?: () => void;
}

const tabs = [
  { name: 'Dados Cadastrais', key: 'dadosCadastrais' },
  { name: 'Dados Financeiros', key: 'dadosFinanceiros' },
  { name: 'Dados Comerciais', key: 'dadosComerciais' },
];

export type SearchOptions = 'banco' | 'pais' | 'cCliente';

const campoParaAba: Record<string, string> = {
  cpfcgc: 'dadosCadastrais',
  nome: 'dadosCadastrais',
  cep: 'dadosCadastrais',
  ender: 'dadosCadastrais',
  numero: 'dadosCadastrais',
  uf: 'dadosCadastrais',
  cidade: 'dadosCadastrais',
  bairro: 'dadosCadastrais',
  codpais: 'dadosCadastrais',
  tipocliente: 'dadosCadastrais',
  sit_tributaria: 'dadosCadastrais',
  imun: 'dadosCadastrais',
  iest: 'dadosCadastrais',
  isuframa: 'dadosCadastrais',
  claspgto: 'dadosFinanceiros',
  atraso: 'dadosFinanceiros',
  icms: 'dadosFinanceiros',
  banco: 'dadosFinanceiros',
  mesmoEndereco: 'dadosFinanceiros',
  cepcobr: 'dadosFinanceiros',
  endercobr: 'dadosFinanceiros',
  numcobr: 'dadosFinanceiros',
  ufcobr: 'dadosFinanceiros',
  cidadecobr: 'dadosFinanceiros',
  bairrocobr: 'dadosFinanceiros',
  codpaiscobr: 'dadosFinanceiros',
  limite: 'dadosFinanceiros',
  prvenda: 'dadosComerciais',
  kickback: 'dadosComerciais',
  bloquear_preco: 'dadosComerciais',
};

const LimitChangeModal = ({
  isLimitModalOpen,
  handleLimitCommentChange,
  limite,
  cliente,
  handleOpenLimiteModal,
  handleFinishSubmission,
}: any) => {
  const [limitChangeError, setLimitChangeError] = useState('');
  const [comment, setComment] = useState('');

  if (!isLimitModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-gray-700">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          Confirmação de Alteração de Limite
        </h2>
        <p className="mb-4">
          O limite do cliente foi alterado de {limite.ultimo_limite} para{' '}
          {cliente.limite}. Por favor, forneça um motivo para esta alteração:
        </p>
        <FormInput
          name="limitChangeComment"
          label="Motivo"
          type="text"
          onChange={(e) => {
            handleLimitCommentChange(e.target.value);
            setComment(e.target.value);
          }}
          error={limitChangeError}
          required
        />
        <div className="flex justify-end gap-4 mt-4">
          <AuxButton
            text="Voltar"
            onClick={() => handleOpenLimiteModal(false)}
          />
          <DefaultButton
            text="Confirmar"
            onClick={() => {
              if (!comment) {
                setLimitChangeError('É necessário fornecer um motivo.');
                return;
              }
              handleOpenLimiteModal(false);
              handleFinishSubmission();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function CustomModal({
  isOpen,
  clienteId,
  onSuccess,
  onClose,
}: ModalProps) {
  const [activeTab, setActiveTab] = useState('dadosCadastrais');
  const [activeComprasTab, setActiveComprasTab] = useState('ultimosMeses');
  const [cliente, setCliente] = useState({} as Cliente);
  const [limite, setLimite] = useState<Limite>({} as Limite);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({
    bancos: {} as Bancos,
    paises: {} as Paises,
    cClientes: {} as cClientes,
  });
  const [searchOptions, setSearchOptions] = useState({
    banco: '',
    pais: '',
    cClientes: '',
  });
  const [disableFields, setDisableFields] = useState({
    disableIm: false,
    disableIe: false,
    disableSuf: false,
    aceitarAtraso: false,
  });
  const [mesmoEnderecoCobranca, setMesmoEnderecoCobranca] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [limitChangeComment, setLimitChangeComment] = useState('');
  const [openInfo, setOpenInfo] = useState(false);
  const [mensagemInfo, setMensagemInfo] = useState('');
  const { toast } = useToast();

  const handleSearchOptionsChange = useDebouncedCallback(
    (option: SearchOptions, value: string) => {
      setSearchOptions((prev) => ({ ...prev, [option]: value }));
    },
    300,
  );

  const handleClienteChange = (field: keyof Cliente, value: any) => {
    setCliente((prev) => ({ ...prev, [field]: value }));
  };

  const setDisable = (
    field: 'disableIm' | 'disableIe' | 'disableSuf' | 'aceitarAtraso',
    value: boolean,
  ) => setDisableFields((prev) => ({ ...prev, [field]: value }));

  const handleBancos = useCallback(async (search = '') => {
    const bancos = await getBancos({ page: 1, perPage: 999, search });
    setOptions((prev) => ({ ...prev, bancos }));
  }, []);

  const handlePaises = useCallback(async (search = '') => {
    const paises = await getPaises({ page: 1, perPage: 999, search });
    setOptions((prev) => ({ ...prev, paises }));
  }, []);

  const handleCClientes = useCallback(async (search = '') => {
    const cClientes = await getcClientes({ page: 1, perPage: 999, search });
    setOptions((prev) => ({ ...prev, cClientes }));
  }, []);

  const fetchClienteData = useCallback(async () => {
    setLoading(true);

    const clienteData = await getCliente(clienteId);

    setCliente(clienteData);
    if (clienteData.imun === 'ISENTO') setDisable('disableIm', true);
    if (clienteData.iest === 'ISENTO') setDisable('disableIe', true);
    if (clienteData.isuframa === 'ISENTO') setDisable('disableSuf', true);
    if (clienteData.atraso && clienteData.atraso > 0)
      setDisable('aceitarAtraso', true);
    if (
      clienteData.cep === clienteData.cepcobr &&
      clienteData.numero === clienteData.numerocobr
    ) {
      setMesmoEnderecoCobranca(true);
    }
    await Promise.all([handleBancos(), handlePaises(), handleCClientes()]);
    setLoading(false);
  }, [clienteId, handleBancos, handlePaises, handleCClientes]);

  useEffect(() => {
    if (isOpen && clienteId) {
      fetchClienteData();
      getUltimoLimiteCliente(clienteId).then(setLimite);
    }
  }, [isOpen, clienteId, fetchClienteData]);

  useEffect(() => {
    if (searchOptions.banco.trim()) handleBancos(searchOptions.banco);
  }, [searchOptions.banco, handleBancos]);

  useEffect(() => {
    if (searchOptions.pais.trim()) handlePaises(searchOptions.pais);
  }, [searchOptions.pais, handlePaises]);

  useEffect(() => {
    if (searchOptions.cClientes.trim())
      handleCClientes(searchOptions.cClientes);
  }, [searchOptions.cClientes, handleCClientes]);

  const finishSubmission = () => {
    updateCliente(cliente);
    const sessionUser = JSON.parse(
      sessionStorage.getItem('perfilUserMelo') || '{}',
    );
    insertLimiteCliente(cliente, limitChangeComment, sessionUser.codusr);
    setErrors({});
    setMensagemInfo('Cliente atualizado com sucesso!');
    setOpenInfo(true);
  };

  const handleSubmit = () => {
    try {
      if (mesmoEnderecoCobranca) {
        setCliente((prev) => ({
          ...prev,
          endercobr: prev.ender,
          numerocobr: prev.numero,
          complementocobr: prev.complemento,
          bairrocobr: prev.bairro,
          cidadecobr: prev.cidade,
          ufcobr: prev.uf,
          codpaiscobr: prev.codpais,
          cepcobr: prev.cep,
        }));
      }

      cadastroClientesSchema.parse({
        ...cliente,
        limite: Number(cliente.limite),
        imun: { isentoIm: disableFields.disableIm, imun: cliente.imun },
        iest: { isentoIe: disableFields.disableIe, iest: cliente.iest },
        isuframa: {
          isentoSuf: disableFields.disableSuf,
          isuframa: cliente.isuframa,
        },
        atraso: {
          aceitarAtraso: disableFields.aceitarAtraso,
          atraso: cliente.atraso,
        },
        mesmoEndereco: mesmoEnderecoCobranca,
      });

      if (limite && Number(cliente.limite) !== Number(limite.ultimo_limite)) {
        setIsLimitModalOpen(true);
        return;
      }

      finishSubmission();
    } catch (error) {
      toast({
        description: 'Falha ao atualizar cliente.',
        variant: 'destructive',
      });

      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((e) => {
          if (e.path.length > 0) fieldErrors[e.path[0]] = e.message;
        });

        const fieldWithError = error.errors[0]?.path?.[0];
        const abaDoErro = campoParaAba[fieldWithError];
        if (abaDoErro) {
          setActiveTab(abaDoErro);
          setTimeout(() => {
            const el = document.getElementById(fieldWithError as string);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (el as HTMLElement)?.focus?.();
          }, 100);
        }

        setErrors(fieldErrors);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center px-4">
      {cliente?.codcli === clienteId ? (
        <ModalForm
          titulo="Editar Cliente"
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          renderTabContent={() => (
            <>
              {
                {
                  dadosCadastrais: (
                    <DadosCadastrais
                      cliente={cliente}
                      handleClienteChange={handleClienteChange}
                      error={errors}
                      usarMesmoEnderecoCobranca={mesmoEnderecoCobranca}
                      handleMesmoEnderecoCobranca={setMesmoEnderecoCobranca}
                      setDisable={setDisable}
                      disableFields={disableFields}
                      options={options}
                      handleSearchOptionsChange={handleSearchOptionsChange}
                      isEdit
                    />
                  ),
                  dadosFinanceiros: (
                    <>
                      <DadosFinanceiros
                        cliente={cliente}
                        handleClienteChange={handleClienteChange}
                        error={errors}
                        usarMesmoEnderecoCobranca={mesmoEnderecoCobranca}
                        setDisable={setDisable}
                        disableFields={disableFields}
                        options={options}
                        handleSearchOptionsChange={handleSearchOptionsChange}
                        limite={limite}
                        isEdit
                      />
                      <ComprasTabs
                        activeComprasTab={activeComprasTab}
                        setActiveComprasTab={setActiveComprasTab}
                      />
                    </>
                  ),
                  dadosComerciais: (
                    <DadosComerciais
                      cliente={cliente}
                      handleClienteChange={handleClienteChange}
                      error={errors}
                      options={options}
                      handleSearchOptionsChange={handleSearchOptionsChange}
                      isEdit
                    />
                  ),
                }[activeTab]
              }
            </>
          )}
          handleSubmit={handleSubmit}
          handleClear={() => setCliente({} as Cliente)}
          onClose={onClose}
          loading={loading}
        />
      ) : (
        <Carregamento />
      )}

      <LimitChangeModal
        isLimitModalOpen={isLimitModalOpen}
        handleLimitCommentChange={setLimitChangeComment}
        limite={limite}
        cliente={cliente}
        handleOpenLimiteModal={setIsLimitModalOpen}
        handleFinishSubmission={finishSubmission}
      />

      <InfoModal
        isOpen={openInfo}
        onClose={() => {
          setOpenInfo(false);
          onSuccess?.();
          onClose();
        }}
        title="INFORMAÇÃO IMPORTANTE"
        icon={<CircleCheck className="text-green-500 w-6 h-6" />}
        content={mensagemInfo}
      />

      <Toaster />
    </div>
  );
}
