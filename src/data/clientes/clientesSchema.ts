import { z } from 'zod';

export const cadastroClientesSchema = z
  .object({
    cpfcgc: z.string({ required_error: 'Campo CPF/CNPJ é obrigatório.' }),
    nome: z.string({ required_error: 'Campo nome é obrigatório.' }),
    cep: z.string({ required_error: 'Campo CEP é obrigatório.' }),
    ender: z.string({ required_error: 'Campo logradouro é obrigatório.' }),
    numero: z.string().optional(),
    uf: z.string({ required_error: 'Campo UF é obrigatório.' }),
    cidade: z.string({ required_error: 'Campo cidade é obrigatório.' }),
    bairro: z.string({ required_error: 'Campo bairro é obrigatório.' }),
    codpais: z.number({ required_error: 'Campo país é obrigatório.' }),
    tipocliente: z.string({
      required_error: 'Campo tipo cliente é obrigatório.',
    }),
    sit_tributaria: z.number({
      required_error: 'Campo situação tributária é obrigatório.',
    }),

    imun: z
      .object({
        isentoIm: z.boolean(),
        imun: z.string().optional(),
      })
      .refine((data) => data.isentoIm || (!data.isentoIm && data.imun), {
        message:
          'Campo Inscrição Municipal é obrigatório quando Isento IM está desmarcado.',
      }),

    iest: z
      .object({
        isentoIe: z.boolean(),
        iest: z.string().optional(),
      })
      .refine((data) => data.isentoIe || (!data.isentoIe && data.iest), {
        message:
          'Campo Inscrição Estadual é obrigatório quando Isento IE está desmarcado.',
      }),

    isuframa: z
      .object({
        isentoSuf: z.boolean(),
        isuframa: z.string().optional(),
      })
      .refine((data) => data.isentoSuf || (!data.isentoSuf && data.isuframa), {
        message:
          'Campo Inscrição Suframa é obrigatório quando Isento Suframa está desmarcado.',
      }),

    claspgto: z
      .string({
        required_error: 'Campo classificação de pagamento é obrigatório.',
      })
      .min(1, 'Campo classificação de pagamento é obrigatório.'),

    faixafin: z
      .string({
        required_error: 'Campo Faixa Financeira é obrigatório.',
      })
      .min(1, 'Campo Faixa Financeira é obrigatório.'),

    atraso: z
      .object({
        aceitarAtraso: z.boolean(),
        atraso: z.number().optional(),
      })
      .refine(
        (data) => !data.aceitarAtraso || (data.atraso && data.atraso > 0),
        {
          message:
            'Campo Dias em Atraso é obrigatório quando Aceitar Atraso está marcado.',
        },
      ),

    icms: z.string({ required_error: 'Campo ICMS é obrigatório.' }),
    banco: z
      .string({ required_error: 'Campo banco é obrigatório.' })
      .optional(), // TODO: Opcional por enquanto.
    mesmoEndereco: z.boolean(),

    // Endereço de cobrança
    cepcobr: z.string().optional(),
    endercobr: z.string().optional(),
    numcobr: z.string().optional(),
    ufcobr: z.string().optional(),
    cidadecobr: z.string().optional(),
    bairrocobr: z.string().optional(),
    codpaiscobr: z.number().optional(),

    prvenda: z.string({
      required_error: 'Campo preço de venda é obrigatório.',
    }),
    kickback: z.number({ required_error: 'Campo kickback é obrigatório.' }),
    bloquear_preco: z.string({
      required_error: 'Campo bloquear preço é obrigatório.',
    }),
    vendedor_externo: z
      .string({ required_error: 'Campo vendedor externo é obrigatório.' })
      .optional(), // TODO: Opcional por enquanto.
    limite: z.number().nonnegative(),
  })
  .superRefine((data, ctx) => {
    if (!data.mesmoEndereco) {
      if (!data.cepcobr)
        ctx.addIssue({
          path: ['cepcobr'],
          code: z.ZodIssueCode.custom,
          message: 'Campo CEP cobrança é obrigatório.',
        });

      if (!data.endercobr)
        ctx.addIssue({
          path: ['endercobr'],
          code: z.ZodIssueCode.custom,
          message: 'Campo logradouro cobrança é obrigatório.',
        });

      if (!data.ufcobr)
        ctx.addIssue({
          path: ['ufcobr'],
          code: z.ZodIssueCode.custom,
          message: 'Campo UF cobrança é obrigatório.',
        });

      if (!data.cidadecobr)
        ctx.addIssue({
          path: ['cidadecobr'],
          code: z.ZodIssueCode.custom,
          message: 'Campo cidade cobrança é obrigatório.',
        });

      if (!data.bairrocobr)
        ctx.addIssue({
          path: ['bairrocobr'],
          code: z.ZodIssueCode.custom,
          message: 'Campo bairro cobrança é obrigatório.',
        });

      if (!data.codpaiscobr)
        ctx.addIssue({
          path: ['codpaiscobr'],
          code: z.ZodIssueCode.custom,
          message: 'Campo país cobrança é obrigatório.',
        });
    }
  });
