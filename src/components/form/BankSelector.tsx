import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useCustomBanks } from '@/hooks/useCustomData';

interface BankSelectorProps {
  bank: string;
  bankColor: string;
  onBankChange: (bank: string) => void;
  onBankColorChange: (color: string) => void;
}

const bankPresets = [
  { name: 'Itaú', color: 'hsl(25, 95%, 53%)' },
  { name: 'Bradesco', color: 'hsl(0, 84%, 60%)' },
  { name: 'Santander', color: 'hsl(0, 100%, 50%)' },
  { name: 'Banco do Brasil', color: 'hsl(60, 100%, 50%)' },
  { name: 'Caixa', color: 'hsl(200, 100%, 40%)' },
  { name: 'Nubank', color: 'hsl(271, 81%, 56%)' },
];

// Helper function to convert HSL to hex for color input
const hslToHex = (hsl: string): string => {
  if (!hsl.startsWith('hsl')) return hsl;
  
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return '#3b82f6';
  
  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Helper function to convert hex to HSL
const hexToHsl = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }
  
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

const BankSelector: React.FC<BankSelectorProps> = ({
  bank,
  bankColor,
  onBankChange,
  onBankColorChange
}) => {
  const { customBanks, addBank, deleteBank } = useCustomBanks();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [newBankColor, setNewBankColor] = useState('#3b82f6');

  const allBanks = [...bankPresets, ...customBanks];

  const handleBankSelect = (selectedBank: string) => {
    if (selectedBank === 'add-new') {
      setShowAddDialog(true);
      return;
    }

    const preset = allBanks.find(p => p.name === selectedBank);
    if (preset) {
      onBankChange(preset.name);
      onBankColorChange(preset.color);
    } else {
      onBankChange(selectedBank);
      if (!bankColor || bankColor === 'undefined') {
        onBankColorChange('hsl(221, 83%, 53%)');
      }
    }
  };

  const handleAddBank = () => {
    if (!newBankName.trim()) return;

    const newBank = {
      name: newBankName,
      color: hexToHsl(newBankColor)
    };

    addBank(newBank);
    onBankChange(newBank.name);
    onBankColorChange(newBank.color);

    setNewBankName('');
    setNewBankColor('#3b82f6');
    setShowAddDialog(false);
  };

  const handleDeleteBank = () => {
    deleteBank(bank);
    onBankChange('');
    onBankColorChange('hsl(221, 83%, 53%)');
  };

  const handleColorChange = (hexColor: string) => {
    const hslColor = hexToHsl(hexColor);
    onBankColorChange(hslColor);
  };

  // Ensure we have a valid color for display
  const displayColor = bankColor && bankColor !== 'undefined' ? bankColor : 'hsl(221, 83%, 53%)';

  return (
    <div className="space-y-2">
      <Label>Bank</Label>
      <div className="flex gap-2">
        <Select value={bank} onValueChange={handleBankSelect}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select or type bank name" />
          </SelectTrigger>
          <SelectContent>
            {allBanks.map((preset) => (
              <SelectItem key={preset.name} value={preset.name}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preset.color }}
                  />
                  {preset.name}
                </div>
              </SelectItem>
            ))}
            <SelectItem value="add-new">
              <div className="flex items-center gap-2">
                <span>➕</span>
                + Add new Bank
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        
        {bank && (
          <Badge 
            variant="outline" 
            className="text-white border-none"
            style={{ backgroundColor: displayColor }}
          >
            {bank}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Label htmlFor="bank-color">Bank Color:</Label>
        <input
          id="bank-color"
          type="color"
          value={hslToHex(displayColor)}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-8 h-8 rounded border"
        />
      </div>

      {bank && customBanks.some(b => b.name === bank) && (
        <button
          onClick={handleDeleteBank}
          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
        >
          <Trash2 className="h-3 w-3" />
          Delete custom bank
        </button>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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
              <Label htmlFor="bank-color-new">Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="bank-color-new"
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

export default BankSelector;
