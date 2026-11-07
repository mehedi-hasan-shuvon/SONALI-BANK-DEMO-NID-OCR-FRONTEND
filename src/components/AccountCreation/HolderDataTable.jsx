import React, { useState } from 'react';
import {
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
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import WcOutlinedIcon from '@mui/icons-material/WcOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';
import TranslateIcon from '@mui/icons-material/Translate';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';

export default function HolderDataTable({
  title = 'Extracted KYC Information',
  subtitle = 'Extracted and verified data from National ID card',
  data,
  onUpdateData,
  isNominee = false,
  nomineeIndex = 1,
}) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  if (!data) return null;

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setSnackbarMessage(`Copied: ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenEdit = () => {
    setEditFormData({ ...data });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (onUpdateData) {
      onUpdateData(editFormData);
    }
    setEditDialogOpen(false);
    setSnackbarMessage('Information updated successfully');
  };

  const fields = [
    {
      id: 'name_bn',
      labelEn: 'Name in Bangla',
      labelBn: 'বাংলায় নাম',
      value: data.name_bn,
      icon: <PersonOutlineIcon color="primary" />,
      highlight: true,
      isBengali: true,
    },
    {
      id: 'name_en',
      labelEn: 'Name in English (Block Letter)',
      labelBn: 'ইংরেজিতে নাম (বড় হাতের অক্ষর)',
      value: data.name_en ? data.name_en.toUpperCase() : '',
      icon: <PersonOutlineIcon color="primary" />,
      highlight: true,
      isBlockLetter: true,
    },
    {
      id: 'date_of_birth',
      labelEn: 'Birth Date',
      labelBn: 'জন্ম তারিখ',
      value: data.date_of_birth_display || data.date_of_birth,
      icon: <CakeOutlinedIcon color="primary" />,
      highlight: true,
    },
    {
      id: 'issue_date',
      labelEn: 'Card Issue Date',
      labelBn: 'প্রদানের তারিখ',
      value: data.issue_date_display || data.issue_date,
      icon: <EventAvailableOutlinedIcon color="primary" />,
      highlight: true,
    },
    {
      id: 'father_name_bn',
      labelEn: 'Father Name in Bangla',
      labelBn: 'পিতার নাম (বাংলা)',
      value: data.father_name_bn || data.father_name,
      icon: <FamilyRestroomOutlinedIcon color="action" />,
      isBengali: true,
    },
    {
      id: 'father_name_en',
      labelEn: 'Father Name in English (Banglish)',
      labelBn: 'পিতার নাম (ইংরেজি/বাংলিশ)',
      value: data.father_name_en,
      icon: <TranslateIcon color="secondary" />,
      isBanglish: true,
      badgeText: 'Banglish Transliterated',
    },
    {
      id: 'mother_name_bn',
      labelEn: 'Mother Name in Bangla',
      labelBn: 'মাতার নাম (বাংলা)',
      value: data.mother_name_bn || data.mother_name,
      icon: <FamilyRestroomOutlinedIcon color="action" />,
      isBengali: true,
    },
    {
      id: 'mother_name_en',
      labelEn: 'Mother Name in English (Banglish)',
      labelBn: 'মাতার নাম (ইংরেজি/বাংলিশ)',
      value: data.mother_name_en,
      icon: <TranslateIcon color="secondary" />,
      isBanglish: true,
      badgeText: 'Banglish Transliterated',
    },
    {
      id: 'gender',
      labelEn: 'Gender',
      labelBn: 'লিঙ্গ',
      value: data.gender || 'Not specified',
      icon: <WcOutlinedIcon color="action" />,
    },
    {
      id: 'address',
      labelEn: 'NID Address',
      labelBn: 'এনআইডি ঠিকানা',
      value: data.address,
      icon: <HomeOutlinedIcon color="primary" />,
      isAddress: true,
    },
    {
      id: 'nid_number',
      labelEn: 'National ID Number',
      labelBn: 'জাতীয় পরিচয়পত্র নম্বর',
      value: data.nid_number,
      icon: <BadgeOutlinedIcon color="primary" />,
      extraBadge: data.nid_type || 'NID',
    },
  ];

  if (isNominee) {
    if (data.relationship) {
      fields.unshift({
        id: 'relationship',
        labelEn: 'Relationship with Account Holder',
        labelBn: 'হিসাবধারীর সাথে সম্পর্ক',
        value: data.relationship,
        icon: <FamilyRestroomOutlinedIcon color="primary" />,
        highlight: true,
      });
    }
    if (data.share_percentage) {
      fields.unshift({
        id: 'share_percentage',
        labelEn: 'Nominee Share (%)',
        labelBn: 'নমিনির অংশের হার (%)',
        value: `${data.share_percentage}%`,
        icon: <BadgeOutlinedIcon color="secondary" />,
        highlight: true,
      });
    }
  }

  return (
    <Card sx={{ mb: 3, border: '1px solid #cbd5e1', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BadgeOutlinedIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'primary.dark' }}>
                {title}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label="KYC Verified"
                color="success"
                size="small"
                variant="filled"
                sx={{ fontWeight: 600 }}
              />
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditIcon fontSize="small" />}
                onClick={handleOpenEdit}
                sx={{ textTransform: 'none', py: 0.3 }}
              >
                Edit Details
              </Button>
            </Box>
          </Box>
        }
        subheader={subtitle}
        sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', py: 1.5 }}
      />

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
        <Table size="small" aria-label="KYC Information Table">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f1f5f9' }}>
              <TableCell sx={{ width: '32%', fontWeight: 700, color: '#334155' }}>
                Field Name / বিবরণ
              </TableCell>
              <TableCell sx={{ width: '52%', fontWeight: 700, color: '#334155' }}>
                Extracted Value / মান
              </TableCell>
              <TableCell sx={{ width: '16%', textAlign: 'right', fontWeight: 700, color: '#334155' }}>
                Action
              </TableCell>
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
                    bgcolor: field.highlight ? 'rgba(0, 106, 78, 0.02)' : 'inherit',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {/* Field Label */}
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      {field.icon}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.85rem' }}>
                          {field.labelEn}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Hind Siliguri' }}>
                          {field.labelBn}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Value */}
                  <TableCell>
                    {hasValue ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: field.highlight ? 700 : 500,
                            color: field.highlight ? 'primary.dark' : 'text.primary',
                            fontFamily: field.isBengali ? 'Hind Siliguri, sans-serif' : 'inherit',
                            fontSize: field.isBlockLetter ? '0.95rem' : '0.9rem',
                            letterSpacing: field.isBlockLetter ? '0.04em' : 'normal',
                            textTransform: field.isBlockLetter ? 'uppercase' : 'none',
                          }}
                        >
                          {field.value}
                        </Typography>

                        {field.badgeText && (
                          <Chip
                            size="small"
                            icon={<AutoFixHighIcon style={{ fontSize: 13 }} />}
                            label={field.badgeText}
                            color="secondary"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600 }}
                          />
                        )}

                        {field.extraBadge && (
                          <Chip
                            size="small"
                            label={field.extraBadge}
                            color="primary"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.68rem' }}
                          />
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic', fontSize: '0.85rem' }}>
                        Not available / পাওয়া যায়নি
                      </Typography>
                    )}
                  </TableCell>

                  {/* Copy Button */}
                  <TableCell sx={{ textAlign: 'right' }}>
                    {hasValue && (
                      <Tooltip title={isCopied ? 'Copied!' : 'Copy value'}>
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(field.value, field.id)}
                          color={isCopied ? 'success' : 'default'}
                          sx={{ p: 0.5 }}
                        >
                          {isCopied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Data Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main', borderBottom: '1px solid #e2e8f0' }}>
          Edit {title}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name in Bangla (বাংলায় নাম)"
                value={editFormData.name_bn || ''}
                onChange={(e) => setEditFormData({ ...editFormData, name_bn: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name in English (Block Letter)"
                value={editFormData.name_en || ''}
                onChange={(e) => setEditFormData({ ...editFormData, name_en: e.target.value.toUpperCase() })}
                variant="outlined"
                size="small"
                helperText="Will be saved in uppercase block letters"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Birth Date (জন্ম তারিখ)"
                value={editFormData.date_of_birth_display || editFormData.date_of_birth || ''}
                onChange={(e) => setEditFormData({ ...editFormData, date_of_birth: e.target.value, date_of_birth_display: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Card Issue Date (প্রদানের তারিখ)"
                value={editFormData.issue_date_display || editFormData.issue_date || ''}
                onChange={(e) => setEditFormData({ ...editFormData, issue_date: e.target.value, issue_date_display: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="National ID Number"
                value={editFormData.nid_number || ''}
                onChange={(e) => setEditFormData({ ...editFormData, nid_number: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Father Name in Bangla (পিতার নাম - বাংলা)"
                value={editFormData.father_name_bn || editFormData.father_name || ''}
                onChange={(e) => setEditFormData({ ...editFormData, father_name_bn: e.target.value, father_name: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Father Name in English (Banglish)"
                value={editFormData.father_name_en || ''}
                onChange={(e) => setEditFormData({ ...editFormData, father_name_en: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mother Name in Bangla (মাতার নাম - বাংলা)"
                value={editFormData.mother_name_bn || editFormData.mother_name || ''}
                onChange={(e) => setEditFormData({ ...editFormData, mother_name_bn: e.target.value, mother_name: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mother Name in English (Banglish)"
                value={editFormData.mother_name_en || ''}
                onChange={(e) => setEditFormData({ ...editFormData, mother_name_en: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Gender (লিঙ্গ)"
                value={editFormData.gender || ''}
                onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            {isNominee && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Relationship with Holder"
                    value={editFormData.relationship || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, relationship: e.target.value })}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Share Percentage (%)"
                    type="number"
                    value={editFormData.share_percentage || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, share_percentage: e.target.value })}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="NID Address (ঠিকানা)"
                value={editFormData.address || ''}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar notification */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={2000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
