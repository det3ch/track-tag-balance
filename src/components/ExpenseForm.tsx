
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { Expense } from '@/pages/Index';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

const bankPresets = [
  { name: 'BTG', color: 'hsl(221, 83%, 53%)', textColor: 'white' },
  { name: 'Nubank', color: 'hsl(271, 81%, 56%)', textColor: 'white' },
  { name: 'Itaú', color: 'hsl(221, 83%, 53%)', textColor: 'hsl(25, 95%, 53%)' },
  { name: 'Inter', color: 'hsl(25, 95%, 53%)', textColor: 'white' }
];

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: new Date(),
    tag: '',
    tagColor: '#3b82f6',
    tagIcon: '💰',
    bank: '',
    bankColor: '#3b82f6',
    value: '',
    recurring: false,
    installments: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.tag || !formData.value) return;

    onAddExpense({
      name: formData.name,
      date: formData.date,
      tag: formData.tag,
      tagColor: formData.tagColor,
      tagIcon: formData.tagIcon,
      bank: formData.bank,
      bankColor: formData.bankColor,
      value: parseFloat(formData.value.replace(/[^0-9.-]+/g, '')),
      recurring: formData.recurring,
      installments: formData.installments
    });

    // Reset form
    setFormData({
      name: '',
      date: new Date(),
      tag: '',
      tagColor: '#3b82f6',
      tagIcon: '💰',
      bank: '',
      bankColor: '#3b82f6',
      value: '',
      recurring: false,
      installments: 1
    });
  };

  const formatCurrency = (value: string) => {
    // Only format when the input loses focus, not during typing
    return value;
  };

  const handleValueBlur = (value: string) => {
    const number = value.replace(/[^0-9.-]+/g, '');
    if (number === '') return '';
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(number));
    setFormData(prev => ({ ...prev, value: formatted }));
  };

  const commonIcons = ['💰', '🏠', '🚗', '🍔', '🎮', '👕', '⚡', '📱', '🏥', '🎓'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Expense name"
            required
          />
        </div>

        <div>
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(formData.date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="tag">Tag (Category)</Label>
          <Input
            id="tag"
            value={formData.tag}
            onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
            placeholder="e.g., Food, Transport"
            required
          />
        </div>

        <div>
          <Label htmlFor="tagColor">Tag Color</Label>
          <div className="flex gap-2">
            <input
              type="color"
              id="tagColor"
              value={formData.tagColor}
              onChange={(e) => setFormData(prev => ({ ...prev, tagColor: e.target.value }))}
              className="w-12 h-10 rounded border"
            />
            <Input
              value={formData.tagColor}
              onChange={(e) => setFormData(prev => ({ ...prev, tagColor: e.target.value }))}
              placeholder="#3b82f6"
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="tagIcon">Tag Icon</Label>
          <div className="flex gap-2">
            <Input
              id="tagIcon"
              value={formData.tagIcon}
              onChange={(e) => setFormData(prev => ({ ...prev, tagIcon: e.target.value }))}
              placeholder="💰"
              className="flex-1"
            />
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {commonIcons.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tagIcon: icon }))}
                className="p-1 hover:bg-muted rounded text-lg"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="bank">Bank</Label>
          <Input
            id="bank"
            value={formData.bank}
            onChange={(e) => setFormData(prev => ({ ...prev, bank: e.target.value }))}
            placeholder="e.g., BTG, Nubank"
            required
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {bankPresets.map(bank => (
              <button
                key={bank.name}
                type="button"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  bank: bank.name,
                  bankColor: bank.color
                }))}
                style={{ 
                  backgroundColor: bank.color,
                  color: bank.textColor
                }}
                className="px-2 py-1 rounded text-sm font-medium"
              >
                {bank.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="bankColor">Bank Color</Label>
          <div className="flex gap-2">
            <input
              type="color"
              id="bankColor"
              value={formData.bankColor}
              onChange={(e) => setFormData(prev => ({ ...prev, bankColor: e.target.value }))}
              className="w-12 h-10 rounded border"
            />
            <Input
              value={formData.bankColor}
              onChange={(e) => setFormData(prev => ({ ...prev, bankColor: e.target.value }))}
              placeholder="#3b82f6"
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            onBlur={(e) => handleValueBlur(e.target.value)}
            placeholder="$0.00"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="recurring"
            checked={formData.recurring}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, recurring: !!checked }))}
          />
          <Label htmlFor="recurring">Recurring</Label>
        </div>

        {formData.recurring && (
          <div>
            <Label htmlFor="installments">Installments (Months)</Label>
            <Input
              id="installments"
              type="number"
              min="1"
              max="60"
              value={formData.installments}
              onChange={(e) => setFormData(prev => ({ ...prev, installments: parseInt(e.target.value) || 1 }))}
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        Save Expense
      </Button>
    </form>
  );
};

export default ExpenseForm;
