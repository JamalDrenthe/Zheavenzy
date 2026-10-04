import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  Zap,
  Crown,
} from 'lucide-react'
import PageHero, { CtaSection, SectionIntro } from '../components/PageHero'

type Tier = {
  icon: typeof Sparkles
  name: string
  tagline: string
  price: string
  period: string
  features: { label: string; included: boolean }[]
  cta: string
  highlight: boolean
  badge?: string
}

const tiers: Tier[] = [
  {
    icon: Sparkles,
    name: 'Start',
    tagline: 'Voor wie net begint',
    price: '€9,99',
    period: 'per maand',
    features: [
      { label: 'Toegang tot het Zheavenzy-platform', included: true },
      { label: 'Eigen artiestenprofiel in het netwerk', included: true },
      { label: '2 releases per jaar op alle platforms', included: true },
      { label: 'Basis analytics-dashboard', included: true },
      { label: 'Community-events & kansen', included: true },
      { label: 'Playlist-pitching door Zheavenzy', included: false },
      { label: 'Studio- & masteringkorting', included: false },
      { label: 'Persoonlijke strategie-sessies', included: false },
    ],
    cta: 'Start als Lid',
    highlight: false,
  },
  {
    icon: Zap,
    name: 'Groei',
    tagline: 'Voor artiesten die serieus releasen',
    price: '€24,99',
    period: 'per maand',
    features: [
      { label: 'Toegang tot het Zheavenzy-platform', included: true },
      { label: 'Eigen artiestenprofiel in het netwerk', included: true },
      { label: '6 releases per jaar op alle platforms', included: true },
      { label: 'Uitgebreid analytics-dashboard', included: true },
      { label: 'Community-events & kansen', included: true },
      { label: 'Playlist-pitching door Zheavenzy', included: true },
      { label: '10% korting op studio & mastering', included: true },
      { label: 'Persoonlijke strategie-sessies', included: false },
    ],
    cta: 'Kies Groei',
    highlight: true,
    badge: 'Meest gekozen',
  },
  {
    icon: Crown,
    name: 'Pro',
    tagline: 'Voor wie er fulltime voor gaat',
    price: '€49,99',
    period: 'per maand',
    features: [
      { label: 'Toegang tot het Zheavenzy-platform', included: true },
      { label: 'Eigen artiestenprofiel in het netwerk', included: true },
      { label: 'Onbeperkt releases op alle platforms', included: true },
      { label: 'Uitgebreid analytics-dashboard', included: true },
      { label: 'Community-events & priority-bookings', included: true },
      { label: 'Priority playlist-pitching', included: true },
      { label: '20% korting op studio & mastering', included: true },
      { label: 'Kwartaal strategie-sessie met het team', included: true },
    ],
    cta: 'Ga voor Pro',
    highlight: false,
  },
]

const vergelijking = [
  'Maandelijks opzegbaar — geen looptijd',
  'Op elk moment up- of downgraden',
  'Geen percentages over je omzet of rechten',
  '14 dagen bedenktijd op je eerste lidmaatschap',
]

export default function Lidmaatschap() {
  useScrollReveal()

  return (
    <>
      <PageHero
        eyebrow="Zheavenzy / Lidmaatschappen"
        title={
          <>
            Kies je <span className="text-gradient-gold">tier.</span>
          </>
        }
        description="Geen wachtlijst, geen selectie — met een Zheavenzy-lidmaatschap gebruik je meteen het volledige platform. Drie tiers, één keuze die bij jouw fase past."
      />

      {/* Pricing cards */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className={`glass-card rounded-3xl p-8 md:p-10 relative flex flex-col ${
                  tier.highlight
                    ? 'border-[#D4AF37]/40 bg-gradient-to-b from-[#1a1a1a]/90 to-[#050505]/90 md:-translate-y-4 md:scale-[1.02] shadow-[0_0_60px_rgba(212,175,55,0.12)]'
                    : ''
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#050505] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                    {tier.badge}
                  </div>
                )}
                <tier.icon
                  className={`w-8 h-8 mb-5 ${tier.highlight ? 'text-[#D4AF37]' : 'text-[#D4AF37]/70'}`}
                />
                <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                <p className="text-white/40 text-sm mt-1 mb-6">{tier.tagline}</p>
                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-gradient-gold">{tier.price}</span>
                  <span className="text-white/40 text-sm ml-2">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-10 flex-1">
                  {tier.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-3 text-sm">
                      {f.included ? (
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-white/20 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={f.included ? 'text-white/70' : 'text-white/30'}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`block w-full py-3.5 text-center rounded-xl font-semibold transition-all text-sm ${
                    tier.highlight
                      ? 'bg-[#D4AF37] text-[#050505] hover:bg-[#F4D068] glow-gold'
                      : 'bg-[#1a1a1a] text-white border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-[#050505]'
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Voorwaarden */}
          <div className="reveal mt-16 glass-card rounded-2xl p-8 max-w-4xl mx-auto">
            <ul className="grid sm:grid-cols-2 gap-4">
              {vergelijking.map((v) => (
                <li key={v} className="flex items-start gap-3 text-white/60 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Lid vs getekend */}
      <section className="py-24 md:py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionIntro
                eyebrow="Lid of getekend?"
                title={
                  <>
                    Niet zeker welke route <span className="text-gradient-gold">past?</span>
                  </>
                }
                description="Een lidmaatschap is open voor iedereen en meteen actief. Getekend worden bij Zheavenzy is een wederzijdse selectie voor artiesten die intensiever willen samenwerken."
              />
              <Link to="/platform" className="btn-outline inline-flex items-center gap-2 -mt-4">
                Vergelijk Lid & Getekend
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="reveal glass-card rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white mb-4">In elk lidmaatschap inbegrepen:</h3>
              <ul className="space-y-3">
                {[
                  'Releases op alle grote streaming platforms',
                  '100% van je rechten behouden',
                  'Toegang tot het Zheavenzy-netwerk',
                  'Studio-, marketing- en event-tools',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/60 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        title={
          <>
            Word vandaag <span className="text-gradient-gold">lid.</span>
          </>
        }
        description="Binnen een paar minuten staat je profiel klaar en kan je eerste release gepland worden."
        primaryHref="/contact"
        primaryLabel="Aanmelden"
        secondaryHref="/platform/releases"
        secondaryLabel="Hoe Releases Werken"
      />
    </>
  )
}
