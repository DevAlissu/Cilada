import React from 'react';
import Padrao from '@/components/template/layout/padrao';
import Carregamento from '@/utils/carregamento';
import {
  LayoutDashboardIcon,
  DiamondPlusIcon,
  BadgeDollarSignIcon,
  BoxesIcon,
  Building2Icon,
  ChartLineIcon,
  CircleDollarSignIcon,
  CogIcon,
  GroupIcon,
  HandCoinsIcon,
  HandshakeIcon,
  HexagonIcon,
  LandmarkIcon,
  ListCheckIcon,
  LockIcon,
  ShieldIcon,
  ShoppingBasketIcon,
  SquareUserRoundIcon,
  UserCheckIcon,
  UserCogIcon,
  UserIcon,
  WalletIcon,
  WarehouseIcon,
} from 'lucide-react';
import DashBoard from '@/components/corpo/admin/dashBoard';
import Clientes from '@/components/corpo/admin/cadastro/clientes';
import Fornecedores from '@/components/corpo/admin/cadastro/fornecedores';
import Produtos from '@/components/corpo/admin/cadastro/produtos';
import Vendedores from '@/components/corpo/admin/cadastro/vendedores';
import Marcas from '@/components/corpo/admin/cadastro/marcas';
import GrupoDeProdutos from '@/components/corpo/admin/cadastro/grupoDeProdutos';
import Bancos from '@/components/corpo/admin/cadastro/bancos';
import Contas from '@/components/corpo/admin/cadastro/contas';
import ContasAPagar from '@/components/corpo/admin/financeiro/contasAPagar';
import ContasAReceber from '@/components/corpo/admin/financeiro/contasAReceber';
import Faturar from '@/components/corpo/admin/financeiro/faturar';
import Transferencia from '@/components/corpo/admin/financeiro/transferencia';
import Vendas from '@/components/corpo/admin/vendas';
import Estoque from '@/components/corpo/admin/estoque';
import Relatorios from '@/components/corpo/admin/relatorios';
import Parametros from '@/components/corpo/admin/configuracoes/parametros';
import Funcoes from '@/components/corpo/admin/configuracoes/funcoes';
import FuncoesUsuarios from '@/components/corpo/admin/configuracoes/funcoesUsuarios';
import Filiais from '@/components/corpo/admin/controleAcesso/filiais';
import Grupos from '@/components/corpo/admin/controleAcesso/perfis';
import Usuarios from '@/components/corpo/admin/controleAcesso/usuarios';
import UsuariosFilial from '@/components/corpo/admin/controleAcesso/usuariosFilial';
const menus = [
  {
    titulo: 'Administrativo',
    items: [
      {
        name: 'DashBoard',
        href: '/admin/dashBoard',
        icon: LayoutDashboardIcon,
        subItems: [],
        corpo: DashBoard,
      },
      {
        name: 'Cadastro',
        href: '',
        icon: DiamondPlusIcon,
        corpo: '',
        subItems: [
          {
            name: 'Clientes',
            href: '/admin/cadastros/clientes',
            icon: HandshakeIcon,
            corpo: Clientes,
          },
          {
            name: 'Fornecedores',
            href: '/admin/cadastros/fornecedores',
            icon: Building2Icon,
            corpo: Fornecedores,
          },
          {
            name: 'Produtos',
            href: '/admin/cadastros/produtos',
            icon: BoxesIcon,
            corpo: Produtos,
          },
          {
            name: 'Vendedores',
            href: '/admin/cadastros/vendedores',
            icon: SquareUserRoundIcon,
            corpo: Vendedores,
          },
          {
            name: 'Marcas',
            href: '/admin/cadastros/marcas',
            icon: HexagonIcon,
            corpo: Marcas,
          },
          {
            name: 'Grupo de produtos',
            href: '/admin/cadastros/grupoDeProdutos',
            icon: GroupIcon,
            corpo: GrupoDeProdutos,
          },
          {
            name: 'Bancos',
            href: '/admin/cadastros/bancos',
            icon: LandmarkIcon,
            corpo: Bancos,
          },
          {
            name: 'Contas',
            href: '/admin/cadastros/contas',
            icon: HandCoinsIcon,
            corpo: Contas,
          },
        ],
      },
      {
        name: 'Financeiro',
        href: '',
        icon: BadgeDollarSignIcon,
        corpo: '',
        subItems: [
          {
            name: 'Contas a Pagar',
            href: '/admin/financeiro/contasAPagar',
            icon: LandmarkIcon,
            corpo: ContasAPagar,
          },
          {
            name: 'Contas a Receber',
            href: '/admin/financeiro/contasAReceber',
            icon: HandCoinsIcon,
            corpo: ContasAReceber,
          },
          {
            name: 'Faturar',
            href: '/admin/financeiro/faturar',
            icon: CircleDollarSignIcon,
            corpo: Faturar,
          },
          {
            name: 'Transferência',
            href: '/admin/financeiro/transferencia',
            icon: WalletIcon,
            corpo: Transferencia,
          },
        ],
      },
      {
        name: 'Vendas',
        icon: HandCoinsIcon,
        href: '/admin/vendas',
        corpo: Vendas,
      },
      {
        name: 'Estoque',
        icon: WarehouseIcon,
        href: '/admin/estoque',
        corpo: Estoque,
      },
      {
        name: 'Relatórios',
        icon: ChartLineIcon,
        href: '/admin/relatorios',
        corpo: Relatorios,
      },
      {
        name: 'Configurações',
        icon: CogIcon,
        href: '',
        corpo: '',
        subItems: [
          {
            name: 'Parâmetros',
            icon: ListCheckIcon,
            href: '/admin/configuracoes/parametros',
            corpo: Parametros,
          },
          {
            name: 'Vendas',
            icon: ShoppingBasketIcon,
            href: '/admin/configuracoes/vendas',
            corpo: Vendas,
          },
          {
            name: 'Funções',
            icon: ShieldIcon,
            href: '/admin/configuracoes/funcoes',
            corpo: Funcoes,
          },
          {
            name: 'Funções de Usuários',
            icon: UserCogIcon,
            href: '/admin/configuracoes/funcoesUsuarios',
            corpo: FuncoesUsuarios,
          },
        ],
      },
      {
        name: 'Controle de Acesso',
        icon: LockIcon,
        href: '',
        corpo: '',
        subItems: [
          {
            name: 'Filiais',
            icon: Building2Icon,
            href: '/admin/controleAcesso/filiais',
            corpo: Filiais,
          },
          {
            name: 'Grupos',
            icon: BoxesIcon,
            href: '/admin/controleAcesso/grupos',
            corpo: Grupos,
          },
          {
            name: 'Usuários',
            icon: UserIcon,
            href: '/admin/controleAcesso/usuarios',
            corpo: Usuarios,
          },
          {
            name: 'Usuários Filial',
            icon: UserCheckIcon,
            href: '/admin/controleAcesso/usuariosFilial',
            corpo: UsuariosFilial,
          },
        ],
      },
    ],
  },
];

interface PageSidebarProps {
  tela: string; // ou o tipo que você espera para 'tela'
}

function encontrarCorpoPorTela(
  tela: string,
  menus: any[],
): React.ComponentType | typeof Carregamento {
  for (const menu of menus) {
    for (const item of menu.items) {
      if (item.href && item.href === tela) {
        return item.corpo;
      }
      if (item.subItems?.length > 0) {
        for (const subItem of item.subItems) {
          if (subItem.href && subItem.href === tela) {
            return subItem.corpo;
          }
        }
      }
    }
  }
  return Carregamento; // << retorna componente, não string!
}

const PageSidebar: React.FC<PageSidebarProps> = ({ tela }) => {
  const [telaMudou, setTelaMudou] = React.useState(tela);

  const handleTelaMudou = (newTela: string) => {
    setTelaMudou(newTela);
  };

  const corpoAtual = encontrarCorpoPorTela(tela, menus);

  return (
    <div className="flex w-full    flex-col bg-muted/40">
      {/* inicio da tela desktop */}

      <Padrao
        setTelaMudou={handleTelaMudou}
        menus={menus}
        tela={tela}
        Corpo={telaMudou === tela ? corpoAtual : Carregamento}
      />
    </div>
  );
};
export default PageSidebar;
