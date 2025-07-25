
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Edit, Check, X } from 'lucide-react';
import type { Expense } from '@/pages/Index';

interface EditableExpenseRowProps {
  expense: Expense;
  onUpdate: (id: string, updates: Partial<Expense>, applyToRecurring?: boolean) => void;
  onDelete: (id: string) => void;
}

const EditableExpenseRow: React.FC<EditableExpenseRowProps> = ({
  expense,
  onUpdate,
  onDelete
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editedExpense, setEditedExpense] = useState<Expense>(expense);
  const [showRecurringDialog, setShowRecurringDialog] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<Partial<Expense> | null>(null);

  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEdit = (field: string) => {
    let updates: Partial<Expense> = {};
    
    if (field === 'name') {
      if (!editedExpense.name.trim()) return;
      updates = {
        name: editedExpense.name,
        currentInstallment: editedExpense.currentInstallment,
        installments: editedExpense.installments
      };
    } else if (field === 'value') {
      const numValue = parseFloat(editValue);
      if (isNaN(numValue)) return;
      updates.value = numValue;
    } else if (field === 'tag') {
      if (!editValue.trim()) return;
      updates.tag = editValue;
    } else if (field === 'bank') {
      if (!editValue.trim()) return;
      updates.bank = editValue;
    } else if (field === 'date') {
      updates.date = new Date(editValue);
    }

    if (expense.recurring && Object.keys(updates).length > 0) {
      setPendingUpdate(updates);
      setShowRecurringDialog(true);
      setEditingField(null);
      return;
    }

    onUpdate(expense.id, updates);
    setEditingField(null);
  };

  const handleRecurringUpdate = (applyToAll: boolean) => {
    if (pendingUpdate) {
      onUpdate(expense.id, pendingUpdate, applyToAll);
    }
    setShowRecurringDialog(false);
    setPendingUpdate(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderEditableField = (field: string, value: string, type: string = 'text') => {
    if (editingField === field) {
      return (
        <div className="flex items-center gap-1">
          <Input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 min-w-[100px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit(field);
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="icon" variant="ghost" onClick={() => saveEdit(field)} className="h-6 w-6">
            <Check className="h-3 w-3" />
          </Button>
          <Button size="icon" variant="ghost" onClick={cancelEdit} className="h-6 w-6">
            <X className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    return (
      <div 
        className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded flex items-center gap-1"
        onClick={() => startEdit(field, field === 'date' ? expense.date.toISOString().split('T')[0] : value)}
      >
        <span>{value}</span>
        <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100" />
      </div>
    );
  };

  return (
    <>
      <tr className="group hover:bg-muted/50">
        <td className="p-2">
          {editingField === 'name' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Input
                  value={editedExpense.name}
                  onChange={(e) => setEditedExpense(prev => ({ ...prev, name: e.target.value }))}
                  className="h-8 min-w-[100px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit('name');
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  autoFocus
                />
                <Button size="icon" variant="ghost" onClick={() => saveEdit('name')} className="h-6 w-6">
                  <Check className="h-3 w-3" />
                </Button>
                <Button size="icon" variant="ghost" onClick={cancelEdit} className="h-6 w-6">
                  <X className="h-3 w-3" />
                </Button>
              </div>
              {editedExpense.recurring && (
                <div className="flex gap-2 items-center text-xs">
                  <span>Installment:</span>
                  <Input
                    type="number"
                    min="1"
                    max={editedExpense.installments}
                    value={editedExpense.currentInstallment}
                    onChange={(e) => setEditedExpense(prev => ({ 
                      ...prev, 
                      currentInstallment: Math.max(1, Math.min(prev.installments, Number(e.target.value))) 
                    }))}
                    className="w-16 h-6 text-xs"
                  />
                  <span>/</span>
                  <Input
                    type="number"
                    min="1"
                    value={editedExpense.installments}
                    onChange={(e) => setEditedExpense(prev => ({ 
                      ...prev, 
                      installments: Math.max(1, Number(e.target.value)) 
                    }))}
                    className="w-16 h-6 text-xs"
                  />
                </div>
              )}
            </div>
          ) : (
            <div 
              className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded flex items-center gap-1"
              onClick={() => {
                setEditingField('name');
                setEditedExpense(expense);
              }}
            >
              <span className="font-medium">
                {expense.name}
                {expense.recurring && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({expense.currentInstallment}/{expense.installments})
                  </span>
                )}
              </span>
              <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100" />
            </div>
          )}
        </td>
        <td className="p-2">
          {renderEditableField('date', formatDate(expense.date), 'date')}
        </td>
        <td className="p-2">
          <div className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded flex items-center gap-1"
               onClick={() => startEdit('tag', expense.tag)}>
            <Badge 
              variant="outline" 
              className="text-white border-none"
              style={{ backgroundColor: expense.tagColor }}
            >
              <span className="mr-1">{expense.tagIcon}</span>
              {expense.tag}
            </Badge>
            <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100" />
          </div>
        </td>
        <td className="p-2">
          <div className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded flex items-center gap-1"
               onClick={() => startEdit('bank', expense.bank)}>
            <Badge 
              variant="outline" 
              className="text-white border-none"
              style={{ backgroundColor: expense.bankColor }}
            >
              {expense.bank}
            </Badge>
            <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100" />
          </div>
        </td>
        <td className="p-2">
          {renderEditableField('value', `R$ ${expense.value.toFixed(2)}`)}
        </td>
        <td className="p-2">
          {expense.recurring ? (
            <Badge variant="secondary">
              Recurring ({expense.installments}x)
            </Badge>
          ) : (
            <Badge variant="outline">One-time</Badge>
          )}
        </td>
        <td className="p-2">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(expense.id)}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </td>
      </tr>

      <Dialog open={showRecurringDialog} onOpenChange={setShowRecurringDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Recurring Expense</DialogTitle>
            <DialogDescription>
              This is a recurring expense. Do you want to apply this change to all future occurrences?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleRecurringUpdate(false)}>
              This One Only
            </Button>
            <Button onClick={() => handleRecurringUpdate(true)}>
              All Future Occurrences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditableExpenseRow;
