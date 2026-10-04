import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Coins, UploadCloud, CheckCircle2 } from 'lucide-react'
import PageHero from '../components/PageHero'
import { usePlatform } from '../lib/usePlatform'
import { creditBundles, uploadReward } from '../lib/data'

const workTypes = ['Track / nummer', 'Videoclip', 'Artwork / design', 'Beat / instrumental', 'Fotoserie']

export default function Credits() {
  const { user, credits, buyBundle, uploadWork, uploads } = usePlatform()
  const [title, setTitle] = useState('')
  const [type, setType] = useState(workTypes[0])
  const [bought, setBought] = useState<number | null>(null)
  const [uploaded, setUploaded] = useState(false)

  if (!user) return <Navigate to="/login" replace />

  const upload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    uploadWork(title.trim(), type)
    setTitle('')
    setUploaded(true)
  }

  return (
    <>
      <PageHero
        eyebrow="Credits"
        title={
          <>
            Betaal en verdien in <span className="text-gradient-gold">credits.</span>
          </>
        }
        description="Credits zijn de munt van het platform: koop een bundel, of verdien credits door je kunsten te uploaden — die worden onderdeel van het label."
        minHeight="min-h-[50vh]"
      />

      <section className="py-16 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="glass-card rounded-2xl p-6 flex items-center justify-between mb-12 max-w-md">
            <span className="text-white/40 text-xs uppercase tracking-wider">Jouw saldo</span>
            <span className="text-3xl font-extrabold text-[#D4AF37] flex items-center gap-2">
              <Coins className="w-6 h-6" />
              {credits.toLocaleString('nl-NL')}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Credit-bundels</h2>
          <div className="grid sm:grid-cols-3 gap-5 mb-20">
            {creditBundles.map((b, i) => (
              <motion.div
                key={b.credits}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`glass-card rounded-2xl p-8 text-center relative ${b.best ? 'border-[#D4AF37]/40' : ''}`}
              >
                {b.best && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#050505] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {b.note}
                  </div>
                )}
                {!b.best && <div className="text-[#D4AF37]/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">{b.note}</div>}
                <div className="text-4xl font-extrabold text-white mt-2">{b.credits.toLocaleString('nl-NL')}</div>
                <div className="text-white/40 text-xs uppercase tracking-wider mb-1">credits</div>
                <div className="text-2xl font-bold text-[#D4AF37] my-4">{b.price}</div>
                <button
                  onClick={() => { buyBundle(b.credits); setBought(b.credits) }}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    b.best ? 'btn-gold glow-gold' : 'btn-outline'
                  }`}
                >
                  Koop bundel
                </button>
              </motion.div>
            ))}
          </div>
          {bought && (
            <p className="text-[#D4AF37] text-sm font-semibold -mt-14 mb-14 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {bought.toLocaleString('nl-NL')} credits toegevoegd aan je saldo.
            </p>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-8">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#D4AF37]" />
                Upload je kunst, verdien credits
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Elke upload levert <span className="text-[#D4AF37] font-semibold">+{uploadReward} credits</span> op — en je werk wordt onderdeel van het Zheavenzy-platform en label.
              </p>
              <form onSubmit={upload} className="space-y-4">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Titel van je werk</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Bijv. nieuwe single 'Midnight'"
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 appearance-none cursor-pointer"
                  >
                    {workTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="w-full btn-gold glow-gold py-3.5">
                  Upload & verdien +{uploadReward} credits
                </button>
                {uploaded && (
                  <p className="text-[#D4AF37] text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Upload ontvangen — +{uploadReward} credits, nu onderdeel van het platform.
                  </p>
                )}
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl p-8">
              <h3 className="text-white font-bold mb-4 text-sm">Jouw uploads op het platform</h3>
              {uploads.length === 0 ? (
                <p className="text-white/30 text-xs">Nog geen uploads. Jouw werk verschijnt hier — en in de catalogus van het label.</p>
              ) : (
                <div className="space-y-3">
                  {uploads.map((u, i) => (
                    <div key={i} className="flex items-center justify-between border border-white/10 rounded-xl px-4 py-3">
                      <div>
                        <div className="text-white font-semibold text-sm">{u.title}</div>
                        <div className="text-white/30 text-xs">{u.type} · {new Date(u.ts).toLocaleDateString('nl-NL')}</div>
                      </div>
                      <span className="text-[#D4AF37] text-xs font-bold">+{u.credits}</span>
                    </div>
                  ))}
                </div>
              )}
              <h3 className="text-white font-bold mt-8 mb-3 text-sm">Zo werken credits</h3>
              <ul className="space-y-2.5 text-xs text-white/50 leading-relaxed">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" /> Betaal professionals in credits per dag</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" /> Koop bundels of verdien credits met uploads</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" /> Uploads worden onderdeel van het platform en het label</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
