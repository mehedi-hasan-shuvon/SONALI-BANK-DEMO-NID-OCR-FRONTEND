import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Chip,
  Alert,
  AlertTitle,
  Stack,
  Snackbar,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PrintIcon from '@mui/icons-material/Print';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EditIcon from '@mui/icons-material/Edit';
import TerminalIcon from '@mui/icons-material/Terminal';

export default function AccountFormPreview({
  formData,
  onResetAll,
  onBackToEdit,
}) {
  const [toastMessage, setToastMessage] = useState(null);

  if (!formData) return null;

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setToastMessage('Account Opening Form JSON copied to clipboard.');
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(formData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SonaliBank_AccountForm_${formData.application_id || 'new'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage('Form JSON downloaded.');
  };

  const handlePrint = () => {
    window.print();
  };

  const { primary_holder, nominees } = formData;

  return (
    <Box sx={{ pb: 4 }}>
      {/* Success Notification Banner - Hidden in Print */}
      <Alert
        severity="success"
        icon={<CheckCircleIcon fontSize="inherit" />}
        className="no-print"
        sx={{
          mb: 3,
          border: '1px solid #86efac',
          bgcolor: '#f0fdf4',
          borderRadius: 2,
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
          Account Opening Form Generated Successfully! (অ্যাকাউন্ট ফর্ম সফলভাবে তৈরি হয়েছে)
        </AlertTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <TerminalIcon fontSize="small" color="success" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Form data has been logged to the browser console. Press <code>F12</code> or <code>Cmd+Option+I</code> to inspect in Console tab.
          </Typography>
        </Box>
      </Alert>

      {/* Top Action Bar - Hidden in Print */}
      <Box
        className="no-print"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Application Form: <span style={{ color: '#b8860b', fontWeight: 800 }}>{formData.application_id}</span>
        </Typography>

        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<EditIcon />}
            onClick={onBackToEdit}
            sx={{ textTransform: 'none' }}
          >
            Edit Information
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyJSON}
            sx={{ textTransform: 'none', borderColor: '#b8860b', color: '#b8860b' }}
          >
            Copy Form JSON
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadJSON}
            sx={{ textTransform: 'none' }}
          >
            Export JSON
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: '#b8860b',
              '&:hover': { bgcolor: '#9a6d09' },
            }}
          >
            Print Application (A4 Form)
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<RestartAltIcon />}
            onClick={onResetAll}
            sx={{ textTransform: 'none' }}
          >
            Start New Account
          </Button>
        </Stack>
      </Box>

      {/* Official Form Document Card - Target of A4 Printing */}
      <Card
        id="printable-form"
        sx={{
          border: '2px solid #b8860b',
          borderRadius: 2,
          p: { xs: 2.5, md: 4 },
          bgcolor: '#ffffff',
          boxShadow: '0 4px 20px rgba(184, 134, 11, 0.12)',
          position: 'relative',
        }}
      >
        {/* Bank Form Header Block */}
        <Box
          className="print-section print-header-block"
          sx={{
            textAlign: 'center',
            pb: 2.5,
            borderBottom: '2.5px double #b8860b',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
            <Box
              component="img"
              src="/sonali-bank-logo.png"
              alt="Sonali Bank Logo"
              sx={{
                width: 58,
                height: 58,
                objectFit: 'contain',
              }}
            />
            <Box sx={{ textAlign: 'left' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: '#b8860b',
                  letterSpacing: '0.04em',
                  lineHeight: 1.1,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
              >
                SONALI BANK PLC
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  fontFamily: 'Hind Siliguri, sans-serif',
                }}
              >
                সোনালী ব্যাংক পিএলসি
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: '#334155',
              letterSpacing: '0.02em',
              mt: 0.5,
            }}
          >
            INDIVIDUAL ACCOUNT OPENING FORM (ব্যক্তিগত হিসাব খোলার ফরম)
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, fontSize: '0.82rem' }}>
            <strong>Branch:</strong> {formData.branch} &nbsp;|&nbsp; <strong>Account Scheme:</strong> {formData.account_type} &nbsp;|&nbsp; <strong>Currency:</strong> {formData.currency}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.75rem', mt: 0.3 }}>
            <strong>Application Tracking ID:</strong> {formData.application_id} &nbsp;|&nbsp; <strong>Date:</strong> {new Date(formData.generated_at).toLocaleString()}
          </Typography>
        </Box>

        {/* Section 1: Primary Account Holder */}
        <Box className="print-section" sx={{ mt: 3 }}>
          <Box
            className="print-section-header"
            sx={{
              bgcolor: '#b8860b',
              color: '#ffffff',
              px: 2,
              py: 0.8,
              borderRadius: 1,
              mb: 1.5,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.03em' }}>
              SECTION 1: PRIMARY ACCOUNT HOLDER INFORMATION (মূল হিসাবধারীর বিবরণ)
            </Typography>
          </Box>

          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2.5, borderColor: '#cbd5e1' }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ width: '25%', fontWeight: 700, bgcolor: '#fbf8f2' }}>
                    Full Name in Bengali (বাংলায় নাম):
                  </TableCell>
                  <TableCell sx={{ width: '35%', fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.95rem' }}>
                    {primary_holder.name_bn || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ width: '20%', fontWeight: 700, bgcolor: '#fbf8f2' }}>
                    Name in English (Block):
                  </TableCell>
                  <TableCell sx={{ width: '20%', fontWeight: 700, color: '#8c6508', letterSpacing: '0.04em' }}>
                    {primary_holder.name_en_block || 'N/A'}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                    National ID Number:
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {primary_holder.nid_number || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                    Birth Date / Issue Date:
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {primary_holder.date_of_birth || 'N/A'} {primary_holder.issue_date ? `(Issued: ${primary_holder.issue_date})` : ''}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                    Father's Name (Bangla):
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    {primary_holder.father_name_bn || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                    Father's Name (Banglish):
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#92400e' }}>
                    {primary_holder.father_name_en || 'N/A'}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                    Mother's Name (Bangla):
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    {primary_holder.mother_name_bn || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                    Mother's Name (Banglish):
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#92400e' }}>
                    {primary_holder.mother_name_en || 'N/A'}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                    Gender (লিঙ্গ):
                  </TableCell>
                  <TableCell>
                    {primary_holder.gender || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                    Blood Group:
                  </TableCell>
                  <TableCell>
                    {primary_holder.blood_group || 'N/A'}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                    NID Permanent Address (ঠিকানা):
                  </TableCell>
                  <TableCell colSpan={3} sx={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    {primary_holder.address || 'N/A'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Section 2: Nominee(s) Information */}
        <Box className="print-section" sx={{ mt: 3 }}>
          <Box
            className="print-section-header"
            sx={{
              bgcolor: '#92400e',
              color: '#ffffff',
              px: 2,
              py: 0.8,
              borderRadius: 1,
              mb: 1.5,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.03em' }}>
              SECTION 2: NOMINEE INFORMATION (নমিনির বিবরণ — {nominees?.length || 0} PERSONS)
            </Typography>
          </Box>

          <Stack spacing={2}>
            {nominees &&
              nominees.map((nom, idx) => (
                <TableContainer
                  key={idx}
                  component={Paper}
                  variant="outlined"
                  className="print-nominee-card"
                  sx={{ borderColor: '#cbd5e1' }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 0.8,
                      bgcolor: '#fbf8f2',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400e', fontSize: '0.85rem' }}>
                      NOMINEE #{idx + 1} — RELATIONSHIP: {nom.relationship}
                    </Typography>
                    <Chip
                      size="small"
                      label={`Share: ${nom.share_percentage}%`}
                      sx={{
                        fontWeight: 700,
                        bgcolor: '#b8860b',
                        color: '#ffffff',
                        height: 22,
                        fontSize: '0.72rem',
                      }}
                    />
                  </Box>

                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ width: '25%', fontWeight: 700, bgcolor: '#fbf8f2' }}>
                          Nominee Name in Bengali:
                        </TableCell>
                        <TableCell sx={{ width: '35%', fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.92rem' }}>
                          {nom.name_bn || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ width: '20%', fontWeight: 700, bgcolor: '#fbf8f2' }}>
                          Name in English (Block):
                        </TableCell>
                        <TableCell sx={{ width: '20%', fontWeight: 700, color: '#92400e', letterSpacing: '0.04em' }}>
                          {nom.name_en_block || 'N/A'}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                          Nominee NID Number:
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {nom.nid_number || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                          Birth Date / Issue Date:
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {nom.date_of_birth || 'N/A'} {nom.issue_date ? `(Issued: ${nom.issue_date})` : ''}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                          Father's Name (Bangla):
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                          {nom.father_name_bn || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                          Father's Name (Banglish):
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {nom.father_name_en || 'N/A'}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                          Mother's Name (Bangla):
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                          {nom.mother_name_bn || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                          Mother's Name (Banglish):
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {nom.mother_name_en || 'N/A'}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                          Gender (লিঙ্গ):
                        </TableCell>
                        <TableCell>
                          {nom.gender || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                          Entitled Share (%):
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#92400e' }}>
                          {nom.share_percentage}%
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#fbf8f2' }}>
                          NID Address (ঠিকানা):
                        </TableCell>
                        <TableCell colSpan={3} sx={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                          {nom.address || 'N/A'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ))}
          </Stack>
        </Box>

        {/* Section 3: Verification & Compliance Seal */}
        <Box
          className="print-section print-signatures-block"
          sx={{
            mt: 4,
            pt: 2.5,
            borderTop: '1.5px solid #cbd5e1',
          }}
        >
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            <Grid item xs={4}>
              <Box sx={{ height: 50, borderBottom: '1px solid #64748b', mb: 1 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Signature of Account Holder
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Chip
                  label="KYC VERIFIED & MATCHED"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 800, fontSize: '0.72rem' }}
                />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Intelligent KYC Engine Status
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ height: 50, borderBottom: '1px solid #64748b', mb: 1 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Authorized Officer Signature & Seal
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* Snackbar notification */}
      <Snackbar
        open={!!toastMessage}
        autoHideDuration={3000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
