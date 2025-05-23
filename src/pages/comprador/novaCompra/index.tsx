//import Home from '@/components/home';
import React from 'react';
import Faturamento from '@/components/menus/comprador';
import withAuth from '@/utils/withAuth';
//import Vendedor from '@/components/vendas/dashBoard';

const Page = () => {
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', '/compras/novaCompra');
  }

  return <Faturamento tela={'novaCompra'} />;
};

export default withAuth(Page, ['COMPRAS']);
