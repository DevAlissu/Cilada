import React, { useState } from 'react';
import InfoModal from '@/components/common/infoModal';
import InfoModalError from '@/components/common/infoModal';
import { Tela, updateTela } from '@/data/telas/telas';
import { cadastroTelaSchema } from '@/data/telas/telasSchema';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Carregamento from '@/utils/carregamento';
import ModalFormEditarTela from './_forms/modalFormEditarTela';
import { CircleCheck, AlertTriangle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  telaId: number | null;
  onSuccess?: () => void;
}

export default function CustomModal({
  isOpen,
  telaId,
  onSuccess,
  onClose,
}: ModalProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openInfo, setOpenInfo] = useState(false);
  const [mensagemInfo, setMensagemInfo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (dadosDoFilho: Tela) => {
    setIsSaving(true);

    try {
      cadastroTelaSchema.parse(dadosDoFilho);

      await updateTela(dadosDoFilho);

      setMensagemInfo('Tela atualizada com sucesso!');
      setOpenInfo(true);
    } catch (e) {
      toast({
        description: 'Falha ao atualizar tela.',
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

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center px-4">
      {telaId ? (
        <ModalFormEditarTela
          titulo="Editar Tela"
          handleSubmitPai={handleSubmit}
          onClose={handleClose}
          isSaving={isSaving}
          error={errors}
          telaId={telaId}
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

      <InfoModalError
        isOpen={false} // Removi o estado e passei false diretamente
        onClose={() => {}} // Removi a função vazia
        title="ALGO DEU ERRADO"
        icon={<AlertTriangle className="text-red-500 w-6 h-6" />}
        content="" // Removi a string vazia
      />

      <Toaster />
    </div>
  );
}
