import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { C } from './data';

const eventMetrics = [
  { name: 'Data Science WS', registered: 47, attendees: 39, waitlist: 12, certs: 2 },
  { name: 'Leadership Summit', registered: 183, attendees: 0, waitlist: 34, certs: 0 },
  { name: 'Research Seminar', registered: 62, attendees: 0, waitlist: 0, certs: 0 },
  { name: 'Env. Campaign', registered: 287, attendees: 272, waitlist: 0, certs: 272 },
];

const monthlyTrend = [
  { month: 'Jan', registrations: 45 },
  { month: 'Feb', registrations: 82 },
  { month: 'Mar', registrations: 67 },
  { month: 'Apr', registrations: 120 },
  { month: 'May', registrations: 287 },
  { month: 'Jun', registrations: 292 },
];

const certPieData = [
  { name: 'Released', value: 3, color: '#27AE60' },
  { name: 'Generated', value: 1, color: C.teal },
  { name: 'Pending', value: 1, color: C.tangerine },
  { name: 'Not Eligible', value: 1, color: C.coral },
];

const slotData = [
  { slot: 'Morning', enrolled: 28, max: 30 },
  { slot: 'Afternoon', enrolled: 19, max: 30 },
];

const attRateData = [
  { name: 'Data Science WS', rate: 83 },
  { name: 'Env. Campaign', rate: 95 },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-bold text-base mb-4" style={{ color: C.text }}>{children}</h3>;
}

export function ReportsTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Reports</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Analytics and summaries for your events.</p>
      </div>

      {/* Registration vs Attendance bar */}
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: C.border }}>
        <SectionTitle>Registered Participants vs Attendees per Event</SectionTitle>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={eventMetrics} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.muted }} />
            <YAxis tick={{ fontSize: 11, fill: C.muted }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="registered" name="Registered" fill={C.teal} radius={[4, 4, 0, 0]} />
            <Bar dataKey="attendees" name="Attendees" fill={C.maroon} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly registrations line */}
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: C.border }}>
        <SectionTitle>Monthly Registration Trend</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyTrend} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted }} />
            <YAxis tick={{ fontSize: 11, fill: C.muted }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} />
            <Line type="monotone" dataKey="registrations" name="Registrations" stroke={C.maroon} strokeWidth={2.5} dot={{ fill: C.maroon, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Certificate pie */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: C.border }}>
          <SectionTitle>Certificate Status Breakdown</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={certPieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`} labelLine={true}>
                {certPieData.map(entry => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance rate bar */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: C.border }}>
          <SectionTitle>Attendance Rate (%) by Event</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attRateData} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: C.muted }} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: C.muted }} width={120} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} formatter={(v) => [`${v}%`, 'Rate']} />
              <Bar dataKey="rate" name="Attendance Rate" fill={'#27AE60'} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Slot occupancy */}
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: C.border }}>
        <SectionTitle>Slot Occupancy — Data Science Workshop</SectionTitle>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={slotData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="slot" tick={{ fontSize: 12, fill: C.muted }} />
            <YAxis tick={{ fontSize: 12, fill: C.muted }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="max" name="Capacity" fill={C.border.replace('rgba(128,0,0,0.10)', '#e0d0c0')} radius={[4, 4, 0, 0]} />
            <Bar dataKey="enrolled" name="Enrolled" fill={C.maroon} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Waitlist table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
          <h3 className="text-sm font-bold" style={{ color: C.text }}>Waitlist Count per Event</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: C.cream }}>
              {['Event', 'Registered', 'Attendees', 'Waitlist', 'Certs Issued'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold" style={{ color: C.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {eventMetrics.map(r => (
              <tr key={r.name} className="hover:bg-stone-50">
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: C.text }}>{r.name}</td>
                <td className="px-4 py-3 text-xs" style={{ color: C.sub }}>{r.registered}</td>
                <td className="px-4 py-3 text-xs" style={{ color: C.sub }}>{r.attendees || '—'}</td>
                <td className="px-4 py-3 text-xs" style={{ color: r.waitlist > 0 ? C.tangerine : C.muted }}>{r.waitlist || '—'}</td>
                <td className="px-4 py-3 text-xs" style={{ color: C.sub }}>{r.certs || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
