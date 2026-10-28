import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle2, Sparkles } from 'lucide-react';
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
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

const DEFAULT_RECOMMENDED_RULES = `1. [Tone]: Confident, direct, human, and empowering without sarcasm or aggressive competitor mockery.
2. [Terminology]: Use current product nomenclature; avoid deprecated or legacy terminology.
3. [Messaging]: Highlight verified customer productivity benefits; prohibit misleading or unverified guarantees.
4. [Visual Consistency]: Maintain high visual fidelity and adhere to approved brand color tokens.
5. [Accessibility]: High contrast (WCAG AAA) for video text overlays and clear audio subtitles.
6. [Unsupported Claims]: All efficiency and benchmark statistics must cite verified case studies.`;

// ─── Chat bubble components ───────────────────────────────────────────────────
const BotBubble = ({ text }) => (
  <div className="flex items-end gap-3 animate-fade-in-up">
    {/* Avatar */}
    <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-white/20 shadow-sm">
      <img src="/accurrate-icon-v2.png" alt="Accurrate AI" className="w-full h-full object-cover" />
    </div>
    {/* Bubble */}
    <div className="max-w-[80%] bg-white dark:bg-[#28282B] border border-[#e5e2dd] dark:border-white/10 rounded-2xl rounded-bl-md px-5 py-3.5 shadow-sm text-[15px] text-[#252521] dark:text-[#f1f3f4] leading-relaxed whitespace-pre-line">
      {text}
    </div>
  </div>
);

const UserBubble = ({ text }) => (
  <div className="flex justify-end animate-fade-in-up">
    <div className="max-w-[80%] bg-[#ebf212] text-black font-semibold rounded-2xl rounded-br-md px-5 py-3.5 shadow-sm text-[14px] leading-relaxed whitespace-pre-wrap">
      {text}
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex items-end gap-3 animate-fade-in-up">
    <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-white/20 shadow-sm">
      <img src="/accurrate-icon-v2.png" alt="Accurrate AI" className="w-full h-full object-cover" />
    </div>
    <div className="bg-white dark:bg-[#28282B] border border-[#e5e2dd] dark:border-white/10 rounded-2xl rounded-bl-md px-5 py-4 shadow-sm flex gap-1.5 items-center">
      <span className="w-2 h-2 rounded-full bg-[#ebf212] animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 rounded-full bg-[#ebf212] animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 rounded-full bg-[#ebf212] animate-bounce" style={{ animationDelay: '300ms' }} />
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
  const [answers, setAnswers] = useState({
    name: '',
    company: '',
    industry: '',
    website: '',
    core_guidelines: ''
  });

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
      // Step 2: Company / Workspace Name
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
        "Can you share your Brand URL or company website? This helps our AI contextualize your brand identity."
      );
    } else if (currentStep === 3) {
      // Step 4: Brand URL -> Now ask for core brand guidelines
      updatedAnswers.website = value;
      setAnswers(updatedAnswers);
      setCurrentStep(4);
      triggerBotMessage(
        "Great! Please paste your core brand guidelines or tone-of-voice rules here so our AI can learn your brand."
      );
    } else if (currentStep === 4) {
      // Step 5: Core guidelines received -> finish
      updatedAnswers.core_guidelines = value;
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
      "Can you share your Brand URL or company website? This helps our AI contextualize your brand identity."
    );
  };

  const handleUsePresetGuidelines = () => {
    handleSubmit(DEFAULT_RECOMMENDED_RULES);
  };

  const finishOnboarding = (finalAnswers) => {
    setCurrentStep(5);
    setIsTyping(true);

    // 1. Immediately store in localStorage so status is persisted synchronously
    try {
      const uid = user?.uid || user?.email || 'current_user';
      localStorage.setItem(`accurrate_onboarded_${uid}`, 'true');
      localStorage.setItem('accurrate_onboarded', 'true');
      localStorage.setItem('accurrate_workspace_profile', JSON.stringify(finalAnswers));
      localStorage.setItem('accurrate_core_guidelines', finalAnswers.core_guidelines || '');
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
          core_guidelines: finalAnswers.core_guidelines || '',
          onboardingCompleted: true,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      ).catch((err) => console.warn('Firestore setDoc error:', err));

      // Also persist to brand_guidelines collection so it displays in their Brand Guidelines tab
      if (finalAnswers.core_guidelines) {
        addDoc(collection(db, 'brand_guidelines'), {
          name: `${finalAnswers.company || 'Workspace'} Core Guidelines`,
          fileType: 'TXT',
          size: '12 KB',
          rulesCount: finalAnswers.core_guidelines.split('\n').filter(l => l.trim()).length || 6,
          uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'Active',
          content: finalAnswers.core_guidelines,
          userId: user.uid,
          createdAt: serverTimestamp()
        }).catch(err => console.warn('Could not add to brand_guidelines collection:', err));
      }
    }

    // 3. Show celebration message and navigate directly to dashboard
    setTimeout(() => {
      setIsTyping(false);
      addMessage('bot', "Perfect! Your core brand guidelines have been saved to your profile. Setting up your workspace now... 🚀");
      setIsComplete(true);

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
        window.location.href = '/dashboard';
      }, 700);
    }, 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] dark:bg-[#131314] text-[#252521] dark:text-[#f1f3f4] flex flex-col transition-colors">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-[#1a1b1e] border-b border-[#e0ddd9] dark:border-white/10 shadow-xs">
        <div className="flex items-center gap-2.5">
          <img src="/accurrate-icon-v2.png" alt="Accurrate AI" className="w-9 h-9 object-contain rounded-xl" />
          <span className="text-[16px] font-bold text-[#252521] dark:text-white tracking-tight">ACCURRATE</span>
        </div>

        {/* Step progress pills */}
        <div className="hidden sm:flex items-center gap-2">
          {['Name', 'Workspace', 'Industry', 'Brand URL', 'Guidelines'].map((label, i) => {
            const done = currentStep > i;
            const active = currentStep === i;
            return (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                    done || active
                      ? 'bg-[#ebf212] text-black shadow-xs'
                      : 'bg-[#edebe8] dark:bg-white/10 text-[#736f6c] dark:text-[#9aa0a6]'
                  }`}
                >
                  {done ? <CheckCircle2 className="w-3.5 h-3.5 text-black" /> : i + 1}
                </div>
                <span
                  className={`text-[12px] font-medium ${
                    active ? 'text-black dark:text-white font-semibold' : done ? 'text-[#252521] dark:text-white/80' : 'text-[#736f6c] dark:text-[#9aa0a6]'
                  }`}
                >
                  {label}
                </span>
                {i < 4 && <span className="w-4 h-px bg-[#d8d4cf] dark:bg-white/10 ml-1" />}
              </div>
            );
          })}
        </div>

        <div className="w-24" />
      </header>

      {/* ── Chat area ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col">
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
                  className="px-4 py-2 rounded-full bg-white dark:bg-[#28282B] text-[#252521] dark:text-white text-[13px] font-semibold border border-[#e0ddd9] dark:border-white/10 hover:bg-[#ebf212] hover:text-black hover:border-[#ebf212] transition-all duration-200 shadow-sm cursor-pointer"
                >
                  {ind}
                </button>
              ))}
            </div>
          )}

          {/* Guidelines quick helper preset — shown when step 4 active */}
          {currentStep === 4 && !isTyping && (
            <div className="pl-12 flex flex-col gap-2 animate-fade-in-up">
              <span className="text-[12px] text-[#736f6c] dark:text-[#9aa0a6]">
                Paste your tone of voice rules below, or use our recommended preset:
              </span>
              <button
                type="button"
                onClick={handleUsePresetGuidelines}
                className="w-fit flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ebf212]/20 hover:bg-[#ebf212] border border-[#ebf212]/60 text-black dark:text-[#ebf212] dark:hover:text-black text-[12px] font-bold transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" /> Use Recommended Core Brand &amp; Tone Preset
              </button>
            </div>
          )}

          {/* Completion state */}
          {isComplete && (
            <div className="flex flex-col items-center gap-2 mt-4 animate-fade-in-up">
              <button
                type="button"
                onClick={() => {
                  navigate('/dashboard', { replace: true });
                  window.location.href = '/dashboard';
                }}
                className="flex items-center gap-2 px-6 py-3 bg-[#ebf212] hover:bg-[#dce30e] text-black font-bold rounded-full text-[14px] shadow-md transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-black animate-pulse" />
                Taking you to your dashboard…
              </button>
              <span className="text-[12px] text-[#736f6c] dark:text-[#9aa0a6]">Redirecting automatically… Click button to open immediately</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* ── Input bar ───────────────────────────────────────────────────────── */}
      {currentStep !== 2 && currentStep !== 5 && !isComplete && (
        <div className="w-full bg-white dark:bg-[#1a1b1e] border-t border-[#e0ddd9] dark:border-white/10 px-4 py-4 shadow-sm">
          <div className="max-w-2xl mx-auto flex items-end gap-3">
            {currentStep === 4 ? (
              <textarea
                ref={inputRef}
                rows={3}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste your brand rules, prohibited terms, tone standards here (Press Enter to submit)..."
                disabled={isTyping}
                className="flex-1 px-4 py-3 rounded-xl bg-[#F4F4F4] dark:bg-[#28282B] border border-[#e0ddd9] dark:border-white/10 text-[14px] text-[#252521] dark:text-white placeholder:text-[#8a8580] focus:outline-none focus:ring-2 focus:ring-[#ebf212] focus:border-transparent disabled:opacity-50 shadow-inner transition font-mono resize-y"
              />
            ) : (
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
                    ? 'Type your company / workspace name…'
                    : currentStep === 3
                    ? 'https://yourbrand.com'
                    : 'Type your answer…'
                }
                disabled={isTyping}
                className="flex-1 px-4 py-3 rounded-xl bg-[#F4F4F4] dark:bg-[#28282B] border border-[#e0ddd9] dark:border-white/10 text-[15px] text-[#252521] dark:text-white placeholder:text-[#8a8580] focus:outline-none focus:ring-2 focus:ring-[#ebf212] focus:border-transparent disabled:opacity-50 shadow-inner transition"
              />
            )}
            <button
              onClick={() => handleSubmit()}
              disabled={!inputValue.trim() || isTyping}
              className="w-11 h-11 rounded-xl bg-[#ebf212] text-black font-bold flex items-center justify-center hover:bg-[#dce30e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex-shrink-0 cursor-pointer mb-0.5"
            >
              <Send className="w-4.5 h-4.5 text-black" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
