import { Meta } from '@/data/common/meta';
import { GetParams } from '@/data/common/getParams';
import api from '@/components/services/api';
import { GrupoProduto } from '@/data/gruposProduto/gruposProduto';

export interface ClasseVendedor {
  codcv: string;
  descr: string;
}

export interface ClassesVendedor {
  data: ClasseVendedor[];
  meta: Meta;
}

export interface DetalhadoVendedor {
  codvend: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  celular?: string;
  logradouro?: string;
  nome?: string;
  tipo?: string;
  cpf_cnpj?: string;
  vendedor?: Vendedor;
}

export interface VendedorGruposProduto {
  codvend: string;
  codgpp: string;
  exclusivo: string;
  comdireta?: number;
  comindireta?: number;
  vendedor?: Vendedor;
  grupo_produto?: GrupoProduto;
}

export interface VendedorPst {
  id: number;
  codvend: string;
  codpst: string;
  local: string;
}

export interface Vendedor {
  codvend: string;
  nome?: string;
  valobj?: number;
  comnormal?: number;
  comtele?: number;
  debito?: number;
  credito?: number;
  limite?: number;
  status?: string;
  codcv?: string;
  comobj?: number;
  valobjf?: number;
  valobjm?: number;
  valobjsf?: number;
  ra_mat?: string;
  classe_vendedor?: ClasseVendedor;
  detalhado_vendedor?: DetalhadoVendedor;
  grupos_produto?: VendedorGruposProduto[];
  pst?: VendedorPst;
}

export interface Vendedores {
  data: Vendedor[];
  meta: Meta;
}

export async function getClassesVendedor({ page, perPage, search }: GetParams): Promise<ClassesVendedor> {
  let classesVendedor: ClassesVendedor = {} as ClassesVendedor;

  await api.get(`/api/vendedores/classes/get?page=${page}&perPage=${perPage}&search=${search}`)
    .then((response) => {
      classesVendedor = response.data;
    });

  return classesVendedor;
}

export async function getVendedores({ page, perPage, search }: GetParams): Promise<Vendedores> {
  let vendedores: Vendedores = {} as Vendedores;

  await api.get(`/api/vendedores/get?page=${page}&perPage=${perPage}&search=${search}`)
    .then((response) => {
      vendedores = response.data;
    }).catch((error) => {
      console.log(error);
    });

  return vendedores;
}

export async function getVendedor(id: string): Promise<Vendedor> {
  let vendedor: Vendedor = {} as Vendedor;

  await api.get(`/api/vendedores/get/${id}`)
    .then((response) => {
      vendedor = response.data;
    });

  return vendedor;
}

export async function insertVendedor(vendedor: Vendedor): Promise<Vendedor> {
  let newVendedor: Vendedor = {} as Vendedor;

  await api.post('/api/vendedores/add', vendedor)
    .then((response) => {
      newVendedor = response.data;
    });

  return newVendedor;
}

export async function updateVendedor(vendedor: Vendedor): Promise<Vendedor> {
  let updatedVendedor: Vendedor = {} as Vendedor;

  await api.put(`/api/vendedores/update`, vendedor)
    .then((response) => {
      updatedVendedor = response.data;
    });

  return updatedVendedor;
}