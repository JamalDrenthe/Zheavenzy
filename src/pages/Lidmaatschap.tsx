import { useState } from 'react'
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

type BillingPeriod = 'maand' | 'kwartaal' | 'jaar'

type Tier = {
  icon: typeof Sparkles
  name: string
  tagline: string
  prices: Record<BillingPeriod, number>
  features: { label: string; included: boolean }[]
  cta: string
  highlight: boolean
  badge?: string
}

const periods: { key: BillingPeriod; label: string; unit: string; discount?: string; benefit?: string; mostChosen?: boolean }[] = [
  { key: 'maand', label: 'Maandelijks', unit: 'per maand' },
  { key: 'kwartaal', label: 'Per kwartaal', unit: 'per kwartaal', discount: '±7% korting', benefit: '+ 1 maand proef' },
  { key: 'jaar', label: 'Jaarlijks', unit: 'per jaar', discount: '±17% korting', benefit: '+ 3 maanden gratis', mostChosen: true },
]

const formatPrice = (n: number) => {
  if (n >= 10000) return `€${Math.round(n / 1000)}k`
  return '€' + n.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const monthsInPeriod: Record<BillingPeriod, number> = { maand: 1, kwartaal: 3, jaar: 12 }

const tiers: Tier[] = [
  {
    icon: Sparkles,
    name: 'Start',
    tagline: 'Voor wie net begint',
    prices: { maand: 4995, kwartaal: 13995, jaar: 50000 },
    features: [
      { label: 'Toegang tot het Zheavenzy-platform', included: true },
      { label: 'Eigen artiestenprofiel in het netwerk', included: true },
      { label: '2 releases per jaar op alle platforms', included: true },
      { label: 'Basis analytics-dashboard', included: true },
      { label: 'Community-events & kansen', included: true },
      { label: 'Zheavenzy Punten op elke actie', included: true },
      { label: 'Playlist-pitching door Zheavenzy', included: false },
      { label: 'Studio- & masteringkorting', included: false },
      { label: 'Priority event- & studio-slots', included: false },
      { label: 'Persoonlijke strategie-sessies', included: false },
      { label: 'Dedicated release-strateeg', included: false },
    ],
    cta: 'Start als Lid',
    highlight: true,
    badge: 'Meest gekozen',
  },
  {
    icon: Zap,
    name: 'Groei',
    tagline: 'Voor artiesten die serieus releasen',
    prices: { maand: 9995, kwartaal: 27995, jaar: 100000 },
    features: [
      { label: 'Alles uit Start', included: true },
      { label: '6 releases per jaar op alle platforms', included: true },
      { label: 'Uitgebreid analytics-dashboard & exports', included: true },
      { label: 'Playlist-pitching door Zheavenzy', included: true },
      { label: 'SEO- & campagne-tools voor je releases', included: true },
      { label: '10% korting op studio & mastering', included: true },
      { label: 'Priority event- & studio-slots', included: true },
      { label: 'Netwerk-introducties: producers & songwriters', included: true },
      { label: 'Maandelijks groei-rapport per release', included: true },
      { label: '1,5× Zheavenzy Punten op elke actie', included: true },
      { label: 'Kwartaal strategisch adviesgesprek', included: true },
      { label: 'Persoonlijke strategie-sessies', included: false },
      { label: 'Dedicated release-strateeg', included: false },
      { label: 'Marketingcampagne-begeleiding', included: false },
    ],
    cta: 'Kies Groei',
    highlight: false,
  },
  {
    icon: Crown,
    name: 'Pro',
    tagline: 'Voor wie er fulltime voor gaat',
    prices: { maand: 19995, kwartaal: 55995, jaar: 200000 },
    features: [
      { label: 'Alles uit Groei', included: true },
      { label: 'Onbeperkt releases op alle platforms', included: true },
      { label: 'Priority playlist-pitching op elke release', included: true },
      { label: 'Dedicated release-strateeg per release', included: true },
      { label: 'Marketingcampagne-begeleiding van A tot Z', included: true },
      { label: '20% korting op studio & mastering', included: true },
      { label: 'Eerste-keus studio-slots & event-bookings', included: true },
      { label: 'Netwerk-introducties incl. venues & bookers', included: true },
      { label: 'Kwartaal strategie-sessie met het team', included: true },
      { label: 'Persoonlijke groei-roadmap per kwartaal', included: true },
      { label: '2× Zheavenzy Punten op elke actie', included: true },
      { label: 'Priority-auditions: eerste rij bij selectie', included: true },
      { label: 'Direct kanaal naar het team (priority support)', included: true },
      { label: 'Wekelijkse performance-review van je releases', included: true },
      { label: 'Jaarlijks strategisch plansessie-onderdeel', included: true },
    ],
    cta: 'Ga voor Pro',
    highlight: false,
  },
]

const vergelijking = [
  'Korting bij kwartaal- en jaarlidmaatschap',
  'Maandlidmaatschap is maandelijks opzegbaar',
  'Op elk moment up- of downgraden',
  'Geen percentages over je omzet of rechten',
  '14 dagen bedenktijd op je eerste lidmaatschap',
]

export default function Lidmaatschap() {
  useScrollReveal()
  const [period, setPeriod] = useState<BillingPeriod>('jaar')
  const activePeriod = periods.find((p) => p.key === period)!

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
          {/* Periode-kiezer */}
          <div className="flex justify-center mb-14">
            <div className="inline-flex rounded-full bg-[#111111] border border-white/10 p-1.5 gap-1">
              {periods.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPeriod(p.key)}
                  className={`relative px-5 md:px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    period === p.key
                      ? 'bg-[#D4AF37] text-[#050505]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

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
                  <span className="text-4xl font-extrabold text-gradient-gold">
                    {formatPrice(tier.prices[period])}
                  </span>
                  <span className="text-white/40 text-sm ml-2">{activePeriod.unit}</span>
                  {period !== 'maand' && (
                    <p className="text-white/40 text-xs mt-1.5">
                      ≈ {formatPrice(tier.prices[period] / monthsInPeriod[period])} per maand
                    </p>
                  )}
                  {activePeriod.benefit && (
                    <p className="text-[#D4AF37] text-xs font-semibold mt-1">
                      {activePeriod.benefit}
                    </p>
                  )}
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
