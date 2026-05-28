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
  tangerine: '#EA694B',
  purple: '#6A4C93',
  green: '#27AE60',
  text: '#1c1008',
  sub: '#4a3728',
  muted: '#9a7a5a',
  border: 'rgba(128,0,0,0.09)',
  bg: '#FFFFFF',
};

export const EVENT_CATEGORIES = [
  'Supervisor Leadership',
  'GAD',
  'Tech',
  'Disability',
  'DRI',
  'University Activities',
] as const;

export type EventCategory = typeof EVENT_CATEGORIES[number];
export type ApprovalStatus =
  | 'Submitted'
  | 'Pending Review'
  | 'Approved'
  | 'Rejected'
  | 'Returned with Comments'
  | 'Published';
export type Modality = 'Onsite' | 'Online' | 'Hybrid';
export type EventType = 'Regular' | 'Schedule-Based';
export type CertTemplateStatus = 'Not Uploaded' | 'Uploaded' | 'Validated';

export interface TimeSlot {
  id: string;
  label: string;
  start: string;
  end: string;
  venue: string;
  capacity: number;
  enrolled: number;
  waitlisted: number;
  attendanceCount: number;
}

export interface RemarkHistory {
  id: string;
  date: string;
  author: string;
  action: string;
  remarks: string;
}

export interface TimelineEntry {
  label: string;
  date: string;
  done: boolean;
}

export interface CmoEvent {
  id: string;
  title: string;
  tagline: string;
  description: string;
  coverImage: string;
  organizer: string;
  organizerEmail: string;
  department: string;
  category: EventCategory;
  type: EventType;
  modality: Modality;
  venue: string;
  onlinePlatform?: 'Google Meet' | 'Zoom' | 'Microsoft Teams';
  targetAudience: string;
  eligibility: string;
  startDate: string;
  endDate: string;
  capacity: number;
  remainingSlots: number;
  registrationCount: number;
  waitlistCount: number;
  checkedIn: number;
  dateSubmitted: string;
  dateCreated: string;
  dateUpdated: string;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvalComments?: string;
  publishedAt?: string;
  certTemplateStatus: CertTemplateStatus;
  certificateAvailable: boolean;
  surveyRequired: boolean;
  surveyStatus: 'Configured' | 'Not Required' | 'Missing';
  requirements: string;
  attendanceRules: string[];
  waitlistAvailable: boolean;
  slots?: TimeSlot[];
  generatedCertificates: number;
  pendingCertificates: number;
  releasedCertificates: number;
  notEligibleCertificates: number;
  returnComment?: string;
  rejectReason?: string;
  remarksHistory: RemarkHistory[];
  organizerUpdates: string[];
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  organizerCount: number;
  submittedEvents: number;
  publishedEvents: number;
  completedEvents: number;
  averageAttendance: number;
  pendingCertificates: number;
  releasedCertificates: number;
  returnedEvents: number;
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


export type FeedbackQuestionType = 'Rating' | 'Open Ended';
export type FeedbackSummaryStatus = 'Collecting Responses' | 'Ready for Review' | 'Closed' | 'No Responses Yet';
export type FeedbackSentiment = 'Positive' | 'Neutral' | 'Concern';

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

export interface FeedbackRatingDistribution {
  score: number;
  label: string;
  count: number;
}

export interface FeedbackQuestionResult {
  questionId: string;
  prompt: string;
  averageScore: number;
  responseCount: number;
  positiveRate: number;
  distribution: FeedbackRatingDistribution[];
}

export interface FeedbackTheme {
  label: string;
  mentions: number;
  sentiment: FeedbackSentiment;
}

export interface FeedbackOpenEndedAnswer {
  id: string;
  respondentLabel: string;
  submittedAt: string;
  answer: string;
}

export interface FeedbackOpenEndedResult {
  questionId: string;
  prompt: string;
  responseCount: number;
  answers: FeedbackOpenEndedAnswer[];
}

export interface FeedbackSummary {
  eventId: string;
  eventTitle: string;
  status: FeedbackSummaryStatus;
  totalEligible: number;
  totalResponses: number;
  responseRate: number;
  averageRating: number;
  submittedUntil: string;
  questionResults: FeedbackQuestionResult[];
  commonThemes: FeedbackTheme[];
  openEndedResponses: FeedbackOpenEndedResult[];
}

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  'Supervisor Leadership': '#800000',
  GAD: '#D85848',
  Tech: '#00598D',
  Disability: '#6A4C93',
  DRI: '#DAA520',
  'University Activities': '#EA694B',
};

export function getCategoryColor(category: EventCategory) {
  return CATEGORY_COLORS[category] ?? C.maroon;
}

export function getAttendanceRules(modality: Modality) {
  if (modality === 'Onsite') {
    return ['GPS/geofencing validation', 'Face biometric check-in'];
  }
  if (modality === 'Online') {
    return ['Face biometric check-in before meeting access', 'Post-event CSV attendance verification'];
  }
  return ['Onsite GPS/geofencing and face biometric validation', 'Online face biometric check-in and post-event CSV verification'];
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const cover = '/coverpage.jpg';

export const MOCK_CMO_EVENTS: CmoEvent[] = [
  {
    id: 'ce1',
    title: 'Supervisor Leadership Development Seminar',
    tagline: 'Strengthening people-centered supervision',
    description: 'A leadership seminar for supervisors and unit heads focused on coaching, performance conversations, and ethical public service leadership.',
    coverImage: cover,
    organizer: 'HR Office',
    organizerEmail: 'hr.office@pup.edu.ph',
    department: 'Human Resource Management Office',
    category: 'Supervisor Leadership',
    type: 'Regular',
    modality: 'Hybrid',
    venue: 'PUP Executive Conference Room / Zoom',
    onlinePlatform: 'Zoom',
    targetAudience: 'Supervisors, unit heads, and administrative officers',
    eligibility: 'PUP employees with supervisory or team leadership responsibilities',
    startDate: '2026-05-30T09:00',
    endDate: '2026-05-30T16:00',
    capacity: 120,
    remainingSlots: 22,
    registrationCount: 98,
    waitlistCount: 8,
    checkedIn: 0,
    dateSubmitted: '2026-05-14',
    dateCreated: '2026-05-10',
    dateUpdated: '2026-05-23',
    approvalStatus: 'Published',
    approvedBy: 'Atty. Rosario Dela Cruz',
    approvalComments: 'Approved. Materials align with institutional training priorities.',
    publishedAt: '2026-05-24T10:00',
    certTemplateStatus: 'Validated',
    certificateAvailable: true,
    surveyRequired: true,
    surveyStatus: 'Configured',
    requirements: 'Participant must be a PUP employee and must complete the standardized feedback form.',
    attendanceRules: getAttendanceRules('Hybrid'),
    waitlistAvailable: true,
    generatedCertificates: 0,
    pendingCertificates: 98,
    releasedCertificates: 0,
    notEligibleCertificates: 0,
    remarksHistory: [
      { id: 'rh1', date: '2026-05-14', author: 'HR Office', action: 'Submitted', remarks: 'Initial proposal submitted for CMO review.' },
      { id: 'rh2', date: '2026-05-22', author: 'CMO', action: 'Approved', remarks: 'Approved with certificate template validated.' },
      { id: 'rh3', date: '2026-05-24', author: 'CMO', action: 'Published', remarks: 'Event became visible to eligible participants.' },
    ],
    organizerUpdates: ['Updated room capacity after facilities confirmation.', 'Uploaded final certificate template.'],
  },
  {
    id: 'ce2',
    title: 'Gender and Development Awareness Forum',
    tagline: 'Building respectful and inclusive workplaces',
    description: 'A university forum on GAD principles, workplace inclusion, and respectful communication across offices and academic units.',
    coverImage: cover,
    organizer: 'HR Office',
    organizerEmail: 'hr.office@pup.edu.ph',
    department: 'Gender and Development Office',
    category: 'GAD',
    type: 'Regular',
    modality: 'Online',
    venue: 'Microsoft Teams',
    onlinePlatform: 'Microsoft Teams',
    targetAudience: 'Faculty, administrative employees, and student organization advisers',
    eligibility: 'Open to all PUP personnel and invited student leaders',
    startDate: '2026-06-12T13:00',
    endDate: '2026-06-12T16:00',
    capacity: 250,
    remainingSlots: 114,
    registrationCount: 136,
    waitlistCount: 0,
    checkedIn: 0,
    dateSubmitted: '2026-05-18',
    dateCreated: '2026-05-16',
    dateUpdated: '2026-05-25',
    approvalStatus: 'Approved',
    approvedBy: 'Atty. Rosario Dela Cruz',
    approvalComments: 'Approved for publication after review of resource speaker credentials.',
    certTemplateStatus: 'Uploaded',
    certificateAvailable: true,
    surveyRequired: true,
    surveyStatus: 'Configured',
    requirements: 'Participants must use their institutional email address and complete the standardized post-event feedback form.',
    attendanceRules: getAttendanceRules('Online'),
    waitlistAvailable: false,
    generatedCertificates: 0,
    pendingCertificates: 136,
    releasedCertificates: 0,
    notEligibleCertificates: 0,
    remarksHistory: [
      { id: 'rh4', date: '2026-05-18', author: 'HR Office', action: 'Submitted', remarks: 'Submitted GAD forum proposal.' },
      { id: 'rh5', date: '2026-05-25', author: 'CMO', action: 'Approved', remarks: 'Approved. Organizer will be emailed for publication status.' },
    ],
    organizerUpdates: ['Added Teams meeting details.', 'Confirmed that the standardized feedback form will be used.'],
  },
  {
    id: 'ce3',
    title: 'AI and Digital Transformation Workshop',
    tagline: 'Practical AI tools for university service delivery',
    description: 'A schedule-based workshop series covering responsible AI, data privacy, prompt writing, and workflow automation for administrative teams.',
    coverImage: cover,
    organizer: 'HR Office',
    organizerEmail: 'hr.office@pup.edu.ph',
    department: 'Information and Communications Technology Office',
    category: 'Tech',
    type: 'Schedule-Based',
    modality: 'Online',
    venue: 'Google Meet',
    onlinePlatform: 'Google Meet',
    targetAudience: 'Administrative staff, faculty coordinators, and office technology focal persons',
    eligibility: 'PUP personnel nominated by their office heads',
    startDate: '2026-06-18T09:00',
    endDate: '2026-06-18T16:00',
    capacity: 90,
    remainingSlots: 31,
    registrationCount: 59,
    waitlistCount: 6,
    checkedIn: 0,
    dateSubmitted: '2026-05-26',
    dateCreated: '2026-05-22',
    dateUpdated: '2026-05-27',
    approvalStatus: 'Pending Review',
    certTemplateStatus: 'Uploaded',
    certificateAvailable: true,
    surveyRequired: true,
    surveyStatus: 'Configured',
    requirements: 'Participants must bring a laptop and attend one assigned workshop schedule.',
    attendanceRules: getAttendanceRules('Online'),
    waitlistAvailable: true,
    slots: [
      { id: 's1', label: 'Morning Batch', start: '2026-06-18T09:00', end: '2026-06-18T12:00', venue: 'Google Meet Room A', capacity: 45, enrolled: 38, waitlisted: 4, attendanceCount: 0 },
      { id: 's2', label: 'Afternoon Batch', start: '2026-06-18T13:00', end: '2026-06-18T16:00', venue: 'Google Meet Room B', capacity: 45, enrolled: 21, waitlisted: 2, attendanceCount: 0 },
    ],
    generatedCertificates: 0,
    pendingCertificates: 59,
    releasedCertificates: 0,
    notEligibleCertificates: 0,
    remarksHistory: [
      { id: 'rh6', date: '2026-05-26', author: 'HR Office', action: 'Submitted', remarks: 'Submitted schedule-based online workshop for review.' },
    ],
    organizerUpdates: ['Updated eligibility to office-nominated participants only.'],
  },
  {
    id: 'ce4',
    title: 'Accessible Campus Services Orientation',
    tagline: 'Making services easier to reach for everyone',
    description: 'An orientation on disability-inclusive service delivery, accessible frontline communication, and referral protocols.',
    coverImage: cover,
    organizer: 'HR Office',
    organizerEmail: 'hr.office@pup.edu.ph',
    department: 'Office of Student Services',
    category: 'Disability',
    type: 'Regular',
    modality: 'Onsite',
    venue: 'Student Center Training Room',
    targetAudience: 'Frontline office staff and service desk personnel',
    eligibility: 'PUP employees assigned to student and public service counters',
    startDate: '2026-06-22T08:30',
    endDate: '2026-06-22T12:00',
    capacity: 80,
    remainingSlots: 28,
    registrationCount: 52,
    waitlistCount: 3,
    checkedIn: 0,
    dateSubmitted: '2026-05-21',
    dateCreated: '2026-05-19',
    dateUpdated: '2026-05-26',
    approvalStatus: 'Returned with Comments',
    certTemplateStatus: 'Not Uploaded',
    certificateAvailable: true,
    surveyRequired: true,
    surveyStatus: 'Configured',
    requirements: 'Participants must be assigned to frontline service work.',
    attendanceRules: getAttendanceRules('Onsite'),
    waitlistAvailable: true,
    generatedCertificates: 0,
    pendingCertificates: 0,
    releasedCertificates: 0,
    notEligibleCertificates: 0,
    returnComment: 'Please upload the certificate template and add accessibility details for the event venue.',
    remarksHistory: [
      { id: 'rh7', date: '2026-05-21', author: 'HR Office', action: 'Submitted', remarks: 'Submitted orientation proposal.' },
      { id: 'rh8', date: '2026-05-26', author: 'CMO', action: 'Returned for Revision', remarks: 'Certificate template and venue accessibility notes are required.' },
    ],
    organizerUpdates: ['Organizer indicated venue accessibility review is in progress.'],
  },
  {
    id: 'ce5',
    title: 'Emergency Preparedness and Response Seminar',
    tagline: 'Clear actions before, during, and after emergencies',
    description: 'A DRI seminar on campus emergency procedures, evacuation coordination, and incident reporting.',
    coverImage: cover,
    organizer: 'HR Office',
    organizerEmail: 'hr.office@pup.edu.ph',
    department: 'Disaster Risk Reduction and Management Office',
    category: 'DRI',
    type: 'Regular',
    modality: 'Onsite',
    venue: 'PUP Gymnasium',
    targetAudience: 'Safety officers, floor marshals, and unit representatives',
    eligibility: 'PUP personnel assigned to emergency response teams',
    startDate: '2026-06-05T08:00',
    endDate: '2026-06-05T15:00',
    capacity: 180,
    remainingSlots: 180,
    registrationCount: 0,
    waitlistCount: 0,
    checkedIn: 0,
    dateSubmitted: '2026-05-17',
    dateCreated: '2026-05-15',
    dateUpdated: '2026-05-20',
    approvalStatus: 'Rejected',
    certTemplateStatus: 'Not Uploaded',
    certificateAvailable: false,
    surveyRequired: false,
    surveyStatus: 'Missing',
    requirements: 'Draft requirements were incomplete.',
    attendanceRules: getAttendanceRules('Onsite'),
    waitlistAvailable: false,
    generatedCertificates: 0,
    pendingCertificates: 0,
    releasedCertificates: 0,
    notEligibleCertificates: 0,
    rejectReason: 'The proposal lacked confirmed speakers, safety plan, and venue clearance.',
    remarksHistory: [
      { id: 'rh9', date: '2026-05-17', author: 'HR Office', action: 'Submitted', remarks: 'Submitted emergency preparedness seminar.' },
      { id: 'rh10', date: '2026-05-20', author: 'CMO', action: 'Rejected', remarks: 'Required compliance documents were missing.' },
    ],
    organizerUpdates: [],
  },
  {
    id: 'ce6',
    title: 'PUP Founding Anniversary Celebration',
    tagline: 'Honoring history, service, and community',
    description: 'A university-wide onsite celebration with recognition activities, performances, and service awards.',
    coverImage: cover,
    organizer: 'HR Office',
    organizerEmail: 'hr.office@pup.edu.ph',
    department: 'Office of the President',
    category: 'University Activities',
    type: 'Regular',
    modality: 'Onsite',
    venue: 'PUP Main Grounds',
    targetAudience: 'PUP employees, students, alumni, and invited guests',
    eligibility: 'Open to the PUP community and invited guests',
    startDate: '2026-05-20T08:00',
    endDate: '2026-05-20T18:00',
    capacity: 900,
    remainingSlots: 0,
    registrationCount: 864,
    waitlistCount: 35,
    checkedIn: 812,
    dateSubmitted: '2026-04-22',
    dateCreated: '2026-04-18',
    dateUpdated: '2026-05-21',
    approvalStatus: 'Published',
    approvedBy: 'Atty. Rosario Dela Cruz',
    approvalComments: 'Approved as a university-wide activity.',
    publishedAt: '2026-04-28T09:00',
    certTemplateStatus: 'Validated',
    certificateAvailable: true,
    surveyRequired: true,
    surveyStatus: 'Configured',
    requirements: 'Participants must present registration confirmation at the entrance.',
    attendanceRules: getAttendanceRules('Onsite'),
    waitlistAvailable: true,
    generatedCertificates: 812,
    pendingCertificates: 44,
    releasedCertificates: 768,
    notEligibleCertificates: 52,
    remarksHistory: [
      { id: 'rh11', date: '2026-04-22', author: 'HR Office', action: 'Submitted', remarks: 'Submitted anniversary event details.' },
      { id: 'rh12', date: '2026-04-25', author: 'CMO', action: 'Approved', remarks: 'Approved for publication.' },
      { id: 'rh13', date: '2026-04-28', author: 'CMO', action: 'Published', remarks: 'Event was made visible to participants.' },
      { id: 'rh14', date: '2026-05-21', author: 'HR Office', action: 'Completed', remarks: 'Attendance and certificate counts updated.' },
    ],
    organizerUpdates: ['Updated attendance count after onsite validation.', 'Uploaded post-event certificate release status.'],
  },
  {
    id: 'ce7',
    title: 'Disaster Resilience and Institutional Readiness Training',
    tagline: 'Coordinated readiness for campus operations',
    description: 'A hybrid DRI training on continuity planning, emergency communications, and unit-level readiness.',
    coverImage: cover,
    organizer: 'HR Office',
    organizerEmail: 'hr.office@pup.edu.ph',
    department: 'Disaster Risk Reduction and Management Office',
    category: 'DRI',
    type: 'Schedule-Based',
    modality: 'Hybrid',
    venue: 'DRRMO Training Hall / Zoom',
    onlinePlatform: 'Zoom',
    targetAudience: 'Office continuity leads and safety coordinators',
    eligibility: 'PUP offices with nominated continuity leads',
    startDate: '2026-05-28T09:00',
    endDate: '2026-05-28T17:00',
    capacity: 140,
    remainingSlots: 10,
    registrationCount: 130,
    waitlistCount: 12,
    checkedIn: 74,
    dateSubmitted: '2026-05-05',
    dateCreated: '2026-05-01',
    dateUpdated: '2026-05-27',
    approvalStatus: 'Published',
    approvedBy: 'Atty. Rosario Dela Cruz',
    approvalComments: 'Approved. Hybrid attendance validation is configured.',
    publishedAt: '2026-05-10T13:00',
    certTemplateStatus: 'Validated',
    certificateAvailable: true,
    surveyRequired: true,
    surveyStatus: 'Configured',
    requirements: 'Participants must attend their assigned schedule and complete the readiness checklist.',
    attendanceRules: getAttendanceRules('Hybrid'),
    waitlistAvailable: true,
    slots: [
      { id: 's3', label: 'Onsite Batch', start: '2026-05-28T09:00', end: '2026-05-28T12:00', venue: 'DRRMO Training Hall', capacity: 70, enrolled: 68, waitlisted: 5, attendanceCount: 52 },
      { id: 's4', label: 'Online Batch', start: '2026-05-28T13:00', end: '2026-05-28T17:00', venue: 'Zoom', capacity: 70, enrolled: 62, waitlisted: 7, attendanceCount: 22 },
    ],
    generatedCertificates: 0,
    pendingCertificates: 130,
    releasedCertificates: 0,
    notEligibleCertificates: 0,
    remarksHistory: [
      { id: 'rh15', date: '2026-05-05', author: 'HR Office', action: 'Submitted', remarks: 'Submitted hybrid DRI training.' },
      { id: 'rh16', date: '2026-05-09', author: 'CMO', action: 'Approved', remarks: 'Approved after attendance rules were clarified.' },
      { id: 'rh17', date: '2026-05-10', author: 'CMO', action: 'Published', remarks: 'Event is visible to eligible participants.' },
    ],
    organizerUpdates: ['Added separate onsite and online validation instructions.'],
  },
  {
    id: 'ce8',
    title: 'Safe Spaces and Inclusive Campus Seminar',
    tagline: 'Respectful communication for safer campus spaces',
    description: 'A seminar covering safe spaces policies, reporting channels, inclusive communication, and roles of campus personnel.',
    coverImage: cover,
    organizer: 'HR Office',
    organizerEmail: 'hr.office@pup.edu.ph',
    department: 'Gender and Development Office',
    category: 'GAD',
    type: 'Regular',
    modality: 'Hybrid',
    venue: 'Audio Visual Room / Microsoft Teams',
    onlinePlatform: 'Microsoft Teams',
    targetAudience: 'Faculty, staff, and student service personnel',
    eligibility: 'Open to all PUP personnel',
    startDate: '2026-07-04T09:00',
    endDate: '2026-07-04T12:00',
    capacity: 160,
    remainingSlots: 160,
    registrationCount: 0,
    waitlistCount: 0,
    checkedIn: 0,
    dateSubmitted: '2026-05-27',
    dateCreated: '2026-05-25',
    dateUpdated: '2026-05-27',
    approvalStatus: 'Submitted',
    certTemplateStatus: 'Not Uploaded',
    certificateAvailable: true,
    surveyRequired: true,
    surveyStatus: 'Missing',
    requirements: 'Participants should complete pre-reading materials before the event.',
    attendanceRules: getAttendanceRules('Hybrid'),
    waitlistAvailable: true,
    generatedCertificates: 0,
    pendingCertificates: 0,
    releasedCertificates: 0,
    notEligibleCertificates: 0,
    remarksHistory: [
      { id: 'rh18', date: '2026-05-27', author: 'HR Office', action: 'Submitted', remarks: 'Submitted safe spaces seminar for review.' },
    ],
    organizerUpdates: [],
  },
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Human Resource Management Office', shortName: 'HRMO', organizerCount: 3, submittedEvents: 2, publishedEvents: 1, completedEvents: 0, averageAttendance: 0, pendingCertificates: 98, releasedCertificates: 0, returnedEvents: 0, status: 'Active' },
  { id: 'd2', name: 'Gender and Development Office', shortName: 'GAD', organizerCount: 4, submittedEvents: 3, publishedEvents: 0, completedEvents: 0, averageAttendance: 0, pendingCertificates: 136, releasedCertificates: 0, returnedEvents: 0, status: 'Active' },
  { id: 'd3', name: 'Information and Communications Technology Office', shortName: 'ICTO', organizerCount: 5, submittedEvents: 1, publishedEvents: 0, completedEvents: 0, averageAttendance: 0, pendingCertificates: 59, releasedCertificates: 0, returnedEvents: 0, status: 'Active' },
  { id: 'd4', name: 'Office of Student Services', shortName: 'OSS', organizerCount: 4, submittedEvents: 1, publishedEvents: 0, completedEvents: 0, averageAttendance: 0, pendingCertificates: 0, releasedCertificates: 0, returnedEvents: 1, status: 'Active' },
  { id: 'd5', name: 'Disaster Risk Reduction and Management Office', shortName: 'DRRMO', organizerCount: 3, submittedEvents: 2, publishedEvents: 1, completedEvents: 0, averageAttendance: 57, pendingCertificates: 130, releasedCertificates: 0, returnedEvents: 0, status: 'Active' },
  { id: 'd6', name: 'Office of the President', shortName: 'OP', organizerCount: 2, submittedEvents: 1, publishedEvents: 1, completedEvents: 1, averageAttendance: 94, pendingCertificates: 44, releasedCertificates: 768, returnedEvents: 0, status: 'Active' },
];

export const MOCK_CERT_SUMMARIES: CertSummary[] = MOCK_CMO_EVENTS
  .filter(event => event.certificateAvailable)
  .map(event => ({
    id: `cert-${event.id}`,
    eventTitle: event.title,
    organizer: event.organizer,
    department: event.department,
    certTemplateStatus: event.certTemplateStatus,
    generated: event.generatedCertificates,
    released: event.releasedCertificates,
    pending: event.pendingCertificates,
    notEligible: event.notEligibleCertificates,
  }));


export const STANDARD_FEEDBACK_QUESTIONS: StandardFeedbackQuestion[] = [
  {
    id: 'fq1',
    section: 'Event Objectives and Relevance',
    prompt: 'The event objectives were clearly explained.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq2',
    section: 'Event Objectives and Relevance',
    prompt: 'The topics discussed were relevant to my needs, interests, or role.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq3',
    section: 'Event Objectives and Relevance',
    prompt: 'The event provided useful knowledge, skills, or information that I can apply.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq4',
    section: 'Speaker or Facilitator',
    prompt: 'The speaker or facilitator explained the topic clearly.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq5',
    section: 'Speaker or Facilitator',
    prompt: 'The speaker or facilitator encouraged participation and engagement.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq6',
    section: 'Speaker or Facilitator',
    prompt: 'The examples, activities, or discussions helped me understand the topic better.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq7',
    section: 'Event Organization',
    prompt: 'The event was well organized and easy to follow.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq8',
    section: 'Event Organization',
    prompt: 'The event schedule, pacing, and duration were appropriate.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq9',
    section: 'Accessibility and Platform Experience',
    prompt: 'The venue or online platform was accessible and easy to use.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq10',
    section: 'Communication and Instructions',
    prompt: 'Announcements, reminders, and instructions before or during the event were clear.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq11',
    section: 'SIGLA Attendance and Feedback Experience',
    prompt: 'The event check-in or attendance verification process was easy to complete.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq12',
    section: 'SIGLA Attendance and Feedback Experience',
    prompt: 'The system made event registration, attendance, and feedback submission convenient.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Strongly Disagree', highLabel: 'Strongly Agree' },
  },
  {
    id: 'fq13',
    section: 'Overall Evaluation',
    prompt: 'Overall, I am satisfied with the event.',
    type: 'Rating',
    required: true,
    scale: { min: 1, max: 5, lowLabel: 'Very Dissatisfied', highLabel: 'Very Satisfied' },
  },
  {
    id: 'fq14',
    section: 'Overall Evaluation',
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

const ratingLabels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

function ratingResult(questionId: string, prompt: string, averageScore: number, responseCount: number, positiveRate: number, counts: [number, number, number, number, number]): FeedbackQuestionResult {
  return {
    questionId,
    prompt,
    averageScore,
    responseCount,
    positiveRate,
    distribution: counts.map((count, index) => ({ score: index + 1, label: ratingLabels[index], count })),
  };
}

export const MOCK_FEEDBACK_SUMMARIES: FeedbackSummary[] = [
  {
    eventId: 'ce6',
    eventTitle: 'PUP Founding Anniversary Celebration',
    status: 'Ready for Review',
    totalEligible: 812,
    totalResponses: 684,
    responseRate: 84,
    averageRating: 4.6,
    submittedUntil: '2026-05-27',
    questionResults: [
      ratingResult('fq1', 'The event objectives were clearly explained.', 4.7, 684, 94, [4, 10, 29, 141, 500]),
      ratingResult('fq2', 'The topics discussed were relevant to my needs, interests, or role.', 4.6, 684, 91, [5, 14, 42, 160, 463]),
      ratingResult('fq3', 'The event provided useful knowledge, skills, or information that I can apply.', 4.5, 684, 89, [7, 18, 50, 171, 438]),
      ratingResult('fq4', 'The speaker or facilitator explained the topic clearly.', 4.7, 684, 94, [4, 10, 28, 146, 496]),
      ratingResult('fq5', 'The speaker or facilitator encouraged participation and engagement.', 4.6, 684, 91, [6, 15, 41, 158, 464]),
      ratingResult('fq6', 'The examples, activities, or discussions helped me understand the topic better.', 4.5, 684, 88, [8, 20, 54, 167, 435]),
      ratingResult('fq7', 'The event was well organized and easy to follow.', 4.4, 684, 85, [12, 28, 62, 188, 394]),
      ratingResult('fq8', 'The event schedule, pacing, and duration were appropriate.', 4.3, 684, 82, [17, 35, 71, 201, 360]),
      ratingResult('fq9', 'The venue or online platform was accessible and easy to use.', 4.4, 684, 86, [10, 26, 60, 190, 398]),
      ratingResult('fq10', 'Announcements, reminders, and instructions before or during the event were clear.', 4.5, 684, 88, [9, 21, 52, 176, 426]),
      ratingResult('fq11', 'The event check-in or attendance verification process was easy to complete.', 4.2, 684, 78, [22, 48, 81, 215, 318]),
      ratingResult('fq12', 'The system made event registration, attendance, and feedback submission convenient.', 4.3, 684, 82, [18, 36, 69, 204, 357]),
      ratingResult('fq13', 'Overall, I am satisfied with the event.', 4.6, 684, 92, [5, 13, 35, 155, 476]),
      ratingResult('fq14', 'I would recommend similar events to other participants.', 4.7, 684, 93, [5, 12, 30, 148, 489]),
    ],
    commonThemes: [
      { label: 'Strong sense of university community', mentions: 188, sentiment: 'Positive' },
      { label: 'Clear announcements and reminders', mentions: 124, sentiment: 'Positive' },
      { label: 'Crowd management at venue entrances', mentions: 81, sentiment: 'Concern' },
      { label: 'Request for more seating and shade areas', mentions: 64, sentiment: 'Concern' },
      { label: 'Interest in more cultural performances', mentions: 51, sentiment: 'Neutral' },
      { label: 'Smooth certificate and feedback process', mentions: 43, sentiment: 'Positive' },
    ],
    openEndedResponses: [
      {
        questionId: 'fq15',
        prompt: 'What did you like most about the event?',
        responseCount: 6,
        answers: [
          { id: 'ce6-fq15-r1', respondentLabel: 'R1', submittedAt: '2026-05-20 18:24', answer: 'I liked the recognition segment because it made the university community feel appreciated.' },
          { id: 'ce6-fq15-r2', respondentLabel: 'R2', submittedAt: '2026-05-20 18:31', answer: 'The performances were enjoyable and helped make the celebration meaningful.' },
          { id: 'ce6-fq15-r3', respondentLabel: 'R3', submittedAt: '2026-05-20 18:45', answer: 'The event was festive and organized. The reminders before the event were also clear.' },
          { id: 'ce6-fq15-r4', respondentLabel: 'R4', submittedAt: '2026-05-20 19:02', answer: 'I appreciated how the event highlighted PUP history and service.' },
          { id: 'ce6-fq15-r5', respondentLabel: 'R5', submittedAt: '2026-05-20 19:15', answer: 'The registration and certificate process through the system was convenient.' },
          { id: 'ce6-fq15-r6', respondentLabel: 'R6', submittedAt: '2026-05-20 19:22', answer: 'The program helped bring students, employees, and alumni together.' },
        ],
      },
      {
        questionId: 'fq16',
        prompt: 'What parts of the event should be improved?',
        responseCount: 6,
        answers: [
          { id: 'ce6-fq16-r1', respondentLabel: 'R7', submittedAt: '2026-05-20 18:36', answer: 'Entrance lines were long. It would help to add more check-in lanes.' },
          { id: 'ce6-fq16-r2', respondentLabel: 'R8', submittedAt: '2026-05-20 18:49', answer: 'There should be more seating areas and shade for participants.' },
          { id: 'ce6-fq16-r3', respondentLabel: 'R9', submittedAt: '2026-05-20 19:03', answer: 'Crowd control near the stage can be improved.' },
          { id: 'ce6-fq16-r4', respondentLabel: 'R10', submittedAt: '2026-05-20 19:11', answer: 'The event was good, but the schedule could be followed more strictly.' },
          { id: 'ce6-fq16-r5', respondentLabel: 'R11', submittedAt: '2026-05-20 19:20', answer: 'Please provide clearer directions for different participant groups.' },
          { id: 'ce6-fq16-r6', respondentLabel: 'R12', submittedAt: '2026-05-20 19:28', answer: 'The check-in process worked, but additional staff would make it faster.' },
        ],
      },
      {
        questionId: 'fq17',
        prompt: 'What topics, activities, or event formats would you like to see in the future?',
        responseCount: 5,
        answers: [
          { id: 'ce6-fq17-r1', respondentLabel: 'R13', submittedAt: '2026-05-20 18:58', answer: 'More cultural performances and exhibits from different colleges.' },
          { id: 'ce6-fq17-r2', respondentLabel: 'R14', submittedAt: '2026-05-20 19:06', answer: 'A shorter program with parallel activity booths would be nice.' },
          { id: 'ce6-fq17-r3', respondentLabel: 'R15', submittedAt: '2026-05-20 19:18', answer: 'More student-led activities and alumni sharing sessions.' },
          { id: 'ce6-fq17-r4', respondentLabel: 'R16', submittedAt: '2026-05-20 19:25', answer: 'Interactive exhibits about PUP milestones would make the celebration more engaging.' },
          { id: 'ce6-fq17-r5', respondentLabel: 'R17', submittedAt: '2026-05-20 19:35', answer: 'I would like more department booths and community service showcases.' },
        ],
      },
      {
        questionId: 'fq18',
        prompt: 'Do you have any additional comments, concerns, or suggestions?',
        responseCount: 4,
        answers: [
          { id: 'ce6-fq18-r1', respondentLabel: 'R18', submittedAt: '2026-05-20 19:40', answer: 'Overall, the event was meaningful and well attended.' },
          { id: 'ce6-fq18-r2', respondentLabel: 'R19', submittedAt: '2026-05-20 19:46', answer: 'Please keep using the system for reminders because it helped me track the event.' },
          { id: 'ce6-fq18-r3', respondentLabel: 'R20', submittedAt: '2026-05-20 19:51', answer: 'The organizers did well, but crowd flow should be planned better next time.' },
          { id: 'ce6-fq18-r4', respondentLabel: 'R21', submittedAt: '2026-05-20 19:58', answer: 'Thank you for making the celebration inclusive for different members of the PUP community.' },
        ],
      },
    ],
  },
];

export function getEventFeedbackSummary(eventId: string) {
  return MOCK_FEEDBACK_SUMMARIES.find(summary => summary.eventId === eventId);
}

export function isCompletedEvent(event: CmoEvent, referenceDate = new Date('2026-05-28T12:00:00')) {
  return new Date(event.endDate) < referenceDate;
}

export function getFeedbackStatusForEvent(event: CmoEvent, referenceDate = new Date('2026-05-28T12:00:00')) {
  if (!isCompletedEvent(event, referenceDate)) return 'Available After Event';
  return getEventFeedbackSummary(event.id)?.status ?? 'No Responses Yet';
}

export const APPROVAL_STYLE: Record<ApprovalStatus, { bg: string; color: string }> = {
  Submitted: { bg: '#3F799818', color: '#3F7998' },
  'Pending Review': { bg: '#DAA52018', color: '#8a6010' },
  Approved: { bg: '#27AE6018', color: '#1a8a44' },
  Rejected: { bg: '#D8584818', color: '#b03020' },
  'Returned with Comments': { bg: '#EA694818', color: '#C05020' },
  Published: { bg: '#80000015', color: '#800000' },
};

export const CERT_STYLE: Record<CertTemplateStatus, { bg: string; color: string }> = {
  'Not Uploaded': { bg: '#9a7a5a12', color: '#9a7a5a' },
  Uploaded: { bg: '#00598D18', color: '#00598D' },
  Validated: { bg: '#27AE6018', color: '#1a8a44' },
};
