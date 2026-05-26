import { createBrowserRouter } from 'react-router';
import { Homepage } from './components/Homepage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { BiometricEnrollment } from './components/BiometricEnrollment';
import { ParticipantDashboard } from './components/participant/ParticipantDashboard';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { CmoDashboard } from './components/cmo/CmoDashboard';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';

export const router = createBrowserRouter([
  { path: '/', Component: Homepage },
  { path: '/login', Component: LoginPage },
  { path: '/register', Component: RegisterPage },
  { path: '/biometric-enrollment', Component: BiometricEnrollment },
  { path: '/dashboard', Component: ParticipantDashboard },
  { path: '/organizer', Component: OrganizerDashboard },
  { path: '/cmo', Component: CmoDashboard },
  { path: '/forgot-password', Component: ForgotPasswordPage },
  { path: '*', Component: LoginPage },
]);
