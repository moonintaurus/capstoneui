import {
  AlertTriangle,
  CalendarDays,
  Users,
  CheckCircle,
  Clock,
  Award,
  BarChart2,
  PlusCircle,
} from 'lucide-react';
import { C, MOCK_EVENTS, needsCsvVerification } from './data';

const monthlyMetrics = [
  {
    label: 'Monthly Registrations',
    value: '128',
    sub: 'Across all active events',
    icon: Users,
    color: '#00598D',
  },
  {
    label: 'Verified Attendees',
    value: '97',
    sub: 'Checked-in participants',
    icon: CheckCircle,
    color: '#27AE60',
  },
  {
    label: 'Average Attendance Rate',
    value: '76%',
    sub: 'This month',
    icon: BarChart2,
    color: '#800000',
  },
  {
    label: 'Certificates Released',
    value: '42',
    sub: 'Sent to participants',
    icon: Award,
    color: '#DAA520',
  },
];

const upcomingEvents = MOCK_EVENTS
  .filter(event => new Date(`${event.date}T00:00:00`).getTime() >= new Date('2026-05-28T00:00:00').getTime())
  .slice(0, 3)
  .map(event => ({
    title: event.title,
    date: event.date,
    time: 'Scheduled',
    modality: event.modality,
    status: 'Upcoming',
    registered: event.registrationCount,
  }));



function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div
      className="bg-white rounded-2xl border p-5"
      style={{ borderColor: C.border }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold" style={{ color: C.text }}>
            {label}
          </p>
          <p className="text-xs mt-1" style={{ color: C.muted }}>
            {sub}
          </p>
        </div>

        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}12` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>

      <p className="text-3xl font-bold mt-5" style={{ color: C.text }}>
        {value}
      </p>
    </div>
  );
}

const quickActions = [
  { label: 'Create Event', icon: PlusCircle, action: 'create' },
  { label: 'Review Participants', icon: Users, action: 'participants' },
  { label: 'Manage Events', icon: CalendarDays, action: 'events' },
  { label: 'Release Certificates', icon: Award, action: 'certificates' },
] as const;

export function OverviewTab({
  onCreateEvent,
  onReviewParticipants,
  onManageEvents,
  onReleaseCertificates,
  onOpenCsvVerificationList,
}: {
  onCreateEvent?: () => void;
  onReviewParticipants?: () => void;
  onManageEvents?: () => void;
  onReleaseCertificates?: () => void;
  onOpenCsvVerificationList?: () => void;
} = {}) {
  const eventsNeedingCsv = MOCK_EVENTS.filter(event => needsCsvVerification(event));
  const quickActionHandlers = {
    create: onCreateEvent,
    participants: onReviewParticipants,
    events: onManageEvents,
    certificates: onReleaseCertificates,
  };

  return (
    <div className="space-y-7">
      {/* Page title */}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: C.text }}>
          Overview
        </h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>
          A quick summary of your events and monthly metrics.
        </p>
      </div>

      <section>
        <div className="mb-3">
          <h3 className="font-bold" style={{ color: C.text }}>
            Quick Actions
          </h3>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                onClick={quickActionHandlers[action.action]}
                className="bg-white rounded-2xl border p-5 text-left transition-colors hover:bg-stone-50"
                style={{ borderColor: C.border }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.maroon}10` }}>
                    <Icon className="w-5 h-5" style={{ color: C.maroon }} />
                  </div>
                  <span className="text-sm font-bold" style={{ color: C.text }}>{action.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {eventsNeedingCsv.length > 0 && (
        <button
          type="button"
          onClick={onOpenCsvVerificationList}
          className="w-full bg-white rounded-2xl border p-5 text-left transition-colors hover:bg-stone-50"
          style={{ borderColor: C.tangerine + '40' }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${C.tangerine}14` }}>
                <AlertTriangle className="w-5 h-5" style={{ color: C.tangerine }} />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: C.text }}>Completed Events Needing CSV Verification</h3>
                <p className="text-sm mt-1" style={{ color: C.muted }}>
                  {eventsNeedingCsv.length} completed online or hybrid event{eventsNeedingCsv.length === 1 ? '' : 's'} need event-level CSV verification.
                </p>
              </div>
            </div>
            <span className="text-sm font-bold whitespace-nowrap" style={{ color: C.maroon }}>Select Event</span>
          </div>
        </button>
      )}

      {/* Total Events */}
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: C.border }}
      >
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: C.muted }}>
              Total Events
            </p>
            <h3 className="text-4xl font-bold" style={{ color: C.maroon }}>
              {MOCK_EVENTS.length}
            </h3>
            <p className="text-sm mt-2" style={{ color: C.sub }}>
              All events created by your organizer account.
            </p>
          </div>

          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${C.maroon}10` }}
          >
            <CalendarDays className="w-7 h-7" style={{ color: C.maroon }} />
          </div>
        </div>
      </div>

      {/* Latest / Upcoming Events */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold" style={{ color: C.text }}>
              Upcoming Events
            </h3>
            <p className="text-sm" style={{ color: C.muted }}>
              Your nearest scheduled events.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {upcomingEvents.map(event => (
            <div
              key={event.title}
              className="bg-white rounded-2xl border p-5"
              style={{ borderColor: C.border }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h4 className="font-bold" style={{ color: C.text }}>
                    {event.title}
                  </h4>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>
                    {event.date} · {event.time}
                  </p>
                </div>

                <span
                  className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: `${C.maroon}10`,
                    color: C.maroon,
                  }}
                >
                  {event.modality}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: C.border }}>
                <div>
                  <p className="text-xs" style={{ color: C.muted }}>
                    Registered
                  </p>
                  <p className="font-bold" style={{ color: C.text }}>
                    {event.registered}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#27AE60' }}>
                  <Clock className="w-3.5 h-3.5" />
                  {event.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly Event Metrics */}
      <section>
        <div className="mb-3">
          <h3 className="font-bold" style={{ color: C.text }}>
            Event Metrics This Month
          </h3>
          <p className="text-sm" style={{ color: C.muted }}>
            Combined report summary for your current month.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {monthlyMetrics.map(metric => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>


    </div>
  );
}
