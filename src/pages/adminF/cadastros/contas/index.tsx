import React from 'react';
import Admin from '@/components/menus/admin';
import withAuth from '@/utils/withAuth';

const Page = () => {
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', '/admin/cadastros/contas');
  }

  return <Admin tela={'/admin/cadastros/contas'} />;
};

export default withAuth(Page, ['ADMINISTRAÇÃO']);
