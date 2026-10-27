import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Check, Eye, EyeOff, ArrowLeft, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { oauthPlaceholder } from '../App.jsx';

// ─── Benefits shown in the left panel ────────────────────────────────────────
const benefits = [
  { icon: Sparkles, text: 'AI that polishes your content in seconds' },
  { icon: Zap,      text: 'Tone matching across every channel' },
  { icon: ShieldCheck, text: 'Your drafts are never used to train models' },
];

// ─── AuthPage ─────────────────────────────────────────────────────────────────
const AuthPage = ({ mode: initialMode }) => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const prefilled  = location.state?.email ?? '';

  const [mode, setMode]               = useState(initialMode);
  const [email, setEmail]             = useState(prefilled);
  const [password, setPassword]       = useState('');
  const [name, setName]               = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState('');

  // Keep URL in sync when user switches tabs
  useEffect(() => {
    navigate(mode === 'signup' ? '/signup' : '/login', { replace: true });
  }, [mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (mode === 'signup' && !name) { setError('Please enter your name.'); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#edebe8] flex flex-col items-center justify-center px-6">
        <div className="main-canvas w-full max-w-[480px] p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#ebf212] rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-[32px] font-medium mb-3">
            {mode === 'signup' ? 'Account created!' : 'Welcome back!'}
          </h2>
          <p className="text-[16px] text-[#47423d] mb-8">
            {mode === 'signup'
              ? "You're all set. Start polishing your first piece of content."
              : "You're logged in. Let's get back to polishing."}
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-lime h-[48px] px-10 text-[15px]"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#edebe8] flex flex-col">

      {/* ── Minimal top bar ─────────────────────────────────────────────── */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-[#edebe8]">
        <Link
          to="/"
          className="flex items-center gap-2 text-[13px] text-[#47423d] hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <img
          src="https://www.apollo.io/_next/static/media/logo.0pq8s8~3b84w1.svg"
          alt="Accurrate AI"
          className="w-[110px] h-[30px] object-contain"
        />
        <div className="w-[110px]" /> {/* spacer to center logo */}
      </header>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[960px] flex flex-col lg:flex-row gap-6">

          {/* ── LEFT: Brand panel ─────────────────────────────────────── */}
          <div className="hidden lg:flex flex-col justify-between flex-1 bg-[#252521] rounded-2xl p-12 text-white">
            <div>
              <span className="inline-block bg-[#ebf212] text-black text-[11px] font-medium uppercase tracking-widest px-3 py-1 rounded-full mb-8">
                Accurrate AI
              </span>
              <h2 className="text-[38px] font-medium leading-[1.15] mb-6 max-w-[320px]">
                Polished content. Every time.
              </h2>
              <p className="text-[15px] text-[#efefeb]/70 mb-10 max-w-[300px]">
                Join 40,000+ writers and marketers who never publish a rough draft again.
              </p>
              <ul className="flex flex-col gap-4">
                {benefits.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#ebf212]/10 border border-[#ebf212]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#ebf212]" />
                    </div>
                    <span className="text-[14px] text-[#efefeb]/80">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonial */}
            <div className="mt-12 border-t border-white/10 pt-8">
              <p className="text-[14px] text-[#efefeb]/70 italic mb-4">
                "Accurrate AI cut our editing cycle in half. Our blog now goes live same-day."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://www.apollo.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffox-jackson.0-sr3v31f4h22.png&w=96&q=75"
                  className="w-9 h-9 rounded-full object-cover"
                  alt="Priya Mehta"
                />
                <div>
                  <p className="text-[13px] font-medium text-white">Priya Mehta</p>
                  <p className="text-[12px] text-[#efefeb]/50">Content Lead @ Brandify</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Auth form card ──────────────────────────────────── */}
          <div className="flex-1 bg-white rounded-2xl border border-[#efefeb] shadow-sm p-10 flex flex-col justify-center">

            {/* Tab switcher */}
            <div className="flex bg-[#f7f5f2] rounded-lg p-1 mb-8 w-fit">
              <button
                onClick={() => setMode('signup')}
                className={`rounded-[6px] h-[36px] px-6 text-[13px] transition-all ${
                  mode === 'signup'
                    ? 'bg-black text-white font-medium'
                    : 'text-[#736f6c] hover:text-black'
                }`}
              >
                Sign up
              </button>
              <button
                onClick={() => setMode('login')}
                className={`rounded-[6px] h-[36px] px-6 text-[13px] transition-all ${
                  mode === 'login'
                    ? 'bg-black text-white font-medium'
                    : 'text-[#736f6c] hover:text-black'
                }`}
              >
                Log in
              </button>
            </div>

            <h1 className="text-[26px] font-medium mb-1">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-[14px] text-[#736f6c] mb-8">
              {mode === 'signup'
                ? 'Start polishing for free. No credit card required.'
                : 'Log in to continue polishing your content.'}
            </p>

            {/* OAuth buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                type="button"
                onClick={() => oauthPlaceholder('Google')}
                className="btn btn-variant-1 flex-1 flex items-center justify-center gap-2 h-[46px] text-[14px]"
              >
                <img
                  src="https://www.apollo.io/_next/static/media/google-logo.0ni1ovkk-~fo5.svg"
                  className="w-5 h-5"
                  alt="Google"
                />
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => oauthPlaceholder('Microsoft')}
                className="btn btn-variant-1 flex-1 flex items-center justify-center gap-2 h-[46px] text-[14px]"
              >
                <img
                  src="https://www.apollo.io/_next/static/media/microsoft-logo.0frmfnik3yxsa.svg"
                  className="w-5 h-5"
                  alt="Microsoft"
                />
                Continue with Microsoft
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] bg-[#edebe8] flex-1" />
              <span className="text-[12px] text-[#736f6c] uppercase tracking-wider">or</span>
              <div className="h-[1px] bg-[#edebe8] flex-1" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === 'signup' && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="auth-name" className="text-[13px] font-medium text-[#252521]">
                    Full name
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    placeholder="Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field w-full h-[46px] text-[15px]"
                    required
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="auth-email" className="text-[13px] font-medium text-[#252521]">
                  Work email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full h-[46px] text-[15px]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="auth-password" className="text-[13px] font-medium text-[#252521]">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button type="button" className="text-[12px] text-[#736f6c] hover:text-black transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field w-full h-[46px] text-[15px] pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#736f6c] hover:text-black transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-[13px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-lime w-full h-[50px] text-[15px] font-medium mt-2"
              >
                {mode === 'signup' ? 'Create account — it\'s free' : 'Log in to Accurrate AI'}
              </button>
            </form>

            <p className="text-[12px] text-[#736f6c] mt-6 text-center">
              {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <button
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                className="underline text-black hover:text-[#736f6c] transition-colors"
              >
                {mode === 'signup' ? 'Log in' : 'Sign up for free'}
              </button>
            </p>

            <p className="text-[11px] text-[#736f6c]/70 mt-4 text-center">
              By continuing, you agree to our{' '}
              <a href="/terms" className="underline hover:text-black">Terms</a> and{' '}
              <a href="/privacy-policy" className="underline hover:text-black">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
