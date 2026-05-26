import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  LayoutDashboard, CalendarDays, PlusCircle, Users, ListOrdered,
  ClipboardList, Award, Upload, BarChart2, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { C } from './data';
import { OverviewTab } from './OverviewTab';
import { MyEventsTab } from './MyEventsTab';
import { RegistrantsTab } from './RegistrantsTab';
import { WaitlistTab } from './WaitlistTab';
import { AttendanceTab } from './AttendanceTab';
import { CertificatesTab } from './CertificatesTab';
import { CsvUploadsTab } from './CsvUploadsTab';
import { ReportsTab } from './ReportsTab';
import { SettingsTab } from './SettingsTab';
import { CreateEventWizard } from './CreateEventWizard';
<img src="/PUPLogo.png" alt="PUP Logo" />;

type Tab = 'overview' | 'my-events' | 'create-event' | 'registrants' | 'waitlist' | 'attendance' | 'certificates' | 'csv-uploads' | 'reports' | 'settings';

const ORGANIZER = { name: 'Dr. Andrea Reyes', initials: 'AR', college: 'CCIS', role: 'Organizer' };

const NAV: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',     label: 'Overview',          icon: LayoutDashboard },
  { id: 'my-events',   label: 'My Events',          icon: CalendarDays },
  { id: 'create-event',label: 'Create Event',       icon: PlusCircle },
  { id: 'registrants', label: 'Registrants',        icon: Users },
  { id: 'waitlist',    label: 'Waitlist',            icon: ListOrdered },
  { id: 'attendance',  label: 'Attendance Records', icon: ClipboardList },
  { id: 'certificates',label: 'Certificates',       icon: Award },
  { id: 'csv-uploads', label: 'CSV Uploads',        icon: Upload },
  { id: 'reports',     label: 'Reports',            icon: BarChart2 },
];

const NAV_BOTTOM: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'settings', label: 'Settings', icon: Settings },
];

const TAB_TITLE: Record<Tab, string> = {
  'overview':     'Overview',
  'my-events':    'My Events',
  'create-event': 'Create Event',
  'registrants':  'Registrants',
  'waitlist':     'Waitlist',
  'attendance':   'Attendance Records',
  'certificates': 'Certificates',
  'csv-uploads':  'CSV Uploads',
  'reports':      'Reports',
  'settings':     'Settings',
};

function NavButton({ id, label, icon: Icon, active, onClick }: { id: Tab; label: string; icon: React.ElementType; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
      style={{ backgroundColor: active ? C.maroon : 'transparent', color: active ? '#fff' : C.sub }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = C.cream; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

export function OrganizerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showCreate, setShowCreate] = useState(false);

  const handleTab = (t: Tab) => {
    if (t === 'create-event') { setShowCreate(true); return; }
    setActiveTab(t);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>

      {/* ── Sidebar ── */}
      <aside className="w-60 flex-shrink-0 flex flex-col h-full overflow-hidden bg-white" style={{ borderRight: `1px solid ${C.border}` }}>
        <Link to="/" className="flex items-center gap-3 px-5 py-5 border-b flex-shrink-0" style={{ borderColor: C.border }}>
          <img src="/PUPLogo.png" alt="PUP Logo" className="w-9 h-9 object-contain flex-shrink-0" />
          <div>
            <span className="block font-bold text-base" style={{ fontFamily: '"Trajan Pro 3", Cambria, serif', color: C.maroon }}>SIGLA</span>
            <span className="block text-xs" style={{ color: C.muted }}>Organizer Portal</span>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: C.muted }}>Menu</p>
          {NAV.map(({ id, label, icon }) => (
            <NavButton key={id} id={id} label={label} icon={icon} active={activeTab === id && id !== 'create-event'} onClick={() => handleTab(id)} />
          ))}
        </nav>

        <div className="px-3 pb-3 pt-2 border-t space-y-0.5 flex-shrink-0" style={{ borderColor: C.border }}>
          {NAV_BOTTOM.map(({ id, label, icon }) => (
            <NavButton key={id} id={id} label={label} icon={icon} active={activeTab === id} onClick={() => handleTab(id)} />
          ))}
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={{ color: C.coral }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = C.coral + '10'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Log Out
          </button>
        </div>

        <div className="mx-3 mb-4 p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
              {ORGANIZER.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate" style={{ color: C.text }}>{ORGANIZER.name}</p>
              <p className="text-xs truncate" style={{ color: C.muted }}>{ORGANIZER.college} · {ORGANIZER.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 bg-white px-8 py-4 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs" style={{ color: C.muted }}>
                {new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="font-bold truncate" style={{ color: C.text, fontSize: '1.15rem' }}>
                Welcome, <span style={{ color: C.maroon }}>{ORGANIZER.name.split(' ').slice(-1)[0]}</span>
              </h1>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
                {ORGANIZER.initials}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-8 py-7">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-6 text-xs" style={{ color: C.muted }}>
            <span>SIGLA</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold" style={{ color: C.maroon }}>{TAB_TITLE[activeTab]}</span>
          </div>

          {activeTab === 'overview'     && <OverviewTab />}
          {activeTab === 'my-events'    && <MyEventsTab />}
          {activeTab === 'registrants'  && <RegistrantsTab />}
          {activeTab === 'waitlist'     && <WaitlistTab />}
          {activeTab === 'attendance'   && <AttendanceTab />}
          {activeTab === 'certificates' && <CertificatesTab />}
          {activeTab === 'csv-uploads'  && <CsvUploadsTab />}
          {activeTab === 'reports'      && <ReportsTab />}
          {activeTab === 'settings'     && <SettingsTab />}
        </main>
      </div>

      {showCreate && (
        <CreateEventWizard
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); setActiveTab('my-events'); }}
        />
      )}
    </div>
  );
}
