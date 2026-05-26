import { useState, useRef, useEffect, type ElementType } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  CheckSquare,
  CalendarClock,
  BarChart2,
  LogOut,
  ChevronRight,
  User,
  Mail,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { C } from './data';
import { CmoOverviewTab } from './OverviewTab';
import { EventApprovalsTab } from './EventApprovalsTab';
import {
  UpcomingEventsTab,
  OngoingEventsTab,
  PastEventsTab,
} from './MonitoringTabs';
import { SystemReportsTab } from './SystemReportsTab';
<img src="/PUPLogo.png" alt="PUP Logo" />

type Tab = 'overview' | 'approvals' | 'monitoring' | 'reports' | 'profile';
type MonitoringTab = 'upcoming' | 'ongoing' | 'past';

const CMO_ADMIN = {
  name: 'Atty. Rosario Dela Cruz',
  initials: 'RD',
  office: 'Communication Management Office',
  role: 'CMO Admin',
  email: 'cmo@sigla.edu.ph',
};

const NAV: { id: Exclude<Tab, 'profile'>; label: string; icon: ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'approvals', label: 'Event Approvals', icon: CheckSquare },
  { id: 'monitoring', label: 'Event Monitoring', icon: CalendarClock },
  { id: 'reports', label: 'System Reports', icon: BarChart2 },
];

const TAB_TITLE: Record<Tab, string> = {
  overview: 'Overview',
  approvals: 'Event Approvals',
  monitoring: 'Event Monitoring',
  reports: 'System Reports',
  profile: 'User Profile',
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
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
      style={{
        backgroundColor: active ? C.maroon : 'transparent',
        color: active ? '#fff' : C.sub,
      }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.backgroundColor = C.cream;
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
        }
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
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-3 w-72 bg-white rounded-2xl border shadow-xl z-50 overflow-hidden"
      style={{ borderColor: C.border }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)`,
            }}
          >
            {CMO_ADMIN.initials}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: C.text }}>
              {CMO_ADMIN.name}
            </p>
            <p className="text-xs truncate" style={{ color: C.muted }}>
              {CMO_ADMIN.office}
            </p>
          </div>
        </div>
      </div>

      <div className="p-2">
        <button
          type="button"
          onClick={onProfile}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
          style={{ color: C.text }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = C.cream;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          }}
        >
          <User className="w-4 h-4" />
          User Profile
        </button>

        <button
          type="button"
          onClick={onLogOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
          style={{ color: C.coral }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = `${C.coral}10`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          }}
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}

function EventMonitoringTab() {
  const [activeMonitoringTab, setActiveMonitoringTab] =
    useState<MonitoringTab>('upcoming');

  const monitoringTabs: { id: MonitoringTab; label: string }[] = [
    { id: 'upcoming', label: 'Upcoming Events' },
    { id: 'ongoing', label: 'Ongoing Events' },
    { id: 'past', label: 'Past Events' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold" style={{ color: C.text }}>
          Event Monitoring
        </h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>
          Monitor upcoming, ongoing, and past campus events in one place.
        </p>
      </div>

      <div
        className="bg-white border rounded-2xl overflow-hidden"
        style={{ borderColor: C.border }}
      >
        <div
          className="flex gap-1 overflow-x-auto px-4 pt-4 border-b"
          style={{ borderColor: C.border }}
        >
          {monitoringTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMonitoringTab(tab.id)}
              className="px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all"
              style={{
                borderColor:
                  activeMonitoringTab === tab.id ? C.maroon : 'transparent',
                color: activeMonitoringTab === tab.id ? C.maroon : C.sub,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeMonitoringTab === 'upcoming' && <UpcomingEventsTab />}
          {activeMonitoringTab === 'ongoing' && <OngoingEventsTab />}
          {activeMonitoringTab === 'past' && <PastEventsTab />}
        </div>
      </div>
    </div>
  );
}

function CmoProfileTab() {
  const profileItems = [
    {
      label: 'Full Name',
      value: CMO_ADMIN.name,
      icon: User,
    },
    {
      label: 'Email Address',
      value: CMO_ADMIN.email,
      icon: Mail,
    },
    {
      label: 'Office',
      value: CMO_ADMIN.office,
      icon: Building2,
    },
    {
      label: 'Role',
      value: CMO_ADMIN.role,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: C.text }}>
          User Profile
        </h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>
          View your account information and assigned office details.
        </p>
      </div>

      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: C.border }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)`,
            }}
          >
            {CMO_ADMIN.initials}
          </div>

          <div>
            <h3 className="text-lg font-bold" style={{ color: C.text }}>
              {CMO_ADMIN.name}
            </h3>
            <p className="text-sm" style={{ color: C.muted }}>
              {CMO_ADMIN.role} · {CMO_ADMIN.office}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {profileItems.map(item => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border p-4 flex items-start gap-3"
                style={{ borderColor: C.border, backgroundColor: C.cream }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${C.maroon}12` }}
                >
                  <Icon className="w-5 h-5" style={{ color: C.maroon }} />
                </div>

                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>
                    {item.label}
                  </p>
                  <p className="text-sm font-bold" style={{ color: C.text }}>
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CmoDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleProfile = () => {
    setUserMenuOpen(false);
    setActiveTab('profile');
  };

  const handleLogOut = () => {
    setUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <aside
        className="w-60 flex-shrink-0 flex flex-col h-full overflow-hidden bg-white"
        style={{ borderRight: `1px solid ${C.border}` }}
      >
        <Link
          to="/"
          className="flex items-center gap-3 px-5 py-5 border-b flex-shrink-0"
          style={{ borderColor: C.border }}
        >
          <img
            src="/PUPLogo.png"
            alt="PUP Logo"
            className="w-9 h-9 object-contain flex-shrink-0"
          />

          <div>
            <span
              className="block font-bold text-base"
              style={{
                fontFamily: '"Trajan Pro 3", Cambria, serif',
                color: C.maroon,
              }}
            >
              SIGLA
            </span>
            <span className="block text-xs" style={{ color: C.muted }}>
              CMO Portal
            </span>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p
            className="px-3 mb-2 text-xs font-bold uppercase tracking-wider"
            style={{ color: C.muted }}
          >
            Menu
          </p>

          {NAV.map(({ id, label, icon }) => (
            <NavBtn
              key={id}
              label={label}
              icon={icon}
              active={activeTab === id}
              onClick={() => setActiveTab(id)}
            />
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className="flex-shrink-0 bg-white px-8 py-4 border-b"
          style={{ borderColor: C.border }}
        >
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs" style={{ color: C.muted }}>
                {new Date().toLocaleDateString('en-PH', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>

              <h1
                className="font-bold"
                style={{ color: C.text, fontSize: '1.1rem' }}
              >
                CMO Admin Portal —{' '}
                <span style={{ color: C.maroon }}>
                  Communication Management Office
                </span>
              </h1>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(prev => !prev)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 transition-opacity hover:opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)`,
                }}
                aria-label="Open user menu"
              >
                {CMO_ADMIN.initials}
              </button>

              <UserDropdown
                open={userMenuOpen}
                onClose={() => setUserMenuOpen(false)}
                onProfile={handleProfile}
                onLogOut={handleLogOut}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-7">
          <div
            className="flex items-center gap-1.5 mb-6 text-xs"
            style={{ color: C.muted }}
          >
            <span>SIGLA</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold" style={{ color: C.maroon }}>
              {TAB_TITLE[activeTab]}
            </span>
          </div>

          {activeTab === 'overview' && <CmoOverviewTab />}
          {activeTab === 'approvals' && <EventApprovalsTab />}
          {activeTab === 'monitoring' && <EventMonitoringTab />}
          {activeTab === 'reports' && <SystemReportsTab />}
          {activeTab === 'profile' && <CmoProfileTab />}
        </main>
      </div>
    </div>
  );
}