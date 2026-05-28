import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Check,
  AlertCircle,
  Camera,
  ScanFace,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import * as faceapi from 'face-api.js';

const MAROON = '#800000';
const MAROON_DARK = '#5a0000';
const GOLDEN = '#FFDF00';

const MODEL_URLS = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/';
const DARK_LIGHT_THRESHOLD = 55;

type EnrollmentPhase = 'idle' | 'scanning' | 'done' | 'error';

function CameraViewfinder({
  videoRef,
  canvasRef,
  phase,
  statusLabel,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  phase: EnrollmentPhase;
  statusLabel: string;
}) {
  const borderColor =
    phase === 'done'
      ? '#27AE60'
      : phase === 'error'
        ? '#E74C3C'
        : phase === 'scanning'
          ? MAROON
          : 'rgba(128,0,0,0.2)';

  return (
    <div
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden"
      style={{ backgroundColor: '#0d0d0d', border: `2px solid ${borderColor}` }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center z-0"
        style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a12 100%)' }}
      >
        <ScanFace className="w-20 h-20" style={{ color: 'rgba(255,255,255,0.22)' }} />
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-10 scale-x-[-1]"
      />
      <canvas ref={canvasRef} className="hidden" />

      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div
          className="relative w-44 h-56 rounded-full border-4 transition-all duration-300"
          style={{
            borderColor: phase === 'done' ? '#27AE60' : phase === 'error' ? '#E74C3C' : GOLDEN,
            boxShadow: phase === 'scanning' ? `0 0 35px ${GOLDEN}50` : 'none',
          }}
        >
          {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
            <div
              key={pos}
              className="absolute w-6 h-6"
              style={{
                top: pos.startsWith('t') ? '-12px' : 'auto',
                bottom: pos.startsWith('b') ? '-12px' : 'auto',
                left: pos.endsWith('l') ? '-12px' : 'auto',
                right: pos.endsWith('r') ? '-12px' : 'auto',
                borderTop: pos.startsWith('t') ? `3px solid ${phase === 'done' ? '#27AE60' : GOLDEN}` : 'none',
                borderBottom: pos.startsWith('b') ? `3px solid ${phase === 'done' ? '#27AE60' : GOLDEN}` : 'none',
                borderLeft: pos.endsWith('l') ? `3px solid ${phase === 'done' ? '#27AE60' : GOLDEN}` : 'none',
                borderRight: pos.endsWith('r') ? `3px solid ${phase === 'done' ? '#27AE60' : GOLDEN}` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {phase === 'scanning' && (
        <div
          className="absolute left-0 right-0 h-px opacity-70 z-30"
          style={{ backgroundColor: GOLDEN, animation: 'scanline 2s linear infinite', top: '40%' }}
        />
      )}

      <div
        className="absolute bottom-0 left-0 right-0 p-4 z-40"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: phase === 'done' ? '#27AE60' : phase === 'error' ? '#E74C3C' : GOLDEN,
              animation: phase === 'scanning' ? 'pulse 1s infinite' : 'none',
            }}
          />
          <span className="text-white text-sm font-semibold">{statusLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function BiometricEnrollment() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase, setPhase] = useState<EnrollmentPhase>('idle');
  const [feedback, setFeedback] = useState('Allow camera access to continue.');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URLS),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URLS),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URLS),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error('Failed to load face verification models:', err);
        setPhase('error');
        setFeedback('Camera setup failed. Please reload and try again.');
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setCameraReady(true);
            setFeedback('Camera is ready. Tap Start Enrollment when your face is visible.');
          };
          streamRef.current = stream;
        }
      } catch (err) {
        console.error('Camera access denied:', err);
        setPhase('error');
        setFeedback('Camera permission denied. Please allow camera access.');
      }
    };

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    return () => {
      timerRef.current.forEach(clearTimeout);
    };
  }, []);

  const getAverageBrightness = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState < 2) return 255;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return 255;

    canvas.width = 160;
    canvas.height = 120;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frame = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let total = 0;

    for (let i = 0; i < frame.length; i += 4) {
      total += 0.299 * frame[i] + 0.587 * frame[i + 1] + 0.114 * frame[i + 2];
    }

    return total / (frame.length / 4);
  };

  const startEnrollment = async () => {
    timerRef.current.forEach(clearTimeout);

    if (!cameraReady || !videoRef.current) {
      setPhase('error');
      setFeedback('Camera is not ready yet. Please try again.');
      return;
    }

    if (!modelsLoaded) {
      setPhase('error');
      setFeedback('Camera setup is still loading. Please try again.');
      return;
    }

    setPhase('scanning');
    setFeedback('Hold still while we verify your face…');

    try {
      const brightness = getAverageBrightness();

      if (brightness < DARK_LIGHT_THRESHOLD) {
        setPhase('error');
        setFeedback('Lighting is too dark. Please move to a brighter area.');
        return;
      }

      const result = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!result) {
        setPhase('error');
        setFeedback('No face detected. Please position your face inside the frame.');
        return;
      }

      setFeedback('Face detected. Processing…');

      const descriptorArray = Array.from(result.descriptor);
      localStorage.setItem('siglaFaceDescriptor', JSON.stringify(descriptorArray));

      const successTimer = setTimeout(() => {
        setPhase('done');
        setFeedback('Biometric enrollment successful.');
      }, 900);

      timerRef.current = [successTimer];
    } catch (err) {
      console.error('Face verification failed:', err);
      setPhase('error');
      setFeedback('No face detected. Please position your face inside the frame.');
    }
  };

  const reset = () => {
    timerRef.current.forEach(clearTimeout);
    setPhase('idle');
    setFeedback(cameraReady ? 'Camera is ready. Tap Start Enrollment when your face is visible.' : 'Allow camera access to continue.');
  };

  const cameraStatusLabel =
    phase === 'done'
      ? 'Success'
      : phase === 'error'
        ? 'Needs attention'
        : phase === 'scanning'
          ? 'Scanning…'
          : cameraReady
            ? 'Ready'
            : 'Waiting for camera';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <header className="bg-white border-b" style={{ borderColor: 'rgba(128,0,0,0.08)' }}>
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/PUPLogo.png" alt="PUP Logo" className="w-10 h-10 object-contain" />
            <span
              className="text-lg font-bold"
              style={{ fontFamily: '"Trajan Pro 3", Cambria, serif', color: MAROON }}
            >
              SIGLA
            </span>
          </Link>

          <div
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{ backgroundColor: MAROON + '12', color: MAROON }}
          >
            Biometric Setup
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 py-8">
        <div className="text-center mb-7">
          <h1
            className="mb-2"
            style={{ fontFamily: '"Trajan Pro 3", Cambria, serif', fontSize: '1.9rem', color: MAROON }}
          >
            Biometric Enrollment
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#6b5040' }}>
            Complete a quick face scan to secure your SIGLA account. Make sure your face is clearly visible in a well-lit area.
          </p>
        </div>

        <section className="bg-white rounded-3xl shadow-xl border p-5" style={{ borderColor: 'rgba(128,0,0,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold" style={{ color: '#1c1008' }}>
                Camera Preview
              </h2>
              <p className="text-xs mt-0.5" style={{ color: '#9a7a5a' }}>
                Center your face, then start the enrollment.
              </p>
            </div>

            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: phase === 'done' ? '#27AE6015' : MAROON + '10' }}
            >
              {phase === 'done' ? (
                <CheckCircle2 className="w-5 h-5" style={{ color: '#27AE60' }} />
              ) : phase === 'error' ? (
                <AlertCircle className="w-5 h-5" style={{ color: '#E74C3C' }} />
              ) : (
                <Camera className="w-5 h-5" style={{ color: MAROON }} />
              )}
            </div>
          </div>

          <CameraViewfinder videoRef={videoRef} canvasRef={canvasRef} phase={phase} statusLabel={cameraStatusLabel} />

          <div
            className="mt-4 rounded-2xl px-4 py-3 flex items-start gap-2.5"
            style={{
              backgroundColor:
                phase === 'done'
                  ? '#27AE6010'
                  : phase === 'error'
                    ? '#E74C3C10'
                    : MAROON + '08',
              border: `1px solid ${
                phase === 'done'
                  ? '#27AE6030'
                  : phase === 'error'
                    ? '#E74C3C30'
                    : MAROON + '18'
              }`,
            }}
          >
            {phase === 'done' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#27AE60' }} />
            ) : phase === 'error' ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#E74C3C' }} />
            ) : (
              <ScanFace className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MAROON }} />
            )}
            <p
              className="text-sm font-medium leading-relaxed"
              style={{ color: phase === 'done' ? '#1e8449' : phase === 'error' ? '#a93226' : '#6b5040' }}
            >
              {feedback}
            </p>
          </div>

          <div className="mt-5 flex gap-3">
            {phase !== 'done' && (
              <button
                onClick={startEnrollment}
                disabled={!cameraReady || !modelsLoaded || phase === 'scanning'}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(135deg, ${MAROON} 0%, ${MAROON_DARK} 100%)` }}
              >
                <Camera className="w-4 h-4" />
                {phase === 'scanning' ? 'Processing…' : 'Start Enrollment'}
              </button>
            )}

            {phase === 'error' && (
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold border transition-all"
                style={{ borderColor: MAROON, color: MAROON }}
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            )}

            {phase === 'done' && (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #27AE60 0%, #1e8449 100%)' }}
              >
                Access SIGLA <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>
      </main>

      <style>{`
        @keyframes scanline {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
}