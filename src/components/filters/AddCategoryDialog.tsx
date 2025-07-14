import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface CustomCategory {
  name: string;
  icon: string;
  color: string;
}

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (category: CustomCategory) => void;
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  open,
  onOpenChange,
  onAddCategory
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('💰');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory = {
      name: newCategoryName,
      icon: newCategoryIcon,
      color: newCategoryColor
    };

    onAddCategory(newCategory);

    setNewCategoryName('');
    setNewCategoryIcon('💰');
    setNewCategoryColor('#3b82f6');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setNewCategoryName('');
    setNewCategoryIcon('💰');
    setNewCategoryColor('#3b82f6');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
          
          <div>
            <Label htmlFor="category-icon">Icon (emoji)</Label>
            <Input
              id="category-icon"
              value={newCategoryIcon}
              onChange={(e) => setNewCategoryIcon(e.target.value)}
              placeholder="💰"
            />
          </div>
          
          <div>
            <Label htmlFor="category-color">Color</Label>
            <div className="flex items-center gap-2">
              <input
                id="category-color"
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="w-8 h-8 rounded border"
              />
              <span>{newCategoryColor}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleAddCategory} className="flex-1">
              Add Category
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

export default AddCategoryDialog;