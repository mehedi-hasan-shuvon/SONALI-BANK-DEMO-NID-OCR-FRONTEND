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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function Header({ isBackendOnline, onOpenInfo }) {
  return (
    <AppBar position="static" elevation={1} sx={{ backgroundColor: 'primary.main', mb: 3 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Bank Logo / Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              mr: 2,
            }}
          >
            <AccountBalanceIcon sx={{ color: '#ffffff', fontSize: 26 }} />
          </Box>

          {/* Title & Subtitle */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: '0.02em', color: '#ffffff' }}>
                Sonali Bank PLC
              </Typography>
              <Chip
                icon={<VerifiedUserIcon sx={{ fontSize: '14px !important', color: '#ffffff !important' }} />}
                label="Intelligent KYC"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.85)', display: 'block', fontSize: '0.8rem' }}>
              Bangladeshi National ID (NID) Automated OCR & Verification Service
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
                bgcolor: isBackendOnline ? 'rgba(22, 163, 74, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                borderColor: isBackendOnline ? '#4ade80' : 'rgba(255, 255, 255, 0.3)',
                fontWeight: 500,
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
