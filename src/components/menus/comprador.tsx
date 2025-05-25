import React from 'react';
import Padrao from '@/components/template/layout/padrao';
import { LiaFileInvoiceSolid } from 'react-icons/lia';
import {
  Plus,
  HomeIcon,
  Info,
  Settings,
  LayoutDashboardIcon,
} from 'lucide-react';
import HistoricoCompra from '@/components/corpo/comprador/historicoCompra';
import NovaCompra from '@/components/corpo/comprador/novaCompra';
import DashBoard from '@/components/corpo/comprador/DashBoard';
const menus = [
  {
    titulo: 'DashBoard',
    items: [
      {
        name: 'DashBoard',
        href: '/compras/dashBoard',
        icon: LayoutDashboardIcon,
        subItems: [],
      },
    ],
  },
  {
    titulo: 'Compras',
    items: [
      {
        name: 'Nova Compra',
        href: '/compras/novaCompra',
        icon: Plus,
        subItems: [],
      },
      {
        name: 'historico de Compra',
        href: '/compras/historicoCompra',
        icon: LiaFileInvoiceSolid,
        subItems: [],
      },
    ],
  },
  {
    titulo: 'Configurações',
    items: [
      {
        name: 'Opções',
        icon: Settings,
        href: '',
        subItems: [
          {
            name: 'Perfil',
            href: '/compras/configuracoes/profile',
            icon: Info,
          },
          {
            name: 'Segurança',
            href: '/configuracoes/security',
            icon: HomeIcon,
          },
        ],
      },
    ],
  },
];
interface PageSidebarProps {
  tela: string; // ou o tipo que você espera para 'tela'
}
const PageSidebar: React.FC<PageSidebarProps> = ({ tela }) => {
  return (
    <div className="flex w-full    flex-col bg-muted/40">
      {/* inicio da tela desktop */}
      <aside
        className="fixed insert-y-0  bg-gray-400  left-0 z-10  h-full w-full 
                   flex "
      >
        {tela === 'historicoCompra' ? (
          <Padrao menus={menus} tela={tela} Corpo={HistoricoCompra} />
        ) : null}
        {tela === 'novaCompra' ? (
          <Padrao menus={menus} tela={tela} Corpo={NovaCompra} />
        ) : null}
        {tela === 'dashBoard' ? (
          <Padrao menus={menus} tela={tela} Corpo={DashBoard} />
        ) : null}
      </aside>
    </div>
  );
};
export default PageSidebar;
