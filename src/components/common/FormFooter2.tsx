import React from 'react';
import { DefaultButton, AuxButton } from './Buttons2';
import { Oval } from 'react-loader-spinner'; // Importe o componente de carregamento

interface FormFooterProps {
  onSubmit: () => void;
  onClear: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}

const FormFooter: React.FC<FormFooterProps> = ({
  onSubmit,
  onClear,
  isSaving,
  hasChanges,
}) => {
  return (
    <footer className="mt-0 flex justify-end space-x-4">
      <AuxButton onClick={onClear} text="Limpar" />
      <DefaultButton
        onClick={onSubmit}
        disabled={!hasChanges || isSaving}
        className={` ${
          !hasChanges || isSaving ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        text={
          isSaving ? (
            <Oval
              height={40}
              width={40}
              color="currentColor"
              secondaryColor="currentColor"
              strokeWidth={4}
            />
          ) : (
            'Salvar'
          )
        }
      />
    </footer>
  );
};

export default FormFooter;
