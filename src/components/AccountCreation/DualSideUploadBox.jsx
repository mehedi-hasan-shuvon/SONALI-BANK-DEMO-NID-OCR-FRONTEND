import React, { useRef, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Stack,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BadgeIcon from '@mui/icons-material/Badge';
import FlipToBackIcon from '@mui/icons-material/FlipToBack';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function DualSideUploadBox({
  title = 'NID Dual-Side Upload',
  subtitle = 'Upload both front and back images of the National ID card',
  frontFile,
  setFrontFile,
  backFile,
  setBackFile,
  onExtract,
  loading = false,
  onLoadDemo,
  demoBtnText = 'Load Demo NID Sample',
}) {
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);

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

  const clearFront = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setFrontFile(null);
    setFrontPreview(null);
    if (frontInputRef.current) frontInputRef.current.value = '';
  };

  const clearBack = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setBackFile(null);
    setBackPreview(null);
    if (backInputRef.current) backInputRef.current.value = '';
  };

  const handleClearAll = () => {
    clearFront();
    clearBack();
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

  const canExtract = Boolean(frontFile && backFile);

  return (
    <Box sx={{ mb: 3 }}>
      {/* Top Header / Action Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
            {subtitle}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          {onLoadDemo && (
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<PlayCircleOutlineIcon />}
              onClick={() => {
                onLoadDemo((frontPreviewUrl, backPreviewUrl) => {
                  if (frontPreviewUrl) setFrontPreview(frontPreviewUrl);
                  if (backPreviewUrl) setBackPreview(backPreviewUrl);
                });
              }}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              {demoBtnText}
            </Button>
          )}

          {(frontFile || backFile) && (
            <Button
              size="small"
              color="inherit"
              startIcon={<RestartAltIcon />}
              onClick={handleClearAll}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              Clear
            </Button>
          )}
        </Stack>
      </Box>

      {/* Dual Dropzone Grid */}
      <Grid container spacing={2.5}>
        {/* Front Dropzone */}
        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            onDragOver={handleDragOver}
            onDrop={handleFrontDrop}
            onClick={() => frontInputRef.current?.click()}
            sx={{
              p: 2,
              height: 220,
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
              <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  component="img"
                  src={frontPreview}
                  alt="NID Front"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '160px',
                    objectFit: 'contain',
                    borderRadius: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <BadgeIcon fontSize="small" /> Front: {frontFile?.name || 'Smart NID Front'}
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
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                  Front Side (সামনের পাতা)
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center" sx={{ maxWidth: 240 }}>
                  Drag & drop or click to upload front of NID card
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Back Dropzone */}
        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            onDragOver={handleDragOver}
            onDrop={handleBackDrop}
            onClick={() => backInputRef.current?.click()}
            sx={{
              p: 2,
              height: 220,
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
              <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  component="img"
                  src={backPreview}
                  alt="NID Back"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '160px',
                    objectFit: 'contain',
                    borderRadius: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'secondary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FlipToBackIcon fontSize="small" /> Back: {backFile?.name || 'Smart NID Back'}
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
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'secondary.light',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                  Back Side (পেছনের পাতা)
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center" sx={{ maxWidth: 240 }}>
                  Drag & drop or click to upload back of NID card
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Extract Button */}
      <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!canExtract || loading}
          onClick={onExtract}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <DocumentScannerIcon />}
          sx={{
            px: 4,
            py: 1,
            fontWeight: 600,
            borderRadius: 2,
            minWidth: 240,
          }}
        >
          {loading ? 'Extracting KYC Data...' : 'Extract & Verify Information'}
        </Button>
      </Box>
    </Box>
  );
}
