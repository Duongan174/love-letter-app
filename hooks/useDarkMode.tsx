// hooks/useDarkMode.tsx
/**
 * Dark Mode Hook
 * Quản lý dark mode state và persistence
 */

'use client';

import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Kiểm tra localStorage và system preference
    const stored = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = stored !== null ? stored === 'true' : prefersDark;
    setIsDark(shouldBeDark);
    
    // Apply class to document
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('darkMode', String(newValue));
    
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    isDark,
    toggleDarkMode,
  };
}

