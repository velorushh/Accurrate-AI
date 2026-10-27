import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { PopupModal } from 'react-calendly';

const CALENDLY_URL = 'https://calendly.com/accurrate-ai/demo';

// ─── Toast Notification ───────────────────────────────────────────────────────
export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors =
    type === 'success'
      ? 'bg-[#ebf212] text-black'
      : 'bg-red-500 text-white';

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg ${colors} animate-slide-up`}
      role="status"
    >
      <span className="font-medium text-[15px]">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity" aria-label="Close">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Calendly Modal Trigger ───────────────────────────────────────────────────
export const useCalendly = () => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const CalendlyModal = () =>
    isOpen ? (
      <PopupModal
        url={CALENDLY_URL}
        onModalClose={close}
        open={isOpen}
        rootElement={document.getElementById('root')}
      />
    ) : null;

  return { open, CalendlyModal };
};

// ─── Smooth scroll helper ─────────────────────────────────────────────────────
export const scrollTo = (id, focusId = null) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (focusId) {
      setTimeout(() => {
        const focusEl = document.getElementById(focusId);
        if (focusEl) focusEl.focus();
      }, 600);
    }
  }
};

// ─── OAuth placeholder ────────────────────────────────────────────────────────
export const oauthPlaceholder = (provider) => {
  alert(`${provider} sign-in is coming soon! Stay tuned.`);
};
