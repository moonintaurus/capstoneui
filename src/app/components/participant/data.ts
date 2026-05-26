// ── TYPES ─────────────────────────────────────────────────────────────────

export type EventModality = 'Onsite' | 'Online' | 'Hybrid';
export type EventType = 'Regular' | 'Appointment-Based';
export type RegistrationStatus = 'Open' | 'Registered' | 'Waitlisted' | 'Full' | 'Cancelled' | 'Closed';
export type CertificateStatus =
  | 'Not Available'
  | 'Survey Required'
  | 'Pending Verification'
  | 'Template Missing'
  | 'Attendance Not Verified'
  | 'Verified Attended'
  | 'Generating Certificate'
  | 'Released'
  | 'Not Eligible';

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  capacity: number;
  remaining: number;
  status: 'Available' | 'Full';
}

export interface Event {
  id: string;
  title: string;
  tagline: string;
  description: string;
  cover_image?: string;
  accentColor: string;
  organizer: string;
  organizerUnit: string;
  category: string;
  eventType: EventType;
  exclusivity: string;
  modality: EventModality;
  location?: string;
  platform?: string;
  platformLink?: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  remainingSlots: number;
  hasCertificate: boolean;
  registrationStatus: RegistrationStatus;
  hasWaitlist: boolean;
  timeSlots?: TimeSlot[];
  isRecommended?: boolean;
  tags: string[];
  selectedSlot?: string;
  isFeatured?: boolean;
}

export interface CertificateRecord {
  id: string;
  eventTitle: string;
  organizer: string;
  eventDate: string;
  category: string;
  status: CertificateStatus;
  accentColor: string;
  hasCertificate: boolean;
}

// ── COLORS ────────────────────────────────────────────────────────────────

export const C = {
  maroon: '#800000',
  maroonDark: '#5a0000',
  golden: '#FFDF00',
  goldenrod: '#DAA520',
  mutedGold: '#D4A054',
  cream: '#FAF5E3',
  teal: '#00598D',
  indigo: '#2955A3',
  coral: '#D85848',
  slate: '#3F7998',
  sky: '#4AADE7',
  tangerine: '#EA6948',
  purple: '#7B4FA6',
  green: '#27AE60',
  text: '#1c1008',
  sub: '#706050',
  muted: '#9a7a5a',
  border: 'rgba(128,0,0,0.10)',
};

export const CATEGORY_COLORS: Record<string, string> = {
  Technology: C.teal,
  Research: C.goldenrod,
  Leadership: C.maroon,
  Career: C.indigo,
  Community: C.tangerine,
  Arts: C.purple,
  Wellness: C.green,
  Sports: C.coral,
  Academic: C.slate,
  Cultural: C.mutedGold,
};

// ── MOCK DATA ─────────────────────────────────────────────────────────────

export const ALL_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Tech Innovation Summit 2026',
    tagline: 'Building the future of campus technology together',
    description:
      'A flagship annual event bringing together students, faculty, and industry leaders to explore emerging technologies, present research, and compete in hackathons. The summit features keynote talks, panel discussions, and hands-on workshops on AI, cloud computing, and software engineering.',
    cover_image: '/coverpage.jpg',
      accentColor: C.teal,
    organizer: 'CCIS Student Council',
    organizerUnit: 'College of Computer and Information Sciences',
    category: 'Technology',
    eventType: 'Regular',
    exclusivity: 'Open to All',
    modality: 'Hybrid',
    location: 'CCIS Auditorium, Main Campus',
    platform: 'Zoom Webinar',
    platformLink: 'https://zoom.us/j/example',
    startDate: 'June 15, 2026 — 8:00 AM',
    endDate: 'June 15, 2026 — 5:00 PM',
    maxParticipants: 200,
    remainingSlots: 45,
    hasCertificate: true,
    registrationStatus: 'Open',
    hasWaitlist: true,
    tags: ['Technology', 'Hybrid', 'Certificate'],
    isRecommended: true,
    isFeatured: true,

  },
  {
    id: 'e2',
    title: 'Leadership Bootcamp 2026',
    tagline: 'Sharpen your leadership edge — one session at a time',
    description:
      'An intensive appointment-based workshop series designed to develop leadership, communication, and team management skills. Each session accommodates a small group for a focused, interactive experience. Choose a time slot that fits your schedule.',
    cover_image: '/coverpage.jpg',
      accentColor: C.maroon,
    organizer: 'Office of Student Services',
    organizerUnit: 'Office of the Vice President for Student Affairs and Services',
    category: 'Leadership',
    eventType: 'Appointment-Based',
    exclusivity: 'Open to All',
    modality: 'Onsite',
    location: 'Student Services Building, Room 204',
    startDate: 'June 22, 2026',
    endDate: 'June 22, 2026',
    maxParticipants: 30,
    remainingSlots: 14,
    hasCertificate: true,
    registrationStatus: 'Open',
    hasWaitlist: false,
    timeSlots: [
      { id: 's1', date: 'June 22, 2026', time: '9:00 AM – 10:30 AM', capacity: 10, remaining: 3, status: 'Available' },
      { id: 's2', date: 'June 22, 2026', time: '11:00 AM – 12:30 PM', capacity: 10, remaining: 0, status: 'Full' },
      { id: 's3', date: 'June 22, 2026', time: '2:00 PM – 3:30 PM', capacity: 10, remaining: 7, status: 'Available' },
    ],
    tags: ['Leadership', 'Onsite', 'Appointment'],
    isRecommended: true,
  },
  {
    id: 'e3',
    title: 'Research Writing & Publication Workshop',
    tagline: 'From idea to indexed journal',
    description:
      'A structured workshop guiding participants through the research writing process — from topic selection and methodology to manuscript preparation and journal submission. Facilitated by experienced faculty researchers and journal editors.',
    cover_image: '/coverpage.jpg',
      accentColor: C.goldenrod,
    organizer: 'Research Management and Intellectual Property Office',
    organizerUnit: 'Office of the Vice President for Research, Extension and Development',
    category: 'Research',
    eventType: 'Regular',
    exclusivity: 'Open to All',
    modality: 'Onsite',
    location: 'Graduate School Building, Room 301',
    startDate: 'June 18, 2026 — 1:00 PM',
    endDate: 'June 18, 2026 — 5:00 PM',
    maxParticipants: 60,
    remainingSlots: 20,
    hasCertificate: true,
    registrationStatus: 'Open',
    hasWaitlist: true,
    tags: ['Research', 'Onsite', 'Certificate'],
    isRecommended: true,
  },
  {
    id: 'e4',
    title: 'Career Counseling & Advising Session',
    tagline: 'One-on-one guidance for your career path',
    description:
      'Book a personal career counseling session with a certified career development advisor. Discuss career goals, resume review, job search strategies, and professional development planning. Strictly appointment-based to ensure individualized attention.',
    cover_image: '/coverpage.jpg',
      accentColor: C.indigo,
    organizer: 'Alumni Relations and Career Development Office',
    organizerUnit: 'Office of the Vice President for Student Affairs and Services',
    category: 'Career',
    eventType: 'Appointment-Based',
    exclusivity: 'Open to All',
    modality: 'Onsite',
    location: 'Career Development Center, Room 102',
    startDate: 'June 25, 2026',
    endDate: 'June 25, 2026',
    maxParticipants: 20,
    remainingSlots: 8,
    hasCertificate: false,
    registrationStatus: 'Open',
    hasWaitlist: true,
    timeSlots: [
      { id: 'c1', date: 'June 25, 2026', time: '9:00 AM – 9:45 AM', capacity: 4, remaining: 1, status: 'Available' },
      { id: 'c2', date: 'June 25, 2026', time: '10:00 AM – 10:45 AM', capacity: 4, remaining: 0, status: 'Full' },
      { id: 'c3', date: 'June 25, 2026', time: '1:00 PM – 1:45 PM', capacity: 4, remaining: 3, status: 'Available' },
      { id: 'c4', date: 'June 25, 2026', time: '2:00 PM – 2:45 PM', capacity: 4, remaining: 4, status: 'Available' },
    ],
    tags: ['Career', 'Onsite', 'Appointment'],
    isRecommended: false,
  },
  {
    id: 'e5',
    title: 'Wellness & Mental Health Awareness Week',
    tagline: 'Your wellbeing matters — take the first step',
    description:
      'A week-long hybrid program featuring talks, interactive sessions, and wellness activities aimed at raising mental health awareness. Topics include stress management, mindfulness, work-life balance, and accessing mental health resources on campus.',
    cover_image: '/coverpage.jpg',
      accentColor: C.green,
    organizer: 'Office of Counseling and Psychological Services',
    organizerUnit: 'Office of the Vice President for Student Affairs and Services',
    category: 'Wellness',
    eventType: 'Regular',
    exclusivity: 'Open to All',
    modality: 'Hybrid',
    location: 'University Amphitheater',
    platform: 'Google Meet',
    startDate: 'June 28, 2026 — 10:00 AM',
    endDate: 'July 2, 2026 — 4:00 PM',
    maxParticipants: 300,
    remainingSlots: 148,
    hasCertificate: false,
    registrationStatus: 'Open',
    hasWaitlist: false,
    tags: ['Wellness', 'Hybrid'],
    isRecommended: false,
  },
  {
    id: 'e6',
    title: 'Online Research Colloquium: AI & Society',
    tagline: 'Examining the human impact of artificial intelligence',
    description:
      'A fully online colloquium bringing together researchers, students, and practitioners to present and discuss studies on the societal implications of AI. Presentations will cover algorithmic bias, AI ethics, digital labor, and policy frameworks.',
    cover_image: '/coverpage.jpg',
      accentColor: C.slate,
    organizer: 'Research Publications Office',
    organizerUnit: 'Office of the Vice President for Research, Extension and Development',
    category: 'Research',
    eventType: 'Regular',
    exclusivity: 'Open to All',
    modality: 'Online',
    platform: 'Zoom Webinar',
    platformLink: 'https://zoom.us/j/example2',
    startDate: 'July 2, 2026 — 2:00 PM',
    endDate: 'July 2, 2026 — 6:00 PM',
    maxParticipants: 500,
    remainingSlots: 302,
    hasCertificate: true,
    registrationStatus: 'Open',
    hasWaitlist: false,
    tags: ['Research', 'Online', 'Certificate'],
    isRecommended: false,
  },
  {
    id: 'e7',
    title: 'Community Outreach & Extension Day',
    tagline: 'Serve, connect, and make a difference',
    description:
      'A community service day organized in partnership with local barangays. Students and faculty volunteers will conduct free tutorial sessions, health monitoring, and livelihood skills workshops for community residents.',
    cover_image: '/coverpage.jpg',
      accentColor: C.tangerine,
    organizer: 'Extension Management Office',
    organizerUnit: 'Office of the Vice President for Research, Extension and Development',
    category: 'Community',
    eventType: 'Regular',
    exclusivity: 'Open to All',
    modality: 'Onsite',
    location: 'Barangay Sta. Mesa Community Hall',
    startDate: 'July 5, 2026 — 7:00 AM',
    endDate: 'July 5, 2026 — 3:00 PM',
    maxParticipants: 80,
    remainingSlots: 32,
    hasCertificate: true,
    registrationStatus: 'Open',
    hasWaitlist: false,
    tags: ['Community', 'Onsite', 'Certificate'],
    isFeatured: true,
    isRecommended: false,
  },
];

export const PAST_EVENTS = [
  {
    id: 'p1',
    title: 'PUP Intramurals 2026',
    category: 'Sports',
    date: 'May 5–9, 2026',
    accentColor: C.coral,
    attended: true,
  },
  {
    id: 'p2',
    title: 'Research & Innovation Forum',
    category: 'Research',
    date: 'April 22, 2026',
    accentColor: C.goldenrod,
    attended: true,
  },
  {
    id: 'p3',
    title: 'University Arts Festival',
    category: 'Arts',
    date: 'April 10–12, 2026',
    accentColor: C.purple,
    attended: false,
  },
  {
    id: 'p4',
    title: 'Career & Entrepreneurship Fair',
    category: 'Career',
    date: 'March 28, 2026',
    accentColor: C.indigo,
    attended: true,
  },
];

export const MY_UPCOMING: Event[] = [
  { ...ALL_EVENTS[0], registrationStatus: 'Registered' },
  { ...ALL_EVENTS[1], registrationStatus: 'Registered', selectedSlot: 'June 22, 2026 — 2:00 PM – 3:30 PM' },
];

export const MY_ONGOING: Event[] = [
  { ...ALL_EVENTS[6], registrationStatus: 'Registered', id: 'ongoing1', title: 'Community Outreach & Extension Day', startDate: 'Today — 7:00 AM', endDate: 'Today — 3:00 PM' },
  { ...ALL_EVENTS[5], registrationStatus: 'Registered', id: 'ongoing2', title: 'Online Research Colloquium: AI & Society', startDate: 'Today — 2:00 PM', endDate: 'Today — 6:00 PM' },
];

export const MY_ATTENDED: (Event & { surveyDone: boolean })[] = [
  { ...ALL_EVENTS[2], id: 'att1', registrationStatus: 'Registered', surveyDone: false },
  { ...ALL_EVENTS[0], id: 'att2', title: 'Leadership Excellence Summit', registrationStatus: 'Registered', startDate: 'May 10, 2026', endDate: 'May 10, 2026', surveyDone: true },
];

export const CERTIFICATE_RECORDS: CertificateRecord[] = [
  { id: 'cert1', eventTitle: 'Leadership Excellence Summit', organizer: 'Office of Student Services', eventDate: 'May 10, 2026', category: 'Leadership', status: 'Released', accentColor: C.maroon, hasCertificate: true },
  { id: 'cert2', eventTitle: 'Online Research Colloquium: AI & Society', organizer: 'CCIS', eventDate: 'July 2, 2026', category: 'Research', status: 'Pending Verification', accentColor: C.slate, hasCertificate: true },
  { id: 'cert3', eventTitle: 'Community Outreach & Extension Day', organizer: 'Extension Management Office', eventDate: 'July 5, 2026', category: 'Community', status: 'Survey Required', accentColor: C.tangerine, hasCertificate: true },
  { id: 'cert4', eventTitle: 'Research Writing & Publication Workshop', organizer: 'Research Management Office', eventDate: 'June 18, 2026', category: 'Research', status: 'Verified Attended', accentColor: C.goldenrod, hasCertificate: true },
  { id: 'cert5', eventTitle: 'Tech Innovation Summit 2026', organizer: 'CCIS', eventDate: 'June 15, 2026', category: 'Technology', status: 'Generating Certificate', accentColor: C.teal, hasCertificate: true },
  { id: 'cert6', eventTitle: 'University Arts Festival', organizer: 'ICTO', eventDate: 'April 10, 2026', category: 'Arts', status: 'Not Eligible', accentColor: C.purple, hasCertificate: true },
  { id: 'cert7', eventTitle: 'Wellness Week — Day 1 Talk', organizer: 'Counseling Office', eventDate: 'June 28, 2026', category: 'Wellness', status: 'Template Missing', accentColor: C.green, hasCertificate: true },
];
