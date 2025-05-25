// RequisitionModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import ModalFormulario from '@/components/common/modalform'; // Seu componente base de modal
import { z } from 'zod'; // Para validação (opcional, mas recomendado)
import { useToast } from '@/hooks/use-toast'; // Se for usar toasts para feedback
import { Toaster } from '@/components/ui/toaster'; // Componente Toaster

// Assumindo que você tem componentes de formulário como estes:
// import Input from '@/components/common/Input';
// import Select from '@/components/common/Select';
// import Button from '@/components/common/Button'; // Para os botões Salvar/Limpar se não forem providos pelo ModalFormulario

// Defina a interface para os dados do formulário de requisição
interface RequisitionFormData {
  tipo: string;
  entregaLocal1: string; // Exemplo para o primeiro campo de entrega
  entregaLocal2: string; // Exemplo para o segundo campo de entrega
  comprador: string;
  condicoesPgto: string;
  observacao: string;
  fornecedorCodigo: string;
}

// Esquema de validação com Zod (exemplo básico)
const requisitionSchema = z.object({
  tipo: z.string().min(1, { message: 'Tipo é obrigatório' }),
  // Adicione outras validações conforme necessário
  entregaLocal1: z.string().optional(),
  entregaLocal2: z.string().optional(),
  comprador: z.string().min(1, { message: 'Comprador é obrigatório' }),
  condicoesPgto: z.string().optional(),
  observacao: z.string().optional(),
  fornecedorCodigo: z.string().optional(),
});

interface RequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RequisitionFormData) => Promise<void>; // Função para salvar os dados
  title?: string;
}

// Mock de opções para os selects (você carregaria isso de uma API ou de constantes)
const tipoOptions = [
  { value: '', label: 'Selecione' },
  { value: 'compra', label: 'Compra' },
  { value: 'servico', label: 'Serviço' },
];

const entregaOptions = [
  { value: '', label: 'Select...' },
  { value: 'local1', label: 'Local 1' },
  { value: 'local2', label: 'Local 2' },
];


export default function RequisitionModal({
  isOpen,
  onClose,
  onSave,
  title = "Informe os dados de requisição", // Título padrão
}: RequisitionModalProps) {
  const [formData, setFormData] = useState<RequisitionFormData>({
    tipo: '',
    entregaLocal1: '',
    entregaLocal2: '',
    comprador: '',
    condicoesPgto: '',
    observacao: '',
    fornecedorCodigo: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Limpa o formulário e erros quando o modal é fechado
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        tipo: '',
        entregaLocal1: '',
        entregaLocal2: '',
        comprador: '',
        condicoesPgto: '',
        observacao: '',
        fornecedorCodigo: '',
      });
      setErrors({});
      setLoading(false);
    }
  }, [isOpen]);

  const handleInputChange = useCallback(
    (field: keyof RequisitionFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [errors],
  );

  const handleClearForm = () => {
    setFormData({
      tipo: '',
      entregaLocal1: '',
      entregaLocal2: '',
      comprador: '',
      condicoesPgto: '',
      observacao: '',
      fornecedorCodigo: '',
    });
    setErrors({});
  };

  const handleSubmitForm = async () => {
    setErrors({});
    try {
      // Validação com Zod
      const validatedData = requisitionSchema.parse(formData);
      setLoading(true);
      await onSave(validatedData); // Chama a função de salvar passada como prop
      toast({
        title: 'Sucesso!',
        description: 'Requisição salva com sucesso.',
        variant: 'default', // ou 'success' dependendo do seu useToast
      });
      onClose(); // Fecha o modal após o sucesso
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((e) => {
          if (e.path.length > 0) {
            fieldErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: 'Erro de Validação',
          description: 'Por favor, corrija os campos destacados.',
          variant: 'destructive',
        });
      } else {
        console.error('Erro ao salvar requisição:', error);
        toast({
          title: 'Erro',
          description: 'Falha ao salvar a requisição. Tente novamente.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // O ModalFormulario não usa abas neste caso, então renderTabContent pode ignorar o activeTab
  // ou podemos passar um array de tabs vazio ou com uma única aba "virtual" se necessário.
  // Pelo seu exemplo de CustomModal, `renderTabContent` é uma função.
  // Se o ModalFormulario não precisar de `tabs`, `activeTab`, `setActiveTab` quando não há abas,
  // podemos omiti-los ou passar `null`/`undefined`.
  // Vamos assumir que `renderTabContent` é o principal para o conteúdo.

  const renderFormContent = () => (
    <div className="space-y-4 p-4"> {/* Adicione padding se necessário, ou o ModalFormulario já tem */}
      {/* Campo Tipo (Select) */}
      <div>
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
        {/* Substitua pelo seu componente Select real */}
        <select
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={(e) => handleInputChange('tipo', e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {tipoOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>}
      </div>

      {/* Campos Entrega (2 Selects lado a lado) */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-1">Entrega</legend>
        <div className="flex space-x-4">
          <div className="flex-1">
            {/* <label htmlFor="entregaLocal1" className="block text-sm font-medium text-gray-700">Local 1</label> */}
            <select
              id="entregaLocal1"
              name="entregaLocal1"
              value={formData.entregaLocal1}
              onChange={(e) => handleInputChange('entregaLocal1', e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {entregaOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.entregaLocal1 && <p className="text-red-500 text-xs mt-1">{errors.entregaLocal1}</p>}
          </div>
          <div className="flex-1">
            {/* <label htmlFor="entregaLocal2" className="block text-sm font-medium text-gray-700">Local 2</label> */}
            <select
              id="entregaLocal2"
              name="entregaLocal2"
              value={formData.entregaLocal2}
              onChange={(e) => handleInputChange('entregaLocal2', e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {entregaOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.entregaLocal2 && <p className="text-red-500 text-xs mt-1">{errors.entregaLocal2}</p>}
          </div>
        </div>
      </fieldset>
      
      {/* Campos de Texto */}
      <div>
        <label htmlFor="comprador" className="block text-sm font-medium text-gray-700">Comprador</label>
        {/* Substitua pelo seu componente Input real */}
        <input
          type="text"
          id="comprador"
          name="comprador"
          value={formData.comprador}
          onChange={(e) => handleInputChange('comprador', e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.comprador && <p className="text-red-500 text-xs mt-1">{errors.comprador}</p>}
      </div>

      <div>
        <label htmlFor="condicoesPgto" className="block text-sm font-medium text-gray-700">Condições de PGTO.</label>
        <input
          type="text"
          id="condicoesPgto"
          name="condicoesPgto"
          value={formData.condicoesPgto}
          onChange={(e) => handleInputChange('condicoesPgto', e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.condicoesPgto && <p className="text-red-500 text-xs mt-1">{errors.condicoesPgto}</p>}
      </div>

      <div>
        <label htmlFor="observacao" className="block text-sm font-medium text-gray-700">Observação</label>
        <textarea
          id="observacao"
          name="observacao"
          rows={3}
          value={formData.observacao}
          onChange={(e) => handleInputChange('observacao', e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.observacao && <p className="text-red-500 text-xs mt-1">{errors.observacao}</p>}
      </div>

      {/* Seção Fornecedor */}
      <fieldset className="border-t pt-4"> {/* Adiciona uma linha divisória se desejar */}
        <legend className="text-lg font-medium text-gray-900 mb-2">Fornecedor</legend>
        <div>
          <label htmlFor="fornecedorCodigo" className="block text-sm font-medium text-gray-700">Código</label>
          <div className="relative mt-1">
            <input
              type="text"
              id="fornecedorCodigo"
              name="fornecedorCodigo"
              value={formData.fornecedorCodigo}
              onChange={(e) => handleInputChange('fornecedorCodigo', e.target.value)}
              placeholder="43524255242"
              className="block w-full p-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {/* Ícone de Lupa (Exemplo com SVG, substitua pelo seu componente de ícone se tiver) */}
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {errors.fornecedorCodigo && <p className="text-red-500 text-xs mt-1">{errors.fornecedorCodigo}</p>}
        </div>
      </fieldset>
    </div>
  );


  if (!isOpen) return null;

  return (
    <>
      <ModalFormulario
        titulo={title}
        // Se o seu ModalFormulario não precisar das props de tabs quando não há abas, pode omiti-las.
        // Caso contrário, você pode precisar passar um array de tabs vazio ou com uma aba "dummy".
        // Exemplo: tabs={[]} activeTab={null} setActiveTab={() => {}}
        tabs={null} // Ou [] ou um array com uma aba única, dependendo do seu ModalFormulario
        activeTab={null} // Ou o key da aba única
        setActiveTab={() => {}} // Função vazia se não houver troca de abas
        renderTabContent={renderFormContent} // Função que renderiza o formulário
        handleSubmit={handleSubmitForm}
        handleClear={handleClearForm}
        onClose={onClose}
        loading={loading}
      />
      {/* O Toaster deve estar em um nível mais alto na sua aplicação, geralmente no _app.tsx ou layout principal.
          Se já estiver lá, não precisa repetir aqui. Se não, adicione onde for apropriado.
          <Toaster /> 
      */}
    </>
  );
}