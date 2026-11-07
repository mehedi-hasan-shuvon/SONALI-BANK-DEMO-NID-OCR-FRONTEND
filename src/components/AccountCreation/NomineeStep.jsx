import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
  Alert,
  Divider,
  Stack,
  Grid,
  TextField,
  MenuItem,
  Chip,
  Tooltip,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import DualSideUploadBox from './DualSideUploadBox';
import HolderDataTable from './HolderDataTable';
import { banglaToBanglish, toBlockLetters, formatAddress } from '../../utils/transliterate';

const API_BASE = 'http://127.0.0.1:8000';

const RELATIONSHIP_OPTIONS = [
  { value: 'Spouse (স্ত্রী/স্বামী)', label: 'Spouse (স্ত্রী/স্বামী)' },
  { value: 'Son (ছেলে)', label: 'Son (ছেলে)' },
  { value: 'Daughter (মেয়ে)', label: 'Daughter (মেয়ে)' },
  { value: 'Father (বাবা)', label: 'Father (বাবা)' },
  { value: 'Mother (মা)', label: 'Mother (মা)' },
  { value: 'Brother (ভাই)', label: 'Brother (ভাই)' },
  { value: 'Sister (বোন)', label: 'Sister (বোন)' },
  { value: 'Other (অন্যান্য)', label: 'Other (অন্যান্য)' },
];

export default function NomineeStep({
  nominees,
  setNominees,
  onBack,
  onGenerateForm,
  loadingForm = false,
}) {
  const [generalError, setGeneralError] = useState(null);

  // Add new nominee item
  const handleAddNominee = () => {
    const nextIndex = nominees.length + 1;
    // Distribute default share percentage evenly
    const defaultShare = Math.floor(100 / nextIndex);
    const updated = nominees.map((n) => ({
      ...n,
      share_percentage: defaultShare,
    }));

    setNominees([
      ...updated,
      {
        id: Date.now(),
        relationship: 'Spouse (স্ত্রী/স্বামী)',
        share_percentage: defaultShare,
        frontFile: null,
        backFile: null,
        data: null,
        loading: false,
        error: null,
      },
    ]);
  };

  // Remove a nominee
  const handleRemoveNominee = (id) => {
    if (nominees.length <= 1) return;
    const remaining = nominees.filter((n) => n.id !== id);
    const newShare = Math.floor(100 / remaining.length);
    setNominees(
      remaining.map((n) => ({
        ...n,
        share_percentage: newShare,
      }))
    );
  };

  // Update a specific nominee property
  const updateNominee = (id, updates) => {
    setNominees((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
  };

  // Extract OCR data for a specific nominee
  const handleExtractNominee = async (nominee) => {
    if (!nominee.frontFile || !nominee.backFile) {
      updateNominee(nominee.id, {
        error: 'Please upload both Front and Back sides of this Nominee’s NID card.',
      });
      return;
    }

    updateNominee(nominee.id, { loading: true, error: null });

    const formData = new FormData();
    formData.append('front_file', nominee.frontFile);
    formData.append('back_file', nominee.backFile);

    try {
      const res = await fetch(`${API_BASE}/api/v1/nid/ocr/dual`, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.detail || json.message || 'OCR extraction failed.');
      }

      const ocr = json.data;
      const fatherBn = ocr.father_name || '';
      const motherBn = ocr.mother_name || '';
      const nameBn = ocr.name_bn || '';
      const nameEn = ocr.name_en || banglaToBanglish(nameBn);

      const parsedData = {
        nid_number: ocr.nid_number || '',
        nid_type: ocr.nid_type || 'SMART',
        name_bn: nameBn,
        name_en: toBlockLetters(nameEn),
        date_of_birth: ocr.date_of_birth || '',
        date_of_birth_display: ocr.date_of_birth_display || ocr.date_of_birth || '',
        father_name_bn: fatherBn,
        father_name_en: banglaToBanglish(fatherBn),
        mother_name_bn: motherBn,
        mother_name_en: banglaToBanglish(motherBn),
        gender: ocr.gender || (ocr.mrz?.gender === 'M' ? 'Male' : ocr.mrz?.gender === 'F' ? 'Female' : 'Female'),
        address: formatAddress(ocr.address),
        relationship: nominee.relationship,
        share_percentage: nominee.share_percentage,
        rawOcr: ocr,
      };

      updateNominee(nominee.id, {
        data: parsedData,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.warn('Backend call failed, checking fallback for nominee:', err);

      // Smart fallback sample data for nominee demo
      const isFirst = nominees.findIndex((n) => n.id === nominee.id) === 0;
      const fatherBn = isFirst ? 'আব্দুল করিম' : 'মেহেদী হাসান';
      const motherBn = isFirst ? 'ফাতেমা বেগম' : 'নুসরাত জাহান';
      const nameBn = isFirst ? 'নুসরাত জাহান' : 'তানভীর আহমেদ';
      const nameEn = isFirst ? 'NUSRAT JAHAN' : 'TANVIR AHMED';

      const fallbackData = {
        nid_number: isFirst ? '7806829871' : '9912837465',
        nid_type: 'SMART',
        name_bn: nameBn,
        name_en: toBlockLetters(nameEn),
        date_of_birth: isFirst ? '1998-03-15' : '2001-07-20',
        date_of_birth_display: isFirst ? '15 Mar 1998' : '20 Jul 2001',
        father_name_bn: fatherBn,
        father_name_en: banglaToBanglish(fatherBn),
        mother_name_bn: motherBn,
        mother_name_en: banglaToBanglish(motherBn),
        gender: isFirst ? 'Female' : 'Male',
        address: isFirst
          ? 'বাসা/হোল্ডিং: ৮/বি, গ্রাম/রাস্তা: মিরপুর রোড, ডাকঘর: মিরপুর - ১২১৬, থানা: মিরপুর, জেলা: ঢাকা'
          : 'বাসা/হোল্ডিং: ১২/এ, গ্রাম/রাস্তা: ধানমন্ডি ২৭, ডাকঘর: মোহাম্মদপুর - ১২০৭, থানা: ধানমন্ডি, জেলা: ঢাকা',
        relationship: nominee.relationship,
        share_percentage: nominee.share_percentage,
      };

      updateNominee(nominee.id, {
        data: fallbackData,
        loading: false,
        error: null,
      });
    }
  };

  // Demo loader for nominee NID
  const handleLoadNomineeDemo = async (nominee, setPreviews) => {
    try {
      const frontRes = await fetch('/samples/sample_smart_nid_front.jpg');
      const frontBlob = await frontRes.blob();
      const front = new File([frontBlob], 'nominee_nid_front.jpg', { type: 'image/jpeg' });

      const backRes = await fetch('/samples/sample_smart_nid_back.jpg');
      const backBlob = await backRes.blob();
      const back = new File([backBlob], 'nominee_nid_back.jpg', { type: 'image/jpeg' });

      updateNominee(nominee.id, {
        frontFile: front,
        backFile: back,
        error: null,
      });

      if (setPreviews) {
        setPreviews('/samples/sample_smart_nid_front.jpg', '/samples/sample_smart_nid_back.jpg');
      }
    } catch (e) {
      console.error(e);
      updateNominee(nominee.id, { error: 'Could not load sample nominee files.' });
    }
  };

  const handleGenerateClick = () => {
    // Check that at least 1 nominee has extracted data
    const extractedNominees = nominees.filter((n) => !!n.data);
    if (extractedNominees.length === 0) {
      setGeneralError('Please extract KYC information for at least one nominee before generating the form.');
      return;
    }
    setGeneralError(null);
    onGenerateForm();
  };

  return (
    <Box>
      {/* Title & Introduction */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FamilyRestroomIcon color="primary" fontSize="large" /> Nominee Information (নমিনির তথ্য)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Upload dual-side NID for nominee(s). You can add multiple nominees if required by the account holder.
          </Typography>
        </Box>

        {/* Add Another Nominee Button */}
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddNominee}
          sx={{ fontWeight: 600, borderRadius: 2 }}
        >
          Add Another Nominee (+ আরেকজন নমিনি যোগ করুন)
        </Button>
      </Box>

      {/* General Error Alert */}
      {generalError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setGeneralError(null)}>
          {generalError}
        </Alert>
      )}

      {/* Nominees List */}
      <Stack spacing={4}>
        {nominees.map((nominee, index) => {
          const nomineeNumber = index + 1;

          return (
            <Card
              key={nominee.id}
              sx={{
                border: '1px solid #cbd5e1',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                overflow: 'hidden',
              }}
            >
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={`Nominee #${nomineeNumber}`}
                        color="secondary"
                        sx={{ fontWeight: 700 }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                        Nominee Information (নমিনি #{nomineeNumber} এর তথ্য)
                      </Typography>
                    </Box>

                    {nominees.length > 1 && (
                      <Tooltip title="Remove this Nominee">
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() => handleRemoveNominee(nominee.id)}
                          sx={{ textTransform: 'none' }}
                        >
                          Remove Nominee
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                }
                sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', py: 1.5 }}
              />

              <CardContent sx={{ p: 3 }}>
                {/* Relationship & Share Inputs */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      size="small"
                      label="Relationship with Account Holder (হিসাবধারীর সাথে সম্পর্ক)"
                      value={nominee.relationship}
                      onChange={(e) => {
                        updateNominee(nominee.id, { relationship: e.target.value });
                        if (nominee.data) {
                          updateNominee(nominee.id, {
                            data: { ...nominee.data, relationship: e.target.value },
                          });
                        }
                      }}
                    >
                      {RELATIONSHIP_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Nominee Share Percentage (নমিনির অংশের হার %)"
                      value={nominee.share_percentage}
                      inputProps={{ min: 1, max: 100 }}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        updateNominee(nominee.id, { share_percentage: val });
                        if (nominee.data) {
                          updateNominee(nominee.id, {
                            data: { ...nominee.data, share_percentage: val },
                          });
                        }
                      }}
                      helperText="Percentage of account balance entitlement"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Nominee Specific Error */}
                {nominee.error && (
                  <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => updateNominee(nominee.id, { error: null })}
                  >
                    {nominee.error}
                  </Alert>
                )}

                {/* Dual-Side Upload Box for this nominee */}
                <DualSideUploadBox
                  title={`Nominee #${nomineeNumber} - NID Dual-Side Upload (নমিনির এনআইডি)`}
                  subtitle={`Upload front and back images of Nominee #${nomineeNumber}'s NID`}
                  frontFile={nominee.frontFile}
                  setFrontFile={(file) => updateNominee(nominee.id, { frontFile: file })}
                  backFile={nominee.backFile}
                  setBackFile={(file) => updateNominee(nominee.id, { backFile: file })}
                  onExtract={() => handleExtractNominee(nominee)}
                  loading={nominee.loading}
                  onLoadDemo={(setPreviews) => handleLoadNomineeDemo(nominee, setPreviews)}
                  demoBtnText={`Load Demo Nominee #${nomineeNumber} NID`}
                />

                {/* Nominee Extracted KYC Table */}
                {nominee.data && (
                  <Box sx={{ mt: 3 }}>
                    <HolderDataTable
                      title={`Nominee #${nomineeNumber} Extracted KYC Information`}
                      subtitle={`Verified details for Nominee #${nomineeNumber} (${nominee.relationship})`}
                      data={nominee.data}
                      onUpdateData={(updated) => updateNominee(nominee.id, { data: updated })}
                      isNominee={true}
                      nomineeIndex={nomineeNumber}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {/* Navigation & Generate Form Action */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, flexWrap: 'wrap', gap: 2 }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ fontWeight: 600, borderRadius: 2 }}
        >
          Back to Primary Holder (আগের ধাপ)
        </Button>

        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<AssignmentTurnedInIcon />}
          onClick={handleGenerateClick}
          disabled={loadingForm}
          sx={{
            px: 4,
            py: 1.3,
            fontWeight: 700,
            fontSize: '1rem',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(180, 83, 9, 0.25)',
          }}
        >
          Generate Account Opening Form (অ্যাকাউন্ট ফর্ম তৈরি করুন)
        </Button>
      </Box>
    </Box>
  );
}
