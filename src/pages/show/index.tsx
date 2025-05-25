import React, { useEffect, useState } from 'react';
import Header from './Header';
import { getPedidos, Pedidos } from '@/data/pedidos/pedidos';

export default function Show() {
  const [pedidos, setPedidos] = useState<Pedidos>({} as Pedidos);

  const handlePedidos = async () => {
    const response = await getPedidos({ page: 1, perPage: 999, search: '' });
    setPedidos(response);
  };

  useEffect(() => {
    handlePedidos(); // chamada inicial
    const interval = setInterval(() => handlePedidos(), 30000); // atualiza a cada 30s
    return () => clearInterval(interval); // limpa no unmount
  }, []);

  const setColor = (status: string | undefined) => {
    switch (status) {
      case 'N':
        return {
          text: 'Pendente Separação',
          className: 'bg-yellow-300 text-yellow-800',
        };
      case 'M':
        return {
          text: 'Pendente Conferência',
          className: 'bg-yellow-300 text-yellow-800',
        };
      case 'S':
        return { text: 'Em Separação', className: 'bg-blue-300 text-blue-800' };
      case 'C':
        return {
          text: 'Em Conferência',
          className: 'bg-green-300 text-green-800',
        };
      default:
        return {
          text: status ?? 'Desconhecido',
          className: 'bg-red-300 text-red-800',
        };
    }
  };

  const calcularDiferencaMinutos = (dataPedido: Date): number => {
    const diffInMs = Math.abs(new Date().getTime() - dataPedido.getTime());
    return Math.floor(diffInMs / 60000);
  };

  const rows = pedidos.data?.map((pedido) => {
    const data = pedido.data ? new Date(pedido.data) : null;
    const openedAt = data
      ? `${calcularDiferencaMinutos(data)} min`
      : 'Data não disponível';
    const createdAt = data ? data.toLocaleString() : 'Data não disponível';

    return {
      id: pedido.codvenda,
      createdAt,
      openedAt,
      clientName: pedido.cliente?.nome ?? 'Sem nome',
      status: setColor(pedido.status),
    };
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Pedidos" hasTime />
      <table className="w-full table-auto text-center border-collapse bg-white text-black">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-4 border">Nº Pedido</th>
            <th className="p-4 border">Cliente</th>
            <th className="p-4 border">Data Pedido</th>
            <th className="p-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((pedido) => (
            <tr key={pedido.id} className="hover:bg-gray-200">
              <td className="p-4 border">{pedido.id}</td>
              <td className="p-4 border">{pedido.clientName}</td>
              <td className="p-4 border">{pedido.createdAt}</td>
              <td className={`p-4 border font-bold ${pedido.status.className}`}>
                {pedido.status.text}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
