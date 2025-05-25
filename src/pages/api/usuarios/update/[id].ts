import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

interface Funcao {
  id_functions: number;
  descricao: string;
  sigla: string;
  usadoEm: string;
}

interface Filial {
  codigo_filial: string;
  nome_filial: string;
}

interface Perfil {
  perfil_name: string;
  filial: Filial[];
  funcoes: Funcao[];
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { id } = req.query;

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método não permitido. Use PUT.' });
  }

  if (!id) {
    return res
      .status(400)
      .json({ error: 'ID do usuário obrigatório para atualização.' });
  }

  const {
    login_user_name,
    login_user_login,
    perfis,
  }: {
    login_user_name: string;
    login_user_login?: string;
    perfis: Perfil[];
  } = req.body;

  try {
    await prisma.$transaction(
      async (tx) => {
        // 1. Atualizar o usuário
        await tx.tb_login_user.update({
          where: { login_user_login: id as string },
          data: {
            login_user_name,
            login_user_login,
          },
        });

        // 2. Remover duplicatas do array de perfis recebido
        const uniquePerfis = perfis.filter(
          (perfil: Perfil, index: number, self: Perfil[]) =>
            index ===
            self.findIndex(
              (p) =>
                p.perfil_name === perfil.perfil_name &&
                p.filial.some((f) =>
                  perfil.filial.some(
                    (pf) => pf.codigo_filial === f.codigo_filial,
                  ),
                ),
            ),
        );

        // 3. Inserir os perfis
        await tx.tb_user_perfil.deleteMany({
          where: {
            user_login_id: login_user_login as string,
          },
        });
        const perfilData = uniquePerfis.flatMap((perfil: Perfil) =>
          perfil.filial.map((filial) => ({
            user_login_id: login_user_login as string,
            perfil_name: perfil.perfil_name,
            codigo_filial: Number(filial.codigo_filial),
            nome_filial: filial.nome_filial,
          })),
        );

        if (perfilData.length > 0) {
          for (const perfil of perfilData) {
            try {
              await tx.tb_user_perfil.create({
                data: perfil,
              });
            } catch (error) {
              console.error(
                `Erro ao inserir perfil ${perfil.perfil_name}:`,
                error,
              );
            }
          }
        }

        // 4. Atualizar funções em tb_login_access_user
        await tx.tb_login_access_user.deleteMany({
          where: { login_user_login: id as string },
        });

        const funcoesData = perfis.flatMap((perfil) =>
          perfil.funcoes.map((funcao) => ({
            login_user_login: login_user_login as string,
            id_functions: BigInt(funcao.id_functions),
            login_perfil_name: perfil.perfil_name || null,
          })),
        );

        const uniqueFuncoesData = funcoesData.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.id_functions === item.id_functions &&
                t.login_user_login === item.login_user_login &&
                t.login_perfil_name === item.login_perfil_name,
            ),
        );

        if (uniqueFuncoesData.length > 0) {
          for (const funcao of uniqueFuncoesData) {
            try {
              const funcaoExistente = await tx.tb_login_access_user.findUnique({
                where: {
                  id_functions_login_user_login: {
                    id_functions: funcao.id_functions,
                    login_user_login: funcao.login_user_login,
                  },
                },
              });

              if (!funcaoExistente) {
                await tx.tb_login_access_user.create({
                  data: {
                    login_user_login: funcao.login_user_login,
                    id_functions: funcao.id_functions,
                    login_perfil_name: funcao.login_perfil_name,
                  },
                });
              } else {
                console.warn(
                  `Função ${funcao.id_functions} já existente para o usuário ${funcao.login_user_login}. Ignorando...`,
                );
              }
            } catch (error) {
              console.error(
                `Erro ao inserir função ${funcao.id_functions}:`,
                error,
              );
              continue;
            }
          }
        }

        // 5. Atualizar filiais em tb_login_filiais
        await tx.tb_login_filiais.deleteMany({
          where: { login_user_login: id as string },
        });

        const filiaisData = perfis.flatMap((perfil) =>
          perfil.filial.map((filial) => ({
            login_user_login: login_user_login as string,
            codigo_filial: Number(filial.codigo_filial), // Ajustado para `number`
            nome_filial: filial.nome_filial,
          })),
        );

        const uniqueFiliaisData = filiaisData.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.login_user_login === item.login_user_login &&
                t.codigo_filial === item.codigo_filial,
            ),
        );

        if (uniqueFiliaisData.length > 0) {
          for (const filial of uniqueFiliaisData) {
            try {
              const filialExistente = await tx.tb_login_filiais.findUnique({
                where: {
                  login_user_login_codigo_filial: {
                    login_user_login: filial.login_user_login,
                    codigo_filial: filial.codigo_filial,
                  },
                },
              });

              if (!filialExistente) {
                await tx.tb_login_filiais.create({
                  data: {
                    login_user_login: filial.login_user_login,
                    codigo_filial: filial.codigo_filial,
                    nome_filial: filial.nome_filial,
                  },
                });
              } else {
                console.warn(
                  `Filial ${filial.codigo_filial} já existente para o usuário ${filial.login_user_login}. Ignorando...`,
                );
              }
            } catch (error) {
              console.error(
                `Erro ao inserir filial ${filial.codigo_filial}:`,
                error,
              );
              continue;
            }
          }
        }
      },

      {
        maxWait: 10000, // 10 segundos
        timeout: 60000, // 1 minuto
      },
    );

    return res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
}
