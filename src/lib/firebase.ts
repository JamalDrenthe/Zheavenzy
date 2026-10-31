import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateAuthProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import type { Booking, Message, Role, Tier, Upload } from './data'

export const ADMIN_EMAILS = [
  'info@zheavenzy.one',
  'info@jamaldrenthe.com',
  (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase().trim(),
].filter(Boolean)

export const ADMIN_EMAIL = 'info@zheavenzy.one'

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB3i8sMoBpDPDHyMMBaRcNECsnbsK0nmY4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'zheavenzy-dev.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'zheavenzy-dev',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'zheavenzy-dev.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '557199880448',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:557199880448:web:a726ac45390ba8eac743e5',
}

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase Auth
export const auth = getAuth(app)

// Initialize Cloud Firestore
export const db = getFirestore(app)

// Initialize Google Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account',
})

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const normalized = email.toLowerCase().trim()
  return ADMIN_EMAILS.includes(normalized)
}

// -------------------------------------------------------------
// Authentication Helpers
// -------------------------------------------------------------

export async function loginWithGoogleOAuth(): Promise<{
  success: boolean
  user?: FirebaseUser
  isAdmin?: boolean
  error?: string
}> {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const email = result.user.email || ''
    const isAdmin = isAdminEmail(email)
    return {
      success: true,
      user: result.user,
      isAdmin,
    }
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string }
    let friendlyMessage = 'Er is een fout opgetreden bij het inloggen met Google.'

    if (error.code === 'auth/popup-closed-by-user') {
      friendlyMessage = 'Inlogvenster werd gesloten voor het afronden.'
    } else if (error.code === 'auth/cancelled-popup-request') {
      friendlyMessage = 'Popup aanvraag geannuleerd.'
    } else if (error.code === 'auth/unauthorized-domain') {
      friendlyMessage = 'Dit domein is nog niet geautoriseerd in Firebase Auth instellingen.'
    } else if (error.message) {
      friendlyMessage = error.message
    }

    return {
      success: false,
      error: friendlyMessage,
    }
  }
}

export async function loginOrRegisterWithEmail(
  email: string,
  pass: string,
  isRegister = false,
  extra?: { name?: string; role?: Role; tier?: Tier }
): Promise<{ success: boolean; user?: FirebaseUser; error?: string; isAdmin?: boolean }> {
  try {
    let result
    if (isRegister) {
      result = await createUserWithEmailAndPassword(auth, email, pass)
      if (extra?.name) {
        await updateAuthProfile(result.user, { displayName: extra.name })
      }
    } else {
      result = await signInWithEmailAndPassword(auth, email, pass)
    }

    const isAdmin = isAdminEmail(result.user.email)
    return {
      success: true,
      user: result.user,
      isAdmin,
    }
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string }
    let friendlyMessage = 'Inloggen mislukt. Controleer je gegevens.'

    if (error.code === 'auth/email-already-in-use') {
      friendlyMessage = 'Dit e-mailadres is al in gebruik. Kies voor inloggen.'
    } else if (error.code === 'auth/invalid-email') {
      friendlyMessage = 'Ongeldig e-mailadres ingevoerd.'
    } else if (error.code === 'auth/weak-password') {
      friendlyMessage = 'Het wachtwoord moet minimaal 6 tekens lang zijn.'
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      friendlyMessage = 'Ongeldige combinatie van e-mail en wachtwoord.'
    } else if (error.message) {
      friendlyMessage = error.message
    }

    return {
      success: false,
      error: friendlyMessage,
    }
  }
}

export async function logoutFirebase(): Promise<void> {
  try {
    await firebaseSignOut(auth)
  } catch {
    // Ignore signOut errors
  }
}

export { onAuthStateChanged }

// -------------------------------------------------------------
// Cloud Firestore Data Synchronization
// -------------------------------------------------------------

export interface FirestoreUserData {
  uid: string
  name: string
  email: string
  role: Role
  tier: Tier
  bio: string
  avatar: string | null
  tagline?: string
  services?: string[]
  costPerDay?: number
  directBook?: boolean
  followers?: number
  collabs?: number
  credits: number
  isAdmin: boolean
  isDemo: boolean
  provider: 'google' | 'email' | 'demo'
  following?: string[]
  friends?: string[]
  pendingFriends?: string[]
  createdAt?: unknown
  updatedAt?: unknown
}

export async function saveUserToFirestore(uid: string, userData: Partial<FirestoreUserData>): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', uid)
    await setDoc(
      userRef,
      {
        ...userData,
        uid,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
    return true
  } catch (error) {
    console.warn('Firestore saveUserToFirestore error (using offline fallback):', error)
    return false
  }
}

export async function getUserFromFirestore(uid: string): Promise<FirestoreUserData | null> {
  try {
    const userRef = doc(db, 'users', uid)
    const snap = await getDoc(userRef)
    if (snap.exists()) {
      return snap.data() as FirestoreUserData
    }
    return null
  } catch (error) {
    console.warn('Firestore getUserFromFirestore error:', error)
    return null
  }
}

export function subscribeUserInFirestore(
  uid: string,
  onUpdate: (userData: FirestoreUserData) => void
): Unsubscribe {
  const userRef = doc(db, 'users', uid)
  return onSnapshot(
    userRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as FirestoreUserData)
      }
    },
    (err) => {
      console.warn('Firestore user subscription warning:', err.message)
    }
  )
}

// -------------------------------------------------------------
// Bookings Sync
// -------------------------------------------------------------

export interface FirestoreBooking {
  id?: string
  userId: string
  memberId: string
  date: string
  status: 'bevestigd' | 'aanvraag'
  createdAt?: unknown
}

export async function saveBookingToFirestore(userId: string, booking: Booking): Promise<boolean> {
  try {
    const bookingId = `${userId}_${booking.memberId}_${booking.date}`
    const bookingRef = doc(db, 'bookings', bookingId)
    await setDoc(
      bookingRef,
      {
        userId,
        memberId: booking.memberId,
        date: booking.date,
        status: booking.status,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    )
    return true
  } catch (error) {
    console.warn('Firestore saveBooking error:', error)
    return false
  }
}

export function subscribeUserBookings(
  userId: string,
  onUpdate: (bookings: Booking[]) => void
): Unsubscribe {
  try {
    const q = query(collection(db, 'bookings'), where('userId', '==', userId))
    return onSnapshot(
      q,
      (snap) => {
        const list: Booking[] = snap.docs.map((docSnap) => {
          const d = docSnap.data()
          return {
            memberId: d.memberId,
            date: d.date,
            status: d.status,
          }
        })
        onUpdate(list)
      },
      (err) => {
        console.warn('Firestore bookings subscription warning:', err.message)
      }
    )
  } catch (e) {
    console.warn('Failed to subscribe bookings:', e)
    return () => {}
  }
}

// -------------------------------------------------------------
// Messages Sync
// -------------------------------------------------------------

export interface FirestoreMessage {
  id?: string
  userId: string
  memberId: string
  from: 'me' | 'them'
  text: string
  ts: number
  createdAt?: unknown
}

export async function saveMessageToFirestore(
  userId: string,
  memberId: string,
  message: Message
): Promise<boolean> {
  try {
    const msgId = `${userId}_${memberId}_${message.ts}`
    const msgRef = doc(db, 'messages', msgId)
    await setDoc(msgRef, {
      userId,
      memberId,
      from: message.from,
      text: message.text,
      ts: message.ts,
      createdAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.warn('Firestore saveMessage error:', error)
    return false
  }
}

export function subscribeUserMessages(
  userId: string,
  onUpdate: (messagesMap: Record<string, Message[]>) => void
): Unsubscribe {
  try {
    const q = query(collection(db, 'messages'), where('userId', '==', userId))
    return onSnapshot(
      q,
      (snap) => {
        const map: Record<string, Message[]> = {}
        snap.docs.forEach((docSnap) => {
          const d = docSnap.data() as FirestoreMessage
          if (!map[d.memberId]) map[d.memberId] = []
          map[d.memberId].push({
            from: d.from,
            text: d.text,
            ts: d.ts || Date.now(),
          })
        })
        // Sorteer op timestamp per conversatie
        Object.keys(map).forEach((k) => {
          map[k].sort((a, b) => a.ts - b.ts)
        })
        onUpdate(map)
      },
      (err) => {
        console.warn('Firestore messages subscription warning:', err.message)
      }
    )
  } catch (e) {
    console.warn('Failed to subscribe messages:', e)
    return () => {}
  }
}

// -------------------------------------------------------------
// Uploads Sync
// -------------------------------------------------------------

export async function saveUploadToFirestore(userId: string, upload: Upload): Promise<boolean> {
  try {
    const uploadId = `${userId}_${upload.ts}`
    const uploadRef = doc(db, 'uploads', uploadId)
    await setDoc(uploadRef, {
      userId,
      title: upload.title,
      type: upload.type,
      credits: upload.credits,
      ts: upload.ts,
      createdAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.warn('Firestore saveUpload error:', error)
    return false
  }
}

export function subscribeUserUploads(
  userId: string,
  onUpdate: (uploads: Upload[]) => void
): Unsubscribe {
  try {
    const q = query(collection(db, 'uploads'), where('userId', '==', userId))
    return onSnapshot(
      q,
      (snap) => {
        const list: Upload[] = snap.docs.map((docSnap) => {
          const d = docSnap.data()
          return {
            title: d.title,
            type: d.type,
            credits: d.credits,
            ts: d.ts,
          }
        })
        list.sort((a, b) => b.ts - a.ts)
        onUpdate(list)
      },
      (err) => {
        console.warn('Firestore uploads subscription warning:', err.message)
      }
    )
  } catch (e) {
    console.warn('Failed to subscribe uploads:', e)
    return () => {}
  }
}
