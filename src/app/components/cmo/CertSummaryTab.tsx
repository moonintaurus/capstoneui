import { C, MOCK_CERT_SUMMARIES, CERT_STYLE } from './data';

export function CertSummaryTab() {
  const totalGenerated = MOCK_CERT_SUMMARIES.reduce((s, c) => s + c.generated, 0);
  const totalReleased = MOCK_CERT_SUMMARIES.reduce((s, c) => s + c.released, 0);
  const totalPending = MOCK_CERT_SUMMARIES.reduce((s, c) => s + c.pending, 0);
  const totalNotEligible = MOCK_CERT_SUMMARIES.reduce((s, c) => s + c.notEligible, 0);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Certificate Summaries</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Event-level certificate generation and release status. Participant-level details are not displayed.</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Generated', value: totalGenerated, color: C.teal },
          { label: 'Released', value: totalReleased, color: '#27AE60' },
          { label: 'Pending', value: totalPending, color: '#EA6948' },
          { label: 'Not Eligible', value: totalNotEligible, color: C.coral },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border p-4" style={{ borderColor: C.border }}>
            <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value.toLocaleString()}</p>
            <p className="text-xs mt-1" style={{ color: C.muted }}>{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: C.cream }}>
                {['Event Title', 'Organizer', 'Dept.', 'Cert Template', 'Generated', 'Released', 'Pending', 'Not Eligible'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_CERT_SUMMARIES.map(c => {
                const cs = CERT_STYLE[c.certTemplateStatus];
                return (
                  <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3.5 max-w-[200px]">
                      <p className="font-semibold text-sm truncate" style={{ color: C.text }}>{c.eventTitle}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{c.organizer}</td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.muted }}>{c.department}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: cs.bg, color: cs.color }}>{c.certTemplateStatus}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: C.teal }}>{c.generated || '—'}</td>
                    <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: '#27AE60' }}>{c.released || '—'}</td>
                    <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: c.pending > 0 ? '#EA6948' : C.muted }}>{c.pending || '—'}</td>
                    <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: c.notEligible > 0 ? C.coral : C.muted }}>{c.notEligible || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 rounded-xl border p-4" style={{ borderColor: C.border, backgroundColor: C.cream }}>
        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
          <strong style={{ color: C.sub }}>Privacy Notice:</strong> This view displays event-level certificate summaries only. Individual participant certificate records, biometric data, and personal recommendation data are not accessible through this portal.
        </p>
      </div>
    </div>
  );
}
