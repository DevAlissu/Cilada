//import Home from '@/components/home';
import React from 'react';
import Admin from '@/components/menus/admin';
import withAuth from '@/utils/withAuth';

const Page = () => {
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', '/admin/financeiro/transferencia');
  }

  return <Admin tela={'/admin/financeiro/transferencia'} />;
};

export default withAuth(Page, ['ADMINISTRAÇÃO']);
