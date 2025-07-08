
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import type { Expense } from '@/pages/Index';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

type SortField = 'name' | 'date' | 'tag' | 'value';
type SortDirection = 'asc' | 'desc';

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense }) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortField === 'value') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [expenses, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No expenses recorded yet. Add your first expense above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Total: {expenses.length} expenses | Total Amount: ${expenses.reduce((sum, exp) => sum + exp.value, 0).toFixed(2)}
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted select-none"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Name
                  <SortIcon field="name" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted select-none"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-2">
                  Date
                  <SortIcon field="date" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted select-none"
                onClick={() => handleSort('tag')}
              >
                <div className="flex items-center gap-2">
                  Category
                  <SortIcon field="tag" />
                </div>
              </TableHead>
              <TableHead>Bank</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted select-none text-right"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center gap-2 justify-end">
                  Value
                  <SortIcon field="value" />
                </div>
              </TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedExpenses.map((expense) => (
              <TableRow key={expense.id} className="hover:bg-muted">
                <TableCell className="font-medium">{expense.name}</TableCell>
                <TableCell>{expense.date.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge 
                    style={{ 
                      backgroundColor: expense.tagColor,
                      color: 'white'
                    }}
                    className="flex items-center gap-1 w-fit"
                  >
                    <span>{expense.tagIcon}</span>
                    {expense.tag}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    style={{ 
                      backgroundColor: expense.bankColor,
                      color: 'white'
                    }}
                    className="flex items-center gap-1 w-fit"
                  >
                    {expense.bank}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  ${expense.value.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {expense.recurring && (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        Recurring ({expense.installments}x)
                      </div>
                    )}
                    <div>Added: {expense.createdAt.toLocaleDateString()}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExpenseList;
