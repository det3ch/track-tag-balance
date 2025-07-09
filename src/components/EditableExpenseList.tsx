
import React from 'react';
import EditableExpenseRow from './expense-list/EditableExpenseRow';
import type { Expense } from '@/pages/Index';

interface EditableExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onUpdateExpense: (id: string, updates: Partial<Expense>, applyToRecurring?: boolean) => void;
}

const EditableExpenseList: React.FC<EditableExpenseListProps> = ({
  expenses,
  onDeleteExpense,
  onUpdateExpense
}) => {
  const sortedExpenses = [...expenses].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-4">
      {expenses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No expenses recorded yet. Add your first expense above!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Name</th>
                <th className="text-left p-2 font-medium">Date</th>
                <th className="text-left p-2 font-medium">Category</th>
                <th className="text-left p-2 font-medium">Bank</th>
                <th className="text-left p-2 font-medium">Value</th>
                <th className="text-left p-2 font-medium">Type</th>
                <th className="text-left p-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedExpenses.map((expense) => (
                <EditableExpenseRow
                  key={expense.id}
                  expense={expense}
                  onUpdate={onUpdateExpense}
                  onDelete={onDeleteExpense}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EditableExpenseList;
