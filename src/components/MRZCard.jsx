import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

export default function MRZCard({ mrz }) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!mrz) return null;

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const mrzLines = mrz.lines || [];

  return (
    <Card sx={{ mb: 4, overflow: 'hidden' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <QrCodeScannerIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Machine Readable Zone (MRZ - ICAO 9303 TD1)
              </Typography>
            </Box>
            <Chip
              label="ICAO Compliant"
              color="primary"
              size="small"
              variant="outlined"
            />
          </Box>
        }
        subheader="High-security machine-readable travel document zone printed on back of Smart NID"
        sx={{ bgcolor: '#fafafa', borderBottom: '1px solid #e2e8f0' }}
      />

      {/* Raw MRZ Box (Monospace terminal look) */}
      {mrzLines.length > 0 && (
        <Box sx={{ p: 2.5, bgcolor: '#0f172a', color: '#38bdf8' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', letterSpacing: '0.05em', fontWeight: 600 }}>
              RAW TD1 3-LINE MRZ DATA
            </Typography>
            <Tooltip title="Copy Raw MRZ">
              <IconButton
                size="small"
                onClick={() => handleCopy(mrzLines.join('\n'), 'raw_mrz')}
                sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff' } }}
              >
                {copiedKey === 'raw_mrz' ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            component="pre"
            sx={{
              fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
              fontSize: '0.95rem',
              letterSpacing: '0.15em',
              lineHeight: 1.6,
              m: 0,
              overflowX: 'auto',
            }}
          >
            {mrzLines.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </Box>
        </Box>
      )}

      {/* Decoded Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '35%' }}>Decoded Attribute</TableCell>
              <TableCell sx={{ width: '45%' }}>Extracted Value</TableCell>
              <TableCell sx={{ width: '20%', textAlign: 'right' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover>
              <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>Document Number</Typography></TableCell>
              <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{mrz.document_number || 'N/A'}</Typography></TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                {mrz.document_number && (
                  <IconButton size="small" onClick={() => handleCopy(mrz.document_number, 'doc_num')}>
                    {copiedKey === 'doc_num' ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                )}
              </TableCell>
            </TableRow>

            <TableRow hover>
              <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>Surname</Typography></TableCell>
              <TableCell><Typography variant="body2">{mrz.surname || 'N/A'}</Typography></TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                {mrz.surname && (
                  <IconButton size="small" onClick={() => handleCopy(mrz.surname, 'surname')}>
                    {copiedKey === 'surname' ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                )}
              </TableCell>
            </TableRow>

            <TableRow hover>
              <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>Given Names</Typography></TableCell>
              <TableCell><Typography variant="body2">{mrz.given_names || 'N/A'}</Typography></TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                {mrz.given_names && (
                  <IconButton size="small" onClick={() => handleCopy(mrz.given_names, 'given_names')}>
                    {copiedKey === 'given_names' ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                )}
              </TableCell>
            </TableRow>

            <TableRow hover>
              <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>Birth Date (MRZ)</Typography></TableCell>
              <TableCell><Typography variant="body2">{mrz.birth_date || 'N/A'}</Typography></TableCell>
              <TableCell sx={{ textAlign: 'right' }}></TableCell>
            </TableRow>

            <TableRow hover>
              <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>Gender</Typography></TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={mrz.gender === 'M' ? 'Male (M)' : mrz.gender === 'F' ? 'Female (F)' : mrz.gender || 'Unknown'}
                  variant="outlined"
                />
              </TableCell>
              <TableCell sx={{ textAlign: 'right' }}></TableCell>
            </TableRow>

            <TableRow hover>
              <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>Expiry Date</Typography></TableCell>
              <TableCell><Typography variant="body2">{mrz.expiry_date || 'N/A'}</Typography></TableCell>
              <TableCell sx={{ textAlign: 'right' }}></TableCell>
            </TableRow>

            <TableRow hover>
              <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>Issuing State / Nationality</Typography></TableCell>
              <TableCell><Typography variant="body2">{mrz.issuing_country || 'BGD'} / {mrz.nationality || 'BGD'}</Typography></TableCell>
              <TableCell sx={{ textAlign: 'right' }}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
