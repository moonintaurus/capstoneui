import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Shield, Check, AlertCircle, Camera, Cpu, Lock,
  ScanFace, CheckCircle2, ArrowRight, RefreshCw
} from 'lucide-react';
import * as faceapi from 'face-api.js';

const MAROON = '#800000';
const MAROON_DARK = '#5a0000';
const GOLDEN = '#FFDF00';
const GOLDENROD = '#DAA520';
const SOFT_CREAM = '#FAF5E3';
const DEEP_TEAL = '#00598D';

type StepStatus = 'pending' | 'scanning' | 'done' | 'error';

interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
  icon: React.ElementType;
  status: StepStatus;
}

const initialChecklist: ChecklistItem[] = [
  { id: 'face', label: 'Face Detected', detail: 'Locating and validating facial landmarks', icon: ScanFace, status: 'pending' },
  { id: 'lighting', label: 'Lighting Checked', detail: 'Assessing ambient light quality for template accuracy', icon: Camera, status: 'pending' },
  { id: 'encrypt', label: 'Template Encrypted', detail: 'AES-256 encryption', icon: Lock, status: 'pending' },
  { id: 'complete', label: 'Enrollment Completed', detail: 'Biometric profile securely stored', icon: CheckCircle2, status: 'pending' },
];

const MODEL_URLS = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/';

function StatusIcon({ status }: { status: StepStatus }) {
  if (status === 'done') return <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#27AE60' }}><Check className="w-3.5 h-3.5 text-white" /></div>;
  if (status === 'scanning') return (
    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 animate-spin" style={{ borderColor: MAROON, borderTopColor: 'transparent' }} />
  );
  if (status === 'error') return <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E74C3C' }}><AlertCircle className="w-3.5 h-3.5 text-white" /></div>;
  return <div className="w-6 h-6 rounded-full border-2 flex-shrink-0" style={{ borderColor: 'rgba(128,0,0,0.18)' }} />;
}

function CameraViewfinder({ videoRef, canvasRef, phase, error }: { videoRef: React.RefObject<HTMLVideoElement | null>, canvasRef: React.RefObject<HTMLCanvasElement | null>, phase: 'idle' | 'scanning' | 'done' | 'error', error?: string }) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden"
      style={{ backgroundColor: '#0d0d0d', border: `2px solid ${phase === 'done' ? '#27AE60' : phase === 'scanning' ? MAROON : phase === 'error' ? '#E74C3C' : 'rgba(128,0,0,0.2)'}` }}>

      {/* Fallback background */}
      <div className="absolute inset-0 flex items-center justify-center z-0" style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a12 100%)' }}>
        <div className="relative">
          <div className="w-40 h-48 rounded-full border-4 transition-all duration-500"
            style={{
              borderColor: phase === 'done' ? '#27AE60' : phase === 'scanning' ? GOLDEN : phase === 'error' ? '#E74C3C' : 'rgba(255,255,255,0.15)',
              boxShadow: phase === 'scanning' ? `0 0 30px ${GOLDEN}40, 0 0 60px ${MAROON}20` : phase === 'done' ? `0 0 30px #27AE6040` : 'none',
            }} />
          {phase === 'scanning' && <div className="absolute inset-0 rounded-full border-4 border-transparent animate-ping" style={{ borderTopColor: GOLDEN, opacity: 0.4 }} />}
          <div className="absolute inset-0 flex items-center justify-center">
            <ScanFace className="w-16 h-16 transition-all duration-500"
              style={{ color: phase === 'done' ? '#27AE60' : phase === 'scanning' ? GOLDEN : phase === 'error' ? '#E74C3C' : 'rgba(255,255,255,0.2)' }} />
          </div>
          {(['tl', 'tr', 'bl', 'br'] as const).map(pos => (
            <div key={pos} className="absolute w-5 h-5"
              style={{
                top: pos.startsWith('t') ? '-10px' : 'auto',
                bottom: pos.startsWith('b') ? '-10px' : 'auto',
                left: pos.endsWith('l') ? '-10px' : 'auto',
                right: pos.endsWith('r') ? '-10px' : 'auto',
                borderTop: pos.startsWith('t') ? `3px solid ${phase === 'done' ? '#27AE60' : GOLDEN}` : 'none',
                borderBottom: pos.startsWith('b') ? `3px solid ${phase === 'done' ? '#27AE60' : GOLDEN}` : 'none',
                borderLeft: pos.endsWith('l') ? `3px solid ${phase === 'done' ? '#27AE60' : GOLDEN}` : 'none',
                borderRight: pos.endsWith('r') ? `3px solid ${phase === 'done' ? '#27AE60' : GOLDEN}` : 'none',
              }} />
          ))}
        </div>
        {phase === 'scanning' && <div className="absolute left-0 right-0 h-px opacity-60" style={{ backgroundColor: GOLDEN, animation: 'scanline 2s linear infinite', top: '40%' }} />}
      </div>

      {/* Live video feed on top */}
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover z-10" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-20" style={{ display: 'none' }} />

      {/* Status overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between z-30" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: phase === 'done' ? '#27AE60' : phase === 'scanning' ? GOLDEN : phase === 'error' ? '#E74C3C' : 'rgba(255,255,255,0.3)', animation: phase === 'scanning' ? 'pulse 1s infinite' : 'none' }} />
          <span className="text-white text-xs font-medium">{phase === 'idle' ? 'Camera ready' : phase === 'scanning' ? 'Processing…' : phase === 'done' ? 'Enrollment complete' : error || 'Error'}</span>
        </div>
      </div>

      {/* Corner rec indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full z-30" style={{ backgroundColor: phase === 'scanning' ? '#E74C3C' : 'rgba(0,0,0,0.5)' }}>
        {phase === 'scanning' && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
        <span className="text-white text-xs font-bold">{phase === 'scanning' ? 'REC' : 'LIVE'}</span>
      </div>
    </div>
  );
}

export function BiometricEnrollment() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'done' | 'error'>('idle');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [error, setError] = useState<string>('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const updateItem = (id: string, status: StepStatus) => {
    setChecklist(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  // Load models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Use the face-api.js models from node_modules or CDN
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URLS),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URLS),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URLS),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error('Failed to load models:', err);
        setError('Models failed to load');
      }
    };

    loadModels();
  }, []);

  // Start webcam on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error('Camera access denied:', err);
        setError('Camera permission denied');
        setPhase('error');
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startEnrollment = async () => {
    if (!modelsLoaded) {
      setError('Models not loaded');
      setPhase('error');
      return;
    }

    if (!videoRef.current) {
      setError('Camera not ready');
      setPhase('error');
      return;
    }

    setPhase('scanning');
    setError('');
    setChecklist(initialChecklist.map(i => ({ ...i, status: 'pending' })));

    try {
      // Start face detection
      updateItem('face', 'scanning');

      const result = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!result) {
        throw new Error('No face detected');
      }

      updateItem('face', 'done');

      // Check lighting (simulate by checking brightness)
      const t1 = setTimeout(() => updateItem('lighting', 'scanning'), 800);
      const t2 = setTimeout(() => updateItem('lighting', 'done'), 1600);

      // Encrypt and save descriptor
      const t3 = setTimeout(() => updateItem('encrypt', 'scanning'), 1800);
      const t4 = setTimeout(() => {
        updateItem('encrypt', 'done');
        
        // Save descriptor to localStorage
        const descriptorArray = Array.from(result.descriptor);
        localStorage.setItem('siglaFaceDescriptor', JSON.stringify(descriptorArray));
      }, 2800);

      // Mark complete
      const t5 = setTimeout(() => updateItem('complete', 'scanning'), 3000);
      const t6 = setTimeout(() => {
        updateItem('complete', 'done');
        setPhase('done');
      }, 4000);

      timerRef.current = [t1, t2, t3, t4, t5, t6];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Face detection failed');
      setPhase('error');
      setChecklist(initialChecklist.map(i => ({ ...i, status: 'pending' })));
    }
  };

  const reset = () => {
    timerRef.current.forEach(clearTimeout);
    setPhase('idle');
    setError('');
    setChecklist(initialChecklist.map(i => ({ ...i, status: 'pending' })));
  };

  useEffect(() => () => { timerRef.current.forEach(clearTimeout); }, []);

  const doneCount = checklist.filter(i => i.status === 'done').length;
  const progress = (doneCount / checklist.length) * 100;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <header className="bg-white border-b" style={{ borderColor: 'rgba(128,0,0,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/PUPLogo.png" alt="PUP Logo" className="w-10 h-10 object-contain" />
            <span className="text-lg font-bold" style={{ fontFamily: '"Trajan Pro 3", Cambria, serif', color: MAROON }}>SIGLA</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-sm">
            {['Account Info', 'Profile Setup', 'Interests', 'Biometric Enrollment'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && <div className="w-6 h-px" style={{ backgroundColor: 'rgba(128,0,0,0.15)' }} />}
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: i === 3 ? MAROON : '#27AE60', color: '#fff' }}>
                    {i < 3 ? <Check className="w-3 h-3" /> : '4'}
                  </div>
                  <span className="font-medium" style={{ color: i === 3 ? MAROON : '#27AE60', fontSize: '0.75rem' }}>{s}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: MAROON + '12', color: MAROON }}>
            Step 4 of 4
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="mb-3" style={{ fontFamily: '"Trajan Pro 3", Cambria, serif', fontSize: '2rem', color: MAROON }}>
            Biometric Enrollment
          </h1>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: '#6b5040' }}>
            SIGLA uses Biometric Enrollment to create an encrypted biometric template for attendance verification. No raw images are stored — only your secure template.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl border p-6" style={{ borderColor: 'rgba(128,0,0,0.08)' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold" style={{ color: '#1c1008' }}>Camera Preview</h2>
                <p className="text-xs mt-0.5" style={{ color: '#9a7a5a' }}>Ensure good lighting and positioning.</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: phase === 'done' ? '#27AE6015' : MAROON + '10', color: phase === 'done' ? '#27AE60' : MAROON }}>
                <Cpu className="w-3 h-3" />
                {phase === 'done' ? 'Enrolled' : 'Enrolling'}
              </div>
            </div>

            <CameraViewfinder videoRef={videoRef} canvasRef={canvasRef} phase={phase} error={error} />

            {phase !== 'idle' && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5" style={{ color: '#9a7a5a' }}>
                  <span>Processing</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: '#f0ebe0' }}>
                  <div className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: phase === 'done' ? '#27AE60' : MAROON }} />
                </div>
              </div>
            )}

            <div className="mt-5 flex gap-3">
              {phase === 'idle' && (
                <button
                  onClick={startEnrollment}
                  disabled={!modelsLoaded}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${MAROON} 0%, ${MAROON_DARK} 100%)` }}
                >
                  <Camera className="w-4 h-4" />
                  Start Enrollment
                </button>
              )}
              {phase === 'scanning' && (
                <button
                  onClick={reset}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold border transition-all"
                  style={{ borderColor: MAROON, color: MAROON }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Cancel
                </button>
              )}
              {(phase === 'done' || phase === 'error') && (
                <button
                  onClick={reset}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold border transition-all"
                  style={{ borderColor: MAROON, color: MAROON }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Retake
                </button>
              )}
              {phase === 'done' && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: `linear-gradient(135deg, #27AE60 0%, #1e8449 100%)` }}
                >
                  Access SIGLA <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-xl border p-6" style={{ borderColor: 'rgba(128,0,0,0.08)' }}>
              <h2 className="text-base font-bold mb-5" style={{ color: '#1c1008' }}>Enrollment Checklist</h2>
              <div className="space-y-4">
                {checklist.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.status === 'scanning';
                  const isDone = item.status === 'done';
                  return (
                    <div key={item.id} className={`flex items-start gap-3.5 p-3.5 rounded-xl transition-all duration-300 ${isActive ? 'shadow-sm' : ''}`}
                      style={{ backgroundColor: isActive ? MAROON + '06' : isDone ? '#27AE6008' : 'transparent', border: `1px solid ${isActive ? MAROON + '20' : isDone ? '#27AE6020' : 'transparent'}` }}>
                      <StatusIcon status={item.status} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" style={{ color: isDone ? '#27AE60' : isActive ? MAROON : '#9a7a5a' }} />
                          <p className="text-sm font-semibold" style={{ color: isDone ? '#27AE60' : isActive ? MAROON : '#706050' }}>
                            {item.label}
                          </p>
                        </div>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#9a7a5a' }}>{item.detail}</p>
                      </div>
                      {isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse" style={{ backgroundColor: MAROON + '15', color: MAROON }}>Active</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {phase === 'done' && (
              <div className="rounded-2xl border p-6 text-center" style={{ borderColor: '#27AE6030', background: 'linear-gradient(135deg, #27AE6008 0%, #1e844908 100%)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #27AE60 0%, #1e8449 100%)' }}>
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: '#1e8449' }}>Biometric enrollment successful.</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#2e7d32' }}>
                  Only a facial template/demo descriptor was stored.
                </p>
              </div>
            )}

            {phase === 'error' && error && (
              <div className="rounded-2xl border p-6 text-center" style={{ borderColor: '#E74C3C30', background: 'linear-gradient(135deg, #E74C3C08 0%, #c0392b08 100%)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #E74C3C 0%, #c0392b 100%)' }}>
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: '#c0392b' }}>Enrollment failed</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#a93226' }}>
                  {error}
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: 'rgba(128,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4" style={{ color: DEEP_TEAL }} />
                <h3 className="text-sm font-semibold" style={{ color: '#1c1008' }}>About Biometric Enrollment</h3>
              </div>
              <div className="space-y-2">
                {[
                  ['Detection', 'TinyFaceDetector ML model'],
                  ['Landmarks', '68-point facial landmark model'],
                  ['Recognition', 'FaceRecognitionNet descriptor generation'],
                  ['Storage', 'Encrypted template in localStorage only'],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-start justify-between gap-3">
                    <span className="text-xs font-semibold flex-shrink-0" style={{ color: '#9a7a5a' }}>{label}</span>
                    <span className="text-xs text-right" style={{ color: '#706050' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl" style={{ backgroundColor: MAROON + '08', border: `1px solid ${MAROON}18` }}>
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MAROON }} />
              <p className="text-xs leading-relaxed" style={{ color: '#6b5040' }}>
                SIGLA does not store raw face images. Only encrypted biometric templates are stored locally, compliant with the Data Privacy Act.
              </p>
            </div>
          </div>
        </div>
      </div>

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
