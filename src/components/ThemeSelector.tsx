
import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Palette } from 'lucide-react';

const themes = [
  { name: 'Dark Blue', value: 'dark', description: 'Default dark theme' },
  { name: 'Dark Purple', value: 'dark-purple', description: 'Purple accent dark theme' },
  { name: 'Dark Green', value: 'dark-green', description: 'Green accent dark theme' },
  { name: 'Light Blue', value: 'light', description: 'Default light theme' },
  { name: 'Light Purple', value: 'light-purple', description: 'Purple accent light theme' },
  { name: 'Light Green', value: 'light-green', description: 'Green accent light theme' },
];

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          {currentTheme.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className="flex flex-col items-start gap-1 p-3"
          >
            <div className="font-medium">{themeOption.name}</div>
            <div className="text-sm text-muted-foreground">{themeOption.description}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
