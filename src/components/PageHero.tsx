import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

type Props = {
  eyebrow: string
  title: ReactNode
  description: string
  minHeight?: string
}

export default function PageHero({ eyebrow, title, description, minHeight = 'min-h-[70vh]' }: Props) {
  return (
    <section className={`relative ${minHeight} flex items-center bg-[#050505] pt-24 overflow-hidden`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#D4AF37]/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#3A506B]/10 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 bg-[#D4AF37]/5 text-[#D4AF37] text-xs font-semibold tracking-[0.2em] uppercase">
            {eyebrow}
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mt-6 mb-6 leading-[1.05]">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export function CtaSection({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: ReactNode
  description: string
  primaryHref: string
  primaryLabel: string
  secondaryHref?: string
  secondaryLabel?: string
}) {
  return (
    <section className="py-24 md:py-32 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[150px]" />
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
        <div className="reveal">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
            {title}
          </h2>
        </div>
        <p className="reveal reveal-delay-1 text-lg text-white/50 mb-10 font-light max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
        <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={primaryHref} className="btn-gold glow-gold flex items-center justify-center gap-2">
            {primaryLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link to={secondaryHref} className="btn-outline flex items-center justify-center gap-2">
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow?: string
  title: ReactNode
  description?: string
  center?: boolean
}) {
  return (
    <div className={`reveal mb-16 ${center ? 'text-center' : ''}`}>
      {eyebrow && (
        <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-3">
        {title}
      </h2>
      {description && (
        <p className={`text-lg text-white/50 mt-6 font-light leading-relaxed ${center ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {description}
        </p>
      )}
    </div>
  )
}
