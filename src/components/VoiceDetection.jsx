import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  ThemeProvider,
  createTheme,
  IconButton,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { v4 as uuidv4 } from "uuid";
import { ref, set } from "firebase/database";
import { db } from "../firebase";

const theme = createTheme({
  palette: {
    primary: { main: "#d32f2f" },
    background: { default: "#000000" },
    text: { primary: "#ffffff" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const VoiceDetection = () => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [helpActive, setHelpActive] = useState(false);

  const recognitionRef = useRef(null);
  const isManuallyStopped = useRef(false);
  const lastPingTimeRef = useRef(0);
  const userIdRef = useRef(uuidv4());
  const helpTimerRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const sendIntervalRef = useRef(null);
  const navigate = useNavigate();
  const lastVoiceRef = useRef(null); // 🆕 store latest voice


  const hasHelpKeyword = (text) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    const keywords = ["help", "save me", "emergency", "bachao", "madad", "sos"];
    return keywords.some((k) => lower.includes(k));
  };

  // 🎤 Record 5 seconds audio, convert to Base64 and send to Firebase
 // 🎤 Record 5 seconds audio, convert to Base64 and send to Firebase
// 🎤 Record 5 seconds audio and store latest Base64 in memory
const recordVoice = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Voice = reader.result; 
        lastVoiceRef.current = base64Voice; // 🆕 keep the last voice
        console.log("🎤 New voice recorded and stored");
      };
      reader.readAsDataURL(blob);
    };

    mediaRecorder.start();
    console.log("🎤 Recording started...");
    setTimeout(() => {
      mediaRecorder.stop();
      stream.getTracks().forEach((track) => track.stop());
      console.log("🎤 Recording stopped after 5s");
    }, 5000);
  } catch (err) {
    console.error("Voice recording failed:", err);
  }
};



  const sendLocation = () => {
  if (!helpActive) return;

  const now = Date.now();
  if (now - lastPingTimeRef.current < 5000) return; // throttle 5s
  lastPingTimeRef.current = now;

  if (!navigator.geolocation) {
    console.warn("Geolocation not available");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        timestamp: new Date().toISOString(),
      };
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

      // 🆕 Always attach lastVoice if available
      const fullData = { 
        ...coords, 
        ...userInfo, 
        sosType: "SOS-Voice",
        voice: lastVoiceRef.current || null 
      };

      set(ref(db, "locations/" + userIdRef.current), fullData);
      console.log("📡 Location sent:", fullData);
    },
    (err) => console.error("Geolocation error:", err.message),
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 5000 }
  );
};


  const startListening = async () => {
    if (!recognitionRef.current) return;
    try {
      isManuallyStopped.current = false;
      if (!listening) recognitionRef.current.start();
    } catch (e) {
      console.warn("startListening error:", e);
    }
  };

  const stopListening = async () => {
    if (!recognitionRef.current) return;
    try {
      isManuallyStopped.current = true;
      recognitionRef.current.stop();
    } catch (e) {
      console.warn("stopListening error:", e);
    }
    setHelpActive(false);
    setHelpVisible(false);
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      console.log("🎙 recognition started");
      setListening(true);
    };

    recognition.onend = () => {
      console.log("🎙 recognition ended");
      setListening(false);
      if (!isManuallyStopped.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.warn("restart failed:", e);
          }
        }, 200);
      }
    };

    recognition.onerror = (event) => {
      console.error("recognition error:", event.error);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        alert("Please allow microphone access and reload the page.");
        isManuallyStopped.current = true;
      }
    };

    recognition.onresult = (event) => {
      let fullTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        fullTranscript += event.results[i][0].transcript;
      }
      setTranscript(fullTranscript);

      if (hasHelpKeyword(fullTranscript)) {
        if (!helpActive) {
          console.log("🚨 HELP detected, activating SOS");
          setHelpActive(true);
          setHelpVisible(true);

          clearTimeout(helpTimerRef.current);
          helpTimerRef.current = setTimeout(() => setHelpVisible(false), 3000);

          recordVoice(); // 🎤 Start recording when help detected
        }
        sendLocation();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
      clearTimeout(restartTimeoutRef.current);
      clearTimeout(helpTimerRef.current);
    };
  }, []); // run once

  useEffect(() => {
    if (helpActive) {
      sendLocation();
      if (sendIntervalRef.current) clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = setInterval(sendLocation, 5000);
    } else {
      if (sendIntervalRef.current) {
        clearInterval(sendIntervalRef.current);
        sendIntervalRef.current = null;
      }
    }
    return () => {
      if (sendIntervalRef.current) {
        clearInterval(sendIntervalRef.current);
        sendIntervalRef.current = null;
      }
    };
  }, [helpActive]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: 'url("/alert-bg.jpg")',
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
            position: "relative",
          }}
        >
          <Typography variant="h5" color="primary" gutterBottom>
            🎤 Voice Detection
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }} color="white">
            Microphone: <b>{listening ? "ON 🔴" : "OFF ⚪"}</b>
          </Typography>

          <IconButton
            aria-label={listening ? "Stop listening" : "Start listening"}
            onClick={listening ? stopListening : startListening}
            sx={{
              backgroundColor: listening ? "#d32f2f" : "#444",
              color: "#fff",
              width: 100,
              height: 100,
              borderRadius: "50%",
              boxShadow: "0 0 20px rgba(255,0,0,0.6)",
              mb: 1.5,
              "&:hover": {
                backgroundColor: listening ? "#b71c1c" : "#666",
              },
            }}
          >
            {listening ? (
              <StopCircleIcon sx={{ fontSize: 60 }} />
            ) : (
              <KeyboardVoiceIcon sx={{ fontSize: 60 }} />
            )}
          </IconButton>

          {helpVisible && (
            <Alert
              severity="error"
              sx={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#b71c1c",
                color: "white",
                fontWeight: "bold",
              }}
            >
              HELP DETECTED! Recording voice + sending location...
            </Alert>
          )}

          <Box mb={3}>
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                setTranscript("");
                setHelpVisible(false);
              }}
            >
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
