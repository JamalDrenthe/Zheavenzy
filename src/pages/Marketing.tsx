import { useScrollReveal } from '../hooks/useScrollReveal'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Search,
  Megaphone,
  Globe,
  BarChart3,
  CheckCircle2,
} from 'lucide-react'
import PageHero, { CtaSection, SectionIntro } from '../components/PageHero'

const diensten = [
  {
    icon: TrendingUp,
    title: 'Strategische Playlisting',
    desc: 'Plaatsing op de juiste playlists is nog steeds de snelste groeimotor. Wij kennen de curators en de routes die werken voor jouw genre.',
    items: ['Genre-gerichte pitching', 'Editorial & independent playlists', 'Langetermijn-plaatsingen', 'Rapportage per release'],
  },
  {
    icon: Search,
    title: 'SEO & Content',
    desc: 'Gevonden worden als fans naar jou zoeken — en als ze naar jouw genre zoeken. Wij optimaliseren je complete online aanwezigheid.',
    items: ['Artiest-SEO', 'YouTube optimalisatie', 'Content-strategie', 'Metadata & keywords'],
  },
  {
    icon: Megaphone,
    title: 'Advertising',
    desc: 'Gerichte campagnes op Meta, TikTok en Google die écht streams opleveren — geen schijnvertoning, meetbaar resultaat.',
    items: ['TikTok & Reels ads', 'Meta campagnes', 'Retargeting', 'Budget per fase'],
  },
  {
    icon: Globe,
    title: 'Internationale Hypes',
    desc: 'Van lokale buzz naar grensoverschrijdende aandacht. Wij timen en plaatsen internationale pushes op het juiste moment.',
    items: ['Regionale launches', 'Cross-border playlists', 'PR & media outreach', '180+ landen bereik'],
  },
]

export default function Marketing() {
  useScrollReveal()

  return (
    <>
      <PageHero
        eyebrow="Diensten / Marketing & Groei"
        title={
          <>
            Word <span className="text-gradient-gold">gevonden.</span>
          </>
        }
        description="Goede muziek verdient bereik. Wij bouwen de vindbaarheid, de hypes en de campagnes die jouw streams laten groeien — meetbaar en transparant."
      />

      {/* Groei-aanpak */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionIntro
            eyebrow="Onze aanpak"
            title={
              <>
                Groei is een <span className="text-gradient-gold">systeem.</span>
              </>
            }
            description="Geen losse trucjes, maar een strategie per release: zichtbaar maken, pushen, meten en bijsturen."
          />

          <div className="grid md:grid-cols-2 gap-6">
            {diensten.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#D4AF37]/10 flex-shrink-0">
                    <d.icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{d.title}</h3>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{d.desc}</p>
                <ul className="grid sm:grid-cols-2 gap-2.5">
                  {d.items.map((item) => (
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

      {/* Data */}
      <section className="py-24 md:py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionIntro
                eyebrow="Data-gedreven"
                title={
                  <>
                    Je ziet precies wat je geld <span className="text-gradient-gold">oplevert.</span>
                  </>
                }
                description="Elke campagne krijgt een eigen dashboard: streams, saves, playlist-toevoegingen en kosten per resultaat. Geen vage beloftes — cijfers."
              />
              <ul className="space-y-4 -mt-6">
                {[
                  'Wekelijkse rapportage per campagne',
                  'Kosten per nieuwe luisteraar inzichtelijk',
                  'Dashboard voor al je releases op één plek',
                  'Eerlijk advies als iets niet werkt',
                ].map((item) => (
                  <li key={item} className="reveal flex items-center gap-3 text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
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
              className="relative rounded-2xl overflow-hidden border border-white/5"
            >
              <img
                src="/images/dashboard.jpg"
                alt="Marketing dashboard"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#050505]/60 to-transparent" />
              <div className="absolute bottom-6 left-6 glass-card rounded-xl px-4 py-3 flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-white/80 text-sm">Realtime campagne-data</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <CtaSection
        title={
          <>
            Klaar om te <span className="text-gradient-gold">groeien?</span>
          </>
        }
        description="Vertel ons over je volgende release — wij schetsen de strategie die erbij past."
        primaryHref="/contact"
        primaryLabel="Plan een Campagne"
        secondaryHref="/platform/releases"
        secondaryLabel="Breng je Nummer Uit"
      />
    </>
  )
}
