import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { motion } from 'framer-motion'
import {
  Music,
  Globe,
  CheckCircle2,
  ArrowRight,
  FileAudio,
  Calendar,
  Radio,
  Play,
  Pause,
} from 'lucide-react'
import PageHero, { CtaSection, SectionIntro } from '../components/PageHero'
import { usePlayer } from '@/context/PlayerContext'
import { useTracks } from '@/context/TrackContext'
import { TrackCover } from '@/components/TrackCover'
import { Button } from '@/components/ui/button'

const platforms = [
  'Spotify', 'Apple Music', 'YouTube Music', 'TikTok', 'Instagram',
  'Snapchat', 'Deezer', 'Tidal', 'Amazon Music', 'SoundCloud',
]

const stappen = [
  {
    icon: FileAudio,
    num: '01',
    title: 'Upload je track',
    desc: 'Lever je master aan via het platform: audio, artwork en metadata. Wij checken de kwaliteit en de specificaties.',
  },
  {
    icon: Calendar,
    num: '02',
    title: 'Plan je release',
    desc: 'Kies je releasedatum en strategie. Pre-saves, première-timing en playlist-pitching regelen wij.',
  },
  {
    icon: Globe,
    num: '03',
    title: 'Wij distribueren',
    desc: 'Zheavenzy plaatst je nummer op alle grote platforms in 180+ landen, via onze eigen release-infrastructuur.',
  },
  {
    icon: Radio,
    num: '04',
    title: 'Monitor & groei',
    desc: 'Volg je streams, playlist-toevoegingen en opbrengsten in je dashboard. Jij behoudt je rechten.',
  },
]

const voordelen = [
  {
    title: 'Zonder label',
    desc: 'Het werk waarvoor je normaal een platenlabel nodig had (zoals distributie, administratie en platform-relaties) verzorgt Zheavenzy. Je hoeft niet getekend te zijn.',
  },
  {
    title: 'Jouw naam, jouw rechten',
    desc: 'Je muziek verschijnt onder jouw artiestennaam en jij behoudt 100% van je rechten. Zheavenzy is de motor, niet de eigenaar.',
  },
  {
    title: 'Onderdeel van het lidmaatschap',
    desc: 'Releases zitten bij je Zheavenzy-lidmaatschap in. Geen losse distributiekosten per track, geen verrassingen achteraf.',
  },
]

export default function Releases() {
  useScrollReveal()
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()
  const { tracks } = useTracks()

  return (
    <>
      <PageHero
        eyebrow="Zheavenzy / Muziek Uitbrengen"
        title={
          <>
            Breng je nummer uit. <span className="text-gradient-gold">Overal.</span>
          </>
        }
        description="Onder Zheavenzy breng je je muziek uit op alle streaming platforms zonder label en zonder contract. Alleen een lidmaatschap."
      />

      {/* Recente Releases Player Showcase */}
      <section className="py-16 bg-[#070709] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                Live Catalogus
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Recente Zheavenzy Releases
              </h2>
            </div>
            <Link to="/app">
              <Button className="bg-[#D4AF37] text-black hover:bg-[#F3E5AB] font-semibold rounded-xl text-xs">
                Open Volledige Music App
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracks.slice(0, 6).map((track) => {
              const isCurrent = currentTrack?.id === track.id
              const isCurrentPlaying = isCurrent && isPlaying

              return (
                <div
                  key={track.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    isCurrent
                      ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 shadow-lg'
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10 bg-black/40">
                      <TrackCover track={track} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-[#D4AF37]' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-white/50 truncate">
                        {track.userName || 'Zheavenzy'} • {track.genre}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (isCurrentPlaying) {
                        togglePlay()
                      } else {
                        playTrack(track)
                      }
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      isCurrentPlaying
                        ? 'bg-[#D4AF37] text-black shadow-md scale-105'
                        : 'bg-white/10 text-white hover:bg-[#D4AF37] hover:text-black'
                    }`}
                  >
                    {isCurrentPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-24 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionIntro
            eyebrow="Bereik"
            title={
              <>
                Op elk platform dat er <span className="text-gradient-gold">toe doet.</span>
              </>
            }
            description="Één upload, wereldwijd bereik in 180+ landen."
          />
          <div className="flex flex-wrap gap-3 -mt-8">
            {platforms.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="px-5 py-2.5 glass-card rounded-full text-white/80 font-medium text-sm flex items-center gap-2"
              >
                <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
                {p}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stappen */}
      <section className="py-24 md:py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionIntro
            eyebrow="Hoe het werkt"
            title={
              <>
                Van master naar release in <span className="text-gradient-gold">vier stappen.</span>
              </>
            }
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-6">
            {stappen.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass-card rounded-2xl p-8 relative"
              >
                <span className="text-[#D4AF37]/30 font-mono text-3xl font-bold absolute top-6 right-6">
                  {s.num}
                </span>
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 border border-[#D4AF37]/10">
                  <s.icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Waarom via Zheavenzy */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionIntro
            eyebrow="Waarom via Zheavenzy"
            title={
              <>
                De label-rol, <span className="text-gradient-gold">zonder het label.</span>
              </>
            }
            center
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {voordelen.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass-card rounded-2xl p-8 text-center"
              >
                <CheckCircle2 className="w-8 h-8 text-[#D4AF37] mx-auto mb-5" />
                <h3 className="text-lg font-bold text-white mb-3">{v.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="reveal text-center mt-16">
            <p className="text-white/50 mb-6 max-w-xl mx-auto">
              Releases zijn onderdeel van je Zheavenzy-lidmaatschap. Kies de tier die past bij
              hoeveel je uitbrengt.
            </p>
            <Link to="/lidmaatschap" className="btn-gold glow-gold inline-flex items-center gap-2">
              Bekijk Lidmaatschappen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaSection
        title={
          <>
            Je volgende release <span className="text-gradient-gold">begint hier.</span>
          </>
        }
        description="Upload je eerste track of vraag ons om mee te denken over je release-strategie."
        primaryHref="/contact"
        primaryLabel="Start je Release"
        secondaryHref="/diensten/marketing"
        secondaryLabel="Plan de Promo Erbij"
      />
    </>
  )
}
