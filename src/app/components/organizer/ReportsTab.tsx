import { useState } from 'react';
import { BarChart2, Eye } from 'lucide-react';
import { C, MOCK_EVENTS, getCategoryColor, isCompletedEvent } from './data';
import type { OrgEvent } from './data';
import { OrganizerEventDetail } from './OrganizerEventDetail';

function HistoryMetric({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-xl border p-4" style={{ borderColor: C.border }}>
      <p className="text-xs uppercase tracking-[0.14em] font-bold" style={{ color: C.muted }}>{label}</p>
      <p className="text-2xl font-bold mt-2" style={{ color }}>{value}</p>
    </div>
  );
}

export function ReportsTab() {
  const [selectedEvent, setSelectedEvent] = useState<OrgEvent | null>(null);
  const pastEvents = MOCK_EVENTS.filter(event => isCompletedEvent(event));

  if (selectedEvent) {
    return <OrganizerEventDetail event={selectedEvent} onBack={() => setSelectedEvent(null)} defaultTab="metrics" />;
  }

  const totalRegistered = pastEvents.reduce((sum, event) => sum + event.registrationCount, 0);
  const totalWaitlisted = pastEvents.reduce((sum, event) => sum + event.waitlistCount, 0);
  const completedOnlineHybrid = pastEvents.filter(event => event.modality !== 'Onsite').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Event History</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Click a past event to view its event metrics and management details.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <HistoryMetric label="Past Events" value={pastEvents.length} color={C.maroon} />
        <HistoryMetric label="Registered Participants" value={totalRegistered} color={C.teal} />
        <HistoryMetric label="Online / Hybrid Completed" value={completedOnlineHybrid} color={C.goldenrod} />
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: C.border }}>
          <BarChart2 className="w-4 h-4" style={{ color: C.maroon }} />
          <h3 className="text-sm font-bold" style={{ color: C.text }}>Past Events</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: C.cream }}>
                {['Event', 'Category', 'Modality', 'Date', 'Registered', 'Waitlist', 'CSV Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: C.border }}>
              {pastEvents.map(event => {
                const categoryColor = getCategoryColor(event.category);
                return (
                  <tr key={event.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-sm" style={{ color: C.text }}>{event.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>{event.location}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: categoryColor + '18', color: categoryColor }}>{event.category}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{event.modality}</td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{event.date}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold" style={{ color: C.text }}>{event.registrationCount}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold" style={{ color: event.waitlistCount > 0 ? C.tangerine : C.muted }}>{event.waitlistCount}</td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{event.csvVerificationStatus}</td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        className="w-8 h-8 rounded-lg inline-flex items-center justify-center hover:bg-stone-100"
                        style={{ color: C.teal }}
                        title="View metrics and details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {pastEvents.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm" style={{ color: C.muted }}>No past events yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t text-xs" style={{ borderColor: C.border, color: C.muted }}>
          Past events remain available for metrics review, registrant records, attendance records, certificate status, and CSV verification where applicable.
        </div>
      </div>
    </div>
  );
}
