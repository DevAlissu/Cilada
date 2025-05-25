import { Meta } from '../common/meta';
import api from '@/components/services/api';
import { GetParams } from '../common/getParams';

export interface Tela {
  CODIGO_TELA: number;
  NOME_TELA: string;
  PATH_TELA: string;
}

export interface Telas {
  data: Tela[];
  meta: Meta;
}

export async function getTelas({
  page,
  perPage,
  search,
}: GetParams): Promise<Telas> {
  let telas: Telas = {} as Telas;

  await api
    .get(`/api/telas/get?page=${page}&perPage=${perPage}&search=${search}`)
    .then((response) => {
      telas = response.data;
    });

  return telas;
}

export async function getTodasTelas(): Promise<Tela[] | null> {
  try {
    const res = await api.get('/api/telas/todas');
    return res.data;
  } catch (error) {
    console.error('Erro ao buscar todas as telas:', error);
    return null; // ⚠️ Não usar throw aqui
  }
}

export async function insertTela(
  tela: Omit<Tela, 'CODIGO_TELA'>,
): Promise<void> {
  await api.post('/api/telas/add', tela);
}

export async function getTela(id: number): Promise<Tela> {
  let tela: Tela = {} as Tela;

  await api.get(`/api/telas/get/${id}`).then((response) => {
    tela = response.data;
  });

  return tela;
}

export async function updateTela(tela: Tela): Promise<void> {
  await api.put(`/api/telas/update`, tela);
}

export async function deletarTela(id: number): Promise<void> {
  try {
    await api.delete(`/api/telas/delete/${id}`);
  } catch (error: any) {
    console.error('Erro ao deletar tela na camada de dados:', error);
    // Rejeite a promessa para que o erro seja capturado no componente
    throw error;
  }
}
