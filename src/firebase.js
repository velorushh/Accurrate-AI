import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';

// ─────────────────────────────────────────────────────────────────────────────
// Firebase Config
// Values can be set in .env (e.g. VITE_FIREBASE_API_KEY=...)
// ─────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = () => {
  const key = firebaseConfig.apiKey;
  return Boolean(
    key &&
    key !== 'PASTE_YOUR_API_KEY' &&
    !key.startsWith('PASTE_') &&
    key.length > 10
  );
};

let app = null;
let auth = null;
let googleProvider = null;
let microsoftProvider = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    microsoftProvider = new OAuthProvider('microsoft.com');

    googleProvider.setCustomParameters({ prompt: 'select_account' });
    microsoftProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (error) {
    console.warn('Firebase initialization error:', error);
  }
}

export {
  app,
  auth,
  googleProvider,
  microsoftProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
};
