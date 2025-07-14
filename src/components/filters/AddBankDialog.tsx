import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface CustomBank {
  name: string;
  color: string;
}

interface AddBankDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBank: (bank: CustomBank) => void;
}

const AddBankDialog: React.FC<AddBankDialogProps> = ({
  open,
  onOpenChange,
  onAddBank
}) => {
  const [newBankName, setNewBankName] = useState('');
  const [newBankColor, setNewBankColor] = useState('#3b82f6');

  const handleAddBank = () => {
    if (!newBankName.trim()) return;

    const newBank = {
      name: newBankName,
      color: newBankColor
    };

    onAddBank(newBank);

    setNewBankName('');
    setNewBankColor('#3b82f6');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setNewBankName('');
    setNewBankColor('#3b82f6');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Bank</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="bank-name">Bank Name</Label>
            <Input
              id="bank-name"
              value={newBankName}
              onChange={(e) => setNewBankName(e.target.value)}
              placeholder="Enter bank name"
            />
          </div>
          
          <div>
            <Label htmlFor="bank-color">Color</Label>
            <div className="flex items-center gap-2">
              <input
                id="bank-color"
                type="color"
                value={newBankColor}
                onChange={(e) => setNewBankColor(e.target.value)}
                className="w-8 h-8 rounded border"
              />
              <span>{newBankColor}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleAddBank} className="flex-1">
              Add Bank
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBankDialog;