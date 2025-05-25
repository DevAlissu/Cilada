import React from 'react';
import Admin from '@/components/menus/admin';
import withAuth from '@/utils/withAuth';

const Page = () => {
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', '/admin/cadastros/vendedores');
  }

  return <Admin tela={'/admin/cadastros/vendedores'} />;
};

export default withAuth(Page, ['ADMINISTRAÇÃO']);
