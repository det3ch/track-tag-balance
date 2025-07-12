
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseCharts from '@/components/ExpenseCharts';
import ExpenseMetrics from '@/components/ExpenseMetrics';
import EditableExpenseList from '@/components/EditableExpenseList';
import Navbar from '@/components/Navbar';

export interface Expense {
  id: string;
  name: string;
  date: Date;
  tag: string;
  tagColor: string;
  tagIcon: string;
  bank: string;
  bankColor: string;
  value: number;
  recurring: boolean;
  installments: number;
  currentInstallment: number;
  recurringGroup: string;
  createdAt: Date;
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((expense: any) => ({
        ...expense,
        date: new Date(expense.date),
        createdAt: new Date(expense.createdAt)
      }));
    }
    return [];
  });
  const [goalAmount, setGoalAmount] = useState<number>(() => {
    const saved = localStorage.getItem('goalAmount');
    return saved ? Number(saved) : 5000;
  });

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt' | 'currentInstallment' | 'recurringGroup'>) => {
    const recurringGroup = Date.now().toString();
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date(),
      currentInstallment: 1,
      recurringGroup: expense.recurring ? recurringGroup : ''
    };

    // Handle recurring expenses and installments
    if (expense.recurring && expense.installments > 1) {
      const recurringExpenses: Expense[] = [];
      for (let i = 0; i < expense.installments; i++) {
        const recurringDate = new Date(expense.date);
        recurringDate.setMonth(recurringDate.getMonth() + i);
        
        recurringExpenses.push({
          ...newExpense,
          id: `${Date.now()}-${i}`,
          date: recurringDate,
          currentInstallment: i + 1,
          recurringGroup
        });
      }
      setExpenses(prev => {
        const updated = [...prev, ...recurringExpenses];
        localStorage.setItem('expenses', JSON.stringify(updated));
        return updated;
      });
    } else {
      setExpenses(prev => {
        const updated = [...prev, newExpense];
        localStorage.setItem('expenses', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => {
      const updated = prev.filter(expense => expense.id !== id);
      localStorage.setItem('expenses', JSON.stringify(updated));
      return updated;
    });
  };

  const updateExpense = (id: string, updates: Partial<Expense>, applyToRecurring?: boolean) => {
    setExpenses(prev => {
      let updated;
      if (applyToRecurring) {
        const expense = prev.find(e => e.id === id);
        if (expense && expense.recurring && expense.recurringGroup) {
          const groupExpenses = prev.filter(e => e.recurringGroup === expense.recurringGroup);
          const sortedGroup = groupExpenses.sort((a, b) => a.currentInstallment - b.currentInstallment);
          
          // Handle currentInstallment changes - resequence from that point
          if (updates.currentInstallment && updates.currentInstallment !== expense.currentInstallment) {
            const editedExpense = sortedGroup.find(e => e.id === id);
            if (editedExpense) {
              const editedIndex = sortedGroup.findIndex(e => e.id === id);
              const newSequenceStart = updates.currentInstallment;
              
              updated = prev.map(exp => {
                if (exp.recurringGroup === expense.recurringGroup) {
                  const groupIndex = sortedGroup.findIndex(e => e.id === exp.id);
                  if (groupIndex >= editedIndex) {
                    // Resequence from the edited installment onwards
                    const newInstallmentNumber = newSequenceStart + (groupIndex - editedIndex);
                    return { ...exp, ...updates, currentInstallment: newInstallmentNumber };
                  }
                  return { ...exp, ...updates };
                }
                return exp;
              });
            } else {
              updated = prev.map(exp => 
                exp.recurringGroup === expense.recurringGroup 
                  ? { ...exp, ...updates }
                  : exp
              );
            }
          }
          // Handle installments total changes - create new installments if last item
          else if (updates.installments && updates.installments !== expense.installments) {
            const isLastInstallment = expense.currentInstallment === expense.installments;
            
            if (updates.installments < expense.installments) {
              // Remove excess installments
              const toKeep = sortedGroup.slice(0, updates.installments);
              const toRemove = sortedGroup.slice(updates.installments);
              updated = prev.filter(e => !toRemove.some(r => r.id === e.id))
                .map(exp => {
                  if (toKeep.some(k => k.id === exp.id)) {
                    return { ...exp, ...updates, installments: updates.installments };
                  }
                  return exp;
                });
            } else if (isLastInstallment && updates.installments > expense.installments) {
              // Add new installments for future months
              const newInstallments = [];
              const lastExpense = sortedGroup[sortedGroup.length - 1];
              
              for (let i = expense.installments; i < updates.installments; i++) {
                const newDate = new Date(lastExpense.date);
                newDate.setMonth(newDate.getMonth() + (i - lastExpense.currentInstallment + 1));
                
                newInstallments.push({
                  ...lastExpense,
                  ...updates,
                  id: `${expense.recurringGroup}-${i}`,
                  date: newDate,
                  currentInstallment: i + 1,
                  installments: updates.installments
                });
              }
              
              updated = prev.map(exp => 
                exp.recurringGroup === expense.recurringGroup 
                  ? { ...exp, ...updates, installments: updates.installments }
                  : exp
              ).concat(newInstallments);
            } else {
              // Apply updates to all in group
              updated = prev.map(exp => 
                exp.recurringGroup === expense.recurringGroup 
                  ? { ...exp, ...updates }
                  : exp
              );
            }
          } else {
            // Apply other updates to all in group
            updated = prev.map(exp => 
              exp.recurringGroup === expense.recurringGroup 
                ? { ...exp, ...updates }
                : exp
            );
          }
        } else {
          updated = prev.map(expense => 
            expense.id === id ? { ...expense, ...updates } : expense
          );
        }
      } else {
        updated = prev.map(expense => 
          expense.id === id ? { ...expense, ...updates } : expense
        );
      }
      localStorage.setItem('expenses', JSON.stringify(updated));
      return updated;
    });
  };

  const handleImportExpenses = (importedExpenses: Expense[]) => {
    setExpenses(prev => {
      const updated = [...prev, ...importedExpenses];
      localStorage.setItem('expenses', JSON.stringify(updated));
      return updated;
    });
  };

  // Save goal amount to localStorage when it changes
  const handleGoalChange = (newGoal: number) => {
    setGoalAmount(newGoal);
    localStorage.setItem('goalAmount', newGoal.toString());
  };

  const monthlyData = useMemo(() => {
    const monthlyTotals: { [key: string]: number } = {};
    expenses.forEach(expense => {
      const monthKey = expense.date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + expense.value;
    });
    return monthlyTotals;
  }, [expenses]);

  const categoryData = useMemo(() => {
    const categoryTotals: { [key: string]: { total: number; color: string; icon: string } } = {};
    expenses.forEach(expense => {
      if (!categoryTotals[expense.tag]) {
        categoryTotals[expense.tag] = {
          total: 0,
          color: expense.tagColor,
          icon: expense.tagIcon
        };
      }
      categoryTotals[expense.tag].total += expense.value;
    });
    return categoryTotals;
  }, [expenses]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        expenses={expenses} 
        onImportExpenses={handleImportExpenses}
      />
      
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="text-center mb-8">
          <p className="text-muted-foreground">Manage your expenses and track your financial goals</p>
        </div>

        {/* Top Section - Form and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Block - Expense Form */}
          <Card className="shadow-lg border bg-card">
            <CardHeader className="bg-primary text-white rounded-t-lg">
              <CardTitle className="text-xl font-semibold">Save Expense</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ExpenseForm onAddExpense={addExpense} />
            </CardContent>
          </Card>

          {/* Right Block - Charts and Metrics */}
          <Card className="shadow-lg border bg-card">
            <CardHeader className="bg-secondary text-secondary-foreground rounded-t-lg">
              <CardTitle className="text-xl font-semibold">Financial Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="charts" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>
                <TabsContent value="charts">
                  <ExpenseCharts 
                    monthlyData={monthlyData}
                    categoryData={categoryData}
                    goalAmount={goalAmount}
                  />
                </TabsContent>
                <TabsContent value="metrics">
                  <ExpenseMetrics 
                    expenses={expenses}
                    monthlyData={monthlyData}
                    categoryData={categoryData}
                    goalAmount={goalAmount}
                    onGoalChange={handleGoalChange}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - Expense List */}
        <Card className="shadow-lg border bg-card">
          <CardHeader className="bg-accent text-accent-foreground rounded-t-lg">
            <CardTitle className="text-xl font-semibold">Expense Records</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <EditableExpenseList 
              expenses={expenses} 
              onDeleteExpense={deleteExpense}
              onUpdateExpense={updateExpense}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
