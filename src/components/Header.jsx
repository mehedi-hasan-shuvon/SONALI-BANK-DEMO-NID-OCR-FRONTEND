import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip,
  Container,
  IconButton,
  Tooltip,
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function Header({ isBackendOnline, onOpenInfo }) {
  return (
    <AppBar
      position="static"
      elevation={2}
      className="no-print"
      sx={{
        background: 'linear-gradient(135deg, #9a6d09 0%, #b8860b 50%, #854d0e 100%)',
        mb: 3,
        borderBottom: '2px solid #d4af37',
        boxShadow: '0 4px 14px rgba(184, 134, 11, 0.25)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Official Bank Logo */}
          <Box
            component="img"
            src="/sonali-bank-logo.png"
            alt="Sonali Bank Logo"
            sx={{
              width: 46,
              height: 46,
              objectFit: 'contain',
              mr: 2,
              bgcolor: '#ffffff',
              p: 0.6,
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            }}
          />

          {/* Title & Subtitle */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 800, letterSpacing: '0.02em', color: '#ffffff' }}>
                Sonali Bank PLC
              </Typography>
              <Chip
                icon={<VerifiedUserIcon sx={{ fontSize: '14px !important', color: '#ffffff !important' }} />}
                label="Intelligent KYC"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.22)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', display: 'block', fontSize: '0.8rem' }}>
              Bangladeshi National ID (NID) Automated OCR & Verification Service (সোনালী ব্যাংক পিএলসি)
            </Typography>
          </Box>

          {/* Backend Status indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              variant="outlined"
              size="small"
              label={isBackendOnline ? 'OCR Service Ready' : 'Connecting to API...'}
              color={isBackendOnline ? 'success' : 'default'}
              sx={{
                bgcolor: isBackendOnline ? 'rgba(22, 163, 74, 0.25)' : 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                borderColor: isBackendOnline ? '#86efac' : 'rgba(255, 255, 255, 0.4)',
                fontWeight: 600,
              }}
            />
            {onOpenInfo && (
              <Tooltip title="About this System">
                <IconButton onClick={onOpenInfo} sx={{ color: '#ffffff' }}>
                  <InfoOutlinedIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
