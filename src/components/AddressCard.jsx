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
  IconButton,
  Tooltip,
  Chip,
  Alert,
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import MarkunreadMailboxOutlinedIcon from '@mui/icons-material/MarkunreadMailboxOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import SignpostOutlinedIcon from '@mui/icons-material/SignpostOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

export default function AddressCard({ address }) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!address) return null;

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const addressRows = [
    {
      id: 'holding',
      labelEn: 'House / Holding No',
      labelBn: 'বাসা/হোল্ডিং',
      value: address.holding,
      icon: <HomeOutlinedIcon color="primary" />,
    },
    {
      id: 'village_road',
      labelEn: 'Village / Road / Area',
      labelBn: 'গ্রাম/রাস্তা/এলাকা',
      value: address.village_road,
      icon: <SignpostOutlinedIcon color="primary" />,
    },
    {
      id: 'post_office',
      labelEn: 'Post Office',
      labelBn: 'ডাকঘর',
      value: address.post_office,
      icon: <MarkunreadMailboxOutlinedIcon color="primary" />,
    },
    {
      id: 'postal_code',
      labelEn: 'Postal Code',
      labelBn: 'পোস্ট কোড',
      value: address.postal_code,
      icon: <MarkunreadMailboxOutlinedIcon color="primary" />,
    },
    {
      id: 'upazila_thana',
      labelEn: 'Upazila / Thana / Police Station',
      labelBn: 'উপজেলা/থানা',
      value: address.upazila_thana,
      icon: <LocationCityOutlinedIcon color="primary" />,
    },
    {
      id: 'district',
      labelEn: 'District',
      labelBn: 'জেলা',
      value: address.district,
      icon: <MapOutlinedIcon color="primary" />,
    },
  ];

  return (
    <Card sx={{ mb: 4, overflow: 'hidden' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HomeOutlinedIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Address Breakdown (ঠিকানা বিবরণ)
              </Typography>
            </Box>
            {address.raw && (
              <Tooltip title="Copy full address string">
                <IconButton size="small" onClick={() => handleCopy(address.raw, 'raw')}>
                  {copiedKey === 'raw' ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
        subheader="Structured residential address extracted from NID back side"
        sx={{ bgcolor: '#fafafa', borderBottom: '1px solid #e2e8f0' }}
      />

      {address.raw && (
        <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}>
            FULL ADDRESS STRING (অরিজিনাল ঠিকানা):
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'Hind Siliguri, sans-serif', color: 'text.primary', fontWeight: 500 }}>
            {address.raw}
          </Typography>
        </Box>
      )}

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '35%' }}>Component / অঙ্গ</TableCell>
              <TableCell sx={{ width: '45%' }}>Value / মান</TableCell>
              <TableCell sx={{ width: '20%', textAlign: 'right' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addressRows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {row.icon}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {row.labelEn}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Hind Siliguri' }}>
                        {row.labelBn}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 500 }}>
                    {row.value || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not specified</span>}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  {row.value && (
                    <Tooltip title={copiedKey === row.id ? 'Copied!' : 'Copy'}>
                      <IconButton size="small" onClick={() => handleCopy(row.value, row.id)}>
                        {copiedKey === row.id ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
