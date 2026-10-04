import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Sparkles, Zap, Crown } from 'lucide-react'
import PageHero from '../components/PageHero'
import { usePlatform } from '../lib/usePlatform'
import type { Tier } from '../lib/data'

const tiers: { key: Tier; icon: typeof Zap; name: string; desc: string; credits: number }[] = [
  { key: 'start', icon: Sparkles, name: 'Start', desc: 'Basis toegang tot het platform en het netwerk.', credits: 1000 },
  { key: 'groei', icon: Zap, name: 'Groei', desc: 'Meer credits, tools en netwerk-introducties.', credits: 3000 },
  { key: 'pro', icon: Crown, name: 'Pro', desc: 'Volledige toegang, dedicated strateeg en priority.', credits: 8000 },
]

export default function Login() {
  const { login, user } = usePlatform()
  const navigate = useNavigate()
  const [tier, setTier] = useState<Tier>('groei')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  if (user) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    login(tier, name || 'Demo Artiest', email || `demo.${tier}@zheavenzy.nl`)
    navigate('/dashboard')
  }

  return (
    <>
      <PageHero
        eyebrow="Ledenplatform"
        title={
          <>
            Log in op je <span className="text-gradient-gold">account.</span>
          </>
        }
        description="Kies een demo-account om het platform te verkennen: leden vinden, boeken, credits en berichten."
        minHeight="min-h-[50vh]"
      />

      <section className="py-20 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <form onSubmit={submit} className="glass-card rounded-3xl p-8 md:p-10 space-y-8">
            <div>
              <label className="block text-white/60 text-sm mb-3">Kies je account-type</label>
              <div className="grid sm:grid-cols-3 gap-3">
                {tiers.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTier(t.key)}
                    className={`rounded-2xl border p-5 text-left transition-all ${
                      tier === t.key
                        ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10'
                        : 'border-white/10 bg-[#111] hover:border-white/25'
                    }`}
                  >
                    <t.icon className={`w-5 h-5 mb-3 ${tier === t.key ? 'text-[#D4AF37]' : 'text-white/40'}`} />
                    <div className="text-white font-bold text-sm">{t.name}</div>
                    <div className="text-white/40 text-xs mt-1 leading-relaxed">{t.desc}</div>
                    <div className="text-[#D4AF37] text-xs font-semibold mt-3">{t.credits.toLocaleString('nl-NL')} credits</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/60 text-sm mb-2">Naam</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jouw naam"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jouw@email.nl"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full btn-gold glow-gold flex items-center justify-center gap-2 py-4"
            >
              <LogIn className="w-4 h-4" />
              Inloggen — {tiers.find((t) => t.key === tier)?.name} account
            </motion.button>
            <p className="text-white/30 text-xs text-center">
              Demo-omgeving: je gegevens blijven alleen in deze browser opgeslagen.
            </p>
          </form>
        </div>
      </section>
    </>
  )
}
