import { useState } from 'react';
import { Search } from 'lucide-react';
import { C, MOCK_REGISTRANTS, CERT_STATUS_STYLE, ATT_STATUS_STYLE, MOCK_EVENTS } from './data';

export function RegistrantsTab({ eventId }: { eventId?: string }) {
  const [search, setSearch] = useState('');
  const [filterEvent, setFilterEvent] = useState('All');
  const [filterReg, setFilterReg] = useState('All');

  const selectedEventTitle = eventId ? MOCK_EVENTS.find(ev => ev.id === eventId)?.title : undefined;

  const filtered = MOCK_REGISTRANTS.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.program.toLowerCase().includes(q);
    const matchEvent = eventId ? r.eventId === eventId : filterEvent === 'All' || r.eventId === filterEvent;
    const matchReg = filterReg === 'All' || r.regStatus === filterReg;
    return matchSearch && matchEvent && matchReg;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Registrants</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>View and manage all participants registered to your events.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border flex-1 min-w-48" style={{ borderColor: C.border, backgroundColor: '#fff' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: C.muted }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or program…" className="flex-1 bg-transparent text-sm outline-none" style={{ color: C.text }} />
        </div>
        {eventId ? (
          <div className="px-3.5 py-2 rounded-xl border text-sm bg-white" style={{ borderColor: C.border, color: C.sub }}>
            {selectedEventTitle}
          </div>
        ) : (
          <select value={filterEvent} onChange={e => setFilterEvent(e.target.value)} className="px-3.5 py-2 rounded-xl border text-sm bg-white outline-none" style={{ borderColor: C.border, color: C.sub }}>
            <option value="All">All Events</option>
            {MOCK_EVENTS.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>
        )}
        <select value={filterReg} onChange={e => setFilterReg(e.target.value)} className="px-3.5 py-2 rounded-xl border text-sm bg-white outline-none" style={{ borderColor: C.border, color: C.sub }}>
          <option value="All">All Statuses</option>
          <option>Confirmed</option>
          <option>Waitlisted</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: C.cream }}>
                {['Participant Name', 'Email', 'Dept.', 'Program', 'Event', 'Reg. Status', 'Time Slot', 'Attendance', 'Certificate'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: C.border }}>
              {filtered.map(r => {
                const att = ATT_STATUS_STYLE[r.attendanceStatus];
                const cert = CERT_STATUS_STYLE[r.certStatus];
                const regColor = r.regStatus === 'Confirmed' ? { bg: '#27AE6018', color: '#1a8a44' } : r.regStatus === 'Waitlisted' ? { bg: '#DAA52018', color: '#8a6010' } : { bg: '#D8584818', color: '#b03020' };
                return (
                  <tr key={r.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-sm whitespace-nowrap" style={{ color: C.text }}>{r.name}</td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: C.muted }}>{r.email}</td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{r.department}</td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{r.program}</td>
                    <td className="px-4 py-3.5 text-xs max-w-[160px]"><p className="truncate" style={{ color: C.sub }}>{r.eventTitle}</p></td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: regColor.bg, color: regColor.color }}>{r.regStatus}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{r.timeSlot}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: att.bg, color: att.color }}>{r.attendanceStatus}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: cert.bg, color: cert.color }}>{r.certStatus}</span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-sm" style={{ color: C.muted }}>No registrants match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
