// src/components/corpo/comprador/RequisicoesCompra/List/ActionsMenu.tsx

import React from 'react';
import type { RequisitionDTO } from '@/data/requisicoesCompra/types/requisition';

export interface ActionsMenuProps {
  requisition: RequisitionDTO;
  onSubmit: () => void;
  onApprove: () => void;
}

export default function ActionsMenu({ onSubmit, onApprove }: ActionsMenuProps) {
  return (
    <select
      defaultValue=""
      onChange={(e) => {
        const action = e.target.value;
        e.target.value = '';
        e.stopPropagation();
        if (action === 'submeter') onSubmit();
        else if (action === 'aprovar') onApprove();
      }}
      className="
        w-auto
        bg-white dark:bg-slate-800
        border border-gray-300 dark:border-gray-600
        rounded
        px-2 py-1
        text-sm text-gray-800 dark:text-gray-100
        focus:outline-none focus:ring-1 focus:ring-blue-400
        cursor-pointer
      "
      title="Ações"
    >
      <option value="" disabled>
        ⋮
      </option>
      <option value="submeter">Submeter</option>
      <option value="aprovar">Aprovar</option>
    </select>
  );
}
