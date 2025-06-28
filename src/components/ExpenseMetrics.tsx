
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Expense } from '@/pages/Index';

interface ExpenseMetricsProps {
  expenses: Expense[];
  monthlyData: { [key: string]: number };
  categoryData: { [key: string]: { total: number; color: string; icon: string } };
  goalAmount: number;
  onGoalChange: (goal: number) => void;
}

const ExpenseMetrics: React.FC<ExpenseMetricsProps> = ({ 
  expenses, 
  monthlyData, 
  categoryData, 
  goalAmount, 
  onGoalChange 
}) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);
  const currentMonth = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  const currentMonthExpenses = monthlyData[currentMonth] || 0;
  const averageMonthly = Object.values(monthlyData).reduce((sum, val) => sum + val, 0) / Math.max(Object.keys(monthlyData).length, 1);
  const remainingBudget = goalAmount - currentMonthExpenses;
  const budgetProgress = (currentMonthExpenses / goalAmount) * 100;

  const topCategory = Object.entries(categoryData).reduce((max, [category, data]) => 
    data.total > (max?.data?.total || 0) ? { category, data } : max, 
    null as { category: string; data: { total: number; color: string; icon: string } } | null
  );

  const recurringExpenses = expenses.filter(expense => expense.recurring).length;
  const uniqueCategories = Object.keys(categoryData).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <div className="text-sm opacity-90">Total Expenses</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">${currentMonthExpenses.toFixed(2)}</div>
            <div className="text-sm opacity-90">This Month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">${averageMonthly.toFixed(2)}</div>
            <div className="text-sm opacity-90">Monthly Average</div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${remainingBudget >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600'} text-white`}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">${Math.abs(remainingBudget).toFixed(2)}</div>
            <div className="text-sm opacity-90">
              {remainingBudget >= 0 ? 'Remaining Budget' : 'Over Budget'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                budgetProgress > 100 ? 'bg-red-500' : budgetProgress > 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetProgress, 100)}%` }}
            />
          </div>
          <div className="text-sm text-gray-600">
            {budgetProgress.toFixed(1)}% of monthly goal used
          </div>
        </CardContent>
      </Card>

      {/* Goal Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Monthly Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="goal">Set Monthly Budget Goal</Label>
          <Input
            id="goal"
            type="number"
            value={goalAmount}
            onChange={(e) => onGoalChange(parseFloat(e.target.value) || 0)}
            placeholder="Enter monthly goal"
            className="mt-1"
          />
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-blue-600">{uniqueCategories}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-purple-600">{recurringExpenses}</div>
            <div className="text-sm text-gray-600">Recurring</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Category */}
      {topCategory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Top Spending Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{topCategory.data.icon}</span>
              <div>
                <div className="font-semibold" style={{ color: topCategory.data.color }}>
                  {topCategory.category}
                </div>
                <div className="text-sm text-gray-600">
                  ${topCategory.data.total.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExpenseMetrics;
