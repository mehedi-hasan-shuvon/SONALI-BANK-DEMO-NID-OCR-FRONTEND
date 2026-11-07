import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SecurityIcon from '@mui/icons-material/Security';

export default function InfoDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SecurityIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Sonali Intelligent KYC System
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" paragraph>
          This automated KYC solution extracts and validates identity information from Bangladeshi National ID (NID) cards for streamlined banking onboarding, account opening, and risk verification.
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
          Supported NID Formats
        </Typography>
        <List dense disablePadding>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <CheckCircleOutlineIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Smart National ID Card (10 Digits)"
              secondary="Bilingual Bengali/English, TD1 MRZ, micro-print, blood group & address"
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <CheckCircleOutlineIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Laminated Paper NID (13 or 17 Digits)"
              secondary="Legacy format with 4-digit birth year prefix normalization"
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <CheckCircleOutlineIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Dual-Side Multi-Pass OCR"
              secondary="Simultaneous extraction of front biographical data and back address components"
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
          Data Privacy & Compliance
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          All image preprocessing and OCR recognition occur directly on the localized banking server using open-source Tesseract OCR and OpenCV. No biometric data is sent to external cloud APIs or third parties.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Got It
        </Button>
      </DialogActions>
    </Dialog>
  );
}
