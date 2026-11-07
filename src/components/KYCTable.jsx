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
  Snackbar,
  Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import WcOutlinedIcon from '@mui/icons-material/WcOutlined';

export default function KYCTable({ data }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState('');

  if (!data) return null;

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setCopiedLabel(label);
    setSnackbarOpen(true);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fields = [
    {
      id: 'nid_number',
      labelEn: 'National ID Number',
      labelBn: 'জাতীয় পরিচয়পত্র নম্বর',
      value: data.nid_number,
      icon: <BadgeOutlinedIcon color="primary" />,
      highlight: true,
      badgeText: data.nid_type || 'NID',
    },
    {
      id: 'name_en',
      labelEn: 'Full Name (English)',
      labelBn: 'নাম (ইংরেজি)',
      value: data.name_en,
      icon: <PersonOutlineIcon color="primary" />,
      highlight: true,
    },
    {
      id: 'name_bn',
      labelEn: 'Full Name (Bengali)',
      labelBn: 'নাম (বাংলা)',
      value: data.name_bn,
      icon: <PersonOutlineIcon color="primary" />,
      highlight: true,
      isBengali: true,
    },
    {
      id: 'date_of_birth',
      labelEn: 'Date of Birth',
      labelBn: 'জন্ম তারিখ',
      value: data.date_of_birth_display || data.date_of_birth,
      extra: data.date_of_birth ? `(ISO: ${data.date_of_birth})` : null,
      icon: <CakeOutlinedIcon color="primary" />,
      highlight: true,
    },
    {
      id: 'father_name',
      labelEn: "Father's Name",
      labelBn: 'পিতার নাম',
      value: data.father_name,
      icon: <FamilyRestroomOutlinedIcon color="action" />,
      isBengali: true,
    },
    {
      id: 'mother_name',
      labelEn: "Mother's Name",
      labelBn: 'মাতার নাম',
      value: data.mother_name,
      icon: <FamilyRestroomOutlinedIcon color="action" />,
      isBengali: true,
    },
    {
      id: 'gender',
      labelEn: 'Gender',
      labelBn: 'লিঙ্গ',
      value: data.gender || (data.mrz?.gender === 'M' ? 'Male' : data.mrz?.gender === 'F' ? 'Female' : null),
      icon: <WcOutlinedIcon color="action" />,
    },
    {
      id: 'blood_group',
      labelEn: 'Blood Group',
      labelBn: 'রক্তের গ্রুপ',
      value: data.blood_group,
      icon: <BloodtypeOutlinedIcon color="error" />,
      chipColor: 'error',
    },
    {
      id: 'place_of_birth',
      labelEn: 'Place of Birth',
      labelBn: 'জন্মস্থান',
      value: data.place_of_birth,
      icon: <LocationCityOutlinedIcon color="action" />,
    },
    {
      id: 'issue_date',
      labelEn: 'Card Issue Date',
      labelBn: 'প্রদানের তারিখ',
      value: data.issue_date_display || data.issue_date,
      extra: data.issue_date ? `(ISO: ${data.issue_date})` : null,
      icon: <EventAvailableOutlinedIcon color="action" />,
    },
  ];

  return (
    <Card sx={{ mb: 4, overflow: 'hidden' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BadgeOutlinedIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Extracted National ID Information (এনআইডি তথ্য)
              </Typography>
            </Box>
            <Chip
              size="small"
              label={`${fields.filter(f => f.value).length} / ${fields.length} Fields Populated`}
              color="primary"
              variant="outlined"
            />
          </Box>
        }
        subheader="Verified biometric and biographical data extracted via bilingual Tesseract OCR engine"
        sx={{ bgcolor: '#fafafa', borderBottom: '1px solid #e2e8f0' }}
      />

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
        <Table sx={{ minWidth: 650 }} aria-label="NID information table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '32%' }}>Field Name / বিবরণ</TableCell>
              <TableCell sx={{ width: '50%' }}>Extracted Value / মান</TableCell>
              <TableCell sx={{ width: '18%', textAlign: 'right' }}>Actions / স্ট্যাটাস</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field) => {
              const hasValue = !!field.value;
              const isCopied = copiedKey === field.id;

              return (
                <TableRow
                  key={field.id}
                  hover
                  sx={{
                    bgcolor: field.highlight ? 'rgba(0, 106, 78, 0.015)' : 'inherit',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {/* Field Label Column */}
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {field.icon}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {field.labelEn}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Hind Siliguri' }}>
                          {field.labelBn}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Field Value Column */}
                  <TableCell>
                    {hasValue ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: field.highlight ? 700 : 500,
                            color: field.highlight ? 'primary.dark' : 'text.primary',
                            fontFamily: field.isBengali ? 'Hind Siliguri, sans-serif' : 'inherit',
                            fontSize: field.highlight ? '1.05rem' : '0.95rem',
                            letterSpacing: field.id === 'nid_number' ? '0.05em' : 'normal',
                          }}
                        >
                          {field.value}
                        </Typography>
                        {field.extra && (
                          <Typography variant="caption" color="text.secondary">
                            {field.extra}
                          </Typography>
                        )}
                        {field.badgeText && (
                          <Chip
                            size="small"
                            label={field.badgeText}
                            color="primary"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                        Not available / পাওয়া যায়নি
                      </Typography>
                    )}
                  </TableCell>

                  {/* Actions / Status Column */}
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      {hasValue ? (
                        <>
                          <Chip
                            label="Extracted"
                            size="small"
                            color="success"
                            variant="filled"
                            sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                          />
                          <Tooltip title={isCopied ? 'Copied!' : 'Copy value'}>
                            <IconButton
                              size="small"
                              onClick={() => handleCopy(field.value, field.id)}
                              color={isCopied ? 'success' : 'default'}
                            >
                              {isCopied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Chip
                          label="Missing"
                          size="small"
                          color="default"
                          variant="outlined"
                          sx={{ height: 22, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </Card>
  );
}
