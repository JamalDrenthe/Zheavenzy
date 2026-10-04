import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Coins, CalendarCheck } from 'lucide-react'
import PageHero from '../components/PageHero'
import { usePlatform } from '../lib/usePlatform'
import { members, roleLabel, type Role } from '../lib/data'

const filters: { key: Role | 'alle'; label: string }[] = [
  { key: 'alle', label: 'Alle' },
  { key: 'artiest', label: 'Artiesten' },
  { key: 'camera', label: 'Camera' },
  { key: 'designer', label: 'Designers' },
  { key: 'stylist', label: 'Stylisten' },
]

export default function Leden() {
  const { user } = usePlatform()
  const [filter, setFilter] = useState<Role | 'alle'>('alle')

  if (!user) return <Navigate to="/login" replace />

  const shown = filter === 'alle' ? members : members.filter((m) => m.role === filter)

  return (
    <>
      <PageHero
        eyebrow="Het Netwerk"
        title={
          <>
            Vind wie je <span className="text-gradient-gold">nodig hebt.</span>
          </>
        }
        description="Artiesten, cameramensen, designers en stylisten — bekijk hun profiel, check hun beschikbaarheid en werk direct samen."
        minHeight="min-h-[50vh]"
      />

      <section className="py-16 bg-[#0a0a0a] border-y border-white/5 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap gap-3 mb-10">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === f.key
                    ? 'bg-[#D4AF37] text-[#050505]'
                    : 'bg-[#111] border border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {shown.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/leden/${m.id}`} className="glass-card rounded-2xl p-6 block h-full hover:border-[#D4AF37]/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] font-bold mb-4">
                    {m.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="text-[#D4AF37]/70 text-[10px] font-bold uppercase tracking-[0.2em]">{roleLabel(m.role)}</div>
                  <h3 className="text-white font-bold mt-1">{m.name}</h3>
                  <p className="text-white/40 text-xs mt-1 mb-4">{m.tagline}</p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                      {m.stars.toFixed(1)}
                      <span className="text-white/30 ml-1">skill-rating</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {m.credits.toLocaleString('nl-NL')} credits
                    </div>
                    <div className="flex items-center gap-1.5 text-white/60">
                      <CalendarCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {m.directBook ? 'Direct te boeken' : 'Boeking op aanvraag'}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 text-[#D4AF37] text-xs font-semibold">
                    {m.costPerDay} credits / dag
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
