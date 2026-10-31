import { useEffect, useRef, useState, type ReactNode } from 'react'
import { members, roleConfigs, tierCredits, uploadReward, type Booking, type Message, type Role, type Tier, type Upload } from './data'
import {
  PlatformContext,
  type PlatformState,
  type StoredState,
  type AppNotification,
  type User,
} from './context'
import {
  loginWithGoogleOAuth,
  loginOrRegisterWithEmail,
  logoutFirebase,
  auth,
  onAuthStateChanged,
  isAdminEmail,
  saveUserToFirestore,
  getUserFromFirestore,
  subscribeUserInFirestore,
  saveBookingToFirestore,
  subscribeUserBookings,
  saveMessageToFirestore,
  subscribeUserMessages,
  saveUploadToFirestore,
  subscribeUserUploads,
  type FirestoreUserData,
} from './firebase'
import type { Unsubscribe } from 'firebase/firestore'

const STORAGE_KEY = 'zheavenzy-platform-v2'

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
  firebaseConnected: false,
  syncing: false,
  lastSyncTime: null,
}

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...emptyState, ...parsed, syncing: false }
    }
  } catch {
    /* corrupte state -> reset */
  }
  return emptyState
}

let notifId = 1

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(loadState)
  const notifIdRef = useRef(notifId++)
  const unsubsRef = useRef<Unsubscribe[]>([])

  // Sla altijd op in localStorage als offline veilige cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore quota errors
    }
  }, [state])

  const notify = (text: string): AppNotification => ({
    id: ++notifIdRef.current,
    text,
    ts: Date.now(),
    read: false,
  })

  // Ruim eerdere Firestore subscriptions op
  const clearSubscriptions = () => {
    unsubsRef.current.forEach((unsub) => {
      try {
        unsub()
      } catch {
        // ignore
      }
    })
    unsubsRef.current = []
  }

  // Synchroniseer Firebase auth status en verbind real-time Firestore listeners
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && fbUser.email) {
        clearSubscriptions()

        const isEmailAdmin = isAdminEmail(fbUser.email)
        const uid = fbUser.uid
        const email = fbUser.email.toLowerCase().trim()
        const providerName = fbUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email'

        setState((s) => ({ ...s, syncing: true, firebaseConnected: true }))

        try {
          // Haal Firestore profiel op
          const fsUser = await getUserFromFirestore(uid)

          if (fsUser) {
            // Hydrateer met bestaand Firestore profiel
            setState((s) => ({
              ...s,
              user: {
                uid,
                name: fsUser.name || fbUser.displayName || (isEmailAdmin ? 'Jamal Drenthe' : 'Lid'),
                email: fsUser.email || email,
                role: fsUser.role || 'artiest',
                tier: fsUser.tier || (isEmailAdmin ? 'pro' : 'groei'),
                bio: fsUser.bio || (isEmailAdmin ? 'Platform Eigenaar & Administrator' : ''),
                avatar: fsUser.avatar || fbUser.photoURL || null,
                tagline: fsUser.tagline || roleConfigs[fsUser.role || 'artiest'].title,
                services: fsUser.services || roleConfigs[fsUser.role || 'artiest'].defaultServices,
                costPerDay: fsUser.costPerDay || 750,
                directBook: fsUser.directBook ?? true,
                followers: fsUser.followers ?? 120,
                collabs: fsUser.collabs ?? 4,
                isAdmin: isEmailAdmin,
                isDemo: false,
                provider: providerName,
              },
              credits: fsUser.credits !== undefined ? fsUser.credits : (isEmailAdmin ? 50000 : 3000),
              following: fsUser.following || s.following,
              friends: fsUser.friends || s.friends,
              pendingFriends: fsUser.pendingFriends || s.pendingFriends,
              syncing: false,
              firebaseConnected: true,
              lastSyncTime: Date.now(),
            }))
          } else {
            // Maak nieuw gebruikersdocument aan in Cloud Firestore
            const initialRole: Role = 'artiest'
            const initialTier: Tier = isEmailAdmin ? 'pro' : 'groei'
            const initialCredits = isEmailAdmin ? 50000 : tierCredits[initialTier]
            const initialName = fbUser.displayName || (isEmailAdmin ? 'Jamal Drenthe' : email.split('@')[0])
            const initialBio = isEmailAdmin ? 'Platform Eigenaar & Administrator' : 'Zheavenzy Muziek Professional'

            const newUserDoc: FirestoreUserData = {
              uid,
              name: initialName,
              email,
              role: initialRole,
              tier: initialTier,
              bio: initialBio,
              avatar: fbUser.photoURL || null,
              tagline: roleConfigs[initialRole].title,
              services: roleConfigs[initialRole].defaultServices,
              costPerDay: 750,
              directBook: true,
              followers: 100,
              collabs: 0,
              credits: initialCredits,
              isAdmin: isEmailAdmin,
              isDemo: false,
              provider: providerName,
              following: [],
              friends: [],
              pendingFriends: [],
            }

            await saveUserToFirestore(uid, newUserDoc)

            setState((s) => ({
              ...s,
              user: { ...newUserDoc },
              credits: initialCredits,
              syncing: false,
              firebaseConnected: true,
              lastSyncTime: Date.now(),
              notifications: [
                ...s.notifications,
                notify(`🔥 Nieuw account aangemaakt en opgeslagen in Cloud Firestore (${email}).`),
              ],
            }))
          }

          // Activeer real-time live listeners
          const unsubUser = subscribeUserInFirestore(uid, (data) => {
            setState((s) => {
              if (!s.user || s.user.isDemo) return s
              return {
                ...s,
                user: {
                  ...s.user,
                  name: data.name ?? s.user.name,
                  email: data.email ?? s.user.email,
                  role: data.role ?? s.user.role,
                  tier: data.tier ?? s.user.tier,
                  bio: data.bio ?? s.user.bio,
                  avatar: data.avatar ?? s.user.avatar,
                  tagline: data.tagline ?? s.user.tagline,
                  services: data.services ?? s.user.services,
                  costPerDay: data.costPerDay ?? s.user.costPerDay,
                  directBook: data.directBook ?? s.user.directBook,
                },
                credits: data.credits !== undefined ? data.credits : s.credits,
                following: data.following || s.following,
                friends: data.friends || s.friends,
                pendingFriends: data.pendingFriends || s.pendingFriends,
                lastSyncTime: Date.now(),
              }
            })
          })
          unsubsRef.current.push(unsubUser)

          const unsubBookings = subscribeUserBookings(uid, (bookings) => {
            if (bookings.length > 0) {
              setState((s) => ({ ...s, bookings }))
            }
          })
          unsubsRef.current.push(unsubBookings)

          const unsubMessages = subscribeUserMessages(uid, (messages) => {
            if (Object.keys(messages).length > 0) {
              setState((s) => ({
                ...s,
                messages: { ...s.messages, ...messages },
              }))
            }
          })
          unsubsRef.current.push(unsubMessages)

          const unsubUploads = subscribeUserUploads(uid, (uploads) => {
            if (uploads.length > 0) {
              setState((s) => ({ ...s, uploads }))
            }
          })
          unsubsRef.current.push(unsubUploads)
        } catch (e) {
          console.warn('Fout bij synchroniseren met Firebase:', e)
          setState((s) => ({ ...s, syncing: false }))
        }
      } else if (fbUser === null) {
        clearSubscriptions()
        setState((s) =>
          s.user?.provider !== 'demo'
            ? { ...s, user: null, firebaseConnected: false, syncing: false }
            : s
        )
      }
    })

    return () => {
      unsubscribeAuth()
      clearSubscriptions()
    }
  }, [])

  const value: PlatformState = {
    ...state,

    login: (tier, name, email, options) => {
      const isEmailAdmin = isAdminEmail(email)
      const isAdmin = options?.isAdmin !== undefined ? options.isAdmin : isEmailAdmin
      const isDemo = options?.isDemo ?? false
      const provider = options?.provider ?? (isDemo ? 'demo' : 'google')
      const role = options?.role ?? 'artiest'
      const initialCredits = options?.credits ?? (state.credits || tierCredits[tier] || 1000)

      const newUser: User = {
        uid: options?.uid,
        tier,
        role,
        name: name || (isAdmin ? 'Jamal Drenthe' : 'Gebruiker'),
        email: email || (isAdmin ? 'info@zheavenzy.one' : 'demo@zheavenzy.one'),
        bio: options?.bio ?? (isAdmin ? 'Platform Eigenaar & Administrator' : state.user?.bio ?? ''),
        avatar: options?.avatar ?? state.user?.avatar ?? null,
        tagline: options?.tagline ?? roleConfigs[role].title,
        services: options?.services ?? roleConfigs[role].defaultServices,
        costPerDay: options?.costPerDay ?? 750,
        directBook: options?.directBook ?? true,
        followers: options?.followers ?? 100,
        collabs: options?.collabs ?? 2,
        isAdmin,
        isDemo,
        provider,
      }

      setState((s) => ({
        ...s,
        user: newUser,
        credits: isAdmin ? Math.max(initialCredits, 50000) : initialCredits,
        notifications: [
          ...s.notifications,
          notify(
            isAdmin
              ? '👑 Ingelogd als Administrator met volledige Firestore beheerrechten.'
              : `Ingelogd als ${roleConfigs[role].label} met een ${tier.toUpperCase()} lidmaatschap.`
          ),
        ],
      }))

      if (options?.uid && !isDemo) {
        saveUserToFirestore(options.uid, {
          ...newUser,
          credits: isAdmin ? Math.max(initialCredits, 50000) : initialCredits,
        })
      }
    },

    loginWithGoogle: async () => {
      setState((s) => ({ ...s, syncing: true }))
      const res = await loginWithGoogleOAuth()
      if (res.success && res.user) {
        const email = res.user.email || ''
        const isAdmin = isAdminEmail(email)
        const name = res.user.displayName || (isAdmin ? 'Jamal Drenthe' : 'Google Gebruiker')
        const avatar = res.user.photoURL || null
        const uid = res.user.uid

        // Sla direct op of haal op uit Firestore
        const existing = await getUserFromFirestore(uid)
        const role: Role = existing?.role || 'artiest'
        const tier: Tier = existing?.tier || (isAdmin ? 'pro' : 'groei')
        const credits = existing?.credits !== undefined ? existing.credits : (isAdmin ? 50000 : tierCredits[tier])

        const updatedUser: User = {
          uid,
          name: existing?.name || name,
          email: existing?.email || email,
          role,
          tier,
          bio: existing?.bio || (isAdmin ? 'Platform Eigenaar & Administrator' : 'Zheavenzy Muziek Professional'),
          avatar: existing?.avatar || avatar,
          tagline: existing?.tagline || roleConfigs[role].title,
          services: existing?.services || roleConfigs[role].defaultServices,
          costPerDay: existing?.costPerDay || 750,
          directBook: existing?.directBook ?? true,
          followers: existing?.followers ?? 150,
          collabs: existing?.collabs ?? 3,
          isAdmin,
          isDemo: false,
          provider: 'google',
        }

        await saveUserToFirestore(uid, {
          ...updatedUser,
          credits,
        })

        setState((s) => ({
          ...s,
          user: updatedUser,
          credits,
          syncing: false,
          firebaseConnected: true,
          lastSyncTime: Date.now(),
          notifications: [
            ...s.notifications,
            notify(
              isAdmin
                ? `👑 Welkom! Ingelogd via Google OAuth als Administrator (${email}). Firestore gesynchroniseerd.`
                : `Welkom ${name}! Ingelogd via Google OAuth (${roleConfigs[role].label}).`
            ),
          ],
        }))

        return { success: true, isAdmin }
      }

      setState((s) => ({ ...s, syncing: false }))
      return { success: false, error: res.error }
    },

    loginWithEmail: async (email, pass, isRegister = false, extra) => {
      setState((s) => ({ ...s, syncing: true }))
      const res = await loginOrRegisterWithEmail(email, pass, isRegister, extra)

      if (res.success && res.user) {
        const uid = res.user.uid
        const isAdmin = res.isAdmin || false
        const role: Role = extra?.role || 'artiest'
        const tier: Tier = extra?.tier || (isAdmin ? 'pro' : 'groei')
        const name = extra?.name || res.user.displayName || email.split('@')[0]
        const credits = isAdmin ? 50000 : tierCredits[tier]

        const newUser: User = {
          uid,
          name,
          email: res.user.email || email,
          role,
          tier,
          bio: isAdmin ? 'Platform Eigenaar & Administrator' : 'Zheavenzy Creative Member',
          avatar: null,
          tagline: roleConfigs[role].title,
          services: roleConfigs[role].defaultServices,
          costPerDay: 750,
          directBook: true,
          followers: 80,
          collabs: 1,
          isAdmin,
          isDemo: false,
          provider: 'email',
        }

        await saveUserToFirestore(uid, { ...newUser, credits })

        setState((s) => ({
          ...s,
          user: newUser,
          credits,
          syncing: false,
          firebaseConnected: true,
          lastSyncTime: Date.now(),
          notifications: [
            ...s.notifications,
            notify(
              isRegister
                ? `Welkom bij Zheavenzy! Je account is aangemaakt en opgeslagen in Firebase.`
                : `Welkom terug! Succesvol ingelogd via Firebase Authentication.`
            ),
          ],
        }))

        return { success: true }
      }

      setState((s) => ({ ...s, syncing: false }))
      return { success: false, error: res.error }
    },

    loginDemo: (demoId) => {
      clearSubscriptions()
      if (demoId === 'luna') {
        value.login('pro', 'Luna Voss (Demo)', 'luna.voss@zheavenzy.demo', {
          role: 'artiest',
          bio: "R&B / Soul zangeres & songwriter. Drie EP's uitgebracht via Zheavenzy.",
          avatar: null,
          tagline: 'R&B / Soul zangeres',
          services: ['Studiozang', 'Writing camps', 'Live optredens', 'Track feature'],
          isAdmin: false,
          isDemo: true,
          provider: 'demo',
          credits: 12400,
        })
      } else if (demoId === 'mara') {
        value.login('groei', 'Mara Chen (Demo)', 'mara.chen@zheavenzy.demo', {
          role: 'camera',
          bio: 'Videograaf & visual director voor artiesten en clips met Sony FX6 setup.',
          avatar: null,
          tagline: 'Videograaf voor muziekvideo\'s en content',
          services: ['Videoclips', 'Live-registraties', 'Social content', 'Editing & color grading'],
          isAdmin: false,
          isDemo: true,
          provider: 'demo',
          credits: 4500,
        })
      } else if (demoId === 'alex') {
        value.login('start', 'Alex Rivers (Demo)', 'alex.rivers@zheavenzy.demo', {
          role: 'designer',
          bio: 'Visual designer voor album covers, motion posters en Spotify canvas.',
          avatar: null,
          tagline: 'Graphic & visual designer',
          services: ['Cover artwork', 'Motion graphics', 'Spotify Canvas'],
          isAdmin: false,
          isDemo: true,
          provider: 'demo',
          credits: 1000,
        })
      } else if (demoId === 'jamal') {
        value.login('pro', 'Zheavenzy Admin (Demo)', 'info@zheavenzy.one', {
          role: 'artiest',
          bio: 'Platform Eigenaar & Administrator',
          avatar: null,
          tagline: 'Master Executive & Producer',
          services: ['Platform Beheer', 'Strategie', 'A&R Direction'],
          isAdmin: true,
          isDemo: true,
          provider: 'demo',
          credits: 50000,
        })
      }
    },

    logout: () => {
      clearSubscriptions()
      logoutFirebase()
      setState((s) => ({
        ...s,
        user: null,
        firebaseConnected: false,
        syncing: false,
        notifications: [...s.notifications, notify('Succesvol uitgelogd.')],
      }))
    },

    buyBundle: (c) => {
      const newCredits = state.credits + c
      setState((s) => ({
        ...s,
        credits: newCredits,
        notifications: [...s.notifications, notify(`${c.toLocaleString('nl-NL')} credits toegevoegd aan je saldo.`)],
      }))

      if (state.user?.uid && !state.user.isDemo) {
        saveUserToFirestore(state.user.uid, { credits: newCredits })
      }
    },

    uploadWork: (title, type) => {
      const newCredits = state.credits + uploadReward
      const newUpload: Upload = { title, type, credits: uploadReward, ts: Date.now() }

      setState((s) => ({
        ...s,
        credits: newCredits,
        uploads: [newUpload, ...s.uploads],
        notifications: [
          ...s.notifications,
          notify(`"${title}" geüpload: +${uploadReward} credits toegevoegd aan je saldo. Opgeslagen in Firestore.`),
        ],
      }))

      if (state.user?.uid && !state.user.isDemo) {
        saveUploadToFirestore(state.user.uid, newUpload)
        saveUserToFirestore(state.user.uid, { credits: newCredits })
      }
    },

    sendMessage: (memberId, text) => {
      const myMsg: Message = { from: 'me', text, ts: Date.now() }

      setState((s) => ({
        ...s,
        messages: {
          ...s.messages,
          [memberId]: [...(s.messages[memberId] ?? []), myMsg],
        },
      }))

      if (state.user?.uid && !state.user.isDemo) {
        saveMessageToFirestore(state.user.uid, memberId, myMsg)
      }

      const member = members.find((m) => m.id === memberId)
      const replies = [
        'Dank voor je bericht! Ik bekijk je profiel en reageer zo snel mogelijk.',
        'Top, laten we de datum en vereisten via de boekingskalender vastleggen.',
        'Klinkt goed! Stuur me gerust meer audio- of referentiemateriaal.',
      ]
      const replyText = replies[Math.floor(Math.random() * replies.length)]

      setTimeout(() => {
        const replyMsg: Message = { from: 'them', text: replyText, ts: Date.now() }
        setState((cur) => ({
          ...cur,
          messages: {
            ...cur.messages,
            [memberId]: [...(cur.messages[memberId] ?? []), replyMsg],
          },
          notifications: [...cur.notifications, notify(`Nieuw bericht ontvangen van ${member?.name ?? 'een lid'}.`)],
        }))

        if (state.user?.uid && !state.user.isDemo) {
          saveMessageToFirestore(state.user.uid, memberId, replyMsg)
        }
      }, 1400)
    },

    requestBooking: (memberId, date) => {
      const member = members.find((m) => m.id === memberId)
      const status: Booking['status'] = member?.directBook ? 'bevestigd' : 'aanvraag'
      const autoText = member?.directBook
        ? `Boeking bevestigd voor ${date}.`
        : `Boekingsaanvraag verstuurd voor ${date}.`

      const newBooking: Booking = { memberId, date, status }
      const newMsg: Message = { from: 'me', text: autoText, ts: Date.now() }

      setState((s) => ({
        ...s,
        bookings: [newBooking, ...s.bookings],
        messages: {
          ...s.messages,
          [memberId]: [...(s.messages[memberId] ?? []), newMsg],
        },
        notifications: [
          ...s.notifications,
          notify(
            member?.directBook
              ? `Boeking bij ${member.name} bevestigd voor ${date} en vastgelegd in Firestore.`
              : `Boekingsaanvraag bij ${member?.name ?? 'lid'} verstuurd voor ${date}.`
          ),
        ],
      }))

      if (state.user?.uid && !state.user.isDemo) {
        saveBookingToFirestore(state.user.uid, newBooking)
        saveMessageToFirestore(state.user.uid, memberId, newMsg)
      }
    },

    toggleFollow: (memberId) => {
      const isFollowing = state.following.includes(memberId)
      const member = members.find((m) => m.id === memberId)
      const nextFollowing = isFollowing
        ? state.following.filter((id) => id !== memberId)
        : [...state.following, memberId]

      setState((s) => ({
        ...s,
        following: nextFollowing,
        notifications: isFollowing
          ? s.notifications
          : [...s.notifications, notify(`Je volgt nu ${member?.name ?? 'dit lid'}.`)],
      }))

      if (state.user?.uid && !state.user.isDemo) {
        saveUserToFirestore(state.user.uid, { following: nextFollowing })
      }
    },

    requestFriend: (memberId) => {
      if (state.friends.includes(memberId) || state.pendingFriends.includes(memberId)) return
      const member = members.find((m) => m.id === memberId)
      const nextPending = [...state.pendingFriends, memberId]

      setState((s) => ({
        ...s,
        pendingFriends: nextPending,
        notifications: [
          ...s.notifications,
          notify(`Vriendschapsverzoek verstuurd naar ${member?.name ?? 'lid'}.`),
        ],
      }))

      if (state.user?.uid && !state.user.isDemo) {
        saveUserToFirestore(state.user.uid, { pendingFriends: nextPending })
      }

      // Simuleer automatische acceptatie na korte pauze
      setTimeout(() => {
        setState((cur) => {
          if (!cur.pendingFriends.includes(memberId)) return cur
          const updatedPending = cur.pendingFriends.filter((id) => id !== memberId)
          const updatedFriends = [...cur.friends, memberId]

          if (cur.user?.uid && !cur.user.isDemo) {
            saveUserToFirestore(cur.user.uid, {
              pendingFriends: updatedPending,
              friends: updatedFriends,
            })
          }

          return {
            ...cur,
            pendingFriends: updatedPending,
            friends: updatedFriends,
            notifications: [
              ...cur.notifications,
              notify(`${member?.name ?? 'Een lid'} heeft je connectieverzoek geaccepteerd.`),
            ],
          }
        })
      }, 2500)
    },

    updateProfile: (fields) => {
      if (!state.user) return

      const updatedUser: User = {
        ...state.user,
        ...fields,
        updatedAt: Date.now(),
      }

      setState((s) => ({
        ...s,
        user: updatedUser,
        notifications: [...s.notifications, notify('Je profiel is bijgewerkt en opgeslagen in Firestore.')],
      }))

      if (state.user.uid && !state.user.isDemo) {
        saveUserToFirestore(state.user.uid, {
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          tier: updatedUser.tier,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar,
          tagline: updatedUser.tagline,
          services: updatedUser.services,
          costPerDay: updatedUser.costPerDay,
          directBook: updatedUser.directBook,
        })
      }
    },

    setRole: (role: Role) => {
      if (!state.user) return
      value.updateProfile({
        role,
        tagline: roleConfigs[role].title,
        services: roleConfigs[role].defaultServices,
      })
    },

    setTier: (tier: Tier) => {
      if (!state.user) return
      value.updateProfile({ tier })
    },

    syncWithFirestore: async () => {
      if (!state.user?.uid || state.user.isDemo) {
        setState((s) => ({
          ...s,
          notifications: [...s.notifications, notify('Demo profielen gebruiken lokale opslag (geen Firestore verbinding nodig).')],
        }))
        return
      }

      setState((s) => ({ ...s, syncing: true }))
      try {
        const fsUser = await getUserFromFirestore(state.user.uid)
        if (fsUser) {
          setState((s) => ({
            ...s,
            credits: fsUser.credits !== undefined ? fsUser.credits : s.credits,
            user: s.user ? { ...s.user, ...fsUser } : null,
            syncing: false,
            firebaseConnected: true,
            lastSyncTime: Date.now(),
            notifications: [...s.notifications, notify('Cloud Firestore synchronisatie succesvol voltooid.')],
          }))
        } else {
          await saveUserToFirestore(state.user.uid, { ...state.user, credits: state.credits })
          setState((s) => ({
            ...s,
            syncing: false,
            firebaseConnected: true,
            lastSyncTime: Date.now(),
            notifications: [...s.notifications, notify('Cloud Firestore profiel geüpload.')],
          }))
        }
      } catch (err) {
        setState((s) => ({
          ...s,
          syncing: false,
          notifications: [...s.notifications, notify('Synchronisatiefout met Firebase. Lokale versie blijft actief.')],
        }))
      }
    },

    markNotificationsRead: () =>
      setState((s) => ({
        ...s,
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      })),

    tierLabel: (t) => (t === 'start' ? 'Start' : t === 'groei' ? 'Groei' : 'Pro'),
    roleLabel: (r) => roleConfigs[r]?.label || 'Lid',
  }

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}
