import { useState, useEffect, useRef } from 'react';
import { MapPin, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { useCheckIn } from './CheckInContext';
import { useGeolocation } from './useGeolocation';
import { DEMO_LOCATION, DEMO_MODE, GEOFENCE_RADIUS_METERS, GeofenceCalculator } from './CheckInUtils';
import { C } from './data';
import type { GpsCoordinates, GeofenceValidationResult } from './CheckInTypes';

export function OnsiteGeofenceValidationView({ onNext }: { onNext: () => void }) {
  const { state, setGeofenceValidation, setCurrentStep, incrementGpsAttempts } = useCheckIn();
  const { currentLocation, requestLocation } = useGeolocation();
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(state.geofenceValidation);
  const [showValidationError, setShowValidationError] = useState(false);
  const advanceTimerRef = useRef<number | null>(null);

  const displayLocation = validationResult?.userLocation ?? currentLocation;
  const venueLocation = validationResult?.venueLocation ?? {
    latitude: state.venueLatitude,
    longitude: state.venueLongitude,
  };

  const advanceToBiometric = (delayMs = 1200) => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
    }

    advanceTimerRef.current = window.setTimeout(() => {
      setCurrentStep('biometric');
      onNext();
    }, delayMs);
  };

  const setValidation = (result: GeofenceValidationResult) => {
    setValidationResult(result);
    setGeofenceValidation(result);
  };

  const simulateDemoValidation = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    setValidation({
      isWithinRadius: true,
      distanceMeters: 8.2,
      userLocation: DEMO_LOCATION,
      venueLocation: {
        latitude: state.venueLatitude ?? DEMO_LOCATION.latitude,
        longitude: state.venueLongitude ?? DEMO_LOCATION.longitude,
      },
      radiusMeters: GEOFENCE_RADIUS_METERS,
    });

    setIsValidating(false);
    advanceToBiometric(1000);
  };

  const validateProductionGeofence = async () => {
    incrementGpsAttempts();

    let locationToValidate: GpsCoordinates | null = currentLocation;
    if (!locationToValidate) {
      locationToValidate = await requestLocation();
      if (!locationToValidate) {
        setIsValidating(false);
        setShowValidationError(true);
        return;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    if (!state.venueLatitude || !state.venueLongitude) {
      setIsValidating(false);
      setShowValidationError(true);
      return;
    }

    if (locationToValidate.accuracy > GEOFENCE_RADIUS_METERS) {
      setValidation({
        isWithinRadius: false,
        distanceMeters: locationToValidate.accuracy,
        userLocation: locationToValidate,
        venueLocation: {
          latitude: state.venueLatitude,
          longitude: state.venueLongitude,
        },
        radiusMeters: GEOFENCE_RADIUS_METERS,
      });
      setIsValidating(false);
      return;
    }

    const result = GeofenceCalculator.validateGeofence(
      locationToValidate,
      state.venueLatitude,
      state.venueLongitude,
      GEOFENCE_RADIUS_METERS
    );

    setValidation(result);
    setIsValidating(false);

    if (result.isWithinRadius) {
      advanceToBiometric(1200);
    }
  };

  const validateGeofence = async () => {
    setIsValidating(true);
    setShowValidationError(false);

    if (DEMO_MODE) {
      await simulateDemoValidation();
      return;
    }

    await validateProductionGeofence();
  };

  useEffect(() => {
    if (!DEMO_MODE && currentLocation && !validationResult && !isValidating) {
      validateGeofence();
    }

    return () => {
      if (advanceTimerRef.current) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  const getStatusColor = (isWithin: boolean) => {
    return isWithin ? C.green : C.coral;
  };

  const handleContinueToBiometric = () => {
    setCurrentStep('biometric');
    onNext();
  };

  const actionLabel = () => {
    if (isValidating) return 'Validating...';
    if (validationResult || showValidationError) return 'Retry GPS Validation';
    return 'Continue to Location Verification';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <div className="p-6 border-b" style={{ borderColor: `rgba(128,0,0,0.06)`, background: `linear-gradient(135deg, ${C.maroon}12 0%, transparent 100%)` }}>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>GPS / Geofence Validation</p>
            <h1 className="font-bold text-lg" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
              {state.eventTitle}
            </h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(128,0,0,0.03)' }}>
            <p className="text-xs leading-relaxed" style={{ color: C.sub }}>
              Checking if you are within <span className="font-bold" style={{ color: C.maroon }}>{GEOFENCE_RADIUS_METERS} meters</span> of the event venue.
            </p>
          </div>

          {isValidating && (
            <div className="p-4 rounded-2xl border text-center" style={{
              borderColor: C.maroon + '30',
              backgroundColor: C.maroon + '06',
            }}>
              <div className="inline-block mb-2">
                <Loader className="w-6 h-6 animate-spin" style={{ color: C.maroon }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: C.maroon }}>Validating your location...</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>
                {DEMO_MODE ? 'Simulating onsite venue proximity' : 'Calculating distance from venue'}
              </p>
            </div>
          )}

          {displayLocation && (
            <div className="p-4 rounded-2xl" style={{
              borderColor: 'rgba(128,0,0,0.08)',
              backgroundColor: 'white',
              border: `1px solid rgba(128,0,0,0.08)`,
            }}>
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: C.green }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: C.text }}>Your Location Found</p>
                </div>
              </div>
              <div className="text-xs space-y-1" style={{ color: C.sub }}>
                <p><span style={{ color: C.muted }}>Latitude:</span> {displayLocation.latitude.toFixed(6)}</p>
                <p><span style={{ color: C.muted }}>Longitude:</span> {displayLocation.longitude.toFixed(6)}</p>
                <p><span style={{ color: C.muted }}>Accuracy:</span> &plusmn;{Math.round(displayLocation.accuracy)}m</p>
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl border" style={{
            borderColor: 'rgba(128,0,0,0.08)',
            backgroundColor: 'rgba(128,0,0,0.03)',
          }}>
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: C.maroon }} />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: C.text }}>Event Venue</p>
                <p className="text-xs mt-1" style={{ color: C.sub }}>Allowed Radius: {GEOFENCE_RADIUS_METERS} meters</p>
              </div>
            </div>
            <div className="text-xs space-y-1" style={{ color: C.sub }}>
              <p><span style={{ color: C.muted }}>Latitude:</span> {venueLocation.latitude?.toFixed(6)}</p>
              <p><span style={{ color: C.muted }}>Longitude:</span> {venueLocation.longitude?.toFixed(6)}</p>
            </div>
          </div>

          {validationResult && !isValidating && (
            <div className="p-4 rounded-2xl" style={{
              borderColor: getStatusColor(validationResult.isWithinRadius) + '30',
              backgroundColor: getStatusColor(validationResult.isWithinRadius) + '06',
              border: `1px solid ${getStatusColor(validationResult.isWithinRadius) + '30'}`,
            }}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {validationResult.isWithinRadius ? (
                    <CheckCircle2 className="w-6 h-6" style={{ color: C.green }} />
                  ) : (
                    <AlertCircle className="w-6 h-6" style={{ color: C.coral }} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold mb-1" style={{ color: getStatusColor(validationResult.isWithinRadius) }}>
                    {validationResult.isWithinRadius ? 'Location Validated' : 'Location Validation Failed'}
                  </p>
                  <p className="text-xs mb-2" style={{ color: C.muted }}>
                    Distance: <span style={{ fontWeight: 'bold' }}>{GeofenceCalculator.formatDistance(validationResult.distanceMeters)}</span> from venue
                  </p>
                  <p className="text-xs" style={{ color: C.sub }}>
                    {validationResult.isWithinRadius
                      ? 'Location validated. You are within 50 meters of the event venue.'
                      : validationResult.distanceMeters > GEOFENCE_RADIUS_METERS && currentLocation && currentLocation.accuracy > GEOFENCE_RADIUS_METERS
                        ? `Location accuracy is too low (+/-${Math.round(currentLocation.accuracy)}m). Please move to an open area and try again.`
                        : 'You are outside the allowed 50-meter venue radius. Please move closer to the event location.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!DEMO_MODE && showValidationError && !isValidating && (
            <div className="p-4 rounded-2xl border" style={{
              borderColor: C.coral + '30',
              backgroundColor: C.coral + '06',
              border: `1px solid ${C.coral + '30'}`,
            }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: C.coral }} />
                <div className="flex-1">
                  <p className="text-sm font-bold mb-1" style={{ color: C.coral }}>Unable to Validate Location</p>
                  <p className="text-xs" style={{ color: C.sub }}>
                    Could not obtain your location. Please ensure GPS is enabled and you have a clear view of the sky.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
          {validationResult?.isWithinRadius ? (
            <button
              onClick={handleContinueToBiometric}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: `linear-gradient(135deg, ${C.green} 0%, ${C.green} 100%)` }}
            >
              Continue to Facial Verification
            </button>
          ) : (
            <button
              onClick={validateGeofence}
              disabled={isValidating}
              className="w-full py-3 rounded-xl text-sm font-bold border transition-all disabled:opacity-50"
              style={{ borderColor: C.maroon, color: C.maroon }}
            >
              {actionLabel()}
            </button>
          )}

          {!DEMO_MODE && state.gpsAttempts > 0 && (
            <p className="text-xs text-center mt-3" style={{ color: C.muted }}>
              Attempt {state.gpsAttempts} of {state.maxGpsAttempts}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
