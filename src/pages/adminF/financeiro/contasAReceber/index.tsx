//import Home from '@/components/home';
import React from 'react';
import Admin from '@/components/menus/admin';
import withAuth from '@/utils/withAuth';

const Page = () => {
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', '/admin/financeiro/contasAReceber');
  }

  return <Admin tela={'/admin/financeiro/contasAReceber'} />;
};

export default withAuth(Page, ['ADMINISTRAÇÃO']);
