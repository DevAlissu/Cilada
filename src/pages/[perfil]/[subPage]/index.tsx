import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext, Permissao } from '@/contexts/authContexts';
import MenuPadrao from '@/components/menus/padrao';
import Carregamento from '@/utils/carregamento';

const Page = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [permissaoAtual, setPermissaoAtual] = useState<Permissao | null>(null);
  const [permissoesPaths, setPermissoesPaths] = useState<string[]>([]);

  const { subPage, perfil } = router.query;

  useEffect(() => {
    if (!router.isReady || !user?.permissoes) return;
    if (typeof subPage !== 'string') return;

    const telaAtual = `/${perfil}/${subPage}`;

    const permissaoEncontrada = user.permissoes.find(
      (p) => p.tb_telas?.PATH_TELA === telaAtual,
    );

    if (!permissaoEncontrada) {
      router.replace('/naoAutorizado');
      return;
    }

    setPermissaoAtual(permissaoEncontrada);

    const pathsPermitidos = user.permissoes
      .map((p) => p.tb_telas?.PATH_TELA)
      .filter((p): p is string => !!p);

    setPermissoesPaths(pathsPermitidos);

    if (
      typeof window !== 'undefined' &&
      window.location.pathname !== telaAtual
    ) {
      window.history.replaceState(null, '', telaAtual);
    }

    setDadosCarregados(true);
  }, [router.isReady, subPage, user, router, perfil]);

  if (!dadosCarregados || !permissaoAtual) {
    return (
      <div className="h-screen">
        <Carregamento texto="Aguarde..." />
      </div>
    );
  }

  return (
    <MenuPadrao
      tela={permissaoAtual.tb_telas?.PATH_TELA}
      permissoes={permissoesPaths}
    />
  );
};

export default Page;
