import { useState, useEffect } from 'react';
import { MapPin, Loader, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useCheckIn } from './CheckInContext';
import { useGeolocation } from './useGeolocation';
import { C } from './data';

export function OnsiteLocationPermissionView({ onNext }: { onNext: () => void }) {
  const { state, setLocationPermission, setCurrentStep } = useCheckIn();
  const { locationPermission, currentLocation, requestLocation } = useGeolocation();
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    setLocationPermission(locationPermission);
  }, [locationPermission, setLocationPermission]);

  const handleRequestLocation = async () => {
    setIsRequesting(true);
    const result = await requestLocation();
    setIsRequesting(false);
    
    if (result && locationPermission.status === 'granted') {
      setCurrentStep('geofence');
      onNext();
    }
  };

  const getStatusIcon = () => {
    switch (state.locationPermission.status) {
      case 'idle':
        return <MapPin className="w-6 h-6" style={{ color: C.maroon }} />;
      case 'requesting':
        return <Loader className="w-6 h-6 animate-spin" style={{ color: C.maroon }} />;
      case 'granted':
        return <CheckCircle2 className="w-6 h-6" style={{ color: C.green }} />;
      case 'denied':
      case 'unable-to-retrieve':
        return <AlertCircle className="w-6 h-6" style={{ color: C.coral }} />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (state.locationPermission.status) {
      case 'idle':
        return 'Ready to check location';
      case 'requesting':
        return 'Requesting location permission...';
      case 'granted':
        return 'Location permission granted';
      case 'denied':
        return 'Location permission denied. Please enable location in settings.';
      case 'unable-to-retrieve':
        return 'Unable to retrieve location. Please ensure your device has location enabled.';
      default:
        return '';
    }
  };

  const getPermissionDetails = () => {
    switch (state.locationPermission.status) {
      case 'granted':
        if (currentLocation) {
          return `Latitude: ${currentLocation.latitude.toFixed(6)}, Longitude: ${currentLocation.longitude.toFixed(6)}, Accuracy: ±${Math.round(currentLocation.accuracy)}m`;
        }
        return 'Location obtained';
      case 'denied':
      case 'unable-to-retrieve':
        return state.locationPermission.error || 'An error occurred';
      default:
        return 'Your location will be used to verify you are at the event venue';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: `rgba(128,0,0,0.06)`, background: `linear-gradient(135deg, ${state.eventModality === 'Hybrid' ? '#9370db' : C.maroon}12 0%, transparent 100%)` }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>Onsite Check-In</p>
              <h1 className="font-bold text-lg" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
                {state.eventTitle}
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Card */}
          <div className="p-4 rounded-2xl" style={{
            borderColor: state.locationPermission.status === 'granted' ? C.green + '30' : state.locationPermission.status === 'denied' || state.locationPermission.status === 'unable-to-retrieve' ? C.coral + '30' : 'rgba(128,0,0,0.08)',
            backgroundColor: state.locationPermission.status === 'granted' ? C.green + '06' : state.locationPermission.status === 'denied' || state.locationPermission.status === 'unable-to-retrieve' ? C.coral + '06' : 'white',
            border: `1px solid`
          }}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{getStatusIcon()}</div>
              <div className="flex-1">
                <p className="text-sm font-bold mb-1" style={{
                  color: state.locationPermission.status === 'granted' ? C.green : state.locationPermission.status === 'denied' || state.locationPermission.status === 'unable-to-retrieve' ? C.coral : C.text
                }}>
                  {getStatusMessage()}
                </p>
                <p className="text-xs" style={{ color: C.muted }}>
                  {getPermissionDetails()}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(128,0,0,0.03)' }}>
            <p className="text-xs leading-relaxed" style={{ color: C.sub }}>
              To check in to this onsite event, we need to verify that you are at the event venue location. This requires access to your device's GPS location.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <p className="text-xs font-semibold" style={{ color: C.text }}>Steps:</p>
            <ul className="text-xs space-y-1">
              {[
                'Allow location access when prompted',
                'We will verify you are within 50 meters of the event venue',
                'Then proceed to facial biometric verification',
              ].map((step, i) => (
                <li key={i} className="flex gap-2" style={{ color: C.sub }}>
                  <span style={{ color: C.maroon }}>•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
          {state.locationPermission.status !== 'granted' && (
            <button
              onClick={handleRequestLocation}
              disabled={isRequesting}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
              style={{ backgroundColor: C.maroon }}
            >
              {isRequesting ? 'Requesting Location...' : 'Enable Location Access'}
            </button>
          )}
          
          {state.locationPermission.status === 'granted' && (
            <button
              onClick={() => {
                setCurrentStep('geofence');
                onNext();
              }}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}
            >
              Continue to Location Verification
            </button>
          )}

          {(state.locationPermission.status === 'denied' || state.locationPermission.status === 'unable-to-retrieve') && (
            <button
              onClick={handleRequestLocation}
              className="w-full py-3 rounded-xl text-sm font-bold border text-white transition-all"
              style={{ borderColor: C.maroon, color: C.maroon }}
            >
              Retry Location Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
