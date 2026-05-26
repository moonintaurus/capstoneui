import { useState } from 'react';
import { Plus, Edit2, Eye, MessageSquare, RefreshCw, Trash2, ChevronDown } from 'lucide-react';
import { C, MOCK_EVENTS, APPROVAL_STATUS_STYLE } from './data';
import type { OrgEvent } from './data';
import { CreateEventWizard } from './CreateEventWizard';
import { OrganizerEventDetail } from './OrganizerEventDetail';

function StatusBadge({ status }: { status: string }) {
  const style = APPROVAL_STATUS_STYLE[status as keyof typeof APPROVAL_STATUS_STYLE] ?? { bg: '#9a7a5a18', color: '#9a7a5a' };
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.color }}>
      {status}
    </span>
  );
}

function CertBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    'Not Uploaded': { bg: '#9a7a5a12', color: '#9a7a5a' },
    'Uploaded':     { bg: '#00598D18', color: '#00598D' },
    'Validated':    { bg: '#27AE6018', color: '#1a8a44' },
  };
  const s = colors[status] ?? colors['Not Uploaded'];
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function CommentModal({ event, onClose }: { event: OrgEvent; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 border" style={{ borderColor: C.border }}>
        <h3 className="font-bold text-base mb-1" style={{ color: C.text }}>CMO Review Comments</h3>
        <p className="text-xs mb-4" style={{ color: C.muted }}>{event.title}</p>
        <div className="rounded-xl border p-4" style={{ borderColor: C.tangerine + '40', backgroundColor: C.tangerine + '08' }}>
          <p className="text-sm leading-relaxed" style={{ color: C.text }}>{event.approvalComment}</p>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border text-sm font-semibold" style={{ borderColor: C.border, color: C.sub }}>Close</button>
          <button className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
            Resubmit Event
          </button>
        </div>
      </div>
    </div>
  );
}

export function MyEventsTab() {
  const [events, setEvents] = useState<OrgEvent[]>(MOCK_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<OrgEvent | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [commentEvent, setCommentEvent] = useState<OrgEvent | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const statuses = ['All', 'Draft', 'Submitted', 'Returned with Comments', 'Approved', 'Rejected', 'Published'];
  const filtered = filterStatus === 'All' ? events : events.filter(e => e.approvalStatus === filterStatus);

  if (selectedEvent) {
    return <OrganizerEventDetail event={selectedEvent} onBack={() => setSelectedEvent(null)} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>My Events</h2>
          <p className="text-sm mt-1" style={{ color: C.muted }}>Manage all events you have created.</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
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
                {['Event Title', 'Type', 'Modality', 'Date', 'Registered', 'Waitlist', 'Approval Status', 'Cert Template', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: C.border }}>
              {filtered.map(ev => (
                <tr key={ev.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-sm truncate max-w-[200px]" style={{ color: C.text }}>{ev.title}</p>
                    <p className="text-xs mt-0.5 truncate max-w-[200px]" style={{ color: C.muted }}>{ev.category}</p>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs" style={{ color: C.sub }}>{ev.type}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs" style={{ color: C.sub }}>{ev.modality}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs" style={{ color: C.sub }}>{ev.date}</td>
                  <td className="px-4 py-3.5 text-center text-xs font-semibold" style={{ color: C.text }}>{ev.registrationCount}</td>
                  <td className="px-4 py-3.5 text-center text-xs font-semibold" style={{ color: ev.waitlistCount > 0 ? C.tangerine : C.muted }}>{ev.waitlistCount}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={ev.approvalStatus} /></td>
                  <td className="px-4 py-3.5"><CertBadge status={ev.certTemplateStatus} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedEvent(ev)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-stone-100" title="View" style={{ color: C.teal }}>
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-stone-100" title="Edit" style={{ color: C.sub }}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {ev.approvalStatus === 'Returned with Comments' && (
                        <button onClick={() => setCommentEvent(ev)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-orange-50" title="View Comments" style={{ color: C.tangerine }}>
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <CreateEventWizard
          onClose={() => setShowCreate(false)}
          onCreated={e => {
            setEvents(prev => [...prev, { ...e, id: Date.now().toString(), registrationCount: 0, waitlistCount: 0, description: e.description ?? '', certTemplateStatus: e.certTemplateStatus ?? 'Not Uploaded', approvalStatus: e.approvalStatus ?? 'Draft', type: e.type ?? 'Regular', modality: e.modality ?? 'Onsite', date: e.date ?? '', endDate: e.endDate ?? '', location: e.location ?? '', maxParticipants: e.maxParticipants ?? 50, title: e.title ?? '', tagline: e.tagline ?? '', category: e.category ?? '' } as OrgEvent]);
            setShowCreate(false);
          }}
        />
      )}
      {commentEvent && <CommentModal event={commentEvent} onClose={() => setCommentEvent(null)} />}
    </div>
  );
}
