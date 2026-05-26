import { useMemo } from 'react';
import { ArrowLeft, Users, ListOrdered, ClipboardList, Award, Upload } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { C, OrgEvent, MOCK_CERTS } from './data';
import { RegistrantsTab } from './RegistrantsTab';
import { WaitlistTab } from './WaitlistTab';
import { AttendanceTab } from './AttendanceTab';
import { CertificatesTab } from './CertificatesTab';
import { CsvUploadsTab } from './CsvUploadsTab';

const SECTION_TABS = [
  { id: 'registrants', label: 'Registrants', icon: Users },
  { id: 'waitlist', label: 'Waitlist', icon: ListOrdered },
  { id: 'attendance', label: 'Attendance', icon: ClipboardList },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'csv-uploads', label: 'CSV Uploads', icon: Upload },
] as const;

function SummaryCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border p-4" style={{ borderColor: C.border }}>
      <p className="text-xs uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: C.muted }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

export function OrganizerEventDetail({ event, onBack }: { event: OrgEvent; onBack: () => void }) {
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

      <Tabs defaultValue="registrants">
        <TabsList className="gap-2">
          {SECTION_TABS.map(tab => (
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
            <CertificatesTab eventId={event.id} />
          </TabsContent>
          <TabsContent value="csv-uploads">
            <CsvUploadsTab eventId={event.id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
