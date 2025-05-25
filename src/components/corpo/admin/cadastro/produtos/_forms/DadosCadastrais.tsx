import React, { useState } from 'react';
import FormInput from '@/components/common/FormInput';
import SelectInput from '@/components/common/SelectInput';
import SearchSelectInput from '@/components/common/SearchSelectInput';
import { CompraDireta, Curva, Dolar, Informativo, Produto, TipoProduto, UnidadeMedida } from '@/data/produtos/produtos';
import { getMarcas, Marca, Marcas } from '@/data/marcas/marcas';
import { useDebouncedCallback } from 'use-debounce';
import { getGruposFuncao, GrupoFuncao, GruposFuncao } from '@/data/gruposFuncao/gruposFuncao';
import { getGruposProduto, GrupoProduto, GruposProduto } from '@/data/gruposProduto/gruposProduto';

const curvaOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
];

const unidadeMedidaOptions = [
  { value: "PC", label: "Peça" },
  { value: "UN", label: "Unidade" },
  { value: "KT", label: "Kit" },
  { value: "CX", label: "Caixa" },
  { value: "CJ", label: "Conjunto" },
  { value: "JG", label: "Jogo" },
  { value: "LT", label: "Litro" },
  { value: "ML", label: "Mililitro" },
  { value: "MT", label: "Metro" },
  { value: "PT", label: "Pacote" },
  { value: "KG", label: "Quilograma" },
  { value: "CT", label: "Cartela" },
  { value: "PR", label: "Par" },
  { value: "RL", label: "Rolo" }
];

const moedaCambialOptions = [
  { value: "N", label: "R$" },
  { value: "S", label: "US$" }
];

const compraDiretaOptions = [
  { value: "S", label: "SIM"},
  { value: "N", label: "NÃO" }
];

const tipoProdutoOptions = [
  { value: "ME", label: "ME - MERCADORIA"},
  { value: "MC", label: "MC - MATERIAL DE CONSUMO" }
];

const precoTabeladoOptions = [
  { value: "1", label: "SIM"},
  { value: "0", label: "NÃO" }
];

const consumoInternoOptions = [
  { value: "true", label: "SIM"},
  { value: "false", label: "NÃO" },
];

interface DadosCadastraisProps {
  produto: Produto;
  handleProdutoChange: (produto: Produto) => void;
  error?: { [p: string]: string };
}

const DadosCadastrais: React.FC<DadosCadastraisProps> = ({ produto, handleProdutoChange, error }) => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [gruposFuncao, setGruposFuncao] = useState<GrupoFuncao[]>([]);
  const [gruposProduto, setGruposProduto] = useState<GrupoProduto[]>([]);
  const [searchMarcas, setSearchMarcas] = useState<string>('');
  const [searchGruposFuncao, setSearchGruposFuncao] = useState<string>('');
  const [searchGruposProduto, setSearchGruposProduto] = useState<string>('');

  const handleMarcasSearch = useDebouncedCallback(() => {
    handleMarcas();
  });

  const handleGruposFuncaoSearch = useDebouncedCallback(() => {
    handleGruposFuncao();
  });

  const handleGruposProdutoSearch = useDebouncedCallback(() => {
    handleGruposProduto();
  });

  const handleMarcas = async () => {
    const fetchedMarcas: Marcas = await getMarcas({ page: 1, perPage: 99, search: searchMarcas });
    if (!fetchedMarcas) return;
    setMarcas(fetchedMarcas.data);
  }

  const handleGruposFuncao = async () => {
    const fetchedGruposFuncao: GruposFuncao = await getGruposFuncao({ page: 1, perPage: 99, search: searchGruposFuncao });
    if (!fetchedGruposFuncao) return;
    setGruposFuncao(fetchedGruposFuncao.data);
  }

  const handleGruposProduto = async () => {
    const fetchedGruposProduto: GruposProduto = await getGruposProduto({ page: 1, perPage: 99, search: searchGruposProduto });
    if (!fetchedGruposProduto) return;
    setGruposProduto(fetchedGruposProduto.data);
  }

  const marcaOptions = marcas.map((marca) => ({
    value: marca.codmarca.toString(),
    label: marca.descr,
  }));

  const grupoFuncaoOptions = gruposFuncao.map((grupoFuncao) => ({
    value: grupoFuncao.codgpf.toString(),
    label: grupoFuncao.descr,
  }));

  const grupoProdutoOptions = gruposProduto.map((grupoProduto) => ({
    value: grupoProduto.codgpp.toString(),
    label: grupoProduto.descr,
  }));

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="codbar"
            type="text"
            label="Código de Barra"
            defaultValue={produto.codbar || ''}
            onChange={(e) => handleProdutoChange({ ...produto, codbar: e.target.value })}
            error={error?.codbar}
          />
          <SelectInput
            name="consumo_interno"
            label="Consumo Interno?"
            options={consumoInternoOptions}
            defaultValue={produto.consumo_interno ? 'true' : 'false'}
            onValueChange={(value) => handleProdutoChange({ ...produto, consumo_interno: value === 'true' })}
            error={error?.consumo_interno}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="ref"
            type="text"
            label="Referência"
            defaultValue={produto.ref || ''}
            onChange={(e) => handleProdutoChange({ ...produto, ref: e.target.value })}
            error={error?.ref}
            required
          />
          <FormInput
            name="reforiginal"
            type="text"
            label="Referência Original"
            defaultValue={produto.reforiginal || ''}
            onChange={(e) => handleProdutoChange({ ...produto, reforiginal: e.target.value })}
            error={error?.reforiginal}
          />
        </div>
        <FormInput
          name="descr"
          type="text"
          label="Descrição"
          defaultValue={produto.descr || ''}
          onChange={(e) => handleProdutoChange({ ...produto, descr: e.target.value })}
          error={error?.descr}
          required
        />
        <FormInput
          name="aplic_extendida"
          type="text"
          label="Aplicação Extendida"
          defaultValue={produto.aplic_extendida || ''}
          onChange={(e) => handleProdutoChange({ ...produto, aplic_extendida: e.target.value })}
          error={error?.aplic_extendida}
        />
        <div className="grid grid-cols-2 gap-4">
          <SearchSelectInput
            name="codmarca"
            label="Marca"
            options={marcaOptions}
            defaultValue={produto.codmarca || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, codmarca: value as string })}
            onInputChange={(value) => {
              setSearchMarcas(value);
              handleMarcasSearch();
            }}
            error={error?.codmarca}
            required
          />
          <SearchSelectInput
            name="codgpf"
            label="Grupo de Função"
            options={grupoFuncaoOptions}
            defaultValue={produto.codgpf || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, codgpf: value as string })}
            onInputChange={(value) => {
              setSearchGruposFuncao(value);
              handleGruposFuncaoSearch();
            }}
            error={error?.codgpf}
            required
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <SearchSelectInput
            name="codgpp"
            label="Grupo de Produto"
            options={grupoProdutoOptions}
            defaultValue={produto.codgpp || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, codgpp: value as string })}
            onInputChange={(value) => {
              setSearchGruposProduto(value);
              handleGruposProdutoSearch();
            }}
            error={error?.codgpp}
            required
          />
          <SelectInput
            name="curva"
            label="Class. Curva ABC"
            options={curvaOptions}
            defaultValue={produto.curva || 'D'}
            onValueChange={(value) => handleProdutoChange({ ...produto, curva: value as Curva })}
            error={error?.curva}
            required
          />
          <FormInput
            name="qtestmin"
            type="number"
            label="Qtd. Estoque Mínimo"
            defaultValue={produto.qtestmin || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, qtestmin: Number(e.target.value) })}
            error={error?.qtestmin}
          />
          <FormInput
            name="qtestmax"
            type="number"
            label="Qtd. Estoque Máximo"
            defaultValue={produto.qtestmax || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, qtestmax: Number(e.target.value) })}
            error={error?.qtestmax}
          />
        </div>
        <FormInput
          name="obs"
          type="text"
          label="Observação"
          defaultValue={produto.obs || ''}
          onChange={(e) => handleProdutoChange({ ...produto, obs: e.target.value })}
          error={error?.obs}
        />
        <div className="grid grid-cols-4 gap-4">
          <SelectInput
            name="inf"
            label="Informativo"
            options={curvaOptions}
            defaultValue={produto.inf || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, inf: value as Informativo })}
            error={error?.inf}
            required
          />
          <FormInput
            name="pesoliq"
            type="number"
            label="Peso Líquido"
            defaultValue={produto.pesoliq || '0'}
            onChange={(e) => handleProdutoChange({ ...produto, pesoliq: Number(e.target.value)})}
            error={error?.pesoliq}
          />
          <FormInput
            name="qtembal"
            type="number"
            label="Qtd. Embalagem"
            defaultValue={produto.qtembal || '1'}
            onChange={(e) => handleProdutoChange({ ...produto, qtembal: Number(e.target.value) })}
            error={error?.qtembal}
          />
          <SelectInput
            name="unimed"
            label="Unidade de Medida"
            options={unidadeMedidaOptions}
            defaultValue={produto.unimed || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, unimed: value as UnidadeMedida })}
            error={error?.unimed}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="multiplo"
            type="number"
            label="Múltiplo Venda"
            defaultValue={produto.multiplo || '1'}
            onChange={(e) => handleProdutoChange({ ...produto, multiplo: Number(e.target.value) })}
            error={error?.multiplo}
            required
          />
          <FormInput
            name="coddesc"
            type="number"
            label="Desconto de Fábrica"
            defaultValue={produto.coddesc || '1'}
            onChange={(e) => handleProdutoChange({ ...produto, coddesc: Number(e.target.value) })}
            error={error?.coddesc}
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <SelectInput
            name="tabelado"
            label="Preço Tabelado"
            options={precoTabeladoOptions}
            defaultValue={produto.tabelado?.toString() || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, tabelado: value })}
            error={error?.tabelado}
          />
          <SelectInput
            name="compradireta"
            label="Compra Direta"
            options={compraDiretaOptions}
            defaultValue={produto.compradireta || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, compradireta: value as CompraDireta })}
            error={error?.compradireta}
            required
          />
          <SelectInput
            name="dolar"
            label="Moeda Cambial"
            options={moedaCambialOptions}
            defaultValue={produto.dolar || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, dolar: value as Dolar })}
            error={error?.dolar}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="multiplocompra"
            type="number"
            label="Múltiplo Compra"
            defaultValue={produto.multiplocompra || ''}
            onChange={(e) => handleProdutoChange({ ...produto, multiplocompra: Number(e.target.value) })}
            error={error?.multiplocompra}
            required
          />
          <SelectInput
            name="tipo"
            label="Tipo Produto"
            options={tipoProdutoOptions}
            defaultValue={produto.tipo || ''}
            onValueChange={(value) => handleProdutoChange({ ...produto, tipo: value as TipoProduto })}
            error={error?.tipo}
            required
          />
        </div>
        <FormInput
          name="descr_importacao"
          type="text"
          label="Descrição Importado"
          defaultValue={produto.descr_importacao || ''}
          onChange={(e) => handleProdutoChange({ ...produto, descr_importacao: e.target.value })}
          error={error?.descr_importacao}
        />
      </div>
    </>
  );
}

export default DadosCadastrais;