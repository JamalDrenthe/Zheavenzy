import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { motion } from 'framer-motion'
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ArrowRight,
  Instagram,
  Twitter,
  Youtube,
  Music
} from 'lucide-react'

export default function Contact() {
  useScrollReveal()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'artiest',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center bg-[#050505] pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs">Contact</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mt-4 mb-6 leading-[1.05]">
              Laten we <span className="text-gradient-gold">praten.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed">
              Heb je vragen of wil je direct van start? We horen graag van je. 
              Vul het formulier in en we nemen zo snel mogelijk contact op.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Form */}
            <div className="lg:col-span-7 reveal">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card rounded-2xl p-12 text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">Bedankt voor je bericht!</h3>
                  <p className="text-white/50 max-w-md mx-auto mb-8">
                    We hebben je aanvraag ontvangen en nemen binnen 24 uur contact met je op. 
                    Tot snel!
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', type: 'artiest', message: '' })
                    }}
                    className="btn-outline"
                  >
                    Nieuw bericht versturen
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 md:p-10">
                  <h3 className="text-xl font-bold text-white mb-6">Stuur ons een bericht</h3>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Naam</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                        placeholder="Jouw naam"
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 text-sm mb-2">E-mail</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                        placeholder="jouw@email.nl"
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 text-sm mb-2">Ik ben een...</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="artiest">Artiest / Muzikant</option>
                        <option value="boeker">Boeker / Event Organizer</option>
                        <option value="producer">Producer / Creative</option>
                        <option value="andere">Andere</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/60 text-sm mb-2">Bericht</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors resize-none"
                        placeholder="Vertel ons waar we je mee kunnen helpen..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-gold glow-gold flex items-center justify-center gap-2 py-4"
                    >
                      Verstuur Bericht
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="reveal reveal-delay-1">
                <h3 className="text-xl font-bold text-white mb-6">Contactgegevens</h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center border border-[#D4AF37]/10 flex-shrink-0">
                      <Mail className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="text-white/40 text-xs uppercase tracking-wider mb-1">E-mail</div>
                      <a href="mailto:info@zheavenzy.nl" className="text-white hover:text-[#D4AF37] transition-colors">
                        info@zheavenzy.nl
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center border border-[#D4AF37]/10 flex-shrink-0">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Locatie</div>
                      <span className="text-white">Amsterdam, Nederland</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center border border-[#D4AF37]/10 flex-shrink-0">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Responstijd</div>
                      <span className="text-white">Binnen 24 uur</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="reveal reveal-delay-2 glass-card rounded-2xl p-6">
                <h4 className="text-white font-bold mb-4 text-sm">Volg ons</h4>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, label: 'Instagram' },
                    { icon: Twitter, label: 'Twitter' },
                    { icon: Youtube, label: 'YouTube' },
                    { icon: Music, label: 'TikTok' },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href="#"
                      className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-white/50 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 transition-all"
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div className="reveal reveal-delay-3 glass-card rounded-2xl p-6">
                <h4 className="text-white font-bold mb-4 text-sm">Snel naar</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Diensten voor Artiesten', href: '/artiesten' },
                    { label: 'Ontdek het Netwerk', href: '/netwerk' },
                    { label: 'Over Zheavenzy', href: '/over' },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between text-white/60 hover:text-[#D4AF37] transition-colors text-sm group"
                    >
                      {link.label}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="reveal text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Veelgestelde <span className="text-gradient-gold">vragen.</span>
            </h2>
            <p className="text-white/50">Antwoorden op de meest gestelde vragen.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Wat kost het om muziek te distribueren via Zheavenzy?',
                a: 'Onze distributie is zonder jaarlijkse kosten. Je muziek blijft voor altijd online. We werken met een eerlijk verdienmodel waarbij je precies weet waar je aan toe bent.',
              },
              {
                q: 'Hoe werkt het ledenprogramma met punten?',
                a: 'Door actief te zijn op het platform — bijvoorbeeld door samen te werken met andere leden, content te delen of events te organiseren — verdien je punten. Deze wissel je aan het einde van de maand in voor gratis gebruik van onze diensten.',
              },
              {
                q: 'Kan ik als boeker direct contact leggen met talent?',
                a: 'Ja, ons platform faciliteert direct contact tussen boekers en talent. Je kunt profielen bekijken, beschikbaarheid checken en veilig boeken via ons systeem.',
              },
              {
                q: 'Wat zijn de subscription deals?',
                a: 'Als je nog niet klaar bent om via het puntenprogramma mee te doen, kun je kiezen voor een van onze overzichtelijke maandelijkse abonnementen. Dit geeft je volledige toegang tot alle diensten voor een vast bedrag.',
              },
              {
                q: 'Behoud ik de rechten op mijn muziek?',
                a: 'Absoluut. Bij Zheavenzy geloven we dat jij de eigenaar blijft van je werk. Geen 360-deals, geen rechtenoverdracht. Jij behoudt 100% controle.',
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-card rounded-xl p-6"
              >
                <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <div className="reveal">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
              We staan <span className="text-gradient-gold">voor je klaar.</span>
            </h2>
          </div>
          <p className="reveal reveal-delay-1 text-lg text-white/50 mb-8 font-light max-w-xl mx-auto">
            Of je nu een artiest bent die wil starten of een boeker op zoek naar talent — 
            samen vinden we de beste oplossing.
          </p>
          <div className="reveal reveal-delay-2">
            <a href="#" className="btn-gold glow-gold inline-flex items-center gap-2">
              Start nu
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
