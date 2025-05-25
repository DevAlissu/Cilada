import React, { useState } from 'react';
import FormInput from '@/components/common/FormInput';
import SelectInput from '@/components/common/SelectInput';
import SearchSelectInput from '@/components/common/SearchSelectInput';
import { Label } from '@/components/ui/label';
import { IsentoIPI, Produto } from '@/data/produtos/produtos';
import { ClassificacaoFiscal, getClassificacoesFiscais } from '@/data/classificacoesFiscais/classificacoesFiscais';
import { useDebouncedCallback } from 'use-debounce';
import { Cest, getCests } from '@/data/cests/cests';

const tributadoOptions = [
  { value: 'S', label: 'SIM' },
  { value: 'N', label: 'NÃO' }
];

const firstSituacaoTributaria = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' }
];

const secondSituacaoTributaria = [
  { value: '00', label: '00' },
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
  { value: '40', label: '40' },
  { value: '41', label: '41' },
  { value: '50', label: '50' },
  { value: '51', label: '51' },
  { value: '60', label: '60' },
  { value: '70', label: '70' },
  { value: '90', label: '90' }
];

const isentoPisCofinsOptions = [
  { value: 'S', label: 'SIM' },
  { value: 'N', label: 'NÃO' }
];

const situacaoIpiOptions = [
  { value: 'S', label: 'Suspenso' },
  { value: 'C', label: 'Cobrar' },
  { value: 'P', label: 'Pago' },
  { value: 'Z', label: 'Zerado' },
  { value: 'I', label: 'Importação' },
  { value: 'T', label: 'Import ST' },
];

interface DadosFiscaisProps {
  produto: Produto;
  handleProdutoChange: (produto: Produto) => void;
  error?: { [p: string]: string };
}

const DadosFiscais: React.FC<DadosFiscaisProps> = ({ produto, handleProdutoChange, error }) => {
  const [classificacoesFiscais, setClassificacoesFiscais] = useState<ClassificacaoFiscal[]>([]);
  const [cests, setCests] = useState<Cest[]>([]);
  const [classificacaoFiscalSearch, setClassificacaoFiscalSearch] = useState<string>('');
  const [cestSearch, setCestSearch] = useState<string>('');

  const handleClassificacaoFiscalSearch = useDebouncedCallback(() => {
    handleClassificacoesFiscais();
  });

  const handleCestSearch = useDebouncedCallback(() => {
    handleCests();
  });

  const handleClassificacoesFiscais = async () => {
    const fetchedClassificacoesFiscais = await getClassificacoesFiscais({ page: 1, perPage: 99, search: classificacaoFiscalSearch });
    if (!fetchedClassificacoesFiscais) return;
    setClassificacoesFiscais(fetchedClassificacoesFiscais.data);
  }

  const handleCests = async () => {
    const fetchedCests = await getCests({ page: 1, perPage: 99, search: cestSearch });
    if (!fetchedCests) return;
    setCests(fetchedCests.data);
  }

  const classificaoesFiscaisOptions = classificacoesFiscais.map((classificacaoFiscal) => ({
    value: classificacaoFiscal.ncm,
    label: classificacaoFiscal.ncm
  }));

  const cestsOptions = cests.map((cest) => ({
    value: cest.cest,
    label: cest.cest
  }));

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            name="nrodi"
            type="text"
            label="Nº DI"
            defaultValue={produto.nrodi || ''}
            onChange={(e) => handleProdutoChange({ ...produto, nrodi: e.target.value })}
            error={error?.nrodi}
          />
          <SelectInput
            name="trib"
            label="Tributado"
            options={tributadoOptions}
            defaultValue={produto.trib || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, trib: value as string })}
            error={error?.trib}
            required
          />
          <SearchSelectInput
            name="clasfiscal"
            label="Classif. Fiscal"
            options={classificaoesFiscaisOptions}
            defaultValue={produto.clasfiscal || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, clasfiscal: value as string })}
            onInputChange={(value) => {
              setClassificacaoFiscalSearch(value);
              handleClassificacaoFiscalSearch();
            }}
            error={error?.clasfiscal}
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            name="dtdi"
            type="date"
            label="Data DI"
            defaultValue={produto.dtdi?.toDateString() || ''}
            onChange={(e) => handleProdutoChange({ ...produto, dtdi: new Date(e.target.value) })}
            error={error?.dtdi}
          />
          <div className="text-gray-700">
            <Label htmlFor="strib">Situação Tributária<span className="text-red-500"> *</span></Label>
            <div className="grid grid-cols-2 gap-4">
              <SelectInput
                name="strib"
                options={firstSituacaoTributaria}
                defaultValue={produto.strib || ''}
                onValueChange={(value) => handleProdutoChange({ ...produto, strib: value as string })}
                error={error?.strib}
                required
              />
              <SelectInput
                name="strib"
                options={secondSituacaoTributaria}
                defaultValue={produto.strib || ''}
                onValueChange={(value) => handleProdutoChange({ ...produto, strib: value as string })}
                error={error?.strib}
                required
              />
            </div>
          </div>
          <FormInput
            name="percsubst"
            type="number"
            label="% Agregado"
            defaultValue={produto.percsubst || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, percsubst: Number(e.target.value) })}
            error={error?.percsubst}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <SelectInput
            name="isentopiscofins"
            label="Isento PIS/COFINS?"
            options={isentoPisCofinsOptions}
            defaultValue={produto.isentopiscofins || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, isentopiscofins: value as string })}
            error={error?.isentopiscofins}
            required
          />
          <FormInput
            name="pis"
            type="number"
            label="PIS"
            defaultValue={produto.pis || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, pis: Number(e.target.value) })}
            error={error?.pis}
          />
          <FormInput
            name="cofins"
            type="number"
            label="COFINS"
            defaultValue={produto.cofins || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, cofins: Number(e.target.value) })}
            error={error?.cofins}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <SelectInput
            name="isentoipi"
            label="Situação IPI?"
            options={situacaoIpiOptions}
            defaultValue={produto.isentoipi || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, isentoipi: value as IsentoIPI })}
            error={error?.isentoipi}
            required
          />
          <FormInput
            name="ipi"
            type="number"
            label="IPI"
            defaultValue={produto.ipi || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, ipi: Number(e.target.value) })}
            error={error?.ipi}
          />
          <div>
            <label className="block text-gray-700">Reservado CheckBox</label>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <SelectInput
            name="descontopiscofins"
            label="Desconto PIS/COFINS?"
            options={isentoPisCofinsOptions}
            defaultValue={produto.descontopiscofins || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, descontopiscofins: value as string })}
            error={error?.descontopiscofins}
          />
          <FormInput
            name="ii"
            type="number"
            label="IPI"
            defaultValue={produto.ii || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, ii: Number(e.target.value) })}
            error={error?.ii}
          />
          <SearchSelectInput
            name="cest"
            label="CEST"
            options={cestsOptions}
            defaultValue={produto.cest || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, cest: value as string })}
            onInputChange={(value) => {
              setCestSearch(value);
              handleCestSearch();
            }}
            error={error?.cest}
            required
          />
        </div>
      </div>
    </>
  );
}

export default DadosFiscais;