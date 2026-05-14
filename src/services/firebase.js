import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../data/constants.js';

let app, auth, db;

try {
  app  = initializeApp(FIREBASE_CONFIG);
  auth = getAuth(app);
  db   = getFirestore(app);
} catch(e) {
  console.warn('Firebase 초기화 실패:', e.message);
}

export function onAuthChange(cb) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, cb);
}

export function signInWithGoogle() {
  if (!auth) return Promise.reject(new Error('Firebase 미초기화'));
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOutUser() {
  if (!auth) return Promise.resolve();
  return signOut(auth);
}

export async function saveToFirestore(uid, data) {
  if (!db) throw new Error('Firestore 미초기화');
  await setDoc(doc(db, 'saves', uid), { ...data, savedAt: serverTimestamp() });
}

export async function loadFromFirestore(uid) {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'saves', uid));
  return snap.exists() ? snap.data() : null;
}
