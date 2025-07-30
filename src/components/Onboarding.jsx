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
  Button
} from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import EmergencyIcon from '@mui/icons-material/Warning';

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
    setStep(3); // Move to new menu screen
  };

  // Common style for all TextFields
  const textFieldStyles = {
    '& .MuiInputBase-root': {
      backgroundColor: 'rgba(151, 9, 9, 0.85)',
      borderRadius: '6px',
    },
    '& .MuiInputLabel-root': {
      color: '#fff',
      textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
    },
    '& input::placeholder': {
      color: '#444',
      textShadow: '1px 1px 4px rgba(224, 0, 0, 0.6)',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'transparent',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#d32f2f',
        boxShadow: '0 0 6px rgba(211, 47, 47, 0.6)',
      },
    },
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
        {/* Step 0 */}
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

        {/* Step 1 */}
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
              sx={textFieldStyles}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
              margin="normal"
              type="email"
              sx={textFieldStyles}
            />
            <TextField
              label="Phone"
              name="contact"
              fullWidth
              value={form.contact}
              onChange={handleChange}
              margin="normal"
              type="tel"
              sx={textFieldStyles}
            />
            <Grid container spacing={2} mt={2} justifyContent="flex-end">
            <Grid item>
                <button 
                onClick={step === 1 ? nextStep : handleFinish} 
                style={buttonStyle('contained')}
                >
                {step === 1 ? 'Next' : 'Finish'}
                </button>
            </Grid>
            </Grid>

          </>
        )}

        {/* Step 2 */}
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
              sx={textFieldStyles}
            />
            <TextField
              label="Emergency Contact 2"
              name="emergency2"
              fullWidth
              value={form.emergency2}
              onChange={handleChange}
              margin="normal"
              type="tel"
              sx={textFieldStyles}
            />
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={form.address}
              onChange={handleChange}
              margin="normal"
              sx={textFieldStyles}
            />
            <Grid container spacing={2} mt={2} justifyContent="flex-end">
            <Grid item>
                <button 
                onClick={step === 1 ? nextStep : handleFinish} 
                style={buttonStyle('contained')}
                >
                {step === 1 ? 'Next' : 'Finish'}
                </button>
            </Grid>
            </Grid>

          </>
        )}

        {/* Step 3 - Action Menu */}
        {step === 3 && (
        <>
            <Typography variant="h6" gutterBottom color="white" mb={3}>
            Choose an Option
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <Box textAlign="center">
                <IconButton
                sx={iconButtonStyle}
                onClick={() => navigate('/detect')}
                >
                <PhotoCameraIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <Typography color="white" variant="subtitle2">
                Image Detection
                </Typography>
            </Box>
            <Box textAlign="center">
                <IconButton
                sx={iconButtonStyle}
                onClick={() => navigate('/voice')}
                >
                <KeyboardVoiceIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <Typography color="white" variant="subtitle2">
                Voice Detection
                </Typography>
            </Box>
            <Box textAlign="center">
                <IconButton
                sx={iconButtonStyle}
                onClick={() => navigate('/geotracker')}
                >
                <EmergencyIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <Typography color="white" variant="subtitle2">
                SOS Button
                </Typography>
            </Box>
            </Box>
        </>
        )}
      </Paper>
            {/* Fixed Bottom Back Button for Steps > 0 */}
            {step > 0 && (
            <Button
                variant="outlined"
                color="primary"
                onClick={() => setStep((prev) => prev - 1)}
                sx={{
                position: "fixed",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                borderColor: "#d32f2f",
                color: "#ffffff",
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": {
                    backgroundColor: "#cc0000",
                    color: "#fff",
                },
                zIndex: 5,
                }}
            >
                ⬅ Back
            </Button>
            )}

    </Box>
    
  );
};

// Custom inline button styles
const buttonStyle = (variant) => ({
  width: '100%',
  padding: '10px',
  backgroundColor: variant === 'contained' ? '#cc0000' : 'transparent',
  color: variant === 'contained' ? '#fff' : '#d32f2f',
  border: variant === 'outlined' ? '2px solid #d32f2f' : 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
});

const iconButtonStyle = {
  width: 80,
  height: 80,
  backgroundColor: 'rgba(255,255,255,0.1)',
  color: '#fff',
  borderRadius: '50%',
  boxShadow: '0 0 15px rgba(255,0,0,0.6)',
  '&:hover': {
    backgroundColor: '#cc0000',
  },
};

export default Onboarding;
