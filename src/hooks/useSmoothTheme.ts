import { useState, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const useSmoothTheme = () => {
  const { theme, setTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const smoothSetTheme = useCallback((newTheme: 'light' | 'dark' | 'blue-dark' | 'gray' | 'yellow' | 'system') => {
    setIsTransitioning(true);
    
    // Add transition class to root element
    const root = document.documentElement;
    root.classList.add('theme-transition');
    
    // Set the new theme
    setTheme(newTheme);
    
    // Remove transition class after animation completes
    setTimeout(() => {
      root.classList.remove('theme-transition');
      setIsTransitioning(false);
    }, 300);
  }, [setTheme]);

  return {
    theme,
    isTransitioning,
    setTheme: smoothSetTheme
  };
};