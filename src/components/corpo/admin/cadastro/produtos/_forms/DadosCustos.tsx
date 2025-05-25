import React from 'react';
import FormInput from '@/components/common/FormInput';
import { Produto } from '@/data/produtos/produtos';

interface DadosCustosProps {
  produto: Produto;
  handleProdutoChange: (produto: Produto) => void;
  error?: { [p: string]: string };
}

const DadosCustos: React.FC<DadosCustosProps> = ({ produto, handleProdutoChange, error }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4 border border-[#347AB6]/25 dark:border-blue-900/25 rounded-lg p-4">
          <div className="block text-gray-700 font-bold">Custo Referente a Lista de Fábrica</div>
          <FormInput
            name="prfabr"
            type="number"
            label="Preço Fábrica"
            defaultValue={produto.prfabr || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, prfabr: Number(e.target.value) })}
            error={error?.prfabr}
          />
          <FormInput
            name="prcustoatual"
            type="number"
            label="Preço Líquido"
            defaultValue={produto.prcustoatual || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, prcustoatual: Number(e.target.value) })}
            error={error?.prcustoatual}
          />
          <FormInput
            name="preconf"
            type="number"
            label="Preço NF"
            defaultValue={produto.preconf || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, preconf: Number(e.target.value) })}
            error={error?.preconf}
          />
          <FormInput
            name="precosnf"
            type="number"
            label="Preço sem NF"
            defaultValue={produto.precosnf || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, precosnf: Number(e.target.value) })}
            error={error?.precosnf}
          />
        </div>
        <div className="flex flex-col gap-4 border border-[#347AB6]/25 dark:border-blue-900/25 rounded-lg p-4">
          <div className="block text-gray-700 font-bold">Custo Referente a Compra e Transferência</div>
          <FormInput
            name="prcompra"
            type="number"
            label="Custo Compra"
            defaultValue={produto.prcompra || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, prcompra: Number(e.target.value) })}
            error={error?.prcompra}
            required
          />
          <FormInput
            name="prcomprasemst"
            type="number"
            label="Custo Transf. Líquido"
            defaultValue={produto.prcomprasemst || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, prcomprasemst: Number(e.target.value) })}
            error={error?.prcomprasemst}
          />
          <FormInput
            name="pratualdesp"
            type="number"
            label="Custo Transf. Bruto"
            defaultValue={produto.pratualdesp || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, pratualdesp: Number(e.target.value) })}
            error={error?.pratualdesp}
          />
          <FormInput
            name="txdolarcompra"
            type="number"
            label="Taxa Dólar"
            defaultValue={produto.txdolarcompra || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, txdolarcompra: Number(e.target.value) })}
            error={error?.txdolarcompra}
          />
          {/*<FormInput*/}
          {/*  name="prcusto"*/}
          {/*  type="number"*/}
          {/*  label="Custo Contábil"*/}
          {/*  defaultValue={produto.prcusto || '0'}*/}
          {/*  onChange={(e) => handleProdutoChange({ ...produto, prcusto: Number(e.target.value) })}*/}
          {/*  error={error?.prcusto}*/}
          {/*/>*/}
        </div>
        <div className="flex flex-col gap-4 border border-[#347AB6]/25 dark:border-blue-900/25 rounded-lg p-4">
          <div className="block text-gray-700 font-bold">Lista de Preço</div>
          <FormInput
            name="prvenda"
            type="number"
            label="Preço Venda"
            defaultValue={produto.prvenda || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, prvenda: Number(e.target.value) })}
            error={error?.prvenda}
          />
          <FormInput
            name="primp"
            type="number"
            label="Preço Importação"
            defaultValue={produto.primp || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, primp: Number(e.target.value) })}
            error={error?.primp}
          />
          <FormInput
            name="impfat"
            type="number"
            label="Preço Importação Fatura"
            defaultValue={produto.impfat || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, impfat: Number(e.target.value) })}
            error={error?.impfat}
          />
          <FormInput
            name="impfab"
            type="number"
            label="Preço Importação Fábrica"
            defaultValue={produto.impfab || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, impfab: Number(e.target.value) })}
            error={error?.impfab}
          />
          <FormInput
            name="concor"
            type="number"
            label="Preço Concorrência"
            defaultValue={produto.concor || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, concor: Number(e.target.value) })}
            error={error?.concor}
          />
          <FormInput
            name="txdolarvenda"
            type="number"
            label="Taxa Dólar"
            defaultValue={produto.txdolarvenda || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, txdolarvenda: Number(e.target.value) })}
            error={error?.txdolarvenda}
          />
        </div>
      </div>
    </>
  );
}

export default DadosCustos;