//import Home from '@/components/home';
import React from 'react';
import Admin from '@/components/menus/admin';
import withAuth from '@/utils/withAuth';

const Page = () => {
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', '/admin/configuracoes/vendas');
  }

  return <Admin tela={'/admin/configuracoes/vendas'} />;
};

export default withAuth(Page, ['ADMINISTRAÇÃO']);
