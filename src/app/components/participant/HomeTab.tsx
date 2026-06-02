import { Award, Calendar, MapPin, Globe, Clock, Users, Star, ChevronRight } from 'lucide-react';
import type { Event } from './data';
import { C, CATEGORY_COLORS, ALL_EVENTS, PAST_EVENTS } from './data';
import { ExclusivityBadge } from './ExclusivityBadge';

function ModalityBadge({ modality }: { modality: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Onsite: { bg: C.coral + '18', color: C.coral },
    Online: { bg: C.teal + '18', color: C.teal },
    Hybrid: { bg: C.indigo + '18', color: C.indigo },
  };
  const s = map[modality] ?? { bg: '#eee', color: '#666' };
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>{modality}</span>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: C.green + '15', color: C.green }}>
      {type}
    </span>
  );
}

function SlotBar({ remaining, max }: { remaining: number; max: number }) {
  const pct = Math.max(0, Math.min(100, ((max - remaining) / max) * 100));
  const color = remaining < 10 ? C.coral : remaining < 30 ? C.goldenrod : C.green;
  return (
    <div>
      <div className="h-1.5 rounded-full" style={{ backgroundColor: '#f0ebe0' }}>
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function RecommendedCard({ event, onView }: { event: Event; onView: (e: Event) => void }) {
  const catColor = CATEGORY_COLORS[event.category] ?? C.teal;
  return (
    <div
      className="flex-shrink-0 w-72 bg-white rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
      style={{ borderColor: C.border }}
      onClick={() => onView(event)}
    >
      {/* Color banner */}
      <div className="h-2" style={{ background: `linear-gradient(90deg, ${event.accentColor} 0%, ${event.accentColor}aa 100%)` }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
            style={{ backgroundColor: C.maroon + '10', color: C.maroon }}>
            <Star className="w-3 h-3" fill={C.maroon} /> Recommended
          </span>
          {event.hasCertificate && <Award className="w-4 h-4" style={{ color: C.goldenrod }} fill={C.goldenrod} />}
        </div>

        <h3 className="text-sm font-bold leading-snug mb-2" style={{ color: C.text }}>{event.title}</h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: catColor + '18', color: catColor }}>{event.category}</span>
          <ModalityBadge modality={event.modality} />
          <TypeBadge type={event.eventType} />
          <ExclusivityBadge exclusivity={event.exclusivity} exclusivityDetails={event.exclusivityDetails} />
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs" style={{ color: C.sub }}>
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: event.accentColor }} />
            <span className="truncate">{event.startDate}</span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: C.sub }}>
            <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: event.accentColor }} />
            <span>
              <span className="font-semibold" style={{ color: event.remainingSlots < 15 ? C.coral : C.text }}>
                {event.remainingSlots}
              </span> seats left
            </span>
          </div>
        </div>

        <SlotBar remaining={event.remainingSlots} max={event.maxParticipants} />

        <button
          className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-200"
          style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}
          onClick={e => { e.stopPropagation(); onView(event); }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

function UpcomingCard({ event, onView }: { event: Event; onView: (e: Event) => void }) {
  const catColor = CATEGORY_COLORS[event.category] ?? C.teal;
  const venue = event.modality === 'Online' ? event.platform : event.location;
  const venueIcon = event.modality === 'Online' ? Globe : MapPin;
  const VenueIcon = venueIcon;

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      style={{ borderColor: C.border }}
      onClick={() => onView(event)}
    >
      <div className="h-1.5" style={{ backgroundColor: event.accentColor }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: catColor + '18', color: catColor }}>{event.category}</span>
              <ModalityBadge modality={event.modality} />
              <ExclusivityBadge exclusivity={event.exclusivity} exclusivityDetails={event.exclusivityDetails} />
            </div>
            <h3 className="text-sm font-bold leading-snug" style={{ color: C.text }}>{event.title}</h3>
          </div>
          {event.hasCertificate && (
            <div className="flex items-center gap-1 flex-shrink-0" style={{ color: C.goldenrod }}>
              <Award className="w-3.5 h-3.5" fill={C.goldenrod} />
            </div>
          )}
        </div>

        <p className="text-xs mb-3 truncate" style={{ color: C.muted }}>{event.organizer}</p>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs" style={{ color: C.sub }}>
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.startDate}</span>
          </div>
          {venue && (
            <div className="flex items-center gap-2 text-xs" style={{ color: C.sub }}>
              <VenueIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{venue}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs" style={{ color: C.sub }}>
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              <span className="font-semibold" style={{ color: event.remainingSlots < 15 ? C.coral : C.text }}>
                {event.remainingSlots}
              </span> / {event.maxParticipants} seats
            </span>
          </div>
        </div>

        <SlotBar remaining={event.remainingSlots} max={event.maxParticipants} />

        <div className="flex items-center justify-between mt-4">
          <TypeBadge type={event.eventType} />
          <button
            className="flex items-center gap-1 text-xs font-semibold transition-colors"
            style={{ color: C.maroon }}
            onClick={e => { e.stopPropagation(); onView(event); }}
          >
            Register <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function HomeTab({ onViewEvent, filter }: { onViewEvent: (e: Event) => void; filter: string }) {
  const recommended = ALL_EVENTS.filter(e => e.isRecommended);
  const upcoming = ALL_EVENTS.filter(e => {
    if (filter === 'All') return true;
    if (filter === 'Onsite') return e.modality === 'Onsite';
    if (filter === 'Online') return e.modality === 'Online';
    if (filter === 'Hybrid') return e.modality === 'Hybrid';
    if (filter === 'Regular') return e.eventType === 'Regular';
    if (filter === 'With Certificate') return e.hasCertificate;
    return true;
  });

  return (
    <div className="space-y-10">

      {/* ── Recommended Events ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold" style={{ color: C.text, fontSize: '1.1rem' }}>Recommended for You</h2>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Based on your interests in Technology and Research</p>
          </div>
          <button className="text-xs font-semibold flex items-center gap-1" style={{ color: C.maroon }}>
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-3" style={{ scrollbarWidth: 'thin' }}>
          {recommended.map(e => <RecommendedCard key={e.id} event={e} onView={onViewEvent} />)}
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold" style={{ color: C.text, fontSize: '1.1rem' }}>Upcoming Events</h2>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>
              {filter === 'All' ? 'All open events' : `Filtered: ${filter}`} — {upcoming.length} events
            </p>
          </div>
          <button className="text-xs font-semibold flex items-center gap-1" style={{ color: C.maroon }}>
            Browse all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {upcoming.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border" style={{ borderColor: C.border, backgroundColor: 'white' }}>
            <p className="text-sm" style={{ color: C.muted }}>No events match this filter.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcoming.map(e => <UpcomingCard key={e.id} event={e} onView={onViewEvent} />)}
          </div>
        )}
      </section>

      {/* ── Past Event Showcases ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold" style={{ color: C.text, fontSize: '1.1rem' }}>Past Events</h2>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Recent campus events you may have attended</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PAST_EVENTS.map(ev => {
            const catColor = CATEGORY_COLORS[ev.category] ?? C.teal;
            return (
              <div key={ev.id} className="relative rounded-2xl overflow-hidden h-36 cursor-default group"
                style={{ background: `linear-gradient(135deg, ${ev.accentColor} 0%, ${ev.accentColor}cc 100%)` }}>
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full self-start mb-2"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                    {ev.category}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-tight mb-1">{ev.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {ev.date}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: ev.attended ? C.green + 'cc' : 'rgba(255,255,255,0.2)', color: '#fff' }}>
                      {ev.attended ? 'Attended' : 'Not Attended'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
