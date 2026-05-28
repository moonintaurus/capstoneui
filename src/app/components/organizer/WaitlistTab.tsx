import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { C, MOCK_REGISTRANTS, MOCK_EVENTS } from './data';

export function WaitlistTab({ eventId }: { eventId?: string }) {
  const [filterEvent, setFilterEvent] = useState('All');
  const selectedEventTitle = eventId ? MOCK_EVENTS.find(ev => ev.id === eventId)?.title : undefined;
  const waitlisted = MOCK_REGISTRANTS.filter(r => r.regStatus === 'Waitlisted' && (!eventId ? filterEvent === 'All' || r.eventId === filterEvent : r.eventId === eventId));

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Waitlist</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Participants waiting for available event capacity.</p>
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
        <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ backgroundColor: C.goldenrod + '20', color: C.goldenrod }}>{waitlisted.length} on waitlist</span>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: C.cream }}>
                {['Participant', 'Email', 'Dept.', 'Program', 'Event', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {waitlisted.map(r => (
                <tr key={r.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-sm" style={{ color: C.text }}>{r.name}</td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: C.muted }}>{r.email}</td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: C.sub }}>{r.department}</td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: C.sub }}>{r.program}</td>
                  <td className="px-4 py-3.5 text-xs max-w-[160px]"><p className="truncate" style={{ color: C.sub }}>{r.eventTitle}</p></td>
                  <td className="px-4 py-3.5">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors hover:bg-stone-50"
                      style={{ borderColor: C.teal, color: C.teal }}>
                      <UserPlus className="w-3 h-3" /> Move to Confirmed
                    </button>
                  </td>
                </tr>
              ))}
              {waitlisted.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: C.muted }}>No waitlisted participants.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
