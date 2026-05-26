import { useMemo, useState } from 'react';
import { Award, Download, Eye } from 'lucide-react';
import { C, MOCK_CERTS, CERT_STATUS_STYLE, MOCK_EVENTS } from './data';

export function CertificatesTab({ eventId }: { eventId?: string }) {
  const [filterEvent, setFilterEvent] = useState('All');
  const selectedEventTitle = eventId ? MOCK_EVENTS.find(ev => ev.id === eventId)?.title : undefined;

  const filtered = useMemo(() => {
    const title = selectedEventTitle ?? (filterEvent === 'All' ? undefined : MOCK_EVENTS.find(e => e.id === filterEvent)?.title);
    return MOCK_CERTS.filter(c => !title || c.eventTitle === title);
  }, [filterEvent, selectedEventTitle]);

  const summary = useMemo(() => {
    return filtered.reduce(
      (acc, cert) => {
        if (cert.status === 'Generated' || cert.status === 'Released') acc.generated += 1;
        if (cert.status === 'Released') acc.released += 1;
        if (cert.status === 'Pending') acc.pending += 1;
        if (cert.status === 'Not Eligible') acc.notEligible += 1;
        return acc;
      },
      { generated: 0, released: 0, pending: 0, notEligible: 0 },
    );
  }, [filtered]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Certificates</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Track certificate generation and release status for your events.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Certificates Generated', value: summary.generated, color: C.teal },
          { label: 'Certificates Released', value: summary.released, color: '#27AE60' },
          { label: 'Pending Generation', value: summary.pending, color: C.tangerine },
          { label: 'Not Eligible', value: summary.notEligible, color: C.coral },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl border p-4 flex gap-3 items-center" style={{ borderColor: C.border }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: card.color + '14' }}>
              <Award className="w-5 h-5" style={{ color: card.color }} />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: card.color }}>{card.value}</p>
              <p className="text-xs" style={{ color: C.muted }}>{card.label}</p>
            </div>
          </div>
        ))}
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

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: C.cream }}>
                {['Participant', 'Email', 'Event', 'Certificate No.', 'Generated', 'Released', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(cert => {
                const s = CERT_STATUS_STYLE[cert.status];
                return (
                  <tr key={cert.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-sm whitespace-nowrap" style={{ color: C.text }}>{cert.participantName}</td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: C.muted }}>{cert.email}</td>
                    <td className="px-4 py-3.5 text-xs max-w-[160px]"><p className="truncate" style={{ color: C.sub }}>{cert.eventTitle}</p></td>
                    <td className="px-4 py-3.5 text-xs font-mono" style={{ color: C.sub }}>{cert.certNumber}</td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{cert.generatedDate}</td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{cert.releasedDate}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: s.bg, color: s.color }}>{cert.status}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        {cert.status === 'Released' && (
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors" title="Download" style={{ color: '#27AE60' }}>
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {(cert.status === 'Generated' || cert.status === 'Released') && (
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors" title="Preview" style={{ color: C.teal }}>
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
