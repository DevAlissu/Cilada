import React, { useState, useEffect, useRef } from 'react';
import { Cliente } from '@/data/clientes/clientes';
import FormInput from '@/components/common/FormInput';
import SelectInput from '@/components/common/SelectInput';
import CheckInput from '@/components/common/CheckInput';
import { useDebouncedCallback } from 'use-debounce';
import { buscaCep, ViaCepResponse } from '@/data/cep';
import { Bancos } from '@/data/bancos/bancos';
import { cClientes } from '@/data/cClientes/cClientes';
import { CadClienteSearchOptions } from '../modalCadastrar';
import { Paises } from '@/data/paises/paises';
import SearchSelectInput from '@/components/common/SearchSelectInput';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { isValidCpfCnpj, isValidEmail } from '@/utils/validacoes';

const tipoPessoaOptions = [
  { value: 'J', label: 'Jurídica' },
  { value: 'F', label: 'Física' },
  { value: 'X', label: 'X-Exterior' },
];

const tipoClienteOptions = [
  { value: 'R', label: 'Revenda' },
  { value: 'F', label: 'Cliente Final' },
  { value: 'L', label: 'Produtor Rural' },
  { value: 'S', label: 'Solidário' },
  { value: 'X', label: 'Exportação' },
];

const situacaoTributariaOptions = [
  { value: '1', label: 'Não Contribuinte' },
  { value: '2', label: 'Lucro Presumido' },
  { value: '3', label: 'Lucro Real' },
  { value: '4', label: 'Simples Nacional' },
];

const tipoEmpresaOptions = [
  { value: 'EPP', label: 'EPP' },
  { value: 'ME', label: 'ME' },
  { value: 'NL', label: 'NL' },
  { value: 'PF', label: 'PF' },
];

const habilitaSuframaOptions = [
  { value: 'S', label: 'Sim' },
  { value: 'N', label: 'Não' },
];

interface DadosCadastraisProps {
  cliente: Cliente;
  handleClienteChange: (field: keyof Cliente, value: any) => void;
  error?: { [p: string]: string };
  usarMesmoEnderecoCobranca: boolean;
  handleMesmoEnderecoCobranca: (usarMesmoEnderecoCobranca: boolean) => void;
  setDisable: (
    field: 'disableIm' | 'disableIe' | 'disableSuf',
    value: boolean,
  ) => void;
  disableFields: {
    disableIm: boolean;
    disableIe: boolean;
    disableSuf: boolean;
  };
  isEdit?: boolean;
  options: { bancos: Bancos; paises: Paises; cClientes: cClientes };
  handleSearchOptionsChange: (
    option: CadClienteSearchOptions,
    value: string,
  ) => void;
}

const DadosCadastrais: React.FC<DadosCadastraisProps> = ({
  cliente,
  handleClienteChange,
  error,
  usarMesmoEnderecoCobranca,
  handleMesmoEnderecoCobranca,
  setDisable,
  disableFields,
  options,
  handleSearchOptionsChange,
}) => {
  const [resultCep, setResultCep] = useState<ViaCepResponse>(
    {} as ViaCepResponse,
  );

  const { toast } = useToast();
  const [cpfCnpjError, setCpfCnpjError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const cepRef = useRef<HTMLInputElement>(null);
  const validarCpfCnpj = (value: string) => {
    if (!value) {
      setCpfCnpjError('Documento obrigatório');
      return false;
    }
    if (!isValidCpfCnpj(value)) {
      setCpfCnpjError('CPF ou CNPJ inválido');
      return false;
    }
    setCpfCnpjError('');
    return true;
  };

  const validarEmail = (value: string) => {
    if (value && !isValidEmail(value)) {
      setEmailError('E-mail inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleCepSearch = useDebouncedCallback(() => {
    getResultCep();
  }, 1000);

  const getResultCep = async () => {
    if (cliente.cep && cliente.cep.length >= 8) {
      try {
        const resultado = await buscaCep(cliente.cep);
        setResultCep(resultado);
      } catch (error) {
        // aqui você trata o erro lançado com `throw`
        toast({
          description: `${(error as Error).message || 'Erro ao buscar CEP'}`,
          variant: 'destructive',
        });
        cepRef.current?.focus(); // 🔵 aqui
        cepRef.current?.select(); // 🔵 opcional: seleciona o conteúdo
      }
    }
  };

  const paisesOptions = options.paises?.data?.map((pais) => ({
    value: pais.codpais,
    label: pais.descricao,
  }));

  const ccOptions = options.cClientes?.data
    ? options.cClientes.data.map((cCliente) => ({
        value: cCliente.codcc,
        label: cCliente.descr,
      }))
    : [];

  useEffect(() => {
    if (resultCep.logradouro)
      handleClienteChange('ender', resultCep.logradouro);
    if (resultCep.bairro) handleClienteChange('bairro', resultCep.bairro);
    if (resultCep.localidade)
      handleClienteChange('cidade', resultCep.localidade);
    if (resultCep.uf) handleClienteChange('uf', resultCep.uf);
  }, [resultCep, handleClienteChange]);
  return (
    <div className="bg-inherit text-inherit">
      <div className="grid grid-cols-1 gap-4">
        <div className=" grid grid-cols-3 gap-4">
          <SelectInput
            name="tipo"
            label="Tipo"
            options={tipoPessoaOptions}
            defaultValue={cliente.tipo || ''}
            onValueChange={(value) => handleClienteChange('tipo', value)}
            error={error?.tipo}
          />
          <FormInput
            name="cpfcgc"
            type="text"
            label="Documento"
            defaultValue={cliente.cpfcgc || ''}
            onChange={(e) => handleClienteChange('cpfcgc', e.target.value)}
            onBlur={(e) => validarCpfCnpj(e.target.value)} // 🔵 validar quando sair do campo
            error={cpfCnpjError || error?.cpfcgc}
            required
          />

          <FormInput
            name="email"
            type="email"
            label="E-mail"
            defaultValue={cliente.email || ''}
            onChange={(e) => handleClienteChange('email', e.target.value)}
            onBlur={(e) => validarEmail(e.target.value)} // 🔵 validar quando sair do campo
            error={emailError || error?.email}
          />
        </div>

        <FormInput
          name="nome"
          type="text"
          label="Nome"
          defaultValue={cliente.nome || ''}
          onChange={(e) => handleClienteChange('nome', e.target.value)}
          error={error?.nome}
          required
        />
        <FormInput
          name="nomefant"
          type="text"
          label="Nome Fantasia"
          defaultValue={cliente.nomefant || ''}
          onChange={(e) => handleClienteChange('nomefant', e.target.value)}
          error={error?.nomefant}
        />

        <div className="flex gap-4 justify-between">
          <p className="text-inherit font-bold">
            ENDEREÇO PARA CORRESPONDÊNCIA
          </p>
          <CheckInput
            name="mesmoendcobr"
            label="Utilizar mesmo endereço para Cobrança?"
            onChange={(e) => handleMesmoEnderecoCobranca(e.target.checked)}
            checked={usarMesmoEnderecoCobranca}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormInput
            name="cep"
            type="text"
            label="CEP"
            defaultValue={cliente.cep || ''}
            onChange={(e) => {
              handleClienteChange('cep', e.target.value);
              handleCepSearch();
            }}
            error={error?.cep}
            maxLength={8}
            required
            ref={cepRef}
          />
          <FormInput
            name="ender"
            type="text"
            label="Logradouro"
            defaultValue={cliente.ender || ''}
            onChange={(e) => handleClienteChange('ender', e.target.value)}
            error={error?.ender}
            required
          />
          <FormInput
            name="numero"
            type="text"
            label="Número"
            defaultValue={cliente.numero || ''}
            onChange={(e) => handleClienteChange('numero', e.target.value)}
            error={error?.numero}
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <FormInput
            name="bairro"
            type="text"
            label="Bairro"
            defaultValue={cliente.bairro || ''}
            onChange={(e) => handleClienteChange('bairro', e.target.value)}
            error={error?.bairro}
            required
          />
          <FormInput
            name="cidade"
            type="text"
            label="Cidade"
            defaultValue={cliente.cidade || ''}
            onChange={(e) => handleClienteChange('cidade', e.target.value)}
            error={error?.cidade}
            required
          />
          <FormInput
            name="uf"
            type="text"
            label="UF"
            defaultValue={cliente.uf || ''}
            onChange={(e) => handleClienteChange('uf', e.target.value)}
            error={error?.uf}
            required
          />
          <SearchSelectInput
            name="codpais"
            label="País"
            options={paisesOptions}
            value={Number(cliente.codpais) || ''}
            onValueChange={(value) => handleClienteChange('codpais', value)}
            onInputChange={(value) => handleSearchOptionsChange('pais', value)}
            error={error?.codpais}
            required
          />
        </div>

        <FormInput
          name="complemento"
          type="text"
          label="Complemento"
          defaultValue={cliente.complemento || ''}
          onChange={(e) => handleClienteChange('complemento', e.target.value)}
          error={error?.complemento}
        />
        <FormInput
          name="referencia"
          type="text"
          label="Referência"
          defaultValue={cliente.referencia || ''}
          onChange={(e) => handleClienteChange('referencia', e.target.value)}
          error={error?.referencia}
        />

        <div className="grid grid-cols-4 gap-4">
          <SelectInput
            name="tipocliente"
            label="Tipo Cliente"
            options={tipoClienteOptions}
            defaultValue={cliente.tipocliente || ''}
            onValueChange={(value) => handleClienteChange('tipocliente', value)}
            error={error?.tipocliente}
            required
          />
          <SelectInput
            name="sit_tributaria"
            label="Situação Tributária"
            options={situacaoTributariaOptions}
            defaultValue={cliente.sit_tributaria?.toString() || ''}
            onValueChange={(value) =>
              handleClienteChange('sit_tributaria', Number(value))
            }
            error={error?.sit_tributaria}
            required
          />
          <SelectInput
            name="tipoemp"
            label="Tipo Empresa"
            options={tipoEmpresaOptions}
            defaultValue={cliente.tipoemp || ''}
            onValueChange={(value) => handleClienteChange('tipoemp', value)}
            error={error?.tipoemp}
          />

          <SearchSelectInput
            name="classecliente"
            label="Classe Cliente"
            options={ccOptions}
            value={cliente.codcc ?? ''}
            onValueChange={(value) => handleClienteChange('codcc', value)}
            onInputChange={(value) =>
              handleSearchOptionsChange('cCliente', value)
            }
            error={error?.codcc}
            required
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <CheckInput
            name="isentoim"
            label="Isento IM"
            onChange={(e) => setDisable('disableIm', e.target.checked)}
            checked={disableFields.disableIm}
          />
          <CheckInput
            name="isentoie"
            label="Isento IE"
            onChange={(e) => setDisable('disableIe', e.target.checked)}
            checked={disableFields.disableIe}
          />
          <CheckInput
            name="isentosuf"
            label="Isento Suframa"
            onChange={(e) => setDisable('disableSuf', e.target.checked)}
            checked={disableFields.disableSuf}
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <FormInput
            name="imun"
            type="text"
            label="Inscrição Municipal"
            defaultValue={cliente.imun || ''}
            onChange={(e) => {
              handleClienteChange(
                'imun',
                disableFields.disableIm ? 'ISENTO' : e.target.value,
              );
            }}
            error={error?.imun}
            disabled={disableFields.disableIm}
          />
          <FormInput
            name="iest"
            type="text"
            label="Inscrição Estadual"
            defaultValue={cliente.iest || ''}
            onChange={(e) => {
              handleClienteChange(
                'iest',
                disableFields.disableIe ? 'ISENTO' : e.target.value,
              );
            }}
            error={error?.iest}
            disabled={disableFields.disableIe}
          />
          <FormInput
            name="isuframa"
            type="text"
            label="Inscrição Suframa"
            defaultValue={cliente.isuframa || ''}
            onChange={(e) => {
              handleClienteChange(
                'isuframa',
                disableFields.disableSuf ? 'ISENTO' : e.target.value,
              );
            }}
            error={error?.isuframa}
            disabled={disableFields.disableSuf}
          />
          <SelectInput
            name="habilitasuframa"
            label="Habilita Suframa"
            options={habilitaSuframaOptions}
            defaultValue={cliente.habilitasuframa || ''}
            onValueChange={(value) =>
              handleClienteChange('habilitasuframa', value)
            }
            error={error?.habilitasuframa}
          />
        </div>

        <FormInput
          name="obs"
          type="text"
          label="Observação"
          defaultValue={cliente.obs || ''}
          onChange={(e) => handleClienteChange('obs', e.target.value)}
          error={error?.obs}
        />
      </div>
      <Toaster />
    </div>
  );
};

export default DadosCadastrais;
