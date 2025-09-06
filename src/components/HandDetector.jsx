import React, { useRef, useEffect, useState } from 'react';
import { Hands } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import * as cam from '@mediapipe/camera_utils';
import {
  Box,
  Paper,
  Typography,
  ThemeProvider,
  createTheme,
  Button,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

const theme = createTheme({
  palette: {
    primary: { main: '#ffe0e0ff' },
    secondary: { main: '#d32f2f' },
    background: { default: '#000000' },
    text: { primary: '#ffffff' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const isOpenPalm = (landmarks) => {
  const palm = landmarks[0];
  const tipIndexes = [8, 12, 16, 20];
  return tipIndexes.every((i) => {
    const tip = landmarks[i];
    const dx = tip.x - palm.x;
    const dy = tip.y - palm.y;
    return Math.sqrt(dx * dx + dy * dy) > 0.25;
  });
};

const HandDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const [detecting, setDetecting] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const lastPingTimeRef = useRef(0);
  const photosRef = useRef([]); // store 3 photos
  const navigate = useNavigate();

  const userIdRef = useRef(uuidv4());

  // Capture photo as base64
  const capturePhoto = () => {
    const hiddenCanvas = document.createElement("canvas");
    hiddenCanvas.width = videoRef.current.videoWidth;
    hiddenCanvas.height = videoRef.current.videoHeight;
    const ctx = hiddenCanvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    return hiddenCanvas.toDataURL("image/jpeg", 0.7);
  };

  // Take 3 photos
  const takePhotos = async () => {
    const photos = [];
    for (let i = 0; i < 3; i++) {
      const photo = capturePhoto();
      photos.push(photo);
      await new Promise((res) => setTimeout(res, 500));
    }
    photosRef.current = photos;
    console.log("📷 Captured Photos:", photos);
  };

  // Send location + photos to Firebase
  const sendLocationWithPhotos = (photos) => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: new Date().toISOString(),
        };

        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

        const fullData = {
          ...coords,
          ...userInfo,
          sosType: "SOS-hand-detector",
          photos, // send the photos explicitly
        };

        set(ref(db, "locations/" + userIdRef.current), fullData)
          .then(() => console.log("📡 Data sent to Firebase:", fullData))
          .catch((err) => console.error("Error sending data:", err));
      },
      (err) => console.error("Geolocation error:", err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 5000 }
    );
  };

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      let helpDetected = false;

      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 2,
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: "#FF0000",
            lineWidth: 1,
          });

          if (isOpenPalm(landmarks)) {
            helpDetected = true;
            const now = Date.now();

            if (now - lastPingTimeRef.current > 5000) {
              takePhotos().then(() => {
                const photos = [...photosRef.current]; // copy photos
                sendLocationWithPhotos(photos);        // send photos
                photosRef.current = [];                // clear after sending
              });
              lastPingTimeRef.current = now;
            }
          }
        }
      }

      setHelpVisible(helpDetected);
      canvasCtx.restore();
    });

    const initializeCamera = () => {
      if (videoRef.current) {
        cameraRef.current = new cam.Camera(videoRef.current, {
          onFrame: async () => await hands.send({ image: videoRef.current }),
          width: 640,
          height: 480,
        });
        cameraRef.current.start();
      }
    };

    if (detecting) {
      initializeCamera();
    } else if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
      setHelpVisible(false);
      photosRef.current = [];
    }

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
    };
  }, [detecting]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          minHeight: '100vh',
          backgroundImage: 'url(/SOS-WOMEN/alert-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          flexDirection: 'column',
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 3,
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            maxWidth: '700px',
            width: '100%',
          }}
        >
          <Typography variant="h5" color="primary" gutterBottom align="center">
            Hand Gesture Detection
          </Typography>

          <Box sx={{ position: 'relative', mb: 2 }}>
            <video ref={videoRef} style={{ display: 'none' }} />
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              style={{
                width: '100%',
                maxWidth: '640px',
                borderRadius: '10px',
                border: '2px solid #be7676ff',
              }}
            />
            {helpVisible && (
              <Alert
                severity="error"
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#b71c1c',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                HELP DETECTED!
              </Alert>
            )}
          </Box>

          <Button
            variant="contained"
            color={detecting ? 'secondary' : 'primary'}
            onClick={() => setDetecting((prev) => !prev)}
            fullWidth
            sx={{ mt: 1 }}
          >
            {detecting ? 'Stop Detection' : 'Start Detection'}
          </Button>
        </Paper>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{
            mt: 3,
            width: '90%',
            borderColor: '#d32f2f',
            color: '#ffffff',
            backgroundColor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              backgroundColor: '#d32f2f',
              color: '#fff',
            },
          }}
        >
          ⬅ Back
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default HandDetector;
