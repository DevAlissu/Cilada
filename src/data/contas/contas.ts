import api from "@/components/services/api";
import { GetParams } from "../common/getParams";
import { Meta } from "../common/meta";

export interface Conta{
    id: number;
    banco: string;
    nomeBanco: string;
    tipo: string;
    nroconta: string;
    convenio: string | null;
    variacao: string;
    carteira: string;
    melo: string;
    agencia: string;
}

export interface Contas{
    data: Conta[];
    meta: Meta;
}

export async function getContas({ page, perPage, search}: GetParams): Promise<Contas> {
    let contas: Contas = {} as Contas;

    await api.get(`/api/contas/get?page=${page}&perPage=${perPage}&search=${search}`)
        .then((response) => {
            contas = response.data;
        });

    return contas;
}

export async function createContas(conta: Conta): Promise<void> {
    await api.post('/api/contas/add', conta);
  }
  
  export async function updateContas( conta: Conta): Promise<void> {
    await api.put(`/api/contas/update`, conta);
  }
