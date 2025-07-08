import React from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <Sun className={`h-4 w-4 ${isDark ? 'text-muted-foreground' : 'text-primary'}`} />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="relative"
      />
      <Moon className={`h-4 w-4 ${isDark ? 'text-primary' : 'text-muted-foreground'}`} />
    </div>
  );
};

export default ThemeToggle;