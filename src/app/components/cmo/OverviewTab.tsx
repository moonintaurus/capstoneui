import { C, MOCK_CMO_EVENTS, MOCK_CERT_SUMMARIES } from './data';
import { Send, Clock, CheckCircle2, XCircle, MessageSquare, Globe, CalendarClock, Activity, Archive, Award, DownloadCloud, Timer } from 'lucide-react';

const now = new Date('2026-05-24');
const submitted = MOCK_CMO_EVENTS.filter(e => e.approvalStatus === 'Submitted').length;
const pending = MOCK_CMO_EVENTS.filter(e => e.approvalStatus === 'Pending Review').length;
const approved = MOCK_CMO_EVENTS.filter(e => e.approvalStatus === 'Approved').length;
const rejected = MOCK_CMO_EVENTS.filter(e => e.approvalStatus === 'Rejected').length;
const returned = MOCK_CMO_EVENTS.filter(e => e.approvalStatus === 'Returned with Comments').length;
const published = MOCK_CMO_EVENTS.filter(e => e.approvalStatus === 'Published').length;
const upcoming = MOCK_CMO_EVENTS.filter(e => e.approvalStatus === 'Published' && new Date(e.startDate) > now).length;
const ongoing = MOCK_CMO_EVENTS.filter(e => e.approvalStatus === 'Published' && new Date(e.startDate) <= now && new Date(e.endDate) >= now).length;
const past = MOCK_CMO_EVENTS.filter(e => e.approvalStatus === 'Published' && new Date(e.endDate) < now).length;
const certsGenerated = MOCK_CERT_SUMMARIES.reduce((s, c) => s + c.generated, 0);
const certsReleased = MOCK_CERT_SUMMARIES.reduce((s, c) => s + c.released, 0);
const certsPending = MOCK_CERT_SUMMARIES.reduce((s, c) => s + c.pending, 0);

const METRICS = [
  { label: 'Submitted Events', value: submitted, icon: Send, color: C.slate, sub: 'Awaiting CMO action' },
  { label: 'Pending Review', value: pending, icon: Clock, color: C.goldenrod, sub: 'Under current review' },
  { label: 'Approved Events', value: approved, icon: CheckCircle2, color: '#27AE60', sub: 'Cleared for publishing' },
  { label: 'Rejected Events', value: rejected, icon: XCircle, color: C.coral, sub: 'Not approved' },
  { label: 'Returned with Comments', value: returned, icon: MessageSquare, color: C.tangerine ?? '#EA6948', sub: 'Sent back for revision' },
  { label: 'Published Events', value: published, icon: Globe, color: C.maroon, sub: 'Live on SIGLA' },
  { label: 'Upcoming Campus Events', value: upcoming, icon: CalendarClock, color: C.teal, sub: 'Approved & scheduled' },
  { label: 'Ongoing Campus Events', value: ongoing, icon: Activity, color: '#27AE60', sub: 'Currently active' },
  { label: 'Past Campus Events', value: past, icon: Archive, color: C.muted, sub: 'Completed events' },
  { label: 'Certificates Generated', value: certsGenerated, icon: Award, color: C.teal, sub: 'Across all events' },
  { label: 'Certificates Released', value: certsReleased, icon: DownloadCloud, color: '#27AE60', sub: 'Sent to participants' },
  { label: 'Pending Certificates', value: certsPending, icon: Timer, color: '#EA6948', sub: 'Awaiting generation' },
];

export function CmoOverviewTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Overview</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {METRICS.map(m => (
          <div key={m.label} className="bg-white rounded-2xl border p-5 flex flex-col gap-3" style={{ borderColor: C.border }}>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.color + '14' }}>
                <m.icon className="w-5 h-5" style={{ color: m.color }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: C.text }}>{m.value}</span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: C.text }}>{m.label}</p>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent submissions */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: C.border }}>
          <h3 className="font-bold text-sm" style={{ color: C.text }}>Recent Submissions</h3>
        </div>
        <div className="divide-y" style={{ borderColor: C.border }}>
          {MOCK_CMO_EVENTS.slice(0, 6).map(ev => {
            const s = { bg: C.slate + '18', color: C.slate, ...({ 'Pending Review': { bg: '#DAA52018', color: '#8a6010' }, 'Approved': { bg: '#27AE6018', color: '#1a8a44' }, 'Rejected': { bg: '#D8584818', color: '#b03020' }, 'Returned with Comments': { bg: '#EA694818', color: '#C05020' }, 'Published': { bg: '#80000015', color: '#800000' } } as Record<string, { bg: string; color: string }>)[ev.approvalStatus] };
            return (
              <div key={ev.id} className="px-6 py-3.5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: C.text }}>{ev.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>{ev.organizer} · {ev.department.split(' ').slice(0, 3).join(' ')} · {ev.dateSubmitted}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 whitespace-nowrap" style={{ backgroundColor: s.bg, color: s.color }}>
                  {ev.approvalStatus}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
