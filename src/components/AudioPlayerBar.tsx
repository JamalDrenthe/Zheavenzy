import { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  ListMusic,
  Heart,
  Activity,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePlayer } from '@/context/PlayerContext';
import { useTracks } from '@/context/TrackContext';
import { Link } from 'react-router-dom';
import { Waveform } from '@/components/Waveform';
import { TrackCover } from '@/components/TrackCover';
import { getArtistById } from '@/data/audioCatalog';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AudioPlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    queue,
    queueIndex,
    isShuffled,
    repeatMode,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleRepeat,
    removeFromQueue,
  } = usePlayer();

  const { likeTrack } = useTracks();
  const [showExpandedWaveform, setShowExpandedWaveform] = useState(false);
  const progress = duration > 0 ? currentTime / duration : 0;

  // Global spacebar keyboard shortcut to toggle play/pause when not in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (e.code === 'Space' && activeTag !== 'input' && activeTag !== 'textarea') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  if (!currentTrack) return null;

  const artist = getArtistById(currentTrack.userId);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0c]/95 backdrop-blur-2xl backdrop-saturate-150 border-t border-white/10 shadow-[0_-12px_40px_rgba(0,0,0,0.85)]">
      {/* Top Hairline Gold Scrubber */}
      <div className="group relative h-1 hover:h-2 bg-white/10 cursor-pointer transition-all duration-150">
        <div
          className="absolute h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Expanded Studio Waveform Visualizer Drawer */}
      {showExpandedWaveform && (
        <div className="px-4 sm:px-6 lg:px-8 py-3 bg-[#111114]/95 border-b border-white/10 backdrop-blur-2xl transition-all">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <span className="text-[11px] font-mono text-[#D4AF37] w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1">
              <Waveform
                track={currentTrack}
                currentTime={currentTime}
                duration={duration}
                isPlaying={isPlaying}
                onSeek={seek}
                variant="hero"
                className="h-12"
              />
            </div>
            <span className="text-[11px] font-mono text-white/50 w-12">
              {formatTime(duration)}
            </span>
            <button
              onClick={() => setShowExpandedWaveform(false)}
              className="text-white/40 hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Bar Content */}
      <div className="h-18 sm:h-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Track Information & Like */}
          <div className="flex items-center gap-3 flex-1 min-w-0 max-w-[280px] sm:max-w-xs">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10 shadow-md bg-black/60">
              <TrackCover track={currentTrack} />
            </div>
            <div className="min-w-0">
              <Link
                to={`/app/track/${currentTrack.id}`}
                className="text-xs sm:text-sm font-semibold tracking-tight text-white truncate hover:text-[#D4AF37] transition-colors block"
              >
                {currentTrack.title}
              </Link>
              <span className="text-[11px] sm:text-xs text-white/50 truncate block mt-0.5">
                {artist?.displayName || currentTrack.userName || 'Zheavenzy Artiest'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="flex-shrink-0 hover:bg-white/10 active:scale-90 transition-all rounded-full h-8 w-8 text-white/60 hover:text-white"
              onClick={() => likeTrack(currentTrack.id)}
              title={currentTrack.isLiked ? 'Vind ik niet meer leuk' : 'Vind ik leuk'}
            >
              <Heart
                className={`w-4 h-4 transition-all ${
                  currentTrack.isLiked
                    ? 'fill-[#D4AF37] text-[#D4AF37]'
                    : 'text-white/40 hover:text-white'
                }`}
              />
            </Button>
          </div>

          {/* Center: Controls & Mini Waveform Scrubber */}
          <div className="flex flex-col items-center gap-1 flex-1 max-w-lg">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                className={`h-7 w-7 rounded-full hidden sm:flex ${
                  isShuffled ? 'text-[#D4AF37]' : 'text-white/40 hover:text-white'
                }`}
                onClick={toggleShuffle}
                title="Shuffle"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 rounded-full text-white/60 hover:text-white"
                onClick={previousTrack}
                title="Vorige track"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:opacity-95 text-black shadow-[0_0_15px_rgba(212,175,55,0.3)] active:scale-95 transition-all"
                onClick={togglePlay}
                title={isPlaying ? 'Pauzeren' : 'Afspelen'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black ml-0.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 rounded-full text-white/60 hover:text-white"
                onClick={nextTrack}
                title="Volgende track"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className={`h-7 w-7 rounded-full hidden sm:flex ${
                  repeatMode !== 'none' ? 'text-[#D4AF37]' : 'text-white/40 hover:text-white'
                }`}
                onClick={toggleRepeat}
                title="Herhalen"
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-3.5 h-3.5" />
                ) : (
                  <Repeat className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>

            {/* Scrubber row with waveform */}
            <div className="flex items-center gap-2.5 w-full">
              <span className="text-[10px] font-mono text-white/50 w-8 text-right hidden xs:inline-block">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 px-1">
                <Waveform
                  track={currentTrack}
                  currentTime={currentTime}
                  duration={duration}
                  isPlaying={isPlaying}
                  onSeek={seek}
                  variant="player"
                  className="h-4 sm:h-5"
                />
              </div>
              <span className="text-[10px] font-mono text-white/50 w-8 hidden xs:inline-block">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: Studio Toggle, Volume, Download & Queue */}
          <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end max-w-[240px]">
            {/* Visualizer Toggle */}
            <button
              onClick={() => setShowExpandedWaveform((prev) => !prev)}
              className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider transition-all border ${
                showExpandedWaveform
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                  : 'bg-white/5 text-white/60 hover:text-white border-white/10'
              }`}
              title="Studio visualizer openen"
            >
              <Activity className="w-3 h-3 text-[#D4AF37]" />
              <span>Studio</span>
            </button>

            {/* Volume Control */}
            <div className="hidden lg:flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 rounded-full text-white/60 hover:text-white"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                max={100}
                step={1}
                className="w-18"
                onValueChange={(val) => setVolume(val[0] / 100)}
              />
            </div>

            {/* Queue Flyout */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 rounded-full text-white/60 hover:text-white relative"
                  title="Afspeelwachtrij"
                >
                  <ListMusic className="w-4 h-4" />
                  {queue.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                      {queue.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md bg-[#0e0e11]/98 backdrop-blur-2xl border-l border-white/10 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white text-lg font-semibold tracking-tight">
                    Afspeelwachtrij
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
                  {queue.length === 0 ? (
                    <div className="text-center text-white/40 py-12 text-sm">
                      <ListMusic className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#D4AF37]" />
                      De afspeelwachtrij is momenteel leeg.
                    </div>
                  ) : (
                    queue.map((track, idx) => {
                      const trackArtist = getArtistById(track.userId);
                      const isCurrent = idx === queueIndex;
                      return (
                        <div
                          key={`${track.id}-${idx}`}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                            isCurrent
                              ? 'bg-white/10 border-[#D4AF37]/50 text-white'
                              : 'bg-white/[0.02] border-transparent hover:bg-white/[0.06]'
                          }`}
                        >
                          <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-white/10 bg-black/40">
                            <TrackCover track={track} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-semibold truncate ${
                                isCurrent ? 'text-[#D4AF37]' : 'text-white'
                              }`}
                            >
                              {track.title}
                            </p>
                            <p className="text-[11px] text-white/50 truncate">
                              {trackArtist?.displayName || track.userName || 'Zheavenzy'}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 text-white/40 hover:text-white rounded-full"
                            onClick={() => removeFromQueue(idx)}
                          >
                            Verwijder
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
