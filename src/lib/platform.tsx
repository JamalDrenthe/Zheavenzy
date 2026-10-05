import { useEffect, useRef, useState, type ReactNode } from 'react'
import { members, tierCredits, uploadReward, type Booking } from './data'
import {
  PlatformContext,
  type PlatformState,
  type StoredState,
  type AppNotification,
} from './context'

const STORAGE_KEY = 'zheavenzy-platform'

const emptyState: StoredState = {
  user: null,
  credits: 0,
  messages: {},
  bookings: [],
  uploads: [],
  following: [],
  friends: [],
  pendingFriends: [],
  notifications: [],
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

let notifId = 1

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(loadState)
  const notifIdRef = useRef(notifId++)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const notify = (text: string): AppNotification => ({
    id: ++notifIdRef.current,
    text,
    ts: Date.now(),
    read: false,
  })

  const value: PlatformState = {
    ...state,
    login: (tier, name, email) =>
      setState((s) => ({
        ...s,
        user: { tier, name, email, bio: s.user?.bio ?? '', avatar: s.user?.avatar ?? null },
        credits: s.credits || tierCredits[tier],
      })),
    logout: () => setState((s) => ({ ...s, user: null })),
    buyBundle: (c) =>
      setState((s) => ({
        ...s,
        credits: s.credits + c,
        notifications: [...s.notifications, notify(`${c.toLocaleString('nl-NL')} credits toegevoegd aan je saldo.`)],
      })),
    uploadWork: (title, type) =>
      setState((s) => ({
        ...s,
        credits: s.credits + uploadReward,
        uploads: [...s.uploads, { title, type, credits: uploadReward, ts: Date.now() }],
        notifications: [
          ...s.notifications,
          notify(`"${title}" geüpload — +${uploadReward} credits, nu onderdeel van het platform.`),
        ],
      })),
    sendMessage: (memberId, text) => {
      setState((s) => ({
        ...s,
        messages: {
          ...s.messages,
          [memberId]: [...(s.messages[memberId] ?? []), { from: 'me' as const, text, ts: Date.now() }],
        },
      }))
      const member = members.find((m) => m.id === memberId)
      const replies = [
        'Dank voor je bericht! Ik reageer zo snel mogelijk.',
        'Top, laten we de details via de kalender afstemmen.',
        'Klinkt goed — stuur me gerust meer info.',
      ]
      const reply = replies[Math.floor(Math.random() * replies.length)]
      setTimeout(() => {
        setState((cur) => ({
          ...cur,
          messages: {
            ...cur.messages,
            [memberId]: [...(cur.messages[memberId] ?? []), { from: 'them' as const, text: reply, ts: Date.now() }],
          },
          notifications: [...cur.notifications, notify(`Nieuw bericht van ${member?.name ?? 'een lid'}.`)],
        }))
      }, 1600)
    },
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
          notifications: [
            ...s.notifications,
            notify(
              member?.directBook
                ? `Boeking bij ${member.name} bevestigd voor ${date}.`
                : `Boekingsaanvraag bij ${member?.name ?? 'lid'} verstuurd voor ${date}.`,
            ),
          ],
        }
      }),
    toggleFollow: (memberId) =>
      setState((s) => {
        const isFollowing = s.following.includes(memberId)
        const member = members.find((m) => m.id === memberId)
        return {
          ...s,
          following: isFollowing
            ? s.following.filter((id) => id !== memberId)
            : [...s.following, memberId],
          notifications: isFollowing
            ? s.notifications
            : [...s.notifications, notify(`Je volgt nu ${member?.name ?? 'dit lid'}.`)],
        }
      }),
    requestFriend: (memberId) =>
      setState((s) => {
        if (s.friends.includes(memberId) || s.pendingFriends.includes(memberId)) return s
        const member = members.find((m) => m.id === memberId)
        // Simuleer acceptatie van het verzoek na korte tijd
        setTimeout(() => {
          setState((cur) =>
            cur.pendingFriends.includes(memberId)
              ? {
                  ...cur,
                  pendingFriends: cur.pendingFriends.filter((id) => id !== memberId),
                  friends: [...cur.friends, memberId],
                  notifications: [
                    ...cur.notifications,
                    notify(`${member?.name ?? 'Een lid'} heeft je vriendschapsverzoek geaccepteerd.`),
                  ],
                }
              : cur,
          )
        }, 2000)
        return {
          ...s,
          pendingFriends: [...s.pendingFriends, memberId],
          notifications: [
            ...s.notifications,
            notify(`Vriendschapsverzoek verstuurd naar ${member?.name ?? 'lid'}.`),
          ],
        }
      }),
    updateProfile: (fields) =>
      setState((s) =>
        s.user
          ? {
              ...s,
              user: { ...s.user, ...fields },
              notifications: [...s.notifications, notify('Je profiel is bijgewerkt.')],
            }
          : s,
      ),
    markNotificationsRead: () =>
      setState((s) => ({
        ...s,
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      })),
    tierLabel: (t) => (t === 'start' ? 'Start' : t === 'groei' ? 'Groei' : 'Pro'),
  }

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}
