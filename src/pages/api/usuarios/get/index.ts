import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/utils/serializeBigInt';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    const { page = '1', perPage = '10', search = '' } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const perPageNumber = parseInt(perPage as string, 10);
    const skip = (pageNumber - 1) * perPageNumber;

    // Buscar usuários
    const usuarios = await prisma.tb_login_user.findMany({
      skip,
      take: perPageNumber,
      where: {
        OR: [
          {
            login_user_login: {
              contains: search as string,
              mode: 'insensitive',
            },
          },
          {
            login_user_name: {
              contains: search as string,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    const acessosPerfil = await prisma.tb_login_access_perfil.findMany();
    const acessosUsuario = await prisma.tb_login_access_user.findMany();
    const funcoesDoBanco = await prisma.tb_login_functions.findMany();

    const total = await prisma.tb_login_user.count({
      where: {
        OR: [
          {
            login_user_login: {
              contains: search as string,
              mode: 'insensitive',
            },
          },
          {
            login_user_name: {
              contains: search as string,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    const resposta = await Promise.all(
      usuarios.map(async (usuario) => {
        // Buscar perfis do usuário na tb_user_perfil
        const userPerfis = await prisma.tb_user_perfil.findMany({
          where: {
            user_login_id: usuario.login_user_login,
          },
          select: {
            perfil_name: true,
            codigo_filial: true,
            nome_filial: true,
          },
        });

        // Estrutura para consolidar os perfis por filial
        const perfisMap = new Map<string, any>();

        userPerfis.forEach((userPerfil) => {
          const key = `${userPerfil.perfil_name}-${userPerfil.codigo_filial}`;

          if (!perfisMap.has(key)) {
            perfisMap.set(key, {
              perfil_name: userPerfil.perfil_name,
              filial: [
                {
                  codigo_filial: userPerfil.codigo_filial,
                  nome_filial: userPerfil.nome_filial,
                },
              ],
              funcoes: [],
            });
          }
        });

        // Inserir Funções por Perfil e Filial
        acessosPerfil.forEach((item) => {
          userPerfis.forEach((userPerfil) => {
            if (item.login_perfil_name === userPerfil.perfil_name) {
              const key = `${userPerfil.perfil_name}-${userPerfil.codigo_filial}`;
              const perfil = perfisMap.get(key);

              if (perfil) {
                const funcao = funcoesDoBanco.find(
                  (func) =>
                    Number(func.id_functions) === Number(item.id_functions) &&
                    Number(func.codigo_filial) === userPerfil.codigo_filial,
                );

                if (funcao) {
                  perfil.funcoes.push({
                    id_functions: Number(funcao.id_functions),
                    descricao: funcao.descricao,
                    sigla: funcao.sigla ?? '-',
                    usadoEm: funcao.usadoEm ?? '-',
                    codigo_filial: Number(funcao.codigo_filial),
                  });
                }
              }
            }
          });
        });

        // Inserir Funções por Usuário e Filial
        acessosUsuario.forEach((item) => {
          userPerfis.forEach((userPerfil) => {
            if (
              item.login_user_login === usuario.login_user_login &&
              item.login_perfil_name === userPerfil.perfil_name
            ) {
              const key = `${userPerfil.perfil_name}-${userPerfil.codigo_filial}`;
              const perfil = perfisMap.get(key);

              if (perfil) {
                const funcao = funcoesDoBanco.find(
                  (func) =>
                    Number(func.id_functions) === Number(item.id_functions) &&
                    Number(func.codigo_filial) === userPerfil.codigo_filial,
                );

                if (funcao) {
                  perfil.funcoes.push({
                    id_functions: Number(funcao.id_functions),
                    descricao: funcao.descricao,
                    sigla: funcao.sigla ?? '-',
                    usadoEm: funcao.usadoEm ?? '-',
                    codigo_filial: Number(funcao.codigo_filial),
                  });
                }
              }
            }
          });
        });

        // Estrutura final de perfis
        const perfis = Array.from(perfisMap.values());

        return {
          login_user_login: usuario.login_user_login,
          login_user_name: usuario.login_user_name,
          perfis,
        };
      }),
    );

    const meta = {
      currentPage: pageNumber,
      perPage: perPageNumber,
      total,
      totalPages: Math.ceil(total / perPageNumber),
    };

    res.status(200).json(serializeBigInt({ data: resposta, meta }));
  } catch (error) {
    console.error('Erro ao buscar e processar dados:', error);
    res.status(500).json({ error: 'Erro ao buscar e processar dados.' });
  } finally {
    await prisma.$disconnect();
  }
}
