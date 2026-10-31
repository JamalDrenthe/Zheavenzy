import { createContext } from 'react'
import type { Booking, Message, Role, Tier, Upload } from './data'

export interface User {
  uid?: string
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
  isAdmin?: boolean
  isDemo?: boolean
  provider?: 'google' | 'email' | 'demo'
  createdAt?: unknown
  updatedAt?: unknown
}

export interface AppNotification {
  id: number
  text: string
  ts: number
  read: boolean
}

export interface StoredState {
  user: User | null
  credits: number
  messages: Record<string, Message[]>
  bookings: Booking[]
  uploads: Upload[]
  following: string[]
  friends: string[]
  pendingFriends: string[]
  notifications: AppNotification[]
  firebaseConnected: boolean
  syncing: boolean
  lastSyncTime: number | null
}

export interface PlatformState extends StoredState {
  login: (
    tier: Tier,
    name: string,
    email: string,
    options?: {
      uid?: string
      role?: Role
      bio?: string
      avatar?: string | null
      tagline?: string
      services?: string[]
      costPerDay?: number
      directBook?: boolean
      followers?: number
      collabs?: number
      isAdmin?: boolean
      isDemo?: boolean
      provider?: 'google' | 'email' | 'demo'
      credits?: number
    }
  ) => void
  loginWithGoogle: () => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>
  loginWithEmail: (
    email: string,
    pass: string,
    isRegister?: boolean,
    extra?: { name?: string; role?: Role; tier?: Tier }
  ) => Promise<{ success: boolean; error?: string }>
  loginDemo: (demoId: 'luna' | 'mara' | 'alex' | 'jamal') => void
  logout: () => void
  buyBundle: (credits: number) => void
  uploadWork: (title: string, type: string) => void
  sendMessage: (memberId: string, text: string) => void
  requestBooking: (memberId: string, date: string) => void
  toggleFollow: (memberId: string) => void
  requestFriend: (memberId: string) => void
  updateProfile: (fields: Partial<User>) => void
  setRole: (role: Role) => void
  setTier: (tier: Tier) => void
  markNotificationsRead: () => void
  tierLabel: (t: Tier) => string
  roleLabel: (r: Role) => string
  syncWithFirestore: () => Promise<void>
}

export const PlatformContext = createContext<PlatformState | null>(null)
