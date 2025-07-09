import React from 'react';
import ImportExportButtons from './ImportExportButtons';
import ThemeSelector from './ThemeSelector';
import type { Expense } from '@/pages/Index';

interface NavbarProps {
  expenses: Expense[];
  onImportExpenses: (expenses: Expense[]) => void;
}

const Navbar: React.FC<NavbarProps> = ({ expenses, onImportExpenses }) => {
  return (
    <nav className="w-full bg-background border-b border-border p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-foreground">
          Finance Control
        </div>
        
        <div className="flex items-center gap-3">
          <ImportExportButtons 
            expenses={expenses} 
            onImportExpenses={onImportExpenses}
          />
          <ThemeSelector />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;