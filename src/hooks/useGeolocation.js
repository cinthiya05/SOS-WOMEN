// src/hooks/useGeoLocation.js
import { useState, useEffect } from "react";

const useGeoLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          timestamp: pos.timestamp,
        });
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error };
};

export default useGeoLocation;
