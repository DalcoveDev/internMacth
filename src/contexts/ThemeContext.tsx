import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define theme types
export type Theme = 'light' | 'dark' | 'blue-dark' | 'gray' | 'yellow' | 'red-dark' | 'green-dark' | 'purple-dark' | 'pink-dark' | 'cyan-dark' | 'system';

// Theme context interface
interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
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
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      return storedTheme || defaultTheme;
    }
    return defaultTheme;
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Add transition class for smooth theme switching
    root.classList.add('theme-transition');
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'blue-dark', 'gray', 'yellow', 'red-dark', 'green-dark', 'purple-dark', 'pink-dark', 'cyan-dark');
    
    // Apply the selected theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Store theme in localStorage
    localStorage.setItem('theme', theme);
    
    // Remove transition class after animation completes
    const transitionTimeout = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
    
    return () => clearTimeout(transitionTimeout);
  }, [theme]);

  // Watch for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const root = document.documentElement;
        root.classList.add('theme-transition');
        root.classList.remove('light', 'dark', 'blue-dark', 'gray', 'yellow', 'red-dark', 'green-dark', 'purple-dark', 'pink-dark', 'cyan-dark');
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
        
        // Remove transition class after animation completes
        const transitionTimeout = setTimeout(() => {
          root.classList.remove('theme-transition');
        }, 300);
        
        return () => clearTimeout(transitionTimeout);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Get the effective theme (what's actually applied)
  const effectiveTheme = theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme === 'blue-dark' || theme === 'gray' || theme === 'yellow' || theme === 'red-dark' || theme === 'green-dark' || theme === 'purple-dark' || theme === 'pink-dark' || theme === 'cyan-dark' ? 'dark' : theme;

  // Set theme function
  const setThemeFunction = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Context value
  const value: ThemeContextType = {
    theme,
    effectiveTheme,
    setTheme: setThemeFunction
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;