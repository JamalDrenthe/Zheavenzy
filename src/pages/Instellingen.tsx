import { useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  Camera,
  CheckCircle2,
  Save,
  Music2,
  Video,
  Palette,
  Sparkles,
  Zap,
  Crown,
  RefreshCw,
  ShieldCheck,
  Tag,
  Loader2,
  Database,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import { usePlatform } from '../lib/usePlatform'
import { roleConfigs, type Role, type Tier } from '../lib/data'

const rolesList: { key: Role; label: string; icon: typeof Music2; desc: string }[] = [
  { key: 'artiest', label: 'Artiest / Muzikant', icon: Music2, desc: 'Zangers, rappers & producers' },
  { key: 'camera', label: 'Camera & Video', icon: Video, desc: 'Videografen & clipmakers' },
  { key: 'designer', label: 'Graphic Designer', icon: Palette, desc: 'Artwork, covers & visuals' },
  { key: 'stylist', label: 'Stylist & Mode', icon: Sparkles, desc: 'Wardrobe & podium image' },
]

const tiersList: { key: Tier; icon: typeof Zap; name: string; desc: string }[] = [
  { key: 'start', icon: Sparkles, name: 'Start', desc: '2 releases/jaar, basis netwerk' },
  { key: 'groei', icon: Zap, name: 'Groei', desc: '6 releases/jaar, playlist pitching' },
  { key: 'pro', icon: Crown, name: 'Pro', desc: 'Onbeperkt releases, priority support' },
]

export default function Instellingen() {
  const {
    user,
    updateProfile,
    setRole,
    setTier,
    tierLabel,
    roleLabel,
    syncWithFirestore,
    syncing,
    lastSyncTime,
  } = usePlatform()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [tagline, setTagline] = useState(user?.tagline ?? '')
  const [servicesInput, setServicesInput] = useState((user?.services ?? []).join(', '))
  const [selectedRole, setSelectedRole] = useState<Role>(user?.role ?? 'artiest')
  const [selectedTier, setSelectedTier] = useState<Tier>(user?.tier ?? 'groei')
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!user) return <Navigate to="/login" replace />

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateProfile({ avatar: reader.result as string })
    reader.readAsDataURL(file)
  }

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role)
    setRole(role)
    setTagline(roleConfigs[role].title)
    setServicesInput(roleConfigs[role].defaultServices.join(', '))
  }

  const handleTierChange = (tier: Tier) => {
    setSelectedTier(tier)
    setTier(tier)
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const servicesList = servicesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    updateProfile({
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      bio,
      tagline: tagline.trim() || roleConfigs[selectedRole].title,
      services: servicesList.length > 0 ? servicesList : roleConfigs[selectedRole].defaultServices,
      role: selectedRole,
      tier: selectedTier,
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  return (
    <>
      <PageHero
        eyebrow="Account & Instellingen"
        title={
          <>
            Jouw <span className="text-gradient-gold">profiel & instellingen.</span>
          </>
        }
        description="Pas je creatieve discipline, lidmaatschap, bio en diensten aan. Wijzigingen worden direct gesynchroniseerd met Cloud Firestore."
        minHeight="min-h-[40vh]"
      />

      <section className="py-12 md:py-16 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 space-y-8">
          {/* Firestore Sync Status Bar */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="text-white text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <span>Firebase Cloud Firestore Verbonden</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-white/40 text-[11px] mt-0.5">
                  {lastSyncTime
                    ? `Laatste synchronisatie: ${new Date(lastSyncTime).toLocaleTimeString('nl-NL')}`
                    : 'Real-time database verbinding actief'}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={syncing}
              onClick={() => syncWithFirestore()}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {syncing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                  <span>Synchroniseren...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Firestore Sync</span>
                </>
              )}
            </button>
          </div>

          {/* Profielfoto Kaart */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-white/10">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative w-24 h-24 rounded-2xl bg-[#D4AF37]/10 border-2 border-[#D4AF37]/40 flex items-center justify-center overflow-hidden group shrink-0 shadow-lg shadow-[#D4AF37]/10"
            >
              {user.avatar ? (
                <img src={user.avatar} alt="Profielfoto" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#D4AF37] font-bold text-3xl">{initials}</span>
              )}
              <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-white gap-1">
                <Camera className="w-5 h-5 text-[#D4AF37]" />
                <span>Wijzigen</span>
              </span>
            </button>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                  {roleLabel(user.role)}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/5 text-white/70 border border-white/10">
                  {tierLabel(user.tier)} Tier
                </span>
                {user.isAdmin && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl">{user.name}</h3>
              <p className="text-white/40 text-xs mt-1">{user.email}</p>
              <p className="text-white/50 text-xs mt-2">
                Klik op de afbeelding om direct een nieuwe avatar of profielfoto te uploaden.
              </p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} className="hidden" />
          </div>

          {/* Formulier */}
          <form onSubmit={save} className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 space-y-8 border border-white/10">
            {/* Sectie 1: Creatieve Discipline (Role) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white text-sm font-bold uppercase tracking-wider">
                  Creatieve Discipline
                </label>
                <span className="text-white/40 text-xs">Bepaalt jouw positie in het netwerk</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {rolesList.map((r) => {
                  const Icon = r.icon
                  const isSelected = selectedRole === r.key
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => handleRoleChange(r.key)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-lg shadow-[#D4AF37]/10'
                          : 'border-white/10 bg-[#141414] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-[#D4AF37]' : 'text-white/40'}`} />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                      </div>
                      <div className="text-white font-bold text-sm">{r.label}</div>
                      <div className="text-white/40 text-xs mt-1 line-clamp-1">{r.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sectie 2: Lidmaatschap Tier */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white text-sm font-bold uppercase tracking-wider">
                  Lidmaatschap Tier
                </label>
                <span className="text-white/40 text-xs">Direct aanpassen in Firebase</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {tiersList.map((t) => {
                  const Icon = t.icon
                  const isSelected = selectedTier === t.key
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => handleTierChange(t.key)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-lg shadow-[#D4AF37]/10'
                          : 'border-white/10 bg-[#141414] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-[#D4AF37]' : 'text-white/40'}`} />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                      </div>
                      <div className="text-white font-bold text-sm">{t.name} Tier</div>
                      <div className="text-white/40 text-xs mt-1">{t.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sectie 3: Basisinformatie */}
            <div className="space-y-5 pt-4 border-t border-white/5">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Persoonlijke Gegevens</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-2">Naam</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-2">E-mailadres</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-xs font-semibold mb-2">Korte Tagline</label>
                <input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="bijv. R&B Zangeres & Vocal Producer"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-white/70 text-xs font-semibold mb-2">
                  Diensten & Vaardigheden (gescheiden door komma's)
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-white/30 absolute left-4 top-3.5" />
                  <input
                    value={servicesInput}
                    onChange={(e) => setServicesInput(e.target.value)}
                    placeholder="bijv. Studiozang, Writing camps, Track feature"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-xs font-semibold mb-2">
                  Bio (zichtbaar op je openbare netwerkprofiel)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Beschrijf je achtergrond, ervaring, apparatuur en projecten..."
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 resize-none text-sm leading-relaxed"
                />
              </div>
            </div>

            {/* Opslaan Knop & Bevestiging */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
              <button
                type="submit"
                className="btn-gold glow-gold flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Profiel Opslaan in Firestore</span>
              </button>

              {saved && (
                <p className="text-emerald-400 text-xs sm:text-sm font-semibold flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Succesvol opgeslagen en gesynchroniseerd in Cloud Firestore!</span>
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
