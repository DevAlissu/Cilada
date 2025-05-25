//import Home from '@/components/home';
import React from 'react';
import Admin from '@/components/menus/admin';
import withAuth from '@/utils/withAuth';

const Page = () => {
  if (typeof window !== 'undefined') {
    window.history.replaceState(
      null,
      '',
      '/admin/configuracoes/funcoesUsuarios',
    );
  }

  return <Admin tela={'/admin/configuracoes/funcoesUsuarios'} />;
};

export default withAuth(Page, ['ADMINISTRAÇÃO']);
