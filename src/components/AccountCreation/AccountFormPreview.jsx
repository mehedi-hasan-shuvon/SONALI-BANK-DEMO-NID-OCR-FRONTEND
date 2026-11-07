import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Grid,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
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
      {/* Success Notification Banner */}
      <Alert
        severity="success"
        icon={<CheckCircleIcon fontSize="inherit" />}
        sx={{ mb: 3, border: '1px solid #86efac', bgcolor: '#f0fdf4' }}
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

      {/* Top Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Application Form: <span style={{ color: '#006a4e' }}>{formData.application_id}</span>
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
            sx={{ textTransform: 'none' }}
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
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Print Application
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

      {/* Official Form Document Card */}
      <Card
        id="printable-form"
        sx={{
          border: '2px solid #006a4e',
          borderRadius: 2,
          p: { xs: 2, md: 4 },
          bgcolor: '#ffffff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        {/* Bank Form Header */}
        <Box sx={{ textAlign: 'center', pb: 3, borderBottom: '2px double #006a4e' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 0.5 }}>
            <AccountBalanceIcon sx={{ color: 'primary.main', fontSize: 36 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '0.03em' }}>
              SONALI BANK PLC
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            সোনালী ব্যাংক পিএলসি — Individual Account Opening Form (ব্যক্তিগত হিসাব খোলার ফরম)
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Branch: {formData.branch} | Account Scheme: {formData.account_type} | Currency: {formData.currency}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 0.5 }}>
            Generated Date & Time: {new Date(formData.generated_at).toLocaleString()} | Tracking ID: {formData.application_id}
          </Typography>
        </Box>

        {/* Section 1: Primary Account Holder */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ bgcolor: 'primary.main', color: '#ffffff', px: 2, py: 1, borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              SECTION 1: PRIMARY ACCOUNT HOLDER INFORMATION (মূল হিসাবধারীর বিবরণ)
            </Typography>
          </Box>

          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ width: '25%', fontWeight: 700, bgcolor: '#f8fafc' }}>
                    Full Name in Bengali (বাংলায় নাম):
                  </TableCell>
                  <TableCell sx={{ width: '35%', fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '1rem' }}>
                    {primary_holder.name_bn || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ width: '20%', fontWeight: 700, bgcolor: '#f8fafc' }}>
                    Name in English (Block):
                  </TableCell>
                  <TableCell sx={{ width: '20%', fontWeight: 700, color: 'primary.dark', letterSpacing: '0.04em' }}>
                    {primary_holder.name_en_block || 'N/A'}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                    National ID Number:
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {primary_holder.nid_number || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                    Date of Birth / Issue Date:
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {primary_holder.date_of_birth || 'N/A'} {primary_holder.issue_date ? `(Issued: ${primary_holder.issue_date})` : ''}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                    Father's Name (Bangla):
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    {primary_holder.father_name_bn || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                    Father's Name (English/Banglish):
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'secondary.dark' }}>
                    {primary_holder.father_name_en || 'N/A'}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                    Mother's Name (Bangla):
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    {primary_holder.mother_name_bn || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                    Mother's Name (English/Banglish):
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'secondary.dark' }}>
                    {primary_holder.mother_name_en || 'N/A'}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                    Gender (লিঙ্গ):
                  </TableCell>
                  <TableCell>
                    {primary_holder.gender || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                    Blood Group:
                  </TableCell>
                  <TableCell>
                    {primary_holder.blood_group || 'N/A'}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                    Permanent / NID Address:
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
        <Box sx={{ mt: 4 }}>
          <Box sx={{ bgcolor: 'secondary.main', color: '#ffffff', px: 2, py: 1, borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              SECTION 2: NOMINEE INFORMATION (নমিনির বিবরণ — {nominees?.length || 0} PERSONS)
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            {nominees &&
              nominees.map((nom, idx) => (
                <TableContainer key={idx} component={Paper} variant="outlined">
                  <Box sx={{ px: 2, py: 1, bgcolor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'secondary.dark' }}>
                      NOMINEE #{idx + 1} — RELATIONSHIP: {nom.relationship}
                    </Typography>
                    <Chip
                      size="small"
                      color="secondary"
                      label={`Share: ${nom.share_percentage}%`}
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>

                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ width: '25%', fontWeight: 700, bgcolor: '#f8fafc' }}>
                          Nominee Name in Bengali:
                        </TableCell>
                        <TableCell sx={{ width: '35%', fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.95rem' }}>
                          {nom.name_bn || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ width: '20%', fontWeight: 700, bgcolor: '#f8fafc' }}>
                          Name in English (Block):
                        </TableCell>
                        <TableCell sx={{ width: '20%', fontWeight: 700, color: 'secondary.dark', letterSpacing: '0.04em' }}>
                          {nom.name_en_block || 'N/A'}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                          Nominee NID Number:
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {nom.nid_number || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                          Date of Birth / Issue Date:
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {nom.date_of_birth || 'N/A'} {nom.issue_date ? `(Issued: ${nom.issue_date})` : ''}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                          Father's Name (Bangla):
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                          {nom.father_name_bn || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                          Father's Name (Banglish):
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {nom.father_name_en || 'N/A'}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                          Mother's Name (Bangla):
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                          {nom.mother_name_bn || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                          Mother's Name (Banglish):
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {nom.mother_name_en || 'N/A'}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                          Gender (লিঙ্গ):
                        </TableCell>
                        <TableCell>
                          {nom.gender || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                          Entitled Share:
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {nom.share_percentage}%
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
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
        <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid #cbd5e1' }}>
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ height: 60, borderBottom: '1px solid #94a3b8', mb: 1 }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Signature of Primary Account Holder
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Chip label="KYC VERIFIED & MATCHED" color="success" sx={{ fontWeight: 700 }} />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Intelligent KYC Engine Status
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ height: 60, borderBottom: '1px solid #94a3b8', mb: 1 }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Authorized Bank Officer Signature & Seal
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
