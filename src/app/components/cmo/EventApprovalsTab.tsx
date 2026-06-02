import { useMemo, useState, type SetStateAction } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Globe,
  Image as ImageIcon,
  Mail,
  MapPin,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import {
  APPROVAL_STYLE,
  C,
  CERT_STYLE,
  EVENT_CATEGORIES,
  MOCK_CMO_EVENTS,
  formatDateTime,
  getCategoryColor,
  type ApprovalStatus,
  type CmoEvent,
} from './data';

interface SharedEventStateProps {
  events?: CmoEvent[];
  onEventsChange?: (events: CmoEvent[]) => void;
}

type DecisionAction = 'approve' | 'return' | 'reject';

const REVIEW_FILTERS = [
  'Pending',
  'Approved',
  'Returned',
  'Rejected',
  'All',
  ...EVENT_CATEGORIES,
  'Onsite',
  'Online',
  'Hybrid',
];

function useManagedEvents({ events: externalEvents, onEventsChange }: SharedEventStateProps) {
  const [localEvents, setLocalEvents] = useState<CmoEvent[]>(MOCK_CMO_EVENTS);
  const events = externalEvents ?? localEvents;

  const setEvents = (updater: SetStateAction<CmoEvent[]>) => {
    const next = typeof updater === 'function' ? updater(events) : updater;
    if (onEventsChange) {
      onEventsChange(next);
    } else {
      setLocalEvents(next);
    }
  };

  return [events, setEvents] as const;
}

function Badge({ text, style }: { text: string; style: { bg: string; color: string } }) {
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.color }}>
      {text}
    </span>
  );
}

function CategoryBadge({ event }: { event: CmoEvent }) {
  const color = getCategoryColor(event.category);
  return <Badge text={event.category} style={{ bg: `${color}18`, color }} />;
}

function filterMatches(event: CmoEvent, filter: string) {
  if (filter === 'All') return true;
  if (filter === 'Pending') return event.approvalStatus === 'Submitted' || event.approvalStatus === 'Pending Review';
  if (filter === 'Returned') return event.approvalStatus === 'Returned with Comments';
  if (filter === 'Approved') return event.approvalStatus === 'Approved';
  if (filter === 'Rejected') return event.approvalStatus === 'Rejected';
  if (EVENT_CATEGORIES.includes(filter as CmoEvent['category'])) return event.category === filter;
  if (filter === 'Onsite' || filter === 'Online' || filter === 'Hybrid') return event.modality === filter;
  return true;
}

function getChecklist(event: CmoEvent) {
  return [
    { label: 'Basic details complete', done: Boolean(event.title && event.tagline && event.description && event.category) },
    { label: 'Schedule complete', done: Boolean(event.startDate && event.endDate) },
    { label: 'Audience and eligibility defined', done: Boolean(event.targetAudience && event.eligibility) },
    { label: 'Attendance rules configured', done: event.attendanceRules.length > 0 },
    { label: 'Survey configured or marked not required', done: event.surveyStatus === 'Configured' || event.surveyStatus === 'Not Required' },
    { label: 'Certificate availability indicated', done: typeof event.certificateAvailable === 'boolean' },
    { label: 'Cover/poster uploaded', done: Boolean(event.coverImage) },
    { label: 'Requirements clear', done: Boolean(event.requirements && event.requirements !== 'None.') },
    { label: 'PUP branding/compliance checked', done: Boolean(event.coverImage && event.title) },
  ];
}

function DetailCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="rounded-xl border p-3 flex items-start gap-2.5" style={{ borderColor: C.border, backgroundColor: C.cream }}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.maroon }} />
      <div>
        <p className="text-xs font-semibold" style={{ color: C.muted }}>{label}</p>
        <p className="text-sm" style={{ color: C.text }}>{value}</p>
      </div>
    </div>
  );
}

function DecisionModal({
  action,
  event,
  onClose,
  onConfirm,
}: {
  action: DecisionAction;
  event: CmoEvent;
  onClose: () => void;
  onConfirm: (action: DecisionAction, remarks?: string) => void;
}) {
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  const isApprove = action === 'approve';
  const isReturn = action === 'return';
  const title = isApprove ? 'Approve Event' : isReturn ? 'Return for Revision' : 'Reject Event';
  const placeholder = isReturn ? 'Enter required changes or concerns.' : 'Enter reason for rejection.';
  const button = isApprove ? 'Confirm Approval' : isReturn ? 'Return Event' : 'Reject Event';

  const submit = () => {
    if (!isApprove && !remarks.trim()) {
      setError(isReturn ? 'Remarks are required before returning this event.' : 'A rejection reason is required.');
      return;
    }

    try {
      onConfirm(action, remarks.trim() || undefined);
    } catch {
      setError('Status update failed. Please retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl border shadow-2xl w-full max-w-lg overflow-hidden" style={{ borderColor: C.border }}>
        <div className="px-5 py-4 border-b flex items-start justify-between gap-4" style={{ borderColor: C.border }}>
          <div>
            <h3 className="font-bold text-base" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>{title}</h3>
            <p className="text-xs mt-1" style={{ color: C.muted }}>{event.title}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100" style={{ color: C.muted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-xl border p-4" style={{ borderColor: isApprove ? `${C.green}30` : `${C.goldenrod}40`, backgroundColor: isApprove ? `${C.green}08` : `${C.goldenrod}10` }}>
            <p className="text-sm font-semibold" style={{ color: C.text }}>{isApprove ? 'Confirmation Summary' : 'Decision Details'}</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: C.sub }}>
              The event status will be updated and the organizer will be emailed about the decision.
            </p>
          </div>

          {!isApprove && (
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: C.sub }}>
                {isReturn ? 'Required Changes or Concerns' : 'Reason for Rejection'} <span style={{ color: C.coral }}>*</span>
              </label>
              <textarea
                value={remarks}
                onChange={e => {
                  setRemarks(e.target.value);
                  setError('');
                }}
                rows={4}
                placeholder={placeholder}
                className="w-full px-3.5 py-3 rounded-xl border text-sm outline-none resize-none"
                style={{ borderColor: error ? C.coral : C.border, color: C.text }}
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs font-semibold rounded-xl p-3" style={{ backgroundColor: `${C.coral}10`, color: C.coral }}>
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={onClose} className="py-3 rounded-xl border text-sm font-bold" style={{ borderColor: C.border, color: C.sub }}>
              Cancel
            </button>
            <button type="button" onClick={submit} className="py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: action === 'reject' ? C.coral : C.maroon }}>
              {button}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventDetailModal({
  event,
  onClose,
  onDecision,
}: {
  event: CmoEvent;
  onClose: () => void;
  onDecision: (id: string, action: DecisionAction, remarks?: string) => void;
}) {
  const [decision, setDecision] = useState<DecisionAction | null>(null);
  const [success, setSuccess] = useState('');
  const checklist = getChecklist(event);
  const checklistDone = checklist.filter(item => item.done).length;
  const canDecide = event.approvalStatus !== 'Published';

  const confirmDecision = (action: DecisionAction, remarks?: string) => {
    onDecision(event.id, action, remarks);
    setDecision(null);
    setSuccess(
      action === 'approve'
        ? 'Event approved. Decision email sent to organizer.'
        : action === 'return'
          ? 'Event returned to organizer with remarks. Decision email sent.'
          : 'Event rejected. Decision email sent.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="ml-auto h-full w-full max-w-5xl bg-white flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-start justify-between px-5 sm:px-7 py-5 border-b flex-shrink-0" style={{ borderColor: C.border }}>
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>Review Submitted Event</p>
            <h2 className="font-bold text-base leading-snug" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>{event.title}</h2>
            <p className="text-xs mt-1" style={{ color: C.muted }}>{event.tagline}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100 flex-shrink-0" style={{ color: C.muted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-6 pb-28">
          {success && (
            <div className="rounded-2xl border p-4 flex items-start gap-3" style={{ borderColor: `${C.green}30`, backgroundColor: `${C.green}08` }}>
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: C.green }} />
              <div>
                <p className="text-sm font-bold" style={{ color: C.text }}>{success}</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>Organizer communication is handled through email updates only.</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-[280px,1fr] gap-5">
            <div className="space-y-4">
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
                <img src={event.coverImage} alt={`${event.title} poster preview`} className="w-full h-44 object-cover" />
                <div className="p-4 space-y-2">
                  <Badge text={event.approvalStatus} style={APPROVAL_STYLE[event.approvalStatus]} />
                  <div className="flex flex-wrap gap-2">
                    <CategoryBadge event={event} />
                    <Badge text={event.modality} style={{ bg: `${C.teal}15`, color: C.teal }} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border p-4" style={{ borderColor: C.border }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold" style={{ color: C.text }}>Completeness and Compliance</p>
                  <span className="text-xs font-semibold" style={{ color: C.maroon }}>{checklistDone}/{checklist.length}</span>
                </div>
                <div className="space-y-2">
                  {checklist.map(item => (
                    <div key={item.label} className="flex items-start gap-2 text-xs" style={{ color: item.done ? C.sub : C.coral }}>
                      {item.done ? <Check className="w-4 h-4 flex-shrink-0" style={{ color: C.green }} /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="font-bold text-sm mb-3" style={{ color: C.text }}>Basic Event Details</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <DetailCard icon={FileText} label="Event Title" value={event.title} />
                  <DetailCard icon={FileText} label="Tagline" value={event.tagline} />
                  <DetailCard icon={Globe} label="Exclusivity" value={event.exclusivity} />
                  <DetailCard icon={Users} label="Target Audience" value={event.targetAudience} />
                  <DetailCard icon={ShieldCheck} label="Eligibility" value={event.eligibility} />
                  <DetailCard icon={ImageIcon} label="Cover/Poster Preview" value="Uploaded" />
                </div>
                <p className="text-sm leading-relaxed mt-4" style={{ color: C.sub }}>{event.description}</p>
              </section>

              <section>
                <h3 className="font-bold text-sm mb-3" style={{ color: C.text }}>Schedule and Venue</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <DetailCard icon={Calendar} label="Start Date and Time" value={formatDateTime(event.startDate)} />
                  <DetailCard icon={Calendar} label="End Date and Time" value={formatDateTime(event.endDate)} />
                  <DetailCard icon={MapPin} label="Venue or Online Platform" value={event.venue} />
                  <DetailCard icon={Users} label="Capacity" value={`${event.capacity} participants`} />
                </div>

                {event.slots && event.slots.length > 0 && (
                  <div className="mt-4 rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: C.border }}>
                      <p className="text-xs font-bold" style={{ color: C.muted }}>Available Schedules or Time Slots</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ backgroundColor: C.cream }}>
                            {['Slot', 'Start', 'End', 'Venue', 'Capacity', 'Enrolled', 'Waitlist'].map(head => (
                              <th key={head} className="px-3 py-2.5 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{head}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: C.border }}>
                          {event.slots.map(slot => (
                            <tr key={slot.id}>
                              <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: C.text }}>{slot.label}</td>
                              <td className="px-3 py-2.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{formatDateTime(slot.start)}</td>
                              <td className="px-3 py-2.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{formatDateTime(slot.end)}</td>
                              <td className="px-3 py-2.5 text-xs" style={{ color: C.sub }}>{slot.venue}</td>
                              <td className="px-3 py-2.5 text-xs" style={{ color: C.sub }}>{slot.capacity}</td>
                              <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: C.teal }}>{slot.enrolled}</td>
                              <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: C.goldenrod }}>{slot.waitlisted}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>

              <section>
                <h3 className="font-bold text-sm mb-3" style={{ color: C.text }}>Verification, Survey, and Certificates</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <DetailCard icon={ShieldCheck} label="Attendance Verification Rules" value={event.attendanceRules.join(', ')} />
                  <DetailCard icon={FileText} label="Event Requirements" value={event.requirements} />
                  <DetailCard icon={FileText} label="Survey Availability" value={event.surveyStatus} />
                  <DetailCard icon={FileText} label="Certificate Availability" value={event.certificateAvailable ? 'Available' : 'Not Available'} />
                  <DetailCard icon={FileText} label="Certificate Template" value={event.certTemplateStatus} />
                  <DetailCard icon={Users} label="Waitlist Availability" value={event.waitlistAvailable ? 'Available' : 'Not Available'} />
                </div>
              </section>

              {(event.returnComment || event.rejectReason || event.remarksHistory.length > 0) && (
                <section>
                  <h3 className="font-bold text-sm mb-3" style={{ color: C.text }}>Remarks History and Organizer Updates</h3>
                  <div className="space-y-3">
                    {event.returnComment && (
                      <div className="rounded-xl border p-3" style={{ borderColor: `${C.tangerine}40`, backgroundColor: `${C.tangerine}08` }}>
                        <p className="text-xs font-bold mb-1" style={{ color: C.tangerine }}>Return Remarks</p>
                        <p className="text-sm" style={{ color: C.text }}>{event.returnComment}</p>
                      </div>
                    )}
                    {event.rejectReason && (
                      <div className="rounded-xl border p-3" style={{ borderColor: `${C.coral}40`, backgroundColor: `${C.coral}08` }}>
                        <p className="text-xs font-bold mb-1" style={{ color: C.coral }}>Rejection Reason</p>
                        <p className="text-sm" style={{ color: C.text }}>{event.rejectReason}</p>
                      </div>
                    )}
                    {event.remarksHistory.map(item => (
                      <div key={item.id} className="rounded-xl border p-3" style={{ borderColor: C.border }}>
                        <p className="text-xs font-bold" style={{ color: C.text }}>{item.action} - {item.date}</p>
                        <p className="text-xs mt-0.5" style={{ color: C.muted }}>{item.author}</p>
                        <p className="text-sm mt-1" style={{ color: C.sub }}>{item.remarks}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        {canDecide && (
          <div className="border-t bg-white px-5 sm:px-7 py-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end flex-shrink-0" style={{ borderColor: C.border }}>
            <button type="button" onClick={() => setDecision('approve')} className="px-4 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2" style={{ backgroundColor: C.green }}>
              <CheckCircle2 className="w-4 h-4" /> Approve
            </button>
            <button type="button" onClick={() => setDecision('return')} className="px-4 py-3 rounded-xl text-sm font-bold border flex items-center justify-center gap-2" style={{ borderColor: C.goldenrod, color: '#8a6010' }}>
              <RotateCcw className="w-4 h-4" /> Return for Revision
            </button>
            <button type="button" onClick={() => setDecision('reject')} className="px-4 py-3 rounded-xl text-sm font-bold border flex items-center justify-center gap-2" style={{ borderColor: C.coral, color: C.coral }}>
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </div>
        )}
      </div>

      {decision && (
        <DecisionModal
          action={decision}
          event={event}
          onClose={() => setDecision(null)}
          onConfirm={confirmDecision}
        />
      )}
    </div>
  );
}

function EventRow({ event, onSelect }: { event: CmoEvent; onSelect: (event: CmoEvent) => void }) {
  return (
    <tr className="hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => onSelect(event)}>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3 min-w-[260px]">
          <img src={event.coverImage} alt={event.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: C.text }}>{event.title}</p>
            <p className="text-xs truncate mt-0.5" style={{ color: C.muted }}>{event.tagline}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{event.organizer}</td>
      <td className="px-4 py-3.5 text-xs max-w-[160px]"><p className="truncate" style={{ color: C.muted }}>{event.department}</p></td>
      <td className="px-4 py-3.5"><CategoryBadge event={event} /></td>
      <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{event.modality}</td>
      <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.muted }}>{event.dateSubmitted}</td>
      <td className="px-4 py-3.5"><Badge text={event.approvalStatus} style={APPROVAL_STYLE[event.approvalStatus]} /></td>
      <td className="px-4 py-3.5">
        <button type="button" onClick={e => { e.stopPropagation(); onSelect(event); }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors" title="View review details" style={{ color: C.teal }}>
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

export function EventApprovalsTab(props: SharedEventStateProps) {
  const [events, setEvents] = useManagedEvents(props);
  const [selected, setSelected] = useState<CmoEvent | null>(null);
  const [filter, setFilter] = useState('Pending');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return events.filter(event => {
      const matchesFilter = filterMatches(event, filter);
      const haystack = [
        event.title,
        event.organizer,
        event.department,
        event.category,
        event.dateSubmitted,
        event.tagline,
      ].join(' ').toLowerCase();
      return matchesFilter && (!text || haystack.includes(text));
    });
  }, [events, filter, query]);

  const handleDecision = (id: string, action: DecisionAction, remarks?: string) => {
    const statusMap: Record<DecisionAction, ApprovalStatus> = {
      approve: 'Approved',
      return: 'Returned with Comments',
      reject: 'Rejected',
    };

    const actionLabel = action === 'approve' ? 'Approved' : action === 'return' ? 'Returned for Revision' : 'Rejected';

    setEvents(prev => prev.map(event => {
      if (event.id !== id) return event;
      return {
        ...event,
        approvalStatus: statusMap[action],
        dateUpdated: '2026-05-28',
        approvedBy: action === 'approve' ? 'Atty. Rosario Dela Cruz' : event.approvedBy,
        approvalComments: action === 'approve' ? 'Approved for publication after CMO review.' : event.approvalComments,
        returnComment: action === 'return' ? remarks : event.returnComment,
        rejectReason: action === 'reject' ? remarks : event.rejectReason,
        remarksHistory: [
          ...event.remarksHistory,
          {
            id: `rh-${event.id}-${Date.now()}`,
            date: '2026-05-28',
            author: 'CMO',
            action: actionLabel,
            remarks: remarks || 'Approved after review. Organizer will be emailed.',
          },
        ],
      };
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Reviews</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>
          Review submitted event records, check compliance, and send decision emails to organizers.
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-4 space-y-4" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border" style={{ borderColor: C.border, backgroundColor: C.cream }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: C.muted }} />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search title, organizer, department, category, or date"
            className="w-full bg-transparent outline-none text-sm"
            style={{ color: C.text }}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {REVIEW_FILTERS.map(item => (
            <button
              type="button"
              key={item}
              onClick={() => setFilter(item)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{
                backgroundColor: filter === item ? C.maroon : 'transparent',
                color: filter === item ? '#fff' : C.sub,
                borderColor: filter === item ? C.maroon : C.border,
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: C.cream }}>
                {['Event', 'Organizer', 'Department / Office', 'Category', 'Modality', 'Submitted', 'Status', 'Actions'].map(head => (
                  <th key={head} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: C.border }}>
              {filtered.map(event => (
                <EventRow key={event.id} event={event} onSelect={setSelected} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: C.muted }}>
                    No submitted events match the current search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <EventDetailModal
          event={events.find(event => event.id === selected.id) ?? selected}
          onClose={() => setSelected(null)}
          onDecision={handleDecision}
        />
      )}
    </div>
  );
}

function PublishModal({
  event,
  mode,
  onClose,
  onPublish,
}: {
  event: CmoEvent;
  mode: 'now' | 'schedule';
  onClose: () => void;
  onPublish: (event: CmoEvent, publicationDate?: string) => void;
}) {
  const [date, setDate] = useState('');
  const [warning, setWarning] = useState('');

  const confirm = () => {
    if (event.approvalStatus !== 'Approved') {
      setWarning('Event is not approved.');
      return;
    }
    if (!event.title || !event.startDate || !event.endDate || !event.targetAudience) {
      setWarning('Missing required event details.');
      return;
    }
    if (mode === 'schedule') {
      if (!date || new Date(date) <= new Date('2026-05-28T00:00')) {
        setWarning('Publication date is invalid.');
        return;
      }
      onPublish(event, date);
      return;
    }
    onPublish(event);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl border shadow-2xl w-full max-w-lg overflow-hidden" style={{ borderColor: C.border }}>
        <div className="px-5 py-4 border-b flex items-start justify-between gap-4" style={{ borderColor: C.border }}>
          <div>
            <h3 className="font-bold text-base" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
              {mode === 'now' ? 'Publish Event' : 'Schedule Publication'}
            </h3>
            <p className="text-xs mt-1" style={{ color: C.muted }}>Publish this event to eligible participants?</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100" style={{ color: C.muted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-xl border p-4" style={{ borderColor: C.border }}>
            <p className="text-sm font-bold" style={{ color: C.text }}>{event.title}</p>
            <p className="text-xs mt-1" style={{ color: C.muted }}>{event.department} - {event.targetAudience}</p>
          </div>

          {mode === 'schedule' && (
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: C.sub }}>Publication date and time</label>
              <input
                type="datetime-local"
                value={date}
                onChange={event => {
                  setDate(event.target.value);
                  setWarning('');
                }}
                className="w-full px-3.5 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: C.border, color: C.text }}
              />
            </div>
          )}

          {warning && (
            <div className="flex items-center gap-2 rounded-xl p-3 text-xs font-semibold" style={{ backgroundColor: `${C.coral}10`, color: C.coral }}>
              <AlertCircle className="w-4 h-4" />
              {warning}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={onClose} className="py-3 rounded-xl border text-sm font-bold" style={{ borderColor: C.border, color: C.sub }}>Cancel</button>
            <button type="button" onClick={confirm} className="py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: C.maroon }}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PublishedMetricsModal({ event, onClose }: { event: CmoEvent; onClose: () => void }) {
  const attendanceRate = event.registrationCount > 0 ? Math.round((event.checkedIn / event.registrationCount) * 100) : 0;
  const releaseTotal = event.generatedCertificates + event.pendingCertificates + event.notEligibleCertificates;
  const releaseRate = releaseTotal > 0 ? Math.round((event.releasedCertificates / releaseTotal) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl border shadow-2xl w-full max-w-2xl overflow-hidden" style={{ borderColor: C.border }}>
        <div className="px-5 py-4 border-b flex items-start justify-between" style={{ borderColor: C.border }}>
          <div>
            <h3 className="font-bold text-base" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Event Metrics</h3>
            <p className="text-xs mt-1" style={{ color: C.muted }}>{event.title}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100" style={{ color: C.muted }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['Registered', event.registrationCount],
            ['Attendance', event.checkedIn],
            ['Attendance Rate', `${attendanceRate}%`],
            ['Waitlist', event.waitlistCount],
            ['Generated Certificates', event.generatedCertificates],
            ['Pending Certificates', event.pendingCertificates],
            ['Released Certificates', event.releasedCertificates],
            ['Certificate Release Rate', `${releaseRate}%`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border p-4" style={{ borderColor: C.border, backgroundColor: C.cream }}>
              <p className="text-xs font-semibold" style={{ color: C.muted }}>{label}</p>
              <p className="text-xl font-bold mt-1" style={{ color: C.text }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PublishedEventsTab(props: SharedEventStateProps) {
  const [events, setEvents] = useManagedEvents(props);
  const [publishTarget, setPublishTarget] = useState<{ event: CmoEvent; mode: 'now' | 'schedule' } | null>(null);
  const [detailEvent, setDetailEvent] = useState<CmoEvent | null>(null);
  const [metricsEvent, setMetricsEvent] = useState<CmoEvent | null>(null);
  const [success, setSuccess] = useState('');

  const approved = events.filter(event => event.approvalStatus === 'Approved');
  const published = events.filter(event => event.approvalStatus === 'Published');

  const publish = (event: CmoEvent, publicationDate?: string) => {
    setEvents(prev => prev.map(item => {
      if (item.id !== event.id) return item;
      return {
        ...item,
        approvalStatus: 'Published',
        publishedAt: publicationDate ?? '2026-05-28T10:00',
        dateUpdated: '2026-05-28',
        remarksHistory: [
          ...item.remarksHistory,
          {
            id: `rh-${item.id}-publish-${Date.now()}`,
            date: '2026-05-28',
            author: 'CMO',
            action: publicationDate ? 'Publication Scheduled' : 'Published',
            remarks: publicationDate ? `Publication scheduled for ${publicationDate}. Organizer will be emailed.` : 'Event is now visible to eligible participants.',
          },
        ],
      };
    }));
    setPublishTarget(null);
    setSuccess('Event is now visible to eligible participants.');
  };

  const unpublish = (event: CmoEvent) => {
    setEvents(prev => prev.map(item => item.id === event.id ? {
      ...item,
      approvalStatus: 'Approved',
      publishedAt: undefined,
      dateUpdated: '2026-05-28',
    } : item));
    setSuccess('Event unpublished. Organizer will be emailed.');
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Published Events</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Publish approved events and review records already visible to eligible participants.</p>
      </div>

      {success && (
        <div className="rounded-2xl border p-4 flex items-start gap-3" style={{ borderColor: `${C.green}30`, backgroundColor: `${C.green}08` }}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: C.green }} />
          <div>
            <p className="text-sm font-bold" style={{ color: C.text }}>{success}</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Organizer confirmation is handled by email update.</p>
          </div>
        </div>
      )}

      <section>
        <h3 className="font-bold text-sm mb-4" style={{ color: C.text }}>Approved but Unpublished Events</h3>
        {approved.length === 0 ? (
          <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: C.border }}>
            <p className="text-sm font-semibold" style={{ color: C.text }}>No approved events are waiting for publication.</p>
            <p className="text-xs mt-1" style={{ color: C.muted }}>Approved events from Reviews will appear here.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {approved.map(event => (
              <div key={event.id} className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: C.border }}>
                <img src={event.coverImage} alt={event.title} className="w-full h-36 object-cover" />
                <div className="p-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <CategoryBadge event={event} />
                    <Badge text={event.approvalStatus} style={APPROVAL_STYLE[event.approvalStatus]} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: C.text }}>{event.title}</h3>
                    <p className="text-xs mt-1" style={{ color: C.muted }}>{formatDateTime(event.startDate)}</p>
                    <p className="text-xs mt-1" style={{ color: C.muted }}>{event.organizer} - {event.targetAudience}</p>
                    <p className="text-xs mt-1" style={{ color: C.muted }}>{event.modality}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setPublishTarget({ event, mode: 'now' })} className="py-2.5 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: C.maroon }}>
                      Publish Now
                    </button>
                    <button type="button" onClick={() => setPublishTarget({ event, mode: 'schedule' })} className="py-2.5 rounded-xl text-xs font-bold border" style={{ borderColor: C.goldenrod, color: '#8a6010' }}>
                      Schedule Publication
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-bold text-sm mb-4" style={{ color: C.text }}>Already Published Events</h3>
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: C.cream }}>
                  {['Event', 'Category', 'Department / Office', 'Modality', 'Start Date', 'Registered', 'Attendance', 'Actions'].map(head => (
                    <th key={head} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: C.border }}>
                {published.map(event => (
                  <tr key={event.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3.5 min-w-[240px]">
                      <p className="font-semibold text-sm" style={{ color: C.text }}>{event.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>{event.organizer}</p>
                    </td>
                    <td className="px-4 py-3.5"><CategoryBadge event={event} /></td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: C.muted }}>{event.department}</td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: C.sub }}>{event.modality}</td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.muted }}>{formatDateTime(event.startDate)}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold" style={{ color: C.sub }}>{event.registrationCount}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold" style={{ color: C.green }}>{event.checkedIn}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => setDetailEvent(event)} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border" style={{ borderColor: C.border, color: C.teal }}>View Details</button>
                        <button type="button" onClick={() => setMetricsEvent(event)} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border" style={{ borderColor: C.border, color: C.maroon }}>View Metrics</button>
                        <button type="button" onClick={() => unpublish(event)} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border" style={{ borderColor: `${C.coral}40`, color: C.coral }}>Unpublish</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {published.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm" style={{ color: C.muted }}>No published events yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {publishTarget && (
        <PublishModal
          event={publishTarget.event}
          mode={publishTarget.mode}
          onClose={() => setPublishTarget(null)}
          onPublish={publish}
        />
      )}
      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          onDecision={() => undefined}
        />
      )}
      {metricsEvent && <PublishedMetricsModal event={metricsEvent} onClose={() => setMetricsEvent(null)} />}
    </div>
  );
}
