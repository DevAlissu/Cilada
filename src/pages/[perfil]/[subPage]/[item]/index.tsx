import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/authContexts';
import MenuPadrao from '@/components/menus/padrao';
import Carregamento from '@/utils/carregamento';
import type { Permissao } from '@/contexts/authContexts';

const Page = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [permissaoAtual, setPermissaoAtual] = useState<Permissao | null>(null);
  const [permissoesPaths, setPermissoesPaths] = useState<string[]>([]);

  const { subPage, item, perfil } = router.query;

  useEffect(() => {
    if (!router.isReady || !user?.permissoes) return;

    if (typeof subPage !== 'string' || typeof item !== 'string') return;

    const telaAtual = `/${perfil}/${subPage}/${item}`;

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
      .filter((p): p is string => !!p); // remove undefined e garante tipo

    setPermissoesPaths(pathsPermitidos);

    if (
      typeof window !== 'undefined' &&
      window.location.pathname !== telaAtual
    ) {
      window.history.replaceState(null, '', telaAtual);
    }

    setDadosCarregados(true);
  }, [router, subPage, item, user, perfil]);

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
      permissoes={permissoesPaths} // ✅ envia todos os paths autorizados
    />
  );
};

export default Page;
