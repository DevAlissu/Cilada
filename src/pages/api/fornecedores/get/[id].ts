import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import { getPrisma } from '@/lib/prismaClient';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const cookies = parseCookies({ req });
  const filial = cookies.filial_melo;

  if (!filial) {
    return res.status(400).json({ error: 'Filial não informada no cookie' });
  }

  const prisma = getPrisma(filial);

  if (req.method === 'GET') {
    // Buscar fornecedor
    try {
      const fornecedor = await prisma.dbcredor.findUnique({
        where: { cod_credor: id },
      });

      if (!fornecedor) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' });
      }

      res.status(200).json(fornecedor);
    } catch (error) {
      console.error('Erro ao buscar fornecedor:', error);
      res.status(500).json({ error: 'Erro ao buscar fornecedor' });
    }
  } else if (req.method === 'PUT') {
    // Atualizar fornecedor
    try {
      const data = req.body;

      const fornecedorAtualizado = await prisma.dbcredor.update({
        where: { cod_credor: id },
        data,
      });

      res.status(200).json(fornecedorAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
    }
  } else {
    return res.status(405).json({ error: 'Método não permitido' });
  }
}
