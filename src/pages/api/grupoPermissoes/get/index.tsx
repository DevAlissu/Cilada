import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { grupoId } = req.query;

  if (!grupoId || typeof grupoId !== 'string') {
    return res
      .status(400)
      .json({ error: 'Parâmetro grupoId é obrigatório e deve ser uma string' });
  }

  try {
    const permissoes = await prisma.tb_grupo_Permissao.findMany({
      where: {
        grupoId: grupoId,
      },
      include: {
        tb_telas: true,
      },
    });

    // const telas = permissoes.map((item) => item.tb_telas);
    //const telas: string[] = telas2.map((item) => item.PATH_TELA);

    res.status(200).json({ permissoes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar telas' });
  } finally {
    await prisma.$disconnect(); // <-- somente aqui
  }
}
