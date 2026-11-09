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
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { zheavenzyPlaylists } from '@/data/audioCatalog';
import { useTracks } from '@/context/TrackContext';
import type { Playlist, Track } from '@/types';
import { toast } from 'sonner';

interface PlaylistContextType {
  playlists: Playlist[];
  userPlaylists: Playlist[];
  createPlaylist: (
    title: string,
    description?: string,
    isPublic?: boolean,
    initialTrackIds?: string[],
    coverUrl?: string
  ) => Promise<Playlist>;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  isTrackInPlaylist: (playlistId: string, trackId: string) => boolean;
  getPlaylistById: (playlistId: string) => Playlist | undefined;
  getTracksForPlaylist: (playlist: Playlist) => Track[];
  selectedTrackForPlaylist: Track | null;
  openAddToPlaylistModal: (track: Track) => void;
  closeAddToPlaylistModal: () => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const { tracks } = useTracks();

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved =
        typeof window !== 'undefined'
          ? localStorage.getItem('zheavenzy_playlists') || localStorage.getItem('cloudiaudi_playlists')
          : null;
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return zheavenzyPlaylists;
  });

  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] = useState<Track | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('zheavenzy_playlists', JSON.stringify(playlists));
      } catch (e) {
        console.warn('LocalStorage warning:', e);
      }
    }
  }, [playlists]);

  // Real-time Firestore sync
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'playlists'),
        (snapshot) => {
          const firestorePlaylists: Playlist[] = [];
          snapshot.forEach((d) => {
            firestorePlaylists.push(d.data() as Playlist);
          });

          if (firestorePlaylists.length > 0) {
            setPlaylists((prev) => {
              const combined = [...firestorePlaylists];
              for (const p of prev) {
                if (!combined.some((item) => item.id === p.id)) {
                  combined.push(p);
                }
              }
              return combined;
            });
          }
        },
        () => {}
      );
      return () => unsubscribe();
    } catch {
      // Offline fallback
    }
  }, []);

  const createPlaylist = async (
    title: string,
    description: string = '',
    isPublic: boolean = true,
    initialTrackIds: string[] = [],
    coverUrl?: string
  ): Promise<Playlist> => {
    const id = `pl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const newPlaylist: Playlist = {
      id,
      userId: 'current_user',
      title,
      description,
      isPublic,
      coverUrl:
        coverUrl ||
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop',
      type: 'playlist',
      tracksCount: initialTrackIds.length,
      trackIds: initialTrackIds,
      createdAt: now,
      updatedAt: now,
    };

    setPlaylists((prev) => [newPlaylist, ...prev]);

    try {
      await setDoc(doc(db, 'playlists', id), newPlaylist);
    } catch {
      // Offline fallback
    }

    toast.success('Afspeellijst aangemaakt');
    return newPlaylist;
  };

  const updatePlaylist = async (playlistId: string, updates: Partial<Playlist>) => {
    const now = new Date().toISOString();
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, ...updates, updatedAt: now } : p))
    );

    try {
      await updateDoc(doc(db, 'playlists', playlistId), { ...updates, updatedAt: now });
    } catch {
      // Offline fallback
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    try {
      await deleteDoc(doc(db, 'playlists', playlistId));
    } catch {
      // Offline fallback
    }
    toast.success('Afspeellijst verwijderd');
  };

  const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
    const pl = playlists.find((p) => p.id === playlistId);
    if (!pl) return;

    const currentTrackIds = pl.trackIds || [];
    if (currentTrackIds.includes(trackId)) {
      toast.info('Track staat al in deze afspeellijst');
      return;
    }

    const updatedTrackIds = [...currentTrackIds, trackId];
    await updatePlaylist(playlistId, {
      trackIds: updatedTrackIds,
      tracksCount: updatedTrackIds.length,
    });
    toast.success('Toegevoegd aan afspeellijst');
  };

  const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    const pl = playlists.find((p) => p.id === playlistId);
    if (!pl) return;

    const updatedTrackIds = (pl.trackIds || []).filter((id) => id !== trackId);
    await updatePlaylist(playlistId, {
      trackIds: updatedTrackIds,
      tracksCount: updatedTrackIds.length,
    });
    toast.success('Verwijderd uit afspeellijst');
  };

  const isTrackInPlaylist = (playlistId: string, trackId: string): boolean => {
    const pl = playlists.find((p) => p.id === playlistId);
    return pl ? (pl.trackIds || []).includes(trackId) : false;
  };

  const getPlaylistById = (playlistId: string) => {
    return playlists.find((p) => p.id === playlistId);
  };

  const getTracksForPlaylist = (playlist: Playlist): Track[] => {
    if (!playlist.trackIds || playlist.trackIds.length === 0) return [];
    return playlist.trackIds
      .map((id) => tracks.find((t) => t.id === id))
      .filter((t): t is Track => t !== undefined);
  };

  const openAddToPlaylistModal = (track: Track) => {
    setSelectedTrackForPlaylist(track);
  };

  const closeAddToPlaylistModal = () => {
    setSelectedTrackForPlaylist(null);
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        userPlaylists: playlists,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        isTrackInPlaylist,
        getPlaylistById,
        getTracksForPlaylist,
        selectedTrackForPlaylist,
        openAddToPlaylistModal,
        closeAddToPlaylistModal,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
}
