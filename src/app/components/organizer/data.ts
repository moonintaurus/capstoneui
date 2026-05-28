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
  | 'Feedback Required'
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

export type FeedbackQuestionType = 'Rating' | 'Open Ended';
export type FeedbackSummaryStatus = 'Not Yet Available' | 'Collecting Responses' | 'Ready for Review' | 'No Responses Yet';

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
  sentiment: 'Positive' | 'Neutral' | 'Concern';
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
  { id: 'c8', participantName: 'Jose Villanueva', email: 'jose.villanueva@pup.edu.ph', eventId: 'ev8', eventTitle: 'Accessible Campus Services Orientation', certNumber: '-', generatedDate: '-', releasedDate: '-', status: 'Feedback Required' },
];

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
    section: 'Open Ended Feedback',
    prompt: 'What did you like most about the event?',
    type: 'Open Ended',
    required: false,
  },
  {
    id: 'fq16',
    section: 'Open Ended Feedback',
    prompt: 'What parts of the event should be improved?',
    type: 'Open Ended',
    required: false,
  },
  {
    id: 'fq17',
    section: 'Open Ended Feedback',
    prompt: 'What topics, activities, or event formats would you like to see in the future?',
    type: 'Open Ended',
    required: false,
  },
  {
    id: 'fq18',
    section: 'Open Ended Feedback',
    prompt: 'Do you have any additional comments, concerns, or suggestions?',
    type: 'Open Ended',
    required: false,
  },
];

export const MOCK_FEEDBACK_SUMMARIES: FeedbackSummary[] = [
  {
    eventId: 'ev1',
    eventTitle: 'Supervisor Leadership Development Seminar',
    status: 'Ready for Review',
    totalEligible: 64,
    totalResponses: 56,
    responseRate: 88,
    averageRating: 4.6,
    submittedUntil: '2026-05-17',
    questionResults: [
      { questionId: 'fq1', prompt: 'The event objectives were clearly explained.', averageScore: 4.7, responseCount: 56, positiveRate: 94, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 1 }, { score: 3, label: 'Neutral', count: 2 }, { score: 4, label: 'Agree', count: 15 }, { score: 5, label: 'Strongly Agree', count: 38 }] },
      { questionId: 'fq2', prompt: 'The topics discussed were relevant to my needs, interests, or role.', averageScore: 4.6, responseCount: 56, positiveRate: 91, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 1 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 14 }, { score: 5, label: 'Strongly Agree', count: 37 }] },
      { questionId: 'fq3', prompt: 'The event provided useful knowledge, skills, or information that I can apply.', averageScore: 4.5, responseCount: 56, positiveRate: 89, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 16 }, { score: 5, label: 'Strongly Agree', count: 34 }] },
      { questionId: 'fq4', prompt: 'The speaker or facilitator explained the topic clearly.', averageScore: 4.8, responseCount: 56, positiveRate: 96, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 0 }, { score: 3, label: 'Neutral', count: 2 }, { score: 4, label: 'Agree', count: 10 }, { score: 5, label: 'Strongly Agree', count: 44 }] },
      { questionId: 'fq5', prompt: 'The speaker or facilitator encouraged participation and engagement.', averageScore: 4.5, responseCount: 56, positiveRate: 88, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 16 }, { score: 5, label: 'Strongly Agree', count: 33 }] },
      { questionId: 'fq6', prompt: 'The examples, activities, or discussions helped me understand the topic better.', averageScore: 4.6, responseCount: 56, positiveRate: 91, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 1 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 15 }, { score: 5, label: 'Strongly Agree', count: 36 }] },
      { questionId: 'fq7', prompt: 'The event was well organized and easy to follow.', averageScore: 4.4, responseCount: 56, positiveRate: 86, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 18 }, { score: 5, label: 'Strongly Agree', count: 30 }] },
      { questionId: 'fq8', prompt: 'The event schedule, pacing, and duration were appropriate.', averageScore: 4.3, responseCount: 56, positiveRate: 82, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 19 }, { score: 5, label: 'Strongly Agree', count: 27 }] },
      { questionId: 'fq9', prompt: 'The venue or online platform was accessible and easy to use.', averageScore: 4.5, responseCount: 56, positiveRate: 88, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 15 }, { score: 5, label: 'Strongly Agree', count: 34 }] },
      { questionId: 'fq10', prompt: 'Announcements, reminders, and instructions before or during the event were clear.', averageScore: 4.4, responseCount: 56, positiveRate: 86, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 17 }, { score: 5, label: 'Strongly Agree', count: 31 }] },
      { questionId: 'fq11', prompt: 'The event check-in or attendance verification process was easy to complete.', averageScore: 4.3, responseCount: 56, positiveRate: 84, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 18 }, { score: 5, label: 'Strongly Agree', count: 29 }] },
      { questionId: 'fq12', prompt: 'The system made event registration, attendance, and feedback submission convenient.', averageScore: 4.5, responseCount: 56, positiveRate: 88, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 15 }, { score: 5, label: 'Strongly Agree', count: 34 }] },
      { questionId: 'fq13', prompt: 'Overall, I am satisfied with the event.', averageScore: 4.6, responseCount: 56, positiveRate: 91, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 1 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 14 }, { score: 5, label: 'Strongly Agree', count: 37 }] },
      { questionId: 'fq14', prompt: 'I would recommend similar events to other participants.', averageScore: 4.7, responseCount: 56, positiveRate: 93, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 1 }, { score: 3, label: 'Neutral', count: 3 }, { score: 4, label: 'Agree', count: 13 }, { score: 5, label: 'Strongly Agree', count: 39 }] },
    ],
    commonThemes: [
      { label: 'Clear leadership examples', mentions: 24, sentiment: 'Positive' },
      { label: 'Useful supervisory tools', mentions: 18, sentiment: 'Positive' },
      { label: 'Long waiting time during hybrid transition', mentions: 7, sentiment: 'Concern' },
      { label: 'Request for follow-up workshops', mentions: 12, sentiment: 'Neutral' },
    ],
    openEndedResponses: [
    {
      questionId: 'fq15',
      prompt: 'What did you like most about the event?',
      responseCount: 4,
      answers: [
        { id: 'fq15-r1', respondentLabel: 'R1', submittedAt: '2026-05-10 18:12', answer: 'The practical leadership scenarios were easy to relate to our daily office work.' },
        { id: 'fq15-r2', respondentLabel: 'R2', submittedAt: '2026-05-10 18:18', answer: 'I liked the examples about handling coordination problems and documenting decisions.' },
        { id: 'fq15-r3', respondentLabel: 'R3', submittedAt: '2026-05-10 18:20', answer: 'The speaker was clear and gave realistic supervisor situations.' },
        { id: 'fq15-r4', respondentLabel: 'R4', submittedAt: '2026-05-10 18:33', answer: 'The event gave useful tools for team accountability.' },
      ],
    },
    {
      questionId: 'fq16',
      prompt: 'What parts of the event should be improved?',
      responseCount: 3,
      answers: [
        { id: 'fq16-r5', respondentLabel: 'R5', submittedAt: '2026-05-10 18:40', answer: 'The transition between onsite and Zoom participants took too long.' },
        { id: 'fq16-r6', respondentLabel: 'R6', submittedAt: '2026-05-10 18:44', answer: 'Please provide the slides earlier or upload them after the event.' },
        { id: 'fq16-r7', respondentLabel: 'R7', submittedAt: '2026-05-10 19:02', answer: 'More time for the question and answer portion would be helpful.' },
      ],
    },
    {
      questionId: 'fq17',
      prompt: 'What topics, activities, or event formats would you like to see in the future?',
      responseCount: 3,
      answers: [
        { id: 'fq17-r8', respondentLabel: 'R8', submittedAt: '2026-05-10 19:11', answer: 'A follow-up session on conflict management would be helpful.' },
        { id: 'fq17-r9', respondentLabel: 'R9', submittedAt: '2026-05-10 19:18', answer: 'Please include workshops on documentation and performance coaching.' },
        { id: 'fq17-r10', respondentLabel: 'R10', submittedAt: '2026-05-10 19:25', answer: 'More case-based group activities for supervisors.' },
      ],
    },
    {
      questionId: 'fq18',
      prompt: 'Do you have any additional comments, concerns, or suggestions?',
      responseCount: 2,
      answers: [
        { id: 'fq18-r11', respondentLabel: 'R11', submittedAt: '2026-05-10 19:35', answer: 'Overall, the seminar was useful and well facilitated.' },
        { id: 'fq18-r12', respondentLabel: 'R12', submittedAt: '2026-05-10 19:42', answer: 'Please improve the waiting time for hybrid participants.' },
      ],
    },
    ],
  },
  {
    eventId: 'ev3',
    eventTitle: 'Gender and Development Awareness Forum',
    status: 'Collecting Responses',
    totalEligible: 82,
    totalResponses: 61,
    responseRate: 74,
    averageRating: 4.4,
    submittedUntil: '2026-05-27',
    questionResults: [
      { questionId: 'fq1', prompt: 'The event objectives were clearly explained.', averageScore: 4.5, responseCount: 61, positiveRate: 90, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 18 }, { score: 5, label: 'Strongly Agree', count: 37 }] },
      { questionId: 'fq2', prompt: 'The topics discussed were relevant to my needs, interests, or role.', averageScore: 4.4, responseCount: 61, positiveRate: 87, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 19 }, { score: 5, label: 'Strongly Agree', count: 34 }] },
      { questionId: 'fq3', prompt: 'The event provided useful knowledge, skills, or information that I can apply.', averageScore: 4.4, responseCount: 61, positiveRate: 86, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 18 }, { score: 5, label: 'Strongly Agree', count: 34 }] },
      { questionId: 'fq4', prompt: 'The speaker or facilitator explained the topic clearly.', averageScore: 4.6, responseCount: 61, positiveRate: 92, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 1 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 16 }, { score: 5, label: 'Strongly Agree', count: 40 }] },
      { questionId: 'fq5', prompt: 'The speaker or facilitator encouraged participation and engagement.', averageScore: 4.4, responseCount: 61, positiveRate: 87, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 18 }, { score: 5, label: 'Strongly Agree', count: 35 }] },
      { questionId: 'fq6', prompt: 'The examples, activities, or discussions helped me understand the topic better.', averageScore: 4.3, responseCount: 61, positiveRate: 84, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 19 }, { score: 5, label: 'Strongly Agree', count: 32 }] },
      { questionId: 'fq7', prompt: 'The event was well organized and easy to follow.', averageScore: 4.1, responseCount: 61, positiveRate: 80, distribution: [{ score: 1, label: 'Strongly Disagree', count: 2 }, { score: 2, label: 'Disagree', count: 4 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 22 }, { score: 5, label: 'Strongly Agree', count: 27 }] },
      { questionId: 'fq8', prompt: 'The event schedule, pacing, and duration were appropriate.', averageScore: 4.2, responseCount: 61, positiveRate: 82, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 4 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 21 }, { score: 5, label: 'Strongly Agree', count: 29 }] },
      { questionId: 'fq9', prompt: 'The venue or online platform was accessible and easy to use.', averageScore: 4.4, responseCount: 61, positiveRate: 86, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 18 }, { score: 5, label: 'Strongly Agree', count: 34 }] },
      { questionId: 'fq10', prompt: 'Announcements, reminders, and instructions before or during the event were clear.', averageScore: 4.0, responseCount: 61, positiveRate: 77, distribution: [{ score: 1, label: 'Strongly Disagree', count: 3 }, { score: 2, label: 'Disagree', count: 4 }, { score: 3, label: 'Neutral', count: 7 }, { score: 4, label: 'Agree', count: 20 }, { score: 5, label: 'Strongly Agree', count: 27 }] },
      { questionId: 'fq11', prompt: 'The event check-in or attendance verification process was easy to complete.', averageScore: 4.2, responseCount: 61, positiveRate: 82, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 4 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 21 }, { score: 5, label: 'Strongly Agree', count: 29 }] },
      { questionId: 'fq12', prompt: 'The system made event registration, attendance, and feedback submission convenient.', averageScore: 4.3, responseCount: 61, positiveRate: 84, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 19 }, { score: 5, label: 'Strongly Agree', count: 32 }] },
      { questionId: 'fq13', prompt: 'Overall, I am satisfied with the event.', averageScore: 4.3, responseCount: 61, positiveRate: 84, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 19 }, { score: 5, label: 'Strongly Agree', count: 32 }] },
      { questionId: 'fq14', prompt: 'I would recommend similar events to other participants.', averageScore: 4.5, responseCount: 61, positiveRate: 89, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 18 }, { score: 5, label: 'Strongly Agree', count: 36 }] },
    ],
    commonThemes: [
      { label: 'Inclusive examples', mentions: 21, sentiment: 'Positive' },
      { label: 'Clear support channels', mentions: 16, sentiment: 'Positive' },
      { label: 'Meeting link reminders', mentions: 9, sentiment: 'Concern' },
      { label: 'More open forum time', mentions: 11, sentiment: 'Neutral' },
    ],
    openEndedResponses: [
    {
      questionId: 'fq15',
      prompt: 'What did you like most about the event?',
      responseCount: 3,
      answers: [
        { id: 'fq15-r1', respondentLabel: 'R1', submittedAt: '2026-05-20 16:30', answer: 'The inclusive examples helped us understand respectful communication better.' },
        { id: 'fq15-r2', respondentLabel: 'R2', submittedAt: '2026-05-20 16:39', answer: 'The resource speaker explained sensitive topics clearly.' },
        { id: 'fq15-r3', respondentLabel: 'R3', submittedAt: '2026-05-20 16:45', answer: 'I appreciated the discussion on support channels and reporting pathways.' },
      ],
    },
    {
      questionId: 'fq16',
      prompt: 'What parts of the event should be improved?',
      responseCount: 3,
      answers: [
        { id: 'fq16-r4', respondentLabel: 'R4', submittedAt: '2026-05-20 17:01', answer: 'The meeting link reminder should be sent earlier.' },
        { id: 'fq16-r5', respondentLabel: 'R5', submittedAt: '2026-05-20 17:08', answer: 'Please extend the open forum because many questions were not answered.' },
        { id: 'fq16-r6', respondentLabel: 'R6', submittedAt: '2026-05-20 17:13', answer: 'The online audio was clear, but the chat questions were not always read.' },
      ],
    },
    {
      questionId: 'fq17',
      prompt: 'What topics, activities, or event formats would you like to see in the future?',
      responseCount: 2,
      answers: [
        { id: 'fq17-r7', respondentLabel: 'R7', submittedAt: '2026-05-20 17:25', answer: 'More workshops on safe spaces policies and real examples.' },
        { id: 'fq17-r8', respondentLabel: 'R8', submittedAt: '2026-05-20 17:32', answer: 'A seminar about gender sensitivity in student services.' },
      ],
    },
    {
      questionId: 'fq18',
      prompt: 'Do you have any additional comments, concerns, or suggestions?',
      responseCount: 2,
      answers: [
        { id: 'fq18-r9', respondentLabel: 'R9', submittedAt: '2026-05-20 17:38', answer: 'The event was helpful and should be repeated for other offices.' },
        { id: 'fq18-r10', respondentLabel: 'R10', submittedAt: '2026-05-20 17:40', answer: 'Please provide a copy of the presentation after the event.' },
      ],
    },
    ],
  },
  {
    eventId: 'ev7',
    eventTitle: 'Disability Awareness and Inclusion Seminar',
    status: 'Ready for Review',
    totalEligible: 151,
    totalResponses: 139,
    responseRate: 92,
    averageRating: 4.7,
    submittedUntil: '2026-05-22',
    questionResults: [
      { questionId: 'fq1', prompt: 'The event objectives were clearly explained.', averageScore: 4.8, responseCount: 139, positiveRate: 96, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 1 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 24 }, { score: 5, label: 'Strongly Agree', count: 110 }] },
      { questionId: 'fq2', prompt: 'The topics discussed were relevant to my needs, interests, or role.', averageScore: 4.7, responseCount: 139, positiveRate: 94, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 27 }, { score: 5, label: 'Strongly Agree', count: 104 }] },
      { questionId: 'fq3', prompt: 'The event provided useful knowledge, skills, or information that I can apply.', averageScore: 4.7, responseCount: 139, positiveRate: 94, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 28 }, { score: 5, label: 'Strongly Agree', count: 103 }] },
      { questionId: 'fq4', prompt: 'The speaker or facilitator explained the topic clearly.', averageScore: 4.8, responseCount: 139, positiveRate: 95, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 1 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 24 }, { score: 5, label: 'Strongly Agree', count: 109 }] },
      { questionId: 'fq5', prompt: 'The speaker or facilitator encouraged participation and engagement.', averageScore: 4.6, responseCount: 139, positiveRate: 91, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 8 }, { score: 4, label: 'Agree', count: 30 }, { score: 5, label: 'Strongly Agree', count: 97 }] },
      { questionId: 'fq6', prompt: 'The examples, activities, or discussions helped me understand the topic better.', averageScore: 4.7, responseCount: 139, positiveRate: 94, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 27 }, { score: 5, label: 'Strongly Agree', count: 104 }] },
      { questionId: 'fq7', prompt: 'The event was well organized and easy to follow.', averageScore: 4.6, responseCount: 139, positiveRate: 91, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 8 }, { score: 4, label: 'Agree', count: 31 }, { score: 5, label: 'Strongly Agree', count: 96 }] },
      { questionId: 'fq8', prompt: 'The event schedule, pacing, and duration were appropriate.', averageScore: 4.5, responseCount: 139, positiveRate: 89, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 4 }, { score: 3, label: 'Neutral', count: 10 }, { score: 4, label: 'Agree', count: 32 }, { score: 5, label: 'Strongly Agree', count: 92 }] },
      { questionId: 'fq9', prompt: 'The venue or online platform was accessible and easy to use.', averageScore: 4.5, responseCount: 139, positiveRate: 88, distribution: [{ score: 1, label: 'Strongly Disagree', count: 2 }, { score: 2, label: 'Disagree', count: 4 }, { score: 3, label: 'Neutral', count: 11 }, { score: 4, label: 'Agree', count: 30 }, { score: 5, label: 'Strongly Agree', count: 92 }] },
      { questionId: 'fq10', prompt: 'Announcements, reminders, and instructions before or during the event were clear.', averageScore: 4.6, responseCount: 139, positiveRate: 91, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 8 }, { score: 4, label: 'Agree', count: 30 }, { score: 5, label: 'Strongly Agree', count: 97 }] },
      { questionId: 'fq11', prompt: 'The event check-in or attendance verification process was easy to complete.', averageScore: 4.5, responseCount: 139, positiveRate: 89, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 4 }, { score: 3, label: 'Neutral', count: 10 }, { score: 4, label: 'Agree', count: 32 }, { score: 5, label: 'Strongly Agree', count: 92 }] },
      { questionId: 'fq12', prompt: 'The system made event registration, attendance, and feedback submission convenient.', averageScore: 4.6, responseCount: 139, positiveRate: 91, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 8 }, { score: 4, label: 'Agree', count: 31 }, { score: 5, label: 'Strongly Agree', count: 96 }] },
      { questionId: 'fq13', prompt: 'Overall, I am satisfied with the event.', averageScore: 4.7, responseCount: 139, positiveRate: 94, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 28 }, { score: 5, label: 'Strongly Agree', count: 103 }] },
      { questionId: 'fq14', prompt: 'I would recommend similar events to other participants.', averageScore: 4.8, responseCount: 139, positiveRate: 96, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 1 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 24 }, { score: 5, label: 'Strongly Agree', count: 110 }] },
    ],
    commonThemes: [
      { label: 'Accessible examples', mentions: 42, sentiment: 'Positive' },
      { label: 'Respectful facilitation', mentions: 31, sentiment: 'Positive' },
      { label: 'More venue signages', mentions: 12, sentiment: 'Concern' },
      { label: 'Request for service guide copies', mentions: 20, sentiment: 'Neutral' },
    ],
    openEndedResponses: [
    {
      questionId: 'fq15',
      prompt: 'What did you like most about the event?',
      responseCount: 4,
      answers: [
        { id: 'fq15-r1', respondentLabel: 'R1', submittedAt: '2026-05-15 15:20', answer: 'The examples on inclusive language and accessible service were very practical.' },
        { id: 'fq15-r2', respondentLabel: 'R2', submittedAt: '2026-05-15 15:27', answer: 'The facilitator was respectful and made the topic easy to understand.' },
        { id: 'fq15-r3', respondentLabel: 'R3', submittedAt: '2026-05-15 15:40', answer: 'I liked the checklist for making services more accessible.' },
        { id: 'fq15-r4', respondentLabel: 'R4', submittedAt: '2026-05-15 15:45', answer: 'The event helped me understand how to assist students with different needs.' },
      ],
    },
    {
      questionId: 'fq16',
      prompt: 'What parts of the event should be improved?',
      responseCount: 3,
      answers: [
        { id: 'fq16-r5', respondentLabel: 'R5', submittedAt: '2026-05-15 16:02', answer: 'There should be clearer signs going to the venue.' },
        { id: 'fq16-r6', respondentLabel: 'R6', submittedAt: '2026-05-15 16:08', answer: 'Please make handouts available in advance.' },
        { id: 'fq16-r7', respondentLabel: 'R7', submittedAt: '2026-05-15 16:13', answer: 'More time for demonstrations would improve the session.' },
      ],
    },
    {
      questionId: 'fq17',
      prompt: 'What topics, activities, or event formats would you like to see in the future?',
      responseCount: 3,
      answers: [
        { id: 'fq17-r8', respondentLabel: 'R8', submittedAt: '2026-05-15 16:21', answer: 'A hands-on accessibility audit activity would be useful.' },
        { id: 'fq17-r9', respondentLabel: 'R9', submittedAt: '2026-05-15 16:35', answer: 'More seminars on inclusive communication with students and guests.' },
        { id: 'fq17-r10', respondentLabel: 'R10', submittedAt: '2026-05-15 16:41', answer: 'A workshop focused on accessible documents and online materials.' },
      ],
    },
    {
      questionId: 'fq18',
      prompt: 'Do you have any additional comments, concerns, or suggestions?',
      responseCount: 2,
      answers: [
        { id: 'fq18-r11', respondentLabel: 'R11', submittedAt: '2026-05-15 16:50', answer: 'Thank you for offering this seminar. It should be required for service offices.' },
        { id: 'fq18-r12', respondentLabel: 'R12', submittedAt: '2026-05-15 16:55', answer: 'Please share the materials through the system after the event.' },
      ],
    },
    ],
  },
  {
    eventId: 'ev8',
    eventTitle: 'Accessible Campus Services Orientation',
    status: 'Collecting Responses',
    totalEligible: 78,
    totalResponses: 45,
    responseRate: 58,
    averageRating: 4.2,
    submittedUntil: '2026-05-29',
    questionResults: [
      { questionId: 'fq1', prompt: 'The event objectives were clearly explained.', averageScore: 4.3, responseCount: 45, positiveRate: 84, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 1 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 14 }, { score: 5, label: 'Strongly Agree', count: 24 }] },
      { questionId: 'fq2', prompt: 'The topics discussed were relevant to my needs, interests, or role.', averageScore: 4.2, responseCount: 45, positiveRate: 82, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 14 }, { score: 5, label: 'Strongly Agree', count: 23 }] },
      { questionId: 'fq3', prompt: 'The event provided useful knowledge, skills, or information that I can apply.', averageScore: 4.2, responseCount: 45, positiveRate: 82, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 15 }, { score: 5, label: 'Strongly Agree', count: 22 }] },
      { questionId: 'fq4', prompt: 'The speaker or facilitator explained the topic clearly.', averageScore: 4.4, responseCount: 45, positiveRate: 87, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 13 }, { score: 5, label: 'Strongly Agree', count: 26 }] },
      { questionId: 'fq5', prompt: 'The speaker or facilitator encouraged participation and engagement.', averageScore: 4.2, responseCount: 45, positiveRate: 80, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 15 }, { score: 5, label: 'Strongly Agree', count: 21 }] },
      { questionId: 'fq6', prompt: 'The examples, activities, or discussions helped me understand the topic better.', averageScore: 4.1, responseCount: 45, positiveRate: 78, distribution: [{ score: 1, label: 'Strongly Disagree', count: 2 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 15 }, { score: 5, label: 'Strongly Agree', count: 20 }] },
      { questionId: 'fq7', prompt: 'The event was well organized and easy to follow.', averageScore: 4.0, responseCount: 45, positiveRate: 76, distribution: [{ score: 1, label: 'Strongly Disagree', count: 2 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 15 }, { score: 5, label: 'Strongly Agree', count: 19 }] },
      { questionId: 'fq8', prompt: 'The event schedule, pacing, and duration were appropriate.', averageScore: 4.0, responseCount: 45, positiveRate: 76, distribution: [{ score: 1, label: 'Strongly Disagree', count: 2 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 15 }, { score: 5, label: 'Strongly Agree', count: 19 }] },
      { questionId: 'fq9', prompt: 'The venue or online platform was accessible and easy to use.', averageScore: 3.9, responseCount: 45, positiveRate: 73, distribution: [{ score: 1, label: 'Strongly Disagree', count: 3 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 15 }, { score: 5, label: 'Strongly Agree', count: 18 }] },
      { questionId: 'fq10', prompt: 'Announcements, reminders, and instructions before or during the event were clear.', averageScore: 4.1, responseCount: 45, positiveRate: 78, distribution: [{ score: 1, label: 'Strongly Disagree', count: 2 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 15 }, { score: 5, label: 'Strongly Agree', count: 20 }] },
      { questionId: 'fq11', prompt: 'The event check-in or attendance verification process was easy to complete.', averageScore: 4.0, responseCount: 45, positiveRate: 76, distribution: [{ score: 1, label: 'Strongly Disagree', count: 2 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 6 }, { score: 4, label: 'Agree', count: 15 }, { score: 5, label: 'Strongly Agree', count: 19 }] },
      { questionId: 'fq12', prompt: 'The system made event registration, attendance, and feedback submission convenient.', averageScore: 4.2, responseCount: 45, positiveRate: 80, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 15 }, { score: 5, label: 'Strongly Agree', count: 21 }] },
      { questionId: 'fq13', prompt: 'Overall, I am satisfied with the event.', averageScore: 4.1, responseCount: 45, positiveRate: 80, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 16 }, { score: 5, label: 'Strongly Agree', count: 20 }] },
      { questionId: 'fq14', prompt: 'I would recommend similar events to other participants.', averageScore: 4.2, responseCount: 45, positiveRate: 82, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 14 }, { score: 5, label: 'Strongly Agree', count: 23 }] },
    ],
    commonThemes: [
      { label: 'Helpful service walkthrough', mentions: 19, sentiment: 'Positive' },
      { label: 'Clear referral pathways', mentions: 14, sentiment: 'Positive' },
      { label: 'Hybrid audio issues', mentions: 8, sentiment: 'Concern' },
      { label: 'Downloadable guides requested', mentions: 10, sentiment: 'Neutral' },
    ],
    openEndedResponses: [
    {
      questionId: 'fq15',
      prompt: 'What did you like most about the event?',
      responseCount: 3,
      answers: [
        { id: 'fq15-r1', respondentLabel: 'R1', submittedAt: '2026-05-22 16:48', answer: 'The walkthrough of campus services was clear and helpful.' },
        { id: 'fq15-r2', respondentLabel: 'R2', submittedAt: '2026-05-22 16:52', answer: 'I liked the explanation of referral pathways.' },
        { id: 'fq15-r3', respondentLabel: 'R3', submittedAt: '2026-05-22 17:01', answer: 'The orientation helped me understand where to direct students.' },
      ],
    },
    {
      questionId: 'fq16',
      prompt: 'What parts of the event should be improved?',
      responseCount: 3,
      answers: [
        { id: 'fq16-r4', respondentLabel: 'R4', submittedAt: '2026-05-22 17:10', answer: 'Some online participants experienced audio issues.' },
        { id: 'fq16-r5', respondentLabel: 'R5', submittedAt: '2026-05-22 17:15', answer: 'Please provide downloadable guides after the session.' },
        { id: 'fq16-r6', respondentLabel: 'R6', submittedAt: '2026-05-22 17:21', answer: 'The Q&A could be longer.' },
      ],
    },
    {
      questionId: 'fq17',
      prompt: 'What topics, activities, or event formats would you like to see in the future?',
      responseCount: 2,
      answers: [
        { id: 'fq17-r7', respondentLabel: 'R7', submittedAt: '2026-05-22 17:34', answer: 'A demo on how to file support requests would be useful.' },
        { id: 'fq17-r8', respondentLabel: 'R8', submittedAt: '2026-05-22 17:40', answer: 'More orientations for new students and faculty.' },
      ],
    },
    {
      questionId: 'fq18',
      prompt: 'Do you have any additional comments, concerns, or suggestions?',
      responseCount: 2,
      answers: [
        { id: 'fq18-r9', respondentLabel: 'R9', submittedAt: '2026-05-22 17:49', answer: 'The orientation was useful but the hybrid setup needs better audio.' },
        { id: 'fq18-r10', respondentLabel: 'R10', submittedAt: '2026-05-22 17:55', answer: 'Please make the guide accessible through SIGLA.' },
      ],
    },
    ],
  },
  {
    eventId: 'ev9',
    eventTitle: 'Disaster Resilience and Institutional Readiness Training',
    status: 'Collecting Responses',
    totalEligible: 102,
    totalResponses: 38,
    responseRate: 37,
    averageRating: 4.3,
    submittedUntil: '2026-05-31',
    questionResults: [
      { questionId: 'fq1', prompt: 'The event objectives were clearly explained.', averageScore: 4.5, responseCount: 38, positiveRate: 89, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 1 }, { score: 3, label: 'Neutral', count: 3 }, { score: 4, label: 'Agree', count: 11 }, { score: 5, label: 'Strongly Agree', count: 23 }] },
      { questionId: 'fq2', prompt: 'The topics discussed were relevant to my needs, interests, or role.', averageScore: 4.4, responseCount: 38, positiveRate: 86, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 3 }, { score: 4, label: 'Agree', count: 12 }, { score: 5, label: 'Strongly Agree', count: 21 }] },
      { questionId: 'fq3', prompt: 'The event provided useful knowledge, skills, or information that I can apply.', averageScore: 4.4, responseCount: 38, positiveRate: 86, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 3 }, { score: 4, label: 'Agree', count: 12 }, { score: 5, label: 'Strongly Agree', count: 21 }] },
      { questionId: 'fq4', prompt: 'The speaker or facilitator explained the topic clearly.', averageScore: 4.5, responseCount: 38, positiveRate: 88, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 1 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 10 }, { score: 5, label: 'Strongly Agree', count: 23 }] },
      { questionId: 'fq5', prompt: 'The speaker or facilitator encouraged participation and engagement.', averageScore: 4.2, responseCount: 38, positiveRate: 81, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 12 }, { score: 5, label: 'Strongly Agree', count: 19 }] },
      { questionId: 'fq6', prompt: 'The examples, activities, or discussions helped me understand the topic better.', averageScore: 4.3, responseCount: 38, positiveRate: 84, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 12 }, { score: 5, label: 'Strongly Agree', count: 20 }] },
      { questionId: 'fq7', prompt: 'The event was well organized and easy to follow.', averageScore: 4.1, responseCount: 38, positiveRate: 79, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 13 }, { score: 5, label: 'Strongly Agree', count: 17 }] },
      { questionId: 'fq8', prompt: 'The event schedule, pacing, and duration were appropriate.', averageScore: 4.0, responseCount: 38, positiveRate: 76, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 5 }, { score: 4, label: 'Agree', count: 13 }, { score: 5, label: 'Strongly Agree', count: 16 }] },
      { questionId: 'fq9', prompt: 'The venue or online platform was accessible and easy to use.', averageScore: 4.1, responseCount: 38, positiveRate: 79, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 13 }, { score: 5, label: 'Strongly Agree', count: 17 }] },
      { questionId: 'fq10', prompt: 'Announcements, reminders, and instructions before or during the event were clear.', averageScore: 4.1, responseCount: 38, positiveRate: 79, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 3 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 13 }, { score: 5, label: 'Strongly Agree', count: 17 }] },
      { questionId: 'fq11', prompt: 'The event check-in or attendance verification process was easy to complete.', averageScore: 4.2, responseCount: 38, positiveRate: 81, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 12 }, { score: 5, label: 'Strongly Agree', count: 19 }] },
      { questionId: 'fq12', prompt: 'The system made event registration, attendance, and feedback submission convenient.', averageScore: 4.2, responseCount: 38, positiveRate: 81, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 12 }, { score: 5, label: 'Strongly Agree', count: 19 }] },
      { questionId: 'fq13', prompt: 'Overall, I am satisfied with the event.', averageScore: 4.2, responseCount: 38, positiveRate: 82, distribution: [{ score: 1, label: 'Strongly Disagree', count: 1 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 12 }, { score: 5, label: 'Strongly Agree', count: 19 }] },
      { questionId: 'fq14', prompt: 'I would recommend similar events to other participants.', averageScore: 4.3, responseCount: 38, positiveRate: 84, distribution: [{ score: 1, label: 'Strongly Disagree', count: 0 }, { score: 2, label: 'Disagree', count: 2 }, { score: 3, label: 'Neutral', count: 4 }, { score: 4, label: 'Agree', count: 12 }, { score: 5, label: 'Strongly Agree', count: 20 }] },
    ],
    commonThemes: [
      { label: 'Useful readiness checklist', mentions: 17, sentiment: 'Positive' },
      { label: 'Practical emergency examples', mentions: 13, sentiment: 'Positive' },
      { label: 'Need more hands-on drills', mentions: 10, sentiment: 'Concern' },
      { label: 'Separate beginner and advanced sessions', mentions: 6, sentiment: 'Neutral' },
    ],
    openEndedResponses: [
    {
      questionId: 'fq15',
      prompt: 'What did you like most about the event?',
      responseCount: 3,
      answers: [
        { id: 'fq15-r1', respondentLabel: 'R1', submittedAt: '2026-05-25 16:05', answer: 'The readiness checklist was useful for office planning.' },
        { id: 'fq15-r2', respondentLabel: 'R2', submittedAt: '2026-05-25 16:12', answer: 'The emergency examples were practical and easy to understand.' },
        { id: 'fq15-r3', respondentLabel: 'R3', submittedAt: '2026-05-25 16:18', answer: 'I liked the continuity planning discussion.' },
      ],
    },
    {
      questionId: 'fq16',
      prompt: 'What parts of the event should be improved?',
      responseCount: 3,
      answers: [
        { id: 'fq16-r4', respondentLabel: 'R4', submittedAt: '2026-05-25 16:26', answer: 'There should be more hands-on drills.' },
        { id: 'fq16-r5', respondentLabel: 'R5', submittedAt: '2026-05-25 16:31', answer: 'The session felt short for the number of topics.' },
        { id: 'fq16-r6', respondentLabel: 'R6', submittedAt: '2026-05-25 16:37', answer: 'Please separate basic and advanced topics.' },
      ],
    },
    {
      questionId: 'fq17',
      prompt: 'What topics, activities, or event formats would you like to see in the future?',
      responseCount: 3,
      answers: [
        { id: 'fq17-r7', respondentLabel: 'R7', submittedAt: '2026-05-25 16:48', answer: 'Simulation-based emergency response training.' },
        { id: 'fq17-r8', respondentLabel: 'R8', submittedAt: '2026-05-25 16:55', answer: 'Department-level continuity planning workshop.' },
        { id: 'fq17-r9', respondentLabel: 'R9', submittedAt: '2026-05-25 17:00', answer: 'More tabletop exercises with different scenarios.' },
      ],
    },
    {
      questionId: 'fq18',
      prompt: 'Do you have any additional comments, concerns, or suggestions?',
      responseCount: 2,
      answers: [
        { id: 'fq18-r10', respondentLabel: 'R10', submittedAt: '2026-05-25 17:08', answer: 'The event was helpful but should include actual drills next time.' },
        { id: 'fq18-r11', respondentLabel: 'R11', submittedAt: '2026-05-25 17:12', answer: 'Please provide templates for readiness planning.' },
      ],
    },
    ],
  }
];

export function getEventFeedbackSummary(eventId: string) {
  return MOCK_FEEDBACK_SUMMARIES.find(summary => summary.eventId === eventId);
}

export function getFeedbackStatusForEvent(event: OrgEvent, referenceDate = new Date()) {
  if (!isCompletedEvent(event, referenceDate)) return 'Available After Event';
  return getEventFeedbackSummary(event.id)?.status ?? 'No Responses Yet';
}

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
  'Feedback Required': { bg: '#DAA52018', color: '#8a6010' },
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
