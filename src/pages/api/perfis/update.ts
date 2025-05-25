import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { PerfilAtualizacao } from '@/data/perfis/perfis';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const data: PerfilAtualizacao = req.body;
  const { login_perfil_name, grupos } = data;

  if (!login_perfil_name || !grupos || grupos.length === 0) {
    return res.status(400).json({ error: 'Dados do perfil incompletos.' });
  }

  const grupo = grupos[0]; // Assumindo que sempre haverá um único grupo na edição

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Atualizar o nome do perfil
      await tx.tb_login_perfil.update({
        where: { login_perfil_name: login_perfil_name },
        data: { login_perfil_name: login_perfil_name }, // Mantém o mesmo nome (pode ser alterado se necessário)
      });

      // 2. Remover as permissões de tela existentes
      await tx.tb_grupo_Permissao.deleteMany({
        where: { grupoId: login_perfil_name },
      });

      // 3. Inserir as novas permissões de tela
      const telasParaInserir = grupo.telas.map((tela) => ({
        grupoId: login_perfil_name,
        tela: tela.tela.value,
        cadastrar: tela.permissoes.cadastrar,
        editar: tela.permissoes.editar,
        remover: tela.permissoes.remover,
        exportar: tela.permissoes.exportar,
      }));

      await tx.tb_grupo_Permissao.createMany({
        data: telasParaInserir,
      });

      // 4. Remover as funções de acesso existentes
      await tx.tb_login_access_perfil.deleteMany({
        where: { login_perfil_name: login_perfil_name },
      });

      // 5. Inserir as novas funções de acesso
      const funcoesParaInserir = grupo.funcoes.map((funcao) => ({
        login_perfil_name: login_perfil_name,
        id_functions: funcao.value,
      }));
      await tx.tb_login_access_perfil.createMany({
        data: funcoesParaInserir,
      });
    });

    res.status(200).json({ message: 'Perfil atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  } finally {
    await prisma.$disconnect();
  }
}
