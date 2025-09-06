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
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Validate fields for the current step
  const validateStep = () => {
    let newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Phone must be at least 10 digits, not start with 0
    const phonePattern = /^[1-9][0-9]{9,14}$/;

    if (step === 1) {
      if (!form.name) newErrors.name = 'Name is required';
      if (!form.email) newErrors.email = 'Email is required';
      else if (!emailPattern.test(form.email)) newErrors.email = 'Invalid email address';
      if (!form.contact) newErrors.contact = 'Phone is required';
      else if (!phonePattern.test(form.contact.replace(/\D/g, ''))) newErrors.contact = 'Invalid phone number';
    }
    if (step === 2) {
      if (!form.emergency1) newErrors.emergency1 = 'Emergency Contact 1 is required';
      else if (!phonePattern.test(form.emergency1.replace(/\D/g, ''))) newErrors.emergency1 = 'Invalid emergency contact number';
      if (!form.emergency2) newErrors.emergency2 = 'Emergency Contact 2 is required';
      else if (!phonePattern.test(form.emergency2.replace(/\D/g, ''))) newErrors.emergency2 = 'Invalid emergency contact number';
      if (!form.address) newErrors.address = 'Address is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  const handleFinish = () => {
    if (validateStep()) {
      localStorage.setItem('userInfo', JSON.stringify(form));
      setStep(3); // Move to menu screen
    }
  };

  // Common style for all TextFields
  const textFieldStyles = {
    '& .MuiInputBase-root': {
      backgroundColor: 'rgba(151, 9, 9, 0.85)',
      borderRadius: '6px',
      color: '#fff'
    },
    '& .MuiInputLabel-root': {
      color: '#fff',
      textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
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
              error={!!errors.name}
              helperText={errors.name}
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
              error={!!errors.email}
              helperText={errors.email}
            />
            <Box mt={2} mb={1}>
              <PhoneInput
                country={'in'}
                value={form.contact}
                onChange={value => setForm({ ...form, contact: value })}
                inputStyle={{ width: '100%', backgroundColor: 'rgba(151, 9, 9, 0.85)', color: form.contact ? '#fff' : '#eee', borderRadius: 6 }}
                containerStyle={{ width: '100%' }}
                buttonStyle={{ color: '#000' }}
                dropdownStyle={{ color: '#000' }}
                specialLabel="Phone"
                placeholder="+91 9876543210"
                isValid={!!form.contact && !errors.contact}
              />
              {errors.contact && <Typography color="error" variant="caption">{errors.contact}</Typography>}
            </Box>
            <Grid container spacing={2} mt={2} justifyContent="flex-end">
              <Grid item>
                <button
                  onClick={handleNext}
                  style={buttonStyle('contained')}
                >
                  Next
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
            <Box mt={2} mb={1}>
              <PhoneInput
                country={'in'}
                value={form.emergency1}
                onChange={value => setForm({ ...form, emergency1: value })}
                inputStyle={{ width: '100%', backgroundColor: 'rgba(151, 9, 9, 0.85)', color: '#fff', borderRadius: 6 }}
                containerStyle={{ width: '100%' }}
                buttonStyle={{ color: '#000' }}
                dropdownStyle={{ color: '#000' }}
                isValid={!!form.emergency1 && !errors.emergency1}
              />
              {errors.emergency1 && <Typography color="error" variant="caption">{errors.emergency1}</Typography>}
            </Box>
            <Box mt={2} mb={1}>
              <PhoneInput
                country={'in'}
                value={form.emergency2}
                onChange={value => setForm({ ...form, emergency2: value })}
                inputStyle={{ width: '100%', backgroundColor: 'rgba(151, 9, 9, 0.85)', color: '#fff', borderRadius: 6 }}
                containerStyle={{ width: '100%' }}
                buttonStyle={{ color: '#000' }}
                dropdownStyle={{ color: '#000' }}
                isValid={!!form.emergency2 && !errors.emergency2}
              />
              {errors.emergency2 && <Typography color="error" variant="caption">{errors.emergency2}</Typography>}
            </Box>
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={form.address}
              onChange={handleChange}
              margin="normal"
              sx={textFieldStyles}
              error={!!errors.address}
              helperText={errors.address}
            />
            <Grid container spacing={2} mt={2} justifyContent="flex-end">
              <Grid item>
                <button
                  onClick={handleFinish}
                  style={buttonStyle('contained')}
                >
                  Finish
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
      {step > 0 && step < 3 && (
        <Button
          variant="outlined"
          color="primary"
          onClick={prevStep}
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
      <style>{`
.react-tel-input .special-label {
  position: absolute;
  z-index: 1;
  top: -7px;
  left: 25px;
  display: block;
  background: #dd4040;
  color: #fff;
  border-radius: 6px;
  padding: 0 5px;
}
`}</style>
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
