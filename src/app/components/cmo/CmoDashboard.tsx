import { useEffect, useRef, useState, type ElementType } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  BarChart2,
  Building2,
  CalendarClock,
  ChevronRight,
  ClipboardCheck,
  Globe2,
  HelpCircle,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  MoreHorizontal,
  Palette,
  ShieldCheck,
  User,
} from 'lucide-react';
import { C, MOCK_CMO_EVENTS, type CmoEvent } from './data';
import { CmoOverviewTab } from './OverviewTab';
import { EventApprovalsTab, PublishedEventsTab } from './EventApprovalsTab';
import {
  MonitoringContent,
} from './MonitoringTabs';
import { SystemReportsTab } from './SystemReportsTab';

type Tab = 'overview' | 'approvals' | 'published' | 'monitoring' | 'reports' | 'profile';

const CMO_ADMIN = {
  name: 'Atty. Rosario Dela Cruz',
  initials: 'RD',
  office: 'Communication Management Office',
  role: 'CMO Admin',
  email: 'cmo@sigla.edu.ph',
};

const NAV: { id: Exclude<Tab, 'profile'>; label: string; icon: ElementType }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'approvals', label: 'Reviews', icon: ClipboardCheck },
  { id: 'published', label: 'Published', icon: Globe2 },
  { id: 'monitoring', label: 'Monitoring', icon: CalendarClock },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
];

const MOBILE_NAV: { id: Tab; label: string; icon: ElementType }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'approvals', label: 'Reviews', icon: ClipboardCheck },
  { id: 'published', label: 'Published', icon: Globe2 },
  { id: 'monitoring', label: 'Monitoring', icon: CalendarClock },
  { id: 'profile', label: 'More', icon: MoreHorizontal },
];

const TAB_TITLE: Record<Tab, string> = {
  overview: 'Dashboard',
  approvals: 'Reviews',
  published: 'Published',
  monitoring: 'Monitoring',
  reports: 'Reports',
  profile: 'Profile',
};

function NavBtn({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: ElementType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
      style={{
        backgroundColor: active ? C.maroon : 'transparent',
        color: active ? '#fff' : C.sub,
      }}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="truncate text-xs font-semibold">{label}</span>
    </button>
  );
}

function UserDropdown({
  open,
  onClose,
  onProfile,
  onLogOut,
}: {
  open: boolean;
  onClose: () => void;
  onProfile: () => void;
  onLogOut: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={menuRef} className="absolute right-0 mt-3 w-72 bg-white rounded-2xl border shadow-xl z-50 overflow-hidden" style={{ borderColor: C.border }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: C.maroon }}>
            {CMO_ADMIN.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: C.text }}>{CMO_ADMIN.name}</p>
            <p className="text-xs truncate" style={{ color: C.muted }}>{CMO_ADMIN.office}</p>
          </div>
        </div>
      </div>

      <div className="p-2">
        <button type="button" onClick={onProfile} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left hover:bg-stone-50" style={{ color: C.text }}>
          <User className="w-4 h-4" />
          Profile
        </button>
        <button type="button" onClick={onLogOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left hover:bg-red-50" style={{ color: C.coral }}>
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}

function EventMonitoringTab({ events }: { events: CmoEvent[] }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
          Monitoring
        </h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>
          Monitor all event records by department, category, status, and modality.
        </p>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: C.border }}>
        <div className="p-4 sm:p-6">
          <MonitoringContent
            sourceEvents={events}
            statusFilter={() => true}
            empty="No events match the current filters."
          />
        </div>
      </div>
    </div>
  );
}

function CmoProfileTab({ onLogOut }: { onLogOut: () => void }) {
  const profileItems = [
    { label: 'Full Name', value: CMO_ADMIN.name, icon: User },
    { label: 'Email Address', value: CMO_ADMIN.email, icon: Mail },
    { label: 'Office', value: CMO_ADMIN.office, icon: Building2 },
    { label: 'Role', value: CMO_ADMIN.role, icon: ShieldCheck },
    { label: 'Permissions', value: 'Review, approve, return, reject, publish, monitor, and export reports', icon: LockKeyhole },
  ];

  const reminders = [
    'Use PUP colors consistently.',
    'Keep logo proportions.',
    'Use Trajan Pro 3 for formal titles.',
    'Use Montserrat for readable interface text.',
    'Do not use the PUP logo as a background.',
    'Maintain professional and accessible communication.',
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Profile</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>CMO personnel profile, support links, and SIGLA communication reminders.</p>
      </div>

      <div className="bg-white rounded-2xl border p-5 sm:p-6" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: C.border }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ backgroundColor: C.maroon }}>
            {CMO_ADMIN.initials}
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: C.text }}>{CMO_ADMIN.name}</h3>
            <p className="text-sm" style={{ color: C.muted }}>{CMO_ADMIN.role} - {CMO_ADMIN.office}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {profileItems.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border p-4 flex items-start gap-3" style={{ borderColor: C.border, backgroundColor: C.cream }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${C.maroon}12` }}>
                  <Icon className="w-5 h-5" style={{ color: C.maroon }} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>{item.label}</p>
                  <p className="text-sm font-bold" style={{ color: C.text }}>{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-5 h-5" style={{ color: C.maroon }} />
            <h3 className="font-bold text-sm" style={{ color: C.text }}>Branding Reminders</h3>
          </div>
          <ul className="space-y-2">
            {reminders.map(item => <li key={item} className="text-sm" style={{ color: C.sub }}>{item}</li>)}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5" style={{ color: C.teal }} />
            <h3 className="font-bold text-sm" style={{ color: C.text }}>Help and Support</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: C.sub }}>
            For access concerns, report generation issues, or event visibility questions, contact the SIGLA administrator through official email channels.
          </p>
        </div>

        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-2 mb-3">
            <LockKeyhole className="w-5 h-5" style={{ color: C.goldenrod }} />
            <h3 className="font-bold text-sm" style={{ color: C.text }}>Privacy and Data Handling</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: C.sub }}>
            Review event records only for CMO responsibilities. Do not expose unnecessary participant-sensitive information.
          </p>
        </div>
      </div>

      <button type="button" onClick={onLogOut} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: C.coral, color: C.coral }}>
        <LogOut className="w-4 h-4" />
        Log Out
      </button>
    </div>
  );
}

export function CmoDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [events, setEvents] = useState<CmoEvent[]>(MOCK_CMO_EVENTS);

  const handleProfile = () => {
    setUserMenuOpen(false);
    setActiveTab('profile');
  };

  const handleLogOut = () => {
    setUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#FFFFFF', fontFamily: 'Montserrat, Helvetica, Arial, sans-serif' }}>
      <aside className="hidden md:flex w-60 flex-shrink-0 flex-col h-full overflow-hidden bg-white" style={{ borderRight: `1px solid ${C.border}` }}>
        <Link to="/" className="flex items-center gap-3 px-5 py-5 border-b flex-shrink-0" style={{ borderColor: C.border }}>
          <img src="/PUPLogo.png" alt="PUP Logo" className="w-9 h-9 object-contain flex-shrink-0" />
          <div>
            <span className="block font-bold text-base" style={{ fontFamily: '"Trajan Pro 3", Cambria, serif', color: C.maroon }}>
              SIGLA
            </span>
            <span className="block text-xs" style={{ color: C.muted }}>CMO Portal</span>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: C.muted }}>Menu</p>
          {NAV.map(({ id, label, icon }) => (
            <NavBtn key={id} label={label} icon={icon} active={activeTab === id} onClick={() => setActiveTab(id)} />
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 bg-white px-4 sm:px-8 py-4 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs" style={{ color: C.muted }}>
                {new Date().toLocaleDateString('en-PH', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <h1 className="font-bold truncate" style={{ color: C.text, fontSize: '1.05rem' }}>
                CMO Dashboard - <span style={{ color: C.maroon }}>Communication Management Office</span>
              </h1>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(prev => !prev)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 transition-opacity hover:opacity-90"
                style={{ backgroundColor: C.maroon }}
                aria-label="Open profile menu"
              >
                {CMO_ADMIN.initials}
              </button>
              <UserDropdown open={userMenuOpen} onClose={() => setUserMenuOpen(false)} onProfile={handleProfile} onLogOut={handleLogOut} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-7 pb-24 md:pb-7">
          <div className="flex items-center gap-1.5 mb-6 text-xs" style={{ color: C.muted }}>
            <span>SIGLA</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold" style={{ color: C.maroon }}>{TAB_TITLE[activeTab]}</span>
          </div>

          {activeTab === 'overview' && <CmoOverviewTab events={events} onNavigate={setActiveTab} />}
          {activeTab === 'approvals' && <EventApprovalsTab events={events} onEventsChange={setEvents} />}
          {activeTab === 'published' && <PublishedEventsTab events={events} onEventsChange={setEvents} />}
          {activeTab === 'monitoring' && <EventMonitoringTab events={events} />}
          {activeTab === 'reports' && <SystemReportsTab events={events} />}
          {activeTab === 'profile' && <CmoProfileTab onLogOut={handleLogOut} />}
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 px-2 py-2 grid grid-cols-5 gap-1" style={{ borderColor: C.border }}>
        {MOBILE_NAV.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              type="button"
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-semibold"
              style={{ color: active ? C.maroon : C.muted, backgroundColor: active ? `${C.maroon}10` : 'transparent' }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
