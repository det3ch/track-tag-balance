import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ChevronUp, ChevronDown, Trash2, Edit, Check, X } from 'lucide-react';
import type { Expense } from '@/pages/Index';

interface EditableExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onUpdateExpense: (id: string, updates: Partial<Expense>, applyToRecurring?: boolean) => void;
}

type SortField = 'name' | 'date' | 'tag' | 'value';
type SortDirection = 'asc' | 'desc';

const EditableExpenseList: React.FC<EditableExpenseListProps> = ({ expenses, onDeleteExpense, onUpdateExpense }) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Expense>>({});
  const [showRecurringDialog, setShowRecurringDialog] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<{ id: string; updates: Partial<Expense> } | null>(null);

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

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditForm({
      name: expense.name,
      tag: expense.tag,
      tagColor: expense.tagColor,
      tagIcon: expense.tagIcon,
      bank: expense.bank,
      bankColor: expense.bankColor,
      value: expense.value,
      date: expense.date
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    const expense = expenses.find(e => e.id === editingId);
    if (!expense) return;

    if (expense.recurring && expense.installments > 1) {
      setPendingUpdate({ id: editingId, updates: editForm });
      setShowRecurringDialog(true);
    } else {
      onUpdateExpense(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleRecurringUpdate = (applyToAll: boolean) => {
    if (!pendingUpdate) return;
    
    onUpdateExpense(pendingUpdate.id, pendingUpdate.updates, applyToAll);
    setShowRecurringDialog(false);
    setPendingUpdate(null);
    setEditingId(null);
    setEditForm({});
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

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
        Total: {expenses.length} expenses | Total Amount: {formatCurrency(expenses.reduce((sum, exp) => sum + exp.value, 0))}
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
                <TableCell className="font-medium">
                  {editingId === expense.id ? (
                    <Input
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full"
                    />
                  ) : (
                    expense.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === expense.id ? (
                    <Input
                      type="date"
                      value={editForm.date ? new Date(editForm.date).toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, date: new Date(e.target.value) }))}
                      className="w-full"
                    />
                  ) : (
                    expense.date.toLocaleDateString()
                  )}
                </TableCell>
                <TableCell>
                  {editingId === expense.id ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        value={editForm.tag || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, tag: e.target.value }))}
                        className="flex-1"
                        placeholder="Category"
                      />
                      <Input
                        type="color"
                        value={editForm.tagColor || '#3b82f6'}
                        onChange={(e) => setEditForm(prev => ({ ...prev, tagColor: e.target.value }))}
                        className="w-12 h-8"
                      />
                      <Input
                        value={editForm.tagIcon || '💰'}
                        onChange={(e) => setEditForm(prev => ({ ...prev, tagIcon: e.target.value }))}
                        className="w-16"
                        placeholder="Icon"
                      />
                    </div>
                  ) : (
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
                  )}
                </TableCell>
                <TableCell>
                  {editingId === expense.id ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        value={editForm.bank || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bank: e.target.value }))}
                        className="flex-1"
                        placeholder="Bank"
                      />
                      <Input
                        type="color"
                        value={editForm.bankColor || '#3b82f6'}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bankColor: e.target.value }))}
                        className="w-12 h-8"
                      />
                    </div>
                  ) : (
                    <Badge 
                      style={{ 
                        backgroundColor: expense.bankColor,
                        color: 'white'
                      }}
                      className="flex items-center gap-1 w-fit"
                    >
                      {expense.bank}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {editingId === expense.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editForm.value || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                      className="w-24 text-right"
                    />
                  ) : (
                    formatCurrency(expense.value)
                  )}
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
                  <div className="flex gap-2">
                    {editingId === expense.id ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEdit}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(expense)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{expense.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDeleteExpense(expense.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showRecurringDialog} onOpenChange={setShowRecurringDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Recurring Expense</DialogTitle>
            <DialogDescription>
              This expense is part of a recurring series. Would you like to apply these changes to all future recurring instances as well?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleRecurringUpdate(false)}>
              This Instance Only
            </Button>
            <Button onClick={() => handleRecurringUpdate(true)}>
              All Future Instances
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditableExpenseList;