import { useMemo, useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  MessageSquare,
  Users,
  X,
} from 'lucide-react';
import {
  APPROVAL_STYLE,
  C,
  EVENT_CATEGORIES,
  MOCK_CMO_EVENTS,
  formatDateTime,
  getCategoryColor,
  getFeedbackStatusForEvent,
  type ApprovalStatus,
  type CmoEvent,
  type Modality,
} from './data';
import { FeedbackSummaryTab } from './FeedbackSummaryTab';

const now = new Date('2026-05-28T12:00:00');

type MonitorFilters = {
  department: string;
  category: string;
  month: string;
  status: string;
  modality: string;
};

interface MonitoringTabProps {
  events?: CmoEvent[];
}

function Badge({ text, bg, color }: { text: string; bg: string; color: string }) {
  return <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: bg, color }}>{text}</span>;
}

function CategoryBadge({ event }: { event: CmoEvent }) {
  const color = getCategoryColor(event.category);
  return <Badge text={event.category} bg={`${color}18`} color={color} />;
}

function ModalityChip({ modality }: { modality: Modality }) {
  const color = modality === 'Onsite' ? C.maroon : modality === 'Online' ? C.teal : C.green;
  return <Badge text={modality} bg={`${color}15`} color={color} />;
}

function filterEvents(events: CmoEvent[], filters: MonitorFilters) {
  return events.filter(event => {
    const eventMonth = new Date(event.startDate).toLocaleString('en-PH', { month: 'long', year: 'numeric' });
    return (
      (filters.department === 'All' || event.department === filters.department) &&
      (filters.category === 'All' || event.category === filters.category) &&
      (filters.month === 'All' || eventMonth === filters.month) &&
      (filters.status === 'All' || event.approvalStatus === filters.status) &&
      (filters.modality === 'All' || event.modality === filters.modality)
    );
  });
}

function FilterPanel({
  events,
  filters,
  onChange,
}: {
  events: CmoEvent[];
  filters: MonitorFilters;
  onChange: (filters: MonitorFilters) => void;
}) {
  const departments = ['All', ...Array.from(new Set(events.map(event => event.department)))];
  const months = ['All', ...Array.from(new Set(events.map(event => new Date(event.startDate).toLocaleString('en-PH', { month: 'long', year: 'numeric' }))))];
  const statuses: Array<'All' | ApprovalStatus> = ['All', 'Submitted', 'Pending Review', 'Approved', 'Returned with Comments', 'Rejected', 'Published'];
  const modalities: Array<'All' | Modality> = ['All', 'Onsite', 'Online', 'Hybrid'];

  const fields = [
    { key: 'department' as const, label: 'Department or Office', values: departments },
    { key: 'category' as const, label: 'Category', values: ['All', ...EVENT_CATEGORIES] },
    { key: 'month' as const, label: 'Month', values: months },
    { key: 'status' as const, label: 'Status', values: statuses },
    { key: 'modality' as const, label: 'Modality', values: modalities },
  ];

  return (
    <div className="bg-white rounded-2xl border p-4 grid sm:grid-cols-2 xl:grid-cols-5 gap-3" style={{ borderColor: C.border }}>
      {fields.map(field => (
        <label key={field.key} className="block">
          <span className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>{field.label}</span>
          <select
            value={filters[field.key]}
            onChange={event => onChange({ ...filters, [field.key]: event.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-white"
            style={{ borderColor: C.border, color: C.text }}
          >
            {field.values.map(value => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
      ))}
    </div>
  );
}

function DepartmentCards({ events }: { events: CmoEvent[] }) {
  const summaries = useMemo(() => {
    const grouped = new Map<string, CmoEvent[]>();
    events.forEach(event => grouped.set(event.department, [...(grouped.get(event.department) ?? []), event]));

    return Array.from(grouped.entries()).map(([department, records]) => {
      const completed = records.filter(event => new Date(event.endDate) < now);
      const totalRegistered = records.reduce((sum, event) => sum + event.registrationCount, 0);
      const totalCheckedIn = records.reduce((sum, event) => sum + event.checkedIn, 0);
      return {
        department,
        submittedEvents: records.filter(event => event.approvalStatus === 'Submitted' || event.approvalStatus === 'Pending Review').length,
        publishedEvents: records.filter(event => event.approvalStatus === 'Published').length,
        completedEvents: completed.length,
        averageAttendance: totalRegistered > 0 ? Math.round((totalCheckedIn / totalRegistered) * 100) : 0,
        pendingCertificates: records.reduce((sum, event) => sum + event.pendingCertificates, 0),
        releasedCertificates: records.reduce((sum, event) => sum + event.releasedCertificates, 0),
        returnedEvents: records.filter(event => event.approvalStatus === 'Returned with Comments').length,
      };
    });
  }, [events]);

  if (summaries.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {summaries.map(summary => (
        <div key={summary.department} className="bg-white rounded-2xl border p-4 shadow-sm" style={{ borderColor: C.border }}>
          <p className="text-sm font-bold mb-3" style={{ color: C.text }}>{summary.department}</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Submitted', summary.submittedEvents],
              ['Published', summary.publishedEvents],
              ['Completed', summary.completedEvents],
              ['Avg Attendance', `${summary.averageAttendance}%`],
              ['Pending Certs', summary.pendingCertificates],
              ['Released Certs', summary.releasedCertificates],
              ['Returned', summary.returnedEvents],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl p-3" style={{ backgroundColor: C.cream }}>
                <p className="text-[11px] font-semibold" style={{ color: C.muted }}>{label}</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: C.text }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EventRecordModal({ event, onClose }: { event: CmoEvent; onClose: () => void }) {
  const attendanceRate = event.registrationCount > 0 ? Math.round((event.checkedIn / event.registrationCount) * 100) : 0;

  const timeline = [
    { label: 'Draft created', date: event.dateCreated, done: true },
    { label: 'Submitted', date: event.dateSubmitted, done: true },
    { label: 'Reviewed', date: event.dateUpdated, done: event.approvalStatus !== 'Submitted' },
    { label: event.approvalStatus === 'Returned with Comments' ? 'Returned' : event.approvalStatus, date: event.dateUpdated, done: ['Approved', 'Returned with Comments', 'Rejected', 'Published'].includes(event.approvalStatus) },
    { label: 'Published', date: event.publishedAt ?? '', done: event.approvalStatus === 'Published' },
    { label: 'Completed', date: event.endDate, done: new Date(event.endDate) < now },
  ];

  return (
    <div className="fixed inset-0 z-50 flex" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="ml-auto h-full w-full max-w-5xl bg-white flex flex-col overflow-hidden shadow-2xl">
        <div className="px-5 sm:px-7 py-5 border-b flex items-start justify-between gap-4" style={{ borderColor: C.border }}>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>CMO Event Record</p>
            <h2 className="font-bold text-base" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>{event.title}</h2>
            <p className="text-xs mt-1" style={{ color: C.muted }}>{event.tagline}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100" style={{ color: C.muted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-6">
          <div className="grid lg:grid-cols-[280px,1fr] gap-5">
            <div className="space-y-4">
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
                <img src={event.coverImage} alt={event.title} className="w-full h-44 object-cover" />
                <div className="p-4 space-y-2">
                  <Badge text={event.approvalStatus} bg={APPROVAL_STYLE[event.approvalStatus].bg} color={APPROVAL_STYLE[event.approvalStatus].color} />
                  <div className="flex flex-wrap gap-2">
                    <CategoryBadge event={event} />
                    <Badge text={event.type} bg={`${C.slate}18`} color={C.slate} />
                    <ModalityChip modality={event.modality} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border p-4" style={{ borderColor: C.border }}>
                <p className="text-sm font-bold mb-3" style={{ color: C.text }}>Approval Timeline</p>
                <div className="space-y-3">
                  {timeline.map(item => (
                    <div key={item.label} className="flex gap-3">
                      <div className="pt-0.5">
                        {item.done ? <CheckCircle2 className="w-4 h-4" style={{ color: C.green }} /> : <Clock className="w-4 h-4" style={{ color: C.muted }} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: item.done ? C.text : C.muted }}>{item.label}</p>
                        <p className="text-[11px]" style={{ color: C.muted }}>{item.date || 'Pending'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="font-bold text-sm mb-3" style={{ color: C.text }}>Event Summary</h3>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {[
                    { icon: Users, label: 'Organizer', value: event.organizer },
                    { icon: FileText, label: 'Department / Office', value: event.department },
                    { icon: Calendar, label: 'Start', value: formatDateTime(event.startDate) },
                    { icon: Calendar, label: 'End', value: formatDateTime(event.endDate) },
                    { icon: MapPin, label: 'Location', value: event.venue },
                    { icon: Users, label: 'Registration Status', value: `${event.registrationCount} registered, ${event.remainingSlots} seats left` },
                    { icon: Users, label: 'Waitlist Availability', value: event.waitlistAvailable ? `${event.waitlistCount} waitlisted` : 'Not available' },
                    { icon: Award, label: 'Certificate Template', value: event.certTemplateStatus },
                    { icon: FileText, label: 'Certificate Release Status', value: `${event.releasedCertificates} released` },
                    { icon: MessageSquare, label: 'Feedback Status', value: getFeedbackStatusForEvent(event) },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-xl border p-3 flex gap-2.5" style={{ borderColor: C.border, backgroundColor: C.cream }}>
                      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: C.maroon }} />
                      <div>
                        <p className="text-xs font-semibold" style={{ color: C.muted }}>{label}</p>
                        <p className="text-sm" style={{ color: C.text }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mt-4" style={{ color: C.sub }}>{event.description}</p>
              </section>

              {event.slots && event.slots.length > 0 && (
                <section>
                  <h3 className="font-bold text-sm mb-3" style={{ color: C.text }}>Schedule, Slot Occupancy, and Attendance</h3>
                  <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: C.border }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: C.cream }}>
                          {['Slot', 'Capacity', 'Occupancy', 'Waitlist', 'Attendance'].map(head => (
                            <th key={head} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{head}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: C.border }}>
                        {event.slots.map(slot => (
                          <tr key={slot.id}>
                            <td className="px-4 py-3 text-xs">
                              <p className="font-semibold" style={{ color: C.text }}>{slot.label}</p>
                              <p style={{ color: C.muted }}>{formatDateTime(slot.start)} - {formatDateTime(slot.end)}</p>
                            </td>
                            <td className="px-4 py-3 text-xs" style={{ color: C.sub }}>{slot.capacity}</td>
                            <td className="px-4 py-3 text-xs font-semibold" style={{ color: C.teal }}>{slot.enrolled}/{slot.capacity}</td>
                            <td className="px-4 py-3 text-xs font-semibold" style={{ color: C.goldenrod }}>{slot.waitlisted}</td>
                            <td className="px-4 py-3 text-xs font-semibold" style={{ color: C.green }}>{slot.attendanceCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              <section>
                <h3 className="font-bold text-sm mb-3" style={{ color: C.text }}>Event Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    ['Max Participants', event.capacity],
                    ['Registered', event.registrationCount],
                    ['Checked In', event.checkedIn],
                    ['Attendance Rate', `${attendanceRate}%`],
                    ['Generated Certificates', event.generatedCertificates],
                    ['Pending Certificates', event.pendingCertificates],
                    ['Released Certificates', event.releasedCertificates],
                    ['Not Eligible', event.notEligibleCertificates],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border p-3" style={{ borderColor: C.border }}>
                      <p className="text-xs font-semibold" style={{ color: C.muted }}>{label}</p>
                      <p className="text-lg font-bold mt-1" style={{ color: C.text }}>{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <FeedbackSummaryTab eventId={event.id} event={event} />
              </section>

              <section>
                <h3 className="font-bold text-sm mb-3" style={{ color: C.text }}>Remarks History and Organizer Updates</h3>
                <div className="space-y-3">
                  {event.remarksHistory.map(item => (
                    <div key={item.id} className="rounded-xl border p-3" style={{ borderColor: C.border }}>
                      <p className="text-xs font-bold" style={{ color: C.text }}>{item.action} - {item.date}</p>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>{item.author}</p>
                      <p className="text-sm mt-1" style={{ color: C.sub }}>{item.remarks}</p>
                    </div>
                  ))}
                  {event.organizerUpdates.length > 0 && (
                    <div className="rounded-xl border p-3" style={{ borderColor: `${C.teal}30`, backgroundColor: `${C.teal}08` }}>
                      <p className="text-xs font-bold mb-2" style={{ color: C.teal }}>Organizer Updates</p>
                      <ul className="space-y-1">
                        {event.organizerUpdates.map(update => <li key={update} className="text-sm" style={{ color: C.sub }}>{update}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventList({ events, empty }: { events: CmoEvent[]; empty: string }) {
  const [selected, setSelected] = useState<CmoEvent | null>(null);

  return (
    <>
      {events.length === 0 ? (
        <p className="text-sm py-10 text-center bg-white rounded-2xl border" style={{ color: C.muted, borderColor: C.border }}>{empty}</p>
      ) : (
        <div className="space-y-3">
          {events.map(event => (
            <button
              key={event.id}
              type="button"
              onClick={() => setSelected(event)}
              className="w-full bg-white rounded-2xl border p-4 flex flex-col md:flex-row md:items-center gap-4 text-left hover:shadow-md transition-all"
              style={{ borderColor: C.border }}
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center" style={{ backgroundColor: `${C.maroon}10`, border: `1px solid ${C.maroon}20` }}>
                <span className="text-xs font-bold" style={{ color: C.maroon }}>{new Date(event.startDate).toLocaleString('en-PH', { month: 'short' })}</span>
                <span className="text-xl font-bold leading-none" style={{ color: C.maroon }}>{new Date(event.startDate).getDate()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: C.text }}>{event.title}</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>{event.organizer} - {event.department}</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>{event.venue}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <CategoryBadge event={event} />
                <ModalityChip modality={event.modality} />
                <Badge text={event.approvalStatus} bg={APPROVAL_STYLE[event.approvalStatus].bg} color={APPROVAL_STYLE[event.approvalStatus].color} />
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && <EventRecordModal event={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function MonitoringContent({
  sourceEvents,
  statusFilter,
  empty,
}: {
  sourceEvents: CmoEvent[];
  statusFilter: (event: CmoEvent) => boolean;
  empty: string;
}) {
  const [filters, setFilters] = useState<MonitorFilters>({
    department: 'All',
    category: 'All',
    month: 'All',
    status: 'All',
    modality: 'All',
  });

  const baseEvents = sourceEvents.filter(statusFilter);
  const filtered = filterEvents(baseEvents, filters);

  return (
    <div className="space-y-5">
      <FilterPanel events={sourceEvents} filters={filters} onChange={setFilters} />
      <DepartmentCards events={filtered} />
      <EventList events={filtered} empty={empty} />
    </div>
  );
}

export function UpcomingEventsTab({ events = MOCK_CMO_EVENTS }: MonitoringTabProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Upcoming Events</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Published events scheduled for the future.</p>
      </div>
      <MonitoringContent
        sourceEvents={events}
        statusFilter={event => event.approvalStatus === 'Published' && new Date(event.startDate) > now}
        empty="No upcoming published events match the current filters."
      />
    </div>
  );
}

export function OngoingEventsTab({ events = MOCK_CMO_EVENTS }: MonitoringTabProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Ongoing Events</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Currently active campus events and live operational metrics.</p>
      </div>
      <MonitoringContent
        sourceEvents={events}
        statusFilter={event => event.approvalStatus === 'Published' && new Date(event.startDate) <= now && new Date(event.endDate) >= now}
        empty="No events are currently ongoing."
      />
    </div>
  );
}

export function PastEventsTab({ events = MOCK_CMO_EVENTS }: MonitoringTabProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Past Events</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Completed events with attendance, certificate, and approval records.</p>
      </div>
      <MonitoringContent
        sourceEvents={events}
        statusFilter={event => event.approvalStatus === 'Published' && new Date(event.endDate) < now}
        empty="No past events match the current filters."
      />
    </div>
  );
}