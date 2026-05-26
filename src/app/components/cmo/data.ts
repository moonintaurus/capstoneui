export const C = {
  maroon: '#800000',
  maroonDark: '#5a0000',
  golden: '#FFDF00',
  goldenrod: '#DAA520',
  cream: '#FAF5E3',
  teal: '#00598D',
  indigo: '#2955A3',
  slate: '#3F7998',
  coral: '#D85848',
  text: '#1c1008',
  sub: '#4a3728',
  muted: '#9a7a5a',
  border: 'rgba(128,0,0,0.09)',
  bg: '#FFFFFF',
};

export type ApprovalStatus = 'Submitted' | 'Pending Review' | 'Approved' | 'Rejected' | 'Returned with Comments' | 'Published';
export type Modality = 'Onsite' | 'Online' | 'Hybrid';
export type EventType = 'Regular' | 'Schedule-Based';
export type CertTemplateStatus = 'Not Uploaded' | 'Uploaded' | 'Validated';

export interface CmoEvent {
  id: string;
  title: string;
  tagline: string;
  description: string;
  organizer: string;
  organizerEmail: string;
  department: string;
  category: string;
  type: EventType;
  modality: Modality;
  venue: string;
  startDate: string;
  endDate: string;
  capacity: number;
  registrationCount: number;
  waitlistCount: number;
  checkedIn: number;
  dateSubmitted: string;
  dateCreated: string;
  dateUpdated: string;
  approvalStatus: ApprovalStatus;
  certTemplateStatus: CertTemplateStatus;
  exclusivity: string;
  requirements: string;
  returnComment?: string;
  rejectReason?: string;
  slots?: { id: string; label: string; start: string; end: string; venue: string; capacity: number; enrolled: number }[];
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  organizerCount: number;
  submittedEvents: number;
  approvedEvents: number;
  ongoingEvents: number;
  pastEvents: number;
  status: 'Active' | 'Inactive';
}

export interface CertSummary {
  id: string;
  eventTitle: string;
  organizer: string;
  department: string;
  certTemplateStatus: CertTemplateStatus;
  generated: number;
  released: number;
  pending: number;
  notEligible: number;
}

export const MOCK_CMO_EVENTS: CmoEvent[] = [
  {
    id: 'ce1',
    title: 'Introduction to Data Science Workshop',
    tagline: 'Hands-on Python and ML fundamentals',
    description: 'A full-day workshop covering data science fundamentals using Python, Pandas, and Scikit-learn. Open to all college students with basic programming knowledge.',
    organizer: 'Dr. Andrea Reyes',
    organizerEmail: 'andrea.reyes@pup.edu.ph',
    department: 'College of Computer and Information Sciences',
    category: 'Academic',
    type: 'Schedule-Based',
    modality: 'Hybrid',
    venue: 'CCIS Lab 301 / Zoom',
    startDate: '2026-06-10T08:00',
    endDate: '2026-06-10T17:00',
    capacity: 60,
    registrationCount: 47,
    waitlistCount: 12,
    checkedIn: 39,
    dateSubmitted: '2026-05-20',
    dateCreated: '2026-05-18',
    dateUpdated: '2026-05-20',
    approvalStatus: 'Published',
    certTemplateStatus: 'Validated',
    exclusivity: 'Open to All',
    requirements: 'Laptop with Python installed. Basic knowledge of programming is recommended.',
    slots: [
      { id: 's1', label: 'Morning Session', start: '2026-06-10T08:00', end: '2026-06-10T12:00', venue: 'CCIS Lab 301', capacity: 30, enrolled: 28 },
      { id: 's2', label: 'Afternoon Session', start: '2026-06-10T13:00', end: '2026-06-10T17:00', venue: 'Zoom', capacity: 30, enrolled: 19 },
    ],
  },
  {
    id: 'ce2',
    title: 'PUP Leadership Summit 2026',
    tagline: 'Empowering student leaders across campuses',
    description: 'Annual leadership summit bringing together student leaders from all PUP colleges for workshops, panel discussions, and networking.',
    organizer: 'Prof. Ramon Castillo',
    organizerEmail: 'ramon.castillo@pup.edu.ph',
    department: 'Office of Student Affairs',
    category: 'Leadership',
    type: 'Regular',
    modality: 'Onsite',
    venue: 'PUP Main Auditorium',
    startDate: '2026-06-20T08:00',
    endDate: '2026-06-21T17:00',
    capacity: 200,
    registrationCount: 183,
    waitlistCount: 34,
    checkedIn: 0,
    dateSubmitted: '2026-05-15',
    dateCreated: '2026-05-10',
    dateUpdated: '2026-05-15',
    approvalStatus: 'Approved',
    certTemplateStatus: 'Uploaded',
    exclusivity: 'Open to All',
    requirements: 'Must be an elected or appointed student officer.',
  },
  {
    id: 'ce3',
    title: 'Research Methods Seminar',
    tagline: 'From concept to peer-reviewed publication',
    description: 'A practical seminar on research design, data collection, statistical analysis, and academic writing for graduate students and faculty researchers.',
    organizer: 'Dr. Maria Santos',
    organizerEmail: 'maria.santos@pup.edu.ph',
    department: 'Graduate School',
    category: 'Academic',
    type: 'Regular',
    modality: 'Online',
    venue: 'Microsoft Teams',
    startDate: '2026-07-05T09:00',
    endDate: '2026-07-05T17:00',
    capacity: 100,
    registrationCount: 62,
    waitlistCount: 0,
    checkedIn: 0,
    dateSubmitted: '2026-05-22',
    dateCreated: '2026-05-20',
    dateUpdated: '2026-05-22',
    approvalStatus: 'Submitted',
    certTemplateStatus: 'Not Uploaded',
    exclusivity: 'Graduate Students and Faculty',
    requirements: 'Must be enrolled in a graduate program or a full-time faculty member.',
  },
  {
    id: 'ce4',
    title: 'Campus Mental Health Forum',
    tagline: 'Breaking the stigma — together',
    description: 'An open forum addressing mental health challenges faced by students and faculty, featuring licensed psychologists and student advocates.',
    organizer: 'Ms. Liza Flores',
    organizerEmail: 'liza.flores@pup.edu.ph',
    department: 'Guidance and Counseling Office',
    category: 'Wellness',
    type: 'Regular',
    modality: 'Hybrid',
    venue: 'Student Center / Zoom',
    startDate: '2026-07-15T13:00',
    endDate: '2026-07-15T17:00',
    capacity: 150,
    registrationCount: 0,
    waitlistCount: 0,
    checkedIn: 0,
    dateSubmitted: '2026-05-21',
    dateCreated: '2026-05-18',
    dateUpdated: '2026-05-21',
    approvalStatus: 'Returned with Comments',
    certTemplateStatus: 'Not Uploaded',
    exclusivity: 'Open to All',
    requirements: 'None.',
    returnComment: 'Please clarify the credentials of the invited resource speakers. The event description must also include a content warning for sensitive topics. Resubmit after revisions.',
  },
  {
    id: 'ce5',
    title: 'PUP Tech Expo 2026',
    tagline: 'Showcase your innovation',
    description: 'A two-day technology exhibition featuring student capstone projects, industry demos, startup pitches, and keynote speakers from the tech industry.',
    organizer: 'Engr. Carlos Mendoza',
    organizerEmail: 'carlos.mendoza@pup.edu.ph',
    department: 'College of Engineering',
    category: 'Technology',
    type: 'Regular',
    modality: 'Onsite',
    venue: 'PUP Gymnasium',
    startDate: '2026-08-01T08:00',
    endDate: '2026-08-02T18:00',
    capacity: 500,
    registrationCount: 0,
    waitlistCount: 0,
    checkedIn: 0,
    dateSubmitted: '2026-05-23',
    dateCreated: '2026-05-22',
    dateUpdated: '2026-05-23',
    approvalStatus: 'Pending Review',
    certTemplateStatus: 'Not Uploaded',
    exclusivity: 'Open to All',
    requirements: 'None.',
  },
  {
    id: 'ce6',
    title: 'Environmental Awareness Campaign',
    tagline: 'Act now for a sustainable future',
    description: 'A campus-wide environmental awareness event featuring tree-planting, clean-up drives, sustainability lectures, and eco-art installations.',
    organizer: 'Dr. Andrea Reyes',
    organizerEmail: 'andrea.reyes@pup.edu.ph',
    department: 'College of Computer and Information Sciences',
    category: 'Advocacy',
    type: 'Regular',
    modality: 'Onsite',
    venue: 'PUP Oval',
    startDate: '2026-05-15T07:00',
    endDate: '2026-05-15T17:00',
    capacity: 300,
    registrationCount: 287,
    waitlistCount: 0,
    checkedIn: 272,
    dateSubmitted: '2026-04-30',
    dateCreated: '2026-04-28',
    dateUpdated: '2026-04-30',
    approvalStatus: 'Published',
    certTemplateStatus: 'Validated',
    exclusivity: 'Open to All',
    requirements: 'None.',
  },
  {
    id: 'ce7',
    title: 'Intramural Sports Festival 2026',
    tagline: 'Play hard, compete fair',
    description: 'Annual intramural sports competition open to all PUP students, covering basketball, volleyball, badminton, chess, and table tennis.',
    organizer: 'Coach Jose Bautista',
    organizerEmail: 'jose.bautista@pup.edu.ph',
    department: 'College of Human Kinetics',
    category: 'Sports',
    type: 'Regular',
    modality: 'Onsite',
    venue: 'PUP Sports Complex',
    startDate: '2026-05-24T07:00',
    endDate: '2026-05-24T18:00',
    capacity: 400,
    registrationCount: 320,
    waitlistCount: 0,
    checkedIn: 298,
    dateSubmitted: '2026-05-01',
    dateCreated: '2026-04-28',
    dateUpdated: '2026-05-01',
    approvalStatus: 'Published',
    certTemplateStatus: 'Validated',
    exclusivity: 'Open to All',
    requirements: 'Must be a currently enrolled PUP student.',
  },
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'College of Computer and Information Sciences', shortName: 'CCIS', organizerCount: 8, submittedEvents: 5, approvedEvents: 4, ongoingEvents: 1, pastEvents: 2, status: 'Active' },
  { id: 'd2', name: 'Office of Student Affairs', shortName: 'OSA', organizerCount: 5, submittedEvents: 3, approvedEvents: 3, ongoingEvents: 0, pastEvents: 1, status: 'Active' },
  { id: 'd3', name: 'Graduate School', shortName: 'GS', organizerCount: 4, submittedEvents: 2, approvedEvents: 1, ongoingEvents: 0, pastEvents: 1, status: 'Active' },
  { id: 'd4', name: 'College of Engineering', shortName: 'CE', organizerCount: 10, submittedEvents: 4, approvedEvents: 2, ongoingEvents: 1, pastEvents: 3, status: 'Active' },
  { id: 'd5', name: 'Guidance and Counseling Office', shortName: 'GCO', organizerCount: 3, submittedEvents: 2, approvedEvents: 1, ongoingEvents: 0, pastEvents: 1, status: 'Active' },
  { id: 'd6', name: 'College of Human Kinetics', shortName: 'CHK', organizerCount: 6, submittedEvents: 3, approvedEvents: 3, ongoingEvents: 1, pastEvents: 2, status: 'Active' },
  { id: 'd7', name: 'College of Business Administration', shortName: 'CBA', organizerCount: 7, submittedEvents: 2, approvedEvents: 2, ongoingEvents: 0, pastEvents: 2, status: 'Active' },
  { id: 'd8', name: 'College of Arts and Letters', shortName: 'CAL', organizerCount: 5, submittedEvents: 1, approvedEvents: 1, ongoingEvents: 0, pastEvents: 1, status: 'Active' },
];

export const MOCK_CERT_SUMMARIES: CertSummary[] = [
  { id: 'cs1', eventTitle: 'Introduction to Data Science Workshop', organizer: 'Dr. Andrea Reyes', department: 'CCIS', certTemplateStatus: 'Validated', generated: 39, released: 32, pending: 7, notEligible: 8 },
  { id: 'cs2', eventTitle: 'PUP Leadership Summit 2026', organizer: 'Prof. Ramon Castillo', department: 'OSA', certTemplateStatus: 'Uploaded', generated: 0, released: 0, pending: 183, notEligible: 0 },
  { id: 'cs3', eventTitle: 'Environmental Awareness Campaign', organizer: 'Dr. Andrea Reyes', department: 'CCIS', certTemplateStatus: 'Validated', generated: 272, released: 265, pending: 7, notEligible: 15 },
  { id: 'cs4', eventTitle: 'Intramural Sports Festival 2026', organizer: 'Coach Jose Bautista', department: 'CHK', certTemplateStatus: 'Validated', generated: 298, released: 298, pending: 0, notEligible: 22 },
  { id: 'cs5', eventTitle: 'Research Methods Seminar', organizer: 'Dr. Maria Santos', department: 'GS', certTemplateStatus: 'Not Uploaded', generated: 0, released: 0, pending: 0, notEligible: 0 },
];

export const APPROVAL_STYLE: Record<ApprovalStatus, { bg: string; color: string }> = {
  'Submitted':              { bg: '#3F799818', color: '#3F7998' },
  'Pending Review':         { bg: '#DAA52018', color: '#8a6010' },
  'Approved':               { bg: '#27AE6018', color: '#1a8a44' },
  'Rejected':               { bg: '#D8584818', color: '#b03020' },
  'Returned with Comments': { bg: '#EA694818', color: '#C05020' },
  'Published':              { bg: '#80000015', color: '#800000' },
};

export const CERT_STYLE: Record<CertTemplateStatus, { bg: string; color: string }> = {
  'Not Uploaded': { bg: '#9a7a5a12', color: '#9a7a5a' },
  'Uploaded':     { bg: '#00598D18', color: '#00598D' },
  'Validated':    { bg: '#27AE6018', color: '#1a8a44' },
};
