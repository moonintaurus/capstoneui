import { Check, CheckCircle2 } from 'lucide-react';
import { useCheckIn } from './CheckInContext';
import { C } from './data';

export function CheckInConfirmationView({ onClose }: { onClose: () => void }) {
  const { state } = useCheckIn();

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
            Check-in Complete
          </h1>
          <p className="text-sm" style={{ color: C.muted }}>
            You have been successfully verified for this event.
          </p>
        </div>

        <div className="p-6 space-y-4 border-b" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
          <div className="space-y-1">
            <p className="text-xs font-semibold" style={{ color: C.muted }}>Event</p>
            <p className="text-sm font-bold" style={{ color: C.text }}>
              {state.eventTitle}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold" style={{ color: C.muted }}>Participant</p>
            <p className="text-sm font-bold" style={{ color: C.text }}>
              {state.participantName || 'Participant'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold" style={{ color: C.muted }}>Check-In Time</p>
            <p className="text-sm font-bold" style={{ color: C.text }}>
              {formatDate(state.checkInTime)}
            </p>
            <p className="text-xs" style={{ color: C.muted }}>
              {formatTime(state.checkInTime)}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: C.green + '06' }}>
            <div className="flex-shrink-0 mt-0.5">
              <Check className="w-5 h-5" style={{ color: C.green }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold" style={{ color: C.text }}>GPS Verified</p>
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

          <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: C.green + '06' }}>
            <div className="flex-shrink-0 mt-0.5">
              <Check className="w-5 h-5" style={{ color: C.green }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: C.text }}>Face Verified</p>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>Face identity confirmed</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: C.green + '15', color: C.green }}>
              Passed
            </span>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: C.green + '06' }}>
            <div className="flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" style={{ color: C.green }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: C.text }}>Attendance Recorded</p>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>Marked as Present</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: C.green + '15', color: C.green }}>
              Verified
            </span>
          </div>
        </div>

        <div className="p-6 border-t" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(128,0,0,0.03)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: C.text }}>For Event Entry</p>
            <p className="text-xs leading-relaxed" style={{ color: C.sub }}>
              Please show this verification screen to the event usher before entering.
            </p>
          </div>
        </div>

        <div className="p-6 border-t" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
