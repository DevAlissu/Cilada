import React, { useState } from 'react';
import DadosCadastrais from './_forms/DadosCadastrais';
import DadosFiscais from './_forms/DadosFiscais';
import DadosCustos from './_forms/DadosCustos';
import ReferenciaFabrica from './_forms/ReferenciaFabrica';
import {
  getProdutoByCodBar,
  insertProduto,
  Produto,
} from '@/data/produtos/produtos';
import TabNavigation from '@/components/common/TabNavigation';
import FormFooter from '@/components/common/FormFooter';
import { z } from 'zod';
import { cadastroProdutoSchema } from '@/data/produtos/produtosSchema';
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { X } from 'lucide-react';

const tabs = [
  { name: 'Dados Cadastrais', key: 'dadosCadastrais' },
  { name: 'Dados Fiscais', key: 'dadosFiscais' },
  { name: 'Dados de Custos', key: 'dadosCustos' },
  { name: 'Referência de Fábrica', key: 'referenciaFabrica' },
];

export type CadFornecedorSearchOptions = 'classeFornecedor' | 'pais';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

//dados para achar as abas com erro e poder chavear
const campoParaAba: Record<string, string> = {
  // Dados Cadastrais
  ref: 'dadosCadastrais',
  descr: 'dadosCadastrais',
  codmarca: 'dadosCadastrais',
  codgpf: 'dadosCadastrais',
  codgpp: 'dadosCadastrais',
  curva: 'dadosCadastrais',
  inf: 'dadosCadastrais',
  unimed: 'dadosCadastrais',
  multiplo: 'dadosCadastrais',
  coddesc: 'dadosCadastrais',
  compradireta: 'dadosCadastrais',
  multiplocompra: 'dadosCadastrais',
  tipo: 'dadosCadastrais',

  // Dados Fiscais
  trib: 'dadosFiscais',
  clasfiscal: 'dadosFiscais',
  strib: 'dadosFiscais',
  isentopiscofins: 'dadosFiscais',
  isentoipi: 'dadosFiscais',
  cest: 'dadosFiscais',

  // Dados de Consumo
  // Nenhum campo obrigatório aparente (exemplo de referência é uma lista com adicionar/remover, sem `*`)
  // Então, nada mapeado aqui por enquanto

  // Referência de Fábrica
  // Nenhum campo obrigatório marcado com `*`
};

export default function CustomModal({ isOpen, onClose, footer }: ModalProps) {
  const [activeTab, setActiveTab] = useState('dadosCadastrais');
  const [produto, setProduto] = useState({} as Produto);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { toast } = useToast();

  const handleProdutoChange = (produto: Produto) => {
    handleProdutoByCodbar(produto.codbar);
    setProduto(produto);
  };

  const handleProdutoByCodbar = async (codbar: string | undefined) => {
    if (codbar) {
      try {
        const produtoByCodBar = await getProdutoByCodBar(codbar);

        if (produtoByCodBar)
          router.push(
            `/administracao/produtos/editar/${produtoByCodBar.codprod}`,
          );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSubmit = () => {
    try {
      cadastroProdutoSchema.parse(produto);

      insertProduto(produto);

      setErrors({});

      toast({ description: 'Produto cadastrado com sucesso!' });

      router.push('/administracao/produtos');
    } catch (error) {
      toast({
        description: 'Falha ao cadastrar produto.',
        variant: 'destructive',
      });
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((error) => {
          if (error.path.length > 0) {
            fieldErrors[error.path[0]] = error.message;
          }
        });
        const firstError = error.errors[0];
        const fieldWithError = firstError.path[0]; // pega o campo raiz, ex: "cepcobr"
        const abaDoErro = campoParaAba[fieldWithError];

        if (abaDoErro) {
          setActiveTab(abaDoErro);
          setTimeout(() => {
            // Foca no input usando `document.getElementById`, assumindo que o campo tem id
            const el = document.getElementById(fieldWithError as string);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              (el as HTMLInputElement).focus();
            }
          }, 100); // dá tempo de trocar a aba antes de focar
        }

        setErrors(fieldErrors);
      }
    }
  };

  const handleClear = () => {
    setProduto({} as Produto);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dadosCadastrais':
        return (
          <DadosCadastrais
            produto={produto}
            handleProdutoChange={handleProdutoChange}
            error={errors}
          />
        );
      case 'dadosFiscais':
        return (
          <DadosFiscais
            produto={produto}
            handleProdutoChange={handleProdutoChange}
            error={errors}
          />
        );
      case 'dadosCustos':
        return (
          <DadosCustos
            produto={produto}
            handleProdutoChange={handleProdutoChange}
            error={errors}
          />
        );
      case 'referenciaFabrica':
        return (
          <ReferenciaFabrica
            produto={produto}
            handleProdutoChange={handleProdutoChange}
            error={errors}
          />
        );
      default:
        return null;
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed  inset-0 z-50 bg-black/50 flex justify-center items-center px-4">
      <div className="bg-gray-50 dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-[calc(100vw-8rem)] h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
        {/* Cabeçalho fixo */}
        <div className="flex justify-between items-center px-4 py-3 border-b dark:border-gray-700">
          <header className="mb-4">
            <h1 className="text-2xl font-bold text-[#347AB6]">
              Cadastro de Produto
            </h1>
          </header>

          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-100 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-grow overflow-y-auto px-0 py-0 text-gray-800 dark:text-gray-100">
          <div className="min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg max-w-6xl mx-auto p-6">
              <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={handleActiveTab}
              />

              <div>
                <form>{renderTabContent()}</form>
              </div>
            </div>
          </div>

          <Toaster />
        </div>

        {/* Rodapé fixo */}
        <div className="px-4 py-3 border-t dark:border-gray-700 flex justify-end gap-2">
          {footer || (
            <>
              <FormFooter onSubmit={handleSubmit} onClear={handleClear} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
