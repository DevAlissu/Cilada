import React, { useEffect, useState, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FormFooter from '@/components/common/FormFooter2';
import { Trash2, Sun } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { UsuarioEdit, criarUsuario } from '@/data/usuarios/usuarios';
import ModalFuncoes from './ModalFuncoes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { getTodosPerfis, TodosPerfisResponse } from '@/data/perfis/perfis';
import { getTodasFiliais } from '@/data/filiais/filiais';
import { getTodasFuncoes } from '@/data/funcoes/funcoes';

interface Funcao {
  id_functions: number;
  descricao: string;
  usadoEm?: string | null;
  sigla?: string | null;
}

interface Props {
  usuario?: UsuarioEdit;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  titulo: string;
  onSaveInitiated?: () => void;
  isSaving?: boolean;
}
interface ItemAdicionado {
  login_user_login: string;
  login_user_name: string;
  perfis: {
    perfil_name: string;
    filial: { codigo_filial: string; nome_filial: string }[];
    funcoes: Funcao[];
  }[];
}
export default function FormEditarUsuario({
  usuario = {
    login_user_login: '',
    login_user_name: '',
    perfis: [],
  },
  onClose,
  onSuccess,
  onError,
  titulo,
  onSaveInitiated,
  isSaving = false,
}: Props) {
  const { toast } = useToast();

  // Estados para os campos editáveis
  const [itensAtivados, setItensAtivados] = useState<{
    [key: string]: boolean;
  }>({});
  const [loginUser, setLoginUser] = useState(usuario.login_user_login || '');
  const [nomeUser, setNomeUser] = useState(usuario.login_user_name || '');
  const [showModalFuncoes, setShowModalFuncoes] = useState(false);
  const [funcoesDisponiveis, setFuncoesDisponiveis] = useState<Funcao[]>([]);
  const [funcoesSelecionadas, setFuncoesSelecionadas] = useState<Funcao[]>([]);
  const [funcoesFiltradas, setFuncoesFiltradas] = useState<Funcao[]>([]);
  const [perfisOptions, setPerfisOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const isInitialLoad = useRef(true);
  const [perfilSelecionado, setPerfilSelecionado] = useState<string>('');
  const [filialSelecionada, setFilialSelecionada] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);
  const [filiaisOptions, setFiliaisOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [itensAdicionados, setItensAdicionados] = useState<ItemAdicionado>(
    () => ({
      login_user_login: usuario.login_user_login,
      login_user_name: usuario.login_user_name,
      perfis: usuario.perfis,
    }),
  );

  const verificarAlteracoes = useCallback(() => {
    if (itensAdicionados?.perfis?.length > 0) {
      const hasChanged =
        JSON.stringify(usuario) !== JSON.stringify(itensAdicionados);
      setHasChanges(hasChanged); // Atualiza o estado hasChanges
    }
  }, [usuario, setHasChanges, itensAdicionados]); // Adicione setHasChanges às dependências

  useEffect(() => {
    if (!isInitialLoad.current) {
      verificarAlteracoes();
    }
    isInitialLoad.current = false;
  }, [usuario, verificarAlteracoes]);

  const handleAdicionarItem = () => {
    if (!perfilSelecionado || !filialSelecionada) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos antes de adicionar.',
        variant: 'destructive',
      });
      return;
    }

    // Busca o codigo_filial com base no label da filial selecionada
    const filialSelecionadaObj = filiaisOptions.find(
      (filial) => filial.label === filialSelecionada,
    );

    if (!filialSelecionadaObj) {
      toast({
        title: 'Filial não encontrada',
        description: 'A filial selecionada não foi encontrada.',
        variant: 'destructive',
      });
      return;
    }

    const codigoFilial = String(filialSelecionadaObj.value); // Convertendo para string

    setItensAdicionados((prevItens) => {
      const perfisAtualizados = prevItens.perfis.map((perfil) => {
        const filialExistente = perfil.filial.find(
          (filial) => filial.nome_filial === filialSelecionada,
        );

        // Atualizar funções se perfil e filial já existirem
        if (filialExistente && perfil.perfil_name === perfilSelecionado) {
          return {
            ...perfil,
            funcoes: funcoesSelecionadas,
          };
        }

        return perfil;
      });

      // Se não existir, adiciona um novo perfil/filial
      const isNovoItem = !perfisAtualizados.some(
        (perfil) =>
          perfil.perfil_name === perfilSelecionado &&
          perfil.filial.some(
            (filial) => filial.nome_filial === filialSelecionada,
          ),
      );

      if (isNovoItem) {
        const novoPerfil = {
          perfil_name: perfilSelecionado,
          filial: [
            {
              nome_filial: filialSelecionada,
              codigo_filial: codigoFilial, // Agora como string
            },
          ],
          funcoes: funcoesSelecionadas,
        };

        return {
          ...prevItens,
          perfis: [...perfisAtualizados, novoPerfil],
        };
      }

      return {
        ...prevItens,
        perfis: perfisAtualizados,
      };
    });
  };

  useEffect(() => {
    const fetchFuncoes = async () => {
      try {
        const todasFuncoes = await getTodasFuncoes();
        setFuncoesFiltradas(todasFuncoes);
      } catch (error) {
        console.error('Erro ao buscar funções:', error);
      }
    };

    fetchFuncoes();

    async function fetchPerfis() {
      try {
        const response: TodosPerfisResponse = await getTodosPerfis();
        const options = response.data.map((perfil) => ({
          label: perfil.login_perfil_name,
          value: perfil.login_perfil_name,
        }));
        setPerfisOptions(options);
      } catch (error) {
        console.error('Erro ao buscar perfis:', error);
        toast({
          title: 'Erro ao buscar perfis',
          description: 'Não foi possível carregar os perfis.',
          variant: 'destructive',
        });
      }
    }

    fetchPerfis();

    async function fetchFiliais() {
      try {
        const response = await getTodasFiliais();
        const options = response.data.map((filial) => ({
          label: filial.nome_filial,
          value: filial.codigo_filial,
        }));
        setFiliaisOptions(options);
      } catch (error) {
        console.error('Erro ao buscar filiais:', error);
        toast({
          title: 'Erro ao buscar filiais',
          description: 'Não foi possível carregar as filiais.',
          variant: 'destructive',
        });
      }
    }

    fetchFiliais();
  }, [toast]);
  const handlePerfilChange = (value: string) => {
    setPerfilSelecionado(value);
  };
  const handleFilialChange = (label: string) => {
    setFilialSelecionada(label);
  };

  const handleClear = () => {
    setLoginUser('');
    setNomeUser('');
  };

  const handleSave = async () => {
    if (!loginUser.trim() || !nomeUser.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos antes de salvar.',
        variant: 'destructive',
      });
      return;
    }

    try {
      onSaveInitiated?.();

      // Estrutura dos dados a serem enviados
      const dadosParaSalvar = {
        login_user_login: loginUser.trim(),
        login_user_name: nomeUser.trim(),
        perfis: itensAdicionados.perfis.map((perfil) => ({
          perfil_name: perfil.perfil_name,
          filial: perfil.filial.map((filial) => ({
            codigo_filial: filial.codigo_filial,
            nome_filial: filial.nome_filial,
          })),
          funcoes: perfil.funcoes.map((funcao) => ({
            id_functions: funcao.id_functions,
            descricao: funcao.descricao,
            sigla: funcao.sigla ?? '-',
            usadoEm: funcao.usadoEm ?? '-',
          })),
        })),
      };

      // Envia os dados para o método add em usuarios
      console.log('oi dadosParaSalvar', dadosParaSalvar);

      await criarUsuario(dadosParaSalvar);

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao salvar os dados.',
        variant: 'destructive',
      });
      onError?.();
    }
  };

  const handleOpenModalFuncoes = () => {
    const funcoesUsuario = usuario?.perfis?.flatMap((perfil) => {
      return perfil.funcoes ? perfil.funcoes : [];
    });

    const funcoesNormalizadas: Funcao[] = funcoesUsuario?.map((funcao) => ({
      id_functions: funcao.id_functions,
      descricao: funcao.descricao,
      sigla: funcao.sigla ?? '-',
      usadoEm: funcao.usadoEm ?? '-',
    }));

    setFuncoesDisponiveis(funcoesNormalizadas);

    setShowModalFuncoes(true);
  };

  const handleConfirmarFuncoes = (selecionadas: Funcao[]) => {
    setFuncoesSelecionadas(selecionadas);
    setShowModalFuncoes(false);
  };

  const handleSunClick = (
    perfilName: string,
    filialName: string,
    funcoes: Funcao[],
  ) => {
    const key = `${perfilName}-${filialName}`;
    const isAtivado = itensAtivados[key];

    if (isAtivado) {
      // Se o item já estiver ativo e for clicado novamente, desativa e limpa os dados
      setItensAtivados({});
      setPerfilSelecionado('');
      setFilialSelecionada('');
      setFuncoesSelecionadas([]);
    } else {
      // Se um novo item for ativado, desativa os outros e ativa o atual
      const funcoesNormalizadas: Funcao[] = funcoes.map((funcao) => ({
        id_functions: funcao.id_functions,
        descricao: funcao.descricao,
        sigla: funcao.sigla ?? '-',
        usadoEm: funcao.usadoEm ?? '-',
      }));

      setItensAtivados({ [key]: true });
      setPerfilSelecionado(perfilName);
      setFilialSelecionada(filialName);
      setFuncoesSelecionadas(funcoesNormalizadas);
      //informar que o valor de cada item selecionad
    }
  };

  const handleLoginChange = (value: string) => {
    setLoginUser(value);

    setItensAdicionados((prev) => {
      const hasProfiles = prev?.perfis?.length > 0;

      if (hasProfiles) {
        setHasChanges(true);
      }

      return {
        ...prev,
        login_user_login: value,
      };
    });
  };

  const handleNomeChange = (value: string) => {
    setNomeUser(value);

    setItensAdicionados((prev) => {
      const hasProfiles = prev?.perfis?.length > 0;

      if (hasProfiles) {
        setHasChanges(true);
      }

      return {
        ...prev,
        login_user_name: value,
      };
    });
  };

  const handleDeleteItem = (perfilName: string, filialName: string) => {
    setItensAdicionados((prevItens) => {
      const perfisAtualizados = prevItens.perfis?.map((perfil) => {
        if (perfil.perfil_name === perfilName) {
          const filiaisAtualizadas = perfil.filial.filter(
            (filial) => filial.nome_filial !== filialName,
          );

          return {
            ...perfil,
            filial: filiaisAtualizadas,
            funcoes: filiaisAtualizadas.length === 0 ? [] : perfil.funcoes,
          };
        }
        return perfil;
      });

      // Remover perfis sem filiais
      const perfisFiltrados = perfisAtualizados?.filter(
        (perfil) => perfil.filial.length > 0,
      );

      const hasRemainingItems = perfisFiltrados.length > 0;

      // Atualiza o estado `hasChanges` baseado na existência de itens restantes
      setHasChanges(hasRemainingItems);

      return {
        ...prevItens,
        perfis: perfisFiltrados,
      };
    });
  };
  const isAdicionarDisabled = useCallback(() => {
    if (!perfilSelecionado || !filialSelecionada) return true;

    const filialExistente = itensAdicionados.perfis.some((perfil) =>
      perfil.filial.some((filial) => filial.nome_filial === filialSelecionada),
    );

    // Bloquear se a filial já estiver associada a outro perfil
    if (filialExistente) {
      const perfilExistente = itensAdicionados.perfis.find((perfil) =>
        perfil.filial.some(
          (filial) => filial.nome_filial === filialSelecionada,
        ),
      );

      if (
        perfilExistente &&
        perfilExistente.perfil_name !== perfilSelecionado
      ) {
        return true;
      }
    }

    return false;
  }, [perfilSelecionado, filialSelecionada, itensAdicionados]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center px-4">
      <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg shadow-lg w-full h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
          <h4 className="text-xl font-bold text-blue-600 dark:text-blue-300">
            {titulo}
          </h4>

          <div className="flex items-center space-x-6">
            <FormFooter
              onSubmit={handleSave}
              onClear={handleClear}
              hasChanges={hasChanges}
              isSaving={isSaving}
            />

            <button
              onClick={onClose}
              className="text-gray-500  dark:text-gray-100 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="h-full flex-grow  px-6 py-6 text-gray-800 dark:text-gray-100">
          <div className="space-y-6">
            <div className="flex gap-4 text-xs">
              {/* Input Login */}
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Login</label>
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => handleLoginChange(e.target.value)}
                  className="w-full border rounded px-3 py-2 dark:border-slate-600 dark:bg-zinc-800"
                />
              </div>

              {/* Input Nome do Usuário */}
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">
                  Nome do Usuário
                </label>
                <input
                  type="text"
                  value={nomeUser}
                  onChange={(e) => handleNomeChange(e.target.value)}
                  className="w-full border rounded px-3 py-2 dark:border-slate-600 dark:bg-zinc-800"
                />
              </div>
            </div>

            {/* Linha dos Botões */}
            <div className="flex gap-4 mt-4">
              <div className=" w-[25%]">
                <label className="block mb-1 text-sm font-medium">Perfis</label>
                <Select
                  value={perfilSelecionado}
                  onValueChange={handlePerfilChange}
                >
                  <SelectTrigger className="w-full border rounded px-3 py-2 dark:bg-zinc-800">
                    {perfilSelecionado || 'Selecione um perfil'}
                  </SelectTrigger>
                  <SelectContent>
                    {perfisOptions.map((perfil) => (
                      <SelectItem key={perfil.value} value={perfil.value}>
                        {perfil.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className=" w-[25%]">
                <label className="block mb-1 text-sm font-medium">
                  Filiais
                </label>
                <Select
                  value={filialSelecionada}
                  onValueChange={handleFilialChange}
                >
                  <SelectTrigger className="w-full border rounded px-3 py-2 dark:bg-zinc-800">
                    {filialSelecionada || 'Selecione uma filial'}
                  </SelectTrigger>
                  <SelectContent>
                    {filiaisOptions.map((filial) => (
                      <SelectItem key={filial.value} value={filial.label}>
                        {filial.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className=" w-[25%]  flex justify-center items-end ">
                <button
                  className="w-full  bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  onClick={handleOpenModalFuncoes}
                >
                  Funções
                </button>
              </div>
              <div className="w-[25%] flex justify-center items-end">
                <button
                  className={`w-full px-4 py-2 rounded ${
                    isAdicionarDisabled()
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                  onClick={handleAdicionarItem}
                  disabled={isAdicionarDisabled()}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* Grid Container */}
          <div className="mt-4  rounded-lg border border-gray-300 dark:border-gray-600 shadow h-[calc(100vh-330px)] flex flex-col">
            {/* Cabeçalho Fixo */}
            <div className="bg-gray-200 dark:bg-gray-700 p-2 grid grid-cols-4 gap-4 border-b border-gray-300 dark:border-gray-600">
              <div className="font-semibold text-sm text-gray-600 dark:text-gray-300 flex justify-center items-center">
                Perfil
              </div>
              <div className="font-semibold text-sm text-gray-600 dark:text-gray-300 flex justify-center items-center">
                Filial
              </div>
              <div className="font-semibold text-sm text-gray-600 dark:text-gray-300 flex justify-center items-center">
                Funções
              </div>
              <div className="font-semibold text-sm text-gray-600 dark:text-gray-300 flex justify-center items-center">
                Ação
              </div>
            </div>

            {/* Conteúdo com Scroll */}
            <div className=" overflow-y-auto flex-grow p-0">
              <div className="">
                {itensAdicionados?.perfis?.map((perfil, perfilIdx) =>
                  perfil?.filial?.map((filial, filialIdx) => (
                    <div
                      key={`${perfilIdx}-${filialIdx}`}
                      className="w-full grid grid-cols-4 gap-4 border-b border-gray-300 dark:border-gray-600"
                    >
                      {/* Perfil */}
                      <div className=" rounded-lg p-2 text-center text-sm flex justify-center items-center h-24">
                        {perfil.perfil_name}
                      </div>

                      {/* Filial */}
                      <div className=" rounded-lg p-2 text-center text-sm flex justify-center items-center h-24">
                        {filial.nome_filial}
                      </div>

                      {/* Funções */}
                      <div className="rounded-lg p-2 text-sm flex flex-col justify-center items-center h-24 overflow-y-auto space-y-1">
                        {perfil.funcoes.length > 0 ? (
                          perfil.funcoes.map((funcao, idx) => (
                            <div
                              key={`${funcao.id_functions}-${idx}`}
                              className="w-full flex justify-center items-center p-1"
                            >
                              <span>{funcao.sigla || '-'}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-1">-</div>
                        )}
                      </div>

                      {/* Ação */}
                      <div className=" rounded-lg p-2 text-center text-sm flex justify-center items-center space-x-4">
                        {/* Ícone de Brilho */}
                        <Sun
                          className={`cursor-pointer hover:opacity-75 ${
                            itensAtivados[
                              `${perfil.perfil_name}-${filial.nome_filial}`
                            ]
                              ? 'text-yellow-500'
                              : 'text-gray-500'
                          }`}
                          onClick={() =>
                            handleSunClick(
                              perfil.perfil_name,
                              filial.nome_filial,
                              perfil.funcoes,
                            )
                          }
                        />

                        {/* Ícone de Deletar */}
                        <Trash2
                          size={16}
                          className="cursor-pointer text-red-500 hover:text-red-600"
                          onClick={() =>
                            handleDeleteItem(
                              perfil.perfil_name,
                              filial.nome_filial,
                            )
                          }
                        />
                      </div>
                    </div>
                  )),
                )}
              </div>
            </div>
          </div>
        </div>

        <ModalFuncoes
          isOpen={showModalFuncoes}
          onClose={() => setShowModalFuncoes(false)}
          funcoes={funcoesDisponiveis} // TODAS as funções disponíveis
          selecionadas={funcoesSelecionadas} // Apenas as já selecionadas
          onConfirmar={(selecionadas: Funcao[]) =>
            handleConfirmarFuncoes(selecionadas)
          }
          funcoesFiltradas={funcoesFiltradas}
        />

        <Toaster />
      </div>
    </div>
  );
}
