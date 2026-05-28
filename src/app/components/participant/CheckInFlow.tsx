import { CheckInProvider, useCheckIn } from './CheckInContext';
import { OnsiteLocationPermissionView } from './OnsiteLocationPermissionView';
import { OnsiteGeofenceValidationView } from './OnsiteGeofenceValidationView';
import { OnsiteBiometricView } from './OnsiteBiometricView';
import { OnlineEventCheckInView } from './OnlineEventCheckInView';
import { OnlineBiometricView } from './OnlineBiometricView';
import { CheckInConfirmationView } from './CheckInConfirmationView';
import { UnlockMeetingLinkView } from './UnlockMeetingLinkView';
import type { Event } from './data';

interface CheckInFlowProps {
  event: Event;
  onClose: () => void;
}

function CheckInFlowContent({ event, onClose }: CheckInFlowProps) {
  const { state, setCurrentStep } = useCheckIn();

  const handleNext = () => {
    // Navigation happens via setCurrentStep in the view components
  };

  const renderView = () => {
    switch (state.currentStep) {
      // Onsite flow
      case 'location-permission':
        return <OnsiteLocationPermissionView onNext={handleNext} />;
      case 'geofence':
        return <OnsiteGeofenceValidationView onNext={handleNext} />;
      case 'biometric':
        return state.eventModality === 'Online'
          ? <OnlineBiometricView onNext={handleNext} />
          : <OnsiteBiometricView onNext={handleNext} />;
      case 'confirmation':
        return <CheckInConfirmationView onClose={onClose} />;

      // Online flow
      case 'online-checkin':
        return <OnlineEventCheckInView onNext={handleNext} />;
      case 'online-biometric':
        return <OnlineBiometricView onNext={handleNext} />;
      case 'unlock-link':
        return <UnlockMeetingLinkView onClose={onClose} />;

      default:
        return <OnsiteLocationPermissionView onNext={handleNext} />;
    }
  };

  return renderView();
}

export function CheckInFlow({ event, onClose }: CheckInFlowProps) {
  const isOnsite = event.modality === 'Onsite' || event.modality === 'Hybrid';
  const isOnline = event.modality === 'Online';

  return (
    <CheckInProvider
      eventId={event.id}
      eventTitle={event.title}
      eventModality={event.modality as 'Onsite' | 'Online' | 'Hybrid'}
      venueLatitude={isOnsite ? event.venueLatitude : undefined}
      venueLongitude={isOnsite ? event.venueLongitude : undefined}
    >
      <CheckInFlowContent event={event} onClose={onClose} />
    </CheckInProvider>
  );
}
