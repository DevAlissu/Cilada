import React, { createContext, useEffect, useState } from 'react';
import { setCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';

export type Permissao = {
  editar: boolean;
  grupoId: string;
  id: number;
  tb_telas: {
    CODIGO_TELA: number;
    PATH_TELA: string;
    NOME_TELA: string;
  };
};
type User = {
  usuario: string;
  perfil: string;
  obs: string;
  codusr: string;
  filial: string;
  permissoes?: Permissao[];
  funcoes?: string[];
};

type Filial = { filial: string };
type Pagina = { pagina: string };

type AuthContextType = {
  user: User;
  signIn: (data: User) => Promise<void>;
  filialSet: (data: Filial) => Promise<void>;
  paginaAtual: (data: Pagina) => Promise<void>;
  ultimaPagina: string;
  isLoading: boolean;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    usuario: '',
    perfil: '',
    obs: '',
    codusr: '',
    filial: '',
  });

  const [ultimaPagina, setUltimaPagina] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  async function fetchPermissoes(grupoId: string): Promise<Permissao[]> {
    try {
      const response = await fetch(
        `/api/grupoPermissoes/get?grupoId=${grupoId}`,
      );

      const data = await response.json();
      return data.permissoes;
    } catch (error) {
      console.error('Erro ao buscar permissões:', error);
      return [];
    }
  }

  async function fetchFuncoes(
    login_user_login: string,
    grupoId?: string,
  ): Promise<string[]> {
    try {
      const url = `/api/grupoFuncoes/get?login_user_login=${login_user_login}${
        grupoId ? `&grupoId=${grupoId}` : ''
      }`;
      const response = await fetch(url);
      const data = await response.json();
      return data.funcoes || [];
    } catch (error) {
      console.error('Erro ao buscar funções:', error);
      return [];
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const session = sessionStorage.getItem('perfilUserMelo');
    if (!session) {
      setIsLoading(false);
      return;
    }

    const result = JSON.parse(session);
    const { usuario, perfil, obs, codusr, filial } = result;

    if (!usuario) {
      setIsLoading(false);
      return;
    }

    // ✅ Verifica se já existem permissoes e funcoes no sessionStorage
    if (result.permissoes && result.funcoes) {
      setUser(result);
      setIsLoading(false);
      return;
    }

    // Caso contrário, busca da API
    // Caso contrário, busca da API
    fetchFuncoes(usuario, perfil).then((funcoes) => {
      const newUser = {
        usuario,
        perfil, // O perfil já está definido nesse ponto
        obs,
        codusr,
        filial,
        funcoes,
        permissoes: [],
      };

      setUser(newUser);
      sessionStorage.setItem('perfilUserMelo', JSON.stringify(newUser));
      setIsLoading(false);
    });
  }, []);

  // Redireciona somente após garantir que o carregamento terminou e não há usuário
  useEffect(() => {
    if (!isLoading && !user.usuario) {
      deleteCookie('token_melo');

      if (router.pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [isLoading, user.usuario, router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const result = sessionStorage.getItem('paginaAtualMelo');
    if (result && !ultimaPagina) {
      const parsed = JSON.parse(result);
      if (typeof parsed === 'string') {
        setUltimaPagina(parsed);
      } else if (parsed?.pagina) {
        setUltimaPagina(parsed.pagina);
      }
    }
  }, [ultimaPagina]);

  async function signIn({ usuario, perfil, obs, codusr, filial }: User) {
    setCookie('token_melo', `${usuario}-cookiesmelo`);
    const funcoes = await fetchFuncoes(usuario, perfil);

    const newUser = {
      usuario,
      perfil,
      obs,
      codusr,
      filial,
      permissoes: [],
      funcoes,
    };

    setUser(newUser);
    sessionStorage.setItem('perfilUserMelo', JSON.stringify(newUser));
  }

  async function filialSet({ filial }: Filial) {
    const result = JSON.parse(sessionStorage.getItem('perfilUserMelo') || '{}');
    const { usuario } = result;

    try {
      // Agora enviamos `nome_filial` no lugar de `codigo_filial`
      const response = await fetch(
        `/api/perfilFilial/get?user_login_id=${usuario}&nome_filial=${filial}`,
      );
      const { perfil_name } = await response.json();

      const permissoes = await fetchPermissoes(perfil_name);
      const funcoes = await fetchFuncoes(usuario, perfil_name);

      const newUser = {
        ...result,
        filial,
        perfil: perfil_name,
        permissoes,
        funcoes,
      };

      setUser(newUser);
      sessionStorage.setItem('perfilUserMelo', JSON.stringify(newUser));
      setCookie('filial_melo', filial, { path: '/' });
    } catch (error) {
      console.error('Erro ao definir filial e perfil:', error);
    }
  }

  async function paginaAtual({ pagina }: Pagina) {
    if (pagina) {
      sessionStorage.setItem('paginaAtualMelo', JSON.stringify(pagina));
    }
    setUltimaPagina(pagina);
  }

  return (
    <AuthContext.Provider
      value={{ user, signIn, filialSet, paginaAtual, ultimaPagina, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
