import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SpeedIcon from '@mui/icons-material/Speed';

export default function ValidationAlert({ data }) {
  if (!data) return null;

  const { validation, nid_type, card_side, quality } = data;
  const confidence = validation?.confidence_score ?? 0;
  const confidencePercent = Math.round(confidence * 100);
  const isValid = validation?.is_valid_nid ?? false;
  const warnings = validation?.warnings || [];

  const getConfidenceColor = (percent) => {
    if (percent >= 85) return 'success';
    if (percent >= 60) return 'warning';
    return 'error';
  };

  const confidenceColor = getConfidenceColor(confidencePercent);

  return (
    <Card sx={{ mb: 3, borderLeft: 6, borderColor: isValid ? 'success.main' : 'warning.main' }}>
      <CardContent sx={{ py: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Status & Confidence */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
              <Chip
                icon={isValid ? <CheckCircleIcon /> : <WarningAmberIcon />}
                label={isValid ? 'Verified NID Document' : 'Requires Manual Review'}
                color={isValid ? 'success' : 'warning'}
                sx={{ fontWeight: 600, fontSize: '0.85rem' }}
              />

              {nid_type && (
                <Chip
                  icon={<CreditCardIcon />}
                  label={nid_type}
                  variant="outlined"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                />
              )}

              <Chip
                label={`Side: ${card_side?.toUpperCase() || 'UNKNOWN'}`}
                variant="outlined"
                size="small"
                sx={{ textTransform: 'uppercase' }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 140 }}>
                <SpeedIcon fontSize="small" color="action" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Confidence: {confidencePercent}%
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={confidencePercent}
                  color={confidenceColor}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Blur Quality Scores */}
          <Grid item xs={12} md={5}>
            <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: 1.5, border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
                IMAGE QUALITY ASSESSMENT
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                {quality?.front_blur_score !== undefined && (
                  <Typography variant="caption">
                    Front Sharpness: <strong>{Math.round(quality.front_blur_score)}</strong> ({quality.front_blur_score > 60 ? 'Sharp' : 'Low Clarity'})
                  </Typography>
                )}
                {quality?.back_blur_score !== undefined && (
                  <Typography variant="caption">
                    Back Sharpness: <strong>{Math.round(quality.back_blur_score)}</strong> ({quality.back_blur_score > 60 ? 'Sharp' : 'Low Clarity'})
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Warnings list if any */}
        {warnings.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="warning" variant="outlined" sx={{ py: 0.5 }}>
              <AlertTitle sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 0.5 }}>
                Extraction Notices ({warnings.length})
              </AlertTitle>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.8rem' }}>
                {warnings.map((warn, idx) => (
                  <li key={idx}>{warn}</li>
                ))}
              </ul>
            </Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
