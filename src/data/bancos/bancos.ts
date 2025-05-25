import api from "@/components/services/api";
import { GetParams } from "../common/getParams";
import { Meta } from "../common/meta";


export interface Banco {
    banco: string;
    nome: string;
}

export interface Bancos {
  data: Banco[];
  meta: Meta;
}

export async function getBancos({ page, perPage, search}: GetParams): Promise<Bancos> {
    let bancos: Bancos = {} as Bancos;

    await api.get(`/api/bancos/get?page=${page}&perPage=${perPage}&search=${search}`)
        .then((response) => {
            bancos = response.data;
        });

    return bancos;
}

export async function createBancos(banco: Banco): Promise<void> {
    await api.post('/api/bancos/add', banco);
  }
  
  export async function updateBancos( banco: Banco): Promise<void> {
    await api.put(`/api/bancos/update`, banco);
  }
  