import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { scrollTo, oauthPlaceholder } from '../App.jsx';

const Hero = ({ showToast, openCalendly }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    navigate('/signup', { state: { email } });
  };

  return (
    <section
      id="hero"
      className="main-canvas mt-4 mb-8 pt-20 pb-16 px-6 lg:px-12 flex flex-col items-center text-center relative"
    >
      <h1 className="max-w-[800px] mx-auto mb-6">
        Elevate your brand's voice with AI-precision content polishing.
      </h1>
      <p className="text-[18px] text-sand-80 mb-10 max-w-[600px] mx-auto">
        Transform rough drafts into polished, brand-aligned content in seconds — across every channel, every format, every time.
      </p>

      <div className="flex bg-[#f7f5f2] rounded-lg p-1 mb-8">
        <button
          type="button"
          className="btn btn-black rounded-[6px] h-[40px] px-6"
          onClick={() => scrollTo('hero-form', 'hero-email')}
        >
          Start polishing for free
        </button>
        <button
          type="button"
          className="btn btn-variant-2 rounded-[6px] h-[40px] px-6 text-sand-60 hover:text-black"
          onClick={openCalendly}
        >
          Book a demo
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4 bg-sand-10 rounded-full px-4 py-1">
        <Check className="w-4 h-4 text-green-600" />
        <span className="text-[14px] text-sand-70 font-medium">No credit card required</span>
      </div>

      <form
        id="hero-form"
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-[560px] mb-6"
      >
        <input
          id="hero-email"
          type="email"
          placeholder="Enter your work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field flex-1 h-[58px]"
          required
        />
        <button type="submit" className="btn btn-lime h-[58px] px-12 text-[15px]">
          Start polishing for free
        </button>
      </form>

      <div className="flex items-center w-full max-w-[560px] gap-4 mb-6">
        <div className="h-[1px] bg-sand-40 flex-1"></div>
        <span className="text-body text-sand-60 uppercase text-[12px] tracking-wider">or</span>
        <div className="h-[1px] bg-sand-40 flex-1"></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[560px]">
        <button
          type="button"
          className="btn btn-variant-1 flex-1 flex items-center justify-center gap-3 h-[58px] text-[15px] px-6"
          onClick={() => oauthPlaceholder('Google')}
        >
          <img
            src="https://www.apollo.io/_next/static/media/google-logo.0ni1ovkk-~fo5.svg"
            className="w-6 h-6"
            alt="Google logo"
          />
          Continue with Google
        </button>
        <button
          type="button"
          className="btn btn-variant-1 flex-1 flex items-center justify-center gap-3 h-[58px] text-[15px] px-6"
          onClick={() => oauthPlaceholder('Microsoft')}
        >
          <img
            src="https://www.apollo.io/_next/static/media/microsoft-logo.0frmfnik3yxsa.svg"
            className="w-6 h-6"
            alt="Microsoft logo"
          />
          Continue with Microsoft
        </button>
      </div>

      <p className="text-body mt-4 text-sand-60 text-[12px]">
        By signing up, I agree to Accurrate AI's{' '}
        <a href="/terms" className="underline">Terms of Service</a>{' '}
        and{' '}
        <a href="/privacy-policy" className="underline">Privacy Policy</a>.
      </p>

      <div className="mt-20 w-full max-w-[1145px] mx-auto rounded-xl overflow-hidden shadow-lg border border-sand-30">
        <img
          src="https://www.apollo.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhomepage-static-for-video.01wc.1ryunug7.png&w=3840&q=75"
          alt="Accurrate AI Content Editor Dashboard"
          className="w-full h-auto object-cover aspect-[1.99/1]"
        />
      </div>
    </section>
  );
};

export default Hero;
