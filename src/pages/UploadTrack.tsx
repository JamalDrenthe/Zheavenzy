import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  Music,
  Image as ImageIcon,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTracks } from '@/context/TrackContext';
import { usePlayer } from '@/context/PlayerContext';
import { saveLocalAudioFile, saveLocalCoverImage } from '@/lib/audioStorage';
import { toast } from 'sonner';

const genres = [
  'Trap',
  'Hip Hop',
  'R&B',
  'Electronic',
  'Drill',
  'Afro-Fusion',
  'Hyperpop',
  'New Wave',
  'Boom Bap',
  'Pop',
  'Overig',
];

const licenses = [
  { value: 'all-rights-reserved', label: 'Alle rechten voorbehouden (All Rights Reserved)' },
  { value: 'cc-by', label: 'Creative Commons Naamsvermelding (CC BY)' },
  { value: 'cc-by-nc', label: 'Creative Commons Niet Commercieel (CC BY-NC)' },
  { value: 'public-domain', label: 'Publiek Domein' },
];

export default function UploadTrack() {
  const navigate = useNavigate();
  const { uploadTrack } = useTracks();
  const { playTrack } = usePlayer();

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('Jamal Drenthe');
  const [genre, setGenre] = useState('Trap');
  const [description, setDescription] = useState('');
  const [bpm, setBpm] = useState('130');
  const [musicalKey, setMusicalKey] = useState('C Minor');
  const [license, setLicense] = useState<'all-rights-reserved' | 'cc-by' | 'cc-by-nc' | 'public-domain'>('all-rights-reserved');
  const [isExplicit, setIsExplicit] = useState(false);
  const [audioDuration, setAudioDuration] = useState(180);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAudioSelect = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      toast.error('Kies een geldig audiobestand (WAV, MP3, FLAC of AAC)');
      return;
    }
    setAudioFile(file);
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName);
    }

    // Inspect audio duration
    const tempAudio = new Audio(URL.createObjectURL(file));
    tempAudio.onloadedmetadata = () => {
      if (tempAudio.duration && !isNaN(tempAudio.duration)) {
        setAudioDuration(Math.round(tempAudio.duration));
      }
    };
  };

  const handleCoverSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Kies een geldige afbeelding (JPG of PNG)');
      return;
    }
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) {
      toast.error('Voeg minimaal een audio master bestand toe');
      return;
    }
    if (!title.trim()) {
      toast.error('Vul een titel in voor deze track');
      return;
    }

    setIsSubmitting(true);
    try {
      const trackId = `track_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

      // 1. Save audio to IndexedDB
      const localAudioUrl = await saveLocalAudioFile(trackId, audioFile);

      // 2. Save cover image if provided
      let finalCoverUrl = 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=500&fit=crop';
      if (coverFile) {
        finalCoverUrl = await saveLocalCoverImage(trackId, coverFile);
      }

      const mins = Math.floor(audioDuration / 60);
      const secs = Math.floor(audioDuration % 60);
      const durationFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;

      // 3. Register track via TrackContext (syncs to Firestore & CRMos)
      const createdTrack = await uploadTrack({
        id: trackId,
        userId: 'jamal-drenthe',
        userName: artistName.trim() || 'Zheavenzy Artiest',
        title: title.trim(),
        description: description.trim() || `Nieuwe release van ${artistName.trim()}`,
        genre,
        tags: [genre.toLowerCase(), 'zheavenzy', 'release'],
        duration: audioDuration,
        durationFormatted,
        audioUrl: localAudioUrl,
        coverUrl: finalCoverUrl,
        isPrivate: false,
        isExplicit,
        license: license as any,
        bpm: Number(bpm) || 120,
        musicalKey,
      });

      // Play immediately
      playTrack(createdTrack);
      toast.success('Track geregistreerd en playback gestart!');
      navigate('/app');
    } catch (err) {
      console.error(err);
      toast.error('Er is een fout opgetreden bij het uploaden');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-36">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar Music App
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <UploadCloud className="w-8 h-8 text-[#D4AF37]" />
            Upload Master & Audio Release
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Lever je track aan in hoge resolutie. Zheavenzy koppelt je release direct aan de streaming speler en Firestore.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Audio Upload Dropzone */}
          <div className="p-8 rounded-3xl bg-neutral-900/60 border-2 border-dashed border-white/15 hover:border-[#D4AF37]/60 transition-all text-center relative group">
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleAudioSelect(e.target.files[0])}
            />

            {audioFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">{audioFile.name}</p>
                  <p className="text-xs text-white/50">
                    {(audioFile.size / (1024 * 1024)).toFixed(2)} MB • {audioDuration} seconden
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => audioInputRef.current?.click()}
                  className="border-white/10 text-xs rounded-xl"
                >
                  Ander bestand kiezen
                </Button>
              </div>
            ) : (
              <div
                onClick={() => audioInputRef.current?.click()}
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Music className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">Sleep je master audiobestand hierheen</p>
                  <p className="text-xs text-white/50 mt-1">WAV, FLAC, AIFF of MP3 (ongecomprimeerd aanbevolen)</p>
                </div>
                <Button
                  type="button"
                  className="bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-semibold text-xs rounded-xl mt-2"
                >
                  Blader door bestanden
                </Button>
              </div>
            )}
          </div>

          {/* Artwork & Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cover Upload */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-white/80">Artwork / Cover</Label>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleCoverSelect(e.target.files[0])}
              />
              <div
                onClick={() => coverInputRef.current?.click()}
                className="w-full aspect-square rounded-2xl border border-white/15 overflow-hidden bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] transition-all relative group"
              >
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-semibold transition-opacity">
                      Wijzig afbeelding
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 text-white/40 mx-auto mb-2 group-hover:text-[#D4AF37] transition-colors" />
                    <p className="text-xs font-medium text-white/60">Upload artwork</p>
                    <p className="text-[10px] text-white/40 mt-1">3000 x 3000 px aanbevolen</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Titel van de track</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Bijvoorbeeld: Astral Waves"
                    className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#D4AF37]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Artiest / Uitvoerende</Label>
                  <Input
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="Jamal Drenthe"
                    className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#D4AF37]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Genre</Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111115] border-white/10 text-white">
                      {genres.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Tempo (BPM)</Label>
                  <Input
                    type="number"
                    value={bpm}
                    onChange={(e) => setBpm(e.target.value)}
                    placeholder="130"
                    className="bg-white/5 border-white/10 text-white rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Toonsoort</Label>
                  <Input
                    value={musicalKey}
                    onChange={(e) => setMusicalKey(e.target.value)}
                    placeholder="C Minor"
                    className="bg-white/5 border-white/10 text-white rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white/80">Omschrijving & Credits</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Korte beschrijving van de track, gebruikte instrumenten, credits en visie..."
                  className="bg-white/5 border-white/10 text-white rounded-xl h-24"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white/80">Rechten & Licentie</Label>
                <Select value={license} onValueChange={(val: any) => setLicense(val)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111115] border-white/10 text-white">
                    {licenses.map((lic) => (
                      <SelectItem key={lic.value} value={lic.value}>
                        {lic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <div>
                  <p className="text-xs font-semibold text-white">Expliciete inhoud</p>
                  <p className="text-[11px] text-white/50">Bevat deze track expliciet taalgebruik</p>
                </div>
                <Switch checked={isExplicit} onCheckedChange={setIsExplicit} />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Directe rechtenbescherming via Zheavenzy</span>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !audioFile}
              className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:opacity-95 text-black font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
            >
              {isSubmitting ? 'Bezig met verwerken...' : 'Publiceer naar Zheavenzy'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
