// src/components/Onboarding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    emergency1: '',
    emergency2: '',
    address: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleFinish = () => {
    localStorage.setItem('userInfo', JSON.stringify(form));
    navigate('/geotracker');
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={2}
      sx={{
        backgroundImage: 'url(/SOS-WOMEN/alert-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        zIndex: 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: -1,
        },
      }}
    >
      <Paper
        elevation={5}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          boxShadow:
            '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)',
          textAlign: 'center',
        }}
      >
        {step === 0 && (
          <>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <WarningAmberIcon sx={{ color: 'red', fontSize: 36, mr: 1 }} />
              <Typography variant="h5" fontWeight="bold" color="white">
                AlertBuddy
              </Typography>
            </Box>

            <IconButton
              aria-label="sos"
              onClick={nextStep}
              sx={{
                mt: 4,
                width: 120,
                height: 120,
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '50%',
                boxShadow: '0 0 25px rgba(255,0,0,0.6)',
                '&:hover': {
                  backgroundColor: '#cc0000',
                },
              }}
            >
              <FingerprintIcon sx={{ fontSize: 60 }} />
            </IconButton>
            <Typography variant="subtitle1" sx={{ mt: 2, color: '#eee' }}>
              Tap to Start SOS
            </Typography>
          </>
        )}

        {step === 1 && (
          <>
            <Typography variant="h6" gutterBottom color="white">
              Personal Details
            </Typography>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
              margin="normal"
              sx={{
    input: { backgroundColor: 'white' },
    '& .MuiInputBase-root': {
      backgroundColor: 'rgba(255,255,255,0.85)',
    },
    '&.Mui-focused .MuiInputBase-root': {
      backgroundColor: 'white',
    },
  }}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
              margin="normal"
              type="email"
              sx={{
    input: { backgroundColor: 'white' },
    '& .MuiInputBase-root': {
      backgroundColor: 'rgba(255,255,255,0.85)',
    },
    '&.Mui-focused .MuiInputBase-root': {
      backgroundColor: 'white',
    },
  }}
            />
            <TextField
              label="Phone"
              name="contact"
              fullWidth
              value={form.contact}
              onChange={handleChange}
              margin="normal"
              type="tel"
              sx={{
    input: { backgroundColor: 'white' },
    '& .MuiInputBase-root': {
      backgroundColor: 'rgba(255,255,255,0.85)',
    },
    '&.Mui-focused .MuiInputBase-root': {
      backgroundColor: 'white',
    },
  }}
            />
            <Grid container spacing={2} mt={2}>
              <Grid item xs={6}>
                <button onClick={prevStep} style={buttonStyle('outlined')}>
                  Back
                </button>
              </Grid>
              <Grid item xs={6}>
                <button onClick={nextStep} style={buttonStyle('contained')}>
                  Next
                </button>
              </Grid>
            </Grid>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="h6" gutterBottom color="white">
              Emergency Info
            </Typography>
            <TextField
              label="Emergency Contact 1"
              name="emergency1"
              fullWidth
              value={form.emergency1}
              onChange={handleChange}
              margin="normal"
              type="tel"
              sx={{
    input: { backgroundColor: 'white' },
    '& .MuiInputBase-root': {
      backgroundColor: 'rgba(255,255,255,0.85)',
    },
    '&.Mui-focused .MuiInputBase-root': {
      backgroundColor: 'white',
    },
  }}
            />
            <TextField
              label="Emergency Contact 2"
              name="emergency2"
              fullWidth
              value={form.emergency2}
              onChange={handleChange}
              margin="normal"
              type="tel"
              sx={{
    input: { backgroundColor: 'white' },
    '& .MuiInputBase-root': {
      backgroundColor: 'rgba(255,255,255,0.85)',
    },
    '&.Mui-focused .MuiInputBase-root': {
      backgroundColor: 'white',
    },
  }}
            />
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={form.address}
              onChange={handleChange}
              margin="normal"
              sx={{
    input: { backgroundColor: 'white' },
    '& .MuiInputBase-root': {
      backgroundColor: 'rgba(255,255,255,0.85)',
    },
    '&.Mui-focused .MuiInputBase-root': {
      backgroundColor: 'white',
    },
  }}
            />
            <Grid container spacing={2} mt={2}>
              <Grid item xs={6}>
                <button onClick={prevStep} style={buttonStyle('outlined')}>
                  Back
                </button>
              </Grid>
              <Grid item xs={6}>
                <button onClick={handleFinish} style={buttonStyle('contained')}>
                  Finish
                </button>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>
    </Box>
  );
};

// 🔧 Custom inline button styles
const buttonStyle = (variant) => ({
  width: '100%',
  padding: '10px',
  backgroundColor: variant === 'contained' ? '#d32f2f' : 'transparent',
  color: variant === 'contained' ? '#fff' : '#d32f2f',
  border: variant === 'outlined' ? '2px solid #d32f2f' : 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
});

export default Onboarding;
