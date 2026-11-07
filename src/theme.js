import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#006a4e', // Sonali Emerald Green
      light: '#2e9372',
      dark: '#004733',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#b45309', // Sonali Amber / Gold
      light: '#f59e0b',
      dark: '#78350f',
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
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
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
            boxShadow: '0 2px 8px rgba(0, 106, 78, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#f1f5f9',
          fontWeight: 600,
          color: '#334155',
          fontSize: '0.8125rem',
        },
      },
    },
  },
});

export default theme;
