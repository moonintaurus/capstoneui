import { C, MOCK_CMO_EVENTS, APPROVAL_STYLE } from './data';

const now = new Date('2026-05-24');

function Badge({ text, bg, color }: { text: string; bg: string; color: string }) {
  return <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: bg, color }}>{text}</span>;
}

function ModalityChip({ m }: { m: string }) {
  const col = m === 'Onsite' ? C.maroon : m === 'Online' ? C.teal : '#27AE60';
  return <span className="px-2 py-0.5 rounded-md text-xs font-semibold" style={{ backgroundColor: col + '15', color: col }}>{m}</span>;
}

/* ── Upcoming Events ── */
export function UpcomingEventsTab() {
  const events = MOCK_CMO_EVENTS.filter(e => e.approvalStatus === 'Published' && new Date(e.startDate) > now);
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Upcoming Events</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Approved events scheduled for the future.</p>
      </div>
      {events.length === 0 ? (
        <p className="text-sm py-10 text-center" style={{ color: C.muted }}>No upcoming published events.</p>
      ) : (
        <div className="space-y-3">
          {events.map(ev => (
            <div key={ev.id} className="bg-white rounded-2xl border p-5 flex flex-col md:flex-row md:items-center gap-4" style={{ borderColor: C.border }}>
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center" style={{ backgroundColor: C.maroon + '10', border: `1px solid ${C.maroon}20` }}>
                <span className="text-xs font-bold" style={{ color: C.maroon }}>{new Date(ev.startDate).toLocaleString('en-PH', { month: 'short' })}</span>
                <span className="text-xl font-bold leading-none" style={{ color: C.maroon }}>{new Date(ev.startDate).getDate()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: C.text }}>{ev.title}</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>{ev.organizer} · {ev.department.split(' ').slice(0,4).join(' ')}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                <ModalityChip m={ev.modality} />
                <span className="text-xs" style={{ color: C.muted }}>{ev.venue}</span>
                <span className="text-xs font-semibold" style={{ color: C.sub }}>{ev.capacity} cap.</span>
                <Badge text="Published" bg={APPROVAL_STYLE.Published.bg} color={APPROVAL_STYLE.Published.color} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Ongoing Events ── */
export function OngoingEventsTab() {
  const events = MOCK_CMO_EVENTS.filter(e => e.approvalStatus === 'Published' && new Date(e.startDate) <= now && new Date(e.endDate) >= now);
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Ongoing Events</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Currently active campus events and their live metrics.</p>
      </div>
      {events.length === 0 ? (
        <p className="text-sm py-10 text-center" style={{ color: C.muted }}>No events are currently ongoing.</p>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: C.cream }}>
                {['Event Title', 'Organizer', 'Modality', 'Venue', 'Registered', 'Checked In', 'Attendance Rate', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {events.map(ev => {
                const rate = ev.registrationCount > 0 ? Math.round((ev.checkedIn / ev.registrationCount) * 100) : 0;
                return (
                  <tr key={ev.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3.5 max-w-[200px]">
                      <p className="font-semibold text-sm truncate" style={{ color: C.text }}>{ev.title}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{ev.organizer}</td>
                    <td className="px-4 py-3.5"><ModalityChip m={ev.modality} /></td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: C.muted }}>{ev.venue}</td>
                    <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: C.sub }}>{ev.registrationCount}</td>
                    <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: '#27AE60' }}>{ev.checkedIn}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: C.border, minWidth: 60 }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${rate}%`, backgroundColor: rate >= 75 ? '#27AE60' : rate >= 50 ? C.goldenrod : C.coral }} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: C.sub }}>{rate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#27AE60' }}>
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#27AE60' }} />
                        Live
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Past Events ── */
export function PastEventsTab() {
  const events = MOCK_CMO_EVENTS.filter(e => e.approvalStatus === 'Published' && new Date(e.endDate) < now);
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Past Events</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Archive of completed campus events with outcome metrics.</p>
      </div>
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: C.cream }}>
                {['Event Title', 'Organizer', 'Dept. / Office', 'Modality', 'Date', 'Registered', 'Attended', 'Att. Rate', 'Certs Released'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {events.map(ev => {
                const rate = ev.registrationCount > 0 ? Math.round((ev.checkedIn / ev.registrationCount) * 100) : 0;
                return (
                  <tr key={ev.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3.5 max-w-[200px]">
                      <p className="font-semibold text-sm truncate" style={{ color: C.text }}>{ev.title}</p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: C.muted }}>{ev.category}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{ev.organizer}</td>
                    <td className="px-4 py-3.5 text-xs max-w-[140px]"><p className="truncate" style={{ color: C.muted }}>{ev.department}</p></td>
                    <td className="px-4 py-3.5"><ModalityChip m={ev.modality} /></td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.muted }}>{ev.startDate.slice(0, 10)}</td>
                    <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: C.sub }}>{ev.registrationCount}</td>
                    <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: '#27AE60' }}>{ev.checkedIn}</td>
                    <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: rate >= 75 ? '#27AE60' : rate >= 50 ? C.goldenrod : C.coral }}>{rate}%</td>
                    <td className="px-4 py-3.5 text-xs text-center" style={{ color: C.teal }}>
                      {ev.certTemplateStatus === 'Validated' ? '✓' : '—'}
                    </td>
                  </tr>
                );
              })}
              {events.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-sm" style={{ color: C.muted }}>No past events found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
