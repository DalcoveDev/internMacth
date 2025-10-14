import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Theme types
export type Theme = 'light' | 'dark' | 'blue-dark' | 'gray' | 'yellow' | 'red-dark' | 'green-dark' | 'purple-dark' | 'pink-dark' | 'cyan-dark' | 'system';

// Theme context interface
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'system' 
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // Get effective theme (resolved from system if needed)
  const getEffectiveTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return currentTheme === 'light' ? 'light' : 'dark';
  };

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(
    getEffectiveTheme(theme)
  );

  // Set theme function
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme to document
    applyTheme(newTheme);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = effectiveTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Apply theme to document
  const applyTheme = (currentTheme: Theme) => {
    const resolvedTheme = getEffectiveTheme(currentTheme);
    setEffectiveTheme(resolvedTheme);

    // Remove all existing theme classes
    document.documentElement.classList.remove(
      'light', 'dark', 'blue-dark', 'gray', 'yellow', 'red-dark', 
      'green-dark', 'purple-dark', 'pink-dark', 'cyan-dark'
    );

    // Add new theme class
    if (currentTheme !== 'system') {
      document.documentElement.classList.add(currentTheme);
    } else {
      document.documentElement.classList.add(resolvedTheme);
    }

    // Update CSS custom properties for theme colors
    updateThemeColors(currentTheme);
  };

  // Update CSS custom properties based on theme
  const updateThemeColors = (currentTheme: Theme) => {
    const root = document.documentElement;
    
    // Define color schemes for different themes
    const colorSchemes = {
      light: {
        '--background': '0 0% 100%',
        '--foreground': '222.2 84% 4.9%',
        '--card': '0 0% 100%',
        '--card-foreground': '222.2 84% 4.9%',
        '--popover': '0 0% 100%',
        '--popover-foreground': '222.2 84% 4.9%',
        '--primary': '142.1 76.2% 36.3%',
        '--primary-foreground': '355.7 100% 97.3%',
        '--secondary': '210 40% 98%',
        '--secondary-foreground': '222.2 84% 4.9%',
        '--muted': '210 40% 98%',
        '--muted-foreground': '215.4 16.3% 46.9%',
        '--accent': '210 40% 98%',
        '--accent-foreground': '222.2 84% 4.9%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '214.3 31.8% 91.4%',
        '--input': '214.3 31.8% 91.4%',
        '--ring': '142.1 76.2% 36.3%',
      },
      dark: {
        '--background': '222.2 84% 4.9%',
        '--foreground': '210 40% 98%',
        '--card': '222.2 84% 4.9%',
        '--card-foreground': '210 40% 98%',
        '--popover': '222.2 84% 4.9%',
        '--popover-foreground': '210 40% 98%',
        '--primary': '142.1 70.6% 45.3%',
        '--primary-foreground': '144.9 80.4% 10%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--muted': '217.2 32.6% 17.5%',
        '--muted-foreground': '215 20.2% 65.1%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--input': '217.2 32.6% 17.5%',
        '--ring': '142.1 70.6% 45.3%',
      },
      'blue-dark': {
        '--background': '222.2 84% 4.9%',
        '--foreground': '210 40% 98%',
        '--primary': '217.2 91.2% 59.8%',
        '--primary-foreground': '222.2 84% 4.9%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--muted': '217.2 32.6% 17.5%',
        '--muted-foreground': '215 20.2% 65.1%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--input': '217.2 32.6% 17.5%',
        '--ring': '217.2 91.2% 59.8%',
      },
      'green-dark': {
        '--background': '222.2 84% 4.9%',
        '--foreground': '210 40% 98%',
        '--primary': '142.1 70.6% 45.3%',
        '--primary-foreground': '144.9 80.4% 10%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--muted': '217.2 32.6% 17.5%',
        '--muted-foreground': '215 20.2% 65.1%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--input': '217.2 32.6% 17.5%',
        '--ring': '142.1 70.6% 45.3%',
      },
      'purple-dark': {
        '--background': '222.2 84% 4.9%',
        '--foreground': '210 40% 98%',
        '--primary': '262.1 83.3% 57.8%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--muted': '217.2 32.6% 17.5%',
        '--muted-foreground': '215 20.2% 65.1%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--input': '217.2 32.6% 17.5%',
        '--ring': '262.1 83.3% 57.8%',
      },
      'red-dark': {
        '--background': '222.2 84% 4.9%',
        '--foreground': '210 40% 98%',
        '--primary': '0 84.2% 60.2%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--muted': '217.2 32.6% 17.5%',
        '--muted-foreground': '215 20.2% 65.1%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--input': '217.2 32.6% 17.5%',
        '--ring': '0 84.2% 60.2%',
      },
      'pink-dark': {
        '--background': '222.2 84% 4.9%',
        '--foreground': '210 40% 98%',
        '--primary': '330.4 81.2% 60.4%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--muted': '217.2 32.6% 17.5%',
        '--muted-foreground': '215 20.2% 65.1%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--input': '217.2 32.6% 17.5%',
        '--ring': '330.4 81.2% 60.4%',
      },
      'cyan-dark': {
        '--background': '222.2 84% 4.9%',
        '--foreground': '210 40% 98%',
        '--primary': '188.7 94.5% 42.7%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--muted': '217.2 32.6% 17.5%',
        '--muted-foreground': '215 20.2% 65.1%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--input': '217.2 32.6% 17.5%',
        '--ring': '188.7 94.5% 42.7%',
      },
      'yellow': {
        '--background': '0 0% 100%',
        '--foreground': '222.2 84% 4.9%',
        '--primary': '47.9 95.8% 53.1%',
        '--primary-foreground': '26 83.3% 14.1%',
        '--secondary': '210 40% 98%',
        '--secondary-foreground': '222.2 84% 4.9%',
        '--muted': '210 40% 98%',
        '--muted-foreground': '215.4 16.3% 46.9%',
        '--accent': '210 40% 98%',
        '--accent-foreground': '222.2 84% 4.9%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '214.3 31.8% 91.4%',
        '--input': '214.3 31.8% 91.4%',
        '--ring': '47.9 95.8% 53.1%',
      },
      'gray': {
        '--background': '0 0% 100%',
        '--foreground': '222.2 84% 4.9%',
        '--primary': '215.4 16.3% 46.9%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '210 40% 98%',
        '--secondary-foreground': '222.2 84% 4.9%',
        '--muted': '210 40% 98%',
        '--muted-foreground': '215.4 16.3% 46.9%',
        '--accent': '210 40% 98%',
        '--accent-foreground': '222.2 84% 4.9%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '214.3 31.8% 91.4%',
        '--input': '214.3 31.8% 91.4%',
        '--ring': '215.4 16.3% 46.9%',
      }
    };

    // For 'system' theme, use the resolved theme instead
    const themeToUse = currentTheme === 'system' ? getEffectiveTheme(currentTheme) : currentTheme;
    const colors = colorSchemes[themeToUse as keyof typeof colorSchemes] || colorSchemes.light;
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });
  };

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setThemeState(savedTheme as Theme);
      applyTheme(savedTheme as Theme);
    } else {
      applyTheme(defaultTheme);
    }
  }, [defaultTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    effectiveTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;