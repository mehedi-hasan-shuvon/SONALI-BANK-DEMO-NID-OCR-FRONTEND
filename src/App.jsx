import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  CircularProgress,
  Snackbar,
  Stack,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import Header from './components/Header';
import DualUploader from './components/DualUploader';
import ValidationAlert from './components/ValidationAlert';
import KYCTable from './components/KYCTable';
import AddressCard from './components/AddressCard';
import MRZCard from './components/MRZCard';
import RawTextDialog from './components/RawTextDialog';
import InfoDialog from './components/InfoDialog';

import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArticleIcon from '@mui/icons-material/Article';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Backend Base URL: Vite proxy directs /api to http://127.0.0.1:8000
const API_BASE = 'http://127.0.0.1:8000';

export default function App() {
  const [mode, setMode] = useState('dual'); // 'dual' | 'single'
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [singleFile, setSingleFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [rawText, setRawText] = useState(null);

  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [rawTextOpen, setRawTextOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Health check on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
        if (res.ok) {
          setIsBackendOnline(true);
        } else {
          setIsBackendOnline(false);
        }
      } catch (e) {
        // Fallback to proxy
        try {
          const res = await fetch('/api/v1/nid/ocr', { method: 'OPTIONS' });
          setIsBackendOnline(res.ok || res.status === 405);
        } catch {
          setIsBackendOnline(false);
        }
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  // Quick Demo Preloader helper
  const loadDemoCard = async (type = 'smart') => {
    setError(null);
    try {
      if (type === 'smart') {
        setMode('dual');
        // Fetch front sample
        const frontRes = await fetch('/samples/sample_smart_nid_front.jpg');
        const frontBlob = await frontRes.blob();
        const front = new File([frontBlob], 'sample_smart_nid_front.jpg', { type: 'image/jpeg' });
        setFrontFile(front);

        // Fetch back sample
        const backRes = await fetch('/samples/sample_smart_nid_back.jpg');
        const backBlob = await backRes.blob();
        const back = new File([backBlob], 'sample_smart_nid_back.jpg', { type: 'image/jpeg' });
        setBackFile(back);

        setToastMessage('Loaded Smart NID sample (Front + Back). Click "Extract KYC Information" to process.');
      } else {
        setMode('single');
        const oldRes = await fetch('/samples/sample_old_nid_17digit.jpg');
        const oldBlob = await oldRes.blob();
        const old = new File([oldBlob], 'sample_old_nid_17digit.jpg', { type: 'image/jpeg' });
        setSingleFile(old);
        setToastMessage('Loaded Old NID sample (17-digit). Click "Extract KYC Information" to process.');
      }
    } catch (err) {
      setError('Could not load sample files. Please upload your own NID images.');
    }
  };

  const handleProcessOCR = async () => {
    setLoading(true);
    setError(null);

    const formData = new FormData();

    try {
      let endpoint = '';
      if (mode === 'dual') {
        if (!frontFile || !backFile) {
          setError('Please provide both Front and Back side images of the NID card.');
          setLoading(false);
          return;
        }
        formData.append('front_file', frontFile);
        formData.append('back_file', backFile);
        endpoint = `${API_BASE}/api/v1/nid/ocr/dual`;
      } else {
        if (!singleFile) {
          setError('Please select an NID image to upload.');
          setLoading(false);
          return;
        }
        formData.append('file', singleFile);
        endpoint = `${API_BASE}/api/v1/nid/ocr`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.detail || json.message || 'OCR extraction failed.');
      }

      setOcrResult(json.data);
      setRawText(json.raw_text);
      setToastMessage('NID OCR extracted successfully!');

      // Smooth scroll to results
      setTimeout(() => {
        const el = document.getElementById('results-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);

    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while connecting to the OCR service.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFrontFile(null);
    setBackFile(null);
    setSingleFile(null);
    setOcrResult(null);
    setRawText(null);
    setError(null);
  };

  const handleCopyJSON = () => {
    if (!ocrResult) return;
    navigator.clipboard.writeText(JSON.stringify(ocrResult, null, 2));
    setToastMessage('Full KYC JSON copied to clipboard.');
  };

  const handleDownloadJSON = () => {
    if (!ocrResult) return;
    const blob = new Blob([JSON.stringify(ocrResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NID_KYC_${ocrResult.nid_number || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage('KYC JSON downloaded.');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Navigation Bar */}
      <Header
        isBackendOnline={isBackendOnline}
        onOpenInfo={() => setInfoOpen(true)}
      />

      <Container maxWidth="xl" sx={{ flexGrow: 1, pb: 6 }}>
        {/* Quick Demo Selector */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Select card images below or quickly test using sample bank records:
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<PlayCircleOutlineIcon />}
              onClick={() => loadDemoCard('smart')}
            >
              Load Demo Smart NID (Dual)
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              startIcon={<PlayCircleOutlineIcon />}
              onClick={() => loadDemoCard('old')}
            >
              Load Demo Old NID (Single)
            </Button>
          </Stack>
        </Box>

        {/* Upload Zone */}
        <DualUploader
          onProcess={handleProcessOCR}
          loading={loading}
          frontFile={frontFile}
          setFrontFile={setFrontFile}
          backFile={backFile}
          setBackFile={setBackFile}
          singleFile={singleFile}
          setSingleFile={setSingleFile}
          mode={mode}
          setMode={setMode}
          onReset={handleReset}
        />

        {/* Backend offline warning */}
        {!isBackendOnline && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle sx={{ fontWeight: 600 }}>OCR Backend Service Not Reachable</AlertTitle>
            Ensure your FastAPI service is running on <code>http://127.0.0.1:8000</code>. Run:
            <br />
            <code>./venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000</code>
          </Alert>
        )}

        {/* Error notification */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            <AlertTitle sx={{ fontWeight: 600 }}>Extraction Failed</AlertTitle>
            {error}
          </Alert>
        )}

        {/* RESULTS SECTION */}
        {ocrResult && (
          <Box id="results-section" sx={{ mt: 4 }}>
            {/* Header / Action Bar */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: '#ffffff',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Verification Results (যাচাইকৃত ফলাফল)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customer ID / NID: <strong>{ocrResult.nid_number || 'N/A'}</strong> — {ocrResult.name_en || ocrResult.name_bn || 'Identified Customer'}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<ArticleIcon />}
                  onClick={() => setRawTextOpen(true)}
                >
                  Raw OCR Logs
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyJSON}
                >
                  Copy JSON
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadJSON}
                >
                  Export KYC (JSON)
                </Button>
              </Stack>
            </Box>

            {/* Validation & Confidence summary */}
            <ValidationAlert data={ocrResult} />

            {/* Main Extracted KYC Information Table */}
            <KYCTable data={ocrResult} />

            {/* Address Breakdown Table (if address extracted) */}
            {ocrResult.address && <AddressCard address={ocrResult.address} />}

            {/* MRZ Zone Card (if MRZ present) */}
            {ocrResult.mrz && <MRZCard mrz={ocrResult.mrz} />}
          </Box>
        )}
      </Container>

      {/* Raw Text Drawer / Dialog */}
      <RawTextDialog
        open={rawTextOpen}
        onClose={() => setRawTextOpen(false)}
        rawText={rawText}
      />

      {/* Info / About Modal */}
      <InfoDialog
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
      />

      {/* Toast notifications */}
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
