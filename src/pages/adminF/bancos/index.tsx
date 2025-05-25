import React from 'react';
import Admin from '@/components/menus/admin';
import withAuth from '@/utils/withAuth';
const Page = () => {
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', '/admin/bancos');
  }

  return <Admin tela={'/admin/bancos'} />;
};

export default withAuth(Page, ['ADMINISTRAÇÃO']);
