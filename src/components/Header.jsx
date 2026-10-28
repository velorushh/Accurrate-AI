import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scrollTo } from '../App.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  ChevronDown,
  LogOut,
  Play,
  FileText,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

// ─── Mega Menu Content Definitions ───────────────────────────────────────────
const FEATURES_MENU = {
  columns: [
    {
      header: 'AI Auditing',
      links: [
        { label: 'Multimodal Scanning', desc: 'Scan video, audio, text, and visual assets' },
        { label: 'Tone & Voice Verification', desc: 'Detect nuances, sarcasm, and deviations' },
        { label: 'Regulatory Compliance', desc: 'Enforce legal & regional advertising standards' },
      ],
    },
    {
      header: 'Team Workflow',
      links: [
        { label: 'Human-in-the-Loop Reviews', desc: 'Collaborative approvals with audit trails' },
        { label: 'Actionable Corrections', desc: 'Constructive suggestions preserving creator intent' },
        { label: 'Design App Connectors', desc: 'Sync directly into Canva and creative tools' },
      ],
    },
    {
      header: 'Data Management',
      links: [
        { label: 'Dynamic Brand Datasets', desc: 'Versioned rule engines for every campaign' },
        { label: 'Compliance Analytics', desc: 'Identify recurring brand guideline friction' },
        { label: 'Zero-Retention Security', desc: 'Strict memory-only processing with auto-wipe' },
      ],
    },
  ],
  featured: {
    badge: 'Watch Demo',
    title: 'Watch ACCURRATE in Action',
    subtitle: 'See how enterprise teams automate brand compliance in 3 minutes.',
    buttonText: 'Watch Demo',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=720&q=80',
    type: 'video',
  },
};

const SOLUTIONS_MENU = {
  columns: [
    {
      header: 'By Team',
      links: [
        { label: 'For Marketing Teams', desc: 'Fast-track campaign launches with confidence' },
        { label: 'For Legal & Compliance', desc: 'Eliminate regulatory risk and disclaimers gaps' },
        { label: 'For Creative Agencies', desc: 'Maintain flawless client brand consistency' },
      ],
    },
    {
      header: 'By Use Case',
      links: [
        { label: 'Brand Identity Protection', desc: 'Prevent tone drift across distributed teams' },
        { label: 'Global Ad Localization', desc: 'Enforce cultural sensitivity and local rules' },
        { label: 'Automated Policy Enforcement', desc: 'Real-time pre-flight checks before publishing' },
      ],
    },
  ],
  featured: {
    badge: 'New Report',
    title: '2026 Brand Risk Report',
    subtitle: 'Learn how top brands are avoiding costly ad compliance mistakes.',
    buttonText: 'Read Report',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=720&q=80',
    type: 'report',
  },
};

// ─── Header Component ─────────────────────────────────────────────────────────
const Header = ({ openCalendly }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeDropdown, setActiveDropdown] = useState(null); // 'features' | 'solutions' | null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef(null);

  // Debounced hover handling to ensure buttery smooth movement
  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleLinkClick = (sectionTarget = 'how-it-works') => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    scrollTo(sectionTarget);
  };

  const handleFeaturedAction = (type) => {
    setActiveDropdown(null);
    if (type === 'video' || type === 'report') {
      if (openCalendly) openCalendly();
      else navigate('/signup');
    }
  };

  // Close dropdown on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setActiveDropdown(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="relative w-full z-50 bg-[#edebe8] border-b border-[#e2ded8]/70">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3.5">
        
        {/* ── Brand Logo & Main Nav ─────────────────────────────────────── */}
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('hero');
            }}
          >
            <img
              src="/accurrate-icon-v2.png"
              alt="Accurrate AI"
              className="h-10 w-10 object-contain rounded-xl transition-transform group-hover:scale-105"
            />
            <span className="text-[19px] font-bold tracking-tight text-[#252521] font-sans">
              ACCURRATE
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* 1. Features Dropdown Trigger */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('features')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => scrollTo('how-it-works')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[14px] font-medium transition-all ${
                  activeDropdown === 'features'
                    ? 'text-black bg-white/60 font-semibold'
                    : 'text-[#47423d] hover:text-black hover:bg-white/40'
                }`}
              >
                <span>Features</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'features' ? 'rotate-180 text-black' : 'text-[#736f6c]'
                  }`}
                />
              </button>
            </div>

            {/* 2. Solutions Dropdown Trigger */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => scrollTo('why')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[14px] font-medium transition-all ${
                  activeDropdown === 'solutions'
                    ? 'text-black bg-white/60 font-semibold'
                    : 'text-[#47423d] hover:text-black hover:bg-white/40'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'solutions' ? 'rotate-180 text-black' : 'text-[#736f6c]'
                  }`}
                />
              </button>
            </div>

            {/* 3. Pricing Link (No Dropdown) */}
            <button
              onClick={() => {
                setActiveDropdown(null);
                scrollTo('cta');
              }}
              className="px-3.5 py-1.5 rounded-lg text-[14px] font-medium text-[#47423d] hover:text-black hover:bg-white/40 transition-all"
            >
              Pricing
            </button>
          </nav>
        </div>

        {/* ── Right Actions (Yellow Buttons with High-Contrast Dark Text) ─── */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-lime !h-[38px] !px-4 !text-[13px] !font-bold flex items-center gap-1.5 shadow-sm rounded-lg"
              >
                Open Workspace →
              </button>
              
              <div className="hidden sm:flex items-center gap-2 bg-white/70 border border-[#e5e2dd] px-3 py-1.5 rounded-full shadow-xs">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#ebf212] flex items-center justify-center text-[11px] font-bold text-black">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-[13px] font-medium text-[#252521] max-w-[120px] truncate">
                  {user.displayName || user.email}
                </span>
              </div>

              <button
                onClick={logout}
                title="Sign out"
                className="btn btn-variant-2 !h-[38px] !px-2.5 !text-[12px] flex items-center gap-1 text-[#736f6c] hover:text-black"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 text-[14px] font-medium text-[#252521] hover:text-black transition-colors"
              >
                Log in
              </button>

              <button
                onClick={openCalendly}
                className="hidden sm:inline-flex items-center justify-center h-[38px] px-4 text-[13px] font-medium text-[#252521] border border-black/80 hover:border-black hover:bg-black/5 rounded-lg transition-all"
              >
                Get a demo
              </button>

              {/* Primary Yellow CTA Button */}
              <button
                onClick={() => navigate('/signup')}
                className="btn-lime !h-[38px] !px-4 !text-[13px] !font-bold flex items-center justify-center shadow-sm rounded-lg"
              >
                Sign up for free
              </button>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#252521] hover:bg-white/50 transition-colors ml-1"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* ── MEGA MENU DROPDOWN PANEL (Floating Wide Rounded Card) ──────── */}
      {activeDropdown && (
        <div
          className="hidden lg:block absolute top-full left-0 right-0 w-full px-6 pt-2 pb-6 z-50 animate-fade-in-up"
          onMouseEnter={() => handleMouseEnter(activeDropdown)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-[1140px] mx-auto bg-white rounded-3xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.18)] border border-[#ece9e4] p-8 lg:p-10 flex gap-8">
            
            {/* ── Left Side: Vertical Columns with Small Gray Headers ──── */}
            <div
              className={`flex-1 grid ${
                activeDropdown === 'features' ? 'grid-cols-3' : 'grid-cols-2'
              } gap-8`}
            >
              {(activeDropdown === 'features' ? FEATURES_MENU : SOLUTIONS_MENU).columns.map(
                (col) => (
                  <div key={col.header} className="flex flex-col">
                    <span className="text-[12px] font-semibold text-[#8a8580] uppercase tracking-wider mb-4 font-mono">
                      {col.header}
                    </span>
                    <ul className="flex flex-col gap-2.5">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <button
                            type="button"
                            onClick={() => handleLinkClick(activeDropdown === 'features' ? 'how-it-works' : 'why')}
                            className="w-full text-left p-2.5 -mx-2.5 rounded-xl hover:bg-[#ebf212]/20 transition-all duration-150 group cursor-pointer"
                          >
                            <div className="text-[14px] font-medium text-[#252521] group-hover:text-black leading-snug flex items-center justify-between">
                              <span>{link.label}</span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-black" />
                            </div>
                            <p className="text-[12px] text-[#736f6c] group-hover:text-[#47423d] leading-tight mt-1 line-clamp-1">
                              {link.desc}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>

            {/* ── Vertical Divider ───────────────────────────────────────── */}
            <div className="w-px bg-[#edeae6]" />

            {/* ── Right Side: Featured Dark Content Block ────────────────── */}
            {(() => {
              const feat = (activeDropdown === 'features' ? FEATURES_MENU : SOLUTIONS_MENU).featured;
              return (
                <div className="w-[320px] bg-[#1a1a18] rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg border border-white/10 flex-shrink-0">
                  <div>
                    {/* Header + Yellow Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="text-[17px] font-semibold text-white leading-tight">
                        {feat.title}
                      </h4>
                      <span className="px-2.5 py-0.5 bg-[#ebf212] text-black text-[10px] font-bold rounded-full uppercase tracking-wider flex-shrink-0">
                        {feat.badge}
                      </span>
                    </div>

                    {/* Media Thumbnail with Centered Play Button */}
                    <div
                      className="relative rounded-xl overflow-hidden aspect-video bg-[#282824] group cursor-pointer mb-3"
                      onClick={() => handleFeaturedAction(feat.type)}
                    >
                      <img
                        src={feat.thumbnail}
                        alt={feat.title}
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <p className="text-[12px] text-white/75 leading-relaxed">
                      {feat.subtitle}
                    </p>
                  </div>

                  {/* Primary Yellow Action Button with High-Contrast Dark Text */}
                  <button
                    type="button"
                    onClick={() => handleFeaturedAction(feat.type)}
                    className="mt-4 w-full h-[38px] bg-[#ebf212] hover:bg-[#dce30e] text-black font-semibold text-[13px] rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    {feat.type === 'video' ? (
                      <Play className="w-3.5 h-3.5 fill-black" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-black" />
                    )}
                    <span>{feat.buttonText}</span>
                  </button>
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* ── MOBILE ACCORDION DRAWER ──────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#e2ded8] px-6 py-6 flex flex-col gap-6 animate-fade-in-up">
          {/* Features Column */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold text-[#8a8580] uppercase tracking-wider font-mono">
              Features
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FEATURES_MENU.columns.flatMap((col) => col.links).map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick('how-it-works')}
                  className="text-left text-[14px] text-[#252521] hover:text-black py-1.5 px-2 rounded-lg hover:bg-[#ebf212]/20"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Solutions Column */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold text-[#8a8580] uppercase tracking-wider font-mono">
              Solutions
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOLUTIONS_MENU.columns.flatMap((col) => col.links).map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick('why')}
                  className="text-left text-[14px] text-[#252521] hover:text-black py-1.5 px-2 rounded-lg hover:bg-[#ebf212]/20"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Link */}
          <button
            onClick={() => handleLinkClick('cta')}
            className="text-left text-[15px] font-semibold text-[#252521] py-1"
          >
            Pricing
          </button>

          {/* Mobile Buttons */}
          <div className="flex flex-col gap-3 pt-3 border-t border-[#f0eee9]">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="btn-lime w-full h-[44px] text-[14px] font-bold rounded-xl"
              >
                Open Workspace →
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/signup');
                  }}
                  className="btn-lime w-full h-[44px] text-[14px] font-bold rounded-xl"
                >
                  Sign up for free
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (openCalendly) openCalendly();
                  }}
                  className="btn btn-variant-3 w-full h-[44px] text-[14px] rounded-xl"
                >
                  Get a demo
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="text-center text-[14px] text-[#252521] font-medium py-1"
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
