import React, { useEffect, useState, useCallback } from 'react';
import DadosCadastrais from './_forms/DadosCadastrais';
import DadosFinanceiros from './_forms/DadosFinanceiros';
import { campoParaAba } from './_forms/campoParaAba';
import RegrasFaturamento from './_forms/RegrasFaturamento'; //'/_forms/RegrasFaturamento';
import { z } from 'zod';
import {
  ClassesFornecedor,
  Fornecedor,
  getClassesFornecedor,
  getFornecedor,
  RegraFaturamento,
  updateFornecedor,
} from '@/data/fornecedores/fornecedores';
import { cadastroFornecedorSchema } from '@/data/fornecedores/schemas';
import Carregamento from '@/utils/carregamento';
import { getBairroByDescricao } from '@/data/bairros/bairros';
import { useDebouncedCallback } from 'use-debounce';
import { CadFornecedorSearchOptions } from './modalCadastrar';
import { getPaises, Paises } from '@/data/paises/paises';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import ModalForm from '@/components/common/modalform';
import InfoModal from '@/components/common/infoModal';
import { CircleCheck } from 'lucide-react';
const tabs = [
  { name: 'Dados Cadastrais', key: 'dadosCadastrais' },
  { name: 'Dados Financeiros', key: 'dadosFinanceiros' },
  { name: 'Regras Faturamento', key: 'regraFaturamento' },
];
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // <-- adicionado
  fornecedorId: string;
}

export default function CustomModal({
  isOpen,
  fornecedorId,
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

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

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
            ...(prevF.regra_faturamento as RegraFaturamento),
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

  const handleBairroAndUpdateFornecedor = async () => {
    const bairro = await getBairroByDescricao(fornecedor.bairro);
    if (bairro) {
      setFornecedor((prev) => ({
        ...prev,
        codbairro: bairro.codbairro,
        codpais: bairro.codpais,
        codmunicipio: bairro.municipio?.codmunicipio ?? '',
      }));
    }
  };

  const handleClear = () => setFornecedor({} as Fornecedor);

  const setDisable = (
    field: 'disableIm' | 'disableIe' | 'disableSuf' | 'regraDiferenciada',
    value: boolean,
  ) => {
    setDisableFields((prev) => ({ ...prev, [field]: value }));
  };

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
        const [classesFornecedor, paises] = await Promise.all([
          getClassesFornecedor({ page: 1, perPage: 999, search: '' }),
          getPaises({ page: 1, perPage: 999, search: '' }),
        ]);
        setOptions({ classesFornecedor, paises });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    if (searchOptions.classeFornecedor) handleClassesFornecedor();
    else if (searchOptions.pais) handlePaises();
    else fetchInitialData();
  }, [searchOptions, handlePaises, handleClassesFornecedor]);

  useEffect(() => {
    if (fornecedorId) {
      const fetchFornecedor = async () => {
        const fornecedorData = await getFornecedor(fornecedorId);
        setFornecedor(fornecedorData);

        if (fornecedorData.imun === 'ISENTO') setDisable('disableIm', true);
        if (fornecedorData.iest === 'ISENTO') setDisable('disableIe', true);
        if (fornecedorData.isuframa === 'ISENTO')
          setDisable('disableSuf', true);
        if (fornecedorData.regra_faturamento)
          setDisable('regraDiferenciada', true);

        const [classesFornecedor, paises] = await Promise.all([
          getClassesFornecedor({
            page: 1,
            perPage: 999,
            search: searchOptions.classeFornecedor,
          }),
          getPaises({ page: 1, perPage: 999, search: searchOptions.pais }),
        ]);

        setOptions({ classesFornecedor, paises });
        setLoading(false);
      };
      fetchFornecedor();
    }
  }, [fornecedorId, searchOptions.pais, searchOptions.classeFornecedor]);

  const handleSubmit = async () => {
    try {
      const { disableIm, disableIe, disableSuf } = disableFields;

      if (disableIm) fornecedor.imun = 'ISENTO';
      if (disableIe) fornecedor.iest = 'ISENTO';
      if (disableSuf) fornecedor.isuframa = 'ISENTO';

      cadastroFornecedorSchema.parse({
        ...fornecedor,
        imun: { isentoIm: disableIm, imun: fornecedor.imun },
        iest: { isentoIe: disableIe, iest: fornecedor.iest },
        isuframa: { isentoSuf: disableSuf, isuframa: fornecedor.isuframa },
      });

      await handleBairroAndUpdateFornecedor();
      await updateFornecedor(fornecedor);

      setErrors({});
      setMensagemInfo('Fornecedor atualizado com sucesso!');
      setOpenInfo(true); // abre o modal de info
    } catch (error) {
      toast({
        description: 'Falha ao atualizar fornecedor.',
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
    onSuccess?.(); // <-- chama o onSuccess após fechamento
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
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center px-4">
      {fornecedor?.cod_credor === fornecedorId ? (
        <ModalForm
          titulo="Editar Fornecedor"
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={handleActiveTab}
          renderTabContent={() => <div>{renderTabContent()}</div>}
          handleSubmit={handleSubmit}
          handleClear={handleClear}
          onClose={onClose}
          loading={loading}
        />
      ) : (
        <Carregamento />
      )}

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
