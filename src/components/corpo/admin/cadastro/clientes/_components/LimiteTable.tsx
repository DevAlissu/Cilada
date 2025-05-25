import React from 'react';
import { Limite } from '@/data/clientes/limites';

interface LimiteTableProps {
  limite?: Limite | null;
}

const LimiteTable: React.FC<LimiteTableProps> = ({ limite }) => {
  return (
    <div className="flex justify-center text-gray-700 dark:text-gray-200">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="text-gray-700 dark:text-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Ultimo Limite
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Observação
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700 dark:text-gray-200 divide-y divide-gray-200">
          {limite && limite.ultimo_limite ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                {limite.data
                  ? new Date(limite.data).toLocaleDateString('pt-BR')
                  : ''}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                R$ {limite.ultimo_limite?.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {limite.observacao}
              </td>
            </tr>
          ) : (
            <tr>
              <td
                className="px-6 py-4 whitespace-nowrap text-center"
                colSpan={3}
              >
                Cliente não tem limites cadastrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LimiteTable;
