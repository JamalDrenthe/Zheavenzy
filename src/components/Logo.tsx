import type { SVGProps } from 'react'

interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  showText?: boolean
  className?: string
}

export function LogoIcon({ size = 40, className = '', ...props }: { size?: number | string; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <defs>
        {/* Metallic Gold Primary Gradient */}
        <linearGradient id="zhGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF1BD" />
          <stop offset="25%" stopColor="#F5D061" />
          <stop offset="60%" stopColor="#D4AF37" />
          <stop offset="90%" stopColor="#9E781E" />
          <stop offset="100%" stopColor="#6E5010" />
        </linearGradient>

        {/* Accent Wing Gradient */}
        <linearGradient id="zhWingGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9E781E" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#FFF4D0" />
          <stop offset="100%" stopColor="#E2BA48" />
        </linearGradient>

        {/* Subtle Dark Glow Backdrop */}
        <radialGradient id="zhHalo" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>

        {/* Outer Ring Gold Foil */}
        <linearGradient id="zhRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D061" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#8A6517" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.7" />
        </linearGradient>

        {/* Drop shadow filter */}
        <filter id="zhGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ambient background halo */}
      <circle cx="50" cy="50" r="46" fill="url(#zhHalo)" />

      {/* Sleek outer concentric luxury ring with notch accents */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="url(#zhRingGrad)"
        strokeWidth="1.5"
        strokeDasharray="95 10 55 10"
        strokeLinecap="round"
      />

      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#D4AF37"
        strokeWidth="0.75"
        strokeOpacity="0.25"
      />

      {/* Geometric 'Z' Monogram combined with Celestial Wings & Sound Harmonics */}
      <g filter="url(#zhGlow)">
        {/* Top Wing / Upper Horizontal Bar of Z */}
        <path
          d="M26 31C26 28.5 28.5 26.5 31.5 26.5H72C74.5 26.5 76 29 74.5 31L67 41C66 42.5 64 43.5 62 43.5H39C36.5 43.5 34.5 41.5 35 39L36.5 31H26Z"
          fill="url(#zhGoldGrad)"
        />

        {/* Dynamic Celestial Diagonal Blade */}
        <path
          d="M66.5 38L34.5 64C33 65.2 32 67.2 32 69.2L32.2 72.5C32.3 74 34.2 74.8 35.3 73.8L68.5 44C70 42.6 70.8 40.5 70.5 38.5L70.2 35.5C70.1 34 68.2 33.3 67 34.4L66.5 38Z"
          fill="url(#zhWingGrad)"
        />

        {/* Bottom Wing / Lower Horizontal Bar of Z */}
        <path
          d="M27.5 68C26 66.5 27 64 29.5 64H59.5C62 64 64 66 63.5 68.5L62 76.5H29.5C27 76.5 25.5 74 27 72L27.5 68Z"
          fill="url(#zhGoldGrad)"
        />

        {/* Central Soundwave / Frequency Crown Diamonds */}
        <polygon points="50,19 53,24 50,29 47,24" fill="#FFF1BD" opacity="0.9" />
        <polygon points="50,71 52.5,75 50,79 47.5,75" fill="#FFF1BD" opacity="0.8" />
      </g>
    </svg>
  )
}

export default function Logo({ size = 40, showText = true, className = '' }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-3.5 group cursor-pointer ${className}`}>
      <div className="relative">
        <LogoIcon
          size={size}
          className="transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.5)]"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-lg md:text-xl tracking-[0.24em] text-white group-hover:text-[#F5D061] transition-colors font-sans">
            ZHEAVENZY
          </span>
          <span className="text-[9px] tracking-[0.32em] uppercase text-[#D4AF37]/75 font-semibold -mt-0.5">
            Independent Platform
          </span>
        </div>
      )}
    </div>
  )
}
