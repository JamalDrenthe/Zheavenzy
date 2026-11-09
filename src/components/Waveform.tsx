import { useState, useRef, useMemo, useCallback } from 'react';
import type { Track } from '@/types';

interface WaveformProps {
  track: Track;
  currentTime?: number;
  duration?: number;
  isPlaying?: boolean;
  onSeek?: (time: number) => void;
  variant?: 'player' | 'hero' | 'compact';
  barCount?: number;
  className?: string;
  interactive?: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getNormalizedWaveformData(track: Track, targetCount: number): number[] {
  const existing = track.waveformData;
  
  if (Array.isArray(existing) && existing.length > 0) {
    const maxVal = Math.max(...existing, 1);
    const normalizedRaw = existing.map((val) => (maxVal > 1 ? val / maxVal : val));
    
    const result: number[] = [];
    for (let i = 0; i < targetCount; i++) {
      const srcIndex = (i / targetCount) * (normalizedRaw.length - 1);
      const low = Math.floor(srcIndex);
      const high = Math.min(low + 1, normalizedRaw.length - 1);
      const weight = srcIndex - low;
      const interpolated = (1 - weight) * normalizedRaw[low] + weight * normalizedRaw[high];
      result.push(Math.max(0.18, Math.min(0.96, interpolated)));
    }
    return result;
  }

  let hash = 0;
  const str = `${track.id}_${track.title}_${track.duration}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  const points: number[] = [];
  for (let i = 0; i < targetCount; i++) {
    const progress = i / targetCount;
    const introFade = Math.min(1, progress * 4);
    const outroFade = Math.min(1, (1 - progress) * 4);
    
    const wave1 = Math.sin(progress * Math.PI * 4) * 0.25;
    const wave2 = Math.cos(progress * Math.PI * 8 + seed) * 0.18;
    const wave3 = Math.sin(progress * Math.PI * 18 + (seed % 17)) * 0.15;
    const pseudoRand = ((seed * (i + 13) * 9301 + 49297) % 233280) / 233280;
    const beatSpike = (pseudoRand - 0.5) * 0.35;
    const dynamicStructure = 0.5 + Math.sin(progress * Math.PI) * 0.3;

    const rawHeight = (dynamicStructure + wave1 + wave2 + wave3 + beatSpike) * introFade * outroFade;
    points.push(Math.max(0.18, Math.min(0.96, rawHeight)));
  }

  return points;
}

export function Waveform({
  track,
  currentTime = 0,
  duration = 0,
  isPlaying = false,
  onSeek,
  variant = 'player',
  barCount,
  className = '',
  interactive = true,
}: WaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverPosition, setHoverPosition] = useState<{ fraction: number; time: number; x: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const numBars = useMemo(() => {
    if (barCount) return barCount;
    if (variant === 'hero') return 72;
    if (variant === 'compact') return 28;
    return 48; // player default
  }, [barCount, variant]);

  const bars = useMemo(() => {
    return getNormalizedWaveformData(track, numBars);
  }, [track, numBars]);

  const effectiveDuration = duration > 0 ? duration : track.duration || 180;
  const progressFraction = Math.max(0, Math.min(1, currentTime / effectiveDuration));

  const calculateFractionFromEvent = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      return x / rect.width;
    },
    []
  );

  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onSeek) return;
    setIsDragging(true);
    const fraction = calculateFractionFromEvent(e);
    onSeek(fraction * effectiveDuration);

    const onPointerMove = (moveEv: MouseEvent) => {
      const fr = calculateFractionFromEvent(moveEv);
      onSeek(fr * effectiveDuration);
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const fraction = x / rect.width;
    setHoverPosition({ fraction, time: fraction * effectiveDuration, x });
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setHoverPosition(null);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handlePointerDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none flex items-center justify-between gap-[2px] sm:gap-[3px] py-1 ${
        interactive ? 'cursor-pointer group' : 'cursor-default'
      } ${className}`}
      style={{ minHeight: variant === 'hero' ? '56px' : variant === 'compact' ? '24px' : '32px' }}
    >
      {/* Bars container */}
      {bars.map((amplitude, i) => {
        const barFraction = i / numBars;
        const isPassed = barFraction <= progressFraction;
        const isHovered = hoverPosition ? barFraction <= hoverPosition.fraction : false;

        let heightPercent = amplitude * 100;
        if (isPlaying && isPassed) {
          // Subtle live pulse on current playing bars
          const pulse = Math.sin((Date.now() / 200) + i) * 8;
          heightPercent = Math.max(20, Math.min(100, heightPercent + pulse));
        }

        return (
          <div
            key={i}
            className="flex-1 rounded-full transition-all duration-100 ease-out flex items-center justify-center"
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              className={`w-full rounded-full transition-all duration-75 ${
                isPassed
                  ? 'bg-gradient-to-t from-[#D4AF37] to-[#F3E5AB] shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                  : isHovered
                  ? 'bg-white/40'
                  : 'bg-white/15 group-hover:bg-white/25'
              }`}
              style={{
                height: `${Math.max(16, heightPercent)}%`,
              }}
            />
          </div>
        );
      })}

      {/* Scrub timestamp bubble on hover */}
      {interactive && hoverPosition && (
        <div
          className="absolute -top-7 transform -translate-x-1/2 pointer-events-none z-30 px-2 py-0.5 rounded-md bg-black/90 border border-white/15 text-[10px] font-mono text-[#F3E5AB] shadow-lg backdrop-blur-md"
          style={{ left: `${hoverPosition.x}px` }}
        >
          {formatTime(hoverPosition.time)}
        </div>
      )}
    </div>
  );
}
