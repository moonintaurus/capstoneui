import { useState } from 'react';
import { Link } from 'react-router';
import {
  Calendar,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Globe,
  Fingerprint,
  Menu,
  X,
  Search,
} from 'lucide-react';

const MAROON = '#800000';
const MAROON_DARK = '#5a0000';
const GOLDEN = '#FFDF00';
const GOLDENROD = '#DAA520';
const MUTED_GOLD = '#D4A054';
const DEEP_TEAL = '#00598D';
const TANGERINE = '#EA6948';

const TRAJAN = '"Trajan Pro 3", serif';
const MONTSERRAT = 'Montserrat, Helvetica, Arial, sans-serif';

const events = [
  {
    id: 1,
    title: 'Tech Innovation Summit 2026',
    modality: 'Hybrid',
    category: 'Technology',
    date: 'June 15, 2026',
    slots: 45,
    totalSlots: 100,
    hasCertificate: true,
    color: DEEP_TEAL,
  },
  {
    id: 2,
    title: 'Leadership & Communication Workshop',
    modality: 'On-site',
    category: 'Leadership',
    date: 'June 20, 2026',
    slots: 12,
    totalSlots: 50,
    hasCertificate: true,
    color: MAROON,
  },
  {
    id: 3,
    title: 'Community Service Day',
    modality: 'On-site',
    category: 'Community',
    date: 'June 25, 2026',
    slots: 28,
    totalSlots: 60,
    hasCertificate: false,
    color: TANGERINE,
  },
  {
    id: 4,
    title: 'Research & Innovation Forum',
    modality: 'Online',
    category: 'Research',
    date: 'July 2, 2026',
    slots: 80,
    totalSlots: 200,
    hasCertificate: true,
    color: MUTED_GOLD,
  },
  {
    id: 5,
    title: 'Arts & Culture Festival',
    modality: 'On-site',
    category: 'Arts',
    date: 'July 10, 2026',
    slots: 34,
    totalSlots: 80,
    hasCertificate: false,
    color: '#9B59B6',
  },
  {
    id: 6,
    title: 'Career Fair & Networking Night',
    modality: 'Hybrid',
    category: 'Career',
    date: 'July 18, 2026',
    slots: 91,
    totalSlots: 150,
    hasCertificate: true,
    color: DEEP_TEAL,
  },
];

const features = [
  {
    icon: Search,
    title: 'Event Discovery',
    description: 'Find university events based on interests, categories, modality, and availability.',
    accent: MAROON,
  },
  {
    icon: CheckCircle2,
    title: 'Fast Registration',
    description: 'Join regular university events with first-come, first-served registration.',
    accent: DEEP_TEAL,
  },
  {
    icon: Fingerprint,
    title: 'Verified Attendance',
    description: 'Support onsite GPS validation and biometric check-in for secure attendance tracking.',
    accent: MAROON,
  },
  {
    icon: Award,
    title: 'Certificate Access',
    description: 'Track certificate status and download released certificates after verification.',
    accent: GOLDENROD,
  },
];

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm font-medium transition-colors duration-200"
      style={{ color: '#4a3020', fontFamily: MONTSERRAT }}
      onMouseEnter={e => (e.currentTarget.style.color = MAROON)}
      onMouseLeave={e => (e.currentTarget.style.color = '#4a3020')}
    >
      {children}
    </a>
  );
}

function CategoryBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: color + '18', color, fontFamily: MONTSERRAT }}
    >
      {label}
    </span>
  );
}

export function Homepage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#FFFFFF',
        fontFamily: MONTSERRAT,
      }}
    >
      <header
        className="sticky top-0 z-50 bg-white"
        style={{ borderBottom: `1px solid rgba(128,0,0,0.08)` }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/PUPLogo.png" alt="PUP Logo" className="w-10 h-10 object-contain" />
            <span
              className="block text-lg"
              style={{
                color: MAROON,
                fontFamily: TRAJAN,
                fontWeight: 400,
                letterSpacing: '0.06em',
              }}
            >
              SIGLA
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="#">Home</NavLink>
            <NavLink href="#events">Events</NavLink>
            <NavLink href="#about">About</NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold border transition-colors duration-200"
              style={{ borderColor: MAROON, color: MAROON, fontFamily: MONTSERRAT }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = MAROON;
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = MAROON;
              }}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: `linear-gradient(135deg, ${MAROON} 0%, ${MAROON_DARK} 100%)`,
                fontFamily: MONTSERRAT,
              }}
            >
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: MAROON }}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t" style={{ borderColor: 'rgba(128,0,0,0.08)' }}>
            <div className="px-6 py-4 flex flex-col gap-4">
              {['Home', 'Events', 'About'].map((label, i) => (
                <a
                  key={label}
                  href={['#', '#events', '#about'][i]}
                  className="text-sm font-medium py-1"
                  style={{ color: '#4a3020', fontFamily: MONTSERRAT }}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </a>
              ))}

              <div className="flex gap-3 pt-2">
                <Link
                  to="/login"
                  className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold border"
                  style={{ borderColor: MAROON, color: MAROON, fontFamily: MONTSERRAT }}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: MAROON, fontFamily: MONTSERRAT }}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-24 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img src="/PUPLogo.png" alt="PUP Logo" className="w-20 h-20 object-contain" />
          </div>

          <h1
            className="mb-6 leading-tight"
            style={{
              fontFamily: TRAJAN,
              fontWeight: 400,
              fontSize: '3.2rem',
              color: MAROON,
              lineHeight: 1.15,
              letterSpacing: '0.02em',
            }}
          >
            Smart Interactive Gateway
            <br />
            for Learning and Activities
            <br />
            (SIGLA)
          </h1>

          <p
            className="text-base leading-relaxed mx-auto mb-10"
            style={{
              color: '#6b5040',
              maxWidth: 760,
              fontFamily: MONTSERRAT,
            }}
          >
            The official event management platform of Polytechnic University of the Philippines for discovering, managing, and participating in campus events.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: `linear-gradient(135deg, ${MAROON} 0%, ${MAROON_DARK} 100%)`,
                fontFamily: MONTSERRAT,
              }}
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#events"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold border transition-all duration-200"
              style={{ borderColor: MAROON, color: MAROON, fontFamily: MONTSERRAT }}
            >
              Browse Events
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2
              className="mb-3"
              style={{
                fontFamily: TRAJAN,
                fontWeight: 400,
                fontSize: '2rem',
                color: MAROON,
                letterSpacing: '0.02em',
              }}
            >
              How SIGLA Works
            </h2>

            <p className="text-base" style={{ color: '#6b5040', fontFamily: MONTSERRAT }}>
              Making the event experience easier for the campus community
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;

              return (
                <div
                  key={i}
                  className="rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1"
                  style={{
                    borderColor: 'rgba(128,0,0,0.08)',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: f.accent + '12' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: f.accent }} />
                  </div>

                  <h3
                    className="text-base font-semibold mb-2"
                    style={{ color: '#1c1008', fontFamily: MONTSERRAT }}
                  >
                    {f.title}
                  </h3>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: '#706050', fontFamily: MONTSERRAT }}
                  >
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="events" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2
                className="mb-2"
                style={{
                  fontFamily: TRAJAN,
                  fontWeight: 400,
                  fontSize: '2rem',
                  color: MAROON,
                  letterSpacing: '0.02em',
                }}
              >
                Featured University Events
              </h2>
              <p style={{ color: '#6b5040', fontFamily: MONTSERRAT }}>
                Log in to register for events.
              </p>
            </div>

            <Link
              to="/register"
              className="flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: MAROON, fontFamily: MONTSERRAT }}
            >
              View all events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(ev => (
              <div
                key={ev.id}
                className="rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-white"
                style={{ borderColor: 'rgba(128,0,0,0.08)' }}
              >
                <div className="h-2 w-full" style={{ backgroundColor: ev.color }} />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <CategoryBadge label={ev.category} color={ev.color} />

                    {ev.hasCertificate && (
                      <div
                        className="flex items-center gap-1 text-xs font-medium"
                        style={{ color: GOLDENROD, fontFamily: MONTSERRAT }}
                      >
                        <Award className="w-3.5 h-3.5" fill={GOLDENROD} />
                        <span>Certificate</span>
                      </div>
                    )}
                  </div>

                  <h3
                    className="text-base font-semibold mb-3 leading-snug"
                    style={{ color: '#1c1008', fontFamily: MONTSERRAT }}
                  >
                    {ev.title}
                  </h3>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#706050', fontFamily: MONTSERRAT }}>
                      <Globe className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ev.color }} />
                      <span>{ev.modality}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs" style={{ color: '#706050', fontFamily: MONTSERRAT }}>
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ev.color }} />
                      <span>{ev.date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs" style={{ color: '#706050', fontFamily: MONTSERRAT }}>
                      <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ev.color }} />
                      <span>
                        <span
                          className="font-semibold"
                          style={{ color: ev.slots < 20 ? TANGERINE : '#1c1008' }}
                        >
                          {ev.slots}
                        </span>{' '}
                        of {ev.totalSlots} seats remaining
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: '#f0ebe0' }}>
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${((ev.totalSlots - ev.slots) / ev.totalSlots) * 100}%`,
                          backgroundColor: ev.color,
                        }}
                      />
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{ backgroundColor: ev.color + '12', color: ev.color, fontFamily: MONTSERRAT }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = ev.color;
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = ev.color + '12';
                      e.currentTarget.style.color = ev.color;
                    }}
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20"
        style={{
          background: `linear-gradient(135deg, ${MAROON} 0%, ${MAROON_DARK} 60%, #3a0000 100%)`,
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="mb-4 text-white"
            style={{
              fontFamily: TRAJAN,
              fontWeight: 400,
              fontSize: '2rem',
              letterSpacing: '0.02em',
            }}
          >
            Ready to Join SIGLA?
          </h2>

          <p className="mb-8 text-white/80 text-base leading-relaxed" style={{ fontFamily: MONTSERRAT }}>
            Create your account, complete biometric enrollment, and start discovering campus events tailored to you.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${GOLDEN} 0%, ${GOLDENROD} 100%)`,
              color: MAROON,
              fontFamily: MONTSERRAT,
            }}
          >
            Create Your Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer style={{ backgroundColor: '#1a0a00' }}>
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-xl text-white"
                  style={{
                    fontFamily: TRAJAN,
                    fontWeight: 400,
                    letterSpacing: '0.06em',
                  }}
                >
                  SIGLA
                </span>
              </div>

              <p className="text-sm leading-relaxed mb-2" style={{ color: '#c8a870', fontFamily: MONTSERRAT }}>
                Smart Interactive Gateway for Learning and Activities
              </p>

              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: MONTSERRAT }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4 text-white" style={{ fontFamily: MONTSERRAT }}>
                Platform
              </h4>
              <ul className="space-y-2.5">
                {['Browse Events', 'About SIGLA', 'Login'].map(l => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm transition-colors"
                      style={{ color: 'rgba(255,255,255,0.5)', fontFamily: MONTSERRAT }}
                      onMouseEnter={e => (e.currentTarget.style.color = GOLDEN)}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4 text-white" style={{ fontFamily: MONTSERRAT }}>
                Contact us
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: MONTSERRAT }}>
                Phone: (+63 2) 5335-1PUP (5335-1787) or 5335-1777
              </p>
            </div>
          </div>

          <div
            className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: MONTSERRAT }}>
              © 1998-2026 Polytechnic University of the Philippines.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
