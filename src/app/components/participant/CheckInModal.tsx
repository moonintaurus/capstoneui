import { X } from 'lucide-react';
import type { Event } from './data';
import { CheckInFlow } from './CheckInFlow';
import { C } from './data';

export function CheckInModal({ event, onClose }: { event: Event; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        style={{ border: `1px solid ${C.border}` }}>

        {/* Header with close button */}
        <div className="p-5 border-b flex items-center justify-between flex-shrink-0"
          style={{ borderColor: 'rgba(128,0,0,0.06)', background: `linear-gradient(135deg, ${event.accentColor}12 0%, transparent 100%)` }}>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>Attendance Check-In</p>
            <h2 className="font-bold text-sm" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>{event.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors flex-shrink-0" style={{ color: C.muted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <CheckInFlow event={event} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
