import React from 'react'

export interface LogoIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string
  className?: string
}

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string
  showText?: boolean
  className?: string
}

export function LogoIcon({ size = 42, className = '', ...props }: LogoIconProps) {
  const pixelSize = typeof size === 'number' ? `${size}px` : size

  return (
    <div
      style={{ width: pixelSize, height: pixelSize }}
      className={`relative shrink-0 flex items-center justify-center transition-transform duration-300 ${className}`}
      {...props}
    >
      <img
        src="/images/logo-mark-transparent.png"
        alt="Zheavenzy Emblem"
        width={typeof size === 'number' ? size : 42}
        height={typeof size === 'number' ? size : 42}
        className="w-full h-full object-contain select-none drop-shadow-[0_0_10px_rgba(212,175,55,0.35)]"
        loading="eager"
        decoding="async"
      />
    </div>
  )
}

export default function Logo({ size = 42, showText = true, className = '', ...props }: LogoProps) {
  return (
    <div
      className={`inline-flex items-center gap-3.5 group cursor-pointer select-none ${className}`}
      {...props}
    >
      <div className="relative">
        <LogoIcon
          size={size}
          className="transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_14px_rgba(212,175,55,0.55)]"
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <span className="font-extrabold text-lg md:text-xl tracking-[0.24em] text-white group-hover:text-[#F5D061] transition-colors leading-tight font-sans">
            ZHEAVENZY
          </span>
          <span className="text-[9px] tracking-[0.32em] uppercase text-[#D4AF37]/85 font-semibold mt-0.5">
            Independent Platform
          </span>
        </div>
      )}
    </div>
  )
}
