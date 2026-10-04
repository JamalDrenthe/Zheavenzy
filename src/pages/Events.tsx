import { useScrollReveal } from '../hooks/useScrollReveal'
import { motion } from 'framer-motion'
import {
  Calendar,
  MapPin,
  Users,
  Mic2,
  Ticket,
  CheckCircle2,
} from 'lucide-react'
import PageHero, { CtaSection, SectionIntro } from '../components/PageHero'

const kansen = [
  {
    icon: Mic2,
    title: 'Optredens & Showcases',
    desc: 'Van intieme cafés tot regionale festivals — wij koppelen je aan podia die passen bij jouw fase en genre.',
    tag: 'Live',
  },
  {
    icon: Users,
    title: 'Samenwerkingen',
    desc: 'Support-slots, features en co-writing sessies met artiesten en collectieven uit het netwerk.',
    tag: 'Netwerk',
  },
  {
    icon: Ticket,
    title: 'Eigen Events',
    desc: 'Organiseer je eigen release-party of clubnacht? Wij helpen met venues, promotie en de line-up.',
    tag: 'Events',
  },
]

const regioKansen = [
  'Showcase-avonden in je eigen regio',
  'Open mic & talentenpodia',
  'Support voor grotere acts',
  'Festival-inzendingen en voorrondes',
  'Instore-sessies en radioshows',
  'Community-events van het netwerk',
]

export default function Events() {
  useScrollReveal()

  return (
    <>
      <PageHero
        eyebrow="Diensten / Events & Boekingen"
        title={
          <>
            Bouw je fanbase <span className="text-gradient-gold">live op.</span>
          </>
        }
        description="Streams zijn één ding — een zaal die meezingt is goud. Wij verbinden je met regionale events, venues en samenwerkingskansen."
      />

      {/* Achtergrond */}
      <section className="relative py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/concert-stage.jpg')] bg-cover bg-center opacity-[0.05]" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <SectionIntro
            eyebrow="Regionale kansen"
            title={
              <>
                Drie routes naar het <span className="text-gradient-gold">podium.</span>
              </>
            }
          />

          <div className="grid md:grid-cols-3 gap-6">
            {kansen.map((k, i) => (
              <motion.div
                key={k.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#D4AF37]/10">
                    <k.icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4AF37] border border-[#D4AF37]/20 rounded-full px-3 py-1">
                    {k.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{k.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{k.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wat valt er te halen */}
      <section className="py-24 md:py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionIntro
                eyebrow="Wat valt er te halen"
                title={
                  <>
                    Kansen waar je normaal <span className="text-gradient-gold">langs loopt.</span>
                  </>
                }
                description="De meeste live-kansen staan niet op een website. Ons netwerk deelt ze intern — jij hoeft alleen aan te haken."
              />
              <ul className="grid sm:grid-cols-2 gap-4 -mt-6">
                {regioKansen.map((item) => (
                  <li key={item} className="reveal flex items-start gap-3 text-white/60 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <img
                src="/images/concert-stage.jpg"
                alt="Live podium"
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 glass-card rounded-xl p-4 flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-white/80 text-sm">Actief netwerk van venues in heel Nederland</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Voor wie */}
      <section className="py-24 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="reveal glass-card rounded-2xl p-8">
              <Calendar className="w-6 h-6 text-[#D4AF37] mb-4" />
              <h3 className="text-lg font-bold text-white mb-3">Voor artiesten</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Leden krijgen als eerste toegang tot nieuwe boekingskansen. Bouw live-ervaring,
                bewijs je waarde en groei door naar grotere podia.
              </p>
            </div>
            <div className="reveal reveal-delay-1 glass-card rounded-2xl p-8">
              <Ticket className="w-6 h-6 text-[#D4AF37] mb-4" />
              <h3 className="text-lg font-bold text-white mb-3">Voor boekers</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Zoek je talent voor je event of venue? Doorzoek het netwerk, check reviews en
                boek direct — met bescherming voor beide kanten.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        title={
          <>
            Het podium <span className="text-gradient-gold">wacht.</span>
          </>
        }
        description="Meld je aan voor boekingskansen in jouw regio of vertel ons welk event je organiseert."
        primaryHref="/contact"
        primaryLabel="Aanmelden voor Bookings"
        secondaryHref="/netwerk"
        secondaryLabel="Bekijk het Netwerk"
      />
    </>
  )
}
