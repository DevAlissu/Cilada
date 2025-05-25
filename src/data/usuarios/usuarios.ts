import { Meta } from '../common/meta';
interface Resposta {
  login_user_login: string;
  login_user_name: string;
  perfis?: Perfil[];
}
export interface Usuario {
  data: Resposta[];
  meta: Meta;
}
export interface UsuarioEdit {
  login_user_login: string;
  login_user_name: string;
  perfis: {
    perfil_name: string;
    filial: {
      codigo_filial: string;
      nome_filial: string;
    }[];
    funcoes: {
      id_functions: number;
      descricao: string;
      sigla: string; // Adicionando sigla
      usadoEm: string; // Adicionando usadoEm
    }[];
  }[];
  filiais?: { codigo_filial: string }[]; // Adicionado para filiais diretas
  funcoesUsuario?: number[]; // Adicionado para funções diretas
}
export interface Perfil {
  perfil_name?: string;
  filial?: { codigo_filial: string; nome_filial: string }[];
  funcoes?: {
    id_functions: number;
    descricao: string;
    sigla?: string; // Ajuste
    usadoEm?: string; // Ajuste
    codigo_filial?: number;
  }[];
}

export interface UsuariosGetParams {
  page?: number;
  perPage?: number;
  search?: string;
  grupo?: string;
}

// Função getUsuarios atualizada para retornar um array direto
export async function getUsuarios({
  page = 1,
  perPage = 10,
  search = '',
  grupo,
}: UsuariosGetParams): Promise<Usuario> {
  try {
    const response = await fetch(
      `/api/usuarios/get?page=${page}&perPage=${perPage}&search=${search}&grupo=${grupo}`,
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao buscar usuários:', error);
      throw new Error(error.message || 'Erro ao buscar usuários.');
    }

    const data = await response.json();

    // A estrutura agora deve ser { data: Resposta[], meta: Meta }
    return {
      data: data.data ?? [],
      meta: data.meta ?? {
        currentPage: 1,
        perPage: 10,
        total: 0,
        totalPages: 1,
      },
    };
  } catch (error: any) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
}

// Função deletarUsuario
export async function deletarUsuario(id: string): Promise<void> {
  try {
    const response = await fetch(
      `/api/usuarios/deletar/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao deletar usuário:', error);
      throw new Error(error.message || 'Erro ao deletar usuário.');
    }
  } catch (error: any) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
}

// Função para atualizar um usuário
export async function atualizarUsuario(
  id: string,
  data: UsuarioEdit,
): Promise<void> {
  try {
    const response = await fetch(
      `/api/usuarios/update/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao atualizar usuário:', error);
      throw new Error(error.message || 'Erro ao atualizar usuário.');
    }

    // Se a atualização for bem-sucedida, você pode retornar algo aqui,
    // como os dados atualizados ou apenas uma confirmação.
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
}
// Função para criar um novo usuário
export async function criarUsuario(data: UsuarioEdit): Promise<void> {
  try {
    const response = await fetch('/api/usuarios/add', {
      // Use o endpoint correto para criar um usuário
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao criar usuário:', error);
      throw new Error(error.message || 'Erro ao criar usuário.');
    }
    // Não é necessário retornar os dados do usuário criado, a menos que você precise deles.
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}
// Função resetarSenha
export async function resetarSenha(id: string): Promise<void> {
  try {
    const response = await fetch(
      `/api/usuarios/reset/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao resetar senha:', error);
      throw new Error(error.message || 'Erro ao resetar senha.');
    }
  } catch (error: any) {
    console.error('Erro ao resetar senha:', error);
    throw error;
  }
}
