import React from 'react';
import { Produto } from '@/data/produtos/produtos';

interface ReferenciaFabricaProps {
  produto: Produto;
  handleProdutoChange: (produto: Produto) => void;
  error?: { [p: string]: string };
}

const ReferenciaFabrica: React.FC<ReferenciaFabricaProps> = ({
  produto,
  handleProdutoChange,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleProdutoChange({
      ...produto,
      ref: e.target.value,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Referência"
          value={produto.ref || ''}
          onChange={handleChange}
        />
        {error?.referencia && (
          <span className="text-red-500 text-sm">{error.referencia}</span>
        )}

        <div className="flex flex-row gap-4 justify-center">
          <button
            type="button"
            className="bg-[#347AB6] dark:bg-blue-900 text-white px-4 py-2 rounded"
          >
            Adicionar
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Remover
          </button>
        </div>
      </div>

      <div className="flex justify-center text-gray-700">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referência
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marca
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">1</td>
              <td className="px-6 py-4 whitespace-nowrap">Referência 1</td>
              <td className="px-6 py-4 whitespace-nowrap">Marca 1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferenciaFabrica;
