
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import type { Expense } from '@/pages/Index';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

const bankPresets = [
  { name: 'BTG', color: '221 83% 53%', textColor: 'white' },
  { name: 'Nubank', color: '271 81% 56%', textColor: 'white' },
  { name: 'Itaú', color: '214 100% 20%', textColor: 'hsl(25, 95%, 53%)' },
  { name: 'Inter', color: '25 95% 53%', textColor: 'white' }
];

const defaultCategories = [
  { name: 'Food', icon: '🍔', color: '#ef4444' },
  { name: 'Transport', icon: '🚗', color: '#3b82f6' },
  { name: 'Education', icon: '🎓', color: '#8b5cf6' },
  { name: 'Health', icon: '🏥', color: '#10b981' },
  { name: 'Entertainment', icon: '🎮', color: '#f59e0b' },
  { name: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { name: 'Utilities', icon: '⚡', color: '#6b7280' },
  { name: 'Home', icon: '🏠', color: '#14b8a6' },
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

  const [categories, setCategories] = useState(defaultCategories);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

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

  const handleValueChange = (value: string) => {
    // Remove any non-digit characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    setFormData(prev => ({ ...prev, value: cleanValue }));
  };

  const handleValueBlur = (value: string) => {
    const number = value.replace(/[^0-9.-]+/g, '');
    if (number === '') return;
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(number));
    setFormData(prev => ({ ...prev, value: formatted }));
  };

  const handleCategorySelect = (value: string) => {
    if (value === 'add-new') {
      setShowNewCategory(true);
      return;
    }

    const category = categories.find(cat => cat.name === value);
    if (category) {
      setFormData(prev => ({
        ...prev,
        tag: category.name,
        tagColor: category.color,
        tagIcon: category.icon
      }));
    }
  };

  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory = {
      name: newCategoryName,
      icon: formData.tagIcon,
      color: formData.tagColor
    };
    
    setCategories(prev => [...prev, newCategory]);
    setFormData(prev => ({ ...prev, tag: newCategoryName }));
    setShowNewCategory(false);
    setNewCategoryName('');
  };

  const handleBankSelect = (bankName: string) => {
    const selectedBank = bankPresets.find(p => p.name === bankName);
    if (selectedBank) {
      setFormData(prev => ({ 
        ...prev, 
        bank: bankName,
        bankColor: `hsl(${selectedBank.color})`
      }));
    }
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

        <div className="md:col-span-2">
          <Label htmlFor="category">Category</Label>
          {showNewCategory ? (
            <div className="space-y-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
              />
              <div className="flex gap-2">
                <Input
                  value={formData.tagIcon}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagIcon: e.target.value }))}
                  placeholder="Icon"
                  className="w-20"
                />
                <input
                  type="color"
                  value={formData.tagColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagColor: e.target.value }))}
                  className="w-12 h-10 rounded border"
                />
                <Button type="button" onClick={handleAddNewCategory} size="sm">
                  Add
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowNewCategory(false);
                    setNewCategoryName('');
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
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
          ) : (
            <div className="space-y-2">
              <Select value={formData.tag} onValueChange={handleCategorySelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category">
                    {formData.tag && (
                      <div className="flex items-center gap-2">
                        <span>{formData.tagIcon}</span>
                        <span>{formData.tag}</span>
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: formData.tagColor }}
                        />
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.name} value={category.name}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: category.color }}
                        />
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="add-new">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Add new Category</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {formData.tag && (
                <div className="flex gap-2 items-center">
                  <Input
                    value={formData.tagIcon}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagIcon: e.target.value }))}
                    placeholder="Icon"
                    className="w-20"
                  />
                  <input
                    type="color"
                    value={formData.tagColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagColor: e.target.value }))}
                    className="w-12 h-10 rounded border"
                  />
                  <div className="flex flex-wrap gap-1">
                    {commonIcons.slice(0, 5).map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, tagIcon: icon }))}
                        className="p-1 hover:bg-muted rounded text-sm"
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
                onClick={() => handleBankSelect(bank.name)}
                style={{ 
                  backgroundColor: `hsl(${bank.color})`,
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
            onChange={(e) => handleValueChange(e.target.value)}
            onBlur={(e) => handleValueBlur(e.target.value)}
            placeholder="0.00"
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
