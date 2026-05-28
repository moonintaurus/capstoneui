import { useState } from 'react';
import {
  Calendar, MapPin, Globe, Clock, Award, Fingerprint,
  X, ClipboardList, Check, AlertCircle, Download, Info
} from 'lucide-react';
import type { Event, CertificateStatus } from './data';
import { C, CATEGORY_COLORS, MY_UPCOMING, MY_ONGOING, MY_ATTENDED, CERTIFICATE_RECORDS } from './data';

const SUB_TABS = ['Upcoming', 'Ongoing', 'Attended', 'Certificates'] as const;
type SubTab = typeof SUB_TABS[number];

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    'Registered': { bg: C.green + '15', color: C.green },
    'Waitlisted': { bg: C.goldenrod + '15', color: C.goldenrod },
    'Cancelled': { bg: C.coral + '15', color: C.coral },
    'Full': { bg: C.coral + '15', color: C.coral },
    'Closed': { bg: '#eee', color: '#888' },
  };
  const s = map[status] ?? { bg: '#eee', color: '#888' };
  return <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ bg: s.bg, backgroundColor: s.bg, color: s.color }}>{status}</span>;
}

function CertBadge({ status }: { status: CertificateStatus }) {
  const map: Record<CertificateStatus, { bg: string; color: string; icon: React.ElementType }> = {
    'Released': { bg: C.green + '15', color: C.green, icon: Check },
    'Pending Verification': { bg: C.goldenrod + '15', color: C.goldenrod, icon: Clock },
    'Survey Required': { bg: C.coral + '15', color: C.coral, icon: ClipboardList },
    'Template Missing': { bg: '#eee', color: '#777', icon: AlertCircle },
    'Attendance Not Verified': { bg: C.coral + '12', color: C.coral, icon: AlertCircle },
    'Verified Attended': { bg: C.teal + '15', color: C.teal, icon: Check },
    'Generating Certificate': { bg: C.indigo + '12', color: C.indigo, icon: Clock },
    'Not Eligible': { bg: '#eee', color: '#888', icon: X },
    'Not Available': { bg: '#eee', color: '#aaa', icon: Info },
  };
  const s = map[status];
  const Icon = s.icon;
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.color }}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

function UpcomingCard({ event, onCancel }: { event: Event; onCancel: (id: string) => void }) {
  const catColor = CATEGORY_COLORS[event.category] ?? C.teal;
  const venue = event.modality === 'Online' ? event.platform : event.location;

  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
      <div className="h-1.5" style={{ backgroundColor: event.accentColor }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: catColor + '18', color: catColor }}>{event.category}</span>
              <StatusChip status={event.registrationStatus} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: C.text }}>{event.title}</h3>
          </div>
          {event.hasCertificate && <Award className="w-4 h-4 flex-shrink-0" style={{ color: C.goldenrod }} fill={C.goldenrod} />}
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs" style={{ color: C.sub }}>
            <Calendar className="w-3.5 h-3.5" />
            <span>{event.startDate}</span>
          </div>
          {venue && (
            <div className="flex items-center gap-2 text-xs" style={{ color: C.sub }}>
              {event.modality === 'Online' ? <Globe className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
              <span className="truncate">{venue}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
          <span className="text-xs" style={{ color: C.muted }}>
            {event.modality} · {event.eventType}
          </span>
          <button
            onClick={() => onCancel(event.id)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
            style={{ borderColor: C.coral + '40', color: C.coral }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = C.coral + '10'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function OngoingCard({ event, onCheckIn }: { event: Event; onCheckIn: (e: Event) => void }) {
  const isOnline = event.modality === 'Online';
  const catColor = CATEGORY_COLORS[event.category] ?? C.teal;

  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: event.accentColor + '40', boxShadow: `0 0 0 2px ${event.accentColor}20` }}>
      <div className="h-2 animate-pulse" style={{ backgroundColor: event.accentColor }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: catColor + '18', color: catColor }}>{event.category}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold animate-pulse" style={{ backgroundColor: C.green + '20', color: C.green }}>● Ongoing</span>
            </div>
            <h3 className="text-sm font-bold" style={{ color: C.text }}>{event.title}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs mb-5" style={{ color: C.sub }}>
          <Clock className="w-3.5 h-3.5" />
          <span>{event.startDate} → {event.endDate}</span>
        </div>

        <button
          onClick={() => onCheckIn(event)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)`, boxShadow: `0 6px 18px ${C.maroon}35` }}
        >
          <Fingerprint className="w-5 h-5" />
          {isOnline ? 'Verify Face to Unlock Meeting Link' : 'Start GPS + Face Check-In'}
        </button>
      </div>
    </div>
  );
}

function AttendedCard({ event, surveyDone }: { event: Event & { surveyDone: boolean }; }) {
  const [survey, setSurvey] = useState(surveyDone);
  const catColor = CATEGORY_COLORS[event.category] ?? C.teal;

  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
      <div className="h-1.5 opacity-50" style={{ backgroundColor: event.accentColor }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: catColor + '18', color: catColor }}>{event.category}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: C.teal + '15', color: C.teal }}>Attended</span>
            </div>
            <h3 className="text-sm font-bold" style={{ color: C.text }}>{event.title}</h3>
          </div>
          {event.hasCertificate && <Award className="w-4 h-4 flex-shrink-0 opacity-60" style={{ color: C.goldenrod }} />}
        </div>

        <div className="flex items-center gap-2 text-xs mb-4" style={{ color: C.sub }}>
          <Calendar className="w-3.5 h-3.5" />
          <span>{event.startDate}</span>
        </div>

        {survey ? (
          <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl" style={{ backgroundColor: C.green + '10' }}>
            <Check className="w-4 h-4" style={{ color: C.green }} />
            <span className="text-xs font-semibold" style={{ color: C.green }}>Feedback submitted</span>
          </div>
        ) : (
          <button
            onClick={() => setSurvey(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border transition-all"
            style={{ borderColor: C.maroon, color: C.maroon }}
          >
            <ClipboardList className="w-4 h-4" />
            Fill Out Feedback Survey
          </button>
        )}
      </div>
    </div>
  );
}

function CertCard({ record }: { record: typeof CERTIFICATE_RECORDS[number] }) {
  const accentColor = CATEGORY_COLORS[record.category] ?? C.teal;
  const isReleased = record.status === 'Released';
  const isPending = record.status === 'Pending Verification';
  const isSurveyRequired = record.status === 'Survey Required';

  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
      <div className="h-1.5" style={{ backgroundColor: record.accentColor }} />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: record.accentColor + '15' }}>
            <Award className="w-5 h-5" style={{ color: record.accentColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold truncate" style={{ color: C.text }}>{record.eventTitle}</h3>
            <p className="text-xs truncate mt-0.5" style={{ color: C.muted }}>{record.organizer}</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>{record.eventDate}</p>
          </div>
        </div>

        <div className="mb-4">
          <CertBadge status={record.status} />
        </div>

        {isPending && (
          <div className="p-3 rounded-xl text-xs leading-relaxed" style={{ backgroundColor: C.goldenrod + '10', color: C.sub }}>
            You will be notified through email when your certificate has been released.
          </div>
        )}
        {isSurveyRequired && (
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border"
            style={{ borderColor: C.coral, color: C.coral }}>
            <ClipboardList className="w-4 h-4" /> Complete Feedback Survey
          </button>
        )}
        {isReleased && (
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${C.goldenrod} 0%, ${C.mutedGold} 100%)` }}>
            <Download className="w-4 h-4" /> Download Certificate
          </button>
        )}
      </div>
    </div>
  );
}

export function MyEventsTab({ onCheckIn }: { onCheckIn: (event: Event) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('Upcoming');
  const [cancelledIds, setCancelledIds] = useState<Set<string>>(new Set());

  const visibleUpcoming = MY_UPCOMING.filter(e => !cancelledIds.has(e.id));

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl mb-8 self-start"
        style={{ backgroundColor: 'rgba(128,0,0,0.06)', display: 'inline-flex' }}>
        {SUB_TABS.map(t => (
          <button
            key={t}
            onClick={() => setActiveSubTab(t)}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              backgroundColor: activeSubTab === t ? C.maroon : 'transparent',
              color: activeSubTab === t ? '#fff' : C.sub,
            }}
          >
            {t}
            {t === 'Certificates' && <span className="ml-1.5 text-xs">{CERTIFICATE_RECORDS.length}</span>}
          </button>
        ))}
      </div>

      {/* ── Upcoming ── */}
      {activeSubTab === 'Upcoming' && (
        <div>
          {visibleUpcoming.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: C.border }}>
              <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: C.muted }} />
              <p className="text-sm font-semibold" style={{ color: C.text }}>No upcoming events</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Events you register for will appear here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleUpcoming.map(e => (
                <UpcomingCard key={e.id} event={e} onCancel={id => setCancelledIds(s => new Set([...s, id]))} />
              ))}
            </div>
          )}
          <p className="text-xs mt-4" style={{ color: C.muted }}>
            Cancel Registration is only available if the event is more than 1 day away.
          </p>
        </div>
      )}

      {/* ── Ongoing ── */}
      {activeSubTab === 'Ongoing' && (
        <div className="grid md:grid-cols-2 gap-5">
          {MY_ONGOING.map(e => (
            <OngoingCard key={e.id} event={e} onCheckIn={onCheckIn} />
          ))}
        </div>
      )}

      {/* ── Attended ── */}
      {activeSubTab === 'Attended' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MY_ATTENDED.map(e => (
            <AttendedCard key={e.id} event={e} />
          ))}
        </div>
      )}

      {/* ── Certificates ── */}
      {activeSubTab === 'Certificates' && (
        <div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CERTIFICATE_RECORDS.map(r => <CertCard key={r.id} record={r} />)}
          </div>
          <p className="text-xs mt-5 flex items-center gap-1.5" style={{ color: C.muted }}>
            <Info className="w-3.5 h-3.5" />
            Certificate statuses are updated after the event organizer uploads the attendance log. You will be notified by email when certificates are released.
          </p>
        </div>
      )}
    </div>
  );
}
