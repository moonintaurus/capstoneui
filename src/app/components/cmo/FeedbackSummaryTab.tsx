import { useState, type ElementType } from 'react';
import {
  CheckCircle2,
  Clock,
  Download,
  MessageSquare,
  Star,
  Users,
} from 'lucide-react';
import {
  C,
  MOCK_CMO_EVENTS,
  getEventFeedbackSummary,
  isCompletedEvent,
} from './data';
import type { CmoEvent, FeedbackOpenEndedResult, FeedbackTheme } from './data';

function MetricCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub: string;
  color: string;
  icon: ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl border p-4" style={{ borderColor: C.border }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] font-bold" style={{ color: C.muted }}>{label}</p>
          <p className="text-2xl font-bold mt-2" style={{ color }}>{value}</p>
          <p className="text-xs mt-1" style={{ color: C.muted }}>{sub}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '14' }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

function ThemeBadge({ theme }: { theme: FeedbackTheme }) {
  const colors: Record<FeedbackTheme['sentiment'], { bg: string; color: string }> = {
    Positive: { bg: '#27AE6018', color: '#1a8a44' },
    Neutral: { bg: '#00598D18', color: C.teal },
    Concern: { bg: '#EA694B18', color: '#C05020' },
  };
  const style = colors[theme.sentiment];

  return (
    <div className="rounded-xl border p-3 bg-white" style={{ borderColor: C.border }}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold" style={{ color: C.text }}>{theme.label}</p>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.color }}>
          {theme.sentiment}
        </span>
      </div>
      <p className="text-xs mt-1" style={{ color: C.muted }}>{theme.mentions} mentions</p>
    </div>
  );
}

function InfoPanel({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border bg-white p-6" style={{ borderColor: C.border }}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: C.maroon + '10' }}>
        <MessageSquare className="w-6 h-6" style={{ color: C.maroon }} />
      </div>
      <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
        Feedback Summary
      </h2>
      <p className="text-sm font-semibold mt-4" style={{ color: C.sub }}>{title}</p>
      <p className="text-sm mt-2 max-w-2xl" style={{ color: C.muted }}>{message}</p>
    </div>
  );
}

function RatingDistributionBar({ distribution }: { distribution: { score: number; label: string; count: number }[] }) {
  const total = distribution.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <div className="space-y-2">
      {distribution.map(item => {
        const width = Math.round((item.count / total) * 100);
        return (
          <div key={item.score} className="grid grid-cols-[80px_1fr_50px] items-center gap-3">
            <span className="text-xs font-semibold" style={{ color: C.sub }}>{item.score} - {item.label.split(' ')[0]}</span>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: C.cream }}>
              <div className="h-full rounded-full" style={{ width: `${width}%`, backgroundColor: item.score >= 4 ? C.maroon : item.score === 3 ? C.goldenrod : C.coral }} />
            </div>
            <span className="text-xs text-right" style={{ color: C.muted }}>{item.count}</span>
          </div>
        );
      })}
    </div>
  );
}

function OpenEndedGroup({ group }: { group: FeedbackOpenEndedResult }) {
  const [showAll, setShowAll] = useState(false);
  const visibleAnswers = showAll ? group.answers : group.answers.slice(0, 3);

  return (
    <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: C.border }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold" style={{ color: C.text }}>{group.prompt}</h4>
            <p className="text-xs mt-1" style={{ color: C.muted }}>{group.responseCount} open-ended answers</p>
          </div>
          {group.answers.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll(prev => !prev)}
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold self-start"
              style={{ borderColor: C.border, color: C.sub }}
            >
              {showAll ? 'Show fewer' : 'View all answers'}
            </button>
          )}
        </div>
      </div>
      <div className="divide-y" style={{ borderColor: C.border }}>
        {visibleAnswers.map(answer => (
          <div key={answer.id} className="p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xs font-bold" style={{ color: C.maroon }}>{answer.respondentLabel}</span>
              <span className="text-xs" style={{ color: C.muted }}>{answer.submittedAt}</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: C.sub }}>{answer.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeedbackSummaryTab({
  eventId,
  event: eventOverride,
}: {
  eventId?: string;
  event?: CmoEvent;
}) {
  const resolvedEventId = eventOverride?.id ?? eventId;
  const event = eventOverride ?? (resolvedEventId ? MOCK_CMO_EVENTS.find(item => item.id === resolvedEventId) : undefined);

  if (!resolvedEventId || !event) {
    return (
      <InfoPanel
        title="Select an event first"
        message="Feedback summaries are shown per event. Open a specific event record to view the standardized feedback results."
      />
    );
  }

  if (!isCompletedEvent(event)) {
    return (
      <InfoPanel
        title="Feedback form is not available yet"
        message="The standardized feedback form automatically becomes available after the event has ended. CMO and organizers only view the collected summary; they do not upload or create separate feedback forms."
      />
    );
  }

  const summary = getEventFeedbackSummary(resolvedEventId);

  if (!summary) {
    return (
      <InfoPanel
        title="No responses yet"
        message="The event has ended, but no feedback answers have been submitted yet. Once participants answer the standardized form, the rating-scale summary, common themes, and open-ended answers will appear here."
      />
    );
  }

  const statusStyle = summary.status === 'Ready for Review'
    ? { bg: '#27AE6018', color: '#1a8a44', icon: CheckCircle2 }
    : summary.status === 'Collecting Responses'
      ? { bg: '#DAA52018', color: '#8a6010', icon: Clock }
      : { bg: '#9a7a5a12', color: C.muted, icon: MessageSquare };
  const StatusIcon = statusStyle.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Feedback Summary</h2>
          <p className="text-sm mt-1 max-w-2xl" style={{ color: C.muted }}>
            Standardized participant feedback results for this completed event. This view is read-only for CMO monitoring and reporting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
            <StatusIcon className="w-3.5 h-3.5" />
            {summary.status}
          </span>
          <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold" style={{ borderColor: C.border, color: C.sub }}>
            <Download className="w-3.5 h-3.5" />
            Export Summary
          </button>
        </div>
      </div>

      <div className="rounded-2xl border p-4" style={{ borderColor: C.teal + '40', backgroundColor: C.teal + '08' }}>
        <p className="text-sm font-semibold" style={{ color: C.text }}>System-generated standardized feedback form</p>
        <p className="text-xs mt-1" style={{ color: C.sub }}>
          The same rating-scale and open-ended questions are used for all events, so CMO can compare event quality and participant concerns consistently.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Responses" value={summary.totalResponses} sub={`${summary.totalEligible} eligible participants`} color={C.teal} icon={Users} />
        <MetricCard label="Response Rate" value={`${summary.responseRate}%`} sub="Submitted feedback forms" color={C.maroon} icon={MessageSquare} />
        <MetricCard label="Average Rating" value={`${summary.averageRating}/5`} sub="Across rating-scale questions" color={C.goldenrod} icon={Star} />
        <MetricCard label="Open Until" value={summary.submittedUntil} sub="Feedback collection date" color={C.purple} icon={Clock} />
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
          <h3 className="text-sm font-bold" style={{ color: C.text }}>Rating-scale summary</h3>
          <p className="text-xs mt-1" style={{ color: C.muted }}>Scale: 1 - Strongly Disagree to 5 - Strongly Agree, except overall satisfaction which uses Very Dissatisfied to Very Satisfied.</p>
        </div>
        <div className="divide-y" style={{ borderColor: C.border }}>
          {summary.questionResults.map(result => (
            <div key={result.questionId} className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: C.text }}>{result.prompt}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs" style={{ color: C.muted }}>
                    <span>{result.responseCount} responses</span>
                    <span className="font-bold" style={{ color: C.maroon }}>{result.averageScore}/5 average</span>
                    <span>{result.positiveRate}% positive responses</span>
                  </div>
                </div>
                <div className="w-full lg:w-80">
                  <RatingDistributionBar distribution={result.distribution} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
        <h3 className="text-sm font-bold mb-3" style={{ color: C.text }}>Common themes from open-ended answers</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {summary.commonThemes.map(theme => <ThemeBadge key={theme.label} theme={theme} />)}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold" style={{ color: C.text }}>Open-ended answers</h3>
          <p className="text-xs mt-1" style={{ color: C.muted }}>CMO can view all submitted text answers per open-ended question for event evaluation and reporting.</p>
        </div>
        {summary.openEndedResponses.map(group => <OpenEndedGroup key={group.questionId} group={group} />)}
      </div>
    </div>
  );
}