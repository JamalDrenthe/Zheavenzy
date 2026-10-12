import { createContext } from 'react'
import type { Booking, Message, Tier, Upload } from './data'

export interface User {
  name: string
  email: string
  tier: Tier
  bio: string
  avatar: string | null
  isAdmin?: boolean
  isDemo?: boolean
  provider?: 'google' | 'demo'
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
}

export interface PlatformState extends StoredState {
  login: (
    tier: Tier,
    name: string,
    email: string,
    options?: {
      bio?: string
      avatar?: string | null
      isAdmin?: boolean
      isDemo?: boolean
      provider?: 'google' | 'demo'
      credits?: number
    }
  ) => void
  loginWithGoogle: () => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>
  loginDemo: (demoId: 'luna' | 'mara' | 'alex' | 'jamal') => void
  logout: () => void
  buyBundle: (credits: number) => void
  uploadWork: (title: string, type: string) => void
  sendMessage: (memberId: string, text: string) => void
  requestBooking: (memberId: string, date: string) => void
  toggleFollow: (memberId: string) => void
  requestFriend: (memberId: string) => void
  updateProfile: (fields: { name?: string; email?: string; bio?: string; avatar?: string | null }) => void
  markNotificationsRead: () => void
  tierLabel: (t: Tier) => string
}

export const PlatformContext = createContext<PlatformState | null>(null)
