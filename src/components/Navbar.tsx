import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, LogIn, LayoutDashboard } from 'lucide-react'
import { usePlatform } from '../lib/usePlatform'

type NavItem = {
  label: string
  href?: string
  children?: { href: string; label: string; desc?: string }[]
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Diensten',
    children: [
      { href: '/diensten', label: 'Alle Diensten', desc: 'Compleet overzicht van het platform' },
      { href: '/diensten/artiesten', label: 'Voor Artiesten', desc: 'Tools & begeleiding voor je carrière' },
      { href: '/diensten/studio', label: 'Studio & Mastering', desc: 'Boek studio\'s en sound engineers' },
      { href: '/diensten/marketing', label: 'Marketing & Groei', desc: 'Playlisting, SEO & campagnes' },
      { href: '/diensten/events', label: 'Events & Boekingen', desc: 'Regionale podia en live-kansen' },
    ],
  },
  {
    label: 'Platform',
    children: [
      { href: '/platform', label: 'Het Platform', desc: 'Lid of getekend — twee routes' },
      { href: '/platform/releases', label: 'Muziek Uitbrengen', desc: 'Releases op alle platforms, zonder label' },
      { href: '/lidmaatschap', label: 'Lidmaatschappen', desc: 'Drie tiers, één keuze die past' },
    ],
  },
  { label: 'Netwerk', href: '/netwerk' },
  { label: 'Over', href: '/over' },
  { label: 'Contact', href: '/contact' },
]

function isItemActive(item: NavItem, pathname: string) {
  if (item.href) {
    if (item.href === '/') return pathname === '/'
    return pathname.startsWith(item.href)
  }
  return item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + '/')) ?? false
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const { user } = usePlatform()

  const [prevPath, setPrevPath] = useState(location.pathname)
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    setMobileOpen(false)
    setOpenDropdown(null)
    setMobileExpanded(null)
  }

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const linkClass = (active: boolean) =>
    `text-sm font-medium tracking-wide uppercase transition-colors duration-200 ${
      active ? 'text-[#D4AF37]' : 'text-white/70 hover:text-white'
    }`

  return (
    <header ref={navRef} className="fixed top-0 left-0 w-full z-50 bg-[#050505] border-b border-white/10 shadow-lg shadow-black/40">
      <nav className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#0a0a0a] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300">
            <span className="text-[#D4AF37] font-bold text-xl" style={{ fontFamily: 'serif', fontStyle: 'italic' }}>Z</span>
          </div>
          <span className="font-bold text-lg tracking-[0.2em] text-white">ZHEAVENZY</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-7">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  className={`flex items-center gap-1.5 py-2 ${linkClass(isItemActive(item, location.pathname))}`}
                  aria-expanded={openDropdown === item.label}
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      openDropdown === item.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2 w-72">
                    <div className="rounded-xl bg-[#111111] border border-white/15 shadow-2xl shadow-black overflow-hidden">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={`block px-5 py-3.5 border-b border-white/5 last:border-0 transition-colors duration-150 ${
                            location.pathname === child.href
                              ? 'bg-[#D4AF37]/15 text-[#D4AF37]'
                              : 'text-white/75 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="block text-sm font-semibold">{child.label}</span>
                          {child.desc && (
                            <span className="block text-xs text-white/45 mt-0.5">{child.desc}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} to={item.href!} className={linkClass(isItemActive(item, location.pathname))}>
                {item.label}
              </Link>
            )
          )}
          <Link
            to={user ? '/dashboard' : '/login'}
            className="flex items-center gap-1.5 text-sm font-medium tracking-wide uppercase text-white/70 hover:text-white transition-colors"
          >
            {user ? <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" /> : <LogIn className="w-4 h-4 text-[#D4AF37]" />}
            {user ? 'Dashboard' : 'Inloggen'}
          </Link>
          <Link to="/lidmaatschap" className="btn-gold text-sm glow-gold">
            Word Lid
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-[#D4AF37] p-2"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#050505] border-t border-white/10 max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex flex-col px-8 py-6">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    className={`w-full flex items-center justify-between py-4 text-lg font-medium uppercase tracking-wide transition-colors ${
                      isItemActive(item, location.pathname) ? 'text-[#D4AF37]' : 'text-white/80'
                    }`}
                    aria-expanded={mobileExpanded === item.label}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        mobileExpanded === item.label ? 'rotate-180 text-[#D4AF37]' : ''
                      }`}
                    />
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="pb-4 pl-4 flex flex-col gap-1 bg-[#0a0a0a] rounded-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={`py-2.5 px-3 text-base rounded-md transition-colors ${
                            location.pathname === child.href
                              ? 'text-[#D4AF37] font-semibold bg-[#D4AF37]/10'
                              : 'text-white/65 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  to={item.href!}
                  className={`py-4 text-lg font-medium uppercase tracking-wide border-b border-white/10 transition-colors ${
                    isItemActive(item, location.pathname) ? 'text-[#D4AF37]' : 'text-white/80'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              to={user ? '/dashboard' : '/login'}
              className="py-4 text-lg font-medium uppercase tracking-wide border-b border-white/10 text-white/80 flex items-center gap-2"
            >
              {user ? <LayoutDashboard className="w-5 h-5 text-[#D4AF37]" /> : <LogIn className="w-5 h-5 text-[#D4AF37]" />}
              {user ? 'Dashboard' : 'Inloggen'}
            </Link>
            <Link to="/lidmaatschap" className="btn-gold mt-6 text-center">
              Word Lid
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
