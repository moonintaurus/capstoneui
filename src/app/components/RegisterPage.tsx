import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Eye, EyeOff, Mail, Lock, User, AtSign,
  Shield, ArrowRight, Check, Search, ChevronDown, X
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFingerprint, faMagnifyingGlass, faCertificate } from '@fortawesome/free-solid-svg-icons';
<img src="/PUPLogo.png" alt="PUP Logo" />

const MAROON = '#800000';
const MAROON_DARK = '#5a0000';
const GOLDEN = '#FFDF00';
const GOLDENROD = '#DAA520';
const SOFT_CREAM = '#FAF5E3';
const DEEP_TEAL = '#00598D';
const TANGERINE = '#EA6948';

// ── DATA ────────────────────────────────────────────────────────────────────

const COLLEGES = [
  'Open University System',
  'Graduate School',
  'College of Law',
  'College of Accountancy and Finance',
  'College of Architecture, Design and the Built Environment',
  'College of Arts and Letters',
  'College of Business Administration',
  'College of Computer and Information Sciences',
  'College of Communication',
  'College of Education',
  'College of Engineering',
  'College of Human Kinetics',
  'College of Political Science and Public Administration',
  'College of Science',
  'College of Social Sciences and Development',
  'College of Tourism, Hospitality and Transportation Management',
  'Institute of Technology',
  'Senior High School',
  'Laboratory High School',
];

const PROGRAMS_BY_COLLEGE: Record<string, string[]> = {
  'College of Computer and Information Sciences': ['Computer Science', 'Information Technology'],
  'College of Accountancy and Finance': ['Accountancy', 'Management Accounting', 'Financial Management'],
  'College of Engineering': [
    'Civil Engineering', 'Computer Engineering', 'Electrical Engineering',
    'Electronics Engineering', 'Industrial Engineering', 'Engineering Sciences',
    'Mechanical Engineering', 'Railway Engineering',
  ],
  'College of Communication': [
    'Journalism', 'Broadcast Communication', 'Advertising and Public Relations', 'Communication Research',
  ],
  'College of Business Administration': [
    'Entrepreneurship', 'Marketing Management', 'Office Administration',
    'Human Resource Management', 'Cooperatives and Social Development', 'CBA Graduate Programs',
  ],
  'College of Arts and Letters': [
    'Humanities and Philosophy', 'Performing Arts',
    'English, Foreign Languages and Linguistics', 'Filipinolohiya',
  ],
  'College of Education': [
    'Library and Information Science', 'Elementary and Secondary Education',
    'Business Teacher Education', 'COED Graduate Programs',
  ],
  'College of Science': [
    'Biology', 'Physical Sciences', 'Food Technology',
    'Mathematics and Statistics', 'Nutrition and Dietetics',
  ],
  'College of Social Sciences and Development': ['Sociology and Anthropology', 'History', 'Economics', 'Psychology'],
  'College of Architecture, Design and the Built Environment': ['Architecture', 'Interior Design', 'Environmental Planning'],
  'College of Political Science and Public Administration': [
    'Political Science and International Studies', 'Political Economy',
    'Public Administration and Governance', 'Graduate Programs',
  ],
  'College of Human Kinetics': ['Professional Programs', 'Service Physical Education', 'Sports Science'],
  'College of Tourism, Hospitality and Transportation Management': [
    'Tourism and Transportation Management', 'Hospitality Management',
  ],
  'Institute of Technology': [
    'Civil and Railway Engineering Technology', 'Computer and Electronics Engineering Technology',
    'Electrical and Mechanical Engineering Technology', 'Office Management and Information Technology',
  ],
  'College of Law': ['Juris Doctor Program', 'Master of Laws Program', 'Undergraduate Law Program'],
  'Open University System': [
    'Open and Distance Education', 'Continuing Professional Development',
    'Non-Traditional Studies and ETEEAP', 'Pamantasan Bayan', 'Academic Programs',
  ],
  'Graduate School': ['Graduate School Programs'],
  'Senior High School': ['Senior High School'],
  'Laboratory High School': ['Laboratory High School'],
};

const STAFF_OFFICES = [
  'Office of the University President',
  'Communication Management Office',
  'Special Programs and Projects Office',
  'Internal Audit Office',
  'Office of International Affairs',
  'Office of the Executive Vice President',
  'Information and Communications Technology Office',
  'Inspection Management Office',
  'Institute for Data and Statistical Analysis',
  'Office of the Vice President for Academic Affairs',
  'Office of the University Registrar',
  'University Library',
  'University Quality Assurance Office',
  'Faculty Evaluation Office',
  'National Service Training Program',
  'Office of the Vice President for Planning and Finance',
  'Accounting Department',
  'Budget Services Office',
  'Fund Management Office',
  'Resource Generation Office',
  'Institutional Planning Office',
  'Office of the Vice President for Administration',
  'Human Resource Management Department',
  'Facility Management Office',
  'Medical Services Department',
  'Property and Supplies Management Office',
  'Procurement Management Office',
  'University Records Management Office',
  'Physical Planning and Development Office',
  'General Administrative Support Services',
  'University Security and Safety Office',
  'Disaster Resilience Institute',
  'University Printing Press',
  'Office of the Vice President for Student Affairs and Services',
  'Office of the Student Services',
  'University Center for Culture and the Arts',
  'Alumni Relations and Career Development Office',
  'Office of Scholarship and Financial Assistance',
  'Office of the Counseling and Psychological Services',
  'Sports Development Program Office',
  'Office of the Vice President for Research, Extension and Development',
  'Research Management and Intellectual Property Office',
  'Extension Management Office',
  'Institutional Quality Management Office',
  'Gender-Equity, Diversity, and Social Inclusion Office',
  'Research Publications Office',
  'Technology Business Incubation and Development Office',
  'Office of the Vice President for Campuses',
  'Office of the Campus Director',
  'Office of the Campus Registrar',
  'Accounting Office',
  'Cash Disbursement Office',
  'IT Coordination',
  'Security Office',
  'Medical Services',
];

const INTERESTS = [
  { id: 'technology', label: 'Technology', color: DEEP_TEAL },
  { id: 'arts', label: 'Arts', color: '#9B59B6' },
  { id: 'leadership', label: 'Leadership', color: MAROON },
  { id: 'career', label: 'Career', color: '#2955A3' },
  { id: 'wellness', label: 'Wellness', color: '#27AE60' },
  { id: 'research', label: 'Research', color: GOLDENROD },
  { id: 'community', label: 'Community', color: TANGERINE },
  { id: 'sports', label: 'Sports', color: '#E74C3C' },
];

const GOOGLE_ICON = (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ── SEARCHABLE SELECT ────────────────────────────────────────────────────────

function SearchableSelect({
  label, placeholder, value, onChange, options, required = true, helperText,
}: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean; helperText?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const select = (opt: string) => {
    onChange(opt);
    setOpen(false);
    setQuery('');
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1c1008' }}>
        {label} {required && <span style={{ color: MAROON }}>*</span>}
      </label>

      <button
        type="button"
        onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="w-full flex items-center justify-between pl-4 pr-3 py-3 rounded-xl border text-sm text-left transition-all duration-200 outline-none"
        style={{
          borderColor: open ? MAROON : 'rgba(128,0,0,0.15)',
          backgroundColor: '#faf8f5',
          boxShadow: open ? `0 0 0 3px ${MAROON}12` : 'none',
        }}
      >
        <span style={{ color: value ? '#1c1008' : '#9a7a5a' }} className="truncate flex-1">
          {value || placeholder}
        </span>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {value && (
            <span onClick={clear} className="p-0.5 rounded hover:bg-gray-100" style={{ color: '#9a7a5a' }}>
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ color: '#9a7a5a', transform: open ? 'rotate(180deg)' : '' }} />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-xl shadow-xl border overflow-hidden"
          style={{ borderColor: 'rgba(128,0,0,0.12)', maxHeight: 280 }}>
          <div className="p-2 border-b" style={{ borderColor: 'rgba(128,0,0,0.08)' }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: SOFT_CREAM }}>
              <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#9a7a5a' }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type to search…"
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: '#1c1008' }}
              />
            </div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 220 }}>
            {filtered.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: '#9a7a5a' }}>No results found</p>
            ) : (
              filtered.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => select(opt)}
                  className="w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors duration-100"
                  style={{
                    backgroundColor: value === opt ? MAROON + '10' : 'transparent',
                    color: value === opt ? MAROON : '#1c1008',
                  }}
                  onMouseEnter={e => { if (value !== opt) (e.currentTarget as HTMLElement).style.backgroundColor = '#faf8f5'; }}
                  onMouseLeave={e => { if (value !== opt) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                >
                  <span>{opt}</span>
                  {value === opt && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: MAROON }} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {helperText && <p className="text-xs mt-1.5" style={{ color: '#9a7a5a' }}>{helperText}</p>}
    </div>
  );
}

// ── STEP INDICATOR ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  const labels = ['Account Info', 'Profile Setup', 'Interests', 'Review'];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              style={{
                backgroundColor: i < current ? '#27AE60' : i === current ? MAROON : '#e8e0d8',
                color: i <= current ? '#fff' : '#9a7a5a',
                transform: i === current ? 'scale(1.15)' : 'scale(1)',
                boxShadow: i === current ? `0 4px 12px ${MAROON}40` : 'none',
              }}
            >
              {i < current ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className="hidden sm:block text-xs font-medium whitespace-nowrap"
              style={{ color: i === current ? MAROON : i < current ? '#27AE60' : '#9a7a5a' }}>
              {labels[i]}
            </span>
          </div>
          {i < total - 1 && (
            <div className="w-10 sm:w-14 h-0.5 mb-4 mx-1" style={{ backgroundColor: i < current ? '#27AE60' : '#e8e0d8' }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── INPUT FIELD ──────────────────────────────────────────────────────────────

function InputField({
  label, icon: Icon, type = 'text', placeholder, value, onChange, required = true, hint, rightElement,
}: {
  label: string; icon: React.ElementType; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; required?: boolean; hint?: string;
  rightElement?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1c1008' }}>
        {label} {required && <span style={{ color: MAROON }}>*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors" style={{ color: focused ? MAROON : '#9a7a5a' }} />
        <input
          type={type}
          required={required}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200"
          style={{
            paddingRight: rightElement ? '3rem' : '1rem',
            borderColor: focused ? MAROON : 'rgba(128,0,0,0.15)',
            backgroundColor: '#faf8f5',
            boxShadow: focused ? `0 0 0 3px ${MAROON}12` : 'none',
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {rightElement && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>}
      </div>
      {hint && <p className="text-xs mt-1.5" style={{ color: '#9a7a5a' }}>{hint}</p>}
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [googleLinked, setGoogleLinked] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '', password: '',
    role: '', college: '', program: '', office: '', unitSection: '',
  });

  const set = (k: keyof typeof form) => (v: string) => {
    setForm(f => {
      const next = { ...f, [k]: v };
      // Reset dependent fields when role/college changes
      if (k === 'role') { next.college = ''; next.program = ''; next.office = ''; next.unitSection = ''; }
      if (k === 'college') { next.program = ''; }
      return next;
    });
  };

  const isStudentOrFaculty = form.role === 'Student' || form.role === 'Faculty';
  const isStaff = form.role === 'University Staff';
  const programOptions = form.college ? (PROGRAMS_BY_COLLEGE[form.college] ?? []) : [];

  const toggleInterest = (id: string) =>
    setSelectedInterests(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
    else navigate('/biometric-enrollment');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FFFFFF' }}>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[38%] p-12 relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${MAROON} 0%, ${MAROON_DARK} 60%, #2a0000 100%)` }}>
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ border: `56px solid ${GOLDEN}` }} />
        <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full opacity-10" style={{ border: `36px solid ${GOLDEN}` }} />

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <img src="/PUPLogo.png" className="w-12 h-12 object-contain" style={{ filter: 'brightness(1) invert(0)' }} />
          <div>
            <span className="block text-white font-bold" style={{ fontFamily: '"Trajan Pro 3", Cambria, serif', fontSize: '1.25rem' }}>SIGLA</span>
            <span className="block text-white/60 text-xs">Smart Interactive Gateway for Learning and Activities</span>
          </div>
        </Link>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
            Start Your Campus Journey
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-10">
            Create your SIGLA account to discover personalized campus events, track your attendance, and earn verified digital certificates.
          </p>
          <div className="space-y-5">
            {[
              { icon: faFingerprint, title: 'Verified Identity', desc: 'Biometric enrollment keeps your profile secure and tamper-proof' },
              { icon: faMagnifyingGlass, title: 'Smart Discovery', desc: 'Events matched to your college, program, and personal interests' },
              { icon: faCertificate, title: 'Downloadable Certificates', desc: 'Issued upon meeting event attendance requirements' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                  <FontAwesomeIcon icon={icon} className="w-5 h-5" style={{ color: GOLDEN }} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-white/55 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10" />
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex-1 flex items-start justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-lg">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <img src="/PUPLogo.png" alt="PUP Logo" className="w-10 h-10 object-contain" />
            <span className="font-bold" style={{ fontFamily: '"Trajan Pro 3", Cambria, serif', color: MAROON, fontSize: '1.25rem' }}>SIGLA</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border overflow-visible" style={{ borderColor: 'rgba(128,0,0,0.08)' }}>
            {/* Card header */}
            <div className="px-8 pt-8 pb-5 border-b" style={{ borderColor: 'rgba(128,0,0,0.06)' }}>
              <h1 className="font-bold mb-1" style={{ color: '#1c1008', fontSize: '1.5rem' }}>Create your account</h1>
              <p className="text-sm" style={{ color: '#706050' }}>
                {step === 0 && 'Set up your login credentials.'}
                {step === 1 && 'Tell us about your role and affiliation.'}
                {step === 2 && 'Pick your interests for personalized event discovery.'}
                {step === 3 && 'Review your information before proceeding.'}
              </p>
            </div>

            <div className="px-8 pt-6 pb-2">
              <StepIndicator current={step} total={4} />
            </div>

            <form onSubmit={handleNext} className="px-8 pb-8 space-y-5">

              {/* ── STEP 0: Account Info ── */}
              {step === 0 && (
                <>
                  {/* Google link */}
                  <button
                    type="button"
                    onClick={() => setGoogleLinked(true)}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border text-sm font-semibold transition-all duration-200"
                    style={{
                      borderColor: googleLinked ? '#27AE60' : 'rgba(0,0,0,0.12)',
                      color: googleLinked ? '#27AE60' : '#3c3c3c',
                      backgroundColor: googleLinked ? '#27AE6010' : 'transparent',
                    }}
                  >
                    {googleLinked ? <Check className="w-5 h-5 text-green-600" /> : GOOGLE_ICON}
                    {googleLinked ? 'Google account linked' : 'Continue with Google'}
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(128,0,0,0.1)' }} />
                    <span className="text-xs" style={{ color: '#9a7a5a' }}>or fill in manually</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(128,0,0,0.1)' }} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="First Name" icon={User} placeholder="First Name" value={form.firstName} onChange={set('firstName')} />
                    <InputField label="Last Name" icon={User} placeholder="Last Name" value={form.lastName} onChange={set('lastName')} />
                  </div>
                  <InputField label="Username" icon={AtSign} placeholder="Enter username" value={form.username} onChange={set('username')} hint="Used for event check-in and your SIGLA profile." />
                  <InputField label="Email" icon={Mail} type="email" placeholder="Enter your email address" value={form.email} onChange={set('email')} />
                  <InputField
                    label="Password" icon={Lock} type={showPass ? 'text' : 'password'}
                    placeholder="Min. 8 characters" value={form.password} onChange={set('password')}
                    hint="Use a mix of letters, numbers, and symbols."
                    rightElement={
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ color: '#9a7a5a' }}>
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                </>
              )}

              {/* ── STEP 1: Profile Setup ── */}
              {step === 1 && (
                <>
                  {/* Role */}
                  <SearchableSelect
                    label="Role"
                    placeholder="Select your role"
                    value={form.role}
                    onChange={set('role')}
                    options={['Student', 'Faculty', 'University Staff']}
                    helperText="Your role helps SIGLA personalize event access and registration requirements."
                  />

                  {/* Student / Faculty → College + Program */}
                  {isStudentOrFaculty && (
                    <>
                      <SearchableSelect
                        label="College / Institute / School"
                        placeholder="Select your college, institute, or school"
                        value={form.college}
                        onChange={set('college')}
                        options={COLLEGES}
                      />
                      {form.college && (
                        <SearchableSelect
                          label={form.role === 'Faculty' ? 'Program (optional)' : 'Program'}
                          placeholder="Select your program"
                          value={form.program}
                          onChange={set('program')}
                          options={programOptions}
                          required={form.role === 'Student'}
                          helperText={form.role === 'Faculty' ? 'Faculty may optionally specify a home program or department affiliation.' : undefined}
                        />
                      )}
                    </>
                  )}

                  {/* University Staff → Office/Department + Unit/Section */}
                  {isStaff && (
                    <>
                      <SearchableSelect
                        label="Office / Department"
                        placeholder="Select your office or department"
                        value={form.office}
                        onChange={set('office')}
                        options={STAFF_OFFICES}
                      />
                      <InputField
                        label="Unit / Section"
                        icon={User}
                        placeholder="Select your unit or section"
                        value={form.unitSection}
                        onChange={set('unitSection')}
                        required={false}
                        hint="e.g. Systems Development Unit, HR Operations Section"
                      />
                    </>
                  )}

                  {!form.role && (
                    <div className="rounded-xl p-4 text-sm text-center" style={{ backgroundColor: MAROON + '06', color: '#9a7a5a', border: `1px dashed ${MAROON}20` }}>
                      Select your role above to see the relevant affiliation fields.
                    </div>
                  )}
                </>
              )}

              {/* ── STEP 2: Interests ── */}
              {step === 2 && (
                <>
                  <div>
                    <p className="text-sm mb-1" style={{ color: '#706050' }}>
                      Select topics you're interested in — these power SIGLA's event recommendations for you.
                    </p>
                    <p className="text-xs mb-4" style={{ color: '#9a7a5a' }}>Pick at least one.</p>
                    <div className="flex flex-wrap gap-2.5">
                      {INTERESTS.map(int => {
                        const active = selectedInterests.includes(int.id);
                        return (
                          <button
                            key={int.id}
                            type="button"
                            onClick={() => toggleInterest(int.id)}
                            className="px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200"
                            style={{
                              borderColor: active ? int.color : 'rgba(128,0,0,0.12)',
                              backgroundColor: active ? int.color : 'transparent',
                              color: active ? '#fff' : int.color,
                            }}
                          >
                            {active && <Check className="inline w-3 h-3 mr-1.5" />}
                            {int.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </>
              )}

              {/* ── STEP 3: Review ── */}
              {step === 3 && (
                <>
                  <div
  className="rounded-xl border divide-y overflow-hidden"
  style={{ borderColor: 'rgba(128,0,0,0.10)' }}
>
                    {[
                      ['Name', `${form.firstName} ${form.lastName}`],
                      ['Username', form.username ? `@${form.username}` : '—'],
                      ['Email', form.email || '—'],
                      ['Role', form.role || '—'],
                      ...(isStudentOrFaculty ? [
                        ['College / Institute / School', form.college || '—'],
                        ['Program', form.program || '—'],
                      ] : []),
                      ...(isStaff ? [
                        ['Office / Department', form.office || '—'],
                        ['Unit / Section', form.unitSection || '—'],
                      ] : []),
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-start justify-between px-4 py-3 gap-4">
                        <span className="text-xs font-semibold flex-shrink-0" style={{ color: '#9a7a5a' }}>{k}</span>
                        <span className="text-sm text-right" style={{ color: '#1c1008' }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {selectedInterests.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: '#9a7a5a' }}>Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedInterests.map(id => {
                          const int = INTERESTS.find(i => i.id === id)!;
                          return (
                            <span key={id} className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: int.color }}>
                              {int.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border p-4 flex gap-3" style={{ borderColor: MAROON + '25', backgroundColor: MAROON + '06' }}>
                    <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: MAROON }} />
                    <p className="text-xs leading-relaxed" style={{ color: '#6b5040' }}>
                      After creating your account you'll complete a quick biometric enrollment step. SIGLA does not store raw face images — only encrypted templates.
                      A confirmation email will be sent to <strong style={{ color: '#1c1008' }}>{form.email || 'your email'}</strong>.
                    </p>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className={`flex gap-3 pt-2 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 rounded-xl text-sm font-semibold border transition-all duration-200"
                    style={{ borderColor: MAROON, color: MAROON }}
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200"
                  style={{ background: `linear-gradient(135deg, ${MAROON} 0%, ${MAROON_DARK} 100%)` }}
                >
                  {step < 3 ? 'Continue' : 'Proceed to Biometric Enrollment'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {step === 0 && (
                <p className="text-center text-sm pt-1" style={{ color: '#706050' }}>
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold" style={{ color: MAROON }}>Log in</Link>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
