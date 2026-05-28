import { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, AlertCircle, RefreshCw, Loader } from 'lucide-react';
import { useCheckIn } from './CheckInContext';
import { useLocationWatch } from './useGeolocation';
import { GeofenceCalculator } from './CheckInUtils';
import { C } from './data';

export function OnsiteGeofenceValidationView({ onNext }: { onNext: () => void }) {
  const { state, setGeofenceValidation, setCurrentStep, incrementGpsAttempts } = useCheckIn();
  const { currentLocation, startWatching, stopWatching, isWatching } = useLocationWatch();
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(state.geofenceValidation);

  useEffect(() => {
    // Start watching location as soon as component mounts
    if (!isWatching) {
      startWatching();
    }

    return () => {
      stopWatching();
    };
  }, []);

  const validateGeofence = async () => {
    if (!currentLocation || !state.venueLatitude || !state.venueLongitude) {
      setValidationResult({
        isWithinRadius: false,
        distanceMeters: 0,
        userLocation: null,
        venueLocation: { latitude: state.venueLatitude || 0, longitude: state.venueLongitude || 0 },
        radiusMeters: 50,
      });
      return;
    }

    setIsValidating(true);
    incrementGpsAttempts();

    // Simulate a slight delay for realism
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = GeofenceCalculator.validateGeofence(
      currentLocation,
      state.venueLatitude,
      state.venueLongitude,
      50
    );

    setValidationResult(result);
    setGeofenceValidation(result);

    setIsValidating(false);

    if (result.isWithinRadius) {
      setCurrentStep('biometric');
      setTimeout(onNext, 800);
    }
  };

  useEffect(() => {
    // Auto-validate when location updates
    if (currentLocation && !isValidating && !validationResult?.isWithinRadius) {
      const timer = setTimeout(validateGeofence, 500);
      return () => clearTimeout(timer);
    }
  }, [currentLocation]);

  const getStatusColor = (isWithin: boolean) => {
    return isWithin ? C.green : C.coral;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: `rgba(128,0,0,0.06)`, background: `linear-gradient(135deg, ${C.maroon}12 0%, transparent 100%)` }}>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>Geofence Validation</p>
            <h1 className="font-bold text-lg" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
              {state.eventTitle}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Location Status */}
          <div className="p-4 rounded-2xl" style={{
            borderColor: 'rgba(128,0,0,0.08)',
            backgroundColor: 'white',
            border: `1px solid rgba(128,0,0,0.08)`
          }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-shrink-0">
                {isWatching ? (
                  <Loader className="w-5 h-5 animate-spin" style={{ color: C.maroon }} />
                ) : currentLocation ? (
                  <CheckCircle2 className="w-5 h-5" style={{ color: C.green }} />
                ) : (
                  <AlertCircle className="w-5 h-5" style={{ color: C.coral }} />
                )}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: C.text }}>
                  {isWatching ? 'Locating you...' : currentLocation ? 'Location Found' : 'Awaiting Location'}
                </p>
              </div>
            </div>

            {currentLocation && (
              <div className="text-xs space-y-1" style={{ color: C.sub }}>
                <p>Latitude: {currentLocation.latitude.toFixed(6)}</p>
                <p>Longitude: {currentLocation.longitude.toFixed(6)}</p>
                <p>Accuracy: ±{Math.round(currentLocation.accuracy)}m</p>
              </div>
            )}
          </div>

          {/* Venue Info */}
          <div className="p-4 rounded-2xl border" style={{
            borderColor: 'rgba(128,0,0,0.08)',
            backgroundColor: 'rgba(128,0,0,0.03)'
          }}>
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: C.maroon }} />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: C.text }}>Event Venue</p>
                <p className="text-xs mt-1" style={{ color: C.sub }}>Allowed Radius: 50 meters</p>
              </div>
            </div>
            <div className="text-xs space-y-1" style={{ color: C.sub }}>
              <p>Latitude: {state.venueLatitude?.toFixed(6)}</p>
              <p>Longitude: {state.venueLongitude?.toFixed(6)}</p>
            </div>
          </div>

          {/* Validation Result */}
          {validationResult && (
            <div className="p-4 rounded-2xl" style={{
              borderColor: getStatusColor(validationResult.isWithinRadius) + '30',
              backgroundColor: getStatusColor(validationResult.isWithinRadius) + '06',
              border: `1px solid ${getStatusColor(validationResult.isWithinRadius) + '30'}`
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
                    {validationResult.isWithinRadius
                      ? 'Location Confirmed'
                      : 'Outside Venue Radius'}
                  </p>
                  <p className="text-xs mb-2" style={{ color: C.muted }}>
                    Distance: {GeofenceCalculator.formatDistance(validationResult.distanceMeters)}
                  </p>
                  <p className="text-xs" style={{ color: C.sub }}>
                    {validationResult.isWithinRadius
                      ? 'You are within the event venue radius. Proceeding to facial verification...'
                      : 'Please move closer to the event venue to check in.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(128,0,0,0.03)' }}>
            <p className="text-xs" style={{ color: C.sub }}>
              {validationResult?.isWithinRadius
                ? 'Location verified! Preparing face biometric verification...'
                : 'Ensure your GPS is enabled and you have a clear line of sight to the sky for accurate positioning.'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
          {!validationResult?.isWithinRadius && (
            <button
              onClick={validateGeofence}
              disabled={isValidating || !currentLocation}
              className="w-full py-3 rounded-xl text-sm font-bold text-white border transition-all disabled:opacity-50"
              style={{ borderColor: C.maroon, color: C.maroon }}
            >
              {isValidating ? 'Validating...' : 'Check Location Again'}
            </button>
          )}

          {validationResult?.isWithinRadius && (
            <div className="text-center py-2">
              <p className="text-xs text-green-600 font-semibold">
                Proceeding to face verification...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
