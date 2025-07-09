
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import BankSelector from './form/BankSelector';
import CategorySelector from './form/CategorySelector';
import ValueInput from './form/ValueInput';
import type { Expense } from '@/pages/Index';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tag, setTag] = useState('');
  const [tagColor, setTagColor] = useState('#3b82f6');
  const [tagIcon, setTagIcon] = useState('💰');
  const [bank, setBank] = useState('');
  const [bankColor, setBankColor] = useState('#3b82f6');
  const [value, setValue] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [installments, setInstallments] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !value || !tag || !bank) return;

    const expense = {
      name,
      date: new Date(date),
      tag,
      tagColor,
      tagIcon,
      bank,
      bankColor,
      value: parseFloat(value),
      recurring,
      installments: recurring ? installments : 1
    };

    onAddExpense(expense);

    // Reset form
    setName('');
    setDate(new Date().toISOString().split('T')[0]);
    setTag('');
    setTagColor('#3b82f6');
    setTagIcon('💰');
    setBank('');
    setBankColor('#3b82f6');
    setValue('');
    setRecurring(false);
    setInstallments(1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Expense Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter expense name"
            required
          />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <CategorySelector
        tag={tag}
        tagColor={tagColor}
        tagIcon={tagIcon}
        onTagChange={setTag}
        onTagColorChange={setTagColor}
        onTagIconChange={setTagIcon}
      />

      <BankSelector
        bank={bank}
        bankColor={bankColor}
        onBankChange={setBank}
        onBankColorChange={setBankColor}
      />

      <ValueInput
        value={value}
        onChange={setValue}
      />

      <div className="flex items-center space-x-2">
        <Checkbox
          id="recurring"
          checked={recurring}
          onCheckedChange={setRecurring}
        />
        <Label htmlFor="recurring">Recurring Expense</Label>
      </div>

      {recurring && (
        <div>
          <Label htmlFor="installments">Number of Installments</Label>
          <Input
            id="installments"
            type="number"
            min="2"
            value={installments}
            onChange={(e) => setInstallments(parseInt(e.target.value))}
            placeholder="Number of installments"
          />
        </div>
      )}

      <Button type="submit" className="w-full">
        Add Expense
      </Button>
    </form>
  );
};

export default ExpenseForm;
