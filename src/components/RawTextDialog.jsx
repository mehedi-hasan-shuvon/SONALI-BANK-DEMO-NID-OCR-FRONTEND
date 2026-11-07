import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

export default function RawTextDialog({ open, onClose, rawText }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!rawText) return null;

  const isDual = typeof rawText === 'object' && (rawText.front !== undefined || rawText.back !== undefined);
  const frontText = isDual ? rawText.front : (typeof rawText === 'string' ? rawText : '');
  const backText = isDual ? rawText.back : '';

  const currentText = activeTab === 0 ? (isDual ? frontText : rawText) : backText;

  const handleCopy = () => {
    navigator.clipboard.writeText(typeof currentText === 'string' ? currentText : JSON.stringify(currentText, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Raw OCR Engine Output (অশোধিত টেক্সট)
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {isDual && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
            <Tab label="Front Side Raw Text" />
            <Tab label="Back Side Raw Text" />
          </Tabs>
        </Box>
      )}

      <DialogContent dividers sx={{ p: 2, bgcolor: '#0f172a' }}>
        <Box
          component="pre"
          sx={{
            fontFamily: '"SFMono-Regular", Consolas, Menlo, monospace',
            color: '#e2e8f0',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            m: 0,
            maxHeight: 450,
            overflowY: 'auto',
          }}
        >
          {typeof currentText === 'string' ? currentText : JSON.stringify(currentText, null, 2)}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button
          startIcon={copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
          onClick={handleCopy}
          color="inherit"
        >
          {copied ? 'Copied Raw Text' : 'Copy Raw Text'}
        </Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
