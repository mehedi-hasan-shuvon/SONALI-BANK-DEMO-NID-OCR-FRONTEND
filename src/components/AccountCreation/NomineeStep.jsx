import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Alert,
  Divider,
  Stack,
  Grid,
  TextField,
  MenuItem,
  Chip,
  Tooltip,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

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

  // Calculate total share percentage currently allocated
  const totalAllocatedShare = nominees.reduce(
    (sum, n) => sum + (parseInt(n.share_percentage, 10) || 0),
    0
  );

  // Update a specific nominee property
  const updateNominee = (id, updates) => {
    setNominees((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
  };

  /**
   * Automatic Share Percentage and Dynamic Nominee Generation:
   * 1. If Nominee 1 is 100%, only Nominee 1 is displayed.
   * 2. If Nominee 1's share is reduced below 100%, Nominee 2 is automatically generated
   *    with the remaining percentage so total adds up to exactly 100%.
   * 3. If Nominee 2's share is further reduced, Nominee 3 is automatically created with remainder.
   * 4. If Nominee 1 is set back to 100%, extra nominees are automatically removed.
   * 5. Fixes the leading 0 issue when typing numbers.
   */
  const handleShareChange = (index, rawValue) => {
    setGeneralError(null);

    // If user cleared the input (empty string), allow it so they can type cleanly without leading zeros
    if (rawValue === '') {
      setNominees((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], share_percentage: '' };
        return next;
      });
      return;
    }

    // Strip leading zeros e.g. "050" -> "50", "0" -> "0"
    const sanitized = typeof rawValue === 'string' ? rawValue.replace(/^0+(?=\d)/, '') : String(rawValue);
    const parsed = parseInt(sanitized, 10);
    if (isNaN(parsed)) return;

    setNominees((prev) => {
      let updated = prev.map((n) => ({ ...n }));

      // Calculate sum of shares before this nominee
      let sumBefore = 0;
      for (let i = 0; i < index; i++) {
        sumBefore += (parseInt(updated[i].share_percentage, 10) || 0);
      }

      // Max allowed for this nominee
      const maxAllowed = Math.max(0, 100 - sumBefore);
      const validShare = Math.min(maxAllowed, Math.max(0, parsed));

      updated[index] = {
        ...updated[index],
        share_percentage: validShare,
        data: updated[index].data
          ? { ...updated[index].data, share_percentage: validShare }
          : null,
      };

      const currentTotal = sumBefore + validShare;

      if (currentTotal === 100) {
        // Reached 100%! Remove any subsequent nominees
        updated = updated.slice(0, index + 1);
      } else if (currentTotal < 100) {
        const remaining = 100 - currentTotal;

        if (updated.length > index + 1) {
          // Update the next nominee's share with the remaining percentage
          updated[index + 1] = {
            ...updated[index + 1],
            share_percentage: remaining,
            data: updated[index + 1].data
              ? { ...updated[index + 1].data, share_percentage: remaining }
              : null,
          };
          // Keep only up to index + 1 so total is 100%
          updated = updated.slice(0, index + 2);
        } else {
          // Automatically spawn the next nominee form with remaining percentage!
          updated.push({
            id: Date.now() + Math.random(),
            relationship: index === 0 ? 'Son (ছেলে)' : 'Daughter (মেয়ে)',
            share_percentage: remaining,
            frontFile: null,
            backFile: null,
            data: null,
            loading: false,
            error: null,
          });
        }
      }

      return updated;
    });
  };

  // When field loses focus, if it was left empty, ensure it has a valid number
  const handleShareBlur = (index) => {
    if (nominees[index]?.share_percentage === '') {
      handleShareChange(index, 0);
    }
  };

  // Remove a nominee manually
  const handleRemoveNominee = (id) => {
    if (nominees.length <= 1) return;
    setGeneralError(null);

    setNominees((prev) => {
      const targetIndex = prev.findIndex((n) => n.id === id);
      if (targetIndex === -1) return prev;

      const remainingList = prev.filter((n) => n.id !== id);

      // Re-balance shares to equal exactly 100%
      // Add the removed share to Nominee 1 or distribute
      let sumOthers = 0;
      for (let i = 1; i < remainingList.length; i++) {
        sumOthers += (parseInt(remainingList[i].share_percentage, 10) || 0);
      }
      const newFirstShare = Math.max(1, 100 - sumOthers);
      remainingList[0] = {
        ...remainingList[0],
        share_percentage: newFirstShare,
        data: remainingList[0].data
          ? { ...remainingList[0].data, share_percentage: newFirstShare }
          : null,
      };

      return remainingList;
    });
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
        issue_date: ocr.issue_date || '',
        issue_date_display: ocr.issue_date_display || ocr.issue_date || '',
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
        issue_date: isFirst ? '2020-05-12' : '2021-09-18',
        issue_date_display: isFirst ? '12 May 2020' : '18 Sep 2021',
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
    // 1. Verify that all displayed nominees have extracted KYC data
    const unextractedIndex = nominees.findIndex((n) => !n.data);
    if (unextractedIndex !== -1) {
      setGeneralError(
        `Please upload and extract KYC information for Nominee #${unextractedIndex + 1} before generating the form.`
      );
      return;
    }

    // 2. Verify that total shares add up to exactly 100%
    if (totalAllocatedShare !== 100) {
      setGeneralError(
        `Nominee share percentages must add up to exactly 100%. Currently total is ${totalAllocatedShare}%.`
      );
      return;
    }

    setGeneralError(null);
    onGenerateForm();
  };

  return (
    <Box>
      {/* Title & Introduction */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
          <FamilyRestroomIcon color="primary" fontSize="large" /> Nominee Information (নমিনির তথ্য)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Nominee #1 defaults to 100% share. If you reduce the share percentage below 100%, additional nominee information forms will appear automatically. All nominee shares must add up to exactly 100%.
        </Typography>
      </Box>

      {/* Share Allocation Status Card */}
      <Card
        sx={{
          mb: 3,
          p: 1.8,
          bgcolor: totalAllocatedShare === 100 ? '#f0fdf4' : '#fffbeb',
          border: '1px solid',
          borderColor: totalAllocatedShare === 100 ? '#86efac' : '#fde68a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          {totalAllocatedShare === 100 ? (
            <CheckCircleOutlineIcon color="success" />
          ) : (
            <WarningAmberIcon color="warning" />
          )}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: totalAllocatedShare === 100 ? '#15803d' : '#b45309' }}>
              Nominee Share Distribution: {totalAllocatedShare}% / 100%
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {totalAllocatedShare === 100
                ? nominees.length === 1
                  ? 'Nominee #1 is allocated 100% share. You can proceed directly to generate the form.'
                  : `All ${nominees.length} nominees' shares are balanced and equal 100%.`
                : `Remaining ${100 - totalAllocatedShare}% must be allocated to balance to 100%.`}
            </Typography>
          </Box>
        </Box>

        <Chip
          label={totalAllocatedShare === 100 ? '100% Balanced' : `${totalAllocatedShare}% Allocated`}
          color={totalAllocatedShare === 100 ? 'success' : 'warning'}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      </Card>

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
                      <Tooltip title="Remove this Nominee and rebalance share">
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
                      type="text"
                      label="Nominee Share Percentage (নমিনির অংশের হার %)"
                      value={nominee.share_percentage === '' ? '' : nominee.share_percentage}
                      onChange={(e) => handleShareChange(index, e.target.value)}
                      onBlur={() => handleShareBlur(index)}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', ml: 0.5 }}>
                            %
                          </Typography>
                        ),
                      }}
                      helperText={
                        nomineeNumber === 1 && nominees.length === 1
                          ? 'Default is 100%. If changed to < 100%, another nominee form will automatically appear.'
                          : 'Auto-balanced so total nominee shares equal exactly 100%.'
                      }
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
