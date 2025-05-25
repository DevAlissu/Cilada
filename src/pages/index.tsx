import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '@/contexts/authContexts';
import { useRouter } from 'next/router';
import Carregamento from '@/utils/carregamento';
import Image from 'next/image';
import logo from '@/../public/images/logo1.webp';

const Page = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [telaHref, setTelaHref] = useState<string | null>(null);

  const jaRedirecionou = useRef(false);
  const usuarioFilialRef = useRef<string | null>(null);

  // Carrega tela armazenada no sessionStorage (apenas no client)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const armazenado = sessionStorage.getItem('telaAtualMelo');
    if (armazenado) {
      try {
        const parsed = JSON.parse(armazenado);
        if (typeof parsed === 'string') {
          setTelaHref(parsed);
        }
      } catch {
        setTelaHref(null);
      }
    }
  }, []);

  // Verifica se houve mudança no usuário ou filial
  useEffect(() => {
    if (user) {
      const identificadorAtual = `${user.usuario}-${user.filial}`;

      if (usuarioFilialRef.current !== identificadorAtual) {
        usuarioFilialRef.current = identificadorAtual;
        jaRedirecionou.current = false; // Permite um novo redirecionamento
      }
    }
  }, [user]);

  // Redireciona com base nas permissões e tela armazenada
  useEffect(() => {
    if (user && user.permissoes?.length && user.filial.length) {
      if (jaRedirecionou.current) {
        return;
      }

      const destinos = user.permissoes
        .map((permissao) => permissao.tb_telas?.PATH_TELA)
        .filter(Boolean);

      const destino =
        telaHref && telaHref !== 'inicio' ? telaHref : destinos[0];

      if (destino && router.pathname !== destino) {
        jaRedirecionou.current = true;
        router.push(destino);
      } else if (!destino) {
        setErro(
          'Erro ao carregar permissões. Por favor, entre em contato com o suporte.',
        );
      }
    }
  }, [user, telaHref, router]);

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100 dark:bg-zinc-900 text-center px-4">
        <div className="mb-6">
          <Image
            src={logo}
            alt="Logo Melo"
            width={150}
            height={150}
            priority
            className="mx-auto"
          />
        </div>
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          {erro}
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Tente atualizar a página ou entre em contato com o suporte.
        </p>
      </div>
    );
  }

  const texto = `CARREGANDO ${user?.perfil ?? ''}`;

  return (
    <div className="w-screen h-screen bg-zinc-100 dark:bg-zinc-600">
      <Carregamento texto={texto} />
    </div>
  );
};

export default Page;
