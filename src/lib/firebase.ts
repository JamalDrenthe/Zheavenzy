import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth'

export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'info@jamaldrenthe.com').toLowerCase().trim()

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

// Initialize Google Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account',
})

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return email.toLowerCase().trim() === ADMIN_EMAIL
}

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

export async function logoutFirebase(): Promise<void> {
  try {
    await firebaseSignOut(auth)
  } catch {
    // Ignore signOut errors
  }
}

export { onAuthStateChanged }
