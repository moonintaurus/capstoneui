import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  BarChart2,
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  User,
} from 'lucide-react';
import { C } from './data';
import { OverviewTab } from './OverviewTab';
import { MyEventsTab } from './MyEventsTab';
import { ReportsTab } from './ReportsTab';
import { CreateEventWizard } from './CreateEventWizard';

type Tab = 'overview' | 'my-events' | 'create-event' | 'reports';
type EventListMode = 'all' | 'csv-verification' | 'participants' | 'certificates' | 'attendance' | 'waitlist';

const DEFAULT_PROFILE = {
  name: 'HR Office',
  email: 'hr.office@pup.edu.ph',
  office: 'Human Resources Office',
  role: 'Organizer',
};

const NAV: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'my-events', label: 'My Events', icon: CalendarDays },
  { id: 'create-event', label: 'Create Event', icon: PlusCircle },
  { id: 'reports', label: 'Event History', icon: BarChart2 },
];

const TAB_TITLE: Record<Tab, string> = {
  overview: 'Overview',
  'my-events': 'My Events',
  'create-event': 'Create Event',
  reports: 'Event History',
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
  const [eventListMode, setEventListMode] = useState<EventListMode>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [profileDraft, setProfileDraft] = useState(DEFAULT_PROFILE);

  const handleTab = (t: Tab) => {
    if (t === 'create-event') {
      setShowCreate(true);
      return;
    }
    if (t === 'my-events') setEventListMode('all');
    setActiveTab(t);
  };

  const openEventSelector = (mode: EventListMode) => {
    setEventListMode(mode);
    setActiveTab('my-events');
  };

  const openProfile = () => {
    setProfileDraft(profile);
    setEditingProfile(false);
    setProfileOpen(open => !open);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#FFFFFF', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <aside className="hidden md:flex w-60 flex-shrink-0 flex-col h-full overflow-hidden bg-white" style={{ borderRight: `1px solid ${C.border}` }}>
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
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 bg-white px-4 md:px-8 py-4 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3 min-w-0">
              <img src="/PUPLogo.png" alt="PUP Logo" className="md:hidden w-9 h-9 object-contain flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs" style={{ color: C.muted }}>
                  {new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <h1 className="font-bold truncate" style={{ color: C.text, fontSize: '1.15rem', fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
                  Welcome, <span style={{ color: C.maroon }}>{profile.name}</span>
                </h1>
              </div>
            </div>
            <div className="relative flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={openProfile}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}
                title="Profile"
              >
                <User className="w-4 h-4" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-80 rounded-2xl border bg-white p-4 shadow-lg z-50" style={{ borderColor: C.border }}>
                  <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: C.border }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: C.text }}>{profile.name}</p>
                      <p className="text-xs truncate" style={{ color: C.muted }}>{profile.office}</p>
                    </div>
                  </div>
                  <div className="py-4 space-y-3">
                    {editingProfile ? (
                      <>
                        {[
                          { label: 'Office Name', key: 'name' as const },
                          { label: 'Email', key: 'email' as const },
                          { label: 'Office', key: 'office' as const },
                          { label: 'Role', key: 'role' as const },
                        ].map(field => (
                          <label key={field.key} className="block">
                            <span className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>{field.label}</span>
                            <input
                              value={profileDraft[field.key]}
                              onChange={e => setProfileDraft(prev => ({ ...prev, [field.key]: e.target.value }))}
                              className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                              style={{ borderColor: C.border, color: C.text }}
                            />
                          </label>
                        ))}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setProfile(profileDraft);
                              setEditingProfile(false);
                            }}
                            className="flex-1 px-3 py-2 rounded-xl text-sm font-bold text-white"
                            style={{ backgroundColor: C.maroon }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setProfileDraft(profile);
                              setEditingProfile(false);
                            }}
                            className="flex-1 px-3 py-2 rounded-xl border text-sm font-semibold"
                            style={{ borderColor: C.border, color: C.sub }}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {[
                          ['Office Name', profile.name],
                          ['Email', profile.email],
                          ['Office', profile.office],
                          ['Role', profile.role],
                        ].map(([label, value]) => (
                          <div key={label} className="flex justify-between gap-4 py-1">
                            <span className="text-xs font-semibold" style={{ color: C.muted }}>{label}</span>
                            <span className="text-sm text-right" style={{ color: C.text }}>{value}</span>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDraft(profile);
                            setEditingProfile(true);
                          }}
                          className="w-full px-3 py-2 rounded-xl border text-sm font-semibold"
                          style={{ borderColor: C.maroon, color: C.maroon }}
                        >
                          Edit Profile
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ color: C.coral, backgroundColor: C.coral + '10' }}
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-5 md:py-7 pb-24 md:pb-7">
          <div className="flex items-center gap-1.5 mb-6 text-xs" style={{ color: C.muted }}>
            <span>SIGLA</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold" style={{ color: C.maroon }}>{TAB_TITLE[activeTab]}</span>
          </div>

          {activeTab === 'overview' && (
            <OverviewTab
              onCreateEvent={() => setShowCreate(true)}
              onReviewParticipants={() => openEventSelector('participants')}
              onManageEvents={() => openEventSelector('all')}
              onReleaseCertificates={() => openEventSelector('certificates')}
              onOpenCsvVerificationList={() => openEventSelector('csv-verification')}
            />
          )}
          {activeTab === 'my-events' && <MyEventsTab listMode={eventListMode} />}
          {activeTab === 'reports' && <ReportsTab />}
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t px-2 py-2 grid grid-cols-4 gap-1 z-40" style={{ borderColor: C.border }}>
        {[
          { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
          { id: 'my-events' as const, label: 'Events', icon: CalendarDays },
          { id: 'create-event' as const, label: 'Create', icon: PlusCircle },
          { id: 'reports' as const, label: 'History', icon: BarChart2 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleTab(id)}
            className="flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold"
            style={{ backgroundColor: activeTab === id && id !== 'create-event' ? C.maroon + '10' : 'transparent', color: activeTab === id && id !== 'create-event' ? C.maroon : C.sub }}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>

      {showCreate && (
        <CreateEventWizard
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            openEventSelector('all');
          }}
        />
      )}
    </div>
  );
}
