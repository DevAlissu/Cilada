import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import { getPrisma } from '@/lib/prismaClient';

import { Fornecedor } from '@/data/fornecedores/fornecedores';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const cookies = parseCookies({ req });
  const filial = cookies.filial_melo;

  if (!filial) {
    return res.status(400).json({ error: 'Filial não informada no cookie' });
  }

  const prisma = getPrisma(filial);

  const { regra_faturamento, ...data }: Fornecedor = req.body;

  try {
    const fornecedor = await prisma.dbcredor.update({
      where: { cod_credor: data.cod_credor },
      data: data,
    });

    if (regra_faturamento) {
      await prisma.cad_credor_regra_faturamento.upsert({
        where: { crf_id: fornecedor.cod_credor },
        create: {
          crf_id: regra_faturamento.crf_id || fornecedor.cod_credor,
          desc_icms_sufra: regra_faturamento.desc_icms_sufra || 0,
          desc_icms_sufra_piscofins:
            regra_faturamento.desc_icms_sufra_piscofins || 0,
          piscofins_365: regra_faturamento.piscofins_365 || 0,
          piscofins_925: regra_faturamento.piscofins_925 || 0,
          piscofins_1150: regra_faturamento.piscofins_1150 || 0,
          piscofins_1310: regra_faturamento.piscofins_1310 || 0,
          desc_icms_sufra_st: regra_faturamento.desc_icms_sufra_st || 0,
          desc_piscofins_st: regra_faturamento.desc_piscofins_st || 0,
          acres_piscofins_st: regra_faturamento.acres_piscofins_st || 0,
          desc_icms_sufra_importado:
            regra_faturamento.desc_icms_sufra_importado || 0,
          cobrar_ipi_importado: regra_faturamento.cobrar_ipi_importado || 0,
          frete: regra_faturamento.frete || 0,
          basereduzida_st: regra_faturamento.basereduzida_st || 0,
          basereduzida_icms: regra_faturamento.basereduzida_icms || 0,
          desc_icms_sufra_base: regra_faturamento.desc_icms_sufra_base || 0,
          desc_icms_sufra_importado_base:
            regra_faturamento.desc_icms_sufra_importado_base || 0,
        },
        update: { ...regra_faturamento },
      });
    }

    res.status(201).setHeader('Content-Type', 'application/json').json({
      data: fornecedor,
    });
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({ error: (error as Error).message });
  }
}
