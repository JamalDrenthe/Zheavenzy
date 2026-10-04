import { useEffect, useRef } from 'react'
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

/* ─── Particle Canvas ─── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0, h = 0
    let particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = []
    let animId = 0

    const resize = () => {
      w = canvas.offsetWidth * window.devicePixelRatio
      h = canvas.offsetHeight * window.devicePixelRatio
      canvas.width = w
      canvas.height = h
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const createParticles = () => {
      particles = []
      const count = Math.min(80, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 15000))
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.2,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.offsetWidth
        if (p.x > canvas.offsetWidth) p.x = 0
        if (p.y < 0) p.y = canvas.offsetHeight
        if (p.y > canvas.offsetHeight) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`
        ctx.fill()

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x
          const dy = particles[j].y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(212, 175, 55, ${0.08 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animId = requestAnimationFrame(draw)
    }

    resize()
    createParticles()
    draw()

    window.addEventListener('resize', () => {
      resize()
      createParticles()
    })

    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  )
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let current = 0
          const increment = target / 60
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              current = target
              clearInterval(timer)
            }
            el.textContent = Math.floor(current).toLocaleString('nl-NL') + suffix
          }, 25)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix])

  return <span ref={ref}>0{suffix}</span>
}

/* ─── Home Page ─── */
export default function Home() {
  useScrollReveal()

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    }),
  }

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050505]">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)]" />
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[120px] floating" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#3A506B]/20 rounded-full blur-[120px] floating" style={{ animationDelay: '-3s' }} />
        <ParticleField />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                <span className="text-[#D4AF37] text-xs font-semibold tracking-[0.15em] uppercase">
                  Het Eerlijke Alternatief
                </span>
              </motion.div>

              <motion.h1
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.05]"
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
                className="text-lg text-white/60 mb-10 font-light leading-relaxed max-w-lg"
              >
                Zheavenzy is het alles-in-één gereedschap voor de independent artiest. 
                Volledige controle over je carrière, zonder wurgcontracten en met 100% transparantie.
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

              {/* Stats */}
              <motion.div
                custom={4}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/5"
              >
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-gradient-gold">
                    <AnimatedCounter target={500} suffix="M+" />
                  </div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Streams beheerd</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-gradient-gold">
                    <AnimatedCounter target={2500} suffix="+" />
                  </div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Artiesten</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-gradient-gold">
                    <AnimatedCounter target={180} suffix="+" />
                  </div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Landen</div>
                </div>
              </motion.div>
            </div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex justify-center relative"
            >
              <div className="relative w-[420px] h-[520px]">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/10 p-3">
                  <div className="w-full h-full rounded-2xl overflow-hidden relative">
                    <img
                      src="/images/hero-studio.jpg"
                      alt="Music Studio"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                    
                    {/* Floating card overlay */}
                    <div className="absolute bottom-6 left-6 right-6 glass-card rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                          <Play className="w-5 h-5 text-[#050505] ml-0.5" />
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm">Independent Succes</div>
                          <div className="text-[#D4AF37] text-xs">Powered by Zheavenzy</div>
                        </div>
                        <div className="ml-auto flex gap-0.5 items-end h-6">
                          {[6, 10, 4, 8, 5, 9, 7].map((h, i) => (
                            <div
                              key={i}
                              className="w-1 bg-[#D4AF37] rounded-full"
                              style={{
                                height: `${h * 3}px`,
                                animation: `bounce 1s ease-in-out ${i * 0.1}s infinite`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative ring */}
                <div className="absolute -inset-4 border border-[#D4AF37]/5 rounded-[2rem] pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ MISSION ═══ */}
      <section className="relative py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <div className="reveal">
            <Globe className="w-10 h-10 text-[#D4AF37] mx-auto mb-6 opacity-70" />
          </div>
          <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-white tracking-tight">
            Jouw carrière, <span className="text-gradient-gold">zonder de kleine lettertjes.</span>
          </h2>
          <p className="reveal reveal-delay-2 text-lg md:text-xl text-white/50 leading-relaxed font-light max-w-3xl mx-auto">
            Wij zijn het eerlijke alternatief in de muziekindustrie. Geen 360-deals, 
            geen verborgen constructies, maar 100% transparantie. Wij bieden alles wat je nodig 
            hebt om strategisch te bewegen — van distributie en marketing tot een uitgebreid 
            creatief netwerk. Samen helpen we jou op de rails, zodat we allemaal groeien.
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
            <p className="text-xl text-white/50 max-w-2xl font-light leading-relaxed">
              Bij Zheavenzy sta jij écht centraal. Wij geloven dat independent artiesten 
              de ruimte moeten krijgen om te bouwen zonder belemmeringen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Upload,
                title: 'Distributie voor Altijd',
                desc: 'Jouw muziek blijft altijd online, zonder irritante jaarlijkse kosten. Geen verborgen inhoudingen, je werk blijft bereikbaar voor de wereld.',
              },
              {
                icon: TrendingUp,
                title: 'Vindbaarheid & Hypes',
                desc: 'Wij boosten je streams met strategische playlisting, SEO, gerichte ads en marketingcampagnes. Van lokale events tot internationale hypes.',
              },
              {
                icon: Mic2,
                title: 'Studio & Kwaliteit',
                desc: 'Boek transparant geprijsde studio\'s direct via ons platform. Professionele mixing & mastering is binnen handbereik om je sound te perfectioneren.',
              },
              {
                icon: Award,
                title: 'Events & Regionale Kansen',
                desc: 'We verbinden je met regionale events en optredens. Bouw je fanbase op met strategische live-podia en samenwerkingen in jouw regio.',
              },
              {
                icon: Zap,
                title: 'Strategisch Advies',
                desc: 'Beweeg slim in de muziekindustrie van nu. Wij geven je de tools en kennis om strategisch beslissingen te nemen voor je carrière.',
              },
              {
                icon: Radio,
                title: 'Netwerk & Samenwerking',
                desc: 'Toegang tot ons uitgebreide netwerk van producers, songwriters, muzikanten en creatieven. Samen bereik je meer.',
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className={`reveal reveal-delay-${i + 1} glass-card p-8 rounded-2xl group cursor-default`}
              >
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#D4AF37]/10 transition-colors border border-[#D4AF37]/10">
                  <card.icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white">{card.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURE SHOWCASE: Anti-Piracy ═══ */}
      <section className="relative py-24 md:py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="reveal">
                <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs">02 / Beveiliging</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6 text-white tracking-tight">
                  Jouw content, <span className="text-gradient-gold">beschermd.</span>
                </h2>
                <p className="text-white/50 leading-relaxed mb-6">
                  In het digitale tijdperk is bescherming van je muziek essentieel. 
                  Wij monitoren miljarden data-punten dagelijks om ongeautoriseerd gebruik 
                  van jouw werk te detecteren.
                </p>
                <ul className="space-y-3">
                  {[
                    'Automatische piraterij-detectie',
                    'Content-ID over alle platforms',
                    'Rechtelijke ondersteuning bij inbreuk',
                    'Realtime monitoring dashboard',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/60 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-7 reveal reveal-delay-2">
              <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/50">
                <img
                  src="/images/dashboard.jpg"
                  alt="Piracy Monitoring Dashboard"
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
              <p className="text-lg text-white/50 mb-8 font-light leading-relaxed max-w-lg">
                Op zoek naar de juiste sound, perfecte beelden of een ijzersterke live-act 
                voor je volgende sessie, show of concert? Het Zheavenzy-netwerk zit vol 
                professioneel, independent talent dat klaar is om te leveren.
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
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
            <p className="text-lg text-white/50 max-w-2xl mx-auto font-light">
              Volledige duidelijkheid over wat je verdient. Kies de route die bij jouw fase past.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Points System */}
            <div className="reveal reveal-delay-1 glass-card p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full -mr-10 -mt-10" />
              <h3 className="text-2xl font-bold mb-3 text-white">Zheavenzy Punten</h3>
              <p className="text-white/50 mb-8 leading-relaxed">
                Bouw samen met ons aan de community. Verdien punten via ons ledenprogramma 
                door actief te zijn, en wissel ze aan het einde van de maand in voor gratis 
                gebruik van onze diensten en het netwerk.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Geen maandelijkse vastigheden',
                  'Verdien studio-tijd of mixages',
                  'Ideaal voor samenwerkers',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/60 text-sm">
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
            <div className="reveal reveal-delay-2 glass-card p-10 rounded-3xl border-[#D4AF37]/20 relative overflow-hidden bg-gradient-to-b from-[#1a1a1a]/80 to-[#050505]/80">
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#050505] text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Populair
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-gold">Zheavenzy Lidmaatschappen</h3>
              <p className="text-white/50 mb-8 leading-relaxed">
                Met een Zheavenzy-lidmaatschap krijg je meteen toegang tot het complete platform:
                alle tools, releases op alle streaming platforms en het netwerk. Geen label
                nodig — je hoeft niet getekend te zijn.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Drie tiers: Start, Groei en Pro',
                  'Releases op alle platforms inbegrepen',
                  'Maandelijks opzegbaar, geen percentages',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/60 text-sm">
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
              Klaar om je carrière <span className="text-gradient-gold">te boosten?</span>
            </h2>
          </div>
          <p className="reveal reveal-delay-1 text-lg text-white/50 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
            Sluit je aan bij duizenden independent artiesten die al kiezen voor transparantie, 
            eerlijke deals en een toegewijd team dat meedenkt.
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
