export const C = {
  maroon: '#800000',
  maroonDark: '#5a0000',
  golden: '#FFDF00',
  goldenrod: '#DAA520',
  cream: '#FAF5E3',
  teal: '#00598D',
  slate: '#3F7998',
  coral: '#D85848',
  tangerine: '#EA694B',
  purple: '#6A4C93',
  text: '#1c1008',
  sub: '#4a3728',
  muted: '#9a7a5a',
  border: 'rgba(128,0,0,0.10)',
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
export type ApprovalStatus = 'Draft' | 'Submitted' | 'Returned with Comments' | 'Approved' | 'Rejected' | 'Published';
export type Modality = 'Onsite' | 'Online' | 'Hybrid';
export type EventType = 'Regular';
export type AttendanceStatus =
  | 'Present'
  | 'Absent'
  | 'Pending'
  | 'Verified Attended'
  | 'Attendance Not Verified'
  | 'Pending Verification'
  | 'Not Eligible';
export type CertStatus =
  | 'Not Available'
  | 'Survey Required'
  | 'Pending Verification'
  | 'Template Missing'
  | 'Attendance Not Verified'
  | 'Verified Attended'
  | 'Generating Certificate'
  | 'Released'
  | 'Not Eligible';
export type RegStatus = 'Confirmed' | 'Waitlisted' | 'Cancelled';
export type CsvVerificationStatus = 'Not Required' | 'Not Uploaded' | 'Uploaded' | 'Verified';

export interface OrgEvent {
  id: string;
  title: string;
  tagline: string;
  category: EventCategory;
  type: EventType;
  modality: Modality;
  date: string;
  endDate: string;
  location: string;
  onlinePlatform?: 'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'Not Applicable';
  maxParticipants: number;
  registrationCount: number;
  waitlistCount: number;
  approvalStatus: ApprovalStatus;
  certTemplateStatus: 'Not Uploaded' | 'Uploaded' | 'Validated';
  csvVerificationStatus: CsvVerificationStatus;
  csvLastUploadedFile?: string;
  csvUploadedAt?: string;
  approvalComment?: string;
  description: string;
  requirements?: string;
  exclusivity?: string;
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
  eventId: string;
  eventTitle: string;
  certNumber: string;
  generatedDate: string;
  releasedDate: string;
  status: CertStatus;
}

export function getCategoryColor(category: string) {
  const colors: Record<EventCategory, string> = {
    'Supervisor Leadership': '#800000',
    GAD: '#D85848',
    Tech: '#00598D',
    Disability: '#6A4C93',
    DRI: '#DAA520',
    'University Activities': '#EA694B',
  };
  return colors[category as EventCategory] ?? C.teal;
}

export const MOCK_EVENTS: OrgEvent[] = [
  {
    id: 'ev1',
    title: 'Supervisor Leadership Development Seminar',
    tagline: 'Strengthening accountable campus supervision',
    category: 'Supervisor Leadership',
    type: 'Regular',
    modality: 'Hybrid',
    date: '2026-05-10',
    endDate: '2026-05-10',
    location: 'PUP Main Conference Hall / Zoom',
    onlinePlatform: 'Zoom',
    maxParticipants: 80,
    registrationCount: 72,
    waitlistCount: 8,
    approvalStatus: 'Published',
    certTemplateStatus: 'Validated',
    csvVerificationStatus: 'Verified',
    csvLastUploadedFile: 'zoom_supervisor_leadership_2026-05-10.csv',
    csvUploadedAt: '2026-05-10 17:42',
    description: 'A leadership seminar for supervisors focused on public service standards, team accountability, and responsive coordination.',
    requirements: 'Face biometric check-in for all attendees. Online participants require post-event CSV verification.',
    exclusivity: 'By College',
  },
  {
    id: 'ev2',
    title: 'Effective Team Supervision Workshop',
    tagline: 'Practical tools for coaching and coordination',
    category: 'Supervisor Leadership',
    type: 'Regular',
    modality: 'Onsite',
    date: '2026-06-20',
    endDate: '2026-06-20',
    location: 'PUP Main Auditorium',
    onlinePlatform: 'Not Applicable',
    maxParticipants: 200,
    registrationCount: 183,
    waitlistCount: 34,
    approvalStatus: 'Approved',
    certTemplateStatus: 'Uploaded',
    csvVerificationStatus: 'Not Required',
    description: 'An onsite workshop for team supervision practices and service delivery improvement.',
    requirements: 'GPS/geofencing and face biometric verification are required for attendance.',
    exclusivity: 'Open to All',
  },
  {
    id: 'ev3',
    title: 'Gender and Development Awareness Forum',
    tagline: 'Advancing inclusive and respectful campus practices',
    category: 'GAD',
    type: 'Regular',
    modality: 'Online',
    date: '2026-05-20',
    endDate: '2026-05-20',
    location: 'Microsoft Teams',
    onlinePlatform: 'Microsoft Teams',
    maxParticipants: 120,
    registrationCount: 96,
    waitlistCount: 6,
    approvalStatus: 'Published',
    certTemplateStatus: 'Validated',
    csvVerificationStatus: 'Not Uploaded',
    description: 'A web-based forum on GAD principles, safe participation, and inclusive campus service.',
    requirements: 'Online face biometric verification before meeting link access and CSV verification after the event.',
    exclusivity: 'Open to All',
  },
  {
    id: 'ev4',
    title: 'Safe Spaces and Inclusive Campus Seminar',
    tagline: 'Shared responsibility for respectful learning spaces',
    category: 'GAD',
    type: 'Regular',
    modality: 'Hybrid',
    date: '2026-07-15',
    endDate: '2026-07-15',
    location: 'Student Center / Google Meet',
    onlinePlatform: 'Google Meet',
    maxParticipants: 150,
    registrationCount: 42,
    waitlistCount: 0,
    approvalStatus: 'Returned with Comments',
    certTemplateStatus: 'Not Uploaded',
    csvVerificationStatus: 'Not Uploaded',
    approvalComment: 'Please clarify the list of resource speakers and ensure the event description includes support channels for sensitive topics.',
    description: 'A hybrid seminar on safe spaces, inclusive conduct, and response pathways.',
    requirements: 'Hybrid attendance mode must be selected during registration.',
    exclusivity: 'Open to All',
  },
  {
    id: 'ev5',
    title: 'Technology Innovation Summit',
    tagline: 'Showcasing digital solutions for public service',
    category: 'Tech',
    type: 'Regular',
    modality: 'Onsite',
    date: '2026-08-01',
    endDate: '2026-08-02',
    location: 'PUP Gymnasium',
    onlinePlatform: 'Not Applicable',
    maxParticipants: 500,
    registrationCount: 0,
    waitlistCount: 0,
    approvalStatus: 'Draft',
    certTemplateStatus: 'Not Uploaded',
    csvVerificationStatus: 'Not Required',
    description: 'A two-day technology exhibition featuring student projects, industry demos, and keynote speakers.',
    requirements: 'Onsite GPS/geofencing and face biometric verification will be used.',
    exclusivity: 'Open to All',
  },
  {
    id: 'ev6',
    title: 'AI and Digital Transformation Workshop',
    tagline: 'Responsible automation for university operations',
    category: 'Tech',
    type: 'Regular',
    modality: 'Online',
    date: '2026-06-12',
    endDate: '2026-06-12',
    location: 'Zoom',
    onlinePlatform: 'Zoom',
    maxParticipants: 90,
    registrationCount: 74,
    waitlistCount: 0,
    approvalStatus: 'Published',
    certTemplateStatus: 'Validated',
    csvVerificationStatus: 'Not Uploaded',
    description: 'A web-based workshop about practical AI use, digital workflows, and responsible transformation.',
    requirements: 'Face biometric verification before link access. CSV attendance verification becomes available after the event ends.',
    exclusivity: 'By Program',
  },
  {
    id: 'ev7',
    title: 'Disability Awareness and Inclusion Seminar',
    tagline: 'Building accessible services and respectful support',
    category: 'Disability',
    type: 'Regular',
    modality: 'Onsite',
    date: '2026-05-15',
    endDate: '2026-05-15',
    location: 'PUP Claro M. Recto Hall',
    onlinePlatform: 'Not Applicable',
    maxParticipants: 180,
    registrationCount: 162,
    waitlistCount: 0,
    approvalStatus: 'Published',
    certTemplateStatus: 'Validated',
    csvVerificationStatus: 'Not Required',
    description: 'An onsite seminar on disability awareness, accessibility, and inclusive student support.',
    requirements: 'GPS/geofencing and face biometric verification are required.',
    exclusivity: 'Open to All',
  },
  {
    id: 'ev8',
    title: 'Accessible Campus Services Orientation',
    tagline: 'Clear pathways to inclusive service delivery',
    category: 'Disability',
    type: 'Regular',
    modality: 'Hybrid',
    date: '2026-05-22',
    endDate: '2026-05-22',
    location: 'Student Services Center / Microsoft Teams',
    onlinePlatform: 'Microsoft Teams',
    maxParticipants: 100,
    registrationCount: 88,
    waitlistCount: 4,
    approvalStatus: 'Published',
    certTemplateStatus: 'Uploaded',
    csvVerificationStatus: 'Uploaded',
    csvLastUploadedFile: 'teams_accessible_services_2026-05-22.csv',
    csvUploadedAt: '2026-05-22 16:30',
    description: 'A hybrid orientation on campus accessibility services and referral pathways.',
    requirements: 'Selected attendance mode determines onsite or online verification flow.',
    exclusivity: 'Open to All',
  },
  {
    id: 'ev9',
    title: 'Disaster Resilience and Institutional Readiness Training',
    tagline: 'Prepared teams, resilient services',
    category: 'DRI',
    type: 'Regular',
    modality: 'Hybrid',
    date: '2026-05-24',
    endDate: '2026-05-24',
    location: 'DRRMO Training Room / Google Meet',
    onlinePlatform: 'Google Meet',
    maxParticipants: 140,
    registrationCount: 116,
    waitlistCount: 11,
    approvalStatus: 'Published',
    certTemplateStatus: 'Validated',
    csvVerificationStatus: 'Not Uploaded',
    description: 'A readiness training on continuity planning, emergency coordination, and institutional resilience.',
    requirements: 'Hybrid attendance verification applies. CSV log is required for online attendees.',
    exclusivity: 'By College',
  },
  {
    id: 'ev10',
    title: 'Emergency Preparedness and Response Seminar',
    tagline: 'Coordinated response for campus safety',
    category: 'DRI',
    type: 'Regular',
    modality: 'Onsite',
    date: '2026-09-05',
    endDate: '2026-09-05',
    location: 'PUP Oval',
    onlinePlatform: 'Not Applicable',
    maxParticipants: 300,
    registrationCount: 0,
    waitlistCount: 0,
    approvalStatus: 'Submitted',
    certTemplateStatus: 'Not Uploaded',
    csvVerificationStatus: 'Not Required',
    description: 'An onsite preparedness seminar with practical safety response orientation.',
    requirements: 'GPS/geofencing and face biometric verification are required.',
    exclusivity: 'Open to All',
  },
  {
    id: 'ev11',
    title: 'PUP Founding Anniversary Celebration',
    tagline: 'Celebrating service, scholarship, and community',
    category: 'University Activities',
    type: 'Regular',
    modality: 'Onsite',
    date: '2026-10-01',
    endDate: '2026-10-01',
    location: 'PUP Grounds',
    onlinePlatform: 'Not Applicable',
    maxParticipants: 800,
    registrationCount: 0,
    waitlistCount: 0,
    approvalStatus: 'Draft',
    certTemplateStatus: 'Not Uploaded',
    csvVerificationStatus: 'Not Required',
    description: 'A campus-wide anniversary celebration for the PUP community.',
    requirements: 'Onsite attendance verification only.',
    exclusivity: 'Open to All',
  },
  {
    id: 'ev12',
    title: 'University Christmas Program',
    tagline: 'Year-end fellowship for the PUP community',
    category: 'University Activities',
    type: 'Regular',
    modality: 'Hybrid',
    date: '2026-12-18',
    endDate: '2026-12-18',
    location: 'PUP Theater / Zoom',
    onlinePlatform: 'Zoom',
    maxParticipants: 400,
    registrationCount: 0,
    waitlistCount: 0,
    approvalStatus: 'Approved',
    certTemplateStatus: 'Not Uploaded',
    csvVerificationStatus: 'Not Uploaded',
    description: 'A hybrid year-end university program with onsite and online participation.',
    requirements: 'CSV verification becomes available after the event ends for online participants.',
    exclusivity: 'Open to All',
  },
  {
    id: 'ev13',
    title: 'Recognition Day and Campus-wide Assembly',
    tagline: 'Honoring service milestones and campus achievements',
    category: 'University Activities',
    type: 'Regular',
    modality: 'Onsite',
    date: '2026-11-20',
    endDate: '2026-11-20',
    location: 'PUP Main Auditorium',
    onlinePlatform: 'Not Applicable',
    maxParticipants: 500,
    registrationCount: 0,
    waitlistCount: 0,
    approvalStatus: 'Submitted',
    certTemplateStatus: 'Not Uploaded',
    csvVerificationStatus: 'Not Required',
    description: 'A university assembly and recognition program for campus-wide accomplishments.',
    requirements: 'Onsite attendance verification only.',
    exclusivity: 'Open to All',
  },
];

export function isOnlineOrHybridEvent(event: OrgEvent) {
  return event.modality === 'Online' || event.modality === 'Hybrid';
}

export function isCompletedEvent(event: OrgEvent, referenceDate = new Date()) {
  return new Date(`${event.endDate}T23:59:59`).getTime() < referenceDate.getTime();
}

export function canVerifyCsvForEvent(event: OrgEvent, referenceDate = new Date()) {
  return event.approvalStatus === 'Published' && isOnlineOrHybridEvent(event) && isCompletedEvent(event, referenceDate);
}

export function needsCsvVerification(event: OrgEvent, referenceDate = new Date()) {
  return canVerifyCsvForEvent(event, referenceDate) && event.csvVerificationStatus !== 'Verified';
}

export function isCertificateReleaseLocked(event?: OrgEvent) {
  return Boolean(event && isOnlineOrHybridEvent(event) && event.csvVerificationStatus !== 'Verified');
}

export const MOCK_REGISTRANTS: Registrant[] = [
  { id: 'r1', name: 'Maria Santos', email: 'maria.santos@pup.edu.ph', department: 'HRMD', program: 'Administrative Services', eventId: 'ev1', eventTitle: 'Supervisor Leadership Development Seminar', regStatus: 'Confirmed', attendanceStatus: 'Verified Attended', certStatus: 'Released' },
  { id: 'r2', name: 'Juan dela Cruz', email: 'juan.delacruz@pup.edu.ph', department: 'ICTO', program: 'Systems Support', eventId: 'ev1', eventTitle: 'Supervisor Leadership Development Seminar', regStatus: 'Confirmed', attendanceStatus: 'Verified Attended', certStatus: 'Verified Attended' },
  { id: 'r3', name: 'Ana Reyes', email: 'ana.reyes@pup.edu.ph', department: 'CAF', program: 'Accountancy', eventId: 'ev1', eventTitle: 'Supervisor Leadership Development Seminar', regStatus: 'Waitlisted', attendanceStatus: 'Pending Verification', certStatus: 'Not Available' },
  { id: 'r4', name: 'Carlo Mendoza', email: 'carlo.mendoza@pup.edu.ph', department: 'OVPAA', program: 'Academic Affairs', eventId: 'ev2', eventTitle: 'Effective Team Supervision Workshop', regStatus: 'Confirmed', attendanceStatus: 'Pending', certStatus: 'Pending Verification' },
  { id: 'r5', name: 'Liza Fernandez', email: 'liza.fernandez@pup.edu.ph', department: 'GAD Office', program: 'Extension Services', eventId: 'ev3', eventTitle: 'Gender and Development Awareness Forum', regStatus: 'Confirmed', attendanceStatus: 'Pending Verification', certStatus: 'Attendance Not Verified' },
  { id: 'r6', name: 'Mark Ramos', email: 'mark.ramos@pup.edu.ph', department: 'ICTO', program: 'Information Systems', eventId: 'ev6', eventTitle: 'AI and Digital Transformation Workshop', regStatus: 'Confirmed', attendanceStatus: 'Pending Verification', certStatus: 'Pending Verification' },
  { id: 'r7', name: 'Patricia Torres', email: 'patricia.torres@pup.edu.ph', department: 'DRRMO', program: 'Safety Office', eventId: 'ev9', eventTitle: 'Disaster Resilience and Institutional Readiness Training', regStatus: 'Confirmed', attendanceStatus: 'Pending Verification', certStatus: 'Attendance Not Verified' },
  { id: 'r8', name: 'Jose Villanueva', email: 'jose.villanueva@pup.edu.ph', department: 'OSS', program: 'Student Services', eventId: 'ev8', eventTitle: 'Accessible Campus Services Orientation', regStatus: 'Confirmed', attendanceStatus: 'Pending Verification', certStatus: 'Pending Verification' },
  { id: 'r9', name: 'Rosa Castillo', email: 'rosa.castillo@pup.edu.ph', department: 'CED', program: 'Elementary Education', eventId: 'ev7', eventTitle: 'Disability Awareness and Inclusion Seminar', regStatus: 'Confirmed', attendanceStatus: 'Present', certStatus: 'Released' },
  { id: 'r10', name: 'Daniel Cruz', email: 'daniel.cruz@pup.edu.ph', department: 'ICTO', program: 'Information Technology', eventId: 'ev7', eventTitle: 'Disability Awareness and Inclusion Seminar', regStatus: 'Confirmed', attendanceStatus: 'Present', certStatus: 'Released' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'a1', participantName: 'Maria Santos', email: 'maria.santos@pup.edu.ph', eventId: 'ev1', eventTitle: 'Supervisor Leadership Development Seminar', modality: 'Hybrid', checkInTime: '2026-05-10 08:02', gpsVerified: true, biometricVerified: true, csvMatched: true, attendanceDuration: '3h 58m', status: 'Verified Attended' },
  { id: 'a2', participantName: 'Juan dela Cruz', email: 'juan.delacruz@pup.edu.ph', eventId: 'ev1', eventTitle: 'Supervisor Leadership Development Seminar', modality: 'Hybrid', checkInTime: '2026-05-10 13:05', gpsVerified: false, biometricVerified: true, csvMatched: true, attendanceDuration: '3h 55m', status: 'Verified Attended' },
  { id: 'a3', participantName: 'Liza Fernandez', email: 'liza.fernandez@pup.edu.ph', eventId: 'ev3', eventTitle: 'Gender and Development Awareness Forum', modality: 'Online', checkInTime: '2026-05-20 09:00', gpsVerified: false, biometricVerified: true, csvMatched: false, attendanceDuration: '-', status: 'Pending Verification' },
  { id: 'a4', participantName: 'Rosa Castillo', email: 'rosa.castillo@pup.edu.ph', eventId: 'ev7', eventTitle: 'Disability Awareness and Inclusion Seminar', modality: 'Onsite', checkInTime: '2026-05-15 08:15', gpsVerified: true, biometricVerified: true, csvMatched: false, attendanceDuration: '5h 10m', status: 'Present' },
  { id: 'a5', participantName: 'Daniel Cruz', email: 'daniel.cruz@pup.edu.ph', eventId: 'ev7', eventTitle: 'Disability Awareness and Inclusion Seminar', modality: 'Onsite', checkInTime: '2026-05-15 08:30', gpsVerified: true, biometricVerified: true, csvMatched: false, attendanceDuration: '4h 55m', status: 'Present' },
];

export const MOCK_CERTS: CertRecord[] = [
  { id: 'c1', participantName: 'Maria Santos', email: 'maria.santos@pup.edu.ph', eventId: 'ev1', eventTitle: 'Supervisor Leadership Development Seminar', certNumber: 'SIGLA-2026-SL-0001', generatedDate: '2026-05-11', releasedDate: '2026-05-12', status: 'Released' },
  { id: 'c2', participantName: 'Juan dela Cruz', email: 'juan.delacruz@pup.edu.ph', eventId: 'ev1', eventTitle: 'Supervisor Leadership Development Seminar', certNumber: 'SIGLA-2026-SL-0002', generatedDate: '2026-05-11', releasedDate: '-', status: 'Verified Attended' },
  { id: 'c3', participantName: 'Ana Reyes', email: 'ana.reyes@pup.edu.ph', eventId: 'ev1', eventTitle: 'Supervisor Leadership Development Seminar', certNumber: '-', generatedDate: '-', releasedDate: '-', status: 'Not Available' },
  { id: 'c4', participantName: 'Liza Fernandez', email: 'liza.fernandez@pup.edu.ph', eventId: 'ev3', eventTitle: 'Gender and Development Awareness Forum', certNumber: '-', generatedDate: '-', releasedDate: '-', status: 'Attendance Not Verified' },
  { id: 'c5', participantName: 'Patricia Torres', email: 'patricia.torres@pup.edu.ph', eventId: 'ev9', eventTitle: 'Disaster Resilience and Institutional Readiness Training', certNumber: '-', generatedDate: '-', releasedDate: '-', status: 'Pending Verification' },
  { id: 'c6', participantName: 'Rosa Castillo', email: 'rosa.castillo@pup.edu.ph', eventId: 'ev7', eventTitle: 'Disability Awareness and Inclusion Seminar', certNumber: 'SIGLA-2026-DA-0001', generatedDate: '2026-05-16', releasedDate: '2026-05-17', status: 'Released' },
  { id: 'c7', participantName: 'Daniel Cruz', email: 'daniel.cruz@pup.edu.ph', eventId: 'ev7', eventTitle: 'Disability Awareness and Inclusion Seminar', certNumber: 'SIGLA-2026-DA-0002', generatedDate: '2026-05-16', releasedDate: '2026-05-17', status: 'Released' },
  { id: 'c8', participantName: 'Jose Villanueva', email: 'jose.villanueva@pup.edu.ph', eventId: 'ev8', eventTitle: 'Accessible Campus Services Orientation', certNumber: '-', generatedDate: '-', releasedDate: '-', status: 'Survey Required' },
];

export const APPROVAL_STATUS_STYLE: Record<ApprovalStatus, { bg: string; color: string }> = {
  Draft: { bg: '#9a7a5a18', color: '#9a7a5a' },
  Submitted: { bg: '#00598D18', color: '#00598D' },
  'Returned with Comments': { bg: '#EA694818', color: '#C05020' },
  Approved: { bg: '#27AE6018', color: '#1a8a44' },
  Rejected: { bg: '#D8584818', color: '#b03020' },
  Published: { bg: '#80000015', color: '#800000' },
};

export const CERT_STATUS_STYLE: Record<CertStatus, { bg: string; color: string }> = {
  'Not Available': { bg: '#9a7a5a12', color: '#9a7a5a' },
  'Survey Required': { bg: '#DAA52018', color: '#8a6010' },
  'Pending Verification': { bg: '#DAA52018', color: '#8a6010' },
  'Template Missing': { bg: '#EA694B18', color: '#C05020' },
  'Attendance Not Verified': { bg: '#D8584818', color: '#b03020' },
  'Verified Attended': { bg: '#27AE6018', color: '#1a8a44' },
  'Generating Certificate': { bg: '#00598D18', color: '#00598D' },
  Released: { bg: '#27AE6018', color: '#1a8a44' },
  'Not Eligible': { bg: '#D8584818', color: '#b03020' },
};

export const ATT_STATUS_STYLE: Record<AttendanceStatus, { bg: string; color: string }> = {
  Present: { bg: '#27AE6018', color: '#1a8a44' },
  Absent: { bg: '#D8584818', color: '#b03020' },
  Pending: { bg: '#DAA52018', color: '#8a6010' },
  'Verified Attended': { bg: '#27AE6018', color: '#1a8a44' },
  'Attendance Not Verified': { bg: '#D8584818', color: '#b03020' },
  'Pending Verification': { bg: '#DAA52018', color: '#8a6010' },
  'Not Eligible': { bg: '#D8584818', color: '#b03020' },
};
