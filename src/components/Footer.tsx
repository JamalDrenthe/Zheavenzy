import { Link } from 'react-router-dom'
import { Instagram, Twitter, Youtube, Mail } from 'lucide-react'

const footerGroups = [
  {
    title: 'Diensten',
    links: [
      { to: '/diensten', label: 'Alle Diensten' },
      { to: '/diensten/artiesten', label: 'Voor Artiesten' },
      { to: '/diensten/studio', label: 'Studio & Mastering' },
      { to: '/diensten/marketing', label: 'Marketing & Groei' },
      { to: '/diensten/events', label: 'Events & Boekingen' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { to: '/platform', label: 'Het Platform' },
      { to: '/platform/releases', label: 'Muziek Uitbrengen' },
      { to: '/lidmaatschap', label: 'Lidmaatschappen' },
    ],
  },
  {
    title: 'Bedrijf',
    links: [
      { to: '/netwerk', label: 'Netwerk' },
      { to: '/over', label: 'Over Ons' },
      { to: '/contact', label: 'Contact' },
    ],
  },
]

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Mail, href: 'mailto:info@zheavenzy.nl', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#0a0a0a]">
                <span className="text-[#D4AF37] font-bold text-xl" style={{ fontFamily: 'serif', fontStyle: 'italic' }}>Z</span>
              </div>
              <span className="font-bold text-xl tracking-[0.2em] text-white">ZHEAVENZY</span>
            </Link>
            <p className="text-white/50 max-w-sm leading-relaxed text-sm">
              Het alles-in-één platform voor de independent artiest.
              Wij faciliteren, jij creëert — geen wurgcontracten,
              volledige transparantie.
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-[0.2em]">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-white/50 hover:text-[#D4AF37] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Zheavenzy. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/30 hover:text-[#D4AF37] transition-colors text-xs">Privacybeleid</a>
            <a href="#" className="text-white/30 hover:text-[#D4AF37] transition-colors text-xs">Algemene Voorwaarden</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
