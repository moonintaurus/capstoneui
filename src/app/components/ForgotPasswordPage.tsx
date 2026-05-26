import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
<img src="/PUPLogo.png" alt="PUP Logo" />;

const MAROON = '#800000';
const MAROON_DARK = '#5a0000';
const GOLDEN = '#FFDF00';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Background blobs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${MAROON}22 0%, transparent 70%)`, filter: 'blur(48px)' }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${GOLDEN}33 0%, transparent 70%)`, filter: 'blur(40px)' }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${MAROON}0f 0%, transparent 70%)`, filter: 'blur(56px)', transform: 'translateY(-50%)' }}
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">

        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/PUPLogo.png"
            alt="PUP Logo"
            className="w-15 h-15 object-contain mb-3 drop-shadow-sm"
          />
          <span
            style={{ fontFamily: 'Cambria, serif', color: MAROON, fontSize: '1.35rem', letterSpacing: '0', fontWeight: 700 }}
          >
            SIGLA
          </span>
          <span className="text-xs mt-1 text-center" style={{ color: '#9a7a5a', letterSpacing: '0.03em' }}>
            Smart Interactive Gateway for Learning and Activities
          </span>
        </div>

        {/* Card */}
        <div
          className="w-full bg-white rounded-2xl p-8"
          style={{
            boxShadow: '0 4px 32px rgba(128,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            border: '1px solid rgba(128,0,0,0.10)',
          }}
        >
          {!sent ? (
            <>
              <div className="mb-6">
                <h1 className="mb-1" style={{ color: '#1c1008', fontSize: '1.3rem', fontWeight: 700 }}>Forgot password?</h1>
                <p className="text-sm" style={{ color: '#706050' }}>
                  Enter your email address and we'll send you a password reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1c1008' }}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#b08060' }} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200"
                      style={{ borderColor: 'rgba(128,0,0,0.15)', backgroundColor: '#faf8f5', color: '#1c1008' }}
                      onFocus={e => { e.currentTarget.style.borderColor = MAROON; e.currentTarget.style.boxShadow = `0 0 0 3px ${MAROON}18`; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(128,0,0,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 mt-1"
                  style={{
                    background: loading ? '#c4a090' : `linear-gradient(135deg, ${MAROON} 0%, ${MAROON_DARK} 100%)`,
                    boxShadow: loading ? 'none' : `0 2px 12px ${MAROON}30`,
                  }}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Sending…
                    </>
                  ) : 'Send reset link'}
                </button>
              </form>

              <div className="mt-5 flex justify-center">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-sm font-medium hover:underline"
                  style={{ color: MAROON }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center text-center mb-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${MAROON}12` }}
                >
                  <CheckCircle2 className="w-7 h-7" style={{ color: MAROON }} />
                </div>
                <h1 className="mb-2" style={{ color: '#1c1008', fontSize: '1.3rem', fontWeight: 700 }}>Check your email</h1>
                <p className="text-sm" style={{ color: '#706050' }}>
                  We sent a password reset link to your email.
                </p>
              </div>

              <div className="flex justify-center">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-sm font-medium hover:underline"
                  style={{ color: MAROON }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
