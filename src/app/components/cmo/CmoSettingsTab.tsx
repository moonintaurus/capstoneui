import { C } from './data';
import { User, Mail, Building2, Shield } from 'lucide-react';

const CMO_ADMIN = { name: 'Atty. Rosario Dela Cruz', initials: 'RD', role: 'CMO Administrator', office: 'Communication Management Office' };

export function CmoSettingsTab() {
  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Settings</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>CMO administrator profile and system preferences.</p>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-4 pb-5 border-b" style={{ borderColor: C.border }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
            {CMO_ADMIN.initials}
          </div>
          <div>
            <p className="font-bold text-base" style={{ color: C.text }}>{CMO_ADMIN.name}</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>{CMO_ADMIN.role} · {CMO_ADMIN.office}</p>
          </div>
        </div>

        {[
          { icon: User, label: 'Full Name', value: CMO_ADMIN.name },
          { icon: Mail, label: 'Email Address', value: 'rosario.delacruz@pup.edu.ph' },
          { icon: Building2, label: 'Office', value: CMO_ADMIN.office },
          { icon: Shield, label: 'Role', value: CMO_ADMIN.role },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C.maroon + '10' }}>
              <Icon className="w-4 h-4" style={{ color: C.maroon }} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: C.muted }}>{label}</p>
              <p className="text-sm" style={{ color: C.text }}>{value}</p>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t" style={{ borderColor: C.border }}>
          <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
            Approval decisions and event status updates are communicated to organizers via email. There is no in-app notification center.
          </p>
        </div>
      </div>
    </div>
  );
}
