import type { GpsCoordinates, GeofenceValidationResult } from './CheckInTypes';

const GEOFENCE_RADIUS_METERS = 50;
const EARTH_RADIUS_KM = 6371;

export class GeofenceCalculator {
  /**
   * Calculate distance between two geographic points using Haversine formula
   * Returns distance in meters
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c * 1000; // Convert to meters
  }

  /**
   * Validate if user location is within geofence radius of venue
   */
  static validateGeofence(
    userLocation: GpsCoordinates,
    venueLatitude: number,
    venueLongitude: number,
    radiusMeters: number = GEOFENCE_RADIUS_METERS
  ): GeofenceValidationResult {
    const distanceMeters = this.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      venueLatitude,
      venueLongitude
    );

    const isWithinRadius = distanceMeters <= radiusMeters;

    return {
      isWithinRadius,
      distanceMeters,
      userLocation,
      venueLocation: {
        latitude: venueLatitude,
        longitude: venueLongitude,
      },
      radiusMeters,
    };
  }

  /**
   * Format distance for display
   */
  static formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  }
}

export class LocationPermissionHandler {
  private watchId: number | null = null;
  private onPositionCallback: ((coords: GpsCoordinates) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  /**
   * Request a single location update
   */
  static requestCurrentLocation(): Promise<GpsCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported on this device'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          resolve({
            latitude,
            longitude,
            accuracy,
            timestamp: Date.now(),
          });
        },
        (error) => {
          let message = 'Location request failed';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location permission denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out';
              break;
          }
          reject(new Error(message));
        },
        {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 0,
        }
      );
    });
  }

  /**
   * Watch location updates continuously
   */
  watchLocation(
    onPosition: (coords: GpsCoordinates) => void,
    onError: (error: string) => void
  ): () => void {
    if (!navigator.geolocation) {
      onError('Geolocation not supported on this device');
      return () => {};
    }

    this.onPositionCallback = onPosition;
    this.onErrorCallback = onError;

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        onPosition({
          latitude,
          longitude,
          accuracy,
          timestamp: Date.now(),
        });
      },
      (error) => {
        let message = 'Location watch failed';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timeout';
            break;
        }
        onError(message);
      },
      {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 1000, // Accept cached position up to 1 second old
      }
    );

    // Return unwatch function
    return () => {
      if (this.watchId !== null) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }
    };
  }

  /**
   * Stop watching location
   */
  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.onPositionCallback = null;
    this.onErrorCallback = null;
  }
}
