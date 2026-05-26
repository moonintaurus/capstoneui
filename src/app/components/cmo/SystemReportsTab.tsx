import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { C } from './data';

const deptData = [
  { dept: 'CCIS', events: 5, registered: 334 },
  { dept: 'OSA', events: 3, registered: 217 },
  { dept: 'CE', events: 4, registered: 0 },
  { dept: 'GS', events: 2, registered: 62 },
  { dept: 'CHK', events: 3, registered: 342 },
  { dept: 'GCO', events: 2, registered: 0 },
  { dept: 'CBA', events: 2, registered: 0 },
];

const modalityData = [
  { name: 'Onsite', value: 4, color: C.maroon },
  { name: 'Online', value: 1, color: C.teal },
  { name: 'Hybrid', value: 2, color: '#27AE60' },
];

const categoryData = [
  { name: 'Academic', value: 2 },
  { name: 'Leadership', value: 1 },
  { name: 'Wellness', value: 1 },
  { name: 'Technology', value: 1 },
  { name: 'Sports', value: 1 },
  { name: 'Advocacy', value: 1 },
];

const certData = [
  { name: 'Generated', value: 609, color: C.teal },
  { name: 'Released', value: 595, color: '#27AE60' },
  { name: 'Pending', value: 197, color: '#EA6948' },
  { name: 'Not Eligible', value: 45, color: C.coral },
];

const attTrend = [
  { month: 'Jan', rate: 78 },
  { month: 'Feb', rate: 82 },
  { month: 'Mar', rate: 75 },
  { month: 'Apr', rate: 88 },
  { month: 'May', rate: 91 },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-bold text-sm mb-4" style={{ color: C.text }}>{children}</h3>;
}

export function SystemReportsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>System Reports</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Campus-wide event, participation, and certificate analytics.</p>
      </div>

      {/* Events per department */}
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: C.border }}>
        <SectionTitle>Events & Registrations per Department</SectionTitle>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={deptData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="dept" tick={{ fontSize: 11, fill: C.muted }} />
            <YAxis tick={{ fontSize: 11, fill: C.muted }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="events" name="Events" fill={C.maroon} radius={[4, 4, 0, 0]} />
            <Bar dataKey="registered" name="Registered" fill={C.teal} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Events by modality */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: C.border }}>
          <SectionTitle>Events by Modality</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={modalityData} cx="50%" cy="50%" outerRadius={75} dataKey="value" nameKey="name"
                label={({ name, value }) => `${name}: ${value}`}>
                {modalityData.map(e => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Events by category */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: C.border }}>
          <SectionTitle>Events by Category</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C.muted }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: C.muted }} width={80} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} />
              <Bar dataKey="value" name="Events" fill={C.indigo} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance rate trend */}
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: C.border }}>
        <SectionTitle>Campus Attendance Rate Trend (%)</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={attTrend} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted }} />
            <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: C.muted }} unit="%" />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} formatter={v => [`${v}%`, 'Attendance Rate']} />
            <Line type="monotone" dataKey="rate" stroke={C.maroon} strokeWidth={2.5} dot={{ fill: C.maroon, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Certificate summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: C.border }}>
          <SectionTitle>Certificate Generation Summary</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={certData} cx="50%" cy="50%" outerRadius={75} dataKey="value" nameKey="name"
                label={({ name, value }) => `${name}: ${value}`}>
                {certData.map(e => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border p-6 space-y-3" style={{ borderColor: C.border }}>
          <SectionTitle>Certificate Totals</SectionTitle>
          {certData.map(c => (
            <div key={c.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-sm" style={{ color: C.sub }}>{c.name}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: C.text }}>{c.value.toLocaleString()}</span>
            </div>
          ))}
          <div className="pt-2 border-t" style={{ borderColor: C.border }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: C.sub }}>Total Participants</span>
              <span className="text-sm font-bold" style={{ color: C.maroon }}>{(certData.reduce((s, c) => s + c.value, 0)).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
