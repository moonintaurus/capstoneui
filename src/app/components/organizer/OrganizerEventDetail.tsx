import { useMemo } from 'react';
import { ArrowLeft, Users, ListOrdered, ClipboardList, Award, Upload, BarChart2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { C, OrgEvent, MOCK_CERTS, canVerifyCsvForEvent } from './data';
import { RegistrantsTab } from './RegistrantsTab';
import { WaitlistTab } from './WaitlistTab';
import { AttendanceTab } from './AttendanceTab';
import { CertificatesTab } from './CertificatesTab';
import { CsvUploadsTab } from './CsvUploadsTab';

type SectionTab = 'registrants' | 'waitlist' | 'attendance' | 'certificates' | 'metrics' | 'csv-uploads';

const BASE_SECTION_TABS: { id: SectionTab; label: string; icon: React.ElementType }[] = [
  { id: 'registrants', label: 'Registrants', icon: Users },
  { id: 'waitlist', label: 'Waitlist', icon: ListOrdered },
  { id: 'attendance', label: 'Attendance', icon: ClipboardList },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'metrics', label: 'Event Metrics', icon: BarChart2 },
];

function SummaryCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border p-4" style={{ borderColor: C.border }}>
      <p className="text-xs uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: C.muted }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

function EventMetrics({ event, certificateCount }: { event: OrgEvent; certificateCount: number }) {
  const attendanceRate = event.registrationCount > 0 ? Math.round(((event.registrationCount - event.waitlistCount) / event.registrationCount) * 100) : 0;
  const waitlistRate = event.registrationCount > 0 ? Math.round((event.waitlistCount / event.registrationCount) * 100) : 0;
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>Event Metrics</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Event-specific registration, attendance, waitlist, CSV, and certificate summary.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Registered" value={event.registrationCount} color={C.teal} />
        <SummaryCard label="Attendance Rate" value={`${attendanceRate}%`} color="#27AE60" />
        <SummaryCard label="Waitlist Rate" value={`${waitlistRate}%`} color={C.goldenrod} />
        <SummaryCard label="Certificates" value={certificateCount} color={C.maroon} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <p className="text-xs uppercase tracking-[0.14em] font-bold mb-3" style={{ color: C.muted }}>Event Details</p>
          {[
            ['Modality', event.modality],
            ['Date', event.date],
            ['End Date', event.endDate],
            ['Venue / Platform', event.location],
            ['Approval Status', event.approvalStatus],
            ['CSV Verification', event.csvVerificationStatus],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-2 border-b last:border-0" style={{ borderColor: C.border }}>
              <span className="text-xs font-semibold" style={{ color: C.muted }}>{label}</span>
              <span className="text-sm text-right" style={{ color: C.text }}>{value}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <p className="text-xs uppercase tracking-[0.14em] font-bold mb-3" style={{ color: C.muted }}>Capacity Snapshot</p>
          {[
            ['Maximum Participants', event.maxParticipants],
            ['Registered Participants', event.registrationCount],
            ['Waitlisted Participants', event.waitlistCount],
            ['Remaining Capacity', Math.max(event.maxParticipants - event.registrationCount, 0)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-2 border-b last:border-0" style={{ borderColor: C.border }}>
              <span className="text-xs font-semibold" style={{ color: C.muted }}>{label}</span>
              <span className="text-sm text-right font-semibold" style={{ color: C.text }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrganizerEventDetail({
  event,
  onBack,
  defaultTab = 'registrants',
  onCsvVerified,
}: {
  event: OrgEvent;
  onBack: () => void;
  defaultTab?: SectionTab;
  onCsvVerified?: (eventId: string, fileName: string) => void;
}) {
  const canShowCsvVerification = canVerifyCsvForEvent(event);
  const sectionTabs = canShowCsvVerification
    ? [...BASE_SECTION_TABS, { id: 'csv-uploads' as const, label: 'Attendance CSV Verification', icon: Upload }]
    : BASE_SECTION_TABS;
  const resolvedDefaultTab = defaultTab === 'csv-uploads' && !canShowCsvVerification ? 'registrants' : defaultTab;

  const certificateCount = useMemo(
    () => MOCK_CERTS.filter(c => c.eventTitle === event.title).length,
    [event.title],
  );

  const registrationStatus = useMemo(() => {
    const status = event.approvalStatus;
    if (status === 'Published') return { color: C.teal, label: status };
    if (status === 'Approved') return { color: C.goldenrod, label: status };
    if (status === 'Returned with Comments') return { color: C.coral, label: status };
    return { color: C.sub, label: status };
  }, [event.approvalStatus]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-colors"
          style={{ borderColor: C.border, color: C.sub }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Events
        </button>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.18em] font-bold mb-1" style={{ color: C.muted }}>Event Management</p>
          <h2 className="text-xl font-bold" style={{ color: C.text }}>{event.title}</h2>
          <p className="text-sm mt-1" style={{ color: C.sub }}>{event.date} · {event.modality} · {event.category}</p>
        </div>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-4">
        <SummaryCard label="Registered" value={event.registrationCount} color={C.teal} />
        <SummaryCard label="Waitlist" value={event.waitlistCount} color={C.goldenrod} />
        <SummaryCard label="Certs" value={certificateCount} color={C.maroon} />
        <SummaryCard label="Status" value={registrationStatus.label} color={registrationStatus.color} />
      </div>

      <Tabs defaultValue={resolvedDefaultTab}>
        <TabsList className="gap-2">
          {sectionTabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="px-3">
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4">
          <TabsContent value="registrants">
            <RegistrantsTab eventId={event.id} />
          </TabsContent>
          <TabsContent value="waitlist">
            <WaitlistTab eventId={event.id} />
          </TabsContent>
          <TabsContent value="attendance">
            <AttendanceTab eventId={event.id} />
          </TabsContent>
          <TabsContent value="certificates">
            <CertificatesTab eventId={event.id} event={event} />
          </TabsContent>
          <TabsContent value="metrics">
            <EventMetrics event={event} certificateCount={certificateCount} />
          </TabsContent>
          {canShowCsvVerification && (
            <TabsContent value="csv-uploads">
              <CsvUploadsTab eventId={event.id} event={event} onVerified={onCsvVerified} />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}
