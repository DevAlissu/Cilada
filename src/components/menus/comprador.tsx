// src/components/menus/comprador.tsx
import React from 'react';
import {
  Plus,
  HomeIcon,
  Info,
  Settings,
  LayoutDashboardIcon,
} from 'lucide-react';
import { LiaFileInvoiceSolid } from 'react-icons/lia';

export type SubMenuItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export type MenuItem = {
  name: string;
  href?: string;
  icon?: React.ElementType;
  subItems?: SubMenuItem[];
};

export type MenuSection = {
  titulo: string;
  items: MenuItem[];
};

export const menus: MenuSection[] = [
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
        name: 'Histórico de Compra',
        href: '/compras/historicoCompra',
        icon: LiaFileInvoiceSolid,
        subItems: [],
      },
      {
        name: 'Requisições de Compra',
        href: '/compras/requisicoes-compra',
        icon: LayoutDashboardIcon,
        subItems: [],
      },
    ],
  },
  {
    titulo: 'Configurações',
    items: [
      {
        name: 'Opções',
        href: '',
        icon: Settings,
        subItems: [
          {
            name: 'Perfil',
            href: '/compras/configuracoes/profile',
            icon: Info,
          },
          {
            name: 'Segurança',
            href: '/compras/configuracoes/security',
            icon: HomeIcon,
          },
        ],
      },
    ],
  },
];
