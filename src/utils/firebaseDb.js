// src/utils/firebaseDb.js
// Firestore Database utility functions

import {
  collection, addDoc, getDocs, doc, updateDoc,
  deleteDoc, query, where, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore'
import { db, firebaseReady } from '../firebase/config.js'

/* ── DOCTORS ── */
export async function dbAddDoctor(data) {
  if (!firebaseReady) return null
  const ref = await addDoc(collection(db, 'doctors'), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function dbGetDoctors() {
  if (!firebaseReady) return []
  const snap = await getDocs(collection(db, 'doctors'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function dbUpdateDoctor(id, data) {
  if (!firebaseReady) return
  await updateDoc(doc(db, 'doctors', id), data)
}

export async function dbDeleteDoctor(id) {
  if (!firebaseReady) return
  await deleteDoc(doc(db, 'doctors', id))
}

/* ── APPOINTMENTS ── */
export async function dbAddAppointment(data) {
  if (!firebaseReady) return null
  const ref = await addDoc(collection(db, 'appointments'), {
    ...data, status: 'pending', paid: false, createdAt: serverTimestamp()
  })
  return ref.id
}

export async function dbGetAppointments(userId = null) {
  if (!firebaseReady) return []
  let q = userId
    ? query(collection(db, 'appointments'), where('userId', '==', userId))
    : collection(db, 'appointments')
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function dbUpdateAppointment(id, data) {
  if (!firebaseReady) return
  await updateDoc(doc(db, 'appointments', id), data)
}

export async function dbDeleteAppointment(id) {
  if (!firebaseReady) return
  await deleteDoc(doc(db, 'appointments', id))
}

/* ── PAYMENTS ── */
export async function dbAddPayment(data) {
  if (!firebaseReady) return null
  const ref = await addDoc(collection(db, 'payments'), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function dbGetPayments(userId = null) {
  if (!firebaseReady) return []
  let q = userId
    ? query(collection(db, 'payments'), where('userId', '==', userId))
    : collection(db, 'payments')
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
