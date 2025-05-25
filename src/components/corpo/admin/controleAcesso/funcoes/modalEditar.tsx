import React, { useState } from 'react';
import InfoModal from '@/components/common/infoModal';
import { Funcao, updateFuncao } from '@/data/funcoes/funcoes';
import { cadastroFuncaoSchema } from '@/data/funcoes/funcoesSchema';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Carregamento from '@/utils/carregamento';
import ModalFormEditarFuncao from './_forms/ModalFormEditarFuncao';
import { CircleCheck } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  funcaoId: number | null;
  onSuccess?: () => void;
}

export default function CustomModal({
  isOpen,
  funcaoId,
  onSuccess,
  onClose,
}: ModalProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openInfo, setOpenInfo] = useState(false);
  const [mensagemInfo, setMensagemInfo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (dadosDoFilho: Funcao) => {
    setIsSaving(true);

    try {
      cadastroFuncaoSchema.parse(dadosDoFilho);

      await updateFuncao(dadosDoFilho);

      setMensagemInfo('Função atualizada com sucesso!');
      setOpenInfo(true);
    } catch (e) {
      toast({
        description: 'Falha ao atualizar função.',
        variant: 'destructive',
      });
      if (e instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        e.errors.forEach((error) => {
          if (error.path.length > 0) {
            fieldErrors[error.path[0]] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const handleClose = () => {
    // handleClear();
    //setFuncao({} as Funcao);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center px-4">
      {funcaoId ? (
        <ModalFormEditarFuncao
          titulo="Editar Função"
          handleSubmitPai={handleSubmit}
          onClose={handleClose}
          isSaving={isSaving}
          error={errors}
          funcaoId={funcaoId}
        />
      ) : (
        <Carregamento />
      )}

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
