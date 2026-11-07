import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import PrimaryHolderStep from './PrimaryHolderStep';
import NomineeStep from './NomineeStep';
import AccountFormPreview from './AccountFormPreview';
import { banglaToBanglish, toBlockLetters } from '../../utils/transliterate';

const STEPS = [
  { label: 'Primary Account Holder', icon: <PersonIcon /> },
  { label: 'Nominee Information', icon: <FamilyRestroomIcon /> },
  { label: 'Generate & Review Form', icon: <AssignmentTurnedInIcon /> },
];

export default function DemoAccountCreation() {
  const [activeStep, setActiveStep] = useState(0);

  // Primary Account Holder Data
  const [primaryHolderData, setPrimaryHolderData] = useState(null);

  // Nominees State (Array supporting multiple nominees)
  const [nominees, setNominees] = useState([
    {
      id: 1,
      relationship: 'Spouse (স্ত্রী/স্বামী)',
      share_percentage: 100,
      frontFile: null,
      backFile: null,
      data: null,
      loading: false,
      error: null,
    },
  ]);

  // Generated Form State
  const [generatedForm, setGeneratedForm] = useState(null);

  // Handle Generate Form
  const handleGenerateForm = () => {
    if (!primaryHolderData) {
      alert('Primary account holder information is required.');
      setActiveStep(0);
      return;
    }

    const validNominees = nominees.filter((n) => !!n.data);
    if (validNominees.length === 0) {
      alert('Please provide information for at least one nominee.');
      setActiveStep(1);
      return;
    }

    const formPayload = {
      application_id: `SB-AOF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      generated_at: new Date().toISOString(),
      bank: 'Sonali Bank PLC',
      branch: 'Principal Branch, Motijheel, Dhaka',
      account_type: 'Savings Bank Deposit Account (SB)',
      currency: 'BDT (Bangladeshi Taka)',
      primary_holder: {
        nid_number: primaryHolderData.nid_number || 'N/A',
        name_bn: primaryHolderData.name_bn || 'N/A',
        name_en_block: primaryHolderData.name_en || 'N/A',
        date_of_birth: primaryHolderData.date_of_birth_display || primaryHolderData.date_of_birth || 'N/A',
        father_name_bn: primaryHolderData.father_name_bn || 'N/A',
        father_name_en: primaryHolderData.father_name_en || 'N/A',
        mother_name_bn: primaryHolderData.mother_name_bn || 'N/A',
        mother_name_en: primaryHolderData.mother_name_en || 'N/A',
        gender: primaryHolderData.gender || 'N/A',
        blood_group: primaryHolderData.blood_group || 'N/A',
        address: primaryHolderData.address || 'N/A',
      },
      nominees: validNominees.map((nom, idx) => ({
        nominee_index: idx + 1,
        relationship: nom.relationship,
        share_percentage: nom.share_percentage,
        nid_number: nom.data.nid_number || 'N/A',
        name_bn: nom.data.name_bn || 'N/A',
        name_en_block: nom.data.name_en || 'N/A',
        date_of_birth: nom.data.date_of_birth_display || nom.data.date_of_birth || 'N/A',
        father_name_bn: nom.data.father_name_bn || 'N/A',
        father_name_en: nom.data.father_name_en || 'N/A',
        mother_name_bn: nom.data.mother_name_bn || 'N/A',
        mother_name_en: nom.data.mother_name_en || 'N/A',
        gender: nom.data.gender || 'N/A',
        address: nom.data.address || 'N/A',
      })),
    };

    // Console log the generated form as requested!
    console.log('===============================================================');
    console.log('🏦 SONALI BANK PLC - DEMO ACCOUNT OPENING FORM GENERATED:');
    console.log('Application ID:', formPayload.application_id);
    console.log('Generated At:', formPayload.generated_at);
    console.log('Full Form Payload Object:', formPayload);
    console.log('--- Primary Account Holder Details ---');
    console.table(formPayload.primary_holder);
    console.log('--- Nominee(s) Details ---');
    console.table(formPayload.nominees);
    console.log('Full Form JSON:');
    console.log(JSON.stringify(formPayload, null, 2));
    console.log('===============================================================');

    setGeneratedForm(formPayload);
    setActiveStep(2);
  };

  // Full reset
  const handleResetAll = () => {
    setPrimaryHolderData(null);
    setNominees([
      {
        id: 1,
        relationship: 'Spouse (স্ত্রী/স্বামী)',
        share_percentage: 100,
        frontFile: null,
        backFile: null,
        data: null,
        loading: false,
        error: null,
      },
    ]);
    setGeneratedForm(null);
    setActiveStep(0);
  };

  // Load Complete Pre-filled Demo Account (Both Primary + Nominee)
  const handleLoadFullDemo = () => {
    const primary = {
      nid_number: '5506821345',
      nid_type: 'SMART',
      name_bn: 'মেহেদী হাসান',
      name_en: 'MEHEDI HASAN',
      date_of_birth: '1995-10-24',
      date_of_birth_display: '24 Oct 1995',
      father_name_bn: 'মোঃ রফিকুল ইসলাম',
      father_name_en: banglaToBanglish('মোঃ রফিকুল ইসলাম'),
      mother_name_bn: 'রাবেয়া খাতুন',
      mother_name_en: banglaToBanglish('রাবেয়া খাতুন'),
      gender: 'Male',
      blood_group: 'B+',
      place_of_birth: 'Dhaka',
      address: 'বাসা/হোল্ডিং: ১২/এ, গ্রাম/রাস্তা: ধানমন্ডি ২৭, ডাকঘর: মোহাম্মদপুর - ১২০৭, থানা: ধানমন্ডি, জেলা: ঢাকা',
    };

    const nominee1 = {
      nid_number: '7806829871',
      nid_type: 'SMART',
      name_bn: 'নুসরাত জাহান',
      name_en: 'NUSRAT JAHAN',
      date_of_birth: '1998-03-15',
      date_of_birth_display: '15 Mar 1998',
      father_name_bn: 'আব্দুল করিম',
      father_name_en: banglaToBanglish('আব্দুল করিম'),
      mother_name_bn: 'ফাতেমা বেগম',
      mother_name_en: banglaToBanglish('ফাতেমা বেগম'),
      gender: 'Female',
      address: 'বাসা/হোল্ডিং: ৮/বি, গ্রাম/রাস্তা: মিরপুর রোড, ডাকঘর: মিরপুর - ১২১৬, থানা: মিরপুর, জেলা: ঢাকা',
      relationship: 'Spouse (স্ত্রী/স্বামী)',
      share_percentage: 100,
    };

    setPrimaryHolderData(primary);
    setNominees([
      {
        id: 1,
        relationship: 'Spouse (স্ত্রী/স্বামী)',
        share_percentage: 100,
        frontFile: null,
        backFile: null,
        data: nominee1,
        loading: false,
        error: null,
      },
    ]);
  };

  return (
    <Box sx={{ mt: 1, mb: 6 }}>
      {/* Quick Action Top Bar */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Step-by-step Intelligent KYC Account Opening with Dual-Side OCR & Banglish transliteration:
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<PlayCircleOutlineIcon />}
            onClick={handleLoadFullDemo}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Load Full Demo Account (Primary + Nominee)
          </Button>
          {(primaryHolderData || generatedForm) && (
            <Button
              size="small"
              color="inherit"
              startIcon={<RestartAltIcon />}
              onClick={handleResetAll}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              Reset Process
            </Button>
          )}
        </Stack>
      </Box>

      {/* Stepper Header */}
      <Card sx={{ mb: 4, borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <CardContent sx={{ py: 2.5, px: { xs: 2, md: 4 } }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((step, index) => (
              <Step key={step.label} completed={activeStep > index}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.Mui-active': { color: 'primary.main' },
                      '&.Mui-completed': { color: 'success.main' },
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: activeStep === index ? 700 : 500 }}>
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Step Contents */}
      {activeStep === 0 && (
        <PrimaryHolderStep
          primaryHolderData={primaryHolderData}
          setPrimaryHolderData={setPrimaryHolderData}
          onNext={() => setActiveStep(1)}
        />
      )}

      {activeStep === 1 && (
        <NomineeStep
          nominees={nominees}
          setNominees={setNominees}
          onBack={() => setActiveStep(0)}
          onGenerateForm={handleGenerateForm}
        />
      )}

      {activeStep === 2 && generatedForm && (
        <AccountFormPreview
          formData={generatedForm}
          onResetAll={handleResetAll}
          onBackToEdit={() => setActiveStep(1)}
        />
      )}
    </Box>
  );
}
