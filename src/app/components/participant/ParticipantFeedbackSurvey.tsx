import { useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, Send, Star, X } from 'lucide-react';
import type { Event } from './data';
import {
  C,
  FEEDBACK_RATING_SCALE,
  STANDARD_FEEDBACK_QUESTIONS,
} from './data';

type RatingAnswers = Record<string, number>;
type TextAnswers = Record<string, string>;

function groupBySection<T extends { section: string }>(items: T[]) {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    groups[item.section] = [...(groups[item.section] ?? []), item];
    return groups;
  }, {});
}

function ScaleLegend() {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: C.border, backgroundColor: C.cream }}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: C.muted }}>Rating Scale</p>
      <div className="grid sm:grid-cols-5 gap-2">
        {FEEDBACK_RATING_SCALE.map(item => (
          <div key={item.value} className="rounded-xl bg-white border p-3" style={{ borderColor: C.border }}>
            <p className="text-lg font-bold" style={{ color: C.maroon }}>{item.value}</p>
            <p className="text-[11px] leading-snug" style={{ color: C.sub }}>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ParticipantFeedbackSurvey({
  event,
  onClose,
  onSubmitted,
}: {
  event: Event;
  onClose: () => void;
  onSubmitted: (eventId: string) => void;
}) {
  const [ratings, setRatings] = useState<RatingAnswers>({});
  const [textAnswers, setTextAnswers] = useState<TextAnswers>({});
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const ratingQuestions = useMemo(
    () => STANDARD_FEEDBACK_QUESTIONS.filter(question => question.type === 'Rating'),
    [],
  );
  const openEndedQuestions = useMemo(
    () => STANDARD_FEEDBACK_QUESTIONS.filter(question => question.type === 'Open Ended'),
    [],
  );
  const ratingGroups = useMemo(() => groupBySection(ratingQuestions), [ratingQuestions]);

  const requiredRatingCount = ratingQuestions.filter(question => question.required).length;
  const answeredRatingCount = ratingQuestions.filter(question => !question.required || ratings[question.id]).length;

  const handleSubmit = () => {
    const missingRequiredRatings = ratingQuestions.some(question => question.required && !ratings[question.id]);
    const missingRequiredText = openEndedQuestions.some(question => question.required && !textAnswers[question.id]?.trim());

    if (missingRequiredRatings || missingRequiredText) {
      setError('Please answer all required rating-scale items before submitting your feedback.');
      return;
    }

    setError('');
    setSubmitted(true);
    onSubmitted(event.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <div className="px-6 py-5 border-b flex items-start justify-between gap-4" style={{ borderColor: C.border }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.maroon + '10' }}>
                <ClipboardList className="w-5 h-5" style={{ color: C.maroon }} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: C.muted }}>Standardized Feedback Form</p>
            </div>
            <h2 className="font-bold text-lg" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>{event.title}</h2>
            <p className="text-xs mt-1" style={{ color: C.muted }}>
              This form is system-generated and uses the same standard questions for all events.
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-stone-100" style={{ color: C.muted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
            <div className="max-w-md text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: C.green + '15' }}>
                <CheckCircle2 className="w-9 h-9" style={{ color: C.green }} />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: C.text }}>Feedback submitted</h3>
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                Thank you for answering the standardized event feedback form. Your response will be included in the event feedback summary viewed by the organizer and CMO.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <div className="grid lg:grid-cols-[1fr,280px] gap-4">
                <div className="rounded-2xl border p-4" style={{ borderColor: C.border }}>
                  <p className="text-sm font-bold mb-2" style={{ color: C.text }}>Instructions</p>
                  <p className="text-sm leading-relaxed" style={{ color: C.sub }}>
                    Please answer based on your experience in this event. Rating-scale questions are required. Open-ended questions help the organizer and CMO understand what worked well and what needs improvement.
                  </p>
                </div>
                <div className="rounded-2xl border p-4" style={{ borderColor: C.border }}>
                  <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: C.muted }}>Progress</p>
                  <p className="text-2xl font-bold mt-2" style={{ color: C.maroon }}>{answeredRatingCount}/{requiredRatingCount}</p>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>required rating items answered</p>
                </div>
              </div>

              <ScaleLegend />

              <section className="space-y-4">
                <div>
                  <h3 className="font-bold text-base" style={{ color: C.text }}>Part A. Rating-Scale Questions</h3>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>Select one rating for each statement.</p>
                </div>

                {Object.entries(ratingGroups).map(([section, questions]) => (
                  <div key={section} className="rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
                    <div className="px-5 py-3 border-b" style={{ borderColor: C.border, backgroundColor: C.cream }}>
                      <p className="text-sm font-bold" style={{ color: C.text }}>{section}</p>
                    </div>
                    <div className="divide-y" style={{ borderColor: C.border }}>
                      {questions.map((question, index) => (
                        <div key={question.id} className="p-5">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: C.maroon + '10', color: C.maroon }}>
                              {index + 1}
                            </div>
                            <p className="text-sm font-semibold leading-relaxed" style={{ color: C.text }}>
                              {question.prompt} {question.required && <span style={{ color: C.coral }}>*</span>}
                            </p>
                          </div>

                          <div className="grid grid-cols-5 gap-2 pl-10">
                            {[1, 2, 3, 4, 5].map(score => {
                              const active = ratings[question.id] === score;
                              return (
                                <button
                                  key={score}
                                  type="button"
                                  onClick={() => setRatings(prev => ({ ...prev, [question.id]: score }))}
                                  className="py-2.5 rounded-xl border text-sm font-bold transition-all"
                                  style={{
                                    borderColor: active ? C.maroon : C.border,
                                    backgroundColor: active ? C.maroon : '#fff',
                                    color: active ? '#fff' : C.sub,
                                  }}
                                >
                                  <span className="inline-flex items-center justify-center gap-1">
                                    {score}
                                    {active && <Star className="w-3.5 h-3.5" fill="currentColor" />}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>

              <section className="space-y-4">
                <div>
                  <h3 className="font-bold text-base" style={{ color: C.text }}>Part B. Open-Ended Questions</h3>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>Write your comments, suggestions, or concerns in your own words.</p>
                </div>

                <div className="rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
                  <div className="divide-y" style={{ borderColor: C.border }}>
                    {openEndedQuestions.map(question => (
                      <label key={question.id} className="block p-5">
                        <span className="block text-sm font-semibold mb-2" style={{ color: C.text }}>
                          {question.prompt} {question.required && <span style={{ color: C.coral }}>*</span>}
                        </span>
                        <textarea
                          value={textAnswers[question.id] ?? ''}
                          onChange={e => setTextAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                          rows={3}
                          placeholder="Type your answer here..."
                          className="w-full px-3.5 py-3 rounded-xl border text-sm outline-none resize-none"
                          style={{ borderColor: C.border, backgroundColor: C.cream, color: C.text }}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              {error && (
                <div className="rounded-xl border p-3 text-sm font-semibold" style={{ borderColor: C.coral + '40', backgroundColor: C.coral + '08', color: C.coral }}>
                  {error}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t flex justify-between gap-3" style={{ borderColor: C.border }}>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border text-sm font-semibold"
                style={{ borderColor: C.border, color: C.sub }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}
              >
                <Send className="w-4 h-4" /> Submit Feedback
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
