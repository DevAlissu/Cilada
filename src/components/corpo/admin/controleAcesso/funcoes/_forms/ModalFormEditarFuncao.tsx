import React, { useState, useEffect } from 'react';
import InfoModalError from '@/components/common/infoModal';
import { X, AlertTriangle } from 'lucide-react';
import FormInput2 from '@/components/common/FormInput2';
import FormFooter from '@/components/common/FormFooter2';
import Carregamento from '@/utils/carregamento';
import { Funcao, getFuncao } from '@/data/funcoes/funcoes';

interface FormFuncaoContainerProps {
  titulo: string;
  onClose: () => void;
  isSaving?: boolean;
  funcaoId?: number | null;
  error?: { [p: string]: string };
  handleSubmitPai: (funcao: Funcao) => void;
}

const FormFuncaoContainer: React.FC<FormFuncaoContainerProps> = ({
  titulo,
  handleSubmitPai,
  onClose,
  isSaving,
  error,
  funcaoId,
}) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [sigla, setSigla] = useState('');
  const [usadoEm, setUsadoEm] = useState('');

  const [descricaoInicial, setDescricaoInicial] = useState<string | null>(null);
  const [siglaInicial, setSiglaInicial] = useState<string | null>(null);
  const [usadoEmInicial, setUsadoEmInicial] = useState<string | null>(null);

  const [funcaoLocal, setFuncaoLocal] = useState<Funcao>({} as Funcao);
  const [loading, setLoading] = useState<boolean>(true);
  const [mensagemInfoError, setMensagemInfoError] = useState('');
  const [openInfoError, setOpenInfoError] = useState(false);
  const handleClear = () => {
    setDescricao('');
    setSigla('');
    setUsadoEm('');
    setDescricaoInicial('');
    setSiglaInicial('');
    setUsadoEmInicial('');
  };
  const fetchFuncao = async (id: number) => {
    setLoading(true);
    setFuncaoLocal({} as Funcao);
    try {
      const funcaoData = await getFuncao(id);
      setFuncaoLocal(funcaoData);
      setDescricao(funcaoData.descricao || '');
      setSigla(funcaoData.sigla || '');
      setUsadoEm(funcaoData.usadoEm || '');
      setDescricaoInicial(funcaoData.descricao || '');
      setSiglaInicial(funcaoData.sigla || '');
      setUsadoEmInicial(funcaoData.usadoEm || '');
    } catch (error) {
      console.log('error', error);
      setMensagemInfoError(
        'Não foi possível acessar a função agora. Tente mais tarde ou acione o setor técnico.',
      );
      setOpenInfoError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (funcaoId) {
      fetchFuncao(funcaoId);
    } else {
      setDescricao('');
      setSigla('');
      setUsadoEm('');
      setDescricaoInicial('');
      setSiglaInicial('');
      setUsadoEmInicial('');
      setLoading(false);
    }
  }, [funcaoId]);

  useEffect(() => {
    const descricaoChanged = descricao !== descricaoInicial;
    const siglaChanged = sigla !== siglaInicial;
    const usadoEmChanged = usadoEm !== usadoEmInicial;

    setHasChanges(descricaoChanged || siglaChanged || usadoEmChanged);
  }, [
    descricao,
    sigla,
    usadoEm,
    descricaoInicial,
    siglaInicial,
    usadoEmInicial,
  ]);

  const handleLocalSubmit = () => {
    const funcaoAtualizada = {
      ...funcaoLocal,
      descricao,
      sigla,
      usadoEm,
    };

    handleSubmitPai(funcaoAtualizada);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center px-4">
      <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg shadow-lg w-full max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
        {/* Cabeçalho fixo */}
        <div className="flex justify-center items-center px-4 py-3 border-b dark:border-gray-700">
          <header className="mb-0 w-[60%]">
            <h4 className="text-xl font-bold text-[#347AB6]">{titulo}</h4>
          </header>
          <div className="w-[35%] flex justify-end">
            <FormFooter
              onSubmit={handleLocalSubmit}
              onClear={handleClear}
              isSaving={isSaving}
              hasChanges={hasChanges}
            />
          </div>
          <div className="w-[5%] flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-100 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-grow overflow-y-auto px-6 py-6 text-gray-800 dark:text-gray-100">
          {loading ? (
            <Carregamento />
          ) : (
            <div className="bg-white dark:bg-zinc-700 rounded-lg p-6 shadow space-y-6 max-w-4xl mx-auto">
              {/* Descrição */}
              <FormInput2
                name="descricao"
                type="text"
                label="Descrição"
                autoComplete="off"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                error={error?.descricao}
                required
              />

              {/* Sigla */}
              <FormInput2
                autoComplete="off"
                name="sigla"
                type="text"
                label="Sigla"
                defaultValue={sigla}
                onChange={(e) => setSigla(e.target.value)}
                error={error?.sigla}
                required
              />

              {/* Usado Em */}
              <FormInput2
                autoComplete="off"
                name="usadoEm"
                type="text"
                label="Usado Em"
                defaultValue={usadoEm}
                onChange={(e) => setUsadoEm(e.target.value)}
                error={error?.usadoEm}
                required
              />
            </div>
          )}
        </div>
      </div>
      <InfoModalError
        isOpen={openInfoError}
        onClose={() => setOpenInfoError(false)}
        title="ALGO DEU ERRADO"
        icon={<AlertTriangle className="text-red-500 w-6 h-6" />}
        content={mensagemInfoError}
      />
    </div>
  );
};

export default FormFuncaoContainer;
