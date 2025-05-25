import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/utils/serializeBigInt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { page = '1', perPage = '10', search = '' } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const perPageNumber = parseInt(perPage as string, 10);
  const searchTerm = `%${search}%`;
  const offset = (pageNumber - 1) * perPageNumber;

  try {
    const [data, totalCountResult] = await Promise.all([
      prisma.$queryRawUnsafe<any[]>(
        `
        SELECT 
          p."login_perfil_name" AS login_perfil_name,
          COUNT(DISTINCT gp."tela") AS qtd_telas,
          COUNT(DISTINCT u."login_user_login") AS qtd_usuarios,
          COUNT(DISTINCT lap."id_functions") AS qtd_functions

        FROM "db_manaus"."tb_login_perfil" p

        LEFT JOIN "db_manaus"."tb_grupo_Permissao" gp
          ON gp."grupoId" = p."login_perfil_name"

        LEFT JOIN "db_manaus"."tb_login_user" u
          ON u."login_perfil_name" = p."login_perfil_name"

        LEFT JOIN "db_manaus"."tb_login_access_perfil" lap
          ON lap."login_perfil_name" = p."login_perfil_name"

        WHERE p."login_perfil_name" ILIKE $1
        GROUP BY p."login_perfil_name"
        ORDER BY p."login_perfil_name"
        OFFSET $2
        LIMIT $3
      `,
        searchTerm,
        offset,
        perPageNumber,
      ),

      prisma.$queryRawUnsafe<{ count: bigint }[]>(
        `
        SELECT COUNT(*) FROM (
          SELECT p."login_perfil_name"
          FROM "db_manaus"."tb_login_perfil" p
          WHERE p."login_perfil_name" ILIKE $1
          GROUP BY p."login_perfil_name"
        ) AS subquery
      `,
        searchTerm,
      ),
    ]);

    const total = Number(totalCountResult[0]?.count ?? 0);

    return res.status(200).json(
      serializeBigInt({
        data: data,
        meta: {
          page: pageNumber,
          perPage: perPageNumber,
          total,
          totalPages: Math.ceil(total / perPageNumber),
        },
      }),
    );
  } catch (error) {
    console.error('Erro ao buscar perfis:', error);
    return res.status(500).json({ error: 'Erro ao buscar perfis' });
  } finally {
    await prisma.$disconnect();
  }
}
