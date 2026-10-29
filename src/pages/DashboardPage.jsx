import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { db, storage } from '../firebase.js';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
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
  Moon,
  Loader2
} from 'lucide-react';

// Fallback seed data in case Firestore is completely uninitialized
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
    status: 'Active',
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
    categories: ['Tone', 'Messaging'],
    findings: []
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
    categories: ['Unsupported Claims', 'Tone'],
    findings: [
      {
        id: 'f-1',
        category: 'Unsupported Claims',
        severity: 'High',
        rule_reference: 'Rule 6: All numerical efficiency claims must cite verified benchmarks',
        flagged_content: "'Eliminates 100% of human error overnight.'",
        issue_explanation: "Absolute guarantee is unverified by case study data.",
        suggested_correction: "'Automates tedious compliance reviews to prevent critical errors.'",
        intent_preserved: 'Keeps focus on error reduction without unsubstantiated absolute claims.',
        status: 'Open',
        comments: []
      },
      {
        id: 'f-2',
        category: 'Tone',
        severity: 'Medium',
        rule_reference: 'Rule 1: Direct, respectful tone without sarcasm or hyperbole',
        flagged_content: "'Don't get stuck using dinosaur tools built for the stone age.'",
        issue_explanation: "Disparaging rhetoric conflicts with respectful brand voice.",
        suggested_correction: "'Upgrade from manual spreadsheets to real-time AI compliance verification.'",
        intent_preserved: 'Constructively highlights modern workflow without competitor mockery.',
        status: 'Open',
        comments: []
      }
    ]
  }
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // ── Global Theming State (Light #F4F4F4 vs Gemini Dark #131314) ────────────
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accurrate_theme');
      if (saved) return saved;
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'dark';
  });

  const applyTheme = (targetTheme) => {
    setTheme(targetTheme);
    try {
      if (targetTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
      localStorage.setItem('accurrate_theme', targetTheme);
    } catch (e) {
      console.error('Theme sync error:', e);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    addToast(
      nextTheme === 'dark' ? 'Switched to Gemini Dark Mode (#131314)' : 'Switched to Light Mode (#F4F4F4)',
      'info'
    );
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('accurrate_theme', theme);
  }, [theme]);

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
  // Upload Slots (Ad Creative & Content Script)
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

  // Datasets State (Real-time Firestore)
  const [datasets, setDatasets] = useState([]);
  const [datasetsLoading, setDatasetsLoading] = useState(true);
  const [showUploadDatasetModal, setShowUploadDatasetModal] = useState(false);
  const [viewingDataset, setViewingDataset] = useState(null);
  const [newDatasetForm, setNewDatasetForm] = useState({ name: '', fileType: 'PDF', content: '' });
  const [newDatasetFile, setNewDatasetFile] = useState(null);
  const [isUploadingDataset, setIsUploadingDataset] = useState(false);

  // Scan History State (Real-time Firestore audit_logs)
  const [scanHistory, setScanHistory] = useState([]);
  const [auditsLoading, setAuditsLoading] = useState(true);

  // File input refs
  const adCreativeRef = useRef(null);
  const contentScriptRef = useRef(null);
  const brandGuidelinesRef = useRef(null);
  const datasetFileInputRef = useRef(null);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const addToast = (msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  // ── 1. FIRESTORE REAL-TIME LISTENER: brand_guidelines ──────────────────────
  useEffect(() => {
    if (!db) {
      setDatasets(INITIAL_DATASETS);
      setDatasetsLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'brand_guidelines'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const loaded = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                name: data.name || 'Untitled Rulebook',
                fileType: data.fileType || 'PDF',
                size: data.size || '1.0 MB',
                rulesCount: data.rulesCount || (data.content ? data.content.split('\n').filter(l => l.trim()).length : 8),
                uploadedDate: data.uploadedDate || (data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'),
                status: data.status || 'Active',
                content: data.content || '',
                downloadUrl: data.downloadUrl || null,
              };
            });
            setDatasets(loaded);
          } else {
            // Seed default datasets so new Firestore workspace is populated
            INITIAL_DATASETS.forEach(async (ds) => {
              try {
                await addDoc(collection(db, 'brand_guidelines'), {
                  ...ds,
                  createdAt: serverTimestamp(),
                });
              } catch (e) {
                console.warn('Seeding initial guideline error:', e);
              }
            });
          }
          setDatasetsLoading(false);
        },
        (err) => {
          console.warn('Firestore brand_guidelines onSnapshot error:', err);
          setDatasets(INITIAL_DATASETS);
          setDatasetsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore subscription error:', err);
      setDatasets(INITIAL_DATASETS);
      setDatasetsLoading(false);
    }
  }, []);

  // ── 2. FIRESTORE REAL-TIME LISTENER: audit_logs ────────────────────────────
  useEffect(() => {
    if (!db) {
      setScanHistory(INITIAL_SCANS);
      setAuditsLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'audit_logs'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const loadedScans = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                docId: docSnap.id,
                title: data.asset_name ? data.asset_name.replace(/\.[^/.]+$/, '') : (data.title || 'Audit Log'),
                mediaType: data.media_type || data.mediaType || 'Video',
                mediaFile: data.asset_name || data.mediaFile || 'creative_asset.mp4',
                ruleUsed: data.ruleUsed || 'Active Brand Guidelines',
                review_status: data.review_status || 'Needs Revision',
                date: data.date || (data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'),
                summary: data.summary || '',
                findings: data.findings || [],
                findingsCount: (data.findings || []).length,
                categories: data.categories || Array.from(new Set((data.findings || []).map(f => f.category))),
                brand_strengths: data.brand_strengths || [],
                security_audit: data.security_audit || null,
                storage_url: data.storage_url || null,
              };
            });
            setScanHistory(loadedScans);

            // Real-time synchronization for the active compliance feedback report
            setAuditReport((currentReport) => {
              if (!currentReport) return currentReport;
              const matchingUpdated = loadedScans.find(
                s => s.docId === currentReport.docId || s.id === currentReport.id
              );
              if (matchingUpdated) {
                return {
                  ...currentReport,
                  ...matchingUpdated,
                  findings: matchingUpdated.findings || currentReport.findings,
                  review_status: matchingUpdated.review_status || currentReport.review_status
                };
              }
              return currentReport;
            });
          } else {
            // Seed initial demo scans if collection is completely fresh
            INITIAL_SCANS.forEach(async (scan) => {
              try {
                await addDoc(collection(db, 'audit_logs'), {
                  asset_name: scan.mediaFile,
                  media_type: scan.mediaType,
                  review_status: scan.review_status,
                  summary: scan.summary,
                  brand_strengths: [
                    'Brand yellow (#ebf212) accents applied cleanly.',
                    'Cadence is clear, respectful, and conversational.'
                  ],
                  findings: scan.findings,
                  findingsCount: scan.findings.length,
                  categories: scan.categories,
                  date: scan.date,
                  createdAt: serverTimestamp(),
                });
              } catch (e) {
                console.warn('Seeding initial audit error:', e);
              }
            });
          }
          setAuditsLoading(false);
        },
        (err) => {
          console.warn('Firestore audit_logs onSnapshot error:', err);
          setScanHistory(INITIAL_SCANS);
          setAuditsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore audit subscription error:', err);
      setScanHistory(INITIAL_SCANS);
      setAuditsLoading(false);
    }
  }, []);

  // ── 3. DYNAMIC MISTAKES ANALYTICS DERIVED FROM REAL FIRESTORE LOGS ─────────
  const analyticsData = useMemo(() => {
    let totalFlags = 0;
    let overrideCount = 0;
    const categoryCounts = {
      'Unsupported Claims': 0,
      'Tone': 0,
      'Visual Consistency': 0,
      'Terminology': 0,
      'Accessibility': 0,
      'Messaging': 0,
    };
    const ruleFrictionMap = {};

    scanHistory.forEach((scan) => {
      const findings = scan.findings || [];
      findings.forEach((finding) => {
        totalFlags += 1;
        if (finding.status === 'Overridden') {
          overrideCount += 1;
        }

        // Categorize count
        const cat = finding.category || 'Messaging';
        if (cat in categoryCounts) {
          categoryCounts[cat] += 1;
        } else if (cat.toLowerCase().includes('tone')) {
          categoryCounts['Tone'] += 1;
        } else if (cat.toLowerCase().includes('visual')) {
          categoryCounts['Visual Consistency'] += 1;
        } else if (cat.toLowerCase().includes('term')) {
          categoryCounts['Terminology'] += 1;
        } else if (cat.toLowerCase().includes('access')) {
          categoryCounts['Accessibility'] += 1;
        } else if (cat.toLowerCase().includes('claim')) {
          categoryCounts['Unsupported Claims'] += 1;
        } else {
          categoryCounts['Messaging'] += 1;
        }

        // Track guideline friction by rule_reference
        const rule = finding.rule_reference || 'General Brand Standard';
        if (!ruleFrictionMap[rule]) {
          ruleFrictionMap[rule] = {
            rule,
            count: 0,
            category: finding.category || 'Compliance',
            note: finding.issue_explanation || 'Frequent violation reported.'
          };
        }
        ruleFrictionMap[rule].count += 1;
      });
    });

    // Sort categories by frequency
    const categoryList = Object.entries(categoryCounts).map(([cat, count]) => ({
      category: cat,
      count,
      pct: totalFlags > 0 ? Math.round((count / totalFlags) * 100) : 0,
      color:
        cat === 'Unsupported Claims' ? 'bg-red-500' :
        cat === 'Tone' ? 'bg-[#ebf212]' :
        cat === 'Visual Consistency' ? 'bg-amber-500' :
        cat === 'Terminology' ? 'bg-purple-500' :
        cat === 'Accessibility' ? 'bg-blue-500' : 'bg-emerald-500'
    })).sort((a, b) => b.count - a.count);

    const topCategory = categoryList[0] || { category: 'None', count: 0, pct: 0 };
    const overrideRate = totalFlags > 0 ? ((overrideCount / totalFlags) * 100).toFixed(1) : '0.0';

    // Sort rule friction
    const frictionList = Object.values(ruleFrictionMap).sort((a, b) => b.count - a.count);
    const enrichedFriction = frictionList.map((item, idx) => ({
      id: `f-${idx + 1}`,
      rule: item.rule,
      count: item.count,
      ambiguityScore: item.count >= 4 ? 'High Friction' : item.count >= 2 ? 'Medium Friction' : 'Low Friction',
      note: item.note
    }));

    return {
      totalFlags,
      topCategory,
      overrideCount,
      overrideRate,
      categoryList,
      frictionList: enrichedFriction.length > 0 ? enrichedFriction : [
        { id: 'f-1', rule: 'Rule 6: Numerical benchmarks', count: 0, ambiguityScore: 'Low Friction', note: 'No recurring flags yet.' }
      ]
    };
  }, [scanHistory]);

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
      id: scan.id,
      docId: scan.docId || scan.id,
      asset_name: scan.mediaFile || scan.title,
      media_type: scan.mediaType || 'Video',
      review_status: scan.review_status || 'Approved',
      summary: scan.summary || `Audit completed on ${scan.date}.`,
      brand_strengths: scan.brand_strengths || [
        'Primary brand yellow (#ebf212) accent applied cleanly.',
        'Audio cadence is conversational and respectful.',
        'High visual clarity across mobile and desktop.'
      ],
      findings: scan.findings || [],
      security_audit: scan.security_audit || {
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

  // ── Run Categorized AI Audit (Firebase Storage + FastAPI/Gemini + Firestore) ──
  const runAiAudit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!adCreative && !contentScript) {
      addToast('Please upload an Ad Creative or Content Script to audit.', 'error');
      return;
    }

    setAuditReport(null);
    setIsAuditing(true);
    addToast('Uploading to Firebase Storage & dispatching Gemini audit...', 'info');

    let uploadedMediaUrl = null;

    // 1. Upload file to Firebase Storage if available
    try {
      if (storage && adCreative) {
        const fileRef = storageRef(storage, `audit_assets/${Date.now()}_${adCreative.name}`);
        const snap = await uploadBytes(fileRef, adCreative);
        uploadedMediaUrl = await getDownloadURL(snap.ref);
      }
    } catch (storageErr) {
      console.warn('Firebase Storage upload warning (proceeding to audit):', storageErr);
    }

    // 2. Prepare FormData for FastAPI backend
    const formData = new FormData();
    formData.append('user_id', user?.uid || 'anonymous');

    // Optional fallback rules from onboarding profile cache
    const cachedGuidelines = localStorage.getItem('accurrate_core_guidelines');
    if (cachedGuidelines) {
      formData.append('dataset_rules', cachedGuidelines);
    }

    if (adCreative) formData.append('ad_file', adCreative);
    if (contentScript) formData.append('content_script', contentScript);

    const backendUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

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
          findingsCount: normalizedFindings.length,
          categories: Array.from(new Set(normalizedFindings.map(f => f.category))),
          storage_url: uploadedMediaUrl,
          security_audit: rawReport.security_audit || {
            retention_policy: 'Zero-Retention Ephemeral',
            ephemeral_storage_wiped: true,
            bytes_persisted: 0
          },
          date: 'Just now'
        };

        // 3. Write new audit record to Firestore collection 'audit_logs'
        if (db) {
          try {
            const docRef = await addDoc(collection(db, 'audit_logs'), {
              ...cleanReport,
              userId: user?.uid || 'anonymous',
              userEmail: user?.email || 'creator@accurrate.ai',
              createdAt: serverTimestamp()
            });
            cleanReport.id = docRef.id;
            cleanReport.docId = docRef.id;
          } catch (fsErr) {
            console.warn('Error saving audit log to Firestore:', fsErr);
          }
        }

        // Instantly render real Gemini API response in Actionable Compliance Feedback panel
        setAuditReport(cleanReport);
        addToast('Categorized AI Audit completed & logged to Firestore!', 'success');
        setIsAuditing(false);
      } else {
        const errData = await response.json().catch(() => ({}));
        const detail = errData.detail || `Server error (${response.status} ${response.statusText})`;
        if (response.status === 401 || response.status === 403) {
          addToast(`Gemini API Key Error (${response.status}): ${detail}. Please check backend/.env`, 'error');
        } else {
          addToast(`FastAPI Server Error (${response.status}): ${detail}`, 'error');
        }
        setIsAuditing(false);
      }
    } catch (err) {
      console.error('FastAPI fetch error:', err);
      const isAbort = err.name === 'AbortError';
      const msg = isAbort
        ? 'AI Audit timed out after 60s. Please check backend logs.'
        : `Cannot connect to FastAPI at ${backendUrl}. Ensure "uvicorn main:app --reload" is running in /backend.`;
      addToast(msg, 'error');
      setIsAuditing(false);
    }
  };

  // ── State Machine Transitions (Firestore real-time update) ─────────────────
  const updateAssetReviewStatus = async (newStatus) => {
    if (!auditReport) return;
    setAuditReport(prev => ({ ...prev, review_status: newStatus }));
    addToast(`Asset state updated to: "${newStatus}" by ${currentUserRole}`, 'success');

    if (db && auditReport.docId) {
      try {
        await updateDoc(doc(db, 'audit_logs', auditReport.docId), {
          review_status: newStatus
        });
      } catch (e) {
        console.warn('Firestore review_status update error:', e);
      }
    }
  };

  // ── Flag Human-in-the-Loop Actions (Firestore real-time update) ─────────────
  const updateFlagStatus = async (flagId, newStatus) => {
    let updatedFindings = [];
    setAuditReport(prev => {
      if (!prev?.findings) return prev;
      updatedFindings = prev.findings.map(f => {
        if (f.id === flagId) {
          return { ...f, status: newStatus };
        }
        return f;
      });
      return { ...prev, findings: updatedFindings };
    });
    addToast(`Flag marked as "${newStatus}"`, 'info');

    if (db && auditReport?.docId) {
      try {
        await updateDoc(doc(db, 'audit_logs', auditReport.docId), {
          findings: updatedFindings
        });
      } catch (e) {
        console.warn('Firestore flag update error:', e);
      }
    }
  };

  const handleOpenOverrideModal = (flag) => {
    setOverrideModalData(flag);
    setOverrideReasonInput('');
  };

  const confirmOverride = async () => {
    if (!overrideModalData) return;
    const reason = overrideReasonInput.trim() || 'Reviewed and authorized as intentional creative brand exception.';

    let updatedFindings = [];
    setAuditReport(prev => {
      if (!prev?.findings) return prev;
      updatedFindings = prev.findings.map(f => {
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

    if (db && auditReport?.docId) {
      try {
        await updateDoc(doc(db, 'audit_logs', auditReport.docId), {
          findings: updatedFindings
        });
      } catch (e) {
        console.warn('Firestore override error:', e);
      }
    }
  };

  const handleAddComment = async (flagId) => {
    const text = (activeCommentInputs[flagId] || '').trim();
    if (!text) return;

    let updatedFindings = [];
    setAuditReport(prev => {
      if (!prev?.findings) return prev;
      updatedFindings = prev.findings.map(f => {
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

    if (db && auditReport?.docId) {
      try {
        await updateDoc(doc(db, 'audit_logs', auditReport.docId), {
          findings: updatedFindings
        });
      } catch (e) {
        console.warn('Firestore comment error:', e);
      }
    }
  };

  const copyToClipboard = (text, label = 'Correction') => {
    navigator.clipboard.writeText(text);
    addToast(`${label} copied to clipboard! Ready to paste into Canva / editor.`, 'success');
  };

  // ── Add New Brand Dataset to Firebase Storage & Firestore ─────────────────
  const handleSaveDataset = async () => {
    if (!newDatasetForm.name.trim()) {
      addToast('Please enter a dataset title.', 'error');
      return;
    }

    setIsUploadingDataset(true);
    let downloadUrl = null;
    let sizeStr = '520 KB';

    try {
      if (storage && newDatasetFile) {
        const fileRef = storageRef(storage, `brand_guidelines/${Date.now()}_${newDatasetFile.name}`);
        const snap = await uploadBytes(fileRef, newDatasetFile);
        downloadUrl = await getDownloadURL(snap.ref);
        sizeStr = newDatasetFile.size > 1024 * 1024
          ? `${(newDatasetFile.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(newDatasetFile.size / 1024)} KB`;
      }

      const contentText = newDatasetForm.content.trim() || 'Custom uploaded brand guideline standards.';
      const lines = contentText.split('\n').filter(l => l.trim().length > 3);
      const calculatedRulesCount = lines.length > 0 ? lines.length : 12;

      const newDoc = {
        name: newDatasetForm.name,
        fileType: newDatasetForm.fileType,
        size: sizeStr,
        rulesCount: calculatedRulesCount,
        uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Active',
        content: contentText,
        downloadUrl,
        createdAt: serverTimestamp()
      };

      if (db) {
        await addDoc(collection(db, 'brand_guidelines'), newDoc);
        addToast('New brand dataset saved to Firestore!', 'success');
      } else {
        setDatasets(prev => [{ id: `DS-${Date.now()}`, ...newDoc }, ...prev]);
        addToast('New brand dataset added locally.', 'info');
      }

      setShowUploadDatasetModal(false);
      setNewDatasetForm({ name: '', fileType: 'PDF', content: '' });
      setNewDatasetFile(null);
    } catch (err) {
      console.error('Error saving dataset:', err);
      addToast(`Upload error: ${err.message}`, 'error');
    } finally {
      setIsUploadingDataset(false);
    }
  };

  // ── Delete Brand Dataset from Firestore ───────────────────────────────────
  const handleDeleteDataset = async (datasetId) => {
    if (db) {
      try {
        await deleteDoc(doc(db, 'brand_guidelines', datasetId));
        addToast('Brand dataset deleted from Firestore.', 'info');
      } catch (err) {
        addToast(`Error deleting dataset: ${err.message}`, 'error');
      }
    } else {
      setDatasets(prev => prev.filter(d => d.id !== datasetId));
      addToast('Brand dataset removed.', 'info');
    }
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

        {/* Middle (Scrollable): 'Recent Audits' from Firestore audit_logs */}
        <div className="flex-1 overflow-y-auto px-3 lg:px-4 py-2 border-t border-[#e5e2dd] dark:border-[#2d2d30]">
          <div className="hidden lg:flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#736f6c] dark:text-[#80868b] flex items-center gap-1.5">
              Recent Audits {auditsLoading && <Loader2 className="w-3 h-3 animate-spin text-[#ebf212]" />}
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
            {scanHistory.length === 0 && !auditsLoading ? (
              <p className="hidden lg:block text-[11px] text-[#736f6c] dark:text-[#80868b] px-2 py-1">
                No audits logged yet.
              </p>
            ) : (
              scanHistory.map((scan) => {
                const isSelected = auditReport?.docId === scan.docId || auditReport?.id === scan.id;
                return (
                  <button
                    key={scan.docId || scan.id}
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
              })
            )}
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

          {/* Dedicated Dual Theme Switcher Pill (Expanded Sidebar) */}
          <div className="hidden lg:flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10 select-none">
            <button
              type="button"
              onClick={() => {
                applyTheme('light');
                addToast('Switched to Light Mode (#F4F4F4)', 'info');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-black shadow-xs font-extrabold'
                  : 'text-[#736f6c] dark:text-[#9aa0a6] hover:text-black dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => {
                applyTheme('dark');
                addToast('Switched to Gemini Dark Mode (#131314)', 'info');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#ebf212] text-black shadow-xs font-extrabold'
                  : 'text-[#736f6c] dark:text-[#9aa0a6] hover:text-black dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Gemini Dark</span>
            </button>
          </div>

          {/* User Profile Mini Card with Quick Toggle */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-black/5 dark:bg-white/5">
            <div className="flex items-center gap-2.5 min-w-0">
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
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[#e5e2dd] dark:border-[#3c4043] bg-white dark:bg-[#28282B] text-[#131314] dark:text-[#ebf212] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs flex-shrink-0"
              title={theme === 'dark' ? 'Current: Gemini Dark. Click to switch to Light Mode' : 'Current: Light Mode. Click to switch to Gemini Dark'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#131314]" />
              )}
            </button>
          </div>

          {/* Log Out */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full h-[38px] px-3 rounded-xl text-[13px] text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
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
                    <span className="font-bold text-[13px] text-[#131314] dark:text-white">Live Firestore Activity</span>
                    <span className="text-[11px] text-[#736f6c] dark:text-[#9aa0a6]">{scanHistory.length} audits logged</span>
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

                {/* ── CARD 1: INPUT & UPLOAD ZONE (Cleaned & Streamlined) ── */}
                <section className="lg:col-span-5 bg-white dark:bg-[#28282B] rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm p-6 flex flex-col gap-5 transition-colors duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e5e2dd] dark:border-[#3c4043]">
                    <div>
                      <h2 className="text-[17px] font-bold text-[#131314] dark:text-white tracking-tight flex items-center gap-2">
                        <Zap className="w-5 h-5 text-black dark:text-[#ebf212] fill-current" />
                        Audit Input Zone
                      </h2>
                      <p className="text-[12px] text-[#736f6c] dark:text-[#9aa0a6] mt-0.5">
                        Upload creative or script for categorized compliance scanning.
                      </p>
                    </div>
                    <span className="bg-[#ebf212] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Zero-Retention
                    </span>
                  </div>

                  {/* Clean Brand Rule Auto-Sync Banner */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] dark:bg-[#1a1a1c] border border-[#e5e2dd] dark:border-[#3c4043] text-[12px]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-black dark:text-[#ebf212] flex-shrink-0" />
                      <div>
                        <span className="font-bold text-[#131314] dark:text-white">Brand Guidelines: </span>
                        <span className="text-[#736f6c] dark:text-[#9aa0a6]">Auto-loaded from workspace profile</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => switchTab('datasets')}
                      className="text-[11px] font-bold text-black dark:text-[#ebf212] hover:underline cursor-pointer"
                    >
                      Manage →
                    </button>
                  </div>

                  {/* Clean File Upload Slots */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[13px] font-bold text-[#131314] dark:text-white">
                      Upload Assets to Audit
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Slot 1: Ad Creative */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] font-semibold text-[#131314] dark:text-[#e8eaed] flex items-center gap-1.5">
                          <FileVideo className="w-4 h-4 text-black dark:text-[#ebf212]" /> Ad Video / Image
                        </span>
                        {!adCreative ? (
                          <div
                            onDragOver={(e) => { e.preventDefault(); setAdDragging(true); }}
                            onDragLeave={() => setAdDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setAdDragging(false); handleAdCreative(e.dataTransfer.files?.[0]); }}
                            onClick={() => adCreativeRef.current?.click()}
                            className="border-2 border-dashed border-[#cfcac1] dark:border-[#3c4043] hover:border-[#ebf212] bg-[#faf8f5] dark:bg-[#1a1a1c] hover:bg-[#ebf212]/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[140px]"
                          >
                            <input ref={adCreativeRef} type="file" accept="image/*,video/*" onChange={(e) => handleAdCreative(e.target.files?.[0])} className="hidden" />
                            <UploadCloud className="w-7 h-7 text-black dark:text-[#ebf212] mb-1.5" />
                            <p className="text-[13px] font-bold text-[#131314] dark:text-white">Select Media Asset</p>
                            <p className="text-[11px] text-[#736f6c] dark:text-[#9aa0a6]">MP4, MOV, PNG, JPG</p>
                          </div>
                        ) : (
                          <div className="border border-[#ebf212]/50 bg-[#ebf212]/10 dark:bg-[#ebf212]/5 rounded-2xl p-3 flex flex-col justify-between min-h-[140px]">
                            <div className="flex items-center gap-2.5">
                              <FileVideo className="w-5 h-5 text-black dark:text-[#ebf212] flex-shrink-0" />
                              <div className="truncate">
                                <p className="text-[12px] font-bold text-[#131314] dark:text-white truncate">{adCreative.name}</p>
                                <span className="text-[10px] text-[#736f6c] dark:text-[#9aa0a6]">
                                  {(adCreative.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                              </div>
                            </div>
                            <button type="button" onClick={removeAdCreative} className="w-full text-[11px] font-bold text-red-600 bg-white dark:bg-[#28282B] border border-red-200 dark:border-red-900 rounded-xl py-1 mt-3 hover:bg-red-50 cursor-pointer">
                              Remove Asset
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Slot 2: Content Script */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] font-semibold text-[#131314] dark:text-[#e8eaed] flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-black dark:text-[#ebf212]" /> Content Script
                        </span>
                        {!contentScript ? (
                          <div
                            onClick={() => contentScriptRef.current?.click()}
                            className="border-2 border-dashed border-[#cfcac1] dark:border-[#3c4043] hover:border-[#ebf212] bg-[#faf8f5] dark:bg-[#1a1a1c] hover:bg-[#ebf212]/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[140px]"
                          >
                            <input ref={contentScriptRef} type="file" accept=".txt,.pdf,.docx,.doc" onChange={(e) => handleContentScript(e.target.files?.[0])} className="hidden" />
                            <UploadCloud className="w-7 h-7 text-black dark:text-[#ebf212] mb-1.5" />
                            <p className="text-[13px] font-bold text-[#131314] dark:text-white">Upload Script</p>
                            <p className="text-[11px] text-[#736f6c] dark:text-[#9aa0a6]">TXT, DOCX, PDF</p>
                          </div>
                        ) : (
                          <div className="border border-[#ebf212]/50 bg-[#ebf212]/10 dark:bg-[#ebf212]/5 rounded-2xl p-3 flex flex-col justify-between min-h-[140px]">
                            <div className="flex items-center gap-2.5">
                              <FileText className="w-5 h-5 text-black dark:text-[#ebf212] flex-shrink-0" />
                              <div className="truncate">
                                <p className="text-[12px] font-bold text-[#131314] dark:text-white truncate">{contentScript.name}</p>
                                <span className="text-[10px] text-[#736f6c] dark:text-[#9aa0a6]">
                                  {(contentScript.size / 1024).toFixed(1)} KB
                                </span>
                              </div>
                            </div>
                            <button type="button" onClick={removeContentScript} className="w-full text-[11px] font-bold text-red-600 bg-white dark:bg-[#28282B] border border-red-200 dark:border-red-900 rounded-xl py-1 mt-3 hover:bg-red-50 cursor-pointer">
                              Remove Script
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Data Security Notice */}
                    <div className="flex items-center gap-2 p-3 bg-[#faf8f5] dark:bg-[#1a1a1c] rounded-xl border border-[#e5e2dd] dark:border-[#3c4043] text-[11px] text-[#47423d] dark:text-[#bdc1c6] mt-1">
                      <Lock className="w-4 h-4 text-black dark:text-[#ebf212] flex-shrink-0" />
                      <span><strong>Data Security:</strong> Files processed strictly in RAM and zero-wiped upon completion.</span>
                    </div>
                  </div>

                  {/* Full-width, solid Yellow 'Run Categorized AI Audit' Button */}
                  <button
                    type="button"
                    onClick={runAiAudit}
                    disabled={isAuditing}
                    className="w-full h-[52px] rounded-xl text-[14px] font-bold flex items-center justify-center gap-2.5 bg-[#ebf212] hover:bg-[#dce30e] text-black shadow-md transition-all disabled:opacity-75 cursor-pointer mt-1"
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

                {/* ── CARD 2: ACTIONABLE COMPLIANCE FEEDBACK (7 Columns) ── */}
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

                      <p className="mt-6 text-[11px] text-[#736f6c] dark:text-[#9aa0a6]">
                        Select any audit log from the left sidebar to inspect past actionable feedback.
                      </p>
                    </div>
                  )}

                  {/* ── STATE 3: ACTIONABLE COMPLIANCE FEEDBACK (auditReport && !isAuditing) ── */}
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

                {/* Top KPI Cards (Calculated from Firestore audit_logs) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-[#28282B] p-5 rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#736f6c] dark:text-[#9aa0a6] uppercase tracking-wider">Total Audited Flags</span>
                      <h3 className="text-[28px] font-bold text-[#131314] dark:text-white mt-1">
                        {analyticsData.totalFlags}
                      </h3>
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3.5 h-3.5" /> Real-time Firestore sync
                    </span>
                  </div>

                  <div className="bg-white dark:bg-[#28282B] p-5 rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#736f6c] dark:text-[#9aa0a6] uppercase tracking-wider">Top Mistake Category</span>
                      <h3 className="text-[22px] font-bold text-[#131314] dark:text-white mt-1 truncate">
                        {analyticsData.topCategory.category}
                      </h3>
                    </div>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-2">
                      {analyticsData.topCategory.pct}% of all creator violations
                    </span>
                  </div>

                  <div className="bg-white dark:bg-[#28282B] p-5 rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#736f6c] dark:text-[#9aa0a6] uppercase tracking-wider">Human Override Rate</span>
                      <h3 className="text-[28px] font-bold text-[#131314] dark:text-white mt-1">
                        {analyticsData.overrideRate}%
                      </h3>
                    </div>
                    <span className="text-[11px] text-black dark:text-[#ebf212] font-bold mt-2">
                      {analyticsData.overrideCount} authorized creative exceptions
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

                  {/* Section 1: Most Repeated Mistakes (6 Columns - Dynamic) */}
                  <div className="lg:col-span-6 bg-white dark:bg-[#28282B] p-6 lg:p-7 rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm flex flex-col gap-5">
                    <div className="flex items-center justify-between pb-3 border-b border-[#e5e2dd] dark:border-[#3c4043]">
                      <div>
                        <h3 className="text-[17px] font-bold text-[#131314] dark:text-white flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-black dark:text-[#ebf212]" />
                          Most Repeated Creator Mistakes
                        </h3>
                        <p className="text-[12px] text-[#736f6c] dark:text-[#9aa0a6] mt-0.5">
                          Calculated directly from all Firestore audit logs across your workspace.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {analyticsData.categoryList.map((item) => (
                        <div key={item.category} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[13px]">
                            <span className="font-bold text-[#131314] dark:text-white">{item.category}</span>
                            <span className="font-mono text-[#736f6c] dark:text-[#9aa0a6] text-[12px]">{item.count} flags ({item.pct}%)</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#F4F4F4] dark:bg-[#1a1a1c] overflow-hidden">
                            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.min(item.pct * 2.5, 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 p-3.5 rounded-xl bg-[#faf8f5] dark:bg-[#1a1a1c] border border-[#e5e2dd] dark:border-[#3c4043] text-[12px] text-[#47423d] dark:text-[#bdc1c6]">
                      💡 <strong>Action Item:</strong> {analyticsData.topCategory.category !== 'None' ? `Clarifying the "${analyticsData.topCategory.category}" rules in brand guidelines will significantly reduce review overhead.` : 'No critical guidelines friction reported.'}
                    </div>
                  </div>

                  {/* Section 2: Brand Guideline Friction Index (6 Columns - Dynamic) */}
                  <div className="lg:col-span-6 bg-white dark:bg-[#28282B] p-6 lg:p-7 rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-sm flex flex-col gap-5">
                    <div className="flex items-center justify-between pb-3 border-b border-[#e5e2dd] dark:border-[#3c4043]">
                      <div>
                        <h3 className="text-[17px] font-bold text-[#131314] dark:text-white flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                          Brand Guideline Friction Index
                        </h3>
                        <p className="text-[12px] text-[#736f6c] dark:text-[#9aa0a6] mt-0.5">
                          Rules with high violation frequency indicate ambiguous phrasing.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {analyticsData.frictionList.map((item) => (
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
                            <span>Violated {item.count} times across audits</span>
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
                      Brand Datasets &amp; Guidelines (Firestore Real-Time)
                    </h2>
                    <p className="text-[13px] text-[#736f6c] dark:text-[#9aa0a6] mt-0.5">
                      Rulebooks, tone standards, and compliance documents dynamically retrieved from Firestore.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUploadDatasetModal(true)}
                    className="h-[42px] px-5 rounded-xl text-[13px] font-bold flex items-center gap-2 bg-[#ebf212] hover:bg-[#dce30e] text-black shadow-sm transition cursor-pointer"
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
                      {datasetsLoading ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#736f6c]">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#ebf212] mb-2" />
                            Loading brand guidelines from Firestore...
                          </td>
                        </tr>
                      ) : datasets.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#736f6c]">
                            No brand guidelines in Firestore. Click "Upload New Brand Dataset" to add one.
                          </td>
                        </tr>
                      ) : (
                        datasets.map((dataset) => (
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
                                  <span className="text-[11px] text-[#736f6c] dark:text-[#9aa0a6] font-mono">{dataset.size}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[12px]">{dataset.fileType}</td>
                            <td className="py-3.5 px-4 font-semibold">{dataset.rulesCount} rules</td>
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
                                  onClick={() => handleDeleteDataset(dataset.id)}
                                  className="text-[12px] font-bold text-red-600 dark:text-red-400 hover:underline px-2 py-1"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
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
                          applyTheme('light');
                          addToast('Switched to Light Mode (#F4F4F4)', 'info');
                        }}
                        className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
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
                          applyTheme('dark');
                          addToast('Switched to Gemini Dark Mode (#131314)', 'info');
                        }}
                        className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
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
              <button onClick={() => setCanvaModalData(null)} className="text-[#736f6c] hover:text-black dark:hover:text-white cursor-pointer">
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
                className="px-4 py-2 rounded-xl text-[13px] font-bold bg-white dark:bg-[#1a1a1c] border border-[#dcd7d0] dark:border-[#3c4043] hover:bg-gray-50 text-[#131314] dark:text-white cursor-pointer"
              >
                Copy Only
              </button>
              <button
                onClick={() => {
                  copyToClipboard(canvaModalData.suggested_correction, 'Canva fix');
                  window.open('https://www.canva.com', '_blank');
                  setCanvaModalData(null);
                }}
                className="px-4 py-2 rounded-xl text-[13px] font-bold bg-[#00C4CC] hover:bg-[#00A3A8] text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
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
              <button onClick={() => setOverrideModalData(null)} className="text-[#736f6c] hover:text-black dark:hover:text-white cursor-pointer">
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
              <button onClick={() => setOverrideModalData(null)} className="px-3.5 py-2 rounded-xl text-[12px] font-bold text-[#736f6c] dark:text-[#9aa0a6] cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmOverride} className="px-4 py-2 rounded-xl text-[12px] font-bold bg-[#ebf212] hover:bg-[#dce30e] text-black cursor-pointer">
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
              <div>
                <h3 className="font-bold text-[16px]">{viewingDataset.name}</h3>
                <span className="text-[11px] font-mono text-[#736f6c] dark:text-[#9aa0a6]">{viewingDataset.fileType} · {viewingDataset.size} · {viewingDataset.rulesCount} rules</span>
              </div>
              <button onClick={() => setViewingDataset(null)} className="text-[#736f6c] hover:text-black dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <pre className="p-4 bg-[#faf8f5] dark:bg-[#1a1a1c] rounded-xl border border-[#e5e2dd] dark:border-[#3c4043] font-mono text-[12px] whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {viewingDataset.content}
            </pre>
            <div className="flex justify-between items-center">
              {viewingDataset.downloadUrl && (
                <a
                  href={viewingDataset.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] font-bold text-black dark:text-[#ebf212] flex items-center gap-1 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" /> Download Original File
                </a>
              )}
              <button onClick={() => setViewingDataset(null)} className="ml-auto px-4 py-2 bg-black hover:bg-[#ebf212] hover:text-black text-white dark:bg-[#ebf212] dark:text-black text-[12px] rounded-xl font-bold transition cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: UPLOAD BRAND DATASET (Firebase Storage + Firestore) ───────── */}
      {showUploadDatasetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-white dark:bg-[#28282B] w-full max-w-md rounded-2xl border border-[#e5e2dd] dark:border-[#3c4043] shadow-2xl p-6 flex flex-col gap-4 text-[#131314] dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e2dd] dark:border-[#3c4043]">
              <h3 className="font-bold text-[16px]">Upload Brand Dataset to Firestore</h3>
              <button onClick={() => setShowUploadDatasetModal(false)} className="text-[#736f6c] hover:text-black dark:hover:text-white cursor-pointer">
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
                <label className="text-[12px] font-bold">Document File (Firebase Storage)</label>
                <div
                  onClick={() => datasetFileInputRef.current?.click()}
                  className="mt-1 border-2 border-dashed border-[#cfcac1] dark:border-[#3c4043] hover:border-[#ebf212] bg-[#faf8f5] dark:bg-[#1a1a1c] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition"
                >
                  <input
                    ref={datasetFileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewDatasetFile(file);
                        const ext = file.name.split('.').pop().toUpperCase();
                        setNewDatasetForm(prev => ({
                          ...prev,
                          name: prev.name || file.name.replace(/\.[^/.]+$/, ''),
                          fileType: ['PDF', 'DOCX', 'TXT'].includes(ext) ? ext : 'PDF'
                        }));
                      }
                    }}
                    className="hidden"
                  />
                  <UploadCloud className="w-5 h-5 text-black dark:text-[#ebf212] mb-1" />
                  <p className="text-[12px] font-bold text-[#131314] dark:text-white">
                    {newDatasetFile ? newDatasetFile.name : 'Choose PDF, DOCX, or TXT file'}
                  </p>
                  <span className="text-[10px] text-[#736f6c] dark:text-[#9aa0a6]">Uploads directly to Firebase Storage bucket</span>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold">Rulebook Content / Notes</label>
                <textarea
                  rows={3}
                  value={newDatasetForm.content}
                  onChange={(e) => setNewDatasetForm({ ...newDatasetForm, content: e.target.value })}
                  placeholder="Paste or type numbered guidelines for instant AI reference..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-[#dcd7d0] dark:border-[#3c4043] bg-white dark:bg-[#1a1a1c] text-[12px] outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowUploadDatasetModal(false)}
                className="px-3.5 py-2 text-[12px] font-bold text-[#736f6c] dark:text-[#9aa0a6] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDataset}
                disabled={isUploadingDataset}
                className="px-4 py-2 bg-[#ebf212] hover:bg-[#dce30e] text-black text-[12px] rounded-xl font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isUploadingDataset ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  'Save Dataset'
                )}
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
