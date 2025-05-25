import React from 'react';
import Admin from '@/components/menus/admin';
import withAuth from '@/utils/withAuth';

const Page = () => {
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', '/admin/cadastros/produtos');
  }

  return <Admin tela={'/admin/cadastros/produtos'} />;
};

export default withAuth(Page, ['ADMINISTRAÇÃO']);
