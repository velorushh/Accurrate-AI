import React, { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PopupModal } from 'react-calendly';
import { X } from 'lucide-react';

import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import SocialProof from './components/SocialProof.jsx';
import GTMLayers from './components/GTMLayers.jsx';
import FeatureGrid from './components/FeatureGrid.jsx';
import SecurityLogos from './components/SecurityLogos.jsx';
import CTASection from './components/CTASection.jsx';
import Footer from './components/Footer.jsx';
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import './index.css';

const CALENDLY_URL = 'https://calendly.com/accurrate-ai/demo';

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, onClose }) => (
  <div
    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg bg-[#ebf212] text-black animate-slide-up"
    role="status"
  >
    <span className="font-medium text-[15px]">{message}</span>
    <button
      onClick={onClose}
      className="ml-2 hover:opacity-60 transition-opacity"
      aria-label="Close notification"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

// ─── Smooth scroll helper ─────────────────────────────────────────────────────
export const scrollTo = (sectionId, focusId = null) => {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (focusId) {
      setTimeout(() => {
        const focusEl = document.getElementById(focusId);
        if (focusEl) focusEl.focus();
      }, 650);
    }
  }
};

// ─── OAuth placeholder ────────────────────────────────────────────────────────
export const oauthPlaceholder = (provider) => {
  alert(`${provider} sign-in is coming soon! Stay tuned.`);
};

// ─── Homepage layout ──────────────────────────────────────────────────────────
const Homepage = ({ showToast, openCalendly }) => (
  <div className="flex flex-col min-h-screen bg-[#edebe8]">
    <Header openCalendly={openCalendly} />
    <main className="flex-grow">
      <Hero showToast={showToast} openCalendly={openCalendly} />
      <SocialProof />
      <GTMLayers />
      <FeatureGrid />
      <SecurityLogos />
      <CTASection showToast={showToast} openCalendly={openCalendly} />
    </main>
    <Footer />
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [toast, setToast] = useState(null);
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4200);
  }, []);

  const openCalendly = useCallback(() => setCalendlyOpen(true), []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Homepage showToast={showToast} openCalendly={openCalendly} />}
        />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/login"  element={<AuthPage mode="login"  />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
      </Routes>

      {/* ── Global Toast ── */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── Calendly Popup ── */}
      {calendlyOpen && (
        <PopupModal
          url={CALENDLY_URL}
          open={calendlyOpen}
          onModalClose={() => setCalendlyOpen(false)}
          rootElement={document.getElementById('root')}
        />
      )}
    </>
  );
}

export default App;
