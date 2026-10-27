import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  microsoftProvider,
  isFirebaseConfigured,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from '../firebase.js';
import { ShieldCheck, Sparkles, X, Key, ExternalLink, CheckCircle } from 'lucide-react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('accurrate_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [configModal, setConfigModal] = useState({ open: false, provider: null });
  const [successToast, setSuccessToast] = useState(null);

  // Sync with real Firebase Auth if configured
  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const userData = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          photoURL: fbUser.photoURL,
          provider: fbUser.providerData?.[0]?.providerId || 'firebase',
        };
        setUser(userData);
        localStorage.setItem('accurrate_user', JSON.stringify(userData));
      } else {
        // If logged out from Firebase and not a demo user
        if (user && user.provider !== 'demo') {
          setUser(null);
          localStorage.removeItem('accurrate_user');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const triggerToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // ── Google Sign In ────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && auth && googleProvider) {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const userData = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || 'Google User',
          photoURL: fbUser.photoURL,
          provider: 'google.com',
        };
        setUser(userData);
        localStorage.setItem('accurrate_user', JSON.stringify(userData));
        triggerToast(`Welcome, ${userData.displayName}!`);
        return userData;
      } else {
        // Keys not yet added to .env — show setup assistant modal
        setConfigModal({ open: true, provider: 'Google' });
        return null;
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      // If user closed the popup, don't throw scary alert
      if (err.code !== 'auth/popup-closed-by-user') {
        alert(err.message || 'Google sign-in failed. Please try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Microsoft Sign In ─────────────────────────────────────────────────────
  const loginWithMicrosoft = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && auth && microsoftProvider) {
        const result = await signInWithPopup(auth, microsoftProvider);
        const fbUser = result.user;
        const userData = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || 'Microsoft User',
          photoURL: fbUser.photoURL,
          provider: 'microsoft.com',
        };
        setUser(userData);
        localStorage.setItem('accurrate_user', JSON.stringify(userData));
        triggerToast(`Welcome, ${userData.displayName}!`);
        return userData;
      } else {
        // Keys not yet added to .env — show setup assistant modal
        setConfigModal({ open: true, provider: 'Microsoft' });
        return null;
      }
    } catch (err) {
      console.error('Microsoft sign-in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        alert(err.message || 'Microsoft sign-in failed. Please try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Demo / Simulation Login (so user can test flow immediately) ────────────
  const loginWithDemo = (providerName = 'Google') => {
    const isGoogle = providerName === 'Google';
    const demoUser = {
      uid: 'demo_' + Date.now(),
      email: isGoogle ? 'alex.morgan@gmail.com' : 'alex.morgan@outlook.com',
      displayName: 'Alex Morgan',
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=Alex`,
      provider: 'demo',
      providerLabel: providerName,
    };
    setUser(demoUser);
    localStorage.setItem('accurrate_user', JSON.stringify(demoUser));
    setConfigModal({ open: false, provider: null });
    triggerToast(`Signed in successfully with ${providerName}!`);
    return demoUser;
  };

  // ── Email / Password Sign In ──────────────────────────────────────────────
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && auth) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = result.user;
        const userData = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0],
          provider: 'password',
        };
        setUser(userData);
        localStorage.setItem('accurrate_user', JSON.stringify(userData));
        triggerToast(`Welcome back, ${userData.displayName}!`);
        return userData;
      } else {
        // Demo email login
        const demoUser = {
          uid: 'demo_email_' + Date.now(),
          email,
          displayName: email.split('@')[0],
          provider: 'demo',
        };
        setUser(demoUser);
        localStorage.setItem('accurrate_user', JSON.stringify(demoUser));
        triggerToast(`Welcome back, ${demoUser.displayName}!`);
        return demoUser;
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Email / Password Sign Up ──────────────────────────────────────────────
  const signupWithEmail = async (name, email, password) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && auth) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(result.user, { displayName: name });
        }
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: name || email.split('@')[0],
          provider: 'password',
        };
        setUser(userData);
        localStorage.setItem('accurrate_user', JSON.stringify(userData));
        triggerToast(`Account created! Welcome, ${userData.displayName}.`);
        return userData;
      } else {
        // Demo email signup
        const demoUser = {
          uid: 'demo_signup_' + Date.now(),
          email,
          displayName: name || email.split('@')[0],
          provider: 'demo',
        };
        setUser(demoUser);
        localStorage.setItem('accurrate_user', JSON.stringify(demoUser));
        triggerToast(`Account created! Welcome, ${demoUser.displayName}.`);
        return demoUser;
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      if (isFirebaseConfigured() && auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn('SignOut error:', e);
    }
    setUser(null);
    localStorage.removeItem('accurrate_user');
    triggerToast('You have been logged out.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isFirebaseConfigured(),
        loginWithGoogle,
        loginWithMicrosoft,
        loginWithDemo,
        loginWithEmail,
        signupWithEmail,
        logout,
        openConfigModal: (provider) => setConfigModal({ open: true, provider }),
      }}
    >
      {children}

      {/* ── Toast Feedback ── */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#252521] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#3e3d39] animate-fade-in text-[14px]">
          <CheckCircle className="w-5 h-5 text-[#ebf212]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ── Firebase Configuration Helper Modal ── */}
      {configModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-[520px] w-full p-8 shadow-2xl border border-[#edebe8] relative">
            <button
              onClick={() => setConfigModal({ open: false, provider: null })}
              className="absolute top-5 right-5 text-[#736f6c] hover:text-black p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-[#ebf212]/20 flex items-center justify-center mb-5 text-black">
              <Key className="w-6 h-6 text-[#252521]" />
            </div>

            <h3 className="text-[22px] font-semibold text-[#252521] mb-2">
              Connect {configModal.provider || 'OAuth'} Sign-In
            </h3>
            <p className="text-[14px] text-[#736f6c] leading-relaxed mb-6">
              The OAuth buttons and Firebase SDK are fully wired! To run live with your actual Google / Microsoft accounts, paste your Firebase project keys into <code className="bg-[#f7f5f2] px-2 py-0.5 rounded text-[13px] text-black">.env</code>.
            </p>

            <div className="bg-[#f7f5f2] rounded-xl p-4 border border-[#edebe8] mb-6 flex flex-col gap-2 text-[13px]">
              <div className="flex items-center gap-2 font-medium text-[#252521]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Setup Guide Ready
              </div>
              <p className="text-[#736f6c]">
                Open <span className="font-mono text-black font-semibold">FIREBASE_SETUP.md</span> in this project for step-by-step instructions to create free credentials in 5 minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => loginWithDemo(configModal.provider || 'Google')}
                className="btn btn-lime flex-1 h-[48px] text-[14px] font-medium flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Test with Demo {configModal.provider || 'User'}
              </button>
              <button
                type="button"
                onClick={() => setConfigModal({ open: false, provider: null })}
                className="btn btn-variant-1 h-[48px] px-6 text-[14px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
