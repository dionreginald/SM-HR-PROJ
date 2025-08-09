// src/contexts/ThemeContext.js - (Example structure, adjust to your actual file)
import React, { createContext, useMemo, useState, useContext } from 'react';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Create a context for the color mode
export const ThemeContext = createContext({ toggleColorMode: () => {} });

// Custom theme provider
export function CustomThemeProvider({ children }) {
  const [mode, setMode] = useState('light'); // Initial mode

  const toggleColorMode = React.useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode, // 'light' or 'dark'
          ...(mode === 'light'
            ? {
                // Palette for light mode
                primary: {
                  main: '#007aff', // Apple Blue
                },
                secondary: {
                  main: '#5AC8FA', // Sky Blue
                },
                error: {
                  main: '#FF3B30', // Red
                },
                warning: {
                  main: '#FFCC00', // Yellow
                },
                info: {
                  main: '#007AFF', // Blue
                },
                success: {
                  main: '#4CD964', // Green
                },
                background: {
                  default: '#f5f7fa', // Very light gray for overall background
                  paper: '#ffffff', // White for cards, dialogs, etc.
                },
                text: {
                  primary: '#333333', // Dark text
                  secondary: '#777777', // Muted text
                },
              }
            : {
                // Palette for dark mode
                primary: {
                  main: '#0A84FF', // Brighter blue for dark mode primary
                },
                secondary: {
                  main: '#64D2FF', // Brighter sky blue for dark mode secondary
                },
                error: {
                  main: '#FF453A', // Brighter red
                },
                warning: {
                  main: '#FFD60A', // Brighter yellow
                },
                info: {
                  main: '#0A84FF', // Brighter blue
                },
                success: {
                  main: '#30D158', // Brighter green
                },
                background: {
                  // --- START: CHANGES FOR DARK MODE BACKGROUND ---
                  default: '#313131ff', // A slightly lighter dark grey for the main background
                  paper: '#2c2c2c', // A distinct, slightly lighter grey for cards/paper elements
                  // --- END: CHANGES FOR DARK MODE BACKGROUND ---
                },
                text: {
                  primary: '#ffffff', // White text
                  secondary: '#b0b0b0', // Lighter gray for muted text
                },
              }),
        },
        typography: {
          fontFamily: [
            'Inter', // Assuming Inter is your desired font
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                // Keep the AppBar's transparency for frosted glass effect
                // backgroundColor will be handled by StyledAppBar in MacOsTopNavbar.js
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: ({ theme }) => ({
                // Default paper styles, backgrounds are handled by palette
                // This ensures cards use the 'paper' color
              }),
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                color: theme.palette.text.primary,
                fontSize: '0.8rem',
                padding: '8px 12px',
                borderRadius: '8px',
                boxShadow: `0 4px 12px ${alpha(theme.palette.text.primary, 0.15)}`,
                backdropFilter: 'blur(5px)',
              }),
              arrow: ({ theme }) => ({
                color: alpha(theme.palette.background.paper, 0.9),
              }),
            },
          },
          // You might have other component overrides here
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);