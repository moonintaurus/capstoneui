import { useState } from 'react';
import { Eye, CheckCircle2, XCircle, MessageSquare, X, ChevronRight, Calendar, MapPin, Users, FileText, Globe, Clock } from 'lucide-react';
import { C, MOCK_CMO_EVENTS, APPROVAL_STYLE, CERT_STYLE } from './data';
import type { CmoEvent, ApprovalStatus } from './data';

function Badge({ text, style }: { text: string; style: { bg: string; color: string } }) {
  return <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.color }}>{text}</span>;
}

/* ── Detail drawer ── */
function EventDetailModal({ event, onClose, onDecision }: {
  event: CmoEvent;
  onClose: () => void;
  onDecision: (id: string, action: 'approve' | 'reject' | 'return', comment?: string) => void;
}) {
  const [decision, setDecision] = useState<'approve' | 'reject' | 'return' | null>(null);
  const [comment, setComment] = useState('');
  const [done, setDone] = useState(false);

  const submit = () => {
    onDecision(event.id, decision!, comment);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="ml-auto h-full w-full max-w-2xl bg-white flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between px-7 py-5 border-b flex-shrink-0" style={{ borderColor: C.border }}>
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>Event Review</p>
            <h2 className="font-bold text-base leading-snug" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>{event.title}</h2>
            <p className="text-xs mt-1" style={{ color: C.muted }}>{event.tagline}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100 flex-shrink-0" style={{ color: C.muted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-5 space-y-6">
          {/* Status + meta */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge text={event.approvalStatus} style={APPROVAL_STYLE[event.approvalStatus]} />
            <Badge text={event.type} style={{ bg: C.slate + '18', color: C.slate }} />
            <Badge text={event.modality} style={{ bg: C.teal + '15', color: C.teal }} />
            <Badge text={event.category} style={{ bg: C.goldenrod + '20', color: '#7a5800' }} />
          </div>

          {/* Key info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Users, label: 'Organizer', val: event.organizer },
              { icon: FileText, label: 'Department / Office', val: event.department },
              { icon: Calendar, label: 'Start', val: event.startDate.replace('T', ' ') },
              { icon: Calendar, label: 'End', val: event.endDate.replace('T', ' ') },
              { icon: MapPin, label: 'Venue / Platform', val: event.venue },
              { icon: Users, label: 'Capacity', val: `${event.capacity} participants` },
              { icon: Globe, label: 'Exclusivity', val: event.exclusivity },
              { icon: Clock, label: 'Date Submitted', val: event.dateSubmitted },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="flex items-start gap-2.5 p-3 rounded-xl" style={{ backgroundColor: C.cream }}>
                <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: C.maroon }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: C.muted }}>{label}</p>
                  <p className="text-sm" style={{ color: C.text }}>{val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-bold mb-2" style={{ color: C.muted }}>Description</p>
            <p className="text-sm leading-relaxed" style={{ color: C.sub }}>{event.description}</p>
          </div>

          {/* Requirements */}
          {event.requirements && (
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: C.muted }}>Requirements</p>
              <p className="text-sm leading-relaxed" style={{ color: C.sub }}>{event.requirements}</p>
            </div>
          )}

          {/* Certificate template */}
          <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: C.border }}>
            <div>
              <p className="text-xs font-bold" style={{ color: C.muted }}>Certificate Template</p>
              <Badge text={event.certTemplateStatus} style={CERT_STYLE[event.certTemplateStatus]} />
            </div>
          </div>

          {/* Slots (schedule-based) */}
          {event.slots && event.slots.length > 0 && (
            <div>
              <p className="text-xs font-bold mb-3" style={{ color: C.muted }}>Time Slots</p>
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: C.cream }}>
                      {['Slot', 'Start', 'End', 'Venue', 'Capacity', 'Occupancy'].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: C.border }}>
                    {event.slots.map(sl => (
                      <tr key={sl.id}>
                        <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: C.text }}>{sl.label}</td>
                        <td className="px-3 py-2.5 text-xs" style={{ color: C.sub }}>{sl.start.replace('T', ' ')}</td>
                        <td className="px-3 py-2.5 text-xs" style={{ color: C.sub }}>{sl.end.replace('T', ' ')}</td>
                        <td className="px-3 py-2.5 text-xs" style={{ color: C.sub }}>{sl.venue}</td>
                        <td className="px-3 py-2.5 text-xs" style={{ color: C.sub }}>{sl.capacity}</td>
                        <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: sl.enrolled >= sl.capacity ? C.coral : C.teal }}>
                          {sl.enrolled}/{sl.capacity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Existing return comment */}
          {event.returnComment && (
            <div className="rounded-xl border p-4" style={{ borderColor: '#EA694840', backgroundColor: '#EA694808' }}>
              <p className="text-xs font-bold mb-1" style={{ color: '#C05020' }}>Previous Return Comment</p>
              <p className="text-sm leading-relaxed" style={{ color: C.text }}>{event.returnComment}</p>
            </div>
          )}

          {/* Decision panel */}
          {!done && !['Published', 'Rejected'].includes(event.approvalStatus) && (
            <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: C.border, backgroundColor: C.cream }}>
              <p className="text-xs font-bold" style={{ color: C.sub }}>CMO Decision</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: 'approve', label: 'Approve', color: '#27AE60' },
                  { key: 'reject',  label: 'Reject',  color: C.coral },
                  { key: 'return',  label: 'Return with Comments', color: '#EA6948' },
                ] as const).map(({ key, label, color }) => (
                  <button key={key} onClick={() => setDecision(key)}
                    className="py-2.5 px-3 rounded-xl border text-xs font-bold transition-all"
                    style={{ borderColor: decision === key ? color : C.border, backgroundColor: decision === key ? color + '15' : '#fff', color: decision === key ? color : C.sub }}>
                    {label}
                  </button>
                ))}
              </div>
              {(decision === 'reject' || decision === 'return') && (
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: C.sub }}>
                    {decision === 'reject' ? 'Rejection Reason' : 'Comments / Required Revisions'}
                    <span style={{ color: C.coral }}> *</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={3}
                    placeholder={decision === 'reject' ? 'State the reason for rejection…' : 'Describe the required changes or concerns…'}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none resize-none"
                    style={{ borderColor: C.border, backgroundColor: '#fff', color: C.text }}
                  />
                </div>
              )}
              {decision === 'approve' && (
                <div className="rounded-xl border p-3" style={{ borderColor: '#27AE6030', backgroundColor: '#27AE6008' }}>
                  <p className="text-xs" style={{ color: '#1a8a44' }}>Approved events will be published on the SIGLA website and become visible to participants.</p>
                </div>
              )}
              {decision && (
                <button
                  onClick={submit}
                  disabled={!!((decision === 'reject' || decision === 'return') && !comment.trim())}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
                  {decision === 'approve' ? 'Approve Event' : decision === 'reject' ? 'Reject Event' : 'Return to Organizer'}
                </button>
              )}
            </div>
          )}

          {done && (
            <div className="rounded-2xl border p-6 text-center" style={{ borderColor: '#27AE6030', backgroundColor: '#27AE6008' }}>
              <CheckCircle2 className="w-8 h-8 mx-auto mb-3" style={{ color: '#27AE60' }} />
              <p className="text-sm font-bold" style={{ color: C.text }}>Decision recorded successfully.</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>The organizer will be notified via email.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main tab ── */
export function EventApprovalsTab() {
  const [events, setEvents] = useState(MOCK_CMO_EVENTS);
  const [selected, setSelected] = useState<CmoEvent | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const handleDecision = (id: string, action: 'approve' | 'reject' | 'return', comment?: string) => {
    const map: Record<string, ApprovalStatus> = { approve: 'Approved', reject: 'Rejected', return: 'Returned with Comments' };
    setEvents(prev => prev.map(e => e.id === id ? {
      ...e,
      approvalStatus: map[action],
      ...(action === 'return' ? { returnComment: comment } : {}),
      ...(action === 'reject' ? { rejectReason: comment } : {}),
    } : e));
  };

  const statuses = ['All', 'Submitted', 'Pending Review', 'Approved', 'Rejected', 'Returned with Comments', 'Published'];
  const filtered = filterStatus === 'All' ? events : events.filter(e => e.approvalStatus === filterStatus);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Event Approvals</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Review, approve, reject, or return submitted events.</p>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={{ backgroundColor: filterStatus === s ? C.maroon : 'transparent', color: filterStatus === s ? '#fff' : C.sub, borderColor: filterStatus === s ? C.maroon : C.border }}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: C.cream }}>
                {['Event Title', 'Organizer', 'Dept. / Office', 'Type', 'Modality', 'Submitted', 'Schedule', 'Venue', 'Capacity', 'Cert Template', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(ev => {
                const as_ = APPROVAL_STYLE[ev.approvalStatus];
                const cs = CERT_STYLE[ev.certTemplateStatus];
                return (
                  <tr key={ev.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3.5 max-w-[180px]">
                      <p className="font-semibold text-sm truncate" style={{ color: C.text }}>{ev.title}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: C.muted }}>{ev.category}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{ev.organizer}</td>
                    <td className="px-4 py-3.5 text-xs max-w-[140px]"><p className="truncate" style={{ color: C.muted }}>{ev.department}</p></td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{ev.type}</td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{ev.modality}</td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.muted }}>{ev.dateSubmitted}</td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: C.sub }}>{ev.startDate.slice(0, 10)}</td>
                    <td className="px-4 py-3.5 text-xs max-w-[120px]"><p className="truncate" style={{ color: C.muted }}>{ev.venue}</p></td>
                    <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: C.sub }}>{ev.capacity}</td>
                    <td className="px-4 py-3.5"><Badge text={ev.certTemplateStatus} style={cs} /></td>
                    <td className="px-4 py-3.5"><Badge text={ev.approvalStatus} style={as_} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(ev)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors" title="View & Decide" style={{ color: C.teal }}>
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={12} className="px-4 py-10 text-center text-sm" style={{ color: C.muted }}>No events match the selected filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <EventDetailModal
          event={selected}
          onClose={() => setSelected(null)}
          onDecision={(id, action, comment) => { handleDecision(id, action, comment); }}
        />
      )}
    </div>
  );
}
