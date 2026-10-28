import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle2 } from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth, updateProfile } from '../firebase.js';
import { useAuth } from '../context/AuthContext.jsx';

// ─── Industry options ─────────────────────────────────────────────────────────
const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Retail & E-commerce',
  'Marketing / Agency',
  'Media & Entertainment',
  'Education',
  'Other',
];

// ─── Chat bubble components ───────────────────────────────────────────────────
const BotBubble = ({ text }) => (
  <div className="flex items-end gap-3 animate-fade-in-up">
    {/* Avatar */}
    <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
      <img src="/accurrate-icon-v2.png" alt="Accurrate AI" className="w-full h-full object-cover" />
    </div>
    {/* Bubble */}
    <div className="max-w-[75%] bg-white rounded-2xl rounded-bl-md px-5 py-3.5 shadow-sm text-[15px] text-[#252521] leading-relaxed">
      {text}
    </div>
  </div>
);

const UserBubble = ({ text }) => (
  <div className="flex justify-end animate-fade-in-up">
    <div className="max-w-[75%] bg-[#3EC5E8] text-white rounded-2xl rounded-br-md px-5 py-3.5 shadow-sm text-[15px] leading-relaxed">
      {text}
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex items-end gap-3 animate-fade-in-up">
    <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
      <img src="/accurrate-icon-v2.png" alt="Accurrate AI" className="w-full h-full object-cover" />
    </div>
    <div className="bg-white rounded-2xl rounded-bl-md px-5 py-4 shadow-sm flex gap-1.5 items-center">
      <span className="w-2 h-2 rounded-full bg-[#3EC5E8] animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 rounded-full bg-[#3EC5E8] animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 rounded-full bg-[#3EC5E8] animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Instant first question ready on render — no waiting
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! Let's get your ACCURRATE account set up. What's your first name?",
      id: 'initial_question',
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState({ name: '', company: '', industry: '', website: '' });

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // ── Auth guard & skip check if already onboarded ───────────────────────────
  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem('accurrate_user');
      if (!saved) {
        navigate('/login', { replace: true });
      }
      return;
    }

    const uid = user?.uid || user?.email || 'current_user';
    const cached = localStorage.getItem(`accurrate_onboarded_${uid}`) || localStorage.getItem('accurrate_onboarded');
    if (cached === 'true') {
      navigate('/dashboard', { replace: true });
      return;
    }

    // Background verify with Firestore if connected
    if (db && user?.uid) {
      getDoc(doc(db, 'users', user.uid))
        .then((snap) => {
          if (snap.exists() && snap.data().onboardingCompleted) {
            localStorage.setItem(`accurrate_onboarded_${uid}`, 'true');
            localStorage.setItem('accurrate_onboarded', 'true');
            navigate('/dashboard', { replace: true });
          }
        })
        .catch((err) => {
          console.warn('Could not check onboarding status:', err);
        });
    }
  }, [user, navigate]);

  // ── Pre-fill first name if available from Google / Auth ─────────────────────
  useEffect(() => {
    if (user?.displayName && !answers.name && currentStep === 0 && !inputValue) {
      const firstName = user.displayName.split(' ')[0];
      if (firstName && firstName !== 'User' && firstName !== 'Creator') {
        setInputValue(firstName);
      }
    }
  }, [user, currentStep]);

  // ── Auto-focus input on mount ───────────────────────────────────────────────
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isComplete]);

  // ── Focus input when not typing ─────────────────────────────────────────────
  useEffect(() => {
    if (!isTyping && currentStep >= 0 && !isComplete) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isTyping, currentStep, isComplete]);

  const addMessage = (role, text) => {
    setMessages((prev) => [...prev, { role, text, id: Date.now() + Math.random() }]);
  };

  const triggerBotMessage = (text, delayMs = 600) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage('bot', text);
    }, delayMs);
  };

  // ── Handle user submission ──────────────────────────────────────────────────
  const handleSubmit = (value = inputValue.trim()) => {
    if (!value || isTyping) return;

    addMessage('user', value);
    setInputValue('');

    const updatedAnswers = { ...answers };

    if (currentStep === 0) {
      // Step 1: First name
      updatedAnswers.name = value;
      setAnswers(updatedAnswers);
      setCurrentStep(1);
      triggerBotMessage(
        `Welcome, ${value}! What is the name of your company or workspace?`
      );
    } else if (currentStep === 1) {
      // Step 2: Company
      updatedAnswers.company = value;
      setAnswers(updatedAnswers);
      setCurrentStep(2);
      triggerBotMessage(
        "Great. What industry does your company operate in? (This helps us set up your baseline compliance rules.)"
      );
    } else if (currentStep === 2) {
      // Step 3: Industry typed
      updatedAnswers.industry = value;
      setAnswers(updatedAnswers);
      setCurrentStep(3);
      triggerBotMessage(
        "Almost done! Can you share the URL of your company website or a high-converting web page? This helps our AI learn your unique brand voice."
      );
    } else if (currentStep === 3) {
      // Step 4: Website URL
      updatedAnswers.website = value;
      setAnswers(updatedAnswers);
      finishOnboarding(updatedAnswers);
    }
  };

  const handleIndustrySelect = (industry) => {
    addMessage('user', industry);
    const updatedAnswers = { ...answers, industry };
    setAnswers(updatedAnswers);
    setCurrentStep(3);
    triggerBotMessage(
      "Almost done! Can you share the URL of your company website or a high-converting web page? This helps our AI learn your unique brand voice."
    );
  };

  const finishOnboarding = (finalAnswers) => {
    setCurrentStep(4);
    setIsTyping(true);

    // 1. Immediately store in localStorage so status is persisted synchronously
    try {
      const uid = user?.uid || user?.email || 'current_user';
      localStorage.setItem(`accurrate_onboarded_${uid}`, 'true');
      localStorage.setItem('accurrate_onboarded', 'true');
      localStorage.setItem('accurrate_workspace_profile', JSON.stringify(finalAnswers));
    } catch (e) {
      console.warn('localStorage save error:', e);
    }

    // 2. Fire-and-forget Firebase Auth & Firestore in background (never block navigation)
    if (auth?.currentUser && finalAnswers.name) {
      updateProfile(auth.currentUser, { displayName: finalAnswers.name }).catch((err) =>
        console.warn('Auth profile update error:', err)
      );
    }

    if (db && user?.uid) {
      setDoc(
        doc(db, 'users', user.uid),
        {
          name: finalAnswers.name || '',
          company: finalAnswers.company || '',
          industry: finalAnswers.industry || '',
          websiteUrl: finalAnswers.website || '',
          onboardingCompleted: true,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      ).catch((err) => console.warn('Firestore setDoc error:', err));
    }

    // 3. Show celebration message and navigate directly to dashboard
    setTimeout(() => {
      setIsTyping(false);
      addMessage('bot', "Perfect! Setting up your workspace now... 🚀");
      setIsComplete(true);

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#edebe8] flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-[#edebe8] border-b border-[#e0ddd9]">
        <div className="flex items-center gap-2.5">
          <img src="/accurrate-icon-v2.png" alt="Accurrate AI" className="w-9 h-9 object-contain rounded-xl" />
          <span className="text-[15px] font-semibold text-[#252521] tracking-tight">ACCURRATE</span>
        </div>

        {/* Step progress pills */}
        <div className="hidden sm:flex items-center gap-2">
          {['Name', 'Company', 'Industry', 'Website'].map((label, i) => {
            const done = currentStep > i;
            const active = currentStep === i;
            return (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-300 ${
                    done
                      ? 'bg-[#3EC5E8] text-white'
                      : active
                      ? 'bg-[#3EC5E8]/20 text-[#3EC5E8] ring-2 ring-[#3EC5E8]'
                      : 'bg-white text-[#b0aba6]'
                  }`}
                >
                  {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span
                  className={`text-[12px] font-medium ${
                    active ? 'text-[#252521]' : done ? 'text-[#3EC5E8]' : 'text-[#b0aba6]'
                  }`}
                >
                  {label}
                </span>
                {i < 3 && <span className="w-4 h-px bg-[#d8d4cf] ml-1" />}
              </div>
            );
          })}
        </div>

        <div className="w-24" />
      </header>

      {/* ── Chat area ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col">
        <div className="max-w-2xl w-full mx-auto flex flex-col gap-4">

          {messages.map((msg) =>
            msg.role === 'bot' ? (
              <BotBubble key={msg.id} text={msg.text} />
            ) : (
              <UserBubble key={msg.id} text={msg.text} />
            )
          )}

          {isTyping && <TypingIndicator />}

          {/* Industry chip grid — shown when step 2 active */}
          {currentStep === 2 && !isTyping && (
            <div className="flex flex-wrap gap-2.5 pl-12 animate-fade-in-up">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => handleIndustrySelect(ind)}
                  className="px-4 py-2 rounded-full bg-white text-[#252521] text-[13px] font-medium border border-[#e0ddd9] hover:bg-[#3EC5E8] hover:text-white hover:border-[#3EC5E8] transition-all duration-200 shadow-sm"
                >
                  {ind}
                </button>
              ))}
            </div>
          )}

          {/* Completion state */}
          {isComplete && (
            <div className="flex justify-center mt-4 animate-fade-in-up">
              <button
                type="button"
                onClick={() => navigate('/dashboard', { replace: true })}
                className="flex items-center gap-2 px-5 py-3 bg-[#3EC5E8]/10 hover:bg-[#3EC5E8]/20 transition-colors rounded-full text-[#3EC5E8] text-[14px] font-medium cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 animate-pulse" />
                Taking you to your dashboard…
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* ── Input bar ───────────────────────────────────────────────────────── */}
      {currentStep !== 2 && currentStep !== 4 && !isComplete && (
        <div className="w-full bg-[#edebe8] border-t border-[#e0ddd9] px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <input
              ref={inputRef}
              type={currentStep === 3 ? 'url' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                currentStep === 0
                  ? 'Type your first name…'
                  : currentStep === 1
                  ? 'Type your company name…'
                  : currentStep === 3
                  ? 'https://yourwebsite.com'
                  : 'Type your answer…'
              }
              disabled={isTyping}
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#e0ddd9] text-[15px] text-[#252521] placeholder:text-[#b0aba6] focus:outline-none focus:ring-2 focus:ring-[#3EC5E8] focus:border-transparent disabled:opacity-50 shadow-sm transition"
            />
            <button
              onClick={() => handleSubmit()}
              disabled={!inputValue.trim() || isTyping}
              className="w-11 h-11 rounded-xl bg-[#3EC5E8] text-white flex items-center justify-center hover:bg-[#2AAECE] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex-shrink-0"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
