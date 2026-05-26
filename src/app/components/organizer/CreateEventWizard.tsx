import { useState } from 'react';
import { X, Upload, Plus, Trash2, CheckCircle2, Eye, ChevronRight } from 'lucide-react';
import { C } from './data';
import type { OrgEvent } from './data';

const CATEGORIES = ['Academic', 'Leadership', 'Technology', 'Wellness', 'Advocacy', 'Cultural', 'Sports', 'Career', 'Research', 'Community Service'];
const CERT_PLACEHOLDERS = ['Participant Name', 'Event Title', 'Event Date', 'Organizer Name', 'Certificate Number', 'Date Issued', 'Authorized Signatory', 'Organization Logo'];

interface Slot { id: string; label: string; start: string; end: string; venue: string; max: number; }

const STEPS = ['Basic Details', 'Event Setup', 'Time Slots', 'Certificate', 'Review & Submit'];

function StepDot({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
        style={{
          backgroundColor: done ? '#27AE60' : active ? C.maroon : 'rgba(128,0,0,0.08)',
          color: done || active ? '#fff' : C.muted,
        }}>
        {done ? <CheckCircle2 className="w-4 h-4" /> : n}
      </div>
      <span className="text-xs font-medium hidden lg:block" style={{ color: active ? C.maroon : C.muted }}>
        {label}
      </span>
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.sub }}>
      {children}{required && <span style={{ color: C.coral }}> *</span>}
    </label>
  );
}

function Input({ label, required, ...props }: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input {...props} className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
        style={{ borderColor: C.border, backgroundColor: C.cream, color: C.text }} />
    </div>
  );
}

function Textarea({ label, required, ...props }: { label: string; required?: boolean } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <textarea {...props} className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none"
        style={{ borderColor: C.border, backgroundColor: C.cream, color: C.text }} />
    </div>
  );
}

function Select({ label, required, children, ...props }: { label: string; required?: boolean } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <select {...props} className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none bg-white"
        style={{ borderColor: C.border, color: C.text }}>
        {children}
      </select>
    </div>
  );
}

export function CreateEventWizard({ onClose, onCreated }: { onClose: () => void; onCreated: (e: Partial<OrgEvent>) => void }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [exclusivity, setExclusivity] = useState('Open to All');
  const [requirements, setRequirements] = useState('');

  const [eventType, setEventType] = useState<'Regular' | 'Schedule-Based'>('Regular');
  const [modality, setModality] = useState<'Onsite' | 'Online' | 'Hybrid'>('Onsite');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('50');

  const [slots, setSlots] = useState<Slot[]>([
    { id: '1', label: 'Morning Session', start: '', end: '', venue: '', max: 25 },
  ]);

  const [certPlaceholders, setCertPlaceholders] = useState<string[]>(['Participant Name', 'Event Title', 'Event Date']);
  const [certValidated, setCertValidated] = useState(false);

  const addSlot = () => setSlots(s => [...s, { id: Date.now().toString(), label: '', start: '', end: '', venue: '', max: 25 }]);
  const removeSlot = (id: string) => setSlots(s => s.filter(sl => sl.id !== id));
  const updateSlot = (id: string, field: keyof Slot, val: string | number) =>
    setSlots(s => s.map(sl => sl.id === id ? { ...sl, [field]: val } : sl));

  const togglePlaceholder = (p: string) => setCertPlaceholders(prev =>
    prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
  );

  const handleSubmit = () => {
    setSubmitted(true);
    onCreated({ title, tagline, description, category, type: eventType, modality, date: startDate, endDate, location, maxParticipants: Number(maxParticipants), approvalStatus: 'Submitted', certTemplateStatus: certValidated ? 'Validated' : 'Not Uploaded', registrationCount: 0, waitlistCount: 0 });
  };

  const showSlotStep = eventType === 'Schedule-Based';
  const totalSteps = showSlotStep ? 5 : 4;
  const stepLabels = showSlotStep ? STEPS : STEPS.filter((_, i) => i !== 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0" style={{ borderColor: C.border }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Create New Event</h2>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Step {step} of {totalSteps} — {stepLabels[step - 1]}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors" style={{ color: C.muted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-4 pb-2 flex items-start gap-3 flex-shrink-0">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <StepDot n={i + 1} label={label} active={step === i + 1} done={step > i + 1} />
              {i < stepLabels.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 mt-[-14px]" style={{ backgroundColor: step > i + 1 ? '#27AE60' : C.border }} />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ── Step 1: Basic Details ── */}
          {step === 1 && (
            <div className="space-y-4">
              <Input label="Event Title" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Data Science Workshop 2026" />
              <Input label="Tagline" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Short catchy phrase for the event" />
              <Textarea label="Description" required value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the event, its goals, and what participants will gain..." rows={4} />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Category" required value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </Select>
                <Select label="Exclusivity" value={exclusivity} onChange={e => setExclusivity(e.target.value)}>
                  <option>Open to All</option>
                  <option>By College</option>
                  <option>By Program</option>
                  <option>Invite Only</option>
                </Select>
              </div>
              <Textarea label="Requirements" value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="Any prerequisites or materials participants must bring..." rows={2} />
              <div className="rounded-xl border-2 border-dashed p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors hover:border-maroon"
                style={{ borderColor: C.border, backgroundColor: C.cream }}>
                <Upload className="w-8 h-8" style={{ color: C.muted }} />
                <p className="text-sm font-semibold" style={{ color: C.sub }}>Upload Cover Image</p>
                <p className="text-xs" style={{ color: C.muted }}>PNG, JPG up to 5MB · 1280×720 recommended</p>
              </div>
            </div>
          )}

          {/* ── Step 2: Event Setup ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <FieldLabel required>Event Type</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                  {(['Regular', 'Schedule-Based'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setEventType(t)}
                      className="py-3 px-4 rounded-xl border text-sm font-semibold transition-all"
                      style={{ borderColor: eventType === t ? C.maroon : C.border, backgroundColor: eventType === t ? C.maroon + '10' : 'transparent', color: eventType === t ? C.maroon : C.sub }}>
                      {t}
                    </button>
                  ))}
                </div>
                {eventType === 'Schedule-Based' && <p className="text-xs mt-2" style={{ color: C.muted }}>You'll define time slots in the next step.</p>}
              </div>
              <div>
                <FieldLabel required>Modality</FieldLabel>
                <div className="grid grid-cols-3 gap-3">
                  {(['Onsite', 'Online', 'Hybrid'] as const).map(m => (
                    <button key={m} type="button" onClick={() => setModality(m)}
                      className="py-3 px-4 rounded-xl border text-sm font-semibold transition-all"
                      style={{ borderColor: modality === m ? C.maroon : C.border, backgroundColor: modality === m ? C.maroon + '10' : 'transparent', color: modality === m ? C.maroon : C.sub }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label={modality === 'Online' ? 'Platform' : modality === 'Hybrid' ? 'Venue / Platform' : 'Venue / Location'}
                required value={location} onChange={e => setLocation(e.target.value)}
                placeholder={modality === 'Online' ? 'e.g. Zoom, Microsoft Teams' : 'e.g. CCIS Lab 301, Main Auditorium'} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date & Time" required type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <Input label="End Date & Time" required type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
              {eventType === 'Regular' && (
                <Input label="Maximum Participants" required type="number" value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} min="1" />
              )}
            </div>
          )}

          {/* ── Step 3: Schedule-Based Slots (only if applicable) ── */}
          {step === 3 && showSlotStep && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>Time Slots</p>
                  <p className="text-xs" style={{ color: C.muted }}>Define each available time slot for participants to choose from.</p>
                </div>
                <button onClick={addSlot} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all"
                  style={{ borderColor: C.maroon, color: C.maroon }}>
                  <Plus className="w-3.5 h-3.5" /> Add Slot
                </button>
              </div>
              {slots.map((slot, idx) => (
                <div key={slot.id} className="rounded-xl border p-4 space-y-3" style={{ borderColor: C.border, backgroundColor: C.cream }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: C.maroon }}>Slot {idx + 1}</span>
                    {slots.length > 1 && (
                      <button onClick={() => removeSlot(slot.id)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors" style={{ color: C.coral }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <Input label="Slot Label" value={slot.label} onChange={e => updateSlot(slot.id, 'label', e.target.value)} placeholder="e.g. Morning Session" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Start" type="datetime-local" value={slot.start} onChange={e => updateSlot(slot.id, 'start', e.target.value)} />
                    <Input label="End" type="datetime-local" value={slot.end} onChange={e => updateSlot(slot.id, 'end', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Venue / Platform" value={slot.venue} onChange={e => updateSlot(slot.id, 'venue', e.target.value)} placeholder="Room or link" />
                    <Input label="Max Participants" type="number" value={String(slot.max)} onChange={e => updateSlot(slot.id, 'max', Number(e.target.value))} min="1" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Certificate Step ── */}
          {((step === 4 && showSlotStep) || (step === 3 && !showSlotStep)) && (
            <div className="space-y-5">
              <div className="rounded-xl border-2 border-dashed p-6 flex flex-col items-center gap-2 cursor-pointer"
                style={{ borderColor: C.border, backgroundColor: C.cream }}>
                <Upload className="w-8 h-8" style={{ color: C.muted }} />
                <p className="text-sm font-semibold" style={{ color: C.sub }}>Upload Certificate Template</p>
                <p className="text-xs" style={{ color: C.muted }}>PDF or DOCX with placeholder tags · Max 10MB</p>
              </div>
              <div>
                <FieldLabel>Placeholder Chips</FieldLabel>
                <p className="text-xs mb-3" style={{ color: C.muted }}>Select the placeholders used in your certificate template.</p>
                <div className="flex flex-wrap gap-2">
                  {CERT_PLACEHOLDERS.map(p => {
                    const active = certPlaceholders.includes(p);
                    return (
                      <button key={p} type="button" onClick={() => togglePlaceholder(p)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                        style={{ borderColor: active ? C.maroon : C.border, backgroundColor: active ? C.maroon : 'transparent', color: active ? '#fff' : C.sub }}>
                        {'{' + p + '}'}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setCertValidated(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all"
                  style={{ borderColor: certValidated ? '#27AE60' : C.maroon, color: certValidated ? '#27AE60' : C.maroon, backgroundColor: certValidated ? '#27AE6010' : 'transparent' }}>
                  <CheckCircle2 className="w-4 h-4" />
                  {certValidated ? 'Template Validated' : 'Validate Template'}
                </button>
                <button type="button"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all"
                  style={{ borderColor: C.teal, color: C.teal }}>
                  <Eye className="w-4 h-4" /> Preview Certificate
                </button>
              </div>
            </div>
          )}

          {/* ── Review & Submit ── */}
          {((step === 5 && showSlotStep) || (step === 4 && !showSlotStep)) && (
            <div className="space-y-4">
              {!submitted ? (
                <>
                  <div className="rounded-xl border overflow-hidden divide-y" style={{ borderColor: C.border }}>
                    {[
                      ['Event Title', title || '—'],
                      ['Tagline', tagline || '—'],
                      ['Category', category || '—'],
                      ['Type', eventType],
                      ['Modality', modality],
                      ['Location / Platform', location || '—'],
                      ['Start', startDate || '—'],
                      ['End', endDate || '—'],
                      ['Max Participants', eventType === 'Schedule-Based' ? `${slots.reduce((s, sl) => s + sl.max, 0)} (across ${slots.length} slots)` : maxParticipants],
                      ['Certificate Template', certValidated ? 'Validated ✓' : 'Not uploaded'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-start px-4 py-3">
                        <span className="text-xs font-semibold flex-shrink-0 w-44" style={{ color: C.muted }}>{k}</span>
                        <span className="text-sm text-right" style={{ color: C.text }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border p-4 flex gap-3" style={{ borderColor: C.teal + '40', backgroundColor: C.teal + '08' }}>
                    <p className="text-xs leading-relaxed" style={{ color: C.sub }}>
                      Submitting will send this event to the CMO for approval. You will receive an email notification once it has been reviewed. You may still edit the event while it is under review.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#27AE6015' }}>
                    <CheckCircle2 className="w-8 h-8" style={{ color: '#27AE60' }} />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: C.text }}>Event Submitted!</h3>
                  <p className="text-sm max-w-xs" style={{ color: C.muted }}>
                    <strong style={{ color: C.text }}>{title}</strong> has been submitted to the CMO for approval. Check your email for updates.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="px-6 py-4 border-t flex justify-between gap-3 flex-shrink-0" style={{ borderColor: C.border }}>
            <button onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
              className="px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all"
              style={{ borderColor: C.border, color: C.sub }}>
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            {((step < totalSteps)) ? (
              <button onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
                Submit to CMO
              </button>
            )}
          </div>
        )}
        {submitted && (
          <div className="px-6 py-4 border-t flex justify-end flex-shrink-0" style={{ borderColor: C.border }}>
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
