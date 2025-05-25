import { GetParams } from '../common/getParams';
import { Meta } from '../common/meta';
import api from '@/components/services/api';
import { getBairroByDescricao } from '@/data/bairros/bairros';

export interface ClasseFornecedor {
  codcf: string;
  descr: string;
}

export interface ClassesFornecedor {
  data: ClasseFornecedor[];
  meta: Meta;
}

export interface RegraFaturamento {
  crf_id?: string;
  desc_icms_sufra: number;
  desc_icms_sufra_piscofins: number;
  piscofins_365: number;
  piscofins_925: number;
  piscofins_1150: number;
  piscofins_1310: number;
  desc_icms_sufra_st: number;
  desc_piscofins_st: number;
  acres_piscofins_st: number;
  desc_icms_sufra_importado: number;
  cobrar_ipi_importado: number;
  frete: number;
  basereduzida_st: number;
  basereduzida_icms: number;
  desc_icms_sufra_base: number;
  desc_icms_sufra_importado_base: number;
}

export interface Fornecedor {
  cod_credor?: string;
  nome?: string;
  nome_fant?: string;
  cpf_cgc?: string;
  tipo?: string;
  data_cad?: Date;
  endereco?: string;
  bairro: string;
  cidade?: string;
  uf?: string;
  isuframa?: string;
  iest?: string;
  imun?: string;
  cc?: string;
  n_agencia?: string;
  banco?: string;
  cod_ident?: string;
  contatos?: string;
  tipoemp?: string;
  cep?: string;
  codcf?: string;
  fabricante?: string;
  regime_tributacao?: string;
  codbairro?: string;
  codmunicipio?: string;
  numero?: string;
  referencia?: string;
  codpais?: number;
  complemento?: string;
  tipofornecedor?: string;
  codunico?: string;
  codccontabil?: string;
  regra_faturamento?: RegraFaturamento;
}

export interface Fornecedores {
  data: Fornecedor[];
  meta: Meta;
}

export async function getFornecedores({
  page,
  perPage,
  search,
}: GetParams): Promise<Fornecedores> {
  let fornecedores: Fornecedores = {} as Fornecedores;

  await api
    .get(
      `/api/fornecedores/get?page=${page}&perPage=${perPage}&search=${search}`,
    )
    .then((response) => {
      fornecedores = response.data;
    });

  return fornecedores;
}

export async function insertFornecedor(
  fornecedor: Fornecedor,
): Promise<Fornecedor> {
  let fornecedorInserted: Fornecedor = {} as Fornecedor;

  const bairro = await getBairroByDescricao(fornecedor.bairro);

  fornecedor.codbairro = bairro.codbairro;
  fornecedor.codpais = bairro.codpais;
  fornecedor.codmunicipio = bairro.codmunicipio;

  await api.post('/api/fornecedores/add', fornecedor).then((response) => {
    fornecedorInserted = response.data;
  });

  return fornecedorInserted;
}

export async function getFornecedor(id: string): Promise<Fornecedor> {
  let fornecedor: Fornecedor = {} as Fornecedor;

  await api.get(`/api/fornecedores/get/${id}`).then((response) => {
    fornecedor = response.data;
  });

  return fornecedor;
}

export async function updateFornecedor(
  fornecedor: Fornecedor,
): Promise<Fornecedor> {
  let fornecedorUpdated: Fornecedor = {} as Fornecedor;

  await api.put(`/api/fornecedores/update`, fornecedor).then((response) => {
    fornecedorUpdated = response.data;
  });

  return fornecedorUpdated;
}

export async function getClassesFornecedor({
  page,
  perPage,
  search,
}: GetParams): Promise<ClassesFornecedor> {
  let classesFornecedor: ClassesFornecedor = {} as ClassesFornecedor;

  await api
    .get(
      `/api/fornecedores/classes/get?page=${page}&perPage=${perPage}&search=${search}`,
    )
    .then((response) => {
      classesFornecedor = response.data;
    });

  return classesFornecedor;
}

export async function buscaFornecedores({
  page,
  perPage,
  filtros,
  busca = '',
}: {
  page: number;
  perPage: number;
  filtros: { campo: string; tipo: string; valor: string }[];
  busca?: string;
}): Promise<Fornecedores> {
  let fornecedores: Fornecedores = {} as Fornecedores;

  await api
    .post('/api/fornecedores/busca', {
      page,
      perPage,
      filtros: JSON.stringify(filtros),
      busca,
    })
    .then((response) => {
      fornecedores = response.data;
    });

  return fornecedores;
}
