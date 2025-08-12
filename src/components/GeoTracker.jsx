// src/components/GeoTracker.jsx
import React, { useState, useRef } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import {
  Alert,
  IconButton,
  Button,
  Box,
  Paper,
  Typography,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GeoTracker = () => {
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const watchIdRef = useRef(null);
  const userIdRef = useRef(uuidv4());
  const navigate = useNavigate();

  const handleSuccess = (pos) => {
    const coords = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      timestamp: new Date().toISOString(),
    };

    setLocation(coords);
    setLastUpdated(coords.timestamp);

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const fullData = { ...coords, ...userInfo,  sosType: 'SOS-Button'  };

    set(ref(db, 'locations/' + userIdRef.current), fullData);
    console.log('📡 Data sent to Firebase:', fullData);

    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000); // Hide alert after 4s
  };

  const handleError = (error) => {
    console.error('Geolocation error:', error.message);
  };

  const startTracking = () => {
    if (navigator.geolocation && !tracking) {
      const id = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 5000,
        }
      );
      watchIdRef.current = id;
      setTracking(true);
      console.log('🟢 SOS Tracking started');
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setTracking(false);
      console.log('🔴 SOS Tracking stopped');
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: 'url(/SOS-WOMEN/alert-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      />

      {/* Card Container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 80px)',
          px: 2,
        }}
      >
        <Paper
          elevation={5}
          sx={{
            width: '100%',
            maxWidth: 380,
            p: 3,
            borderRadius: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            position: 'relative',
          }}
        >
          <Typography variant="h6" gutterBottom>
            AlertBuddy Geo Tracker
          </Typography>

          {/* Alert Styled */}
          {showAlert && (
            <Alert
              severity="error"
              sx={{
                position: 'absolute',
                top: 5,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#b71c1c',
                color: 'white',
                fontWeight: 'bold',
                width: '90%',
              }}
            >
              Alert sent successfully with coordinates!
            </Alert>
          )}

          {/* Lat / Long Data */}
          <Box sx={{ my: 3 }}>
            {location ? (
              <>
                <Typography variant="body1" sx={{ color: '#eee' }}>
                  <strong>Latitude:</strong> {location.lat}
                </Typography>
                <Typography variant="body1" sx={{ color: '#eee' }}>
                  <strong>Longitude:</strong> {location.lng}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                Location not yet tracked
              </Typography>
            )}

            {lastUpdated && (
              <Typography
                variant="caption"
                display="block"
                sx={{ color: '#bbb', mt: 1 }}
              >
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </Typography>
            )}
          </Box>

          {/* Start / Stop Buttons */}
          <Stack direction="row" justifyContent="center">
            {!tracking ? (
              <IconButton
                onClick={startTracking}
                sx={{
                  width: 100,
                  height: 100,
                  backgroundColor: '#f70400ff',
                  borderRadius: '50%',
                  boxShadow: '0 0 25px rgba(255,0,0,0.6)',
                }}
              >
                <MyLocationIcon sx={{ fontSize: 60, color: '#fff' }} />
              </IconButton>
            ) : (
              <IconButton
                onClick={stopTracking}
                sx={{
                  width: 100,
                  height: 100,
                  backgroundColor: '#555',
                  borderRadius: '50%',
                  boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                }}
              >
                <StopCircleIcon sx={{ fontSize: 60, color: '#fff' }} />
              </IconButton>
            )}
          </Stack>
        </Paper>
      </Box>

      {/* Bottom Back Button */}
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        sx={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          borderColor: '#d32f2f',
          color: '#ffffff',
          backgroundColor: 'rgba(255,255,255,0.1)',
          '&:hover': {
            backgroundColor: '#d32f2f',
            color: '#fff',
          },
          zIndex: 3,
        }}
      >
        ⬅ Back
      </Button>
    </Box>
  );
};

export default GeoTracker;
