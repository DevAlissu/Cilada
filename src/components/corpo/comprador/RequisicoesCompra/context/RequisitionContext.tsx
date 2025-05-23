// src/components/corpo/comprador/RequisicoesCompra/context/RequisitionContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { RequisitionDTO } from '../types/requisition'; // <-- DTO, não Requisition
import * as service from '../services/requisitionService'; // <-- verifique se esse arquivo exporta getAllRequisitions

interface RequisitionContextValue {
  requisitions: RequisitionDTO[];
  loading: boolean;
  error: string | null;
  filter: string;
  setFilter: (f: string) => void;
  fetchRequisitions: () => Promise<void>;
  isModalOpen: boolean;
  openModal: (req?: RequisitionDTO) => void;
  closeModal: () => void;
  selectedRequisition: RequisitionDTO | null;
}

const RequisitionContext = createContext<RequisitionContextValue | undefined>(
  undefined,
);

export const RequisitionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [requisitions, setRequisitions] = useState<RequisitionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequisition, setSelectedRequisition] =
    useState<RequisitionDTO | null>(null);

  const fetchRequisitions = async () => {
    setLoading(true);
    try {
      const data = await service.getAllRequisitions({ filter });
      setRequisitions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar requisições');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisitions();
  }, [filter]);

  const openModal = (req?: RequisitionDTO) => {
    setSelectedRequisition(req ?? null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequisition(null);
  };

  return (
    <RequisitionContext.Provider
      value={{
        requisitions,
        loading,
        error,
        filter,
        setFilter,
        fetchRequisitions,
        isModalOpen,
        openModal,
        closeModal,
        selectedRequisition,
      }}
    >
      {children}
    </RequisitionContext.Provider>
  );
};

export function useRequisitionContext(): RequisitionContextValue {
  const ctx = useContext(RequisitionContext);
  if (!ctx)
    throw new Error(
      'useRequisitionContext must be used within RequisitionProvider',
    );
  return ctx;
}
