import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LogIn,
  Sparkles,
  Zap,
  Crown,
  ShieldCheck,
  User,
  Music2,
  Video,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import { usePlatform } from '../lib/usePlatform'
import type { Tier } from '../lib/data'

const tiers: { key: Tier; icon: typeof Zap; name: string; desc: string; credits: number }[] = [
  { key: 'start', icon: Sparkles, name: 'Start', desc: 'Basis toegang tot het platform en het netwerk.', credits: 1000 },
  { key: 'groei', icon: Zap, name: 'Groei', desc: 'Meer credits, tools en netwerk-introducties.', credits: 3000 },
  { key: 'pro', icon: Crown, name: 'Pro', desc: 'Volledige toegang, dedicated strateeg en priority.', credits: 8000 },
]

export default function Login() {
  const { login, loginWithGoogle, loginDemo, user } = usePlatform()
  const navigate = useNavigate()

  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [googleError, setGoogleError] = useState<string | null>(null)

  const [showCustomDemo, setShowCustomDemo] = useState(false)
  const [tier, setTier] = useState<Tier>('groei')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  if (user) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true)
    setGoogleError(null)

    const res = await loginWithGoogle()
    setLoadingGoogle(false)

    if (res.success) {
      navigate('/dashboard')
    } else if (res.error) {
      setGoogleError(res.error)
    }
  }

  const handleDemoSelect = (id: 'luna' | 'mara' | 'alex' | 'jamal') => {
    loginDemo(id)
    navigate('/dashboard')
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(tier, name || 'Demo Artiest', email || `demo.${tier}@zheavenzy.one`, {
      isDemo: true,
      provider: 'demo',
    })
    navigate('/dashboard')
  }

  return (
    <>
      <PageHero
        eyebrow="Ledenplatform & Authenticatie"
        title={
          <>
            Log in op <span className="text-gradient-gold">Zheavenzy.</span>
          </>
        }
        description="Log in via Google OAuth of verken het platform direct met een interactief demo-account voor normale gebruikers."
        minHeight="min-h-[45vh]"
      />

      <section className="py-16 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-3xl mx-auto px-6 md:px-12 space-y-8">
          {/* Foutmelding als Google login faalt */}
          {googleError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Google Inloggen niet voltooid</p>
                <p className="text-white/70 text-xs mt-1">{googleError}</p>
              </div>
            </motion.div>
          )}

          {/* Sectie 1: Google OAuth (Aanbevolen) */}
          <div className="glass-card rounded-3xl p-8 md:p-10 border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-2">
              <ShieldCheck className="w-4 h-4" />
              Officiële Toegang & Beheer
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Inloggen met Google</h2>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Gebruik je Google account om veilig in te loggen. Logt{' '}
              <strong className="text-white underline decoration-[#D4AF37]">info@jamaldrenthe.com</strong> in? Dan
              wordt direct het <span className="text-[#D4AF37] font-semibold">Administrator</span> profiel met volledige
              beheerrechten geactiveerd.
            </p>

            <button
              type="button"
              disabled={loadingGoogle}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-100 text-neutral-900 py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {loadingGoogle ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
                  <span>Google authenticatie openen...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Inloggen via Google OAuth</span>
                </>
              )}
            </button>
          </div>

          {/* Scheiding */}
          <div className="relative my-4 flex items-center justify-center">
            <span className="w-full border-t border-white/10" />
            <span className="bg-[#0a0a0a] px-4 text-xs uppercase tracking-widest text-white/40 font-medium">
              of verken met een demo account
            </span>
            <span className="w-full border-t border-white/10" />
          </div>

          {/* Sectie 2: Demo Accounts voor normale gebruikers */}
          <div className="glass-card rounded-3xl p-8 md:p-10 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
                <User className="w-4 h-4 text-[#D4AF37]" />
                Demo Accounts voor Normale Gebruikers
              </div>
              <h3 className="text-xl font-bold text-white">Direct testen zonder inloggegevens</h3>
              <p className="text-white/40 text-xs mt-1">
                Kies een van de vooraf ingestelde profielen om direct door de community, kalender, berichten en credits te navigeren.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {/* Demo Artiest */}
              <button
                type="button"
                onClick={() => handleDemoSelect('luna')}
                className="group p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 text-left transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-3 group-hover:scale-105 transition-transform">
                  <Music2 className="w-5 h-5" />
                </div>
                <div className="text-white font-bold text-sm">Luna Voss</div>
                <div className="text-[#D4AF37] text-xs font-semibold mt-0.5">Pro Artiest</div>
                <p className="text-white/40 text-xs mt-2 line-clamp-2">R&B zangeres met live boekingen en 12.400 credits.</p>
                <div className="mt-3 text-[11px] text-white/60 font-medium flex items-center gap-1 group-hover:text-white">
                  <span>Start sessie</span> &rarr;
                </div>
              </button>

              {/* Demo Creator */}
              <button
                type="button"
                onClick={() => handleDemoSelect('mara')}
                className="group p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 text-left transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
                  <Video className="w-5 h-5" />
                </div>
                <div className="text-white font-bold text-sm">Mara Chen</div>
                <div className="text-purple-400 text-xs font-semibold mt-0.5">Groei Creator</div>
                <p className="text-white/40 text-xs mt-2 line-clamp-2">Videograaf & visual maker met 4.500 credits.</p>
                <div className="mt-3 text-[11px] text-white/60 font-medium flex items-center gap-1 group-hover:text-white">
                  <span>Start sessie</span> &rarr;
                </div>
              </button>

              {/* Demo Nieuw Lid */}
              <button
                type="button"
                onClick={() => handleDemoSelect('alex')}
                className="group p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 text-left transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-white font-bold text-sm">Alex Rivers</div>
                <div className="text-emerald-400 text-xs font-semibold mt-0.5">Start Lid</div>
                <p className="text-white/40 text-xs mt-2 line-clamp-2">Nieuw lid op zoek naar samenwerkingen (1.000 credits).</p>
                <div className="mt-3 text-[11px] text-white/60 font-medium flex items-center gap-1 group-hover:text-white">
                  <span>Start sessie</span> &rarr;
                </div>
              </button>
            </div>

            {/* Snelle Jamal Admin Demo knop */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleDemoSelect('jamal')}
                className="w-full py-2.5 px-4 rounded-xl border border-white/10 hover:border-[#D4AF37]/40 bg-white/[0.02] hover:bg-[#D4AF37]/5 text-white/60 hover:text-white text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Of test direct de Admin weergave (info@jamaldrenthe.com)</span>
              </button>
            </div>

            {/* Toggle voor custom demo profiel */}
            <div className="pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowCustomDemo(!showCustomDemo)}
                className="w-full flex items-center justify-between text-xs text-white/50 hover:text-white transition-colors py-2"
              >
                <span>Aangepast demo-profiel configureren (eigen naam / tier)</span>
                {showCustomDemo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showCustomDemo && (
                <form onSubmit={handleCustomSubmit} className="mt-4 space-y-6 pt-2">
                  <div>
                    <label className="block text-white/60 text-xs mb-2">Kies demo tier</label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {tiers.map((t) => (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setTier(t.key)}
                          className={`rounded-xl border p-4 text-left transition-all ${
                            tier === t.key
                              ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10'
                              : 'border-white/10 bg-[#111] hover:border-white/25'
                          }`}
                        >
                          <t.icon className={`w-4 h-4 mb-2 ${tier === t.key ? 'text-[#D4AF37]' : 'text-white/40'}`} />
                          <div className="text-white font-bold text-xs">{t.name}</div>
                          <div className="text-[#D4AF37] text-[11px] font-semibold mt-1">
                            {t.credits.toLocaleString('nl-NL')} credits
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 text-xs mb-1.5">Naam</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="bijv. Jordan Smith"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs mb-1.5">E-mail</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="bijv. jordan@zheavenzy.one"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-outline flex items-center justify-center gap-2 py-3 text-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Inloggen als {tiers.find((t) => t.key === tier)?.name}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
