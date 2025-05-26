// src/components/corpo/comprador/RequisicoesCompra/Form/EditRequisitionModal.tsx

import React, { useEffect, useState, useCallback } from 'react';
import ModalForm from '@/components/common/modalform';
import FormInput from '@/components/common/FormInput';
import SelectInput from '@/components/common/SelectInput';
import SearchSelectInput from '@/components/common/SearchSelectInput';
import { useTiposDeCompra } from '../hooks/useTiposDeCompra';
import { useFiliais } from '../hooks/useFiliais';
import { useCompradores } from '../hooks/useCompradores';
import { useFornecedores } from '../hooks/useFornecedores';
import { updateRequisition } from '@/data/requisicoesCompra/requisicoesCompra';
import type { RequisitionDTO } from '@/data/requisicoesCompra/types/requisition';

interface EditRequisitionModalProps {
  isOpen: boolean;
  requisition: RequisitionDTO | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditRequisitionModal({
  isOpen,
  requisition,
  onClose,
  onSuccess,
}: EditRequisitionModalProps) {
  const { tipos } = useTiposDeCompra();
  const { filiais } = useFiliais();
  const { compradores } = useCompradores();
  const { fornecedores } = useFornecedores();

  // Estado do form (local pro modal)
  const [form, setForm] = useState<Partial<RequisitionDTO>>({});
  // Inputs ao vento, só UI
  const [condicoesPgto, setCondicoesPgto] = useState('');
  const [observacao, setObservacao] = useState('');
  const [resetKey, setResetKey] = useState(0);

  // Preenche campos ao abrir
  useEffect(() => {
    if (isOpen && requisition) {
      setForm(requisition);
      setCondicoesPgto('');
      setObservacao('');
      setResetKey((k) => k + 1);
    }
  }, [isOpen, requisition]);

  // Atualiza form nos selects/inputs
  const handleChange = <K extends keyof RequisitionDTO>(
    field: K,
    value: string | number,
  ) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  // Limpa pro estado original (não limpa tudo!)
  const handleClear = useCallback(() => {
    if (requisition) {
      setForm(requisition);
      setCondicoesPgto('');
      setObservacao('');
      setResetKey((k) => k + 1);
    }
  }, [requisition]);

  // Envia update (NÃO inclui condicoesPgto nem observacao)
  const handleSubmit = async () => {
    const req: RequisitionDTO = {
      ...form,
      id: requisition?.id as number,
    } as RequisitionDTO;
    await updateRequisition(req);
    onSuccess?.();
    onClose();
  };

  // Helper para filtrar duplicatas
  const filtraUnicos = <T, K extends keyof T>(arr: T[], chave: K) =>
    arr.filter(
      (item, idx, self) =>
        self.findIndex((i) => i[chave] === item[chave]) === idx,
    );

  if (!isOpen || !requisition) return null;

  return (
    <ModalForm
      titulo="Editar Requisição"
      handleSubmit={handleSubmit}
      handleClear={handleClear}
      onClose={onClose}
      loading={false}
      tabs={[{ name: 'Formulário', key: 'form' }]}
      activeTab="form"
      setActiveTab={() => {}}
      renderTabContent={() => (
        <div className="grid grid-cols-2 gap-4">
          {/* CAMPO: tipo */}
          <SelectInput
            key={`tipo-${resetKey}`}
            name="tipo"
            label="Tipo"
            options={filtraUnicos(tipos, 'codigo')
              .filter((t) => t.codigo != null)
              .map((t, idx) => ({
                value: String(t.codigo),
                label: t.descricao ?? String(t.codigo),
                key: `tipo-${t.codigo}-${idx}`,
              }))}
            defaultValue={
              form.tipo !== undefined && form.tipo !== null
                ? String(form.tipo)
                : undefined
            }
            onValueChange={(v: string | number) => handleChange('tipo', v)}
            required
          />

          {/* CAMPO: localEntrega */}
          <SearchSelectInput
            key={`entrega-inicial-${resetKey}`}
            name="localEntrega"
            label="Entrega inicial"
            options={filtraUnicos(filiais, 'codigo_filial')
              .filter((f) => f.codigo_filial != null)
              .map((f, idx) => ({
                value: String(f.codigo_filial),
                label: f.nome_filial,
                key: `filial-${f.codigo_filial}-${idx}`,
              }))}
            defaultValue={
              form.localEntrega !== undefined && form.localEntrega !== null
                ? String(form.localEntrega)
                : undefined
            }
            onValueChange={(v: string | number) =>
              handleChange('localEntrega', v)
            }
            required
          />

          {/* CAMPO: destino */}
          <SearchSelectInput
            key={`entrega-final-${resetKey}`}
            name="destino"
            label="Entrega final"
            options={filtraUnicos(filiais, 'codigo_filial')
              .filter((f) => f.codigo_filial != null)
              .map((f, idx) => ({
                value: String(f.codigo_filial),
                label: f.nome_filial,
                key: `filial-destino-${f.codigo_filial}-${idx}`,
              }))}
            defaultValue={
              form.destino !== undefined && form.destino !== null
                ? String(form.destino)
                : undefined
            }
            onValueChange={(v: string | number) => handleChange('destino', v)}
            required
          />

          {/* CAMPO: compradorNome */}
          <SearchSelectInput
            key={`comprador-${resetKey}`}
            name="compradorNome"
            label="Comprador"
            options={filtraUnicos(compradores, 'codcomprador')
              .filter((c) => c.nome)
              .map((c, idx) => ({
                value: String(c.nome),
                label: `${c.codcomprador} – ${c.nome}`,
                key: `comprador-${c.codcomprador}-${idx}`,
              }))}
            defaultValue={
              form.compradorNome !== undefined && form.compradorNome !== null
                ? String(form.compradorNome)
                : undefined
            }
            onValueChange={(v: string | number) =>
              handleChange('compradorNome', v)
            }
            required
          />

          {/* CAMPO: fornecedorCodigo */}
          <SelectInput
            key={`fornecedor-${resetKey}`}
            name="fornecedorCodigo"
            label="Fornecedor"
            options={filtraUnicos(fornecedores, 'cod_credor')
              .filter((f) => f.cod_credor != null)
              .map((f, idx) => ({
                value: String(f.cod_credor),
                label: `${f.cod_credor} – ${f.nome ?? ''}`,
                key: `fornecedor-${f.cod_credor}-${idx}`,
              }))}
            defaultValue={
              form.fornecedorCodigo !== undefined &&
              form.fornecedorCodigo !== null
                ? String(form.fornecedorCodigo)
                : undefined
            }
            onValueChange={(v: string | number) =>
              handleChange('fornecedorCodigo', v)
            }
            required
          />

          {/* Condições de PGTO (apenas UI) */}
          <FormInput
            name="condicoesPgto"
            type="text"
            label="Condições de PGTO"
            value={condicoesPgto}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCondicoesPgto(e.target.value)
            }
            autoComplete="off"
          />

          {/* Observação (apenas UI) */}
          <FormInput
            name="observacao"
            type="text"
            label="Observação"
            value={observacao}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setObservacao(e.target.value)
            }
            autoComplete="off"
          />
        </div>
      )}
    />
  );
}
