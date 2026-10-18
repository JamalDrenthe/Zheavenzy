import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { motion } from 'framer-motion'
import {
  Upload,
  TrendingUp,
  Mic2,
  Users,
  Music,
  Camera,
  Headphones,
  Guitar,
  Award,
  Zap,
  Globe,
  Radio,
  Star,
  CheckCircle2,
  ArrowRight,
  Play
} from 'lucide-react'

/* ─── Home Page ─── */
export default function Home() {
  useScrollReveal()

  const fadeUp = {
    hidden: { opacity: 0, y: 35 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    }),
  }

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050505]">
        {/* Subtle Luxury Glow Backdrops (No fake particle specks) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,_rgba(212,175,55,0.09)_0%,_transparent_75%)]" />
        <div className="absolute top-1/4 left-1/12 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/12 w-[500px] h-[500px] bg-[#1a1608]/40 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-28 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="inline-flex items-center gap-2 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 mb-8 bg-[#D4AF37]/5"
              >
                <Star className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[#D4AF37] text-xs font-semibold tracking-[0.16em] uppercase">
                  Het Onafhankelijke Artiestenplatform
                </span>
              </motion.div>

              <motion.h1
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]"
              >
                Jouw Muziek.
                <br />
                <span className="text-gradient-gold">Jouw Regels.</span>
              </motion.h1>

              <motion.p
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-lg text-white/65 mb-10 font-normal leading-relaxed max-w-lg"
              >
                Zheavenzy is de thuisbasis voor de onafhankelijke maker. Breng je muziek uit op alle streamingdiensten, 
                boek professionele studio's en vind creatief talent — met 100% behoud van je rechten.
              </motion.p>

              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/diensten/artiesten" className="btn-gold flex items-center justify-center gap-2 glow-gold">
                  Start als Artiest
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/netwerk" className="btn-outline flex items-center justify-center gap-2">
                  Ontdek het Netwerk
                </Link>
              </motion.div>

              {/* Authentic Platform Guarantees (No fake vanity metrics) */}
              <motion.div
                custom={4}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="grid grid-cols-3 gap-6 mt-14 pt-8 border-t border-white/10"
              >
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold text-gradient-gold">
                    100%
                  </div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mt-1.5 font-medium">
                    Masterrechten
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold text-gradient-gold">
                    15+
                  </div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mt-1.5 font-medium">
                    Streamingdiensten
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold text-gradient-gold">
                    0%
                  </div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mt-1.5 font-medium">
                    Wurgcontracten
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex justify-center relative"
            >
              <div className="relative w-[440px] h-[530px]">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#D4AF37]/25 to-transparent border border-[#D4AF37]/20 p-3 shadow-2xl shadow-black/80">
                  <div className="w-full h-full rounded-2xl overflow-hidden relative">
                    <img
                      src="/images/hero-studio.jpg"
                      alt="Zheavenzy Recording Studio"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                    
                    {/* Realistic release card overlay */}
                    <div className="absolute bottom-6 left-6 right-6 glass-card rounded-xl p-4 border border-white/10 backdrop-blur-md">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#D4AF37]/30">
                          <Play className="w-5 h-5 text-[#050505] ml-0.5 fill-[#050505]" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-semibold text-sm truncate">Luna Voss — Nachtvlucht</div>
                          <div className="text-[#D4AF37] text-xs font-medium">Release via Zheavenzy</div>
                        </div>
                        <div className="ml-auto flex gap-1 items-end h-5 flex-shrink-0">
                          {[4, 8, 3, 7, 5].map((h, i) => (
                            <div
                              key={i}
                              className="w-1 bg-[#D4AF37] rounded-full"
                              style={{ height: `${h * 2.5}px` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle outer accent line */}
                <div className="absolute -inset-4 border border-[#D4AF37]/10 rounded-[2.2rem] pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ MISSION ═══ */}
      <section className="relative py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <div className="reveal">
            <Globe className="w-10 h-10 text-[#D4AF37] mx-auto mb-6 opacity-75" />
          </div>
          <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-white tracking-tight">
            Jouw muziek, <span className="text-gradient-gold">zonder de kleine lettertjes.</span>
          </h2>
          <p className="reveal reveal-delay-2 text-lg md:text-xl text-white/60 leading-relaxed font-normal max-w-3xl mx-auto">
            Wij zijn het eerlijke alternatief voor traditionele deals. Geen 360-contracten waarbij een label meedeelt 
            in je merchandise, optredens of rechten. Wij bieden de infrastructuur die je nodig hebt: wereldwijde distributie, 
            professionele studio-faciliteiten en een direct netwerk van producers, videografen en engineers.
          </p>
        </div>
      </section>

      {/* ═══ VOOR ARTIESTEN ═══ */}
      <section className="relative py-24 md:py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="reveal mb-16">
            <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs">01 / Grip op je carrière</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-6 tracking-tight">
              Voor <span className="text-gradient-gold">Artiesten</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl font-normal leading-relaxed">
              Geen tussenpersonen die bepalen hoe jouw sound klinkt of wanneer je uitbrengt. 
              Jij behoudt de regie over elke single, EP en album.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Upload,
                title: 'Distributie voor Altijd',
                desc: 'Jouw muziek blijft online op Spotify, Apple Music en alle streamingdiensten. Geen jaarlijkse verlengingskosten per track, geen onverwachte inhoudingen.',
              },
              {
                icon: TrendingUp,
                title: 'Zichtbaarheid & Playlists',
                desc: 'Gerichte editorial en independent playlist-pitching, metadata-optimalisatie en effectieve social media campagnes om jouw tracks bij de juiste luisteraars te krijgen.',
              },
              {
                icon: Mic2,
                title: 'Studio & Kwaliteit',
                desc: 'Boek transparant geprijsde studio-uren direct via het platform. Werk samen met ervaren engineers voor mixing en mastering op radio- en clubniveau.',
              },
              {
                icon: Award,
                title: 'Events & Live Podia',
                desc: 'Connecties met lokale podia, showcases en voorprogramma\'s. Bouw een hechte fanbase op door fysiek op het podium te staan.',
              },
              {
                icon: Zap,
                title: 'Strategisch Advies',
                desc: 'Heldere release-planning, planning voor pre-saves en content-advies. Wij helpen je strategische keuzes maken die aansluiten op jouw doelen.',
              },
              {
                icon: Radio,
                title: 'Creatief Netwerk',
                desc: 'Direct contact met betrouwbare producers, songwriters, videografen en artwork-designers. Geen vage dm\'s, maar transparante afspraken.',
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className={`reveal reveal-delay-${i + 1} glass-card p-8 rounded-2xl group cursor-default hover:border-[#D4AF37]/30 transition-colors`}
              >
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#D4AF37]/10 transition-colors border border-[#D4AF37]/15">
                  <card.icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white">{card.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURE SHOWCASE: Rechten & Transparantie ═══ */}
      <section className="relative py-24 md:py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="reveal">
                <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs">02 / Eigenaarschap & Transparantie</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6 text-white tracking-tight">
                  Jouw rechten, <span className="text-gradient-gold">helder geregeld.</span>
                </h2>
                <p className="text-white/60 leading-relaxed mb-6">
                  Geen schimmige afdrachten of onduidelijke constructies. Wij zorgen voor 
                  correcte metadata, officiële ISRC-codes en transparante split-sheets voor alle 
                  betrokkenen bij jouw release.
                </p>
                <ul className="space-y-3.5">
                  {[
                    '100% eigendom over je masteropnames',
                    'Officiële ISRC- en UPC-codes bij elke release',
                    'Duidelijke split-sheets voor producers & featured artiesten',
                    'Rechtstreeks inzicht in streams en uitbetalingen per platform',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/70 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-7 reveal reveal-delay-2">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
                <img
                  src="/images/dashboard.jpg"
                  alt="Zheavenzy Analytics Dashboard"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#050505]/40 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ VOOR KLANTEN & BOEKERS ═══ */}
      <section className="relative py-24 md:py-32 bg-[#050505]">
        <div className="absolute inset-0 bg-[url('/images/concert-stage.jpg')] bg-cover bg-center opacity-[0.03]" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs">03 / Jouw Creatieve Match</span>
              <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-6 text-white tracking-tight">
                Voor Klanten <span className="text-gradient-gold">& Boekers</span>
              </h2>
              <p className="text-lg text-white/60 mb-8 font-normal leading-relaxed max-w-lg">
                Op zoek naar de juiste sound, perfecte beelden of een live-act 
                voor je volgende sessie, show of evenement? Het Zheavenzy-netwerk verbindt je 
                rechtstreeks met professionele makers zonder tussenpersonen.
              </p>
              <Link
                to="/netwerk"
                className="inline-flex items-center gap-2 btn-outline"
              >
                Zoek & Boek Talent
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="reveal reveal-delay-2">
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Producers', icon: Headphones },
                  { label: 'Zangeressen', icon: Mic2 },
                  { label: 'Songwriters', icon: Music },
                  { label: "DJ's", icon: Radio },
                  { label: 'Sound Engineers', icon: Zap },
                  { label: 'Gitaristen', icon: Guitar },
                  { label: 'Drummers & Blazers', icon: Users },
                  { label: 'Fotografen', icon: Camera },
                  { label: 'Videografen', icon: Camera },
                ].map((tag, i) => (
                  <motion.div
                    key={tag.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    className="px-5 py-2.5 glass-card rounded-full text-white/80 font-medium hover:bg-[#D4AF37] hover:text-[#050505] cursor-default transition-all duration-300 flex items-center gap-2 text-sm"
                  >
                    <tag.icon className="w-3.5 h-3.5" />
                    {tag.label}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ VERDIENMODEL & LIDMAATSCHAP ═══ */}
      <section className="relative py-24 md:py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="reveal text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
              Eerlijk <span className="text-gradient-gold">Verdienmodel</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto font-normal">
              Duidelijke voorwaarden en transparante kosten. Kies de route die bij jouw fase past.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Points System */}
            <div className="reveal reveal-delay-1 glass-card p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full -mr-10 -mt-10" />
              <h3 className="text-2xl font-bold mb-3 text-white">Zheavenzy Punten</h3>
              <p className="text-white/60 mb-8 leading-relaxed text-sm">
                Actief zijn in de community loont. Verdien punten door samen te werken en boekingen te voltooien, 
                en wissel ze in voor studiocredits, mastering of korting op services.
              </p>
              <ul className="space-y-3.5 mb-8">
                {[
                  'Geen verplichte abonnementskosten',
                  'Verdien credits voor studiotijd of mixages',
                  'Ideaal voor samenwerkende producers en artiesten',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/platform"
                className="block w-full py-3.5 text-center rounded-xl bg-[#1a1a1a] text-white border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-[#050505] font-semibold transition-all text-sm"
              >
                Ontdek het Puntenprogramma
              </Link>
            </div>

            {/* Subscription */}
            <div className="reveal reveal-delay-2 glass-card p-10 rounded-3xl border-[#D4AF37]/30 relative overflow-hidden bg-gradient-to-b from-[#1a1a1a]/80 to-[#050505]/80">
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#050505] text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Populair
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-gold">Zheavenzy Lidmaatschappen</h3>
              <p className="text-white/60 mb-8 leading-relaxed text-sm">
                Direct toegang tot release-distributie, professionele tools en het creatieve netwerk. 
                Geen label nodig — jij brengt uit wanneer jij wilt.
              </p>
              <ul className="space-y-3.5 mb-8">
                {[
                  'Drie overzichtelijke tiers: Start, Groei en Pro',
                  'Distributie naar alle streamingdiensten inbegrepen',
                  'Maandelijks opzegbaar, 0% afdracht op live inkomsten',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/lidmaatschap"
                className="block w-full py-3.5 text-center rounded-xl bg-[#D4AF37] text-[#050505] font-bold hover:bg-[#F4D068] glow-gold transition-all text-sm"
              >
                Bekijk Lidmaatschappen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA / CONTACT ═══ */}
      <section className="relative py-24 md:py-32 bg-[#050505] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px]" />

        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <div className="reveal">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white tracking-tight">
              Klaar om je muziek <span className="text-gradient-gold">serieus te lanceren?</span>
            </h2>
          </div>
          <p className="reveal reveal-delay-1 text-lg text-white/60 mb-10 font-normal max-w-2xl mx-auto leading-relaxed">
            Kies voor volledige controle over je werk, eerlijke voorwaarden en een netwerk van gedreven makers.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/lidmaatschap" className="btn-gold glow-gold flex items-center justify-center gap-2">
              Word Lid
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/over" className="btn-outline flex items-center justify-center gap-2">
              Meer Over Ons
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
