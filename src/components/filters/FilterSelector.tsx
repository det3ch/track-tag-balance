import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface FilterSelectorProps {
  label: string;
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
  onDelete?: () => void;
  showDeleteButton?: boolean;
  badge?: {
    text: string;
    icon?: string;
  };
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  label,
  value,
  options,
  onValueChange,
  onDelete,
  showDeleteButton,
  badge
}) => {
  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-2">
        <Select value={value || 'all'} onValueChange={onValueChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All {label}s</SelectItem>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
            <SelectItem value="add-new">
              <div className="flex items-center gap-2">
                <span>➕</span>
                + Add new {label}
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        
        {showDeleteButton && badge && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {badge.icon && <span className="mr-1">{badge.icon}</span>}
              {badge.text}
            </Badge>
            <button
              onClick={onDelete}
              className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Delete custom {label.toLowerCase()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSelector;