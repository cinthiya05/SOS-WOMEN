// src/pages/VoiceDetection.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: { main: "#d32f2f" }, // red
    background: { default: "#000000" }, // black background
    text: { primary: "#ffffff" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const VoiceDetection = () => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const isManuallyStopped = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      console.log("✅ Speech recognition started");
      setListening(true);
    };

    recognition.onend = () => {
      console.warn("⛔ Speech recognition ended");
      setListening(false);

      if (!isManuallyStopped.current) {
        console.log("🔁 Restarting recognition...");
        recognition.start();
      }
    };

    recognition.onerror = (event) => {
      console.error("❌ Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        alert("Please allow microphone access and reload the page.");
      }
    };

    recognition.onresult = (event) => {
      let fullTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        fullTranscript += event.results[i][0].transcript;
      }
      console.log("🗣️ Transcript:", fullTranscript);
      setTranscript(fullTranscript);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      isManuallyStopped.current = false;
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      isManuallyStopped.current = true;
      recognitionRef.current.stop();
    }
  };

  const clearTranscript = () => {
    setTranscript("");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: 'url("/SOS-WOMEN/alert-bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 0,
          },
        }}
      >
        <Paper
          elevation={5}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            zIndex: 1,
            width: "100%",
            maxWidth: 500,
          }}
        >
          <Typography variant="h5" color="primary" gutterBottom>
            🎤 Voice Detection
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }} color="white">
            Microphone: <b>{listening ? "ON 🔴" : "OFF ⚪"}</b>
          </Typography>

          <Box display="flex" gap={2} justifyContent="center" mb={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={startListening}
              disabled={listening}
            >
              Start
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={stopListening}
              disabled={!listening}
            >
              Stop
            </Button>
            <Button variant="text" color="primary" onClick={clearTranscript}>
              Clear
            </Button>
          </Box>

          <Box
            sx={{
              p: 2,
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 2,
              minHeight: "80px",
              textAlign: "left",
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
            <Typography variant="subtitle1" color="white" gutterBottom>
              Detected Speech:
            </Typography>
            <Typography variant="body2" color="white">
              {transcript || <i>No speech detected yet</i>}
            </Typography>
          </Box>
        </Paper>

        {/* Fixed Bottom Back Button */}
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(-1)}
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
              backgroundColor: "#d32f2f",
              color: "#fff",
            },
            zIndex: 5,
          }}
        >
          ⬅ Back
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default VoiceDetection;
