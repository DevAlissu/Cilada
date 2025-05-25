import api from '@/components/services/api';
import {Pais} from "@/data/paises/paises";
import { Meta } from '@/data/common/meta';
import { GetParams } from '@/data/common/getParams';

export interface Zona {
  codzona: string;
  descr: string;
  bairros: Bairro[];
}

export interface Municipio {
  codmunicipio: string;
  coduf: string;
  descricao: string;
  uf: string;
  bairros: Bairro[];
}

export interface Bairro {
  codbairro: string;
  codzona: string;
  descr: string;
  uf: string;
  cidade: string;
  bai_nu_sequencial?: number;
  codmunicipio: string;
  codpais: number;
  zona: Zona;
  municipio: Municipio;
  pais: Pais;
}

export interface Bairros {
  data: Bairro[];
  meta: Meta;
}

export async function getBairroByDescricao(descricao: string): Promise<Bairro> {
  let bairro: Bairro = {} as Bairro;

  await api.get(`/api/bairros/getByDescricao?descricao=${descricao}`)
    .then((response) => {
      bairro = response.data;
    });

  return bairro;
}

export async function getBairros({page, perPage, search}: GetParams): Promise<Bairros> {
  let bairros: Bairros = {} as Bairros;

  await api.get(`/api/bairros/get?page=${page}&perPage=${perPage}&search=${search}`)
    .then((response) => {
      bairros = response.data;
    });

  return bairros;
}