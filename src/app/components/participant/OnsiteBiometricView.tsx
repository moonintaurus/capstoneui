import { useState, useEffect, useRef } from 'react';
import { AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useCheckIn } from './CheckInContext';
import { useFaceVerification } from './useFaceVerification';
import { BiometricScannerInterface } from './BiometricScannerInterface';
import { C } from './data';

export function OnsiteBiometricView({ onNext }: { onNext: () => void }) {
  const { state, setBiometricVerification, setCurrentStep, incrementBiometricAttempts, recordCheckIn } = useCheckIn();
  const {
    state: faceState,
    videoRef,
    modelsLoaded,
    startCamera,
    stopCamera,
    verifyFaceForCheckIn,
    reset: resetFace,
  } = useFaceVerification();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const startCameraInitiated = useRef(false);

  // Start camera on mount
  useEffect(() => {
    if (modelsLoaded && !startCameraInitiated.current) {
      startCameraInitiated.current = true;
      startCamera().catch((error) => {
        console.error('Failed to start camera:', error);
        setLastError('Could not access camera. Please check permissions.');
      });
    }

    return () => {
      stopCamera();
    };
  }, [modelsLoaded, startCamera, stopCamera]);

  // Auto-verify face once camera is ready
  useEffect(() => {
    const autoVerifyTimer = setTimeout(() => {
      if (modelsLoaded && faceState.status === 'idle' && !isVerifying) {
        handleVerifyFace();
      }
    }, 1500); // Wait for camera to stabilize

    return () => clearTimeout(autoVerifyTimer);
  }, [modelsLoaded, faceState.status, isVerifying]);

  const handleVerifyFace = async () => {
    if (!modelsLoaded || isVerifying) return;

    setIsVerifying(true);
    setLastError(null);
    incrementBiometricAttempts();

    try {
      const result = await verifyFaceForCheckIn();

      if (result.success && result.descriptor) {
        setBiometricVerification({
          status: 'verified',
          faceDescriptor: result.descriptor,
        });
        recordCheckIn(state.participantName || 'Participant');
        setCurrentStep('confirmation');
        onNext();
      } else {
        setBiometricVerification({
          status: 'failed',
          error: result.error || result.message,
        });
        setLastError(result.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Face verification failed';
      setBiometricVerification({
        status: 'failed',
        error: errorMessage,
      });
      setLastError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRetry = () => {
    resetFace();
    setLastError(null);
  };

  const canVerify = modelsLoaded && !isVerifying && faceState.status !== 'verified';
  const isVerified = faceState.status === 'verified';
  const canRetry = state.biometricAttempts < state.maxBiometricAttempts && (faceState.status === 'failed' || lastError);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: `rgba(128,0,0,0.06)`, background: `linear-gradient(135deg, ${C.maroon}12 0%, transparent 100%)` }}>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>Face Biometric Verification</p>
            <h1 className="font-bold text-lg" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
              {state.eventTitle}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Camera Status */}
          {!modelsLoaded && (
            <div className="p-4 rounded-2xl border text-center" style={{
              borderColor: C.maroon + '30',
              backgroundColor: C.maroon + '06'
            }}>
              <p className="text-sm font-semibold" style={{ color: C.maroon }}>Loading face detection...</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Initializing biometric engine</p>
            </div>
          )}

          {/* Camera View */}
          {modelsLoaded && (
            <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <BiometricScannerInterface
                videoRef={videoRef}
                phase={faceState.status}
                error={lastError || undefined}
              />
            </div>
          )}

          {/* Status Message */}
          <div className="p-4 rounded-2xl" style={{
            borderColor: isVerified ? C.green + '30' : faceState.status === 'failed' || lastError ? C.coral + '30' : 'rgba(128,0,0,0.08)',
            backgroundColor: isVerified ? C.green + '06' : faceState.status === 'failed' || lastError ? C.coral + '06' : 'white',
            border: `1px solid`
          }}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {isVerified ? (
                  <CheckCircle2 className="w-5 h-5" style={{ color: C.green }} />
                ) : faceState.status === 'failed' || lastError ? (
                  <AlertCircle className="w-5 h-5" style={{ color: C.coral }} />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-transparent border-t-current animate-spin" style={{ borderTopColor: C.maroon }} />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold mb-0.5" style={{
                  color: isVerified ? C.green : faceState.status === 'failed' || lastError ? C.coral : C.text
                }}>
                  {isVerified
                    ? 'Face Verified'
                    : faceState.status === 'failed' || lastError
                      ? 'Verification Failed'
                      : faceState.status === 'scanning' || faceState.status === 'detecting'
                        ? 'Processing...'
                        : 'Ready to scan'}
                </p>
                <p className="text-xs" style={{ color: C.sub }}>
                  {isVerified
                    ? 'Your identity has been verified. Showing check-in confirmation.'
                    : faceState.status === 'failed' || lastError
                      ? lastError || 'Face could not be verified. Please try again.'
                      : 'Look directly at the camera and stay still. Your face will be scanned automatically.'}
                </p>
              </div>
            </div>
          </div>

          {/* Attempt Counter */}
          {state.biometricAttempts > 0 && (
            <div className="text-center">
              <p className="text-xs" style={{ color: C.muted }}>
                Attempt {state.biometricAttempts} of {state.maxBiometricAttempts}
              </p>
            </div>
          )}

          {/* Instructions */}
          {!isVerified && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(128,0,0,0.03)' }}>
              <ul className="text-xs space-y-1" style={{ color: C.sub }}>
                <li className="flex gap-2">
                  <span style={{ color: C.maroon }}>•</span>
                  <span>Look directly at the camera</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: C.maroon }}>•</span>
                  <span>Ensure your face is well-lit</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: C.maroon }}>•</span>
                  <span>Keep your face centered in the frame</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: C.maroon }}>•</span>
                  <span>Avoid sunglasses or obstructions</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
          {canVerify && (
            <button
              onClick={handleVerifyFace}
              disabled={!modelsLoaded || isVerifying}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
              style={{ backgroundColor: C.maroon }}
            >
              {isVerifying ? 'Verifying...' : faceState.status === 'idle' ? 'Start Face Scan' : 'Scanning...'}
            </button>
          )}

          {canRetry && (
            <button
              onClick={handleRetry}
              className="w-full py-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2"
              style={{ borderColor: C.maroon, color: C.maroon }}
            >
              <RefreshCw className="w-4 h-4" />
              Retry Face Scan
            </button>
          )}

          {!canRetry && state.biometricAttempts >= state.maxBiometricAttempts && (
            <div className="p-3 rounded-xl text-center" style={{ backgroundColor: C.coral + '10' }}>
              <p className="text-xs font-semibold" style={{ color: C.coral }}>
                Maximum attempts reached. Please try again later.
              </p>
            </div>
          )}

          {isVerified && (
            <div className="text-center py-2">
              <p className="text-xs text-green-600 font-semibold">
                Showing check-in confirmation...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
