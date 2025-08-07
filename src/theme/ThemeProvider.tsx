import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { MD3LightTheme, MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper';

// Custom theme colors
const lightColors = {
  ...MD3LightTheme.colors,
  primary: '#6200EE',
  primaryContainer: '#EADDFF',
  secondary: '#625B71',
  secondaryContainer: '#E8DEF8',
  tertiary: '#7D5260',
  tertiaryContainer: '#FFD8E4',
  background: '#FFFBFE',
  surface: '#FFFBFE',
  surfaceVariant: '#E7E0EC',
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onTertiary: '#FFFFFF',
  onBackground: '#1C1B1F',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F',
  onError: '#FFFFFF',
  onErrorContainer: '#410E0B',
};

const darkColors = {
  ...MD3DarkTheme.colors,
  primary: '#D0BCFF',
  primaryContainer: '#4F378B',
  secondary: '#CCC2DC',
  secondaryContainer: '#4A4458',
  tertiary: '#EFB8C8',
  tertiaryContainer: '#633B48',
  background: '#1C1B1F',
  surface: '#1C1B1F',
  surfaceVariant: '#49454F',
  error: '#FFB4AB',
  errorContainer: '#93000A',
  onPrimary: '#371E73',
  onSecondary: '#332D41',
  onTertiary: '#492532',
  onBackground: '#E6E1E5',
  onSurface: '#E6E1E5',
  onSurfaceVariant: '#CAC4D0',
  onError: '#690005',
  onErrorContainer: '#FFDAD6',
};

const lightTheme = {
  ...MD3LightTheme,
  colors: lightColors,
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: darkColors,
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: typeof lightTheme;
  colors: typeof lightColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  const currentColors = isDarkMode ? darkColors : lightColors;

  useEffect(() => {
    // Sistem teması değiştiğinde otomatik güncelle (opsiyonel)
    // setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const themeContextValue: ThemeContextType = {
    isDarkMode,
    toggleTheme,
    theme: currentTheme,
    colors: currentColors,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <PaperProvider theme={currentTheme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
