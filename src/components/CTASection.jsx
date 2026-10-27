import React from 'react';
import { scrollTo, oauthPlaceholder } from '../App.jsx';

const CTASection = ({ showToast, openCalendly }) => {
  return (
    <section id="cta" className="main-canvas my-16 bg-white overflow-hidden relative">
      <div className="flex flex-col lg:flex-row items-center p-12 lg:p-24 gap-12">
        <div className="flex-1 z-10">
          <h3 className="mb-6 max-w-[600px]">
            Stop publishing unpolished content.
          </h3>
          <p className="text-[18px] mb-8 max-w-[500px]">
            Finally, a single AI tool that gives every piece of content your brand publishes the quality it deserves. Ready to start?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-[500px]">
            <button
              type="button"
              className="btn btn-black flex-1 h-[48px]"
              onClick={() => scrollTo('hero-form', 'hero-email')}
            >
              Get started for free
            </button>
            <button
              type="button"
              className="btn btn-variant-1 flex-1 h-[48px] flex items-center gap-2 justify-center"
              onClick={() => oauthPlaceholder('Google')}
            >
              <img
                src="https://www.apollo.io/_next/static/media/google-logo.0ni1ovkk-~fo5.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Sign up with Google
            </button>
          </div>
        </div>
        <div className="flex-1 relative h-[300px] lg:h-auto w-full flex justify-end items-center">
          <img
            src="https://www.apollo.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbeams-home.05qeafg77gaun.png&w=1920&q=75"
            alt="Accurrate AI decorative beams"
            className="absolute -right-20 top-1/2 -translate-y-1/2 w-[150%] max-w-[800px] object-cover mix-blend-multiply opacity-50 pointer-events-none"
          />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
