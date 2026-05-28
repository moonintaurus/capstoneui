import { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, FileText, Save, Upload, X, XCircle } from 'lucide-react';
import { C, MOCK_EVENTS, canVerifyCsvForEvent, isCompletedEvent } from './data';
import type { OrgEvent } from './data';

const PLATFORMS = ['Google Meet', 'Zoom', 'Microsoft Teams'] as const;

type CsvRowStatus =
  | 'Matched with registered participant'
  | 'Matched with biometric check-in'
  | 'Verified Attended'
  | 'Unmatched email or name'
  | 'Missing biometric check-in'
  | 'Duplicate record'
  | 'Attendance duration insufficient'
  | 'Attendance Not Verified'
  | 'Pending Verification'
  | 'Not Eligible';

interface CsvResult {
  platform: string;
  fileName: string;
  registeredCount: number;
  biometricCount: number;
  matchedParticipants: number;
  biometricMatches: number;
  unmatchedParticipants: number;
  missingBiometricCheckIn: number;
  duplicateRecords: number;
  attendanceDurationIssues: number;
  durationAvailable: boolean;
  rows: { name: string; email: string; duration: string; status: CsvRowStatus }[];
}

const MOCK_RESULT: CsvResult = {
  platform: 'Microsoft Teams',
  fileName: 'teams_gad_forum_2026-05-20.csv',
  registeredCount: 96,
  biometricCount: 88,
  matchedParticipants: 82,
  biometricMatches: 78,
  unmatchedParticipants: 6,
  missingBiometricCheckIn: 4,
  duplicateRecords: 2,
  attendanceDurationIssues: 3,
  durationAvailable: true,
  rows: [
    { name: 'Liza Fernandez', email: 'liza.fernandez@pup.edu.ph', duration: '2h 55m', status: 'Verified Attended' },
    { name: 'Patricia Torres', email: 'patricia.torres@pup.edu.ph', duration: '2h 41m', status: 'Matched with biometric check-in' },
    { name: 'Mark Ramos', email: 'mark.ramos@pup.edu.ph', duration: '2h 48m', status: 'Matched with registered participant' },
    { name: 'Unknown Attendee', email: 'guest@example.com', duration: '2h 12m', status: 'Unmatched email or name' },
    { name: 'Jose Villanueva', email: 'jose.villanueva@pup.edu.ph', duration: '34m', status: 'Attendance duration insufficient' },
    { name: 'Duplicate Record', email: 'liza.fernandez@pup.edu.ph', duration: '2h 55m', status: 'Duplicate record' },
    { name: 'Ana Reyes', email: 'ana.reyes@pup.edu.ph', duration: '-', status: 'Missing biometric check-in' },
    { name: 'Carlo Mendoza', email: 'carlo.mendoza@pup.edu.ph', duration: '-', status: 'Pending Verification' },
    { name: 'Noel Garcia', email: 'noel.garcia@pup.edu.ph', duration: '8m', status: 'Attendance Not Verified' },
    { name: 'Cancelled Participant', email: 'cancelled@pup.edu.ph', duration: '-', status: 'Not Eligible' },
  ],
};

const STATUS_STYLE: Record<CsvRowStatus, { bg: string; color: string; icon: React.ReactNode }> = {
  'Matched with registered participant': { bg: '#00598D18', color: '#00598D', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  'Matched with biometric check-in': { bg: '#27AE6018', color: '#1a8a44', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  'Verified Attended': { bg: '#27AE6018', color: '#1a8a44', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  'Unmatched email or name': { bg: '#EA694B18', color: '#C05020', icon: <XCircle className="w-3.5 h-3.5" /> },
  'Missing biometric check-in': { bg: '#D8584818', color: '#b03020', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  'Duplicate record': { bg: '#DAA52018', color: '#8a6010', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  'Attendance duration insufficient': { bg: '#EA694B18', color: '#C05020', icon: <Clock className="w-3.5 h-3.5" /> },
  'Attendance Not Verified': { bg: '#D8584818', color: '#b03020', icon: <XCircle className="w-3.5 h-3.5" /> },
  'Pending Verification': { bg: '#DAA52018', color: '#8a6010', icon: <Clock className="w-3.5 h-3.5" /> },
  'Not Eligible': { bg: '#D8584818', color: '#b03020', icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

function InfoPanel({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border bg-white p-6" style={{ borderColor: C.border }}>
      <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
        Attendance CSV Verification
      </h2>
      <p className="text-sm font-semibold mt-4" style={{ color: C.sub }}>{title}</p>
      <p className="text-sm mt-2" style={{ color: C.muted }}>{message}</p>
    </div>
  );
}

export function CsvUploadsTab({
  eventId,
  event: eventOverride,
  onVerified,
}: {
  eventId?: string;
  event?: OrgEvent;
  onVerified?: (eventId: string, fileName: string) => void;
}) {
  const [platform, setPlatform] = useState('');
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<CsvResult | null>(null);
  const [saved, setSaved] = useState(false);

  const event = eventOverride ?? (eventId ? MOCK_EVENTS.find(ev => ev.id === eventId) : undefined);

  const handleUpload = () => {
    setResult({ ...MOCK_RESULT, platform: platform || event?.onlinePlatform || MOCK_RESULT.platform });
    setSaved(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleUpload();
  };

  if (!eventId || !event) {
    return (
      <InfoPanel
        title="Select an event first"
        message="CSV upload is available only inside a selected event page. Open a completed online or hybrid event before uploading an attendance log."
      />
    );
  }

  if (event.modality === 'Onsite') {
    return (
      <InfoPanel
        title="CSV verification is not required for onsite events"
        message="Onsite attendance uses GPS/geofencing and face biometric verification only."
      />
    );
  }

  if (!isCompletedEvent(event)) {
    return (
      <InfoPanel
        title="CSV verification is not available yet"
        message="CSV upload becomes available only after this online or hybrid event ends."
      />
    );
  }

  if (!canVerifyCsvForEvent(event)) {
    return (
      <InfoPanel
        title="CSV verification is not available for this event status"
        message="Only published, completed online or hybrid events can accept CSV attendance logs."
      />
    );
  }

  const statusLabel = saved ? 'Verified' : event.csvVerificationStatus;
  const lastFile = result?.fileName ?? event.csvLastUploadedFile ?? 'No CSV file uploaded';
  const uploadTime = result ? 'Just now' : event.csvUploadedAt ?? 'Not yet uploaded';

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>
          Attendance CSV Verification
        </h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>
          Upload the official attendance log downloaded from Google Meet, Zoom, or Microsoft Teams for this selected event only.
        </p>
      </div>

      <div className="grid gap-4 mb-5 md:grid-cols-3">
        {[
          { label: 'Event title', value: event.title, color: C.text },
          { label: 'Event date', value: event.date, color: C.text },
          { label: 'Modality', value: event.modality, color: C.maroon },
          { label: 'Online platform', value: event.onlinePlatform ?? 'Not specified', color: C.teal },
          { label: 'Event status', value: event.approvalStatus, color: C.text },
          { label: 'CSV verification status', value: statusLabel, color: statusLabel === 'Verified' ? '#27AE60' : statusLabel === 'Uploaded' ? C.teal : C.tangerine },
          { label: 'Last uploaded file', value: lastFile, color: C.text },
          { label: 'Upload date and time', value: uploadTime, color: C.text },
          { label: 'CSV status', value: statusLabel, color: statusLabel === 'Verified' ? '#27AE60' : C.tangerine },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border p-4" style={{ borderColor: C.border }}>
            <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: C.muted }}>{item.label}</p>
            <p className="text-sm font-semibold mt-2 break-words" style={{ color: item.color }}>{item.value}</p>
          </div>
        ))}
      </div>

      {!result ? (
        <div className="space-y-5 max-w-xl">
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: C.sub }}>Platform</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className="py-3 px-4 rounded-xl border text-sm font-semibold transition-all"
                  style={{ borderColor: platform === p ? C.maroon : C.border, backgroundColor: platform === p ? C.maroon + '10' : '#fff', color: platform === p ? C.maroon : C.sub }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={handleUpload}
            className="rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-3 cursor-pointer transition-all"
            style={{ borderColor: dragging ? C.maroon : C.border, backgroundColor: dragging ? C.maroon + '05' : C.cream }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: C.maroon + '10' }}>
              <Upload className="w-7 h-7" style={{ color: C.maroon }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: C.sub }}>CSV upload card</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Upload CSV Attendance Log</p>
            </div>
          </div>

          <div className="rounded-xl border p-4 space-y-2" style={{ borderColor: C.border, backgroundColor: '#fff' }}>
            <p className="text-xs font-bold" style={{ color: C.sub }}>File requirements</p>
            {[
              'CSV format exported directly from Google Meet, Zoom, or Microsoft Teams',
              'Must include participant email addresses',
              'Cross-checks against registered participants and biometric check-in records for this event',
              'Attendance duration is checked when available',
              'Maximum file size: 5MB',
            ].map(r => (
              <div key={r} className="flex items-start gap-2 text-xs" style={{ color: C.muted }}>
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: C.muted }} />
                {r}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-white rounded-xl border p-4" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.teal + '15' }}>
                <FileText className="w-5 h-5" style={{ color: C.teal }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: C.text }}>{result.fileName}</p>
                <p className="text-xs" style={{ color: C.muted }}>{result.platform} - Uploaded just now</p>
              </div>
            </div>
            <button onClick={() => setResult(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100" style={{ color: C.muted }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Registered participants checked', value: result.registeredCount, color: C.teal },
              { label: 'Biometric check-in records checked', value: result.biometricCount, color: C.maroon },
              { label: 'Matched participants', value: result.matchedParticipants, color: '#27AE60' },
              { label: 'Matched with biometric check-in', value: result.biometricMatches, color: '#27AE60' },
              { label: 'Unmatched participants', value: result.unmatchedParticipants, color: C.coral },
              { label: 'Missing biometric check-in', value: result.missingBiometricCheckIn, color: C.tangerine },
              { label: 'Duplicate records', value: result.duplicateRecords, color: C.goldenrod },
              { label: 'Attendance duration issues', value: result.attendanceDurationIssues, color: C.goldenrod },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-xl border p-4" style={{ borderColor: C.border }}>
                <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
                <p className="text-xs mt-1" style={{ color: C.muted }}>{card.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
              <h3 className="text-sm font-bold" style={{ color: C.text }}>Cross-check results</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: C.cream }}>
                    {['Participant Name', 'Email', 'Duration', 'Result Category'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold" style={{ color: C.muted }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {result.rows.map(row => {
                    const s = STATUS_STYLE[row.status];
                    return (
                      <tr key={`${row.email}-${row.status}`} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3.5 font-semibold text-sm" style={{ color: C.text }}>{row.name}</td>
                        <td className="px-4 py-3.5 text-xs" style={{ color: C.muted }}>{row.email}</td>
                        <td className="px-4 py-3.5 text-xs" style={{ color: C.sub }}>{row.duration}</td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>
                            {s.icon}{row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {saved && (
            <div className="rounded-xl border p-4 text-sm font-semibold" style={{ borderColor: '#27AE6040', backgroundColor: '#27AE6008', color: '#1a8a44' }}>
              CSV verification saved for this event.
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-white p-4" style={{ borderColor: C.border }}>
            <div>
              <p className="text-sm font-bold" style={{ color: C.text }}>Save Cross-check Results</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>
                Saving updates attendance verification and unlocks certificate release for this selected event only.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSaved(true);
                onVerified?.(event.id, result.fileName);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}
            >
              <Save className="w-4 h-4" />
              {saved ? 'Results Saved' : 'Save Cross-check Results'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
