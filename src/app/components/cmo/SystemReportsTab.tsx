import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Download, FileText, PlayCircle } from 'lucide-react';
import {
  C,
  EVENT_CATEGORIES,
  MOCK_CMO_EVENTS,
  getCategoryColor,
  getEventFeedbackSummary,
  type ApprovalStatus,
  type CmoEvent,
  type FeedbackSummary,
  type Modality,
} from './data';

interface SystemReportsTabProps {
  events?: CmoEvent[];
}

type ReportFilters = {
  startDate: string;
  endDate: string;
  department: string;
  category: string;
  status: string;
  modality: string;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-bold text-sm mb-4" style={{ color: C.text }}>{children}</h3>;
}

function SummaryCard({ label, value, helper }: { label: string; value: string | number; helper: string }) {
  return (
    <div className="bg-white rounded-2xl border p-4 shadow-sm" style={{ borderColor: C.border }}>
      <p className="text-xs font-semibold" style={{ color: C.muted }}>{label}</p>
      <p className="text-2xl font-bold mt-2" style={{ color: C.text }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: C.muted }}>{helper}</p>
    </div>
  );
}

function filterEvents(events: CmoEvent[], filters: ReportFilters) {
  return events.filter(event => {
    const start = new Date(event.startDate);
    const from = filters.startDate ? new Date(filters.startDate) : null;
    const to = filters.endDate ? new Date(`${filters.endDate}T23:59:59`) : null;
    return (
      (!from || start >= from) &&
      (!to || start <= to) &&
      (filters.department === 'All' || event.department === filters.department) &&
      (filters.category === 'All' || event.category === filters.category) &&
      (filters.status === 'All' || event.approvalStatus === filters.status) &&
      (filters.modality === 'All' || event.modality === filters.modality)
    );
  });
}

export function SystemReportsTab({ events = MOCK_CMO_EVENTS }: SystemReportsTabProps) {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: '2026-05-01',
    endDate: '2026-12-31',
    department: 'All',
    category: 'All',
    status: 'All',
    modality: 'All',
  });
  const [feedback, setFeedback] = useState('');

  const departments = ['All', ...Array.from(new Set(events.map(event => event.department)))];
  const statuses: Array<'All' | ApprovalStatus> = ['All', 'Submitted', 'Pending Review', 'Approved', 'Returned with Comments', 'Rejected', 'Published'];
  const modalities: Array<'All' | Modality> = ['All', 'Onsite', 'Online', 'Hybrid'];
  const filtered = useMemo(() => filterEvents(events, filters), [events, filters]);

  const totalParticipants = filtered.reduce((sum, event) => sum + event.registrationCount, 0);
  const totalCheckedIn = filtered.reduce((sum, event) => sum + event.checkedIn, 0);
  const avgAttendance = totalParticipants > 0 ? Math.round((totalCheckedIn / totalParticipants) * 100) : 0;
  const pendingApprovals = filtered.filter(event => event.approvalStatus === 'Submitted' || event.approvalStatus === 'Pending Review').length;
  const returnedEvents = filtered.filter(event => event.approvalStatus === 'Returned with Comments').length;
  const rejectedEvents = filtered.filter(event => event.approvalStatus === 'Rejected').length;
  const publishedEvents = filtered.filter(event => event.approvalStatus === 'Published').length;
  const completedEvents = filtered.filter(event => new Date(event.endDate) < new Date('2026-05-28T12:00:00')).length;
  const generatedCertificates = filtered.reduce((sum, event) => sum + event.generatedCertificates + event.pendingCertificates + event.notEligibleCertificates, 0);
  const releasedCertificates = filtered.reduce((sum, event) => sum + event.releasedCertificates, 0);
  const certificateReleaseRate = generatedCertificates > 0 ? Math.round((releasedCertificates / generatedCertificates) * 100) : 0;
  const feedbackSummaries = filtered
    .map(event => getEventFeedbackSummary(event.id))
    .filter((summary): summary is FeedbackSummary => Boolean(summary));
  const feedbackResponses = feedbackSummaries.reduce((sum, summary) => sum + summary.totalResponses, 0);
  const averageFeedbackRating = feedbackSummaries.length > 0
    ? (feedbackSummaries.reduce((sum, summary) => sum + summary.averageRating, 0) / feedbackSummaries.length).toFixed(1)
    : '0.0';
  const averageFeedbackResponseRate = feedbackSummaries.length > 0
    ? Math.round(feedbackSummaries.reduce((sum, summary) => sum + summary.responseRate, 0) / feedbackSummaries.length)
    : 0;

  const departmentData = Array.from(new Set(filtered.map(event => event.department))).map(department => ({
    dept: department.split(' ').map(word => word[0]).join('').slice(0, 6),
    events: filtered.filter(event => event.department === department).length,
    participants: filtered.filter(event => event.department === department).reduce((sum, event) => sum + event.registrationCount, 0),
  }));

  const categoryData = EVENT_CATEGORIES.map(category => ({
    name: category,
    value: filtered.filter(event => event.category === category).length,
    color: getCategoryColor(category),
  })).filter(item => item.value > 0);

  const modalityData = modalities
    .filter((item): item is Modality => item !== 'All')
    .map(modality => ({
      name: modality,
      value: filtered.filter(event => event.modality === modality).length,
      color: modality === 'Onsite' ? C.maroon : modality === 'Online' ? C.teal : C.green,
    }))
    .filter(item => item.value > 0);

  const attendanceTrend = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => {
    const records = filtered.filter(event => new Date(event.startDate).toLocaleString('en-PH', { month: 'short' }) === month);
    const registered = records.reduce((sum, event) => sum + event.registrationCount, 0);
    const checkedIn = records.reduce((sum, event) => sum + event.checkedIn, 0);
    return { month, rate: registered > 0 ? Math.round((checkedIn / registered) * 100) : 0 };
  });

  const mostActiveDepartment = departmentData.length > 0
    ? departmentData.reduce((top, item) => item.events > top.events ? item : top, departmentData[0]).dept
    : 'None';

  const handleAction = (action: string) => {
    setFeedback(`${action} completed for the selected report filters.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Reports</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Generate CMO monitoring reports for events, participation, approvals, and certificates.</p>
      </div>

      <div className="bg-white rounded-2xl border p-4 grid sm:grid-cols-2 xl:grid-cols-6 gap-3" style={{ borderColor: C.border }}>
        <label className="block">
          <span className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>Start Date</span>
          <input type="date" value={filters.startDate} onChange={event => setFilters({ ...filters, startDate: event.target.value })} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: C.border, color: C.text }} />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>End Date</span>
          <input type="date" value={filters.endDate} onChange={event => setFilters({ ...filters, endDate: event.target.value })} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: C.border, color: C.text }} />
        </label>
        {[
          { key: 'department' as const, label: 'Department or Office', values: departments },
          { key: 'category' as const, label: 'Category', values: ['All', ...EVENT_CATEGORIES] },
          { key: 'status' as const, label: 'Status', values: statuses },
          { key: 'modality' as const, label: 'Modality', values: modalities },
        ].map(field => (
          <label key={field.key} className="block">
            <span className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>{field.label}</span>
            <select
              value={filters[field.key]}
              onChange={event => setFilters({ ...filters, [field.key]: event.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-white"
              style={{ borderColor: C.border, color: C.text }}
            >
              {field.values.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => handleAction('Report generation')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: C.maroon }}>
          <PlayCircle className="w-4 h-4" /> Generate Report
        </button>
        <button type="button" onClick={() => handleAction('PDF export')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: C.goldenrod, color: '#8a6010' }}>
          <FileText className="w-4 h-4" /> Export PDF
        </button>
        <button type="button" onClick={() => handleAction('CSV export')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: C.teal, color: C.teal }}>
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {feedback && (
        <div className="rounded-2xl border p-3 text-sm font-semibold" style={{ borderColor: `${C.green}30`, backgroundColor: `${C.green}08`, color: C.green }}>
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <SummaryCard label="Total Events" value={filtered.length} helper="Within selected filters" />
        <SummaryCard label="Total Participants" value={totalParticipants} helper="Registered participants" />
        <SummaryCard label="Average Attendance Rate" value={`${avgAttendance}%`} helper="Checked in vs registered" />
        <SummaryCard label="Most Active Departments" value={mostActiveDepartment} helper="By event count" />
        <SummaryCard label="Pending Approvals" value={pendingApprovals} helper="Submitted or under review" />
        <SummaryCard label="Returned Events" value={returnedEvents} helper="For organizer revision" />
        <SummaryCard label="Rejected Events" value={rejectedEvents} helper="Not approved" />
        <SummaryCard label="Published Events" value={publishedEvents} helper="Visible to eligible participants" />
        <SummaryCard label="Completed Events" value={completedEvents} helper="Ended events" />
        <SummaryCard label="Certificate Release Rate" value={`${certificateReleaseRate}%`} helper="Released certificates" />
        <SummaryCard label="Feedback Responses" value={feedbackResponses} helper="Submitted standardized forms" />
        <SummaryCard label="Avg Feedback Rating" value={`${averageFeedbackRating}/5`} helper="Across completed events" />
        <SummaryCard label="Avg Feedback Response Rate" value={`${averageFeedbackResponseRate}%`} helper="Feedback forms submitted" />
      </div>

      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
        <SectionTitle>Events and Participants by Department or Office</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={departmentData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="dept" tick={{ fontSize: 11, fill: C.muted }} />
            <YAxis tick={{ fontSize: 11, fill: C.muted }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} />
            <Bar dataKey="events" name="Events" fill={C.maroon} radius={[4, 4, 0, 0]} />
            <Bar dataKey="participants" name="Participants" fill={C.teal} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <SectionTitle>Events by Category</SectionTitle>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={categoryData} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C.muted }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: C.muted }} width={130} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} />
              <Bar dataKey="value" name="Events" radius={[0, 4, 4, 0]}>
                {categoryData.map(item => <Cell key={item.name} fill={item.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <SectionTitle>Events by Modality</SectionTitle>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={modalityData} cx="50%" cy="50%" outerRadius={78} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`}>
                {modalityData.map(item => <Cell key={item.name} fill={item.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
        <SectionTitle>Attendance Rate Trend</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={attendanceTrend} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: C.muted }} unit="%" />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} />
            <Line type="monotone" dataKey="rate" stroke={C.maroon} strokeWidth={2.5} dot={{ fill: C.maroon, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}