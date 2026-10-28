import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scrollTo } from '../App.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  ChevronDown,
  LogOut,
  ArrowRight,
  Menu,
  X,
  Play,
  FileText,
  Sparkles,
  ShieldCheck
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
    title: 'Watch ACCURRATE in Action',
    subtitle: 'See how enterprise teams automate brand compliance in 3 minutes.',
    buttonText: 'Watch Demo',
    badge: 'Demo',
    type: 'demo'
  }
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
    title: '2026 Brand Risk Report',
    subtitle: 'Learn how top brands are avoiding costly ad compliance mistakes.',
    buttonText: 'Read Report',
    badge: 'Report',
    type: 'report'
  }
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

  const handleFeaturedClick = (type) => {
    setActiveDropdown(null);
    if (openCalendly) {
      openCalendly();
    } else {
      navigate('/signup');
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
    <header className="relative w-full z-50 bg-[#F4F4F4] dark:bg-[#131314] border-b border-[#e2ded8]/70 dark:border-white/10 transition-colors">
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
              alt="ACCURRATE AI"
              className="h-10 w-10 object-contain rounded-xl transition-transform group-hover:scale-105"
            />
            <span className="text-[19px] font-bold tracking-tight text-[#252521] dark:text-white font-sans">
              ACCURRATE
            </span>
          </a>

          {/* Desktop Navigation Links (Features, Solutions, Pricing) */}
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
                    ? 'text-black dark:text-white bg-white/70 dark:bg-white/10 font-semibold'
                    : 'text-[#47423d] dark:text-[#9aa0a6] hover:text-black dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                }`}
              >
                <span>Features</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'features' ? 'rotate-180 text-black dark:text-white' : 'text-[#736f6c]'
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
                    ? 'text-black dark:text-white bg-white/70 dark:bg-white/10 font-semibold'
                    : 'text-[#47423d] dark:text-[#9aa0a6] hover:text-black dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'solutions' ? 'rotate-180 text-black dark:text-white' : 'text-[#736f6c]'
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
              className="px-3.5 py-1.5 rounded-lg text-[14px] font-medium text-[#47423d] dark:text-[#9aa0a6] hover:text-black dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5 transition-all"
            >
              Pricing
            </button>
          </nav>
        </div>

        {/* ── Right Actions (Solid Yellow Accent with High-Contrast Dark Text) ─── */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-lime !h-[38px] !px-4 !text-[13px] !font-bold flex items-center gap-1.5 shadow-sm rounded-lg"
              >
                Open Workspace →
              </button>
              
              <div className="hidden sm:flex items-center gap-2 bg-white/80 dark:bg-[#28282B] border border-[#e5e2dd] dark:border-white/10 px-3 py-1.5 rounded-full shadow-xs">
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
                <span className="text-[13px] font-medium text-[#252521] dark:text-white max-w-[120px] truncate">
                  {user.displayName || user.email}
                </span>
              </div>

              <button
                onClick={logout}
                title="Sign out"
                className="btn btn-variant-2 !h-[38px] !px-2.5 !text-[12px] flex items-center gap-1 text-[#736f6c] dark:text-[#9aa0a6] hover:text-black dark:hover:text-white"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 text-[14px] font-medium text-[#252521] dark:text-white hover:opacity-80 transition-opacity"
              >
                Log in
              </button>

              <button
                onClick={openCalendly}
                className="hidden sm:inline-flex items-center justify-center h-[38px] px-4 text-[13px] font-medium text-[#252521] dark:text-white border border-black/80 dark:border-white/30 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-all"
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
            className="lg:hidden p-2 rounded-lg text-[#252521] dark:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-colors ml-1"
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
          <div
            className={`mx-auto bg-white dark:bg-[#1a1b1e] rounded-3xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.18)] border border-[#ece9e4] dark:border-white/10 p-8 lg:p-9 flex gap-8 transition-all duration-200 ${
              activeDropdown === 'features' ? 'max-w-[1140px]' : 'max-w-[880px]'
            }`}
          >
            {/* ── Left Side: Vertical Columns with Small Gray Headers ──── */}
            <div
              className={`flex-1 grid ${
                activeDropdown === 'features' ? 'grid-cols-3 gap-8' : 'grid-cols-2 gap-8'
              }`}
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
                            className="w-full text-left p-2.5 -mx-2.5 rounded-xl hover:bg-[#ebf212]/20 dark:hover:bg-[#ebf212]/15 transition-all duration-150 group cursor-pointer"
                          >
                            <div className="text-[14px] font-semibold text-[#252521] dark:text-[#f1f3f4] group-hover:text-black dark:group-hover:text-white leading-snug flex items-center justify-between">
                              <span>{link.label}</span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-black dark:text-white" />
                            </div>
                            <p className="text-[12px] text-[#736f6c] dark:text-[#9aa0a6] leading-relaxed mt-1 line-clamp-2">
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
            <div className="w-px bg-[#edeae6] dark:bg-white/10 flex-shrink-0" />

            {/* ── Right Side: Dark Featured Card ─────────────────────────── */}
            {(() => {
              const feat = (activeDropdown === 'features' ? FEATURES_MENU : SOLUTIONS_MENU).featured;
              return (
                <div className="w-[280px] bg-[#1a1a18] dark:bg-[#28282B] rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg border border-white/10 flex-shrink-0">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ebf212] bg-[#ebf212]/10 px-2.5 py-0.5 rounded-full border border-[#ebf212]/20">
                        {feat.badge}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-[#ebf212]" />
                    </div>

                    <h4 className="text-[16px] font-bold text-white leading-tight mb-2">
                      {feat.title}
                    </h4>

                    <p className="text-[12px] text-white/70 leading-relaxed mb-4">
                      {feat.subtitle}
                    </p>
                  </div>

                  {/* Primary Yellow Action Button with High-Contrast Dark Text */}
                  <button
                    type="button"
                    onClick={() => handleFeaturedClick(feat.type)}
                    className="w-full h-[40px] bg-[#ebf212] hover:bg-[#dce30e] text-black font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    {feat.type === 'demo' ? (
                      <Play className="w-3.5 h-3.5 fill-black text-black" />
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
        <div className="lg:hidden bg-white dark:bg-[#131314] border-b border-[#e2ded8] dark:border-white/10 px-6 py-6 flex flex-col gap-6 animate-fade-in-up">
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
                  className="text-left text-[14px] text-[#252521] dark:text-white py-1.5 px-2 rounded-lg hover:bg-[#ebf212]/20"
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
                  className="text-left text-[14px] text-[#252521] dark:text-white py-1.5 px-2 rounded-lg hover:bg-[#ebf212]/20"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Link */}
          <button
            onClick={() => handleLinkClick('cta')}
            className="text-left text-[15px] font-semibold text-[#252521] dark:text-white py-1"
          >
            Pricing
          </button>

          {/* Mobile Buttons */}
          <div className="flex flex-col gap-3 pt-3 border-t border-[#f0eee9] dark:border-white/10">
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
                  className="btn btn-variant-3 w-full h-[44px] text-[14px] rounded-xl dark:border-white/30 dark:text-white"
                >
                  Get a demo
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="text-center text-[14px] text-[#252521] dark:text-white font-medium py-1"
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
