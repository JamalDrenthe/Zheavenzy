import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { motion } from 'framer-motion'
import {
  Target,
  Eye,
  Heart,
  Shield,
  Users,
  TrendingUp,
  ArrowRight,
  Quote
} from 'lucide-react'

const waarden = [
  {
    icon: Target,
    title: 'Transparantie',
    desc: 'Geen verborgen kosten, geen kleine lettertjes. Wij geloven in volledige openheid over wat je verdient en waar je voor betaalt.',
  },
  {
    icon: Shield,
    title: 'Onafhankelijkheid',
    desc: 'Geen 360-deals, geen wurgcontracten. Jij behoudt de volledige controle over je muziek en je carrière.',
  },
  {
    icon: Heart,
    title: 'Community',
    desc: 'Samen bereik je meer. Ons ledenprogramma beloont samenwerking en actieve deelname aan het netwerk.',
  },
  {
    icon: TrendingUp,
    title: 'Groei',
    desc: 'Wij investeren in jouw groei met strategisch advies, marketingtools en toegang tot een uitgebreid netwerk.',
  },
]

const testimonials = [
  {
    quote: 'Zheavenzy gaf me de tools en het netwerk om mijn muziek serieus te nemen. Eindelijk een platform dat artiesten écht centraal stelt.',
    name: 'Maya Chen',
    role: 'Independent Artiest',
  },
  {
    quote: 'De transparantie is verfrissend. Ik weet precies wat ik verdien en waar ik aan toe ben. Geen verrassingen, alleen resultaat.',
    name: 'Jordan Blake',
    role: 'Producer & Songwriter',
  },
  {
    quote: 'Via Zheavenzy heb ik fantastische sessiemuzikanten gevonden voor mijn album. Het netwerk is goud waard.',
    name: 'Sofia Reyes',
    role: 'Zangeres',
  },
]

export default function Over() {
  useScrollReveal()

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center bg-[#050505] pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs">Over Zheavenzy</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mt-4 mb-6 leading-[1.05]">
              Het Eerlijke <span className="text-gradient-gold">Alternatief.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed">
              Wij zijn gebouwd door artiesten, voor artiesten. Met een missie om de 
              muziekindustrie transparanter en eerlijker te maken.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <img
                src="/images/studio-console.jpg"
                alt="Studio Console"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/50 to-transparent" />
            </motion.div>

            <div className="reveal">
              <Eye className="w-8 h-8 text-[#D4AF37] mb-6 opacity-60" />
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
                Onze Missie
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                Zheavenzy is hét alles-in-één gereedschap voor de independent artiest. 
                We zetten de artiest écht centraal, zonder wurgcontracten en met volledige 
                transparantie. Wij geloven dat elke artiest recht heeft op eerlijke kansen 
                en volledige controle over eigen werk.
              </p>
              <p className="text-white/50 leading-relaxed mb-8">
                In een wereld waar grote labels vaak de regels dicteren, bieden wij een 
                eerlijk alternatief. Geen 360-deals, geen verborgen constructies — alleen 
                een dedicated team dat meedenkt en tools die werken.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-gradient-gold">2019</div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Oprichting</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient-gold">2,500+</div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Artiesten</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus & Specialisaties */}
      <section className="py-24 md:py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="reveal text-center mb-16">
            <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs">Waarvoor we staan</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-3">
              Onze Kern<span className="text-gradient-gold">waarden.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {waarden.map((waarde, i) => (
              <motion.div
                key={waarde.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass-card rounded-2xl p-8 text-center group"
              >
                <div className="w-14 h-14 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#D4AF37]/10 group-hover:bg-[#D4AF37]/10 transition-colors">
                  <waarde.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{waarde.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{waarde.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Focus areas */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="reveal mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
              Focus & <span className="text-gradient-gold">Specialisaties</span>
            </h2>
            <p className="text-white/50 max-w-2xl leading-relaxed">
              Wij concentreren ons op de disciplines die er écht toe doen voor independent artiesten.
            </p>
          </div>

          <div className="space-y-8">
            {[
              { num: '01', title: 'Streams, Playlisting & Internationale Hypes', desc: 'We optimaliseren je aanwezigheid op streaming platforms en zorgen voor strategische playlist-plaatsingen die je bereik vergroten.' },
              { num: '02', title: 'Vindbaarheid: SEO, Ads & Marketingcampagnes', desc: 'Van zoekmachineoptimalisatie tot gerichte advertenties — wij zorgen dat je gevonden wordt door de juiste doelgroep.' },
              { num: '03', title: 'Distributie & Netwerken', desc: 'Wereldwijde distributie naar alle grote platforms, aangevuld met een sterk netwerk van industrieprofessionals.' },
              { num: '04', title: 'Events & Regionale Kansen', desc: 'We verbinden je met regionale events, venues en samenwerkingsmogelijkheden om je lokale fanbase te versterken.' },
              { num: '05', title: 'Strategisch Bewegen in de Muziekindustrie', desc: 'Data-gedreven inzichten en strategisch advies om de juiste beslissingen te nemen voor je carrière.' },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card rounded-xl p-6 md:p-8 flex items-start gap-6"
              >
                <span className="text-[#D4AF37]/40 font-mono text-lg font-bold flex-shrink-0">{item.num}</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="reveal text-center mb-16">
            <Quote className="w-10 h-10 text-[#D4AF37] mx-auto mb-6 opacity-40" />
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Wat artiesten <span className="text-gradient-gold">zeggen.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="glass-card rounded-2xl p-8"
              >
                <p className="text-white/60 italic leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <div className="reveal">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
              Word deel van de <span className="text-gradient-gold">beweging.</span>
            </h2>
          </div>
          <p className="reveal reveal-delay-1 text-lg text-white/50 mb-8 font-light max-w-xl mx-auto">
            Samen veranderen we de muziekindustrie. Eén eerlijke deal tegelijk.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-gold glow-gold flex items-center justify-center gap-2">
              Sluit je aan
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
