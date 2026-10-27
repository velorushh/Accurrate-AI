import React from 'react';
import { scrollTo, oauthPlaceholder } from '../App.jsx';

const Header = ({ openCalendly }) => {
  const navLinks = [
    { label: 'Features',  id: 'how-it-works' },
    { label: 'Solutions', id: 'why' },
    { label: 'Resources', id: 'social-proof' },
    { label: 'Customers', id: 'social-proof' },
    { label: 'Pricing',   id: 'cta' },
  ];

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-[#edebe8]">
      <div className="flex items-center gap-8">
        <a
          href="/"
          className="flex items-center"
          onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
        >
          <img
            src="https://www.apollo.io/_next/static/media/logo.0pq8s8~3b84w1.svg"
            alt="Accurrate AI"
            className="w-[120px] h-[32px] object-contain"
          />
        </a>
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map(({ label, id }) => (
            <button
              key={label}
              onClick={() => scrollTo(id)}
              className="btn btn-variant-2"
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => oauthPlaceholder('Login')}
          className="btn btn-variant-2 hidden lg:flex"
        >
          Log in
        </button>
        <button
          onClick={openCalendly}
          className="btn btn-variant-3 hidden lg:flex"
        >
          Book a demo
        </button>
        <button
          onClick={() => scrollTo('hero-form', 'hero-email')}
          className="btn btn-lime"
        >
          Start polishing for free
        </button>
      </div>
    </header>
  );
};

export default Header;
