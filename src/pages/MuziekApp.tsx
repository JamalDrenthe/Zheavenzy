import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  UploadCloud,
  Flame,
  Users,
  ListMusic,
  Heart,
  Share2,
  Clock,
  Sparkles,
  Search,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { usePlayer } from '@/context/PlayerContext';
import { useTracks } from '@/context/TrackContext';
import { usePlaylist } from '@/context/PlaylistContext';
import { zheavenzyArtists, getArtistById } from '@/data/audioCatalog';
import { Waveform } from '@/components/Waveform';
import { TrackCover } from '@/components/TrackCover';
import { ShareTrackModal } from '@/components/ShareTrackModal';
import type { Track } from '@/types';

export default function MuziekApp() {
  const { currentTrack, isPlaying, playTrack, togglePlay, playQueue, shufflePlayQueue } = usePlayer();
  const { tracks, likeTrack } = useTracks();
  const { playlists, openAddToPlaylistModal } = usePlaylist();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Alle');
  const [shareTrackTarget, setShareTrackTarget] = useState<Track | null>(null);

  const genres = ['Alle', 'Trap', 'Hip Hop', 'R&B', 'Electronic', 'Drill', 'Hyperpop'];

  // Spotlight Track (featured at the top)
  const spotlightTrack = tracks[0] || null;
  const isSpotlightPlaying = isPlaying && currentTrack?.id === spotlightTrack?.id;

  const filteredTracks = useMemo(() => {
    return tracks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.genre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'Alle' || t.genre.toLowerCase() === selectedGenre.toLowerCase();
      return matchesSearch && matchesGenre;
    });
  }, [tracks, searchQuery, selectedGenre]);

  const trendingTracks = useMemo(() => {
    return [...tracks].sort((a, b) => (b.playsCount || 0) - (a.playsCount || 0));
  }, [tracks]);

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5" />
              <span>Zheavenzy Music App</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Studio Streaming & Catalogus
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-1">
              Ontdek de officiële releases, masters en beats van het Zheavenzy artiestenroster.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/app/upload">
              <Button className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-semibold hover:opacity-95 shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center gap-2">
                <UploadCloud className="w-4 h-4" />
                <span>Upload Master</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Spotlight Track */}
        {spotlightTrack && (
          <div className="my-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900/90 via-[#111115] to-black border border-white/15 p-6 sm:p-10 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
              {/* Cover */}
              <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-2xl flex-shrink-0 bg-black/60 relative group">
                <TrackCover track={spotlightTrack} className="w-full h-full object-cover" />
                <button
                  onClick={() => {
                    if (isSpotlightPlaying) {
                      togglePlay();
                    } else {
                      playTrack(spotlightTrack);
                    }
                  }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-xl">
                    {isSpotlightPlaying ? (
                      <Pause className="w-8 h-8 fill-black" />
                    ) : (
                      <Play className="w-8 h-8 fill-black ml-1" />
                    )}
                  </div>
                </button>
              </div>

              {/* Information & Waveform */}
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge className="bg-[#D4AF37] text-black font-bold uppercase text-[10px] tracking-wider">
                    Spotlight Release
                  </Badge>
                  <span className="text-xs text-white/50">{spotlightTrack.genre}</span>
                  <span className="text-xs text-white/30">•</span>
                  <span className="text-xs text-white/50">{spotlightTrack.durationFormatted}</span>
                  {spotlightTrack.bpm && (
                    <>
                      <span className="text-xs text-white/30">•</span>
                      <span className="text-xs text-white/50">{spotlightTrack.bpm} BPM</span>
                    </>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {spotlightTrack.title}
                </h2>
                <p className="text-sm text-white/70 mt-1 line-clamp-2 max-w-2xl">
                  {spotlightTrack.description}
                </p>

                {/* Hero Interactive Waveform */}
                <div className="mt-6 mb-4 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                  <Waveform
                    track={spotlightTrack}
                    currentTime={currentTrack?.id === spotlightTrack.id ? undefined : 0}
                    isPlaying={isSpotlightPlaying}
                    variant="hero"
                    className="h-14"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Button
                    onClick={() => {
                      if (isSpotlightPlaying) {
                        togglePlay();
                      } else {
                        playTrack(spotlightTrack);
                      }
                    }}
                    className="bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold px-6 flex items-center gap-2 rounded-xl"
                  >
                    {isSpotlightPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-black" />
                        <span>Pauzeren</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-black ml-0.5" />
                        <span>Nu Afspelen</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => playQueue(tracks, 0)}
                    className="border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                  >
                    <ListMusic className="w-4 h-4 mr-2 text-[#D4AF37]" />
                    Speel Roster Af
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => likeTrack(spotlightTrack.id)}
                    className="rounded-xl border border-white/10 hover:bg-white/10 text-white"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        spotlightTrack.isLiked ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white'
                      }`}
                    />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShareTrackTarget(spotlightTrack)}
                    className="rounded-xl border border-white/10 hover:bg-white/10 text-white"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Genre Filter Bar */}
        <div className="my-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek op track, artiest of genre..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl h-11 focus:border-[#D4AF37]"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedGenre === g
                      ? 'bg-[#D4AF37] text-black shadow-md'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tracks" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl mb-8 flex-wrap h-auto">
            <TabsTrigger
              value="tracks"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black rounded-xl font-semibold px-4 py-2 text-xs sm:text-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Alle Tracks ({filteredTracks.length})
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black rounded-xl font-semibold px-4 py-2 text-xs sm:text-sm"
            >
              <Flame className="w-4 h-4 mr-2" />
              Trending Top 10
            </TabsTrigger>
            <TabsTrigger
              value="artists"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black rounded-xl font-semibold px-4 py-2 text-xs sm:text-sm"
            >
              <Users className="w-4 h-4 mr-2" />
              Artiesten Roster
            </TabsTrigger>
            <TabsTrigger
              value="playlists"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black rounded-xl font-semibold px-4 py-2 text-xs sm:text-sm"
            >
              <ListMusic className="w-4 h-4 mr-2" />
              Afspeellijsten
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Tracks List */}
          <TabsContent value="tracks" className="space-y-3">
            {filteredTracks.length === 0 ? (
              <div className="text-center py-16 text-white/50">
                Geen tracks gevonden die voldoen aan je zoekcriteria.
              </div>
            ) : (
              filteredTracks.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;
                const isCurrentPlaying = isCurrent && isPlaying;
                const artist = getArtistById(track.userId);

                return (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02, duration: 0.3 }}
                    className={`flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06]'
                    }`}
                  >
                    {/* Index & Play button */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (isCurrentPlaying) {
                            togglePlay();
                          } else {
                            playTrack(track);
                          }
                        }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          isCurrentPlaying
                            ? 'bg-[#D4AF37] text-black shadow-lg scale-105'
                            : 'bg-white/10 text-white hover:bg-[#D4AF37] hover:text-black'
                        }`}
                      >
                        {isCurrentPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Cover */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10 flex-shrink-0 bg-black/50">
                        <TrackCover track={track} />
                      </div>

                      {/* Track info */}
                      <div className="min-w-0">
                        <Link
                          to={`/app/track/${track.id}`}
                          className={`text-sm font-semibold truncate hover:underline block ${
                            isCurrent ? 'text-[#D4AF37]' : 'text-white'
                          }`}
                        >
                          {track.title}
                        </Link>
                        <p className="text-xs text-white/50 truncate">
                          {artist?.displayName || track.userName || 'Zheavenzy'}
                        </p>
                      </div>
                    </div>

                    {/* Waveform preview (tablet/desktop) */}
                    <div className="hidden md:flex flex-1 max-w-xs mx-4">
                      <Waveform
                        track={track}
                        currentTime={isCurrent ? undefined : 0}
                        isPlaying={isCurrentPlaying}
                        variant="compact"
                        className="h-6 w-full"
                        interactive={false}
                      />
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                      <Badge className="bg-white/5 text-white/70 border border-white/10 hidden sm:inline-flex text-[11px]">
                        {track.genre}
                      </Badge>
                      <span className="text-xs font-mono text-white/50 flex items-center gap-1">
                        <Clock className="w-3 h-3 opacity-60" />
                        {track.durationFormatted}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => likeTrack(track.id)}
                        className="rounded-full text-white/50 hover:text-white"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            track.isLiked ? 'fill-[#D4AF37] text-[#D4AF37]' : ''
                          }`}
                        />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openAddToPlaylistModal(track)}
                        className="rounded-full text-white/50 hover:text-white hidden sm:flex"
                        title="Toevoegen aan afspeellijst"
                      >
                        <ListMusic className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setShareTrackTarget(track)}
                        className="rounded-full text-white/50 hover:text-white"
                        title="Delen"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </TabsContent>

          {/* Tab 2: Trending Top 10 */}
          <TabsContent value="trending" className="space-y-3">
            {trendingTracks.slice(0, 10).map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              const isCurrentPlaying = isCurrent && isPlaying;
              return (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-[#D4AF37] w-6 text-center">
                      {idx + 1}
                    </span>
                    <button
                      onClick={() => {
                        if (isCurrentPlaying) {
                          togglePlay();
                        } else {
                          playTrack(track);
                        }
                      }}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-all text-white"
                    >
                      {isCurrentPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10 flex-shrink-0">
                      <TrackCover track={track} />
                    </div>
                    <div>
                      <Link
                        to={`/app/track/${track.id}`}
                        className="text-sm font-semibold text-white hover:underline block"
                      >
                        {track.title}
                      </Link>
                      <p className="text-xs text-white/50">{track.userName || 'Zheavenzy'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-semibold text-[#D4AF37]">
                        {(track.playsCount || 0).toLocaleString()} streams
                      </p>
                      <p className="text-[11px] text-white/40">{track.likesCount || 0} likes</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openAddToPlaylistModal(track)}
                      className="rounded-full text-white/50 hover:text-white"
                    >
                      <ListMusic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* Tab 3: Artiesten Roster */}
          <TabsContent value="artists" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {zheavenzyArtists.map((artist) => {
              const artistTracks = tracks.filter((t) => t.userId === artist.id);
              return (
                <div
                  key={artist.id}
                  className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-[#D4AF37]/50 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={artist.avatarUrl}
                        alt={artist.displayName}
                        className="w-16 h-16 rounded-2xl object-cover ring-1 ring-white/20 group-hover:ring-[#D4AF37] transition-all"
                      />
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                          {artist.displayName}
                        </h3>
                        <p className="text-xs text-white/50">{artist.genre}</p>
                        <p className="text-[11px] text-[#D4AF37] mt-0.5">
                          {artist.followersCount?.toLocaleString()} volgers
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-white/70 line-clamp-3 mb-4 leading-relaxed">
                      {artist.bio}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-white/40">{artistTracks.length} tracks</span>
                    {artistTracks.length > 0 && (
                      <Button
                        size="sm"
                        onClick={() => playQueue(artistTracks, 0)}
                        className="bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/30 text-xs font-semibold rounded-xl"
                      >
                        <Play className="w-3.5 h-3.5 mr-1 fill-current" />
                        Speel Tracks
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* Tab 4: Afspeellijsten */}
          <TabsContent value="playlists" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((pl) => {
              const plTracks = tracks.filter((t) => (pl.trackIds || []).includes(t.id));
              return (
                <div
                  key={pl.id}
                  className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-[#D4AF37]/50 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full aspect-video rounded-2xl overflow-hidden mb-4 relative ring-1 ring-white/15">
                      <img
                        src={pl.coverUrl}
                        alt={pl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={() => playQueue(plTracks, 0)}
                        className="absolute bottom-3 right-3 w-12 h-12 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                      >
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                      {pl.title}
                    </h3>
                    <p className="text-xs text-white/60 mt-1 line-clamp-2">
                      {pl.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                    <span>{pl.tracksCount || plTracks.length} nummers</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shufflePlayQueue(plTracks)}
                      className="text-xs text-[#D4AF37] hover:text-white"
                    >
                      Shuffle
                    </Button>
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>

      {/* Share Track Modal */}
      <ShareTrackModal
        track={shareTrackTarget}
        onClose={() => setShareTrackTarget(null)}
      />
    </div>
  );
}
