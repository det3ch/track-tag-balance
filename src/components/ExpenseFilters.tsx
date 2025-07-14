import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Expense } from '@/pages/Index';

export interface ExpenseFilters {
  name: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  minValue: string;
  maxValue: string;
  bank: string;
  category: string;
}

interface CustomBank {
  name: string;
  color: string;
}

interface CustomCategory {
  name: string;
  icon: string;
  color: string;
}

interface ExpenseFiltersProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
  expenses: Expense[];
}

const ExpenseFiltersComponent: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFiltersChange,
  expenses
}) => {
  const [customBanks, setCustomBanks] = useState<CustomBank[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [showAddBankDialog, setShowAddBankDialog] = useState(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [newBankColor, setNewBankColor] = useState('#3b82f6');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('💰');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');

  // Load custom banks and categories from localStorage
  useEffect(() => {
    const savedBanks = localStorage.getItem('customBanks');
    if (savedBanks) {
      setCustomBanks(JSON.parse(savedBanks));
    }
    
    const savedCategories = localStorage.getItem('customCategories');
    if (savedCategories) {
      setCustomCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save to localStorage when custom data changes
  useEffect(() => {
    localStorage.setItem('customBanks', JSON.stringify(customBanks));
  }, [customBanks]);

  useEffect(() => {
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
  }, [customCategories]);

  const uniqueBanks = [...new Set([
    ...expenses.map(e => e.bank).filter(bank => bank && bank.trim() !== ''),
    ...customBanks.map(b => b.name)
  ])].sort();
  
  const uniqueCategories = [...new Set([
    ...expenses.map(e => e.tag).filter(tag => tag && tag.trim() !== ''),
    ...customCategories.map(c => c.name)
  ])].sort();

  const updateFilter = (key: keyof ExpenseFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleBankChange = (value: string) => {
    if (value === 'add-new') {
      setShowAddBankDialog(true);
      return;
    }
    updateFilter('bank', value === 'all' ? '' : value);
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'add-new') {
      setShowAddCategoryDialog(true);
      return;
    }
    updateFilter('category', value === 'all' ? '' : value);
  };

  const handleAddBank = () => {
    if (!newBankName.trim()) return;

    const newBank = {
      name: newBankName,
      color: newBankColor
    };

    setCustomBanks(prev => [...prev, newBank]);
    updateFilter('bank', newBank.name);

    setNewBankName('');
    setNewBankColor('#3b82f6');
    setShowAddBankDialog(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory = {
      name: newCategoryName,
      icon: newCategoryIcon,
      color: newCategoryColor
    };

    setCustomCategories(prev => [...prev, newCategory]);
    updateFilter('category', newCategory.name);

    setNewCategoryName('');
    setNewCategoryIcon('💰');
    setNewCategoryColor('#3b82f6');
    setShowAddCategoryDialog(false);
  };

  const deleteCustomBank = (bankName: string) => {
    setCustomBanks(prev => prev.filter(b => b.name !== bankName));
    if (filters.bank === bankName) {
      updateFilter('bank', '');
    }
  };

  const deleteCustomCategory = (categoryName: string) => {
    setCustomCategories(prev => prev.filter(c => c.name !== categoryName));
    if (filters.category === categoryName) {
      updateFilter('category', '');
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      name: '',
      dateFrom: null,
      dateTo: null,
      minValue: '',
      maxValue: '',
      bank: '',
      category: ''
    });
  };

  const hasActiveFilters = filters.name || filters.dateFrom || filters.dateTo || 
    filters.minValue || filters.maxValue || filters.bank || filters.category;

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Filter Expenses</CardTitle>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Name Filter */}
          <div>
            <Label htmlFor="name-filter">Name</Label>
            <Input
              id="name-filter"
              type="text"
              placeholder="Search by name..."
              value={filters.name}
              onChange={(e) => updateFilter('name', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Date From */}
          <div>
            <Label>Date From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-1 justify-start text-left font-normal",
                    !filters.dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? format(filters.dateFrom, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(date) => updateFilter('dateFrom', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To */}
          <div>
            <Label>Date To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-1 justify-start text-left font-normal",
                    !filters.dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? format(filters.dateTo, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateTo}
                  onSelect={(date) => updateFilter('dateTo', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Min Value */}
          <div>
            <Label htmlFor="min-value">Min Value</Label>
            <Input
              id="min-value"
              type="number"
              placeholder="Minimum amount"
              value={filters.minValue}
              onChange={(e) => updateFilter('minValue', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Max Value */}
          <div>
            <Label htmlFor="max-value">Max Value</Label>
            <Input
              id="max-value"
              type="number"
              placeholder="Maximum amount"
              value={filters.maxValue}
              onChange={(e) => updateFilter('maxValue', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Bank Filter */}
          <div>
            <Label>Bank</Label>
            <div className="space-y-2">
              <Select value={filters.bank || 'all'} onValueChange={handleBankChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Banks</SelectItem>
                  {uniqueBanks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                  <SelectItem value="add-new">
                    <div className="flex items-center gap-2">
                      <span>➕</span>
                      + Add new Bank
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {filters.bank && customBanks.some(b => b.name === filters.bank) && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {filters.bank}
                  </Badge>
                  <button
                    onClick={() => deleteCustomBank(filters.bank)}
                    className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete custom bank
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <Label>Category</Label>
            <div className="space-y-2">
              <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="add-new">
                    <div className="flex items-center gap-2">
                      <span>➕</span>
                      + Add new Category
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {filters.category && customCategories.some(c => c.name === filters.category) && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {customCategories.find(c => c.name === filters.category)?.icon} {filters.category}
                  </Badge>
                  <button
                    onClick={() => deleteCustomCategory(filters.category)}
                    className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete custom category
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Add Bank Dialog */}
      <Dialog open={showAddBankDialog} onOpenChange={setShowAddBankDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Bank</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input
                id="bank-name"
                value={newBankName}
                onChange={(e) => setNewBankName(e.target.value)}
                placeholder="Enter bank name"
              />
            </div>
            
            <div>
              <Label htmlFor="bank-color">Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="bank-color"
                  type="color"
                  value={newBankColor}
                  onChange={(e) => setNewBankColor(e.target.value)}
                  className="w-8 h-8 rounded border"
                />
                <span>{newBankColor}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddBank} className="flex-1">
                Add Bank
              </Button>
              <Button variant="outline" onClick={() => setShowAddBankDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            
            <div>
              <Label htmlFor="category-icon">Icon (emoji)</Label>
              <Input
                id="category-icon"
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                placeholder="💰"
              />
            </div>
            
            <div>
              <Label htmlFor="category-color">Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="category-color"
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-8 h-8 rounded border"
                />
                <span>{newCategoryColor}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddCategory} className="flex-1">
                Add Category
              </Button>
              <Button variant="outline" onClick={() => setShowAddCategoryDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ExpenseFiltersComponent;