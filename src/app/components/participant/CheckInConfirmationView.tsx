import { useEffect } from 'react';
import { Check, MapPin, CheckCircle2 } from 'lucide-react';
import { useCheckIn } from './CheckInContext';
import { C } from './data';

export function CheckInConfirmationView({ onClose }: { onClose: () => void }) {
  const { state } = useCheckIn();

  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const formatTime = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        {/* Header with Success Icon */}
        <div className="p-8 text-center" style={{ background: `linear-gradient(135deg, ${C.green}15 0%, ${C.green}05 100%)` }}>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: C.green }}>
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{ backgroundColor: C.green + '30', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
              />
            </div>
          </div>
          <h1 className="font-bold text-2xl mb-1" style={{ color: C.green, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
            Check-In Successful
          </h1>
          <p className="text-sm" style={{ color: C.muted }}>Your attendance has been recorded</p>
        </div>

        {/* Event Details */}
        <div className="p-6 space-y-4 border-b" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
          {/* Event Name */}
          <div className="space-y-1">
            <p className="text-xs font-semibold" style={{ color: C.muted }}>Event</p>
            <p className="text-sm font-bold" style={{ color: C.text }}>
              {state.eventTitle}
            </p>
          </div>

          {/* Participant Name */}
          {state.participantName && (
            <div className="space-y-1">
              <p className="text-xs font-semibold" style={{ color: C.muted }}>Participant</p>
              <p className="text-sm font-bold" style={{ color: C.text }}>
                {state.participantName}
              </p>
            </div>
          )}

          {/* Check-In Time */}
          {state.checkInTime && (
            <div className="space-y-1">
              <p className="text-xs font-semibold" style={{ color: C.muted }}>Check-In Time</p>
              <p className="text-sm font-bold" style={{ color: C.text }}>
                {formatDate(state.checkInTime)}
              </p>
              <p className="text-xs" style={{ color: C.muted }}>
                {formatTime(state.checkInTime)}
              </p>
            </div>
          )}
        </div>

        {/* Verification Status */}
        <div className="p-6 space-y-3">
          {/* Location Validation */}
          <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: C.green + '06' }}>
            <div className="flex-shrink-0 mt-0.5">
              <Check className="w-5 h-5" style={{ color: C.green }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold" style={{ color: C.text }}>Location Validation</p>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                {state.geofenceValidation
                  ? `Within ${state.geofenceValidation.radiusMeters}m radius (${state.geofenceValidation.distanceMeters.toFixed(1)}m away)`
                  : 'Verified'}
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: C.green + '15', color: C.green }}>
              Passed
            </span>
          </div>

          {/* Biometric Verification */}
          <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: C.green + '06' }}>
            <div className="flex-shrink-0 mt-0.5">
              <Check className="w-5 h-5" style={{ color: C.green }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: C.text }}>Biometric Verification</p>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>Face identity confirmed</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: C.green + '15', color: C.green }}>
              Passed
            </span>
          </div>

          {/* Attendance Status */}
          <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: C.green + '06' }}>
            <div className="flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" style={{ color: C.green }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: C.text }}>Attendance Status</p>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>Marked as Present</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: C.green + '15', color: C.green }}>
              Verified
            </span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="p-6 border-t" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(128,0,0,0.03)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: C.text }}>What's Next</p>
            <ul className="text-xs space-y-1" style={{ color: C.sub }}>
              <li className="flex gap-2">
                <span style={{ color: C.maroon }}>•</span>
                <span>Your attendance record is now in the system</span>
              </li>
              <li className="flex gap-2">
                <span style={{ color: C.maroon }}>•</span>
                <span>Certificate eligibility will be confirmed after the event</span>
              </li>
              <li className="flex gap-2">
                <span style={{ color: C.maroon }}>•</span>
                <span>You will receive a notification when your certificate is ready</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 border-t" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
            style={{ backgroundColor: C.green }}
          >
            Return to Dashboard
          </button>
        </div>

        {/* Auto-close timer indicator */}
        <div className="px-6 pb-4">
          <p className="text-xs text-center" style={{ color: C.muted }}>
            Returning to dashboard automatically...
          </p>
        </div>
      </div>
    </div>
  );
}
