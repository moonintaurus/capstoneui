import { useEffect } from 'react';
import { ExternalLink, Globe, CheckCircle2 } from 'lucide-react';
import { useCheckIn } from './CheckInContext';
import { C } from './data';

export function UnlockMeetingLinkView({ onClose }: { onClose: () => void }) {
  const { state, unlockMeetingLink } = useCheckIn();

  useEffect(() => {
    // Simulate getting the meeting link from API
    // In production, this would be fetched from the event details
    const meetingLink = state.meetingLink || 'https://meet.example.com/event-' + state.eventId;
    const platform = state.eventTitle.includes('Teams')
      ? 'Microsoft Teams'
      : state.eventTitle.includes('Zoom')
        ? 'Zoom'
        : state.eventTitle.includes('Google')
          ? 'Google Meet'
          : 'Online Meeting';
    
    unlockMeetingLink(meetingLink);
  }, [state.eventId, state.eventTitle, state.meetingLink, unlockMeetingLink]);

  const getPlatformIcon = () => {
    if (!state.meetingLink) return null;
    if (state.meetingLink.includes('zoom')) return 'Zoom';
    if (state.meetingLink.includes('teams')) return 'Microsoft Teams';
    if (state.meetingLink.includes('meet.google')) return 'Google Meet';
    return 'Online Meeting';
  };

  const handleJoinMeeting = () => {
    if (state.meetingLink) {
      window.open(state.meetingLink, '_blank');
      // Mark attendance in the system
      setTimeout(onClose, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        {/* Header with Success */}
        <div className="p-8 text-center" style={{ background: `linear-gradient(135deg, ${C.teal}15 0%, ${C.green}15 100%)` }}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: C.green }}>
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-bold text-2xl mb-1" style={{ color: C.green, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
            Verification Complete
          </h1>
          <p className="text-sm" style={{ color: C.muted }}>Your identity has been verified</p>
        </div>

        {/* Event & Link Details */}
        <div className="p-6 space-y-4 border-b" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
          {/* Event Name */}
          <div className="space-y-1">
            <p className="text-xs font-semibold" style={{ color: C.muted }}>Event</p>
            <p className="text-sm font-bold" style={{ color: C.text }}>
              {state.eventTitle}
            </p>
          </div>

          {/* Meeting Link Status */}
          <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: C.teal + '06' }}>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: C.teal }} />
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: C.teal }}>Meeting Link Unlocked</p>
              <p className="text-xs" style={{ color: C.muted }}>You are approved to join the online event</p>
            </div>
          </div>
        </div>

        {/* Meeting Link Card */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl border-2" style={{
            borderColor: C.teal + '40',
            backgroundColor: C.teal + '08'
          }}>
            <div className="flex items-start gap-3 mb-4">
              <Globe className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: C.teal }} />
              <div className="flex-1">
                <p className="text-sm font-bold mb-0.5" style={{ color: C.teal }}>Join Meeting</p>
                <p className="text-xs" style={{ color: C.sub }}>
                  Platform: {getPlatformIcon() || 'Online Meeting'}
                </p>
              </div>
            </div>

            {state.meetingLink && (
              <div className="p-3 rounded-lg bg-white mb-3 border" style={{ borderColor: C.teal + '20' }}>
                <p className="text-xs font-mono break-all" style={{ color: C.muted }}>
                  {state.meetingLink}
                </p>
              </div>
            )}

            <p className="text-xs" style={{ color: C.sub }}>
              Click the button below to join the meeting. Your attendance will be recorded when you join.
            </p>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(128,0,0,0.03)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: C.text }}>Next Steps:</p>
            <ol className="text-xs space-y-1" style={{ color: C.sub }}>
              <li className="flex gap-2">
                <span>1.</span>
                <span>Click "Join Online Event" button below</span>
              </li>
              <li className="flex gap-2">
                <span>2.</span>
                <span>Allow camera/microphone access if prompted</span>
              </li>
              <li className="flex gap-2">
                <span>3.</span>
                <span>You will appear as "Present" once you join</span>
              </li>
            </ol>
          </div>

          {/* Attendance Note */}
          <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#f0f0f0' }}>
            <p className="text-xs" style={{ color: C.muted }}>
              Your attendance will be tracked through the event platform's attendance logs
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t space-y-3" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
          {state.meetingLink && (
            <button
              onClick={handleJoinMeeting}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: C.teal }}
            >
              <ExternalLink className="w-4 h-4" />
              Join Online Event
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-bold border transition-all"
            style={{ borderColor: C.maroon, color: C.maroon }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
