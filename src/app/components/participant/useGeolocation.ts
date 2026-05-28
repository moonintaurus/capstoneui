import { useState, useEffect, useCallback, useRef } from 'react';
import type { GpsCoordinates, LocationPermissionState } from './CheckInTypes';
import { LocationPermissionHandler } from './CheckInUtils';

export function useGeolocation() {
  const [locationPermission, setLocationPermission] = useState<LocationPermissionState>({
    status: 'idle',
  });
  const [currentLocation, setCurrentLocation] = useState<GpsCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    setLocationPermission({ status: 'requesting' });
    setError(null);

    try {
      const coords = await LocationPermissionHandler.requestCurrentLocation();
      setCurrentLocation(coords);
      setLocationPermission({ status: 'granted' });
      return coords;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('denied')) {
        setLocationPermission({ status: 'denied', error: errorMessage });
      } else if (errorMessage.includes('unavailable')) {
        setLocationPermission({ status: 'unable-to-retrieve', error: errorMessage });
      } else {
        setLocationPermission({ status: 'unable-to-retrieve', error: errorMessage });
      }

      setError(errorMessage);
      return null;
    }
  }, []);

  return {
    locationPermission,
    currentLocation,
    error,
    requestLocation,
  };
}

export function useLocationWatch() {
  const [currentLocation, setCurrentLocation] = useState<GpsCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const locationHandlerRef = useRef(new LocationPermissionHandler());

  const startWatching = useCallback(() => {
    setIsWatching(true);
    setError(null);
    const unwatch = locationHandlerRef.current.watchLocation(
      (coords) => setCurrentLocation(coords),
      (err) => {
        setError(err);
        setIsWatching(false);
      }
    );
    return unwatch;
  }, []);

  const stopWatching = useCallback(() => {
    locationHandlerRef.current.stopWatching();
    setIsWatching(false);
  }, []);

  useEffect(() => {
    return () => {
      locationHandlerRef.current.stopWatching();
    };
  }, []);

  return {
    currentLocation,
    error,
    isWatching,
    startWatching,
    stopWatching,
  };
}
