export const C = {
  maroon: '#800000',
  maroonDark: '#5a0000',
  golden: '#FFDF00',
  goldenrod: '#DAA520',
  cream: '#FAF5E3',
  teal: '#00598D',
  slate: '#3F7998',
  coral: '#D85848',
  tangerine: '#EA6948',
  text: '#1c1008',
  sub: '#4a3728',
  muted: '#9a7a5a',
  border: 'rgba(128,0,0,0.10)',
  bg: '#FFFFFF',
};

export type ApprovalStatus = 'Draft' | 'Submitted' | 'Returned with Comments' | 'Approved' | 'Rejected' | 'Published';
export type Modality = 'Onsite' | 'Online' | 'Hybrid';
export type EventType = 'Regular' | 'Schedule-Based';
export type AttendanceStatus = 'Present' | 'Absent' | 'Pending' | 'Not Eligible';
export type CertStatus = 'Generated' | 'Released' | 'Pending' | 'Not Eligible' | 'N/A';
export type RegStatus = 'Confirmed' | 'Waitlisted' | 'Cancelled';

export interface TimeSlot {
  id: string;
  label: string;
  start: string;
  end: string;
  venue: string;
  max: number;
  enrolled: number;
}

export interface OrgEvent {
  id: string;
  title: string;
  tagline: string;
  category: string;
  type: EventType;
  modality: Modality;
  date: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  registrationCount: number;
  waitlistCount: number;
  approvalStatus: ApprovalStatus;
  certTemplateStatus: 'Not Uploaded' | 'Uploaded' | 'Validated';
  slots?: TimeSlot[];
  approvalComment?: string;
  description: string;
}

export interface Registrant {
  id: string;
  name: string;
  email: string;
  department: string;
  program: string;
  eventId: string;
  eventTitle: string;
  regStatus: RegStatus;
  timeSlot: string;
  attendanceStatus: AttendanceStatus;
  certStatus: CertStatus;
}

export interface AttendanceRecord {
  id: string;
  participantName: string;
  email: string;
  eventId: string;
  eventTitle: string;
  modality: Modality;
  checkInTime: string;
  gpsVerified: boolean;
  biometricVerified: boolean;
  csvMatched: boolean;
  attendanceDuration: string;
  status: AttendanceStatus;
}

export interface CertRecord {
  id: string;
  participantName: string;
  email: string;
  eventTitle: string;
  certNumber: string;
  generatedDate: string;
  releasedDate: string;
  status: CertStatus;
}

export const MOCK_EVENTS: OrgEvent[] = [
  {
    id: 'ev1',
    title: 'Introduction to Data Science Workshop',
    tagline: 'Hands-on Python and ML fundamentals',
    category: 'Academic',
    type: 'Schedule-Based',
    modality: 'Hybrid',
    date: '2026-06-10',
    endDate: '2026-06-10',
    location: 'CCIS Lab 301 / Zoom',
    maxParticipants: 60,
    registrationCount: 47,
    waitlistCount: 12,
    approvalStatus: 'Published',
    certTemplateStatus: 'Validated',
    description: 'A full-day workshop covering data science fundamentals using Python, Pandas, and Scikit-learn.',
    slots: [
      { id: 's1', label: 'Morning Session', start: '2026-06-10T08:00', end: '2026-06-10T12:00', venue: 'CCIS Lab 301', max: 30, enrolled: 28 },
      { id: 's2', label: 'Afternoon Session', start: '2026-06-10T13:00', end: '2026-06-10T17:00', venue: 'Zoom', max: 30, enrolled: 19 },
    ],
  },
  {
    id: 'ev2',
    title: 'PUP Leadership Summit 2026',
    tagline: 'Empowering student leaders',
    category: 'Leadership',
    type: 'Regular',
    modality: 'Onsite',
    date: '2026-06-20',
    endDate: '2026-06-21',
    location: 'PUP Main Auditorium',
    maxParticipants: 200,
    registrationCount: 183,
    waitlistCount: 34,
    approvalStatus: 'Approved',
    certTemplateStatus: 'Uploaded',
    description: 'Annual leadership summit bringing together student leaders from all colleges.',
  },
  {
    id: 'ev3',
    title: 'Research Methods Seminar',
    tagline: 'From concept to publication',
    category: 'Academic',
    type: 'Regular',
    modality: 'Online',
    date: '2026-07-05',
    endDate: '2026-07-05',
    location: 'Microsoft Teams',
    maxParticipants: 100,
    registrationCount: 62,
    waitlistCount: 0,
    approvalStatus: 'Submitted',
    certTemplateStatus: 'Not Uploaded',
    description: 'A practical seminar on research design, data collection, and academic writing for graduate students.',
  },
  {
    id: 'ev4',
    title: 'Campus Mental Health Forum',
    tagline: 'Breaking the stigma together',
    category: 'Wellness',
    type: 'Regular',
    modality: 'Hybrid',
    date: '2026-07-15',
    endDate: '2026-07-15',
    location: 'Student Center / Zoom',
    maxParticipants: 150,
    registrationCount: 0,
    waitlistCount: 0,
    approvalStatus: 'Returned with Comments',
    certTemplateStatus: 'Not Uploaded',
    approvalComment: 'Please clarify the list of resource speakers and their credentials. Also, ensure the event description includes a content warning for sensitive topics.',
    description: 'An open forum addressing mental health challenges faced by students and faculty.',
  },
  {
    id: 'ev5',
    title: 'PUP Tech Expo 2026',
    tagline: 'Showcase your innovation',
    category: 'Technology',
    type: 'Regular',
    modality: 'Onsite',
    date: '2026-08-01',
    endDate: '2026-08-02',
    location: 'PUP Gymnasium',
    maxParticipants: 500,
    registrationCount: 0,
    waitlistCount: 0,
    approvalStatus: 'Draft',
    certTemplateStatus: 'Not Uploaded',
    description: 'A two-day technology exhibition featuring student projects, industry demos, and keynote speakers.',
  },
  {
    id: 'ev6',
    title: 'Environmental Awareness Campaign',
    tagline: 'Act now for a sustainable future',
    category: 'Advocacy',
    type: 'Regular',
    modality: 'Onsite',
    date: '2026-05-15',
    endDate: '2026-05-15',
    location: 'PUP Oval',
    maxParticipants: 300,
    registrationCount: 287,
    waitlistCount: 0,
    approvalStatus: 'Published',
    certTemplateStatus: 'Validated',
    description: 'A campus-wide environmental awareness event with tree-planting, clean-up drives, and lectures.',
  },
];

export const MOCK_REGISTRANTS: Registrant[] = [
  { id: 'r1', name: 'Maria Santos', email: 'maria.santos@pup.edu.ph', department: 'CCIS', program: 'Computer Science', eventId: 'ev1', eventTitle: 'Introduction to Data Science Workshop', regStatus: 'Confirmed', timeSlot: 'Morning Session', attendanceStatus: 'Present', certStatus: 'Released' },
  { id: 'r2', name: 'Juan dela Cruz', email: 'juan.delacruz@pup.edu.ph', department: 'CCIS', program: 'Information Technology', eventId: 'ev1', eventTitle: 'Introduction to Data Science Workshop', regStatus: 'Confirmed', timeSlot: 'Afternoon Session', attendanceStatus: 'Present', certStatus: 'Generated' },
  { id: 'r3', name: 'Ana Reyes', email: 'ana.reyes@pup.edu.ph', department: 'CAF', program: 'Accountancy', eventId: 'ev1', eventTitle: 'Introduction to Data Science Workshop', regStatus: 'Waitlisted', timeSlot: 'Morning Session', attendanceStatus: 'Pending', certStatus: 'N/A' },
  { id: 'r4', name: 'Carlo Mendoza', email: 'carlo.mendoza@pup.edu.ph', department: 'CE', program: 'Civil Engineering', eventId: 'ev2', eventTitle: 'PUP Leadership Summit 2026', regStatus: 'Confirmed', timeSlot: '—', attendanceStatus: 'Pending', certStatus: 'Pending' },
  { id: 'r5', name: 'Liza Fernandez', email: 'liza.fernandez@pup.edu.ph', department: 'CAL', program: 'Journalism', eventId: 'ev2', eventTitle: 'PUP Leadership Summit 2026', regStatus: 'Confirmed', timeSlot: '—', attendanceStatus: 'Pending', certStatus: 'Pending' },
  { id: 'r6', name: 'Mark Ramos', email: 'mark.ramos@pup.edu.ph', department: 'CCIS', program: 'Computer Science', eventId: 'ev3', eventTitle: 'Research Methods Seminar', regStatus: 'Confirmed', timeSlot: '—', attendanceStatus: 'Pending', certStatus: 'N/A' },
  { id: 'r7', name: 'Patricia Torres', email: 'patricia.torres@pup.edu.ph', department: 'CBA', program: 'Management', eventId: 'ev3', eventTitle: 'Research Methods Seminar', regStatus: 'Confirmed', timeSlot: '—', attendanceStatus: 'Pending', certStatus: 'N/A' },
  { id: 'r8', name: 'Jose Villanueva', email: 'jose.villanueva@pup.edu.ph', department: 'CE', program: 'Electrical Engineering', eventId: 'ev1', eventTitle: 'Introduction to Data Science Workshop', regStatus: 'Confirmed', timeSlot: 'Morning Session', attendanceStatus: 'Absent', certStatus: 'Not Eligible' },
  { id: 'r9', name: 'Rosa Castillo', email: 'rosa.castillo@pup.edu.ph', department: 'CED', program: 'Elementary Education', eventId: 'ev6', eventTitle: 'Environmental Awareness Campaign', regStatus: 'Confirmed', timeSlot: '—', attendanceStatus: 'Present', certStatus: 'Released' },
  { id: 'r10', name: 'Daniel Cruz', email: 'daniel.cruz@pup.edu.ph', department: 'CCIS', program: 'Information Technology', eventId: 'ev6', eventTitle: 'Environmental Awareness Campaign', regStatus: 'Confirmed', timeSlot: '—', attendanceStatus: 'Present', certStatus: 'Released' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'a1', participantName: 'Maria Santos', email: 'maria.santos@pup.edu.ph', eventId: 'ev1', eventTitle: 'Introduction to Data Science Workshop', modality: 'Hybrid', checkInTime: '2026-06-10 08:02', gpsVerified: true, biometricVerified: true, csvMatched: false, attendanceDuration: '3h 58m', status: 'Present' },
  { id: 'a2', participantName: 'Juan dela Cruz', email: 'juan.delacruz@pup.edu.ph', eventId: 'ev1', eventTitle: 'Introduction to Data Science Workshop', modality: 'Hybrid', checkInTime: '2026-06-10 13:05', gpsVerified: false, biometricVerified: true, csvMatched: true, attendanceDuration: '3h 55m', status: 'Present' },
  { id: 'a3', participantName: 'Jose Villanueva', email: 'jose.villanueva@pup.edu.ph', eventId: 'ev1', eventTitle: 'Introduction to Data Science Workshop', modality: 'Hybrid', checkInTime: '—', gpsVerified: false, biometricVerified: false, csvMatched: false, attendanceDuration: '—', status: 'Absent' },
  { id: 'a4', participantName: 'Rosa Castillo', email: 'rosa.castillo@pup.edu.ph', eventId: 'ev6', eventTitle: 'Environmental Awareness Campaign', modality: 'Onsite', checkInTime: '2026-05-15 08:15', gpsVerified: true, biometricVerified: true, csvMatched: false, attendanceDuration: '5h 10m', status: 'Present' },
  { id: 'a5', participantName: 'Daniel Cruz', email: 'daniel.cruz@pup.edu.ph', eventId: 'ev6', eventTitle: 'Environmental Awareness Campaign', modality: 'Onsite', checkInTime: '2026-05-15 08:30', gpsVerified: true, biometricVerified: true, csvMatched: false, attendanceDuration: '4h 55m', status: 'Present' },
];

export const MOCK_CERTS: CertRecord[] = [
  { id: 'c1', participantName: 'Maria Santos', email: 'maria.santos@pup.edu.ph', eventTitle: 'Introduction to Data Science Workshop', certNumber: 'SIGLA-2026-DS-0001', generatedDate: '2026-06-12', releasedDate: '2026-06-13', status: 'Released' },
  { id: 'c2', participantName: 'Juan dela Cruz', email: 'juan.delacruz@pup.edu.ph', eventTitle: 'Introduction to Data Science Workshop', certNumber: 'SIGLA-2026-DS-0002', generatedDate: '2026-06-12', releasedDate: '—', status: 'Generated' },
  { id: 'c3', participantName: 'Jose Villanueva', email: 'jose.villanueva@pup.edu.ph', eventTitle: 'Introduction to Data Science Workshop', certNumber: '—', generatedDate: '—', releasedDate: '—', status: 'Not Eligible' },
  { id: 'c4', participantName: 'Rosa Castillo', email: 'rosa.castillo@pup.edu.ph', eventTitle: 'Environmental Awareness Campaign', certNumber: 'SIGLA-2026-ENV-0001', generatedDate: '2026-05-17', releasedDate: '2026-05-18', status: 'Released' },
  { id: 'c5', participantName: 'Daniel Cruz', email: 'daniel.cruz@pup.edu.ph', eventTitle: 'Environmental Awareness Campaign', certNumber: 'SIGLA-2026-ENV-0002', generatedDate: '2026-05-17', releasedDate: '2026-05-18', status: 'Released' },
  { id: 'c6', participantName: 'Carlo Mendoza', email: 'carlo.mendoza@pup.edu.ph', eventTitle: 'PUP Leadership Summit 2026', certNumber: '—', generatedDate: '—', releasedDate: '—', status: 'Pending' },
];

export const APPROVAL_STATUS_STYLE: Record<ApprovalStatus, { bg: string; color: string }> = {
  Draft:                   { bg: '#9a7a5a18', color: '#9a7a5a' },
  Submitted:               { bg: '#00598D18', color: '#00598D' },
  'Returned with Comments':{ bg: '#EA694818', color: '#C05020' },
  Approved:                { bg: '#27AE6018', color: '#1a8a44' },
  Rejected:                { bg: '#D8584818', color: '#b03020' },
  Published:               { bg: '#80000015', color: '#800000' },
};

export const CERT_STATUS_STYLE: Record<CertStatus, { bg: string; color: string }> = {
  Generated:    { bg: '#00598D18', color: '#00598D' },
  Released:     { bg: '#27AE6018', color: '#1a8a44' },
  Pending:      { bg: '#DAA52018', color: '#8a6010' },
  'Not Eligible':{ bg: '#D8584818', color: '#b03020' },
  'N/A':        { bg: '#9a7a5a12', color: '#9a7a5a' },
};

export const ATT_STATUS_STYLE: Record<AttendanceStatus, { bg: string; color: string }> = {
  Present:      { bg: '#27AE6018', color: '#1a8a44' },
  Absent:       { bg: '#D8584818', color: '#b03020' },
  Pending:      { bg: '#DAA52018', color: '#8a6010' },
  'Not Eligible':{ bg: '#D8584818', color: '#b03020' },
};
