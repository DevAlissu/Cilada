import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../../public/images/logo1Branco.webp';
import logo2 from '../../../../public/images/logo2Branco.webp';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SubMenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface MenuItem {
  name: string;
  href?: string;
  icon?: React.ElementType;
  subItems?: SubMenuItem[];
}

export interface MenuSection {
  titulo: string;
  items: MenuItem[];
}

interface MenuProps {
  menus: MenuSection[];
  ampliar?: boolean;
  setTelaMudou?: (arg0: string) => void;
  exibirLogo?: boolean;
  tela: string;
  readonly handleAmpliar: (arg0: boolean) => void;
}

const NavBar = ({
  menus = [],
  ampliar = false,
  setTelaMudou,
  exibirLogo,
  tela,
  handleAmpliar,
}: MenuProps) => {
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('open_submenus');
        return saved ? JSON.parse(saved) : {};
      }
      return {};
    },
  );

  const [ampliar2, setAmpliar2] = useState(ampliar);

  useEffect(() => {
    setAmpliar2(ampliar);
  }, [ampliar]);

  useEffect(() => {
    localStorage.setItem('open_submenus', JSON.stringify(openSubMenus));
  }, [openSubMenus]);

  useEffect(() => {
    if (!ampliar2) {
      setOpenSubMenus({});
      localStorage.removeItem('open_submenus');
    }
  }, [ampliar2]);

  const isItemActive = (item: MenuItem): boolean => {
    if (item.href && tela === item.href) return true;
    return item.subItems?.some((sub) => tela === sub.href) ?? false;
  };

  const handleClickItem = (item: MenuItem) => {
    if (!item.href && item.subItems) {
      if (!ampliar2) {
        setAmpliar2(true);
        handleAmpliar(true);
      }
      setOpenSubMenus((prev) => ({
        ...prev,
        [item.name]: !prev[item.name],
      }));
    } else if (item.href) {
      setTelaMudou?.(item.href);
    }
  };

  return (
    <nav className="flex flex-col bg-gray-100 dark:bg-slate-900 items-center gap-0 h-screen overflow-hidden">
      <TooltipProvider>
        <div
          className={`flex flex-col justify-start items-center bg-background ${
            ampliar2 ? 'w-56' : 'w-12'
          } duration-300 h-full`}
        >
          {exibirLogo && (
            <div className="border-b border-gray-300 bg-[#347AB6] dark:bg-blue-900 flex justify-center items-center w-full h-20 flex-shrink-0">
              <Link
                href="#"
                prefetch={false}
                className="flex h-full w-full justify-center items-center"
              >
                <div
                  style={{
                    position: 'relative',
                    width: ampliar2 ? 120 : 40,
                    height: ampliar2 ? 50 : 40,
                  }}
                  className="flex w-[60%] h-full transition duration-1000 justify-center items-center"
                >
                  <Image
                    src={ampliar2 ? logo : logo2}
                    alt="Logo"
                    fill
                    sizes="(max-width: 768px) 40px, 120px" // isso diz: "se a tela for menor que 768px, use 40px, senão 120px"
                    style={{ objectFit: 'contain' }}
                  />
                  <span className="sr-only">Logo do projeto</span>
                </div>
              </Link>
            </div>
          )}

          <div className="flex-1 overflow-y-auto overflow-x-hidden w-full pb-24">
            {menus.map((menuSection, index) => (
              <div key={index} className="w-full">
                <div className="w-full flex flex-col items-start border-b border-dashed border-gray-400">
                  {menuSection.items.map((item) => {
                    const ativo = isItemActive(item);

                    return (
                      <div key={item.name} className="w-full">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex w-full">
                              <div
                                className={`w-full flex ${
                                  ampliar2
                                    ? 'justify-start pl-4'
                                    : 'justify-center'
                                }`}
                              >
                                <Link
                                  href={item.href || '#'}
                                  onClick={(e) => {
                                    if (!item.href || item.subItems?.length) {
                                      e.preventDefault();
                                    }
                                    //  e.preventDefault();
                                    handleClickItem(item);
                                  }}
                                  className={`flex ${
                                    ampliar2 ? 'w-full' : 'w-auto'
                                  } items-center px-4 py-2 rounded-md transition-colors ${
                                    ativo
                                      ? 'text-[#347AB6] dark:text-cyan-300 font-bold'
                                      : 'text-black dark:text-slate-50 hover:text-orange-600 dark:hover:text-orange-400'
                                  }`}
                                >
                                  {item.icon && (
                                    <item.icon className="h-6 w-5 transition-all" />
                                  )}
                                  {ampliar2 && (
                                    <span className="w-28 ml-1 text-xs flex items-center">
                                      {item.subItems?.length ? (
                                        <div className="flex items-center">
                                          <div className="mr-2">
                                            {item.name}
                                          </div>
                                        </div>
                                      ) : (
                                        item.name
                                      )}
                                    </span>
                                  )}
                                  {ampliar2 && item.subItems?.length ? (
                                    <div>
                                      {openSubMenus[item.name] ? (
                                        <ChevronUp size={14} />
                                      ) : (
                                        <ChevronDown size={14} />
                                      )}
                                    </div>
                                  ) : null}
                                </Link>
                              </div>
                            </div>
                          </TooltipTrigger>

                          <TooltipContent
                            side="right"
                            className={`${
                              ampliar2 && 'hidden'
                            } text-white bg-[#347AB6]`}
                          >
                            {item.subItems?.length ? (
                              <div className="flex items-center">
                                <ChevronDown size={16} />
                              </div>
                            ) : (
                              item.name
                            )}
                          </TooltipContent>
                        </Tooltip>

                        {/* Submenus */}
                        {item.subItems && openSubMenus[item.name] && (
                          <div className="ml-6 mt-0 text-xs flex flex-col space-y-2">
                            {item.subItems.map((sub) => {
                              const subAtivo = tela === sub.href;
                              return (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  onClick={() => {
                                    setTelaMudou?.(sub.href);
                                  }}
                                  className={`flex items-center px-10 py-1 transition-colors ${
                                    subAtivo
                                      ? 'text-[#347AB6] dark:text-cyan-300 font-semibold'
                                      : 'text-black dark:text-slate-50 hover:text-orange-600 dark:hover:text-orange-300'
                                  }`}
                                >
                                  <sub.icon className="w-4 h-4 mr-2" />
                                  {sub.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </TooltipProvider>
    </nav>
  );
};

export default NavBar;
