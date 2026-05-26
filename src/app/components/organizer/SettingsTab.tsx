import { C } from './data';
import { User, Mail, Building2, Shield } from 'lucide-react';

const ORGANIZER = { name: 'Dr. Andrea Reyes', email: 'andrea.reyes@pup.edu.ph', college: 'College of Computer and Information Sciences', role: 'Organizer' };

export function SettingsTab() {
  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Profile</h2>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-6" style={{ borderColor: C.border }}>
        {/* Avatar */}
        <div className="flex items-center gap-4 pb-6 border-b" style={{ borderColor: C.border }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
            AR
          </div>
          <div>
            <p className="font-bold text-base" style={{ color: C.text }}>{ORGANIZER.name}</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>{ORGANIZER.role} · {ORGANIZER.college}</p>
          </div>
        </div>

        {/* Profile fields */}
        {[
          { icon: User, label: 'Full Name', value: ORGANIZER.name },
          { icon: Mail, label: 'Email Address', value: ORGANIZER.email },
          { icon: Building2, label: 'College / Department', value: ORGANIZER.college },
          { icon: Shield, label: 'Role', value: ORGANIZER.role },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C.maroon + '10' }}>
                <Icon className="w-4 h-4" style={{ color: C.maroon }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold" style={{ color: C.muted }}>{label}</p>
                <p className="text-sm truncate" style={{ color: C.text }}>{value}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t" style={{ borderColor: C.border }}>
          <p className="text-xs" style={{ color: C.muted }}>
            Event updates and approval notifications are delivered via email. There is no in-app notification center.
          </p>
        </div>
      </div>
    </div>
  );
}
