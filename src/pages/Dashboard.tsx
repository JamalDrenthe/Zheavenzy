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
} from 'lucide-react'
import { usePlatform } from '../lib/usePlatform'
import { firebaseConfig } from '../lib/firebase'
import { members } from '../lib/data'

export default function Dashboard() {
  const {
    user,
    credits,
    bookings,
    uploads,
    messages,
    logout,
    tierLabel,
    following,
    friends,
    notifications,
  } = usePlatform()

  if (!user) return <Navigate to="/login" replace />

  const cards = [
    { icon: Users, title: 'Leden vinden', desc: 'Artiesten, camera, designers en stylisten in het netwerk.', href: '/leden' },
    { icon: MessageSquare, title: 'Berichten', desc: `${Object.keys(messages).length} gesprek${Object.keys(messages).length === 1 ? '' : 'ken'} actief.`, href: '/berichten' },
    { icon: Coins, title: 'Credits', desc: 'Koop bundels of verdien credits met uploads.', href: '/credits' },
    { icon: UploadCloud, title: 'Kunst uploaden', desc: `Upload werk en verdien credits. ${uploads.length} upload${uploads.length === 1 ? '' : 's'} live.`, href: '/credits' },
    { icon: Bell, title: 'Notificaties', desc: `${notifications.filter((n) => !n.read).length} ongelezen update${notifications.filter((n) => !n.read).length === 1 ? '' : 's'}.`, href: '/notificaties' },
    { icon: Settings, title: 'Instellingen', desc: 'Accountgegevens, profielfoto en bio aanpassen.', href: '/instellingen' },
  ]

  return (
    <>
      <section className="relative bg-[#050505] pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          {/* Header Row */}
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-5">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl border-2 border-[#D4AF37] object-cover shadow-lg shadow-[#D4AF37]/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                  {user.isAdmin ? <Crown className="w-8 h-8" /> : <Users className="w-7 h-7" />}
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {user.isAdmin ? (
                    <span className="inline-flex items-center gap-1.5 border border-[#D4AF37] rounded-full px-3.5 py-1 bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-bold tracking-[0.15em] uppercase shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                      <Crown className="w-3.5 h-3.5" />
                      Administrator
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 border border-[#D4AF37]/30 rounded-full px-3 py-1 bg-[#D4AF37]/5 text-[#D4AF37] text-xs font-semibold tracking-[0.15em] uppercase">
                      {tierLabel(user.tier)} Lidmaatschap
                    </span>
                  )}

                  {user.isDemo && (
                    <span className="inline-flex items-center gap-1 border border-white/20 rounded-full px-2.5 py-0.5 bg-white/5 text-white/60 text-[10px] font-medium tracking-wider uppercase">
                      Demo Account
                    </span>
                  )}

                  {user.provider === 'google' && (
                    <span className="inline-flex items-center gap-1 border border-blue-500/30 rounded-full px-2.5 py-0.5 bg-blue-500/10 text-blue-300 text-[10px] font-medium tracking-wider uppercase">
                      Google OAuth
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                  Welkom terug, <span className="text-gradient-gold">{user.name}</span>
                </h1>
                <p className="text-white/40 text-xs mt-1 font-mono">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user.isDemo && (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs border border-white/10 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Wissel Account
                </Link>
              )}
              <button onClick={logout} className="btn-outline flex items-center gap-2 text-sm">
                <LogOut className="w-4 h-4" />
                Uitloggen
              </button>
            </div>
          </div>

          {/* Speciale Administrator Status Banner */}
          {user.isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-[#D4AF37]/15 via-black to-[#D4AF37]/5 border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Admin Beheerspaneel Geactiveerd
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Volledige toegang tot Zheavenzy & achterliggende infrastructuur
                  </h3>
                  <p className="text-white/60 text-xs mt-1 max-w-2xl">
                    Je bent geverifieerd als hoofdbeheerder via <strong className="text-white font-mono">{user.email}</strong>. Alle admin rechten, data-beheer en deployment statussen zijn actief.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase font-mono">
                      <Server className="w-3 h-3 text-emerald-400" /> Vercel Live
                    </div>
                    <div className="text-white font-semibold mt-1">zheavenzy.one</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase font-mono">
                      <KeyRound className="w-3 h-3 text-[#D4AF37]" /> Firebase
                    </div>
                    <div className="text-white font-semibold mt-1">{firebaseConfig.projectId}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase font-mono">
                      <GitBranch className="w-3 h-3 text-blue-400" /> Git Push
                    </div>
                    <div className="text-white font-semibold mt-1">main (Klaar)</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
            <div className="glass-card rounded-2xl p-6">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Credits Saldo</div>
              <div className="text-3xl font-extrabold text-[#D4AF37]">{credits.toLocaleString('nl-NL')}</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Boekingen</div>
              <div className="text-3xl font-extrabold text-white">{bookings.length}</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Uploads</div>
              <div className="text-3xl font-extrabold text-white">{uploads.length}</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#D4AF37]" /> Volgend
              </div>
              <div className="text-3xl font-extrabold text-white">{following.length}</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Vrienden
              </div>
              <div className="text-3xl font-extrabold text-white">{friends.length}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={card.href}
                  className="glass-card rounded-2xl p-6 block h-full hover:border-[#D4AF37]/30 transition-colors group"
                >
                  <card.icon className="w-6 h-6 text-[#D4AF37] mb-4" />
                  <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    {card.title}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed">{card.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {bookings.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#D4AF37]" />
                Jouw boekingen
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
