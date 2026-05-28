import { useState } from 'react';
import { Plus, Edit2, Eye, MessageSquare } from 'lucide-react';
import { C, MOCK_EVENTS, APPROVAL_STATUS_STYLE, canVerifyCsvForEvent, needsCsvVerification, getCategoryColor } from './data';
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

function CsvBadge({ event }: { event: OrgEvent }) {
  if (!canVerifyCsvForEvent(event)) {
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: '#9a7a5a12', color: '#9a7a5a' }}>
        Not Required
      </span>
    );
  }

  const colors: Record<string, { bg: string; color: string }> = {
    'Not Uploaded': { bg: '#EA694818', color: '#C05020' },
    Uploaded: { bg: '#00598D18', color: '#00598D' },
    Verified: { bg: '#27AE6018', color: '#1a8a44' },
  };
  const s = colors[event.csvVerificationStatus] ?? colors['Not Uploaded'];
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: s.bg, color: s.color }}>
      {event.csvVerificationStatus}
    </span>
  );
}

function CommentModal({ event, onClose, onResubmit }: { event: OrgEvent; onClose: () => void; onResubmit: () => void }) {
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
          <button onClick={onResubmit} className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
            Resubmit Event
          </button>
        </div>
      </div>
    </div>
  );
}

function EditEventModal({ event, onClose, onSave }: { event: OrgEvent; onClose: () => void; onSave: (updated: OrgEvent) => void }) {
  const [title, setTitle] = useState(event.title);
  const [modality, setModality] = useState<OrgEvent['modality']>(event.modality);
  const [date, setDate] = useState(event.date);
  const [endDate, setEndDate] = useState(event.endDate);
  const [location, setLocation] = useState(event.location);
  const [maxParticipants, setMaxParticipants] = useState(String(event.maxParticipants));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 border" style={{ borderColor: C.border }}>
        <h3 className="font-bold text-base mb-1" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Edit Event</h3>
        <p className="text-xs mb-4" style={{ color: C.muted }}>{event.approvalStatus === 'Submitted' ? 'Submitted events cannot be edited.' : 'Update event details for participants and email updates.'}</p>
        <div className="space-y-3">
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: C.border, color: C.text }} />
          <select value={modality} onChange={e => setModality(e.target.value as OrgEvent['modality'])} className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: C.border, color: C.text }}>
            <option>Onsite</option>
            <option>Online</option>
            <option>Hybrid</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: C.border, color: C.text }} />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: C.border, color: C.text }} />
          </div>
          <input value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: C.border, color: C.text }} />
          <input type="number" value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: C.border, color: C.text }} />
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border text-sm font-semibold" style={{ borderColor: C.border, color: C.sub }}>Cancel</button>
          <button
            onClick={() => onSave({ ...event, title, modality, date, endDate, location, maxParticipants: Number(maxParticipants) || event.maxParticipants, csvVerificationStatus: modality === 'Onsite' ? 'Not Required' : event.csvVerificationStatus === 'Not Required' ? 'Not Uploaded' : event.csvVerificationStatus })}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

type EventListMode = 'all' | 'csv-verification' | 'participants' | 'certificates' | 'attendance' | 'waitlist';

const LIST_MODE_COPY: Record<EventListMode, { title: string; description: string; defaultTab: 'registrants' | 'waitlist' | 'attendance' | 'certificates' | 'csv-uploads' }> = {
  all: { title: 'My Events', description: 'Manage all events you have created.', defaultTab: 'registrants' },
  'csv-verification': { title: 'Completed Events Needing CSV Verification', description: 'Select a completed online or hybrid event before uploading its CSV attendance log.', defaultTab: 'csv-uploads' },
  participants: { title: 'Select Event to Review Participants', description: 'Choose a specific event before reviewing participant records.', defaultTab: 'registrants' },
  certificates: { title: 'Select Event to Release Certificates', description: 'Choose a specific event before generating or releasing certificates.', defaultTab: 'certificates' },
  attendance: { title: 'Select Event to Review Attendance', description: 'Choose a specific event before reviewing attendance records.', defaultTab: 'attendance' },
  waitlist: { title: 'Select Event to Manage Waitlist', description: 'Choose a specific event before reviewing waitlisted participants.', defaultTab: 'waitlist' },
};

export function MyEventsTab({ listMode = 'all' }: { listMode?: EventListMode }) {
  const [events, setEvents] = useState<OrgEvent[]>(MOCK_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<OrgEvent | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [commentEvent, setCommentEvent] = useState<OrgEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<OrgEvent | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [feedback, setFeedback] = useState('');

  const statuses = ['All', 'Draft', 'Submitted', 'Returned with Comments', 'Approved', 'Rejected', 'Published'];
  const filtered = listMode === 'csv-verification'
    ? events.filter(e => needsCsvVerification(e))
    : filterStatus === 'All' ? events : events.filter(e => e.approvalStatus === filterStatus);
  const copy = LIST_MODE_COPY[listMode];

  if (selectedEvent) {
    return (
      <OrganizerEventDetail
        event={selectedEvent}
        onBack={() => setSelectedEvent(null)}
        defaultTab={copy.defaultTab}
        onCsvVerified={(eventId, fileName) => {
          const uploadedAt = new Date().toLocaleString('en-PH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });
          setEvents(prev => prev.map(ev => ev.id === eventId
            ? { ...ev, csvVerificationStatus: 'Verified', csvLastUploadedFile: fileName, csvUploadedAt: uploadedAt }
            : ev));
          setSelectedEvent(prev => prev && prev.id === eventId
            ? { ...prev, csvVerificationStatus: 'Verified', csvLastUploadedFile: fileName, csvUploadedAt: uploadedAt }
            : prev);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
            {copy.title}
          </h2>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            {copy.description}
          </p>
        </div>
        {listMode === 'all' && (
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
            <Plus className="w-4 h-4" /> Create Event
          </button>
        )}
      </div>

      {/* Filter chips */}
      {feedback && (
        <div className="mb-4 rounded-xl border px-4 py-3 text-sm font-semibold" style={{ borderColor: '#27AE6040', backgroundColor: '#27AE6008', color: '#1a8a44' }}>
          {feedback}
        </div>
      )}

      {listMode === 'all' && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{ backgroundColor: filterStatus === s ? C.maroon : 'transparent', color: filterStatus === s ? '#fff' : C.sub, borderColor: filterStatus === s ? C.maroon : C.border }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: C.cream }}>
                {['Event Title', 'Modality', 'Date', 'Registered', 'Waitlist', 'Approval Status', 'Cert Template', 'CSV Verification', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: C.border }}>
              {filtered.map(ev => {
                const categoryColor = getCategoryColor(ev.category);
                return (
                <tr key={ev.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-sm truncate max-w-[200px]" style={{ color: C.text }}>{ev.title}</p>
                    <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: categoryColor + '18', color: categoryColor }}>{ev.category}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs" style={{ color: C.sub }}>{ev.modality}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs" style={{ color: C.sub }}>{ev.date}</td>
                  <td className="px-4 py-3.5 text-center text-xs font-semibold" style={{ color: C.text }}>{ev.registrationCount}</td>
                  <td className="px-4 py-3.5 text-center text-xs font-semibold" style={{ color: ev.waitlistCount > 0 ? C.tangerine : C.muted }}>{ev.waitlistCount}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={ev.approvalStatus} /></td>
                  <td className="px-4 py-3.5"><CertBadge status={ev.certTemplateStatus} /></td>
                  <td className="px-4 py-3.5"><CsvBadge event={ev} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedEvent(ev)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-stone-100" title="View" style={{ color: C.teal }}>
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {ev.approvalStatus !== 'Submitted' && (
                        <button onClick={() => setEditingEvent(ev)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-stone-100" title="Edit" style={{ color: C.sub }}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {ev.approvalStatus === 'Returned with Comments' && (
                        <button onClick={() => setCommentEvent(ev)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-orange-50" title="View Comments" style={{ color: C.tangerine }}>
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm" style={{ color: C.muted }}>
                    No events match this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <CreateEventWizard
          onClose={() => setShowCreate(false)}
          onCreated={e => {
            setEvents(prev => [...prev, { ...e, id: Date.now().toString(), registrationCount: 0, waitlistCount: 0, description: e.description ?? '', certTemplateStatus: e.certTemplateStatus ?? 'Not Uploaded', csvVerificationStatus: e.csvVerificationStatus ?? 'Not Uploaded', approvalStatus: e.approvalStatus ?? 'Draft', type: e.type ?? 'Regular', modality: e.modality ?? 'Onsite', date: e.date ?? '', endDate: e.endDate ?? '', location: e.location ?? '', maxParticipants: e.maxParticipants ?? 50, title: e.title ?? '', tagline: e.tagline ?? '', category: e.category ?? '' } as OrgEvent]);
            setShowCreate(false);
          }}
        />
      )}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={updated => {
            setEvents(prev => prev.map(ev => ev.id === updated.id ? updated : ev));
            setFeedback(`${updated.title} was updated.`);
            setEditingEvent(null);
          }}
        />
      )}
      {commentEvent && (
        <CommentModal
          event={commentEvent}
          onClose={() => setCommentEvent(null)}
          onResubmit={() => {
            setEvents(prev => prev.map(ev => ev.id === commentEvent.id ? { ...ev, approvalStatus: 'Submitted' } : ev));
            setFeedback(`${commentEvent.title} was resubmitted to CMO.`);
            setCommentEvent(null);
          }}
        />
      )}
    </div>
  );
}
