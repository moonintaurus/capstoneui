import {
  Activity,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileBarChart2,
  Globe,
  RotateCcw,
  Send,
  XCircle,
} from 'lucide-react';
import {
  C,
  MOCK_CMO_EVENTS,
  type CmoEvent,
} from './data';

type OverviewTarget = 'approvals' | 'published' | 'monitoring' | 'reports';

interface CmoOverviewTabProps {
  events?: CmoEvent[];
  onNavigate?: (tab: OverviewTarget) => void;
}

const currentMonth = 4;
const currentYear = 2026;

function countEventsThisMonth(events: CmoEvent[]) {
  return events.filter(event => {
    const date = new Date(event.startDate);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;
}

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  sub: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border p-5 flex flex-col gap-3 shadow-sm" style={{ borderColor: C.border }}>
      <div className="flex items-center justify-between gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}14` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="text-2xl font-bold" style={{ color: C.text }}>{value}</span>
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: C.text }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: C.muted }}>{sub}</p>
      </div>
    </div>
  );
}

function QuickAction({
  label,
  helper,
  count,
  icon: Icon,
  onClick,
}: {
  label: string;
  helper: string;
  count?: string;
  icon: React.ElementType;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white rounded-2xl border p-4 text-left flex items-center gap-3 transition-all hover:shadow-md"
      style={{ borderColor: C.border }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${C.maroon}12` }}>
        <Icon className="w-5 h-5" style={{ color: C.maroon }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold" style={{ color: C.text }}>{label}</p>
          {count && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: `${C.goldenrod}18`, color: '#7a5800' }}>
              {count}
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5" style={{ color: C.muted }}>{helper}</p>
      </div>
    </button>
  );
}

export function CmoOverviewTab({ events = MOCK_CMO_EVENTS, onNavigate }: CmoOverviewTabProps) {
  const pending = events.filter(event => event.approvalStatus === 'Submitted' || event.approvalStatus === 'Pending Review').length;
  const approved = events.filter(event => event.approvalStatus === 'Approved').length;
  const returned = events.filter(event => event.approvalStatus === 'Returned with Comments').length;
  const rejected = events.filter(event => event.approvalStatus === 'Rejected').length;
  const published = events.filter(event => event.approvalStatus === 'Published').length;
  const departments = new Set(events.map(event => event.department)).size;
  const thisMonth = countEventsThisMonth(events);

  const metrics = [
    { label: 'Pending Event Reviews', value: pending, icon: Send, color: C.goldenrod, sub: 'Submitted or under review' },
    { label: 'Approved Events', value: approved, icon: CheckCircle2, color: C.green, sub: 'Ready for publication' },
    { label: 'Returned for Revision', value: returned, icon: RotateCcw, color: C.tangerine, sub: 'Needs organizer updates' },
    { label: 'Rejected Events', value: rejected, icon: XCircle, color: C.coral, sub: 'Not approved for posting' },
    { label: 'Published Events', value: published, icon: Globe, color: C.maroon, sub: 'Visible to eligible participants' },
    { label: 'Events This Month', value: thisMonth, icon: Activity, color: C.teal, sub: 'Scheduled in May 2026' },
    { label: 'Departments or Offices Monitored', value: departments, icon: Building2, color: C.purple, sub: 'Active event owners' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Dashboard</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>
          Review submissions, publish approved events, monitor event records, and generate CMO reports.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(metric => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4 gap-3">
          <div>
            <h3 className="font-bold text-sm" style={{ color: C.text }}>Quick Actions</h3>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Counts are operational indicators only.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <QuickAction
            label="Review Submissions"
            helper="Open submitted event reviews."
            count={`${pending} pending`}
            icon={ClipboardCheck}
            onClick={() => onNavigate?.('approvals')}
          />
          <QuickAction
            label="Publish Approved Event"
            helper="Publish approved events to eligible participants."
            icon={Globe}
            onClick={() => onNavigate?.('published')}
          />
          <QuickAction
            label="Monitor Department Events"
            helper="Track upcoming, ongoing, and past records."
            icon={Building2}
            onClick={() => onNavigate?.('monitoring')}
          />
          <QuickAction
            label="View Reports"
            helper="Generate monitoring and certificate summaries."
            icon={FileBarChart2}
            onClick={() => onNavigate?.('reports')}
          />
        </div>
      </section>

      <section className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: C.border }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
          <h3 className="font-bold text-sm" style={{ color: C.text }}>Recent Review Queue</h3>
        </div>
        <div className="divide-y" style={{ borderColor: C.border }}>
          {events
            .filter(event => event.approvalStatus !== 'Published')
            .slice(0, 5)
            .map(event => (
              <div key={event.id} className="px-5 py-3.5 flex items-center gap-4">
                <img src={event.coverImage} alt={event.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: C.text }}>{event.title}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: C.muted }}>
                    {event.organizer} - {event.department} - {event.dateSubmitted}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 whitespace-nowrap" style={{ backgroundColor: `${C.maroon}12`, color: C.maroon }}>
                  {event.approvalStatus}
                </span>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
