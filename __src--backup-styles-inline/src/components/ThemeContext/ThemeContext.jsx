import React, { createContext, useState, useContext } from 'react';
import './ThemeContext.scss';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Tema padrão

  const themes = {
    light: {
      background: '#ffffff',
      text: '#000000',
      primary: '#007bff',

      ap_border_color: '#ccc',
    },
    dark: {
      background: '#121212',
      text: '#ffffff',
      primary: '#bb86fc',

      ap_border_color: '#000',
    },
    // Adicione outros temas aqui...
    blue: {
      background: '#e0f7fa',
      text: '#0d47a1',
      primary: '#03a9f4',
    },
    green: {
      background: '#e8f5e9',
      text: '#1b5e20',
      primary: '#4caf50',
      buttons: '#49cf50',
    },
    purple: {
      background: '#f3e5f5',
      text: '#4a148c',
      primary: '#9c27b0',
    },
  };

  const currentTheme = themes[theme];

  const toggleTheme = (themeName) => {
    setTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme, themeName: theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// export default ThemeContext; // Adicione esta linha