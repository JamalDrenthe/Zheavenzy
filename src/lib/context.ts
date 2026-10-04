import { createContext } from 'react'
import type { Booking, Message, Tier, Upload } from './data'

export interface User {
  name: string
  email: string
  tier: Tier
}

export interface StoredState {
  user: User | null
  credits: number
  messages: Record<string, Message[]>
  bookings: Booking[]
  uploads: Upload[]
}

export interface PlatformState extends StoredState {
  login: (tier: Tier, name: string, email: string) => void
  logout: () => void
  buyBundle: (credits: number) => void
  uploadWork: (title: string, type: string) => void
  sendMessage: (memberId: string, text: string) => void
  requestBooking: (memberId: string, date: string) => void
  tierLabel: (t: Tier) => string
}

export const PlatformContext = createContext<PlatformState | null>(null)
