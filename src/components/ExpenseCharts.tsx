
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ComposedChart, ResponsiveContainer } from 'recharts';

interface ExpenseChartsProps {
  monthlyData: { [key: string]: number };
  categoryData: { [key: string]: { total: number; color: string; icon: string } };
  goalAmount: number;
}

const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ monthlyData, categoryData, goalAmount }) => {
  const pieData = Object.entries(categoryData).map(([category, data]) => ({
    name: category,
    value: data.total,
    color: data.color,
    icon: data.icon
  }));

  const barData = Object.entries(monthlyData).map(([month, total]) => ({
    month,
    actual: total,
    goal: goalAmount
  }));

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Pie Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-center">Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart with Goal Line */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-center">Monthly Expenses vs Goal</h3>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name === 'actual' ? 'Actual' : 'Goal']}
            />
            <Legend />
            <Bar dataKey="actual" fill="#3b82f6" name="Actual Expenses" />
            <Line type="monotone" dataKey="goal" stroke="#ef4444" strokeWidth={3} name="Goal" strokeDasharray="5 5" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseCharts;
