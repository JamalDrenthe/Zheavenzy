import { useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Camera, CheckCircle2, Save } from 'lucide-react'
import PageHero from '../components/PageHero'
import { usePlatform } from '../lib/usePlatform'

export default function Instellingen() {
  const { user, updateProfile, tierLabel } = usePlatform()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
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

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ name: name.trim() || user.name, email: email.trim() || user.email, bio })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)

  return (
    <>
      <PageHero
        eyebrow="Instellingen"
        title={
          <>
            Jouw <span className="text-gradient-gold">account.</span>
          </>
        }
        description="Beheer je accountgegevens, profielfoto en openbare bio."
        minHeight="min-h-[40vh]"
      />

      <section className="py-16 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-3xl mx-auto px-6 md:px-12 space-y-6">
          {/* Profielfoto */}
          <div className="glass-card rounded-2xl p-8 flex items-center gap-6">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative w-20 h-20 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center overflow-hidden group shrink-0"
            >
              {user.avatar ? (
                <img src={user.avatar} alt="Profielfoto" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#D4AF37] font-bold text-2xl">{initials}</span>
              )}
              <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </span>
            </button>
            <div>
              <h3 className="text-white font-bold">Profielfoto</h3>
              <p className="text-white/40 text-xs mt-1">Klik op de foto om een nieuwe te kiezen.</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} className="hidden" />
          </div>

          {/* Accountgegevens */}
          <form onSubmit={save} className="glass-card rounded-2xl p-8 space-y-5">
            <h3 className="text-white font-bold">Accountgegevens</h3>
            <div className="text-[#D4AF37]/70 text-[10px] font-bold uppercase tracking-[0.2em]">
              {tierLabel(user.tier)} account
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Naam</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Bio — zichtbaar op je profiel</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Vertel wie je bent en wat je doet..."
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 resize-none"
              />
            </div>
            <button type="submit" className="btn-gold glow-gold flex items-center gap-2 px-6 py-3">
              <Save className="w-4 h-4" />
              Opslaan
            </button>
            {saved && (
              <p className="text-[#D4AF37] text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Opgeslagen.
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  )
}
