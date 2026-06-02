// src/utils/firebaseAuth.js
// Firebase Authentication utility functions

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, firebaseReady } from '../firebase/config.js'

/**
 * Register new user with Firebase
 * @param {string} name - Full name
 * @param {string} email - Email address
 * @param {string} password - Password (min 6 chars)
 */
export async function firebaseRegister({ name, email, password }) {
  if (!firebaseReady) throw new Error('Firebase not configured')

  const res = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(res.user, { displayName: name })

  // Save user data to Firestore
  await setDoc(doc(db, 'users', res.user.uid), {
    uid:       res.user.uid,
    name,
    email,
    role:      email === 'admin@medibook.com' ? 'admin' : 'user',
    createdAt: Date.now(),
  })

  return res.user
}

/**
 * Login existing user
 */
export async function firebaseLogin({ email, password }) {
  if (!firebaseReady) throw new Error('Firebase not configured')
  const res = await signInWithEmailAndPassword(auth, email, password)
  return res.user
}

/**
 * Get user role from Firestore
 */
export async function getUserRole(uid) {
  if (!firebaseReady) return 'user'
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? (snap.data().role || 'user') : 'user'
  } catch {
    return 'user'
  }
}

/**
 * Logout
 */
export async function firebaseLogout() {
  if (!firebaseReady) return
  await signOut(auth)
}

/**
 * Reset password
 */
export async function firebaseResetPassword(email) {
  if (!firebaseReady) throw new Error('Firebase not configured')
  await sendPasswordResetEmail(auth, email)
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback) {
  if (!firebaseReady) return () => {}
  return onAuthStateChanged(auth, callback)
}
