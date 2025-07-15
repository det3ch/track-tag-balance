
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { useCustomCategories } from '@/hooks/useCustomData';

interface CategorySelectorProps {
  tag: string;
  tagColor: string;
  tagIcon: string;
  onTagChange: (tag: string) => void;
  onTagColorChange: (color: string) => void;
  onTagIconChange: (icon: string) => void;
}

const defaultCategories = [
  { name: 'Food', icon: '🍽️', color: '#ef4444' },
  { name: 'Transport', icon: '🚗', color: '#3b82f6' },
  { name: 'Education', icon: '📚', color: '#8b5cf6' },
  { name: 'Healthcare', icon: '🏥', color: '#10b981' },
  { name: 'Entertainment', icon: '🎬', color: '#f59e0b' },
  { name: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { name: 'Bills', icon: '📄', color: '#6b7280' },
  { name: 'Travel', icon: '✈️', color: '#06b6d4' },
];

const CategorySelector: React.FC<CategorySelectorProps> = ({
  tag,
  tagColor,
  tagIcon,
  onTagChange,
  onTagColorChange,
  onTagIconChange
}) => {
  const { customCategories, addCategory, deleteCategory } = useCustomCategories();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('💰');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');

  const allCategories = [...defaultCategories, ...customCategories];

  const handleCategorySelect = (value: string) => {
    if (value === 'add-new') {
      setShowAddDialog(true);
      return;
    }

    const category = allCategories.find(c => c.name === value);
    if (category) {
      onTagChange(category.name);
      onTagColorChange(category.color);
      onTagIconChange(category.icon);
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory = {
      name: newCategoryName,
      icon: newCategoryIcon,
      color: newCategoryColor
    };

    addCategory(newCategory);
    onTagChange(newCategory.name);
    onTagColorChange(newCategory.color);
    onTagIconChange(newCategory.icon);

    setNewCategoryName('');
    setNewCategoryIcon('💰');
    setNewCategoryColor('#3b82f6');
    setShowAddDialog(false);
  };

  const handleDeleteCategory = () => {
    deleteCategory(tag);
    onTagChange('');
    onTagColorChange('#3b82f6');
    onTagIconChange('💰');
  };

  return (
    <div className="space-y-2">
      <Label>Category</Label>
      <div className="flex gap-2">
        <Select value={tag} onValueChange={handleCategorySelect}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {allCategories.map((category) => (
              <SelectItem key={category.name} value={category.name}>
                <div className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.name}
                </div>
              </SelectItem>
            ))}
            <SelectItem value="add-new">
              <div className="flex items-center gap-2">
                <span>➕</span>
                + Add new Category
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        
        {tag && (
          <Badge 
            variant="outline" 
            className="text-white border-none"
            style={{ backgroundColor: tagColor }}
          >
            <span className="mr-1">{tagIcon}</span>
            {tag}
          </Badge>
        )}
      </div>

      {tag && customCategories.some(c => c.name === tag) && (
        <button
          onClick={handleDeleteCategory}
          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
        >
          <Trash2 className="h-3 w-3" />
          Delete custom category
        </button>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategorySelector;
