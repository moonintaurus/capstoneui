import { forwardRef } from 'react';
import { ScanFace } from 'lucide-react';
import type { BiometricVerificationState } from './CheckInTypes';
import { C } from './data';

interface BiometricScannerInterfaceProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  phase: BiometricVerificationState['status'];
  error?: string;
  showCornerMarkers?: boolean;
  showScanline?: boolean;
}

export const BiometricScannerInterface = forwardRef<
  HTMLDivElement,
  BiometricScannerInterfaceProps
>(
  (
    {
      videoRef,
      phase,
      error,
      showCornerMarkers = true,
      showScanline = true,
    },
    ref
  ) => {
    const getPhaseColor = () => {
      switch (phase) {
        case 'verified':
          return C.green;
        case 'scanning':
        case 'detecting':
          return '#FFDF00'; // Golden
        case 'failed':
          return C.coral;
        default:
          return 'rgba(255,255,255,0.2)';
      }
    };

    const getPhaseLabel = () => {
      switch (phase) {
        case 'loading':
          return 'Loading...';
        case 'detecting':
          return 'Detecting face...';
        case 'scanning':
          return 'Scanning face...';
        case 'verified':
          return 'Verified';
        case 'failed':
          return 'Failed';
        default:
          return 'Ready';
      }
    };

    return (
      <div
        ref={ref}
        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#0d0d0d',
          border: `2px solid ${getPhaseColor()}`,
          transition: 'border-color 0.3s ease',
        }}
      >
        {/* Fallback background */}
        <div
          className="absolute inset-0 flex items-center justify-center z-0"
          style={{
            background:
              'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a12 100%)',
          }}
        >
          <div className="relative">
            {/* Face guide frame */}
            <div
              className="w-40 h-48 rounded-full border-4 transition-all duration-500"
              style={{
                borderColor: getPhaseColor(),
                boxShadow:
                  phase === 'scanning' || phase === 'detecting'
                    ? `0 0 30px ${getPhaseColor()}40, 0 0 60px ${C.maroon}20`
                    : phase === 'verified'
                      ? `0 0 30px ${C.green}40`
                      : 'none',
              }}
            />

            {/* Animated ping for scanning */}
            {(phase === 'scanning' || phase === 'detecting') && (
              <div
                className="absolute inset-0 rounded-full border-4 border-transparent animate-ping"
                style={{
                  borderTopColor: getPhaseColor(),
                  opacity: 0.4,
                }}
              />
            )}

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <ScanFace
                className="w-16 h-16 transition-all duration-500"
                style={{ color: getPhaseColor() }}
              />
            </div>

            {/* Corner markers */}
            {showCornerMarkers &&
              (['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
                <div
                  key={pos}
                  className="absolute w-5 h-5"
                  style={{
                    top: pos.startsWith('t') ? '-10px' : 'auto',
                    bottom: pos.startsWith('b') ? '-10px' : 'auto',
                    left: pos.endsWith('l') ? '-10px' : 'auto',
                    right: pos.endsWith('r') ? '-10px' : 'auto',
                    borderTop: pos.startsWith('t')
                      ? `3px solid ${getPhaseColor()}`
                      : 'none',
                    borderBottom: pos.startsWith('b')
                      ? `3px solid ${getPhaseColor()}`
                      : 'none',
                    borderLeft: pos.endsWith('l')
                      ? `3px solid ${getPhaseColor()}`
                      : 'none',
                    borderRight: pos.endsWith('r')
                      ? `3px solid ${getPhaseColor()}`
                      : 'none',
                  }}
                />
              ))}
          </div>

          {/* Animated scanline */}
          {showScanline && (phase === 'scanning' || phase === 'detecting') && (
            <div
              className="absolute left-0 right-0 h-px opacity-60"
              style={{
                backgroundColor: getPhaseColor(),
                top: '40%',
                animation: 'scanline 2s linear infinite',
              }}
            />
          )}
        </div>

        {/* Live video feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover z-10"
        />

        {/* Status overlay at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between z-30"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
          }}
        >
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: getPhaseColor(),
                animation:
                  phase === 'scanning' || phase === 'detecting'
                    ? 'pulse 1s infinite'
                    : 'none',
              }}
            />
            <span className="text-white text-xs font-medium">
              {getPhaseLabel()}
            </span>
            {error && <span className="text-white text-xs ml-2">{error}</span>}
          </div>
        </div>

        {/* Recording indicator */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full z-30"
          style={{
            backgroundColor:
              phase === 'scanning' || phase === 'detecting'
                ? '#E74C3C'
                : 'rgba(0,0,0,0.5)',
          }}
        >
          {(phase === 'scanning' || phase === 'detecting') && (
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
          <span className="text-white text-xs font-bold">
            {phase === 'scanning' || phase === 'detecting' ? 'LIVE' : 'READY'}
          </span>
        </div>

        {/* Scanline animation keyframes */}
        <style>{`
          @keyframes scanline {
            0% {
              top: 0%;
            }
            100% {
              top: 100%;
            }
          }
        `}</style>
      </div>
    );
  }
);

BiometricScannerInterface.displayName = 'BiometricScannerInterface';
