import { useEffect, useState, type ReactNode } from 'react'
import { members, tierCredits, uploadReward, type Booking } from './data'
import { PlatformContext, type PlatformState, type StoredState } from './context'

const STORAGE_KEY = 'zheavenzy-platform'

const emptyState: StoredState = {
  user: null,
  credits: 0,
  messages: {},
  bookings: [],
  uploads: [],
}

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...emptyState, ...JSON.parse(raw) }
  } catch {
    /* corrupte state -> reset */
  }
  return emptyState
}

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value: PlatformState = {
    ...state,
    login: (tier, name, email) =>
      setState((s) => ({ ...s, user: { tier, name, email }, credits: s.credits || tierCredits[tier] })),
    logout: () => setState((s) => ({ ...s, user: null })),
    buyBundle: (c) => setState((s) => ({ ...s, credits: s.credits + c })),
    uploadWork: (title, type) =>
      setState((s) => ({
        ...s,
        credits: s.credits + uploadReward,
        uploads: [...s.uploads, { title, type, credits: uploadReward, ts: Date.now() }],
      })),
    sendMessage: (memberId, text) =>
      setState((s) => ({
        ...s,
        messages: {
          ...s.messages,
          [memberId]: [...(s.messages[memberId] ?? []), { from: 'me', text, ts: Date.now() }],
        },
      })),
    requestBooking: (memberId, date) =>
      setState((s) => {
        const member = members.find((m) => m.id === memberId)
        const status: Booking['status'] = member?.directBook ? 'bevestigd' : 'aanvraag'
        const autoText = member?.directBook
          ? `Boeking bevestigd voor ${date}.`
          : `Boekingsaanvraag verstuurd voor ${date}.`
        return {
          ...s,
          bookings: [...s.bookings, { memberId, date, status }],
          messages: {
            ...s.messages,
            [memberId]: [...(s.messages[memberId] ?? []), { from: 'me', text: autoText, ts: Date.now() }],
          },
        }
      }),
    tierLabel: (t) => (t === 'start' ? 'Start' : t === 'groei' ? 'Groei' : 'Pro'),
  }

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}
