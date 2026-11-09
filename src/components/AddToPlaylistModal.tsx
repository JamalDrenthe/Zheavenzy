import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check, ListMusic } from 'lucide-react';
import { usePlaylist } from '@/context/PlaylistContext';
import { TrackCover } from '@/components/TrackCover';

export function AddToPlaylistModal() {
  const {
    selectedTrackForPlaylist,
    closeAddToPlaylistModal,
    playlists,
    createPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    isTrackInPlaylist,
  } = usePlaylist();

  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!selectedTrackForPlaylist) return null;

  const handleCreateAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createPlaylist(newTitle.trim(), '', true, [selectedTrackForPlaylist.id]);
    setNewTitle('');
    setIsCreating(false);
  };

  return (
    <Dialog open={!!selectedTrackForPlaylist} onOpenChange={(open) => !open && closeAddToPlaylistModal()}>
      <DialogContent className="sm:max-w-md bg-[#0e0e11]/98 backdrop-blur-2xl border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-semibold flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-[#D4AF37]" />
            Toevoegen aan afspeellijst
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 my-2">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <TrackCover track={selectedTrackForPlaylist} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{selectedTrackForPlaylist.title}</p>
            <p className="text-xs text-white/50 truncate">{selectedTrackForPlaylist.userName || 'Zheavenzy'}</p>
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {playlists.map((pl) => {
            const inList = isTrackInPlaylist(pl.id, selectedTrackForPlaylist.id);
            return (
              <div
                key={pl.id}
                onClick={() => {
                  if (inList) {
                    removeTrackFromPlaylist(pl.id, selectedTrackForPlaylist.id);
                  } else {
                    addTrackToPlaylist(pl.id, selectedTrackForPlaylist.id);
                  }
                }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                  inList
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-white'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] text-white/80'
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{pl.title}</p>
                  <p className="text-xs text-white/40">{pl.tracksCount || 0} nummers</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    inList
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                      : 'border-white/20 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            );
          })}
        </div>

        {isCreating ? (
          <form onSubmit={handleCreateAndAdd} className="mt-3 flex gap-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Naam van nieuwe lijst..."
              className="bg-white/5 border-white/10 text-white focus:border-[#D4AF37]"
              autoFocus
            />
            <Button
              type="submit"
              className="bg-[#D4AF37] text-black font-semibold hover:bg-[#F3E5AB]"
            >
              Maak
            </Button>
          </form>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsCreating(true)}
            className="w-full mt-3 border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            Nieuwe afspeellijst maken
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
