import React, { useEffect, useState } from 'react';
import InfoModal from '@/components/common/infoModal';
import FormPerfilContainer from './_forms/modalFormEditar';
import { getPerfil } from '@/data/perfis/perfis';
import { CircleCheckBig } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

interface ModalEditarProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  login_perfil_name: string;
}

export default function ModalEditarPerfil({
  isOpen,
  onClose,
  onSuccess,
  login_perfil_name,
}: ModalEditarProps) {
  const [openInfo, setOpenInfo] = useState(false);
  const [mensagemInfo, setMensagemInfo] = useState('');
  const [perfilData, setPerfilData] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false); // Estado para rastrear mudanças
  const [isSaving, setIsSaving] = useState(false); // Estado para rastrear o salvamento
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setPerfilData(null);
      setHasChanges(false); // Resetar o estado de mudanças ao fechar o modal
      setIsSaving(false); // Resetar o estado de salvamento ao fechar o modal
      return;
    }

    const fetchData = async () => {
      try {
        const perfil = await getPerfil(login_perfil_name);
        setPerfilData(perfil);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Erro ao carregar perfil',
          description: 'Verifique sua conexão com o banco de dados.',
          variant: 'destructive',
        });
      }
    };

    fetchData();
  }, [isOpen, login_perfil_name, toast]);

  const handleDataChange = (changed: boolean) => {
    setHasChanges(changed);
  };

  const handleSaveInitiated = () => {
    setIsSaving(true);
  };

  const handleSuccessSave = () => {
    setIsSaving(false);
    setMensagemInfo('Perfil atualizado com sucesso!');
    setOpenInfo(true);
    setHasChanges(false); // Resetar o estado de mudanças após o sucesso
  };

  const handleErrorSave = () => {
    setIsSaving(false);
    toast({
      title: 'Erro ao atualizar perfil',
      description: 'Ocorreu um erro ao salvar as alterações.',
      variant: 'destructive',
    });
  };

  if (!isOpen || !perfilData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center px-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-[90vw] h-[90vh] p-4">
        <FormPerfilContainer
          titulo="Editar Perfil"
          onClose={onClose}
          onSuccess={handleSuccessSave}
          onError={handleErrorSave} // Passando a função de erro
          login_perfil_name={login_perfil_name}
          onDataChange={handleDataChange}
          onSaveInitiated={handleSaveInitiated}
          isSaving={isSaving}
          hasChanges={hasChanges}
        />
      </div>

      <InfoModal
        isOpen={openInfo}
        onClose={() => {
          setOpenInfo(false);
          onSuccess?.();
          onClose();
        }}
        title="INFORMAÇÃO IMPORTANTE"
        icon={<CircleCheckBig className="text-green-500 w-6 h-6" />}
        content={mensagemInfo}
      />

      <Toaster />
    </div>
  );
}
