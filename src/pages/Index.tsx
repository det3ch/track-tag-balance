
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseCharts from '@/components/ExpenseCharts';
import ExpenseMetrics from '@/components/ExpenseMetrics';
import ExpenseList from '@/components/ExpenseList';

export interface Expense {
  id: string;
  name: string;
  date: Date;
  tag: string;
  tagColor: string;
  tagIcon: string;
  value: number;
  recurring: boolean;
  installments: number;
  createdAt: Date;
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goalAmount, setGoalAmount] = useState<number>(5000);

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date()
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
          name: i === 0 ? expense.name : `${expense.name} (${i + 1}/${expense.installments})`
        });
      }
      setExpenses(prev => [...prev, ...recurringExpenses]);
    } else {
      setExpenses(prev => [...prev, newExpense]);
    }
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Finance Control</h1>
          <p className="text-gray-600">Manage your expenses and track your financial goals</p>
        </div>

        {/* Top Section - Form and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Block - Expense Form */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-xl font-semibold">Save Expense</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ExpenseForm onAddExpense={addExpense} />
            </CardContent>
          </Card>

          {/* Right Block - Charts and Metrics */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
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
                    onGoalChange={setGoalAmount}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - Expense List */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold">Expense Records</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
