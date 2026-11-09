import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import type { Track, PlayerState } from '@/types';
import { getLocalAudioUrl, getAudioUrlSync } from '@/lib/audioStorage';
import { generateTrackAudio } from '@/lib/audioSynthesizer';

interface PlayerContextType extends PlayerState {
  playTrack: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playQueue: (tracks: Track[], startIndex?: number) => void;
  shufflePlayQueue: (tracks: Track[]) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const handleNextTrackRef = useRef<() => void>(() => {});

  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.85,
    isMuted: false,
    queue: [],
    queueIndex: 0,
    isShuffled: false,
    repeatMode: 'none',
  });

  const currentLoadedTrackId = useRef<string | null>(null);
  const loadingTokenRef = useRef<number>(0);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = state.volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setState((prev) => ({ ...prev, duration: audio.duration }));
      }
    };

    const handleEnded = () => {
      handleNextTrackRef.current();
    };

    const handleError = async () => {
      if (!state.currentTrack) return;
      try {
        const fallbackUrl = await generateTrackAudio(state.currentTrack);
        if (audioRef.current && audioRef.current.src !== fallbackUrl) {
          audioRef.current.src = fallbackUrl;
          if (state.isPlaying) {
            audioRef.current.play().catch(() => {});
          }
        }
      } catch {
        // Fallback catch
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolveAudioUrl = useCallback(async (track: Track): Promise<string> => {
    try {
      const syncUrl = getAudioUrlSync(track.id);
      if (syncUrl) return syncUrl;

      const localUrl = await getLocalAudioUrl(track.id);
      if (localUrl) return localUrl;

      const rawUrl = track.audioUrl;
      if (rawUrl && rawUrl.trim() !== '') {
        return rawUrl;
      }

      return await generateTrackAudio(track);
    } catch {
      return await generateTrackAudio(track);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!state.currentTrack) {
      audio.pause();
      return;
    }

    const currentTrack = state.currentTrack;
    const shouldPlay = state.isPlaying;
    const token = ++loadingTokenRef.current;

    if (currentLoadedTrackId.current !== currentTrack.id) {
      currentLoadedTrackId.current = currentTrack.id;
      audio.pause();

      resolveAudioUrl(currentTrack).then((url) => {
        if (token !== loadingTokenRef.current || !audioRef.current) return;

        if (audioRef.current.src !== url) {
          audioRef.current.src = url;
          try {
            audioRef.current.currentTime = 0;
          } catch {
            // Ignore
          }
        }

        if (shouldPlay) {
          audioRef.current.play().catch(async () => {
            if (token !== loadingTokenRef.current || !audioRef.current) return;
            const fallback = await generateTrackAudio(currentTrack);
            if (audioRef.current.src !== fallback) {
              audioRef.current.src = fallback;
              audioRef.current.play().catch(() => {});
            }
          });
        }
      });
    } else {
      if (shouldPlay) {
        if (!audio.src || audio.src === '' || audio.src === window.location.href) {
          resolveAudioUrl(currentTrack).then((url) => {
            if (token !== loadingTokenRef.current || !audioRef.current) return;
            audioRef.current.src = url;
            audioRef.current.play().catch(() => {});
          });
        } else {
          audio.play().catch(async () => {
            const fallback = await generateTrackAudio(currentTrack);
            if (audioRef.current && audioRef.current.src !== fallback) {
              audioRef.current.src = fallback;
              audioRef.current.play().catch(() => {});
            }
          });
        }
      } else {
        audio.pause();
      }
    }
  }, [state.currentTrack, state.isPlaying, resolveAudioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : state.volume;
    }
  }, [state.volume, state.isMuted]);

  const playTrack = (track: Track) => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }

    currentLoadedTrackId.current = track.id;
    const syncUrl = getAudioUrlSync(track.id) || (track.audioUrl && track.audioUrl.trim() !== '' ? track.audioUrl : null);

    if (audio && syncUrl) {
      if (audio.src !== syncUrl) {
        audio.src = syncUrl;
        try {
          audio.currentTime = 0;
        } catch {
          // Ignore
        }
      }
      audio.play().catch(() => {});
    } else if (audio) {
      audio.src = '';
      resolveAudioUrl(track).then((resolvedUrl) => {
        if (!audioRef.current || currentLoadedTrackId.current !== track.id) return;
        audioRef.current.src = resolvedUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('zheavenzy:track_played', { detail: { trackId: track.id } }));
    }

    setState((prev) => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      duration: track.duration || 180,
    }));
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setState((prev) => ({ ...prev, isPlaying: false }));
  };

  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    setState((prev) => ({ ...prev, isPlaying: true }));
  };

  const togglePlay = () => {
    setState((prev) => {
      const nextPlaying = !prev.isPlaying;
      if (audioRef.current) {
        if (nextPlaying) {
          audioRef.current.play().catch(() => {});
        } else {
          audioRef.current.pause();
        }
      }
      return { ...prev, isPlaying: nextPlaying };
    });
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState((prev) => ({ ...prev, currentTime: time }));
    }
  };

  const setVolume = (vol: number) => {
    setState((prev) => ({ ...prev, volume: Math.max(0, Math.min(1, vol)) }));
  };

  const toggleMute = () => {
    setState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handleNextTrack = () => {
    setState((prev) => {
      if (prev.queue.length === 0) {
        if (prev.repeatMode === 'one' && prev.currentTrack) {
          return { ...prev, currentTime: 0, isPlaying: true };
        }
        return { ...prev, isPlaying: false };
      }

      let nextIndex = prev.queueIndex + 1;
      if (nextIndex >= prev.queue.length) {
        if (prev.repeatMode === 'all') {
          nextIndex = 0;
        } else {
          return { ...prev, isPlaying: false };
        }
      }

      return {
        ...prev,
        queueIndex: nextIndex,
        currentTrack: prev.queue[nextIndex],
        currentTime: 0,
        isPlaying: true,
      };
    });
  };

  handleNextTrackRef.current = handleNextTrack;

  const nextTrack = () => {
    handleNextTrack();
  };

  const previousTrack = () => {
    setState((prev) => {
      if (prev.queue.length === 0) return prev;
      let prevIndex = prev.queueIndex - 1;
      if (prevIndex < 0) {
        if (prev.repeatMode === 'all') {
          prevIndex = prev.queue.length - 1;
        } else {
          prevIndex = 0;
        }
      }
      return {
        ...prev,
        queueIndex: prevIndex,
        currentTrack: prev.queue[prevIndex],
        currentTime: 0,
        isPlaying: true,
      };
    });
  };

  const addToQueue = (track: Track) => {
    setState((prev) => ({
      ...prev,
      queue: [...prev.queue, track],
    }));
  };

  const removeFromQueue = (index: number) => {
    setState((prev) => {
      const newQueue = [...prev.queue];
      newQueue.splice(index, 1);
      return {
        ...prev,
        queue: newQueue,
        queueIndex: index <= prev.queueIndex ? Math.max(0, prev.queueIndex - 1) : prev.queueIndex,
      };
    });
  };

  const clearQueue = () => {
    setState((prev) => ({
      ...prev,
      queue: [],
      queueIndex: 0,
    }));
  };

  const toggleShuffle = () => {
    setState((prev) => {
      if (!prev.isShuffled) {
        const shuffled = [...prev.queue].sort(() => Math.random() - 0.5);
        return {
          ...prev,
          queue: shuffled,
          isShuffled: true,
        };
      } else {
        return {
          ...prev,
          isShuffled: false,
        };
      }
    });
  };

  const toggleRepeat = () => {
    setState((prev) => ({
      ...prev,
      repeatMode: prev.repeatMode === 'none' ? 'all' : prev.repeatMode === 'all' ? 'one' : 'none',
    }));
  };

  const playQueue = (tracks: Track[], startIndex: number = 0) => {
    if (tracks.length === 0) return;
    playTrack(tracks[startIndex]);
    setState((prev) => ({
      ...prev,
      queue: tracks,
      queueIndex: startIndex,
      currentTrack: tracks[startIndex],
      isPlaying: true,
      currentTime: 0,
    }));
  };

  const shufflePlayQueue = (tracks: Track[]) => {
    if (tracks.length === 0) return;
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    playTrack(shuffled[0]);
    setState((prev) => ({
      ...prev,
      queue: shuffled,
      queueIndex: 0,
      currentTrack: shuffled[0],
      isPlaying: true,
      isShuffled: true,
      currentTime: 0,
    }));
  };

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        playTrack,
        pause,
        resume,
        togglePlay,
        seek,
        setVolume,
        toggleMute,
        nextTrack,
        previousTrack,
        addToQueue,
        removeFromQueue,
        clearQueue,
        toggleShuffle,
        toggleRepeat,
        playQueue,
        shufflePlayQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
