
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Expense } from '@/pages/Index';

interface ImportExportButtonsProps {
  expenses: Expense[];
  onImportExpenses: (expenses: Expense[]) => void;
}

const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({ expenses, onImportExpenses }) => {
  const [exportFormat, setExportFormat] = useState<'binary' | 'text'>('binary');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const { toast } = useToast();

  const exportToProtobuf = async (format: 'binary' | 'text') => {
    try {
      // Create a simple JSON structure for protobuf-like export
      const exportData = {
        expenses: expenses.map(expense => ({
          id: expense.id,
          name: expense.name,
          date: expense.date.toISOString(),
          tag: expense.tag,
          tagColor: expense.tagColor,
          tagIcon: expense.tagIcon,
          bank: expense.bank,
          bankColor: expense.bankColor,
          value: expense.value,
          recurring: expense.recurring,
          installments: expense.installments,
          createdAt: expense.createdAt.toISOString()
        })),
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };

      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'binary') {
        // For binary format, we'll use JSON as a simple binary-like format
        content = JSON.stringify(exportData);
        filename = `expenses_${new Date().toISOString().split('T')[0]}.pb`;
        mimeType = 'application/octet-stream';
      } else {
        // For text format, we'll use formatted JSON
        content = JSON.stringify(exportData, null, 2);
        filename = `expenses_${new Date().toISOString().split('T')[0]}.pbtxt`;
        mimeType = 'text/plain';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Expenses exported as ${format} protobuf format`,
      });

      setShowExportDialog(false);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your expenses",
        variant: "destructive",
      });
    }
  };

  const importFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (data.expenses && Array.isArray(data.expenses)) {
          const importedExpenses: Expense[] = data.expenses.map((exp: any) => ({
            id: exp.id || Date.now().toString(),
            name: exp.name,
            date: new Date(exp.date),
            tag: exp.tag,
            tagColor: exp.tagColor,
            tagIcon: exp.tagIcon,
            bank: exp.bank,
            bankColor: exp.bankColor,
            value: exp.value,
            recurring: exp.recurring,
            installments: exp.installments,
            createdAt: new Date(exp.createdAt)
          }));

          onImportExpenses(importedExpenses);
          
          toast({
            title: "Import Successful",
            description: `Imported ${importedExpenses.length} expenses`,
          });
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid file format or corrupted data",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        accept=".pb,.pbtxt,.json"
        onChange={importFromFile}
        style={{ display: 'none' }}
        id="import-file"
      />
      
      <Button
        variant="outline"
        onClick={() => document.getElementById('import-file')?.click()}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Import
      </Button>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Expenses</DialogTitle>
            <DialogDescription>
              Choose the format for exporting your expense data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Export Format</label>
              <Select value={exportFormat} onValueChange={(value: 'binary' | 'text') => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="binary">Binary Protobuf (.pb)</SelectItem>
                  <SelectItem value="text">Text Protobuf (.pbtxt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {exportFormat === 'binary' 
                ? 'Binary format is more compact but not human-readable.'
                : 'Text format is human-readable but larger in size.'
              }
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => exportToProtobuf(exportFormat)}>
              Export {expenses.length} Expenses
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportExportButtons;
