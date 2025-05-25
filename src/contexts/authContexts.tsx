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

  /** Consolida a lógica de inicialização e paginação */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const session = sessionStorage.getItem('perfilUserMelo');
    const pagina = sessionStorage.getItem('paginaAtualMelo');

    let userData: User = {
      usuario: '',
      perfil: '',
      obs: '',
      codusr: '',
      filial: '',
      permissoes: [],
      funcoes: [],
    };

    if (session) {
      const parsedUser = JSON.parse(session);
      userData = { ...userData, ...parsedUser };
    }

    if (pagina) {
      const parsedPagina = JSON.parse(pagina);
      const paginaStr =
        typeof parsedPagina === 'string' ? parsedPagina : parsedPagina.pagina;
      setUltimaPagina(paginaStr);
    }

    if (userData.usuario) {
      if (!userData.permissoes?.length || !userData.funcoes?.length) {
        fetchFuncoes(userData.usuario, userData.perfil).then((funcoes) => {
          userData.funcoes = funcoes;
          setUser(userData);
          sessionStorage.setItem('perfilUserMelo', JSON.stringify(userData));
          setIsLoading(false);
        });
      } else {
        setUser(userData);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  /** Redirecionamento para login */
  useEffect(() => {
    if (!isLoading && !user.usuario && router.pathname !== '/login') {
      deleteCookie('token_melo');
      router.push('/login');
    }
  }, [isLoading, user.usuario, router]);

  /** Atualização de filial e perfil */
  async function filialSet({ filial }: Filial) {
    const session = sessionStorage.getItem('perfilUserMelo');
    const currentUser = session ? JSON.parse(session) : { usuario: '' };

    try {
      const response = await fetch(
        `/api/perfilFilial/get?user_login_id=${currentUser.usuario}&nome_filial=${filial}`,
      );
      const { perfil_name } = await response.json();

      const permissoes = await fetchPermissoes(perfil_name);
      const funcoes = await fetchFuncoes(currentUser.usuario, perfil_name);

      const updatedUser = {
        ...currentUser,
        filial,
        perfil: perfil_name,
        permissoes,
        funcoes,
      };

      setUser(updatedUser);
      sessionStorage.setItem('perfilUserMelo', JSON.stringify(updatedUser));
      setCookie('filial_melo', filial, { path: '/' });
    } catch (error) {
      console.error('Erro ao definir filial e perfil:', error);
    }
  }

  /** Atualiza a última página acessada */
  async function paginaAtual({ pagina }: Pagina) {
    if (pagina) {
      setUltimaPagina(pagina);
      sessionStorage.setItem('paginaAtualMelo', JSON.stringify(pagina));
    }
  }

  /** Autenticação do usuário */
  async function signIn({ usuario, perfil, obs, codusr, filial }: User) {
    setCookie('token_melo', `${usuario}-cookiesmelo`);

    try {
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
    } catch (error) {
      console.error('Erro no signIn:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, signIn, filialSet, paginaAtual, ultimaPagina, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
