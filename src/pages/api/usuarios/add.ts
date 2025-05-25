import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;
interface FilialData {
  codigo_filial: number;
  nome_filial: string;
}

interface PerfilUnico {
  perfil_name: string;
  codigo_filial: number;
  nome_filial: string;
  funcoes: { id_functions: number }[];
}
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido. Use POST.' });
    return;
  }

  try {
    const { login_user_login, login_user_name, perfis } = req.body;

    const usuarioExistente = await prisma.tb_login_user.findUnique({
      where: { login_user_login },
    });

    if (usuarioExistente) {
      res.status(400).json({ error: 'Usuário já existe.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(login_user_login, SALT_ROUNDS);

    await prisma.$transaction(async (prisma) => {
      // Criação do usuário
      await prisma.tb_login_user.create({
        data: {
          login_user_login,
          login_user_name,
          login_user_password: hashedPassword,
        },
      });

      for (const perfilData of perfis) {
        // Remover duplicatas no payload
        const perfisUnicos: PerfilUnico[] = perfilData.filial.reduce(
          (acc: PerfilUnico[], filialData: FilialData) => {
            const codigoFilial = Number(filialData.codigo_filial);

            const existe = acc.find(
              (item) =>
                item.perfil_name === perfilData.perfil_name &&
                item.codigo_filial === codigoFilial,
            );

            if (!existe) {
              acc.push({
                perfil_name: perfilData.perfil_name,
                codigo_filial: codigoFilial,
                nome_filial: filialData.nome_filial,
                funcoes: perfilData.funcoes,
              });
            }

            return acc;
          },
          [],
        );

        for (const filialData of perfisUnicos) {
          const { perfil_name, codigo_filial, nome_filial, funcoes } =
            filialData;

          // Verificar se já existe um perfil para o usuário na filial
          const perfilExistenteNaFilial = await prisma.tb_user_perfil.findFirst(
            {
              where: {
                user_login_id: login_user_login,
                codigo_filial: codigo_filial,
              },
            },
          );

          if (perfilExistenteNaFilial) {
            console.warn(
              `Usuário ${login_user_login} já possui um perfil cadastrado na filial ${codigo_filial}. Não é permitido múltiplos perfis na mesma filial.`,
            );
            throw new Error(
              `Usuário já possui um perfil na filial ${codigo_filial}. Não é permitido múltiplos perfis na mesma filial.`,
            );
          }

          // Criar entrada em `tb_user_perfil`
          await prisma.tb_user_perfil.create({
            data: {
              user_login_id: login_user_login,
              perfil_name: perfil_name,
              codigo_filial: codigo_filial,
              nome_filial: nome_filial,
            },
          });

          // Verificar se a filial já está registrada em `tb_login_filiais`
          const filialExistente = await prisma.tb_login_filiais.findUnique({
            where: {
              login_user_login_codigo_filial: {
                login_user_login,
                codigo_filial: codigo_filial,
              },
            },
          });

          if (!filialExistente) {
            await prisma.tb_login_filiais.create({
              data: {
                login_user_login,
                codigo_filial: codigo_filial,
                nome_filial: nome_filial,
              },
            });
          }

          // ✅ Salvar funções em `tb_login_access_user`
          for (const funcao of funcoes) {
            const acessoExistente =
              await prisma.tb_login_access_user.findUnique({
                where: {
                  id_functions_login_user_login: {
                    id_functions: funcao.id_functions,
                    login_user_login,
                  },
                },
              });

            if (!acessoExistente) {
              await prisma.tb_login_access_user.create({
                data: {
                  id_functions: funcao.id_functions,
                  login_user_login,
                  login_perfil_name: perfil_name,
                },
              });
            }
          }
        }
      }
    });

    res.status(201).json({ message: 'Usuário criado com sucesso.' });
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: `Erro ao criar usuário: ${error.message}` });
  } finally {
    await prisma.$disconnect();
  }
}
