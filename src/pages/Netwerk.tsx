import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { motion } from 'framer-motion'
import {
  Headphones,
  Mic2,
  Music,
  Radio,
  Zap,
  Guitar,
  Users,
  Camera,
  Video,
  ArrowRight,
  Star,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react'

const talentCategories = [
  {
    icon: Headphones,
    title: 'Producers',
    description: 'Professionele producers met ervaring in diverse genres. Van beatmakers tot volledige productie.',
    count: '120+',
  },
  {
    icon: Mic2,
    title: 'Zangeressen',
    description: 'Getalenteerde vocalisten voor sessies, features en live-optredens in elk genre.',
    count: '85+',
  },
  {
    icon: Music,
    title: 'Songwriters',
    description: 'Creatieve songwriters die meedenken over tekst, melodie en arrangement.',
    count: '95+',
  },
  {
    icon: Radio,
    title: "DJ's",
    description: 'Ervaring DJ\'s voor clubs, festivals, privé-events en radioshows.',
    count: '60+',
  },
  {
    icon: Zap,
    title: 'Sound Engineers',
    description: 'Technische experts voor mixing, mastering en live-geluid.',
    count: '70+',
  },
  {
    icon: Guitar,
    title: 'Gitaristen',
    description: 'Virtuoze gitaristen voor studio-sessies en live-optredens.',
    count: '45+',
  },
  {
    icon: Users,
    title: 'Drummers & Blazers',
    description: 'Rhythm section en blazers voor dat extra laagje in je productie.',
    count: '55+',
  },
  {
    icon: Camera,
    title: 'Fotografen',
    description: 'Professionele fotografen voor artist branding, covers en promo-materiaal.',
    count: '40+',
  },
  {
    icon: Video,
    title: 'Videografen',
    description: 'Videoprofessionals voor clips, behind-the-scenes en promo-content.',
    count: '35+',
  },
]

const boekVoordelen = [
  'Direct contact met creatieven',
  'Transparante prijzen',
  'Geen tussenpersonen',
  'Veilig betalen via platform',
  'Reviews en ratings',
  'Flexibele boekingsopties',
]

export default function Netwerk() {
  useScrollReveal()

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center bg-[#050505] pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#D4AF37]/8 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs">Het Netwerk</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mt-4 mb-6 leading-[1.05]">
              Jouw Creatieve <span className="text-gradient-gold">Match.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed">
              Op zoek naar het perfecte talent voor je sessie, show of concert? 
              Ons netwerk zit vol professionals die klaar staan om te schitteren.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Talent Grid */}
      <section className="py-24 md:py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="reveal text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Ontdek ons <span className="text-gradient-gold">talent.</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Van producers tot videografen — vind de perfecte creatieve professional voor jouw project.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {talentCategories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="glass-card rounded-2xl p-6 group hover:border-[#D4AF37]/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#D4AF37]/10 group-hover:bg-[#D4AF37]/10 transition-colors">
                    <cat.icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-[#D4AF37] font-bold text-sm">{cat.count}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{cat.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{cat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to book */}
      <section className="py-24 md:py-32 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
                Eenvoudig <span className="text-gradient-gold">boeken.</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-8">
                Het Zheavenzy-platform maakt het boeken van creatief talent eenvoudig en transparant. 
                Geen verborgen kosten, geen gedoe. Direct contact en veilige betaling.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {boekVoordelen.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-white/60 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 btn-gold glow-gold"
              >
                Start met Boeken
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="reveal reveal-delay-2 space-y-4">
              {[
                { icon: Calendar, title: 'Kies een datum', desc: 'Bekijk de beschikbaarheid en kies wat jou uitkomt.' },
                { icon: MapPin, title: 'Kies een locatie', desc: 'Studio, venue of op locatie — jij bepaalt.' },
                { icon: Clock, title: 'Bevestig & betaal', desc: 'Veilig betalen via ons platform met bescherming.' },
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="glass-card rounded-xl p-5 flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">{step.title}</h4>
                    <p className="text-white/40 text-xs">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured talent image */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <img
                src="/images/artist-singer.jpg"
                alt="Zheavenzy Talent"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white/80 text-sm font-medium">Beschikbaar voor boeking</span>
                    <span className="ml-auto text-[#D4AF37] font-bold text-sm">Zheavenzy Talent</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="reveal">
              <Star className="w-8 h-8 text-[#D4AF37] mb-6 opacity-60" />
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
                Kwaliteit gegarandeerd.
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                Elk lid van ons netwerk is zorgvuldig geselecteerd op basis van vakmanschap, 
                betrouwbaarheid en professionele houding. We staan garant voor de kwaliteit 
                van iedere boeking.
              </p>
              <p className="text-white/50 leading-relaxed mb-8">
                Of je nu een producer zoekt voor je volgende single, een fotograaf 
                voor je albumcover, of een complete band voor een event — bij Zheavenzy 
                vind je wat je zoekt.
              </p>
              <Link to="/contact" className="btn-outline inline-flex items-center gap-2">
                Word Lid van het Netwerk
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <div className="reveal">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
              Klaar om te <span className="text-gradient-gold">boeken?</span>
            </h2>
          </div>
          <p className="reveal reveal-delay-1 text-lg text-white/50 mb-8 font-light max-w-xl mx-auto">
            Of je nu talent zoekt of zelf talent bent — meld je aan en ontdek de mogelijkheden.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-gold glow-gold flex items-center justify-center gap-2">
              Aanmelden
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/diensten/artiesten" className="btn-outline flex items-center justify-center gap-2">
              Bekijk Diensten
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
