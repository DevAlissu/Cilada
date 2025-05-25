import {z} from "zod";

export const cadastroVendedorSchema = z.object({
    nome: z.string({ required_error: "Campo nome é obrigatório" }),
    codcv: z.string().optional(),
    detalhado_vendedor: z.object({
        bairro: z.string().optional(),
        cep: z.string().optional(),
        cidade: z.string().optional(),
        estado: z.string().optional(),
        celular: z.string().optional(),
        logradouro: z.string().optional(),
        nome: z.string().optional(),
        tipo: z.string().optional(),
        cpf_cnpj: z.string().optional(),
    }).optional(),
    grupos_produto: z.array(z.object({
        codgpp: z.string().optional(),
        exclusivo: z.string().optional(),
    })).optional(),
});