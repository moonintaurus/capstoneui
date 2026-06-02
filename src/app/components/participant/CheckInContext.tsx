import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { CheckInState, CheckInContextType, LocationPermissionState, GeofenceValidationResult, BiometricVerificationState } from './CheckInTypes';
import { DEMO_MODE } from './CheckInUtils';

const CheckInContext = createContext<CheckInContextType | undefined>(undefined);

const createInitialState = (eventId: string, eventTitle: string, eventModality: 'Onsite' | 'Online' | 'Hybrid', venueLatitude?: number, venueLongitude?: number): CheckInState => ({
  eventId,
  eventTitle,
  eventModality,
  currentStep: eventModality === 'Online' ? 'online-checkin' : DEMO_MODE ? 'gps' : 'location-permission',
  venueLatitude,
  venueLongitude,
  locationPermission: { status: 'idle' },
  gpsAttempts: 0,
  maxGpsAttempts: 3,
  biometricVerification: { status: 'idle' },
  biometricAttempts: 0,
  maxBiometricAttempts: 3,
  checkInStatus: 'idle',
  meetingLinkUnlocked: false,
});

interface CheckInProviderProps {
  children: ReactNode;
  eventId: string;
  eventTitle: string;
  eventModality: 'Onsite' | 'Online' | 'Hybrid';
  venueLatitude?: number;
  venueLongitude?: number;
}

export function CheckInProvider({
  children,
  eventId,
  eventTitle,
  eventModality,
  venueLatitude,
  venueLongitude,
}: CheckInProviderProps) {
  const [state, setState] = useState<CheckInState>(
    createInitialState(eventId, eventTitle, eventModality, venueLatitude, venueLongitude)
  );

  const setLocationPermission = (permission: LocationPermissionState) => {
    setState(prev => ({ ...prev, locationPermission: permission }));
  };

  const setGeofenceValidation = (validation: GeofenceValidationResult) => {
    setState(prev => ({ ...prev, geofenceValidation: validation }));
  };

  const setBiometricVerification = (verification: BiometricVerificationState) => {
    setState(prev => ({ ...prev, biometricVerification: verification }));
  };

  const setCheckInStatus = (status: CheckInState['checkInStatus']) => {
    setState(prev => ({ ...prev, checkInStatus: status }));
  };

  const setCurrentStep = (step: CheckInState['currentStep']) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const incrementGpsAttempts = () => {
    setState(prev => ({ ...prev, gpsAttempts: prev.gpsAttempts + 1 }));
  };

  const incrementBiometricAttempts = () => {
    setState(prev => ({ ...prev, biometricAttempts: prev.biometricAttempts + 1 }));
  };

  const unlockMeetingLink = (link: string) => {
    setState(prev => ({ ...prev, meetingLink: link, meetingLinkUnlocked: true }));
  };

  const recordCheckIn = (participantName: string) => {
    setState(prev => ({
      ...prev,
      participantName,
      checkInTime: new Date(),
      checkInStatus: 'checked-in',
    }));
  };

  const resetCheckIn = () => {
    setState(createInitialState(eventId, eventTitle, eventModality, venueLatitude, venueLongitude));
  };

  const value: CheckInContextType = {
    state,
    setLocationPermission,
    setGeofenceValidation,
    setBiometricVerification,
    setCheckInStatus,
    setCurrentStep,
    incrementGpsAttempts,
    incrementBiometricAttempts,
    unlockMeetingLink,
    recordCheckIn,
    resetCheckIn,
  };

  return (
    <CheckInContext.Provider value={value}>
      {children}
    </CheckInContext.Provider>
  );
}

export function useCheckIn(): CheckInContextType {
  const context = useContext(CheckInContext);
  if (!context) {
    throw new Error('useCheckIn must be used within a CheckInProvider');
  }
  return context;
}
