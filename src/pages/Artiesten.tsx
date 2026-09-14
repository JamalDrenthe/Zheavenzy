import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { motion } from 'framer-motion'
import {
  Upload,
  TrendingUp,
  Mic2,
  Award,
  Zap,
  Radio,
  CheckCircle2,
  ArrowRight,
  Music2,
  BarChart3,
  Sparkles,
  Globe
} from 'lucide-react'

const diensten = [
  {
    icon: Upload,
    num: '01',
    title: 'Distributie voor Altijd',
    desc: 'Jouw muziek blijft voor altijd online. Geen jaarlijkse kosten, geen verborgen inhoudingen. Je behoudt 100% van je rechten en je werk blijft bereikbaar voor de wereld via alle grote streaming platforms.',
    features: ['Spotify, Apple Music, YouTube Music', 'TikTok, Instagram, Snapchat', '180+ landen wereldwijd', 'Lifetime hosting'],
  },
  {
    icon: TrendingUp,
    num: '02',
    title: 'Vindbaarheid & Hypes',
    desc: 'Wij boosten je streams met strategische playlisting, SEO-optimalisatie, gerichte advertenties en marketingcampagnes die jouw muziek onder de juiste doelgroep brengen.',
    features: ['Strategische playlisting', 'SEO & content optimalisatie', 'Social media advertising', 'Internationale hypes'],
  },
  {
    icon: Mic2,
    num: '03',
    title: 'Mixing & Mastering',
    desc: 'Professionele mixing en mastering direct beschikbaar via het platform. Werk samen met ervaren sound engineers om je sound naar het hoogste niveau te tillen.',
    features: ['Professionele sound engineers', 'Snelle turnaround', 'Revisies inbegrepen', 'Radio-ready kwaliteit'],
  },
  {
    icon: Award,
    num: '04',
    title: 'Studio\'s Boeken',
    desc: 'Transparant geprijsde studio\'s, direct te boeken via ons platform. Geen verborgen kosten, geen verrassingen. Kies de studio die past bij jouw budget en sound.',
    features: ['Duidelijke prijzen', 'Direct boekbaar', 'Review systeem', 'Verschillende locaties'],
  },
  {
    icon: Zap,
    num: '05',
    title: 'Events & Regionale Kansen',
    desc: 'We verbinden je met regionale events, optredens en samenwerkingsmogelijkheden. Bouw je fanbase op met strategische live-podia in jouw regio.',
    features: ['Lokale events & festivals', 'Netwerk van venues', 'Samenwerkingsmogelijkheden', 'Regionale exposure'],
  },
  {
    icon: Radio,
    num: '06',
    title: 'Strategisch Advies',
    desc: 'Beweeg slim in de muziekindustrie van nu. Wij geven je de tools, data en kennis om strategisch beslissingen te nemen voor je carrière.',
    features: ['Data-gedreven inzichten', 'Release strategie', 'Brand building', 'Carrière planning'],
  },
]

const stats = [
  { value: '500M+', label: 'Streams beheerd' },
  { value: '2,500+', label: 'Actieve artiesten' },
  { value: '180+', label: 'Landen bereikt' },
  { value: '99.8%', label: 'Uptime garantie' },
]

export default function Artiesten() {
  useScrollReveal()

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center bg-[#050505] pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#D4AF37]/8 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs">Voor Artiesten</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mt-4 mb-6 leading-[1.05]">
              Grip op je <span className="text-gradient-gold">carrière.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed">
              Bij Zheavenzy sta jij écht centraal. Geen wurgcontracten, geen verborgen constructies. 
              Alleen de tools, het netwerk en de transparantie die je nodig hebt.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0a0a0a] border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient-gold">{stat.value}</div>
                <div className="text-xs text-white/40 uppercase tracking-wider mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Diensten */}
      <section className="py-24 md:py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="reveal text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Alles wat je nodig <span className="text-gradient-gold">hebt.</span>
            </h2>
          </div>

          <div className="space-y-16">
            {diensten.map((dienst, i) => (
              <div
                key={dienst.num}
                className={`reveal reveal-delay-${(i % 3) + 1} grid lg:grid-cols-12 gap-8 items-center`}
              >
                <div className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[#D4AF37]/40 text-sm font-mono">{dienst.num}</span>
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center border border-[#D4AF37]/10">
                      <dienst.icon className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{dienst.title}</h3>
                  <p className="text-white/50 leading-relaxed mb-6">{dienst.desc}</p>
                  <ul className="space-y-2">
                    {dienst.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-white/60 text-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`lg:col-span-7 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden min-h-[280px] flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent" />
                    <dienst.icon className="w-24 h-24 text-[#D4AF37]/10 absolute" />
                    <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-md">
                      {dienst.features.map((f, fi) => (
                        <div key={f} className="glass-card rounded-lg p-4 text-center">
                          <div className="text-[#D4AF37] text-lg font-bold mb-1">{String(fi + 1).padStart(2, '0')}</div>
                          <div className="text-white/70 text-xs">{f}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="reveal text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Hoe het <span className="text-gradient-gold">werkt.</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">Drie simpele stappen naar een succesvolle release.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Music2, step: '01', title: 'Upload je Muziek', desc: 'Upload je tracks via ons platform. Wij zorgen voor de distributie naar alle grote streamingdiensten.' },
              { icon: BarChart3, step: '02', title: 'Promote je Release', desc: 'Gebruik onze marketingtools, playlist pitching en advertentiemogelijkheden om je bereik te vergroten.' },
              { icon: Sparkles, step: '03', title: 'Verdien & Groei', desc: 'Houd je inkomsten bij in realtime, verdiene punten en bouw aan je carrière met ons netwerk.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="glass-card rounded-2xl p-8 relative"
              >
                <div className="absolute -top-4 -left-2 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#050505] font-bold text-sm">
                  {item.step}
                </div>
                <item.icon className="w-10 h-10 text-[#D4AF37]/60 mb-4 mt-4" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <div className="reveal">
            <Globe className="w-10 h-10 text-[#D4AF37] mx-auto mb-6 opacity-60" />
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
              Begin vandaag nog.
            </h2>
          </div>
          <p className="reveal reveal-delay-1 text-lg text-white/50 mb-8 font-light max-w-xl mx-auto">
            Sluit je aan bij de community van independent artiesten die kiezen voor 
            transparantie en eerlijke deals.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-gold glow-gold flex items-center justify-center gap-2">
              Word Lid
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/netwerk" className="btn-outline flex items-center justify-center gap-2">
              Ontdek het Netwerk
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
