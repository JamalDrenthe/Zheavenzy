import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Coins, MessageSquare, CalendarCheck, CheckCircle2, ArrowLeft } from 'lucide-react'
import { usePlatform } from '../lib/usePlatform'
import { members, roleLabel, dayLabel, dayISO } from '../lib/data'

const dayOffsets = Array.from({ length: 14 }, (_, i) => i)

export default function Lid() {
  const { id } = useParams()
  const { user, requestBooking, bookings } = usePlatform()
  const [selected, setSelected] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  const member = members.find((m) => m.id === id)
  if (!user) return <Navigate to="/login" replace />
  if (!member) return <Navigate to="/leden" replace />

  const myBookings = bookings.filter((b) => b.memberId === member.id)

  const book = () => {
    if (selected === null) return
    requestBooking(member.id, dayISO(selected))
    setDone(true)
    setSelected(null)
  }

  return (
    <>
      <section className="relative bg-[#050505] pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.05)_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <Link to="/leden" className="text-white/40 text-xs hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1.5 mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Terug naar leden
          </Link>
          <div className="flex flex-wrap items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold text-2xl">
              {member.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="text-[#D4AF37]/70 text-[10px] font-bold uppercase tracking-[0.2em]">{roleLabel(member.role)}</div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mt-1">{member.name}</h1>
              <p className="text-white/50 mt-1">{member.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-8">
          {/* Profiel */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8">
              <div className="flex flex-wrap gap-6 mb-6">
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Skill-rating</div>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(member.stars) ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-white/20'}`}
                      />
                    ))}
                    <span className="text-white font-bold ml-1">{member.stars.toFixed(1)}</span>
                  </div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Credits-saldo</div>
                  <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold">
                    <Coins className="w-4 h-4" />
                    {member.credits.toLocaleString('nl-NL')}
                  </div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Werken met {member.name.split(' ')[0]}</div>
                  <div className="text-white font-bold">{member.costPerDay} credits / dag</div>
                </div>
              </div>

              <h2 className="text-white font-bold mb-3">Over {member.name.split(' ')[0]}</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6">{member.bio}</p>

              <h3 className="text-white font-bold mb-3 text-sm">Diensten</h3>
              <div className="flex flex-wrap gap-2">
                {member.services.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Kalender */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-8">
              <h2 className="text-white font-bold mb-1 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#D4AF37]" />
                Beschikbaarheid
              </h2>
              <p className="text-white/40 text-xs mb-5">
                {member.directBook ? 'Direct boeken staat aan — kies een dag.' : 'Deze professional werkt op aanvraag — kies een dag om een aanvraag te sturen.'}
              </p>
              <div className="grid grid-cols-7 gap-2">
                {dayOffsets.map((o) => {
                  const free = member.available.includes(o)
                  const isSel = selected === o
                  return (
                    <button
                      key={o}
                      disabled={!free}
                      onClick={() => setSelected(isSel ? null : o)}
                      className={`rounded-lg py-3 text-center text-xs font-medium transition-all ${
                        isSel
                          ? 'bg-[#D4AF37] text-[#050505] font-bold'
                          : free
                            ? 'bg-[#1a1a1a] border border-[#D4AF37]/20 text-white/80 hover:border-[#D4AF37]/60'
                            : 'bg-[#0d0d0d] text-white/20 cursor-not-allowed'
                      }`}
                    >
                      {dayLabel(o)}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={book}
                disabled={selected === null}
                className="w-full btn-gold glow-gold mt-6 py-3.5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {member.directBook ? 'Boek direct' : 'Stuur boekingsaanvraag'}
                {selected !== null ? ` — ${dayLabel(selected)}` : ''}
              </button>
              {done && (
                <p className="text-[#D4AF37] text-xs font-semibold mt-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {member.directBook ? 'Boeking bevestigd! Ook te zien in je dashboard en berichten.' : 'Aanvraag verstuurd! Je krijgt bericht zodra er gereageerd is.'}
                </p>
              )}
              {myBookings.length > 0 && (
                <div className="mt-5 pt-5 border-t border-white/10 space-y-2">
                  {myBookings.map((b, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-white/60">{b.date}</span>
                      <span className={`font-bold uppercase tracking-wider ${b.status === 'bevestigd' ? 'text-[#D4AF37]' : 'text-white/40'}`}>{b.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Acties */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-8">
              <h3 className="text-white font-bold mb-4">Direct contact</h3>
              <p className="text-white/40 text-xs leading-relaxed mb-5">
                Stuur {member.name.split(' ')[0]} een direct bericht via het platform om samenwerking te bespreken.
              </p>
              <Link
                to={`/berichten?to=${member.id}`}
                className="btn-outline w-full flex items-center justify-center gap-2 py-3.5"
              >
                <MessageSquare className="w-4 h-4" />
                Stuur een bericht
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-8">
              <h3 className="text-white font-bold mb-3 text-sm">Zo werkt samenwerken</h3>
              <ul className="space-y-3 text-xs text-white/50 leading-relaxed">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" /> Boek of stuur een aanvraag met de kalender</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" /> Betaal met credits — {member.costPerDay} per dag</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" /> Bespreek details via direct messages</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
