import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
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
  const uniqueBanks = [...new Set(expenses.map(e => e.bank))].sort();
  const uniqueCategories = [...new Set(expenses.map(e => e.tag))].sort();

  const updateFilter = (key: keyof ExpenseFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleBankChange = (value: string) => {
    updateFilter('bank', value === 'all' ? '' : value);
  };

  const handleCategoryChange = (value: string) => {
    updateFilter('category', value === 'all' ? '' : value);
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
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div>
            <Label>Category</Label>
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
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseFiltersComponent;