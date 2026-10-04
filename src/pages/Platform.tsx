import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { motion } from 'framer-motion'
import {
  BadgeCheck,
  Layers,
  Users,
  PenLine,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react'
import PageHero, { CtaSection, SectionIntro } from '../components/PageHero'

const routes = [
  {
    icon: Users,
    title: 'Word Lid',
    subtitle: 'Zonder contract',
    desc: 'Je hoeft niet te wachten tot wij jou vinden. Met een Zheavenzy-lidmaatschap krijg je direct toegang tot het complete platform: alle tools, het netwerk en de release-infrastructuur.',
    items: [
      'Direct toegang tot het platform',
      'Alle artiesten-tools inbegrepen',
      'Releases uitbrengen op alle platforms',
      'Maandelijks opzegbaar',
    ],
    cta: 'Bekijk Lidmaatschappen',
    href: '/lidmaatschap',
    highlight: true,
  },
  {
    icon: PenLine,
    title: 'Getekend bij Zheavenzy',
    subtitle: 'Selectief traject',
    desc: 'Voor artiesten die verder willen gaan dan tools: een getekende samenwerking met Zheavenzy. Selectief, intensief en gebouwd op wederzijds vertrouwen.',
    items: [
      'Persoonlijke begeleiding & team',
      'Prioriteit in marketing en studio\'s',
      'Langetermijn carrière-opbouw',
      'Op basis van wederzijdse selectie',
    ],
    cta: 'Dien je Audition In',
    href: '/contact',
    highlight: false,
  },
]

const verschil = [
  { aspect: 'Contract nodig?', lid: 'Nee — alleen lidmaatschap', getekend: 'Ja, getekende overeenkomst' },
  { aspect: 'Releases uitbrengen', lid: 'Via Zheavenzy op alle platforms', getekend: 'Volledig begeleid door Zheavenzy' },
  { aspect: 'Toegang tot platform', lid: 'Volledig', getekend: 'Volledig + dedicated team' },
  { aspect: 'Marketing & promo', lid: 'Tools & optionele services', getekend: 'Actief gevoerd door Zheavenzy' },
  { aspect: 'Selectie', lid: 'Open voor iedereen', getekend: 'Wederzijdse selectie' },
]

export default function Platform() {
  useScrollReveal()

  return (
    <>
      <PageHero
        eyebrow="Het Platform"
        title={
          <>
            Het platform achter <span className="text-gradient-gold">independent succes.</span>
          </>
        }
        description="Zheavenzy is het ledenplatform dat alle tools, releases en het netwerk bij elkaar brengt. Word lid — of word getekend."
      />

      {/* Twee routes */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionIntro
            eyebrow="Twee routes"
            title={
              <>
                Kies hoe je met Zheavenzy <span className="text-gradient-gold">werkt.</span>
              </>
            }
            description="Lid worden is open voor iedereen. Getekend worden is een wederzijdse keuze voor artiesten die verder willen."
            center
          />

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {routes.map((route, i) => (
              <motion.div
                key={route.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className={`glass-card rounded-3xl p-10 relative overflow-hidden ${
                  route.highlight ? 'border-[#D4AF37]/30 bg-gradient-to-b from-[#1a1a1a]/80 to-[#050505]/80' : ''
                }`}
              >
                {route.highlight && (
                  <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#050505] text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Aanbevolen
                  </div>
                )}
                <route.icon className="w-8 h-8 text-[#D4AF37] mb-5" />
                <span className="text-[#D4AF37]/60 text-xs font-semibold uppercase tracking-[0.15em]">
                  {route.subtitle}
                </span>
                <h3 className="text-2xl font-bold text-white mt-2 mb-4">{route.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-8">{route.desc}</p>
                <ul className="space-y-3 mb-8">
                  {route.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/60 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to={route.href}
                  className={`block w-full py-3.5 text-center rounded-xl font-semibold transition-all text-sm ${
                    route.highlight
                      ? 'bg-[#D4AF37] text-[#050505] hover:bg-[#F4D068] glow-gold'
                      : 'bg-[#1a1a1a] text-white border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-[#050505]'
                  }`}
                >
                  {route.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Geen label nodig */}
      <section className="py-24 md:py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionIntro
                eyebrow="Het einde van de label-drempel"
                title={
                  <>
                    Uitbrengen op alle platforms, <span className="text-gradient-gold">zonder contract.</span>
                  </>
                }
                description="Normaal gesproken heb je een label nodig om je muziek professioneel uit te brengen. Zheavenzy vervangt die rol: als lid breng je je nummers uit op alle streaming platforms — zonder getekend te zijn."
              />
              <div className="space-y-4 -mt-6">
                {[
                  {
                    icon: X,
                    bad: true,
                    text: 'Geen label-contract, geen opgelegde voorwaarden',
                  },
                  {
                    icon: CheckCircle2,
                    bad: false,
                    text: 'Releases via Zheavenzy op Spotify, Apple Music, TikTok en meer',
                  },
                  {
                    icon: CheckCircle2,
                    bad: false,
                    text: 'Jij behoudt je rechten en je naam',
                  },
                  {
                    icon: CheckCircle2,
                    bad: false,
                    text: 'Betaal alleen je lidmaatschap — geen percentage van je carrière',
                  },
                ].map((item) => (
                  <div key={item.text} className="reveal flex items-start gap-3">
                    <item.icon
                      className={`w-4 h-4 flex-shrink-0 mt-1 ${
                        item.bad ? 'text-white/30' : 'text-[#D4AF37]'
                      }`}
                    />
                    <span className={`text-sm ${item.bad ? 'text-white/40 line-through' : 'text-white/60'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <Link to="/platform/releases" className="btn-gold glow-gold inline-flex items-center gap-2 mt-10">
                Hoe Releases Werken
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Vergelijkingstabel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <div className="grid grid-cols-3 text-xs font-bold uppercase tracking-wider">
                <div className="px-5 py-4 text-white/40 border-b border-white/10">Aspect</div>
                <div className="px-5 py-4 text-[#D4AF37] border-b border-[#D4AF37]/20 bg-[#D4AF37]/5">Lid</div>
                <div className="px-5 py-4 text-white/70 border-b border-white/10">Getekend</div>
              </div>
              {verschil.map((row) => (
                <div key={row.aspect} className="grid grid-cols-3 border-b border-white/5 last:border-0">
                  <div className="px-5 py-4 text-white/50 text-xs font-medium">{row.aspect}</div>
                  <div className="px-5 py-4 text-white/70 text-xs bg-[#D4AF37]/[0.03]">{row.lid}</div>
                  <div className="px-5 py-4 text-white/50 text-xs">{row.getekend}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform tools */}
      <section className="py-24 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionIntro
            eyebrow="Alles inbegrepen"
            title={
              <>
                Eén lidmaatschap, <span className="text-gradient-gold">alle tools.</span>
              </>
            }
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Layers, title: 'Release-tools', desc: 'Uploaden, plannen en monitoren van je releases.' },
              { icon: BadgeCheck, title: 'Artiestenprofiel', desc: 'Je eigen verifieerbare profiel in het netwerk.' },
              { icon: Users, title: 'Netwerk-toegang', desc: 'Producers, engineers, venues en andere artiesten.' },
              { icon: PenLine, title: 'Contract-vrij', desc: 'Geen wurgcontracten. Jij bepaalt, altijd.' },
            ].map((tool, i) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <tool.icon className="w-6 h-6 text-[#D4AF37] mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2 text-sm">{tool.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{tool.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title={
          <>
            Klaar voor <span className="text-gradient-gold">Zheavenzy?</span>
          </>
        }
        description="Word lid en begin vandaag, of dien je audition in voor een getekende samenwerking."
        primaryHref="/lidmaatschap"
        primaryLabel="Word Lid"
        secondaryHref="/contact"
        secondaryLabel="Dien Audition In"
      />
    </>
  )
}
