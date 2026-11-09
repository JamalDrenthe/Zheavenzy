import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  MessageSquare,
  Coins,
  UploadCloud,
  CalendarCheck,
  LogOut,
  ArrowRight,
  Settings,
  Bell,
  UserCheck,
  Heart,
  Crown,
  ShieldCheck,
  GitBranch,
  Server,
  KeyRound,
  RefreshCw,
  Database,
  Music2,
  Video,
  Palette,
  Sparkles,
} from 'lucide-react'
import { usePlatform } from '../lib/usePlatform'
import { firebaseConfig } from '../lib/firebase'
import { members, roleConfigs } from '../lib/data'

export default function Dashboard() {
  const {
    user,
    credits,
    bookings,
    uploads,
    messages,
    logout,
    tierLabel,
    roleLabel,
    following,
    friends,
    notifications,
    syncWithFirestore,
    syncing,
    lastSyncTime,
  } = usePlatform()

  if (!user) return <Navigate to="/login" replace />

  const roleInfo = roleConfigs[user.role || 'artiest']
  const RoleIcon =
    user.role === 'camera'
      ? Video
      : user.role === 'designer'
      ? Palette
      : user.role === 'stylist'
      ? Sparkles
      : Music2

  const cards = [
    {
      icon: Users,
      title: 'Leden vinden',
      desc: 'Ontdek artiesten, producers, camera, designers en stylisten.',
      href: '/leden',
    },
    {
      icon: MessageSquare,
      title: 'Berichten',
      desc: `${Object.keys(messages).length} actief gesprek${Object.keys(messages).length === 1 ? '' : 'ken'} in Firestore.`,
      href: '/berichten',
    },
    {
      icon: Coins,
      title: 'Credits Beheren',
      desc: `${credits.toLocaleString('nl-NL')} credits beschikbaar voor boekingen en diensten.`,
      href: '/credits',
    },
    {
      icon: UploadCloud,
      title: 'Kunst & Masters Uploaden',
      desc: `${uploads.length} upload${uploads.length === 1 ? '' : 's'} live in je catalogus (+250 credits per upload).`,
      href: '/credits',
    },
    {
      icon: Bell,
      title: 'Notificaties',
      desc: `${notifications.filter((n) => !n.read).length} ongelezen update${notifications.filter((n) => !n.read).length === 1 ? '' : 's'}.`,
      href: '/notificaties',
    },
    {
      icon: Settings,
      title: 'Profiel & Instellingen',
      desc: 'Discipline, lidmaatschap, bio en vaardigheden aanpassen.',
      href: '/instellingen',
    },
  ]

  return (
    <>
      <section className="relative bg-[#050505] pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-4 sm:gap-5">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#D4AF37] object-cover shadow-lg shadow-[#D4AF37]/20 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  {user.isAdmin ? <Crown className="w-8 h-8 sm:w-10 sm:h-10" /> : <RoleIcon className="w-8 h-8 sm:w-9 sm:h-9" />}
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {/* Rol Badge */}
                  <span className="inline-flex items-center gap-1.5 border border-[#D4AF37] rounded-full px-3 py-0.5 bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-bold tracking-wider uppercase">
                    <RoleIcon className="w-3.5 h-3.5" />
                    {roleLabel(user.role)}
                  </span>

                  {/* Tier Badge */}
                  <span className="inline-flex items-center gap-1 border border-white/20 rounded-full px-3 py-0.5 bg-white/5 text-white/80 text-xs font-semibold tracking-wider uppercase">
                    {tierLabel(user.tier)} Tier
                  </span>

                  {/* Admin Badge */}
                  {user.isAdmin && (
                    <span className="inline-flex items-center gap-1 border border-amber-500/40 rounded-full px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold tracking-wider uppercase">
                      <ShieldCheck className="w-3 h-3" />
                      Admin
                    </span>
                  )}

                  {/* Demo Badge */}
                  {user.isDemo && (
                    <span className="inline-flex items-center gap-1 border border-white/10 rounded-full px-2.5 py-0.5 bg-white/5 text-white/50 text-[10px] uppercase">
                      Demo
                    </span>
                  )}

                  {/* Provider */}
                  {user.provider === 'google' && (
                    <span className="inline-flex items-center gap-1 border border-blue-500/30 rounded-full px-2.5 py-0.5 bg-blue-500/10 text-blue-300 text-[10px] uppercase">
                      Google OAuth
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                  Welkom terug, <span className="text-gradient-gold">{user.name}</span>
                </h1>
                <p className="text-white/40 text-xs sm:text-sm mt-1 font-mono">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link
                to="/app"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:opacity-95 text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
              >
                <Music2 className="w-3.5 h-3.5" />
                <span>Music App</span>
              </Link>

              <Link
                to="/app/upload"
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Upload Track</span>
              </Link>

              <button
                type="button"
                onClick={() => syncWithFirestore()}
                disabled={syncing}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Synchroniseren...' : 'Firestore Sync'}</span>
              </button>

              <Link
                to="/instellingen"
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Profiel</span>
              </Link>

              <button onClick={logout} className="btn-outline flex items-center gap-1.5 py-2.5 px-4 text-xs">
                <LogOut className="w-3.5 h-3.5" />
                <span>Uitloggen</span>
              </button>
            </div>
          </div>

          {/* Firestore Synchronisatie Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-white/70">
              <Database className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-white font-medium">Cloud Firestore Realtime Status:</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Verbonden met {firebaseConfig.projectId}
              </span>
            </div>
            <div className="text-white/40 text-[11px]">
              {lastSyncTime
                ? `Laatste update: ${new Date(lastSyncTime).toLocaleTimeString('nl-NL')}`
                : 'Automatische two-way sync actief'}
            </div>
          </div>

          {/* Creatieve Discipline Kaart */}
          <div className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-white/[0.04] to-transparent border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                Jouw Netwerkpositie
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {roleInfo.label} — <span className="text-white/70 font-normal">{user.tagline || roleInfo.title}</span>
              </h3>
              <p className="text-white/50 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                {user.bio || roleInfo.desc}
              </p>
              {user.services && user.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {user.services.map((svc) => (
                    <span
                      key={svc}
                      className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/70 text-[11px]"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/instellingen"
              className="px-4 py-2 rounded-xl border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs font-semibold transition-all inline-flex items-center gap-1.5 shrink-0 self-start md:self-center"
            >
              <span>Discipline of Diensten Wijzigen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Speciale Administrator Status Banner */}
          {user.isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-[#D4AF37]/15 via-black to-[#D4AF37]/5 border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Admin Beheerspaneel Geactiveerd
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Volledige beheerrechten over Zheavenzy & achterliggende infrastructuur
                  </h3>
                  <p className="text-white/60 text-xs mt-1 max-w-2xl">
                    Je bent geauthenticeerd als hoofdbeheerder via <strong className="text-white font-mono">{user.email}</strong>. Alle admin Firestore-rechten, data-beheer en accountmodellen zijn operationeel.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase font-mono">
                      <Server className="w-3 h-3 text-emerald-400" /> Vercel Live
                    </div>
                    <div className="text-white font-semibold mt-1">zheavenzy.one</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase font-mono">
                      <KeyRound className="w-3 h-3 text-[#D4AF37]" /> Firestore
                    </div>
                    <div className="text-white font-semibold mt-1">{firebaseConfig.projectId}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase font-mono">
                      <Database className="w-3 h-3 text-[#D4AF37]" /> CRMos API
                    </div>
                    <div className="text-white font-semibold mt-1">crmos.one/api/v1</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase font-mono">
                      <GitBranch className="w-3 h-3 text-blue-400" /> Git Status
                    </div>
                    <div className="text-white font-semibold mt-1">main (Synced)</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-6">
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Credits Saldo</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37]">
                {credits.toLocaleString('nl-NL')}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Boekingen</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">{bookings.length}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Uploads</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">{uploads.length}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#D4AF37]" /> Volgend
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">{following.length}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 sm:p-6 col-span-2 sm:col-span-1">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Connecties
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">{friends.length}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {cards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={card.href}
                  className="glass-card rounded-2xl p-6 block h-full hover:border-[#D4AF37]/40 transition-colors group"
                >
                  <card.icon className="w-6 h-6 text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-bold mb-2 flex items-center justify-between">
                    <span>{card.title}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed">{card.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {bookings.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#D4AF37]" />
                Jouw Recente Boekingen (Cloud Firestore)
              </h2>
              <div className="space-y-3">
                {bookings.map((b, i) => {
                  const m = members.find((mm) => mm.id === b.memberId)
                  return (
                    <div key={i} className="glass-card rounded-xl px-5 py-4 flex items-center justify-between">
                      <div>
                        <span className="text-white font-semibold text-sm">{m?.name ?? b.memberId}</span>
                        <span className="text-white/40 text-xs ml-3">{b.date}</span>
                      </div>
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          b.status === 'bevestigd' ? 'text-[#D4AF37]' : 'text-white/50'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
