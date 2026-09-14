import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/artiesten', label: 'Voor Artiesten' },
  { href: '/netwerk', label: 'Netwerk' },
  { href: '/over', label: 'Over' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#0a0a0a] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300">
            <span className="text-[#D4AF37] font-bold text-xl" style={{ fontFamily: 'serif', fontStyle: 'italic' }}>Z</span>
          </div>
          <span className="font-bold text-lg tracking-[0.2em] text-white">ZHEAVENZY</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                isActive(link.href)
                  ? 'text-[#D4AF37]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="btn-gold text-sm glow-gold"
          >
            Word Lid
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-[#D4AF37] p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-[#050505]/98 backdrop-blur-xl border-b border-white/5 transition-all duration-300 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center py-8 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-lg font-medium uppercase tracking-wide transition-colors ${
                isActive(link.href) ? 'text-[#D4AF37]' : 'text-white/70 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/contact" className="btn-gold mt-4 w-10/12 text-center">
            Word Lid
          </Link>
        </div>
      </div>
    </nav>
  )
}
