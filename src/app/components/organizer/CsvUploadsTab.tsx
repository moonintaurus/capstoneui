import { useState } from 'react';
import { Upload, CheckCircle2, XCircle, Clock, AlertCircle, FileText, X } from 'lucide-react';
import { C, MOCK_EVENTS } from './data';

const PLATFORMS = ['Google Meet', 'Zoom', 'Microsoft Teams'];

interface CsvResult {
  platform: string;
  fileName: string;
  registeredCount: number;
  biometricCount: number;
  emailMatches: number;
  durationAvailable: boolean;
  rows: { name: string; email: string; duration: string; status: 'Verified Attended' | 'Attendance Not Verified' | 'Pending Verification' | 'Not Eligible' }[];
}

const MOCK_RESULT: CsvResult = {
  platform: 'Zoom',
  fileName: 'zoom_attendance_2026-06-10.csv',
  registeredCount: 47,
  biometricCount: 39,
  emailMatches: 36,
  durationAvailable: true,
  rows: [
    { name: 'Juan dela Cruz', email: 'juan.delacruz@pup.edu.ph', duration: '3h 55m', status: 'Verified Attended' },
    { name: 'Patricia Torres', email: 'patricia.torres@pup.edu.ph', duration: '1h 12m', status: 'Attendance Not Verified' },
    { name: 'Mark Ramos', email: 'mark.ramos@pup.edu.ph', duration: '3h 48m', status: 'Verified Attended' },
    { name: 'Rosa Castillo', email: 'rosa.castillo@pup.edu.ph', duration: '—', status: 'Pending Verification' },
    { name: 'Jose Villanueva', email: 'jose.villanueva@pup.edu.ph', duration: '—', status: 'Not Eligible' },
  ],
};

const STATUS_STYLE: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  'Verified Attended':      { bg: '#27AE6018', color: '#1a8a44', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  'Attendance Not Verified':{ bg: '#EA694818', color: '#C05020', icon: <XCircle className="w-3.5 h-3.5" /> },
  'Pending Verification':   { bg: '#DAA52018', color: '#8a6010', icon: <Clock className="w-3.5 h-3.5" /> },
  'Not Eligible':           { bg: '#D8584818', color: '#b03020', icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

export function CsvUploadsTab({ eventId }: { eventId?: string }) {
  const [platform, setPlatform] = useState('');
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<CsvResult | null>(null);
  const eventTitle = eventId ? MOCK_EVENTS.find(ev => ev.id === eventId)?.title : undefined;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    setResult(MOCK_RESULT);
  };

  const handleClick = () => setResult(MOCK_RESULT);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-bold text-xl" style={{ color: C.text, fontFamily: '"Trajan Pro 3", Cambria, serif' }}>CSV Uploads</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Upload attendance logs from online meeting platforms for cross-checking.</p>
        {eventTitle && (
          <p className="text-xs mt-2" style={{ color: C.sub }}>Event: {eventTitle}</p>
        )}
      </div>

      {!result ? (
        <div className="space-y-5 max-w-xl">
          {/* Platform selector */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: C.sub }}>Meeting Platform</label>
            <div className="grid grid-cols-3 gap-3">
              {PLATFORMS.map(p => (
                <button key={p} type="button" onClick={() => setPlatform(p)}
                  className="py-3 px-4 rounded-xl border text-sm font-semibold transition-all"
                  style={{ borderColor: platform === p ? C.maroon : C.border, backgroundColor: platform === p ? C.maroon + '10' : '#fff', color: platform === p ? C.maroon : C.sub }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={handleClick}
            className="rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-3 cursor-pointer transition-all"
            style={{ borderColor: dragging ? C.maroon : C.border, backgroundColor: dragging ? C.maroon + '05' : C.cream }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: C.maroon + '10' }}>
              <Upload className="w-7 h-7" style={{ color: C.maroon }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: C.sub }}>Drag & drop your CSV file here</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>or click to browse</p>
            </div>
          </div>

          {/* Requirements */}
          <div className="rounded-xl border p-4 space-y-2" style={{ borderColor: C.border, backgroundColor: '#fff' }}>
            <p className="text-xs font-bold" style={{ color: C.sub }}>File Requirements</p>
            {['CSV format exported directly from Google Meet, Zoom, or Microsoft Teams', 'Must include participant email addresses', 'Attendance duration column is optional but recommended', 'Maximum file size: 5MB'].map(r => (
              <div key={r} className="flex items-start gap-2 text-xs" style={{ color: C.muted }}>
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: C.muted }} />
                {r}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* File info */}
          <div className="flex items-center justify-between bg-white rounded-xl border p-4" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.teal + '15' }}>
                <FileText className="w-5 h-5" style={{ color: C.teal }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: C.text }}>{result.fileName}</p>
                <p className="text-xs" style={{ color: C.muted }}>{result.platform} · Uploaded just now</p>
              </div>
            </div>
            <button onClick={() => setResult(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100" style={{ color: C.muted }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cross-check summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Registered Participants', value: result.registeredCount, color: C.teal },
              { label: 'Biometric Check-In Records', value: result.biometricCount, color: C.maroon },
              { label: 'Email Matches in CSV', value: result.emailMatches, color: '#27AE60' },
              { label: 'Duration Data Available', value: result.durationAvailable ? 'Yes' : 'No', color: C.goldenrod },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-xl border p-4" style={{ borderColor: C.border }}>
                <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
                <p className="text-xs mt-1" style={{ color: C.muted }}>{card.label}</p>
              </div>
            ))}
          </div>

          {/* Results table */}
          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
              <h3 className="text-sm font-bold" style={{ color: C.text }}>Validation Results</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: C.cream }}>
                    {['Participant Name', 'Email', 'Duration', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold" style={{ color: C.muted }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {result.rows.map(row => {
                    const s = STATUS_STYLE[row.status];
                    return (
                      <tr key={row.email} className="hover:bg-stone-50 transition-colors">
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
        </div>
      )}
    </div>
  );
}
