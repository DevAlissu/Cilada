import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ExitIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';
import { AuthContext } from '@/contexts/authContexts';
import { destroyCookie, setCookie } from 'nookies'; // 👈 aqui adicionamos o setCookie
import { useTheme } from 'next-themes';
import Carregamento from '@/utils/carregamento';
import { prisma } from '@/lib/prisma';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

type Filial = {
  nome_filial: string;
  codigo_filial: string;
  login_user_login: string;
};

function App({ filiais }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { filialSet, ultimaPagina } = useContext(AuthContext);
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const { perfilName } = router.query;
  const [urlLogo, setUrlLogo] = useState('');
  const [newPerfil, setNewPerfil] = useState(perfilName);
  const [perfil, setPerfil] = useState<{ filial: string }>({ filial: '' });
  const [filialList, setFilialList] = useState<Filial[]>([]);
  const [prosseguir, setProsseguir] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const url =
      resolvedTheme === 'dark'
        ? '/images/logo1Branco.webp'
        : '/images/logo1.webp';
    setUrlLogo(url);
  }, [resolvedTheme]);

  useEffect(() => {
    if (perfilName) {
      setNewPerfil(perfilName);
      sessionStorage.setItem('newPerfilMelo', JSON.stringify(perfilName));
    } else {
      const storedPerfil = sessionStorage.getItem('newPerfilMelo');

      if (storedPerfil) {
        setNewPerfil(JSON.parse(storedPerfil));
      } else {
        destroyCookie(null, 'filial_melo', { path: '/' });
        router.replace('/login');
      }
    }
  }, [perfilName, router]);

  useEffect(() => {
    if (filiais && newPerfil) {
      const filtradas = filiais.filter(
        (f: Filial) => f.login_user_login === newPerfil,
      );
      setFilialList(filtradas);
      if (filtradas.length === 1) {
        setPerfil({ filial: filtradas[0].nome_filial });
        setCookie(null, 'filial_melo', filtradas[0].nome_filial, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    }
  }, [filiais, newPerfil]);

  useEffect(() => {
    if (perfil.filial) {
      setProsseguir(true);
    }
  }, [perfil]);

  useEffect(() => {
    if (
      prosseguir &&
      ultimaPagina &&
      ultimaPagina !== '' &&
      router.asPath !== ultimaPagina &&
      ultimaPagina !== '/filial'
    ) {
      filialSet(perfil);
      router.replace(ultimaPagina);
      setProsseguir(false);
    }
  }, [prosseguir, filialSet, perfil, router, ultimaPagina]);

  return (
    <main className="bg-[#F6F7F9] h-screen flex flex-col justify-center">
      <div className="h-1/2 bg-[#347ab6] dark:bg-blue-900" />
      <div className="h-1/2 flex justify-center bg-[#F6F7F9] dark:bg-slate-400">
        <div className="mt-[-225px] bg-white dark:bg-slate-900 rounded-2xl flex w-4/5 lg:w-3/5 h-[140%] px-6 py-6 justify-center">
          {/* Logo + sair */}
          <div className="hidden md:flex w-1/2 flex-col justify-between">
            <div className="text-lg font-bold">Bem Vindo</div>
            <img className="w-[60%]" src={urlLogo} alt="Logo" />
            <div
              className="flex items-center cursor-pointer"
              onClick={() => router.push('/logout')}
            >
              <IconButton
                variant="ghost"
                className="text-blue-900 dark:text-white"
              >
                <ExitIcon className="w-6 h-6" />
              </IconButton>
              <span className="ml-2 font-bold">Sair</span>
            </div>
          </div>

          {/* Lista de filiais */}
          <div className="text-blue-900 dark:text-white flex flex-col items-center justify-center w-full md:w-1/2 bg-[#fafaf0] dark:bg-slate-700 border-2 rounded-3xl">
            <img
              className="md:hidden w-[40%] mb-10"
              src={urlLogo}
              alt="Logo Mobile"
            />
            {filialList.length > 1 && !carregando ? (
              <h2 className="text-lg font-bold">ESCOLHA UMA FILIAL</h2>
            ) : null}

            {filialList.length > 1 && !carregando ? (
              <div
                className={`mt-5 w-[100%]  h-[80%] ${
                  filialList.length > 3 ? 'overflow-y-scroll' : ''
                }`}
              >
                {filialList.map((val, idx) => (
                  <div key={idx} className="flex justify-center my-2">
                    <div
                      className="w-[90%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-zinc-400 rounded-lg shadow-sm p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => {
                        setCarregando(true);
                        filialSet({ filial: val.nome_filial }).then(() => {
                          setPerfil({ filial: val.nome_filial });
                        });
                      }}
                    >
                      <div className="flex items-center">
                        <div className="mr-4 w-12 h-12 bg-gray-300 dark:bg-zinc-500 rounded-full flex items-center justify-center font-bold">
                          {val.codigo_filial}
                        </div>
                        <div className="text-slate-800 dark:text-white">
                          {val.nome_filial}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full">
                <Carregamento texto="Encontrando Filiais..." />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// Geração estática com Prisma
export const getStaticProps: GetStaticProps = async () => {
  const filiais = await prisma.tb_login_filiais.findMany().finally(async () => {
    await prisma.$disconnect();
  });

  return {
    props: {
      filiais: JSON.parse(JSON.stringify(filiais)),
    },
    revalidate: 15,
  };
};

export default App;
