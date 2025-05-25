import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InfoModal from '@/components/common/infoModal';
import { CircleCheck } from 'lucide-react';
import { z } from 'zod';
import { createMarca } from '@/data/marcas/marcas';
import { useToast } from '@/hooks/use-toast';
import FormInput from '@/components/common/FormInput';
import ModalFormulario from '@/components/common/modalform';

const marcaSchema = z.object({
  codmarca: z.string().min(1, 'Código é obrigatório'),
  descr: z.string().min(1, 'Descrição é obrigatória'),
  bloquear_preco: z.string().optional(),
});

type MarcaForm = z.infer<typeof marcaSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSuccess?: () => void;
}

export default function Cadastrar({
  isOpen,
  onClose,
  title,
  onSuccess,
}: Props) {
  const { toast } = useToast();
  const [openInfo, setOpenInfo] = useState(false);
  const [mensagemInfo, setMensagemInfo] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MarcaForm>({
    resolver: zodResolver(marcaSchema),
  });

  const onSubmit = async (data: MarcaForm) => {
    try {
      await createMarca(data);
      setMensagemInfo('Marca cadastrada com sucesso!');
      setOpenInfo(true);
      reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log('err', error);

      toast({
        description: 'Erro ao cadastrar marca.',
        variant: 'destructive',
      });
    }
  };

  const handleClear = () => {
    reset();
  };

  const handleCloseInfoModal = () => {
    setOpenInfo(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 bg-black/50 flex justify-center items-center px-4">
      <ModalFormulario
        tabs={[{ name: 'Formulário', key: 'form' }]}
        activeTab="form"
        setActiveTab={() => {}}
        titulo={title}
        renderTabContent={() => (
          <div className="space-y-4">
            <FormInput
              label="Código da Marca"
              type="text"
              {...register('codmarca')}
              error={errors.codmarca?.message}
            />

            <FormInput
              label="Descrição"
              type="text"
              {...register('descr')}
              error={errors.descr?.message}
            />

            <FormInput
              label="Bloquear Preço (S/N)"
              type="text"
              {...register('bloquear_preco')}
              error={errors.bloquear_preco?.message}
            />
          </div>
        )}
        handleSubmit={handleSubmit(onSubmit)}
        handleClear={handleClear}
        onClose={onClose}
        loading={isSubmitting}
      />

      <InfoModal
        isOpen={openInfo}
        onClose={handleCloseInfoModal}
        title="INFORMAÇÃO IMPORTANTE"
        icon={<CircleCheck className="text-green-500 w-6 h-6" />}
        content={mensagemInfo}
      />
    </div>
  );
}
