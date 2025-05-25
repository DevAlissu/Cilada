import { z } from 'zod';

export const cadastroFornecedorSchema = z.object({
  cpf_cgc: z.string({ required_error: 'Campo CNPJ é obrigatório.'}),
  nome: z.string({ required_error: 'Campo nome é obrigatório.'}),
  cep: z.string({ required_error: 'Campo CEP é obrigatório.'}),
  endereco: z.string({ required_error: 'Campo logradouro é obrigatório.'}),
  numero: z.string({ required_error: 'Campo número é obrigatório.'}),
  uf: z.string({ required_error: 'Campo UF é obrigatório.'}),
  cidade: z.string({ required_error: 'Campo cidade é obrigatório.'}),
  bairro: z.string({ required_error: 'Campo bairro é obrigatório.'}),
  tipoemp: z.string({ required_error: 'Campo tipo empresa é obrigatório.'}),
  tipofornecedor: z.string({ required_error: 'Campo tipo fornecedor é obrigatório.'}),
  imun: z.object({
    isentoIm: z.boolean(),
    imun: z.string().optional(),
  }).refine(data => (data.isentoIm || (!data.isentoIm && data.imun)), {
    message: 'Campo Inscrição Municipal é obrigatório quando Isento IM está desmarcado.',
  }),
  iest: z.object({
    isentoIe: z.boolean(),
    iest: z.string().optional(),
  }).refine(data => (data.isentoIe || (!data.isentoIe && data.iest)), {
    message: 'Campo Inscrição Estadual é obrigatório quando Isento IE está desmarcado.',
  }),
  isuframa: z.object({
    isentoSuf: z.boolean(),
    isuframa: z.string().optional(),
  }).refine(data => (data.isentoSuf || (!data.isentoSuf && data.isuframa)), {
    message: 'Campo Inscrição Suframa é obrigatório quando Isento Suframa está desmarcado.',
  }),
});