// src/components/GeoTracker.jsx
import React, { useState, useRef } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';
import { FaExclamationTriangle } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const GeoTracker = () => {
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const watchIdRef = useRef(null);
  const userIdRef = useRef(uuidv4()); // persistent for session

  const handleSuccess = (pos) => {
    const coords = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      timestamp: new Date().toISOString(),
    };

    setLocation(coords);
    setLastUpdated(coords.timestamp);

    set(ref(db, 'locations/' + userIdRef.current), coords);
    console.log('📡 Location updated to Firebase:', coords);
  };

  const handleError = (err) => {
    console.error('⚠️ Geolocation error:', err);
  };

  const startTracking = () => {
    if (navigator.geolocation && !tracking) {
      const id = navigator.geolocation.watchPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 5000,
      });
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
    <div style={styles.container}>
      <div style={styles.card}>
        <FaExclamationTriangle size={40} color="red" />
        <h2 style={styles.heading}>AlertBuddy Geo Tracker</h2>

        {location ? (
          <>
            <p><strong>Latitude:</strong> {location.lat}</p>
            <p><strong>Longitude:</strong> {location.lng}</p>
          </>
        ) : (
          <p style={{ color: '#888' }}>Location not yet tracked</p>
        )}

        {lastUpdated && (
          <p style={styles.timestamp}>
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
        )}

        <div style={styles.buttonGroup}>
          <button
            onClick={startTracking}
            style={{
              ...styles.startBtn,
              opacity: tracking ? 0.6 : 1,
              cursor: tracking ? 'not-allowed' : 'pointer',
            }}
            disabled={tracking}
          >
            Start SOS
          </button>
          <button
            onClick={stopTracking}
            style={{
              ...styles.stopBtn,
              opacity: !tracking ? 0.6 : 1,
              cursor: !tracking ? 'not-allowed' : 'pointer',
            }}
            disabled={!tracking}
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  heading: {
    margin: '12px 0 18px',
    color: '#333',
  },
  timestamp: {
    fontSize: '0.85rem',
    color: '#666',
    marginTop: 10,
  },
  buttonGroup: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  startBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#e53935',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontWeight: 'bold',
  },
  stopBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#bbb',
    color: '#000',
    border: 'none',
    borderRadius: 6,
    fontWeight: 'bold',
  },
};

export default GeoTracker;
