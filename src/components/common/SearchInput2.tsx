import { Input } from '@/components/ui/input';
import React from 'react';

interface SearchInputProps {
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  value?: string; // <-- controle do valor atual
}

const SearchInput = ({
  placeholder,
  value,
  onChange,
  onKeyDown,
  onBlur,
}: SearchInputProps) => {
  return (
    <Input
      type="search"
      value={value}
      placeholder={placeholder || 'Pesquisar...'}
      className="w-full px-2 py-1 border-b border-gray-300 dark:border-zinc-600 text-sm"
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    />
  );
};

export default SearchInput;
