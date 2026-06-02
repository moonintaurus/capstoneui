import { useState } from 'react';
import {
  Calendar, MapPin, Globe, Clock, Award, Fingerprint,
  X, ClipboardList, Check
} from 'lucide-react';
import type { Event } from './data';
import { C, CATEGORY_COLORS, MY_UPCOMING, MY_ONGOING, MY_ATTENDED } from './data';
import { ParticipantFeedbackSurvey } from './ParticipantFeedbackSurvey';
import { ExclusivityBadge } from './ExclusivityBadge';

const SUB_TABS = ['Upcoming', 'Ongoing', 'Attended'] as const;
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
              <ExclusivityBadge exclusivity={event.exclusivity} exclusivityDetails={event.exclusivityDetails} />
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
            {event.modality}
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
              <ExclusivityBadge exclusivity={event.exclusivity} exclusivityDetails={event.exclusivityDetails} />
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

function AttendedCard({
  event,
  feedbackSubmitted,
  onOpenSurvey,
}: {
  event: Event & { surveyDone: boolean };
  feedbackSubmitted: boolean;
  onOpenSurvey: (event: Event) => void;
}) {
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
              <ExclusivityBadge exclusivity={event.exclusivity} exclusivityDetails={event.exclusivityDetails} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: C.text }}>{event.title}</h3>
          </div>
          {event.hasCertificate && <Award className="w-4 h-4 flex-shrink-0 opacity-60" style={{ color: C.goldenrod }} />}
        </div>

        <div className="flex items-center gap-2 text-xs mb-4" style={{ color: C.sub }}>
          <Calendar className="w-3.5 h-3.5" />
          <span>{event.startDate}</span>
        </div>

        {feedbackSubmitted ? (
          <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl" style={{ backgroundColor: C.green + '10' }}>
            <Check className="w-4 h-4" style={{ color: C.green }} />
            <span className="text-xs font-semibold" style={{ color: C.green }}>Feedback submitted</span>
          </div>
        ) : (
          <button
            onClick={() => onOpenSurvey(event)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border transition-all"
            style={{ borderColor: C.maroon, color: C.maroon }}
          >
            <ClipboardList className="w-4 h-4" />
            Answer Feedback Survey
          </button>
        )}
      </div>
    </div>
  );
}

export function MyEventsTab({ onCheckIn }: { onCheckIn: (event: Event) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('Upcoming');
  const [cancelledIds, setCancelledIds] = useState<Set<string>>(new Set());
  const [feedbackEvent, setFeedbackEvent] = useState<Event | null>(null);
  const [submittedFeedbackIds, setSubmittedFeedbackIds] = useState<Set<string>>(
    () => new Set(MY_ATTENDED.filter(event => event.surveyDone).map(event => event.id)),
  );

  const visibleUpcoming = MY_UPCOMING.filter(e => !cancelledIds.has(e.id));

  const handleFeedbackSubmitted = (eventId: string) => {
    setSubmittedFeedbackIds(prev => new Set([...prev, eventId]));
  };

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
            <AttendedCard key={e.id} event={e} feedbackSubmitted={submittedFeedbackIds.has(e.id)} onOpenSurvey={setFeedbackEvent} />
          ))}
        </div>
      )}

      {feedbackEvent && (
        <ParticipantFeedbackSurvey
          event={feedbackEvent}
          onClose={() => setFeedbackEvent(null)}
          onSubmitted={handleFeedbackSubmitted}
        />
      )}
    </div>
  );
}
