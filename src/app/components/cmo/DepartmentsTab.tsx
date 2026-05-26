import { Eye } from 'lucide-react';
import { C, MOCK_DEPARTMENTS } from './data';

export function DepartmentsTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Monitor Department and Office Records</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Track event activity by college, department, or administrative office.</p>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: C.cream }}>
                {['Department / Office', 'Organizers', 'Submitted', 'Approved', 'Ongoing', 'Past Events', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_DEPARTMENTS.map(dept => (
                <tr key={dept.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-sm" style={{ color: C.text }}>{dept.name}</p>
                    <p className="text-xs mt-0.5 font-mono" style={{ color: C.muted }}>{dept.shortName}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: C.sub }}>{dept.organizerCount}</td>
                  <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: C.slate }}>{dept.submittedEvents}</td>
                  <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: '#27AE60' }}>{dept.approvedEvents}</td>
                  <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: dept.ongoingEvents > 0 ? C.teal : C.muted }}>{dept.ongoingEvents}</td>
                  <td className="px-4 py-3.5 text-xs text-center font-semibold" style={{ color: C.muted }}>{dept.pastEvents}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                      backgroundColor: dept.status === 'Active' ? '#27AE6018' : '#9a7a5a12',
                      color: dept.status === 'Active' ? '#1a8a44' : '#9a7a5a',
                    }}>{dept.status}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:bg-stone-50"
                      style={{ borderColor: C.teal, color: C.teal }}>
                      <Eye className="w-3 h-3" /> View Records
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
        {[
          { label: 'Total Departments / Offices', value: MOCK_DEPARTMENTS.length },
          { label: 'Total Organizers', value: MOCK_DEPARTMENTS.reduce((s, d) => s + d.organizerCount, 0) },
          { label: 'Total Submitted Events', value: MOCK_DEPARTMENTS.reduce((s, d) => s + d.submittedEvents, 0) },
          { label: 'Total Approved Events', value: MOCK_DEPARTMENTS.reduce((s, d) => s + d.approvedEvents, 0) },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border p-4" style={{ borderColor: C.border }}>
            <p className="text-2xl font-bold" style={{ color: C.maroon }}>{c.value}</p>
            <p className="text-xs mt-1" style={{ color: C.muted }}>{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
