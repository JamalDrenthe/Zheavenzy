import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogIn,
  Sparkles,
  Zap,
  Crown,
  ShieldCheck,
  User,
  Music2,
  Video,
  Palette,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Mail,
  KeyRound,
  UserPlus,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import { LogoIcon } from '../components/Logo'
import { usePlatform } from '../lib/usePlatform'
import type { Role, Tier } from '../lib/data'

const tiers: { key: Tier; icon: typeof Zap; name: string; desc: string; credits: number }[] = [
  { key: 'start', icon: Sparkles, name: 'Start', desc: 'Basis toegang en 1.000 credits starttegoed.', credits: 1000 },
  { key: 'groei', icon: Zap, name: 'Groei', desc: 'Meest gekozen: 3.000 credits, tools & netwerk.', credits: 3000 },
  { key: 'pro', icon: Crown, name: 'Pro', desc: 'Volledige priority, 8.000 credits & dedicated team.', credits: 8000 },
]

const rolesList: { key: Role; label: string; icon: typeof Music2; desc: string }[] = [
  { key: 'artiest', label: 'Artiest / Muzikant', icon: Music2, desc: 'Zangers, rappers & producers' },
  { key: 'camera', label: 'Camera & Video', icon: Video, desc: 'Videografen & clipmakers' },
  { key: 'designer', label: 'Graphic Designer', icon: Palette, desc: 'Artwork, covers & visuals' },
  { key: 'stylist', label: 'Stylist & Mode', icon: Sparkles, desc: 'Wardrobe & podium image' },
]

export default function Login() {
  const { loginWithGoogle, loginWithEmail, loginDemo, user } = usePlatform()
  const navigate = useNavigate()

  const [authMode, setAuthMode] = useState<'oauth' | 'email'>('oauth')
  const [isRegister, setIsRegister] = useState(false)

  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Formulier state voor e-mail authenticatie & profielconfiguratie
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [selectedRole, setSelectedRole] = useState<Role>('artiest')
  const [selectedTier, setSelectedTier] = useState<Tier>('groei')

  if (user) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true)
    setErrorMsg(null)

    const res = await loginWithGoogle()
    setLoadingGoogle(false)

    if (res.success) {
      navigate('/dashboard')
    } else if (res.error) {
      setErrorMsg(res.error)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Vul een geldig e-mailadres en wachtwoord in.')
      return
    }

    setLoadingEmail(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    const res = await loginWithEmail(email.trim(), password, isRegister, {
      name: name.trim() || (isRegister ? email.split('@')[0] : undefined),
      role: selectedRole,
      tier: selectedTier,
    })

    setLoadingEmail(false)

    if (res.success) {
      setSuccessMsg(isRegister ? 'Account succesvol aangemaakt in Firebase.' : 'Succesvol ingelogd.')
      setTimeout(() => navigate('/dashboard'), 600)
    } else if (res.error) {
      setErrorMsg(res.error)
    }
  }

  const handleDemoSelect = (id: 'luna' | 'mara' | 'alex' | 'jamal') => {
    loginDemo(id)
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
        description="Beheer je muziekcarrière, distributie, credits en netwerk met volledige Cloud Firestore synchronisatie."
        minHeight="min-h-[40vh]"
      />

      <section className="py-12 md:py-16 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 space-y-8">
          {/* Fout- of succesmelding */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Authenticatiefout</p>
                  <p className="text-white/70 text-xs mt-1">{errorMsg}</p>
                </div>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Succes</p>
                  <p className="text-white/70 text-xs mt-1">{successMsg}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mode Switcher Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-2xl bg-[#141414] border border-white/10 p-1.5 gap-1.5 w-full max-w-md">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('oauth')
                  setErrorMsg(null)
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  authMode === 'oauth'
                    ? 'bg-[#D4AF37] text-neutral-950 shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Google & Demo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('email')
                  setErrorMsg(null)
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  authMode === 'email'
                    ? 'bg-[#D4AF37] text-neutral-950 shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>E-mail & Wachtwoord</span>
              </button>
            </div>
          </div>

          {authMode === 'oauth' ? (
            <div className="space-y-8">
              {/* Google OAuth Kaart */}
              <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" />
                    Officiële Firebase Toegang
                  </div>
                  <LogoIcon size={36} className="opacity-95" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Inloggen met Google</h2>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  Log direct in met je Google-account. Alle profielgegevens, releases, boekingen en credits worden
                  in real-time bewaard en gesynchroniseerd via Cloud Firestore.
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
                      <span>Google authenticatie initialiseren...</span>
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
                <span className="bg-[#0a0a0a] px-4 text-xs uppercase tracking-widest text-white/40 font-medium whitespace-nowrap">
                  of verken met een accounttype
                </span>
                <span className="w-full border-t border-white/10" />
              </div>

              {/* Demo Accounts per Type */}
              <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    Interactieve Demo Accounts
                  </div>
                  <h3 className="text-xl font-bold text-white">Direct testen per creatieve discipline</h3>
                  <p className="text-white/40 text-xs mt-1">
                    Kies een voorgedefinieerd profiel om de community, berichten, uploads en boekingen direct te ervaren.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Luna Voss (Artiest) */}
                  <button
                    type="button"
                    onClick={() => handleDemoSelect('luna')}
                    className="group p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 text-left transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-3 group-hover:scale-105 transition-transform">
                        <Music2 className="w-5 h-5" />
                      </div>
                      <div className="text-white font-bold text-sm">Luna Voss</div>
                      <div className="text-[#D4AF37] text-xs font-semibold mt-0.5">Artiest • Pro</div>
                      <p className="text-white/40 text-xs mt-2 line-clamp-2">
                        R&B/Soul artieste met releases, masterrechten en 12.400 credits.
                      </p>
                    </div>
                    <div className="mt-4 text-[11px] text-white/60 font-medium flex items-center gap-1 group-hover:text-white">
                      <span>Start sessie</span> &rarr;
                    </div>
                  </button>

                  {/* Mara Chen (Camera) */}
                  <button
                    type="button"
                    onClick={() => handleDemoSelect('mara')}
                    className="group p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 text-left transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
                        <Video className="w-5 h-5" />
                      </div>
                      <div className="text-white font-bold text-sm">Mara Chen</div>
                      <div className="text-purple-400 text-xs font-semibold mt-0.5">Camera • Groei</div>
                      <p className="text-white/40 text-xs mt-2 line-clamp-2">
                        Videograaf & clipmaker met Sony FX6 setup en 4.500 credits.
                      </p>
                    </div>
                    <div className="mt-4 text-[11px] text-white/60 font-medium flex items-center gap-1 group-hover:text-white">
                      <span>Start sessie</span> &rarr;
                    </div>
                  </button>

                  {/* Alex Rivers (Designer) */}
                  <button
                    type="button"
                    onClick={() => handleDemoSelect('alex')}
                    className="group p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-left transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                        <Palette className="w-5 h-5" />
                      </div>
                      <div className="text-white font-bold text-sm">Alex Rivers</div>
                      <div className="text-emerald-400 text-xs font-semibold mt-0.5">Designer • Start</div>
                      <p className="text-white/40 text-xs mt-2 line-clamp-2">
                        Cover artwork en Spotify visuals ontwerper met 1.000 credits.
                      </p>
                    </div>
                    <div className="mt-4 text-[11px] text-white/60 font-medium flex items-center gap-1 group-hover:text-white">
                      <span>Start sessie</span> &rarr;
                    </div>
                  </button>

                  {/* Jamal Admin */}
                  <button
                    type="button"
                    onClick={() => handleDemoSelect('jamal')}
                    className="group p-5 rounded-2xl bg-white/[0.03] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-left transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-3 group-hover:scale-105 transition-transform">
                        <Crown className="w-5 h-5" />
                      </div>
                      <div className="text-white font-bold text-sm">Admin Beheer</div>
                      <div className="text-[#D4AF37] text-xs font-semibold mt-0.5">Administrator • Pro</div>
                      <p className="text-white/40 text-xs mt-2 line-clamp-2">
                        Volledige beheerrechten over Firestore, accounts en credits (50.000).
                      </p>
                    </div>
                    <div className="mt-4 text-[11px] text-white/60 font-medium flex items-center gap-1 group-hover:text-white">
                      <span>Start beheer</span> &rarr;
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* E-mail & Wachtwoord Authenticatie & Profielconfiguratie */
            <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {isRegister ? 'Nieuw Account Registreren' : 'Inloggen met E-mail'}
                  </h2>
                  <p className="text-white/50 text-xs sm:text-sm mt-1">
                    {isRegister
                      ? 'Configureer je creatieve discipline en lidmaatschap in Firebase.'
                      : 'Voer je inloggegevens in om direct verbinding te maken.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-xs text-[#D4AF37] hover:underline font-semibold"
                >
                  {isRegister ? 'Al een account? Inloggen' : 'Geen account? Registreren'}
                </button>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-6">
                {isRegister && (
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
                      Volledige Naam of Artiestennaam
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="bijv. Jordan Blake"
                      className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37]/60"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
                      E-mailadres
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-white/40 absolute left-4 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="naam@voorbeeld.nl"
                        className="w-full bg-[#141414] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37]/60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
                      Wachtwoord
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-white/40 absolute left-4 top-3.5" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimaal 6 tekens"
                        className="w-full bg-[#141414] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37]/60"
                      />
                    </div>
                  </div>
                </div>

                {isRegister && (
                  <div className="space-y-6 pt-2 border-t border-white/5">
                    {/* Selectie Creatieve Discipline (Role) */}
                    <div>
                      <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
                        Kies je Creatieve Discipline
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {rolesList.map((r) => {
                          const Icon = r.icon
                          const selected = selectedRole === r.key
                          return (
                            <button
                              key={r.key}
                              type="button"
                              onClick={() => setSelectedRole(r.key)}
                              className={`p-3.5 rounded-xl border text-left transition-all ${
                                selected
                                  ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                  : 'border-white/10 bg-[#141414] hover:border-white/20'
                              }`}
                            >
                              <Icon className={`w-4 h-4 mb-2 ${selected ? 'text-[#D4AF37]' : 'text-white/40'}`} />
                              <div className="text-white font-bold text-xs">{r.label}</div>
                              <div className="text-white/40 text-[10px] mt-1 line-clamp-1">{r.desc}</div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Selectie Lidmaatschap Tier */}
                    <div>
                      <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
                        Kies je Lidmaatschap Tier
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {tiers.map((t) => {
                          const Icon = t.icon
                          const selected = selectedTier === t.key
                          return (
                            <button
                              key={t.key}
                              type="button"
                              onClick={() => setSelectedTier(t.key)}
                              className={`p-3.5 rounded-xl border text-left transition-all ${
                                selected
                                  ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                  : 'border-white/10 bg-[#141414] hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <Icon className={`w-4 h-4 ${selected ? 'text-[#D4AF37]' : 'text-white/40'}`} />
                                <span className="text-[#D4AF37] text-[10px] font-bold">
                                  {t.credits.toLocaleString('nl-NL')} credits
                                </span>
                              </div>
                              <div className="text-white font-bold text-xs">{t.name}</div>
                              <div className="text-white/40 text-[10px] mt-0.5">{t.desc}</div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loadingEmail}
                  className="w-full btn-gold glow-gold flex items-center justify-center gap-2 py-3.5 text-sm font-bold disabled:opacity-50"
                >
                  {loadingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Verwerken in Firebase...</span>
                    </>
                  ) : isRegister ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Account Aanmaken & Opslaan</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Inloggen met E-mail</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
