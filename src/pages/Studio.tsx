import { useScrollReveal } from '../hooks/useScrollReveal'
import { motion } from 'framer-motion'
import {
  Disc3,
  Sliders,
  Headphones,
  MapPin,
  CheckCircle2,
  Clock,
  Star,
} from 'lucide-react'
import PageHero, { CtaSection, SectionIntro } from '../components/PageHero'

const pakketten = [
  {
    icon: Disc3,
    title: 'Studio-tijd Boeken',
    desc: 'Transparant geprijsde studio\'s, direct te boeken via het platform. Kies de ruimte die past bij jouw budget en sound.',
    items: ['Duidelijke prijzen per uur/dag', 'Direct boekbaar', 'Verschillende locaties', 'Review-systeem'],
  },
  {
    icon: Sliders,
    title: 'Mixing',
    desc: 'Professionele sound engineers brengen je tracks naar balans. Samenwerken aan je sound tot hij klopt.',
    items: ['Ervaren engineers', 'Revisies inbegrepen', 'Snelle turnaround', 'Feedback-sessies'],
  },
  {
    icon: Headphones,
    title: 'Mastering',
    desc: 'De finishing touch: radio-ready masters die zich vertalen naar elk systeem en elk platform.',
    items: ['Radio-ready kwaliteit', 'Streaming-geoptimaliseerd', 'Vinyl & club masters', 'Consistente loudness'],
  },
]

const stappen = [
  { num: '01', title: 'Kies je service', desc: 'Studio-tijd, mixing of mastering — of een combinatie.' },
  { num: '02', title: 'Boek & upload', desc: 'Reserveer direct en upload je stems of demo veilig.' },
  { num: '03', title: 'Werk samen', desc: 'Geef feedback, vraag revisies aan en stuur bij tot het klopt.' },
  { num: '04', title: 'Release-ready', desc: 'Download je master en breng hem uit via Zheavenzy of je eigen weg.' },
]

export default function Studio() {
  useScrollReveal()

  return (
    <>
      <PageHero
        eyebrow="Diensten / Studio & Mastering"
        title={
          <>
            Jouw sound, <span className="text-gradient-gold">radio-ready.</span>
          </>
        }
        description="Van eerste take tot definitieve master. Boek studio\'s, werk met ervaren engineers en lever professioneel af — alles via één platform."
      />

      {/* Services */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionIntro
            eyebrow="Wat wij bieden"
            title={
              <>
                Drie manieren om je sound te <span className="text-gradient-gold">verbeteren.</span>
              </>
            }
          />

          <div className="grid md:grid-cols-3 gap-6">
            {pakketten.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 border border-[#D4AF37]/10">
                  <p.icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{p.desc}</p>
                <ul className="space-y-2.5">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-white/60 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio visual + stappen */}
      <section className="py-24 md:py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <img
                src="/images/studio-console.jpg"
                alt="Professionele studio"
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 glass-card rounded-xl p-4 flex items-center gap-3">
                <Star className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-white/80 text-sm">Geverifieerde studio\'s & engineers</span>
              </div>
            </motion.div>

            <div>
              <SectionIntro
                eyebrow="Hoe het werkt"
                title={
                  <>
                    In vier stappen naar een <span className="text-gradient-gold">release.</span>
                  </>
                }
              />
              <div className="space-y-4 -mt-8">
                {stappen.map((s, i) => (
                  <motion.div
                    key={s.num}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="glass-card rounded-xl p-5 flex items-start gap-4"
                  >
                    <span className="text-[#D4AF37]/40 font-mono font-bold flex-shrink-0">{s.num}</span>
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">{s.title}</h4>
                      <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Praktisch */}
      <section className="py-24 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: 'Locaties', desc: 'Studio\'s door heel Nederland — en online sessies wereldwijd.' },
              { icon: Clock, title: 'Turnaround', desc: 'Mixes binnen 5-7 werkdagen, masters vaak binnen 48 uur.' },
              { icon: CheckCircle2, title: 'Garantie', desc: 'Niet tevreden? Revisies zijn altijd inbegrepen.' },
            ].map((item) => (
              <div key={item.title} className="reveal glass-card rounded-2xl p-6 text-center">
                <item.icon className="w-6 h-6 text-[#D4AF37] mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title={
          <>
            Klaar voor de <span className="text-gradient-gold">studio?</span>
          </>
        }
        description="Boek je eerste sessie of vraag vrijblijvend een offerte aan voor je project."
        primaryHref="/contact"
        primaryLabel="Boek een Sessie"
        secondaryHref="/platform/releases"
        secondaryLabel="Breng je Master Uit"
      />
    </>
  )
}
