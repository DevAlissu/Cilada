import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { PerfilAtualizacao } from '@/data/perfis/perfis';
import { serializeBigInt } from '@/utils/serializeBigInt';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const data: PerfilAtualizacao = req.body;

  try {
    // 1. Criar o Perfil
    const perfil = await prisma.tb_login_perfil.create({
      data: {
        login_perfil_name: data.login_perfil_name,
      },
    });

    // 2. Processar Telas e Permissões (tb_grupo_Permissao)
    const permissoesGrupos = data.grupos[0].telas.map((tela) => ({
      editar: tela.permissoes.editar,
      cadastrar: tela.permissoes.cadastrar,
      remover: tela.permissoes.remover,
      exportar: tela.permissoes.exportar,
      grupoId: data.login_perfil_name, // Usamos login_perfil_name como grupoId
      tela: tela.tela.value,
    }));

    await prisma.tb_grupo_Permissao.createMany({
      data: permissoesGrupos,
    });

    // 3. Processar Funções (tb_login_access_perfil)
    const funcoesPerfis = data.grupos[0].funcoes.map((funcao) => ({
      id_functions: BigInt(funcao.value), // Convertendo para BigInt
      login_perfil_name: data.login_perfil_name,
    }));

    await prisma.tb_login_access_perfil.createMany({
      data: funcoesPerfis,
    });

    res
      .status(201)
      .setHeader('Content-Type', 'application/json')
      .json(
        serializeBigInt({
          data: {
            ...perfil,
            telas: permissoesGrupos,
            funcoes: funcoesPerfis,
          },
        }),
      );
  } catch (error: any) {
    console.error('Erro ao criar perfil:', error);
    res
      .status(500)
      .json({ error: 'Erro ao criar perfil. Detalhes: ' + error.message });
  } finally {
    await prisma.$disconnect();
  }
}
