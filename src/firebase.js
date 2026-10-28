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
import { getFirestore } from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────────────────────
// Firebase Config
// ─────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCKA00Q1gnYN6EvNYrCNJDUAL4zFZir_LE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "accurrate-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "accurrate-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "accurrate-ai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "873938502600",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:873938502600:web:e1ba27dfe4149ef1aaf6fd",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JGL3EERS0V",
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
let db = null;
let googleProvider = null;
let microsoftProvider = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
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
  db,
  googleProvider,
  microsoftProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
};
