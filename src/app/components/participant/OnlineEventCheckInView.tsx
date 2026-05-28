import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCheckIn } from './CheckInContext';
import { C } from './data';

export function OnlineEventCheckInView({ onNext }: { onNext: () => void }) {
  const { state, setCurrentStep } = useCheckIn();
  const [isValidating, setIsValidating] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isRegistered, setIsRegistered] = useState(true);
  const [isCheckInOpen, setIsCheckInOpen] = useState(true);

  useEffect(() => {
    // Simulate validation checks
    const validateCheckIn = async () => {
      setIsValidating(true);
      setValidationErrors([]);

      // Simulate API calls to validate:
      // 1. User is registered for the event
      // 2. Check-in window is open
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes, assume both checks pass
      // In production, these would be real API calls
      setIsRegistered(true);
      setIsCheckInOpen(true);
      setIsValidating(false);
    };

    validateCheckIn();
  }, []);

  const handleProceedToBiometric = () => {
    setCurrentStep('online-biometric');
    onNext();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: `rgba(128,0,0,0.06)`, background: `linear-gradient(135deg, ${C.teal}12 0%, transparent 100%)` }}>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>Online Event Check-In</p>
            <h1 className="font-bold text-lg" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
              {state.eventTitle}
            </h1>
            <div className="mt-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: C.teal }}>
                Online Event
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Validation Status */}
          {isValidating && (
            <div className="p-4 rounded-2xl border text-center" style={{
              borderColor: C.maroon + '30',
              backgroundColor: C.maroon + '06'
            }}>
              <div className="inline-block">
                <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-current animate-spin" style={{ borderTopColor: C.maroon, marginBottom: '8px' }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: C.maroon }}>Verifying your registration...</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Please wait</p>
            </div>
          )}

          {!isValidating && isRegistered && isCheckInOpen && (
            <div className="p-4 rounded-2xl border" style={{
              borderColor: C.green + '30',
              backgroundColor: C.green + '06'
            }}>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: C.green }} />
                <div className="flex-1">
                  <p className="text-sm font-bold mb-1" style={{ color: C.green }}>Ready to Check In</p>
                  <p className="text-xs" style={{ color: C.muted }}>You are registered and the event is open for check-in</p>
                </div>
              </div>
            </div>
          )}

          {!isValidating && (!isRegistered || !isCheckInOpen) && (
            <div className="p-4 rounded-2xl border" style={{
              borderColor: C.coral + '30',
              backgroundColor: C.coral + '06'
            }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: C.coral }} />
                <div className="flex-1">
                  <p className="text-sm font-bold mb-1" style={{ color: C.coral }}>Unable to Check In</p>
                  {!isRegistered && (
                    <p className="text-xs" style={{ color: C.muted }}>You are not registered for this event</p>
                  )}
                  {!isCheckInOpen && (
                    <p className="text-xs" style={{ color: C.muted }}>The check-in window for this event is not currently open</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Event Details */}
          <div className="space-y-3">
            <p className="text-xs font-semibold" style={{ color: C.text }}>Event Details</p>
            
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(128,0,0,0.03)' }}>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.muted }} />
                <div className="flex-1">
                  <p className="text-xs font-semibold" style={{ color: C.text }}>Schedule</p>
                  <p className="text-xs mt-1" style={{ color: C.sub }}>Check event details in your calendar or email invitation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Check-In Instructions */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(128,0,0,0.03)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: C.text }}>Check-In Process</p>
            <ol className="text-xs space-y-1" style={{ color: C.sub }}>
              <li className="flex gap-2">
                <span>1.</span>
                <span>Verify your face using biometric scanning</span>
              </li>
              <li className="flex gap-2">
                <span>2.</span>
                <span>After verification, the meeting link will be unlocked</span>
              </li>
              <li className="flex gap-2">
                <span>3.</span>
                <span>Click to join the online event</span>
              </li>
            </ol>
          </div>

          {/* Privacy Notice */}
          <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#f9f9f9' }}>
            <p className="text-xs" style={{ color: C.muted }}>
              Your biometric data is used only for attendance verification and will be securely processed.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
          {isValidating && (
            <button
              disabled
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all opacity-50"
              style={{ backgroundColor: C.maroon }}
            >
              Validating...
            </button>
          )}

          {!isValidating && isRegistered && isCheckInOpen && (
            <button
              onClick={handleProceedToBiometric}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: `linear-gradient(135deg, ${C.teal} 0%, #007aa3 100%)` }}
            >
              Proceed to Face Verification
            </button>
          )}

          {!isValidating && (!isRegistered || !isCheckInOpen) && (
            <button
              disabled
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all opacity-50"
              style={{ backgroundColor: C.coral }}
            >
              Unable to Check In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
