import { useState } from 'react';
import { X, Upload, CheckCircle2, Eye, ChevronRight, MessageSquare } from 'lucide-react';
import { C, EVENT_CATEGORIES } from './data';
import type { OrgEvent } from './data';

const CERT_PLACEHOLDERS = ['Participant Name', 'Event Title', 'Event Date', 'Organizer Name', 'Certificate Number', 'Date Issued', 'Authorized Signatory', 'Organization Logo or Event Logo'];
const STEPS = ['Basic Details', 'Event Setup', 'Certificate', 'Review & Submit'];

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

  const [modality, setModality] = useState<'Onsite' | 'Online' | 'Hybrid'>('Onsite');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('50');

  const [certPlaceholders, setCertPlaceholders] = useState<string[]>(['Participant Name', 'Event Title', 'Event Date']);
  const [certValidated, setCertValidated] = useState(false);

  const togglePlaceholder = (p: string) => setCertPlaceholders(prev =>
    prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
  );

  const handleSubmit = () => {
    setSubmitted(true);
    onCreated({
      title,
      tagline,
      description,
      category: category as OrgEvent['category'],
      type: 'Regular',
      modality,
      date: startDate,
      endDate,
      location,
      maxParticipants: Number(maxParticipants),
      approvalStatus: 'Submitted',
      certTemplateStatus: certValidated ? 'Validated' : 'Not Uploaded',
      csvVerificationStatus: modality === 'Onsite' ? 'Not Required' : 'Not Uploaded',
      registrationCount: 0,
      waitlistCount: 0,
      requirements,
      exclusivity,
      onlinePlatform: modality === 'Onsite' ? 'Not Applicable' : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0" style={{ borderColor: C.border }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Create New Event</h2>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Step {step} of {STEPS.length} - {STEPS[step - 1]}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors" style={{ color: C.muted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pt-4 pb-2 flex items-start gap-3 flex-shrink-0">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <StepDot n={i + 1} label={label} active={step === i + 1} done={step > i + 1} />
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 mt-[-14px]" style={{ backgroundColor: step > i + 1 ? '#27AE60' : C.border }} />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 1 && (
            <div className="space-y-4">
              <Input label="Event Title" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Gender and Development Awareness Forum" />
              <Input label="Tagline" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Short catchy phrase for the event" />
              <Textarea label="Description" required value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the event, its goals, and what participants will gain..." rows={4} />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Category" required value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">Select category</option>
                  {EVENT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
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
                <p className="text-xs" style={{ color: C.muted }}>PNG, JPG up to 5MB - 1280x720 recommended</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-xl border p-4 text-xs leading-relaxed" style={{ borderColor: C.border, backgroundColor: '#fff', color: C.sub }}>
                All events use regular registration. Participants register while seats are available or join the event waitlist once capacity is full.
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
                placeholder={modality === 'Online' ? 'e.g. Zoom, Microsoft Teams' : 'e.g. PUP Main Hall, Main Auditorium'} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date & Time" required type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <Input label="End Date & Time" required type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
              <Input label="Maximum Participants" required type="number" value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} min="1" />
              <div className="rounded-xl border p-4 text-xs leading-relaxed" style={{ borderColor: C.border, backgroundColor: '#fff', color: C.sub }}>
                {modality === 'Onsite' && 'Onsite attendance requires GPS/geofencing and face biometric verification.'}
                {modality === 'Online' && 'Online attendance requires face biometric verification before unlocking the meeting link, then CSV attendance verification after the event.'}
                {modality === 'Hybrid' && 'Hybrid attendance supports onsite and online participants depending on selected attendance mode.'}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="rounded-xl border-2 border-dashed p-6 flex flex-col items-center gap-2 cursor-pointer"
                style={{ borderColor: C.border, backgroundColor: C.cream }}>
                <Upload className="w-8 h-8" style={{ color: C.muted }} />
                <p className="text-sm font-semibold" style={{ color: C.sub }}>Upload Certificate Template</p>
                <p className="text-xs" style={{ color: C.muted }}>PDF or DOCX with placeholder tags - Max 10MB</p>
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

          {step === 4 && (
            <div className="space-y-4">
              {!submitted ? (
                <>
                  <div className="rounded-xl border overflow-hidden divide-y" style={{ borderColor: C.border }}>
                    {[
                      ['Event Title', title || '-'],
                      ['Tagline', tagline || '-'],
                      ['Category', category || '-'],
                      ['Type', 'Regular'],
                      ['Modality', modality],
                      ['Location / Platform', location || '-'],
                      ['Start', startDate || '-'],
                      ['End', endDate || '-'],
                      ['Max Participants', maxParticipants],
                      ['Certificate Template', certValidated ? 'Validated' : 'Not uploaded'],
                      ['Feedback Form', 'Standardized form auto assigned'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-start px-4 py-3">
                        <span className="text-xs font-semibold flex-shrink-0 w-44" style={{ color: C.muted }}>{k}</span>
                        <span className="text-sm text-right" style={{ color: C.text }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border p-4 flex gap-3" style={{ borderColor: C.teal + '40', backgroundColor: C.teal + '08' }}>
                    <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.teal }} />
                    <div>
                      <p className="text-xs font-bold mb-1" style={{ color: C.text }}>Standardized feedback form included</p>
                      <p className="text-xs leading-relaxed" style={{ color: C.sub }}>
                        Organizers do not upload a feedback form. After the event ends, participants will answer the system's standard rating and open ended questions. The summarized results will be visible to the organizer and CMO per event.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border p-4 flex gap-3" style={{ borderColor: C.teal + '40', backgroundColor: C.teal + '08' }}>
                    <p className="text-xs leading-relaxed" style={{ color: C.sub }}>
                      Submitting will send this event to the CMO for approval. You will receive an email update once it has been reviewed. You may still edit the event while it is under review.
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

        {!submitted && (
          <div className="px-6 py-4 border-t flex justify-between gap-3 flex-shrink-0" style={{ borderColor: C.border }}>
            <button onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
              className="px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all"
              style={{ borderColor: C.border, color: C.sub }}>
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            {step < STEPS.length ? (
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