import { useState } from 'react';
import { X, MapPin, ScanFace, Check, AlertCircle, RefreshCw, Globe, ExternalLink, ClipboardList } from 'lucide-react';
import type { Event } from './data';
import { C } from './data';

type Phase = 'idle' | 'checking' | 'done' | 'error';

function VerifyStep({
  icon: Icon,
  title,
  detail,
  phase,
  accentColor,
}: {
  icon: React.ElementType;
  title: string;
  detail: string;
  phase: Phase;
  accentColor: string;
}) {
  const isDone = phase === 'done';
  const isChecking = phase === 'checking';
  const isError = phase === 'error';

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300"
      style={{
        borderColor: isDone ? C.green + '30' : isChecking ? accentColor + '30' : isError ? C.coral + '30' : 'rgba(128,0,0,0.08)',
        backgroundColor: isDone ? C.green + '06' : isChecking ? accentColor + '06' : isError ? C.coral + '06' : 'white',
      }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: isDone ? C.green : isChecking ? accentColor : isError ? C.coral : '#f0ebe0' }}>
        {isChecking
          ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          : isDone ? <Check className="w-6 h-6 text-white" />
          : isError ? <AlertCircle className="w-6 h-6 text-white" />
          : <Icon className="w-6 h-6" style={{ color: C.muted }} />
        }
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold mb-0.5" style={{ color: isDone ? C.green : isChecking ? accentColor : isError ? C.coral : C.text }}>
          {title}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{detail}</p>
      </div>
      <div>
        {isDone && <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: C.green + '15', color: C.green }}>Verified</span>}
        {isError && <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: C.coral + '15', color: C.coral }}>Failed</span>}
        {isChecking && <span className="text-xs font-semibold px-2 py-1 rounded-full animate-pulse" style={{ backgroundColor: accentColor + '15', color: accentColor }}>Active</span>}
      </div>
    </div>
  );
}

export function CheckInModal({ event, onClose }: { event: Event; onClose: () => void }) {
  const isOnsite = event.modality === 'Onsite' || event.modality === 'Hybrid';
  const isOnline = event.modality === 'Online';

  const [gpsPhase, setGpsPhase] = useState<Phase>('idle');
  const [facePhase, setFacePhase] = useState<Phase>('idle');
  const [linkUnlocked, setLinkUnlocked] = useState(false);
  const [overallDone, setOverallDone] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [surveyDone, setSurveyDone] = useState(false);

  const startCheckIn = () => {
    if (isOnsite) {
      setGpsPhase('checking');
      setTimeout(() => {
        setGpsPhase('done');
        setFacePhase('checking');
        setTimeout(() => {
          setFacePhase('done');
          setOverallDone(true);
        }, 2500);
      }, 2000);
    } else {
      setFacePhase('checking');
      setTimeout(() => {
        setFacePhase('done');
        setOverallDone(true);
        setLinkUnlocked(true);
      }, 2500);
    }
  };

  const retryFace = () => {
    setFacePhase('checking');
    setTimeout(() => setFacePhase('done'), 2200);
  };

  const canStart = gpsPhase === 'idle' && facePhase === 'idle';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ border: `1px solid ${C.border}` }}>

        {/* Header */}
        <div className="p-5 border-b flex items-start justify-between"
          style={{ borderColor: 'rgba(128,0,0,0.06)', background: `linear-gradient(135deg, ${event.accentColor}12 0%, transparent 100%)` }}>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>Attendance Check-In</p>
            <h2 className="font-bold text-sm" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>{event.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: event.accentColor }}>
                {event.modality}
              </span>
              {isOnsite && event.location && (
                <span className="text-xs flex items-center gap-1" style={{ color: C.muted }}>
                  <MapPin className="w-3 h-3" /> {event.location}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: C.muted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {/* ── Onsite flow ── */}
          {isOnsite && (
            <>
              <VerifyStep
                icon={MapPin}
                title="GPS / Geofencing Validation"
                detail={
                  gpsPhase === 'idle' ? 'Tap "Start Check-In" to verify your location within the event venue.' :
                  gpsPhase === 'checking' ? 'Checking your location against the event geofence…' :
                  gpsPhase === 'done' ? 'Location verified. You are within the event venue.' :
                  'Outside venue geofence. Move closer and retry.'
                }
                phase={gpsPhase}
                accentColor={event.accentColor}
              />
              <VerifyStep
                icon={ScanFace}
                title="Face Biometric Verification"
                detail={
                  facePhase === 'idle' ? 'GPS check required first before facial verification.' :
                  facePhase === 'checking' ? 'Scanning face via Face API JS. Stay still and look at the camera…' :
                  facePhase === 'done' ? 'Identity confirmed. Attendance recorded as Present.' :
                  'Face verification failed. Ensure good lighting and retry.'
                }
                phase={facePhase}
                accentColor={event.accentColor}
              />
            </>
          )}

          {/* ── Online flow ── */}
          {isOnline && (
            <>
              <VerifyStep
                icon={ScanFace}
                title="Face Biometric Verification"
                detail={
                  facePhase === 'idle' ? 'Tap "Start Check-In" to verify your identity before accessing the meeting link.' :
                  facePhase === 'checking' ? 'Scanning face via Face API JS. Stay still and look at the camera…' :
                  facePhase === 'done' ? 'Biometric Check-In Verified. Meeting link is now unlocked.' :
                  'Face verification failed. Ensure good lighting and retry.'
                }
                phase={facePhase}
                accentColor={event.accentColor}
              />

              {linkUnlocked && event.platformLink && (
                <div className="p-4 rounded-2xl border" style={{ borderColor: C.teal + '30', backgroundColor: C.teal + '06' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4" style={{ color: C.teal }} />
                    <p className="text-sm font-bold" style={{ color: C.teal }}>Meeting Link Unlocked</p>
                  </div>
                  <p className="text-xs mb-3" style={{ color: C.sub }}>Your identity has been verified. You may now join the session.</p>
                  <a
                    href={event.platformLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: C.teal }}
                  >
                    Join on {event.platform} <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </>
          )}

          {/* ── Success state ── */}
          {overallDone && (
            <div className="p-4 rounded-2xl border text-center" style={{ borderColor: C.green + '30', backgroundColor: C.green + '08' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: C.green }}>
                <Check className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold" style={{ color: C.green }}>Attendance recorded as Present</p>
              {isOnsite && (
                <p className="text-xs mt-1" style={{ color: C.muted }}>
                  Your attendance has been logged. Certificate status will be updated after the organizer uploads the attendance log.
                </p>
              )}
              {isOnline && (
                <p className="text-xs mt-1" style={{ color: C.muted }}>
                  Certificate status: <span className="font-semibold">Pending Verification</span> until the organizer uploads the CSV attendance log.
                </p>
              )}
            </div>
          )}

          {/* Error states */}
          {(gpsPhase === 'error' || facePhase === 'error') && (
            <div className="p-3 rounded-xl border flex items-center gap-2" style={{ borderColor: C.coral + '30', backgroundColor: C.coral + '08' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: C.coral }} />
              <p className="text-xs" style={{ color: C.coral }}>
                {gpsPhase === 'error' ? 'You appear to be outside the venue geofence. Please move to the event location and retry.' :
                  'Face verification failed. Ensure your face is well-lit and clearly visible.'}
              </p>
            </div>
          )}

          {/* ── Feedback survey ── */}
          {overallDone && !surveyDone && (
            <button
              onClick={() => setSurveyOpen(!surveyOpen)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all"
              style={{ borderColor: C.maroon, color: C.maroon }}
            >
              <ClipboardList className="w-4 h-4" />
              {surveyOpen ? 'Close Survey' : 'Fill Out Feedback Survey'}
            </button>
          )}
          {surveyOpen && !surveyDone && (
            <div className="p-4 rounded-2xl border space-y-3" style={{ borderColor: C.border }}>
              <p className="text-xs font-bold" style={{ color: C.text }}>Event Feedback</p>
              {['How was the event overall?', 'Was the venue / platform suitable?'].map((q, i) => (
                <div key={i}>
                  <p className="text-xs mb-2" style={{ color: C.sub }}>{q}</p>
                  <div className="flex gap-2">
                    {['😕', '😐', '🙂', '😊', '🤩'].map(emoji => (
                      <button key={emoji} className="text-lg hover:scale-125 transition-transform">{emoji}</button>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={() => { setSurveyDone(true); setSurveyOpen(false); }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white"
                style={{ backgroundColor: C.maroon }}
              >
                Submit Feedback
              </button>
            </div>
          )}
          {surveyDone && (
            <div className="p-3 rounded-xl text-center" style={{ backgroundColor: C.green + '10' }}>
              <p className="text-xs font-semibold" style={{ color: C.green }}>Thank you for your feedback!</p>
            </div>
          )}

          {/* ── Controls ── */}
          <div className="flex gap-3 pt-1">
            {canStart && (
              <button
                onClick={startCheckIn}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)`, boxShadow: `0 6px 18px ${C.maroon}35` }}
              >
                {isOnsite ? 'Start GPS + Face Check-In' : 'Verify Face to Unlock Link'}
              </button>
            )}
            {facePhase === 'error' && (
              <button onClick={retryFace} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold border" style={{ borderColor: C.maroon, color: C.maroon }}>
                <RefreshCw className="w-4 h-4" /> Retry Face Scan
              </button>
            )}
            {overallDone && (
              <button onClick={onClose} className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: C.green }}>
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
