import React from 'react';
import { useNavigate } from 'react-router-dom';
import { scrollTo } from '../App.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { LogOut, User } from 'lucide-react';

const Header = ({ openCalendly }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
            src="/accurrate-icon-v2.png"
            alt="Accurrate AI"
            className="h-12 w-12 object-contain rounded-xl"
          />
        </a>
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map(({ label, id }) => (
            <button
              key={label}
              onClick={() => scrollTo(id)}
              className="btn btn-variant-2 !text-[13px] !font-sans !font-semibold text-gray-900 tracking-wide"
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-lime !h-[36px] !px-3.5 !text-[12px] font-semibold flex items-center gap-1.5"
            >
              Open Workspace →
            </button>
            <div className="flex items-center gap-2 bg-[#f7f5f2] border border-[#e5e2dd] px-3 py-1.5 rounded-full">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#ebf212] flex items-center justify-center text-[10px] font-bold text-black">
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
              className="btn btn-variant-2 !h-[36px] !px-3 !text-[12px] flex items-center gap-1.5 text-[#736f6c] hover:text-black"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="btn btn-variant-2 hidden lg:flex !text-[13px] !font-sans !font-semibold text-gray-900 tracking-wide"
          >
            Log in
          </button>
        )}

        <button
          onClick={openCalendly}
          className="btn btn-variant-3 hidden lg:flex !text-[13px] !font-sans !font-normal tracking-wide"
        >
          Book a demo
        </button>

        {!user && (
          <button
            onClick={() => navigate('/signup')}
            className="btn btn-lime h-[40px] !text-[13px] !font-sans !font-medium tracking-wide"
          >
            Start polishing for free
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
