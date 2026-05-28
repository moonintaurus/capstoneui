// Check-in system types and interfaces

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface LocationPermissionState {
  status: 'idle' | 'requesting' | 'granted' | 'denied' | 'unable-to-retrieve';
  error?: string;
}

export interface GeofenceValidationResult {
  isWithinRadius: boolean;
  distanceMeters: number;
  userLocation: GpsCoordinates | null;
  venueLocation: {
    latitude: number;
    longitude: number;
  };
  radiusMeters: number;
}

export interface BiometricVerificationState {
  status: 'idle' | 'loading' | 'detecting' | 'scanning' | 'verified' | 'failed';
  error?: string;
  faceDescriptor?: Float32Array;
}

export interface CheckInState {
  eventId: string;
  eventTitle: string;
  eventModality: 'Onsite' | 'Online' | 'Hybrid';
  currentStep: 'location-permission' | 'geofence' | 'biometric' | 'confirmation' | 'online-checkin' | 'online-biometric' | 'unlock-link';
  
  venueLatitude?: number;
  venueLongitude?: number;
  locationPermission: LocationPermissionState;
  geofenceValidation?: GeofenceValidationResult;
  gpsAttempts: number;
  maxGpsAttempts: number;
  
  biometricVerification: BiometricVerificationState;
  biometricAttempts: number;
  maxBiometricAttempts: number;
  
  checkInTime?: Date;
  participantName?: string;
  checkInStatus: 'idle' | 'checking-in' | 'checked-in' | 'failed';
  
  meetingLink?: string;
  meetingLinkUnlocked: boolean;
}

export interface CheckInContextType {
  state: CheckInState;
  setLocationPermission: (permission: LocationPermissionState) => void;
  setGeofenceValidation: (validation: GeofenceValidationResult) => void;
  setBiometricVerification: (verification: BiometricVerificationState) => void;
  setCheckInStatus: (status: CheckInState['checkInStatus']) => void;
  setCurrentStep: (step: CheckInState['currentStep']) => void;
  incrementGpsAttempts: () => void;
  incrementBiometricAttempts: () => void;
  unlockMeetingLink: (link: string) => void;
  recordCheckIn: (participantName: string) => void;
  resetCheckIn: () => void;
}
