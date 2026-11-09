import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { deleteLocalAudioFile } from '@/lib/audioStorage';
import { zheavenzyTracks, getTrackById as getCatalogTrackById } from '@/data/audioCatalog';
import { logCRMosActivity } from '@/lib/crmos';
import type { Track } from '@/types';
import { toast } from 'sonner';

interface TrackContextType {
  tracks: Track[];
  userTracks: Track[];
  getUserTracks: (userId: string) => Track[];
  getTrackById: (trackId: string) => Track | undefined;
  incrementPlaysCount: (trackId: string) => void;
  likeTrack: (trackId: string) => void;
  uploadTrack: (
    data: Partial<Pick<Track, 'id'>> &
      Omit<
        Track,
        | 'id'
        | 'createdAt'
        | 'updatedAt'
        | 'playsCount'
        | 'likesCount'
        | 'repostsCount'
        | 'commentsCount'
      >
  ) => Promise<Track>;
  deleteTrack: (trackId: string) => Promise<void>;
  isLoadingTracks: boolean;
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export function TrackProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>(() => {
    try {
      const saved =
        typeof window !== 'undefined'
          ? localStorage.getItem('zheavenzy_tracks') || localStorage.getItem('cloudiaudi_tracks')
          : null;
      if (saved) {
        const parsed = JSON.parse(saved) as Track[];
        const merged = [...parsed];
        for (const mt of zheavenzyTracks) {
          if (!merged.some((t) => t.id === mt.id)) {
            merged.push(mt);
          }
        }
        return merged;
      }
    } catch {
      // Ignore
    }
    return zheavenzyTracks;
  });

  const [isLoadingTracks, setIsLoadingTracks] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('zheavenzy_tracks', JSON.stringify(tracks));
      } catch (e) {
        console.warn('LocalStorage limit reached:', e);
      }
    }
  }, [tracks]);

  // Listen to track play events
  useEffect(() => {
    const handleTrackPlayed = (e: Event) => {
      const custom = e as CustomEvent<{ trackId: string }>;
      if (custom.detail?.trackId) {
        incrementPlaysCount(custom.detail.trackId);
      }
    };
    window.addEventListener('zheavenzy:track_played', handleTrackPlayed);
    return () => window.removeEventListener('zheavenzy:track_played', handleTrackPlayed);
  }, []);

  // Real-time Firestore sync for tracks
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'tracks'),
        (snapshot) => {
          const firestoreTracks: Track[] = [];
          snapshot.forEach((d) => {
            firestoreTracks.push(d.data() as Track);
          });

          if (firestoreTracks.length > 0) {
            setTracks((prev) => {
              const combined = [...firestoreTracks];
              for (const item of prev) {
                if (!combined.some((t) => t.id === item.id)) {
                  combined.push(item);
                }
              }
              return combined;
            });
          }
          setIsLoadingTracks(false);
        },
        (error) => {
          console.warn('Firestore tracks listener notice:', error);
          setIsLoadingTracks(false);
        }
      );

      return () => unsubscribe();
    } catch {
      setIsLoadingTracks(false);
    }
  }, []);

  const incrementPlaysCount = async (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) =>
        t.id === trackId ? { ...t, playsCount: (t.playsCount || 0) + 1 } : t
      )
    );

    try {
      const trackRef = doc(db, 'tracks', trackId);
      await updateDoc(trackRef, {
        playsCount: increment(1),
      });
    } catch {
      // Offline fallback
    }
  };

  const likeTrack = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const isLiked = !t.isLiked;
          return {
            ...t,
            isLiked,
            likesCount: isLiked ? t.likesCount + 1 : Math.max(0, t.likesCount - 1),
          };
        }
        return t;
      })
    );
  };

  const getUserTracks = (userId: string) => {
    return tracks.filter((t) => t.userId === userId);
  };

  const getTrackById = (trackId: string) => {
    return tracks.find((t) => t.id === trackId) || getCatalogTrackById(trackId);
  };

  const uploadTrack = async (
    data: Partial<Pick<Track, 'id'>> &
      Omit<
        Track,
        | 'id'
        | 'createdAt'
        | 'updatedAt'
        | 'playsCount'
        | 'likesCount'
        | 'repostsCount'
        | 'commentsCount'
      >
  ): Promise<Track> => {
    const trackId = data.id || `track_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

    const newTrack: Track = {
      ...data,
      id: trackId,
      createdAt: now,
      updatedAt: now,
      playsCount: 0,
      likesCount: 0,
      repostsCount: 0,
      commentsCount: 0,
    };

    setTracks((prev) => [newTrack, ...prev]);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'tracks', trackId), newTrack);
      await setDoc(doc(db, 'uploads', trackId), {
        title: newTrack.title,
        genre: newTrack.genre,
        userId: newTrack.userId,
        userName: newTrack.userName || 'Lid',
        credits: 250,
        type: 'audio',
        createdAt: now,
      });

      // Notify CRMos of creative upload
      logCRMosActivity({
        title: `Nieuwe audio release geüpload: ${newTrack.title}`,
        description: `Track ${newTrack.title} (${newTrack.genre}) geüpload door ${newTrack.userName || 'Lid'}.`,
        type: 'note',
        performed_by: 'Zheavenzy Music Engine',
      }).catch(() => {});
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }

    toast.success('Track succesvol toegevoegd aan Zheavenzy!');
    return newTrack;
  };

  const deleteTrack = async (trackId: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== trackId));
    await deleteLocalAudioFile(trackId);

    try {
      await deleteDoc(doc(db, 'tracks', trackId));
    } catch {
      // Ignore
    }
    toast.success('Track verwijderd');
  };

  return (
    <TrackContext.Provider
      value={{
        tracks,
        userTracks: tracks.filter((t) => t.userId === 'jamal-drenthe' || t.userId === 'current_user'),
        getUserTracks,
        getTrackById,
        incrementPlaysCount,
        likeTrack,
        uploadTrack,
        deleteTrack,
        isLoadingTracks,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
}

export function useTracks() {
  const context = useContext(TrackContext);
  if (context === undefined) {
    throw new Error('useTracks must be used within a TrackProvider');
  }
  return context;
}
