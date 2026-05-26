import { useState } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { C, MOCK_ATTENDANCE, MOCK_EVENTS, ATT_STATUS_STYLE } from './data';

function VerifyIcon({ yes }: { yes: boolean }) {
  return yes
    ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#27AE60' }} />
    : <XCircle className="w-3.5 h-3.5" style={{ color: '#9a7a5a' }} />;
}

export function AttendanceTab({ eventId }: { eventId?: string }) {
  const [filterEvent, setFilterEvent] = useState('All');
  const selectedEventTitle = eventId ? MOCK_EVENTS.find(ev => ev.id === eventId)?.title : undefined;
  const records = MOCK_ATTENDANCE.filter(a => eventId ? a.eventId === eventId : filterEvent === 'All' || a.eventId === filterEvent);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Attendance Records</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>GPS, biometric, and CSV verification status per participant.</p>
      </div>

      <div className="flex items-center gap-3 mb-5">
        {eventId ? (
          <div className="px-3.5 py-2 rounded-xl border bg-white text-sm" style={{ borderColor: C.border, color: C.sub }}>
            {selectedEventTitle}
          </div>
        ) : (
          <select value={filterEvent} onChange={e => setFilterEvent(e.target.value)} className="px-3.5 py-2 rounded-xl border text-sm bg-white outline-none" style={{ borderColor: C.border, color: C.sub }}>
            <option value="All">All Events</option>
            {MOCK_EVENTS.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {[
          { label: 'GPS / Geofencing (Onsite)', color: C.teal },
          { label: 'Biometric Check-In', color: C.maroon },
          { label: 'CSV Match (Online)', color: '#27AE60' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: C.cream }}>
                {['Participant', 'Email', 'Event', 'Modality', 'Check-In Time', 'GPS', 'Biometric', 'CSV Match', 'Duration', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map(r => {
                const s = ATT_STATUS_STYLE[r.status];
                return (
                  <tr key={r.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-sm whitespace-nowrap" style={{ color: C.text }}>{r.participantName}</td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: C.muted }}>{r.email}</td>
                    <td className="px-4 py-3.5 text-xs max-w-[160px]"><p className="truncate" style={{ color: C.sub }}>{r.eventTitle}</p></td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{r.modality}</td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{r.checkInTime}</td>
                    <td className="px-4 py-3.5">
                      {r.modality === 'Online' ? <span className="text-xs" style={{ color: C.muted }}>N/A</span> : <VerifyIcon yes={r.gpsVerified} />}
                    </td>
                    <td className="px-4 py-3.5"><VerifyIcon yes={r.biometricVerified} /></td>
                    <td className="px-4 py-3.5">
                      {r.modality === 'Onsite' ? <span className="text-xs" style={{ color: C.muted }}>N/A</span> : <VerifyIcon yes={r.csvMatched} />}
                    </td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{r.attendanceDuration}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: s.bg, color: s.color }}>{r.status}</span>
                    </td>
                  </tr>
                );
              })}
              {records.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-10 text-center text-sm" style={{ color: C.muted }}>No attendance records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
