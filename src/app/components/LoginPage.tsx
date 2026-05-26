import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
<img src="/PUPLogo.png" alt="PUP Logo" />

const MAROON = '#800000';
const MAROON_DARK = '#5a0000';
const GOLDEN = '#FFDF00';

const GOOGLE_ICON = (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
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
            alt="PUP Seal"
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

        {/* Login card */}
        <div
          className="w-full bg-white rounded-2xl p-8"
          style={{
            boxShadow: '0 4px 32px rgba(128,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            border: '1px solid rgba(128,0,0,0.10)',
          }}
        >
          <div className="mb-6">
            <h1 className="mb-1" style={{ color: '#1c1008', fontSize: '1.3rem', fontWeight: 700 }}>Welcome back</h1>
            <p className="text-sm" style={{ color: '#706050' }}>Log in to your SIGLA account to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold" style={{ color: '#1c1008' }}>Password</label>
                <Link to="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: MAROON }}>Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#b08060' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border text-sm outline-none transition-all duration-200"
                  style={{ borderColor: 'rgba(128,0,0,0.15)', backgroundColor: '#faf8f5', color: '#1c1008' }}
                  onFocus={e => { e.currentTarget.style.borderColor = MAROON; e.currentTarget.style.boxShadow = `0 0 0 3px ${MAROON}18`; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(128,0,0,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: '#9a7a5a' }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
                  Signing in…
                </>
              ) : 'Login'}
            </button>
          </form>

          <div className="flex items-center gap-3 mt-5 mb-4">
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(128,0,0,0.10)' }} />
            <span className="text-xs" style={{ color: '#b09080' }}>or sign in with Google</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(128,0,0,0.10)' }} />
          </div>

          <button
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border text-sm font-semibold transition-all duration-200"
            style={{ borderColor: 'rgba(0,0,0,0.10)', color: '#3c3c3c', backgroundColor: '#fff' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${MAROON}50`; e.currentTarget.style.backgroundColor = '#fdf9f7'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)'; e.currentTarget.style.backgroundColor = '#fff'; }}
          >
            {GOOGLE_ICON}
            Continue with Google
          </button>

          <p className="text-center text-sm mt-5" style={{ color: '#706050' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: MAROON }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
