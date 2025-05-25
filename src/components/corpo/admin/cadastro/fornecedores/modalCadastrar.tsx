import React, { useEffect, useState, useCallback } from 'react';
import DadosCadastrais from './_forms/DadosCadastrais';
import DadosFinanceiros from './_forms/DadosFinanceiros';
import RegrasFaturamento from './_forms/RegrasFaturamento';
import { z } from 'zod';
import InfoModal from '@/components/common/infoModal';
import ModalFormulario from '@/components/common/modalform';
import { useDebouncedCallback } from 'use-debounce';
import { getPaises, Paises } from '@/data/paises/paises';
import { getBairroByDescricao } from '@/data/bairros/bairros';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { CircleCheck } from 'lucide-react';
import { campoParaAba } from './_forms/campoParaAba';
import { cadastroFornecedorSchema } from '@/data/fornecedores/schemas';
import {
  ClassesFornecedor,
  Fornecedor,
  getClassesFornecedor,
  insertFornecedor,
  RegraFaturamento,
} from '@/data/fornecedores/fornecedores';

const tabs = [
  { name: 'Dados Cadastrais', key: 'dadosCadastrais' },
  { name: 'Dados Financeiros', key: 'dadosFinanceiros' },
  { name: 'Regras Faturamento', key: 'regraFaturamento' },
];

export type CadFornecedorSearchOptions = 'classeFornecedor' | 'pais';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CustomModal({
  isOpen,
  onClose,
  onSuccess,
}: ModalProps) {
  const [fornecedor, setFornecedor] = useState({} as Fornecedor);
  const [openInfo, setOpenInfo] = useState(false);
  const [mensagemInfo, setMensagemInfo] = useState('');
  const [activeTab, setActiveTab] = useState('dadosCadastrais');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

  const [disableFields, setDisableFields] = useState({
    disableIm: false,
    disableIe: false,
    disableSuf: false,
    regraDiferenciada: false,
  });

  const [options, setOptions] = useState({
    classesFornecedor: {} as ClassesFornecedor,
    paises: {} as Paises,
  });

  const [searchOptions, setSearchOptions] = useState({
    classeFornecedor: '',
    pais: '',
  });

  const { toast } = useToast();

  const handleActiveTab = (tab: string) => setActiveTab(tab);

  const handleFornecedorChange = useCallback(
    (
      field: keyof Fornecedor | `regra_faturamento.${keyof RegraFaturamento}`,
      value: any,
    ) => {
      if (field.startsWith('regra_faturamento.')) {
        const regraField = field.split('.')[1] as keyof RegraFaturamento;
        setFornecedor((prevF) => ({
          ...prevF,
          regra_faturamento: {
            ...(prevF.regra_faturamento as RegraFaturamento), // Type assertion aqui
            [regraField]: value,
          },
        }));
      } else {
        setFornecedor((prev) => ({ ...prev, [field]: value }));
      }

      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    },
    [],
  );

  const handleSearchOptionsChange = useDebouncedCallback(
    (option: CadFornecedorSearchOptions, value: string) => {
      setSearchOptions((prev) => ({ ...prev, [option]: value }));
    },
    300,
  );

  const handleClassesFornecedor = useCallback(async () => {
    const classesFornecedor = await getClassesFornecedor({
      page: 1,
      perPage: 999,
      search: searchOptions.classeFornecedor,
    });
    setOptions((prev) => ({ ...prev, classesFornecedor }));
    setLoading(false);
  }, [searchOptions.classeFornecedor]);

  const handlePaises = useCallback(async () => {
    const paises = await getPaises({
      page: 1,
      perPage: 999,
      search: searchOptions.pais,
    });
    setOptions((prev) => ({ ...prev, paises }));
    setLoading(false);
  }, [searchOptions.pais]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const classesFornecedor = await getClassesFornecedor({
          page: 1,
          perPage: 999,
          search: '',
        });
        const paises = await getPaises({
          page: 1,
          perPage: 999,
          search: '',
        });
        setOptions({ classesFornecedor, paises });
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };

    if (searchOptions.classeFornecedor) handleClassesFornecedor();
    else if (searchOptions.pais) handlePaises();
    else fetchInitialData();
  }, [searchOptions, handlePaises, handleClassesFornecedor]);

  const handleClear = () => setFornecedor({} as Fornecedor);

  const handleBairroAndUpdateFornecedor = async () => {
    const bairro = await getBairroByDescricao(fornecedor.bairro);
    if (bairro) {
      setFornecedor((prev) => ({
        ...prev,
        codbairro: bairro.codbairro,
        codmunicipio: bairro.municipio?.codmunicipio ?? '',
      }));
    }
  };

  const setDisable = (
    field: 'disableIm' | 'disableIe' | 'disableSuf' | 'regraDiferenciada',
    value: boolean,
  ) => {
    setDisableFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const isentoIm = disableFields.disableIm;
      const isentoIe = disableFields.disableIe;
      const isentoSuf = disableFields.disableSuf;

      if (isentoIm) fornecedor.imun = 'ISENTO';
      if (isentoIe) fornecedor.iest = 'ISENTO';
      if (isentoSuf) fornecedor.isuframa = 'ISENTO';

      cadastroFornecedorSchema.parse({
        ...fornecedor,
        imun: { isentoIm, imun: fornecedor.imun },
        iest: { isentoIe, iest: fornecedor.iest },
        isuframa: { isentoSuf, isuframa: fornecedor.isuframa },
      });

      await handleBairroAndUpdateFornecedor();
      await insertFornecedor(fornecedor);
      setErrors({});
      setMensagemInfo('Fornecedor cadastrado com sucesso!');
      setOpenInfo(true); // <-- ativa InfoModal
    } catch (error) {
      toast({
        description: 'Falha ao cadastrar fornecedor.',
        variant: 'destructive',
      });

      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) fieldErrors[err.path[0]] = err.message;
        });

        const firstError = error.errors[0];
        const fieldWithError = firstError.path[0];
        const abaDoErro = campoParaAba[fieldWithError];

        if (abaDoErro) {
          setActiveTab(abaDoErro);
          setTimeout(() => {
            const el = document.getElementById(fieldWithError as string);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              (el as HTMLInputElement).focus();
            }
          }, 100);
        }

        setErrors(fieldErrors);
      }
    }
  };

  const handleCloseInfoModal = () => {
    setOpenInfo(false);
    onClose();
    onSuccess?.(); // <-- chama onSuccess após o fechamento do modal de sucesso
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dadosCadastrais':
        return (
          <DadosCadastrais
            fornecedor={fornecedor}
            handleFornecedorChange={handleFornecedorChange}
            error={errors}
            setDisable={setDisable}
            disableFields={disableFields}
            options={options}
            handleSearchOptionsChange={handleSearchOptionsChange}
          />
        );
      case 'dadosFinanceiros':
        return (
          <DadosFinanceiros
            fornecedor={fornecedor}
            handleFornecedorChange={handleFornecedorChange}
            error={errors}
          />
        );
      case 'regraFaturamento':
        return (
          <RegrasFaturamento
            fornecedor={fornecedor}
            handleFornecedorChange={handleFornecedorChange}
            error={errors}
            setDisable={setDisable}
            disableFields={disableFields}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <ModalFormulario
        titulo="Cadastro de Fornecedor"
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={handleActiveTab}
        renderTabContent={renderTabContent}
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
