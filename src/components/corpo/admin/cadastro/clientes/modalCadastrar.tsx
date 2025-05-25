// ✅ modalCadastrar.tsx

import React, { useEffect, useState, useCallback, useRef } from 'react';
import DadosCadastrais from './_forms/DadosCadastrais';
import DadosFinanceiros from './_forms/DadosFinanceiros';
import DadosComerciais from './_forms/DadosComerciais';
import { Cliente, insertClienteComLimite } from '@/data/clientes/clientes';
import { cadastroClientesSchema } from '@/data/clientes/clientesSchema';
import { Bancos, getBancos } from '@/data/bancos/bancos';
import { cClientes, getcClientes } from '@/data/cClientes/cClientes';
import { getPaises, Paises } from '@/data/paises/paises';
import { getBairroByDescricao } from '@/data/bairros/bairros';
import ModalFormulario from '@/components/common/modalform';
import InfoModal from '@/components/common/infoModal';
import { useDebouncedCallback } from 'use-debounce';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { CircleCheck } from 'lucide-react';
import { campoParaAba } from './_forms/campoParaAba';
import { z } from 'zod';
export type CadClienteSearchOptions = 'banco' | 'pais' | 'cCliente';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onSuccess?: () => void;
}

const tabs = [
  { name: 'Dados Cadastrais', key: 'dadosCadastrais' },
  { name: 'Dados Financeiros', key: 'dadosFinanceiros' },
  { name: 'Dados Comerciais', key: 'dadosComerciais' },
];

export default function CustomModal({
  isOpen,
  onClose,
  onSuccess,
}: ModalProps) {
  const [openInfo, setOpenInfo] = useState(false);
  const [mensagemInfo, setMensagemInfo] = useState('');
  const [activeTab, setActiveTab] = useState('dadosCadastrais');
  const [cliente, setCliente] = useState({} as Cliente);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [mesmoEnderecoCobranca, setMesmoEnderecoCobranca] = useState(false);
  const [disableFields, setDisableFields] = useState({
    disableIm: false,
    disableIe: false,
    disableSuf: false,
    aceitarAtraso: false,
  });
  const [options, setOptions] = useState({
    bancos: {} as Bancos,
    paises: {} as Paises,
    cClientes: {} as cClientes,
  });
  const [searchOptions, setSearchOptions] = useState({
    banco: '',
    pais: '',
    cCliente: '',
  });

  const loadedOnce = useRef(false);
  const { toast } = useToast();

  const handleClienteChange = useCallback(
    (field: keyof Cliente, value: any) => {
      setCliente((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const handleClear = () => setCliente({} as Cliente);
  const handleActiveTab = (tab: string) => setActiveTab(tab);
  const handleMesmoEnderecoCobranca = (value: boolean) =>
    setMesmoEnderecoCobranca(value);
  const setDisable = (field: keyof typeof disableFields, value: boolean) =>
    setDisableFields((prev) => ({ ...prev, [field]: value }));

  const handleSearchOptionsChange = useDebouncedCallback(
    (option: 'banco' | 'pais' | 'cCliente', value: string) => {
      setSearchOptions((prev) => ({ ...prev, [option]: value }));
    },
    300,
  );

  const fetchInitialData = useCallback(async () => {
    try {
      const bancos = await getBancos({ page: 1, perPage: 9999, search: '' });
      const paises = await getPaises({ page: 1, perPage: 9999, search: '' });
      const cClientes = await getcClientes({
        page: 1,
        perPage: 9999,
        search: '',
      });
      setOptions((prev) => ({ ...prev, bancos, paises, cClientes }));
    } catch (err) {
      console.error('Erro ao carregar dados iniciais:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !loadedOnce.current) {
      loadedOnce.current = true;
      setLoading(true);
      fetchInitialData();
    }
  }, [isOpen, fetchInitialData]);
  useEffect(() => {
    if (!isOpen) {
      loadedOnce.current = false;
      setCliente({} as Cliente);
      setErrors({});
      setActiveTab('dadosCadastrais');
    }
  }, [isOpen]);
  useEffect(() => {
    if (isOpen && searchOptions.banco.trim()) {
      getBancos({ page: 1, perPage: 9999, search: searchOptions.banco }).then(
        (bancos) => {
          setOptions((prev) => ({ ...prev, bancos }));
        },
      );
    }
  }, [searchOptions.banco, isOpen]);

  useEffect(() => {
    if (isOpen && searchOptions.pais.trim()) {
      getPaises({ page: 1, perPage: 9999, search: searchOptions.pais }).then(
        (paises) => {
          setOptions((prev) => ({ ...prev, paises }));
        },
      );
    }
  }, [searchOptions.pais, isOpen]);

  useEffect(() => {
    if (isOpen && searchOptions.cCliente.trim()) {
      getcClientes({
        page: 1,
        perPage: 9999,
        search: searchOptions.cCliente,
      }).then((cCliente) => {
        setOptions((prev) => ({ ...prev, cCliente }));
      });
    }
  }, [searchOptions.cCliente, isOpen]);

  const handleBairroAndUpdateCliente = async () => {
    const bairro = await getBairroByDescricao(cliente.bairro);
    if (bairro) {
      setCliente((prev) => ({
        ...prev,
        codbairro: bairro.codbairro,
        codmunicipio: bairro.municipio?.codmunicipio ?? '',
      }));
    }
    if (cliente.bairrocobr && cliente.bairro !== cliente.bairrocobr) {
      const bairroCobr = await getBairroByDescricao(cliente.bairrocobr);
      if (bairroCobr) {
        setCliente((prev) => ({
          ...prev,
          codbairrocobr: bairroCobr.codbairro,
          codmunicipiocobr: bairroCobr.municipio?.codmunicipio ?? '',
        }));
      }
    } else {
      setCliente((prev) => ({
        ...prev,
        codbairrocobr: bairro?.codbairro ?? '',
        codmunicipiocobr: bairro?.municipio?.codmunicipio ?? '',
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const sessionUser = JSON.parse(
        sessionStorage.getItem('perfilUserMelo') || '{}',
      );

      let clienteAtualizado = { ...cliente };
      if (
        clienteAtualizado.debito === undefined ||
        clienteAtualizado.debito === null
      ) {
        clienteAtualizado.debito = 0;
      }
      if (mesmoEnderecoCobranca) {
        clienteAtualizado = {
          ...clienteAtualizado,
          endercobr: clienteAtualizado.ender,
          numerocobr: clienteAtualizado.numero,
          complementocobr: clienteAtualizado.complemento,
          bairrocobr: clienteAtualizado.bairro,
          cidadecobr: clienteAtualizado.cidade,
          ufcobr: clienteAtualizado.uf,
          codpaiscobr: clienteAtualizado.codpais,
          cepcobr: clienteAtualizado.cep,
        };
      }

      cadastroClientesSchema.parse({
        ...clienteAtualizado,
        imun: {
          isentoIm: disableFields.disableIm,
          imun: clienteAtualizado.imun,
        },
        iest: {
          isentoIe: disableFields.disableIe,
          iest: clienteAtualizado.iest,
        },
        isuframa: {
          isentoSuf: disableFields.disableSuf,
          isuframa: clienteAtualizado.isuframa,
        },
        atraso: {
          aceitarAtraso: disableFields.aceitarAtraso,
          atraso: clienteAtualizado.atraso,
        },
        mesmoEndereco: mesmoEnderecoCobranca,
      });

      if (disableFields.disableIm) clienteAtualizado.imun = 'ISENTO';
      if (disableFields.disableIe) clienteAtualizado.iest = 'ISENTO';
      if (disableFields.disableSuf) clienteAtualizado.isuframa = 'ISENTO';

      await handleBairroAndUpdateCliente();

      // 🔵 AQUI a principal mudança:
      await insertClienteComLimite(
        clienteAtualizado,
        'LIMITE DE CADASTRO INICIAL',
        sessionUser.codusr,
      );

      setErrors({});
      setMensagemInfo('Cliente cadastrado com sucesso!');
      setOpenInfo(true);
    } catch (error) {
      toast({
        description: 'Falha ao cadastrar cliente.',
        variant: 'destructive',
      });

      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((e) => {
          if (e.path.length > 0) fieldErrors[e.path[0]] = e.message;
        });

        const firstError = error.errors[0];
        const fieldWithError = firstError.path[0];
        const abaDoErro = campoParaAba[fieldWithError];

        if (abaDoErro) {
          setActiveTab(abaDoErro);
          setTimeout(() => {
            const el = document.getElementById(fieldWithError as string);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (el as HTMLElement)?.focus?.();
            el?.querySelector<HTMLElement>(
              'input, button, [tabindex], [role="combobox"]',
            )?.click();
          }, 100);
        }

        setErrors(fieldErrors);
      }
    }
  };

  const handleCloseInfoModal = () => {
    setOpenInfo(false);
    onSuccess?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div>
      <ModalFormulario
        titulo="Cadastro de Cliente"
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={handleActiveTab}
        renderTabContent={() => {
          switch (activeTab) {
            case 'dadosCadastrais':
              return (
                <DadosCadastrais
                  cliente={cliente}
                  handleClienteChange={handleClienteChange}
                  error={errors}
                  usarMesmoEnderecoCobranca={mesmoEnderecoCobranca}
                  handleMesmoEnderecoCobranca={handleMesmoEnderecoCobranca}
                  setDisable={setDisable}
                  disableFields={disableFields}
                  options={options}
                  handleSearchOptionsChange={handleSearchOptionsChange}
                />
              );
            case 'dadosFinanceiros':
              return (
                <DadosFinanceiros
                  cliente={cliente}
                  handleClienteChange={handleClienteChange}
                  error={errors}
                  usarMesmoEnderecoCobranca={mesmoEnderecoCobranca}
                  setDisable={setDisable}
                  disableFields={disableFields}
                  options={options}
                  handleSearchOptionsChange={handleSearchOptionsChange}
                />
              );
            case 'dadosComerciais':
              return (
                <DadosComerciais
                  cliente={cliente}
                  handleClienteChange={handleClienteChange}
                  error={errors}
                  options={options}
                  handleSearchOptionsChange={handleSearchOptionsChange}
                />
              );
            default:
              return null;
          }
        }}
        handleSubmit={handleSubmit}
        handleClear={handleClear}
        onClose={onClose}
        loading={loading}
      />

      <InfoModal
        isOpen={openInfo}
        onClose={handleCloseInfoModal}
        title="INFORMAÇÃO IMPORTANTE"
        icon={<CircleCheck className="text-green-500 w-6 h-6" />}
        content={mensagemInfo}
      />
      <Toaster />
    </div>
  );
}
