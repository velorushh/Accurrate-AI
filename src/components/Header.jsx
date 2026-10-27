import React from 'react';

const Header = () => {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-[#edebe8]">
      <div className="flex items-center gap-8">
        <a href="/" className="flex items-center">
          <img
            src="https://www.apollo.io/_next/static/media/logo.0pq8s8~3b84w1.svg"
            alt="Accurrate AI"
            className="w-[120px] h-[32px] object-contain"
          />
        </a>
        <nav className="hidden lg:flex items-center gap-6">
          <a href="/features" className="btn btn-variant-2">Features</a>
          <a href="/solutions" className="btn btn-variant-2">Solutions</a>
          <a href="/resources" className="btn btn-variant-2">Resources</a>
          <a href="/customers" className="btn btn-variant-2">Customers</a>
          <a href="/pricing" className="btn btn-variant-2">Pricing</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <a href="/login" className="btn btn-variant-2 hidden lg:flex">Log in</a>
        <a href="/demo" className="btn btn-variant-3 hidden lg:flex">Book a demo</a>
        <a href="/sign-up" className="btn btn-lime">Start polishing for free</a>
      </div>
    </header>
  );
};

export default Header;
