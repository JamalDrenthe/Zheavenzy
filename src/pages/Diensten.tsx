import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { motion } from 'framer-motion'
import {
  Mic2,
  Disc3,
  TrendingUp,
  Calendar,
  BadgeCheck,
  ArrowRight,
  CheckCircle2,
  Layers,
} from 'lucide-react'
import PageHero, { CtaSection, SectionIntro } from '../components/PageHero'

const dienstenGroepen = [
  {
    href: '/diensten/artiesten',
    icon: Mic2,
    num: '01',
    title: 'Voor Artiesten',
    desc: 'Alle tools voor de independent artiest: van distributie en mixing & mastering tot strategisch advies en carrièrebegeleiding.',
    highlights: ['Distributie voor altijd', 'Strategisch advies', 'Volledige controle'],
  },
  {
    href: '/diensten/studio',
    icon: Disc3,
    num: '02',
    title: 'Studio & Mastering',
    desc: 'Transparant geprijsde studio\'s en professionele sound engineers, direct te boeken via het platform.',
    highlights: ['Direct boekbaar', 'Radio-ready kwaliteit', 'Revisies inbegrepen'],
  },
  {
    href: '/diensten/marketing',
    icon: TrendingUp,
    num: '03',
    title: 'Marketing & Groei',
    desc: 'Strategische playlisting, SEO, advertenties en campagnes die jouw muziek onder de juiste doelgroep brengen.',
    highlights: ['Strategische playlisting', 'Gerichte advertenties', 'Internationale hypes'],
  },
  {
    href: '/diensten/events',
    icon: Calendar,
    num: '04',
    title: 'Events & Boekingen',
    desc: 'Regionale events, optredens en samenwerkingskansen om je fanbase live te laten groeien.',
    highlights: ['Lokale podia', 'Netwerk van venues', 'Regionale exposure'],
  },
]

const platformDiensten = [
  {
    href: '/platform',
    icon: BadgeCheck,
    title: 'Over Zheavenzy',
    desc: 'Het ledenplatform van Zheavenzy. Word lid of laat je tekenen — jij kiest hoe je werkt.',
  },
  {
    href: '/platform/releases',
    icon: Layers,
    title: 'Muziek Uitbrengen',
    desc: 'Breng je nummer uit op alle platforms onder Zheavenzy, zonder dat je getekend hoeft te zijn.',
  },
  {
    href: '/lidmaatschap',
    icon: CheckCircle2,
    title: 'Lidmaatschappen',
    desc: 'Drie tiers met verschillende opties. Kies het lidmaatschap dat past bij jouw fase.',
  },
]

export default function Diensten() {
  useScrollReveal()

  return (
    <>
      <PageHero
        eyebrow="Diensten"
        title={
          <>
            Alles voor je <span className="text-gradient-gold">carrière.</span>
          </>
        }
        description="Van studio-tijd tot marketing, van releases tot live-podia. Zheavenzy bundelt alles wat een independent artiest nodig heeft in één overzichtelijk platform."
      />

      {/* Diensten grid */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionIntro
            eyebrow="Zheavenzy Diensten"
            title={
              <>
                Kies waar je <span className="text-gradient-gold">begint.</span>
              </>
            }
            description="Vier aandachtsgebieden, één platform. Elke dienst is los te gebruiken — en werkt nog beter samen."
          />

          <div className="grid md:grid-cols-2 gap-6">
            {dienstenGroepen.map((d, i) => (
              <motion.div
                key={d.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Link
                  to={d.href}
                  className="glass-card rounded-2xl p-8 block group h-full"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-[#D4AF37]/40 text-sm font-mono">{d.num}</span>
                      <div className="w-11 h-11 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#D4AF37]/10 group-hover:bg-[#D4AF37]/10 transition-colors">
                        <d.icon className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gradient-gold transition-all">
                    {d.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">{d.desc}</p>
                  <ul className="flex flex-wrap gap-2">
                    {d.highlights.map((h) => (
                      <li
                        key={h}
                        className="text-xs text-white/50 border border-white/10 rounded-full px-3 py-1"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zheavenzy blok */}
      <section className="py-24 md:py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionIntro
            eyebrow="Lidmaatschap & Releases"
            title={
              <>
                Zheavenzy: het hart van <span className="text-gradient-gold">het platform.</span>
              </>
            }
            description="Zheavenzy is waar lidmaatschap, releases en je volledige artiesten-toolkit samenkomen. Geen label nodig — wel een lidmaatschap."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {platformDiensten.map((d, i) => (
              <motion.div
                key={d.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Link
                  to={d.href}
                  className="glass-card rounded-2xl p-8 block group h-full"
                >
                  <div className="w-11 h-11 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#D4AF37]/10 group-hover:bg-[#D4AF37]/10 transition-colors mb-6">
                    <d.icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{d.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">{d.desc}</p>
                  <span className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-semibold">
                    Lees meer
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title={
          <>
            Niet zeker waar je <span className="text-gradient-gold">begint?</span>
          </>
        }
        description="Vertel ons waar je staat in je carrière — wij denken mee over de beste route."
        primaryHref="/contact"
        primaryLabel="Vraag Advies"
        secondaryHref="/lidmaatschap"
        secondaryLabel="Bekijk Lidmaatschappen"
      />
    </>
  )
}
