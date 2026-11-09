import { Disc3 } from 'lucide-react';
import type { Track } from '@/types';

interface TrackCoverProps {
  track: Track;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function TrackCover({ track, className = '', size = 'md' }: TrackCoverProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-lg text-xs',
    md: 'w-12 h-12 rounded-xl text-sm',
    lg: 'w-20 h-20 rounded-2xl text-base',
    xl: 'w-36 h-36 rounded-2xl text-xl',
  }[size];

  if (track.coverUrl) {
    const isLogo = track.coverUrl.includes('logo');
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-black/80 overflow-hidden">
        <img
          src={track.coverUrl}
          alt={track.title}
          className={`w-full h-full ${isLogo ? 'object-contain p-4' : 'object-cover'} ${className}`}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-neutral-900 to-black border border-white/10 flex items-center justify-center text-[#D4AF37] ${sizeClasses} ${className}`}
    >
      <Disc3 className="w-1/2 h-1/2 animate-spin-slow opacity-80" />
    </div>
  );
}
