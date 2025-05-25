import React, { useState, useEffect } from 'react';
import { Cliente } from '@/data/clientes/clientes';
import FormInput from '@/components/common/FormInput';
import CheckInput from '@/components/common/CheckInput';
import SelectInput from '@/components/common/SelectInput';
import { useDebouncedCallback } from 'use-debounce';
import { buscaCep, ViaCepResponse } from '@/data/cep';
import MultiSearchSelectInput from '@/components/common/MultiSearchSelectInput';
import SearchSelectInput from '@/components/common/SearchSelectInput';
import { Bancos } from '@/data/bancos/bancos';
import { CadClienteSearchOptions } from '../modalCadastrar';
import LimiteTable from '../_components/LimiteTable';
import { Limite } from '@/data/clientes/limites';
import { Paises } from '@/data/paises/paises';

const creditoOptions = [
  { value: 'S', label: 'Sim' },
  { value: 'N', label: 'Não' },
];

const icmsOptions = [
  { value: 'S', label: 'Sim' },
  { value: 'N', label: 'Não' },
];

const faixaFinOptions = [
  { value: '01', label: '01' },
  { value: '02', label: '02' },
  { value: '03', label: '03' },
  { value: '04', label: '04' },
  { value: '05', label: '05' },
  { value: '06', label: '06' },
  { value: '07', label: '07' },
  { value: '08', label: '08' },
  { value: '09', label: '09' },
  { value: '10', label: '10' },
];

interface DadosFinanceirosProps {
  cliente: Cliente;
  handleClienteChange: (field: keyof Cliente, value: any) => void;
  error?: { [key: string]: string };
  usarMesmoEnderecoCobranca: boolean;
  setDisable: (field: 'aceitarAtraso', value: boolean) => void;
  disableFields: {
    aceitarAtraso: boolean;
  };
  isEdit?: boolean;
  options: { bancos: Bancos; paises: Paises };
  handleSearchOptionsChange: (
    option: CadClienteSearchOptions,
    value: string,
  ) => void;
  limite?: Limite | null;
}

const DadosFinanceiros: React.FC<DadosFinanceirosProps> = ({
  cliente,
  handleClienteChange,
  error,
  usarMesmoEnderecoCobranca,
  setDisable,
  disableFields,
  isEdit = false,
  options,
  handleSearchOptionsChange,
  limite,
}) => {
  const [resultCep, setResultCep] = useState<ViaCepResponse>(
    {} as ViaCepResponse,
  );

  const handleCepSearch = useDebouncedCallback(() => {
    getResultCep();
  }, 1000);

  const getResultCep = async () => {
    if (cliente.cepcobr && cliente.cepcobr.length >= 8) {
      setResultCep(await buscaCep(cliente.cepcobr));
    }
  };

  const bancoOptions = options.bancos.data.map((banco) => ({
    value: banco.banco,
    label: banco.nome,
  }));

  const paisesOptions = options.paises?.data?.map((pais) => ({
    value: pais.codpais,
    label: pais.descricao,
  }));

  useEffect(() => {
    if (resultCep.logradouro)
      handleClienteChange('endercobr', resultCep.logradouro);
    if (resultCep.bairro) handleClienteChange('bairrocobr', resultCep.bairro);
    if (resultCep.localidade)
      handleClienteChange('cidadecobr', resultCep.localidade);
    if (resultCep.uf) handleClienteChange('ufcobr', resultCep.uf);
  }, [resultCep, handleClienteChange]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-5 gap-4">
        <FormInput
          name="limite"
          type="number"
          label="Limite R$"
          defaultValue={Number(cliente.limite) || 0.0}
          onChange={(e) =>
            handleClienteChange('limite', Number(e.target.value))
          }
          error={error?.limite}
          required
        />
        <SelectInput
          name="status"
          label="Crédito"
          options={creditoOptions}
          defaultValue={cliente.status || ''}
          onValueChange={(value) => handleClienteChange('status', value)}
          error={error?.status}
        />

        <SelectInput
          name="claspgto"
          label="Classe Pagamento"
          options={creditoOptions}
          defaultValue={cliente.claspgto || ''}
          onValueChange={(value) => {
            handleClienteChange('claspgto', value);
          }}
          error={error?.claspgto}
          required
        />
        <div className="flex gap-4">
          <CheckInput
            label="Aceitar Atraso?"
            name="aceitaratraso"
            onChange={(e) => setDisable('aceitarAtraso', e.target.checked)}
            checked={disableFields.aceitarAtraso}
          />
          <FormInput
            name="atraso"
            type="number"
            label="Dias de Atraso"
            defaultValue={cliente.atraso || '0'}
            onChange={(e) =>
              handleClienteChange('atraso', Number(e.target.value) ?? 0)
            }
            disabled={!disableFields.aceitarAtraso}
            error={error?.atraso}
          />
        </div>
        <SelectInput
          name="icms"
          label="ICMS"
          options={icmsOptions}
          defaultValue={cliente.icms || ''}
          onValueChange={(value) => handleClienteChange('icms', value)}
          error={error?.icms}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <SelectInput
            name="faixafin"
            label="Faixa Financeira"
            options={faixaFinOptions}
            defaultValue={cliente.faixafin || ''}
            onValueChange={(value) => handleClienteChange('faixafin', value)}
            error={error?.faixafin}
            required
          />
          <SearchSelectInput
            name="banco"
            label="Banco"
            options={bancoOptions}
            defaultValue={cliente.banco || ''}
            onValueChange={(value) => handleClienteChange('banco', value)}
            onInputChange={(value) => handleSearchOptionsChange('banco', value)}
            required
          />
        </div>
        <MultiSearchSelectInput name="Formas de Pagamento" options={[]} />
      </div>
      {isEdit && <LimiteTable limite={limite} />}
      <div>
        <p className="text-gray-700 dark:text-gray-300 font-bold">
          ENDEREÇO PARA COBRANÇA
        </p>
        {usarMesmoEnderecoCobranca && (
          <span className="text-red-500 font-bold">
            {' '}
            Utilizando o mesmo endereço de Correspondência
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FormInput
          name="cepcobr"
          type="text"
          label="CEP"
          defaultValue={cliente.cepcobr || ''}
          onChange={(e) => {
            handleClienteChange('cepcobr', e.target.value);
            handleCepSearch();
          }}
          error={error?.cepcobr}
          disabled={usarMesmoEnderecoCobranca}
          maxLength={8}
          required
        />
        <FormInput
          name="endercobr"
          type="text"
          label="Logradouro"
          defaultValue={cliente.endercobr || ''}
          onChange={(e) => handleClienteChange('endercobr', e.target.value)}
          error={error?.endercobr}
          disabled={usarMesmoEnderecoCobranca}
          required
        />
        <FormInput
          name="numerocobr"
          type="text"
          label="Número"
          defaultValue={cliente.numerocobr || ''}
          onChange={(e) => handleClienteChange('numerocobr', e.target.value)}
          error={error?.numerocobr}
          disabled={usarMesmoEnderecoCobranca}
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <FormInput
          name="bairrocobr"
          type="text"
          label="Bairro"
          defaultValue={cliente.bairrocobr || ''}
          onChange={(e) => handleClienteChange('bairrocobr', e.target.value)}
          error={error?.bairrocobr}
          disabled={usarMesmoEnderecoCobranca}
          required
        />
        <FormInput
          name="cidadecobr"
          type="text"
          label="Cidade"
          defaultValue={cliente.cidadecobr || ''}
          onChange={(e) => handleClienteChange('cidadecobr', e.target.value)}
          error={error?.cidadecobr}
          disabled={usarMesmoEnderecoCobranca}
          required
        />
        <FormInput
          name="ufcobr"
          type="text"
          label="UF"
          defaultValue={cliente.ufcobr || ''}
          onChange={(e) => handleClienteChange('ufcobr', e.target.value)}
          error={error?.ufcobr}
          disabled={usarMesmoEnderecoCobranca}
          required
        />
        <SearchSelectInput
          name="codpaiscobr"
          label="País"
          options={paisesOptions}
          defaultValue={Number(cliente.codpaiscobr) || ''}
          onValueChange={(value) => handleClienteChange('codpaiscobr', value)}
          onInputChange={(value) => handleSearchOptionsChange('pais', value)}
          error={error?.codpaiscobr}
          disabled={usarMesmoEnderecoCobranca}
          required
        />
      </div>
      <FormInput
        name="complementocobr"
        type="text"
        label="Complemento"
        defaultValue={cliente.complementocobr || ''}
        onChange={(e) => handleClienteChange('complementocobr', e.target.value)}
        error={error?.complementocobr}
        disabled={usarMesmoEnderecoCobranca}
      />
      <FormInput
        name="referenciacobr"
        type="text"
        label="Referência"
        defaultValue={cliente.referenciacobr || ''}
        onChange={(e) => handleClienteChange('referenciacobr', e.target.value)}
        error={error?.referenciacobr}
        disabled={usarMesmoEnderecoCobranca}
      />
    </div>
  );
};

export default DadosFinanceiros;
