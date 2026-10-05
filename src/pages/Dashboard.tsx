import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, MessageSquare, Coins, UploadCloud, CalendarCheck, LogOut, ArrowRight, Settings, Bell, UserCheck, Heart } from 'lucide-react'
import { usePlatform } from '../lib/usePlatform'
import { members } from '../lib/data'

export default function Dashboard() {
  const { user, credits, bookings, uploads, messages, logout, tierLabel, following, friends, notifications } = usePlatform()

  if (!user) return <Navigate to="/login" replace />

  const cards = [
    { icon: Users, title: 'Leden vinden', desc: 'Artiesten, camera, designers en stylisten in het netwerk.', href: '/leden' },
    { icon: MessageSquare, title: 'Berichten', desc: `${Object.keys(messages).length} gesprek${Object.keys(messages).length === 1 ? '' : 'ken'} actief.`, href: '/berichten' },
    { icon: Coins, title: 'Credits', desc: 'Koop bundels of verdien credits met uploads.', href: '/credits' },
    { icon: UploadCloud, title: 'Kunst uploaden', desc: `Upload werk en verdien credits — ${uploads.length} upload${uploads.length === 1 ? '' : 's'} live.`, href: '/credits' },
    { icon: Bell, title: 'Notificaties', desc: `${notifications.filter((n) => !n.read).length} ongelezen update${notifications.filter((n) => !n.read).length === 1 ? '' : 's'}.`, href: '/notificaties' },
    { icon: Settings, title: 'Instellingen', desc: 'Accountgegevens, profielfoto en bio aanpassen.', href: '/instellingen' },
  ]

  return (
    <>
      <section className="relative bg-[#050505] pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.05)_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 bg-[#D4AF37]/5 text-[#D4AF37] text-xs font-semibold tracking-[0.2em] uppercase">
                Dashboard — {tierLabel(user.tier)} account
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mt-5">
                Welkom terug, <span className="text-gradient-gold">{user.name}.</span>
              </h1>
            </div>
            <button
              onClick={logout}
              className="btn-outline flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Uitloggen
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            <div className="glass-card rounded-2xl p-6">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Credits</div>
              <div className="text-3xl font-extrabold text-[#D4AF37]">{credits.toLocaleString('nl-NL')}</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Boekingen</div>
              <div className="text-3xl font-extrabold text-white">{bookings.length}</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Uploads op het platform</div>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={card.href} className="glass-card rounded-2xl p-6 block h-full hover:border-[#D4AF37]/30 transition-colors group">
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
                      <span className={`text-xs font-bold uppercase tracking-wider ${b.status === 'bevestigd' ? 'text-[#D4AF37]' : 'text-white/50'}`}>
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
