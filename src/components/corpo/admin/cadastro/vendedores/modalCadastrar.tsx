import React, { useEffect, useState, useCallback } from 'react';
import { z } from 'zod';
import InfoModal from '@/components/common/infoModal';
import ModalFormulario from '@/components/common/modalform';
import { useDebouncedCallback } from 'use-debounce';
import { Bairros, getBairros } from '@/data/bairros/bairros';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { CircleCheck } from 'lucide-react';
import {
  ClassesVendedor,
  DetalhadoVendedor,
  getClassesVendedor, insertVendedor,
  Vendedor,
  VendedorPst,
} from '@/data/vendedores/vendedores';
import { getGruposProduto, GruposProduto } from '@/data/gruposProduto/gruposProduto';
import DadosCadastrais from '@/components/corpo/admin/cadastro/vendedores/_forms/DadosCadastrais';
import { cadastroVendedorSchema } from '@/data/vendedores/schemas';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const tabs = [
  { name: 'Dados Cadastrais', key: 'dadosCadastrais' },
];

export type CadVendedorSearchOptions = 'classeVendedor'|'bairro'|'grupoProduto';

export default function CustomModal({ isOpen, onClose }: ModalProps) {
  const [openInfo, setOpenInfo] = useState(false);
  const [mensagemInfo, setMensagemInfo] = useState('');
  const [activeTab, setActiveTab] = useState('dadosCadastrais');
  const [vendedor, setVendedor] = useState({} as Vendedor);
  const [detalhadoVendedor, setDetalhadoVendedor] = useState<DetalhadoVendedor>({} as DetalhadoVendedor);
  const [pstVendedor, setPstVendedor] = useState<VendedorPst>({} as VendedorPst);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [options, setOptions] = useState({
    classesVendedor: {} as ClassesVendedor,
    bairros: {} as Bairros,
    gruposProduto: {} as GruposProduto,
  });
  const [searchOptions, setSearchOptions] = useState({
    classeVendedor: '',
    bairro: '',
    grupoProduto: '',
  });
  const { toast } = useToast();

  const handleVendedorChange = (field: keyof Vendedor | `detalhado_vendedor.${keyof DetalhadoVendedor}` | 'grupos_produto' | `pst.${keyof VendedorPst}`, value: any) => {
    if (field.startsWith('detalhado_vendedor.')) {
      const detalhadoVendedorField = field.split('.')[1] as keyof DetalhadoVendedor;

      setDetalhadoVendedor((prevDetalhadoVendedor) => ({
        ...prevDetalhadoVendedor,
        [detalhadoVendedorField]: value,
      }));
      setVendedor((prevVendedor) => ({
        ...prevVendedor,
        detalhado_vendedor: detalhadoVendedor,
      }));
    } else if (field === 'grupos_produto') {
      setVendedor((prevVendedor) => ({
        ...prevVendedor,
        grupos_produto: value,
      }));
    } else if (field.startsWith('pst.')) {
      const pstField = field.split('.')[1] as keyof VendedorPst;
      setPstVendedor((prevPstVendedor) => ({
        ...prevPstVendedor,
        [pstField]: value,
      }));
      setVendedor((prevVendedor) => ({
        ...prevVendedor,
        pst: pstVendedor,
      }));
    } else {
      setVendedor((prevVendedor) => ({
        ...prevVendedor,
        [field]: value,
      }));
    }

    setErrors((prevErrors) => {
      const updated = { ...prevErrors };
      delete updated[field];
      return updated;
    });
  };

  const handleRemoveGrupoProduto = (codgpp: string) => {
    setVendedor((prevVendedor) => ({
      ...prevVendedor,
      grupos_produto: prevVendedor.grupos_produto?.filter((grupo) => grupo.codgpp !== codgpp),
    }));
  };

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleClear = () => {
    setVendedor({} as Vendedor);
  };

  const handleSearchOptionsChange = useDebouncedCallback(
    (option: CadVendedorSearchOptions, value: string) => {
      setSearchOptions((prevState) => ({
        ...prevState,
        [option]: value,
      }));
    },
    300,
  );

  const handleClassesVendedor = useCallback(async () => {
    const classesVendedor = await getClassesVendedor({
      page: 1,
      perPage: 999,
      search: searchOptions.classeVendedor,
    });
    setOptions((prevState) => ({
      ...prevState,
      classesVendedor,
    }));
    setLoading(false);
  }, [searchOptions.classeVendedor]);

  const handleBairros = useCallback(async () => {
    const bairros = await getBairros({
      page: 1,
      perPage: 999,
      search: searchOptions.bairro,
    });
    setOptions((prevState) => ({
      ...prevState,
      bairros,
    }));
    setLoading(false);
  }, [searchOptions.bairro]);

  const handleGruposProduto = useCallback(async () => {
    const gruposProduto = await getGruposProduto({
      page: 1,
      perPage: 999,
      search: searchOptions.grupoProduto,
    });
    setOptions((prevState) => ({
      ...prevState,
      gruposProduto,
    }));
    setLoading(false);
  }, [searchOptions.grupoProduto]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const classesVendedor = await getClassesVendedor({
          page: 1,
          perPage: 999,
          search: searchOptions.classeVendedor,
        });
        const bairros = await getBairros({
          page: 1,
          perPage: 999,
          search: searchOptions.bairro,
        });
        const gruposProduto = await getGruposProduto({
          page: 1,
          perPage: 999,
          search: searchOptions.grupoProduto,
        });
        setOptions((prevState) => ({
          ...prevState,
          classesVendedor,
          bairros,
          gruposProduto,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (searchOptions.classeVendedor) {
      handleClassesVendedor();
    } else if (searchOptions.bairro) {
      handleBairros();
    } else if (searchOptions.grupoProduto) {
      handleGruposProduto();
    } else {
      fetchInitialData();
    }
  }, [searchOptions, handleClassesVendedor, handleBairros, handleGruposProduto]);

  const handleSubmit = () => {
    try {
      cadastroVendedorSchema.parse(vendedor);

      insertVendedor(vendedor);

      setErrors({});

      setMensagemInfo('Vendedor cadastrado com sucesso!');
      setOpenInfo(true);
    } catch (error) {
      toast({
        description: 'Falha ao cadastrar vendedor.',
        variant: 'destructive',
      });

      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((error) => {
          if (error.path.length > 0) {
            fieldErrors[error.path[0]] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dadosCadastrais':
        return (
          <DadosCadastrais
            vendedor={vendedor}
            handleVendedorChange={handleVendedorChange}
            handleRemoveGrupoProduto={handleRemoveGrupoProduto}
            options={options}
            handleSearchOptionsChange={handleSearchOptionsChange}
            error={errors}
          />
        );
      default:
        return null;
    }
  };

  const handleCloseInfoModal = () => {
    setOpenInfo(false);
    onClose();
  };
  if (!isOpen) return null;

  return (
    <div>
      <ModalFormulario
        titulo="Cadastro de Vendedor"
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
