import React from 'react';
import { Linkedin, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-sand-40 pt-16 pb-8 px-6 lg:px-24">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 border-b border-sand-60/20 pb-12">
        <div className="lg:col-span-2">
          <img
            src="https://www.apollo.io/_next/static/media/logo.0pq8s8~3b84w1.svg"
            alt="Accurrate AI"
            className="w-[120px] h-[32px] object-contain mb-6"
          />
          <p className="text-body mb-6 max-w-sm">
            Accurrate AI is the intelligent content polishing platform that transforms rough drafts into polished, brand-aligned content — at scale.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-sand-60/10 flex items-center justify-center hover:bg-sand-60/20 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-sand-80" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-sand-60/10 flex items-center justify-center hover:bg-sand-60/20 transition-all"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 text-sand-80" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-sand-60/10 flex items-center justify-center hover:bg-sand-60/20 transition-all"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4 text-sand-80" />
            </a>
          </div>
        </div>

        <div>
          <p className="font-bold mb-4 text-black text-[16px]">Product</p>
          <ul className="flex flex-col gap-3">
            <li><a href="/features/tone" className="text-body hover:text-black transition-colors">Tone Matching</a></li>
            <li><a href="/features/grammar" className="text-body hover:text-black transition-colors">Grammar Correction</a></li>
            <li><a href="/features/brand-voice" className="text-body hover:text-black transition-colors">Brand Voice</a></li>
            <li><a href="/pricing" className="text-body hover:text-black transition-colors">Pricing</a></li>
          </ul>
        </div>

        <div>
          <p className="font-bold mb-4 text-black text-[16px]">Solutions</p>
          <ul className="flex flex-col gap-3">
            <li><a href="/solutions/marketers" className="text-body hover:text-black transition-colors">For Marketers</a></li>
            <li><a href="/solutions/founders" className="text-body hover:text-black transition-colors">For Founders</a></li>
            <li><a href="/solutions/agencies" className="text-body hover:text-black transition-colors">For Agencies</a></li>
            <li><a href="/enterprise" className="text-body hover:text-black transition-colors">Enterprise</a></li>
          </ul>
        </div>

        <div>
          <p className="font-bold mb-4 text-black text-[16px]">Company</p>
          <ul className="flex flex-col gap-3">
            <li><a href="/company/careers" className="text-body hover:text-black transition-colors">Careers</a></li>
            <li><a href="/our-story" className="text-body hover:text-black transition-colors">Our Story</a></li>
            <li><a href="/newsroom" className="text-body hover:text-black transition-colors">Newsroom</a></li>
            <li><a href="/contact-us" className="text-body hover:text-black transition-colors">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto mt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
        <p className="text-body">Apollo © 2026</p>
        <div className="flex gap-6">
          <a href="/privacy-policy" className="text-body hover:text-black transition-colors">Privacy Policy</a>
          <a href="/terms" className="text-body hover:text-black transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
