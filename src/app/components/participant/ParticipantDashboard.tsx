import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Home, Compass, Star, CalendarCheck, Award, Search, ChevronRight, LogOut, User,
} from 'lucide-react';
import { C, ALL_EVENTS } from './data';
import type { Event } from './data';
import { MyEventsTab } from './MyEventsTab';
import { EventModal } from './EventModal';
import { CheckInModal } from './CheckInModal';

type Tab = 'home' | 'explore' | 'recommended' | 'my-events' | 'certificates' | 'profile';

const PARTICIPANT = { name: 'Maria Santos', initials: 'MS', college: 'CCIS', program: 'Computer Science' };
const FILTER_CHIPS = ['All', 'Onsite', 'Online', 'Hybrid', 'Regular', 'Appointment-Based', 'With Certificate'];

const NAV = [
  { id: 'home' as Tab, label: 'Home', icon: Home },
  { id: 'explore' as Tab, label: 'Explore Events', icon: Compass },
  { id: 'recommended' as Tab, label: 'Recommended', icon: Star },
  { id: 'my-events' as Tab, label: 'My Events', icon: CalendarCheck },
  { id: 'certificates' as Tab, label: 'My Certificates', icon: Award },
];

function getEventCover(event: Event) {
  return (
    (event as any).cover_image ||
    (event as any).coverImage ||
    `/event-covers/${event.id || 'default'}.jpg`
  );
}

function Sidebar({ active, onTab }: { active: Tab; onTab: (t: Tab) => void }) {
  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: 'white', borderRight: `1px solid ${C.border}` }}>
      <Link to="/" className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: C.border }}>
        <img src="/PUPLogo.png" alt="PUP Logo" className="w-9 h-9 object-contain flex-shrink-0" />
        <div>
          <span className="block font-bold text-base" style={{ fontFamily: '"Trajan Pro 3", Cambria, serif', color: C.maroon }}>SIGLA</span>
          <span className="block text-xs" style={{ color: C.muted }}>Participant Portal</span>
        </div>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: C.muted }}>Menu</p>
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onTab(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{ backgroundColor: isActive ? C.maroon : 'transparent', color: isActive ? '#fff' : C.sub }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function UserDropdown({ open, onClose, onProfile, onLogOut }: {
  open: boolean; onClose: () => void; onProfile: () => void; onLogOut: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={menuRef} className="absolute right-0 mt-3 w-72 bg-white rounded-2xl border shadow-xl z-50 overflow-hidden" style={{ borderColor: C.border }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
            {PARTICIPANT.initials}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: C.text }}>{PARTICIPANT.name}</p>
            <p className="text-xs" style={{ color: C.muted }}>{PARTICIPANT.program}</p>
          </div>
        </div>
      </div>

      <div className="p-2">
        <button onClick={onProfile} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left" style={{ color: C.text }}>
          <User className="w-4 h-4" /> Profile
        </button>
        <button onClick={onLogOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left" style={{ color: C.coral }}>
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </div>
  );
}

function EventCard({ event, onView }: { event: Event; onView: (event: Event) => void }) {
  const [imgError, setImgError] = useState(false);
  const cover = getEventCover(event);

  return (
    <div className="rounded-2xl border overflow-hidden bg-white hover:shadow-lg transition-all" style={{ borderColor: C.border }}>
      {!imgError ? (
        <img
          src={cover}
          alt={event.title}
          className="w-full h-36 object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-36 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${event.accentColor || C.maroon} 0%, ${C.maroonDark} 100%)` }}>
          <p className="text-white text-sm font-bold text-center px-4">{event.title}</p>
        </div>
      )}

      <div className="p-4">
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: C.maroon + '10', color: C.maroon }}>
            {event.category}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: C.teal + '10', color: C.teal }}>
            {event.modality}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: C.green + '10', color: C.green }}>
            {event.type}
          </span>
        </div>

        <h3 className="font-bold text-sm mb-2" style={{ color: C.text }}>{event.title}</h3>
        <p className="text-xs mb-1" style={{ color: C.muted }}>{event.date}</p>
        <p className="text-xs mb-4" style={{ color: C.muted }}>{event.slotsLeft ?? event.slots} slots left</p>

        <button
          onClick={() => onView(event)}
          className="w-full py-2.5 rounded-xl text-xs font-bold text-white"
          style={{ backgroundColor: C.maroon }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

function HomeDashboardTab({ onViewEvent }: { onViewEvent: (event: Event) => void }) {
  const recommended = ALL_EVENTS.slice(0, 3);
  const upcoming = ALL_EVENTS.slice(0, 3);

  return (
    <div className="space-y-8">
      
      <section>
        <h2 className="font-bold mb-1" style={{ color: C.text }}>Recommended for You</h2>
        <p className="text-xs mb-4" style={{ color: C.muted }}>Based on your interests and recent activity, you might like these events.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {recommended.map(event => <EventCard key={event.id} event={event} onView={onViewEvent} />)}
        </div>
      </section>

      <section>
        <h2 className="font-bold mb-1" style={{ color: C.text }}>Upcoming Events</h2>
        <p className="text-xs mb-4" style={{ color: C.muted }}>Open events you may join soon</p>
        <div className="grid md:grid-cols-3 gap-4">
          {upcoming.map(event => <EventCard key={event.id} event={event} onView={onViewEvent} />)}
        </div>
      </section>
    </div>
  );
}

function ExploreEventsTab({ events, onViewEvent }: { events: Event[]; onViewEvent: (event: Event) => void }) {
  return (
    <div>
      <h2 className="font-bold mb-1" style={{ color: C.text, fontSize: '1.25rem' }}>Explore Events</h2>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Browse all available campus events.</p>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {events.map(event => <EventCard key={event.id} event={event} onView={onViewEvent} />)}
      </div>
    </div>
  );
}

function RecommendedEventsTab({ events, onViewEvent }: { events: Event[]; onViewEvent: (event: Event) => void }) {
  const recommended = events.filter((e: any) =>
    e.recommended || ['Technology', 'Research'].includes(e.category)
  );

  return (
    <div>
      <h2 className="font-bold mb-1" style={{ color: C.text, fontSize: '1.25rem' }}>Recommended Events</h2>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Based on your interests in Technology and Research.</p>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {recommended.map(event => <EventCard key={event.id} event={event} onView={onViewEvent} />)}
      </div>
    </div>
  );
}

function CertificatesTab() {
  return (
    <div>
      <h2 className="font-bold mb-1" style={{ color: C.text, fontSize: '1.25rem' }}>My Certificates</h2>
      <p className="text-sm mb-6" style={{ color: C.muted }}>View and download your released certificates.</p>
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: C.border }}>
        <p className="text-sm" style={{ color: C.muted }}>No released certificates yet.</p>
      </div>
    </div>
  );
}

export function ParticipantDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [checkInEvent, setCheckInEvent] = useState<Event | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const filteredEvents = ALL_EVENTS.filter((event: any) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === 'All' ||
      event.modality === activeFilter ||
      event.type === activeFilter ||
      (activeFilter === 'With Certificate' && event.hasCertificate);
    return matchesSearch && matchesFilter;
  });

  const tabTitle: Record<Tab, string> = {
    home: 'Home',
    explore: 'Explore Events',
    recommended: 'Recommended',
    'my-events': 'My Events',
    certificates: 'My Certificates',
    profile: 'Profile',
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      <Sidebar active={activeTab} onTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 bg-white px-8 py-4 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-xs" style={{ color: C.muted }}>
                {new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="font-bold truncate" style={{ color: C.text, fontSize: '1.15rem' }}>
                Welcome back, <span style={{ color: C.maroon }}>{PARTICIPANT.name.split(' ')[0]}</span> 👋
              </h1>
            </div>

            {(activeTab === 'explore' || activeTab === 'recommended') && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl flex-shrink-0 w-64"
                style={{ backgroundColor: C.cream, border: `1.5px solid ${C.border}` }}>
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: C.muted }} />
                <input
                  type="text"
                  placeholder="Search campus events…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: C.text }}
                />
              </div>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(prev => !prev)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}
              >
                {PARTICIPANT.initials}
              </button>
              <UserDropdown
                open={userMenuOpen}
                onClose={() => setUserMenuOpen(false)}
                onProfile={() => { setUserMenuOpen(false); setActiveTab('profile'); }}
                onLogOut={() => navigate('/login')}
              />
            </div>
          </div>

          {(activeTab === 'explore' || activeTab === 'recommended') && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              {FILTER_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => setActiveFilter(chip)}
                  className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border"
                  style={{
                    backgroundColor: activeFilter === chip ? C.maroon : 'transparent',
                    color: activeFilter === chip ? '#fff' : C.sub,
                    borderColor: activeFilter === chip ? C.maroon : 'rgba(128,0,0,0.15)',
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-7">
          <div className="flex items-center gap-1.5 mb-6 text-xs" style={{ color: C.muted }}>
            <span>SIGLA</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold" style={{ color: C.maroon }}>{tabTitle[activeTab]}</span>
          </div>

          {activeTab === 'home' && <HomeDashboardTab onViewEvent={setSelectedEvent} />}
          {activeTab === 'explore' && <ExploreEventsTab events={filteredEvents} onViewEvent={setSelectedEvent} />}
          {activeTab === 'recommended' && <RecommendedEventsTab events={filteredEvents} onViewEvent={setSelectedEvent} />}
          {activeTab === 'my-events' && <MyEventsTab onCheckIn={setCheckInEvent} />}
          {activeTab === 'certificates' && <CertificatesTab />}

          {activeTab === 'profile' && (
            <div className="max-w-xl">
              <div className="bg-white rounded-2xl border p-8" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-5 mb-8 pb-8 border-b" style={{ borderColor: C.border }}>
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
                    {PARTICIPANT.initials}
                  </div>
                  <div>
                    <h2 className="font-bold text-xl" style={{ color: C.text }}>{PARTICIPANT.name}</h2>
                    <p className="text-sm" style={{ color: C.muted }}>{PARTICIPANT.program} · {PARTICIPANT.college}</p>
                    <p className="text-xs mt-1" style={{ color: C.muted }}>maria.santos@pup.edu.ph</p>
                  </div>
                </div>

                {[
                  ['First Name', 'Maria'],
                  ['Last Name', 'Santos'],
                  ['Username', '@maria.santos'],
                  ['Email', 'maria.santos@pup.edu.ph'],
                  ['Role', 'Student'],
                  ['College / Institute', 'College of Computer and Information Sciences'],
                  ['Program', 'Computer Science'],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
                    <span className="text-xs font-semibold" style={{ color: C.muted }}>{label}</span>
                    <span className="text-sm" style={{ color: C.text }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onRegistered={() => {}} />
      )}

      {checkInEvent && (
        <CheckInModal event={checkInEvent} onClose={() => setCheckInEvent(null)} />
      )}
    </div>
  );
}