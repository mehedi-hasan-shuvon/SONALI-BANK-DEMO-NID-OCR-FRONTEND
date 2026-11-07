import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#b8860b', // Sonali Gold (সোনালী গোল্ড)
      light: '#d4af37', // Bright Metallic Gold
      dark: '#8c6508', // Deep Antique Gold
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#92400e', // Deep Warm Amber / Golden Brown
      light: '#b45309',
      dark: '#712b07',
      contrastText: '#ffffff',
    },
    success: {
      main: '#16a34a',
      light: '#dcfce7',
      dark: '#15803d',
    },
    info: {
      main: '#0284c7',
      light: '#e0f2fe',
      dark: '#0369a1',
    },
    warning: {
      main: '#ea580c',
      light: '#ffedd5',
      dark: '#c2410c',
    },
    background: {
      default: '#faf8f5', // Subtle warm golden tint background
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: ['"Roboto"', '"Hind Siliguri"', '-apple-system', 'sans-serif'].join(','),
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: '0.8125rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(184, 134, 11, 0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#fbf8f2',
          fontWeight: 600,
          color: '#475569',
          fontSize: '0.8125rem',
        },
      },
    },
  },
});

export default theme;
