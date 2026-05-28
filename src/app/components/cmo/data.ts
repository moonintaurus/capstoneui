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
    requirements: 'Participant must be a PUP employee and must complete the feedback survey.',
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
    requirements: 'Participants must use their institutional email address and complete the post-event survey.',
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
    organizerUpdates: ['Added Teams meeting details.', 'Confirmed survey questions.'],
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
    surveyRequired: false,
    surveyStatus: 'Not Required',
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
    surveyRequired: false,
    surveyStatus: 'Not Required',
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
