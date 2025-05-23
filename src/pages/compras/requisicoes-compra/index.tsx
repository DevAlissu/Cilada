import React from 'react';
import Padrao from '@/components/template/layout/padrao';
import { menus } from '@/components/menus/comprador';
import RequisicoesCompra from '@/components/corpo/comprador/RequisicoesCompra';

export default function RequisicoesCompraPage() {
  return (
    <Padrao
      menus={menus}
      tela="/compras/requisicoes-compra"
      Corpo={RequisicoesCompra}
    />
  );
}
