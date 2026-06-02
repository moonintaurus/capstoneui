import { useState } from 'react';
import {
  X, Award, Calendar, MapPin, Globe, Users, Shield, Clock,
  Check, Info, Tag, Building2, AlertCircle
} from 'lucide-react';
import type { Event } from './data';
import { C, CATEGORY_COLORS } from './data';
import { ExclusivityBadge } from './ExclusivityBadge';

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: bg, color }}>{label}</span>;
}

function DetailRow({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: (accent ?? C.maroon) + '12' }}>
        <Icon className="w-4 h-4" style={{ color: accent ?? C.maroon }} />
      </div>
      <div>
        <p className="text-xs font-semibold mb-0.5" style={{ color: C.muted }}>{label}</p>
        <p className="text-sm" style={{ color: C.text }}>{value}</p>
      </div>
    </div>
  );
}

type ModalState = 'details' | 'confirming' | 'confirmed';

export function EventModal({
  event,
  onClose,
  onRegistered,
}: {
  event: Event;
  onClose: () => void;
  onRegistered: (eventId: string, slotId?: string) => void;
}) {
  const [state, setState] = useState<ModalState>('details');
  const catColor = CATEGORY_COLORS[event.category] ?? C.teal;
  const isAlreadyRegistered = event.registrationStatus === 'Registered';
  const isWaitlisted = event.registrationStatus === 'Waitlisted';
  const joiningWaitlist = event.remainingSlots === 0 && event.hasWaitlist;

  const handleConfirm = () => {
    setState('confirming');
    setTimeout(() => {
      setState('confirmed');
      onRegistered(event.id);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden"
        style={{ border: `1px solid ${C.border}` }}>

        {/* ── Banner ── */}
        <div className="relative flex-shrink-0 h-32"
          style={{ background: `linear-gradient(135deg, ${event.accentColor} 0%, ${event.accentColor}99 60%, ${C.maroon}66 100%)` }}>
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge label={event.category} bg="rgba(255,255,255,0.2)" color="#fff" />
              <Badge label={event.modality} bg="rgba(255,255,255,0.2)" color="#fff" />
              {event.exclusivity !== 'Open to All' && <Badge label={event.exclusivity} bg="rgba(255,255,255,0.2)" color="#fff" />}
            </div>
            <h2 className="text-white font-bold leading-tight" style={{ fontSize: '1.25rem', fontFamily: '"Trajan Pro 3", Cambria, serif', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* ── Tagline ── */}
        <div className="px-6 py-3 border-b flex items-center justify-between" style={{ borderColor: 'rgba(128,0,0,0.06)', backgroundColor: C.cream }}>
          <p className="text-sm italic" style={{ color: C.sub }}>{event.tagline}</p>
          {event.hasCertificate && (
            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.goldenrod }}>
              <Award className="w-4 h-4" fill={C.goldenrod} /> With Certificate
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x" style={{ divideColor: 'rgba(128,0,0,0.06)' }}>

            {/* Left: details */}
            <div className="lg:col-span-2 p-5">
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.muted }}>Event Details</p>
              <div>
                <DetailRow icon={Building2} label="Organizer" value={event.organizer} />
                <DetailRow icon={Tag} label="Category" value={event.category} accent={catColor} />

                
                {/* Enhanced Exclusivity Display */}
                <div className="flex items-start gap-3 py-3 border-b" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: C.maroon + '12' }}>
                    <Shield className="w-4 h-4" style={{ color: C.maroon }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold mb-2" style={{ color: C.muted }}>Exclusivity</p>
                    <div className="flex items-start gap-2 flex-col">
                      <ExclusivityBadge exclusivity={event.exclusivity} exclusivityDetails={event.exclusivityDetails} />
                      {event.exclusivityDetails?.type === 'specificOffices' && event.exclusivityDetails.offices && event.exclusivityDetails.offices.length > 0 && (
                        <div className="text-xs mt-2 p-2 rounded-lg w-full" style={{ backgroundColor: 'rgba(218, 165, 32, 0.05)', color: C.sub }}>
                          <p className="font-semibold mb-1" style={{ color: C.goldenrod }}>Restricted to:</p>
                          <ul className="space-y-0.5">
                            {event.exclusivityDetails.offices.map((office, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <span>•</span> <span>{office}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <DetailRow
                  icon={event.modality === 'Online' ? Globe : MapPin}
                  label={event.modality === 'Online' ? 'Platform' : 'Location'}
                  value={event.modality === 'Online' ? (event.platform ?? '—') : (event.location ?? '—')}
                  accent={event.accentColor}
                />
                <DetailRow
                  icon={Calendar}
                  label="Schedule"
                  value={event.startDate}
                />
                <DetailRow icon={Users} label="Capacity" value={`${event.maxParticipants} participants max`} />
                <DetailRow icon={Users} label="Remaining Seats" value={`${event.remainingSlots} seats left`} accent={event.remainingSlots < 10 ? C.coral : C.green} />
              </div>

              {/* First-come first-served highlight */}
              <div className="mt-4 p-3 rounded-xl flex items-start gap-2.5" style={{ backgroundColor: C.maroon + '0d', border: `1.5px solid ${C.maroon}25` }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.maroon }} />
                <p className="text-xs leading-relaxed" style={{ color: C.sub }}>
                  <span className="font-bold text-sm" style={{ color: C.maroon }}>First-come, first-served.</span>{' '}
                  No organizer approval required. Registration is confirmed immediately upon submission.
                </p>
              </div>

              {/* Status */}
              {isAlreadyRegistered && (
                <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: C.green + '12', border: `1px solid ${C.green}25` }}>
                  <Check className="w-4 h-4" style={{ color: C.green }} />
                  <p className="text-xs font-semibold" style={{ color: C.green }}>You are registered for this event</p>
                </div>
              )}
              {isWaitlisted && (
                <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: C.goldenrod + '12', border: `1px solid ${C.goldenrod}25` }}>
                  <Clock className="w-4 h-4" style={{ color: C.goldenrod }} />
                  <p className="text-xs font-semibold" style={{ color: C.goldenrod }}>You are on the waitlist</p>
                </div>
              )}
              {event.hasWaitlist && !isAlreadyRegistered && !isWaitlisted && (
                <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: C.indigo + '08', border: `1px solid ${C.indigo}20` }}>
                  <Info className="w-3.5 h-3.5" style={{ color: C.indigo }} />
                  <p className="text-xs" style={{ color: C.indigo }}>Waitlist available if seats fill up</p>
                </div>
              )}
            </div>

            {/* Right: description + registration */}
            <div className="lg:col-span-3 p-5 flex flex-col gap-5">
              {/* Description */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.muted }}>About this Event</p>
                <p className="text-sm leading-relaxed" style={{ color: C.sub }}>{event.description}</p>
              </div>

              {/* ── Registration Section ── */}
              {!isAlreadyRegistered && !isWaitlisted && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.muted }}>
                    Registration
                  </p>

                  {/* Confirmed state */}
                  {state === 'confirmed' ? (
                    <div className="rounded-2xl border p-6 text-center" style={{ borderColor: C.green + '30', backgroundColor: C.green + '08' }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: C.green }}>
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold mb-1" style={{ color: C.green }}>
                        {joiningWaitlist ? 'Added to Waitlist' : 'Registration Confirmed!'}
                      </h3>
                      <p className="text-xs" style={{ color: C.muted }}>
                        A confirmation has been sent to your registered email address.
                      </p>
                    </div>
                  ) : state === 'confirming' ? (
                    <div className="rounded-2xl border p-8 flex flex-col items-center justify-center" style={{ borderColor: C.border }}>
                      <div className="w-8 h-8 rounded-full border-2 animate-spin mb-3"
                        style={{ borderColor: C.maroon, borderTopColor: 'transparent' }} />
                      <p className="text-sm font-semibold" style={{ color: C.maroon }}>Processing registration…</p>
                    </div>
                  ) : (
                    <div>
                      <div className="p-4 rounded-xl border mb-4" style={{ borderColor: C.border, backgroundColor: C.cream }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold" style={{ color: C.muted }}>Available Seats</span>
                          <span className="text-sm font-bold" style={{ color: event.remainingSlots < 10 ? C.coral : C.green }}>
                            {event.remainingSlots} remaining
                          </span>
                        </div>
                        <div className="h-2 rounded-full" style={{ backgroundColor: '#e8e0d8' }}>
                          <div className="h-2 rounded-full" style={{
                            width: `${((event.maxParticipants - event.remainingSlots) / event.maxParticipants) * 100}%`,
                            backgroundColor: event.remainingSlots < 10 ? C.coral : C.green,
                          }} />
                        </div>
                      </div>
                      <button
                        onClick={handleConfirm}
                        disabled={event.remainingSlots === 0}
                        className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all"
                        style={{
                          background: event.remainingSlots === 0 ? '#ccc' : `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)`,
                          boxShadow: event.remainingSlots === 0 ? 'none' : `0 6px 18px ${C.maroon}35`,
                        }}
                      >
                        {event.remainingSlots === 0 ? 'Event Full' : 'Register'}
                      </button>
                      {event.remainingSlots === 0 && event.hasWaitlist && (
                        <button
                          onClick={handleConfirm}
                          className="w-full mt-2 py-3.5 rounded-xl text-sm font-bold border transition-all"
                          style={{ borderColor: C.goldenrod, color: C.goldenrod }}
                        >
                          Join Waitlist
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
