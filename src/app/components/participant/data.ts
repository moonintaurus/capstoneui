// ── TYPES ─────────────────────────────────────────────────────────────────

export type EventModality = 'Onsite' | 'Online' | 'Hybrid';
export type EventType = 'Regular';
export type RegistrationStatus = 'Open' | 'Registered' | 'Waitlisted' | 'Full' | 'Cancelled' | 'Closed';
export type CertificateStatus =
  | 'Not Available'
  | 'Feedback Required'
  | 'Pending Verification'
  | 'Template Missing'
  | 'Attendance Not Verified'
  | 'Verified Attended'
  | 'Generating Certificate'
  | 'Released'
  | 'Not Eligible';

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
  venueLatitude?: number;
  venueLongitude?: number;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  remainingSlots: number;
  hasCertificate: boolean;
  registrationStatus: RegistrationStatus;
  hasWaitlist: boolean;
  isRecommended?: boolean;
  tags: string[];
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


// ── STANDARDIZED FEEDBACK SURVEY ──────────────────────────────────────────

export type FeedbackQuestionType = 'Rating' | 'Open Ended';

export interface StandardFeedbackQuestion {
  id: string;
  section: string;
  prompt: string;
  type: FeedbackQuestionType;
  required: boolean;
  scale?: {
    min: number;
    max: number;
    lowLabel: string;
    highLabel: string;
  };
}

export const FEEDBACK_RATING_SCALE = [
  { value: 1, label: 'Strongly Disagree / Very Dissatisfied' },
  { value: 2, label: 'Disagree / Dissatisfied' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree / Satisfied' },
  { value: 5, label: 'Strongly Agree / Very Satisfied' },
] as const;

export const STANDARD_FEEDBACK_QUESTIONS: StandardFeedbackQuestion[] = [
  {
    id: 'fq1',
    section: 'Event Content and Relevance',
    prompt: 'The event objectives were clearly explained.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq2',
    section: 'Event Content and Relevance',
    prompt: 'The topics discussed were relevant to my needs, interests, or role.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq3',
    section: 'Event Content and Relevance',
    prompt: 'The event provided useful knowledge, skills, or information that I can apply.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq4',
    section: 'Speaker and Facilitation',
    prompt: 'The speaker or facilitator explained the topic clearly.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq5',
    section: 'Speaker and Facilitation',
    prompt: 'The speaker or facilitator encouraged participation and engagement.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq6',
    section: 'Speaker and Facilitation',
    prompt: 'The examples, activities, or discussions helped me understand the topic better.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq7',
    section: 'Event Organization and Accessibility',
    prompt: 'The event was well organized and easy to follow.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq8',
    section: 'Event Organization and Accessibility',
    prompt: 'The event schedule, pacing, and duration were appropriate.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq9',
    section: 'Event Organization and Accessibility',
    prompt: 'The venue or online platform was accessible and easy to use.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq10',
    section: 'Event Organization and Accessibility',
    prompt: 'Announcements, reminders, and instructions before or during the event were clear.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq11',
    section: 'Attendance Verification and System Experience',
    prompt: 'The event check-in or attendance verification process was easy to complete.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq12',
    section: 'Attendance Verification and System Experience',
    prompt: 'The system made event registration, attendance, and feedback submission convenient.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq13',
    section: 'Overall Satisfaction',
    prompt: 'Overall, I am satisfied with the event.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Very Dissatisfied', highLabel: 'Very Satisfied' },
  },
  {
    id: 'fq14',
    section: 'Overall Satisfaction',
    prompt: 'I would recommend similar events to other participants.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq15',
    section: 'Open-Ended Feedback',
    prompt: 'What did you like most about the event?',
    type: 'Open Ended',
    required: false,
  },
  {
    id: 'fq16',
    section: 'Open-Ended Feedback',
    prompt: 'What parts of the event should be improved?',
    type: 'Open Ended',
    required: false,
  },
  {
    id: 'fq17',
    section: 'Open-Ended Feedback',
    prompt: 'What topics, activities, or event formats would you like to see in the future?',
    type: 'Open Ended',
    required: false,
  },
  {
    id: 'fq18',
    section: 'Open-Ended Feedback',
    prompt: 'Do you have any additional comments, concerns, or suggestions?',
    type: 'Open Ended',
    required: false,
  },
];

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
    venueLatitude: 14.6535,
    venueLongitude: 121.0517,
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
    tagline: 'Sharpen your leadership edge in one focused seminar',
    description:
      'An intensive workshop designed to develop leadership, communication, and team management skills through focused lectures, activities, and guided group exercises.',
    cover_image: '/coverpage.jpg',
      accentColor: C.maroon,
    organizer: 'Office of Student Services',
    organizerUnit: 'Office of the Vice President for Student Affairs and Services',
    category: 'Leadership',
    eventType: 'Regular',
    exclusivity: 'Open to All',
    modality: 'Onsite',
    location: 'Student Services Building, Room 204',
    venueLatitude: 14.6509,
    venueLongitude: 121.0496,
    startDate: 'June 22, 2026',
    endDate: 'June 22, 2026',
    maxParticipants: 30,
    remainingSlots: 14,
    hasCertificate: true,
    registrationStatus: 'Open',
    hasWaitlist: false,
    tags: ['Leadership', 'Onsite', 'Workshop'],
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
    venueLatitude: 14.6480,
    venueLongitude: 121.0455,
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
    title: 'Career Counseling & Advising Forum',
    tagline: 'Guidance for your career path',
    description:
      'A career development forum with certified advisors covering career goals, resume preparation, job search strategies, and professional development planning.',
    cover_image: '/coverpage.jpg',
      accentColor: C.indigo,
    organizer: 'Alumni Relations and Career Development Office',
    organizerUnit: 'Office of the Vice President for Student Affairs and Services',
    category: 'Career',
    eventType: 'Regular',
    exclusivity: 'Open to All',
    modality: 'Onsite',
    location: 'Career Development Center, Room 102',
    venueLatitude: 14.6512,
    venueLongitude: 121.0475,
    startDate: 'June 25, 2026',
    endDate: 'June 25, 2026',
    maxParticipants: 20,
    remainingSlots: 8,
    hasCertificate: false,
    registrationStatus: 'Open',
    hasWaitlist: true,
    tags: ['Career', 'Onsite', 'Advising'],
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
    venueLatitude: 14.6525,
    venueLongitude: 121.0485,
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
    venueLatitude: 14.6550,
    venueLongitude: 121.0510,
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
  { ...ALL_EVENTS[1], registrationStatus: 'Registered' },
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
  { id: 'cert3', eventTitle: 'Community Outreach & Extension Day', organizer: 'Extension Management Office', eventDate: 'July 5, 2026', category: 'Community', status: 'Feedback Required', accentColor: C.tangerine, hasCertificate: true },
  { id: 'cert4', eventTitle: 'Research Writing & Publication Workshop', organizer: 'Research Management Office', eventDate: 'June 18, 2026', category: 'Research', status: 'Verified Attended', accentColor: C.goldenrod, hasCertificate: true },
  { id: 'cert5', eventTitle: 'Tech Innovation Summit 2026', organizer: 'CCIS', eventDate: 'June 15, 2026', category: 'Technology', status: 'Generating Certificate', accentColor: C.teal, hasCertificate: true },
  { id: 'cert6', eventTitle: 'University Arts Festival', organizer: 'ICTO', eventDate: 'April 10, 2026', category: 'Arts', status: 'Not Eligible', accentColor: C.purple, hasCertificate: true },
  { id: 'cert7', eventTitle: 'Wellness Week — Day 1 Talk', organizer: 'Counseling Office', eventDate: 'June 28, 2026', category: 'Wellness', status: 'Template Missing', accentColor: C.green, hasCertificate: true },
];
