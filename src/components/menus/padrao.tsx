import React from 'react';
import Padrao from '@/components/template/layout/padrao';
import Carregamento from '@/utils/carregamento';
import {
  LayoutDashboardIcon,
  DiamondPlusIcon,
  ShoppingBag,
  FileClock,
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
  Monitor,
  UserCheckIcon,
  WalletIcon,
  WarehouseIcon,
  Plus,
  Receipt,
  LayoutDashboard,
} from 'lucide-react';
import { LiaFileInvoiceSolid } from 'react-icons/lia';
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
import Funcoes from '@/components/corpo/admin/controleAcesso/funcoes';
import Filiais from '@/components/corpo/admin/controleAcesso/filiais';
import Grupos from '@/components/corpo/admin/controleAcesso/perfis';
import Telas from '@/components/corpo/admin/controleAcesso/telas';
import Usuarios from '@/components/corpo/admin/controleAcesso/usuarios';
import HistoricoNF from '@/components/corpo/faturamento/historicoNF';
import NovoFaturamento from '@/components/corpo/faturamento/novoFaturamento';
import RequisicoesCompra from '@/components/corpo/comprador/RequisicoesCompra/';
import HistoricoCompra from '@/components/corpo/comprador/historicoCompra';
import NovaCompra from '@/components/corpo/comprador/novaCompra';

const menus = [
  {
    titulo: '',
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
        ],
      },
      {
        name: 'Acessos',
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
            name: 'Perfis',
            icon: BoxesIcon,
            href: '/admin/controleAcesso/perfis',
            corpo: Grupos,
          },
          {
            name: 'Telas',
            icon: Monitor,
            href: '/admin/controleAcesso/telas',
            corpo: Telas,
          },
          {
            name: 'Funções',
            icon: ShieldIcon,
            href: '/admin/controleAcesso/funcoes',
            corpo: Funcoes,
          },

          {
            name: 'Usuários',
            icon: UserCheckIcon,
            href: '/admin/controleAcesso/usuarios',
            corpo: Usuarios,
          },
        ],
      },
      {
        name: 'Faturamento',
        icon: Receipt,
        href: '',
        corpo: '',
        subItems: [
          {
            name: 'Novo Faturamento',
            href: '/faturamento/novoFaturamento',
            icon: Plus,
            corpo: NovoFaturamento,
          },
          {
            name: 'Histórico de NF',
            href: '/faturamento/historicoNF',
            icon: LiaFileInvoiceSolid,
            corpo: HistoricoNF,
          },
        ],
      },
      {
        name: 'Compras',
        icon: ShoppingBag,
        href: '',
        corpo: '',
        subItems: [
          {
            name: 'Requisições de Compra',
            href: '/compras/requisicoes-compra',
            icon: LayoutDashboard,
            corpo: RequisicoesCompra,
          },
          {
            name: 'Histórico de Compras',
            href: '/comprador/historicoCompra',
            icon: FileClock,
            corpo: HistoricoCompra,
          },
          {
            name: 'Nova Compra',
            href: '/comprador/novaCompra',
            icon: Plus,
            corpo: NovaCompra,
          },
        ],
      },
    ],
  },
];

interface PageSidebarProps {
  tela: string; // ou o tipo que você espera para 'tela'
  permissoes: string[] | undefined; // um array de strings para as permissões do usuário
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
  return Carregamento;
}

const PageSidebar: React.FC<PageSidebarProps> = ({ tela, permissoes }) => {
  const [telaMudou, setTelaMudou] = React.useState(tela);
  //console.log('Permissões do usuário:', permissoes);
  const handleTelaMudou = (newTela: string) => {
    setTelaMudou(newTela);
  };
  const [valorF, setValorF] = React.useState<any[]>([]);
  const corpoAtual = encontrarCorpoPorTela(tela, valorF);

  React.useEffect(() => {
    const permissoesAtualizadas = [
      ...(permissoes ?? []),
      '/compras/dashBoard',
      '/comprador/historicoCompra',
      '/comprador/novaCompra',
      '/compras/requisicoes-compra',
    ];
    const novoValorF = menus.map((menu) => ({
      ...menu,
      items: menu.items
        .map((item) => {
          const novoItem = { ...item };

          // Verifica se o item principal está nas permissões
          if ((permissoesAtualizadas ?? []).includes(novoItem.href)) {
            // Filtra subItems, se existirem
            if (novoItem.subItems && novoItem.subItems.length > 0) {
              novoItem.subItems = novoItem.subItems.filter((subItem) =>
                (permissoesAtualizadas ?? []).includes(subItem.href),
              );
            }
            return novoItem;
          }

          // Verifica os subItems se o item principal não está nas permissões
          if (novoItem.subItems && novoItem.subItems.length > 0) {
            const novosSubItems = novoItem.subItems.filter((subItem) =>
              (permissoesAtualizadas ?? []).includes(subItem.href),
            );

            if (novosSubItems.length > 0) {
              return { ...novoItem, subItems: novosSubItems };
            }
          }

          return null; // Remove itens não permitidos
        })
        .filter(Boolean), // Remove itens nulos
    }));

    setValorF(novoValorF);
  }, [permissoes, tela]);

  // ... restante do seu código ...

  return (
    <div className="flex w-full    flex-col bg-muted/40">
      {/* inicio da tela desktop */}
      <Padrao
        setTelaMudou={handleTelaMudou}
        menus={valorF} // Agora passamos `valorF` em vez de `menus`
        tela={tela}
        Corpo={telaMudou === tela ? corpoAtual : Carregamento}
      />
    </div>
  );
};
export default PageSidebar;
