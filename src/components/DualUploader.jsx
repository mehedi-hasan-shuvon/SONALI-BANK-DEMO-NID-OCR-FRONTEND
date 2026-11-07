import React, { useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  Grid,
  IconButton,
  CircularProgress,
  Tooltip,
  Paper,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BadgeIcon from '@mui/icons-material/Badge';
import FlipToBackIcon from '@mui/icons-material/FlipToBack';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

export default function DualUploader({
  onProcess,
  loading,
  frontFile,
  setFrontFile,
  backFile,
  setBackFile,
  singleFile,
  setSingleFile,
  mode,
  setMode,
  onReset,
}) {
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);
  const singleInputRef = useRef(null);

  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [singlePreview, setSinglePreview] = useState(null);

  const handleFrontSelect = (file) => {
    if (!file) return;
    setFrontFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setFrontPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleBackSelect = (file) => {
    if (!file) return;
    setBackFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setBackPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSingleSelect = (file) => {
    if (!file) return;
    setSingleFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setSinglePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const clearFront = (e) => {
    e.stopPropagation();
    setFrontFile(null);
    setFrontPreview(null);
    if (frontInputRef.current) frontInputRef.current.value = '';
  };

  const clearBack = (e) => {
    e.stopPropagation();
    setBackFile(null);
    setBackPreview(null);
    if (backInputRef.current) backInputRef.current.value = '';
  };

  const clearSingle = (e) => {
    e.stopPropagation();
    setSingleFile(null);
    setSinglePreview(null);
    if (singleInputRef.current) singleInputRef.current.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFrontDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFrontSelect(e.dataTransfer.files[0]);
    }
  };

  const handleBackDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleBackSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSingleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSingleSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFullReset = () => {
    clearFront({ stopPropagation: () => {} });
    clearBack({ stopPropagation: () => {} });
    clearSingle({ stopPropagation: () => {} });
    if (onReset) onReset();
  };

  const canSubmit = mode === 'dual' ? (frontFile && backFile) : !!singleFile;

  return (
    <Card sx={{ mb: 4, overflow: 'hidden' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>


        {(frontFile || backFile || singleFile) && (
          <Button
            size="small"
            color="inherit"
            startIcon={<RestartAltIcon />}
            onClick={handleFullReset}
            sx={{ color: 'text.secondary', textTransform: 'none', ml: 'auto'}}

          >
            Clear All
          </Button>
        )}
      </Box>

      <CardContent sx={{ p: 3 }}>
        {mode === 'dual' ? (
          <Grid container spacing={3}>
            {/* Front Card Dropzone */}
            <Grid item xs={12} md={6}>
              <Paper
                variant="outlined"
                onDragOver={handleDragOver}
                onDrop={handleFrontDrop}
                onClick={() => frontInputRef.current?.click()}
                sx={{
                  p: 2.5,
                  height: 240,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px dashed',
                  borderColor: frontFile ? 'primary.main' : '#cbd5e1',
                  bgcolor: frontFile ? 'rgba(184, 134, 11, 0.04)' : '#f8fafc',
                  borderRadius: 2,
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(184, 134, 11, 0.07)',
                  },
                }}
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  ref={frontInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFrontSelect(e.target.files?.[0])}
                />

                {frontPreview ? (
                  <Box sx={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box
                      component="img"
                      src={frontPreview}
                      alt="NID Front"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '180px',
                        objectFit: 'contain',
                        borderRadius: 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BadgeIcon fontSize="small" /> NID Front: {frontFile?.name}
                      </Typography>
                      <Tooltip title="Remove Front Image">
                        <IconButton size="small" color="error" onClick={clearFront}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        bgcolor: 'primary.light',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5,
                      }}
                    >
                      <CloudUploadIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                      Upload Front Side (সামনের পাতা)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 280, fontSize: '0.8rem' }}>
                      Drag & drop or browse image. Extracts: Name (EN/BN), NID Number, Date of Birth, Father & Mother Name.
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1 }}>
                      JPG, PNG, WebP supported
                    </Typography>
                  </>
                )}
              </Paper>
            </Grid>

            {/* Back Card Dropzone */}
            <Grid item xs={12} md={6}>
              <Paper
                variant="outlined"
                onDragOver={handleDragOver}
                onDrop={handleBackDrop}
                onClick={() => backInputRef.current?.click()}
                sx={{
                  p: 2.5,
                  height: 240,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px dashed',
                  borderColor: backFile ? 'secondary.main' : '#cbd5e1',
                  bgcolor: backFile ? 'rgba(180, 83, 9, 0.03)' : '#f8fafc',
                  borderRadius: 2,
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    bgcolor: 'rgba(180, 83, 9, 0.05)',
                  },
                }}
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  ref={backInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => handleBackSelect(e.target.files?.[0])}
                />

                {backPreview ? (
                  <Box sx={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box
                      component="img"
                      src={backPreview}
                      alt="NID Back"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '180px',
                        objectFit: 'contain',
                        borderRadius: 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'secondary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FlipToBackIcon fontSize="small" /> NID Back: {backFile?.name}
                      </Typography>
                      <Tooltip title="Remove Back Image">
                        <IconButton size="small" color="error" onClick={clearBack}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        bgcolor: 'secondary.light',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5,
                      }}
                    >
                      <CloudUploadIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                      Upload Back Side (পেছনের পাতা)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 280, fontSize: '0.8rem' }}>
                      Drag & drop or browse image. Extracts: Address, Blood Group, Place of Birth, Issue Date & MRZ lines.
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1 }}>
                      JPG, PNG, WebP supported
                    </Typography>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        ) : (
          /* Single Card Dropzone */
          <Paper
            variant="outlined"
            onDragOver={handleDragOver}
            onDrop={handleSingleDrop}
            onClick={() => singleInputRef.current?.click()}
            sx={{
              p: 3,
              height: 240,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px dashed',
              borderColor: singleFile ? 'primary.main' : '#cbd5e1',
              bgcolor: singleFile ? 'rgba(184, 134, 11, 0.04)' : '#f8fafc',
              borderRadius: 2,
              position: 'relative',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'rgba(184, 134, 11, 0.07)',
              },
            }}
          >
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              ref={singleInputRef}
              style={{ display: 'none' }}
              onChange={(e) => handleSingleSelect(e.target.files?.[0])}
            />

            {singlePreview ? (
              <Box sx={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  component="img"
                  src={singlePreview}
                  alt="NID"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '180px',
                    objectFit: 'contain',
                    borderRadius: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <BadgeIcon fontSize="small" /> Selected: {singleFile?.name}
                  </Typography>
                  <Tooltip title="Remove Image">
                    <IconButton size="small" color="error" onClick={clearSingle}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                  Upload NID Image (Front or Back)
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 360, fontSize: '0.85rem' }}>
                  The engine will automatically detect card side and extract all available data fields.
                </Typography>
              </>
            )}
          </Paper>
        )}

        {/* Action Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={!canSubmit || loading}
            onClick={onProcess}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DocumentScannerIcon />}
            sx={{
              px: 4,
              py: 1.3,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 260,
            }}
          >
            {loading ? 'Processing OCR Extraction...' : 'Extract KYC Information'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
