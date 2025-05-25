import React from 'react';
import { Cliente } from '@/data/clientes/clientes';
import FormInput from '@/components/common/FormInput';
import CheckInput from '@/components/common/CheckInput';
import MultiSearchSelectInput from '@/components/common/MultiSearchSelectInput';
import SelectInput from '@/components/common/SelectInput';
import { Bancos } from '@/data/bancos/bancos';
import { CadClienteSearchOptions } from '../modalCadastrar';

const descontoAplicadoOptions = [
  { value: '0', label: 'Balcão' },
  { value: '1', label: 'ZFM' },
  { value: '2', label: 'Interior' },
  { value: '3', label: 'ALC' },
  { value: '4', label: 'Amaz. Ocidental' },
  { value: '5', label: 'Fora Estado' },
  { value: '6', label: 'Fora Estado Balcão' },
  { value: '7', label: 'Boa Vista' },
];

interface DadosComerciaisProps {
  cliente: Cliente;
  handleClienteChange: (field: keyof Cliente, value: any) => void;
  error?: { [key: string]: string };
  isEdit?: boolean;
  options: { bancos: Bancos };
  handleSearchOptionsChange: (
    option: CadClienteSearchOptions,
    value: string,
  ) => void;
}

const DadosComerciais: React.FC<DadosComerciaisProps> = ({
  cliente,
  handleClienteChange,
  error,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-2 gap-12">
        <div className="grid grid-rows gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="acrescimo"
              type="number"
              label="Acréscimo"
              defaultValue={cliente.acrescimo || ''}
              onChange={(e) =>
                handleClienteChange('acrescimo', Number(e.target.value))
              }
              error={error?.acrescimo}
            />
            <FormInput
              name="desconto"
              type="number"
              label="Desconto"
              defaultValue={cliente.desconto || ''}
              onChange={(e) =>
                handleClienteChange('desconto', Number(e.target.value))
              }
              error={error?.desconto}
            />
          </div>
          <CheckInput
            label="Preço de Venda Kick Back"
            name="kickback"
            onChange={(e) =>
              handleClienteChange('kickback', e.target.checked ? 1 : 0)
            }
            checked={
              cliente.kickback !== null &&
              cliente.kickback !== undefined &&
              cliente.kickback !== 0
            }
            error={error?.kickback}
            required
          />
          <MultiSearchSelectInput
            name="Vendedores Externos"
            options={[]}
            required
          />
        </div>
        <div className="grid grid-rows gap-4">
          <SelectInput
            name="prvenda"
            label="Desconto Aplicado"
            options={descontoAplicadoOptions}
            defaultValue={cliente.prvenda || ''}
            onValueChange={(value) => handleClienteChange('prvenda', value)}
            error={error?.prvenda}
            required
          />
          <CheckInput
            label="Bloquear Preço de Venda"
            name="bloquear_preco"
            onChange={(e) =>
              handleClienteChange(
                'bloquear_preco',
                e.target.checked ? 'S' : 'N',
              )
            }
            checked={
              cliente.bloquear_preco !== '' &&
              cliente.bloquear_preco !== undefined &&
              cliente.bloquear_preco !== 'N'
            }
            error={error?.bloquear_preco}
            required
          />
          <MultiSearchSelectInput name="Vendedores TMK" options={[]} />
        </div>
      </div>
    </div>
  );
};

export default DadosComerciais;
