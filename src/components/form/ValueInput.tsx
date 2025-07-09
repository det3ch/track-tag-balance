
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ValueInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ValueInput: React.FC<ValueInputProps> = ({ value, onChange }) => {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string
    if (inputValue === '') {
      onChange('');
      return;
    }
    
    // Allow valid decimal numbers
    if (/^\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent cursor jump on decimal point
    if (e.key === '.' && value.includes('.')) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <Label htmlFor="value">Value (R$)</Label>
      <Input
        id="value"
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        placeholder="0.00"
        required
      />
    </div>
  );
};

export default ValueInput;
