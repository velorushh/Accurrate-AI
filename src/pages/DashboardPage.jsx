import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Database,
  History,
  Settings,
  LogOut,
  Bell,
  UploadCloud,
  FileVideo,
  FileImage,
  FileText,
  X,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  AlertCircle,
  Wand2,
  ChevronRight,
  Code,
  Download,
  RotateCcw,
  ShieldCheck,
  Zap,
  Plus,
  Trash2,
  Eye,
  Key,
  User,
  Users,
  Globe,
  ExternalLink,
  Sliders,
  Check,
  Copy,
  Server,
  FileCheck,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Lock,
  Layers,
  ArrowRight,
  Filter,
  CheckCheck,
  HelpCircle,
  Share2,
  Palette,
  Volume2,
  FileWarning,
  EyeOff,
  Sun,
  Moon
} from 'lucide-react';

// ─── DEFAULT BRAND RULES & PRESETS ──────────────────────────────────────────
const DEFAULT_BRAND_RULES = `1. [Tone]: Maintain confident, direct, and respectful tone across all copy without sarcasm, hyperbole, or aggressive sales rhetoric.
2. [Terminology]: Never use outdated product terms (e.g., 'legacy sync', 'classic viewer'); use current nomenclature ('instant sync', 'live workspace').
3. [Messaging]: Highlight human-centric benefits and productivity gains. Prohibit misleading guarantees or unverified performance claims.
4. [Visual Consistency]: Visual assets must adhere to approved brand palette (primary yellow #ebf212, deep charcoal #131314, card surface #28282B).
5. [Accessibility]: Ensure high contrast (WCAG AAA) for video text overlays, legible typography, and clear subtitles for audio voiceover.
6. [Unsupported Claims]: All numerical efficiency claims (e.g., '10x faster', '99.9% savings') must cite verified customer case study benchmarks.`;

const RULE_PRESETS = [
  { name: 'Core Brand & Tone', text: DEFAULT_BRAND_RULES },
  {
    name: 'SaaS Launch Compliance',
    text: `1. [Messaging]: Clear focus on ROI and verifiable developer hours saved.
2. [Unsupported Claims]: Benchmark claims must cite methodology footnote.
3. [Visual Consistency]: UI mockups must use official brand yellow #ebf212 accents.
4. [Accessibility]: Subtitles required for all video voiceovers.`
  },
  {
    name: 'Global Ad Standards',
    text: `1. [Tone]: Culturally sensitive, inclusive, and globally respectful language.
2. [Terminology]: Clear disclaimers for regional promotions and trial periods.
3. [Accessibility]: Contrast ratio 4.5:1 minimum on all video text cards.`
  }
];

// ─── SAMPLE NEW CATEGORIZED AUDIT REPORTS (No Scores, Constructive) ───────────
const SAMPLE_CATEGORIZED_REPORT = {
  asset_name: "summer_product_launch_v3.mp4",
  media_type: "Video",
  review_status: "Needs Revision", // State machine: Draft | In Review | Needs Revision | Approved
  summary: "Asset demonstrates strong visual pacing and brand color fidelity, but requires 3 constructive revisions across Tone, Unsupported Claims, and Visual Consistency before publishing.",
  brand_strengths: [
    "Primary brand yellow (#ebf212) accent applied cleanly to key CTA button overlays.",
    "Audio cadence is clear, conversational, and respectful.",
    "High visual clarity on mobile and desktop viewports."
  ],
  findings: [
    {
      id: "flag-1",
      category: "Unsupported Claims", // Tone | Terminology | Messaging | Visual Consistency | Accessibility | Unsupported Claims
      severity: "High",
      rule_reference: "Rule 6: All numerical efficiency claims must cite verified benchmarks",
      flagged_content: "'Eliminates 100% of human error overnight.' (0:14 audio voiceover)",
      issue_explanation: "Absolute guarantee 'eliminates 100% of human error' is legally unverified and conflicts with the brand's commitment to honest, verified claims.",
      suggested_correction: "'Automates tedious compliance reviews so your team catches critical errors before publishing.'",
      intent_preserved: "Keeps the focus on error reduction and speed without making an unsupportable guarantee.",
      status: "Open", // Open | Accepted | Overridden
      comments: [
        {
          id: "c1",
          author: "Alex Rivera",
          role: "Brand Manager",
          text: "Legal requires us to soften this statement. Let's use the suggested copy in Canva.",
          timestamp: "10 mins ago"
        }
      ]
    },
    {
      id: "flag-2",
      category: "Tone",
      severity: "Medium",
      rule_reference: "Rule 1: Confident, direct, and respectful tone without sarcasm or hyperbole",
      flagged_content: "'Don't get stuck using dinosaur tools built for the stone age.' (0:22 on-screen caption)",
      issue_explanation: "Disparaging competitors as 'dinosaurs' and 'stone age' conflicts with our respectful, forward-looking brand voice.",
      suggested_correction: "'Upgrade from manual spreadsheets to real-time AI compliance verification.'",
      intent_preserved: "Contrasts manual workflows with modern automation constructively without aggressive mockery.",
      status: "Open",
      comments: []
    },
    {
      id: "flag-3",
      category: "Visual Consistency",
      severity: "Advisory",
      rule_reference: "Rule 4: Visual assets must adhere to approved brand palette (#ebf212, #131314)",
      flagged_content: "Footer disclaimer banner at 0:28 uses neon magenta (#FF007F) background.",
      issue_explanation: "Magenta banner violates the approved brand color tokens and draws focus away from the primary CTA.",
      suggested_correction: "Set banner background to Deep Charcoal (#131314) with white typography and #ebf212 accent dot.",
      intent_preserved: "Maintains high readability for disclosures while preserving cohesive brand aesthetics.",
      status: "Accepted",
      comments: [
        {
          id: "c2",
          author: "Jane Doe",
          role: "Creator",
          text: "Applied this color adjustment in Canva! Ready for sign-off.",
          timestamp: "2 mins ago"
        }
      ]
    }
  ],
  security_audit: {
    retention_policy: "Zero-Retention Ephemeral",
    ephemeral_storage_wiped: true,
    bytes_persisted: 0,
    sanitized_at: "immediate-post-audit"
  }
};

const SAMPLE_APPROVED_REPORT = {
  asset_name: "enterprise_workflow_explainer.png",
  media_type: "Image",
  review_status: "Approved",
  summary: "Exceptional compliance alignment. All terminology, tone guidelines, and accessibility standards fully satisfied. Ready for global distribution.",
  brand_strengths: [
    "Tone is empowering, respectful, and transparent.",
    "Typography adheres to WCAG AAA contrast guidelines.",
    "All metrics cite verified 2026 enterprise audit benchmarks."
  ],
  findings: [],
  security_audit: {
    retention_policy: "Zero-Retention Ephemeral",
    ephemeral_storage_wiped: true,
    bytes_persisted: 0,
    sanitized_at: "immediate-post-audit"
  }
};

// ─── HISTORICAL DATABASE OF FLAGS FOR ANALYTICS ──────────────────────────────
const HISTORICAL_FLAGS_DATA = [
  { id: 'f-101', category: 'Unsupported Claims', rule: 'Rule 6: Numerical benchmarks', count: 38, ambiguityScore: 'High Friction', note: 'Creators frequently lack benchmark source links.' },
  { id: 'f-102', category: 'Tone', rule: 'Rule 1: Direct, respectful tone', count: 29, ambiguityScore: 'High Friction', note: 'Humor often crosses into sarcastic competitor remarks.' },
  { id: 'f-103', category: 'Visual Consistency', rule: 'Rule 4: Approved palette (#ebf212)', count: 22, ambiguityScore: 'Medium Friction', note: 'Third-party templates introduce unapproved gradients.' },
  { id: 'f-104', category: 'Terminology', rule: 'Rule 2: Current product nomenclature', count: 18, ambiguityScore: 'Medium Friction', note: 'Old product names reused from older slide decks.' },
  { id: 'f-105', category: 'Accessibility', rule: 'Rule 5: Video text contrast ratio', count: 14, ambiguityScore: 'Low Friction', note: 'Light text on pale background video scenes.' },
  { id: 'f-106', category: 'Messaging', rule: 'Rule 3: Human-centric value prop', count: 9, ambiguityScore: 'Low Friction', note: 'Overly technical feature lists without user benefit.' },
];

const INITIAL_DATASETS = [
  {
    id: 'DS-101',
    name: 'Global Ad Compliance Standard v2.4',
    fileType: 'PDF',
    size: '1.2 MB',
    rulesCount: 14,
    uploadedDate: 'Oct 24, 2026',
    status: 'Active',
    content: `1. All regional advertising guidelines must be strictly enforced.
2. Sensitive religious or political imagery is disallowed.
3. Voiceover tone must remain professional, neutral, and respectful.
4. Disclaimers required for performance metrics and test statistics.`
  },
  {
    id: 'DS-102',
    name: 'Core Brand Voice & Visual Identity',
    fileType: 'DOCX',
    size: '840 KB',
    rulesCount: 8,
    uploadedDate: 'Oct 20, 2026',
    status: 'Active',
    content: `1. Tone: Confident, direct, human, and empowering.
2. Visual palette: Warm neutral sand, dark charcoal typography, brand yellow accents (#ebf212).
3. Avoid aggressive sales copy or hyperbole.`
  },
  {
    id: 'DS-103',
    name: 'Social Media Tone & Cultural Sensitivities',
    fileType: 'TXT',
    size: '140 KB',
    rulesCount: 19,
    uploadedDate: 'Oct 15, 2026',
    status: 'Preset',
    content: `1. Content must be respectful of cross-regional festivities and holidays.
2. Humor must not target protected cultural groups.
3. Verify claims made in short-form Reels and TikTok spots.`
  }
];

const INITIAL_SCANS = [
  {
    id: 'SCN-9842',
    title: 'Autumn Campaign - 30s Brand Story',
    mediaType: 'Video',
    mediaFile: 'autumn_story_final.mp4',
    ruleUsed: 'Global Ad Compliance Standard v2.4',
    review_status: 'Approved',
    date: 'Oct 27, 2026',
    summary: 'All claims verified and tone matches core brand guidelines.',
    findingsCount: 0,
    categories: ['Tone', 'Messaging']
  },
  {
    id: 'SCN-9841',
    title: 'Morning Routine Lifestyle Teaser',
    mediaType: 'Video',
    mediaFile: 'morning_teaser_cut3.mp4',
    ruleUsed: 'Core Brand Voice & Visual Identity',
    review_status: 'Needs Revision',
    date: 'Oct 26, 2026',
    summary: '2 Unsupported Claims and 1 Tone mismatch flagged for review.',
    findingsCount: 3,
    categories: ['Unsupported Claims', 'Tone']
  },
  {
    id: 'SCN-9839',
    title: 'Instagram Carousel - Feature Highlights',
    mediaType: 'Image',
    mediaFile: 'carousel_slides_v2.png',
    ruleUsed: 'Social Media Tone & Cultural Sensitivities',
    review_status: 'Approved',
    date: 'Oct 25, 2026',
    summary: 'Visual contrast and typography fully compliant.',
    findingsCount: 0,
    categories: ['Visual Consistency']
  },
  {
    id: 'SCN-9835',
    title: 'TikTok Influencer Reel - Quick Polish',
    mediaType: 'Video',
    mediaFile: 'influencer_clip_draft.mov',
    ruleUsed: 'Social Media Tone & Cultural Sensitivities',
    review_status: 'Needs Revision',
    date: 'Oct 23, 2026',
    summary: 'Sarcastic voiceover violates inclusive tone requirement.',
    findingsCount: 2,
    categories: ['Tone', 'Terminology']
  }
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // ── Global Theming State (Light #F4F4F4 vs Gemini Dark #131314) ────────────
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('accurrate_theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('accurrate_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Navigation tab state sync with URL
  const getTabFromPath = () => {
    const path = location.pathname.replace(/\/$/, '');
    if (path === '/dashboard/datasets') return 'datasets';
    if (path === '/dashboard/analytics') return 'analytics';
    if (path === '/dashboard/settings') return 'settings';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const switchTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'dashboard') {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${tabId}`);
    }
  };

  // ── Form & Audit State ──────────────────────────────────────────────────
  const [brandRules, setBrandRules] = useState(DEFAULT_BRAND_RULES);

  // 3 Upload Slots
  const [adCreative, setAdCreative] = useState(null);
  const [adPreviewUrl, setAdPreviewUrl] = useState(null);
  const [adDragging, setAdDragging] = useState(false);
  const [contentScript, setContentScript] = useState(null);
  const [brandGuidelines, setBrandGuidelines] = useState(null);

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);

  // Human-in-the-Loop Collaboration States
  const [currentUserRole, setCurrentUserRole] = useState('Brand Manager'); // Creator | Brand Manager | Authorized Reviewer
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [activeCommentInputs, setActiveCommentInputs] = useState({});
  const [canvaModalData, setCanvaModalData] = useState(null);
  const [overrideModalData, setOverrideModalData] = useState(null);
  const [overrideReasonInput, setOverrideReasonInput] = useState('');

  // Datasets State
  const [datasets, setDatasets] = useState(INITIAL_DATASETS);
  const [showUploadDatasetModal, setShowUploadDatasetModal] = useState(false);
  const [viewingDataset, setViewingDataset] = useState(null);
  const [newDatasetForm, setNewDatasetForm] = useState({ name: '', fileType: 'PDF', content: '' });

  // Scan History State
  const [scanHistory, setScanHistory] = useState(INITIAL_SCANS);

  // File input refs
  const adCreativeRef = useRef(null);
  const contentScriptRef = useRef(null);
  const brandGuidelinesRef = useRef(null);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const addToast = (msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // ── Start New Audit Session ──────────────────────────────────────────────
  const startNewAudit = () => {
    setAuditReport(null);
    setAdCreative(null);
    if (adPreviewUrl) URL.revokeObjectURL(adPreviewUrl);
    setAdPreviewUrl(null);
    setContentScript(null);
    setBrandGuidelines(null);
    if (adCreativeRef.current) adCreativeRef.current.value = '';
    if (contentScriptRef.current) contentScriptRef.current.value = '';
    if (brandGuidelinesRef.current) brandGuidelinesRef.current.value = '';
    switchTab('dashboard');
    addToast('Started a fresh audit session.', 'info');
  };

  // ── Load Past Audit from Sidebar Chat History ────────────────────────────
  const loadScanFromHistory = (scan) => {
    const report = {
      asset_name: scan.mediaFile || scan.title,
      media_type: scan.mediaType || 'Video',
      review_status: scan.review_status || 'Approved',
      summary: scan.summary || `Audit completed on ${scan.date}.`,
      brand_strengths: [
        'Primary brand yellow (#ebf212) accent applied cleanly.',
        'Audio cadence is conversational and respectful.',
        'High visual clarity across mobile and desktop.'
      ],
      findings: scan.findingsCount > 0 ? SAMPLE_CATEGORIZED_REPORT.findings : [],
      security_audit: {
        retention_policy: 'Zero-Retention Ephemeral',
        ephemeral_storage_wiped: true,
        bytes_persisted: 0
      }
    };
    setAuditReport(report);
    switchTab('dashboard');
    addToast(`Loaded audit: "${scan.title}"`, 'info');
  };

  // ── File Handlers ────────────────────────────────────────────────────────
  const handleAdCreative = (file) => {
    if (!file) return;
    if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) {
      addToast('Please upload an image or video file.', 'error');
      return;
    }
    setAdCreative(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setAdPreviewUrl(url);
    } else {
      setAdPreviewUrl(null);
    }
    addToast(`Ad Creative: "${file.name}" uploaded.`, 'success');
  };

  const removeAdCreative = () => {
    setAdCreative(null);
    if (adPreviewUrl) URL.revokeObjectURL(adPreviewUrl);
    setAdPreviewUrl(null);
    if (adCreativeRef.current) adCreativeRef.current.value = '';
    addToast('Ad Creative removed.', 'info');
  };

  const handleContentScript = (file) => {
    if (!file) return;
    setContentScript(file);
    addToast(`Content Script: "${file.name}" uploaded.`, 'success');
  };

  const removeContentScript = () => {
    setContentScript(null);
    if (contentScriptRef.current) contentScriptRef.current.value = '';
    addToast('Content Script removed.', 'info');
  };

  const handleBrandGuidelines = (file) => {
    if (!file) return;
    setBrandGuidelines(file);
    addToast(`Brand Guidelines: "${file.name}" uploaded.`, 'success');
  };

  const removeBrandGuidelines = () => {
    setBrandGuidelines(null);
    if (brandGuidelinesRef.current) brandGuidelinesRef.current.value = '';
    addToast('Brand Guidelines removed.', 'info');
  };

  // ── Run Categorized AI Audit (FastAPI + Gemini) ───────────────────────────
  const runAiAudit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!adCreative && !contentScript && !brandGuidelines && !brandRules.trim()) {
      addToast('Please upload an Ad Creative, Script, or Guidelines document first.', 'error');
      return;
    }

    setAuditReport(null);
    setIsAuditing(true);
    addToast('Running Categorized AI Audit (Zero-Retention Ephemeral)...', 'info');

    const formData = new FormData();
    formData.append('dataset_rules', brandRules);
    if (adCreative) formData.append('ad_file', adCreative);
    if (contentScript) formData.append('content_script', contentScript);
    if (brandGuidelines) formData.append('brand_guidelines', brandGuidelines);

    const backendUrl = 'http://localhost:8000';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(`${backendUrl}/scan-media`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const rawReport = data.report || data;

        const normalizedFindings = (rawReport.findings || []).map((f, idx) => ({
          id: f.id || `flag-${idx + 1}`,
          category: f.category || 'Messaging',
          severity: f.severity || 'Medium',
          rule_reference: f.rule_reference || 'Brand Guideline Rule',
          flagged_content: f.flagged_content || 'Flagged element in creative',
          issue_explanation: f.issue_explanation || 'Identified conflict with active guidelines.',
          suggested_correction: f.suggested_correction || 'Suggested revision preserving creator intent.',
          intent_preserved: f.intent_preserved || 'Maintains original creative message.',
          status: f.status || 'Open',
          comments: f.comments || []
        }));

        const cleanReport = {
          asset_name: adCreative?.name || contentScript?.name || brandGuidelines?.name || 'Uploaded Creative Asset',
          media_type: adCreative ? (adCreative.type.startsWith('video/') ? 'Video' : 'Image') : 'Document',
          review_status: rawReport.review_status || (normalizedFindings.length > 0 ? 'Needs Revision' : 'Approved'),
          summary: rawReport.summary || `Audit complete. Identified ${normalizedFindings.length} actionable items.`,
          brand_strengths: rawReport.brand_strengths || [
            'Core brand yellow (#ebf212) accents applied cleanly.',
            'High visual clarity across mobile and desktop.'
          ],
          findings: normalizedFindings,
          security_audit: rawReport.security_audit || {
            retention_policy: 'Zero-Retention Ephemeral',
            ephemeral_storage_wiped: true,
            bytes_persisted: 0
          }
        };

        setAuditReport(cleanReport);

        const newScan = {
          id: `SCN-${Math.floor(1000 + Math.random() * 9000)}`,
          title: adCreative ? adCreative.name.replace(/\.[^/.]+$/, '') : (contentScript?.name || 'Live Audit'),
          mediaType: cleanReport.media_type,
          mediaFile: cleanReport.asset_name,
          ruleUsed: 'Active Brand Rules',
          review_status: cleanReport.review_status,
          date: 'Just now',
          summary: cleanReport.summary,
          findingsCount: normalizedFindings.length,
          categories: Array.from(new Set(normalizedFindings.map(f => f.category)))
        };
        setScanHistory(prev => [newScan, ...prev]);

        addToast('Categorized AI Audit completed with zero data retention!', 'success');
        setIsAuditing(false);
        return;
      } else {
        const errData = await response.json().catch(() => ({}));
        const detail = errData.detail || `Server error (${response.status} ${response.statusText})`;
        if (response.status === 401 || response.status === 403) {
          addToast(`Gemini API Key Error (${response.status}): ${detail}. Please check backend/.env`, 'error');
        } else {
          addToast(`FastAPI Server Error (${response.status}): ${detail}`, 'error');
        }
        setIsAuditing(false);
        return;
      }
    } catch (err) {
      console.error('FastAPI fetch error:', err);
      const isAbort = err.name === 'AbortError';
      const msg = isAbort
        ? 'AI Audit timed out after 60s. Please check backend logs.'
        : `Cannot connect to FastAPI at ${backendUrl}. Ensure "uvicorn main:app --reload" is running in /backend.`;
      addToast(msg, 'error');
      setIsAuditing(false);
      return;
    }
  };

  // ── State Machine Transitions ─────────────────────────────────────────────
  const updateAssetReviewStatus = (newStatus) => {
    if (!auditReport) return;
    setAuditReport(prev => ({ ...prev, review_status: newStatus }));
    addToast(`Asset state updated to: "${newStatus}" by ${currentUserRole}`, 'success');
  };

  // ── Flag Human-in-the-Loop Actions ────────────────────────────────────────
  const updateFlagStatus = (flagId, newStatus) => {
    setAuditReport(prev => {
      if (!prev?.findings) return prev;
      const updatedFindings = prev.findings.map(f => {
        if (f.id === flagId) {
          return { ...f, status: newStatus };
        }
        return f;
      });
      return { ...prev, findings: updatedFindings };
    });
    addToast(`Flag marked as "${newStatus}"`, 'info');
  };

  const handleOpenOverrideModal = (flag) => {
    setOverrideModalData(flag);
    setOverrideReasonInput('');
  };

  const confirmOverride = () => {
    if (!overrideModalData) return;
    const reason = overrideReasonInput.trim() || 'Reviewed and authorized as intentional creative brand exception.';

    setAuditReport(prev => {
      if (!prev?.findings) return prev;
      const updatedFindings = prev.findings.map(f => {
        if (f.id === overrideModalData.id) {
          const newComments = [
            ...(f.comments || []),
            {
              id: Date.now().toString(),
              author: user?.displayName || currentUserRole,
              role: currentUserRole,
              text: `[OVERRIDDEN]: ${reason}`,
              timestamp: 'Just now'
            }
          ];
          return { ...f, status: 'Overridden', comments: newComments, overrideReason: reason };
        }
        return f;
      });
      return { ...prev, findings: updatedFindings };
    });

    addToast(`Flag overridden by ${currentUserRole}`, 'success');
    setOverrideModalData(null);
  };

  const handleAddComment = (flagId) => {
    const text = (activeCommentInputs[flagId] || '').trim();
    if (!text) return;

    setAuditReport(prev => {
      if (!prev?.findings) return prev;
      const updatedFindings = prev.findings.map(f => {
        if (f.id === flagId) {
          const newComment = {
            id: Date.now().toString(),
            author: user?.displayName || currentUserRole,
            role: currentUserRole,
            text,
            timestamp: 'Just now'
          };
          return { ...f, comments: [...(f.comments || []), newComment] };
        }
        return f;
      });
      return { ...prev, findings: updatedFindings };
    });

    setActiveCommentInputs(prev => ({ ...prev, [flagId]: '' }));
    addToast('Feedback comment posted to thread.', 'info');
  };

  const copyToClipboard = (text, label = 'Correction') => {
    navigator.clipboard.writeText(text);
    addToast(`${label} copied to clipboard! Ready to paste into Canva / editor.`, 'success');
  };

  // Filtered findings by category
  const filteredFindings = useMemo(() => {
    if (!auditReport?.findings) return [];
    if (selectedCategoryFilter === 'All') return auditReport.findings;
    return auditReport.findings.filter(f => f.category === selectedCategoryFilter);
  }, [auditReport, selectedCategoryFilter]);

  const categoryList = ['All', 'Tone', 'Terminology', 'Messaging', 'Visual Consistency', 'Accessibility', 'Unsupported Claims'];

  // ── Core Navigation Items ─────────────────────────────────────────────────
  const navItems = [
    { id: 'dashboard', label: 'Compliance Audit', icon: LayoutDashboard },
    { id: 'analytics', label: 'Mistakes Analytics', icon: BarChart3 },
    { id: 'datasets', label: 'Brand Guidelines', icon: Database },
    { id: 'settings', label: 'Workspace Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#F4F4F4] dark:bg-[#131314] text-[#131314] dark:text-[#f0f0f0] font-sans antialiased overflow-hidden transition-colors duration-200">

      {/* ── 1. FIXED LEFT SIDEBAR (Gemini-Inspired) ────────────────────────── */}
      <aside className="w-[80px] lg:w-[270px] bg-white dark:bg-[#1a1a1c] border-r border-[#e5e2dd] dark:border-[#2d2d30] flex flex-col justify-between flex-shrink-0 select-none transition-colors duration-200 z-20">
        
        {/* Top: Logo & Core Navigation Links */}
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div
            className="h-[72px] px-4 lg:px-6 flex items-center gap-3 border-b border-[#e5e2dd] dark:border-[#2d2d30] cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src="/accurrate-icon-v2.png"
              alt="ACCURRATE Logo"
              className="w-10 h-10 rounded-xl object-contain flex-shrink-0 bg-transparent"
            />
            <div className="hidden lg:flex flex-col">
              <span className="font-bold text-[16px] tracking-tight text-[#131314] dark:text-white leading-tight">
                ACCURRATE
              </span>
              <span className="text-[10px] text-[#ebf212] bg-black dark:bg-[#ebf212] dark:text-black font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider w-fit mt-0.5">
                AI GATEKEEPER
              </span>
            </div>
          </div>

          {/* Core Navigation Items */}
          <nav className="p-3 lg:p-4 flex flex-col gap-1.5">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => switchTab(id)}
                  className={`flex items-center gap-3.5 w-full h-[46px] px-3.5 rounded-xl text-[14px] transition-all duration-150 ${
                    isActive
                      ? 'bg-[#ebf212] text-black shadow-md font-bold'
                      : 'text-[#5f6368] dark:text-[#9aa0a6] hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white font-medium'
                  }`}
                  title={label}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-black' : 'text-current'}`} />
                  <span className="hidden lg:inline">{label}</span>
                  {isActive && <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-black shadow" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Middle (Scrollable): 'Recent Audits' Listed Like Gemini Chat History Logs */}
        <div className="flex-1 overflow-y-auto px-3 lg:px-4 py-2 border-t border-[#e5e2dd] dark:border-[#2d2d30]">
          <div className="hidden lg:flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#736f6c] dark:text-[#80868b]">
              Recent Audits
            </span>
            <button
              onClick={startNewAudit}
              className="text-[11px] font-semibold text-black dark:text-[#ebf212] hover:underline flex items-center gap-1"
              title="Start New Audit"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {scanHistory.map((scan) => {
              const isSelected = auditReport?.asset_name === scan.mediaFile || auditReport?.asset_name === scan.title;
              return (
                <button
                  key={scan.id}
                  onClick={() => loadScanFromHistory(scan)}
                  className={`w-full text-left p-2.5 rounded-xl text-[12px] transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#ebf212]/20 dark:bg-[#ebf212]/15 text-black dark:text-[#ebf212] font-semibold border border-[#ebf212]/40'
                      : 'text-[#47423d] dark:text-[#bdc1c6] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                  title={`${scan.title} (${scan.review_status})`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MessageSquare className="w-4 h-4 flex-shrink-0 text-[#736f6c] dark:text-[#80868b] group-hover:text-black dark:group-hover:text-white" />
                    <span className="hidden lg:inline truncate font-medium">
                      {scan.title}
                    </span>
                  </div>
                  <span
                    className={`hidden lg:inline text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${
                      scan.review_status === 'Approved'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {scan.review_status === 'Approved' ? 'Pass' : `${scan.findingsCount} flags`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Sidebar: Security Status, User Profile, Theme Switcher & Log Out */}
        <div className="p-3 lg:p-4 border-t border-[#e5e2dd] dark:border-[#2d2d30] flex flex-col gap-2.5">
          {/* Zero-Retention Ephemeral Indicator */}
          <div className="hidden lg:flex flex-col gap-1 p-2.5 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 text-[11px]">
            <div className="flex items-center gap-1.5 text-black dark:text-[#ebf212] font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Retention Active</span>
            </div>
            <p className="text-[10px] text-[#736f6c] dark:text-[#9aa0a6] leading-tight">
              Uploaded files strictly wiped from memory post-scan.
            </p>
          </div>

          {/* User Profile Mini Card */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-black/5 dark:bg-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#ebf212] text-black font-extrabold flex items-center justify-center text-[12px] shadow-sm flex-shrink-0">
                {(user?.displayName || user?.email || 'A')[0].toUpperCase()}
              </div>
              <div className="hidden lg:flex flex-col text-left truncate">
                <span className="text-[12px] font-bold text-[#131314] dark:text-white truncate">
                  {user?.displayName || 'Alex Rivera'}
                </span>
                <span className="text-[10px] text-[#736f6c] dark:text-[#9aa0a6]">
                  {currentUserRole}
                </span>
              </div>
            </div>

            {/* Quick Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-[#e5e2dd] dark:border-[#3c4043] bg-white dark:bg-[#28282B] text-[#131314] dark:text-[#ebf212] hover:opacity-80 transition"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Gemini Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Log Out */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full h-[38px] px-3 rounded-xl text-[13px] text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="hidden lg:inline font-semibold">Log Out</span>
          </button>
        </div>

      </aside>

      {/* ── 2. MAIN APP CONTAINER ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── TOP HEADER ─────────────────────────────────────────────────── */}
        <header className="h-[72px] bg-white dark:bg-[#1e1e20] border-b border-[#e5e2dd] dark:border-[#2d2d30] px-6 lg:px-8 flex items-center justify-between flex-shrink-0 shadow-sm z-10 transition-colors duration-200">
          <div>
            <h1 className="text-[19px] font-bold text-[#131314] dark:text-white tracking-tight">
              {activeTab === 'dashboard' && 'Human-in-the-Loop Compliance Platform'}
              {activeTab === 'analytics' && 'Mistakes Analytics & Brand Rule Friction'}
              {activeTab === 'datasets' && 'Brand Guidelines Governance'}
              {activeTab === 'settings' && 'Workspace & Integration Settings'}
            </h1>
            <p className="text-[12px] text-[#736f6c] dark:text-[#9aa0a6] hidden sm:block">
              {activeTab === 'dashboard' && 'Constructive AI audits with collaborative review, explainable rules, and Canva connectors.'}
              {activeTab === 'analytics' && 'Track most repeated creator mistakes and pinpoint ambiguous brand guidelines.'}
              {activeTab === 'datasets' && 'Manage your organization’s active brand rules, tone libraries, and guidelines.'}
              {activeTab === 'settings' && 'Configure theme preferences, team permissions, and design app connectors.'}
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Role Switcher (Collaboration Human-in-the-loop) */}
            <div className="hidden sm:flex items-center gap-2 bg-[#F4F4F4] dark:bg-[#28282B] border border-[#e5e2dd] dark:border-[#3c4043] px-3 py-1.5 rounded-xl">
              <span className="text-[11px] font-medium text-[#736f6c] dark:text-[#9aa0a6]">Role:</span>
              <select
                value={currentUserRole}
                onChange={(e) => {
                  setCurrentUserRole(e.target.value);
                  addToast(`Switched active review role to: ${e.target.value}`, 'info');
                }}
                className="bg-transparent text-[12px] font-bold text-[#131314] dark:text-white outline-none cursor-pointer"
              >
                <option value="Creator" className="bg-white dark:bg-[#28282B] text-black dark:text-white">Creator (Jane)</option>
                <option value="Brand Manager" className="bg-white dark:bg-[#28282B] text-black dark:text-white">Brand Manager (Alex)</option>
                <option value="Authorized Reviewer" className="bg-white dark:bg-[#28282B] text-black dark:text-white">Authorized Reviewer (Sarah)</option>
              </select>
            </div>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full border border-[#e5e2dd] dark:border-[#3c4043] bg-[#F4F4F4] dark:bg-[#28282B] hover:opacity-80 flex items-center justify-center transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-[#131314] dark:text-white" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#ebf212] border border-black rounded-full" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#28282B] rounded-2xl shadow-xl border border-[#e5e2dd] dark:border-[#3c4043] p-4 z-50 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e5e2dd] dark:border-[#3c4043]">
                    <span className="font-bold text-[13px] text-[#131314] dark:text-white">Activity &amp; Audits</span>
                    <span className="text-[11px] text-[#736f6c] dark:text-[#9aa0a6]">2 updates</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="p-2.5 rounded-xl bg-[#F4F4F4] dark:bg-[#1a1a1c] border border-[#e5e2dd] dark:border-[#3c4043] text-[12px]">
                      <div className="flex items-center gap-1.5 text-black dark:text-[#ebf212] font-semibold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Zero Retention Confirmed</span>
                      </div>
                      <p className="text-[#736f6c] dark:text-[#9aa0a6] text-[11px] mt-1">
                        Recent media audit was processed ephemerally in RAM and wiped post-audit.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── 3. MAIN WORKSPACE CONTENT ────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F4F4F4] dark:bg-[#131314] transition-colors duration-200">
          <div className="max-w-[1440px] mx-auto">

            {/* ═════════════════════════════════════════════════════════════════
                VIEW 1: AUDIT DASHBOARD (Collaborative Review & State Machine)
            ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* ── CARD 1: INPUT & UPLOAD ZONE (5 Columns) ── */}
                <section className="lg:col-span-5 bg-white dark:bg-[#28282B] rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm p-6 flex flex-col gap-5 transition-colors duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e5e2dd] dark:border-[#3c4043]">
                    <div>
                      <h2 className="text-[17px] font-bold text-[#131314] dark:text-white tracking-tight flex items-center gap-2">
                        <Zap className="w-5 h-5 text-black dark:text-[#ebf212] fill-current" />
                        Audit Input Zone
                      </h2>
                      <p className="text-[12px] text-[#736f6c] dark:text-[#9aa0a6] mt-0.5">
                        Brand guidelines + ad creative for categorized scanning.
                      </p>
                    </div>
                    <span className="bg-[#ebf212] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Zero-Retention
                    </span>
                  </div>

                  {/* 1. Active Brand Guidelines */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="brand-rules" className="text-[13px] font-bold text-[#131314] dark:text-white">
                        1. Active Brand Guidelines
                      </label>
                      <div className="flex items-center gap-1">
                        {RULE_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              setBrandRules(preset.text);
                              addToast(`Loaded preset: ${preset.name}`, 'info');
                            }}
                            className="text-[11px] bg-[#F4F4F4] dark:bg-[#1a1a1c] hover:bg-[#ebf212] hover:text-black text-[#47423d] dark:text-[#bdc1c6] px-2 py-0.5 rounded transition-colors border border-[#e5e2dd] dark:border-[#3c4043]"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      id="brand-rules"
                      rows={5}
                      value={brandRules}
                      onChange={(e) => setBrandRules(e.target.value)}
                      placeholder="Type or paste brand rules (Tone, Terminology, Messaging, Accessibility, Visual Consistency)..."
                      className="w-full p-3.5 rounded-xl text-[13px] leading-relaxed text-[#131314] dark:text-[#f0f0f0] bg-[#faf8f5] dark:bg-[#1a1a1c] border border-[#dcd7d0] dark:border-[#3c4043] focus:border-[#ebf212] focus:ring-2 focus:ring-[#ebf212]/30 outline-none transition-all resize-y shadow-inner font-mono"
                    />
                  </div>

                  {/* 2. Three Clean Upload Slots */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[13px] font-bold text-[#131314] dark:text-white">
                      2. Confidential Media &amp; Documents
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Slot 1: Ad Creative */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-[#131314] dark:text-[#e8eaed] flex items-center gap-1">
                          <FileVideo className="w-3.5 h-3.5 text-black dark:text-[#ebf212]" /> Ad Video / Image
                        </span>
                        {!adCreative ? (
                          <div
                            onDragOver={(e) => { e.preventDefault(); setAdDragging(true); }}
                            onDragLeave={() => setAdDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setAdDragging(false); handleAdCreative(e.dataTransfer.files?.[0]); }}
                            onClick={() => adCreativeRef.current?.click()}
                            className="border-2 border-dashed border-[#cfcac1] dark:border-[#3c4043] hover:border-[#ebf212] bg-[#faf8f5] dark:bg-[#1a1a1c] hover:bg-[#ebf212]/10 rounded-xl p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[105px]"
                          >
                            <input ref={adCreativeRef} type="file" accept="image/*,video/*" onChange={(e) => handleAdCreative(e.target.files?.[0])} className="hidden" />
                            <UploadCloud className="w-5 h-5 text-black dark:text-[#ebf212] mb-1" />
                            <p className="text-[11px] font-bold text-[#131314] dark:text-white">Select Media</p>
                            <p className="text-[9px] text-[#736f6c] dark:text-[#9aa0a6]">MP4, MOV, PNG</p>
                          </div>
                        ) : (
                          <div className="border border-[#ebf212]/50 bg-[#ebf212]/10 dark:bg-[#ebf212]/5 rounded-xl p-2 flex flex-col justify-between min-h-[105px]">
                            <div className="flex items-center gap-2">
                              <FileVideo className="w-4 h-4 text-black dark:text-[#ebf212] flex-shrink-0" />
                              <p className="text-[11px] font-bold text-[#131314] dark:text-white truncate">{adCreative.name}</p>
                            </div>
                            <button type="button" onClick={removeAdCreative} className="w-full text-[10px] font-semibold text-red-600 bg-white dark:bg-[#28282B] border border-red-200 dark:border-red-900 rounded py-0.5 mt-2">
                              Remove
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Slot 2: Content Script */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-[#131314] dark:text-[#e8eaed] flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-black dark:text-[#ebf212]" /> Content Script
                        </span>
                        {!contentScript ? (
                          <div
                            onClick={() => contentScriptRef.current?.click()}
                            className="border-2 border-dashed border-[#cfcac1] dark:border-[#3c4043] hover:border-[#ebf212] bg-[#faf8f5] dark:bg-[#1a1a1c] hover:bg-[#ebf212]/10 rounded-xl p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[105px]"
                          >
                            <input ref={contentScriptRef} type="file" accept=".txt,.pdf,.docx,.doc" onChange={(e) => handleContentScript(e.target.files?.[0])} className="hidden" />
                            <UploadCloud className="w-5 h-5 text-black dark:text-[#ebf212] mb-1" />
                            <p className="text-[11px] font-bold text-[#131314] dark:text-white">Upload Script</p>
                            <p className="text-[9px] text-[#736f6c] dark:text-[#9aa0a6]">TXT, DOCX, PDF</p>
                          </div>
                        ) : (
                          <div className="border border-[#ebf212]/50 bg-[#ebf212]/10 dark:bg-[#ebf212]/5 rounded-xl p-2 flex flex-col justify-between min-h-[105px]">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-black dark:text-[#ebf212] flex-shrink-0" />
                              <p className="text-[11px] font-bold text-[#131314] dark:text-white truncate">{contentScript.name}</p>
                            </div>
                            <button type="button" onClick={removeContentScript} className="w-full text-[10px] font-semibold text-red-600 bg-white dark:bg-[#28282B] border border-red-200 dark:border-red-900 rounded py-0.5 mt-2">
                              Remove
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Slot 3: Brand Guidelines */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-[#131314] dark:text-[#e8eaed] flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-black dark:text-[#ebf212]" /> Brand Book PDF
                        </span>
                        {!brandGuidelines ? (
                          <div
                            onClick={() => brandGuidelinesRef.current?.click()}
                            className="border-2 border-dashed border-[#cfcac1] dark:border-[#3c4043] hover:border-[#ebf212] bg-[#faf8f5] dark:bg-[#1a1a1c] hover:bg-[#ebf212]/10 rounded-xl p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[105px]"
                          >
                            <input ref={brandGuidelinesRef} type="file" accept=".pdf,.docx" onChange={(e) => handleBrandGuidelines(e.target.files?.[0])} className="hidden" />
                            <UploadCloud className="w-5 h-5 text-black dark:text-[#ebf212] mb-1" />
                            <p className="text-[11px] font-bold text-[#131314] dark:text-white">Upload Brand Book</p>
                            <p className="text-[9px] text-[#736f6c] dark:text-[#9aa0a6]">PDF, DOCX</p>
                          </div>
                        ) : (
                          <div className="border border-[#ebf212]/50 bg-[#ebf212]/10 dark:bg-[#ebf212]/5 rounded-xl p-2 flex flex-col justify-between min-h-[105px]">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-black dark:text-[#ebf212] flex-shrink-0" />
                              <p className="text-[11px] font-bold text-[#131314] dark:text-white truncate">{brandGuidelines.name}</p>
                            </div>
                            <button type="button" onClick={removeBrandGuidelines} className="w-full text-[10px] font-semibold text-red-600 bg-white dark:bg-[#28282B] border border-red-200 dark:border-red-900 rounded py-0.5 mt-2">
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Data Security Notice */}
                    <div className="flex items-center gap-2 p-2.5 bg-[#faf8f5] dark:bg-[#1a1a1c] rounded-xl border border-[#e5e2dd] dark:border-[#3c4043] text-[11px] text-[#47423d] dark:text-[#bdc1c6]">
                      <Lock className="w-4 h-4 text-black dark:text-[#ebf212] flex-shrink-0" />
                      <span><strong>Data Security:</strong> Files processed strictly in RAM and zero-wiped upon completion.</span>
                    </div>
                  </div>

                  {/* Full-width, solid Yellow 'Run Categorized AI Audit' Button */}
                  <button
                    type="button"
                    onClick={runAiAudit}
                    disabled={isAuditing}
                    className="w-full h-[52px] rounded-xl text-[14px] font-bold flex items-center justify-center gap-2.5 bg-[#ebf212] hover:bg-[#dce30e] text-black shadow-md transition-all disabled:opacity-75 cursor-pointer"
                  >
                    {isAuditing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Running Categorized Scan...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-black" />
                        <span>Run Categorized AI Audit</span>
                      </>
                    )}
                  </button>
                </section>

                {/* ── CARD 2: COLLABORATIVE COMPLIANCE & REVIEW ZONE (7 Columns) ── */}
                <section className="lg:col-span-7 bg-white dark:bg-[#28282B] rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm p-6 lg:p-7 flex flex-col min-h-[640px] transition-colors duration-200">

                  {/* ── STATE 1: LOADING SKELETON & SCANNER (isAuditing === true) ── */}
                  {isAuditing && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 my-auto text-center animate-fade-in">
                      <div className="relative w-20 h-20 mb-5">
                        <div className="absolute inset-0 rounded-full bg-[#ebf212]/40 animate-ping" />
                        <div className="relative w-full h-full rounded-full bg-[#ebf212] flex items-center justify-center shadow-lg">
                          <Wand2 className="w-9 h-9 text-black animate-spin" />
                        </div>
                      </div>

                      <h3 className="text-[19px] font-bold text-[#131314] dark:text-white mb-1">
                        Auditing Media with Gemini 1.5 Flash
                      </h3>
                      <p className="text-[13px] text-[#736f6c] dark:text-[#9aa0a6] max-w-[420px] leading-relaxed mb-6">
                        Evaluating uploaded creative against active brand guidelines across Tone, Terminology, Messaging, Visual Consistency, Accessibility, and Unsupported Claims...
                      </p>

                      {/* Real-time Audit Progress Tracker */}
                      <div className="w-full max-w-md bg-[#faf8f5] dark:bg-[#1a1a1c] p-4 rounded-xl border border-[#e5e2dd] dark:border-[#3c4043] flex flex-col gap-2.5 mb-6 text-left text-[12px]">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          <span>Volatile memory buffer initialized (Zero-Retention Ephemeral)</span>
                        </div>
                        <div className="flex items-center gap-2 text-black dark:text-[#ebf212] font-semibold">
                          <div className="w-4 h-4 border-2 border-black dark:border-[#ebf212] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                          <span>Multimodal media &amp; brand guidelines rule verification in progress...</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#736f6c] dark:text-[#80868b]">
                          <div className="w-4 h-4 rounded-full border border-[#dcd7d0] dark:border-[#3c4043] flex-shrink-0" />
                          <span>Constructing intent-preserving creative corrections for Canva...</span>
                        </div>
                      </div>

                      {/* Skeleton Card Slices */}
                      <div className="w-full max-w-md flex flex-col gap-3">
                        <div className="p-4 rounded-xl border border-[#e5e2dd] dark:border-[#3c4043] bg-[#faf8f5] dark:bg-[#1a1a1c] animate-pulse flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="w-28 h-4 bg-[#e5e2dd] dark:bg-[#3c4043] rounded-full" />
                            <div className="w-16 h-4 bg-[#e5e2dd] dark:bg-[#3c4043] rounded-full" />
                          </div>
                          <div className="w-3/4 h-3 bg-[#e5e2dd] dark:bg-[#3c4043] rounded" />
                          <div className="w-full h-8 bg-[#e5e2dd] dark:bg-[#3c4043] rounded-lg mt-1" />
                        </div>
                        <div className="p-4 rounded-xl border border-[#e5e2dd] dark:border-[#3c4043] bg-[#faf8f5] dark:bg-[#1a1a1c] animate-pulse flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="w-32 h-4 bg-[#e5e2dd] dark:bg-[#3c4043] rounded-full" />
                            <div className="w-14 h-4 bg-[#e5e2dd] dark:bg-[#3c4043] rounded-full" />
                          </div>
                          <div className="w-2/3 h-3 bg-[#e5e2dd] dark:bg-[#3c4043] rounded" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── STATE 2: EMPTY PLACEHOLDER (!auditReport && !isAuditing) ── */}
                  {!auditReport && !isAuditing && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 my-auto text-center animate-fade-in">
                      <div className="w-16 h-16 rounded-2xl bg-[#ebf212]/20 dark:bg-[#ebf212]/15 text-black dark:text-[#ebf212] border border-[#ebf212]/40 flex items-center justify-center mb-4 shadow-sm">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <h3 className="text-[19px] font-bold text-[#131314] dark:text-white">Ready for Categorized AI Audit</h3>
                      <p className="text-[13px] text-[#736f6c] dark:text-[#9aa0a6] max-w-[440px] mt-2 leading-relaxed">
                        Upload your <strong>Ad Creative</strong>, <strong>Content Script</strong>, or <strong>Brand Guidelines</strong> in the slots on the left and click <strong>"Run Categorized AI Audit"</strong> to evaluate compliance in real time.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-6 w-full max-w-lg text-left">
                        {[
                          'Tone & Sarcasm',
                          'Terminology',
                          'Messaging Intent',
                          'Visual Consistency',
                          'Accessibility (WCAG)',
                          'Unsupported Claims'
                        ].map((cat) => (
                          <div key={cat} className="p-2.5 rounded-xl border border-[#e5e2dd] dark:border-[#3c4043] bg-[#faf8f5] dark:bg-[#1a1a1c] flex items-center gap-2 text-[12px] font-bold text-[#131314] dark:text-white">
                            <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-[#ebf212] flex-shrink-0" />
                            <span className="truncate">{cat}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setAuditReport(SAMPLE_CATEGORIZED_REPORT);
                          addToast('Loaded demonstration report.', 'info');
                        }}
                        className="mt-6 text-[12px] font-bold text-black dark:text-[#ebf212] hover:underline"
                      >
                        Or click here to preview sample demonstration report →
                      </button>
                    </div>
                  )}

                  {/* ── STATE 3: DYNAMIC REAL RESULTS (auditReport && !isAuditing) ── */}
                  {auditReport && !isAuditing && (
                    <div className="flex flex-col gap-4 animate-fade-in">
                      {/* Review Header + State Machine Workflow */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e5e2dd] dark:border-[#3c4043]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-bold text-[#736f6c] dark:text-[#9aa0a6] font-mono uppercase tracking-wider">Asset Review</span>
                            <span className="text-[12px] text-[#cfcac1] dark:text-[#3c4043]">/</span>
                            <span className="text-[13px] font-bold text-[#131314] dark:text-white truncate max-w-[220px]">
                              {auditReport.asset_name}
                            </span>
                          </div>
                          <h2 className="text-[18px] font-bold text-[#131314] dark:text-white mt-0.5">
                            Actionable Compliance Feedback
                          </h2>
                        </div>

                        {/* Human-in-the-Loop State Machine Pill & Actions */}
                        <div className="flex items-center gap-1.5 bg-[#faf8f5] dark:bg-[#1a1a1c] p-1.5 rounded-xl border border-[#e5e2dd] dark:border-[#3c4043]">
                          <span className="text-[11px] font-medium text-[#736f6c] dark:text-[#9aa0a6] pl-1.5">State:</span>
                          <div className="flex items-center gap-1">
                            {['Draft', 'In Review', 'Needs Revision', 'Approved'].map((status) => {
                              const isCurrent = auditReport.review_status === status;
                              return (
                                <button
                                  key={status}
                                  onClick={() => updateAssetReviewStatus(status)}
                                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                                    isCurrent
                                      ? status === 'Approved'
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : status === 'Needs Revision'
                                        ? 'bg-amber-600 text-white shadow-sm'
                                        : 'bg-[#ebf212] text-black shadow-sm'
                                      : 'text-[#736f6c] dark:text-[#9aa0a6] hover:bg-white dark:hover:bg-[#28282B] hover:text-[#131314] dark:hover:text-white'
                                  }`}
                                >
                                  {status}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Summary & Positive Highlights */}
                      <div className="p-4 rounded-xl bg-[#faf8f5] dark:bg-[#1a1a1c] border border-[#e5e2dd] dark:border-[#3c4043] flex flex-col gap-2.5">
                        <p className="text-[13px] text-[#131314] dark:text-[#e8eaed] leading-relaxed">
                          {auditReport.summary}
                        </p>
                        {auditReport.brand_strengths?.length > 0 && (
                          <div className="pt-2 border-t border-[#e5e2dd] dark:border-[#3c4043] flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                              Brand Strengths:
                            </span>
                            {auditReport.brand_strengths.map((str, i) => (
                              <span key={i} className="text-[11px] text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {str}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Category Filter Pills with Dynamic Real Counts */}
                      <div className="flex items-center justify-between gap-2 pb-1 overflow-x-auto">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-[#736f6c] dark:text-[#9aa0a6] flex items-center gap-1 mr-1">
                            <Filter className="w-3 h-3" /> Categories:
                          </span>
                          {categoryList.map((cat) => {
                            const isSelected = selectedCategoryFilter === cat;
                            const count = cat === 'All'
                              ? auditReport.findings?.length || 0
                              : auditReport.findings?.filter(f => f.category === cat).length || 0;
                            return (
                              <button
                                key={cat}
                                onClick={() => setSelectedCategoryFilter(cat)}
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition border ${
                                  isSelected
                                    ? 'bg-[#ebf212] text-black border-[#ebf212] shadow-sm'
                                    : 'bg-white dark:bg-[#1a1a1c] text-[#736f6c] dark:text-[#9aa0a6] border-[#e5e2dd] dark:border-[#3c4043] hover:border-[#ebf212]'
                                }`}
                              >
                                {cat} ({count})
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => setShowRawJson(!showRawJson)}
                          className="text-[11px] font-bold text-[#736f6c] dark:text-[#9aa0a6] hover:text-[#131314] dark:hover:text-white flex items-center gap-1 px-2.5 py-1 rounded border border-[#e5e2dd] dark:border-[#3c4043] bg-white dark:bg-[#1a1a1c] whitespace-nowrap"
                        >
                          <Code className="w-3 h-3" /> {showRawJson ? 'Hide JSON' : 'JSON'}
                        </button>
                      </div>

                      {/* Raw JSON inspection */}
                      {showRawJson && (
                        <div className="p-3 rounded-xl bg-[#131314] text-[#ebf212] font-mono text-[11px] overflow-x-auto max-h-[220px] border border-[#3c4043]">
                          <pre>{JSON.stringify(auditReport, null, 2)}</pre>
                        </div>
                      )}

                      {/* Findings List (Categorized, Explainable, Constructive) */}
                      <div className="flex-1 flex flex-col gap-4 mt-2">
                        {filteredFindings.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
                            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                              <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-[16px] font-bold text-[#131314] dark:text-white">No Flagged Issues in Category</h3>
                            <p className="text-[13px] text-[#736f6c] dark:text-[#9aa0a6] max-w-[340px] mt-1">
                              {selectedCategoryFilter === 'All'
                                ? 'The creative is fully aligned with all active brand guidelines.'
                                : `No issues detected under the "${selectedCategoryFilter}" category.`}
                            </p>
                          </div>
                        ) : (
                          filteredFindings.map((finding) => {
                            const isAccepted = finding.status === 'Accepted';
                            const isOverridden = finding.status === 'Overridden';
                            return (
                              <div
                                key={finding.id}
                                className={`rounded-2xl border p-5 flex flex-col gap-3.5 transition-all ${
                                  isOverridden
                                    ? 'bg-[#faf8f5]/70 dark:bg-[#1a1a1c]/70 border-[#dcd7d0] dark:border-[#3c4043] opacity-80'
                                    : isAccepted
                                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                                    : 'bg-white dark:bg-[#1a1a1c] border-[#e5e2dd] dark:border-[#3c4043] shadow-sm hover:border-[#ebf212]'
                                }`}
                              >
                                {/* Card Top: Category + Severity + Human Status */}
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-[#ebf212]/20 dark:bg-[#ebf212]/15 text-black dark:text-[#ebf212] border border-[#ebf212]/40 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                      {finding.category}
                                    </span>
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                        finding.severity === 'High'
                                          ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-800'
                                          : finding.severity === 'Medium'
                                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                      }`}
                                    >
                                      {finding.severity} Severity
                                    </span>
                                  </div>

                                  {/* Human Flag Status Badge */}
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                        isOverridden
                                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
                                          : isAccepted
                                          ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                                          : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                                      }`}
                                    >
                                      {finding.status}
                                    </span>
                                  </div>
                                </div>

                                {/* Explainability: Exact Rule Reference */}
                                <div className="text-[12px] font-mono text-[#736f6c] dark:text-[#9aa0a6] bg-[#faf8f5] dark:bg-[#28282B] p-2.5 rounded-lg border border-[#e5e2dd] dark:border-[#3c4043]">
                                  <span className="font-bold text-[#131314] dark:text-white">Rule Referenced:</span> {finding.rule_reference}
                                </div>

                                {/* Flagged Item */}
                                <div className="flex flex-col gap-1 text-[13px]">
                                  <span className="text-[11px] font-bold uppercase text-red-700 dark:text-red-400 tracking-wider">
                                    Flagged In Creative:
                                  </span>
                                  <div className="p-2.5 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-950 dark:text-red-200 font-medium italic">
                                    {finding.flagged_content}
                                  </div>
                                </div>

                                {/* Constructive Explanation */}
                                <div className="flex flex-col gap-1 text-[13px]">
                                  <span className="text-[11px] font-bold uppercase text-[#47423d] dark:text-[#bdc1c6] tracking-wider">
                                    Why This Violates Guidelines:
                                  </span>
                                  <p className="text-[#131314] dark:text-[#e8eaed] leading-relaxed">
                                    {finding.issue_explanation}
                                  </p>
                                </div>

                                {/* Suggested Correction with Canva Connector & Copy */}
                                <div className="mt-1 p-3.5 rounded-xl bg-[#ebf212]/15 dark:bg-[#ebf212]/10 border border-[#ebf212]/40 flex flex-col gap-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase text-black dark:text-[#ebf212] tracking-wider flex items-center gap-1.5">
                                      <Sparkles className="w-3.5 h-3.5 text-black dark:text-[#ebf212]" /> Suggested Correction (Intent Preserved):
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => copyToClipboard(finding.suggested_correction, 'Correction')}
                                        className="text-[11px] font-bold text-black bg-white hover:bg-[#ebf212] px-2.5 py-1 rounded-md border border-[#e5e2dd] transition flex items-center gap-1 shadow-sm"
                                      >
                                        <Copy className="w-3 h-3" /> Copy Fix
                                      </button>
                                      <button
                                        onClick={() => setCanvaModalData(finding)}
                                        className="text-[11px] font-bold text-white bg-[#00C4CC] hover:bg-[#00A3A8] px-2.5 py-1 rounded-md transition flex items-center gap-1 shadow-sm"
                                      >
                                        <Share2 className="w-3 h-3" /> Apply in Canva
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-[13px] font-bold text-[#131314] dark:text-white">
                                    "{finding.suggested_correction}"
                                  </p>
                                  {finding.intent_preserved && (
                                    <p className="text-[11px] text-[#5f6368] dark:text-[#bdc1c6] italic">
                                      💡 <strong>Original Voice Protected:</strong> {finding.intent_preserved}
                                    </p>
                                  )}
                                </div>

                                {/* Human-in-the-Loop Actions: Accept / Override / Discuss */}
                                <div className="pt-2 border-t border-[#e5e2dd] dark:border-[#3c4043] flex flex-wrap items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateFlagStatus(finding.id, 'Accepted')}
                                      className={`text-[12px] font-bold px-3 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                                        isAccepted
                                          ? 'bg-emerald-600 text-white border-emerald-600'
                                          : 'bg-white dark:bg-[#28282B] hover:bg-emerald-50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                      }`}
                                    >
                                      <Check className="w-3.5 h-3.5" /> Accept Fix
                                    </button>

                                    <button
                                      onClick={() => handleOpenOverrideModal(finding)}
                                      className={`text-[12px] font-bold px-3 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                                        isOverridden
                                          ? 'bg-black text-white border-black'
                                          : 'bg-white dark:bg-[#28282B] hover:bg-gray-100 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
                                      }`}
                                    >
                                      <EyeOff className="w-3.5 h-3.5" /> Override AI
                                    </button>
                                  </div>

                                  <span className="text-[11px] text-[#736f6c] dark:text-[#9aa0a6] flex items-center gap-1">
                                    <MessageSquare className="w-3.5 h-3.5" /> {finding.comments?.length || 0} team notes
                                  </span>
                                </div>

                                {/* Threaded Discussion for this Flag */}
                                <div className="mt-2 bg-[#faf8f5] dark:bg-[#28282B] p-3 rounded-xl flex flex-col gap-2">
                                  {finding.comments?.length > 0 && (
                                    <div className="flex flex-col gap-1.5 mb-1">
                                      {finding.comments.map((c) => (
                                        <div key={c.id} className="text-[12px] bg-white dark:bg-[#1a1a1c] p-2.5 rounded-lg border border-[#e5e2dd] dark:border-[#3c4043]">
                                          <div className="flex items-center justify-between mb-0.5">
                                            <span className="font-bold text-[#131314] dark:text-white text-[11px]">
                                              {c.author} <span className="font-normal text-[#736f6c] dark:text-[#9aa0a6]">({c.role})</span>
                                            </span>
                                            <span className="text-[10px] text-[#736f6c] dark:text-[#80868b]">{c.timestamp}</span>
                                          </div>
                                          <p className="text-[#47423d] dark:text-[#bdc1c6]">{c.text}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Comment input */}
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={activeCommentInputs[finding.id] || ''}
                                      onChange={(e) => setActiveCommentInputs({ ...activeCommentInputs, [finding.id]: e.target.value })}
                                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(finding.id); }}
                                      placeholder={`Add reviewer note as ${currentUserRole}...`}
                                      className="flex-1 bg-white dark:bg-[#1a1a1c] border border-[#dcd7d0] dark:border-[#3c4043] rounded-lg px-3 py-1.5 text-[12px] text-[#131314] dark:text-white outline-none focus:border-[#ebf212]"
                                    />
                                    <button
                                      onClick={() => handleAddComment(finding.id)}
                                      className="h-[32px] px-3.5 rounded-lg bg-black hover:bg-[#ebf212] hover:text-black text-white dark:bg-[#ebf212] dark:text-black text-[11px] font-bold transition"
                                    >
                                      Post
                                    </button>
                                  </div>
                                </div>

                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}

                </section>

              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════
                VIEW 2: MISTAKES ANALYTICS & GUIDELINE FRICTION (/dashboard/analytics)
            ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'analytics' && (
              <div className="flex flex-col gap-6 animate-fade-in-up">

                {/* Top KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-[#28282B] p-5 rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#736f6c] dark:text-[#9aa0a6] uppercase tracking-wider">Total Audited Flags</span>
                      <h3 className="text-[28px] font-bold text-[#131314] dark:text-white mt-1">130</h3>
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3.5 h-3.5" /> 84% Resolved before release
                    </span>
                  </div>

                  <div className="bg-white dark:bg-[#28282B] p-5 rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#736f6c] dark:text-[#9aa0a6] uppercase tracking-wider">Top Mistake Category</span>
                      <h3 className="text-[22px] font-bold text-[#131314] dark:text-white mt-1">Unsupported Claims</h3>
                    </div>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-2">
                      29.2% of all creator violations
                    </span>
                  </div>

                  <div className="bg-white dark:bg-[#28282B] p-5 rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#736f6c] dark:text-[#9aa0a6] uppercase tracking-wider">Human Override Rate</span>
                      <h3 className="text-[28px] font-bold text-[#131314] dark:text-white mt-1">14.6%</h3>
                    </div>
                    <span className="text-[11px] text-black dark:text-[#ebf212] font-bold mt-2">
                      Managers authorized 19 creative exceptions
                    </span>
                  </div>

                  <div className="bg-white dark:bg-[#28282B] p-5 rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#736f6c] dark:text-[#9aa0a6] uppercase tracking-wider">Review Velocity</span>
                      <h3 className="text-[28px] font-bold text-[#131314] dark:text-white mt-1">1.8h</h3>
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-2">
                      Avg turnaround: Draft → Approved
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                  {/* Section 1: Most Repeated Mistakes (6 Columns) */}
                  <div className="lg:col-span-6 bg-white dark:bg-[#28282B] p-6 lg:p-7 rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm flex flex-col gap-5">
                    <div className="flex items-center justify-between pb-3 border-b border-[#e5e2dd] dark:border-[#3c4043]">
                      <div>
                        <h3 className="text-[17px] font-bold text-[#131314] dark:text-white flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-black dark:text-[#ebf212]" />
                          Most Repeated Creator Mistakes
                        </h3>
                        <p className="text-[12px] text-[#736f6c] dark:text-[#9aa0a6] mt-0.5">
                          Aggregated frequency of AI-detected violations over the last 30 days.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {[
                        { category: 'Unsupported Claims', count: 38, pct: 29, color: 'bg-red-500' },
                        { category: 'Tone & Sarcasm', count: 29, pct: 22, color: 'bg-[#ebf212]' },
                        { category: 'Visual Consistency', count: 22, pct: 17, color: 'bg-amber-500' },
                        { category: 'Outdated Terminology', count: 18, pct: 14, color: 'bg-purple-500' },
                        { category: 'Accessibility / Contrast', count: 14, pct: 11, color: 'bg-blue-500' },
                        { category: 'Messaging Intent', count: 9, pct: 7, color: 'bg-emerald-500' },
                      ].map((item) => (
                        <div key={item.category} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[13px]">
                            <span className="font-bold text-[#131314] dark:text-white">{item.category}</span>
                            <span className="font-mono text-[#736f6c] dark:text-[#9aa0a6] text-[12px]">{item.count} flags ({item.pct}%)</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#F4F4F4] dark:bg-[#1a1a1c] overflow-hidden">
                            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct * 2.8}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 p-3.5 rounded-xl bg-[#faf8f5] dark:bg-[#1a1a1c] border border-[#e5e2dd] dark:border-[#3c4043] text-[12px] text-[#47423d] dark:text-[#bdc1c6]">
                      💡 <strong>Action Item:</strong> Providing creators with a pre-approved numerical benchmark sheet will eliminate up to 29% of review friction.
                    </div>
                  </div>

                  {/* Section 2: Frequently Violated Guidelines / Ambiguity Index (6 Columns) */}
                  <div className="lg:col-span-6 bg-white dark:bg-[#28282B] p-6 lg:p-7 rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm flex flex-col gap-5">
                    <div className="flex items-center justify-between pb-3 border-b border-[#e5e2dd] dark:border-[#3c4043]">
                      <div>
                        <h3 className="text-[17px] font-bold text-[#131314] dark:text-white flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                          Brand Guideline Friction Index
                        </h3>
                        <p className="text-[12px] text-[#736f6c] dark:text-[#9aa0a6] mt-0.5">
                          Guidelines with high violation rates often indicate ambiguous wording.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {HISTORICAL_FLAGS_DATA.map((item) => (
                        <div key={item.id} className="p-3.5 rounded-xl border border-[#e5e2dd] dark:border-[#3c4043] bg-[#faf8f5] dark:bg-[#1a1a1c] flex flex-col gap-1.5 hover:border-[#ebf212] transition">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[13px] text-[#131314] dark:text-white">{item.rule}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                item.ambiguityScore === 'High Friction'
                                  ? 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300'
                                  : item.ambiguityScore === 'Medium Friction'
                                  ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                                  : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                              }`}
                            >
                              {item.ambiguityScore}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#736f6c] dark:text-[#9aa0a6]">{item.note}</p>
                          <div className="flex items-center justify-between text-[11px] text-[#736f6c] dark:text-[#80868b] pt-1 border-t border-[#e5e2dd] dark:border-[#3c4043]">
                            <span>Violated {item.count} times this month</span>
                            <span className="text-black dark:text-[#ebf212] font-bold cursor-pointer hover:underline" onClick={() => switchTab('datasets')}>
                              Refine wording in Guidelines →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════
                VIEW 3: BRAND GUIDELINES DATASETS (/dashboard/datasets)
            ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'datasets' && (
              <section className="bg-white dark:bg-[#28282B] rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm p-6 lg:p-8 flex flex-col gap-6 animate-fade-in-up transition-colors duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e5e2dd] dark:border-[#3c4043]">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#131314] dark:text-white tracking-tight flex items-center gap-2">
                      <Database className="w-5 h-5 text-black dark:text-[#ebf212]" />
                      Brand Datasets &amp; Guidelines
                    </h2>
                    <p className="text-[13px] text-[#736f6c] dark:text-[#9aa0a6] mt-0.5">
                      Uploaded rulebooks, regional compliance guides, and tone libraries referenced by the AI auditor.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUploadDatasetModal(true)}
                    className="h-[42px] px-5 rounded-xl text-[13px] font-bold flex items-center gap-2 bg-[#ebf212] hover:bg-[#dce30e] text-black shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" />
                    Upload New Brand Dataset
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#e5e2dd] dark:border-[#3c4043]">
                  <table className="w-full text-left text-[13px] border-collapse">
                    <thead className="bg-[#faf8f5] dark:bg-[#1a1a1c] text-[#47423d] dark:text-[#bdc1c6] border-b border-[#e5e2dd] dark:border-[#3c4043]">
                      <tr>
                        <th className="py-3.5 px-4 font-bold">Dataset Name</th>
                        <th className="py-3.5 px-4 font-bold">File Type</th>
                        <th className="py-3.5 px-4 font-bold">Rules Count</th>
                        <th className="py-3.5 px-4 font-bold">Uploaded Date</th>
                        <th className="py-3.5 px-4 font-bold">Status</th>
                        <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e2dd] dark:divide-[#3c4043]">
                      {datasets.map((dataset) => (
                        <tr key={dataset.id} className="hover:bg-[#faf8f5] dark:hover:bg-[#1a1a1c] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-[#ebf212]/20 dark:bg-[#ebf212]/15 text-black dark:text-[#ebf212] flex items-center justify-center font-bold text-[11px]">
                                {dataset.fileType}
                              </div>
                              <div>
                                <p className="font-bold text-[#131314] dark:text-white hover:text-[#ebf212] cursor-pointer" onClick={() => setViewingDataset(dataset)}>
                                  {dataset.name}
                                </p>
                                <span className="text-[11px] text-[#736f6c] dark:text-[#9aa0a6] font-mono">{dataset.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[12px]">{dataset.fileType}</td>
                          <td className="py-3.5 px-4">{dataset.rulesCount} rules</td>
                          <td className="py-3.5 px-4 text-[#736f6c] dark:text-[#9aa0a6]">{dataset.uploadedDate}</td>
                          <td className="py-3.5 px-4">
                            <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                              {dataset.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setViewingDataset(dataset)} className="text-[12px] font-bold text-black dark:text-[#ebf212] hover:underline px-2 py-1">
                                View
                              </button>
                              <button
                                onClick={() => {
                                  setDatasets(prev => prev.filter(d => d.id !== dataset.id));
                                  addToast(`Deleted dataset ${dataset.id}`, 'info');
                                }}
                                className="text-[12px] font-bold text-red-600 dark:text-red-400 hover:underline px-2 py-1"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ═════════════════════════════════════════════════════════════════
                VIEW 4: SETTINGS (/dashboard/settings) WITH THEME SWITCHER
            ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'settings' && (
              <section className="bg-white dark:bg-[#28282B] rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm p-6 lg:p-8 flex flex-col gap-6 animate-fade-in-up transition-colors duration-200">
                <div className="pb-4 border-b border-[#e5e2dd] dark:border-[#3c4043]">
                  <h2 className="text-[20px] font-bold text-[#131314] dark:text-white tracking-tight flex items-center gap-2">
                    <Settings className="w-5 h-5 text-black dark:text-[#ebf212]" />
                    Workspace &amp; Integration Settings
                  </h2>
                  <p className="text-[13px] text-[#736f6c] dark:text-[#9aa0a6] mt-0.5">
                    Configure your light/dark theme preference, Canva connector keys, and zero-retention compliance policies.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* 1. Global Theming Switcher (#F4F4F4 vs #131314) */}
                  <div className="p-5 rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] bg-[#faf8f5] dark:bg-[#1a1a1c] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-black dark:text-[#ebf212]" />
                        <h3 className="font-bold text-[15px] text-[#131314] dark:text-white">Appearance &amp; Theming</h3>
                      </div>
                      <span className="text-[11px] font-mono uppercase bg-[#ebf212] text-black font-extrabold px-2 py-0.5 rounded-full">
                        {theme === 'dark' ? 'Gemini Dark' : 'Light Mode'}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#736f6c] dark:text-[#9aa0a6] leading-relaxed">
                      Choose between our bright Light Mode (#F4F4F4 canvas with white cards) and Gemini Charcoal Dark Mode (#131314 with #28282B surfaces).
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-1">
                      {/* Light Mode Selector Card */}
                      <button
                        type="button"
                        onClick={() => {
                          setTheme('light');
                          addToast('Switched to Light Mode (#F4F4F4)', 'info');
                        }}
                        className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                          theme === 'light'
                            ? 'bg-white border-[#ebf212] ring-2 ring-[#ebf212] shadow-md'
                            : 'bg-white/60 dark:bg-black/20 border-[#e5e2dd] dark:border-[#3c4043] opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-black flex items-center gap-1.5">
                            <Sun className="w-4 h-4 text-amber-500" /> Light Mode
                          </span>
                          {theme === 'light' && <Check className="w-4 h-4 text-black" />}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-4 h-4 rounded-full bg-[#F4F4F4] border border-gray-300" title="#F4F4F4" />
                          <span className="w-4 h-4 rounded-full bg-white border border-gray-300" title="#FFFFFF" />
                          <span className="w-4 h-4 rounded-full bg-[#ebf212]" title="#ebf212" />
                        </div>
                        <p className="text-[10px] text-[#736f6c]">Clean #F4F4F4 canvas with white cards</p>
                      </button>

                      {/* Gemini Dark Mode Selector Card */}
                      <button
                        type="button"
                        onClick={() => {
                          setTheme('dark');
                          addToast('Switched to Gemini Dark Mode (#131314)', 'info');
                        }}
                        className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                          theme === 'dark'
                            ? 'bg-[#131314] text-white border-[#ebf212] ring-2 ring-[#ebf212] shadow-md'
                            : 'bg-[#131314]/80 text-white border-[#3c4043] opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-white flex items-center gap-1.5">
                            <Moon className="w-4 h-4 text-[#ebf212]" /> Gemini Dark
                          </span>
                          {theme === 'dark' && <Check className="w-4 h-4 text-[#ebf212]" />}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-4 h-4 rounded-full bg-[#131314] border border-gray-700" title="#131314" />
                          <span className="w-4 h-4 rounded-full bg-[#28282B] border border-gray-600" title="#28282B" />
                          <span className="w-4 h-4 rounded-full bg-[#ebf212]" title="#ebf212" />
                        </div>
                        <p className="text-[10px] text-[#9aa0a6]">Gemini #131314 charcoal with #28282B cards</p>
                      </button>
                    </div>
                  </div>

                  {/* 2. Canva & Design App Connector Settings */}
                  <div className="p-5 rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] bg-[#faf8f5] dark:bg-[#1a1a1c] flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-[#00C4CC]" />
                      <h3 className="font-bold text-[15px] text-[#131314] dark:text-white">Design App Connectors</h3>
                    </div>
                    <p className="text-[12px] text-[#736f6c] dark:text-[#9aa0a6] leading-relaxed">
                      Connect Canva and Figma so creators can push AI-suggested corrections directly into their design canvas with 1 click.
                    </p>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-[#28282B] rounded-xl border border-[#e5e2dd] dark:border-[#3c4043]">
                      <span className="text-[13px] font-bold text-[#131314] dark:text-white">Canva Plugin Sync</span>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">Connected</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-[#28282B] rounded-xl border border-[#e5e2dd] dark:border-[#3c4043]">
                      <span className="text-[13px] font-bold text-[#131314] dark:text-white">Figma REST API</span>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">Connected</span>
                    </div>
                  </div>

                  {/* 3. Data Security Guarantee */}
                  <div className="p-5 rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] bg-[#faf8f5] dark:bg-[#1a1a1c] flex flex-col gap-3 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-black dark:text-[#ebf212]" />
                      <h3 className="font-bold text-[15px] text-[#131314] dark:text-white">Data Security &amp; Zero-Retention Guarantee</h3>
                    </div>
                    <p className="text-[12px] text-[#736f6c] dark:text-[#9aa0a6] leading-relaxed">
                      All uploaded scripts, brand guidelines, and unreleased ad videos are strictly processed in volatile memory. Files are zero-overwritten immediately following audit completion.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-[#28282B] rounded-xl border border-[#e5e2dd] dark:border-[#3c4043]">
                        <span className="text-[13px] font-bold text-[#131314] dark:text-white">Model Training Opt-Out</span>
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">Enforced</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-[#28282B] rounded-xl border border-[#e5e2dd] dark:border-[#3c4043]">
                        <span className="text-[13px] font-bold text-[#131314] dark:text-white">Memory Shredding (RAM Wipe)</span>
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">Active</span>
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            )}

          </div>
        </main>
      </div>

      {/* ── MODAL: APPLY IN CANVA CONNECTOR ─────────────────────────────────── */}
      {canvaModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-white dark:bg-[#28282B] w-full max-w-lg rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-2xl p-6 flex flex-col gap-4 text-[#131314] dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e2dd] dark:border-[#3c4043]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#00C4CC] text-white flex items-center justify-center font-bold text-[14px]">
                  C
                </div>
                <div>
                  <h3 className="font-bold text-[16px]">Canva Connector</h3>
                  <p className="text-[11px] text-[#736f6c] dark:text-[#9aa0a6]">Apply constructive AI feedback to your design canvas</p>
                </div>
              </div>
              <button onClick={() => setCanvaModalData(null)} className="text-[#736f6c] hover:text-black dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase text-[#736f6c] dark:text-[#9aa0a6] tracking-wider">Suggested Correction Ready to Apply:</span>
              <div className="p-3 bg-[#faf8f5] dark:bg-[#1a1a1c] rounded-xl border border-[#e5e2dd] dark:border-[#3c4043] font-bold text-[13px] text-black dark:text-[#ebf212]">
                "{canvaModalData.suggested_correction}"
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-[12px] text-amber-950 dark:text-amber-200 flex flex-col gap-1">
              <strong>Canva Integration Bridge:</strong>
              <span>Because Accurrate is an explainable auditor, you can copy this fix directly or click below to launch Canva with the pre-populated replacement text.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  copyToClipboard(canvaModalData.suggested_correction, 'Canva fix');
                  setCanvaModalData(null);
                }}
                className="px-4 py-2 rounded-xl text-[13px] font-bold bg-white dark:bg-[#1a1a1c] border border-[#dcd7d0] dark:border-[#3c4043] hover:bg-gray-50 text-[#131314] dark:text-white"
              >
                Copy Only
              </button>
              <button
                onClick={() => {
                  copyToClipboard(canvaModalData.suggested_correction, 'Canva fix');
                  window.open('https://www.canva.com', '_blank');
                  setCanvaModalData(null);
                }}
                className="px-4 py-2 rounded-xl text-[13px] font-bold bg-[#00C4CC] hover:bg-[#00A3A8] text-white shadow-sm flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" /> Open Canva Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: OVERRIDE AI WITH EXPLAINABILITY ──────────────────────────── */}
      {overrideModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-white dark:bg-[#28282B] w-full max-w-md rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-2xl p-6 flex flex-col gap-4 text-[#131314] dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e2dd] dark:border-[#3c4043]">
              <div className="flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h3 className="font-bold text-[16px]">Human-in-the-Loop Override</h3>
              </div>
              <button onClick={() => setOverrideModalData(null)} className="text-[#736f6c] hover:text-black dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[13px] text-[#736f6c] dark:text-[#9aa0a6] leading-relaxed">
              As an authorized reviewer, you can override this AI compliance flag. Please document your business justification for the audit trail:
            </p>

            <textarea
              rows={3}
              value={overrideReasonInput}
              onChange={(e) => setOverrideReasonInput(e.target.value)}
              placeholder="E.g., Intentional creative exception authorized by CMO for Q4 campaign..."
              className="w-full p-3 rounded-xl border border-[#dcd7d0] dark:border-[#3c4043] bg-white dark:bg-[#1a1a1c] text-[13px] outline-none focus:border-[#ebf212]"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setOverrideModalData(null)} className="px-3.5 py-2 rounded-xl text-[12px] font-bold text-[#736f6c] dark:text-[#9aa0a6]">
                Cancel
              </button>
              <button onClick={confirmOverride} className="px-4 py-2 rounded-xl text-[12px] font-bold bg-[#ebf212] hover:bg-[#dce30e] text-black">
                Authorize Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: VIEW DATASET ─────────────────────────────────────────────── */}
      {viewingDataset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-white dark:bg-[#28282B] w-full max-w-lg rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-2xl p-6 flex flex-col gap-4 text-[#131314] dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e2dd] dark:border-[#3c4043]">
              <h3 className="font-bold text-[16px]">{viewingDataset.name}</h3>
              <button onClick={() => setViewingDataset(null)} className="text-[#736f6c] hover:text-black dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <pre className="p-4 bg-[#faf8f5] dark:bg-[#1a1a1c] rounded-xl border border-[#e5e2dd] dark:border-[#3c4043] font-mono text-[12px] whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {viewingDataset.content}
            </pre>
            <div className="flex justify-end">
              <button onClick={() => setViewingDataset(null)} className="px-4 py-2 bg-black hover:bg-[#ebf212] hover:text-black text-white dark:bg-[#ebf212] dark:text-black text-[12px] rounded-xl font-bold transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: UPLOAD DATASET ───────────────────────────────────────────── */}
      {showUploadDatasetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-white dark:bg-[#28282B] w-full max-w-md rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-2xl p-6 flex flex-col gap-4 text-[#131314] dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e2dd] dark:border-[#3c4043]">
              <h3 className="font-bold text-[16px]">Upload Brand Dataset</h3>
              <button onClick={() => setShowUploadDatasetModal(false)} className="text-[#736f6c] hover:text-black dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-bold">Dataset Title</label>
                <input
                  type="text"
                  value={newDatasetForm.name}
                  onChange={(e) => setNewDatasetForm({ ...newDatasetForm, name: e.target.value })}
                  placeholder="E.g., North America Q4 Tone Standards"
                  className="w-full mt-1 p-2.5 rounded-xl border border-[#dcd7d0] dark:border-[#3c4043] bg-white dark:bg-[#1a1a1c] text-[13px] outline-none focus:border-[#ebf212]"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold">File Type</label>
                <select
                  value={newDatasetForm.fileType}
                  onChange={(e) => setNewDatasetForm({ ...newDatasetForm, fileType: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-[#dcd7d0] dark:border-[#3c4043] bg-white dark:bg-[#1a1a1c] text-[13px] outline-none"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="DOCX">Word (.docx)</option>
                  <option value="TXT">Plain Text (.txt)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowUploadDatasetModal(false)} className="px-3.5 py-2 text-[12px] font-bold text-[#736f6c] dark:text-[#9aa0a6]">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newDatasetForm.name.trim()) return;
                  setDatasets(prev => [
                    ...prev,
                    {
                      id: `DS-${Math.floor(100 + Math.random() * 900)}`,
                      name: newDatasetForm.name,
                      fileType: newDatasetForm.fileType,
                      size: '480 KB',
                      rulesCount: 12,
                      uploadedDate: 'Just now',
                      status: 'Active',
                      content: 'Custom uploaded guidelines content.'
                    }
                  ]);
                  setShowUploadDatasetModal(false);
                  setNewDatasetForm({ name: '', fileType: 'PDF', content: '' });
                  addToast('New brand dataset added successfully!', 'success');
                }}
                className="px-4 py-2 bg-[#ebf212] hover:bg-[#dce30e] text-black text-[12px] rounded-xl font-bold"
              >
                Save Dataset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST NOTIFICATIONS ────────────────────────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-xl text-[13px] font-bold flex items-center gap-2.5 animate-slide-up ${
              t.type === 'success'
                ? 'bg-black text-[#ebf212] border border-[#ebf212]'
                : t.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-black text-white border border-white/20'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#ebf212]" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-white" />}
            {t.type === 'info' && <Zap className="w-4 h-4 text-[#ebf212] fill-[#ebf212]" />}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
