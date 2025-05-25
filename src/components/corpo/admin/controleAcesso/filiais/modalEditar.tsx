import React, { useEffect, useState } from 'react';
import InfoModal from '@/components/common/infoModal';
import InfoModalError from '@/components/common/infoModal';
import { Filial, getFilial, updateFilial } from '@/data/filiais/filiais';
import { cadastroFilialSchema } from '@/data/filiais/filiaisSchema';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Carregamento from '@/utils/carregamento';
import ModalForm from './_forms/modalFormEditar';
import { CircleCheck, AlertTriangle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  filialId: number | null; // <-- aqui o ajuste
  onSuccess?: () => void;
}

export default function CustomModal({
  isOpen,
  filialId,
  onSuccess,
  onClose,
}: ModalProps) {
  const [filial, setFilial] = useState<Filial>({} as Filial);
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openInfo, setOpenInfo] = useState(false);
  const [mensagemInfo, setMensagemInfo] = useState('');
  const [openInfoError, setOpenInfoError] = useState(false);
  const [mensagemInfoError, setMensagemInfoError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleClear = () => {
    setFilial({} as Filial);
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      cadastroFilialSchema.parse(filial);
      await updateFilial(filial);

      setMensagemInfo('Filial atualizada com sucesso!');
      setOpenInfo(true);
    } catch (e) {
      toast({
        description: 'Falha ao atualizar filial.',
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
      setIsSaving(false); // Define isSaving como false quando o salvamento termina
    }
  };

  useEffect(() => {
    if (filialId) {
      const fetchFilial = async () => {
        setLoading(true);
        setErrors({});
        setFilial({} as Filial);

        try {
          const filialData = await getFilial(filialId.toString());
          setFilial(filialData);
        } catch (error) {
          console.log('error', error);
          setMensagemInfoError(
            'Não foi possível acessar a filial agora. Tente mais tarde ou acione o setor técnico.',
          );
          setOpenInfoError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchFilial();
    }
  }, [filialId]);

  if (!isOpen) return null;
  const handleFilialChange = (filial2: Filial) => {
    setFilial(filial2);
  };

  return (
    <div className="fixed  inset-0 z-50 bg-black/50 flex justify-center items-center px-4">
      {filialId ? (
        <ModalForm
          titulo="Editar Filial"
          handleSubmit={handleSubmit}
          handleClear={handleClear}
          handleFilialChange={handleFilialChange}
          onClose={onClose}
          loading={loading}
          filial={filial}
          error={errors}
          isSaving={isSaving}
        />
      ) : (
        <Carregamento />
      )}
      <InfoModal
        isOpen={openInfo}
        onClose={() => {
          setOpenInfo(false);
          onSuccess?.(); // ✅ chama a função de sucesso do pai (index)
          onClose();
        }}
        title="INFORMAÇÃO IMPORTANTE"
        icon={<CircleCheck className="text-green-500 w-6 h-6" />}
        content={mensagemInfo}
      />
      <InfoModalError
        isOpen={openInfoError}
        onClose={() => {
          setOpenInfoError(false);
          onClose();
        }}
        title="ALGO DEU ERRADO"
        icon={<AlertTriangle className="text-red-500 w-6 h-6" />}
        content={mensagemInfoError}
      />
      <Toaster />
    </div>
  );
}
