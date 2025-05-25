import { z } from 'zod';

export const cadastroProdutoSchema = z.object({
  ref: z.string({ required_error: 'Campo referência é obrigatório.'}),
  descr: z.string({ required_error: 'Campo descrição é obrigatório.'}),
  codmarca: z.string({ required_error: 'Campo marca é obrigatório.'}),
  codgpf: z.string({ required_error: 'Campo grupo de função é obrigatório.'}),
  codgpp: z.string({ required_error: 'Campo grupo de produto é obrigatório.'}),
  curva: z.string({ required_error: 'Campo curva ABC é obrigatório.'}),
  inf: z.string({ required_error: 'Campo informativo é obrigatório.'}),
  multiplo: z.number({ required_error: 'Campo multiplo venda é obrigatório.'}),
  coddesc: z.number({ required_error: 'Campo desconto de fábrica é obrigatório.'}),
  tabelado: z.string({ required_error: 'Campo tabelado é obrigatório.'}),
  compradireta: z.string({ required_error: 'Campo compra direta é obrigatório.'}),
  tipo: z.string({ required_error: 'Campo tipo produto é obrigatório.'}),
  trib: z.string({ required_error: 'Campo tributado é obrigatório.'}),
  clasfiscal: z.string({ required_error: 'Campo classificação fiscal é obrigatório.'}),
  strib: z.string({ required_error: 'Campo situação tributária é obrigatório.'}),
  isentopiscofins: z.string({ required_error: 'Campo isento pis cofins é obrigatório.'}),
  isentoipi: z.string({ required_error: 'Campo isento ipi é obrigatório.'}),
  cest: z.string({ required_error: 'Campo cest é obrigatório.'}),
});