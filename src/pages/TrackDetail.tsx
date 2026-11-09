import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Heart,
  Share2,
  ListMusic,
  Download,
  Clock,
  ArrowLeft,
  MessageSquare,
  Send,
  Shield,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useTracks } from '@/context/TrackContext';
import { usePlayer } from '@/context/PlayerContext';
import { usePlaylist } from '@/context/PlaylistContext';
import { getArtistById } from '@/data/audioCatalog';
import { Waveform } from '@/components/Waveform';
import { TrackCover } from '@/components/TrackCover';
import { ShareTrackModal } from '@/components/ShareTrackModal';
import { getLocalAudioUrl } from '@/lib/audioStorage';
import { generateTrackAudio } from '@/lib/audioSynthesizer';
import { toast } from 'sonner';

interface TrackComment {
  id: string;
  name: string;
  text: string;
  time: string;
}

export default function TrackDetail() {
  const { id } = useParams<{ id: string }>();
  const { getTrackById, likeTrack } = useTracks();
  const { currentTrack, isPlaying, playTrack, togglePlay, seek, currentTime, duration } = usePlayer();
  const { openAddToPlaylistModal } = usePlaylist();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<TrackComment[]>([
    {
      id: 'c1',
      name: 'Kai Bernhard',
      text: 'Diepe 808s en kraakheldere mix, perfecte studio sound!',
      time: '2 uur geleden',
    },
    {
      id: 'c2',
      name: 'Sana El Idrissi',
      text: 'Het artwork sluit naadloos aan bij deze sfeer.',
      time: '1 dag geleden',
    },
  ]);

  const track = id ? getTrackById(id) : undefined;

  if (!track) {
    return (
      <div className="min-h-screen bg-[#070709] text-white pt-32 pb-36 px-4 text-center">
        <h2 className="text-2xl font-bold">Track niet gevonden</h2>
        <Link to="/app" className="text-[#D4AF37] hover:underline mt-4 inline-block">
          Terug naar de Music App
        </Link>
      </div>
    );
  }

  const isCurrent = currentTrack?.id === track.id;
  const isCurrentPlaying = isCurrent && isPlaying;
  const artist = getArtistById(track.userId);

  const handleDownload = async () => {
    try {
      const localUrl = await getLocalAudioUrl(track.id);
      let downloadUrl = localUrl || track.audioUrl;
      if (!downloadUrl) {
        downloadUrl = await generateTrackAudio(track);
      }
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${track.title}.wav`;
      link.click();
      toast.success(`Download gestart voor ${track.title}`);
    } catch {
      toast.error('Download mislukt');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setComments((prev) => [
      {
        id: `c_${Date.now()}`,
        name: 'Jamal Drenthe',
        text: commentInput.trim(),
        time: 'Zojuist',
      },
      ...prev,
    ]);
    setCommentInput('');
    toast.success('Reactie geplaatst');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-36">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar overzicht
        </Link>

        {/* Hero Track Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-neutral-900/60 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-2xl flex-shrink-0 bg-black/60">
              <TrackCover track={track} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge className="bg-[#D4AF37] text-black font-bold uppercase text-[10px]">
                  {track.genre}
                </Badge>
                {track.bpm && (
                  <Badge variant="outline" className="border-white/10 text-white/70 text-[10px]">
                    {track.bpm} BPM
                  </Badge>
                )}
                {track.musicalKey && (
                  <Badge variant="outline" className="border-white/10 text-white/70 text-[10px]">
                    {track.musicalKey}
                  </Badge>
                )}
                {track.isExplicit && (
                  <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px]">
                    Explicit
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {track.title}
              </h1>
              <p className="text-sm sm:text-base text-white/70 mt-1">
                {artist?.displayName || track.userName || 'Zheavenzy'}
              </p>

              <div className="flex items-center gap-4 text-xs text-white/50 mt-3 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {track.durationFormatted}
                </span>
                <span>•</span>
                <span>{(track.playsCount || 0).toLocaleString()} streams</span>
                <span>•</span>
                <span>{track.likesCount || 0} likes</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6 flex-wrap">
                <Button
                  onClick={() => {
                    if (isCurrentPlaying) {
                      togglePlay();
                    } else {
                      playTrack(track);
                    }
                  }}
                  className="bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg"
                >
                  {isCurrentPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-black" />
                      <span>Pauzeren</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                      <span>Afspelen</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => likeTrack(track.id)}
                  className="border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${
                      track.isLiked ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white'
                    }`}
                  />
                  <span>{track.isLiked ? 'Vind ik leuk' : 'Like'}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => openAddToPlaylistModal(track)}
                  className="border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                >
                  <ListMusic className="w-4 h-4 mr-2 text-[#D4AF37]" />
                  <span>Afspeellijst</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShareModalOpen(true)}
                  className="border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  <span>Delen</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2 text-[#D4AF37]" />
                  <span>Download Master</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Interactive Full-Width Waveform */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-white/50 mb-2">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#D4AF37]" />
                Waveform Master Analyse
              </span>
              <span className="font-mono text-[#D4AF37]">
                {isCurrent ? `${Math.floor(currentTime)}s / ${Math.floor(duration || track.duration)}s` : track.durationFormatted}
              </span>
            </div>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
              <Waveform
                track={track}
                currentTime={isCurrent ? currentTime : 0}
                duration={isCurrent ? duration : track.duration}
                isPlaying={isCurrentPlaying}
                onSeek={isCurrent ? seek : (t) => { playTrack(track); seek(t); }}
                variant="hero"
                className="h-16"
              />
            </div>
          </div>
        </div>

        {/* Details & Artist Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Left: Description & Comments */}
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10">
              <h3 className="text-base font-bold text-white mb-2">Over deze release</h3>
              <p className="text-sm text-white/70 leading-relaxed">{track.description}</p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-white/50">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span>Licentie: {track.license}</span>
              </div>
            </div>

            {/* Comments */}
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                Studio Reacties ({comments.length})
              </h3>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <Textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Laat een reactie of mix review achter..."
                  className="bg-white/5 border-white/10 text-white rounded-xl h-18 text-xs resize-none"
                />
                <Button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-semibold rounded-xl self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>

              <div className="space-y-3 pt-2">
                {comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#D4AF37]">{c.name}</span>
                      <span className="text-[10px] text-white/40">{c.time}</span>
                    </div>
                    <p className="text-xs text-white/80">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Artist Card */}
          {artist && (
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 h-fit space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-white/50">
                Artiest Profiel
              </h3>
              <div className="flex items-center gap-4">
                <img
                  src={artist.avatarUrl}
                  alt={artist.displayName}
                  className="w-16 h-16 rounded-2xl object-cover ring-1 ring-white/20"
                />
                <div>
                  <h4 className="text-base font-bold text-white">{artist.displayName}</h4>
                  <p className="text-xs text-white/50">{artist.genre}</p>
                  <p className="text-[11px] text-[#D4AF37] mt-0.5">
                    {artist.followersCount?.toLocaleString()} volgers
                  </p>
                </div>
              </div>

              <p className="text-xs text-white/70 leading-relaxed">{artist.bio}</p>

              <div className="pt-4 border-t border-white/5">
                <Link to="/diensten/artiesten">
                  <Button
                    variant="outline"
                    className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs rounded-xl"
                  >
                    Bekijk volledig roster
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <ShareTrackModal
        track={shareModalOpen ? track : null}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
}
